import GameCard from '../GameCard';
import { COLORS } from '../../utils/colors';
import styles from './styles.module.css';

export default function MainMenu({ onNavigate }) {
  // Split title to animate letters individually
  const titleText = "PIXEL ARCADE";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {titleText.split('').map((char, index) => (
          <span
            key={index}
            className={styles.char}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      <div className={styles.grid} >
        <GameCard
          title="🎹 Zen Keys"
          description="Piano memory & free play"
          color={COLORS.PASTEL_PINK}
          onClick={() => onNavigate('zenkeys')}
        />
        <GameCard
          title="🚀 Asteroid Dodger"
          description="Dodge to survive"
          color={COLORS.PASTEL_BLUE}
          onClick={() => onNavigate('asteroids')}
        />
      </div>

    </div>
  );
}
