import { expect, test, type Page } from '@playwright/test';

const pokemon = [
  { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
  { id: 2, name: 'ivysaur', types: ['grass', 'poison'] },
  { id: 4, name: 'charmander', types: ['fire'] },
  { id: 7, name: 'squirtle', types: ['water'] },
];

const resource = (name: string, id = 1) => ({ name, url: `https://pokeapi.co/api/v2/${name}/${id}/` });
const responseFor = (id: number) => {
  const item = pokemon.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unexpected Pokémon ${id}`);
  return {
    id,
    name: item.name,
    height: 7,
    weight: 69,
    base_experience: 64,
    species: { name: item.name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } } },
    types: item.types.map((name) => ({ type: resource(name) })),
    abilities: [{ ability: resource('overgrow'), is_hidden: false }],
    stats: [{ base_stat: 45, stat: resource('hp') }],
    moves: [{ move: resource('tackle'), version_group_details: [
      { level_learned_at: 1, move_learn_method: resource('level-up') },
    ] }],
  };
};

async function mockApi(page: Page) {
  await page.route('https://pokeapi.co/api/v2/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace('/api/v2/', '').replace(/\/$/, '');
    let body: unknown;
    if (path === 'type') {
      body = { count: 3, next: null, previous: null, results: ['grass', 'poison', 'fire', 'water'].map((name) => resource(name)) };
    } else if (path === 'pokemon') {
      const offset = Number(url.searchParams.get('offset') ?? 0);
      body = {
        count: 4,
        next: offset === 0 ? 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=2' : null,
        previous: null,
        results: pokemon.slice(offset, offset + 2).map(({ id, name }) => ({
          name, url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
        })),
      };
    } else if (/^pokemon\/\d+$/.test(path)) {
      body = responseFor(Number(path.split('/')[1]));
    } else if (/^pokemon-species\/\d+$/.test(path)) {
      const id = Number(path.split('/')[1]);
      body = {
        name: pokemon.find((item) => item.id === id)?.name,
        capture_rate: 45,
        growth_rate: resource('medium-slow'),
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
        flavor_text_entries: [{ flavor_text: 'A strange seed grows on its back.', language: resource('en') }],
        genera: [{ genus: 'Seed Pokémon', language: resource('en') }],
      };
    } else if (path === 'evolution-chain/1') {
      body = {
        chain: { species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          evolution_details: [], evolves_to: [] },
      };
    } else {
      throw new Error(`Unmocked API request: ${url}`);
    }
    await route.fulfill({ json: body });
  });
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('filters by every selected type and loads the next page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'View details for bulbasaur' })).toBeVisible();
  await page.getByRole('button', { name: 'Load More Pokémon' }).click();
  await expect(page.getByRole('button', { name: 'View details for charmander' })).toBeVisible();

  await page.getByRole('button', { name: 'grass', exact: true }).click();
  await page.getByRole('button', { name: 'poison', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View details for bulbasaur' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'View details for charmander' })).toHaveCount(0);
  await page.getByRole('button', { name: 'fire', exact: true }).click();
  await expect(page.getByText('No Pokémon match the selected types.')).toBeVisible();
});

test('favorites do not open the modal and survive reload', async ({ page }) => {
  await page.goto('/');
  const favorite = page.getByRole('button', { name: 'Favorite bulbasaur' });
  await expect(favorite).toBeVisible();
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Favorites', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View details for bulbasaur' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'View details for ivysaur' })).toHaveCount(0);
});

test('shows loaded saved Pokémon when another detail request fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('pokemon.preferences.v1', JSON.stringify({ favoriteIds: [1, 2] }));
  });
  await page.route(/\/api\/v2\/pokemon\/2\/?$/, (route) =>
    route.fulfill({ status: 503, json: { detail: 'Unavailable' } }),
  );

  await page.goto('/');
  await page.getByRole('button', { name: 'Favorites', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View details for bulbasaur' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'View details for ivysaur' })).toHaveCount(0);
  await expect(page.getByRole('alert').filter({ hasText: 'Could not load 1 saved Pokémon.' })).toBeVisible();
});

test('uses a local placeholder when Pokémon artwork is unavailable', async ({ page }) => {
  await page.route(/\/api\/v2\/pokemon\?/, (route) => route.fulfill({ json: {
    count: 1,
    next: null,
    previous: null,
    results: [{ name: 'missingno', url: 'https://pokeapi.co/api/v2/pokemon/10264/' }],
  } }));
  await page.route(/\/api\/v2\/pokemon\/10264\/?$/, (route) => route.fulfill({ json: {
    ...responseFor(1),
    id: 10264,
    name: 'missingno',
  } }));

  await page.goto('/');
  const artwork = page.getByRole('img', { name: 'Artwork unavailable for missingno' });
  await expect(artwork).toBeVisible();
  await expect(artwork).toHaveAttribute('src', '/assets/pokemon-artwork-unavailable.svg');
  await expect(artwork).not.toHaveAttribute('srcset');

  await page.getByRole('button', { name: 'View details for missingno' }).click();
  await expect(page.getByRole('dialog').getByRole('img', { name: 'Artwork unavailable for missingno' })).toBeVisible();
});

test('modal tabs work and reopening uses the cached detail', async ({ page }) => {
  let bulbasaurRequests = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/v2/pokemon/1') bulbasaurRequests += 1;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'View details for bulbasaur' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('tab', { name: 'Stats' })).toHaveAttribute('aria-selected', 'true');
  await dialog.getByRole('tab', { name: 'Moves' }).click();
  await expect(dialog.getByText('tackle', { exact: true })).toBeVisible();
  await dialog.getByRole('tab', { name: 'About' }).click();
  await expect(dialog.getByText('A strange seed grows on its back.')).toBeVisible();
  await dialog.getByRole('button', { name: 'Close Pokémon details' }).click();
  await expect(dialog).toHaveCount(0);
  const beforeReopen = bulbasaurRequests;
  await page.getByRole('button', { name: 'View details for bulbasaur' }).click();
  await expect(dialog).toBeVisible();
  expect(bulbasaurRequests).toBe(beforeReopen);
});

test('theme choice and color mode survive reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Select theme: Default Theme' }).click();
  await page.getByRole('menuitemradio', { name: 'Fire Type' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-pokemon-theme', 'fire');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-pokemon-theme', 'fire');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test.describe('mobile artwork', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });

  test('selects a card-sized image', async ({ page }) => {
    await page.goto('/');
    const image = page.getByRole('img', { name: 'bulbasaur' }).first();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.currentSrc))
      .toContain('/pokemon-artwork/v1/card-256/1.webp');
  });
});
