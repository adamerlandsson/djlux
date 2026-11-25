// DJ LUX techno engine – everything is synthesized with the Web Audio API (no audio files).
//
// A "deck" plays one track (content/dj.js). Each track has an arrangement of sections
// (intro → build → DROP → break → build → DROP → outro, the outro loops forever) and a style:
//   acid     – squelchy 303 riff, rolling bass
//   hard     – distorted kick, 16th rumble bass, stabs
//   melodic  – arpeggio + pads, softer
//   rave     – detuned "hoover" chord stabs, big risers
//   minimal  – clicks, rimshots, sub bass, lots of space
//   house    – piano chord stabs on the offbeat, bass follows the chords
//   trance   – gated chord 16ths, pads, a hook melody
// Each deck has its own volume fader (deck.setVolume), so two decks can be blended live.
// Tempo can change while playing (deck.setBpm) – that's how beatmatching works.
window.LUX = window.LUX || {};

LUX.music = (() => {
  let ac = null, master = null, noiseBuf = null;
  const decks = new Set();
  let timer = null;

  function audio() {
    ac = ac || LUX.sound.ctx();
    if (!master) {
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.15;
      master = ac.createGain();
      master.gain.value = 0.9;
      master.connect(comp).connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return ac;
  }

  // ---------- small seeded random per track (same riff every time) ----------
  function seeded(str) {
    let h = 2166136261;
    for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    let s = ((h >>> 0) % 2147483646) + 1;
    return () => (s = (s * 48271) % 2147483647) / 2147483647;   // always 0..1
  }

  const SCALE = [0, 3, 5, 7, 10, 12, 15];   // minor pentatonic-ish
  const semis = (f, n) => f * Math.pow(2, n / 12);

  // chord progressions (bar roots in semitones, minor key): i, VI, III, VII ...
  const PROGRESSIONS = [[0, -4, 3, -2], [0, -2, -4, -5], [0, 3, -4, -2], [0, 0, -4, -2], [0, -5, -4, -2], [0, -4, -5, -2], [0, 5, -4, 3]];
  // triad on a progression root: minor on i / iv / v, major on III / VI / VII
  const triad = n => ([0, 5, -5, 7].includes(n) ? [0, 3, 7] : [0, 4, 7]).map(i => i + n);

  function acidLine(r, density) {
    const line = [];
    for (let i = 0; i < 16; i++) {
      const on = r() < density;
      line.push(on ? { n: SCALE[Math.floor(r() * SCALE.length)] + (r() < 0.2 ? 12 : 0), accent: r() < 0.3, slide: r() < 0.2 } : null);
    }
    return line;
  }
  // a variation of a riff: some notes change, some move an octave, some drop out / come in
  function mutate(line, r, amount) {
    return line.map(n => {
      if (r() > amount) return n;
      if (!n) return r() < 0.5 ? { n: SCALE[Math.floor(r() * SCALE.length)], accent: r() < 0.4, slide: r() < 0.25 } : null;
      if (r() < 0.3) return null;
      return { ...n, n: r() < 0.5 ? (n.n + 12) % 24 : SCALE[Math.floor(r() * SCALE.length)], accent: r() < 0.4 };
    });
  }

  // patterns derived from the track name + style. `salt` makes the variations a little different every time a
  // track is played (the main riff stays the same, so the track is still recognisable)
  function makePatterns(track) {
    const r = seeded(track.name);
    const salt = seeded(track.name + Math.random());
    const acidA = acidLine(r, track.style === "minimal" ? 0.35 : 0.62);
    const acid = [acidA, mutate(acidA, salt, 0.3), mutate(acidA, salt, 0.55)];
    const bass = {
      hard: [[0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1]],
      minimal: [[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0]],
      house: [[0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0], [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1]],
      trance: [[0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1], [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1]],
    }[track.style] || [[0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0], [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1]];
    const arpA = Array.from({ length: 16 }, (_, i) => SCALE[(i * 2 + Math.floor(r() * 3)) % SCALE.length]);
    const arp = [arpA, arpA.map((n, i) => (i % 4 === 3 ? n + 12 : n)), arpA.slice(8).concat(arpA.slice(0, 8)).map(n => n + (salt() < 0.5 ? 0 : 2))];
    const perc = [Array.from({ length: 16 }, () => r() < 0.3), Array.from({ length: 16 }, () => salt() < 0.35)];
    const prog = PROGRESSIONS[Math.floor(r() * PROGRESSIONS.length)];
    const prog2 = PROGRESSIONS[Math.floor(salt() * PROGRESSIONS.length)];   // the second drop / outro may move elsewhere
    // a short "hook" melody (8th notes) for melodic / rave / house / trance
    const hook = Array.from({ length: 8 }, () => (r() < 0.75 ? SCALE[Math.floor(r() * 5)] : null));
    return { acid, bass, arp, perc, prog, prog2, hook };
  }

  // ---------- instruments (all write into `out` at time t) ----------
  function noise(out, t, dur, { type = "highpass", freq = 7000, q = 0.7, vol = 0.1, attack = 0.001, sweepTo } = {}) {
    const src = ac.createBufferSource();
    src.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  let curve = null;
  function drive() {
    if (curve) return curve;
    curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 3.5); }
    return curve;
  }

  const I = {
    kick(out, t, hard) {
      const o = ac.createOscillator();
      o.frequency.setValueAtTime(hard ? 180 : 150, t);
      o.frequency.exponentialRampToValueAtTime(hard ? 50 : 46, t + 0.09);
      const g = ac.createGain();
      g.gain.setValueAtTime(1, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (hard ? 0.45 : 0.32));
      if (hard) { const ws = ac.createWaveShaper(); ws.curve = drive(); o.connect(ws).connect(g); } else o.connect(g);
      g.connect(out);
      o.start(t); o.stop(t + 0.5);
      noise(out, t, 0.012, { freq: 3000, vol: 0.25 });
    },
    clap(out, t, vol = 0.32) { for (const d of [0, 0.011, 0.022]) noise(out, t + d, d === 0.022 ? 0.16 : 0.012, { type: "bandpass", freq: 1300, q: 1.2, vol }); },
    hat(out, t, open, vol = 0.1) { noise(out, t, open ? 0.2 : 0.035, { freq: open ? 7500 : 9000, vol }); },
    ride(out, t) { noise(out, t, 0.5, { type: "bandpass", freq: 6200, q: 0.6, vol: 0.045 }); },
    rim(out, t) {
      const o = ac.createOscillator(); o.type = "square"; o.frequency.value = 1750;
      const g = ac.createGain(); g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      o.connect(g).connect(out); o.start(t); o.stop(t + 0.04);
    },
    bass(out, t, f, dur, cutoff = 260) {
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(cutoff * 2.2, t); lp.frequency.exponentialRampToValueAtTime(cutoff, t + dur * 0.8); lp.Q.value = 4;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
    },
    sub(out, t, f, dur) {
      const o = ac.createOscillator(); o.frequency.value = f;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
    },
    acid(out, t, f, dur, accent, slideFrom, cutoff) {
      const o = ac.createOscillator(); o.type = "sawtooth";
      if (slideFrom) { o.frequency.setValueAtTime(slideFrom, t); o.frequency.exponentialRampToValueAtTime(f, t + dur * 0.6); } else o.frequency.value = f;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 16;
      const peak = cutoff * (accent ? 4 : 2.2);
      lp.frequency.setValueAtTime(peak, t); lp.frequency.exponentialRampToValueAtTime(Math.max(120, cutoff * 0.6), t + dur * 0.9);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(accent ? 0.16 : 0.1, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
    },
    stab(out, send, t, freqs, dur = 0.22, cutoff = 1400, vol = 0.05) {
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(cutoff * 2, t); lp.frequency.exponentialRampToValueAtTime(cutoff * 0.4, t + dur); lp.Q.value = 3;
      const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      lp.connect(g); g.connect(out); g.connect(send);
      for (const f of freqs) for (const det of [-8, 8]) { const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + dur + 0.02); }
    },
    hoover(out, t, freqs, dur) {
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + 0.02); g.gain.setValueAtTime(0.035, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      lp.connect(g).connect(out);
      for (const f of freqs) for (const det of [-22, -9, 0, 9, 22]) {
        const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(f * 0.97, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.08); o.detune.value = det;
        o.connect(lp); o.start(t); o.stop(t + dur + 0.02);
      }
    },
    pluck(out, send, t, f) {
      const o = ac.createOscillator(); o.type = "square"; o.frequency.value = f;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(400, t + 0.18);
      const g = ac.createGain(); g.gain.setValueAtTime(0.045, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(lp).connect(g); g.connect(out); g.connect(send); o.start(t); o.stop(t + 0.25);
    },
    pad(out, t, freqs, dur) {
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1100;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      lp.connect(g).connect(out);
      for (const f of freqs) for (const det of [-12, 12]) { const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + dur + 0.05); }
    },
    riser(out, t, dur) {
      noise(out, t, dur, { type: "bandpass", freq: 300, sweepTo: 9000, q: 2, vol: 0.12, attack: dur * 0.9 });
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(1600, t + dur);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + dur * 0.95); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.02);
      o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.05);
    },
    tom(out, t, f = 160) {
      const o = ac.createOscillator(); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.18);
      const g = ac.createGain(); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(out); o.start(t); o.stop(t + 0.25);
    },
    piano(out, send, t, freqs, dur = 0.3) {   // a bright house piano stab
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      g.connect(out); g.connect(send);
      for (const f of freqs) for (const [type, mul, vol] of [["triangle", 2, 1], ["sine", 4, 0.4]]) {
        const o = ac.createOscillator(); o.type = type; o.frequency.value = f * mul / 2;
        const og = ac.createGain(); og.gain.value = vol; o.connect(og).connect(g); o.start(t); o.stop(t + dur + 0.02);
      }
    },
    crash(out, t) { noise(out, t, 1.8, { freq: 4000, vol: 0.18 }); },
    impact(out, t) {
      const o = ac.createOscillator(); o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.7);
      const g = ac.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.connect(g).connect(out); o.start(t); o.stop(t + 1);
    },
  };

  // ---------- a deck ----------
  function deck(track) {
    audio();
    const P = makePatterns(track);
    const out = ac.createGain();
    out.gain.value = 1;
    const vol = ac.createGain();       // the channel fader
    vol.gain.value = 1;
    out.connect(vol).connect(master);
    // a dub delay for stabs / plucks
    const send = ac.createGain(); send.gain.value = 0.3;
    const delay = ac.createDelay(1.5); const fb = ac.createGain(); fb.gain.value = 0.38;
    const dlp = ac.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 2200;
    send.connect(delay).connect(dlp).connect(fb).connect(delay); dlp.connect(out);

    // arrangement: [{kind, bars}] – the last section (outro) loops forever
    // a few arrangement shapes, picked at random each time the track is played
    const ARRANGEMENTS = [
      [["intro", 2], ["build", 2], ["drop", 8], ["break", 2], ["build", 2], ["drop", 6], ["outro", 4]],
      [["intro", 4], ["drop", 4], ["break", 2], ["build", 2], ["drop", 8], ["outro", 4]],
      [["intro", 2], ["build", 2], ["drop", 6], ["break", 4], ["build", 2], ["drop", 8], ["outro", 4]],
      [["intro", 2], ["build", 4], ["drop", 8], ["break", 2], ["drop", 4], ["build", 2], ["drop", 4], ["outro", 4]],
    ];
    const sections = track.arrangement || ARRANGEMENTS[Math.floor(Math.random() * ARRANGEMENTS.length)].map(([kind, bars]) => ({ kind, bars }));
    const starts = [];
    let acc = 0;
    for (const s of sections) { starts.push(acc); acc += s.bars * 16; }
    const loopStart = starts[starts.length - 1], loopLen = sections[sections.length - 1].bars * 16;

    const d = {
      track, sections, bpm: track.bpm, playing: false, step: 0, nextTime: 0, anchorStep: 0, anchorTime: 0,
      endStep: loopStart,                 // where the outro starts (end of the "song")
      onDrop: null, prevAcid: null, volume: 1,
      stepDur() { return 60 / this.bpm / 4; },
      // which section a step belongs to
      sectionAt(step) {
        if (step >= loopStart) return { ...sections[sections.length - 1], index: sections.length - 1, at: (step - loopStart) % loopLen };
        let i = starts.length - 1;
        while (starts[i] > step) i--;
        return { ...sections[i], index: i, at: step - starts[i] };
      },
      timeOfStep(step) { return this.anchorTime + (step - this.anchorStep) * this.stepDur(); },
      stepAt(time) { return this.anchorStep + (time - this.anchorTime) / this.stepDur(); },
      start(at) {
        this.playing = true; this.step = 0; this.nextTime = at; this.anchorStep = 0; this.anchorTime = at;
        decks.add(this); ensureTimer();
      },
      setBpm(b) {
        // keep the beat continuous: re-anchor at the next scheduled step
        this.anchorStep = this.step; this.anchorTime = this.nextTime;
        this.bpm = b;
      },
      setVolume(v) { this.volume = v; vol.gain.setTargetAtTime(v * v, ac.currentTime, 0.02); },
      stop(fade = 0.3) {
        this.playing = false; decks.delete(this);
        vol.gain.setTargetAtTime(0, ac.currentTime, fade / 3);
        setTimeout(() => { try { vol.disconnect(); } catch {} }, fade * 1000 + 600);
      },
      now: () => ac.currentTime,
    };

    // ---------- what plays on each 16th ----------
    // Things change over time so the loops don't get boring: a chord progression moves every bar, riffs switch
    // between variations every 4 bars, every 4th/8th bar ends with a fill, the second drop uses other variations
    // (+ a hook melody), and the outro (which loops while you mix) adds and removes layers every 4 bars.
    const dropNo = sections.map((s, i) => sections.slice(0, i).filter(x => x.kind === "drop").length);
    function play(step, t) {
      const sec = d.sectionAt(step), at = sec.at, s16 = at % 16, bar = Math.floor(at / 16), bars = sec.bars;
      const st = track.style, r = track.root, sd = d.stepDur();
      const kind = sec.kind, lastBar = bar === bars - 1;
      const songBar = Math.floor(step / 16), second = dropNo[sec.index] >= 1 || kind === "outro";
      const outroBar = kind === "outro" ? Math.floor((step - d.endStep) / 16) : 0;
      const layer = Math.floor(outroBar / 4) % 4;               // outro layers: 0 groove, 1 ride+perc, 2 riff, 3 claps+hats
      const phrase = Math.floor(bar / 4);
      const v = kind === "outro" ? (layer === 2 ? 2 : 0) : second ? 1 + (phrase % 2) : phrase % 2;
      const prog = second ? P.prog2 : P.prog;
      const pr = prog[songBar % 4];
      const chord = triad(pr).map(n => semis(r * 4, n));
      const beat = s16 % 4 === 0, off = s16 % 4 === 2;
      const fill8 = songBar % 8 === 7 && (kind === "drop" || kind === "outro"), fill4 = songBar % 4 === 3 && !fill8;
      const harmonic = ["melodic", "rave", "house", "trance"].includes(st);

      if (kind === "drop" && at === 0) { I.crash(out, t); I.impact(out, t); d.onDrop && d.onDrop(t); }
      if (kind === "outro" && at % 64 === 0 && outroBar > 0) I.crash(out, t);   // a new outro layer starts

      // kick (drops out for the last beat of an 8-bar fill)
      const kickOn = kind === "drop" || kind === "outro" || kind === "intro" || (kind === "build" && !lastBar);
      if (kickOn && beat && !(fill8 && s16 === 12 && kind === "drop")) I.kick(out, t, st === "hard");
      if (kickOn && st === "hard" && second && s16 === 14 && bar % 2) I.kick(out, t, true);   // double kick
      // hats
      if (kind !== "break") {
        if (off) I.hat(out, t, kind === "drop" || kind === "outro" || (fill4 && s16 === 14), kind === "intro" ? 0.06 : 0.09);
        if ((kind === "drop" || st === "hard" || (kind === "outro" && layer === 3)) && s16 % 2 === 1) I.hat(out, t, false, 0.04);
      }
      if (beat && st !== "minimal" && (kind === "drop" || (kind === "outro" && layer === 1))) I.ride(out, t);
      // clap (+ a shuffle in the outro)
      if ((kind === "drop" || kind === "outro") && (s16 === 4 || s16 === 12)) I.clap(out, t);
      if (kind === "outro" && layer === 3 && (s16 === 7 || s16 === 15)) I.clap(out, t, 0.12);
      // fills at the end of phrases
      if (fill8 && s16 >= 12) { I.clap(out, t, 0.1 + (s16 - 12) * 0.06); I.tom(out, t, 200 - (s16 - 12) * 30); }
      else if (fill4 && kind === "drop" && s16 === 15) I.tom(out, t, 160);
      // build: snare roll that speeds up + riser
      if (kind === "build") {
        const p = at / (bars * 16);
        const every = p < 0.5 ? 4 : p < 0.75 ? 2 : 1;
        if (s16 % every === 0) I.clap(out, t, 0.08 + p * 0.22);
        if (at === 0) I.riser(out, t, bars * 16 * sd);
      }
      // bass (harmonic styles follow the chords, the others drone on the root with small moves)
      if (kind === "drop" || kind === "outro" || (kind === "build" && !lastBar) || (kind === "intro" && bar >= 1)) {
        const pat = P.bass[second ? 1 : 0];
        if (pat[s16]) {
          const cutoff = kind === "build" ? 160 + (at / (bars * 16)) * 400 : st === "hard" ? 380 : 260 + (second ? 80 : 0);
          const n = harmonic ? (pr > 6 ? pr - 12 : pr) : s16 === 14 && st !== "hard" ? 3 : 0;
          I.bass(out, t, semis(r, n), sd * (st === "hard" ? 0.8 : 1.5), cutoff);
        }
        if (st === "minimal" && beat) I.sub(out, t, r, sd * 3);
      }
      // the lead per style
      const lead = kind === "drop" || (kind === "build" && st === "acid") || (kind === "break" && st === "acid") || (kind === "outro" && layer === 2);
      if (lead) {
        const leadVol = kind === "outro" ? 0.6 : 1;
        if (st === "acid") {
          const n = P.acid[v][s16];
          const shift = second ? [0, 0, 5, 3][Math.floor(songBar / 2) % 4] : 0;
          const cutoff = kind === "build" ? 250 + (at / (bars * 16)) * 1200 : kind === "break" || kind === "outro" ? 320 : 900 + Math.sin(step / 24) * 500;
          if (n) { const f = semis(r * 2, n.n + shift); I.acid(out, t, f, sd * (n.slide ? 1.6 : 0.9), n.accent, n.slide ? d.prevAcid : null, cutoff); d.prevAcid = f; }
        }
        if (st === "hard" && (s16 === 2 || s16 === 10 || (bar % 2 && s16 === 7) || (v === 2 && s16 === 14))) I.stab(out, send, t, chord, 0.18, 1600, 0.05 * leadVol);
        if (st === "melodic" && s16 % 2 === 0) I.pluck(out, send, t, semis(r * 4, P.arp[v][s16] + pr));
        if (st === "rave" && (s16 === 0 || s16 === 6 || s16 === 10) && (bar % 2 === 0 || v === 2)) I.hoover(out, t, chord.map(f => f / 2), sd * 3);
        if (st === "minimal" && P.perc[v % 2][s16]) I.rim(out, t);
        if (st === "house" && [2, 6, 10, 14].includes(s16) && (v !== 1 || s16 !== 10)) I.piano(out, send, t, chord, sd * 1.8);
        if (st === "trance") { I.stab(out, send, t, chord, sd * 0.8, 1200 + (second ? 900 : 0), 0.022 * leadVol); if (s16 % 4 === 0) I.pad(out, t, chord.map(f => f / 2), sd * 4); }
        // the hook melody: in the second drop, and in every other phrase of the first
        if (harmonic && kind === "drop" && (second || phrase % 2 === 1) && s16 % 2 === 0) {
          const h = P.hook[s16 / 2];
          if (h !== null) I.pluck(out, send, t, semis(r * 8, h + (pr > 6 ? pr - 12 : pr)));
        }
      }
      if ((st === "minimal" || (kind === "outro" && layer === 1)) && kind !== "break" && P.perc[1][(s16 + 5) % 16]) I.rim(out, t);
      // break: pads, tension
      if (kind === "break" && at % 16 === 0) I.pad(out, t, chord, sd * 16);
      if (kind === "break" && st !== "acid" && s16 % 4 === 2) I.pluck(out, send, t, semis(r * 4, P.arp[0][s16] + pr));
      if (kind === "intro" && (st === "melodic" || st === "trance") && at % 32 === 0) I.pad(out, t, chord, sd * 32);
      if (kind === "intro" && st === "house" && bar >= 1 && [6, 14].includes(s16)) I.piano(out, send, t, chord, sd * 1.5);
    }

    d.schedule = horizon => {
      while (d.playing && d.nextTime < horizon) {
        if (d.nextTime > ac.currentTime - 0.02) play(d.step, d.nextTime);
        d.step++;
        d.nextTime = d.anchorTime + (d.step - d.anchorStep) * d.stepDur();
      }
    };
    return d;
  }

  function ensureTimer() {
    if (timer) return;
    timer = setInterval(() => {
      if (!decks.size) { clearInterval(timer); timer = null; return; }
      const horizon = ac.currentTime + 0.18;
      for (const d of decks) d.schedule(horizon);
    }, 25);
  }

  function stopAll() { for (const d of [...decks]) d.stop(0.5); }

  // for testing: what's playing and how loud each channel is
  const debug = () => [...decks].map(d => ({ name: d.track.name, volume: d.volume, step: d.step }));

  return { deck, stopAll, now: () => audio().currentTime, context: audio, debug };
})();
