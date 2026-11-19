# Font Proof (SvelteKit)

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # type check
npm run build    # static site in build/ for tools.jmsole.cl/proof/ (upload build/'s contents there)
npm run preview  # serve that build at http://localhost:4173/proof/
```

- `src/routes/` — pages: `/` (Latin 1) and `/[edition]` (Arabic, Latin 2, African Latin)
- `src/lib/editions/` — each edition's tabs; add a file here (and to `index.ts`) for a new script
- `src/lib/content/` — test content: static HTML per tab, waterfall texts as JSON
- `src/lib/fonts/` — loading, parsing (lib-font) and keeping fonts across reloads (IndexedDB)
- `src/lib/settings.svelte.ts` — OpenType features, CSS options, variable axes
- `src/app.css` — the stylesheet (from `css/styles-v11.css`)

Built files get content hashes in their names, so there is no manual version suffix to bump.
