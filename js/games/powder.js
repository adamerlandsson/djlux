// Pudderkjøring: Anna skis down the mountain – steer (mouse / finger / arrow keys) to collect ❄️ powder
// and avoid trees and rocks. Japan mode: the van Takeshi breaks down – pick the right tool fast.
// Settings: content/story.js → LUX.content.powder
window.LUX = window.LUX || {};

LUX.powder = (() => {
  const P = LUX.content.powder;
  const { el, pick, shuffle, sleep, sprite } = LUX.ui;
  const G = () => LUX.game;
  let running = false;

  function weighted(items) {
    let r = Math.random() * items.reduce((a, b) => a + b.weight, 0);
    for (const it of items) if ((r -= it.weight) <= 0) return it;
    return items[0];
  }

  async function start(modeId = "free") {
    if (running) return;
    running = true;
    const mode = P.modes[modeId] || P.modes.free;
    const g = G(), S = g.state;
    g.lock();
    g.setActivity("ski");
    LUX.scene.setMountain(modeId);
    g.say(pick(P.lines.start), "skiing");
    LUX.sound.whoosh();
    await sleep(1600);

    const layer = document.querySelector("#game-layer");
    const stage = document.querySelector("#stage");
    layer.innerHTML = "";
    layer.classList.remove("hidden");
    stage.classList.add("ski-on");
    const skier = el("img", { class: "pw-skier", src: sprite("ski"), alt: "Anna" });
    skier.onerror = () => (skier.src = sprite("base"));
    const hud = el("div", { class: "ps-hud" });
    const quit = el("button", { class: "fg-quit" }, "✖ Avslutt");
    const vanBox = el("div", { class: "pw-van hidden" });
    layer.append(el("div", { class: "pw-title" }, `${mode.title} · ${mode.place}`), hud, skier, vanBox, quit);

    let x = 50, target = 50, keys = { left: false, right: false }, quitting = false;
    quit.addEventListener("click", () => (quitting = true));
    const onMove = e => {
      if (e.target.closest(".pw-van, .fg-quit")) return;
      const r = layer.getBoundingClientRect();
      target = Math.max(6, Math.min(94, (e.clientX - r.left) / r.width * 100));
    };
    const onKey = e => {
      const k = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" }[e.code];
      if (!k) return;
      e.preventDefault();
      keys[k] = e.type === "keydown";
    };
    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerdown", onMove);
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);

    const live = [];
    let t = 0, powder = 0, crashes = 0, fixes = 0, fails = 0, spawnIn = 0, stunned = 0;
    let vanAt = mode.van ? P.vanEvery[0] + Math.random() * (P.vanEvery[1] - P.vanEvery[0]) : Infinity;
    let van = null; // { problem, left }

    function pop(text, px, cls = "") {
      const p = el("div", { class: "ps-pop " + cls }, text);
      p.style.left = px + "%";
      layer.append(p);
      setTimeout(() => p.remove(), 700);
    }

    function startVan() {
      const prob = pick(P.vanProblems);
      van = { prob, left: P.vanSeconds };
      LUX.sound.engine();
      vanBox.innerHTML = "";
      const opts = shuffle([prob.fix, ...prob.wrong]);
      vanBox.append(el("b", {}, prob.text), el("div", { class: "mg-timer" }, el("i")),
        el("div", { class: "pw-tools" }, ...opts.map(o => el("button", { onclick: () => endVan(o === prob.fix) }, o))));
      vanBox.classList.remove("hidden");
      g.say("TAKESHI! Ikkje no!", "shocked", { log: false });
    }

    function endVan(ok) {
      if (!van) return;
      van = null;
      vanBox.classList.add("hidden");
      if (ok) { fixes++; g.say(pick(P.lines.vanFixed), "proud", { log: false }); LUX.sound.jingle(); }
      else { fails++; powder = Math.max(0, powder - 8); g.say(pick(P.lines.vanFailed), "sad", { log: false }); LUX.sound.engine(); }
      vanAt = t + P.vanEvery[0] + Math.random() * (P.vanEvery[1] - P.vanEvery[0]);
    }

    await new Promise(done => {
      let last = performance.now();
      function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (quitting) return done();
        if (van) {
          van.left -= dt;
          vanBox.querySelector("i").style.width = Math.max(0, van.left / P.vanSeconds * 100) + "%";
          if (van.left <= 0) endVan(false);
          renderHud();
          return requestAnimationFrame(frame);
        }
        t += dt;
        if (t >= vanAt) startVan();
        // steer
        if (keys.left) target = Math.max(6, target - 90 * dt);
        if (keys.right) target = Math.min(94, target + 90 * dt);
        if (stunned > 0) stunned -= dt;
        else x += (target - x) * Math.min(1, dt * 8);
        skier.style.left = x + "%";
        skier.style.transform = `translateX(-50%) rotate(${(target - x) * 0.6}deg)`;
        // spawn
        spawnIn -= dt;
        if (spawnIn <= 0 && t < P.seconds) {
          spawnIn = 0.28 / (mode.more || 1);
          const it = weighted(P.items);
          const o = { ...it, x: 5 + Math.random() * 90, y: -6, el: el("div", { class: "pw-item" }, it.emoji) };
          layer.append(o.el);
          live.push(o);
        }
        // move things up the screen (we ski down), collide with the skier at ~78 %
        const speed = 34 + Math.min(30, t * 0.8);
        for (const o of [...live]) {
          o.y += speed * dt;
          o.el.style.left = o.x + "%";
          o.el.style.top = o.y + "%";
          if (o.y > 72 && o.y < 84 && Math.abs(o.x - x) < 5.5 && !o.hit) {
            o.hit = true;
            remove(o);
            if (o.kind === "powder") { powder += o.points; pop(`+${o.points} ❄️`, o.x); if (o.points > 1) LUX.sound.whoosh(); }
            else if (o.kind === "bonus") { powder += 5; pop("🍜 +5", o.x); g.say(o.line, "excited", { log: false }); }
            else {
              crashes++; powder = Math.max(0, powder - P.crashPenalty); stunned = 0.6;
              pop(`−${P.crashPenalty}`, o.x, "bad"); LUX.sound.crash();
              skier.classList.remove("crash"); void skier.offsetWidth; skier.classList.add("crash");
              if (Math.random() < 0.5) g.say(pick(P.lines.crash), "shocked", { log: false });
            }
          } else if (o.y > 106) remove(o);
        }
        renderHud();
        if (t >= P.seconds && !live.length) return done();
        requestAnimationFrame(frame);
      }
      function remove(o) { o.el.remove(); live.splice(live.indexOf(o), 1); }
      requestAnimationFrame(frame);
    });

    function renderHud() {
      hud.textContent = `❄️ ${powder}  ·  💥 ${crashes}` + (mode.van ? `  ·  🔧 ${fixes}` : "") + `  ·  ⏱ ${Math.max(0, Math.ceil(P.seconds - t))}`;
    }

    layer.removeEventListener("pointermove", onMove);
    layer.removeEventListener("pointerdown", onMove);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("keyup", onKey);
    layer.innerHTML = "";
    layer.classList.add("hidden");
    stage.classList.remove("ski-on");
    g.setActivity(null);
    running = false;

    if (quitting) { g.say("Ferdig for i dag. Beina mine...", "sleepy"); g.unlock(); return; }
    const statName = { japan: "powderJapan", al: "powderAl" }[modeId] || "powderFree";
    g.stat(statName, powder);
    if (fixes) g.stat("vanFixes", fixes);
    g.stat("skiRuns");
    S.mood = Math.min(100, S.mood + Math.min(30, powder / 3));
    S.festlyst = Math.max(0, S.festlyst - 15);
    const coins = g.addCoins(Math.round(powder / 2));
    const drop = powder >= 60 && Math.random() < 0.5 ? g.collect(LUX.shop.randomDrop(powder >= 100 ? 1 : 0)) : null;
    if (powder >= 100) g.achieve("Laussnø te pungen");
    if (crashes === 0 && powder > 20) g.achieve("Ingen tre i dag");
    g.toast(`🎿 ${powder} ❄️  ·  +${coins} 🪙` + (drop ? `  ·  ${drop.item.name}` : ""));
    g.say(powder >= 80 ? P.lines.end.great : powder >= 35 ? P.lines.end.ok : P.lines.end.bad, powder >= 35 ? "excited" : "sad");
    g.unlock();
    g.renderAll();
    g.save();
  }

  return { start };
})();
