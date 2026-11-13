# Retro-Ink / Engraved Modernism / Night

## Identity
Night companion to the Day design system. Exactly black background and warm, high-visibility yellow engraving, lettering, rulers, and technical diagrams. Preserves the Day layout, font stack, classes, and vector assets.

## Color decisions
- Background: `#000000` (absolute black).
- Default ink: `#FFE66D` (bright warm yellow; easier on many viewers than saturated pure yellow, while maintaining very high contrast).
- Muted ink: `#E5CF63`, used sparingly.
- Optional maximum-brightness signal yellow: `#FFFF00`. Add `ri-night--signal` to the root element; this also swaps the supplied SVGs to matching pure-yellow versions.
- Both yellows have excellent WCAG contrast against black. Actual comfort depends on display brightness, ambient light, and viewer preference. Avoid large dense blocks of all-caps text.

## Rules
- No gradients, shadows, glows, off-black panels, textures, or gray fills.
- Keep the same engraved guilloche rings, fine hatching, instrument scales, serif quotations, and tracked condensed uppercase labels as Day.
- Avoid `filter: invert()` on illustrations: it can produce unwanted white. Use the included yellow-stroke SVGs.
- All artwork is vector; do not rasterize ornaments for UI use.
- Technical values in demo are illustrative, not measurements.

## Files
- `index.html`: two responsive examples (almanac and imaging chain).
- `retro-ink-night.css`: namespaced `ri-night` stylesheet.
- `assets/medallion.svg`, `assets/scale.svg`, `assets/optics.svg`: warm-yellow versions.
- `assets/*-signal.svg`: pure-yellow alternatives used by the optional signal mode.
- `DESIGN_SYSTEM.md`: these instructions.

## Integration
Copy the directory into your project and include `<link rel="stylesheet" href="/retro-ink-night/retro-ink-night.css">` in your HTML. Set `class="ri-night"` on the page body or a wrapper; optionally add `ri-night--signal` for maximum-luminance yellow. Use existing `ri-*` components from the Day package (`ri-sheet`, `ri-grid`, `ri-title`, `ri-quote`, `ri-label`, `ri-scale`, `ri-medallion`, `ri-figure`, etc.). Do not load the Day CSS on the same page unless you explicitly manage cascade and theme scoping.

Google Fonts are loaded from the CSS import and need network access. For offline use, self-host licensed font files and replace the import with local `@font-face` rules. Font binaries are not included.

## Prompt for Claude / coding assistants
> Apply Retro-Ink / Engraved Modernism / Night using the supplied `retro-ink-night.css` and SVG assets. Read `DESIGN_SYSTEM.md` first. Use absolute black `#000000` backgrounds and warm high-contrast yellow `#FFE66D` ink (or `ri-night--signal` for pure `#FFFF00`). Preserve the Day layout vocabulary: Bodoni Moda headlines, EB Garamond literary text, Barlow Condensed tracked uppercase metadata, guilloche medallions, precision scales, engraved crosshatching, generous whitespace. No shadows, glows, gradients, paper texture, or gray panels. Do not invent factual measurements.
