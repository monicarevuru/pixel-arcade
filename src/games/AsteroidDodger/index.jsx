import { useState } from 'react';
import GameCanvas from './GameCanvas';
import { useHighScore } from '../../hooks/useHighScore';
import asteroidBg from '../../assets/asteroid_bg.png';
import styles from './styles.module.css';

export default function AsteroidDodger({ onBack }) {
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const { highScore } = useHighScore('asteroids'); // Optionally read highScore if needed anywhere

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
      <div className={styles.wrapper}>
        <div className={styles.gameOver}>
          <p className={styles.score}>SCORE: {score}</p>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 24px 0' }}>
            HIGH: {Math.max(score, highScore)}
          </p>
          <button className={styles.backBtn} onClick={handleRestart}>RETRY</button>
          <button className={styles.backBtn} onClick={onBack}>MENU</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.asteroidBgImg} style={{ backgroundImage: `url(${asteroidBg})` }} />
      <GameCanvas onGameOver={handleGameOver} />
      <button className={styles.menuOverlayBtn} onClick={onBack}>← MENU</button>
    </div>
  );
}
