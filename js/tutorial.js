// The guide / tutorial: a spotlight on each feature with a card that explains it (content/tutorial.js).
// Starts by itself the first time, and from the ❓ Guide button. Neste / Tilbake (or ← → Enter),
// ✖ or Esc closes it at any time. While it's open, the game is paused (nothing pops up).
window.LUX = window.LUX || {};

LUX.tutorial = (() => {
  const { el } = LUX.ui;
  const G = () => LUX.game;
  let root = null, spot, card, i = 0, raf = 0, steps = [];

  function init() {
    document.querySelector("#guide-btn")?.addEventListener("click", () => start());
  }

  // the first selector in the list that exists and is visible
  function find(target) {
    if (!target) return null;
    for (const sel of target.split(",")) {
      const e = document.querySelector(sel.trim());
      if (e && e.getClientRects().length && e.offsetParent !== null) return e;
    }
    return null;
  }

  function start() {
    if (root) return;
    steps = LUX.content.tutorial;
    i = 0;
    G().lock();
    document.body.classList.add("tutorial-on");
    spot = el("div", { class: "tut-spot" });
    card = el("div", { class: "tut-card", role: "dialog", "aria-modal": "true" });
    root = el("div", { class: "tut" }, spot, card);
    document.body.append(root);
    document.addEventListener("keydown", onKey, true);
    show();
    loop();
  }

  function close() {
    if (!root) return;
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKey, true);
    root.remove();
    root = null;
    document.body.classList.remove("tutorial-on");
    const g = G();
    g.state.tutorialSeen = true;
    g.save();
    g.unlock();
    g.idleSoon();
  }

  function go(n) {
    if (n < 0) return;
    if (n >= steps.length) return close();
    i = n;
    show();
  }

  function onKey(e) {
    if (!root) return;
    const k = e.key;
    if (["ArrowRight", "Enter", "ArrowLeft", "Escape"].includes(k)) { e.preventDefault(); e.stopPropagation(); }
    if (k === "ArrowRight" || k === "Enter") go(i + 1);
    else if (k === "ArrowLeft") go(i - 1);
    else if (k === "Escape") close();
  }

  function show() {
    const s = steps[i];
    const last = i === steps.length - 1;
    card.innerHTML = "";
    const back = el("button", { class: "tut-back", onclick: () => go(i - 1) }, "◀ Tilbake");
    back.disabled = i === 0;
    card.append(
      el("div", { class: "tut-top" },
        el("span", { class: "tut-count" }, `${i + 1} / ${steps.length}`),
        el("button", { class: "tut-close", title: "Lukk guiden (Esc)", onclick: close }, "✖ Lukk guiden")),
      el("div", { class: "tut-progress" }, el("i", { style: `width:${((i + 1) / steps.length) * 100}%` })),
      el("h3", {}, s.title),
      el("p", {}, s.text),
      el("div", { class: "tut-nav" }, back,
        el("button", { class: "tut-next", onclick: () => go(i + 1) }, last ? "Ferdig ✔" : "Neste ▶")),
    );
    const t = find(s.target);
    if (t) t.scrollIntoView({ block: "nearest", inline: "nearest" });
    place();
    card.querySelector(".tut-next").focus({ preventScroll: true });
  }

  // put the spotlight on the target and the card next to it (re-done every frame, so it follows layout changes)
  function place() {
    const t = find(steps[i].target);
    const vw = innerWidth, vh = innerHeight, m = 12;
    const cw = Math.min(400, vw - 2 * m), ch = card.offsetHeight;
    card.style.width = cw + "px";
    if (!t) {
      spot.style.display = "none";
      root.classList.add("dim");
      card.style.left = (vw - cw) / 2 + "px";
      card.style.top = Math.max(m, (vh - ch) / 2) + "px";
      return;
    }
    root.classList.remove("dim");
    spot.style.display = "block";
    const r = t.getBoundingClientRect(), pad = 6;
    Object.assign(spot.style, { left: r.left - pad + "px", top: r.top - pad + "px", width: r.width + 2 * pad + "px", height: r.height + 2 * pad + "px" });
    // where is there room for the card? right, left, below, above – or on top of the target
    const room = { right: vw - r.right, left: r.left, below: vh - r.bottom, above: r.top };
    let x, y;
    if (room.right >= cw + 2 * m) { x = r.right + m; y = r.top; }
    else if (room.left >= cw + 2 * m) { x = r.left - cw - m; y = r.top; }
    else if (room.below >= ch + 2 * m) { x = r.left; y = r.bottom + m; }
    else if (room.above >= ch + 2 * m) { x = r.left; y = r.top - ch - m; }
    else { x = r.left + (r.width - cw) / 2; y = r.top + (r.height - ch) / 2; }
    card.style.left = Math.max(m, Math.min(vw - cw - m, x)) + "px";
    card.style.top = Math.max(m, Math.min(vh - ch - m, y)) + "px";
  }

  function loop() {
    if (!root) return;
    place();
    raf = requestAnimationFrame(loop);
  }

  return { init, start, close, isOpen: () => !!root };
})();
