// Planen (📚 Skule): the chapters, their goals and the games that start from them.
window.LUX = window.LUX || {};

LUX.story = (() => {
  const C = LUX.content;
  const T = C.story;
  const { el, open, close, sleep } = LUX.ui;
  const G = () => LUX.game;

  // every stat a goal can check lives in state.stats (games call LUX.game.stat(name))
  const value = stat => G().state.stats[stat] || 0;
  const chapter = () => T.chapters[G().state.chapter];
  const goalValue = g => Math.min(g.need, value(g.stat));
  const chapterDone = ch => ch && !ch.soon && ch.goals.every(g => goalValue(g) >= g.need);

  // game = cheat | teacher | powder:<mode> | boss:<id>
  function run(game) {
    const [kind, arg] = game.split(":");
    if (kind === "cheat") return LUX.cheat.start();
    if (kind === "teacher") return LUX.teacher.start();
    if (kind === "powder") return LUX.powder.start(arg);
    if (kind === "boss") return LUX.boss.start(arg);
  }

  // check after anything that can move a goal; finishes the chapter when all goals are met
  function check() {
    const S = G().state;
    const ch = chapter();
    if (!chapterDone(ch) || S.chapterDoneShown === ch.id) return;
    S.chapterDoneShown = ch.id;
    G().addCoins(ch.reward.coins || 0);
    if (ch.reward.item) G().collect(ch.reward.item);
    if (ch.reward.achievement) G().achieve(ch.reward.achievement);
    S.chapter = Math.min(T.chapters.length - 1, S.chapter + 1);
    G().save();
    G().renderAll();
    setTimeout(() => celebrate(ch), 1500);
  }

  async function celebrate(ch) {
    if (G().isLocked() || G().isBusy()) return setTimeout(() => celebrate(ch), 1500);
    G().lock();
    G().sound.jingle();
    G().toast(`📚 ${ch.title} – ferdig!`);
    for (const l of ch.done) {
      G().say(l, "excited");
      await sleep(Math.max(2400, l.length * 55));
    }
    const next = chapter();
    if (next.soon) G().say(T.soonLine, "happy");
    else await intro(next);
    G().unlock();
  }

  async function intro(ch) {
    G().state.chapterIntroSeen = ch.id;
    G().toast(`📚 ${ch.title}`);
    for (const l of ch.intro) {
      G().say(l, /RipeiSåle|Adam|problem/.test(l) ? "annoyed" : "excited");
      await sleep(Math.max(2600, l.length * 55));
    }
  }

  async function show() {
    const S = G().state;
    S.storySeen = true;
    document.querySelector('[data-action="school"]')?.classList.remove("new");
    if (!chapter().soon && S.chapterIntroSeen !== chapter().id && !G().isLocked()) {
      G().lock();
      await intro(chapter());
      G().unlock();
    }
    render();
  }

  function render() {
    const S = G().state;
    const body = open("📚 " + T.title, { wide: true });
    body.append(el("p", { class: "th-wallet" }, T.dream));
    const list = el("div", { class: "th-chapters" });
    T.chapters.forEach((ch, i) => {
      const st = i < S.chapter ? "done" : i === S.chapter ? (ch.soon ? "soon" : "current") : "locked";
      const card = el("div", { class: "th-ch " + st }, el("b", {}, (st === "done" ? "✅ " : st === "current" ? "▶ " : "🔒 ") + ch.title));
      if (st === "current") {
        card.append(el("p", {}, ch.tip));
        for (const g of ch.goals) {
          const v = goalValue(g);
          card.append(el("div", { class: "th-goal" + (v >= g.need ? " ok" : "") },
            el("span", {}, `${v >= g.need ? "☑" : "☐"} ${g.text}`),
            el("span", {}, `${v} / ${g.need}`),
            el("div", { class: "th-bar small" }, el("i", { style: `width:${(v / g.need) * 100}%` }))));
        }
        for (const a of ch.actions || []) {
          const locked = a.need && value(a.need.stat) < a.need.n;
          const b = el("button", { class: "th-action", onclick: () => { close(); run(a.game); } }, locked ? `🔒 ${a.label}` : a.label);
          b.disabled = locked;
          card.append(b);
        }
        card.append(el("small", {}, `Belønning: +${ch.reward.coins} 🪙` + (ch.reward.item ? " + noko til SKI-magasinet" : "")));
      } else if (st === "done") {
        // replay the games of finished chapters
        const row = el("div", { class: "th-replay" });
        for (const a of ch.actions || []) row.append(el("button", { onclick: () => { close(); run(a.game); } }, a.label));
        card.append(row);
      } else {
        card.append(el("small", {}, (st === "soon" ? "Kjem snart: " : "") + (ch.teaser || "")));
      }
      list.append(card);
    });
    body.append(list);
  }

  return { check, show, chapter, run };
})();
