# Deployment Guide: No-Show Reducer

This repository is deployable in three supported modes.

## 1. GitHub Pages

The default public deployment is GitHub Pages. The app is static and uses local browser storage.

- URL: https://volta-npo.github.io/no-show-reducer/
- Build command: `npm run build`
- Output: checked-in static assets at repository root and `src/*.js` compiled from TypeScript

## 2. Docker

```bash
make docker-build
make docker-run
```

The container serves the static app with hardened Nginx headers on port `8080`. Compose maps it to `4173`.

## 3. Backend services

This product is intentionally static-only today. If it later needs server-side workflows, add them under `backend/` and extend `docs/API.md`.

## Production checklist

- Run `make release-check`.
- Confirm no client secrets or regulated data are committed.
- Confirm GitHub Actions CI is green.
- Confirm GitHub Pages is built.
- Use exported JSON bundles for client-owned backups.
