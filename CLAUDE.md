# CLAUDE.md

Guidance for Claude Code when working in this repository, or in any project that uses the
**Retro-Ink / Engraved Modernism** design system for HTML documentation or dashboards.

## What this repository is

A collection of typographic design systems for scientific and technical HTML: documentation,
reports, dashboards and instrument panels. Pure HTML/CSS/JS/SVG, with no build step and no dependencies
(fonts come from Google Fonts).

| Path | What it is | Status |
|------|------------|--------|
| `engraved-modernism/` | **The current system (v2).** `em.css` (tokens, themes, type sets, components), `em-ornaments.js` (generated SVG ornaments + theme/type switch), `em-watch.js` (dev auto-reload), `tools/export-svg.js`, `assets/` (static SVG exports), `README.md` | **Use this** |
| `html/` | Documentation for v2: overview, foundations, typography, ornaments (with a guilloché lab), components with markup | Reference |
| `html-examples/` | Eight example plates built only from v2: almanac, imaging chain, instrument panel, technical report, title page, lunar calendar, type specimen, calibration certificate | Reference |
| `retro-ink/` | v1.0: plain black-and-white e-ink/newspaper system (has its own `CLAUDE.md`) | Frozen |
| `retro-ink-day/`, `retro-ink-night/` | v1 Engraved Modernism Day and Night packages | Frozen |

**Never modify the v1 folders** (`retro-ink*`). They are preserved as reference versions.

## Default behaviour: HTML documentation and dashboards

Whenever you create or edit HTML documentation, reports or dashboards (in this repo, or in a
project that has copied `engraved-modernism/`), use Engraved Modernism v2 unless told otherwise.

1. **Read first.** Read `engraved-modernism/README.md` and skim `engraved-modernism/em.css`. Open the
   closest page in `html-examples/` and treat it as the reference implementation: the instrument panel
   for dashboards, the report for long-form docs, the imaging chain for explanatory pages. The
   components page in `html/` has copy-paste markup for every component.
2. **Load the system** with relative paths. Put `class="em"` on `<body>`.
3. **Include the theme/type switcher** in the page header (see the starter page below) so the reader
   can choose any combination. If the user asks for a fixed look, drop the switcher and put the classes on
   `<body>`, e.g. `class="em em--night em--type-precision"`.
4. **Compose only from existing `em-*` classes and `data-em` ornaments.** Do not invent a new visual
   language. If something is genuinely missing, add it to `em.css` / `em-ornaments.js` in the same style
   and document it in `html/components.html` or `html/ornaments.html`, rather than styling inline.
5. **Respect the data.** Keep the user's values and units exactly. Label invented or sample values as
   illustrative. Never decorate with fake numbers.
6. **Verify.** Render the page in a browser if a browser tool is available, and check desktop and
   phone widths in at least Day and Night. Do not claim visual verification unless you actually looked
   at screenshots; say plainly when only code-level checks were done.
7. **Production pages omit `em-watch.js`.** It is a development auto-reload only.

If a request conflicts with the system, say so, propose the smallest exception, and keep the rest
consistent.

## Design rules

**Do**
- Use two inks only: paper and ink. Make tone with line density (hatching, `data-em="hatch"`,
  guilloché), never with grey fills.
- Use a strong hierarchy: `em-display` / `em-title` / `em-heading` for display type, `em-kicker` >
  `em-label` > `em-meta` for condensed labels, `em-sc` small caps for figure and plate references in prose.
- Use old-style figures in prose (automatic in `.em p`) and tabular lining figures in data (`em-num`, tables,
  metrics, and ornaments, all automatic).
- Use asymmetric grids (`em-grid`, `em-grid--golden`) with generous white space, metric strips with
  precise separators, and booktabs tables (`em-table`, `.n` on numeric columns).
- Make ornament structural: a medallion frames a numeral, a scale divides a masthead, a ribbon closes a
  panel. Use one or two major ornaments per screen, not more.
- Show status as a word plus a glyph (`em-status--ok|warn|fault`), never colour alone.
- Keep charts to one series per plot (`data-em="plot"`). Compare series with small multiples.

**Don't**
- Use gradients, shadows, glows, rounded cards, coloured tiles, emoji, cream/parchment/sepia, paper
  textures, off-black panels or `filter: invert()`.
- Hard-code colours or stroke widths. Always use the tokens (`--em-ink`, `--em-paper`, `--em-hair`,
  `--em-fine`, `--em-line`, `--em-heavy`, `--em-s1`…`--em-s8`).
- Use dual-axis charts, or more than one series distinguished only by ink.
- Make it look like steampunk or a generic web dashboard with decorative borders.

## Themes and type sets

| Class on `<body>` | Paper / ink | Notes |
|---|---|---|
| *(none)* | `#FFFFFF` / `#000000` | Day (default) |
| `em--mid` | `#DCDCDC` / `#000000` | Dimmed Day; neutral grey, never cream |
| `em--night` | `#000000` / `#FFE66D` | Thinner line weights, sturdier display optical size |
| `em--night em--signal` | `#000000` / `#FFFF00` | Maximum-luminance Night |

| Class | Display · Text · Labels | Character |
|---|---|---|
| `em--type-classic` (default) | Bodoni Moda · EB Garamond · Barlow Condensed | Editorial, elegant |
| `em--type-scotch` | Old Standard TT · Old Standard TT · Oswald | Most period-true (19th-c. book) |
| `em--type-precision` | Source Serif 4 · Source Serif 4 · IBM Plex Sans Condensed | Calmest for dense data |

