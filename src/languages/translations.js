const TRANSLATIONS = {

  // ── Português ────────────────────────────────────────────────
  pt: {
    // Menu principal
    title:          "Plankton",
    subtitle:       "A vingança do Plankton",
    play:           "JOGAR",
    language:       "Idioma: PT",
    controls_title: "Controlos",
    controls_move:  "← → : Mover",
    controls_jump:  "↑ / ESPAÇO : Saltar",
    controls_restart:"R : Reiniciar",

    // HUD (interface dentro do jogo)
    score:  "Pontos",
    lives:  "Vidas",
    level:  "Nível",
    coins:  "Moedas",

    // Mensagens de estado
    game_over:   "Fim de Jogo",
    victory:     "Vitória!",
    restart:     "Prima R para reiniciar",
    back_menu:   "Prima M para o menu",
    collected:   "Moedas recolhidas",
    next_level:  "Próximo nível em...",
    level_label: "Nível",
    complete:    "Completo!",
  },

  // ── English ──────────────────────────────────────────────────
  en: {
    // Main menu
    title:          "Plankton",
    subtitle:       "Plankton's revenge",
    play:           "PLAY",
    language:       "Language: EN",
    controls_title: "Controls",
    controls_move:  "← → : Move",
    controls_jump:  "↑ / SPACE : Jump",
    controls_restart:"R : Restart",

    // HUD
    score:  "Score",
    lives:  "Lives",
    level:  "Level",
    coins:  "Coins",

    // State messages
    game_over:   "Game Over",
    victory:     "Victory!",
    restart:     "Press R to restart",
    back_menu:   "Press M for menu",
    collected:   "Coins collected",
    next_level:  "Next level in...",
    level_label: "Level",
    complete:    "Complete!",
  },
};

// Língua atual — começa em Português
let currentLang = "pt";

/**
 * t(key) — Função de tradução principal.
 * Devolve o texto na língua ativa para a chave pedida.
 * @param {string} key - Chave de tradução
 * @returns {string} Texto traduzido ou a própria chave se não encontrar
 */
function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    ? TRANSLATIONS[currentLang][key]
    : key;
}

/**
 * toggleLang() — Alterna entre PT e EN.
 * @returns {string} Nova língua ativa
 */
function toggleLang() {
  currentLang = currentLang === "pt" ? "en" : "pt";
  return currentLang;
}
