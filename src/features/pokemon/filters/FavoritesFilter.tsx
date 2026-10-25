import { useFavorites } from '../hooks/useFavorites';
import styles from './FavoritesFilter.module.css';

export const FavoritesFilter = () => {
  const { favoriteIds, favoritesOnly, setFavoritesOnly } = useFavorites();
  return (
    <div className={styles.viewSwitch} role="group" aria-label="Pokémon view">
      <button type="button" className={styles.option} aria-pressed={!favoritesOnly} onClick={() => setFavoritesOnly(false)}>
        All Pokémon
      </button>
      <button type="button" className={styles.option} aria-label="Favorites" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(true)}>
        <span className={styles.heart} aria-hidden="true">♥</span>
        Favorites <span className={styles.count} aria-hidden="true">({favoriteIds.length})</span>
      </button>
    </div>
  );
};
