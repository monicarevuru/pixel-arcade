import { useState } from 'react';
import styles from './styles.module.css';
import PianoCanvas from './PianoCanvas';

export default function MemoryMode({ onBack }) {
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);

  function handleGameOver(finalScore) {
    setScore(finalScore);
    setGameState('gameover');
  }

  if (gameState === 'gameover') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.gameOver}>
          <p className={styles.score}>SCORE: {score}</p>
          <button className={styles.btn} onClick={() => setGameState('playing')}>RETRY</button>
          <button className={styles.btn} onClick={onBack}>MENU</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <PianoCanvas mode="memory" onGameOver={handleGameOver} />
      <button className={styles.menuOverlayBtn} onClick={onBack}>← BACK</button>
    </div>
  );
}
