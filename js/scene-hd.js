// High-resolution (640×400) pixel scenes: the cozy living room in Kannikestredet (also used for vors)
// and the TF-sirkeltrening gym hall. Each has a static layer drawn once (with texture) and a live layer
// drawn every frame (fairy lights, candles, TV, snow, people training / partying).
window.LUX = window.LUX || {};

LUX.sceneHD = (() => {
  const W = 640, H = 400;
  const layers = {};
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const flakes = Array.from({ length: 70 }, () => [Math.random() * W, Math.random() * H, 0.4 + Math.random()]);

  // ---------- helpers ----------
  const R = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const P = (g, c, x, y) => R(g, c, x, y, 1, 1);
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f))));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }
  function noise(g, x, y, w, h, base, amount, density = 0.25) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (rnd() < density) P(g, shade(base, 1 + (rnd() - 0.5) * amount), x + i, y + j);
  }
  function text(g, t, x, y, c, size = 9, bold = true) {
    g.fillStyle = c;
    g.font = `${bold ? "bold " : ""}${size}px monospace`;
    g.fillText(t, x, y);
  }
  function ellipse(g, c, x, y, rx, ry) { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); }
  // a trailing plant vine: pairs of small leaves along a slightly swaying stem
  function vine(g, x, y, len, lean) {
    for (let j = 0; j < len; j += 2) {
      const vx = x + Math.sin(j / 9 + x) * 2 + lean * j * 0.15;
      P(g, "#2f5a2a", vx, y + j);
      if (j % 6 === 0) {
        const c = rnd() < 0.5 ? "#3f7a34" : "#5a9a44";
        R(g, c, vx - 3, y + j, 3, 2); R(g, c, vx + 1, y + j + 2, 3, 2); P(g, "#7aba5a", vx - 2, y + j);
      }
    }
  }

  const layer = (name, draw) => {
    if (layers[name]) return layers[name];
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    seed = 11;
    draw(g);
    return (layers[name] = c);
  };

  // a small person (crowd / gym), feet at (x, y)
  function person(g, x, y, o) {
    const s = o.s || 1, skin = o.skin || "#e8b896";
    const bob = o.bob || 0;
    y -= bob;
    if (o.pose === "lying") {          // on a bench, pressing a bar
      R(g, o.pants, x - 18 * s, y - 6 * s, 14 * s, 5 * s);
      R(g, o.top, x - 4 * s, y - 7 * s, 14 * s, 6 * s);
      R(g, skin, x + 10 * s, y - 8 * s, 6 * s, 6 * s);
      R(g, o.hair, x + 13 * s, y - 9 * s, 4 * s, 7 * s);
      const up = o.lift || 0;
      R(g, skin, x + 1 * s, y - (10 + up) * s, 2 * s, (4 + up) * s);
      R(g, skin, x + 6 * s, y - (10 + up) * s, 2 * s, (4 + up) * s);
      R(g, "#444", x - 8 * s, y - (12 + up) * s, 26 * s, 2 * s);
      R(g, "#222", x - 11 * s, y - (15 + up) * s, 3 * s, 8 * s); R(g, "#222", x + 18 * s, y - (15 + up) * s, 3 * s, 8 * s);
      return;
    }
    if (o.pose === "plank") {
      R(g, o.pants, x - 16 * s, y - 6 * s, 14 * s, 4 * s);
      R(g, o.top, x - 2 * s, y - 8 * s, 14 * s, 5 * s);
      R(g, skin, x + 12 * s, y - 10 * s, 6 * s, 6 * s);
      R(g, o.hair, x + 12 * s, y - 11 * s, 6 * s, 3 * s);
      R(g, skin, x + 9 * s, y - 4 * s, 2 * s, 4 * s);
      return;
    }
    const squat = o.pose === "squat" ? 6 : 0;
    R(g, o.pants, x - 5 * s, y - (16 - squat) * s, 4 * s, (16 - squat) * s);
    R(g, o.pants, x + 1 * s, y - (16 - squat) * s, 4 * s, (16 - squat) * s);
    R(g, "#222", x - 6 * s, y - 2 * s, 5 * s, 2 * s); R(g, "#222", x + 1 * s, y - 2 * s, 5 * s, 2 * s);
    const top = y - (32 - squat) * s;
    R(g, o.top, x - 6 * s, top, 12 * s, 17 * s);
    if (o.arms === "up") { R(g, o.top, x - 9 * s, top - 10 * s, 3 * s, 12 * s); R(g, o.top, x + 6 * s, top - 10 * s, 3 * s, 12 * s); R(g, skin, x - 9 * s, top - 13 * s, 3 * s, 3 * s); R(g, skin, x + 6 * s, top - 13 * s, 3 * s, 3 * s); }
    else if (o.arms === "front") { R(g, o.top, x - 8 * s, top + 2 * s, 3 * s, 9 * s); R(g, o.top, x + 5 * s, top + 2 * s, 3 * s, 9 * s); R(g, skin, x - 4 * s, top + 10 * s, 8 * s, 3 * s); }
    else { R(g, o.top, x - 8 * s, top + 1 * s, 3 * s, 13 * s); R(g, o.top, x + 5 * s, top + 1 * s, 3 * s, 13 * s); R(g, skin, x - 8 * s, top + 14 * s, 3 * s, 3 * s); R(g, skin, x + 5 * s, top + 14 * s, 3 * s, 3 * s); }
    if (o.cup) { R(g, "#d33", x + 6 * s, top + 8 * s, 4 * s, 5 * s); R(g, "#fff", x + 6 * s, top + 8 * s, 4 * s, 1 * s); }
    R(g, skin, x - 2 * s, top - 3 * s, 4 * s, 3 * s);
    R(g, skin, x - 4 * s, top - 11 * s, 8 * s, 9 * s);
    R(g, o.hair, x - 5 * s, top - 13 * s, 10 * s, 4 * s);
    if (o.long) { R(g, o.hair, x - 5 * s, top - 10 * s, 2 * s, 11 * s); R(g, o.hair, x + 3 * s, top - 10 * s, 2 * s, 11 * s); }
    R(g, "#2a1a14", x - 2 * s, top - 7 * s, 1 * s, 1 * s); R(g, "#2a1a14", x + 1 * s, top - 7 * s, 1 * s, 1 * s);
  }

  // =====================================================================
  //  LIVING ROOM
  // =====================================================================
  const HOME = {
    glass: { x: 202, y: 42, w: 122, h: 126 },
    tv: { x: 532, y: 184, w: 90, h: 56 },
    lamp: { x: 466, y: 134 },
    candles: [[300, 300], [312, 302], [384, 300]],
  };

  function homeStatic(g) {
    // wall: warm cream with a soft vertical pattern
    R(g, "#e6d3b0", 0, 0, W, 262);
    for (let x = 0; x < W; x += 24) { R(g, "#e0cba6", x, 0, 12, 262); for (let y = 10; y < 262; y += 22) R(g, "#d9c39c", x + 5, y, 2, 2); }
    noise(g, 0, 0, W, 262, "#e3cfaa", 0.05, 0.15);
    // ceiling beam
    R(g, "#7a5a40", 0, 0, W, 10); R(g, "#6a4a32", 0, 9, W, 2);
    // skirting board
    R(g, "#f3ede0", 0, 254, W, 8); R(g, "#d8cfbd", 0, 261, W, 1);

    // ---- doors: Sandra, Marthe, Emma ----
    const door = (x, name, col) => {
      R(g, "#5a3a24", x - 3, 88, 58, 174);
      R(g, col, x, 92, 52, 170);
      noise(g, x, 92, 52, 170, col, 0.12, 0.3);
      for (const [py, ph] of [[100, 66], [176, 76]]) { R(g, shade(col, 0.85), x + 6, py, 40, ph); R(g, shade(col, 1.08), x + 8, py + 2, 36, ph - 4); }
      R(g, "#e8c860", x + 43, 172, 4, 4); R(g, "#b89040", x + 44, 175, 3, 2);
      R(g, "#f6f0e2", x + 8, 108, 36, 13); R(g, "#c8b890", x + 8, 120, 36, 1);
      text(g, name, x + 10, 118, "#3a2a20", 8);
    };
    door(8, "SANDRA", "#9a6a46");
    door(66, "MARTHE", "#8f6240");
    door(124, "EMMA", "#86603e");
    // Sandra: heart sticker + a dirty-fries drawing. Marthe: hammer. Emma: Swedish flag, lock, sign
    R(g, "#e86a9a", 18, 136, 6, 5); R(g, "#e86a9a", 25, 136, 6, 5); R(g, "#e86a9a", 20, 141, 9, 4); R(g, "#e86a9a", 23, 145, 3, 2);
    R(g, "#e8c34a", 34, 140, 2, 8); R(g, "#e8c34a", 37, 138, 2, 10); R(g, "#e8c34a", 40, 141, 2, 7); R(g, "#c94a3a", 33, 147, 10, 3);
    R(g, "#6a6a6a", 82, 136, 14, 4); R(g, "#8a5a30", 88, 139, 3, 12);
    R(g, "#2a64b8", 134, 132, 22, 14); R(g, "#f2c230", 140, 132, 4, 14); R(g, "#f2c230", 134, 137, 22, 4);
    R(g, "#c94a4a", 128, 152, 44, 12); text(g, "LÅST!", 134, 161, "#fff", 8);
    R(g, "#999", 164, 176, 7, 7); R(g, "#777", 165, 172, 5, 5); R(g, "#d9d9d9", 165, 172, 5, 1);

    // ---- window with curtains ----
    R(g, "#6a4a32", 182, 26, 164, 3);                        // curtain rod
    R(g, "#f4efe4", 194, 34, 140, 142);                      // frame
    R(g, "#d8d0c0", 194, 174, 140, 2);
    // the glass is left empty – sky + snow are drawn live behind this layer; rooftops in front of the sky:
    g.clearRect(202, 42, 122, 126);
    const roofs = [[202, 140, 30, "#7a3a2a"], [228, 128, 34, "#3a4a5a"], [258, 144, 26, "#8a6a2a"], [280, 132, 30, "#5a2a2a"], [306, 146, 24, "#2a4a3a"]];
    for (const [x, y, w, c] of roofs) {
      R(g, c, x, y, w, 168 - y);
      for (let i = 0; i < 8; i++) R(g, "#f4f8fc", x + i, y - 8 + i, w - i * 2, 1);   // snowy roof
      R(g, "#f4f8fc", x, y - 1, w, 2);
      for (let wx = x + 4; wx < x + w - 6; wx += 9) R(g, "#f5d58a", wx, y + 6, 4, 5);  // lit windows
    }
    R(g, "#2a3a2a", 202, 160, 122, 8);
    R(g, "#f4efe4", 261, 42, 4, 126); R(g, "#f4efe4", 202, 102, 122, 4);  // mullions
    // windowsill with small plants and a candle holder
    R(g, "#f4efe4", 188, 170, 152, 7); R(g, "#d8d0c0", 188, 176, 152, 2);
    for (const [px, c] of [[212, "#c96a3a"], [232, "#d8d0c0"], [300, "#4a6a8a"]]) {
      R(g, c, px, 160, 10, 10); R(g, shade(c, 0.8), px, 168, 10, 2);
      for (let i = 0; i < 6; i++) R(g, "#4a8a3a", px - 2 + i * 2.5, 150 + (i % 2) * 3, 3, 10 - (i % 2) * 3);
    }
    // curtains (rust velvet with folds)
    for (const cx of [182, 324]) {
      for (let i = 0; i < 22; i++) {
        const c = i % 5 === 0 ? "#7a3424" : i % 5 === 2 ? "#a8503a" : "#93442f";
        R(g, c, cx + i, 29, 1, 158 + Math.sin(i / 3) * 3);
      }
      R(g, "#d8a050", cx + 2, 110, 18, 3);   // tie-back
    }

    // ---- hanging macramé plant ----
    R(g, "#d8c8a8", 350, 10, 1, 50); R(g, "#d8c8a8", 366, 10, 1, 50); R(g, "#d8c8a8", 358, 10, 1, 48);
    for (let i = 0; i < 4; i++) R(g, "#e8dcc4", 350 + i * 4, 40 + (i % 2) * 3, 3, 2);
    R(g, "#e8dcc4", 348, 56, 21, 4); R(g, "#b8784a", 349, 60, 19, 12); R(g, "#9a6038", 349, 70, 19, 2);
    vine(g, 350, 64, 70, -1); vine(g, 357, 66, 92, 0.4); vine(g, 365, 64, 58, 1); vine(g, 361, 66, 40, -0.4);
    ellipse(g, "#4a8a3a", 352, 60, 6, 4); ellipse(g, "#3f7a34", 364, 59, 6, 4); ellipse(g, "#5a9a44", 358, 57, 5, 3);

    // ---- wall art: Ål poster, photos, TF ----
    R(g, "#3a3028", 374, 48, 52, 70); R(g, "#2a5a8a", 377, 51, 46, 64);
    g.fillStyle = "#f4f8fc"; g.beginPath(); g.moveTo(379, 100); g.lineTo(395, 70); g.lineTo(404, 82); g.lineTo(412, 68); g.lineTo(421, 100); g.fill();
    R(g, "#2a4a2a", 377, 100, 46, 15);
    text(g, "ÅL", 389, 112, "#f4f8fc", 11);
    R(g, "#e8dcc4", 432, 52, 30, 36); R(g, "#e89aa8", 435, 55, 24, 30); R(g, "#f4c8a0", 441, 62, 7, 8); R(g, "#c96a3a", 440, 59, 9, 4);
    R(g, "#3a3028", 432, 94, 30, 26); R(g, "#7ab0d8", 434, 96, 26, 22); R(g, "#f4f8fc", 434, 108, 26, 10);
    R(g, "#e8dcc4", 468, 60, 16, 22); R(g, "#c94a4a", 470, 62, 12, 18); text(g, "TF", 471, 75, "#fff", 7);

    // ---- skis leaning in the corner ----
    const ski = (x, c, c2) => { R(g, c, x, 74, 7, 186); R(g, c2, x + 2, 74, 3, 186); R(g, c, x + 1, 68, 5, 7); R(g, c, x + 2, 64, 3, 5); R(g, "#222", x - 1, 176, 9, 12); };
    ski(492, "#e8794a", "#f4a070"); ski(502, "#3a9aa8", "#6ac4cc");
    R(g, "#555", 512, 90, 2, 170); R(g, "#555", 516, 94, 2, 166); R(g, "#222", 510, 120, 6, 4);

    // ---- wall shelf with books + records ----
    R(g, "#7a5434", 522, 98, 112, 6); R(g, "#5a3a24", 522, 103, 112, 2);
    let bx = 526;
    for (const c of ["#c94a3a", "#3a6a9a", "#e8c34a", "#4a8a5a", "#8a4ad9", "#e86a9a", "#3a3a3a", "#d9a05a"]) {
      const h = 18 + Math.floor(rnd() * 10);
      R(g, c, bx, 98 - h, 6, h); R(g, shade(c, 1.2), bx + 1, 98 - h + 2, 1, h - 4); bx += 7;
    }
    ellipse(g, "#1a1a1a", 600, 86, 12, 12); ellipse(g, "#c94a3a", 600, 86, 4, 4);   // vinyl
    R(g, "#b8784a", 616, 86, 12, 12);
    vine(g, 618, 96, 46, -0.5); vine(g, 624, 96, 64, 0.3); ellipse(g, "#4a8a3a", 622, 86, 7, 4);

    // ---- TV bench + TV ----
    R(g, "#8a5a36", 520, 248, 114, 52); R(g, "#6a4228", 520, 296, 114, 4);
    R(g, "#7a4e30", 526, 256, 50, 34); R(g, "#7a4e30", 580, 256, 48, 34);
    R(g, "#d8b070", 549, 271, 4, 2); R(g, "#d8b070", 602, 271, 4, 2);
    R(g, "#5a3a24", 524, 300, 4, 6); R(g, "#5a3a24", 626, 300, 4, 6);
    R(g, "#1a1a1a", 528, 180, 98, 64); R(g, "#2a2a2a", 571, 244, 12, 4); R(g, "#1a1a1a", 562, 247, 30, 2);

    // ---- floor: warm oak planks ----
    let y = 262, h = 9;
    while (y < H) {
      R(g, "#a8744a", 0, y, W, h);
      noise(g, 0, y, W, h, "#a8744a", 0.14, 0.35);
      R(g, "#8a5a36", 0, y + h - 1, W, 1);
      let x = -Math.floor(rnd() * 120);
      while (x < W) { const len = 80 + rnd() * 120; R(g, "#8a5a36", x, y, 1, h - 1); x += len; }
      y += h; h = Math.min(18, h + 1);
    }
    // ---- rug ----
    const rug = (x, y, w, hh) => {
      R(g, "#6a2a2a", x, y, w, hh);
      R(g, "#c99a52", x + 5, y + 5, w - 10, hh - 10);
      R(g, "#8a3430", x + 8, y + 8, w - 16, hh - 16);
      for (let i = x + 12; i < x + w - 12; i += 10) { R(g, "#c99a52", i, y + 12, 4, 2); R(g, "#c99a52", i + 5, y + hh - 14, 4, 2); }
      R(g, "#7a2e2a", x + 22, y + 20, w - 44, hh - 40);
      // centre medallion
      const cx = x + w / 2, cy = y + hh / 2;
      ellipse(g, "#c99a52", cx, cy, 46, 19); ellipse(g, "#5a3a5a", cx, cy, 42, 16); ellipse(g, "#c86a40", cx, cy, 24, 9); ellipse(g, "#e8c070", cx, cy, 8, 3);
      for (const dx of [-1, 1]) { ellipse(g, "#5a3a5a", cx + dx * 110, cy, 14, 8); ellipse(g, "#c99a52", cx + dx * 110, cy, 6, 3); }
      noise(g, x, y, w, hh, "#8a3430", 0.16, 0.18);
      for (let i = x; i < x + w; i += 3) { R(g, "#e8d8b8", i, y - 4, 1, 4); R(g, "#e8d8b8", i, y + hh, 1, 4); }
    };
    rug(176, 304, 334, 86);

    // ---- big monstera in a woven basket ----
    R(g, "#b88a50", 160, 262, 34, 32); for (let i = 0; i < 32; i += 4) R(g, "#9a6a38", 160, 262 + i, 34, 1);
    const leaf = (x, y, r) => { ellipse(g, "#2f6a34", x, y, r, r * 0.75); ellipse(g, "#3f8a44", x - 1, y - 1, r * 0.75, r * 0.5); for (let i = -r + 2; i < r - 1; i += 3) R(g, "#e6d3b0", x + i, y + (i % 2), 1, 2); };
    R(g, "#3a6a2a", 176, 200, 2, 64); R(g, "#3a6a2a", 168, 214, 2, 50); R(g, "#3a6a2a", 186, 220, 2, 44);
    leaf(166, 206, 12); leaf(186, 196, 13); leaf(176, 228, 11); leaf(196, 222, 10); leaf(160, 232, 9);

    // ---- sofa (deep teal velvet) with cushions and a knitted blanket ----
    const S = "#2f5a5a", SL = "#3f7272", SD = "#24484a";
    R(g, SD, 206, 194, 240, 6);
    R(g, S, 210, 196, 232, 54); noise(g, 210, 196, 232, 54, S, 0.1, 0.25);
    for (const x of [288, 364]) R(g, SD, x, 200, 2, 46);
    R(g, S, 214, 244, 224, 26); R(g, SL, 214, 244, 224, 4);
    for (const x of [288, 364]) R(g, SD, x, 246, 2, 22);
    R(g, SD, 206, 220, 22, 72); R(g, SL, 206, 220, 22, 5); R(g, SD, 424, 220, 22, 72); R(g, SL, 424, 220, 22, 5);
    R(g, SD, 214, 270, 224, 20);
    R(g, "#3a2418", 212, 290, 6, 8); R(g, "#3a2418", 434, 290, 6, 8);
    // cushions
    const cushion = (x, y, w, c, pat) => { R(g, c, x, y, w, 30); R(g, shade(c, 1.15), x + 2, y + 2, w - 4, 3); R(g, shade(c, 0.8), x, y + 27, w, 3); if (pat) for (let i = 4; i < w - 4; i += 6) for (let j = 6; j < 26; j += 6) R(g, pat, x + i, y + j, 2, 2); };
    cushion(232, 214, 34, "#d8a030", null);
    cushion(270, 218, 30, "#b8503a", "#e8c070");
    cushion(392, 214, 30, "#e8dcc4", "#c94a3a");
    // knitted blanket over the right arm
    R(g, "#efe6d2", 410, 224, 40, 58);
    for (let i = 0; i < 40; i += 6) for (let j = 0; j < 58; j += 4) R(g, "#d8ccb4", 412 + i, 226 + j, 2, 2);
    for (let i = 412; i < 450; i += 3) R(g, "#efe6d2", i, 282, 1, 5);

    // ---- floor lamp ----
    R(g, "#3a3028", 457, 302, 20, 4); R(g, "#555", 466, 146, 2, 158);
    g.fillStyle = "#f2dca0"; g.beginPath(); g.moveTo(452, 146); g.lineTo(482, 146); g.lineTo(476, 122); g.lineTo(458, 122); g.fill();
    R(g, "#d8b870", 452, 145, 30, 2);

    // ---- coffee table with candles, mugs and dirty fries ----
    R(g, "#6a4228", 262, 298, 150, 8); R(g, "#8a5a36", 262, 296, 150, 3);
    R(g, "#5a3a24", 268, 306, 5, 22); R(g, "#5a3a24", 401, 306, 5, 22); R(g, "#4a2e1c", 272, 318, 130, 3);
    ellipse(g, "#f4f0e8", 342, 294, 18, 5); for (let i = 0; i < 14; i++) R(g, i % 3 ? "#e8c34a" : "#d8a030", 330 + i * 1.8, 286 + (i % 4), 2, 7);
    R(g, "#c94a3a", 334, 289, 14, 2); R(g, "#f4f0e8", 338, 287, 6, 1);
    R(g, "#e8dcc4", 358, 286, 8, 10); R(g, "#e8dcc4", 366, 288, 3, 5); R(g, "#6a3a24", 359, 287, 6, 2);
    R(g, "#4a6a9a", 274, 288, 8, 10); R(g, "#4a6a9a", 282, 290, 3, 5);
    R(g, "#222", 396, 292, 12, 4);   // the TV remote
    R(g, "#1a1a1e", 372, 291, 14, 6); R(g, "#2a2a30", 373, 292, 12, 4);   // Anna's phone
    for (const [cx, cy] of HOME.candles) { R(g, "#f4f0e8", cx - 2, cy - 12, 5, 12); R(g, "#333", cx, cy - 14, 1, 2); }

    // ---- DJ desk (DJ LUX HQ) ----
    R(g, "#2a2a2e", 12, 300, 164, 8); R(g, "#3a3a40", 12, 298, 164, 3);
    R(g, "#2a2a2e", 18, 308, 6, 40); R(g, "#2a2a2e", 164, 308, 6, 40); R(g, "#222", 22, 334, 146, 3);
    // speakers
    for (const x of [16, 150]) { R(g, "#1a1a1e", x, 256, 24, 42); ellipse(g, "#3a3a40", x + 12, 268, 7, 7); ellipse(g, "#2a2a2e", x + 12, 268, 3, 3); ellipse(g, "#3a3a40", x + 12, 287, 5, 5); }
    // (the controller itself is drawn live by djRig – it changes when you buy a better one)
    // headphones + DJ LUX sticker
    R(g, "#111", 150, 296, 3, 3); g.strokeStyle = "#111"; g.lineWidth = 2; g.beginPath(); g.arc(160, 296, 8, Math.PI, 0); g.stroke(); R(g, "#111", 166, 294, 3, 4);
    R(g, "#e86a9a", 80, 312, 34, 9); text(g, "DJ LUX", 82, 320, "#fff", 8);
  }

  function homeLive(g, s) {
    const f = s.frame, night = s.hour < 6 || s.hour >= 21, evening = s.hour >= 16 && s.hour < 21;
    // sky + snow behind the window
    const gl = HOME.glass;
    const bands = night ? ["#0d1428", "#111a33", "#16203d", "#1b2647"] : evening ? ["#2a2a58", "#5a3a6a", "#a85a6a", "#e08a5a"] : ["#8aa4b8", "#9ab2c4", "#aac0d0", "#bccdda"];
    bands.forEach((c, i) => R(g, c, gl.x, gl.y + i * gl.h / 4, gl.w, gl.h / 4 + 1));
    g.save(); g.beginPath(); g.rect(gl.x, gl.y, gl.w, gl.h); g.clip();
    g.fillStyle = "rgba(255,255,255,.85)";
    for (const fl of flakes) { g.fillRect(fl[0] | 0, fl[1] | 0, fl[2] > 1 ? 2 : 1, fl[2] > 1 ? 2 : 1); fl[1] += fl[2] * 0.5; fl[0] += Math.sin((f + fl[1]) / 40) * 0.2; if (fl[1] > H) { fl[1] = gl.y - 2; fl[0] = gl.x + Math.random() * gl.w; } }
    g.restore();
    g.drawImage(layer("home", homeStatic), 0, 0);

    // TV
    const t = HOME.tv;
    if (s.tvOn) {
      const cols = ["#d95ab0", "#5a8fd9", "#7ad9a0", "#d9a05a"];
      R(g, s.tvColor || cols[Math.floor(f / 80) % cols.length], t.x, t.y, t.w, t.h);
      R(g, "rgba(255,255,255,.12)", t.x, t.y, t.w, 14);
      const d = Math.sin(f / 9) * 4;   // two ballroom dancers
      R(g, "#fff", t.x + 34 + d, t.y + 18, 6, 22); R(g, "#f4c8a0", t.x + 35 + d, t.y + 12, 4, 5);
      R(g, "#222", t.x + 46 - d, t.y + 16, 6, 24); R(g, "#f4c8a0", t.x + 47 - d, t.y + 10, 4, 5);
      R(g, "rgba(255,255,255,.18)", t.x, t.y + (f % t.h), t.w, 1);
    } else R(g, "#22282e", t.x, t.y, t.w, t.h);
    // phone screen lights up now and then (Adam? Hadi?)
    if (f % 300 < 60) R(g, "#9ad1ff", 374, 292, 10, 3);
    // everything bought in the shop / won (DJ gear, light show, skis, gear, medals, snacks)
    const S = LUX.game?.state;
    if (S) homeItems(g, f, S);

    // disco ball (always hangs there)
    const bx = 418, by = 30;
    R(g, "#888", bx, 10, 1, by - 10);
    ellipse(g, "#b8b8c4", bx, by + 8, 9, 9);
    for (let i = -8; i <= 8; i += 3) for (let j = -8; j <= 8; j += 3) if (i * i + j * j < 70 && (i + j + Math.floor(f / 8)) % 6 === 0) R(g, "#fff", bx + i, by + 8 + j, 2, 2);

    // vors: the Molde folkehøgskule gang + party lights
    if (s.party) party(g, f);

    // ---- light: daylight patch, then darkness (multiply) and warm glows (additive) ----
    const dark = night ? 0.62 : evening ? 0.3 : 0;
    if (!dark) {
      g.fillStyle = "rgba(255,240,200,.10)";
      g.beginPath(); g.moveTo(206, 176); g.lineTo(322, 176); g.lineTo(420, 330); g.lineTo(250, 330); g.fill();
    }
    const shadow = Math.min(0.8, dark + (s.lampOn ? 0 : 0.18));
    if (shadow) {
      g.globalCompositeOperation = "multiply";
      g.fillStyle = `rgba(${night ? "70,72,130" : "150,120,150"},${shadow})`;
      g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "source-over";
    }
    const glow = (x, y, r, a, col = "255,170,80") => {
      const grd = g.createRadialGradient(x, y, 1, x, y, r);
      grd.addColorStop(0, `rgba(${col},${a})`); grd.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = grd; g.fillRect(x - r, y - r, r * 2, r * 2);
    };
    g.globalCompositeOperation = "lighter";
    if (s.lampOn) {
      glow(467, 136, dark ? 230 : 110, dark ? 0.32 : 0.08);
      glow(467, 300, dark ? 120 : 60, dark ? 0.14 : 0.04);            // light pool on the floor
    }
    for (const [cx, cy] of HOME.candles) glow(cx, cy - 17, dark ? 46 : 18, dark ? 0.32 : 0.12);
    if (s.tvOn) glow(t.x + t.w / 2, t.y + t.h / 2, 120, dark ? 0.16 : 0.04, "90,140,255");
    if (S) homeLights(g, f, S, dark, s.party, glow);
    const cols = ["255,214,140", "255,190,110", "255,236,190", "255,170,120"];
    for (let i = 0; i < 37; i++) {
      const x = 6 + i * 17.5, y = 14 + Math.sin((i % 6) / 6 * Math.PI) * 9;
      const on = 0.55 + 0.45 * Math.sin(f / 18 + i * 1.7);
      if (dark) glow(x + 0.5, y + 1.5, 18, 0.22 * on, cols[i % 4]);
    }
    g.globalCompositeOperation = "source-over";
    if (s.lampOn) { R(g, "#fff2c0", 455, 140, 24, 5); R(g, "rgba(255,240,190,.5)", 458, 124, 18, 16); }
    for (const [cx, cy] of HOME.candles) {
      const fl = Math.sin(f / 3 + cx) + Math.random() * 0.6;
      R(g, "#ffb030", cx - 1, cy - 19 + fl * 0.5, 3, 5); R(g, "#fff4c0", cx, cy - 17 + fl * 0.5, 1, 2);
    }
    // fairy lights along the ceiling – twinkle
    g.strokeStyle = "rgba(60,44,30,.8)"; g.lineWidth = 1;
    g.beginPath(); for (let x = 0; x <= W; x += 4) { const i = (x - 6) / 17.5; g.lineTo(x, 13 + Math.sin(((Math.floor(i) % 6 + (i % 1)) / 6) * Math.PI) * 9); } g.stroke();
    for (let i = 0; i < 37; i++) {
      const x = 6 + i * 17.5, y = 14 + Math.sin((i % 6) / 6 * Math.PI) * 9;
      const on = 0.55 + 0.45 * Math.sin(f / 18 + i * 1.7);
      R(g, `rgba(${cols[i % 4]},${0.6 + on * 0.4})`, x - 1, y, 3, 3);
      if (on > 0.9) P(g, "#fff", x, y);
    }
  }

  // ---------- things you have bought or won, in the living room ----------
  const owns = (S, id) => !!S.collection?.[id];
  // colours per ski (top sheet, stripe)
  const SKI_COLORS = {
    atomic_bent100: ["#c9302c", "#1a1a1a"], k2_mindbender: ["#2a6ab8", "#e8e8e8"], salomon_qst: ["#2a2a2e", "#9aa0a8"],
    volkl_revolt: ["#e8e8e8", "#c9302c"], atomic_bent110: ["#e8c34a", "#1a1a1a"], k2_reckoner: ["#3a9a5a", "#1a1a1a"],
    bc_atris: ["#1a1a1a", "#c9a032"], bc_anima: ["#5a3a8a", "#f4f0e8"], japan_powder: ["#f4f0e8", "#e86a9a"],
    bc_corvus: ["#101010", "#e8e8e8"], al_1987: ["#a8703a", "#e8c34a"],
  };

  function djRig(g, f, id) {
    const led = (x, y, a, b, n = 40) => R(g, f % n < n / 2 ? a : b, x, y, 4, 2);
    if (id === "laptop") {            // the back of a laptop lid, with a sticker
      R(g, "#2a2a30", 64, 293, 62, 5);
      R(g, "#b8bcc4", 72, 266, 46, 28); R(g, "#d0d4dc", 74, 268, 42, 2);
      R(g, "#e86a9a", 86, 276, 18, 8); R(g, "#fff", 89, 279, 12, 2);
      return;
    }
    if (id === "ddj") {               // small controller with two jogwheels
      R(g, "#141418", 44, 282, 102, 16); R(g, "#2a2a30", 44, 282, 102, 2);
      for (const cx of [62, 128]) { ellipse(g, "#3a3a42", cx, 289, 11, 5); ellipse(g, "#555560", cx, 289, 3, 2); }
      for (let i = 0; i < 4; i++) R(g, "#5a5a66", 86 + i * 5, 284, 2, 10);
      led(98, 290, "#e86a9a", "#4fc3c8"); led(106, 290, "#e8c34a", "#333", 26);
      return;
    }
    if (id === "xdj") {               // big all-in-one with a screen and pads
      R(g, "#101014", 34, 274, 122, 24); R(g, "#2a2a30", 34, 274, 122, 2);
      for (const cx of [56, 134]) { ellipse(g, "#3a3a44", cx, 288, 14, 6); ellipse(g, "#4fc3c8", cx, 288, 4, 2); }
      R(g, "#0a1a22", 80, 277, 30, 11);
      for (let x = 0; x < 28; x += 2) R(g, "#4fc3c8", 81 + x, 282 - Math.abs(Math.sin((x + f / 3) / 3)) * 4, 1, 1 + Math.abs(Math.sin((x + f / 3) / 3)) * 8);
      const pads = ["#e86a9a", "#4fc3c8", "#e8c34a", "#6ac94a"];
      for (let i = 0; i < 8; i++) R(g, (Math.floor(f / 12) + i) % 5 ? pads[i % 4] : "#333", 72 + (i % 4) * 7 + (i > 3 ? 28 : 0), 292, 5, 3);
      return;
    }
    // cdj: two CDJs and a mixer in the middle
    for (const x of [26, 114]) {
      R(g, "#141418", x, 268, 50, 30); R(g, "#2a2a30", x, 268, 50, 2);
      R(g, "#0a1a22", x + 14, 271, 22, 8);
      for (let i = 0; i < 20; i += 2) R(g, "#e8a84a", x + 15 + i, 276 - Math.abs(Math.sin((i + f / 4 + x) / 3)) * 3, 1, 2 + Math.abs(Math.sin((i + f / 4 + x) / 3)) * 3);
      ellipse(g, "#3a3a44", x + 25, 289, 13, 6); ellipse(g, "#8a8a96", x + 25, 289, 3, 2);
      R(g, "#555", x + 25 + Math.cos(f / 6 + x) * 9, 289 + Math.sin(f / 6 + x) * 4, 2, 1);   // the platters spin
    }
    R(g, "#1a1a20", 78, 272, 34, 26); R(g, "#2a2a30", 78, 272, 34, 2);
    for (let i = 0; i < 3; i++) { R(g, "#444", 83 + i * 10, 284, 2, 12); R(g, "#ccc", 82 + i * 10, 288 - ((f / 20 + i) % 3) * 2, 4, 2); }
    for (let i = 0; i < 6; i++) R(g, i < (f / 6) % 7 ? (i > 3 ? "#e86a3a" : "#6ac94a") : "#222", 106, 294 - i * 3, 3, 2);
  }

  function homeItems(g, f, S) {
    djRig(g, f, S.equipped?.gear || "laptop");
    const lights = S.equipped?.lights || "ingen";
    // light-show hardware
    if (lights === "laser" || lights === "jubileum") {
      R(g, "#1a1a1e", 18, 248, 20, 8); ellipse(g, f % 20 < 10 ? "#6ae86a" : "#2a6a2a", 34, 252, 2, 2);   // laser box on the speaker
      R(g, "#2a2a2e", 182, 326, 22, 14); R(g, "#555", 200, 330, 6, 4);                              // smoke machine
    }
    if (lights === "jubileum") {
      R(g, "#1a1a20", 32, 34, 112, 30); R(g, "#2a2a30", 34, 36, 108, 26);                          // «TF 40 ÅR» sign
      const on = f % 90 < 80;
      text(g, "TF 40 ÅR", 44, 56, on ? "#ff8ac4" : "#8a4a6a", 16);
      R(g, "#3a3a44", 208, 330, 10, 16); R(g, "#c9a032", 206, 326, 14, 5);                          // confetti cannon
      R(g, "#e86a9a", 209, 338, 8, 2);
    }
    if (lights === "disco" || lights === "jubileum") {
      R(g, "#2a2a2e", 440, 6, 10, 6); R(g, "#fff6c0", 442, 12, 6, 2);                              // spotlight on the ball
    }

    // the ski wall: every pair of skis you have won
    const skis = (LUX.content.collection?.skis || []).filter(x => owns(S, x.id));
    if (skis.length) {
      R(g, "#6a6a70", 544, 106, 3, 6 + skis.length * 6); R(g, "#6a6a70", 612, 106, 3, 6 + skis.length * 6);
      skis.forEach((sk, i) => {
        const [c, c2] = SKI_COLORS[sk.id] || ["#e8794a", "#1a1a1a"];
        const y = 110 + i * 6;
        R(g, c, 528, y, 100, 4); R(g, c2, 540, y + 1, 76, 1); R(g, c, 524, y - 1, 5, 3); R(g, "#222", 572, y, 12, 4);
      });
    }

    // gear on the floor in front of the TV bench
    const G2 = id => owns(S, id);
    if (G2("hjelm")) { ellipse(g, "#e8e8e8", 486, 334, 10, 8); R(g, "#e8e8e8", 476, 334, 20, 6); R(g, "#c94a4a", 482, 330, 8, 4); text(g, "TF", 482, 334, "#fff", 5); }
    if (G2("goggles")) { R(g, "#2a2a2e", 498, 336, 16, 2); ellipse(g, f % 120 < 60 ? "#e8a84a" : "#d98ac4", 506, 337, 7, 4); }
    if (G2("skisko")) for (const x of [524, 540]) { R(g, "#e86a3a", x, 322, 13, 20); R(g, "#2a2a2e", x - 2, 340, 17, 5); R(g, "#2a2a2e", x + 2, 326, 9, 2); R(g, "#2a2a2e", x + 2, 332, 9, 2); }
    if (G2("skredsokar")) { R(g, "#e8c34a", 562, 334, 10, 10); R(g, "#2a2a2e", 564, 336, 6, 3); R(g, f % 60 < 30 ? "#6ac94a" : "#2a4a2a", 569, 341, 2, 2); }
    if (G2("feller")) { ellipse(g, "#c94a4a", 584, 340, 6, 4); ellipse(g, "#8a2a2a", 584, 340, 2, 2); }
    if (G2("airbag")) { R(g, "#e86a9a", 596, 312, 22, 32); R(g, "#c94a7a", 598, 314, 18, 4); R(g, "#2a2a2e", 600, 324, 3, 18); R(g, "#2a2a2e", 611, 324, 3, 18); }
    if (G2("staver")) { R(g, "#555", 630, 230, 2, 110); R(g, "#555", 634, 234, 2, 106); R(g, "#222", 628, 228, 6, 4); }

    // medals and story prizes on the walls
    if (G2("tf_medalje")) { R(g, "#c94a4a", 472, 84, 2, 10); R(g, "#2a5a9a", 476, 84, 2, 10); ellipse(g, "#e8c34a", 475, 99, 5, 5); ellipse(g, "#fff2a0", 474, 98, 2, 2); }
    if (G2("tf_kjekkeste")) {                                                      // trophy on the right speaker
      R(g, "#c9a032", 158, 236, 10, 9); R(g, "#e8c34a", 159, 237, 8, 3); R(g, "#c9a032", 161, 245, 4, 5); R(g, "#7a5a2a", 156, 250, 14, 6);
      if (f % 80 < 8) R(g, "#fff", 160, 238, 2, 2);
    }
    if (G2("sponsored")) { R(g, "#2a2a30", 376, 126, 46, 34); R(g, "#e86a9a", 378, 128, 42, 30); text(g, "SPONSORED", 379, 140, "#fff", 6); text(g, "SKIER ⭐", 382, 152, "#fff", 6); }
    if (G2("kasta_ut")) { R(g, "#3a3028", 427, 126, 22, 28); R(g, "#f4f0e8", 429, 128, 18, 24); for (let i = 0; i < 5; i++) R(g, "#8a8a8a", 431, 132 + i * 4, 12 - (i % 2) * 4, 1); R(g, "#c94a4a", 438, 146, 6, 4); }
    if (G2("van_temja")) { R(g, "#555", 188, 140, 2, 6); ellipse(g, "#c9a032", 189, 150, 3, 3); R(g, "#c9a032", 188, 152, 2, 7); R(g, "#e8794a", 191, 146, 7, 5); }
    if (G2("al_laerar")) { ellipse(g, "#c9302c", 298, 290, 5, 5); R(g, "#5a3a24", 297, 284, 2, 3); ellipse(g, "#4a8a3a", 301, 285, 2, 1); }

    // snacks you bought: they stay on the table for a while
    const now = Date.now(), it = S.items || {};
    if (it.friesUntil > now) {                    // a tray of fresh dirty fries on the rug, left of Anna
      ellipse(g, "#f4f0e8", 240, 342, 16, 5); ellipse(g, "#d8d0c0", 240, 344, 16, 3);
      for (let i = 0; i < 13; i++) R(g, i % 3 ? "#e8c34a" : "#d8a030", 228 + i * 1.8, 334 + (i % 4), 2, 7);
      R(g, "#c94a3a", 230, 337, 14, 2); R(g, "#6ac94a", 236, 335, 3, 1);
      for (let i = 0; i < 3; i++) { const k = (f / 2 + i * 12) % 26, y = 328 - k; R(g, `rgba(255,255,255,${0.3 - k / 90})`, 233 + i * 5 + Math.sin(y / 4) * 2, y, 2, 3); }   // steam
    }
    if (it.pilsUntil > now) {                     // a crate of pils on the floor by the sofa
      R(g, "#c94a3a", 414, 330, 30, 16); R(g, "#a83a2a", 414, 336, 30, 2); text(g, "PILS", 418, 344, "#fff", 6);
      for (let i = 0; i < 5; i++) { R(g, "#c0c8d0", 416 + i * 6, 323, 4, 8); R(g, "#e8e8ec", 416 + i * 6, 323, 4, 1); }
    }
    if (it.bungy) { R(g, "#f4f0e8", 205, 148, 28, 15); R(g, "#2a6ab8", 205, 148, 28, 3); text(g, "STRIKK", 207, 160, "#c94a4a", 6); R(g, "rgba(255,255,255,.6)", 203, 147, 6, 2); }
  }

  // the light show's effects – only when it's dark-ish or there's a party
  function homeLights(g, f, S, dark, party, glow) {
    const lights = S.equipped?.lights || "ingen";
    if (lights === "ingen" || (!dark && !party)) return;
    const strength = party ? 1 : Math.min(1, dark * 1.4);
    if (lights === "disco" || lights === "jubileum") {         // spots from the disco ball sweep over the walls
      glow(418, 38, 30, 0.25 * strength, "255,255,255");
      for (let i = 0; i < 18; i++) {
        const a = i * 0.35 + f / 70, x = (418 + Math.cos(a) * (120 + (i % 5) * 50) + W) % W, y = 60 + Math.abs(Math.sin(a * 1.7 + i)) * 220;
        glow(x, y, 6, 0.5 * strength, "255,250,230");
      }
    }
    if (lights === "laser" || lights === "jubileum") {         // green / red laser fans + haze
      g.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const a = -0.2 + Math.sin(f / 50 + i * 0.5) * 0.45 + i * 0.08;
        g.strokeStyle = `rgba(${i % 2 ? "120,255,120" : "255,80,100"},${0.35 * strength})`;
        g.beginPath(); g.moveTo(34, 252); g.lineTo(34 + Math.cos(a) * 640, 252 + Math.sin(a) * 640); g.stroke();
      }
      g.fillStyle = `rgba(200,210,255,${0.05 * strength})`; g.fillRect(0, 300, W, 100);   // smoke on the floor
    }
    if (lights === "jubileum") {
      glow(88, 50, 70, 0.3 * strength, "255,120,190");
      if (party || f % 600 < 120) for (let i = 0; i < 30; i++) {   // confetti now and then (always at vors)
        const x = (i * 83 + f * (1 + i % 3) * 0.7) % W, y = (i * 47 + f * 1.2) % 330;
        R(g, ["#e86a9a", "#4fc3c8", "#e8c34a", "#8a4ad9"][i % 4], x, y, 3, 2);
      }
    }
  }

  function party(g, f) {
    const people = [
      { x: 236, hair: "#d9b56a", top: "#c94a7a", pants: "#2a2a3a", long: true, cup: true },   // Jenny
      { x: 268, hair: "#e0b868", top: "#3a5a8a", pants: "#3e5c8c", long: true },               // Hennie (blonde, denim vest)
      { x: 300, hair: "#5a3420", top: "#ece8e0", pants: "#4a6a9a", cup: true },               // Idunn (brown bun, white top)
      { x: 404, hair: "#1a1a1a", top: "#e8c34a", pants: "#2a2a3a", cup: true },
      { x: 436, hair: "#c9a060", top: "#7a3ab0", pants: "#1a1a2a", long: true },
      { x: 120, hair: "#5a3a2a", top: "#e86a3a", pants: "#2a2a3a" },
    ];
    people.forEach((p, i) => person(g, p.x, 300, { ...p, s: 2.2, bob: Math.abs(Math.sin(f / 9 + i)) * 4, arms: (Math.floor(f / 40) + i) % 3 === 0 ? "up" : null }));
    const cols = ["232,106,154", "79,195,200", "232,195,74", "138,74,217"];
    for (let i = 0; i < 24; i++) {
      const a = i * 1.3 + f / 40;
      g.fillStyle = `rgba(${cols[i % 4]},.55)`;
      g.fillRect((418 + Math.cos(a) * (80 + i * 14) + W) % W, 60 + Math.abs(Math.sin(a * 1.3)) * 300, 4, 3);
    }
    g.fillStyle = `rgba(${f % 60 < 30 ? "140,40,160" : "40,60,160"},.12)`;
    g.fillRect(0, 0, W, H);
  }

  // =====================================================================
  //  TF-SIRKELTRENING (gym hall)
  // =====================================================================
  function gymStatic(g) {
    // upper wall + high windows
    R(g, "#dcd6c6", 0, 0, W, 150);
    noise(g, 0, 0, W, 150, "#dcd6c6", 0.05, 0.15);
    for (let x = 30; x < W - 40; x += 100) { R(g, "#8a8a84", x - 3, 14, 76, 48); g.clearRect(x, 17, 70, 42); R(g, "#8a8a84", x + 34, 17, 2, 42); }
    // ceiling lamps
    for (let x = 60; x < W; x += 140) { R(g, "#c8c8c0", x, 4, 60, 6); R(g, "#fffbe8", x + 2, 9, 56, 2); }
    // lower wall: light wood panels
    R(g, "#c9a46a", 0, 150, W, 112);
    for (let x = 0; x < W; x += 32) { R(g, "#b8925a", x, 150, 2, 112); }
    noise(g, 0, 150, W, 112, "#c9a46a", 0.12, 0.3);
    R(g, "#8a6a40", 0, 148, W, 3);
    // wall bars (ribbevegg)
    for (const bx of [14, 62]) { R(g, "#a8784a", bx, 76, 6, 186); R(g, "#a8784a", bx + 40, 76, 6, 186); for (let y = 84; y < 260; y += 12) R(g, "#c99a62", bx + 6, y, 34, 4); }
    // banner
    R(g, "#a82a2a", 168, 76, 270, 30); R(g, "#c94a4a", 170, 78, 266, 26);
    text(g, "NTNUI TF · SIRKELTRENING", 184, 96, "#fff", 13);
    // clock frame (hands are live)
    ellipse(g, "#333", 470, 92, 17, 17); ellipse(g, "#fff", 470, 92, 14, 14);
    for (let i = 0; i < 12; i++) R(g, "#333", 470 + Math.cos(i / 6 * Math.PI) * 11, 92 + Math.sin(i / 6 * Math.PI) * 11, 2, 2);
    // whiteboard with the stations
    R(g, "#7a7a7a", 500, 66, 128, 104); R(g, "#f6f6f2", 503, 69, 122, 98);
    const lines = ["STASJONAR 45/15:", "1 Burpees", "2 Kettlebell", "3 BENK", "4 Planke", "5 Boks-hopp", "6 Hoppetau"];
    lines.forEach((l, i) => text(g, l, 508, 82 + i * 11, i === 0 ? "#2a5ab0" : i === 3 ? "#b02a2a" : "#333", 8, i === 0 || i === 3));
    text(g, "IKKE TENK –", 510, 160, "#b02a2a", 8); text(g, "BARE BENK!", 568, 160, "#b02a2a", 8);
    // blue crash mats along the wall
    for (let x = 120; x < 500; x += 64) { R(g, "#2a5a9a", x, 214, 62, 48); R(g, "#3a6aaa", x + 2, 216, 58, 6); R(g, "#1a4a8a", x, 260, 62, 2); }
    // TF bags and water bottles by the wall
    for (const [x, c] of [[516, "#c94a4a"], [552, "#2a2a2a"], [586, "#3a6a9a"]]) { R(g, c, x, 232, 30, 30); R(g, shade(c, 1.2), x + 4, 228, 22, 5); text(g, "TF", x + 9, 252, "#fff", 8); }
    for (let i = 0; i < 4; i++) { R(g, ["#4fc3c8", "#e86a9a", "#e8c34a", "#6ac94a"][i], 622 - i * 8, 244, 5, 18); R(g, "#222", 622 - i * 8, 242, 5, 3); }

    // sports floor
    for (let y = 262; y < H; y += 2) R(g, y % 6 ? "#d99a52" : "#cf9048", 0, y, W, 2);
    for (let x = 0; x < W; x += 28) R(g, "#c08040", x + ((x / 28) % 2) * 14, 262, 1, 138);
    noise(g, 0, 262, W, 138, "#d99a52", 0.1, 0.18);
    R(g, "#f4f4f4", 0, 320, W, 3);                       // centre line
    g.strokeStyle = "#f4f4f4"; g.lineWidth = 3; g.beginPath(); g.ellipse(320, 340, 60, 26, 0, 0, Math.PI * 2); g.stroke();
    R(g, "#c94a4a", 0, 290, W, 2); R(g, "#2a5ab0", 0, 376, W, 2);
    // shine from the ceiling lamps
    for (let x = 60; x < W; x += 140) { g.fillStyle = "rgba(255,255,240,.12)"; g.fillRect(x, 264, 60, 130); }

    // stations (props)
    // 3: BENK – bench + rack
    R(g, "#333", 46, 300, 6, 30); R(g, "#333", 150, 300, 6, 30);
    R(g, "#2a2a2e", 60, 318, 96, 8); R(g, "#555", 70, 326, 4, 14); R(g, "#555", 142, 326, 4, 14);
    R(g, "#ffffff", 44, 296, 14, 10); text(g, "3 BENK", 60, 352, "#b02a2a", 9);
    // 2: kettlebells
    for (const [x, c] of [[210, "#333"], [228, "#c94a4a"], [246, "#2a5ab0"]]) { ellipse(g, c, x, 352, 7, 7); g.strokeStyle = c; g.lineWidth = 2; g.beginPath(); g.arc(x, 345, 4, Math.PI, 0); g.stroke(); }
    // 5: plyo box
    R(g, "#8a5a36", 380, 300, 44, 36); R(g, "#a8744a", 380, 300, 44, 5); text(g, "5", 398, 324, "#fff", 12);
    // 4: mat for planke
    R(g, "#3a3a8a", 452, 344, 82, 12); R(g, "#4a4a9a", 452, 344, 82, 3);
    // cones + a speaker
    for (const x of [176, 336, 548]) { g.fillStyle = "#f08a2a"; g.beginPath(); g.moveTo(x, 300); g.lineTo(x + 7, 300); g.lineTo(x + 3.5, 288); g.fill(); }
    R(g, "#1a1a1e", 594, 288, 24, 34); ellipse(g, "#3a3a40", 606, 300, 6, 6); ellipse(g, "#3a3a40", 606, 314, 4, 4);
  }

  function gymLive(g, s) {
    const f = s.frame;
    // evening sky in the high windows
    for (let x = 30; x < W - 40; x += 100) {
      const night = s.hour >= 17 || s.hour < 7;
      R(g, night ? "#141c38" : "#9ab2c8", x, 17, 70, 42);
      if (night) for (let i = 0; i < 5; i++) R(g, "#fff8d0", x + ((i * 23 + x) % 66), 20 + ((i * 13) % 30), 1, 1);
      g.fillStyle = "rgba(255,255,255,.8)";
      for (let i = 0; i < 6; i++) g.fillRect(x + ((i * 17 + f / 3) % 70), 17 + ((i * 11 + f / 2) % 42), 1, 1);
    }
    g.drawImage(layer("gym", gymStatic), 0, 0);
    // clock hands (she's always 7 minutes late)
    const hr = s.hour, ha = ((hr % 12) / 12) * Math.PI * 2 - Math.PI / 2, ma = ((hr % 1) * Math.PI * 2) - Math.PI / 2;
    g.strokeStyle = "#222"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(470, 92); g.lineTo(470 + Math.cos(ha) * 7, 92 + Math.sin(ha) * 7); g.stroke();
    g.lineWidth = 1; g.beginPath(); g.moveTo(470, 92); g.lineTo(470 + Math.cos(ma) * 11, 92 + Math.sin(ma) * 11); g.stroke();
    // the TF crowd training
    const t = f / 10;
    person(g, 100, 318, { pose: "lying", s: 2.2, hair: "#3a2a1a", top: "#c94a4a", pants: "#2a2a3a", lift: Math.round((Math.sin(t) + 1) * 3) });
    person(g, 228, 340, { s: 2.2, hair: "#d9b56a", top: "#2a5ab0", pants: "#1a1a2a", long: true, pose: Math.sin(t * 1.2) > 0 ? "squat" : null, arms: Math.sin(t * 1.2) > 0 ? null : "front" });
    person(g, 402, 300 - Math.max(0, Math.sin(t * 1.4)) * 30, { s: 2.2, hair: "#8a4a2a", top: "#3a8a5a", pants: "#2a2a2a", long: true, arms: "up" });
    person(g, 494, 352, { pose: "plank", s: 2.2, hair: "#1a1a1a", top: "#e8c34a", pants: "#2a2a3a" });
    const jump = Math.abs(Math.sin(t * 2)) * 6;
    person(g, 560, 360, { s: 2.2, hair: "#c9a060", top: "#e86a9a", pants: "#1a1a2a", long: true, bob: jump });
    g.strokeStyle = "#333"; g.lineWidth = 1; g.beginPath(); g.ellipse(560, 330 - jump, 16, 32, 0, 0, Math.PI * 2); g.stroke();
    // music from the speaker
    for (let i = 0; i < 3; i++) { const y = 280 - ((f + i * 30) % 90); g.fillStyle = `rgba(40,40,40,${1 - ((f + i * 30) % 90) / 90})`; g.font = "bold 12px monospace"; g.fillText("♪", 600 + Math.sin((f + i * 20) / 15) * 6, y); }
  }


  // =====================================================================
  //  GRAFEN – JubileumsGalla 2026 TF (after the real restaurant: big cream arches, globe pendants,
  //  copper back room with black steel arched doors, a Christmas tree and a mosaic floor)
  // =====================================================================
  const GR = {
    globes: [[320, 34, 15], [320, 70, 11], [320, 96, 8], [320, 114, 6]],
    sconces: [[150, 200], [496, 196]],
    tree: { x: 418, top: 196, bottom: 292 },
  };

  function archPath(g, cx, top, rx, ry, x0, x1, bottom, keep) {
    if (!keep) g.beginPath();
    g.moveTo(x0, bottom);
    g.lineTo(x0, top + ry);
    g.ellipse(cx, top + ry, rx, ry, 0, Math.PI, 0);
    g.lineTo(x1, bottom);
    g.closePath();
  }

  function grafenStatic(g) {
    // ---- the deep hall seen through the near arch ----
    // ceiling with soft wavy relief
    R(g, "#5e4c3c", 0, 0, W, 130);
    for (let y = 8; y < 120; y += 7) for (let x = 0; x < W; x += 2) P(g, (Math.floor(x / 26) + Math.floor(y / 7)) % 2 ? "#6e5a48" : "#54442f", x, y + Math.sin(x / 13) * 2);
    R(g, "#ece4d4", 0, 112, W, 6); R(g, "#d6ccb8", 0, 118, W, 3);          // cornice
    // side walls of the hall (cream above, taupe below)
    R(g, "#e2d8c4", 0, 121, W, 140); R(g, "#9c958a", 0, 236, W, 60);
    noise(g, 0, 121, W, 175, "#e2d8c4", 0.04, 0.12);
    // tall dark arched window on the left wall + nutcracker
    archPath(g, 116, 128, 20, 20, 96, 136, 232); g.fillStyle = "#1c2a44"; g.fill();
    g.strokeStyle = "#2a2a2a"; g.lineWidth = 2; g.stroke();
    for (let i = 0; i < 5; i++) P(g, "#4a8a3a", 98 + i * 3, 150 + (i % 2) * 4);    // garland
    // ---- the second (far) arch ----
    R(g, "#e6dccb", 120, 121, 400, 175); R(g, "#9c958a", 120, 240, 400, 56);
    g.save(); archPath(g, 320, 150, 128, 64, 192, 448, 296); g.clip();
    // back room: copper wall, darker ceiling
    R(g, "#4e3e30", 192, 150, 256, 60);
    R(g, "#a8644a", 192, 205, 256, 91); noise(g, 192, 205, 256, 91, "#a8644a", 0.1, 0.25);
    R(g, "#8a4e3a", 192, 280, 256, 16);
    // black steel arched frames (glass doors)
    g.strokeStyle = "#141414"; g.lineWidth = 2;
    for (const [cx, w] of [[262, 52], [378, 52]]) {
      archPath(g, cx, 214, w / 2, 18, cx - w / 2, cx + w / 2, 290); g.stroke();
      R(g, "#141414", cx - 1, 232, 2, 58);
      g.fillStyle = "rgba(200,220,230,.08)"; archPath(g, cx, 214, w / 2, 18, cx - w / 2, cx + w / 2, 290); g.fill();
    }
    g.beginPath(); g.ellipse(320, 236, 34, 40, 0, Math.PI, 0); g.stroke();   // the tall middle arch frame
    R(g, "#141414", 286, 236, 2, 54); R(g, "#141414", 352, 236, 2, 54);
    g.restore();
    // grey rim of the far arch
    g.strokeStyle = "#d6ccb8"; g.lineWidth = 4; archPath(g, 320, 150, 130, 66, 190, 450, 296); g.stroke();
    // armchair + small round table by the tree
    R(g, "#7a3424", 452, 262, 34, 24); R(g, "#8e4430", 452, 252, 34, 12); R(g, "#6a2a1c", 448, 258, 6, 28); R(g, "#6a2a1c", 484, 258, 6, 28);
    R(g, "#c99a62", 494, 270, 26, 3); R(g, "#8a6a44", 506, 273, 2, 20);
    // potted palm on the right
    R(g, "#a87a4a", 520, 272, 22, 22);
    for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.4; g.strokeStyle = i % 2 ? "#3f7a34" : "#2f5a2a"; g.lineWidth = 3; g.beginPath(); g.moveTo(531, 272); g.quadraticCurveTo(531 + Math.cos(a) * 18, 240 + Math.sin(a) * 6, 531 + Math.cos(a) * 30, 236 + Math.sin(a) * 20 + 20); g.stroke(); }
    // marble side tables with wooden chairs (left side)
    for (const [x, y] of [[150, 268], [196, 276]]) {
      R(g, "#e8e2d8", x, y, 40, 5); R(g, "#cfc8bb", x, y + 4, 40, 2); R(g, "#4a3424", x + 4, y + 6, 3, 20); R(g, "#4a3424", x + 33, y + 6, 3, 20);
      for (const cx of [x - 8, x + 42]) { R(g, "#8a5a36", cx, y - 14, 3, 34); R(g, "#8a5a36", cx + 9, y - 2, 3, 22); R(g, "#a8744a", cx, y + 2, 12, 3); }
    }

    // ---- mosaic floor (fish-scale circles in perspective) ----
    R(g, "#e7e1d5", 0, 292, W, 108);
    let row = 0;
    for (let y = 292; y < H + 20; row++) {
      const k = (y - 292) / 108, sz = 4 + k * 22;
      g.strokeStyle = `rgba(40,40,40,${0.55 + k * 0.35})`; g.lineWidth = 1 + k;
      for (let x = (row % 2) * sz - sz; x < W + sz; x += sz * 2) {
        g.beginPath(); g.ellipse(x, y, sz, sz * 0.45, 0, Math.PI, 0); g.stroke();
        if (k > 0.3) { g.beginPath(); g.ellipse(x, y, sz * 0.55, sz * 0.25, 0, Math.PI, 0); g.stroke(); }
      }
      y += sz * 0.45;
    }
    noise(g, 0, 292, W, 108, "#e7e1d5", 0.05, 0.08);

    // ---- the near arch (frames everything) ----
    g.save();
    g.beginPath(); g.rect(0, 0, W, H); archPath(g, 320, 16, 262, 104, 58, 582, 400, true);
    g.clip("evenodd");
    R(g, "#e9e1d0", 0, 0, W, H); noise(g, 0, 0, W, H, "#e9e1d0", 0.04, 0.12);
    R(g, "#a39c90", 0, 250, W, 150); noise(g, 0, 250, W, 150, "#a39c90", 0.06, 0.15);
    R(g, "#d8cfbd", 0, 246, W, 4);
    g.restore();
    g.strokeStyle = "#d4cab6"; g.lineWidth = 5; archPath(g, 320, 16, 262, 104, 58, 582, 400); g.stroke();
    // nutcracker on the right, in front of the pillar
    const nut = (x, y) => {
      R(g, "#f2efe8", x, y, 16, 38); R(g, "#c94a4a", x - 2, y + 12, 20, 4); R(g, "#f2efe8", x + 1, y - 18, 14, 18);
      R(g, "#f4d2b0", x + 3, y - 12, 10, 8); R(g, "#222", x + 5, y - 9, 2, 2); R(g, "#222", x + 9, y - 9, 2, 2);
      R(g, "#f2efe8", x + 2, y - 26, 12, 9); R(g, "#d8b040", x + 2, y - 18, 12, 2);
      R(g, "#2a2a2a", x + 2, y + 38, 5, 12); R(g, "#2a2a2a", x + 9, y + 38, 5, 12);
    };
    nut(590, 300); nut(28, 286);
    // wall sconces on the near pillars
    for (const [x, y] of [[40, 200], [600, 196]]) { R(g, "#2a2a2a", x - 10, y, 22, 2); R(g, "#2a2a2a", x + 10, y, 2, 8); ellipse(g, "#3a3a3a", x + 11, y + 10, 10, 3); }
    // banner for the gala over the far arch
    R(g, "#1f3a2a", 214, 128, 212, 18); R(g, "#d8b040", 214, 128, 212, 2); R(g, "#d8b040", 214, 144, 212, 2);
    text(g, "JUBILEUMSGALLA 2026 · TF 40 ÅR", 222, 141, "#e8c860", 9);
  }

  function grafenLive(g, s) {
    const f = s.frame, heat = s.heat ?? 0.5;
    g.drawImage(layer("grafen", grafenStatic), 0, 0);
    // pendant cord
    R(g, "#222", 320, 0, 1, 110);
    // Christmas tree with twinkling lights
    const T = GR.tree;
    for (let y = T.top; y < T.bottom; y++) { const w = ((y - T.top) / (T.bottom - T.top)) * 26 + 2; R(g, y % 6 < 3 ? "#1f4a2a" : "#2a5a32", T.x - w, y, w * 2, 1); }
    R(g, "#5a3a24", T.x - 3, T.bottom, 6, 6);
    for (let i = 0; i < 26; i++) {
      const yy = T.top + 6 + ((i * 37) % (T.bottom - T.top - 8)), w = ((yy - T.top) / (T.bottom - T.top)) * 24;
      const xx = T.x + Math.sin(i * 2.3) * w;
      const on = Math.sin(f / 12 + i * 1.9) > -0.3;
      R(g, on ? "#ffe9a0" : "#8a7a40", xx, yy, 2, 2);
    }
    R(g, "#ffd84a", T.x - 2, T.top - 4, 5, 5);
    // dancing gala crowd (more people, wilder, when the floor is hot)
    const outfits = [["#1a1a24", "#3a2a1a"], ["#a82a4a", "#d9b56a", 1], ["#1f3a6a", "#1a1a1a"], ["#2a5a3a", "#8a4a2a", 1], ["#1a1a1a", "#c9a060"], ["#c9a032", "#5a3a2a", 1], ["#5a2a6a", "#1a1a1a", 1], ["#1a1a24", "#d9b56a"]];
    const n = Math.round(5 + heat * 17);
    for (let i = 0; i < n; i++) {
      const depth = (i * 7) % 5, y = 306 + depth * 14, x = 200 + ((i * 53) % 340);
      const [top, hair, dress] = outfits[i % outfits.length];
      const beat = Math.abs(Math.sin(f / (11 - heat * 5) + i));
      person(g, x, y, { s: 1.6 + depth * 0.15, top, pants: dress ? top : "#1a1a1a", hair, long: !!dress, bob: beat * (2 + heat * 7),
        arms: heat > 0.55 && (Math.floor(f / 30) + i) % 3 === 0 ? "up" : null, cup: i % 5 === 0 });
    }
    // ---- light ----
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgba(120,100,120,.35)"; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "lighter";
    const glow = (x, y, r, a, col = "255,190,110") => {
      const grd = g.createRadialGradient(x, y, 1, x, y, r);
      grd.addColorStop(0, `rgba(${col},${a})`); grd.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = grd; g.fillRect(x - r, y - r, r * 2, r * 2);
    };
    for (const [x, y, r] of GR.globes) glow(x, y, r * 6, 0.28);
    for (const [x, y] of [[51, 210], [611, 206]]) glow(x, y, 50, 0.3);
    for (const x of [250, 395]) glow(x, 218, 26, 0.35, "255,200,90");     // chandeliers in the back room
    glow(T.x, (T.top + T.bottom) / 2, 50, 0.18, "255,220,140");
    // party beams (more with heat)
    const cols = ["232,106,154", "79,195,200", "232,195,74", "138,74,217"];
    for (let i = 0; i < 4; i++) {
      const a = Math.sin(f / 30 + i * 1.7) * 0.7;
      g.fillStyle = `rgba(${cols[i]},${0.04 + heat * 0.1})`;
      g.beginPath(); g.moveTo(140 + i * 120, 120); g.lineTo(140 + i * 120 + Math.sin(a) * 160 - 30, 400); g.lineTo(140 + i * 120 + Math.sin(a) * 160 + 30, 400); g.fill();
    }
    g.globalCompositeOperation = "source-over";
    // the globe pendants themselves
    for (const [x, y, r] of GR.globes) { ellipse(g, "#fff6dc", x, y, r, r * 0.95); ellipse(g, "#fffdf2", x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.35); R(g, "#222", x - 2, y - r - 2, 4, 3); }
    for (const x of [250, 395]) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + f / 60; R(g, "#ffe08a", x + Math.cos(a) * 9, 218 + Math.sin(a) * 5, 2, 2); }
    // confetti when it's hot, white flash on a drop
    if (heat > 0.8) for (let i = 0; i < 40; i++) { const x = (i * 97 + f * (1 + i % 3)) % W, y = (i * 53 + f * 1.5) % H; R(g, cols[i % 4].split(",").length ? `rgb(${cols[i % 4]})` : "#fff", x, y, 3, 2); }
    // your light show from the shop
    const lightsId = LUX.game?.state?.equipped?.lights || "ingen";
    if (lightsId === "disco" || lightsId === "jubileum") {
      R(g, "#888", 470, 0, 1, 52); ellipse(g, "#c8c8d4", 470, 60, 11, 11);
      for (let i = -9; i <= 9; i += 3) for (let j = -9; j <= 9; j += 3) if (i * i + j * j < 90 && (i + j + Math.floor(f / 6)) % 5 === 0) R(g, "#fff", 470 + i, 60 + j, 2, 2);
      g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 22; i++) { const a = i * 0.29 + f / 60; const x = (470 + Math.cos(a) * (90 + (i % 6) * 60) + W) % W, y = 80 + Math.abs(Math.sin(a * 1.6 + i)) * 280; R(g, `rgba(255,250,230,${0.35 + heat * 0.3})`, x, y, 3, 3); }
      g.globalCompositeOperation = "source-over";
    }
    if (lightsId === "laser" || lightsId === "jubileum") {
      g.lineWidth = 1;
      for (let i = 0; i < 9; i++) {
        const a = -2.6 + Math.sin(f / 45 + i * 0.6) * 0.5 + i * 0.12;
        g.strokeStyle = `rgba(${i % 2 ? "120,255,120" : "255,80,110"},${0.2 + heat * 0.35})`;
        g.beginPath(); g.moveTo(320, 300); g.lineTo(320 + Math.cos(a) * 700, 300 + Math.sin(a) * 700); g.stroke();
      }
    }
    if (lightsId === "jubileum") {
      R(g, "#1a1a20", 260, 6, 120, 26); text(g, "TF 40 ÅR", 276, 26, f % 90 < 80 ? "#ff8ac4" : "#8a4a6a", 16);
      if (heat > 0.5) for (let i = 0; i < 30; i++) { const x = (i * 71 + f * (1 + i % 3)) % W, y = (i * 59 + f * 1.8) % H; R(g, ["#e86a9a", "#4fc3c8", "#e8c34a", "#8a4ad9"][i % 4], x, y, 3, 2); }
    }
    if (s.flash > 0) { g.fillStyle = `rgba(255,255,255,${s.flash * 0.6})`; g.fillRect(0, 0, W, H); }
  }

  // =====================================================================
  //  THE SLOPES – Japan (Mount Fuji, pagoda, torii) and Ål skisenter. The foreground scrolls
  //  (trees and ski tracks rush past) so it feels like skiing downhill.
  // =====================================================================
  const pines = Array.from({ length: 14 }, (_, i) => ({ x: i % 2 ? 20 + Math.random() * 120 : 500 + Math.random() * 120, y: Math.random() * 400, s: 0.7 + Math.random() * 0.8 }));

  function snowPine(g, x, y, h, dark, snow) {
    for (let i = 0; i < h; i++) {
      const w = Math.max(1, ((h - i) / h) * h * 0.38) | 0;
      R(g, i % 5 < 2 ? snow : dark, x - w, y - i, w * 2 + 1, 1);
    }
    R(g, "#4a3424", x - 1, y, 3, Math.max(2, h * 0.12));
  }

  function skyBands(g, hour, h) {
    const night = hour < 6 || hour >= 20, eve = hour >= 16 && hour < 20;
    const top = night ? [10, 16, 40] : eve ? [70, 60, 120] : [90, 150, 215];
    const bot = night ? [30, 40, 80] : eve ? [240, 150, 120] : [235, 215, 225];
    for (let y = 0; y < h; y += 2) {
      const k = y / h;
      R(g, `rgb(${top.map((c, i) => Math.round(c + (bot[i] - c) * k)).join(",")})`, 0, y, W, 2);
    }
    return { night, eve };
  }

  function japanStatic(g) {
    // Mount Fuji
    g.fillStyle = "#5d6f9c";
    g.beginPath(); g.moveTo(150, 250); g.lineTo(352, 66); g.lineTo(392, 62); g.lineTo(600, 250); g.fill();
    g.fillStyle = "#7182ad";                      // lit side
    g.beginPath(); g.moveTo(352, 66); g.lineTo(372, 64); g.lineTo(330, 250); g.lineTo(150, 250); g.fill();
    // snow cap with jagged edge
    g.fillStyle = "#f4f7fc";
    g.beginPath(); g.moveTo(352, 66); g.lineTo(392, 62);
    const cap = [[420, 92], [410, 100], [436, 112], [424, 118], [450, 126], [440, 132], [462, 140]];
    for (const [x, y] of cap) g.lineTo(x, y);
    const capL = [[300, 120], [312, 126], [288, 132], [300, 122], [318, 110], [306, 104], [326, 96], [318, 90], [336, 82]];
    g.lineTo(462, 140); g.lineTo(440, 146); g.lineTo(410, 136); g.lineTo(380, 150); g.lineTo(350, 132); g.lineTo(320, 146); g.lineTo(290, 136);
    for (const [x, y] of capL) g.lineTo(x, y);
    g.closePath(); g.fill();
    for (let i = 0; i < 6; i++) R(g, "#dfe6f2", 360 + i * 4, 70 + i * 6, 2, 30 - i * 3);   // ridges in the snow
    // layered blue hills
    const hill = (base, amp, col, seedv) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 8) g.lineTo(x, base - Math.abs(Math.sin(x / 70 + seedv)) * amp - Math.sin(x / 23 + seedv) * 4); g.lineTo(W, H); g.fill(); };
    hill(250, 26, "#8a9cc4", 1); hill(262, 20, "#a8b8d8", 3);
    // snowy forest band
    for (let x = -4; x < W; x += 9) snowPine(g, x + (x * 7) % 5, 282 + (x % 3) * 3, 18 + (x * 13) % 12, "#26412f", "#e8eef6");
    // five-storey pagoda (left)
    const px = 92, base = 276;
    R(g, "#3a2a24", px - 16, base - 8, 32, 8);
    for (let i = 0; i < 5; i++) {
      const y = base - 12 - i * 22, w = 34 - i * 4;
      R(g, "#b8322a", px - w / 2 + 6, y - 14, w - 12, 14);          // red walls
      for (let j = 0; j < 3; j++) R(g, "#f2d8a0", px - w / 2 + 10 + j * ((w - 20) / 2), y - 10, 3, 5);
      g.fillStyle = "#2a2a2e"; g.beginPath(); g.moveTo(px - w / 2 - 4, y - 14); g.lineTo(px + w / 2 + 4, y - 14); g.lineTo(px + w / 2 - 6, y - 22); g.lineTo(px - w / 2 + 6, y - 22); g.fill();
      R(g, "#f4f7fc", px - w / 2 + 4, y - 23, w - 8, 2);               // snow on each roof
    }
    R(g, "#c9a032", px - 1, base - 140, 2, 22);
    // torii gate (right) half in snow
    const tx = 548;
    R(g, "#c8322a", tx - 30, 214, 7, 70); R(g, "#c8322a", tx + 23, 214, 7, 70);
    R(g, "#2a2a2e", tx - 40, 204, 80, 6); R(g, "#c8322a", tx - 36, 210, 72, 5); R(g, "#c8322a", tx - 30, 226, 60, 4);
    R(g, "#f4f7fc", tx - 40, 202, 80, 2);
    // stone lanterns
    for (const lx of [180, 470]) { R(g, "#8a8a86", lx - 3, 272, 6, 14); R(g, "#9a9a96", lx - 7, 264, 14, 8); R(g, "#f2c860", lx - 3, 266, 6, 4); R(g, "#8a8a86", lx - 8, 260, 16, 4); R(g, "#f4f7fc", lx - 8, 258, 16, 2); }
    // Takeshi the van by the lodge road
    R(g, "#d8d0b0", 196, 282, 30, 14); R(g, "#9ad1ff", 214, 285, 9, 5); R(g, "#222", 199, 294, 5, 5); R(g, "#222", 217, 294, 5, 5); R(g, "#f4f7fc", 196, 280, 30, 2);
  }

  function alStatic(g) {
    // rounded Hallingdal mountains
    const hill = (base, amp, col, sv, snow) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, H);
      const pts = [];
      for (let x = 0; x <= W; x += 6) { const y = base - Math.abs(Math.sin(x / 120 + sv)) * amp - Math.sin(x / 41 + sv) * 8; pts.push([x, y]); g.lineTo(x, y); }
      g.lineTo(W, H); g.fill();
      if (snow) for (const [x, y] of pts) R(g, "#f4f7fc", x, y, 6, 10 + Math.sin(x) * 3);
    };
    hill(200, 90, "#7a8aa8", 0.4, true); hill(240, 60, "#9aaac4", 2, true); hill(262, 30, "#c8d4e4", 3.3);
    for (let x = -4; x < W; x += 8) snowPine(g, x, 286 + (x % 4) * 2, 16 + (x * 11) % 14, "#24402c", "#eef2f8");
    // red cabin + sign
    R(g, "#a8322a", 70, 250, 50, 32); R(g, "#f4f7fc", 64, 242, 62, 6); R(g, "#2a2a2e", 64, 248, 62, 4);
    R(g, "#f2d8a0", 80, 260, 9, 8); R(g, "#f2d8a0", 100, 260, 9, 8);
    R(g, "#2a5a8a", 470, 232, 104, 24); R(g, "#f4f7fc", 470, 230, 104, 3); text(g, "ÅL SKISENTER", 476, 249, "#fff", 11);
    R(g, "#555", 486, 256, 3, 30); R(g, "#555", 556, 256, 3, 30);
    // lift towers
    for (const [x, y] of [[160, 250], [300, 180], [440, 110]]) { R(g, "#666", x, y, 4, 290 - y); R(g, "#666", x - 8, y, 20, 3); }
  }

  function mountainLive(g, s) {
    const f = s.frame, mode = s.mountain === "japan" ? "japan" : "al";
    const { night } = skyBands(g, s.hour, 260);
    if (night) for (let i = 0; i < 40; i++) R(g, "#fff8d0", (i * 97) % W, (i * 41) % 180, 1, 1);
    if (mode === "japan") {
      // sun / moon behind Fuji's shoulder
      ellipse(g, night ? "#f4f0dc" : "rgba(255,240,220,.9)", 470, 70, 16, 16);
    }
    g.drawImage(layer("mtn-" + mode, mode === "japan" ? japanStatic : alStatic), 0, 0);
    if (mode === "al") {   // the chairlift moves
      g.strokeStyle = "#333"; g.lineWidth = 1; g.beginPath(); g.moveTo(160, 252); g.lineTo(300, 182); g.lineTo(440, 112); g.lineTo(600, 40); g.stroke();
      for (let i = 0; i < 6; i++) { const k = ((i / 6) + f / 1200) % 1, x = 160 + k * 440, y = 252 - k * 212; R(g, "#c8322a", x - 4, y + 4, 9, 6); R(g, "#333", x, y, 1, 5); }
    }
    // the slope in front – scrolls past
    const speed = s.skiing ? 3 : 0.6;
    R(g, "#f4f7fc", 0, 296, W, 104);
    for (let i = 0; i < 9; i++) {                        // blue shadows / ski tracks rushing down
      const y = 296 + ((i * 23 + f * speed) % 104);
      R(g, "#dfe7f2", 0, y, W, 2);
      R(g, "#c8d4e6", 120 + i * 44 + Math.sin((y + i) / 20) * 10, y, 18, 1);
    }
    for (const p of pines) {                              // trees at the sides rushing past
      p.y += speed * p.s * 0.8;
      if (p.y > 470) { p.y = 280 + Math.random() * 10; p.x = Math.random() < 0.5 ? 10 + Math.random() * 130 : 500 + Math.random() * 130; }
      if (p.y > 296) snowPine(g, p.x, p.y, 20 + (p.y - 296) * 0.35 * p.s, "#1f3a28", "#eef2f8");
    }
    // heavy snowfall (Japow!)
    g.fillStyle = "rgba(255,255,255,.9)";
    const n = mode === "japan" ? 70 : 45;
    for (let i = 0; i < n; i++) { const fl = flakes[i % flakes.length]; g.fillRect(fl[0] | 0, fl[1] | 0, fl[2] > 1 ? 2 : 1, fl[2] > 1 ? 2 : 1); fl[1] += fl[2] * (mode === "japan" ? 1.4 : 0.9); fl[0] += Math.sin((f + fl[1]) / 30) * 0.4; if (fl[1] > H) { fl[1] = -2; fl[0] = Math.random() * W; } }
    if (night) { g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(70,80,140,.45)"; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "source-over"; }
  }

  const SCENES = { home: homeLive, gym: gymLive, grafen: grafenLive, mountain: mountainLive };
  return {
    has: name => !!SCENES[name],
    draw: (name, g, s) => SCENES[name](g, s),
  };
})();
