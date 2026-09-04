# MyDuka Frontend

React + Vite frontend for MyDuka, an inventory management system with merchant, admin, and clerk roles.

## Stack

- React 19, React Router, Redux Toolkit
- Chart.js / react-chartjs-2 for analytics dashboards
- Axios for API calls
- Vitest + Testing Library for tests

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run test` — run tests
- `npm run lint` — lint with oxlint

## Backend

Talks to the [MyDuka Flask API](https://github.com/DrochaS/myduka-backend). Set `VITE_API_URL` in `.env` to point at it.
