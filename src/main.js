const config = {
  type: Phaser.AUTO,

  width: 800,                 // Largura do canvas em píxeis
  height: 500,                // Altura do canvas em píxeis

  // Física Arcade
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },   // Gravidade global (puxa tudo para baixo)
      debug: false // Ver hitboxes
    }
  },

  // Registo de todas as cenas pela ordem de uso
  scene: [
    BootScene,      // 1. Inicialização inicial dos dados globais
    PreloadScene,   // 2. Carrega todos os assets
    MenuScene,      // 3. Menu principal com opcao de escolher lingua
    //GameScene,      // 4. Jogo
    //GameOverScene,  // 5. Ecrã de fim de jogo
    //VictoryScene    // 6. Ecrã de vitória
  ],

  // Onde o canvas será inserido
  parent: undefined,

  // Cor de fundo padrão
  backgroundColor: "#3535da"
};

const game = new Phaser.Game(config);