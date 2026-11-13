#!/usr/bin/env node
// Export static SVG assets from em-ornaments.js.
// Usage: node tools/export-svg.js [outDir] [color]
// Assets draw in currentColor; `color` sets the fallback for standalone use.
const fs = require('fs'), path = require('path');
const EM = require('../em-ornaments.js');
const out = path.resolve(__dirname, '..', process.argv[2] || 'assets');
const color = process.argv[3] || '#000';
fs.mkdirSync(out, { recursive: true });
const jobs = [
  ['medallion.svg', 'guilloche', { preset: 'medallion' }],
  ['seal.svg', 'guilloche', { preset: 'seal' }],
  ['band.svg', 'guilloche', { preset: 'band' }],
  ['rosette.svg', 'guilloche', { preset: 'rosette' }],
  ['scale.svg', 'scale', { from: 0, to: 100, major: 10, minor: 2 }, 1000, 30],
  ['scale-labelled.svg', 'scale', { from: 0, to: 100, major: 10, minor: 1, labels: true }, 1000, 44],
  ['ribbon.svg', 'ribbon', {}, 800, 26],
  ['dial.svg', 'dial', { min: 0, max: 100, value: 62, major: 10, minor: 2, band: '80,100', title: 'Relative', unit: '%' }],
  ['moon-crescent.svg', 'moon', { phase: 0.1 }],
  ['moon-gibbous.svg', 'moon', { phase: 0.62 }],
  ['optics.svg', 'optics', {}],
];
for (const [file, type, o, W, H] of jobs) {
  fs.writeFileSync(path.join(out, file), EM.standalone(type, o, W, H, color));
  console.log('wrote', path.relative(process.cwd(), path.join(out, file)));
}
