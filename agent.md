# 🎮 Pixel Arcade — Agent.md

## Project Overview
Pixel Arcade is a lightweight, portfolio-grade browser game built with React + Canvas API + Web Audio API.
It features two mini-games on a stylish dark-mode retro main menu.
Built as a showcase of agentic AI-assisted development using Antigravity IDE.

## Goals
- Zero external dependencies beyond React (no npm game libraries, no audio files)
- Production-level code quality — clean, readable, well-structured
- 8-bit pixel art aesthetic with soft pastel colors on dark background
- Fully playable in browser, deployable to Netlify/Vercel
- Showcase best practices: custom hooks, separation of concerns, consistent design system

## Tech Stack
- **Framework:** React 18 + Vite
- **Rendering:** Canvas API (all game visuals)
- **Sound:** Web Audio API (procedural 8-bit sounds, no audio files)
- **Styling:** CSS Modules + global CSS variables (no Tailwind, no styled-components)
- **Font:** Press Start 2P via Google Fonts (only allowed CDN call)
- **State:** useState + useRef + useReducer (no Redux, no Zustand)
- **Routing:** Simple state-based screen switching (no React Router)

## Project Structure
```
src/
  components/       → Shared UI components (MainMenu, GameCard, BackButton)
  games/
    ZenKeys/        → Piano memory + free play game
    AsteroidDodger/ → Space dodge game
  hooks/            → useGameLoop, useAudio, useHighScore
  utils/            → colors.js, audioEngine.js
  assets/           → Static image assets (e.g. asteroid_bg.png for backgrounds)
```

## Games

### 🎹 Zen Keys
Two modes accessible from within the game:
- **Free Play** — Click piano keys or press keyboard shortcuts (A-L white, W/E/T/Y/U black), tiny pixel character hops to played key, note plays
- **Memory Mode** — Simon Says style. Computer highlights keys. Player repeats sequence via click or keyboard. Wrong key = game over. Score = +10 per round survived.
- 13 keys (8 white + 5 black, one octave C4–C5) with visible key labels

### 🚀 Asteroid Dodger
- Top-down scrolling space game
- Pixel spaceship moves horizontally with arrow keys / A-D / mouse tracking
- Asteroids fall from top — dodge to survive
- Collectible diamond stars fall alongside asteroids — collect for +10 points each
- Starfield background outside canvas, How to Play instructions on-screen

## Rules (Always Follow)
- See `.antigravity/rules/code-style.md`
- See `.antigravity/rules/design-system.md`
- See `.antigravity/rules/game-patterns.md`

## Skills (Reference When Needed)
- See `.antigravity/skills/web-audio.md` for all sound implementation
- See `.antigravity/skills/pixel-canvas.md` for all canvas/pixel art implementation

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

## Do NOT
- Install any game libraries (Phaser, PixiJS, Three.js etc.)
- Use localStorage or sessionStorage
- Use inline styles — always use CSS variables or CSS Modules
- Create audio files — all sound must be Web Audio API procedural
- Use React Router — use state-based screen switching only
- Add any npm package not already in package.json
- Static image assets (PNG/SVG) in `src/assets/` are allowed for backgrounds only — not for sprites (use canvas drawing instead)
