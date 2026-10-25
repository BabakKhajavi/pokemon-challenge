import React, { useState } from 'react';
import styles from './PokemonCard.module.css';
import { FavoriteButton } from '../components/FavoriteButton';
import { getReadableTextColor } from '../utils/getReadableTextColor';
import { getPokemonArtwork, pokemonArtworkFallback } from '../utils/getPokemonArtwork';

interface PokemonCardProps {
  pokemonId: number;
  name: string;
  number: string;
  types: { label: string; background: string }[];
  imageSrc: string | null;
  prioritizeImage?: boolean;
  onSelect: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemonId,
  name,
  number,
  types,
  imageSrc,
  prioritizeImage = false,
  onSelect,
}) => {
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const responsiveSrcSet = imageSrc && imageSrc === getPokemonArtwork(pokemonId)
    ? `${getPokemonArtwork(pokemonId, 160)} 160w, ${getPokemonArtwork(pokemonId, 256)} 256w, ${imageSrc} 360w`
    : undefined;

  return (
    <div className={`${styles.cardContainer} ${isHeartHovered ? styles.heartHovered : ''}`}>
      <button
        type="button"
        className={styles.openButton}
        aria-label={`View details for ${name}`}
        onClick={onSelect}
      />
      <div className={styles.headerContainer}>
        <h3 className={styles.heading3}>
          <span className={styles.name}>{name}</span>
        </h3>
        <div className={styles.numberContainer}>
          <span className={styles.number}>#{number}</span>
          <FavoriteButton pokemonId={pokemonId} name={name} onHoverChange={setIsHeartHovered} />
        </div>
      </div>

      <div className={styles.imageContainer}>
        <img
          className={styles.bulbasaurImage}
          src={imageSrc ?? pokemonArtworkFallback}
          srcSet={responsiveSrcSet}
          sizes="(max-width: 420px) 83px, (max-width: 700px) 100px, 144px"
          alt={imageSrc ? name : `Artwork unavailable for ${name}`}
          loading={prioritizeImage ? 'eager' : 'lazy'}
          fetchPriority={prioritizeImage ? 'high' : 'auto'}
          onError={(event) => {
            const image = event.currentTarget;
            if (image.src.endsWith(pokemonArtworkFallback)) return;
            image.removeAttribute('srcset');
            image.src = pokemonArtworkFallback;
            image.alt = `Artwork unavailable for ${name}`;
          }}
        />
      </div>

      <div className={styles.typeSection}>
        <div className={styles.typesList}>
          {types.map((t) => (
            <div
              key={t.label}
              className={styles.typeBadge}
              style={{ backgroundColor: t.background }}
            >
              <span className={styles.typeText} style={{ color: getReadableTextColor(t.background) }}>{t.label}</span>
            </div>
          ))}
        </div>

        <span className={styles.actionButton} aria-hidden="true">
          <span className={styles.plusIcon} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};
