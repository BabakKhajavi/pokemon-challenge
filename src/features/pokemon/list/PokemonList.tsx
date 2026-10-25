import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ContainedButton } from '../../../components/ContainedButton/ContainedButton';
import { PokemonCard } from './PokemonCard';
import styles from './PokemonList.module.css';
import { pokemonApiSlice, useGetPokemonDetailsByIdsQuery, useGetPokemonListInfiniteQuery } from '../api/pokemonApiSlice';
import { useFavorites } from '../hooks/useFavorites';
import { selectPokemon } from '../pokemonSlice';
import type { PokemonListItem } from '../types';
import type { AppDispatch, RootState } from '../../../store';

interface PokemonListCardProps {
  pokemon: PokemonListItem;
  prioritizeImage: boolean;
  onSelect: (pokemon: PokemonListItem) => void;
}

const PokemonListCard = memo(function PokemonListCard({ pokemon, prioritizeImage, onSelect }: PokemonListCardProps) {
  const handleSelect = useCallback(() => onSelect(pokemon), [onSelect, pokemon]);

  return (
    <article className={styles.cardWrapper}>
      <PokemonCard
        pokemonId={pokemon.id}
        name={pokemon.name}
        number={pokemon.number}
        types={pokemon.types}
        imageSrc={pokemon.imageSrc}
        prioritizeImage={prioritizeImage}
        onSelect={handleSelect}
      />
    </article>
  );
});

export const PokemonList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteIds, favoritesOnly } = useFavorites();
  const selectedTypes = useSelector((state: RootState) => state.pokemon.selectedTypes);

  const {
    data,
    isLoading: isListLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPokemonListInfiniteQuery();
  const { currentData: pokemonByIds, isLoading: isFavoritesLoading, isError: isFavoritesError } =
    useGetPokemonDetailsByIdsQuery(favoriteIds, { skip: !favoritesOnly || favoriteIds.length === 0 });

  const pokemonList = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );
  const detailSelectors = useMemo(
    () => pokemonList.map((pokemon) => pokemonApiSlice.endpoints.getPokemon.select(pokemon.id)),
    [pokemonList],
  );
  const detailQueries = useSelector(
    (state: RootState) => detailSelectors.map((selectDetail) => selectDetail(state)),
    shallowEqual,
  );
  const favoritePokemon = pokemonByIds?.pokemon;
  const failedFavoriteIds = pokemonByIds?.failedIds.length ?? 0;
  const sourcePokemon = useMemo(
    () => favoritesOnly
      ? favoritePokemon ?? []
      : pokemonList.map((pokemon, index) => detailQueries[index]?.data ?? pokemon),
    [favoritesOnly, favoritePokemon, pokemonList, detailQueries],
  );
  const isLoadingMatchingTypes = !favoritesOnly && selectedTypes.length > 0 &&
    detailQueries.some((query) => query.isUninitialized || query.isLoading);
  const hasDetailError = !favoritesOnly && detailQueries.some((query) => query.isError);
  const visiblePokemon = useMemo(
    () => selectedTypes.length === 0
      ? sourcePokemon
      : sourcePokemon.filter((pokemon: PokemonListItem) =>
          selectedTypes.every((selectedType) =>
            pokemon.types.some((type) => type.label.toLowerCase() === selectedType),
          ),
        ),
    [sourcePokemon, selectedTypes],
  );
  let emptyMessage = 'No Pokémon match the selected types.';
  if (favoritesOnly) {
    emptyMessage = favoriteIds.length === 0
      ? 'No favorites yet. Select a heart to save a Pokémon.'
      : 'No favorites match the selected types.';
  }
  const showEmptyMessage = visiblePokemon.length === 0 &&
    !isFetchingNextPage && !isLoadingMatchingTypes && !hasDetailError;

  useEffect(() => {
    pokemonList.forEach((pokemon) => {
      void dispatch(pokemonApiSlice.endpoints.getPokemon.initiate(pokemon.id, { subscribe: false }));
    });
  }, [dispatch, pokemonList]);

  const handleSelectPokemon = useCallback((pokemon: PokemonListItem) => {
    dispatch(selectPokemon(pokemon));
  }, [dispatch]);
  const handleLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  if (favoritesOnly ? isFavoritesLoading : isListLoading) {
    return (
      <div className={styles.loadingContainer} aria-live="polite" role="status">
        <p>Loading Pokémon...</p>
      </div>
    );
  }

  if ((favoritesOnly && isFavoritesError) || (!favoritesOnly && isError && !data)) {
    return <p role="alert">Could not load Pokémon. Please try again.</p>;
  }


  return (
    <section className={styles.pokemonSection} aria-labelledby="pokemon-list-heading">
      <h2 id="pokemon-list-heading" className={styles.visuallyHidden}>Pokémon</h2>
      <p className={styles.visuallyHidden} role="status" aria-live="polite">
        {visiblePokemon.length} Pokémon shown{favoritesOnly ? ' in favorites' : ''}.
      </p>
      <div className={styles.gridContainer}>
        {visiblePokemon.map((pokemon, index) => (
          <PokemonListCard
            key={pokemon.id}
            pokemon={pokemon}
            prioritizeImage={index === 0}
            onSelect={handleSelectPokemon}
          />
        ))}
      </div>
      {visiblePokemon.length === 0 && isLoadingMatchingTypes && (
        <p role="status">Loading matching Pokémon...</p>
      )}
      {showEmptyMessage && <p>{emptyMessage}</p>}
      {!favoritesOnly && hasNextPage && (
        <div className={styles.loadMoreContainer}>
          <ContainedButton
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading Pokémon...' : 'Load More Pokémon'}
          </ContainedButton>
        </div>
      )}
      {!favoritesOnly && isError && data && (
        <p role="alert">Could not load the next page. Please try again.</p>
      )}
      {hasDetailError && <p role="alert">Some Pokémon details could not load.</p>}
      {favoritesOnly && failedFavoriteIds > 0 && (
        <p role="alert">Could not load {failedFavoriteIds} saved Pokémon. Other favorites are shown.</p>
      )}
    </section>
  );
};
