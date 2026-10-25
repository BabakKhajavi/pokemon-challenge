import type { PokemonDetail } from '../types';
import styles from './PokemonDetailPanels.module.css';

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const PokemonStats = ({ pokemon }: { pokemon: PokemonDetail }) => {
  const total = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <div className={styles.stats}>
      {pokemon.stats.map((stat) => (
        <div key={stat.name} className={styles.stat}>
          <div className={styles.statHeading}>
            <span>{statLabels[stat.name] ?? stat.name}</span>
            <span>{stat.value}</span>
          </div>
          <div className={styles.statTrack} aria-hidden="true">
            <div className={styles.statFill} style={{ width: `${Math.min(100, (stat.value / 255) * 100)}%` }} />
          </div>
        </div>
      ))}
      <div className={styles.total}><strong>Total</strong><strong>{total}</strong></div>
    </div>
  );
};
