# Skill: Pixel Canvas Art Patterns

## Canvas Init (Always)
```js
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // CRITICAL — pixel perfect rendering
```

## Canvas Sizes
- **AsteroidDodger**: `width=800 height=500`
- **ZenKeys**: `width=800 height=540` (extra height accommodates full piano key range)
- Always set `style={{ imageRendering: 'pixelated' }}` on the `<canvas>` element

## Background Image Pattern
For static backgrounds behind a canvas, see `design-system.md` → **Background Images (Game Wrappers)**.
Always use a separate `<div>` child with the bg class — never apply background directly on the wrapper.

## Pixel Sprite Format
Sprites are 2D arrays. 0 = transparent. Numbers = color index into a colorMap array.
```js
// Example: 8x8 pixel character facing right
const CHAR_SPRITE = [
  [0,0,1,1,1,1,0,0],
  [0,1,1,2,2,1,1,0],
  [0,1,2,1,1,2,1,0],
  [0,1,1,1,1,1,1,0],
  [0,0,1,3,3,1,0,0],
  [0,1,1,3,3,1,1,0],
  [0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0],
];
const CHAR_COLORS = [null, '#ffb3c6', '#1a1a2e', '#ffd6a5']; // index 0 = transparent
```

## Sprite Renderer
```js
function drawSprite(ctx, sprite, colorMap, x, y, scale = 3) {
  sprite.forEach((row, ry) => {
    row.forEach((colorIdx, rx) => {
      if (!colorIdx) return;
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

## Pixel Character — Zen Keys
- 8x8 sprite, scale 3 = 24x24px on screen
- Hop animation: 4 frames (neutral, up1, up2, up1) using steps() timing
- Character Y position interpolates from current key to target key X position
- Hop arc: `y = baseY - Math.sin(progress * Math.PI) * hopHeight`

## Pixel Spaceship — Asteroid Dodger
```js
const SHIP_SPRITE = [
  [0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0],
  [0,1,1,2,1,1,0],
  [1,1,2,2,2,1,1],
  [0,1,1,1,1,1,0],
  [0,0,3,0,3,0,0],
];
// 1 = PASTEL_BLUE (ship body)
// 2 = PASTEL_MINT (cockpit)
// 3 = PASTEL_YELLOW (exhaust)
```

## Pixel Diamond (Collectible Star — Asteroid Dodger)
```js
const DIAMOND_SPRITE = [
  [0,0,1,0,0],
  [0,1,2,1,0],
  [1,2,3,2,1],
  [0,1,2,1,0],
  [0,0,1,0,0],
];
// 1 = PASTEL_YELLOW, 2 = WHITE (sparkle), 3 = PASTEL_MINT
```

## Pixel Asteroid
```js
// Randomize asteroid shape slightly for variety
function drawAsteroid(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  // Draw chunky pixel blob
  const offsets = [
    [1,0],[2,0],[3,0],
    [0,1],[1,1],[2,1],[3,1],[4,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],
    [1,3],[2,3],[3,3],
  ];
  offsets.forEach(([ox, oy]) => {
    ctx.fillRect(
      Math.floor(x + ox * size),
      Math.floor(y + oy * size),
      size, size
    );
  });
}
```

## Starfield (Asteroid Dodger Background)
```js
// Pre-generate stars once, scroll them in update loop
function generateStars(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: Math.random() * 2 + 0.5,
    size: Math.random() < 0.8 ? 1 : 2, // mostly 1px, some 2px
    color: Math.random() < 0.5 ? '#a0c4ff' : '#f0e6ff',
  }));
}

function updateStars(stars, height, dt) {
  stars.forEach(star => {
    star.y += star.speed * dt * 0.05;
    if (star.y > height) star.y = 0;
  });
}

function drawStars(ctx, stars) {
  stars.forEach(star => {
    ctx.fillStyle = star.color;
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
  });
}
```

## Piano Key Rendering (Zen Keys)
```js
// 13 keys: 8 white (C4–C5) + 5 black
// Key width: canvas.width / 8 for white keys
// Key height: ~240px white, ~140px black
// Each key has a keyboard label drawn in contrast color
// Keyboard mapping: white = A S D F H J K L, black = W E T Y U
// Highlighted key: fill with PASTEL_PINK

function drawPianoKey(ctx, key, isHighlighted) {
  const { x, y, w, h, type, kb } = key;
  const isBlack = type === 'black';
  ctx.fillStyle = isHighlighted
    ? COLORS.PASTEL_PINK
    : isBlack ? COLORS.BG_SECONDARY : COLORS.TEXT_PRIMARY;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
  ctx.strokeStyle = isHighlighted ? COLORS.PASTEL_PINK : COLORS.TEXT_DIM;
  ctx.lineWidth = 2;
  ctx.strokeRect(Math.floor(x), Math.floor(y), w, h);
  // Key label
  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = isBlack && !isHighlighted ? COLORS.PASTEL_YELLOW : COLORS.BG_PRIMARY;
  ctx.textAlign = 'center';
  ctx.fillText(kb, Math.floor(x + w / 2), Math.floor(y + h - 20));
}
```

## Text Rendering on Canvas
```js
// Always use Press Start 2P on canvas too
ctx.font = '10px "Press Start 2P"';
ctx.fillStyle = COLORS.TEXT_PRIMARY;
ctx.textAlign = 'center';
ctx.fillText('SCORE: 00', canvas.width / 2, 30);
```
