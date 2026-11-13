# retro-ink v1.0

A portable, no-dependency, high-contrast black-and-white e-ink / newspaper-inspired design system for scientific HTML dashboards and reports.

## Contents
- `DESIGN.md`: design rules and visual QA checklist
- `CLAUDE.md`: instructions for Claude Code or Claude Projects
- `tokens.css`: core palette, fonts, spacing, rule tokens
- `components.css`: layouts, metrics, tables, charts, status and report components
- `examples/dashboard.html`: responsive scientific dashboard with illustrative values
- `examples/report.html`: print-friendly technical report
- `reference.svg`: vector reference sheet for the aesthetic

## Quick start
Open `examples/dashboard.html` in a browser. No server, build tools, network, or external fonts are required.

To reuse in your own page:
```html
<link rel="stylesheet" href="path/to/retro-ink/components.css">
```
Use the classes from the examples. To enable compact monitoring layout, set `<body class="dense">`.

## Using with Claude Code
Copy the `retro-ink` directory into the project. Add to the project root `CLAUDE.md`:

> For all HTML and dashboards, follow `retro-ink/CLAUDE.md` and `retro-ink/DESIGN.md`. Reuse `retro-ink/components.css` and the examples. Do not invent alternative visual styling.

If your root project already has a `CLAUDE.md`, append the instruction rather than overwriting it.

## Using with Claude Projects / chat
Upload `DESIGN.md`, `CLAUDE.md`, `tokens.css`, `components.css`, and one example HTML page to the project knowledge. Ask Claude to implement the retro-ink design system faithfully. If relative CSS links are not preserved in the generated artifact environment, ask it to inline the provided CSS without changing its values.

## Example prompt
"Create a camera characterization dashboard using retro-ink. Use dense mode, preserve the units and measurement precision, and make all plots monochrome. Reuse the supplied CSS classes and design tokens. Review an actual browser screenshot if possible."

## Design notes
No font binaries are bundled; the system uses common platform font stacks. Charts in the example are illustrative SVG drawings, not dynamically calculated from a data source. For production, generate chart geometry from real data and label axes accurately. Example content is fictional and should not be treated as measurement evidence.
