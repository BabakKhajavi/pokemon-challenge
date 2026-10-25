import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { FavoriteButton } from '../../src/features/pokemon/components/FavoriteButton';
import pokemonReducer from '../../src/features/pokemon/pokemonSlice';

it('toggles a favorite without activating the card', async () => {
  const user = userEvent.setup();
  const openCard = jest.fn();
  const store = configureStore({ reducer: { pokemon: pokemonReducer } });

  render(
    <Provider store={store}>
      <div onClick={openCard}>
        <FavoriteButton pokemonId={1} name="bulbasaur" />
      </div>
    </Provider>,
  );

  const heart = screen.getByRole('button', { name: 'Favorite bulbasaur' });
  await user.click(heart);
  expect(heart).toHaveAttribute('aria-pressed', 'true');
  expect(store.getState().pokemon.favoriteIds).toEqual([1]);
  expect(openCard).not.toHaveBeenCalled();

  await user.click(heart);
  expect(heart).toHaveAttribute('aria-pressed', 'false');
  expect(store.getState().pokemon.favoriteIds).toEqual([]);
});
