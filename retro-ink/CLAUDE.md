# Claude project instruction: retro-ink

When generating or modifying HTML, dashboards, plots, or technical reports for this project, use the retro-ink design system.

1. Read `DESIGN.md` before design or implementation.
2. Load `components.css` (which imports `tokens.css`) in all HTML pages.
3. Reuse the design's existing classes and patterns. Do not invent a new visual language.
4. Treat `examples/dashboard.html` and `examples/report.html` as canonical reference implementations.
5. Use standard density unless the user requests a monitoring dashboard or dense mode.
6. Preserve the user's data and units; label fictional or generated sample values.
7. For charting, ensure the chart remains comprehensible in pure black and white.
8. If a requirement conflicts with retro-ink, explain the conflict and use the smallest necessary exception.
9. After implementation, render the actual HTML in a browser if a browser tool is available; inspect desktop and mobile screenshots and fix layout defects.
10. Do not claim visual verification unless screenshots were actually reviewed.

For requests such as 'make this look better,' improve information hierarchy, typography, alignment, and composition first. Do not add gradients, rounded cards, colored tiles, or extra decoration.
