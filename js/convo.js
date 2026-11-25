// Conversations with a guest in the living room (Hadi, Jenny, Idunn, Hennie or Adam).
// While a guest is in, what you type in the chat goes to both of them, and they answer in turn.
// "💬 Prat" makes them start a little conversation by themselves.
// Claude brain: bridge /api/convo writes the lines freely. Offline: content/convo.js.
window.LUX = window.LUX || {};

LUX.convo = (() => {
  const C = LUX.content;
  const { el, pick, sleep, fill } = LUX.ui;
  const G = () => LUX.game;
  let running = false, bar = null;
  const recent = {};        // topics used lately per guest (so 💬 Prat doesn't repeat itself)

  const factLine = text => text.replace(/@fact/g, () => {
    const f = pick(C.hadiFacts);
    document.querySelector("#fact").textContent = "🧔🏽 Fersk Hadi-fakta: " + f;
    return f;
  });

  // same matching as the offline brain: short keywords = whole words, longer ones = prefixes, phrases = substring
  function matches(message, keyword) {
    const m = message.toLowerCase();
    if (keyword.includes(" ")) return m.includes(keyword);
    const words = m.split(/[^a-zæøåäö0-9]+/);
    return words.some(w => (keyword.length <= 3 ? w === keyword : w.startsWith(keyword)));
  }

  async function offline(id, message) {
    const cv = C.convo[id];
    if (!message) {
      const used = recent[id] || (recent[id] = []);
      let options = cv.topics.filter((_, i) => !used.includes(i));
      if (!options.length) { used.length = 0; options = cv.topics; }
      const topic = pick(options);
      used.push(cv.topics.indexOf(topic));
      return topic;
    }
    const rule = cv.reactions.find(r => r.keywords.some(k => matches(message, k)));
    if (rule) return rule.lines;
    // nothing special for the guest: the guest says something in character, and Anna answers the player
    // like she normally would (the offline brain), so the reply still fits what you wrote
    const guestLine = pick(cv.fallback)[0];
    try {
      const r = await LUX.ScriptedBrain.reply({ message, events: [], state: G().brainState() });
      return [guestLine, ["anna", r.text, r.expression]];
    } catch {
      return pick(cv.fallback);
    }
  }

  async function claude(id, message) {
    const r = await fetch("/api/convo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guest: id, message, state: G().brainState() }),
    });
    if (!r.ok) throw new Error("bridge said " + r.status);
    const data = await r.json();
    return (data.lines || []).map(l => [l.who === "anna" ? "anna" : "guest", l.text, l.expression]);
  }

  async function playLines(id, lines) {
    const g = G();
    for (const [who, text0, expr] of lines) {
      if (LUX.people.guest() !== id) return;          // they left in the middle
      const text = factLine(text0);
      if (who === "guest") {
        LUX.people.guestSay(text);
        if (id === "adam") g.setExpression("dreamy");
        await sleep(Math.max(2000, text.length * 55));
      } else {
        await g.sayWait(text, expr || (id === "adam" ? "dreamy" : "happy"));
        await sleep(900);
      }
    }
  }

  // message = what the player typed, or null for "💬 Prat"
  async function talk(message) {
    const g = G(), id = LUX.people.guest();
    if (!id || running || g.isBusy() || g.isLocked()) return false;
    running = true;
    g.lock();
    setBar();
    LUX.people.extendGuest();
    let lines = null;
    if (g.usingClaude()) {
      try { lines = await claude(id, message); } catch (e) {
        console.warn("convo: Claude failed", e);
        g.log("sys", "(Claude-hjernen svarte ikkje – brukar offline-hjernen)");
      }
    }
    if (!lines || !lines.length) lines = await offline(id, message);
    try { await playLines(id, lines); } catch (e) { console.warn("convo", e); }
    // a little effect on the meters
    if (id === "adam") g.adam(0.5);
    g.change("mood", 3);
    g.stat("convo_" + id);
    if ((g.state.stats["convo_" + id] || 0) >= 5) g.achieve(`Djup samtale med ${C.guests[id].name.split(" ")[0]}`);
    running = false;
    g.unlock();
    setBar();
    g.idleSoon();
    return true;
  }

  // ---------- the little bar under the guest + the chat placeholder ----------
  function attach(id, pos) {
    detach();
    const U = C.convo.ui, name = C.guests[id].name;
    bar = el("div", { class: "guest-bar" },
      el("button", { onclick: () => talk(null) }, U.talk),
      el("button", { onclick: () => !running && LUX.people.leaveGuest() }, U.bye));
    Object.assign(bar.style, { left: pos.left, bottom: `calc(${pos.bottom} + 1%)` });
    document.querySelector("#stage").append(bar);
    document.querySelector("#msg").placeholder = fill(U.placeholder, { name: name.replace(/ 🇸🇪$/, "") });
    setBar();
  }
  function detach() {
    bar?.remove();
    bar = null;
    document.querySelector("#msg").placeholder = "Sei noko til Anna...";
  }
  function setBar() {
    if (!bar) return;
    const off = running || G().isLocked() || G().isBusy();
    for (const b of bar.querySelectorAll("button")) b.disabled = off;
  }
  setInterval(setBar, 500);

  return { talk, attach, detach, isTalking: () => running };
})();
