import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Header } from './components/Header';
import { PokemonTypes } from './filters/PokemonTypes';
import { PokemonList } from './list/PokemonList';
import { FavoritesFilter } from './filters/FavoritesFilter';
import styles from './PokemonContainer.module.css';

const PokemonDetailModal = lazy(() =>
  import('./detail/PokemonDetailModal').then(({ PokemonDetailModal }) => ({ default: PokemonDetailModal })),
);

const PokemonDetailModalLoader = () => {
  const isModalOpen = useSelector((state: RootState) => state.pokemon.isModalOpen);
  if (!isModalOpen) return null;

  return (
    <Suspense fallback={null}>
      <PokemonDetailModal />
    </Suspense>
  );
};

export const PokemonContainer: React.FC = () => {
  return (
    <main className={styles.container}>
      <div className={styles.stickyControls}>
        <Header />
        <div className={styles.filterSection}>
          <FavoritesFilter />
          <PokemonTypes />
        </div>
      </div>

      <div className={styles.listSection}>
        <PokemonList />
      </div>
      <PokemonDetailModalLoader />
    </main>
  );
};
