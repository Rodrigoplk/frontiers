# Next.js → GitHub Pages (estático)

- `next build && next export` genera `./out`.
- El workflow `.github/workflows/pages.yml` despliega `./out` a GitHub Pages.
- Si este repo **no** es `usuario.github.io`, ajusta `repo` en `next.config.js`.

## Scripts
- `npm run dev` – desarrollo local
- `npm run build` – compila y exporta a `out/`
