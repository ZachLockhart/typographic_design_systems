# Retro-Ink / Engraved Modernism — v2.0 exploration

One stylesheet and one dependency-free ornament engine, replacing the duplicated
v1 Day and Night packages (kept unchanged in `../retro-ink-day/` and `../retro-ink-night/`).

| File | Purpose |
|------|---------|
| `em.css` | Tokens, type roles, layout, components. Scoped under `.em`. Themes: `em--mid` (dimmed Day, #DCDCDC paper), `em--night`, `em--night em--signal`. Type sets: `em--type-classic` (default), `em--type-scotch`, `em--type-precision`. |
| `em-ornaments.js` | Generates engraved SVG ornaments in `currentColor` from `data-em` elements: `guilloche`, `ribbon`, `scale`, `dial`, `moon`, `optics`, `plot`, `hatch`. Also wires the theme/type switch buttons. |
| `em-watch.js` | Dev-only auto-reload used by the docs and examples (watches the page and its local CSS/JS). Omit in production. |
| `tools/export-svg.js` | `node tools/export-svg.js [outDir] [color]` — writes static SVG versions of the presets. |
| `assets/` | Static exports (currentColor; standalone fallback black). |

Documentation: `../html/index.html` · Examples: `../html-examples/index.html`

```html
<link rel="stylesheet" href="engraved-modernism/em.css">
<script src="engraved-modernism/em-ornaments.js" defer></script>
<body class="em em--night"> … <div data-em="guilloche" data-preset="medallion"></div>
```

Fonts load from Google Fonts (network needed). All example values are illustrative.
