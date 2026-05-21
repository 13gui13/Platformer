class VictoryScene extends Phaser.Scene {

  constructor() {
    super({ key: "VictoryScene" });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Fundo
    this.add.image(cx, cy, "background");

    // Overlay esverdeado
    this.add.rectangle(cx, cy, width, height, 0x002200, 0.65);

    // Título
    const titulo = this.add.text(cx, cy - 100, t("victory"), {
      fontSize: "60px",
      fill: "#44ff44",
      fontStyle: "bold",
      stroke: "#004400",
      strokeThickness: 8,
      shadow: { color: "#00ff00", blur: 30, fill: true }
    }).setOrigin(0.5);

    // Animação de entrada com bounce
    titulo.setScale(0);
    this.tweens.add({
      targets: titulo,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: "Back.easeOut"
    });

    // Pulsação contínua
    this.time.delayedCall(600, () => {
      this.tweens.add({
        targets: titulo,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    });

    // Pontuação e estatísticas
    const score = this.registry.get("score") || 0;

    this.time.delayedCall(400, () => {
      this.add.text(cx, cy - 20, t("score") + ": " + score, {
        fontSize: "30px",
        fill: "#ffdd44",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5);

      // Instruções
      this.add.text(cx, cy + 60, t("restart"), {
        fontSize: "18px", fill: "#aaccff"
      }).setOrigin(0.5);

      this.add.text(cx, cy + 88, t("back_menu"), {
        fontSize: "18px", fill: "#aaccff"
      }).setOrigin(0.5);
    });

    // Input
    this.time.delayedCall(600, () => {
      this.input.keyboard.on("keydown-R", () => {
        this.registry.set("score", 0);
        this.registry.set("lives", 3);
        this.registry.set("level", 1);
        this.scene.start("GameScene");
      });

      this.input.keyboard.on("keydown-M", () => {
        this.scene.start("MenuScene");
      });
    });

    // Confetti: partículas coloridas a cair
    const cores = ["#ffdd00", "#44ff44", "#ff8844", "#88aaff", "#ff44aa", "#ffffff"];
    for (let i = 0; i < 30; i++) {
      const cor = Phaser.Utils.Array.GetRandom(cores);
      const x   = Phaser.Math.Between(0, width);
      const tamanho = Phaser.Math.Between(4, 10);

      const partícula = this.add.rectangle(x, -10, tamanho, tamanho, 
        Phaser.Display.Color.HexStringToColor(cor).color
      );

      this.tweens.add({
        targets: partícula,
        y: height + 10,
        x: x + Phaser.Math.Between(-60, 60), // deriva horizontal
        angle: Phaser.Math.Between(0, 360),
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 1500),
        repeat: -1,
        onRepeat: () => {
          partícula.x = Phaser.Math.Between(0, width);
          partícula.y = -10;
        }
      });
    }
  }
}
