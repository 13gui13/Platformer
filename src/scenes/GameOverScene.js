class GameOverScene extends Phaser.Scene {

  constructor() {
    super({ key: "GameOverScene" });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Fundo
    this.add.image(cx, cy, "background");

    // Overlay escuro semitransparente
    this.add.rectangle(cx, cy, width, height, 0x000000, 0.7);

    // Título
    const titulo = this.add.text(cx, cy - 100, t("game_over"), {
      fontSize: "56px",
      fill: "#ff4444",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 8,
      shadow: { color: "#ff0000", blur: 20, fill: true }
    }).setOrigin(0.5).setAlpha(0); // começa invisível

    // Animação de entrada: aparece gradualmente
    this.tweens.add({
      targets: titulo,
      alpha: 1,
      y: cy - 110,
      duration: 600,
      ease: "Back.easeOut"
    });

    // Pontuação final
    const score = this.registry.get("score") || 0;
    this.add.text(cx, cy, t("score") + ": " + score, {
      fontSize: "28px",
      fill: "#ffdd88",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    // Ativa o texto da pontuação com delay
    this.time.delayedCall(400, () => {
      this.add.text(cx, cy, t("score") + ": " + score, {
        fontSize: "28px", fill: "#ffdd88",
        stroke: "#000000", strokeThickness: 4
      }).setOrigin(0.5);
    });

    // Instruções de reinício
    this.time.delayedCall(700, () => {
      this.add.text(cx, cy + 70, t("restart"), {
        fontSize: "20px", fill: "#aaccff"
      }).setOrigin(0.5);
      this.add.text(cx, cy + 88, t("back_menu"), {
        fontSize: "18px", fill: "#aaccff"
      }).setOrigin(0.5);
    });

    // Input: teclas de reinício
    // Aguarda 500ms para evitar reinício acidental
    this.time.delayedCall(500, () => {
      this.input.keyboard.on("keydown-R", () => {
        // Reinicia tudo do zero
        this.registry.set("score", 0);
        this.registry.set("lives", 3);
        this.registry.set("level", 1);
        this.scene.start("GameScene");
      });

      this.input.keyboard.on("keydown-M", () => {
        this.registry.set("score", 0);
        this.registry.set("lives", 3);
        this.registry.set("level", 1);
        this.scene.start("MenuScene");
      });
    });

    // Efeito: partículas a cair (chuva de "X")
    for (let i = 0; i < 8; i++) {
      const x   = Phaser.Math.Between(50, 750);
      const txt = this.add.text(x, -20, "✕", {
        fontSize: `${Phaser.Math.Between(16, 32)}px`,
        fill: "#ff4444",
        alpha: 0.5
      }).setOrigin(0.5);

      this.tweens.add({
        targets: txt,
        y: height + 20,
        duration: Phaser.Math.Between(2000, 5000),
        delay: Phaser.Math.Between(0, 2000),
        repeat: -1,
        onRepeat: () => { txt.x = Phaser.Math.Between(50, 750); }
      });
    }
  }
}
