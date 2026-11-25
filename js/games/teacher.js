// 🧮 Matte-time i Ål (chapter 3): the pupils raise their hands with maths questions – answer before
// their patience runs out. Distractions pop up (Adam leaving for the slopes, snow alerts...).
// Settings: content/story.js → LUX.content.teacher
window.LUX = window.LUX || {};

LUX.teacher = (() => {
  const K = LUX.content.teacher;
  const { el, pick, open, close, shuffle } = LUX.ui;
  const G = () => LUX.game;
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  // a maths question with 4 answers (the right one first)
  function makeQuestion() {
    const kind = pick(["mul", "add", "sub", "div", "pct", "frac"]);
    let q, a;
    if (kind === "mul") { const x = r(3, 12), y = r(3, 12); q = `${x} · ${y}`; a = x * y; }
    if (kind === "add") { const x = r(17, 89), y = r(14, 78); q = `${x} + ${y}`; a = x + y; }
    if (kind === "sub") { const x = r(50, 120), y = r(12, 49); q = `${x} − ${y}`; a = x - y; }
    if (kind === "div") { const y = r(3, 9), a0 = r(3, 12); q = `${a0 * y} : ${y}`; a = a0; }
    if (kind === "pct") { const p = pick([10, 20, 25, 50, 75]), x = pick([40, 80, 120, 200, 400]); q = `${p} % av ${x}`; a = (p * x) / 100; }
    if (kind === "frac") { const d = pick([2, 3, 4, 5]), x = d * r(2, 10); q = `1/${d} av ${x}`; a = x / d; }
    const wrong = new Set();
    while (wrong.size < 3) {
      const w = a + pick([-10, -2, -1, 1, 2, 10, a > 20 ? -a / 2 : 3]);
      if (w !== a && w >= 0) wrong.add(Math.round(w));
    }
    return { q, answers: [a, ...wrong] };
  }

  function start() {
    const g = G();
    g.lock();
    let timer, closed = false, i = 0, right = 0, t = 0, qt = 0, distraction = null, q = null, answering = false;
    const body = open("🧮 Matte-time i Ål", {
      wide: true,
      onClose: () => { if (closed) return; closed = true; clearInterval(timer); g.unlock(); g.idleSoon(); },
    });
    const clock = el("div", { class: "mg-round" });
    const pupil = el("div", { class: "tc-pupil" });
    const word = el("div", { class: "mg-word" });
    const patience = el("div", { class: "mg-timer" }, el("i"));
    const grid = el("div", { class: "df-answers" });
    const banner = el("div", { class: "tc-distraction hidden" });
    body.append(el("p", {}, `Svar ${Math.round(K.need * 100)} % riktig før klokka ringjer. Ungane ventar ikkje lenge!`), clock, pupil, word, patience, grid, banner);
    g.say("God morgon, klasse! I dag: matte. Og så: SKI.", "busy", { log: false });

    function ask() {
      if (i >= K.questions) return done();
      const m = makeQuestion();
      q = m;
      qt = 0;
      answering = false;
      pupil.textContent = `🙋 ${pick(K.pupils)} spør: «Lærar, kva er...»`;
      word.textContent = m.q + " ?";
      grid.innerHTML = "";
      shuffle(m.answers.map((v, j) => ({ v, ok: j === 0 }))).forEach(o =>
        grid.append(el("button", { onclick: e => answer(o.ok, e.target) }, String(o.v).replace(".", ","))));
    }

    function answer(ok, btn) {
      if (answering || closed) return;
      answering = true;
      [...grid.children].forEach(b => (b.disabled = true));
      if (ok) { right++; btn?.classList.add("right"); g.sound.blip(800); g.say(pick(K.lines.right), "happy", { log: false }); }
      else { btn?.classList.add("wrong"); g.sound.blip(160); g.say(pick(K.lines.wrong), "annoyed", { log: false }); }
      i++;
      setTimeout(() => !closed && ask(), 800);
    }

    function distract() {
      distraction = { left: 3 };
      banner.innerHTML = "";
      banner.append(el("b", {}, pick(K.distractions)), el("small", {}, " (ignorer det!)"));
      banner.classList.remove("hidden");
    }

    function done() {
      clearInterval(timer);
      const share = right / K.questions;
      const passed = share >= K.need;
      if (passed) { g.stat("lessonsPassed"); g.addCoins(20 + right * 2); g.achieve("Mattelærar"); }
      body.innerHTML = "";
      body.append(el("div", { class: "mg-score" }, `${right} / ${K.questions}`),
        el("p", {}, passed ? "✅ Godkjend time!" : "❌ Ikkje godkjend..."),
        el("button", { onclick: () => close() }, "Ferdig"));
      g.say(passed ? K.lines.passed : K.lines.failed, passed ? "excited" : "sad");
      g.save();
    }

    timer = setInterval(() => {
      if (closed) return;
      t += 0.1;
      if (q && !answering) {
        qt += 0.1;
        patience.firstChild.style.width = Math.max(0, 100 - (qt / K.questionSeconds) * 100) + "%";
        if (qt >= K.questionSeconds) answer(false, null);
      }
      if (distraction) { distraction.left -= 0.1; if (distraction.left <= 0) { distraction = null; banner.classList.add("hidden"); } }
      else if (Math.random() < 0.012) distract();
      clock.textContent = `Spørsmål ${Math.min(i + 1, K.questions)} / ${K.questions}  ·  ✅ ${right}  ·  ⏱ ${Math.max(0, Math.ceil(K.seconds - t))} s`;
      if (t >= K.seconds) { g.sound.ring(); done(); }
    }, 100);
    ask();
  }

  return { start };
})();
