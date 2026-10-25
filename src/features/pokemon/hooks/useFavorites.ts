import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { setFavoritesOnly, toggleFavorite } from '../pokemonSlice';

export const useFavorites = (pokemonId?: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useSelector((state: RootState) => state.pokemon.favoriteIds);
  const favoritesOnly = useSelector((state: RootState) => state.pokemon.favoritesOnly);
  const isFavorite = pokemonId !== undefined && favoriteIds.includes(pokemonId);
  const toggle = useCallback((id: number) => dispatch(toggleFavorite(id)), [dispatch]);
  const setOnly = useCallback((only: boolean) => dispatch(setFavoritesOnly(only)), [dispatch]);

  return { favoriteIds, favoritesOnly, isFavorite, toggleFavorite: toggle, setFavoritesOnly: setOnly };
};
