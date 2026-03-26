---
description: Use this workflow when adding a new mini-game to Pixel Arcade.
---

# Workflow: Scaffold New Game

## Trigger
Use this workflow when adding a new mini-game to Pixel Arcade.
Command: `/workflow:new-game [GameName]`

## Steps

### Step 1 — Create folder structure
```
src/games/[GameName]/
  index.jsx          ← Game entry point + mode selector (if multiple modes)
  GameCanvas.jsx     ← Canvas rendering component
  styles.module.css  ← Game-specific styles
```

### Step 2 — index.jsx template
```jsx
import { useState } from 'react';
import GameCanvas from './GameCanvas';
import styles from './styles.module.css';
// Optional: import bgImage from '../../assets/[game]_bg.png';

export default function [GameName]({ onBack }) {
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'gameover'
  const [score, setScore] = useState(0);

  function handleGameOver(finalScore) {
    setScore(finalScore);
    setGameState('gameover');
  }

  function handleRestart() {
    setGameState('playing');
    setScore(0);
  }

  if (gameState === 'gameover') {
    return (
      <div className={styles.gameOver}>
        <p className={styles.score}>SCORE: {score}</p>
        <button onClick={handleRestart}>RETRY</button>
        <button onClick={onBack}>MENU</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Optional background image — must be separate child div, not on wrapper */}
      {/* <div className={styles.bgImg} style={{ backgroundImage: `url(${bgImage})` }} /> */}
      <GameCanvas onGameOver={handleGameOver} />
      <button className={styles.backBtn} onClick={onBack}>← MENU</button>
    </div>
  );
}
```

### Step 3 — GameCanvas.jsx template
```jsx
import { useRef, useEffect } from 'react';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useAudio } from '../../hooks/useAudio';
import { COLORS } from '../../utils/colors';

export default function GameCanvas({ onGameOver }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ score: 0, isRunning: true });
  const { startLoop, stopLoop } = useGameLoop();
  const audio = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    function update(dt) {
      if (!stateRef.current.isRunning) return;
      // TODO: game update logic
    }

    function draw() {
      ctx.fillStyle = COLORS.BG_PRIMARY;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // TODO: draw game objects
    }

    startLoop((dt) => { update(dt); draw(); });
    return () => stopLoop();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
```

### Step 4 — Register game in App.jsx
Add a new case to the screen switcher:
```jsx
{screen === '[gamename]' && <[GameName] onBack={() => setScreen('menu')} />}
```

### Step 5 — Add game card to MainMenu
```jsx
<GameCard
  title="[Game Name]"
  description="[One line description]"
  color={COLORS.PASTEL_[COLOR]}
  onClick={() => setScreen('[gamename]')}
/>
```

### Step 6 — Verify against rules
- [ ] Uses `useGameLoop` hook (not raw rAF)
- [ ] Canvas has `imageSmoothingEnabled = false`
- [ ] All colors from `COLORS` constant — no hardcoded hex
- [ ] Cleanup in useEffect return
- [ ] No external dependencies added
- [ ] Background image (if any) is in `src/assets/` and applied on a separate bg child div, not the wrapper
- [ ] Background div has `pointer-events: none; z-index: 0`
- [ ] Canvas and UI elements have higher z-index than background div
