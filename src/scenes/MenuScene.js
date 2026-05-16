class MenuScene extends Phaser.Scene {

  constructor() {
    // Identifica esta cena no Phaser
    super({ key: "MenuScene" });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;

    // Fundo
    this.add.image(cx, height / 2, "background");

    // Painel semitransparente central
    const panel = this.add.rectangle(cx, height / 2, 420, 340, 0x000033, 0.85);
    panel.setStrokeStyle(2, 0x4488ff);

    // Título
    this.titleText = this.add.text(cx, 100, t("title"), {
      fontSize: "52px",
      fill: "#88bbff",
      fontStyle: "bold",
      stroke: "#001133",
      strokeThickness: 6,
      shadow: { color: "#4488ff", blur: 20, fill: true }
    }).setOrigin(0.5);

    // Animação de pulsação no título
    this.tweens.add({
      targets: this.titleText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,        // vai e volta
      repeat: -1,        // infinito
      ease: "Sine.easeInOut"
    });

    // Subtítulo
    this.subtitleText = this.add.text(cx, 155, t("subtitle"), {
      fontSize: "18px",
      fill: "#aaccff"
    }).setOrigin(0.5);

    // Instruções de controlos
    this.ctrlTitle = this.add.text(cx, 210, t("controls_title"), {
      fontSize: "16px",
      fill: "#ffdd88",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.ctrlMove = this.add.text(cx, 235, t("controls_move"), {
      fontSize: "14px", fill: "#ccddff"
    }).setOrigin(0.5);

    this.ctrlJump = this.add.text(cx, 255, t("controls_jump"), {
      fontSize: "14px", fill: "#ccddff"
    }).setOrigin(0.5);

    this.ctrlRestart = this.add.text(cx, 275, t("controls_restart"), {
      fontSize: "14px", fill: "#ccddff"
    }).setOrigin(0.5);

    // Botão JOGAR
    const btnPlay = this.add.rectangle(cx, 330, 160, 44, 0x2255aa)
      .setInteractive()                  // torna clicável
      .setStrokeStyle(2, 0x88bbff);

    this.playText = this.add.text(cx, 330, t("play"), {
      fontSize: "22px",
      fill: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Hover: muda cor ao passar o rato
    btnPlay.on("pointerover",  () => btnPlay.setFillStyle(0x4477cc));
    btnPlay.on("pointerout",   () => btnPlay.setFillStyle(0x2255aa));
    btnPlay.on("pointerdown",  () => {
      this._tocarSomClick();
      this.scene.start("GameScene");
    });

    // Botão de língua
    const btnLang = this.add.rectangle(width - 70, 30, 100, 30, 0x333366)
      .setInteractive()
      .setStrokeStyle(1, 0x6688cc);

    this.langText = this.add.text(width - 70, 30, t("language"), {
      fontSize: "13px", fill: "#aabbff"
    }).setOrigin(0.5);

    btnLang.on("pointerover",  () => btnLang.setFillStyle(0x4455aa));
    btnLang.on("pointerout",   () => btnLang.setFillStyle(0x333366));
    btnLang.on("pointerdown",  () => {
      toggleLang();          // altera a língua global
      this._atualizarTextos(); // re-renderiza todos os textos
    });

    // Tecla ENTER também inicia o jogo 
    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("GameScene");
    });

    // Estrelas a cair decorativas
    this._criarEstrelasAnimadas();
  }
/** Renderiza todos os textos com a nova língua */
  _atualizarTextos() {
    this.titleText.setText(t("title"));
    this.subtitleText.setText(t("subtitle"));
    this.ctrlTitle.setText(t("controls_title"));
    this.ctrlMove.setText(t("controls_move"));
    this.ctrlJump.setText(t("controls_jump"));
    this.ctrlRestart.setText(t("controls_restart"));
    this.playText.setText(t("play"));
    this.langText.setText(t("language"));
  }

  /** Partículas decorativas no menu */
  _criarEstrelasAnimadas() {
    // Cria pequenos pontos que flutuam para cima
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 500);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xffffff, 0.6);

      this.tweens.add({
        targets: star,
        y: y - Phaser.Math.Between(100, 300),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        ease: "Linear",
        onRepeat: () => {
          star.x = Phaser.Math.Between(0, 800);
          star.y = 500;
          star.alpha = 0.6;
        }
      });
    }
  }

  /** Som de clique simples via Web Audio */
  _tocarSomClick() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) { /* Browser pode bloquear sem interação */ }
  }
}