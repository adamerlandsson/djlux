// Small games: Gibberish eller Hallingdal-ord?, Hva sa Hadi?, Fisk eller IKEA?, Redningsaksjon + the game menu.
window.LUX = window.LUX || {};

LUX.minigames = (() => {
  const C = LUX.content;
  const { el, shuffle, pick, open, close, fill } = LUX.ui;
  const G = () => LUX.game;

  // run a game with the app locked; onClose always unlocks
  function session(title, opts = {}) {
    G().lock();
    let closed = false;
    return open(title, {
      wide: opts.wide,
      onClose: () => {
        if (closed) return;
        closed = true;
        opts.onClose && opts.onClose();
        G().unlock();
        G().idleSoon();
      },
    });
  }

  function endScreen(body, { score, max, coins, line, achievement, expression }) {
    body.innerHTML = "";
    if (coins) coins = G().addCoins(coins);
    if (achievement) G().achieve(achievement);
    body.append(
      el("div", { class: "mg-score" }, `${score} / ${max}`),
      el("p", {}, coins ? `+${coins} 🪙` : ""),
      el("button", { onclick: close }, "Ferdig"),
    );
    G().say(line, expression || (score >= max * 0.6 ? "excited" : "sad"));
    G().save();
  }

  // a timed "which of the two?" game (used by Hallingdal-ord and Fisk eller IKEA)
  function twoChoice({ title, intro, words, labels, right, wrong, onDone }) {
    let timer = null;
    const body = session(title, { onClose: () => clearInterval(timer) });
    let i = 0, score = 0;
    G().say(intro, "busy", { log: false });

    function round() {
      const r = words[i];
      body.innerHTML = "";
      let left = 5;
      const bar = el("div", { class: "mg-timer" }, el("i"));
      const explain = el("p", { class: "mg-explain hidden" }, r.explain || "");
      const answer = type => {
        clearInterval(timer);
        body.querySelectorAll(".mg-two button").forEach(b => (b.disabled = true));
        if (type === r.type) { score++; G().sound.blip(700); G().say(pick(right), "excited", { log: false }); }
        else { G().sound.blip(180); G().say(fill(pick(wrong), { answer: labels[r.type].name }), "annoyed", { log: false }); }
        if (r.explain) explain.classList.remove("hidden");
        setTimeout(() => (++i < words.length ? round() : onDone(body, score, words.length)), r.explain ? 1500 : 900);
      };
      body.append(
        el("div", { class: "mg-round" }, `${i + 1} / ${words.length}`),
        el("div", { class: "mg-word" }, r.w),
        bar,
        el("div", { class: "mg-two" }, ...Object.entries(labels).map(([type, l]) => el("button", { onclick: () => answer(type) }, l.button))),
        explain,
      );
      timer = setInterval(() => {
        left -= 0.1;
        bar.firstChild.style.width = (left / 5) * 100 + "%";
        if (left <= 0) answer(null);
      }, 100);
    }
    round();
  }

  // ---------- Gibberish eller Hallingdal-ord? ----------
  function hallingOrd() {
    const H = C.hallingOrd;
    twoChoice({
      title: "🏔️ Gibberish eller Hallingdal-ord?",
      intro: "Høyr her! Æ dæ eit ekte Hallingdal-ord, eller berre tull?",
      words: shuffle([
        ...shuffle(H.real).slice(0, 5).map(([w, m]) => ({ w, type: "real", explain: `«${w}» = ${m}` })),
        ...shuffle(H.fake).slice(0, 5).map(w => ({ w, type: "fake", explain: `«${w}» æ berre tull.` })),
      ]),
      labels: { real: { button: "🏔️ Hallingdal", name: "ekte Hallingdal-ord" }, fake: { button: "🤪 Gibberish", name: "tull" } },
      right: H.right, wrong: H.wrong,
      onDone: (body, score, max) => {
        G().change("dialekt", score * 3);
        endScreen(body, {
          score, max, coins: score * 4,
          line: score >= 9 ? "Du æ ein ekte halling! Velkomen til Ål!" : score >= 6 ? "Ikkje gale! Du kan flytte til Gol, i alle fall." : "Du æ heilt klart frå Oslo.",
          achievement: score === max ? "Æresborgar av Ål" : null,
        });
      },
    });
  }

  // ---------- Hva sa Hadi? ----------
  function hvaSaHadi() {
    const body = session("🧔🏽 Hva sa Hadi?");
    const rounds = shuffle(C.hvaSaHadi).slice(0, 5);
    let i = 0, score = 0;

    function round() {
      const r = rounds[i];
      body.innerHTML = "";
      const answers = shuffle(r.answers.map((a, idx) => ({ a, ok: idx === 0 })));
      const explain = el("p", { class: "mg-explain hidden" }, r.explain);
      const next = el("button", { class: "hidden", onclick: () => (++i < rounds.length ? round() : done()) }, i < rounds.length - 1 ? "Neste ➜" : "Sjå resultat");
      const buttons = answers.map(({ a, ok }) => el("button", {
        class: "mg-answer",
        onclick: e => {
          buttons.forEach(b => (b.disabled = true));
          buttons.forEach((b, k) => answers[k].ok && b.classList.add("right"));
          if (ok) { score++; G().sound.jingle(); } else { e.target.classList.add("wrong"); G().sound.blip(200); }
          explain.classList.remove("hidden");
          next.classList.remove("hidden");
        },
      }, a));
      body.append(
        el("div", { class: "mg-round" }, `Runde ${i + 1} av ${rounds.length}`),
        el("div", { class: "mg-quote" }, `Hadi: «${r.hadi}»`),
        el("p", {}, "Kå meiner han?"),
        ...buttons, explain, next,
      );
    }

    function done() {
      endScreen(body, {
        score, max: rounds.length, coins: score * 5,
        line: score === rounds.length ? "Du forstår Brønnøysund-dialekt! Hadi blir SÅ glad!" : score >= 3 ? "Ikkje dårleg! Men kvenn æ Edvin?" : "Hadi snakkar heilt tydeleg. Det æ DU som æ frå Oslo.",
        achievement: score === rounds.length ? "Hadi-tolk" : null,
      });
    }
    round();
  }

  // ---------- Fisk eller IKEA? (svensktime for Adam sin skuld) ----------
  function fiskEllerIkea() {
    const F = C.fiskEllerIkea;
    G().setExpression("busy");
    twoChoice({
      title: "🐟 Fisk eller IKEA? 🪑",
      intro: F.intro,
      words: shuffle([
        ...shuffle(F.fish).slice(0, 5).map(w => ({ w, type: "fisk" })),
        ...shuffle(F.ikea).slice(0, 5).map(w => ({ w, type: "ikea" })),
      ]),
      labels: { fisk: { button: "🐟 Fisk", name: "fisk" }, ikea: { button: "🪑 IKEA", name: "IKEA-møbel" } },
      right: F.right, wrong: F.wrong,
      onDone: (body, score, max) => {
        G().change("mood", -5); // studying is exhausting
        G().change("adam", 5);
        endScreen(body, {
          score, max, coins: score * 3,
          line: score >= 9 ? "Härligt! E snakkar flytande svensk no. Nesten." : score >= 6 ? "Okei... Adam forstår mæg sikkert. Kanskje." : "E gir opp svensk. Adam får lære hallingmål.",
          achievement: score === max ? "IKEA-ekspert" : null,
        });
      },
    });
  }

  // ---------- Redningsaksjon (Sunday hangover) ----------
  function rescue() {
    const R = C.rescue;
    let tick = null;
    const body = session("🚑 Redningsaksjon", { onClose: () => clearInterval(tick) });
    const items = shuffle(R.items);
    const wishIds = Object.keys(R.wishes);
    let health = 60, time = 30, score = 0, wish = null, wishLeft = 0, over = false;

    const hp = el("div", { class: "mg-timer hp" }, el("i"));
    const clock = el("div", { class: "mg-round" }, "");
    const wishBox = el("div", { class: "mg-quote" }, "");
    const grid = el("div", { class: "mg-items" }, ...items.map(it =>
      el("button", { class: "mg-item", title: it.name, onclick: () => give(it) }, el("span", {}, it.icon), el("small", {}, it.name))));
    body.append(el("p", {}, "Anna æ fyllesjuk (og bekymra). Gje ho det ho treng før humøret når null! Ikkje lag bråk."), clock, hp, wishBox, grid);

    function newWish() {
      wish = pick(wishIds);
      wishLeft = Math.max(2.5, 4.5 - score * 0.15);
      const line = pick(R.wishes[wish]) + (Math.random() < 0.3 ? " " + pick(R.worry) : "");
      wishBox.textContent = `Anna: «${line}»`;
      G().say(line, "hungover", { log: false });
    }

    function give(it) {
      if (over) return;
      if (it.loud) {
        health -= 25;
        G().say(pick(R.loud), "shocked", { log: false });
        G().sound.blip(120);
        setTimeout(() => !over && G().setExpression("hungover"), 900);
      } else if (it.id === wish) {
        health = Math.min(100, health + 12);
        score++;
        G().say(pick(R.right), "hungover", { log: false });
        G().sound.blip(660);
        newWish();
      } else {
        health -= 10;
        G().say(pick(R.wrong), "hungover", { log: false });
      }
      render();
    }

    function render() {
      hp.firstChild.style.width = Math.max(0, health) + "%";
      clock.textContent = `⏱ ${Math.ceil(time)} s  ·  Redda: ${score}`;
    }

    tick = setInterval(() => {
      time -= 0.1; wishLeft -= 0.1; health -= 0.25;
      if (wishLeft <= 0) { health -= 8; newWish(); }
      render();
      if (health <= 0 || time <= 0) {
        over = true;
        clearInterval(tick);
        const won = health > 0;
        G().change("mood", won ? 25 : -10);
        endScreen(body, {
          score, max: score, coins: score * 4 + (won ? 10 : 0),
          line: won ? "Du redda livet mitt. Og du seie e ikkje gjorde noko rart i går? ...lovar du?" : "E døyr. Skriv på gravsteinen: «Ho gjorde ingenting rart. Truleg.»",
          achievement: won ? "Søndagsredninga" : null,
          expression: "hungover",
        });
        body.querySelector(".mg-score").textContent = won ? `Overlevde! (${score} redda)` : "Anna døydde (nesten)";
      }
    }, 100);
    newWish();
    render();
  }

  // ---------- menu ----------
  function menu() {
    const body = open("🎮 Spel");
    const g = G(), ch = g.state.chapter;
    const hungover = g.context === "hungover";
    const games = [
      ["🎧 DJ LUX på Grafen", "Jubileumsgallaen! Treff tonane og lag sømlause overgangar.", () => LUX.dj.start(), true],
      ["🎿 Laussnø-tur", "Køyr pudder, unngå tre.", () => LUX.powder.start("free"), true],
      ["🏔️ Gibberish eller Hallingdal-ord?", "Ekte hallingmål eller berre tull?", hallingOrd, true],
      ["🧔🏽 Hva sa Hadi?", "Forstår du Brønnøysund-dialekt?", hvaSaHadi, true],
      ["🐟 Fisk eller IKEA?", "Svensktime for Adam sin skuld.", fiskEllerIkea, !hungover],
      ["🚑 Redningsaksjon", hungover ? "Anna æ fyllesjuk. Redd ho!" : "Berre på søndagar når Anna æ fyllesjuk.", rescue, hungover],
      ["📱 Jukseøkt", "Bli teken i juks (kapittel 1).", () => LUX.cheat.start(), true],
      ["🧮 Matte-time i Ål", ch >= 2 ? "Undervis matte i Ål." : "🔒 Låsast opp i kapittel 3.", () => LUX.teacher.start(), ch >= 2],
    ];
    for (const [name, desc, fn, enabled] of games) {
      const b = el("button", { class: "mg-menu-item", onclick: () => { close(); fn(); } }, el("b", {}, name), el("small", {}, desc));
      b.disabled = !enabled;
      body.append(b);
    }
  }

  return { menu, hallingOrd, hvaSaHadi, fiskEllerIkea, rescue };
})();
