import { useState } from 'react';
import FreePlay from './FreePlay';
import MemoryMode from './MemoryMode';
import styles from './styles.module.css';

export default function ZenKeys({ onBack }) {
  const [mode, setMode] = useState('select'); // 'select' | 'freeplay' | 'memory'

  if (mode === 'freeplay') {
    return <FreePlay onBack={() => setMode('select')} />;
  }

  if (mode === 'memory') {
    return <MemoryMode onBack={() => setMode('select')} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <h2 className={styles.title}>Zen Keys</h2>
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={() => setMode('freeplay')}>Free Play</button>
          <button className={styles.btn} onClick={() => setMode('memory')}>Memory Mode</button>
        </div>
        <button className={styles.backBtn} onClick={onBack}>← Main Menu</button>
      </div>
    </div>
  );
}
