---
trigger: always_on
---

# Design System Rules

## Color Palette
All colors must be defined in `src/utils/colors.js` as constants.
Never hardcode hex values in components or canvas code — always import from colors.js.

```js
// src/utils/colors.js
export const COLORS = {
  // Backgrounds
  BG_PRIMARY:    '#1a1a2e',   // Main dark background
  BG_SECONDARY:  '#16213e',   // Card / panel background
  BG_TERTIARY:   '#0f3460',   // Highlighted panel

  // Pastel Accents (soft, not neon)
  PASTEL_PINK:   '#ffb3c6',
  PASTEL_BLUE:   '#a0c4ff',
  PASTEL_YELLOW: '#ffd6a5',
  PASTEL_GREEN:  '#caffbf',
  PASTEL_PURPLE: '#c77dff',
  PASTEL_MINT:   '#9bf6ff',

  // UI
  TEXT_PRIMARY:  '#f0e6ff',   // Soft white with purple tint
  TEXT_DIM:      '#8888aa',   // Dimmed text
  WHITE:         '#ffffff',
  BLACK:         '#000000',
}
```

## Typography
- **Only font allowed:** Press Start 2P (Google Fonts)
- Import in `index.html` only:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  ```
- Apply globally in CSS: `font-family: 'Press Start 2P', monospace;`
- Font sizes (use only these):
  - `8px` — tiny labels, scores
  - `10px` — body, descriptions
  - `12px` — buttons, key labels
  - `16px` — section headers
  - `24px` — game titles
  - `32px` — main menu title

## Dark Mode Rules
- Background is ALWAYS `BG_PRIMARY` (`#1a1a2e`) — never white or light
- All text uses `TEXT_PRIMARY` or pastel accents — never dark text on dark bg
- Cards/panels use `BG_SECONDARY` with a 1px border of a pastel color
- Hover states: lighten border, add subtle pastel glow (`box-shadow`)
- Active/pressed states: scale down slightly (`transform: scale(0.97)`)

## Pixel Art Rules
- All UI elements must feel pixel-y:
  - Use `image-rendering: pixelated` on canvas elements
  - Borders: `2px solid` or `4px solid` (no border-radius except 0 or 2px max)
  - No smooth gradients — use flat colors or step gradients
  - Buttons: flat colored, pixel border, no shadows except pastel glow on hover
- Pixel grid unit: `8px` — all spacing should be multiples of 8px

## CSS Variables
Define all design tokens in `:root` in `src/index.css`:
```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0f3460;
  --pastel-pink: #ffb3c6;
  --pastel-blue: #a0c4ff;
  --pastel-yellow: #ffd6a5;
  --pastel-green: #caffbf;
  --pastel-purple: #c77dff;
  --pastel-mint: #9bf6ff;
  --text-primary: #f0e6ff;
  --text-dim: #8888aa;
  --font-pixel: 'Press Start 2P', monospace;
  --spacing-unit: 8px;
}
```

## Animations
- All animations must feel retro/pixel — avoid smooth easing
- Prefer `steps()` easing for pixel-perfect movement:
  ```css
  animation: hop 0.2s steps(4) forwards;
  ```
- Blink effects: `steps(1)` toggle animations
- No CSS animations on canvas — all canvas animation via requestAnimationFrame

## Background Images (Game Wrappers)
- Static PNG backgrounds are allowed in `src/assets/` for game wrapper backgrounds only
- Import as ES module: `import asteroidBg from '../../assets/asteroid_bg.png'`
- Apply via a separate absolutely-positioned `<div>` child (not on the wrapper itself) so `transform: rotate()` can be applied without affecting canvas/buttons
- Use CSS class (e.g. `.asteroidBgImg`) on the background div — no inline background styles on wrapper
- Set `pointer-events: none; z-index: 0` on the background div
- Canvas and UI elements must be `z-index: 1` or higher
