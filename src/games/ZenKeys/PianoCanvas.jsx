import { useRef, useEffect } from 'react';
import { useGameLoop } from '../../hooks/useGameLoop';
import { COLORS } from '../../utils/colors';

import { playNote, playGameOverSound, playSuccessSound } from '../../utils/audioEngine';

const FREQS = {
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63,
  F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00,
  As4: 466.16, B4: 493.88, C5: 523.25,
};

const KEYS = [
  { id: 'C4', type: 'white', freq: FREQS.C4, kb: 'A' },
  { id: 'Cs4', type: 'black', freq: FREQS.Cs4, kb: 'W' },
  { id: 'D4', type: 'white', freq: FREQS.D4, kb: 'S' },
  { id: 'Ds4', type: 'black', freq: FREQS.Ds4, kb: 'E' },
  { id: 'E4', type: 'white', freq: FREQS.E4, kb: 'D' },
  { id: 'F4', type: 'white', freq: FREQS.F4, kb: 'F' },
  { id: 'Fs4', type: 'black', freq: FREQS.Fs4, kb: 'T' },
  { id: 'G4', type: 'white', freq: FREQS.G4, kb: 'H' },
  { id: 'Gs4', type: 'black', freq: FREQS.Gs4, kb: 'Y' },
  { id: 'A4', type: 'white', freq: FREQS.A4, kb: 'J' },
  { id: 'As4', type: 'black', freq: FREQS.As4, kb: 'U' },
  { id: 'B4', type: 'white', freq: FREQS.B4, kb: 'K' },
  { id: 'C5', type: 'white', freq: FREQS.C5, kb: 'L' },
];

const KB_MAP = {};
KEYS.forEach(k => { KB_MAP[k.kb.toLowerCase()] = k.id; });

let whiteIdx = 0;
const keyLayout = KEYS.map((k) => {
  let rect;
  const wWidth = 800 / 8;
  if (k.type === 'white') {
    rect = {
      x: whiteIdx * wWidth,
      y: 260,
      w: wWidth,
      h: 240,
      cx: whiteIdx * wWidth + wWidth / 2,
    };
    whiteIdx++;
  } else {
    rect = {
      x: whiteIdx * wWidth - (wWidth * 0.3),
      y: 260,
      w: wWidth * 0.6,
      h: 140,
      cx: whiteIdx * wWidth,
    };
  }
  return { ...k, ...rect };
});

const CHAR_SPRITE = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 2, 2, 1, 1, 0],
  [0, 1, 2, 1, 1, 2, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 3, 3, 1, 0, 0],
  [0, 1, 1, 3, 3, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
];
const CHAR_COLORS = [null, COLORS.PASTEL_PINK, COLORS.BG_PRIMARY, COLORS.PASTEL_YELLOW];

const POINTS_PER_ROUND = 10;

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

function drawPianoKey(ctx, key, isHighlighted) {
  const { x, y, w, h, type, kb } = key;
  const isBlack = type === 'black';
  const highlightColor = COLORS.PASTEL_PINK;

  ctx.fillStyle = isHighlighted
    ? highlightColor
    : isBlack ? COLORS.BG_SECONDARY : COLORS.TEXT_PRIMARY;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);

  ctx.strokeStyle = isHighlighted ? highlightColor : COLORS.TEXT_DIM;
  ctx.lineWidth = 2;
  ctx.strokeRect(Math.floor(x), Math.floor(y), w, h);

  // Key label
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isHighlighted) {
    ctx.fillStyle = COLORS.BG_PRIMARY;
  } else if (isBlack) {
    ctx.fillStyle = COLORS.PASTEL_YELLOW;
  } else {
    ctx.fillStyle = COLORS.BG_PRIMARY;
  }

  const labelY = isBlack ? y + h - 20 : y + h - 24;
  ctx.fillText(kb, Math.floor(x + w / 2), Math.floor(labelY));
  ctx.textBaseline = 'alphabetic';
}

function handleKeyAction(st, clickedKey, mode, onGameOver) {
  const destX = clickedKey.cx - 12;
  st.char.startX = st.char.x;
  st.char.targetX = destX;
  st.char.hopTime = 200;

  st.activeKeyId = clickedKey.id;
  playNote(clickedKey.freq);
  const capturedId = clickedKey.id;
  setTimeout(() => { if (st.activeKeyId === capturedId) st.activeKeyId = null; }, 300);

  if (mode === 'memory' && st.phase === 'wait_player') {
    if (clickedKey.id === st.sequence[st.playerIdx]) {
      st.playerIdx++;
      if (st.playerIdx === st.sequence.length) {
        st.score += POINTS_PER_ROUND;
        st.phase = 'comp_turn';
        st.sequence.push(keyLayout[Math.floor(Math.random() * keyLayout.length)].id);
        st.compSequenceIdx = 0;
        st.compTimer = 1000;
        playSuccessSound();
      }
    } else {
      st.phase = 'gameover';
      st.isRunning = false;
      playGameOverSound();
      if (onGameOver) onGameOver(st.score);
    }
  }
}

