# Plankton

Trabalho Prático 2 — Phaser 3 | Tecnologias Multimédia 2025/2026

---

## Elementos do Grupo

| Nome | Número |
|------|--------|
| Guilherme Barbosa | 29732 |
| Guilherme Silva | 33143 |

---

## Motor e Versão

- **Motor:** Phaser 3
- **Versão:** 3.80.1
- **Inclusão:** CDN (`https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js`)

---

## Descrição do Jogo

**Género:** Platformer 2D de scroll lateral com temática SpongeBob SquarePants

**Objetivo:** Controlar o Plankton e recolher os Krabby Patties espalhados pelo nível sem ser apanhado pelo SpongeBob ou cair nos espinhos. O objetivo final é chegar ao Krusty Krab no fim do mapa.

**Funcionalidades implementadas:**
- Jogador (Plankton) com movimento horizontal e duplo salto
- Física Arcade com gravidade
- Inimigos (SpongeBob) com patrulha automática, pisar elimina, tocar de lado mata
- Krabby Patties colecionáveis com animação de flutuação
- Espinhos letais
- Krusty Krab como objetivo final no fim do mapa
- Sistema de vidas (3 vidas, reinicia o nível ao morrer)
- Game Over ao perder todas as vidas
- Ecrã de Vitória ao completar o nível
- HUD com pontuação, vidas e contagem de Krabby Patties
- Câmara com lerp suave que segue o jogador num mundo de 1600px
- Suporte multilíngue PT + EN + TR com seletor acessível no menu
- Sons procedurais via Web Audio API
- Todas as texturas geradas via Phaser Graphics

---

## Jogabilidade / Controlos

| Tecla | Ação |
|-------|------|
| ← → ou A D | Mover o Plankton |
| ↑, W ou ESPAÇO | Saltar (até 2x — duplo salto) |
| R | Reiniciar o jogo |
| M | Voltar ao menu principal |

**Dica:** Para eliminar o SpongeBob, salta em cima dele. Se o tocares de lado perdes uma vida. Recolhe todos os Krabby Patties ou chega ao Krusty Krab para ganhar.

---

## Como Executar

### Opção 1 — VS Code Live Server (recomendado)
1. Abre a pasta do projeto no VS Code
2. Instala a extensão **Live Server**
3. Clica com o botão direito em `index.html` → **Open with Live Server**

### Opção 2 — npx serve
```bash
npx serve .
```
Abre `http://localhost:3000` no browser.

### Opção 3 — Python HTTP Server
```bash
python -m http.server 8000
```
Abre `http://localhost:8000` no browser.

---

## Aspetos Multimédia

### Imagens / Sprites
- **Formato:** Texturas geradas proceduralmente via `Phaser.GameObjects.Graphics`
- **Processo:** O objeto `Graphics` é usado como tela temporária para desenhar formas geométricas. O método `generateTexture("chave", largura, altura)` converte esse desenho numa textura WebGL guardada no `TextureManager` do Phaser, ficando disponível em qualquer cena pela chave atribuída. Após a conversão, o objeto `Graphics` é destruído com `destroy()` para libertar os recursos de memória associados (canvas interno e referências WebGL).
- **Sprites e resoluções:**

| Sprite | Chave | Resolução | Descrição |
|--------|-------|-----------|-----------|
| Plankton (jogador) | `player` | 40×52 px | Corpo oval verde, olho único ciclope, antena com ponta vermelha |
| SpongeBob (inimigo) | `enemy` | 32×28 px | Corpo quadrado amarelo com buracos, olhos grandes, gravata vermelha |
| Krabby Patty (moeda) | `coin` | 32×32 px | Hamburguer com pão, alface, queijo e tomate |
| Plataforma | `platform` | 32×16 px | Bloco de relva verde com textura de tijolo |
| Espinho | `spike` | 20×20 px | Triângulo vermelho |
| Krusty Krab (objetivo) | `flag` | 90×108 px | Edifício em madeira arredondado com chaminé e bandeirinhas |
| Fundo | `background` | 800×500 px | Céu noturno com estrelas |

