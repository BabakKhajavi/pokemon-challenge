# Pocket Pokédex

A React and TypeScript Pokédex built with Vite and RTK Query.

## Commands

```bash
npm ci
npm run dev                 # sandbox mode, local dev server
npm run build:sandbox       # readable bundle and source maps
npm run build:stage         # minified bundle and hidden source maps
npm run build              # production bundle; same as build:production
npm run analyze            # production build plus dist/bundle-report.html
npm run preview            # serve the latest dist build
npm run lint
npm run test:unit           # Jest and React Testing Library unit tests
npm run test:e2e            # build and run Playwright browser tests
```

Install the Playwright browser once with `npx playwright install chromium`. The browser tests mock PokéAPI responses and start a local preview server automatically.

Each build writes to `dist`, replacing the previous build. Stage and production also emit gzip copies of suitable assets. The analyzer report is created only by `npm run analyze` and should not be deployed publicly.

GitHub Actions runs lint, unit tests, a branch-specific build, and Playwright tests after changes land on `sandbox` or `production`. It does not run on `staging`.

## Environment configuration

Vite uses `.env.sandbox`, `.env.stage`, and `.env.production` for the corresponding mode. Copy the values in `.env.example` into any of those files when a deployment needs an override:

- `VITE_POKEAPI_BASE_URL` defaults to `https://pokeapi.co/api/v2` for every mode.
- `APP_BASE_PATH` defaults to `/`; set it when the site is deployed under a subpath.

`VITE_` variables are embedded in the client bundle and must not contain secrets. Modes select build settings; they do not change the API endpoint unless you set the variable for that mode.

## Build output

JavaScript entry and vendor chunks use `assets/js/[name]-[hash].js`. CSS and other generated assets use `assets/[name]-[hash][extname]`. The hash changes when the generated content changes. React and Redux dependencies are split into separate chunks for caching and bundle inspection.
