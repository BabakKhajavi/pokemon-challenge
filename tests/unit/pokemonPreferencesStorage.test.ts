import {
  loadPokemonPreferences,
  savePokemonPreferences,
} from '../../src/features/pokemon/utils/pokemonPreferencesStorage';

const key = 'pokemon.preferences.v1';

describe('Pokémon preferences storage', () => {
  it('ignores corrupt and invalid saved values', () => {
    window.localStorage.setItem(key, JSON.stringify({
        selectedTypes: ['grass', 'unknown', 'grass'],
        favoriteIds: [1, -2, 1, '3'],
        pokemonTheme: 'invalid',
        colorMode: 'invalid',
      }));
    expect(loadPokemonPreferences()).toEqual({
      selectedTypes: ['grass'],
      favoriteIds: [1],
      pokemonTheme: 'default',
      colorMode: 'light',
    });
  });

  it('preserves other preferences when saving one setting', () => {
    window.localStorage.setItem(key, JSON.stringify({ favoriteIds: [25], colorMode: 'light' }));
    savePokemonPreferences({ colorMode: 'dark' });
    expect(loadPokemonPreferences()).toMatchObject({ favoriteIds: [25], colorMode: 'dark' });
  });
});
