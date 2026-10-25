import type { PokemonDetail } from '../types';
import styles from './PokemonDetailPanels.module.css';

export const PokemonMoves = ({ pokemon }: { pokemon: PokemonDetail }) => (
  <div>
    <h3 className={styles.sectionTitle}>Level-up Moves</h3>
    {pokemon.moves.length === 0 ? (
      <p>No level-up moves available.</p>
    ) : (
      <ul className={styles.moves}>
        {pokemon.moves.slice(0, 16).map((move) => (
          <li key={move.name}>
            <span className={styles.moveName}>{move.name}</span>
            <span className={styles.moveLevel}>Level {move.level}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