The switcher buttons (`data-em-theme`, `data-em-type`) are wired automatically by `em-ornaments.js`.
The choice persists in localStorage, and URLs accept `?theme=night&type=scotch`. To scope the switch to
part of a page, put `data-em-root` on the wrapper.

## Quick reference

**Layout:** `em-page`, `em-sheet` (`--single`, `--plain`), `em-masthead`, `em-grid` (`--golden`,
`--even`, `--three`, `--top`), `em-ruled-cols`, `em-stack`, `em-center`, `em-prose`.

**Type:** `em-display`, `em-title`, `em-heading`, `em-lede`, `em-quote` (`--large`), `em-attrib`,
`em-numeral`, `em-kicker`, `em-label`, `em-meta`, `em-sc`, `em-italic`, `em-small`, `em-num`,
`em-dropcap`.

**Rules:** `em-rule` (`--heavy`, `--double`, `--thin-thick`, `--dotted`, `--diamond`), `em-vrule`.

**Components:** `em-metrics` > `em-metric` > `em-label` + `em-metric__value` (set `--em-cols`),
`em-steps`, `em-leaders` (with `em-leader` spacer), `em-table` (+ `.n`), `em-figure`, `em-note`,
`em-fn` + `em-footnotes`, `em-colophon` (+ `em-push`), `em-status--ok|warn|fault`, `em-plate`,
`em-medallion` > `[data-em]` + `em-medallion__face`, `em-switch`.

**Ornaments:** empty elements with `data-em`. Options are `data-*` attributes.

| `data-em` | Key options | Typical use |
|---|---|---|
| `guilloche` | `preset` = medallion · seal · band · rosette · v1; `k n amp mod mod-k R r d copies` | Date/number frames, seals, title pages |
| `scale` | `from to major mid minor labels wrap index tail label` | Under mastheads; axes; progress |
| `ribbon` | `n wavelength mod spread vertical` | Panel borders and closers |
| `dial` | `min max value major minor band="lo,hi" title unit decimals show-value` | Gauges in dashboards |
| `moon` | `phase (0–1) angle spacing` | Almanacs, sky panels |
| `optics` | `label` | Engraved figure example |
| `plot` | `points xlabels \| xstart xstep ymin ymax yticks ylabel unit title height hatch` | Single-series charts (hover + screen-reader table) |
| `hatch` | `spacing spacing-end angle cross height` | Tone swatches and fills |

## Starter page

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page Title</title>
<link rel="stylesheet" href="engraved-modernism/em.css">
<script src="engraved-modernism/em-ornaments.js" defer></script>
<!-- dev only: <script src="engraved-modernism/em-watch.js" defer></script> -->
</head>
<body class="em">
<div class="em-page">
  <main class="em-sheet">
    <header class="em-masthead">
      <span class="em-kicker">Section</span>
      <div class="em-switch">
        <div class="em-switch__group" role="group" aria-label="Theme">
          <button type="button" data-em-theme="day">Day</button>
          <button type="button" data-em-theme="mid">Mid</button>
          <button type="button" data-em-theme="night">Night</button>
          <button type="button" data-em-theme="signal">Signal</button>
        </div>
        <div class="em-switch__group" role="group" aria-label="Type set">
          <button type="button" data-em-type="classic">Classic</button>
          <button type="button" data-em-type="scotch">Scotch</button>
          <button type="button" data-em-type="precision">Precision</button>
        </div>
      </div>
    </header>
    <div data-em="scale" data-minor="2"></div>

    <div class="em-grid">
      <div><!-- figure, medallion or dial --></div>
      <div>
        <h1 class="em-title">Title</h1>
        <p class="em-lede">One-line standfirst.</p>
        <p>Body text.</p>
      </div>
    </div>

    <div class="em-metrics">
      <div class="em-metric"><span class="em-label">Metric</span><span class="em-metric__value">0.00<small>unit</small></span></div>
    </div>
    <footer class="em-colophon"><span>Project</span><span>Page</span><span class="em-push">Values illustrative</span></footer>
  </main>
</div>
</body>
</html>
```

## Editing the system itself

- Make changes in `engraved-modernism/`, then update the matching docs page in `html/` and any affected
  example in `html-examples/`. Docs, examples and code must stay in sync.
- A new theme or type set needs: tokens in `em.css`, handling in `apply()` in `em-ornaments.js`, a
  button in **every** page's switcher, and an entry in `html/foundations.html` or `html/typography.html`.
- Ornament generators must stay pure (`(opts, W, H) → SVG string`), draw in `currentColor` with the
  stroke classes `h f l k`, and work in Node. After changing them, run
  `node engraved-modernism/tools/export-svg.js` to refresh `assets/`.
- Check generators for NaN or exceptions by running them in Node with the options used on the pages, and
  `node --check` any edited JS.
- The night line weights are deliberately thinner than Day's (to offset irradiation). Keep that relationship.
- This repo is public. Never add personal data, local absolute paths or credentials.

## Using the system in another project

Either copy `engraved-modernism/` into the project (simplest, works offline), or link it from the
public repo through jsDelivr, pinned to a tag:
`https://cdn.jsdelivr.net/gh/ZachLockhart/typographic_design_systems@<tag>/engraved-modernism/em.css`
(and the same for `em-ornaments.js`). Then add this to that project's `CLAUDE.md`:

> All HTML documentation and dashboards use the Engraved Modernism design system in
> `<path>/engraved-modernism/`. Follow the rules in the `typographic_design_systems` repository's
> `CLAUDE.md`: compose only from `em-*` classes and `data-em` ornaments, include the theme/type
> switcher in each page header, keep two inks with no gradients or shadows, and label illustrative values.
