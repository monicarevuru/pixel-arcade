import PropTypes from 'react';
import { COLORS } from '../../utils/colors';
import styles from './styles.module.css';

export default function GameCard({ title, description, color, onClick }) {
  return (
    <div 
      className={styles.card} 
      onClick={onClick}
      style={{
        '--card-color': color,
      }}
    >
      <h2 className={styles.title} style={{ color }}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
