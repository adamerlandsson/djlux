// Low-res pixel backgrounds (320×200), drawn in code. A real picture can replace any scene
// (content/house.js → backgrounds); then only small extras are painted on top.
window.LUX = window.LUX || {};

LUX.scene = (() => {
  const W = 320, H = 200;
  let g, frame = 0;
  let scene = "home", ctx = "home", mountain = "free", hour = 12, tvOn = false, tvColor = null, lampOn = true;

  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const stars = [], flakes = [], ridgeFar = [], ridgeNear = [], trees = [], crowd = [], confetti = [];
  const images = {};

  function init(canvas) {
    g = canvas.getContext("2d");
    g.imageSmoothingEnabled = false;
    for (let i = 0; i < 30; i++) stars.push([rnd(), rnd()]);
    for (let i = 0; i < 120; i++) flakes.push([rnd() * W, rnd() * H, 0.3 + rnd() * 0.8]);
    let a = 40, b = 20, da = 0.8, db = 0.4;
    for (let x = 0; x <= W; x++) {
      if (x % 6 === 0) { da += (rnd() - 0.5) * 0.9; db += (rnd() - 0.5) * 0.5; }
      if (a > 70 || a < 22) da = -Math.sign(a - 45) * Math.abs(da || 0.6);
      if (b > 34 || b < 10) db = -Math.sign(b - 22) * Math.abs(db || 0.4);
      da = Math.max(-1.6, Math.min(1.6, da)); db = Math.max(-0.8, Math.min(0.8, db));
      a += da; b += db;
      ridgeFar.push(a); ridgeNear.push(b);
    }
    for (let i = 0; i < 22; i++) trees.push([rnd() * W, 120 + rnd() * 70, 10 + rnd() * 16]);
    const hair = ["#3a2a1a", "#d9b56a", "#1a1a1a", "#8a4a2a", "#c9a060", "#5a3a2a"];
    const cloth = ["#2a4a6a", "#6a2a3a", "#1a1a1a", "#3a6a3a", "#8a6a2a", "#5a2a6a", "#c9c0b0"];
    for (let i = 0; i < 22; i++) crowd.push({ x: i * 15 + rnd() * 8, h: hair[i % hair.length], c: cloth[i % cloth.length], p: rnd() * 6, s: 0.8 + rnd() * 0.5 });
    for (let i = 0; i < 40; i++) confetti.push([rnd() * W, rnd() * H, ["#e8c34a", "#e86a9a", "#4fc3c8", "#6ac94a"][i % 4]]);
    for (const [name, src] of Object.entries(LUX.content.house.backgrounds)) {
      if (!src) continue;
      const img = new Image();
      img.onload = () => (images[name] = img);
      img.src = src;
    }
    requestAnimationFrame(loop);
  }

  const rect = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
  const text = (t, x, y, c = "#333", size = 8) => { g.fillStyle = c; g.font = `${size}px monospace`; g.fillText(t, x, y); };

  // ---------- time of day ----------
  const isNight = () => hour < 6 || hour >= 21;
  const isEvening = () => hour >= 17 && hour < 21;

  function sky(x, y, w, h, clear) {
    const bands = isNight() ? ["#0d1428", "#111a33", "#16203d", "#1b2647", "#202c50"]
      : isEvening() ? ["#4a4d78", "#7a5a7c", "#b0677a", "#d98a6a", "#e8a865"]
      : clear ? ["#5a9ad9", "#6aa8e0", "#7ab6e6", "#8ac2ea", "#a0d0f0"]
      : ["#5e676c", "#687176", "#727b80", "#7d8589", "#889094"]; // Trondheim grey 🌧
    const bh = h / bands.length;
    bands.forEach((c, i) => rect(c, x, y + i * bh, w, bh + 1));
    if (isNight()) stars.forEach(([sx, sy]) => rect("#fff8d0", x + sx * w, y + sy * h * .7, 1, 1));
  }

  function nightOverlay(lampX, lampY) {
    if (!isNight() && !isEvening()) return;
    g.fillStyle = isNight() ? "rgba(10,15,40,.45)" : "rgba(60,30,40,.18)";
    g.fillRect(0, 0, W, H);
    if (lampX != null && lampOn) {
      const grd = g.createRadialGradient(lampX, lampY, 2, lampX, lampY, 110);
      grd.addColorStop(0, "rgba(255,210,140,.35)");
      grd.addColorStop(1, "rgba(255,210,140,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, W, H);
    }
  }

  function snow(alpha = .8, speed = 1) {
    g.fillStyle = `rgba(255,255,255,${alpha})`;
    flakes.forEach(f => {
      g.fillRect(f[0] | 0, f[1] | 0, f[2] > .7 ? 2 : 1, f[2] > .7 ? 2 : 1);
      f[1] += f[2] * speed; f[0] += Math.sin((frame + f[1]) / 30) * 0.3;
      if (f[1] > H) { f[1] = -2; f[0] = Math.random() * W; }
    });
  }

  function tv(x, y, w, h) {
    rect("#1a1a1a", x, y, w, h);
    if (tvOn) {
      const cols = ["#d95ab0", "#5a8fd9", "#7ad9a0", "#d9a05a", "#c45ad9"];
      rect(tvColor || cols[Math.floor(frame / 50) % cols.length], x + 3, y + 3, w - 6, h - 6);
      // two little dancers (Skal vi danse!)
      const d = Math.sin(frame / 8) * 2;
      rect("#fff", x + w / 2 - 6 + d, y + 8, 3, 8);
      rect("#222", x + w / 2 + 2 - d, y + 8, 3, 8);
      rect("rgba(255,255,255,.25)", x + 3, y + 3 + (frame % (h - 6)), w - 6, 1);
    } else rect("#2a3036", x + 3, y + 3, w - 6, h - 6);
  }

  function door(x, name, color) {
    rect("#5a4030", x, 40, 26, 92);
    rect(color, x + 2, 42, 22, 90);
    rect("#d9c27a", x + 19, 88, 2, 3);
    rect("#f0ece0", x + 4, 52, 18, 9);
    text(name, x + 5, 59, "#333", 6);
  }

  function discoBall(x, y, spin) {
    rect("#888", x + 4, 0, 1, y);
    rect("#c8c8d0", x, y, 9, 9);
    for (let i = 0; i < 9; i += 3) for (let j = 0; j < 9; j += 3) if ((i + j + Math.floor(frame / 6)) % 6 === 0) rect("#fff", x + i, y + j, 2, 2);
    if (spin) {
      const cols = ["rgba(232,195,74,.5)", "rgba(232,106,154,.5)", "rgba(79,195,200,.5)", "rgba(106,201,74,.5)"];
      for (let i = 0; i < 18; i++) {
        const a = i * 1.7 + frame / 30;
        rect(cols[i % 4], (x + Math.cos(a) * (60 + i * 9) + W) % W, (y + 30 + Math.abs(Math.sin(a * 1.3)) * 150), 3, 2);
      }
    }
  }

  // ---------- the collective in Kannikestredet ----------
  function home(party) {
    rect("#d8cbb0", 0, 0, W, 132);
    for (let x = 0; x < W; x += 16) rect("#d2c4a8", x, 0, 8, 132);
    door(2, "SANDRA", "#8a6a4a");
    door(30, "MARTHE", "#7a5a3a");
    door(58, "EMMA", "#6a5a4a");
    rect("#c94a4a", 60, 70, 22, 5); text("LÅST!", 61, 74, "#fff", 5); // Emma's lock sign
    // window
    rect("#f0ece0", 92, 16, 70, 60);
    sky(96, 20, 62, 52);
    if (!isNight() && !isEvening()) { g.save(); g.beginPath(); g.rect(96, 20, 62, 52); g.clip(); snow(.5, .6); g.restore(); }
    rect("#f0ece0", 126, 20, 3, 52);
    rect("#f0ece0", 96, 44, 62, 3);
    // Ål poster
    rect("#2a5a8a", 168, 18, 26, 26);
    rect("#f0f0f0", 172, 32, 18, 8);
    rect("#f0f0f0", 177, 24, 8, 8);
    text("ÅL", 175, 41, "#c94a4a", 7);
    // skis on the wall
    rect("#e8794a", 204, 10, 5, 78); rect("#4fc3c8", 213, 10, 5, 78);
    rect("#222", 204, 52, 5, 8); rect("#222", 213, 52, 5, 8);
    // floor + rug
    rect("#9a7050", 0, 132, W, 68);
    for (let y = 140; y < H; y += 9) rect("#8a6040", 0, y, W, 1);
    rect("#6a3a5a", 92, 160, 150, 28);
    rect("#8a4a7a", 98, 164, 138, 20);
    // sofa
    rect("#4a6a5a", 100, 98, 130, 34);
    rect("#5a8070", 103, 101, 124, 4);
    rect("#4a6a5a", 94, 128, 142, 24);
    rect("#5a8070", 108, 128, 56, 6); rect("#5a8070", 168, 128, 56, 6);
    rect("#3a5a4a", 94, 112, 12, 40); rect("#3a5a4a", 224, 112, 12, 40);
    rect("#e8c34a", 110, 112, 18, 14); // cushion
    // floor lamp
    rect("#333", 230, 60, 2, 92);
    rect(lampOn ? "#f5e0a0" : "#8a7a5a", 224, 52, 14, 10);
    // TV bench + TV + phone
    rect("#4a3324", 236, 132, 46, 20);
    tv(240, 98, 38, 30);
    rect("#222", 266, 127, 7, 5);
    rect(frame % 120 < 60 ? "#7ad9a0" : "#3a6a50", 267, 128, 5, 3);
    // fridge (kitchen)
    rect("#b8b8b4", 286, 50, 30, 82);
    rect("#e8e8e4", 288, 52, 26, 78);
    rect("#b8b8b4", 288, 78, 26, 2);
    rect("#888", 310, 60, 2, 12); rect("#888", 310, 86, 2, 16);
    rect("#e85a5a", 293, 58, 4, 4); rect("#5a8fd9", 299, 92, 6, 4);
    // DJ desk (DJ LUX HQ)
    rect("#2a2a2a", 6, 140, 70, 6);
    rect("#3a3a3a", 10, 146, 4, 20); rect("#3a3a3a", 68, 146, 4, 20);
    rect("#1a1a1a", 14, 134, 54, 7);
    for (const cx of [24, 56]) { g.fillStyle = "#555"; g.beginPath(); g.arc(cx, 137, 4, 0, 7); g.fill(); }
    rect(frame % 30 < 15 ? "#e86a9a" : "#4fc3c8", 37, 135, 8, 3);
    text("LUX", 34, 132, "#e8c34a", 6);
    // disco ball
    discoBall(136, 3, party);
    if (party) {
      // the Molde folkehøgskule gang
      crowd.slice(0, 6).forEach((p, i) => {
        const x = 104 + i * 22, bob = Math.abs(Math.sin(frame / 10 + p.p)) * 3;
        rect(p.c, x, 112 - bob, 12, 22);
        rect("#e0b090", x + 2, 102 - bob, 8, 9);
        rect(p.h, x + 1, 99 - bob, 10, 5);
      });
      g.fillStyle = `rgba(${frame % 40 < 20 ? "120,40,140" : "40,60,140"},.18)`;
      g.fillRect(0, 0, W, H);
    }
    nightOverlay(231, 56);
    if (tvOn && (isNight() || isEvening())) { g.fillStyle = "rgba(120,170,255,.08)"; g.fillRect(0, 0, W, H); }
    if (!lampOn) { g.fillStyle = isNight() || isEvening() ? "rgba(8,10,30,.45)" : "rgba(8,10,30,.15)"; g.fillRect(0, 0, W, H); }
  }

  // ---------- NTNU ----------
  function school() {
    rect("#cfd4dc", 0, 0, W, 140);
    rect("#bcc2cc", 0, 132, W, 8);
    rect("#7a7a7a", 58, 16, 204, 78);
    rect("#f6f6f2", 62, 20, 196, 70);
    text("a² + b² = c²", 80, 40, "#2a5ab0", 10);
    text("RAPPORT INNEN FREDAG!!", 80, 60, "#b02a2a", 8);
    text("∫ dx  ≠  laussnø", 150, 80, "#2a5ab0", 8);
    g.strokeStyle = "#2a5ab0"; g.beginPath(); g.moveTo(200, 50); g.lineTo(240, 50); g.lineTo(200, 25); g.closePath(); g.stroke();
    const cx = 290, cy = 32;
    g.fillStyle = "#fff"; g.beginPath(); g.arc(cx, cy, 11, 0, 7); g.fill();
    g.strokeStyle = "#333"; g.stroke();
    const ha = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2, ma = ((hour % 1) * Math.PI * 2) - Math.PI / 2;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ha) * 6, cy + Math.sin(ha) * 6);
    g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ma) * 9, cy + Math.sin(ma) * 9); g.stroke();
    rect("#e8ece4", 8, 18, 40, 60);
    sky(11, 21, 34, 54);
    text("NTNU", 270, 70, "#1a3a6a", 10);
    rect("#7c8796", 0, 140, W, 60);
    for (let x = 0; x < W; x += 20) rect("#738090", x, 140, 1, 60);
    for (let i = 0; i < 4; i++) {
      const dx = 6 + i * 80;
      rect("#9a6b45", dx, 176, 64, 8);
      rect("#7a5236", dx + 4, 184, 4, 16); rect("#7a5236", dx + 56, 184, 4, 16);
      if (i !== 1 && i !== 2) {
        rect(["#3a2a1a", "#d9b56a", "#1a1a1a", "#8a4a2a"][i], dx + 22, 160, 18, 16);
        rect("#d9a07a", dx + 24, 172, 14, 4);
      }
    }
  }

  // ---------- sirkeltrening (gym hall) ----------
  function gym() {
    rect("#c8b890", 0, 0, W, 130);
    for (let x = 0; x < W; x += 40) rect("#b8a880", x, 0, 2, 130);
    rect("#e8e8e0", 20, 20, 60, 40); rect("#c94a4a", 24, 24, 52, 32); text("TF", 38, 46, "#fff", 14);
    text("SIRKELTRENING 18:30", 110, 30, "#2a2a2a", 9);
    text("(Anna: 18:37)", 140, 44, "#b02a2a", 8);
    rect("#d9a050", 0, 130, W, 70);
    for (let x = 0; x < W; x += 24) rect("#c99040", x, 130, 1, 70);
    rect("#fff", 0, 160, W, 2);
    g.strokeStyle = "#fff"; g.beginPath(); g.arc(160, 170, 26, 0, 7); g.stroke();
    // stations: kettlebells, mats, people doing burpees
    for (let i = 0; i < 5; i++) {
      const x = 20 + i * 64;
      rect("#2a6a8a", x, 150, 34, 6);
      rect("#333", x + 40, 146, 8, 8);
      const up = Math.sin(frame / 8 + i) > 0;
      const p = crowd[i];
      rect(p.c, x + 10, up ? 124 : 138, 12, up ? 22 : 10);
      rect("#e0b090", x + 12, up ? 116 : 132, 8, 8);
      rect(p.h, x + 11, up ? 113 : 130, 10, 4);
    }
  }

  // ---------- Tyven (TF-pils + quiz) ----------
  function bar() {
    rect("#3a2a24", 0, 0, W, 130);
    for (let x = 0; x < W; x += 12) rect("#33241f", x, 0, 6, 130);
    // bottles behind the bar
    rect("#5a3a2a", 190, 30, 130, 4); rect("#5a3a2a", 190, 60, 130, 4);
    for (let i = 0; i < 16; i++) rect(["#3a7a3a", "#7a3a2a", "#c9a060", "#3a5a8a"][i % 4], 194 + i * 8, 18 + (i % 2) * 30, 4, 12);
    text("TYVEN", 30, 30, "#e8c34a", 16);
    rect("#e86a9a", 28, 34, 66, 2);
    // quiz screen
    rect("#111", 60, 50, 90, 50);
    rect("#2a4a8a", 63, 53, 84, 44);
    text("QUIZ!", 88, 68, "#fff", 9);
    text("Runde 3", 86, 80, "#e8c34a", 7);
    text("Lag: Laussnø", 72, 92, "#9ad1ff", 6);
    // bar counter
    rect("#6a4a30", 180, 110, 140, 30); rect("#8a6040", 180, 106, 140, 6);
    rect("#2a1a14", 0, 140, W, 60);
    // tables with beer
    for (const x of [20, 110]) {
      rect("#6a4a30", x, 150, 60, 8);
      for (let i = 0; i < 4; i++) { rect("#e8c060", x + 6 + i * 14, 140, 6, 10); rect("#fff", x + 6 + i * 14, 139, 6, 2); }
    }
    // warm light
    g.fillStyle = "rgba(255,180,90,.12)"; g.fillRect(0, 0, W, H);
  }

  // ---------- Grafen: JubileumsGalla 2026 TF ----------
  function grafen(hot = 0.5) {
    rect("#2a1a2a", 0, 0, W, 150);
    for (let x = 0; x < W; x += 20) { rect("#3a2236", x, 0, 2, 150); rect("#c9a050", x, 0, 1, 150); }
    // chandeliers
    for (const cx of [60, 160, 260]) {
      rect("#c9a050", cx, 0, 1, 12);
      rect("#e8c34a", cx - 14, 12, 29, 3);
      for (let i = -12; i <= 12; i += 6) { rect("#fff4c0", cx + i, 15, 2, 4); rect("rgba(255,240,180,.6)", cx + i - 1, 19, 4, 2); }
    }
    // banner
    rect("#1a1a3a", 70, 26, 180, 18);
    rect("#e8c34a", 70, 26, 180, 1); rect("#e8c34a", 70, 43, 180, 1);
    text("JUBILEUMSGALLA 2026 · TF 40 ÅR", 76, 38, "#e8c34a", 8);
    // DJ booth
    rect("#111", 110, 100, 100, 40);
    rect("#c9a050", 110, 100, 100, 3);
    text("DJ LUX", 140, 124, "#e86a9a", 10);
    // lights
    const cols = ["232,195,74", "232,106,154", "79,195,200", "106,201,74"];
    for (let i = 0; i < 4; i++) {
      const a = Math.sin(frame / 25 + i * 1.6) * 0.6;
      g.fillStyle = `rgba(${cols[i]},${0.08 + hot * 0.12})`;
      g.beginPath(); g.moveTo(40 + i * 80, 0); g.lineTo(40 + i * 80 + Math.sin(a) * 120 - 20, 200); g.lineTo(40 + i * 80 + Math.sin(a) * 120 + 20, 200); g.fill();
    }
    // floor + dancing crowd (more and wilder when the floor is hot)
    rect("#3a2a1a", 0, 150, W, 50);
    for (let x = 0; x < W; x += 16) rect("#4a3626", x, 150, 8, 50);
    const n = Math.round(4 + hot * 18);
    crowd.slice(0, n).forEach(p => {
      const bob = Math.abs(Math.sin(frame / (12 - hot * 6) * p.s + p.p)) * (2 + hot * 8);
      const x = p.x, y = 150 - bob;
      rect(p.c, x, y, 10, 26);
      rect("#e0b090", x + 1, y - 9, 8, 8);
      rect(p.h, x, y - 12, 10, 4);
      if (hot > 0.6) rect("#e0b090", x + (frame % 20 < 10 ? -3 : 10), y - 14, 3, 6); // hands up!
    });
    if (hot > 0.85) confetti.forEach(c => { rect(c[2], c[0], c[1], 2, 2); c[1] = (c[1] + 1) % H; c[0] += Math.sin(frame / 20 + c[1]) * 0.3; });
  }

  // ---------- the mountain (free / Japan / Ål skisenter) ----------
  function mountainScene() {
    const day = !isNight();
    sky(0, 0, W, 100, true);
    const far = mountain === "japan" ? "#7a8aa8" : "#6a7a90";
    ridgeFar.forEach((h, x) => { rect(day ? far : "#1a2030", x, 100 - h * 1.3, 1, h * 1.3 + 1); rect(day ? "#f4f7fa" : "#8a93a8", x, 100 - h * 1.3, 1, Math.min(10, h)); });
    ridgeNear.forEach((h, x) => rect(day ? "#e8eef4" : "#5a6478", x, 112 - h, 1, h + 1));
    rect(day ? "#f4f8fc" : "#7a8498", 0, 110, W, 90);
    for (let x = 0; x < W; x += 9) rect(day ? "#dfe8f0" : "#6a7488", (x * 7) % W, 120 + (x % 70), 6, 1);
    trees.forEach(([x, y, h]) => {
      for (let i = 0; i < h; i++) { const w = Math.max(1, ((h - i) / h) * (h / 3)) | 0; rect(day ? "#1f3a2a" : "#0e1a14", x - w, y - i, w * 2 + 1, 1); }
      rect("#fff", x - 2, y - h + 2, 4, 2);
    });
    if (mountain === "japan") {
      // torii gate + Takeshi the van
      rect("#c94a3a", 250, 70, 4, 40); rect("#c94a3a", 280, 70, 4, 40); rect("#c94a3a", 244, 66, 46, 5); rect("#c94a3a", 248, 76, 38, 3);
      rect("#d8d0b0", 20, 150, 44, 22); rect("#9ad1ff", 46, 154, 14, 8); rect("#222", 26, 170, 8, 8); rect("#222", 50, 170, 8, 8);
      text("TAKESHI", 21, 166, "#8a3a2a", 6);
    } else if (mountain === "al") {
      // lift + sign
      g.strokeStyle = "#333"; g.beginPath(); g.moveTo(0, 60); g.lineTo(W, 30); g.stroke();
      for (let i = 0; i < 5; i++) { const x = (i * 70 + frame / 2) % W; rect("#c94a4a", x, 60 - x * 30 / W + 2, 6, 6); }
      rect("#2a5a8a", 230, 120, 70, 20); text("ÅL SKISENTER", 234, 133, "#fff", 7);
    }
    snow(.9, mountain === "japan" ? 1.6 : 1);
    nightOverlay();
  }

  // extras painted on top of a real picture
  function pictureExtras() {
    if (tvOn) {
      g.fillStyle = tvColor || "#5a8fd9";
      g.globalAlpha = 0.06 + (frame % 24 < 3 ? 0.03 : 0);
      g.fillRect(0, 0, W, H);
      g.globalAlpha = 1;
    }
    nightOverlay();
  }

  let grafenHeat = 0.5;
  const SCENES = {
    home: () => home(ctx === "vors"), vors: () => home(true), school, gym, bar,
    grafen: () => grafen(grafenHeat), mountain: mountainScene,
  };

  // home / vors / gym are drawn in high resolution (js/scene-hd.js); the rest at 320×200, scaled ×2
  const HD = { home: "home", vors: "home", gym: "gym", grafen: "grafen", mountain: "mountain" };
  let flashFrames = 0;

  function loop() {
    frame++;
    if (frame % 2 === 0) {
      const hd = HD[scene];
      if (images[scene]) { g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, W, H); pictureExtras(); }
      else if (hd && LUX.sceneHD) {
        g.setTransform(1, 0, 0, 1, 0, 0);
        LUX.sceneHD.draw(hd, g, { frame, hour, tvOn, tvColor, lampOn, party: scene === "vors" || ctx === "vors", heat: grafenHeat, flash: flashFrames > 0 ? flashFrames-- / 14 : 0, mountain, skiing: ctx === "ski" });
      } else {
        g.setTransform(2, 0, 0, 2, 0, 0);
        (SCENES[scene] || SCENES.home)();
      }
    }
    requestAnimationFrame(loop);
  }

  return {
    init,
    setScene: (s, c) => {
      scene = s;
      ctx = c || s;
      const src = LUX.content.house.backgrounds[s];
      g.canvas.style.background = src ? `center / 100% 100% url("${src}")` : "";
    },
    setMountain: m => (mountain = m),
    setHeat: h => (grafenHeat = Math.max(0, Math.min(1, h))),
    flash: () => (flashFrames = 14),
    setHour: h => (hour = h),
    setTV: (on, color) => { tvOn = on; if (color !== undefined) tvColor = color; },
    setLamp: on => (lampOn = on),
    hasPicture: s => !!images[s],
  };
})();
