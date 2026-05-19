class GameScene extends Phaser.Scene {
 
  constructor() {
    super({ key: "GameScene" });
 
    // Variáveis de estado internas (reiniciadas em cada create)
    this.player         = null;  // sprite do jogador
    this.platforms      = null;  // grupo de plataformas
    this.enemies        = null;  // grupo de inimigos
    this.coins          = null;  // grupo de moedas
    this.spikes         = null;  // grupo de espinhos
    this.cursors        = null;  // teclas de direção
    this.spaceKey       = null;  // tecla de espaço (salto extra)
    this.isAlive        = true;  // flag para bloquear input quando morto
    this.coinCount      = 0;     // moedas apanhadas neste nível
    this.totalCoins     = 10;    // moedas necessárias para ganhar (nível 1)
    this.audioCtx       = null;  // contexto Web Audio (criado no 1º som)
  }
  create() {
    // Lê o nível atual do registry global
    this.currentLevel = this.registry.get("level") || 1;
    this.isAlive      = true;
    this.coinCount    = 0;
 
    // Imagem de Fundo
    this.add.image(400, 250, "background");
 
    // Câmara segue o jogador
    // O mundo tem 1600px de largura, o canvas apenas 800px
    this.cameras.main.setBounds(0, 0, 1600, 500);
    this.physics.world.setBounds(0, 0, 1600, 500);
 
    // Criar elementos do nível
    this._criarPlataformas();
    this._criarEspinhos();
    this._criarMoedas();
    this._criarInimigos();
    this._criarJogador();
    this._criarBandeira();
    this._criarHUD();
    this._configurarFisica();
    this._configurarInput();
 
    // Câmara segue o jogador (com lerp suave)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
 
    // Tecla R — reiniciar imediatamente
    this.input.keyboard.on("keydown-R", () => {
      this.registry.set("score", 0);
      this.registry.set("lives", 3);
      this.registry.set("level", 1);
      this.scene.restart();
    });
 
    // Tecla M — voltar ao menu
    this.input.keyboard.on("keydown-M", () => {
      this.scene.start("MenuScene");
    });
  }
  update() {
    // Não processa input se o jogador está morto
    if (!this.isAlive) return;
 
    this._moverJogador();
    this._atualizarInimigos();
    this._verificarQueda();
    this._atualizarHUD();
  }

    _criarPlataformas() {
    this.platforms = this.physics.add.staticGroup();
 
    // Definição do mapa: [x, y, largura] de cada plataforma
    // As coordenadas são em píxeis, contando do canto superior esquerdo
    const layout = [
      // Chão principal (dividido em blocos para ter buracos)
      [0, 480, 300], [400, 480, 300], [800, 480, 200], [1100, 480, 500],
 
      // Plataformas flutuantes — nível 1 (simples)
      [150, 380, 128], [350, 300, 128], [550, 380, 96],
      [720, 280, 128], [900, 360, 96],  [1050, 260, 128],
      [1200, 340, 96], [1350, 240, 128],[1480, 320, 128],
 
      // Plataformas mais altas (caminho alternativo)
      [250, 220, 96],  [450, 160, 96],  [650, 200, 64],
      [850, 160, 96],  [1000, 120, 96], [1150, 180, 64],
    ];
 
    layout.forEach(([x, y, largura]) => {
      // Cria múltiplos tiles para preencher a largura
      const tiles = Math.floor(largura / 32);
      for (let i = 0; i < tiles; i++) {
        this.platforms.create(x + i * 32 + 16, y, "platform");
      }
    });
  }

_criarEspinhos() {
    this.spikes = this.physics.add.staticGroup();
 
    // Posições dos espinhos [x, y]
    const posicoes = [
      [320, 466], [340, 466], [360, 466],  // buraco no chão
      [680, 466], [700, 466],               // segundo buraco
      [500, 366], [520, 366],               // em cima de plataforma
      [960, 346], [980, 346],
    ];
 
    posicoes.forEach(([x, y]) => {
      const s = this.spikes.create(x, y, "spike");
      // Reduz hitbox para ser mais justo com o jogador
      s.setSize(16, 14).setOffset(2, 6);
    });
  }
 
  _criarMoedas() {
    this.coins = this.physics.add.staticGroup();
 
    // Moedas espalhadas pelo mapa [x, y]
    const posicoes = [
      // Chão inicial
      [100, 455], [200, 455],
      // Plataformas
      [170, 355], [380, 275], [570, 355],
      [740, 255], [920, 335], [1070, 235],
      [1220, 315],[1370, 215],[1500, 295],
      // Caminho alto (bónus)
      [270, 195], [470, 135], [670, 175],
      [870, 135], [1020, 95], [1170, 155],
    ];
 
    // Total de moedas neste nível = quantas criámos
    this.totalCoins = posicoes.length;
 
    posicoes.forEach(([x, y]) => {
      const coin = this.coins.create(x, y, "coin");
      coin.setSize(18, 18); // hitbox ligeiramente menor que o sprite
 
      // Animação de flutuação na moeda (tween)
      this.tweens.add({
        targets: coin,
        y: y - 8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Phaser.Math.Between(0, 600) // offset para ficarem desfasadas
      });
    });
  }

  _criarInimigos() {
    this.enemies = this.physics.add.group();
 
    // Definição dos inimigos: [x, y, velocidade, limiteEsq, limiteDir]
    const config = [
      [180, 340, 60,  120, 240],  // plataforma baixa
      [380, 260, 80,  340, 490],  // plataforma média
      [750, 240, 70,  710, 870],  // área central
      [1070, 220, 90, 1030, 1160],// área de dificuldade
      [1370, 200, 100, 1330, 1490],// final
    ];
 
    config.forEach(([x, y, vel, limEsq, limDir]) => {
      const enemy = this.enemies.create(x, y, "enemy");
 
      // Inimigos não são afetados pela gravidade do mundo porque já têm a gravidade da física arcade por padrão
      enemy.setBounce(0);           // sem ricochete
      enemy.setCollideWorldBounds(false); // gere-se pelos limites custom
 
      // Guarda dados de patrulha no próprio objeto
      enemy.patrolLeft  = limEsq;  // limite esquerdo da patrulha
      enemy.patrolRight = limDir;  // limite direito da patrulha
      enemy.setVelocityX(vel);     // começa a mover para a direita
    });
  }

  _criarJogador() {
    // Posição inicial: acima do chão no início do nível
    this.player = this.physics.add.sprite(100, 420, "player");
 
    this.player.setBounce(0.1);            // pequeno ricochete ao pousar
    this.player.setCollideWorldBounds(true); // não sai do mundo
    this.player.setGravityY(0);            // usa a gravidade global (definida em main.js)
    this.player.setSize(26, 36);           // hitbox ligeiramente menor que o sprite
    this.player.setOffset(3, 4);           // centraliza hitbox no sprite
 
    // Propriedade custom: quantos saltos ainda pode fazer (double jump)
    this.player.jumpsLeft = 2;
  }

    _criarBandeira() {
    // A bandeira fica perto do fim do mapa
    this.flag = this.physics.add.staticImage(1560, 420, "flag");
    this.flag.setSize(20, 60);
  }

    _criarHUD() { 
    const style = { fontSize: "16px", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 };
 
    // Fundo semitransparente para os textos
    this.hudBg = this.add.rectangle(400, 18, 800, 34, 0x000033, 0.6)
      .setScrollFactor(0);
 
    // Pontuação
    this.scoreLabel = this.add.text(10, 5, t("score") + ":", style).setScrollFactor(0);
    this.scoreValue = this.add.text(80, 5, "0", { ...style, fill: "#ffdd44" }).setScrollFactor(0);
 
    // Vidas
    this.livesLabel = this.add.text(160, 5, t("lives") + ":", style).setScrollFactor(0);
    this.livesValue = this.add.text(220, 5, "❤❤❤", { ...style, fill: "#ff5555", fontSize: "14px" }).setScrollFactor(0);
 
    // Moedas
    this.coinsLabel = this.add.text(330, 5, t("coins") + ":", style).setScrollFactor(0);
    this.coinsValue = this.add.text(400, 5, "0 / " + this.totalCoins, { ...style, fill: "#ffdd00" }).setScrollFactor(0);
 
    // Nível
    this.levelLabel = this.add.text(520, 5, t("level") + ":", style).setScrollFactor(0);
    this.levelValue = this.add.text(570, 5, "" + this.currentLevel, { ...style, fill: "#88ffaa" }).setScrollFactor(0);
 
    // Dica de teclas (canto superior direito)
    this.add.text(620, 5, "R:reiniciar  M:menu", {
      fontSize: "11px", fill: "#aaaaaa"
    }).setScrollFactor(0);
  }

  _configurarFisica() {
    // collider: objetos colidem (param físico — empurram-se)
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
 
    // Inimigos não atravessam outros inimigos
    this.physics.add.collider(this.enemies, this.enemies);
 
    // overlap: detecta sobreposição mas NÃO cria reação física
    // É o método correto para apanhar moedas, tocar em inimigos, etc.
 
    // Jogador apanha moeda
    this.physics.add.overlap(
      this.player,
      this.coins,
      this._apanharMoeda,  // callback quando há overlap
      null,                 // processCallback (null = sempre ativa)
      this                  // contexto (this) para o callback
    );
 
    // Jogador toca em inimigo
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this._tocarInimigo,
      null,
      this
    );
 
    // Jogador toca em espinho
    this.physics.add.overlap(
      this.player,
      this.spikes,
      this._tocarEspinho,
      null,
      this
    );
 
    // Jogador alcança a bandeira
    this.physics.add.overlap(
      this.player,
      this.flag,
      this._alcancarBandeira,
      null,
      this
    );
  }

  _configurarInput() {
    // createCursorKeys() cria as 4 setas + shift + space
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 
    // Reset dos saltos quando o jogador pousa numa plataforma
    this.player.body.onFloor = true;
  }
 _moverJogador() {
    const onGround = this.player.body.blocked.down; // está no chão?
 
    // Repõe saltos quando toca no chão
    if (onGround) {
      this.player.jumpsLeft = 2;
    }
 
    // Movimento horizontal
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-220);   // move para a esquerda
      this.player.setFlipX(true);       // vira o sprite
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(220);    // move para a direita
      this.player.setFlipX(false);
    } else {
      // Sem input → desacelera (atrito)
      this.player.setVelocityX(0);
    }

    // Phaser.Input.Keyboard.JustDown garante que só ativa UMA VEZ
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
                     || Phaser.Input.Keyboard.JustDown(this.spaceKey);
 
    if (jumpPressed && this.player.jumpsLeft > 0) {
      this.player.setVelocityY(-520);  // impulso vertical (negativo = para cima)
      this.player.jumpsLeft--;          // gasta um salto
      this._tocarSom("jump");
    }
 
    // Efeito visual: escala ao saltar
    if (!onGround) {
      // No ar: estica um pouco verticalmente
      this.player.setScale(0.9, 1.1);
    } else {
      this.player.setScale(1, 1);
    }
  }

