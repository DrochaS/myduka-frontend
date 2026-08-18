# MyDuka Frontend

React + Vite SPA for MyDuka. Staging and production deploys target **Vercel** or **Netlify**.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables

| Variable        | Description                                      |
|-----------------|--------------------------------------------------|
| `VITE_APP_ENV`  | `development` \| `staging` \| `production`       |
| `VITE_API_URL`  | Backend API base URL (no trailing slash)         |

Use `.env.staging.example` as a template for staging builds. Set the same keys in the Vercel/Netlify project dashboard for each environment.

## Scripts

| Script              | Purpose                          |
|---------------------|----------------------------------|
| `npm run dev`       | Local development server         |
| `npm run build`     | Production build                 |
| `npm run build:staging` | Staging-mode Vite build     |
| `npm run preview`   | Preview production build locally |
| `npm run lint`      | Run Oxlint                       |

## Staging deploy (Vercel / Netlify)

This repo includes:

- `vercel.json` — Vite build output + SPA rewrite to `index.html`
- `netlify.toml` — build/`dist` publish + SPA redirect + staging context

### Recommended branch mapping

| Branch    | Environment |
|-----------|-------------|
| `staging` | Staging     |
| `main`    | Production  |

### Vercel

1. Import the GitHub repo in Vercel.
2. Framework preset: Vite (build `npm run build`, output `dist`).
3. Create a Staging environment linked to the `staging` branch.
4. Set `VITE_APP_ENV=staging` and `VITE_API_URL` for Staging; use production values for Production.

### Netlify

1. Import the GitHub repo in Netlify (config is read from `netlify.toml`).
2. Deploy `staging` as a branch deploy / staging site.
3. Set `VITE_APP_ENV` and `VITE_API_URL` under Site settings → Environment variables (per deploy context).

## CI

GitHub Actions runs install, tests, and a production build on pushes/PRs to `main`, `develop`, and `staging`.
