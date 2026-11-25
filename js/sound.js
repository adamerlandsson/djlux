// Synthesized sound effects and a tiny drum machine – no audio files needed.
window.LUX = window.LUX || {};

LUX.sound = (() => {
  let ctx = null;
  // browsers keep audio "suspended" until the user has clicked something, so wake it up on every interaction
  function audio() {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  for (const ev of ["pointerdown", "keydown"]) document.addEventListener(ev, () => audio(), { capture: true });

  const noiseCache = {};
  function noiseBuffer(seconds) {
    const ac = audio();
    if (noiseCache[seconds]) return noiseCache[seconds];
    const buf = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return (noiseCache[seconds] = buf);
  }

  function tone(freq, dur, { type = "square", vol = 0.03, at = 0, dest } = {}) {
    const ac = audio();
    const t = ac.currentTime + at;
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest || ac.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  const blip = (pitch = 520) => tone(pitch + Math.random() * 60, 0.05);
  // the soft tick while a speech bubble is typed out (TYPE_VOLUME: 0 = silent, the other blips are 0.03)
  const TYPE_VOLUME = 0.01;
  const typing = () => tone(480 + Math.random() * 60, 0.04, { type: "triangle", vol: TYPE_VOLUME });
  const jingle = () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f), i * 90));

  function noise(dur, { freq = 1800, q = 1, vol = 0.3, type = "bandpass", at = 0, sweepTo, dest } = {}) {
    const ac = audio();
    const t = ac.currentTime + at;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(1);
    const f = ac.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    f.Q.value = q;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest || ac.destination);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  // phone ringing (two quick double-rings)
  function ring() {
    [0, 120, 400, 520].forEach((ms, i) => setTimeout(() => tone(i % 2 ? 660 : 880, 0.11, { vol: 0.05 }), ms));
  }

  // a door creaking open
  function creak() {
    const ac = audio();
    const t = ac.currentTime;
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(170, t);
    o.frequency.linearRampToValueAtTime(260, t + 0.25);
    o.frequency.linearRampToValueAtTime(150, t + 0.55);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 12;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(bp).connect(g).connect(ac.destination);
    o.start(t); o.stop(t + 0.65);
  }

  // knuckles on the window: three dry taps on glass
  function knock() {
    [0, 0.28, 0.71].forEach(d => noise(0.06, { freq: 1900, q: 3, vol: 0.9, at: d }));
  }

  const whoosh = () => noise(0.5, { freq: 600, sweepTo: 3000, vol: 0.25 });     // skiing / powder
  const crash = () => noise(0.4, { freq: 300, type: "lowpass", vol: 0.6 });      // tree / rock
  const scratch = () => noise(0.18, { freq: 900, sweepTo: 2600, q: 4, vol: 0.5 }); // DJ scratch
  function cheer() { // the crowd goes wild
    for (let i = 0; i < 6; i++) noise(0.9, { freq: 900 + Math.random() * 900, q: 0.7, vol: 0.12, at: i * 0.05 });
  }
  function boo() {
    const ac = audio();
    const t = ac.currentTime;
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(180, t);
    o.frequency.linearRampToValueAtTime(110, t + 0.9);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 500;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
    o.connect(lp).connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + 1);
  }
  function engine() { // the van coughs
    [0, 0.18, 0.3, 0.55].forEach((d, i) => tone(60 + i * 8, 0.14, { type: "sawtooth", vol: 0.12, at: d }));
  }

  // ---------- drum machine (DJ game) ----------
  // instruments scheduled at an exact audio time `t` through an output node (so the crossfader can fade it)
  function drums() {
    const ac = audio();
    const out = ac.createGain();
    out.gain.value = 0.9;
    out.connect(ac.destination);
    const at = t => t - ac.currentTime;
    return {
      out,
      now: () => ac.currentTime,
      kick(t) {
        const o = ac.createOscillator();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.6, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(out);
        o.start(t);
        o.stop(t + 0.3);
      },
      hat(t, open) { noise(open ? 0.12 : 0.04, { freq: 8000, type: "highpass", vol: 0.12, at: at(t), dest: out }); },
      clap(t) { noise(0.12, { freq: 1500, q: 1.5, vol: 0.35, at: at(t), dest: out }); },
      bass(t, freq, dur) {
        const o = ac.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = freq;
        const lp = ac.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 400;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(lp).connect(g).connect(out);
        o.start(t);
        o.stop(t + dur + 0.02);
      },
      stab(t, freqs, dur = 0.18) {
        for (const f of freqs) {
          const o = ac.createOscillator();
          o.type = "square";
          o.frequency.value = f;
          const g = ac.createGain();
          g.gain.setValueAtTime(0.025, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
          o.connect(g).connect(out);
          o.start(t);
          o.stop(t + dur + 0.02);
        }
      },
      stop() { out.gain.setTargetAtTime(0, ac.currentTime, 0.05); setTimeout(() => out.disconnect(), 400); },
    };
  }

  return { blip, typing, jingle, ring, knock, creak, whoosh, crash, scratch, cheer, boo, engine, tone, drums, ctx: audio };
})();