export default function PianoCanvas({ mode, onGameOver }) {
  const canvasRef = useRef(null);
  const { startLoop, stopLoop } = useGameLoop();

  const stateRef = useRef({
    isRunning: true,
    score: 0,
    phase: 'idle',
    sequence: [],
    playerIdx: 0,
    activeKeyId: null,
    compTimer: 0,
    compSequenceIdx: 0,
    char: {
      x: keyLayout[0].cx - 12,
      y: 236,
      startX: keyLayout[0].cx - 12,
      targetX: keyLayout[0].cx - 12,
      hopTime: 0,
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const st = stateRef.current;
    st.isRunning = true;
    st.score = 0;
    st.activeKeyId = null;
    if (mode === 'memory') {
      st.phase = 'comp_turn';
      st.sequence = [keyLayout[Math.floor(Math.random() * keyLayout.length)].id];
      st.compSequenceIdx = 0;
      st.compTimer = 1000;
    } else {
      st.phase = 'freeplay';
    }

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      const st = stateRef.current;
      if (!st.isRunning || st.phase === 'comp_turn' || st.phase === 'gameover') return;

      let clicked = keyLayout.filter(k => k.type === 'black').find(k =>
        x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h
      );
      if (!clicked) {
        clicked = keyLayout.filter(k => k.type === 'white').find(k =>
          x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h
        );
      }

      if (clicked) {
        handleKeyAction(st, clicked, mode, onGameOver);
      }
    };
    canvas.addEventListener('mousedown', handleClick);

    const handleKeyDown = (e) => {
      const st = stateRef.current;
      if (!st.isRunning || st.phase === 'comp_turn' || st.phase === 'gameover') return;

      const keyId = KB_MAP[e.key.toLowerCase()];
      if (!keyId) return;

      const matched = keyLayout.find(k => k.id === keyId);
      if (matched) {
        handleKeyAction(st, matched, mode, onGameOver);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    function update(dt) {
      const st = stateRef.current;
      if (!st.isRunning) return;

      if (st.char.hopTime > 0) {
        st.char.hopTime -= dt;
        if (st.char.hopTime <= 0) {
          st.char.hopTime = 0;
          st.char.x = st.char.targetX;
          st.char.y = 236;
        } else {
          const progress = 1 - (st.char.hopTime / 200);
          st.char.x = st.char.startX + (st.char.targetX - st.char.startX) * progress;
          st.char.y = 236 - Math.sin(progress * Math.PI) * 40;
        }
      }

      if (mode === 'memory' && st.phase === 'comp_turn') {
        st.compTimer -= dt;
        if (st.compTimer <= 0) {
          if (st.compSequenceIdx < st.sequence.length) {
            const keyId = st.sequence[st.compSequenceIdx];
            const kn = keyLayout.find(k => k.id === keyId);
            st.activeKeyId = keyId;
            playNote(kn.freq);

            st.compSequenceIdx++;
            st.compTimer = 800;
            setTimeout(() => {
              if (st.phase === 'comp_turn') st.activeKeyId = null;
            }, 400);
          } else {
            st.phase = 'wait_player';
            st.playerIdx = 0;
            st.activeKeyId = null;
          }
        }
      }
    }

    function draw() {
      ctx.fillStyle = COLORS.BG_PRIMARY;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const st = stateRef.current;

      // White keys first
      keyLayout.forEach(k => {
        if (k.type === 'white') {
          drawPianoKey(ctx, k, st.activeKeyId === k.id);
        }
      });
      // Black keys on top
      keyLayout.forEach(k => {
        if (k.type === 'black') {
          drawPianoKey(ctx, k, st.activeKeyId === k.id);
        }
      });

      // Character
      drawSprite(ctx, CHAR_SPRITE, CHAR_COLORS, st.char.x, Math.floor(st.char.y), 3);

      // Header text
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = COLORS.TEXT_PRIMARY;
      ctx.textAlign = 'center';

      if (mode === 'memory') {
        ctx.fillText(`SCORE: ${st.score}`, canvas.width / 2, 40);

        let msg = '';
        if (st.phase === 'comp_turn') msg = 'WATCH THE SEQUENCE';
        if (st.phase === 'wait_player') msg = 'YOUR TURN!';
        ctx.fillText(msg, canvas.width / 2, 72);
      } else {
        ctx.fillText('FREE PLAY', canvas.width / 2, 40);
      }

      // How to Play
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = COLORS.TEXT_DIM;
      ctx.textAlign = 'left';
      if (mode === 'memory') {
        ctx.fillText('WATCH \u2192 REPEAT | +10 PER ROUND', 16, canvas.height - 16);
      } else {
        ctx.fillText('PRESS A-L OR CLICK KEYS', 16, canvas.height - 16);
      }
    }

    startLoop((dt) => {
      update(dt);
      draw();
    });

    return () => {
      stopLoop();
      canvas.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={540}
      style={{ imageRendering: 'pixelated', display: 'block', margin: '0 auto' }}
    />
  );
}
