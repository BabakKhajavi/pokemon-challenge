import artworkIds from '../assets/artworkIds.json';

const availableArtwork = new Set<number>(artworkIds);

export const pokemonArtworkFallback = `${import.meta.env.BASE_URL}assets/pokemon-artwork-unavailable.svg`;

export const getPokemonArtwork = (id: number, size?: 160 | 256): string | null =>
  availableArtwork.has(id)
    ? `${import.meta.env.BASE_URL}pokemon-artwork/v1/${size ? `card-${size}/` : ''}${id}.webp`
    : null;
