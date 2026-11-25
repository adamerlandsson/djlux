// Adam: the "🇸🇪 Spør om Adam" question menu, Adam texting her (you pick the reply), and Adam
// knocking on the window when the ADAM-O-METER is high. Content: content/adam.js
window.LUX = window.LUX || {};

LUX.adam = (() => {
  const A = LUX.content.adam;
  const { el, pick, open, close, sleep, shuffle } = LUX.ui;
  const G = () => LUX.game;
  let phone = null, busy = false;

  const level = (v = G().state.adam) => (v >= A.levels.smitten ? "smitten" : v >= A.levels.open ? "open" : "shy");
  const LEVEL_TEXT = { shy: "🙊 «Vi snakkar ikkje om det»", open: "🙂 Ho opnar seg litt", smitten: "😍 Heilt forelska (men seier det ikkje)" };
  const EXPR = { shy: "guilty", open: "happy", smitten: "dreamy" };

  function apply(effects = {}) {
    const g = G();
    for (const [k, v] of Object.entries(effects)) k === "adam" ? (v > 0 ? g.adam(v) : g.change("adam", v * 8)) : g.change(k, v);
  }

  const free = () => !busy && !G().isLocked() && !G().isBusy();
  const home = () => ["home", "sofa", "hungover"].includes(G().context);

  function init() {
    const stage = document.querySelector("#stage");
    phone = el("div", { class: "ad-phone hidden" });
    stage.append(phone);
    loop(A.texts.everySeconds, () => G().state.adam >= A.texts.minMeter && G().context !== "asleep" && text());
    loop(A.visit.everySeconds, () => G().state.adam >= A.visit.minMeter && home() && !LUX.people.guest() && visit());
  }

  async function loop([a, b], fn) {
    await sleep((a + Math.random() * (b - a)) * 1000);
    try { if (free()) await fn(); } catch (e) { console.warn("adam", e); }
    loop([a, b], fn);
  }

  // ---------- the question menu ----------
  function menu() {
    const g = G(), lv = level();
    const body = open("🇸🇪 Spør om Adam");
    body.append(
      el("p", { class: "ad-status" }, `ADAM-O-METER ${Math.round(g.state.adam)} %  ·  ${LEVEL_TEXT[lv]}`),
      el("p", { class: "ad-hint" }, lv === "shy" ? "Jo meir de snakkar om Adam (og jo fleire meldingar ho får), jo meir opnar ho seg..." : lv === "open" ? "Ho fortel meir no. Kanskje for mykje." : "Ho klarar ikkje å slutte å smile."));
    for (const q of A.questions) {
      body.append(el("button", { class: "mg-menu-item", onclick: () => { close(); ask(q); } }, el("b", {}, q.q)));
    }
  }

  async function ask(q) {
    const g = G();
    g.log("you", "Du: " + q.q);
    if (q.text) return text(true);
    const lv = level();
    g.say(pick(q[lv]), EXPR[lv]);
    apply(q.effects);
    if (lv !== "shy" && Math.random() < 0.35) {
      await sleep(4500);
      if (!g.isBusy() && !g.isLocked()) g.say(pick(A.stories), "dreamy");
    }
    if (q.emma && lv !== "shy" && home()) setTimeout(() => LUX.people.roommate("emma", true), 5000);
    g.save();
  }

  // ---------- Adam texts ----------
  async function text(force) {
    if (busy || (!force && !free())) return;
    busy = true;
    const g = G();
    g.lock();
    const msg = pick(A.texts.messages);
    LUX.sound.ring();
    g.say(pick(["*mobilen surrar* ...det æ Adam.", "📱 Ny melding! ...frå Adam. *raudnar*", "Å nei. Å JA. Det æ Adam."]), "shocked");
    await sleep(1600);
    phone.innerHTML = "";
    const chat = el("div", { class: "ad-chat" }, el("div", { class: "ad-msg them" }, msg.from));
    const buttons = el("div", { class: "ad-replies" });
    phone.append(el("div", { class: "ad-head" }, "📱 Adam 🇸🇪"), chat, buttons);
    phone.classList.remove("hidden");
    g.setExpression("dreamy");
    const choice = await new Promise(resolve => {
      for (const r of shuffle(msg.replies)) buttons.append(el("button", { onclick: () => resolve(r) }, r.text));
      setTimeout(() => resolve(null), 25000);
    });
    buttons.innerHTML = "";
    if (choice) {
      chat.append(el("div", { class: "ad-msg me" }, choice.text));
      g.say(choice.line, level() === "shy" ? "guilty" : "dreamy");
      apply(choice.effects);
      g.stat("adamTexts");
      await sleep(2200);
      chat.append(el("div", { class: "ad-msg them typing" }, "..."));
      await sleep(1300);
      chat.lastChild.remove();
      chat.append(el("div", { class: "ad-msg them" }, choice.reply));
      LUX.sound.blip(900);
      if ((g.state.stats.adamTexts || 0) >= 5) g.achieve("Svenske meldingar");
    } else {
      chat.append(el("div", { class: "ad-msg seen" }, "Lest 23:14"));
      g.say("Eg... visste ikkje kå e skulle svare. No har han sett at e har lest det. Uff.", "guilty");
    }
    await sleep(3000);
    phone.classList.add("hidden");
    busy = false;
    g.unlock();
    g.idleSoon();
    g.save();
  }

  // ---------- Adam at the window ----------
  async function visit() {
    if (busy || !free()) return;
    busy = true;
    const g = G(), V = A.visit;
    g.lock();
    await LUX.people.windowFace(LUX.ui.face("assets/sprites/adam/face.png", "🧔🏼", "Adam"), pick(V.knock));
    LUX.people.talk("Adam 🇸🇪", pick(V.hello), "#2a64b8");
    await sleep(2600);
    const asleep = g.context === "asleep";
    g.say(asleep ? pick(LUX.content.window.asleepReacts) : pick(V.annaReacts), asleep ? null : "shocked");
    await sleep(2200);
    // he can only come in when Anna is in the living room and nobody else is visiting
    const canEnter = ["home", "sofa", "hungover", "vors"].includes(g.context) && !LUX.people.guest();
    const options = canEnter ? V.choices : V.choices.slice(1);
    const picked = await LUX.people.choose(options.map(c => c.text), 20000);
    const choice = picked < 0 ? -1 : V.choices.indexOf(options[picked]);
    const c = V.choices[choice] || V.choices[2];
    g.say(c.line, c.effects.adam > 0 ? "dreamy" : "guilty");
    apply(c.effects);
    await sleep(2400);
    LUX.people.talk("Adam 🇸🇪", c.adam, "#2a64b8");
    g.stat("adamVisits");
    g.achieve("Adam i vindauget");
    await sleep(2600);
    await LUX.people.windowFace(null);
    LUX.people.hush();
    busy = false;
    g.unlock();
    if (choice === 0) LUX.people.enterGuest("adam");        // he comes into the living room
    if (c.emma) setTimeout(() => LUX.people.peekSay("emma", pick(V.emma)), 1200);
    g.idleSoon();
    g.save();
  }

  return { init, menu, text, visit, level, mention: () => pick(A.mentions[level()]) };
})();