- **Justificação:** A geração procedural elimina dependências de ficheiros externos, garante carregamento instantâneo, tamanho zero de assets no repositório e coerência visual com a temática SpongeBob.

### Áudio
- **Formato:** Gerado proceduralmente via **Web Audio API** (sem ficheiros de áudio externos)
- **Sons implementados:**

| Som | Evento | Descrição técnica |
|-----|--------|-------------------|
| Salto | Saltar | Oscilador quadrado com frequência crescente (300→600 Hz) |
| Krabby Patty | Recolher | Dois tons sinus ascendentes (700 Hz e 1000 Hz) |
| Pisar SpongeBob | Eliminar inimigo | Onda dente-de-serra descendente (400→100 Hz) |
| Morte | Perder vida | Sequência descendente de 4 tons sawtooth |
| Vitória | Completar nível | Fanfarra de 4 notas sinus (Dó-Mi-Sol-Dó) |

- **Justificação:** Web Audio API produz sons 8-bit coerentes com a estética retro do jogo sem adicionar peso ao repositório. Cumpre o requisito de integração de som.

### Total de assets em ficheiros externos
- **0 MB** — tudo gerado em runtime via JavaScript

---

## Estrutura do Projeto

```
sky-jumper/
├── index.html                    # Ponto de entrada — carrega Phaser via CDN e todos os scripts
├── README.md                     # Este ficheiro
├── .gitignore                    # Ignora ficheiros desnecessários
└── src/
    ├── main.js                   # Configuração Phaser (tamanho, gravidade) + registo de cenas
    ├── i18n/
    │   └── translations.js       # Sistema de tradução PT/EN/TR — função t() e toggleLang()
    └── scenes/
        ├── BootScene.js          # Inicializa registry global (score, lives, level)
        ├── PreloadScene.js       # Gera todas as texturas proceduralmente
        ├── MenuScene.js          # Menu principal com seletor de língua
        ├── GameScene.js          # Lógica completa do jogo
        ├── GameOverScene.js      # Ecrã de fim de jogo
        └── VictoryScene.js       # Ecrã de vitória com confetti
```

---

## Arquitetura de Cenas

| Cena | Responsabilidade |
|------|-----------------|
| `BootScene` | Inicializa score=0, lives=3, level=1 no registry global |
| `PreloadScene` | Gera texturas com Graphics, mostra barra de progresso |
| `MenuScene` | Menu com animações, controlos, seletor PT/EN |
| `GameScene` | Jogo completo — `create()` constrói o nível, `update()` corre a 60fps |
| `GameOverScene` | Pontuação final, reiniciar (R) ou menu (M) |
| `VictoryScene` | Vitória com confetti, reiniciar (R) ou menu (M) |

---

## Sistema de Física (Arcade Physics)

- `staticGroup` — plataformas e espinhos (imóveis, mais eficientes)
- `group` — inimigos e moedas (dinâmicos, com física)
- `collider` — colisões físicas reais (jogador/plataformas, inimigos/plataformas)
- `overlap` — deteção de sobreposição sem reação física (apanhar moedas, tocar inimigos)

---

## Suporte Multilíngue (i18n)

- Objeto `TRANSLATIONS` centraliza todas as strings em PT, EN e TR
- Função `t("chave")` devolve o texto na língua ativa
- Função `toggleLang()` alterna entre PT, EN e TR
- Seletor acessível no menu principal (botão no canto superior direito)
- Toda a UI traduzida: menu, HUD, Game Over e Vitória

---

## Pontos Extra Implementados

- ✅ Múltiplas cenas (Menu, Jogo, Game Over, Vitória)
- ✅ Duplo salto
- ✅ Câmara com lerp suave
- ✅ Animações com tweens (Krabby Patties flutuantes, título pulsante, confetti)
- ✅ Feedback visual com texto flutuante (+100, +200)
- ✅ HUD completo com pontuação, vidas e progresso
- ✅ Inimigos com patrulha e colisão diferenciada (pisar vs. tocar de lado)
- ✅ Efeitos de câmara (flash, fade)
- ✅ Temática coerente (SpongeBob SquarePants)
- ✅ Suporte a WASD e setas em simultâneo

## Github pages link
https://13gui13.github.io/Platformer/