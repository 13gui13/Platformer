class BootScene extends Phaser.Scene {

  constructor() {
    // Identifica esta cena no Phaser
    super({ key: "BootScene" });
  }

  create() {
    // Dados globais partilhados entre cenas
    // game.registry é um DataManager acessível em qualquer cena
    this.registry.set("score", 0);       // Pontuação inicial
    this.registry.set("lives", 3);       // Vidas iniciais
    this.registry.set("level", 1);       // Nível inicial
    this.registry.set("totalCoins", 0);  // Total de moedas recolhidas

    // Avançar para o carregamento de assets
    this.scene.start("PreloadScene");
  }
}