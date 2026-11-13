# retro-ink — Design Standard v1.0

## Identity
A high-contrast, black-and-white, e-paper-inspired scientific newspaper. Combine editorial mastheads, strong horizontal rules, compact engineering data, and instrument-like precision. The result must look intentional, not like a generic web admin template.

## Non-negotiable rules
1. Use pure white (#fff) and pure black (#000) as the primary palette. No accent colors unless a user explicitly requests an accessibility or functional exception.
2. No gradients, drop shadows, glass effects, rounded cards, glow, faux paper textures, or decorative animations.
3. Use an editorial serif for headlines and prose; monospace for measurements, labels, IDs, and tabular figures.
4. Prefer strong horizontal rules and vertical column dividers over isolated card boxes.
5. Use reverse-video black bars sparingly for section headers, primary metrics, selected rows, and high-priority states.
6. Align numeric data to the right, retain units, and use tabular numerals.
7. Charts must be legible without color: black lines, varied dash patterns, distinct markers, hatching when necessary, explicit legends, and readable axes.
8. Make data hierarchy explicit: page identity → current task → critical readings → plots → detailed tables → notes.
9. Never invent scientific measurements or claim synthetic data are real. Label sample data as illustrative.
10. Build accessible semantic HTML with headings, table headers, visible keyboard focus, and text labels for state.

## Typography
Display: Georgia / Times New Roman fallback. Body: Georgia / Times New Roman. Data: SFMono-Regular / Consolas / Liberation Mono. Use system fonts only; no external downloads.
Masthead: 30–60px bold serif; section title: 19–27px bold serif; body: 14–16px; labels: 12px uppercase monospace; major metric: 25–36px bold monospace.

## Grid and spacing
Desktop: left rail ~220px, flexible main column, right rail ~240px. 18px gutters. Dense: 185px / flexible / 205px with 10px gutters. Mobile: stacked columns and scrollable data tables. Spacing scale: 4, 8, 12, 16, 24, 32, 48px.

## Component patterns
- Masthead: editorial title, issue or lab identity, right-aligned dateline.
- KPI strip: continuous band of metrics separated by vertical rules, not floating cards.
- Panel: heavy top rule and heading, with optional reverse-video heading.
- Table: compact, ruled rows; right-aligned numeric columns; black selected row.
- Status: text labels plus monochrome symbols; never rely on color alone.
- Progress: outlined rectangle with black filled portion and numeric percentage.
- Charts: SVG/canvas or chosen plotting library, monochrome styling and full axis labels.
- Reports: single main text column, captions, ruled sections, print-friendly layout.

## Density modes
Standard is the default for reading and mixed dashboard/report pages. Dense is for engineering monitoring. Add `class="dense"` to `<body>` to switch to compact spacing and smaller typography. Avoid reducing font size below legibility just to fit more content.

## Implementation constraints
Use `tokens.css` and `components.css` as the source of truth. Reuse classes. Add new CSS only when required; use existing tokens. Do not silently substitute Tailwind, Bootstrap, or component libraries. If a project requires a framework, map the same design tokens and patterns into it.

## Visual QA checklist
- Is the page immediately recognizable as retro-ink at 100% zoom?
- Can the most important information be identified within three seconds?
- Are numerical values, units, and legends clear and correct?
- Are grid columns and text baselines aligned?
- Does the layout remain readable at 1440px, 1024px, and 390px widths?
- Are print/PDF results clean and monochrome?
- Is any decorative element reducing information density or clarity?
- Are all controls keyboard-accessible and all states text-labelled?
