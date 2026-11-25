// Background music: soft, synthesized lo-fi that plays quietly under the whole game (no audio files).
//  - jazzy 7th chords on an electric piano, a soft swung beat, sub bass, a lazy melody, a little vinyl crackle
//  - it keeps changing: new chord progression every 8 bars, a new key now and then, and sometimes the drums
//    drop out for a few bars of just piano
//  - it fades out by itself whenever the DJ game's decks are playing (js/music.js), and back in afterwards
//  - the 🎵 button in the header turns it on/off (remembered in this browser)
window.LUX = window.LUX || {};

LUX.bgm = (() => {
  const VOLUME = 0.12;              // overall loudness (the DJ game plays at ~0.9) – keep it low
  const BPM = 74;
  const KEY = "djlux-bgm";
  let ac = null, out = null, lp = null, timer = null, noiseBuf = null;
  let enabled = true, audible = false;
  try { enabled = localStorage.getItem(KEY) !== "off"; } catch {}

  // chords as semitones above the key's root
  const CH = {
    I: [0, 4, 7, 11], ii: [2, 5, 9, 12], iii: [4, 7, 11, 14], IV: [5, 9, 12, 16],
    V: [7, 11, 14, 17], vi: [-3, 0, 4, 7], IVm: [5, 8, 12, 15], bVII: [-2, 2, 5, 9],
  };
  const PROGS = [
    ["I", "vi", "ii", "V"], ["ii", "V", "I", "I"], ["IV", "iii", "ii", "I"], ["vi", "IV", "I", "V"],
    ["I", "IV", "iii", "vi"], ["IV", "IVm", "I", "vi"], ["I", "bVII", "IV", "I"], ["ii", "iii", "IV", "V"],
  ];
  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16];
  const KEYS = [130.81, 146.83, 155.56, 174.61, 123.47, 138.59];   // C3, D3, Eb3, F3, B2, C#3

  let bar = 0, step = 0, nextTime = 0, prog = PROGS[0], root = KEYS[0], drums = true, melodyAt = 4, lastMel = 7;
  const semis = (f, n) => f * Math.pow(2, n / 12);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  function audio() {
    if (ac) return ac;
    ac = LUX.sound.ctx();
    lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2600;     // lo-fi: no harsh highs
    out = ac.createGain();
    out.gain.value = 0;
    lp.connect(out).connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ac;
  }

  // ---------- instruments ----------
  function epiano(t, f, dur, vol = 0.05) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    // a slow tremolo, like an old Rhodes
    const trem = ac.createGain();
    const lfo = ac.createOscillator(), lfoG = ac.createGain();
    lfo.frequency.value = 4.2; lfoG.gain.value = 0.25;
    lfo.connect(lfoG).connect(trem.gain);
    trem.gain.value = 0.85;
    g.connect(trem).connect(lp);
    for (const [mul, v, type] of [[1, 1, "sine"], [2, 0.25, "sine"], [3, 0.06, "triangle"]]) {
      const o = ac.createOscillator(); o.type = type; o.frequency.value = f * mul; o.detune.value = (Math.random() - 0.5) * 8;
      const og = ac.createGain(); og.gain.value = v;
      o.connect(og).connect(g); o.start(t); o.stop(t + dur + 0.05);
    }
    lfo.start(t); lfo.stop(t + dur + 0.05);
  }
  function kick(t) {
    const o = ac.createOscillator(); o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    const g = ac.createGain(); g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g).connect(lp); o.start(t); o.stop(t + 0.32);
  }
  function noise(t, dur, freq, type, vol) {
    const s = ac.createBufferSource(); s.buffer = noiseBuf;
    const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = 0.8;
    const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(lp); s.start(t, Math.random() * 0.8); s.stop(t + dur + 0.02);
  }
  const snare = t => noise(t, 0.18, 1800, "bandpass", 0.09);
  const hat = (t, v = 0.025) => noise(t, 0.04, 7000, "highpass", v);
  const crackle = t => noise(t, 0.008, 3000, "highpass", 0.02 + Math.random() * 0.03);
  function bass(t, f, dur) {
    const o = ac.createOscillator(); o.frequency.value = f;
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(lp); o.start(t); o.stop(t + dur + 0.05);
  }
  function lead(t, f, dur) {
    const o = ac.createOscillator(); o.type = "triangle"; o.frequency.value = f;
    const vib = ac.createOscillator(), vg = ac.createGain(); vib.frequency.value = 5; vg.gain.value = 3;
    vib.connect(vg).connect(o.frequency);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(lp); o.start(t); o.stop(t + dur + 0.05); vib.start(t); vib.stop(t + dur + 0.05);
  }

  // ---------- the song (8th notes, 8 per bar, swung) ----------
  function newSection() {
    prog = pick(PROGS);
    if (Math.random() < 0.3) root = pick(KEYS);
    drums = Math.random() > 0.2;            // sometimes just piano for a while
    melodyAt = pick([0, 2, 4, 4, 6]);         // which bars of the section get a melody
  }

  function play(s, t) {
    const e8 = s % 8, sb = Math.floor(s / 8);              // eighth in the bar, bar number
    const eighth = 60 / BPM / 2;
    if (e8 === 0 && sb % 8 === 0 && sb > 0) newSection();
    const chord = CH[prog[sb % 4]];
    const barLen = eighth * 8;
    if (e8 === 0) for (const n of chord) epiano(t + Math.random() * 0.02, semis(root, n), barLen * 0.95, 0.032);
    if (e8 === 5 && Math.random() < 0.5) for (const n of chord.slice(1)) epiano(t, semis(root, n + 12), eighth * 2.5, 0.016);
    if (e8 === 0) bass(t, semis(root / 2, chord[0] % 12), eighth * 3.5);
    if (e8 === 5 && Math.random() < 0.6) bass(t, semis(root / 2, (chord[0] % 12) + 7), eighth * 2);
    if (drums) {
      if (e8 === 0 || (e8 === 5 && Math.random() < 0.5)) kick(t);
      if (e8 === 2 || e8 === 6) snare(t);
      hat(t, e8 % 2 ? 0.015 : 0.025);
    }
    // a lazy melody: a random walk on the pentatonic scale
    if (sb % 8 >= melodyAt && sb % 8 < melodyAt + 2 && Math.random() < 0.45) {
      lastMel = Math.max(0, Math.min(PENTA.length - 1, lastMel + pick([-2, -1, -1, 1, 1, 2, 0])));
      lead(t, semis(root * 2, PENTA[lastMel]), eighth * pick([1, 2, 2, 3]));
    }
    if (Math.random() < 0.35) crackle(t + Math.random() * eighth);
  }

  function tick() {
    if (!ac || ac.state !== "running") return;
    const djPlaying = !!(LUX.music && LUX.music.debug && LUX.music.debug().length);
    const want = enabled && !djPlaying && !document.hidden;
    if (want !== audible) {
      audible = want;
      out.gain.setTargetAtTime(want ? VOLUME : 0, ac.currentTime, want ? 1.5 : 0.25);
      if (want) nextTime = Math.max(nextTime, ac.currentTime + 0.1);
    }
    if (!audible) { nextTime = ac.currentTime + 0.1; return; }   // don't schedule notes nobody hears
    const eighth = 60 / BPM / 2;
    while (nextTime < ac.currentTime + 0.3) {
      const swing = step % 2 ? eighth * 0.18 : 0;
      play(step, nextTime + swing);
      step++;
      nextTime += eighth;
    }
  }

  function init() {
    const btn = document.querySelector("#music-toggle");
    const label = () => {
      if (!btn) return;
      btn.textContent = enabled ? "🎵 Musikk" : "🔇 Musikk";
      btn.classList.toggle("off", !enabled);
      btn.title = enabled ? "Bakgrunnsmusikk: på (klikk for å slå av)" : "Bakgrunnsmusikk: av (klikk for å slå på)";
    };
    label();
    btn?.addEventListener("click", () => {
      enabled = !enabled;
      try { localStorage.setItem(KEY, enabled ? "on" : "off"); } catch {}
      label();
    });
    // start right away: if the browser allows sound already, it plays from the first second; otherwise the
    // browser keeps it silent until the first click / tap / key press anywhere (js/sound.js), and it starts then
    audio();
    if (ac.state === "suspended") ac.resume().catch(() => {});
    newSection();
    timer = setInterval(tick, 60);
  }

  return { init, isOn: () => enabled, isAudible: () => audible };
})();
