---
trigger: always_on
---

# Game Patterns Rules

## Game Loop Pattern
Always use the `useGameLoop` hook for any canvas animation.
Never write raw `requestAnimationFrame` calls inside components.

```js
// Standard game loop hook usage
const { startLoop, stopLoop } = useGameLoop((deltaTime) => {
  update(deltaTime);  // update game state via refs
  draw();             // draw to canvas
});
```

## Canvas Setup Pattern
Every game canvas must follow this setup:
```jsx
const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false; // pixel perfect — always set this
  // ... setup
  return () => stopLoop(); // always cleanup
}, []);

return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />;
```

## Game State Pattern
Use `useRef` for all values read inside the game loop (to avoid stale closures):
```js
const gameStateRef = useRef({
  player: { x: 100, y: 200, vx: 0, vy: 0 },
  asteroids: [],
  score: 0,
  isRunning: true,
});
```
Use `useState` only for values that need to trigger a React re-render (score display, game over screen).

## Pixel Drawing Helpers
All pixel art must be drawn using integer pixel coordinates.
Always use `Math.floor()` on all draw positions.
Use the pixel sprite pattern:
```js
// Draw a pixel sprite (2D array of color indices)
function drawSprite(ctx, sprite, colorMap, x, y, scale = 2) {
  sprite.forEach((row, ry) => {
    row.forEach((colorIdx, rx) => {
      if (colorIdx === 0) return; // 0 = transparent
      ctx.fillStyle = colorMap[colorIdx];
      ctx.fillRect(
        Math.floor(x + rx * scale),
        Math.floor(y + ry * scale),
        scale, scale
      );
    });
  });
}
```

## Collision Detection Pattern
Always use AABB (Axis-Aligned Bounding Box) — simple rectangle collision:
```js
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.h + a.y > b.y
  );
}
```

## Input Handling Pattern
All keyboard input must be handled via `useEffect` event listeners on `window`:
```js
useEffect(() => {
  const keys = {};
  const onDown = e => { keys[e.key] = true; };
  const onUp   = e => { keys[e.key] = false; };
  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);
  return () => {
    window.removeEventListener('keydown', onDown);
    window.removeEventListener('keyup', onUp);
  };
}, []);
```

## Mouse Input Pattern (Asteroid Dodger)
For mouse-based movement, track `mousemove` on the canvas element:
```js
const mouseXRef = useRef(null);
useEffect(() => {
  const canvas = canvasRef.current;
  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseXRef.current = (e.clientX - rect.left) * (canvas.width / rect.width);
  };
  canvas.addEventListener('mousemove', handleMouseMove);
  return () => canvas.removeEventListener('mousemove', handleMouseMove);
}, []);
```

## Game Screen Flow
```
App
 ├── 'menu'         → MainMenu
 ├── 'zenkeys'      → ZenKeys (manages its own mode: 'select' | 'freeplay' | 'memory')
 │                     Input: keyboard (ASDF HJKL / WETYU) + mouse click
 └── 'asteroids'    → AsteroidDodger
                       Input: keyboard (← → / A D) + mouse tracking
```
Screen switching is done via a single `screen` state in `App.jsx`.
Each game receives `onBack` prop to return to menu.

## Performance Rules
- Never create new objects inside the game loop — pre-allocate and reuse
- Clear canvas each frame: `ctx.clearRect(0, 0, canvas.width, canvas.height)`
- Fill background each frame with `COLORS.BG_PRIMARY`
- Cap delta time: `const dt = Math.min(deltaTime, 50)` to prevent spiral of death
- Always cancel animation frame on component unmount
