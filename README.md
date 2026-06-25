# MythBindr — Frontend

> _"Your Campaign. Bound by Myth."_

React + Vite + TypeScript client for MythBindr — an assistant for building and
running D&D campaigns.

- **Backend repo:** [ManliestBen/mythbindr-back](https://github.com/ManliestBen/mythbindr-back) (Express API, deployed separately)
- **Product plan & full feature catalog:** [`PLAN.md`](./PLAN.md)

## Stack

- React + Vite + TypeScript, Tailwind CSS (CSS-variable theming)
- React Router; passkey auth UI via [@simplewebauthn/browser](https://simplewebauthn.dev/)

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

The dev server proxies `/api` and `/socket.io` to `http://localhost:4000`, so
run the [backend](https://github.com/ManliestBen/mythbindr-back) locally
(`npm run dev` there) to exercise auth and data. To point at a remote backend
(e.g. the Raspberry Pi), change the proxy target in `vite.config.ts`.

## Themes

Four selectable UI themes (Mythic Gold, Arcane Navy, Parchment Tome, Ember
Violet). Open [`design/theme-preview.html`](./design/theme-preview.html) for a
static reference, or switch them live in **Settings → Appearance**.

## Deploy

Netlify (see [`netlify.toml`](./netlify.toml)) — builds to `dist/`. The backend
is hosted separately on a Raspberry Pi.
