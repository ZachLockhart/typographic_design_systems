/* ==========================================================================
   Retro-Ink / Engraved Modernism — ornament engine  (v2.0-exploration)
   No dependencies. Generates engraved SVG ornaments that draw in
   currentColor, so one set of geometry serves Day, Night and Signal.

   Markup:   <div data-em="guilloche" data-preset="medallion"></div>
   Types:    guilloche · ribbon · scale · dial · moon · optics · plot · hatch
   Options:  any data-* attribute (numbers parsed). See html/ornaments.html.

   Every generator is a pure function (opts, width, height) -> SVG markup,
   so the same code exports static assets (tools/export-svg.js).
   ========================================================================== */
(function (root) {
  'use strict';

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  let uid = 0;
  const nid = (p) => `em-${p}-${++uid}`;
  const r2 = (n) => Math.round(n * 100) / 100;
  const snap = (x) => Math.round(x) + 0.5;           // crisp 1px verticals
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const pathD = (pts, close) => {
    let s = '';
    for (let i = 0; i < pts.length; i++) s += (i ? 'L' : 'M') + r2(pts[i][0]) + ' ' + r2(pts[i][1]);
    return close ? s + 'Z' : s;
  };
  const P = (d, cls, extra = '') => `<path class="${cls}" d="${d}"${extra}/>`;
  const C = (cx, cy, r, cls) => `<circle class="${cls}" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"/>`;
  const L = (x1, y1, x2, y2, cls) => `<line class="${cls}" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}"/>`;
  const T = (x, y, s, size, anchor = 'middle', cls = '') =>
    `<text${cls ? ` class="${cls}"` : ''} x="${r2(x)}" y="${r2(y)}" font-size="${size}" text-anchor="${anchor}">${esc(s)}</text>`;
  const wrap = (w, h, body, label, extra = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(w)} ${r2(h)}"${extra} focusable="false"` +
    (label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"') + `>${body}</svg>`;

  /* ------------------------------------------------------------------------
     Guilloché primitives
     ------------------------------------------------------------------------ */

  // The classic guilloché band: n copies of r(θ) = R + A(θ)·sin(k(θ + φᵢ)),
  // phase-shifted across `spread` of one lobe period. spread=1 → lattice,
  // spread<1 → twisted rope. mod/modK make the band breathe wide↔narrow.
  function waveRings(cx, cy, o) {
    const { R, amp, k, n, mod = 0, modK = 0, spread = 1, cls = 'h', twist = 0 } = o;
    const steps = Math.max(540, k * 28);
    let out = '';
    for (let i = 0; i < n; i++) {
      const phi = (i / n) * (TAU / k) * spread;
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const th = (s / steps) * TAU;
        const A = amp * (1 - mod + mod * Math.cos(modK * th));
        const r = R + A * Math.sin(k * (th + phi)) + twist * Math.sin(th * 2 + i);
        pts.push([cx + r * Math.cos(th), cy + r * Math.sin(th)]);
      }
      out += P(pathD(pts, true), cls);
    }
    return out;
  }

  // Spirograph rosette (hypo- or epitrochoid), scaled to radius `rad`.
  function rosette(cx, cy, o) {
    const { R = 12, r = 5, d = 4, rad = 80, copies = 1, epi = false, cls = 'h' } = o;
    const g = gcd(R, r), turns = r / g, lobes = R / g;
    const steps = Math.ceil(turns * 900);
    const ext = epi ? (R + r) + d : Math.abs(R - r) + d;
    const sc = rad / ext;
    let out = '';
    for (let c = 0; c < copies; c++) {
      const rot = (c / copies) * (TAU / lobes);
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * TAU * turns;
        let x, y;
        if (epi) { x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t); y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t); }
        else { x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t); y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t); }
        const xr = x * Math.cos(rot) - y * Math.sin(rot), yr = x * Math.sin(rot) + y * Math.cos(rot);
        pts.push([cx + xr * sc, cy + yr * sc]);
      }
      out += P(pathD(pts, true), cls);
    }
    return out;
  }

  // Radial ticks between r1 and r2 (r1b for every `every`-th tick).
  function tickRing(cx, cy, count, r1, r2_, every = 0, r1b = r1, cls = 'h', a0 = -90 * DEG) {
    let d = '';
    for (let i = 0; i < count; i++) {
      const a = a0 + (i / count) * TAU;
      const ri = every && i % every === 0 ? r1b : r1;
      d += `M${r2(cx + ri * Math.cos(a))} ${r2(cy + ri * Math.sin(a))}L${r2(cx + r2_ * Math.cos(a))} ${r2(cy + r2_ * Math.sin(a))}`;
    }
    return P(d, cls);
  }

  function beadRing(cx, cy, count, R, br, cls = 'h') {
    let out = '';
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU;
      out += C(cx + R * Math.cos(a), cy + R * Math.sin(a), br, cls);
    }
    return out;
  }

  // Parallel hatching across a box, optionally with density gradient.
  function hatchLines(x0, y0, w, h, o = {}) {
    const { angle = 45, s0 = 4, s1 = s0, cls = 'h' } = o;
    const a = angle * DEG, dx = Math.cos(a), dy = -Math.sin(a);
    const nx = -dy, ny = dx;                     // normal to the lines
    const cx = x0 + w / 2, cy = y0 + h / 2, half = Math.hypot(w, h) / 2 + 2;
    let d = '';
    let t = -half;
    while (t <= half) {
      const px = cx + nx * t, py = cy + ny * t;
      d += `M${r2(px - dx * half)} ${r2(py - dy * half)}L${r2(px + dx * half)} ${r2(py + dy * half)}`;
      const f = (t + half) / (2 * half);
      t += s0 + (s1 - s0) * f;
    }
    return P(d, cls);
  }

  /* ------------------------------------------------------------------------
     Generators — each returns full <svg> markup
     ------------------------------------------------------------------------ */
  const G = {};

  // GUILLOCHÉ MEDALLIONS ---------------------------------------------------
  // presets: medallion (open face for a numeral) · seal (closed, rosette
  // centre) · band (single lattice ring) · rosette · v1 (reference copy of
  // the original Day medallion geometry, for comparison).
  G.guilloche = function (o) {
    const S = 400, c = 200;
    const preset = o.preset || 'medallion';
    const k = o.k || 30, n = o.n || 14, amp = o.amp || 12, mod = o.mod ?? 0.35, modK = o.modK || 6;
    let b = '';

    if (preset === 'v1') {
      // the v1 asset, regenerated: one family of arcs, ring-clipped, zigzag star
      const id = nid('clip');
      b += `<defs><clipPath id="${id}"><path fill-rule="evenodd" d="M200 12a188 188 0 1 0 0 376a188 188 0 1 0 0-376M200 56a144 144 0 1 1 0 288a144 144 0 1 1 0-288"/></clipPath></defs><g clip-path="url(#${id})">`;
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * TAU, a1 = a - 0.69, a2 = a + 0.69;
        b += P(`M${r2(c + 145 * Math.cos(a2))} ${r2(c + 145 * Math.sin(a2))}Q${r2(c + 186 * Math.cos(a))} ${r2(c + 186 * Math.sin(a))} ${r2(c + 145 * Math.cos(a1))} ${r2(c + 145 * Math.sin(a1))}`, 'h');
      }
      b += '</g>' + C(c, c, 188, 'l') + C(c, c, 145, 'l');
      const pts = [];
      for (let i = 0; i < 240; i++) { const a = (i / 240) * TAU, rr = i % 2 ? 139 : 145; pts.push([c + rr * Math.cos(a), c + rr * Math.sin(a)]); }
      b += P(pathD(pts, true), 'f');
      return wrap(S, S, b, o.label);
    }

    if (preset === 'rosette') {
      b += C(c, c, 196, 'l') + C(c, c, 191, 'h');
      b += rosette(c, c, { R: o.R || 12, r: o.r || 5, d: o.d || 4.2, rad: 182, copies: o.copies || 3 });
      b += C(c, c, 6, 'f');
      return wrap(S, S, b, o.label);
    }

    if (preset === 'band') {
      b += C(c, c, 196, 'k') + C(c, c, 190, 'h');
      b += waveRings(c, c, { R: 160, amp: o.amp || 26, k: o.k || 36, n: o.n || 18, mod, modK });
      b += C(c, c, 130, 'h') + C(c, c, 124, 'k');
      return wrap(S, S, b, o.label);
    }

    // medallion / seal — layered like a banknote or watch dial
    b += C(c, c, 197, 'k') + C(c, c, 192.5, 'h');
    b += tickRing(c, c, 180, 186, 190.5, 5, 182, 'h');
    b += C(c, c, 181, 'f');
    b += waveRings(c, c, { R: 164, amp, k, n, mod, modK });
    b += C(c, c, 147.5, 'f') + C(c, c, 144.5, 'h');
    b += beadRing(c, c, 90, 139.5, 1.6, 'h');
    b += C(c, c, 134.5, 'h');

    if (preset === 'seal') {
      b += waveRings(c, c, { R: 113, amp: 14, k: 18, n: 10, mod: 0.5, modK: 3, spread: 0.55 });
      b += C(c, c, 96, 'f') + C(c, c, 93, 'h');
      b += rosette(c, c, { R: o.R || 12, r: o.r || 5, d: o.d || 4.2, rad: 86, copies: o.copies || 2 });
      b += C(c, c, 5, 'f');
    } else {
      b += C(c, c, 128, 'h');
    }
    return wrap(S, S, b, o.label);
  };

  // RIBBON — horizontal guilloché border (banknote edge). Width-responsive.
  G.ribbon = function (o, W, H) {
    const n = o.n || 8, lam = o.wavelength || 30, mid = H / 2;
    const A = H / 2 - 4, mod = o.mod ?? 0.4, modL = lam * (o.modK || 7);
    let b = L(0, 0.75, W, 0.75, 'f') + L(0, H - 0.75, W, H - 0.75, 'f');
    for (let i = 0; i < n; i++) {
      const phi = (i / n) * TAU * (o.spread ?? 1);
      const pts = [];
      for (let x = 2; x <= W - 2; x += 1.5) {
        const a = A * (1 - mod + mod * Math.cos((TAU * x) / modL));
        pts.push([x, mid + a * Math.sin((TAU * x) / lam + phi)]);
      }
      b += P(pathD(pts), 'h');
    }
    return wrap(W, H, b, null, ' preserveAspectRatio="none"');
  };

  // SCALE — graduated instrument rule at true pixel width (no stretching).
  G.scale = function (o, W, H) {
    const from = o.from ?? 0, to = o.to ?? 100;
    const major = o.major || 10, minor = o.minor || 1, mid = o.mid || major / 2;
    const tail = o.tail ?? 0.14, labels = !!o.labels;
    const top = labels ? 15 : 1, base = H - 1;
    const x0 = 1, xe = Math.round(W * (1 - tail)) - (tail ? 6 : 1);
    const X = (v) => x0 + ((v - from) / (to - from)) * (xe - x0);
    const near = (v, m) => Math.abs(v / m - Math.round(v / m)) < 1e-6;
    let dMaj = '', dMid = '', dMin = '', txt = '';
    const span = base - top;
    for (let v = from, i = 0; v <= to + 1e-9; i++, v = from + i * minor) {
      const x = snap(X(v));
      if (near(v - from, major) || near(v, major)) {
        dMaj += `M${x} ${base}V${top}`;
        if (labels) txt += T(x, 10, +((o.wrap ? ((v % o.wrap) + o.wrap) % o.wrap : v).toFixed(6)), 10.5, x < 12 ? 'start' : x > xe - 12 && !tail ? 'end' : 'middle');
      } else if (near(v, mid)) dMid += `M${x} ${base}V${r2(base - span * 0.62)}`;
      else dMin += `M${x} ${base}V${r2(base - span * 0.34)}`;
    }
    let b = P(dMin, 'h') + P(dMid, 'f') + P(dMaj, 'f');
    b += L(0.75, top - (labels ? 0 : 0), 0.75, base, 'l');
    b += L(0, base, xe, base, 'l');
    if (tail) {
      const dx = xe + 7;
      b += `<path class="ink" d="M${dx} ${r2(base - 6)}l6 6-6 6-6-6z"/>`;
      b += L(dx + 10, base, W - 1, base, 'l dot');
    }
    if (o.index != null) {
      const x = X(o.index);
      b += `<path class="ink" d="M${r2(x)} ${r2(base - span * 0.62 - 2)}l-4 -7h8z"/>`;
    }
    return wrap(W, H, b, o.label || null, ' preserveAspectRatio="none"');
  };

  // DIAL — 270° instrument gauge with hatched caution band and needle.
  G.dial = function (o) {
    const S = 240, c = 120;
    const min = o.min ?? 0, max = o.max ?? 100, val = Math.max(min, Math.min(max, o.value ?? min));
    const major = o.major || (max - min) / 10, minor = o.minor || major / 5;
    const a0 = 135 * DEG, sweep = 270 * DEG;
    const A = (v) => a0 + ((v - min) / (max - min)) * sweep;
    const pt = (r, a) => [c + r * Math.cos(a), c + r * Math.sin(a)];
    let b = C(c, c, 116, 'k') + C(c, c, 111.5, 'h');
    // caution band: dense radial hatching
    if (o.band) {
      const [lo, hi] = String(o.band).split(',').map(Number);
      let d = '';
      const steps = Math.max(8, Math.round(((A(hi) - A(lo)) / DEG) * 1.6));
      for (let i = 0; i <= steps; i++) {
        const a = A(lo) + (i / steps) * (A(hi) - A(lo));
        const p1 = pt(93, a), p2 = pt(103, a);
        d += `M${r2(p1[0])} ${r2(p1[1])}L${r2(p2[0])} ${r2(p2[1])}`;
      }
      b += P(d, 'h');
      const q1 = pt(93, A(lo)), q2 = pt(93, A(hi));
      b += P(`M${r2(q1[0])} ${r2(q1[1])}A93 93 0 ${A(hi) - A(lo) > Math.PI ? 1 : 0} 1 ${r2(q2[0])} ${r2(q2[1])}`, 'h');
    }
    // arc
    const s = pt(104, a0), e = pt(104, a0 + sweep);
    b += P(`M${r2(s[0])} ${r2(s[1])}A104 104 0 1 1 ${r2(e[0])} ${r2(e[1])}`, 'f');
    let dMaj = '', dMin = '', txt = '';
    const nMinor = Math.round((max - min) / minor);
    const fmt = (v) => (o.decimals ? v.toFixed(o.decimals) : String(Math.round(v * 1000) / 1000));
    for (let i = 0; i <= nMinor; i++) {
      const v = min + i * minor, a = A(v);
      const isMaj = Math.abs((v - min) / major - Math.round((v - min) / major)) < 1e-6;
      const p1 = pt(isMaj ? 93 : 98, a), p2 = pt(104, a);
      const seg = `M${r2(p1[0])} ${r2(p1[1])}L${r2(p2[0])} ${r2(p2[1])}`;
      if (isMaj) { dMaj += seg; const tp = pt(80, a); txt += T(tp[0], tp[1] + 4, fmt(v), 11); } else dMin += seg;
    }
    b += P(dMin, 'h') + P(dMaj, 'l') + txt;
    // inner guilloché collar
    b += waveRings(c, c, { R: 34, amp: 3.2, k: 24, n: 6, mod: 0 });
    b += C(c, c, 27, 'h');
    if (o.title) b += T(c, c + 52, o.title, 10.5);
    if (o.showValue !== false) b += T(c, c + 76, fmt(val) + (o.unit ? ' ' + o.unit : ''), 19, 'middle', 'serif');
    // needle
    const tip = pt(98, A(val)), tl = pt(-20, A(val)), w1 = pt(4.2, A(val) + Math.PI / 2), w2 = pt(4.2, A(val) - Math.PI / 2);
    b += `<path class="ink" d="M${r2(tip[0])} ${r2(tip[1])}L${r2(w1[0])} ${r2(w1[1])}L${r2(tl[0])} ${r2(tl[1])}L${r2(w2[0])} ${r2(w2[1])}Z"/>`;
    b += C(c, c, 7, 'paper') + C(c, c, 7, 'f') + C(c, c, 2.2, 'ink');
    const label = o.label || `${o.title || 'Dial'}: ${fmt(val)}${o.unit ? ' ' + o.unit : ''} (range ${fmt(min)}–${fmt(max)})`;
    return wrap(S, S, b, label);
  };

  // MOON — terminator geometry with engraved shadow hatching.
  // phase: 0 new · .25 first quarter · .5 full · .75 last quarter.
  G.moon = function (o) {
    const S = 100, c = 50, R = 46, p = (((o.phase ?? 0.1) % 1) + 1) % 1;
    const k = Math.cos(TAU * p);                     // terminator semi-axis factor
    const waxing = p <= 0.5, steps = 90, dark = [];
    for (let i = 0; i <= steps; i++) {               // terminator, top → bottom
      const y = -R + (2 * R * i) / steps, w = Math.sqrt(Math.max(0, R * R - y * y));
      dark.push([c + (waxing ? k * w : -k * w), c + y]);
    }
    for (let i = steps; i >= 0; i--) {               // dark limb, bottom → top
      const y = -R + (2 * R * i) / steps, w = Math.sqrt(Math.max(0, R * R - y * y));
      dark.push([c + (waxing ? -w : w), c + y]);
    }
    const id = nid('moon');
    let b = `<defs><clipPath id="${id}"><path d="${pathD(dark, true)}"/></clipPath></defs>`;
    b += `<g clip-path="url(#${id})">${hatchLines(0, 0, S, S, { angle: o.angle ?? 0, s0: o.spacing || 2.6 })}</g>`;
    b += C(c, c, R, 'f');
    const pct = Math.round(((1 - k) / 2) * 100);
    return wrap(S, S, b, o.label || `Moon, ${waxing ? 'waxing' : 'waning'}, ${pct}% illuminated`);
  };

  // OPTICS — engraved lens cross-section, variable-density section hatching,
  // traced rays, lettered callouts, dimension line.
  G.optics = function (o) {
    const W = 520, H = 300, cy = 146;
    const els = [ // [front x, back x, half-height, front ctrl x, back ctrl x]
      [40, 82, 100, 10, 56], [98, 128, 84, 72, 104], [146, 176, 62, 126, 162],
      [198, 230, 54, 184, 216], [254, 298, 78, 228, 280], [324, 368, 100, 292, 368],
    ];
    const xs = 466;                                  // sensor plane
    let defs = '', b = '';
    b += L(4, cy, W - 4, cy, 'h dash');
    els.forEach((e, i) => {
      const [xf, xb, h, cf, cb] = e, id = nid('lens');
      const d = `M${xf} ${cy - h}Q${cf} ${cy} ${xf} ${cy + h}L${xb} ${cy + h}Q${cb} ${cy} ${xb} ${cy - h}Z`;
      defs += `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
      const x0 = Math.min(xf, cf) - 2, x1 = Math.max(xb, cb) + 2;
      b += `<g clip-path="url(#${id})">${hatchLines(x0, cy - h, x1 - x0, 2 * h, { angle: i % 2 ? -45 : 45, s0: 2.4, s1: 5.2 })}</g>`;
      b += P(d, 'l');
      const lx = (xf + xb) / 2;
      b += L(lx, cy - h - 6, lx, 34, 'h') + T(lx, 26, 'ABCDEF'[i], 15, 'middle', 'ital');
    });
    // rays: parallel bundle converging on the focal point
    const F = [xs, cy];
    [-0.82, -0.45, 0.45, 0.82].forEach((f) => {
      const [xf, , h, cf] = els[0], y = cy + f * h, t = (y - (cy - h)) / (2 * h);
      const xHit = xf + 2 * t * (1 - t) * (cf - xf);
      b += L(4, y, xHit, y, 'h') + L(xHit, y, F[0], F[1], 'h');
    });
    // sensor with hatched backing
    const sid = nid('sens');
    defs += `<clipPath id="${sid}"><rect x="${xs}" y="${cy - 56}" width="12" height="112"/></clipPath>`;
    b += `<g clip-path="url(#${sid})">${hatchLines(xs, cy - 56, 12, 112, { angle: 45, s0: 2.2 })}</g>`;
    b += L(xs, cy - 56, xs, cy + 56, 'k') + `<rect class="f" x="${xs}" y="${cy - 56}" width="12" height="112"/>`;
    b += L(xs + 6, cy - 62, xs + 6, 34, 'h') + T(xs + 6, 26, 'S', 15, 'middle', 'ital');
    b += C(F[0], F[1], 2.6, 'ink');
    // dimension line
    const yd = H - 18;
    b += L(40, cy + 104, 40, yd + 6, 'h') + L(xs, cy + 62, xs, yd + 6, 'h');
    b += L(44, yd, xs - 4, yd, 'h');
    b += `<path class="ink" d="M40 ${yd}l9 -3v6zM${xs} ${yd}l-9 -3v6z"/>`;
    b += `<rect class="paper" x="${(40 + xs) / 2 - 22}" y="${yd - 9}" width="44" height="18"/>`;
    b += T((40 + xs) / 2, yd + 5, 'ƒ′', 16, 'middle', 'ital');
    return wrap(W, H, `<defs>${defs}</defs>` + b, o.label || 'Engraved cross-section of a six-element lens with converging rays');
  };

  // HATCH — swatch of an engraving tone (for documentation / fills).
  G.hatch = function (o, W, H) {
    const id = nid('hs');
    let b = `<defs><clipPath id="${id}"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs><g clip-path="url(#${id})">`;
    const s0 = o.spacing || 4;
    b += hatchLines(0, 0, W, H, { angle: o.angle ?? 45, s0, s1: o.spacingEnd || s0 });
    if (o.cross) b += hatchLines(0, 0, W, H, { angle: (o.angle ?? 45) - 90, s0, s1: o.spacingEnd || s0 });
    b += '</g>';
    if (o.frame !== false) b += `<rect class="f" x=".5" y=".5" width="${W - 1}" height="${H - 1}"/>`;
    return wrap(W, H, b);
  };

  // PLOT — single-series engraved line chart. Hatched area, dotted
  // hair grid, one axis, crosshair + tooltip, screen-reader table.
  function niceTicks(lo, hi, count = 5) {
    const span = hi - lo || 1, step0 = span / count, mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) || 10 * mag;
    const a = Math.floor(lo / step) * step, z = Math.ceil(hi / step) * step, ticks = [];
    for (let v = a; v <= z + step / 2; v += step) ticks.push(+v.toFixed(10));
    return ticks;
  }
  function plotModel(o, W, H) {
    const ys = String(o.points || '').split(',').map(Number).filter((v) => !isNaN(v));
    const xl = o.xlabels ? String(o.xlabels).split(',') : ys.map((_, i) => String((o.xstart ?? 0) + i * (o.xstep ?? 1)));
    const ticks = niceTicks(o.ymin ?? Math.min(...ys), o.ymax ?? Math.max(...ys), o.yticks || 4);
    const m = { l: 40, r: 10, t: 12, b: 26 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const y0 = ticks[0], y1 = ticks[ticks.length - 1];
    const X = (i) => m.l + (ys.length < 2 ? pw / 2 : (i / (ys.length - 1)) * pw);
    const Y = (v) => m.t + ph - ((v - y0) / (y1 - y0)) * ph;
    return { ys, xl, ticks, m, pw, ph, X, Y };
  }
  G.plot = function (o, W, H) {
    const M = plotModel(o, W, H), { ys, xl, ticks, m, pw, ph, X, Y } = M;
    if (!ys.length) return wrap(W, H, '');
    let b = '';
    ticks.forEach((v) => {
      const y = snap(Y(v));
      if (v !== ticks[0]) b += L(m.l, y, m.l + pw, y, 'h dot');
      b += L(m.l - 5, y, m.l, y, 'h') + T(m.l - 9, y + 3.5, v, 10, 'end');
    });
    const every = Math.max(1, Math.ceil(ys.length / Math.max(2, Math.floor(pw / 56))));
    ys.forEach((_, i) => {
      if (i % every) return;
      const x = snap(X(i));
      b += L(x, m.t + ph, x, m.t + ph + 4, 'h') + T(x, m.t + ph + 17, xl[i] ?? '', 10);
    });
    const line = ys.map((v, i) => [X(i), Y(v)]);
    const id = nid('area');
    const area = pathD([[X(0), m.t + ph], ...line, [X(ys.length - 1), m.t + ph]], true);
    b += `<defs><clipPath id="${id}"><path d="${area}"/></clipPath></defs>`;
    b += `<g clip-path="url(#${id})">${hatchLines(m.l, m.t, pw, ph, { angle: 45, s0: o.hatch || 4.5 })}</g>`;
    b += L(m.l, m.t + ph, m.l + pw, m.t + ph, 'f') + L(m.l, m.t, m.l, m.t + ph, 'f');
    b += P(pathD(line), 'l');
    if (o.ylabel) b += T(m.l, m.t - 2, o.ylabel, 9.5, 'start');
    b += `<g class="em-cross" style="display:none"><line class="h" x1="0" x2="0" y1="${m.t}" y2="${m.t + ph}"/><circle class="paper" r="4.5"/><circle class="f" r="4.5"/></g>`;
    b += `<rect class="em-hit" x="${m.l}" y="0" width="${pw}" height="${H}"/>`;
    return wrap(W, H, b, o.title || 'Line chart', ' preserveAspectRatio="none"');
  };
  G.plot.after = function (node, o, W, H) {
    const M = plotModel(o, W, H), { ys, xl, X, Y } = M;
    if (!ys.length) return;
    const svg = node.querySelector('svg'), cross = svg.querySelector('.em-cross'), hit = svg.querySelector('.em-hit');
    const [vl, ring1, ring2] = cross.children;
    let tip = node.querySelector('.em-tip');
    if (!tip) { tip = document.createElement('div'); tip.className = 'em-tip'; tip.hidden = true; node.appendChild(tip); }
    const show = (i) => {
      const x = X(i), y = Y(ys[i]);
      cross.style.display = '';
      vl.setAttribute('x1', x); vl.setAttribute('x2', x);
      [ring1, ring2].forEach((r) => { r.setAttribute('cx', x); r.setAttribute('cy', y); });
      tip.hidden = false;
      tip.innerHTML = `<b>${esc(xl[i] ?? '')}</b>${esc(ys[i])}${o.unit ? ' ' + esc(o.unit) : ''}`;
      tip.style.left = (x / W) * node.clientWidth + 'px';
      tip.style.top = (y / H) * node.clientHeight + 'px';
    };
    const hide = () => { cross.style.display = 'none'; tip.hidden = true; };
    hit.addEventListener('pointermove', (ev) => {
      const r = svg.getBoundingClientRect(), px = ((ev.clientX - r.left) / r.width) * W;
      let best = 0, bd = Infinity;
      ys.forEach((_, i) => { const dd = Math.abs(X(i) - px); if (dd < bd) { bd = dd; best = i; } });
      show(best);
    });
    hit.addEventListener('pointerleave', hide);
    // screen-reader table view
    let tbl = node.querySelector('table.em-sr');
    if (!tbl) {
      tbl = document.createElement('table'); tbl.className = 'em-sr';
      tbl.innerHTML = `<caption>${esc(o.title || 'Data')}</caption><tr><th>${esc(o.xname || 'x')}</th><th>${esc(o.ylabel || 'value')}</th></tr>` +
        ys.map((v, i) => `<tr><td>${esc(xl[i] ?? i)}</td><td>${esc(v)}</td></tr>`).join('');
      node.appendChild(tbl);
    }
  };

  /* ------------------------------------------------------------------------
     DOM rendering
     ------------------------------------------------------------------------ */
  const RESPONSIVE = { ribbon: 1, scale: 1, plot: 1, hatch: 1 };
  const DEFAULT_H = { ribbon: 26, scale: 30, plot: 220, hatch: 80 };

  function readOpts(node) {
    const o = {};
    for (const k in node.dataset) {
      if (k === 'em') continue;
      const v = node.dataset[k];
      o[k] = v === 'true' ? true : v === 'false' ? false : v !== '' && !isNaN(v) && !/,/.test(v) ? parseFloat(v) : v;
    }
    return o;
  }

  function renderNode(node) {
    const type = node.dataset.em, gen = G[type];
    if (!gen) return;
    const o = readOpts(node);
    node.classList.add('em-orn', 'em-orn--' + type);
    if (type === 'scale' && o.labels) node.classList.add('em-orn--labelled');
    if (type === 'plot' && !node.style.height) node.style.height = (o.height || DEFAULT_H.plot) + 'px';
    if (type === 'hatch' && !node.style.height) node.style.height = (o.height || DEFAULT_H.hatch) + 'px';
    const W = Math.max(40, Math.round(node.clientWidth || 600));
    const H = Math.max(10, Math.round(node.clientHeight || DEFAULT_H[type] || 100));
    node.innerHTML = gen(o, W, H);
    if (gen.after) gen.after(node, o, W, H);
    node._emW = W;
  }

  let ro = null;
  function render(scope) {
    const rootEl = scope || document;
    const nodes = rootEl.querySelectorAll('[data-em]');
    if (!ro && 'ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => entries.forEach((en) => {
        const n = en.target, w = Math.round(n.clientWidth);
        if (w && w !== n._emW) renderNode(n);
      }));
    }
    nodes.forEach((n) => { renderNode(n); if (ro && RESPONSIVE[n.dataset.em]) ro.observe(n); });
  }

  /* ------------------------------------------------------------------------
     Theme / type switching (docs + examples)
     Buttons: data-em-theme="day|mid|night|signal"  data-em-type="classic|scotch|precision"
     URL override: ?theme=night&type=scotch
     ------------------------------------------------------------------------ */
  const KEY = 'em-prefs-v2';
  function getPrefs() {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* storage unavailable */ }
    try {
      const q = new URLSearchParams(location.search);
      if (q.get('theme')) p.theme = q.get('theme');
      if (q.get('type')) p.type = q.get('type');
    } catch (e) { /* ignore */ }
    return p;
  }
  function apply(p) {
    const el = document.querySelector('[data-em-root]') || document.body;
    el.classList.toggle('em--night', p.theme === 'night' || p.theme === 'signal');
    el.classList.toggle('em--signal', p.theme === 'signal');
    el.classList.toggle('em--mid', p.theme === 'mid');
    el.classList.remove('em--type-scotch', 'em--type-precision');
    if (p.type === 'scotch' || p.type === 'precision') el.classList.add('em--type-' + p.type);
    document.querySelectorAll('[data-em-theme]').forEach((b) => b.setAttribute('aria-pressed', String((p.theme || 'day') === b.dataset.emTheme)));
    document.querySelectorAll('[data-em-type]').forEach((b) => b.setAttribute('aria-pressed', String((p.type || 'classic') === b.dataset.emType)));
  }
  function ui() {
    const p = getPrefs();
    apply(p);
    document.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-em-theme],[data-em-type]');
      if (!b) return;
      if (b.dataset.emTheme) p.theme = b.dataset.emTheme;
      if (b.dataset.emType) p.type = b.dataset.emType;
      apply(p);
      try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* ignore */ }
    });
  }

  /* Static export: standalone SVG with embedded stroke styles. */
  function standalone(type, o = {}, W, H, color = '#000') {
    const svg = G[type](o, W || DEFAULT_H[type] * 20 || 400, H || DEFAULT_H[type] || 400);
    const css = `<style>.h,.f,.l,.k{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.h{stroke-width:.75}.f{stroke-width:1}.l{stroke-width:1.5}.k{stroke-width:2.5}.ink{fill:currentColor}.paper{fill:none}.dash{stroke-dasharray:14 4 2 4}.dot{stroke-dasharray:1.5 5}text{fill:currentColor;font-family:'Barlow Condensed','Arial Narrow',sans-serif;font-weight:600}.serif,.ital{font-family:'EB Garamond',Georgia,serif}.ital{font-style:italic}</style>`;
    return svg.replace('aria-hidden="true">', `aria-hidden="true" color="${color}">${css}`)
              .replace(/(role="img" aria-label="[^"]*")>/, `$1 color="${color}">${css}`);
  }

  const EM = { generators: G, render, renderNode, ui, standalone, version: '2.0-exploration' };
  root.EM = EM;
  if (typeof module !== 'undefined' && module.exports) module.exports = EM;

  if (typeof document !== 'undefined') {
    const boot = () => { ui(); render(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
    // fonts change label metrics only; re-render text-bearing ornaments once loaded
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render());
  }
})(typeof window !== 'undefined' ? window : globalThis);
