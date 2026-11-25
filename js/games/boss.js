// Boss fights (Professor RipeiSåle, the van Takeshi, Swedish Adam) – one engine, content in
// content/story.js → LUX.content.bosses. Right answers shrink the boss's bar, wrong or slow answers
// shrink Anna's. Three helps, once each. Keys 1–4 answer.
window.LUX = window.LUX || {};

LUX.boss = (() => {
  const { el, pick, open, close, shuffle, sleep, sprite } = LUX.ui;
  const G = () => LUX.game;

  function start(id) {
    const B = LUX.content.bosses[id];
    if (!B) return;
    const g = G(), S = g.state, L = B.lines;
    g.lock();
    let closed = false, timer, enemy = 100, mine = 100;
    let q = null, t = 0, limit = B.seconds, answering = false, angry = false, right = 0, asked = 0;
    const used = {};
    const pool = shuffle(B.questions.slice());

    const onKey = e => {
      const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[e.code];
      if (n !== undefined) answer(n);
    };
    const body = open(`⚔️ ${B.name}`, {
      wide: true,
      onClose: () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        document.removeEventListener("keydown", onKey);
        g.unlock();
        g.idleSoon();
      },
    });

    const bar = (cls, label) => el("div", { class: cls }, el("span", {}, label), el("div", { class: "mg-timer" }, el("i")));
    const enemyEl = bar("df-doubt", B.enemyBar);
    const mineEl = bar("df-conf", B.playerBar);
    const anna = el("img", { class: "df-mie", src: sprite("base"), alt: "Anna" });
    const face = el("div", { class: "bs-face" }, LUX.ui.face(B.image, B.face, B.name, "full"));
    const foe = el("div", { class: "df-sensor bs-foe" }, face, el("div", { class: "df-name" }, B.name));
    const speech = el("div", { class: "df-speech" });
    const arena = el("div", { class: "df-arena" }, anna, speech, foe);
    const qEl = el("div", { class: "df-q" });
    const timeBar = el("div", { class: "mg-timer" }, el("i"));
    const answers = el("div", { class: "df-answers" });
    const said = el("div", { class: "df-said" });
    const helps = el("div", { class: "df-helps" }, ...B.helps.map((h, i) => el("button", { onclick: () => useHelp(i) }, h.label)));
    body.append(el("p", { class: "bs-task" }, B.task), el("div", { class: "df-bars" }, enemyEl, mineEl), arena, qEl, timeBar, answers, helps, said);
    document.addEventListener("keydown", onKey);

    const talk = s => (speech.textContent = s);
    const annaSays = s => (said.textContent = "Anna: " + s);
    const setPic = p => { if (!anna.src.endsWith(sprite(p))) anna.src = sprite(p); };
    function render() {
      enemyEl.querySelector("i").style.width = enemy + "%";
      mineEl.querySelector("i").style.width = mine + "%";
      mineEl.classList.toggle("low", mine < 35);
      timeBar.firstChild.style.width = q ? Math.max(0, 100 - (t / limit) * 100) + "%" : "0%";
      B.helps.forEach((h, i) => {
        helps.children[i].disabled = used[i] || answering || (h.kind === "heal" ? mine >= 100 : !q);
      });
    }
    function shake(x) { x.classList.remove("hurt"); void x.offsetWidth; x.classList.add("hurt"); }

    function ask() {
      if (closed) return;
      if (!pool.length) pool.push(...shuffle(B.questions.slice()));
      const src = pool.shift();
      q = { ...src, opts: shuffle(src.a.map((text, i) => ({ text, ok: i === 0 }))) };
      asked++;
      t = 0;
      answering = false;
      talk(`${pick(L.ask)} ${src.q}`);
      qEl.textContent = `Runde ${asked}`;
      answers.innerHTML = "";
      q.opts.forEach((o, i) => answers.append(el("button", { onclick: () => answer(i) }, `${i + 1}. ${o.text}`)));
      setPic("base");
      render();
    }

    async function answer(i) {
      if (!q || answering || closed || i >= q.opts.length) return;
      const b = answers.children[i];
      if (b.classList.contains("gone")) return;
      answering = true;
      [...answers.children].forEach((x, j) => { x.disabled = true; if (q.opts[j].ok) x.classList.add("right"); });
      if (q.opts[i].ok) {
        right++;
        enemy = Math.max(0, enemy - (B.hit + Math.round(B.speedBonus * Math.max(0, 1 - t / limit))));
        talk(pick(L.hit));
        annaSays(q.opts[i].text);
        setPic("excited");
        shake(foe);
        g.sound.blip(800);
      } else {
        b.classList.add("wrong");
        hurt(B.wrong, pick(L.miss), q.opts[i].text);
      }
      await next();
    }

    function hurt(n, foeLine, annaLine) {
      mine = Math.max(0, mine - n);
      talk(foeLine);
      if (annaLine) annaSays(annaLine);
      setPic("shocked");
      shake(arena);
      g.sound.blip(150);
    }

    async function next() {
      q = null;
      render();
      await sleep(1800);
      if (closed) return;
      if (enemy <= 0 || mine <= 0) return finish();
      if (!angry && enemy <= 50) {
        angry = true;
        limit = B.secondsAngry;
        foe.classList.add("angry");
        talk(L.angry);
        await sleep(2000);
        if (closed) return;
      }
      ask();
    }

    async function useHelp(i) {
      const h = B.helps[i];
      if (used[i] || answering) return;
      if (h.kind !== "heal" && !q) return;
      used[i] = true;
      annaSays(h.line);
      talk(h.enemy);
      if (h.kind === "heal") { mine = Math.min(100, mine + h.amount); setPic("excited"); g.sound.blip(600); }
      if (h.kind === "fifty") {
        shuffle([...answers.children].filter((_, j) => !q.opts[j].ok)).slice(0, 2).forEach(b => b.classList.add("gone"));
        setPic("dreamy");
      }
      if (h.kind === "skip") {
        answering = true;
        enemy = Math.max(0, enemy - h.damage);
        shake(foe);
        [...answers.children].forEach(x => (x.disabled = true));
        render();
        await sleep(1200);
        if (closed) return;
        return next();
      }
      render();
    }

    function finish() {
      clearInterval(timer);
      const won = enemy <= 0;
      if (won) {
        g.stat("boss_" + id);
        S.mood = Math.min(100, S.mood + 25);
        g.achieve(`Slo ${B.name}`);
        if (mine >= 80) g.achieve(`Knuste ${B.name}`);
      } else S.mood = Math.max(0, S.mood - 10);
      talk(won ? L.won : L.lost);
      arena.after(el("div", { class: "wr-result" },
        el("div", { class: "df-grade" + (won ? "" : " fail") }, won ? "🏆" : "😭"),
        el("p", {}, won ? `Du vann! ${mine} % ${B.playerBar.split(" ").slice(1).join(" ").toLowerCase()} igjen.` : "Tapt denne gongen. Prøv igjen frå 📚 Skule."),
        el("p", {}, `✅ ${right} rette av ${asked}`),
        el("button", { onclick: () => close() }, "Ferdig")));
      for (const x of [qEl, timeBar, answers, helps]) x.remove();
      setPic(won ? "excited" : "sad");
      said.textContent = "";
      g.say(won ? L.annaWon : L.annaLost, won ? "excited" : "sad");
      g.renderAll();
      g.save();
    }

    talk(pick(L.start));
    annaSays("Okei. E klarar dette. E ÆR dette.");
    render();
    setTimeout(() => !closed && ask(), 2200);
    let last = performance.now();
    timer = setInterval(() => {
      const nowMs = performance.now(), dt = Math.min(0.1, (nowMs - last) / 1000);
      last = nowMs;
      if (!q || answering) return;
      t += dt;
      if (t >= limit) {
        answering = true;
        [...answers.children].forEach((x, j) => { x.disabled = true; if (q.opts[j].ok) x.classList.add("right"); });
        hurt(B.timeout, pick(L.timeout), "...");
        next();
      }
      render();
    }, 50);
  }

  return { start };
})();
