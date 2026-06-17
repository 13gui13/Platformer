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

  // Corpo oval verde escuro
  g.fillStyle(0x2d5a1b);
  g.fillEllipse(20, 32, 28, 22);

  // Cabeça oval verde mais claro
  g.fillStyle(0x4a8c2a);
  g.fillEllipse(20, 16, 26, 22);

  // Antena no topo
  g.lineStyle(2, 0x2d5a1b);
  g.lineBetween(20, 5, 24, 0);
  g.fillStyle(0x1a3a0a);
  g.fillCircle(24, 0, 2);

  // Olho grande único (Plankton tem só um olho)
  g.fillStyle(0xffffff);
  g.fillCircle(20, 15, 8);
  // Íris vermelha
  g.fillStyle(0xcc0000);
  g.fillCircle(21, 15, 5);
  // Pupila preta
  g.fillStyle(0x000000);
  g.fillCircle(22, 15, 3);
  // Brilho
  g.fillStyle(0xffffff);
  g.fillCircle(20, 12, 1.5);

  // Sobrancelha zangada
  g.lineStyle(2, 0x1a3a0a);
  g.lineBetween(13, 7, 27, 9);

  // Boca maléfica
  g.lineStyle(2, 0x1a3a0a);
  g.lineBetween(14, 23, 26, 23);
  g.lineBetween(26, 23, 28, 21); // canto levantado

  // Pernas finas
  g.lineStyle(2, 0x2d5a1b);
  g.lineBetween(12, 40, 8,  48);
  g.lineBetween(16, 42, 13, 50);
  g.lineBetween(24, 42, 27, 50);
  g.lineBetween(28, 40, 32, 48);

  // Braços
  g.lineBetween(8,  28, 2,  22);
  g.lineBetween(32, 28, 38, 22);

  g.generateTexture("player", 40, 52);
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

  // Pão de baixo (semicírculo bege)
  g.fillStyle(0xc8860a);
  g.fillEllipse(18, 26, 32, 14);

  // Hamburguer — camadas de baixo para cima:

  // Carne (castanho escuro)
  g.fillStyle(0x6b3a2a);
  g.fillEllipse(18, 22, 30, 10);

  // Alface (verde)
  g.fillStyle(0x4aaa33);
  g.fillEllipse(18, 18, 32, 8);
  // folhas irregulares
  g.fillEllipse(8,  17, 10, 6);
  g.fillEllipse(28, 17, 10, 6);

  // Queijo (amarelo)
  g.fillStyle(0xffcc00);
  g.fillRect(6, 15, 24, 5);

  // Pão de cima (semicírculo castanho dourado)
  g.fillStyle(0xd4901a);
  g.fillEllipse(18, 12, 30, 18);

  // Brilho do pão
  g.fillStyle(0xf0b030, 0.6);
  g.fillEllipse(14, 8, 14, 7);

  // Sementes de sésamo
  g.fillStyle(0xffffff);
  g.fillEllipse(12, 10, 4, 2);
  g.fillEllipse(20, 7,  4, 2);
  g.fillEllipse(26, 11, 4, 2);

  g.generateTexture("coin", 36, 36);
  g.destroy();
}

