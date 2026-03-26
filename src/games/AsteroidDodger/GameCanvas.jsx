import { useRef, useEffect } from 'react';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useAudio } from '../../hooks/useAudio';
import { useHighScore } from '../../hooks/useHighScore';
import { COLORS } from '../../utils/colors';
import styles from './styles.module.css';


const SHIP_SPRITE = [
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 2, 1, 1, 0],
  [1, 1, 2, 2, 2, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 3, 0, 3, 0, 0],
];
const SHIP_COLORS = [null, COLORS.PASTEL_BLUE, COLORS.PASTEL_MINT, COLORS.PASTEL_YELLOW];

const DIAMOND_SPRITE = [
  [0, 0, 1, 0, 0],
  [0, 1, 2, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 2, 1, 0],
  [0, 0, 1, 0, 0],
];
const DIAMOND_COLORS = [null, COLORS.PASTEL_YELLOW, COLORS.WHITE, COLORS.PASTEL_MINT];

const POINTS_PER_STAR = 10;

function drawSprite(ctx, sprite, colorMap, x, y, scale = 4) {
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

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.h + a.y > b.y
  );
}

function generateStars(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: Math.random() * 2 + 0.5,
    size: Math.random() < 0.8 ? 1 : 2,
    color: Math.random() < 0.5 ? COLORS.PASTEL_BLUE : COLORS.TEXT_PRIMARY,
  }));
}

