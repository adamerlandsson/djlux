// DJ LUX at JubileumsGalla 2026 TF (Grafen).
//  1. Play a track: notes fall down 4 lanes – hit them on the line (D F J K / tap the pads).
//     The music is real techno from js/music.js: intro → build → DROP → break → build → DROP → outro.
//  2. Transition (first-person DJ board): match the next track's BPM, start it on the "1",
//     then blend: channel fader A down while channel fader B up. Both tracks really play through
//     their faders, so you hear your own mix (and the train wreck if the BPM is off).
// Settings: content/dj.js
window.LUX = window.LUX || {};

LUX.dj = (() => {
  const D = LUX.content.dj;
  const { el, pick, shuffle, sleep } = LUX.ui;
  const G = () => LUX.game;
  const LOOKAHEAD = 1.7;   // seconds a note is visible before it reaches the line
  let running = false;

  // notes from the arrangement: sparse in the intro, busiest in the drop, nothing in the outro
  function makeNotes(deck, fromStep) {
    const notes = [];
    for (let step = fromStep; step < deck.endStep; step += 2) {
      const sec = deck.sectionAt(step), s16 = sec.at % 16;
      const dens = D.density[sec.kind] || 0;
      if (sec.kind === "drop" && sec.at === 0) { notes.push({ step, lane: 0, drop: true }, { step, lane: 3, drop: true }); continue; }
      const onBeat = s16 % 4 === 0;
      if (Math.random() > dens * (onBeat ? 1.4 : 0.6)) continue;
      let lane;
      if (onBeat) lane = s16 === 4 || s16 === 12 ? 1 : 0;
      else lane = Math.random() < 0.7 ? 2 : 3;
      if (sec.kind === "build" && sec.at > sec.bars * 16 - 8) lane = 1;          // snare roll at the end of a build
      const last = notes[notes.length - 1];
      if (last && last.step === step - 2 && last.lane === lane && Math.random() < 0.5) lane = (lane + 1) % 4;
      notes.push({ step, lane });
    }
    return notes;
  }

  // ---------- a vertical fader (mouse, touch – several at once – or keys) ----------
  function fader(label, value, onChange, { min = 0, max = 1, step = 0, cls = "" } = {}) {
    const thumb = el("div", { class: "mx-thumb" });
    const ghost = el("div", { class: "mx-ghost hidden" });     // the blend guide: "be here now"
    const track = el("div", { class: "mx-track" }, el("div", { class: "mx-fill" }), ghost, thumb);
    const wrap = el("div", { class: "mx-fader " + cls }, track, el("small", {}, label));
    let dead = false;
    const f = {
      el: wrap, value,
      set(v, silent) {
        if (!Number.isFinite(v)) return;
        v = Math.max(min, Math.min(max, v));
        if (step) v = Math.round(v / step) * step;
        f.value = v;
        const p = (v - min) / (max - min);
        thumb.style.bottom = `calc(${p * 100}% - 9px)`;
        track.firstChild.style.height = p * 100 + "%";
        if (!silent && !dead) onChange(v);
      },
      ghost(v) {
        if (v === null) return ghost.classList.add("hidden");
        ghost.classList.remove("hidden");
        ghost.style.bottom = `calc(${((v - min) / (max - min)) * 100}% - 9px)`;
      },
      // after the transition: ignore the mouse/finger that may still be holding the fader
      lock() { dead = true; for (const id of captured) try { track.releasePointerCapture(id); } catch {} },
    };
    const captured = new Set();
    const fromPointer = e => {
      const r = track.getBoundingClientRect();
      if (dead || r.height < 10) return;     // hidden board: no reading (this caused the "quiet music" bug)
      f.set(min + (1 - (e.clientY - r.top) / r.height) * (max - min));
    };
    track.addEventListener("pointerdown", e => { if (dead) return; e.preventDefault(); track.setPointerCapture(e.pointerId); captured.add(e.pointerId); fromPointer(e); });
    track.addEventListener("pointermove", e => { if (track.hasPointerCapture(e.pointerId)) fromPointer(e); });
    for (const ev of ["pointerup", "pointercancel"]) track.addEventListener(ev, e => captured.delete(e.pointerId));
    f.set(value, true);
    return f;
  }

  // decorative DJ gear: buttons light up, knobs turn when you click them (no effect on the music)
  function deco(kind, label, color) {
    if (kind === "knob") {
      let a = -40 + Math.random() * 80;
      const k = el("div", { class: "mx-knob", title: label }, el("i"));
      const w = el("div", { class: "mx-knobwrap" }, k, el("small", {}, label));
      k.style.transform = `rotate(${a}deg)`;
      k.addEventListener("click", () => { a = a > 100 ? -130 : a + 40; k.style.transform = `rotate(${a}deg)`; LUX.sound.blip(300 + a); });
      return w;
    }
    const b = el("button", { class: "mx-btn " + (kind || "") }, label);
    if (color) b.style.setProperty("--c", color);
    b.addEventListener("click", () => { b.classList.toggle("lit"); LUX.sound.blip(b.classList.contains("lit") ? 880 : 440); });
    return b;
  }

  async function start() {
    if (running) return;
    running = true;
    const g = G(), S = g.state;
    const gear = LUX.content.shop.gear.find(x => x.id === S.equipped.gear) || LUX.content.shop.gear[0];
    const lights = LUX.content.shop.lights.find(x => x.id === S.equipped.lights) || LUX.content.shop.lights[0];
    const perfectWin = (D.perfectMs + gear.window / 2) / 1000, goodWin = (D.goodMs + gear.window) / 1000;
    g.lock();
    g.setActivity("dj");
    LUX.scene.setHeat(0.45);
    g.say(pick(D.lines.intro), "djing");
    await sleep(2000);

    // ---------- layout ----------
    const layer = document.querySelector("#game-layer");
    const stage = document.querySelector("#stage");
    layer.innerHTML = "";
    layer.classList.remove("hidden");
    stage.classList.add("dj-on");
    const hud = el("div", { class: "dj-hud" });
    const heatBar = el("div", { class: "dj-heat" }, el("span", {}, "🔥 Dansegolvet"), el("div", { class: "mg-timer" }, el("i")));
    const highway = el("div", { class: "dj-highway" });
    const lanes = D.lanes.map(l => { const lane = el("div", { class: "dj-lane" }); lane.style.setProperty("--c", l.color); highway.append(lane); return lane; });
    highway.append(el("div", { class: "dj-line" }));
    const pads = el("div", { class: "dj-pads" }, ...D.lanes.map((l, i) => {
      const b = el("button", { class: "dj-pad" }, el("b", {}, l.label), el("small", {}, l.name));
      b.style.setProperty("--c", l.color);
      b.addEventListener("pointerdown", e => { e.preventDefault(); hit(i); });
      return b;
    }));
    const panel = el("div", { class: "dj-panel" }, hud, heatBar, highway, pads);
    const judge = el("div", { class: "dj-judge" });
    const dropFx = el("div", { class: "dj-dropfx" });
    const quit = el("button", { class: "fg-quit", onclick: () => (quitting = true) }, "✖ Avslutt");
    const board = el("div", { class: "mx-wrap hidden" });
    layer.append(panel, judge, dropFx, board, quit);

    // ---------- state ----------
    const tracks = shuffle(D.tracks.slice()).slice(0, D.tracksPerSet);
    let ti = 0, deck = LUX.music.deck(tracks[0]);
    let notes = makeNotes(deck, 16), phase = "track", quitting = false, mix = null;
    let score = 0, combo = 0, bestCombo = 0, heat = 45, maxScore = notes.length * D.perfect;
    const hits = { perfect: 0, good: 0, miss: 0 }, mixes = [];
    let emptyWarned = false, hotWarned = false;
    deck.onDrop = t => onDrop(t);
    deck.start(LUX.music.now() + 0.3);

    const keyFor = Object.fromEntries(D.lanes.map((l, i) => [l.key, i]));
    const held = {};
    const onKey = e => {
      const down = e.type === "keydown";
      held[e.code] = down;      // always track held keys (so a key released during the result card isn't "stuck")
      if (phase === "track" && down && !e.repeat && keyFor[e.code] !== undefined) { e.preventDefault(); hit(keyFor[e.code]); }
      if (phase === "mixresult" && down && (e.code === "Space" || e.code === "Enter")) { e.preventDefault(); backToTrack(); }
      if (phase === "mix") {
        if (["KeyW", "KeyS", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
        if (down && !e.repeat) {
          if (e.code === "ArrowLeft") mix.pitch.set(mix.pitch.value - 1);
          if (e.code === "ArrowRight") mix.pitch.set(mix.pitch.value + 1);
          if (e.code === "Space") startB();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);

    function flash(text, cls) {
      judge.textContent = text;
      judge.className = "dj-judge " + cls;
      void judge.offsetWidth;
      judge.classList.add("show");
    }

    function addHeat(n) {
      heat = Math.max(0, Math.min(100, heat + (n > 0 ? n * lights.hype : n)));
      LUX.scene.setHeat(heat / 100);
      if (heat <= 5 && !emptyWarned) { emptyWarned = true; g.say(pick(D.lines.floorEmpty), "sad", { log: false }); }
      if (heat >= 90 && !hotWarned) { hotWarned = true; g.say(pick(D.lines.floorHot), "party", { log: false }); LUX.sound.cheer(); }
      if (heat > 20) emptyWarned = false;
      if (heat < 70) hotWarned = false;
    }

    function onDrop(t) {
      setTimeout(() => {
        if (!running) return;
        dropFx.classList.remove("go"); void dropFx.offsetWidth; dropFx.classList.add("go");
        LUX.scene.flash();
        addHeat(D.heat.drop);
        if (phase === "track") g.say(pick(D.lines.drop), "party", { log: false });
      }, Math.max(0, (t - LUX.music.now()) * 1000));
    }

    function hit(lane) {
      if (phase !== "track") return;
      const pad = pads.children[lane];
      pad.classList.remove("down"); void pad.offsetWidth; pad.classList.add("down");
      const t = LUX.music.now();
      let best = null, bestDt = 1e9;
      for (const n of notes) {
        if (n.done || n.lane !== lane) continue;
        const dt = Math.abs(deck.timeOfStep(n.step) - t);
        if (dt < bestDt) { best = n; bestDt = dt; }
      }
      if (!best || bestDt > goodWin) { combo = 0; addHeat(-1.5); return; }
      best.done = true;
      best.el?.remove();
      if (bestDt <= perfectWin) { hits.perfect++; score += D.perfect; combo++; addHeat(D.heat.perfect); flash(best.drop ? "DROP!" : "PERFEKT!", "perfect"); }
      else { hits.good++; score += D.good; combo++; addHeat(D.heat.good); flash("BRA", "good"); }
      if (combo && combo % 20 === 0) g.say(pick(D.lines.perfect), "party", { log: false });
      bestCombo = Math.max(bestCombo, combo);
    }

    function miss(n) {
      n.done = true;
      n.el?.remove();
      hits.miss++; combo = 0;
      addHeat(D.heat.miss);
      flash("BOM", "miss");
      if (Math.random() < 0.12) g.say(pick(D.lines.miss), "shocked", { log: false });
    }

    // =================================================================
    //  TRANSITION – the POV DJ board
    // =================================================================
    function startMix() {
      phase = "mix";
      const next = tracks[ti + 1];
      const B = LUX.music.deck(next);
      B.onDrop = t => onDrop(t);
      const [o1, o2] = D.mix.pitchOffset;
      let startBpm = next.bpm + pick([-1, 1]) * Math.round(o1 + Math.random() * (o2 - o1));
      if (startBpm === deck.bpm) startBpm += 4;
      B.bpm = startBpm;
      B.setVolume(0);
      const now = LUX.music.now();
      mix = { B, started: false, startOffset: null, blendStart: null, clash: 0, dip: 0, follow: 0, followN: 0, angleA: 0, angleB: 0,
        bpmAtStart: null, deadline: now + D.mix.maxBars * 4 * 60 / deck.bpm };
      board.innerHTML = "";
      const screen = (d, side) => el("div", { class: "mx-screen" }, el("small", {}, side === "a" ? "DECK A · SPELAR NO" : "DECK B · NESTE LÅT"),
        el("b", {}, d.track.name), el("div", { class: "mx-bpm" }), el("div", { class: "mx-lamps" }, el("i"), el("i"), el("i"), el("i")));
      const transport = playLit => el("div", { class: "mx-transport" }, deco("", "CUE", "#e8c34a"), playLit, deco("", "SYNC", "#4fc3c8"), deco("", "LOOP 4", "#8a4ad9"));
      const pads = () => el("div", { class: "mx-pads" }, ...["#e86a9a", "#4fc3c8", "#e8c34a", "#6ac94a"].map((c, i) => deco("pad", String(i + 1), c)));
      mix.jogA = el("div", { class: "mx-jog" }, el("i"));
      mix.jogB = el("div", { class: "mx-jog" }, el("i"));
      mix.screenA = screen(deck, "a");
      mix.screenB = screen(B, "b");
      mix.playA = el("button", { class: "mx-btn lit play" }, "▶ ❚❚");
      mix.playB = el("button", { class: "mx-btn play" }, "▶ ❚❚");
      mix.faderA = fader("KANAL A", 1, v => deck.setVolume(v), { cls: "ch" });
      mix.faderB = fader("KANAL B", 0, v => B.setVolume(v), { cls: "ch" });
      // the tempo fader always reaches deck A's BPM (songs can be up to ~20 BPM apart)
      const pMin = Math.min(next.bpm, deck.bpm, startBpm) - 8, pMax = Math.max(next.bpm, deck.bpm, startBpm) + 8;
      mix.pitch = fader("TEMPO", startBpm, v => B.setBpm(v), { min: pMin, max: pMax, step: 1, cls: "pitch" });
      mix.startBtn = el("button", { class: "mx-start", onclick: () => startB() }, "▶ START B");
      mix.vuA = el("div", { class: "mx-vu" }, el("i"));
      mix.vuB = el("div", { class: "mx-vu" }, el("i"));
      mix.steps = el("div", { class: "mx-steps" });
      mix.quality = el("div", { class: "mx-quality" });
      mix.cross = el("div", { class: "mx-cross" }, el("i"));
      const eq = () => el("div", { class: "mx-eq" }, deco("knob", "HI"), deco("knob", "MID"), deco("knob", "LOW"));
      const deckA = el("div", { class: "mx-deck" }, mix.screenA, mix.jogA, transport(mix.playA), pads(),
        el("div", { class: "mx-pitch-locked" }, "TEMPO A (låst)", el("b", {}, `${deck.bpm}`)));
      const deckB = el("div", { class: "mx-deck" }, mix.screenB, mix.jogB, transport(mix.playB), pads(),
        el("div", { class: "mx-pitchrow" }, el("button", { onclick: () => mix.pitch.set(mix.pitch.value - 1) }, "−"), mix.pitch.el,
          el("button", { onclick: () => mix.pitch.set(mix.pitch.value + 1) }, "+"), mix.startBtn));
      const mixer = el("div", { class: "mx-mixer" }, el("div", { class: "mx-logo" }, "DJ LUX · MIXER"),
        el("div", { class: "mx-eqrow" }, eq(), deco("knob", "FX"), eq()),
        el("div", { class: "mx-channels" }, mix.vuA, mix.faderA.el, mix.faderB.el, mix.vuB),
        el("div", { class: "mx-cues" }, deco("", "🎧 A", "#4fc3c8"), deco("", "🎧 B", "#e86a9a")),
        mix.cross);
      board.append(mix.steps, mix.quality, el("div", { class: "mx-keys" }, "🖱️ dra i spakane (to fingrar på mobil) · ⌨️ W/S = kanal A · ↑/↓ = kanal B · ←/→ = tempo B · SPACE = start B"),
        el("div", { class: "mx-board" }, deckA, mixer, deckB));
      board.classList.remove("hidden");
      panel.classList.add("hidden");
      stage.classList.add("mix-on");
      g.say(pick(D.lines.mixStart), "djing", { log: false });
      LUX.sound.scratch();
    }

    function beatPhase(d, t) { const b = d.stepAt(t) / 4; return ((b % 1) + 1) % 1; }

    function startB() {
      if (phase !== "mix" || mix.started) return;
      const t = LUX.music.now();
      const barLen = 16 * deck.stepDur();
      const into = ((deck.stepAt(t) % 16) + 16) % 16 * deck.stepDur();      // seconds since A's last "1"
      const off = Math.min(into, barLen - into);
      mix.startOffset = off / (barLen / 4);                                   // in beats
      mix.bpmAtStart = mix.B.bpm;
      mix.started = true;
      mix.B.start(t);
      mix.playB.classList.add("lit");
      mix.startBtn.disabled = true;
      mix.startBtn.textContent = mix.startOffset < 0.08 ? "✔ PÅ EITTARET!" : mix.startOffset < 0.2 ? "~ nesten" : "✖ utanfor takten";
      LUX.sound.blip(mix.startOffset < 0.08 ? 900 : 300);
    }

    const BLEND_GUIDE = 8;    // beats the ghost markers take from A to B

    function updateMix(dt) {
      const t = LUX.music.now(), B = mix.B, beat = 60 / deck.bpm;
      // held keys move the faders
      const speed = 0.7 * dt;
      if (held.KeyW) mix.faderA.set(mix.faderA.value + speed);
      if (held.KeyS) mix.faderA.set(mix.faderA.value - speed);
      if (held.ArrowUp) mix.faderB.set(mix.faderB.value + speed);
      if (held.ArrowDown) mix.faderB.set(mix.faderB.value - speed);
      const a = mix.faderA.value, b = mix.faderB.value;
      // screens, jogs, lamps, VU, crossfader (visual)
      const bpmDiff = B.bpm - deck.bpm;
      mix.screenA.querySelector(".mx-bpm").textContent = `${deck.bpm} BPM`;
      mix.screenB.querySelector(".mx-bpm").textContent = `${B.bpm} BPM ${bpmDiff === 0 ? "✔" : (bpmDiff > 0 ? "+" : "") + bpmDiff}`;
      mix.screenB.classList.toggle("ok", bpmDiff === 0);
      mix.angleA += dt * deck.bpm / 60 * 90;
      if (mix.started) mix.angleB += dt * B.bpm / 60 * 90;
      mix.jogA.style.transform = `rotate(${mix.angleA}deg)`;
      mix.jogB.style.transform = `rotate(${mix.angleB}deg)`;
      const lamp = (screen, d, on) => {
        const bt = Math.floor(((d.stepAt(t) / 4) % 4 + 4) % 4), frac = beatPhase(d, t);
        [...screen.querySelectorAll(".mx-lamps i")].forEach((x, i) => x.className = on && i === bt && frac < 0.3 ? (i === 0 ? "one" : "on") : "");
      };
      lamp(mix.screenA, deck, true);
      lamp(mix.screenB, B, mix.started);
      const pumpA = 1 - beatPhase(deck, t), pumpB = mix.started ? 1 - beatPhase(B, t) : 0;
      mix.vuA.firstChild.style.height = a * (55 + pumpA * 45) + "%";
      mix.vuB.firstChild.style.height = b * (55 + pumpB * 45) + "%";
      mix.cross.firstChild.style.left = (a + b ? (b / (a + b)) * 100 : 50) + "%";

      // the blend: starts when you first move a fader after starting B
      if (mix.started && mix.blendStart === null && (b > 0.08 || a < 0.92)) mix.blendStart = t;
      const blendBeats = mix.blendStart === null ? 0 : (t - mix.blendStart) / beat;
      const guide = mix.blendStart === null ? 0 : Math.min(1, blendBeats / BLEND_GUIDE);
      if (mix.started) { mix.faderA.ghost(1 - guide); mix.faderB.ghost(guide); }
      else { mix.faderA.ghost(null); mix.faderB.ghost(null); }
      let clashing = false;
      if (mix.started) {
        if (a > 0.3 && b > 0.3) {
          const pa = beatPhase(deck, t), pb = beatPhase(B, t), diff = Math.min(Math.abs(pa - pb), 1 - Math.abs(pa - pb));
          if (diff > 0.07 || bpmDiff !== 0) { mix.clash += dt; clashing = true; }
        }
        if (mix.blendStart !== null) { mix.follow += (Math.abs(a - (1 - guide)) + Math.abs(b - guide)) / 2; mix.followN++; }
      }
      const quiet = a + b < 0.7;
      if (quiet) mix.dip += dt;   // the floor goes quiet

      // the three steps + what to do right now
      const step = (n, txt, done) => el("span", { class: done ? "done" : "" }, `${done ? "✔" : n} ${txt}`);
      mix.steps.innerHTML = "";
      mix.steps.append(step("①", "Match BPM", bpmDiff === 0 && (mix.started ? mix.bpmAtStart === deck.bpm : true)),
        step("②", "Start B på eittaret", mix.started), step("③", "Blend: A ned + B opp, sakte (følg dei kvite strekane)", a < 0.05 && b > 0.95));
      let hint, cls = "";
      if (!mix.started) hint = bpmDiff !== 0 ? "① Juster TEMPO på deck B til skjermen viser ✔" : "② Trykk START B (SPACE) i det den RAUDE lampa på deck A blinkar";
      else if (clashing) { hint = bpmDiff !== 0 ? "💥 Ute av takt: BPM-en er ulik! Juster TEMPO" : "💥 Ute av takt – du starta B utanfor eittaret"; cls = "bad"; }
      else if (quiet && mix.blendStart !== null) { hint = "⚠️ For stille! Dra B opp FØR A går ned"; cls = "bad"; }
      else if (mix.blendStart === null) hint = "③ Dra B opp og A ned – sakte, følg dei kvite strekane";
      else if (b > guide + 0.35 || a < 1 - guide - 0.35) { hint = `🐢 Saktare! Følg strekane (slag ${Math.floor(blendBeats)}/${BLEND_GUIDE})`; cls = "warn"; }
      else hint = `👍 Fint! Slag ${Math.floor(blendBeats)}/${BLEND_GUIDE} – følg strekane heilt ned/opp`;
      mix.quality.textContent = hint;
      mix.quality.className = "mx-quality " + cls;

      // done?
      if (mix.started && a < 0.05 && b > 0.95) return finishMix();
      if (t > mix.deadline) {
        if (!mix.started) startB();
        mix.faderA.set(0); mix.faderB.set(1);
        mix.forced = true;
        return finishMix();
      }
    }

    function finishMix() {
      const t = LUX.music.now(), B = mix.B, beat = 60 / B.bpm;
      mix.faderA.lock(); mix.faderB.lock(); mix.pitch.lock();
      for (const k of ["KeyW", "KeyS", "ArrowUp", "ArrowDown"]) held[k] = false;
      const blendBeats = mix.blendStart === null ? 0 : (t - mix.blendStart) / beat;
      const [lo, hi] = D.mix.goodBlendBeats;
      const bpmA = deck.bpm, bpmB = mix.bpmAtStart ?? B.bpm;
      const follow = mix.followN ? 1 - mix.follow / mix.followN : 0;    // 1 = followed the guide perfectly
      // each part: [ok 1 | so-so 0.5 | bad 0, text]
      const rows = [];
      rows.push(bpmB === bpmA ? [1, `BPM matcha: ${bpmB} = ${bpmA}`] : Math.abs(bpmB - bpmA) <= 1 ? [0.5, `BPM nesten lik (${bpmB} vs ${bpmA}) – juster TEMPO til skjermen viser ✔`]
        : [0, `BPM var ulik (${bpmB} vs ${bpmA}) – juster TEMPO til skjermen viser ✔ før du startar B`]);
      const off = mix.startOffset;
      rows.push(mix.forced && off === null ? [0, "Du starta aldri deck B – trykk START B på eittaret"]
        : off < 0.08 ? [1, `Starta på eittaret (${off.toFixed(2).replace(".", ",")} slag unna)`]
        : off < 0.2 ? [0.5, `Nesten på eittaret (${off.toFixed(2).replace(".", ",")} slag unna) – trykk akkurat når den RAUDE lampa lyser`]
        : [0, `Utanfor takten (${off.toFixed(2).replace(".", ",")} slag unna) – vent på den RAUDE lampa på deck A`]);
      rows.push(blendBeats >= lo && blendBeats <= hi ? [1, `Blenda over ${Math.round(blendBeats)} slag – roleg og fint`]
        : blendBeats < lo ? [0, `Blenda på berre ${Math.round(blendBeats)} slag – for brått. Ta det sakte og følg dei kvite strekane (ca. 8 slag)`]
        : [0.5, `Blenda over ${Math.round(blendBeats)} slag – litt langdrygt (prøv 4–32 slag)`]);
      rows.push(mix.dip < 0.4 ? [1, "Volumet heldt seg oppe heile vegen"]
        : [mix.dip < 1.5 ? 0.5 : 0, `Det vart stille i ${mix.dip.toFixed(1).replace(".", ",")} s – dra B opp før A går ned`]);
      rows.push(mix.clash < 0.4 ? [1, "Låtane var i takt medan begge spelte"]
        : [mix.clash < 1.5 ? 0.5 : 0, `Ute av takt i ${mix.clash.toFixed(1).replace(".", ",")} s – det høyrdest ut som eit togkrasj`]);
      let q = (rows[0][0] * 0.22 + rows[1][0] * 0.2 + rows[2][0] * 0.22 + rows[3][0] * 0.16 + rows[4][0] * 0.2) + follow * 0.05;
      if (mix.forced) q = Math.min(q, 0.3);
      const fails = rows.filter(r => r[0] === 0).length;
      const kind = q >= 0.85 && !fails ? "perfect" : q >= 0.55 && fails <= 1 ? "good" : "bad";
      mixes.push(kind);
      maxScore += 300;
      const pts = kind === "perfect" ? 300 : kind === "good" ? 150 : 0;
      score += pts;
      if (kind === "perfect") { addHeat(D.heat.mixPerfect); flash("SØMLAUS!", "perfect"); LUX.sound.cheer(); }
      else if (kind === "good") { addHeat(D.heat.mixGood); flash("GREI MIKS", "good"); }
      else { addHeat(D.heat.mixBad); flash("TOGKRASJ!", "miss"); LUX.sound.boo(); }
      g.say(pick(D.lines[kind === "perfect" ? "mixPerfect" : kind === "good" ? "mixGood" : "mixBad"]), kind === "bad" ? "shocked" : "party", { log: false });
      g.log("anna", `Overgang: ${kind === "perfect" ? "SØMLAUS" : kind === "good" ? "GREI" : "TOGKRASJ"} – ` + rows.map(r => (r[0] === 1 ? "✔" : r[0] ? "~" : "✖")).join(" "));
      // deck B takes over at full volume; deck A fades out
      deck.stop(0.4);
      B.setVolume(1);
      deck = B;
      ti++;
      phase = "mixresult";
      // the result card – what went right and what went wrong
      const card = el("div", { class: "mx-result " + kind },
        el("h3", {}, kind === "perfect" ? "🌟 SØMLAUS OVERGANG!" : kind === "good" ? "👍 GREI OVERGANG" : "💥 TOGKRASJ"),
        el("ul", {}, ...rows.map(([ok, txt]) => el("li", { class: ok === 1 ? "ok" : ok ? "meh" : "bad" }, `${ok === 1 ? "✔" : ok ? "~" : "✖"} ${txt}`))),
        el("p", {}, `+${pts} poeng`),
        el("button", { onclick: () => backToTrack() }, "Vidare ▶ (SPACE)"));
      board.append(card);
      mix.card = card;
      mix.autoNext = setTimeout(() => backToTrack(), 9000);
    }

    function backToTrack() {
      if (phase !== "mixresult") return;
      clearTimeout(mix.autoNext);
      const t = LUX.music.now();
      deck.setVolume(1);
      const nextBar = Math.ceil((deck.stepAt(t) + 4) / 16) * 16;
      const fresh = makeNotes(deck, nextBar);
      notes = fresh;
      maxScore += fresh.length * D.perfect;
      phase = "track";
      board.classList.add("hidden");
      board.innerHTML = "";
      panel.classList.remove("hidden");
      stage.classList.remove("mix-on");
      mix = null;
    }

    // ---------- the loop ----------
    await new Promise(done => {
      let last = performance.now();
      function frame(nowMs) {
        const dt = Math.min(0.05, (nowMs - last) / 1000);
        last = nowMs;
        if (quitting) return done();
        const t = LUX.music.now();
        if (phase === "track") {
          const hH = highway.clientHeight, lineY = hH * 0.86;
          for (const n of notes) {
            if (n.done) continue;
            const dtn = deck.timeOfStep(n.step) - t;
            if (dtn > LOOKAHEAD) break;
            if (!n.el) { n.el = el("div", { class: "dj-note" + (n.drop ? " drop" : "") }); lanes[n.lane].append(n.el); }
            n.el.style.top = (lineY - (dtn / LOOKAHEAD) * lineY) + "px";
            if (dtn < -goodWin) miss(n);
          }
          if (deck.step >= deck.endStep && notes.every(n => n.done)) {
            if (ti < tracks.length - 1) startMix();
            else if (deck.step >= deck.endStep + 32) return done();     // let the outro ride for two bars
          }
          const sec = deck.sectionAt(Math.max(0, Math.floor(deck.stepAt(t))));
          const label = { intro: "INTRO", build: "BYGGER OPP ↗", drop: "🔥 DROP", break: "BREAK", outro: "OUTRO" }[sec.kind];
          hud.innerHTML = "";
          hud.append(el("b", {}, `🎧 ${D.event}`),
            el("span", {}, `Låt ${ti + 1}/${tracks.length}: ${deck.track.name}`),
            el("span", {}, `${deck.bpm} BPM · ${deck.track.style.toUpperCase()} · ${label}`),
            el("span", {}, `Poeng ${score}  ·  Combo ${combo}`));
          highway.classList.toggle("building", sec.kind === "build");
        } else if (phase === "mix") updateMix(dt);
        heatBar.querySelector("i").style.width = heat + "%";
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });

    // ---------- results ----------
    LUX.music.stopAll();
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("keyup", onKey);
    layer.innerHTML = "";
    layer.classList.add("hidden");
    stage.classList.remove("dj-on", "mix-on");
    g.setActivity(null);
    running = false;

    if (quitting) {
      g.say("Ok, DJ LUX tek pause. Grafen overlever.", "sad");
      g.unlock();
      return;
    }
    let share = maxScore ? score / maxScore : 0;
    if (heat < 15) share -= 0.1;
    // (an empty dance floor can push the share below 0 – that's still a D, not a crash)
    const grade = (D.grades.find(([, min]) => share >= min) || D.grades[D.grades.length - 1])[0];
    const coins = g.addCoins(D.coinsPerGrade[grade]);
    S.gigs++;
    g.stat("gigs");
    const order = "SABCD";
    if (!S.bestGrade || order.indexOf(grade) < order.indexOf(S.bestGrade)) S.bestGrade = grade;
    S.dj = Math.min(100, S.dj + D.xpPerGrade[grade]);
    S.festlyst = Math.max(0, S.festlyst - 40);
    S.mood = Math.min(100, S.mood + ("SAB".includes(grade) ? 15 : -5));

    const drops = [];
    if (Math.random() < D.dropChance[grade]) drops.push(g.collect(LUX.shop.randomDrop(grade === "S" ? 2 : 0)));
    if (grade === "S" || (grade === "A" && Math.random() < 0.3)) drops.push(g.collect("tf_medalje"));
    if (grade === "S" && mixes.length && mixes.every(k => k === "perfect")) { drops.push(g.collect("tf_kjekkeste")); g.achieve("TF sin kjekkaste"); }
    if (!S.sponsored && g.djLevel() >= 6 && "SA".includes(grade)) { drops.push(g.collect("sponsored")); g.achieve("Sponsored Skier"); }
    if (grade === "S") g.achieve("Legende på Grafen");
    if (bestCombo >= 50) g.achieve("Combo-dronning");
    if (mixes.includes("perfect")) g.achieve("Sømlaus overgang");

    const body = LUX.ui.open("🎧 DJ LUX – resultat", { onClose: () => { g.unlock(); g.idleSoon(); } });
    body.append(
      el("div", { class: "df-grade" + ("CD".includes(grade) ? " fail" : "") }, grade),
      el("p", {}, `${score} poeng  ·  ✨ ${hits.perfect} perfekt  ·  👍 ${hits.good} bra  ·  💥 ${hits.miss} bom  ·  beste combo ${bestCombo}`),
      el("p", {}, `Overgangar: ${mixes.map(k => ({ perfect: "🌟", good: "👍", bad: "💥" })[k]).join(" ") || "–"}  ·  🔥 dansegolvet ${Math.round(heat)} %`),
      el("p", {}, `+${coins} 🪙  ·  🎧 DJ-skills ${S.dj} %` + (S.sponsored ? "  ·  ⭐ sponsor-bonus" : "")),
      ...drops.filter(Boolean).map(d => el("p", { class: "dj-drop" }, `${d.isNew ? "🆕" : "🔁"} ${d.item.name}`)),
      el("button", { onclick: () => LUX.ui.close() }, "Ferdig"));
    g.say(D.lines.result[grade], "SAB".includes(grade) ? "party" : "sad");
    g.renderAll();
    g.save();
  }

  return { start, isRunning: () => running };
})();