_atualizarInimigos() {
    this.enemies.children.entries.forEach(enemy => {
      const vel = enemy.body.velocity.x;
 
      // Inverte direção quando chega aos limites da patrulha
      if (enemy.x <= enemy.patrolLeft && vel < 0) {
        enemy.setVelocityX(-vel);       // inverte
        enemy.setFlipX(false);
      } else if (enemy.x >= enemy.patrolRight && vel > 0) {
        enemy.setVelocityX(-vel);       // inverte
        enemy.setFlipX(true);
      }
    });
  }

   _verificarQueda() {
    if (this.player.y > 520) {
      // Caiu para fora do mapa = morre
      this._jogadorMorre();
    }
  }

    _atualizarHUD() {
    const score = this.registry.get("score");
    const lives = this.registry.get("lives");
 
    this.scoreValue.setText("" + score);
    this.coinsValue.setText(this.coinCount + " / " + this.totalCoins);
 
    // Corações para mostrar vidas
    const hearts = "❤".repeat(Math.max(0, lives)) + "♡".repeat(Math.max(0, 3 - lives));
    this.livesValue.setText(hearts);
  }

  _apanharMoeda(player, coin) {

  }

  _tocarInimigo(player, enemy) {

  }

    _tocarEspinho() {

  }

  _alcancarBandeira() {

  }

  _jogadorMorre() {

  }

   _alcancarVitoria() {

  }

  _mostrarTextoFlutuante(x, y, mensagem, cor = "#ffffff") {

  }

  _tocarSom(tipo) {
    
}

}