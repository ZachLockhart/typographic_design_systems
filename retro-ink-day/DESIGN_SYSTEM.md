# Retro-Ink / Engraved Modernism / Day

## Identity
A bright-white, pure-black typographic system combining classical literary serif typography, condensed industrial labels, scientific instrument scales, and guilloché/engraved ornaments. This is the **Day** variant.

## Non-negotiable visual rules
- Background `#FFFFFF`, primary ink `#000000`; do not use cream, parchment, sepia, beige, gradients, shadows, or paper noise.
- High contrast and generous whitespace. Use fine black linework for density, not gray fills.
- Headlines: Bodoni Moda; literary text: EB Garamond; technical uppercase labels: Barlow Condensed 800, letter spacing `.18em`.
- Uppercase labels are narrow and widely tracked. Main quotations use large serif text with normal casing.
- Ornamental language: circular guilloché, engraved borders, fine crosshatching, graduated rules, and numbered rings. Use SVG assets, not raster decorations.
- Prefer asymmetrical 2-column layouts and narrow technical footers with precise vertical separators.
- All illustrations are monochrome vector line art. Never imply that example numbers are real measurements.

## Files
- `index.html` working demo of two preferred compositions.
- `retro-ink-day.css` standalone stylesheet with namespaced `ri-*` classes.
- `assets/medallion.svg` guilloché ring, ready for numerals overlaid in HTML.
- `assets/scale.svg` graduated horizontal ruler with a diamond and dotted tail.
- `assets/optics.svg` example engraved technical line drawing.

## Integration
Copy the directory into a web project. Include `<link rel="stylesheet" href="/retro-ink-day/retro-ink-day.css">`. Add `class="ri-day"` to the enclosing element and use `.ri-sheet`, `.ri-header`, `.ri-scale`, `.ri-grid`, `.ri-title`, `.ri-quote`, `.ri-label`, `.ri-meta`, `.ri-metrics`, `.ri-metric`.

Google Fonts are imported from the stylesheet and require network access. For offline use, self-host appropriately licensed copies of the three families and replace the `@import` with local `@font-face` rules. No font binaries are included.

## Prompt for AI coding assistants
> Use the provided Retro-Ink / Engraved Modernism / Day design system. Read DESIGN_SYSTEM.md and retro-ink-day.css before writing markup. Reuse the ri-* CSS classes and SVG assets. Pure #fff background and #000 ink; no shadows, cream, paper texture, or gradients. Favor Bodoni Moda display, EB Garamond literary text, Barlow Condensed tracked uppercase metadata, guilloché medallions, instrument scales, fine engraving, generous whitespace, and responsive two-column compositions. Do not invent data or replace SVG ornamentation with emoji.
