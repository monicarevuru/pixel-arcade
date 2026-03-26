import { useState } from 'react';

export function useHighScore(gameId) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const updateScore = (newScore) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  const reset = () => {
    setScore(0);
  };

  return { score, highScore, updateScore, reset };
}
