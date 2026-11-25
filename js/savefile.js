// Saving: the game saves by itself in the browser all the time (js/main.js → localStorage).
// This adds the bar under the header:
//   💾 status  – shows when it last saved
//   ⬇️ Lagre til fil – downloads the progress as a small file (backup, or to move it to another computer/browser)
//   ⬆️ Hent fil      – loads such a file again (replaces the current progress, after asking)
window.LUX = window.LUX || {};

LUX.savefile = (() => {
  const { el, open, close } = LUX.ui;
  const G = () => LUX.game;
  const $ = s => document.querySelector(s);
  const pad = n => String(n).padStart(2, "0");

  function init() {
    $("#save-export").addEventListener("click", exportFile);
    $("#save-import").addEventListener("click", () => $("#save-file").click());
    $("#save-file").addEventListener("change", e => {
      const f = e.target.files[0];
      e.target.value = "";          // so the same file can be picked again
      if (f) readFile(f);
    });
    saved();
  }

  // called by main.js every time the game has saved
  let lastShown = 0;
  function saved() {
    const s = $("#save-status");
    if (!s) return;
    const d = new Date();
    if (Date.now() - lastShown < 5000 && s.dataset.ok) return;   // don't redraw it every second
    lastShown = Date.now();
    s.dataset.ok = "1";
    s.textContent = `💾 Lagra automatisk ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    s.title = "Spelet lagrar sjølv i denne nettlesaren medan du spelar. Bruk «Lagre til fil» for å ta ein kopi " +
      "(trygt om nettlesaren blir tømt, eller for å spele vidare på ein annan PC).";
  }

  function exportFile() {
    const g = G();
    g.save();
    const raw = localStorage.getItem(g.saveKey) || JSON.stringify(g.state);
    let bgm = null;
    try { bgm = localStorage.getItem("djlux-bgm"); } catch {}
    const data = { game: "DJ.LUX", version: 1, savedAt: new Date().toISOString(), settings: { bgm }, state: JSON.parse(raw) };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const d = new Date();
    const a = el("a", { href: URL.createObjectURL(blob), download: `DJ.LUX-lagring-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    g.toast("⬇️ Lagringsfila er lasta ned – ta vare på ho!");
  }

  function readFile(file) {
    const r = new FileReader();
    r.onload = () => {
      let data;
      try { data = JSON.parse(r.result); } catch { return problem("Fila kunne ikkje lesast. Er det ei DJ.LUX-lagringsfil (.json)?"); }
      const state = data && data.game === "DJ.LUX" ? data.state : data;
      if (!state || typeof state !== "object" || typeof state.coins !== "number" || !state.owned) {
        return problem("Dette ser ikkje ut som ei DJ.LUX-lagringsfil.");
      }
      confirmLoad(state, data.savedAt, data.settings);
    };
    r.readAsText(file);
  }

  function problem(text) {
    const body = open("⬆️ Hent lagring");
    body.append(el("p", {}, "❌ " + text), el("button", { onclick: close }, "OK"));
  }

  function confirmLoad(state, savedAt, settings) {
    const when = savedAt ? new Date(savedAt).toLocaleString("no-NO") : "ukjend tid";
    const body = open("⬆️ Hent lagring");
    body.append(
      el("p", {}, `Lagringsfila er frå ${when}:`),
      el("p", {}, `🪙 ${state.coins} mynter · 🎧 ${state.gigs || 0} DJ-sett · 📚 kapittel ${(state.chapter || 0) + 1} · 🏆 ${(state.achievements || []).length} trofé`),
      el("p", {}, el("b", {}, "Framgangen du har no blir erstatta av denne. Vil du halde fram?")),
      el("div", { class: "mg-two" },
        el("button", { onclick: () => load(state, settings) }, "✔ Ja, hent"),
        el("button", { onclick: close }, "✖ Avbryt")),
    );
  }

  function load(state, settings) {
    const g = G();
    g.freezeSave();                  // so the old progress isn't saved on top again before the reload
    try {
      localStorage.setItem(g.saveKey, JSON.stringify(state));
      if (settings?.bgm) localStorage.setItem("djlux-bgm", settings.bgm);
    } catch {
      return problem("Nettlesaren lét ikkje spelet lagre (privat vindauge?).");
    }
    location.reload();
  }

  return { init, saved, exportFile };
})();
