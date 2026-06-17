const TRANSLATIONS = {

  // Português
  pt: {
    // Menu principal
    title:          "Plankton",
    subtitle:       "A vingança do Plankton",
    play:           "JOGAR",
    language:       "Idioma: PT",
    controls_title: "Controlos",
    controls_move:  "← → / A D: Mover",
    controls_jump:  "↑ / ESPAÇO / W: Saltar",
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

  // English
  en: {
    // Main menu
    title:          "Plankton",
    subtitle:       "Plankton's revenge",
    play:           "PLAY",
    language:       "Language: EN",
    controls_title: "Controls",
    controls_move:  "← → / A D: Move",
    controls_jump:  "↑ / SPACE / W: Jump",
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


// ── Turco ──────────────────────────────────────────────────
  tr: {
    // Ana menü
    title:          "Sky Jumper",
    subtitle:       "Bir platform oyunu",
    play:           "OYNA",
    language:       "Dil: TR",
    controls_title: "Kontroller",
    controls_move:  "← → / A D : Hareket",
    controls_jump:  "↑ / SPACE / W : Zıpla",
    controls_restart:"R : Yeniden Başlat",

    // HUD
    score:  "Skor",
    lives:  "Can",
    level:  "Seviye",
    coins:  "Para",

    // Durum mesajları
    game_over:   "Oyun Bitti",
    victory:     "Kazandınız!",
    restart:     "R tuşuna basarak yeniden başlatın",
    back_menu:   "M tuşuna basarak menüye dönün",
    collected:   "Toplanan paralar",
    next_level:  "Sonraki seviye...",
    level_label: "Seviye",
    complete:    "Tamamlandı!",
  }
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
  currentLang = currentLang === "pt" ? "en" : currentLang === "en" ? "tr" : "pt";
  return currentLang;
}