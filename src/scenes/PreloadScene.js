class PreloadScene extends Phaser.Scene {

  constructor() {
    // Identifica esta cena no Phaser
    super({ key: "PreloadScene" });
  }

  preload() {
    // Barra de progresso
    // Mostra progresso enquanto os assets carregam
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Fundo da barra
    const bgBar = this.add.rectangle(cx, cy, 320, 30, 0x333355);
    // Barra de progresso (começa vazia)
    const bar = this.add.rectangle(cx - 160, cy, 0, 26, 0x88aaff);
    bar.setOrigin(0, 0.5);

    const loadText = this.add.text(cx, cy - 40, "A carregar...", {
      fontSize: "18px", fill: "#ffffff"
    }).setOrigin(0.5);

    // Evento disparado a cada asset carregado — atualiza a barra
    this.load.on("progress", (value) => {
      bar.width = 316 * value;  // 316 = largura máxima da barra
    });

    // Quando tudo estiver carregado
    this.load.on("complete", () => {
      loadText.setText("Pronto!");
    });

    //this.load.image("player", "assets/plankton.png");
    //this.load.image("coin", "assets/krabby.png");
    //this.load.image("inimigos", "assets/spongebob.png")
  }

  create() {
    // cria texturas atraves dos graficos do phaser
    this._criarTexturaJogador();
    this._criarTexturaPlataforma();
    this._criarTexturaMoeda();
    this._criarTexturaInimigo();
    this._criarTexturaFundo();
    this._criarTexturaEspinho();
    this._criarTexturaBandeira();
    this._criarSons();

    // Avançar para o menu
    this.scene.start("MenuScene");
  }

  _criarTexturaJogador() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Corpo
    g.fillStyle(0x4488ff);
    g.fillRoundedRect(0, 0, 32, 40, 6);

    // Olho esquerdo
    g.fillStyle(0xffffff);
    g.fillCircle(10, 14, 5);
    g.fillStyle(0x000044);
    g.fillCircle(11, 14, 3);

    // Olho direito
    g.fillStyle(0xffffff);
    g.fillCircle(22, 14, 5);
    g.fillStyle(0x000044);
    g.fillCircle(23, 14, 3);

    // Boca
    g.fillStyle(0xffffff);
    g.fillRect(10, 26, 12, 3);

    // Pés
    g.fillStyle(0x2244aa);
    g.fillRect(2, 34, 10, 6);
    g.fillRect(20, 34, 10, 6);

    g.generateTexture("player", 32, 40);
    g.destroy();
  }

_criarTexturaPlataforma(){
  const g = this.make.graphics({x: 0, y: 0, add:false});

  // Fundo da plataforma
  g.fillStyle(0x228833);
  g.fillRect(0, 0, 32, 16);

  // Relva
  g.fillStyle(0x44bb55);
  g.fillRect(0, 0, 32, 6);

  // Tijolos
  g.lineStyle(1, 0x115522, 0.5);
  g.strokeRect(0, 0, 32, 16);
  g.lineBetween(16, 6, 16, 16);
}

 _criarTexturaMoeda() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Sombra
    g.fillStyle(0xaa7700, 0.5);
    g.fillCircle(13, 13, 10);

    // Corpo da moeda
    g.fillStyle(0xffdd00);
    g.fillCircle(12, 12, 10);

    // Brilho
    g.fillStyle(0xffff88);
    g.fillCircle(9, 9, 4);

    // Símbolo "$"
    g.fillStyle(0xaa7700);
    g.fillRect(10, 6, 4, 12);
    g.fillRect(7, 9, 10, 3);
    g.fillRect(7, 14, 10, 3);

    g.generateTexture("coin", 24, 24);
    g.destroy();
 }

  _criarTexturaInimigo(){
  const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Corpo
    g.fillStyle(0xdd2222);
    g.fillRoundedRect(0, 0, 32, 28, 4);

    // Olhos brancos
    g.fillStyle(0xffffff);
    g.fillCircle(9, 11, 5);
    g.fillCircle(23, 11, 5);

    // Pupilas vermelhas escuras
    g.fillStyle(0x880000);
    g.fillCircle(10, 11, 3);
    g.fillCircle(24, 11, 3);

    // Sobrancelhas zangadas (linhas diagonais)
    g.lineStyle(3, 0x550000);
    g.lineBetween(5, 5, 13, 8);   // sobrancelha esquerda
    g.lineBetween(19, 8, 27, 5);  // sobrancelha direita

    // Boca zangada (arco para baixo)
    g.fillStyle(0x550000);
    g.fillRect(8, 20, 16, 3);

    // Pés
    g.fillStyle(0x880000);
    g.fillRect(2, 24, 9, 4);
    g.fillRect(21, 24, 9, 4);

    g.generateTexture("enemy", 32, 28);
    g.destroy();
}

  _criarTexturaFundo(){
  const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Céu
    const cores = [0x0a0a1e, 0x0d1030, 0x111545, 0x1a1f5e];
    const alturas = [0, 125, 250, 375];
    cores.forEach((cor, i) => {
      g.fillStyle(cor);
      g.fillRect(0, alturas[i], 800, 125);
    });

    // Estrelas
    const estrelas = [
      [80,30],[200,60],[350,20],[500,50],[650,35],[720,80],
      [120,100],[280,90],[420,70],[580,110],[740,40],[60,140],
      [310,130],[460,150],[610,120],[760,160],[180,170],[540,180]
    ];
    g.fillStyle(0xffffff);
    estrelas.forEach(([x, y]) => g.fillCircle(x, y, 1.5));

    // Chão
    g.fillStyle(0x0a0a0a);
    g.fillRect(0, 460, 800, 40);

    g.generateTexture("background", 800, 500);
    g.destroy();
}

  _criarTexturaEspinho(){
  const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0xff4444);
    g.fillTriangle(0, 20, 10, 0, 20, 20);

    g.fillStyle(0xcc2222);
    g.fillTriangle(2, 20, 10, 4, 18, 20);

    g.generateTexture("spike", 20, 20);
    g.destroy();
}

  _criarTexturaBandeira(){
  const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Poste
    g.fillStyle(0xaaaaaa);
    g.fillRect(8, 0, 4, 60);

    // Bandeira
    g.fillStyle(0x44ff44);
    g.fillTriangle(12, 5, 40, 15, 12, 30);

    g.generateTexture("flag", 45, 60);
    g.destroy();
}

  _criarSons(){
  this.registry.set("audioCtx", null); // será criado no primeiro uso (user gesture)
}

}