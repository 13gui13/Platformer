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
    //this._criarBandeira();
    //this._criarHUD();
    //this._configurarFisica();
    //this._configurarInput();
 
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
 
    //this._moverJogador();
    //this._atualizarInimigos();
    //this._verificarQueda();
    //this._atualizarHUD();
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
 
  /** Cria o sprite do jogador */
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

}