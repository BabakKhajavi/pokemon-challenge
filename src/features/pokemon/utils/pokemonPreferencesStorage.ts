import { TYPE_COLORS, type PokemonPreferences } from '../types';

const storageKey = 'pokemon.preferences.v1';
const defaults: PokemonPreferences = {
  selectedTypes: [],
  favoriteIds: [],
  pokemonTheme: 'default',
  colorMode: 'light',
};

export const loadPokemonPreferences = (): PokemonPreferences => {
  if (typeof window === 'undefined') return { ...defaults };
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? '{}') as Partial<PokemonPreferences>;
    return {
      selectedTypes: Array.isArray(saved.selectedTypes)
        ? [...new Set(saved.selectedTypes.filter((type): type is string =>
            typeof type === 'string' && Object.hasOwn(TYPE_COLORS, type)))]
        : [],
      favoriteIds: Array.isArray(saved.favoriteIds)
        ? [...new Set(saved.favoriteIds.filter((id): id is number =>
            typeof id === 'number' && Number.isSafeInteger(id) && id > 0))]
        : [],
      pokemonTheme: saved.pokemonTheme === 'default' ||
        (typeof saved.pokemonTheme === 'string' && Object.hasOwn(TYPE_COLORS, saved.pokemonTheme))
        ? saved.pokemonTheme : 'default',
      colorMode: saved.colorMode === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { ...defaults };
  }
};

export const savePokemonPreferences = (patch: Partial<PokemonPreferences>) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ ...loadPokemonPreferences(), ...patch }));
  } catch {
    // Storage may be unavailable; the current session still works.
  }
};
