import styles from './styles.module.css';
import PianoCanvas from './PianoCanvas';

export default function FreePlay({ onBack }) {
  return (
    <div className={styles.wrapper}>
      <PianoCanvas mode="freeplay" />
      <button className={styles.menuOverlayBtn} onClick={onBack}>← BACK</button>
    </div>
  );
}
