import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PokemonTypes.module.css';
import { useGetPokemonTypesQuery } from '../api/pokemonApiSlice';
import { toggleSelectedType } from '../pokemonSlice';
import { TYPE_COLORS } from '../types';
import { getReadableTextColor } from '../utils/getReadableTextColor';
import type { AppDispatch, RootState } from '../../../store';

const displayOrder = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const PokemonTypes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTypes = useSelector((state: RootState) => state.pokemon.selectedTypes);
  const { data: pokemonTypes = [], isLoading: isTypesLoading, isError } =
    useGetPokemonTypesQuery();

  if (isTypesLoading) {
    return <div className={styles.filterTags} role="status">Loading types...</div>;
  }

  if (isError) return <p role="alert">Could not load Pokémon types.</p>;

  return (
    <div className={styles.filterTags}>
      {pokemonTypes
        .filter((typeObj) => displayOrder.includes(typeObj.name.toLowerCase()))
        .sort((a, b) =>
          displayOrder.indexOf(a.name.toLowerCase()) -
          displayOrder.indexOf(b.name.toLowerCase()),
        )
        .map((typeObj) => {
        const typeName = typeObj.name.toLowerCase();
        const isSelected = selectedTypes.includes(typeName);
        const color = TYPE_COLORS[typeName] || '#A8A878';

        return (
          <button
            key={typeName}
            type="button"
            className={`${styles.typeBadge} ${isSelected ? styles.fillTrue : styles.fillFalse}`}
            style={
              isSelected
                ? { backgroundColor: color, borderColor: color, color: getReadableTextColor(color) }
                : { borderColor: `color-mix(in srgb, ${color} 65%, var(--text))`, color: 'var(--text)' }
            }
            onClick={() => dispatch(toggleSelectedType(typeName))}
            aria-pressed={isSelected}
          >
            {isSelected && <span aria-hidden="true">✓</span>}
            <span className={styles.tagText}>
              {typeObj.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