function drawAsteroid(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  const offsets = [
    [1, 0], [2, 0], [3, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [1, 3], [2, 3], [3, 3],
  ];
  offsets.forEach(([ox, oy]) => {
    ctx.fillRect(
      Math.floor(x + ox * size),
      Math.floor(y + oy * size),
      size, size
    );
  });
}

export default function GameCanvas({ onGameOver }) {
  const canvasRef = useRef(null);
  const { startLoop, stopLoop } = useGameLoop();
  const audio = useAudio();
  const { updateScore } = useHighScore('asteroids');

  const keysRef = useRef({});
  const mouseXRef = useRef(null);

  const stateRef = useRef({
    score: 0,
    timeAlive: 0,
    player: { x: 400, y: 440, w: 28, h: 24, speed: 0.3 },
    asteroids: [],
    collectibles: [],
    bgStars: [],
    isRunning: true,
    lastAsteroidTime: 0,
    lastCollectibleTime: 0,
    spawnRate: 1200,
  });

  useEffect(() => {
    const onDown = e => { keysRef.current[e.key] = true; };
    const onUp = e => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const FIXED_Y = canvas.height - 60;

    const state = stateRef.current;
    state.bgStars = generateStars(100, canvas.width, canvas.height);
    state.isRunning = true;
    state.score = 0;
    state.timeAlive = 0;
    state.asteroids = [];
    state.collectibles = [];
    state.player = { x: canvas.width / 2 - 14, y: FIXED_Y, w: 28, h: 24, speed: 0.3 };
    state.spawnRate = 1200;
    state.lastAsteroidTime = 0;
    state.lastCollectibleTime = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = (e.clientX - rect.left) * (canvas.width / rect.width);
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    function update(dt) {
      if (!state.isRunning) return;

      state.timeAlive += dt;

      // Player horizontal movement — keyboard
      const keys = keysRef.current;
      if (keys['ArrowLeft'] || keys['a']) state.player.x -= state.player.speed * dt;
      if (keys['ArrowRight'] || keys['d']) state.player.x += state.player.speed * dt;

      // Player horizontal movement — mouse
      if (mouseXRef.current !== null) {
        const targetX = mouseXRef.current - state.player.w / 2;
        const diff = targetX - state.player.x;
        const moveSpeed = 0.5 * dt;
        if (Math.abs(diff) > 2) {
          state.player.x += Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
        }
      }

      // Fixed Y
      state.player.y = FIXED_Y;

      // Clamp
      if (state.player.x < 0) state.player.x = 0;
      if (state.player.x > canvas.width - state.player.w) {
        state.player.x = canvas.width - state.player.w;
      }

      // Update background stars
      state.bgStars.forEach(star => {
        star.y += star.speed * dt * 0.05;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Spawn asteroids
      state.lastAsteroidTime += dt;
      const currentSpawnRate = Math.max(300, state.spawnRate - state.timeAlive / 50);

      if (state.lastAsteroidTime > currentSpawnRate) {
        state.lastAsteroidTime = 0;
        const sizeMultiplier = Math.random() < 0.2 ? 6 : 4;
        const asteroidPixelSize = 5 * sizeMultiplier;
        state.asteroids.push({
          x: Math.random() * (canvas.width - asteroidPixelSize),
          y: -50,
          w: asteroidPixelSize,
          h: 4 * sizeMultiplier,
          speed: (Math.random() * 0.2 + 0.1) * (1 + state.timeAlive / 20000),
          pixelSize: sizeMultiplier,
          color: COLORS.TEXT_DIM,
        });
      }

      // Spawn collectible diamonds
      state.lastCollectibleTime += dt;
      if (state.lastCollectibleTime > 2500) {
        state.lastCollectibleTime = 0;
        state.collectibles.push({
          x: Math.random() * (canvas.width - 20),
          y: -30,
          w: 20,
          h: 20,
          speed: 0.08 + Math.random() * 0.04,
        });
      }

      // Update & check asteroids
      for (let i = state.asteroids.length - 1; i >= 0; i--) {
        const asteroid = state.asteroids[i];
        asteroid.y += asteroid.speed * dt;

        const playerCore = {
          x: state.player.x + state.player.w * 0.2,
          y: state.player.y + state.player.h * 0.2,
          w: state.player.w * 0.6,
          h: state.player.h * 0.6,
        };
        const asteroidCore = {
          x: asteroid.x + asteroid.w * 0.1,
          y: asteroid.y + asteroid.h * 0.1,
          w: asteroid.w * 0.8,
          h: asteroid.h * 0.8,
        };

        if (rectsOverlap(playerCore, asteroidCore)) {
          state.isRunning = false;
          audio.playGameOverSound();
          if (onGameOver) onGameOver(state.score);
          return;
        }

        if (asteroid.y > canvas.height) {
          state.asteroids.splice(i, 1);
        }
      }

      // Update & check collectibles
      for (let i = state.collectibles.length - 1; i >= 0; i--) {
        const gem = state.collectibles[i];
        gem.y += gem.speed * dt;

        if (rectsOverlap(state.player, gem)) {
          state.score += POINTS_PER_STAR;
          updateScore(state.score);
          audio.playDodgeSound();
          state.collectibles.splice(i, 1);
          continue;
        }

        if (gem.y > canvas.height) {
          state.collectibles.splice(i, 1);
        }
      }
    }

    function draw() {
      ctx.fillStyle = COLORS.BG_PRIMARY;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background stars
      state.bgStars.forEach(star => {
        ctx.fillStyle = star.color;
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
      });

      // Collectible diamonds
      state.collectibles.forEach(gem => {
        drawSprite(ctx, DIAMOND_SPRITE, DIAMOND_COLORS, gem.x, gem.y, 4);
      });

      // Player
      drawSprite(ctx, SHIP_SPRITE, SHIP_COLORS, state.player.x, state.player.y, 4);

      // Asteroids
      state.asteroids.forEach(asteroid => {
        drawAsteroid(ctx, asteroid.x, asteroid.y, asteroid.pixelSize, asteroid.color);
      });

      // Score
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = COLORS.TEXT_PRIMARY;
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE: ${state.score}`, canvas.width - 20, 30);

      // How to Play
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = COLORS.TEXT_DIM;
      ctx.textAlign = 'left';
      ctx.fillText('MOVE: \u2190 \u2192 / MOUSE', 16, 24);
      ctx.fillText('COLLECT \u2605 +10', 16, 40);
    }

    startLoop((dt) => {
      update(dt);
      draw();
    });

    return () => {
      stopLoop();
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      className={styles.asteroidCanvas}
      ref={canvasRef}
      width={800}
      height={500}
      style={{ imageRendering: 'pixelated', display: 'block', margin: '0 auto' }}
    />
  );
}
