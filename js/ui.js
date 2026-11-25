// Shared UI helpers: overlay windows, element builder, small utilities.
window.LUX = window.LUX || {};

LUX.ui = (() => {
  const $ = s => document.querySelector(s);
  let onCloseCb = null;

  // modal window on top of the stage. Returns the body element to fill.
  function open(title, { onClose, wide } = {}) {
    const ov = $("#overlay");
    ov.classList.remove("hidden");
    ov.querySelector(".ov-box").classList.toggle("wide", !!wide);
    ov.querySelector("h2").textContent = title;
    const body = ov.querySelector(".ov-body");
    body.innerHTML = "";
    onCloseCb = onClose || null;
    return body;
  }

  function close() {
    $("#overlay").classList.add("hidden");
    const cb = onCloseCb;
    onCloseCb = null;
    if (cb) cb();
  }

  function el(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "onclick") e.addEventListener("click", v);
      else if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
    for (const c of children) e.append(c);
    return e;
  }

  const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  // a random element – but it avoids repeating the ones it picked lately from the same list, so lines don't go
  // in circles (with 10 lines, it waits until ~6 others have been used before one comes back)
  const recent = new WeakMap();
  const pick = arr => {
    if (!arr || arr.length < 2) return arr?.[0];
    let used = recent.get(arr);
    if (!used) recent.set(arr, used = []);
    const keep = Math.min(arr.length - 1, Math.max(1, Math.floor(arr.length * 0.6)));
    let i, tries = 0;
    do i = Math.floor(Math.random() * arr.length); while (used.includes(i) && ++tries < 40);
    used.push(i);
    while (used.length > keep) used.shift();
    return arr[i];
  };
  const fill = (s, vars = {}) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // a sprite of Anna in her current outfit
  const sprite = pose => `assets/sprites/${LUX.game.outfit()}/${pose}.png`;

  // a face picture (assets/sprites/<folder>/face.png) if it has been built, otherwise a big emoji
  // which = "face" (head and shoulders) or "full" (whole body) – falls back to the other, then to the emoji
  function face(path, emoji, alt, which = "face") {
    const folder = path.split("/")[2];
    const have = (window.LUX_SPRITES || {})[folder] || [];
    const pick = have.includes(which) ? which : have.includes("face") ? "face" : have.includes("full") ? "full" : null;
    if (pick) return el("img", { src: `assets/sprites/${folder}/${pick}.png`, alt, class: "pic-" + pick });
    return el("span", {}, emoji);
  }

  return { open, close, el, shuffle, pick, fill, sleep, sprite, face };
})();
