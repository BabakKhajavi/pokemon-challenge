import React, { useId, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Header } from './components/Header';
import { PokemonTypes } from './filters/PokemonTypes';
import { PokemonList } from './list/PokemonList';
import { PokemonDetailModal } from './detail/PokemonDetailModal';
import { FavoritesFilter } from './filters/FavoritesFilter';
import styles from './PokemonContainer.module.css';

export const PokemonContainer: React.FC = () => {
  return (
    <main className={styles.container} role="main">
      <div className={styles.stickyControls}>
        <Header />
        <div className={styles.filterSection}>
          <FavoritesFilter />
          <TypeFilter />
        </div>
      </div>

      <div className={styles.listSection}>
        <PokemonList />
      </div>
      <PokemonDetailModal />
    </main>
  );
};

const TypeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = useSelector((state: RootState) => state.pokemon.selectedTypes.length);
  const headingId = useId();
  const optionsId = useId();

  return (
    <>
      <div className={styles.filterHeadingRow}>
        <h2 id={headingId} className={styles.filterTitle}>Filter by type</h2>
        <button
          type="button"
          className={styles.mobileFilterToggle}
          aria-expanded={isOpen}
          aria-controls={optionsId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Hide types' : selectedCount ? `Show types (${selectedCount} selected)` : 'Show types'}
          <span className={styles.disclosureIcon} aria-hidden="true" />
        </button>
      </div>
      <div
        id={optionsId}
        className={`${styles.filterPills} ${isOpen ? styles.filterPillsOpen : ''}`}
        role="group"
        aria-labelledby={headingId}
      >
        <PokemonTypes />
      </div>
    </>
  );
};
