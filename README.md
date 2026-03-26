# 🎮 Pixel Arcade

A portfolio-grade retro browser game built with **React + Canvas API + Web Audio API**.  
Two mini-games with a stylish dark-mode pixel art main menu.  
Zero external game libraries — pure React, CSS Modules, and procedural 8-bit audio.

## Games

### 🎹 Zen Keys
A piano memory & free play game.
- **Free Play** — Click or press keyboard keys to play notes. Pixel character hops to each key.
- **Memory Mode** — Simon Says. Watch the sequence, repeat it. +10 points per round survived.
- 13 keys: 8 white (C4–C5) + 5 black. Keyboard: `A S D F H J K L` (white), `W E T Y U` (black).

### 🚀 Asteroid Dodger
A top-down space survival game.
- Pixel spaceship moves **horizontally** — keyboard `← → / A D` or mouse tracking.
- Dodge falling asteroids to survive.
- Collect falling ⭐ diamond stars for **+10 points** each.
- Custom starfield background image behind the canvas.

## Tech Stack
- **Framework:** React 18 + Vite
- **Rendering:** Canvas API (all game visuals)
- **Sound:** Web Audio API (procedural 8-bit, no audio files)
- **Styling:** CSS Modules + global CSS variables
- **Font:** Press Start 2P (Google Fonts CDN only)
- **State:** useState + useRef (no Redux, no Zustand)
- **Routing:** State-based screen switching (no React Router)

## Project Structure
```
src/
  components/       → Shared UI (MainMenu, GameCard, BackButton)
  games/
    ZenKeys/        → Piano game: PianoCanvas.jsx, FreePlay.jsx, MemoryMode.jsx
    AsteroidDodger/ → Space game: GameCanvas.jsx, index.jsx
  hooks/            → useGameLoop, useAudio, useHighScore
  utils/            → colors.js, audioEngine.js
  assets/           → asteroid_bg.png (AsteroidDodger background)
```

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## Rules & Conventions
See `.agents/rules/` for code style, design system, and game pattern rules.  
See `.agents/skills/` for canvas and audio implementation guides.  
See `.agents/workflows/` for development workflows.
