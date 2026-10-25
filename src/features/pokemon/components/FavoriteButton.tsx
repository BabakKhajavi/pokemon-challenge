import { useFavorites } from '../hooks/useFavorites';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  pokemonId: number;
  name: string;
  onHoverChange?: (hovered: boolean) => void;
}

export const FavoriteButton = ({ pokemonId, name, onHoverChange }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites(pokemonId);
  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={isFavorite}
      aria-label={`Favorite ${name}`}
      title={`Favorite ${name}`}
      onClick={(event) => { event.stopPropagation(); toggleFavorite(pokemonId); }}
      onKeyDown={(event) => event.stopPropagation()}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <svg className={isFavorite ? styles.filled : styles.outline} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    </button>
  );
};