_criarTexturaInimigo() {
  const g = this.make.graphics({ x: 0, y: 0, add: false });

  // Sapatos pretos grandes e arredondados
  g.fillStyle(0x111111);
  g.fillEllipse(7,  26, 14, 7);
  g.fillEllipse(25, 26, 14, 7);

  // Meias brancas (pernas finas)
  g.fillStyle(0xffffff);
  g.fillRect(7,  20, 4, 8);
  g.fillRect(21, 20, 4, 8);

  // Calças castanhas curtas
  g.fillStyle(0x8B5E1A);
  g.fillRect(5, 14, 22, 8);
  g.fillStyle(0x222222);
  g.fillRect(5, 13, 22, 2);   // cinto
  g.fillStyle(0xffdd00);
  g.fillRect(13, 13, 6, 2);   // fivela

  // Corpo quadrado amarelo (esponja)
  g.fillStyle(0xffdd44);
  g.fillRect(3, 2, 26, 13);

  // Buracos da esponja
  g.fillStyle(0xddaa22);
  g.fillCircle(7,  5,  2);
  g.fillCircle(14, 4,  2);
  g.fillCircle(22, 6,  2);
  g.fillCircle(6,  11, 2);
  g.fillCircle(20, 11, 2);
  g.fillCircle(27, 9,  2);

  // Camisa branca e gravata vermelha
  g.fillStyle(0xffffff);
  g.fillRect(9, 12, 14, 3);
  g.fillStyle(0xdd2222);
  g.fillTriangle(14, 12, 18, 12, 16, 20);

  // Olhos grandes
  g.fillStyle(0xffffff);
  g.fillCircle(10, 7, 5);
  g.fillCircle(22, 7, 5);
  g.fillStyle(0x55aaff);
  g.fillCircle(10, 7, 3);
  g.fillCircle(22, 7, 3);
  g.fillStyle(0x000000);
  g.fillCircle(10, 7, 2);
  g.fillCircle(22, 7, 2);
  g.fillStyle(0xffffff);
  g.fillCircle(11, 6, 1);   // brilho
  g.fillCircle(23, 6, 1);

  // Nariz
  g.fillStyle(0xffaa22);
  g.fillEllipse(16, 10, 4, 3);

  // Sorriso com dois dentes
  g.fillStyle(0xffffff);
  g.fillRect(12, 13, 8, 3);
  g.fillStyle(0xffdd44);
  g.fillRect(16, 13, 1, 3);  // separação
  g.fillStyle(0xff9944);
  g.fillRect(11, 12, 10, 1); // lábio superior
  g.fillRect(11, 16, 10, 1); // lábio inferior

  // Sobrancelhas
  g.fillStyle(0x886600);
  g.fillRect(6,  2, 7, 2);
  g.fillRect(19, 2, 7, 2);

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

_criarTexturaBandeira() {
  const g = this.make.graphics({ x: 0, y: 0, add: false });

  // Base de madeira
  g.fillStyle(0x6b4a1e);
  g.fillRect(0, 100, 90, 8);

  // Corpo principal arredondado (madeira castanha)
  g.fillStyle(0x8B5E2A);
  g.fillRect(8, 45, 74, 57);
  g.fillStyle(0x9B6E3A);
  g.fillEllipse(45, 45, 74, 30);  // topo arredondado

  // Musgo verde no topo
  g.fillStyle(0x4a7a2a);
  g.fillEllipse(45, 38, 70, 12);

  // Tábuas horizontais
  g.fillStyle(0x7a5222);
  g.fillRect(8, 55, 74, 2);
  g.fillRect(8, 65, 74, 2);
  g.fillRect(8, 75, 74, 2);

  // Rebites metálicos
  g.fillStyle(0x888888);
  g.fillCircle(55, 60, 3);
  g.fillCircle(65, 60, 3);

  // Chaminé
  g.fillStyle(0x666666);
  g.fillRect(40, 20, 10, 25);
  g.fillStyle(0x888888);
  g.fillRect(38, 18, 14, 5);

  // Fumo
  g.fillStyle(0xdddddd);
  g.fillCircle(45, 13, 5);
  g.fillCircle(42, 7,  4);
  g.fillCircle(46, 2,  3);

  // Janelas grandes azuladas
  g.fillStyle(0xaaccee);
  g.fillRect(10, 65, 28, 22);
  g.fillRect(52, 65, 28, 22);
  g.lineStyle(2, 0x6b4a1e);
  g.strokeRect(10, 65, 28, 22);
  g.strokeRect(52, 65, 28, 22);
  g.lineStyle(1, 0x5588aa);
  g.lineBetween(24, 65, 24, 87);
  g.lineBetween(10, 76, 38, 76);
  g.lineBetween(66, 65, 66, 87);
  g.lineBetween(52, 76, 80, 76);

  // Porta central
  g.fillStyle(0x5a3a10);
  g.fillRect(34, 72, 22, 30);
  g.fillStyle(0x6b4a1e);
  g.fillEllipse(45, 72, 22, 10);
  g.fillStyle(0xffdd00);
  g.fillCircle(53, 87, 2);  // maçaneta

  // Bandeirinhas decorativas
  g.lineStyle(1, 0x444444);
  g.lineBetween(12, 58, 78, 58);
  const flagColors = [
    [15, 0xddaa00, 0xdd2222],
    [28, 0x111111, 0xffdd00],
    [41, 0x2244cc, 0xffffff],
    [54, 0xdd2222, 0xffffff],
    [67, 0xffdd00, 0x2244cc],
  ];
  flagColors.forEach(([x, c1, c2]) => {
    g.fillStyle(c1);
    g.fillTriangle(x, 58, x + 6, 58, x + 3, 65);
    g.fillStyle(c2);
    g.fillTriangle(x + 6, 58, x + 12, 58, x + 9, 65);
  });

  // Placa em forma de concha (canto superior esquerdo)
  g.fillStyle(0xeeddcc);
  g.fillEllipse(20, 22, 36, 24);
  g.fillStyle(0xdd3311);
  // "KK" na placa
  g.fillRect(9,  16, 2, 8);
  g.fillRect(11, 19, 3, 2);
  g.fillRect(11, 16, 2, 3);
  g.fillRect(11, 21, 2, 3);
  g.fillRect(16, 16, 2, 8);
  g.fillRect(18, 19, 3, 2);
  g.fillRect(18, 16, 2, 3);
  g.fillRect(18, 21, 2, 3);

  g.generateTexture("flag", 90, 108);
  g.destroy();
}

  _criarSons(){
  this.registry.set("audioCtx", null); // será criado no primeiro uso (user gesture)
}

}