# Hana — Cloudflare Pages deployment

The repository keeps the full Hana application build and also provides a frontend-only build specifically for Cloudflare Pages.

## Cloudflare Pages settings

- Production branch: `main`
- Root directory: `/`
- Build command: `pnpm build:cloudflare`
- Build output directory: `dist/public`
- Node.js: use the current Cloudflare-supported Node version
- Package manager: `pnpm` (the repository declares `pnpm@10.34.4`)

Cloudflare Pages should install dependencies, run the Vite build, and publish `dist/public`.

## What this build contains

The published frontend includes the cinematic Hana Phase 1 opening, bright/dark themes, the main menu, roadmap, projects, opportunities, mission UI, and chat UI.

`client/public/_redirects` provides SPA fallback routing so direct visits to client-side routes resolve to `index.html`.

## Important backend note

The repository also contains the existing Express/tRPC server. `pnpm build` builds both the Vite frontend and the server bundle. Cloudflare Pages is being used here as the static frontend deployment target, so server-side API routes are not automatically hosted by Pages just by publishing `dist/public`.

If the live deployment needs the existing server-backed tRPC/chat/database functionality, deploy the server separately or migrate those endpoints to Cloudflare Workers/Pages Functions. Do not remove the existing server code just to make the static frontend deploy.
