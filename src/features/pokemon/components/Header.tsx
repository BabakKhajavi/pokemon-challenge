import { useEffect, useState } from 'react';
import { Dropdown } from '../../../components/Dropdown/Dropdown';
import { TYPE_COLORS } from '../types';
import { loadPokemonPreferences, savePokemonPreferences } from '../utils/pokemonPreferencesStorage';
import styles from './Header.module.css';

const themeOptions = [
  { label: 'Default Theme', value: 'default' },
  ...Object.entries(TYPE_COLORS).map(([type, color]) => ({
    label: `${type.charAt(0).toUpperCase()}${type.slice(1)} Type`,
    value: type,
    color,
  })),
];

export const Header = () => {
  const [currentTheme, setCurrentTheme] = useState(() => loadPokemonPreferences().pokemonTheme);
  const [isDarkTheme, setIsDarkTheme] = useState(() => loadPokemonPreferences().colorMode === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkTheme ? 'dark' : 'light';
    savePokemonPreferences({ colorMode: isDarkTheme ? 'dark' : 'light' });
  }, [isDarkTheme]);

  useEffect(() => {
    document.documentElement.dataset.pokemonTheme = currentTheme;
    savePokemonPreferences({ pokemonTheme: currentTheme });
  }, [currentTheme]);

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.title}>Pocket Pokédex</h1>
      <div className={styles.controlsContainer}>
        <Dropdown
          label="Select theme"
          value={currentTheme}
          options={themeOptions}
          onChange={setCurrentTheme}
          leadingIcon={<span className={styles.themeIcon} />}
        />
        <button
          type="button"
          className={styles.themeToggleButton}
          onClick={() => setIsDarkTheme((dark) => !dark)}
          aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <span className={styles.toggleVector} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
