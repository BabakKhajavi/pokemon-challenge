import { useEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, type TabItem } from '../../../components/Tabs/Tabs';
import type { AppDispatch, RootState } from '../../../store';
import { useGetPokemonQuery, useGetPokemonSpeciesQuery } from '../api/pokemonApiSlice';
import { closePokemonModal } from '../pokemonSlice';
import type { PokemonListItem } from '../types';
import { PokemonAbout } from './PokemonAbout';
import { PokemonDetailCard } from './PokemonDetailCard';
import { PokemonMoves } from './PokemonMoves';
import { PokemonStats } from './PokemonStats';
import styles from './PokemonDetailModal.module.css';

const tabs: TabItem[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'moves', label: 'Moves' },
  { id: 'about', label: 'About' },
];

export const PokemonDetailModal = () => {
  const { selectedPokemon, isModalOpen } = useSelector((state: RootState) => state.pokemon);

  if (!isModalOpen || !selectedPokemon) return null;
  return <PokemonDetailDialog key={selectedPokemon.id} selectedPokemon={selectedPokemon} />;
};

const PokemonDetailDialog = ({ selectedPokemon }: { selectedPokemon: PokemonListItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('stats');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { data: pokemon, isLoading, isError } = useGetPokemonQuery(selectedPokemon.id);
  const { data: species, isLoading: isSpeciesLoading, isError: isSpeciesError } =
    useGetPokemonSpeciesQuery(pokemon ? pokemon.speciesId : skipToken);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
      else document.querySelector<HTMLElement>('[aria-label="Pokémon view"] button[aria-pressed="true"]')?.focus();
    };
  }, []);

  const handleClose = () => dispatch(closePokemonModal());
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    handleClose();
  };
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) handleClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="pokemon-detail-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 id="pokemon-detail-title">Pokémon Details</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            aria-label="Close Pokémon details"
            onClick={handleClose}
          >
            ×
          </button>
        </header>

        <div className={styles.scrollBody}>
          {isLoading && <p className={styles.status} role="status">Loading Pokémon details...</p>}
          {isError && <p className={styles.status} role="alert">Could not load Pokémon details.</p>}
          {pokemon && (
            <>
              <PokemonDetailCard pokemon={pokemon} />
              <section className={styles.tabSection}>
                <Tabs label="Pokémon detail sections" tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
                  {activeTab === 'stats' && <PokemonStats pokemon={pokemon} />}
                  {activeTab === 'moves' && <PokemonMoves pokemon={pokemon} />}
                  {activeTab === 'about' && (
                    isSpeciesLoading ? <p role="status">Loading species information...</p> :
                    isSpeciesError ? <p role="alert">Could not load species information.</p> :
                    species ? <PokemonAbout pokemon={pokemon} species={species} /> : null
                  )}
                </Tabs>
              </section>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
};
