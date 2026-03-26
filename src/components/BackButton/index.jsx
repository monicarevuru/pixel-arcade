import styles from './styles.module.css';
import { COLORS } from '../../utils/colors';

export default function BackButton({ onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      ← MENU
    </button>
  );
}
