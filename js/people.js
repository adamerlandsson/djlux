// The people around Anna: roommates shouting from their rooms, Hadi, Jenny, Idunn and Hennie in the window,
// and the Molde folkehøgskule gang at Saturday vors. Content: content/people.js
window.LUX = window.LUX || {};

LUX.people = (() => {
  const C = LUX.content;
  const H = C.house;
  const { el, pick, sleep } = LUX.ui;
  const G = () => LUX.game;
  let bubble, box, face, active = false;
  const doors = {};

  function init() {
    const stage = document.querySelector("#stage");
    bubble = el("div", { class: "pp-bubble hidden" });
    face = el("div", { class: "pp-face" });
    box = el("div", { class: "pp-window hidden" }, face, el("div", { class: "pp-glass" }));
    Object.assign(box.style, H.window);
    stage.append(box, bubble);
    face.addEventListener("click", () => active && G().say(pick(["Hei! Kom inn!", "Ikkje stå der ute og frys!"]), "excited"));
    // the roommates' doors: a dark gap + a head that leans out (assets/sprites/<name>/face.png)
    for (const [id, pos] of Object.entries(H.doors || {})) {
      const peek = el("div", { class: "rm-peek" }, LUX.ui.face(`assets/sprites/${id}/face.png`, "🙂", id, "face"));
      const door = el("div", { class: "rm-door" }, el("div", { class: "rm-gap" }), peek);
      Object.assign(door.style, pos);
      peek.addEventListener("click", () => { if (doors[id].classList.contains("out")) LUX.sound.blip(700); });
      doors[id] = door;
      stage.append(door);
    }
    loop("roommates", C.roommates, () => randomRoommate());
    loop("window", C.window, () => visit());
    loop("vors", C.vorsGuests, () => vorsChatter(), true);
  }

  const home = () => ["home", "sofa", "hungover", "vors"].includes(G().context);
  const free = () => !active && !G().isLocked() && !G().isBusy();
  const canVisit = () => free() && !guest && ["home", "sofa", "hungover"].includes(G().context);

  async function loop(name, cfg, fn, always) {
    const [a, b] = cfg.everySeconds;
    await sleep((a + Math.random() * (b - a)) * 1000);
    try { if (always || Math.random() < cfg.chance) await fn(); } catch (e) { console.warn(name, e); }
    loop(name, cfg, fn, always);
  }

  // a name-tagged speech bubble for someone who isn't Anna
  function talk(name, text, color, pos = H.roommateBubble) {
    bubble.className = "pp-bubble";
    bubble.style.cssText = "";
    Object.assign(bubble.style, pos);
    bubble.style.borderColor = color || "#8a7a5a";
    bubble.innerHTML = "";
    if (name) bubble.append(el("b", {}, name + ": "));
    bubble.append(text);
    G().log("sys", name ? `${name}: ${text}` : text);
  }
  const hush = () => bubble.classList.add("hidden");

  // ---------- roommates ----------
  function randomRoommate() {
    if (!free() || !home() || G().context === "vors") return;
    const ids = Object.keys(C.roommates.people).filter(id => !C.roommates.people[id].adamOnly || G().state.adam >= 50);
    return roommate(pick(ids));
  }

  // open the door a crack and lean out (on = true) / back in and close (on = false)
  async function peek(id, on) {
    const d = doors[id];
    if (!d) return;
    if (on) {
      d.classList.add("open");
      LUX.sound.creak?.();
      await sleep(60);
      d.classList.add("out");
    } else {
      d.classList.remove("out");
      await sleep(500);
      d.classList.remove("open");
    }
  }

  // a line from a roommate, peeking out of her door
  async function peekSay(id, line, ms = 3500) {
    const p = C.roommates.people[id];
    const pos = H.doors?.[id];
    peek(id, true);
    await sleep(350);
    talk(p ? p.name : id, line, p?.color, pos ? { left: pos.left, top: "9%" } : H.roommateBubble);
    await sleep(ms);
    hush();
    peek(id, false);
  }

  async function roommate(id, force) {
    const p = C.roommates.people[id];
    if (!p || active || (!force && !free())) return;
    if (G().context === "asleep") return;
    active = true;
    const g = G();
    g.lock();
    const pos = H.doors?.[id];
    peek(id, true);
    LUX.sound.knock();
    await sleep(350);
    talk(p.name, pick(p.lines), p.color, pos ? { left: pos.left, top: "9%" } : H.roommateBubble);
    await sleep(3200);
    g.say(pick(p.reply), id === "emma" ? "guilty" : ["hungover", "sofa"].includes(g.context) ? "hungover" : "happy");
    for (const [k, v] of Object.entries(p.effects || {})) k === "adam" ? g.adam(v) : g.change(k, v);
    await sleep(2600);
    hush();
    peek(id, false);
    active = false;
    g.unlock();
    g.idleSoon();
  }

  // ---------- Hadi / Jenny in the window ----------
  async function visit(id) {
    if (!canVisit() && !id) return;
    if (active) return;
    const g = G(), S = g.state;
    id = id || pick(Object.keys(C.window.visitors));
    const v = C.window.visitors[id];
    active = true;
    g.lock();
    // face: the picture if it exists, otherwise an emoji
    face.innerHTML = "";
    face.append(LUX.ui.face(v.image, v.emoji, v.name));
    box.classList.remove("hidden");
    face.style.transition = "none";
    face.style.top = "100%";
    LUX.sound.knock();
    talk(v.name, pick(v.knock), "#e8c34a", H.windowBubble);
    await sleep(1200);
    face.style.transition = "top 1.4s ease-out";
    face.style.top = "8%";
    await sleep(1500);
    const asleep = g.context === "asleep";
    g.say(asleep ? pick(C.window.asleepReacts) : pick(v.annaReacts), asleep ? null : v.face || "excited");
    if (v.dialekt) g.change("dialekt", v.dialekt);
    await sleep(2200);

    const worried = g.context === "hungover" || S.festlyst > 85;
    if (id === "jenny" && worried) {
      talk(v.name, pick(v.care), "#e86a9a", H.windowBubble);
      await sleep(3600);
      g.say(pick(v.annaCared), "guilty");
      g.change("mood", 20);
      g.achieve("Jenny passar på");
    } else {
      const [line, answer] = [].concat(pick(v.lines));     // a line, or [line, Anna's answer]
      talk(v.name, line, "#e8c34a", H.windowBubble);
      await sleep(3400);
      if (id === "hadi") {
        const fact = pick(C.hadiFacts);
        talk(v.name, `${v.factIntro} ${fact}`, "#e8c34a", H.windowBubble);
        document.querySelector("#fact").textContent = "🧔🏽 Fersk Hadi-fakta: " + fact;
        await sleep(4200);
        g.say(pick(["HADI! Det visste e ikkje!", "Kor får du alt dette frå?!", "E ska bruke den på quiz på torsdag!"]), "excited");
        S.hadiVisits = (S.hadiVisits || 0) + 1;
        if (S.hadiVisits >= 3) g.achieve("Hadi-fakta-samlar");
      } else {
        g.say(answer || pick(v.annaAfter || ["Hihi!"]), v.face || "happy");
      }
    }
    for (const [k, n] of Object.entries(v.effects || {})) g.change(k, n);
    await sleep(1800);
    // let them in?
    const comeIn = !guest && C.guests[id] && HOME.includes(g.context)
      ? (await choose([`🚪 Kom inn, ${v.name}!`, "👋 Ha det!"], 15000)) === 0 : false;
    if (comeIn) talk(v.name, pick(v.comeIn || ["Eg kjem inn!"]), "#e8c34a", H.windowBubble);
    else talk(v.name, pick(v.bye), "#e8c34a", H.windowBubble);
    await sleep(1800);
    face.style.transition = "top 1.2s ease-in";
    face.style.top = "100%";
    await sleep(1300);
    box.classList.add("hidden");
    hush();
    active = false;
    g.unlock();
    if (comeIn) enterGuest(id);
    g.idleSoon();
  }

  // =================================================================
  //  GUESTS IN THE LIVING ROOM (content/people.js → guests)
  // =================================================================
  let guest = null;
  const HOME = ["home", "sofa", "hungover", "vors"];
  const fillFact = line => line.replace("@fact", () => {
    const f = pick(C.hadiFacts);
    document.querySelector("#fact").textContent = "🧔🏽 Fersk Hadi-fakta: " + f;
    return f;
  });

  function guestSay(text) {
    if (!guest) return;
    const gs = C.guests[guest.id];
    guest.bubble.innerHTML = "";
    guest.bubble.append(el("b", {}, gs.name + ": "), text);
    guest.bubble.classList.remove("hidden");
    guest.bubble.style.borderColor = gs.color;
    G().log("sys", `${gs.name}: ${text}`);
    clearTimeout(guest.hushTimer);
    guest.hushTimer = setTimeout(() => guest && guest.bubble.classList.add("hidden"), Math.max(3500, text.length * 70));
  }

  async function enterGuest(id) {
    const gs = C.guests[id];
    if (!gs || guest || !HOME.includes(G().context)) return;
    const g = G(), stage = document.querySelector("#stage");
    const wrap = el("div", { class: "guest enter" }, LUX.ui.face(`assets/sprites/${id}/full.png`, "🙂", gs.name, "full"));
    Object.assign(wrap.style, gs.pos);
    const bubble = el("div", { class: "guest-bubble hidden" });
    Object.assign(bubble.style, { left: `calc(${gs.pos.left} - 8%)`, bottom: `calc(${gs.pos.bottom} + ${gs.pos.height} + 1%)` });
    stage.append(wrap, bubble);
    guest = { id, wrap, bubble, until: Date.now() + C.guests.staySeconds * 1000 };
    LUX.convo.attach(id, gs.pos);
    wrap.firstChild.addEventListener("click", () => {
      if (!guest || g.isLocked()) return;
      guestSay(fillFact(pick(gs.poked)));
    });
    for (const [k, n] of Object.entries(gs.effects || {})) k === "adam" ? g.adam(n) : g.change(k, n);
    g.stat("guests_" + id);
    g.achieve(`${gs.name.split(" ")[0]} på besøk`);
    LUX.sound.knock();
    await sleep(900);
    guestSay(pick(gs.enter));
    await sleep(2600);
    if (!g.isBusy() && !g.isLocked()) g.say(pick(gs.anna), gs.face || (id === "adam" ? "dreamy" : "excited"));
    if (id === "adam" && gs.emma) setTimeout(() => guest?.id === "adam" && peekSay("emma", pick(gs.emma).replace(/^Emma \(frå rommet\): /, "")), 7000);
    chatLoop();
  }

  async function chatLoop() {
    const [a, b] = C.guests.chatSeconds;
    await sleep((a + Math.random() * (b - a)) * 1000);
    if (!guest) return;
    const g = G(), gs = C.guests[guest.id];
    if (Date.now() > guest.until) return leaveGuest();
    if (!g.isLocked() && !g.isBusy() && !active && !LUX.convo.isTalking()) {
      // lines for the situation (hungover Sunday, vors, the sofa) half the time, otherwise the normal ones
      const special = gs[g.context];
      const lines = special && (g.context === "hungover" || Math.random() < 0.5) ? special : gs.chat;
      guestSay(fillFact(pick(lines)));
      await sleep(3000);
      if (guest && !g.isLocked() && !g.isBusy() && Math.random() < 0.7) g.say(pick(gs.anna), gs.face || (guest.id === "adam" ? "dreamy" : "happy"));
    }
    chatLoop();
  }

  async function leaveGuest(quiet) {
    if (!guest) return;
    const gl = guest;
    guest = null;
    LUX.convo.detach();
    if (!quiet) {
      guest = gl; guestSay(pick(C.guests[gl.id].leave)); guest = null;
      await sleep(2200);
    }
    gl.wrap.classList.remove("enter");
    gl.wrap.classList.add("leave");
    gl.bubble.remove();
    setTimeout(() => gl.wrap.remove(), 900);
  }

  // Anna leaves the house (DJ, ski, school...) → the guest goes home quietly
  setInterval(() => { if (guest && !HOME.includes(G().context)) leaveGuest(true); }, 1000);

  // ---------- clicking the window: Hadi, Jenny, Idunn, Hennie or Adam is always outside ----------
  function windowClick() {
    const g = G();
    if (active || g.isLocked() || g.isBusy()) return false;
    const ids = [...Object.keys(C.window.visitors), "adam"].filter(id => id !== guest?.id);
    const id = pick(ids);
    if (id === "adam") LUX.adam.visit(true);
    else visit(id);
    return true;
  }

  // the guest stays longer while you talk to them
  const extendGuest = (s = 90) => { if (guest) guest.until = Math.max(guest.until, Date.now() + s * 1000); };

  // ---------- vors chatter ----------
  async function vorsChatter() {
    if (G().context !== "vors" || !free()) return;
    const g = G();
    const guest = pick(C.vorsGuests.guests);
    active = true;
    talk(`${guest.name} (${guest.from})`, fillFact(pick(guest.lines)), "#c45ad9", { left: "4%", top: "30%" });
    await sleep(3000);
    if (guest.dialekt) g.change("dialekt", guest.dialekt);
    if (!g.isBusy() && !g.isLocked()) g.say(pick(guest.anna), guest.face || (guest.dialekt < -10 ? "shy" : "party"));
    await sleep(2500);
    hush();
    active = false;
  }

  // ---------- helpers other modules use (js/adam.js) ----------
  // show a face rising in the window (faceEl) or hide it (null)
  async function windowFace(faceEl, knock) {
    if (faceEl) {
      face.innerHTML = "";
      face.append(faceEl);
      box.classList.remove("hidden");
      face.style.transition = "none";
      face.style.top = "100%";
      LUX.sound.knock();
      if (knock) talk("", knock, "#e8c34a", H.windowBubble);
      await sleep(1200);
      face.style.transition = "top 1.4s ease-out";
      face.style.top = "8%";
      await sleep(1500);
    } else {
      face.style.transition = "top 1.2s ease-in";
      face.style.top = "100%";
      await sleep(1300);
      box.classList.add("hidden");
    }
  }

  // buttons under the window; resolves with the chosen index (or -1 on timeout)
  function choose(labels, ms = 20000) {
    return new Promise(resolve => {
      const row = el("div", { class: "pp-choice" });
      Object.assign(row.style, H.windowChoice);
      let done = false;
      const finish = i => { if (done) return; done = true; row.remove(); resolve(i); };
      labels.forEach((l, i) => row.append(el("button", { onclick: () => finish(i) }, l)));
      document.querySelector("#stage").append(row);
      setTimeout(() => finish(-1), ms);
    });
  }

  // a quick line from someone off-screen
  async function say(name, line, color) {
    talk(name, line, color);
    await sleep(3500);
    hush();
  }

  return { init, roommate, visit, home, canVisit, windowFace, choose, talk: (n, t, c) => talk(n, t, c, H.windowBubble), hush, say,
    enterGuest, leaveGuest, guest: () => guest?.id || null, peek, peekSay, guestSay, windowClick, extendGuest };
})();
