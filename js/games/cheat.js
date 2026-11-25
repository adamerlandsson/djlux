// 📱 Jukseøkt (chapter 1): HOLD to copy from the AI (button / space) while Professor RipeiSåle writes
// on the board. Once the sheet has enough AI text (the white line on the bar), let him SEE you copy –
// getting caught is exactly the plan. Caught too early = just a warning. Settings: content/story.js
window.LUX = window.LUX || {};

LUX.cheat = (() => {
  const K = LUX.content.cheat;
  const { el, pick, open, close, sprite } = LUX.ui;
  const G = () => LUX.game;

  function start() {
    const g = G();
    g.lock();
    let timer = null, closed = false, holding = false, over = false;
    let t = 0, text = 0, suspicion = 0, prof = "turned", profLeft = 3, lastHint = "";
    const onKey = e => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (!timer && e.type === "keydown" && !over) return begin();
      holding = e.type === "keydown";
    };
    const body = open("📱 Jukseøkt – matematikkdidaktikk", {
      wide: true,
      onClose: () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("keyup", onKey);
        g.unlock();
        g.idleSoon();
      },
    });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);

    // ---------- the how-to card ----------
    body.append(el("div", { class: "ch-intro" },
      el("p", { class: "ch-goal" }, K.intro.goal),
      el("ol", {}, ...K.intro.steps.map(([icon, txt]) => el("li", {}, el("span", {}, icon), txt))),
      el("button", { class: "ch-go", onclick: () => begin() }, "▶ Start prøva (eller SPACE)")));

    function begin() {
      if (timer || over) return;
      body.innerHTML = "";
      build();
    }

    function build() {
      const bar = (label, cls, extra) => el("div", { class: "ch-bar " + cls }, el("span", {}, label), el("div", { class: "mg-timer" }, el("i"), ...(extra || [])));
      const textBar = bar(`🤖 KI-tekst på arket`, "text", [el("b", { class: "ch-need", style: `left:${K.need}%` }), el("em", { class: "ch-need-label", style: `left:${K.need}%` }, "nok")]);
      const susBar = bar("👀 Mistanke (100 % = teken)", "sus");
      const banner = el("div", { class: "ch-banner" });
      const board = el("div", { class: "ch-board" }, el("span", {}, "a² + b² = c²"), el("span", { class: "ch-chalk" }, ""));
      const profFace = el("div", { class: "ch-prof-face" }, LUX.ui.face("assets/sprites/ripeisaale/face.png", "🧑‍🏫", "Professor RipeiSåle"));
      const eyes = el("div", { class: "ch-eyes" }, "👀");
      const profEl = el("div", { class: "ch-prof" }, board, profFace, eyes, el("div", { class: "ch-prof-say" }));
      const anna = el("img", { class: "ch-anna", src: sprite("study"), alt: "Anna" });
      const phone = el("div", { class: "ch-phone" }, el("span", {}, "🤖"), el("small", {}, "KI"));
      const desk = el("div", { class: "ch-desk" }, anna, phone);
      const hold = el("button", { class: "ch-hold" }, "📱 HALD for å kopiere (eller SPACE)");
      const info = el("p", { class: "ch-info" }, "");
      const clock = el("div", { class: "mg-round" });
      body.append(banner, el("div", { class: "df-bars" }, textBar, susBar), clock, el("div", { class: "ch-room" }, profEl, desk), hold, info);
      for (const ev of ["pointerdown", "pointerup", "pointerleave", "pointercancel"]) {
        hold.addEventListener(ev, e => { e.preventDefault(); holding = ev === "pointerdown"; });
      }
      const setPic = p => { if (!anna.src.endsWith(sprite(p))) anna.src = sprite(p); };
      const profSay = s => (profEl.querySelector(".ch-prof-say").textContent = s);
      const rnd = ([a, b]) => a + Math.random() * (b - a);
      let chalk = "";

      function setProf(mode) {
        prof = mode;
        profEl.className = "ch-prof " + mode;
        if (mode === "turned") { profLeft = rnd(K.turnedSeconds); profSay(pick(K.lines.turn)); }
        if (mode === "warn") { profLeft = K.warnSeconds; profSay(pick(K.lines.warn)); LUX.sound.tone(200, 0.2, { vol: 0.06 }); }
        if (mode === "watch") { profLeft = rnd(K.watchSeconds); profSay(pick(K.lines.watch)); }
      }
      profSay(K.lines.start);
      setProf("turned");
      profLeft = 3;

      function finish(kind) {
        over = true;
        clearInterval(timer);
        holding = false;
        hold.remove();
        banner.remove();
        const ok = kind === "caught";
        info.textContent = K.lines[kind];
        info.className = "ch-info " + (ok ? "win" : "fail");
        if (ok) {
          g.stat("cheatPassed");
          g.achieve("Teken i juks");
          profSay(pick(K.lines.seen));
          g.say("JA! Han såg det! Han såg ALT! Planen fungerer!", "excited");
          LUX.sound.jingle();
        } else {
          g.say(kind === "tooEarly" ? "Nei! For tidleg! Han trur e berre sat på mobilen..." : "Tida ute. E leverte ein heilt vanleg prøve. Katastrofe.", "sad");
        }
        body.append(el("div", { class: "ch-after" },
          ok ? el("button", { onclick: () => { close(); LUX.story.run("boss:ripeisaale"); } }, "🎓 Vidare: møt Professor RipeiSåle")
            : el("button", { onclick: () => { close(); start(); } }, "🔁 Prøv igjen"),
          el("button", { onclick: () => close() }, "Lukk")));
        g.save();
      }

      timer = setInterval(() => {
        if (over || closed) return;
        const dt = 0.05;
        t += dt;
        profLeft -= dt;
        if (profLeft <= 0) setProf(prof === "turned" ? "warn" : prof === "warn" ? "watch" : "turned");
        const seen = holding && prof === "watch";
        const enough = text >= K.need;
        if (holding) {
          text = Math.min(100, text + K.copyPerSecond * dt);
          phone.classList.add("on");
          setPic(seen ? "shocked" : "guilty");
          if (seen) suspicion += K.suspicionPerSecond * dt;
          if (Math.random() < 0.02) info.textContent = pick(K.lines.copying);
        } else {
          phone.classList.remove("on");
          setPic("study");
          suspicion = Math.max(0, suspicion - K.calmPerSecond * dt);
        }
        if (prof === "turned" && holding && Math.random() < 0.15) { chalk = (chalk + pick(["∫", "x", "+", "²", "=", "√", "π", "Δ"])).slice(-14); board.lastChild.textContent = chalk; }
        // the banner: what to do RIGHT NOW
        let hint, cls;
        if (enough) {
          hint = seen ? K.banner.readySeen : prof === "watch" ? K.banner.ready : K.banner.readyTurned;
          cls = seen ? "go" : "ready";
        } else if (prof === "turned") { hint = K.banner.turned; cls = "go"; }
        else if (prof === "warn") { hint = K.banner.warn; cls = "warn"; }
        else { hint = seen ? K.banner.watchSeen : K.banner.watch; cls = seen ? "stop flash" : "stop"; }
        if (hint !== lastHint) { banner.textContent = hint; banner.className = "ch-banner " + cls; lastHint = hint; }
        hold.classList.toggle("active", holding);
        textBar.querySelector("i").style.width = text + "%";
        textBar.classList.toggle("ok", enough);
        susBar.querySelector("i").style.width = Math.min(100, suspicion) + "%";
        clock.textContent = `⏱ ${Math.max(0, Math.ceil(K.seconds - t))} s`;
        if (suspicion >= 100) finish(enough ? "caught" : "tooEarly");
        else if (t >= K.seconds) finish("timeout");
      }, 50);
    }
  }

  return { start };
})();
