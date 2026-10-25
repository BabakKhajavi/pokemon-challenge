import React, { useId, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PokemonTypes.module.css';
import { useGetPokemonTypesQuery } from '../api/pokemonApiSlice';
import { toggleSelectedType } from '../pokemonSlice';
import { TYPE_COLORS, type PokemonType } from '../types';
import { getReadableTextColor } from '../utils/getReadableTextColor';
import type { AppDispatch, RootState } from '../../../store';

const displayOrder = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const PokemonTypes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headingId = useId();
  const optionsId = useId();
  const selectedTypes = useSelector((state: RootState) => state.pokemon.selectedTypes);
  const { data: pokemonTypes, isLoading: isTypesLoading, isError } =
    useGetPokemonTypesQuery();
  const orderedTypes = useMemo(
    () => (pokemonTypes ?? [])
      .filter((typeObj) => displayOrder.includes(typeObj.name.toLowerCase()))
      .sort((a, b) =>
        displayOrder.indexOf(a.name.toLowerCase()) -
        displayOrder.indexOf(b.name.toLowerCase()),
      ),
    [pokemonTypes],
  );

  return (
    <div data-type-filter-open={isOpen}>
      <div className={styles.filterHeadingRow}>
        <h2 id={headingId} className={styles.filterTitle}>Filter by type</h2>
        <button
          type="button"
          className={styles.mobileFilterToggle}
          aria-expanded={isOpen}
          aria-controls={optionsId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Hide types' : selectedTypes.length ? `Show types (${selectedTypes.length} selected)` : 'Show types'}
          <span className={styles.disclosureIcon} aria-hidden="true" />
        </button>
      </div>
      <div
        id={optionsId}
        className={`${styles.filterPills} ${isOpen ? styles.filterPillsOpen : ''}`}
        role="group"
        aria-labelledby={headingId}
      >
        <PokemonTypeOptions
          types={orderedTypes}
          selectedTypes={selectedTypes}
          isLoading={isTypesLoading}
          isError={isError}
        />
      </div>
    </div>
  );
};

interface PokemonTypeOptionsProps {
  types: PokemonType[];
  selectedTypes: string[];
  isLoading: boolean;
  isError: boolean;
}

const PokemonTypeOptions = ({ types, selectedTypes, isLoading, isError }: PokemonTypeOptionsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  if (isLoading) return <div className={styles.filterTags} role="status">Loading types...</div>;
  if (isError) return <p role="alert">Could not load Pokémon types.</p>;

  return (
    <div className={styles.filterTags}>
      {types.map((typeObj) => {
        const typeName = typeObj.name.toLowerCase();
        const isSelected = selectedTypes.includes(typeName);
        const color = TYPE_COLORS[typeName] || '#A8A878';

        return (
          <button
            key={typeName}
            type="button"
            className={`${styles.typeBadge} ${isSelected ? styles.fillTrue : ''}`}
            style={{
              '--type-color': color,
              '--type-text-color': getReadableTextColor(color),
            } as React.CSSProperties}
            onClick={() => dispatch(toggleSelectedType(typeName))}
            aria-pressed={isSelected}
          >
            {isSelected && <span aria-hidden="true">✓</span>}
            <span className={styles.tagText}>{typeObj.name}</span>
          </button>
        );
      })}
    </div>
  );
};
