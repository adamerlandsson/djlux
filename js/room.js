// Clickable things in the scenes (positions come from content/house.js).
window.LUX = window.LUX || {};

LUX.room = (() => {
  const C = LUX.content;
  const R = C.room;
  const { el, pick } = LUX.ui;
  const G = () => LUX.game;
  let current = null;

  function render(scene) {
    if (scene === current) return;
    current = scene;
    const layer = document.querySelector("#hotspots");
    layer.innerHTML = "";
    for (const h of C.house.hotspots[scene] || []) {
      const spot = el("div", { class: "hotspot", title: h.label, "data-label": h.label });
      Object.assign(spot.style, { left: h.x + "%", top: h.y + "%", width: h.w + "%", height: h.h + "%" });
      spot.addEventListener("click", () => use(h.id));
      layer.append(spot);
    }
  }

  function use(id) {
    const g = G();
    if (g.isLocked() || g.isBusy()) return;
    const S = g.state;
    const hour = g.now().getHours();
    const lying = ["hungover", "sofa"].includes(g.context);
    if (g.context === "asleep" && !["tv", "lamp", "window"].includes(id)) return g.say(pick(C.contexts.asleep.lines));
    switch (id) {
      case "tv": {
        S.tvChannel = ((S.tvChannel ?? -1) + 1) % R.tv.channels.length;
        const ch = R.tv.channels[S.tvChannel];
        LUX.scene.setTV(true, ch.color);
        if (S.tvChannel === 0) g.change("mood", 5);
        return g.say(`📺 ${ch.name}. ${ch.line}`, lying ? "hungover" : S.tvChannel === 2 ? "grumpy" : "excited");
      }
      case "kitchen": {
        const grumpy = g.moodLabel() === "grumpy";
        g.change("mood", grumpy ? -3 : 5);
        return g.say(pick(grumpy ? R.kitchen.grumpy : R.kitchen.lines), grumpy ? "grumpy" : "happy");
      }
      case "window":
        // someone is always outside: Hadi, Jenny, Idunn, Hennie or Adam (and you can let them in)
        return LUX.people.windowClick();
      case "phone": {
        const line = pick(R.phone);
        if (/Adam/.test(line)) g.adam();
        return g.say(line, /Adam/.test(line) ? "dreamy" : lying ? "hungover" : "happy");
      }
      case "skis":
        g.change("festlyst", 5);
        return g.say(pick(R.skis), "excited");
      case "decks":
        g.change("festlyst", 8);
        if (g.context !== "vors" && Math.random() < 0.4) { g.say("Ein liten øvingsrunde? DJ LUX, gjer deg klar!", "djing"); return setTimeout(() => LUX.dj.start(), 1500); }
        LUX.sound.scratch();
        return g.say(pick(R.decks), "djing");
      case "poster":
        g.change("dialekt", 10);
        return g.say(pick(R.poster), "dreamy");
      case "disco":
        g.change("festlyst", 10);
        return g.say(pick(R.disco), "party");
      case "doorSandra":
        if (Math.random() < 0.5) return LUX.people.roommate("sandra", true);
        return g.say(pick(R.doorSandra), "neutral");
      case "doorMarthe":
        if (Math.random() < 0.5) return LUX.people.roommate("marthe", true);
        return g.say(pick(R.doorMarthe), "neutral");
      case "doorEmma":
        if (S.adam > 40 && Math.random() < 0.6) return LUX.people.roommate("emma", true);
        return g.say(pick(R.doorEmma), "guilty");
      case "lamp": {
        S.lampOn = !(S.lampOn ?? true);
        LUX.scene.setLamp(S.lampOn);
        const lines = S.lampOn ? R.lamp.on : g.context === "hungover" ? R.lamp.offHungover : R.lamp.off;
        return g.say(pick(lines), lying ? "hungover" : "happy");
      }
      case "whiteboard":
        g.say(R.whiteboard, "busy");
        return LUX.minigames.fiskEllerIkea();
      case "clock": {
        const d = g.now();
        return g.say(pick(R.clock).replace("{time}", `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`), "busy");
      }
      case "bar":
        g.change("festlyst", 5);
        return g.say(pick(R.bar), "party");
      case "gym":
        g.change("mood", -2);
        return g.say(pick(R.gym), "annoyed");
      case "bench":
        g.change("mood", 6);
        g.stat("benk");
        if ((S.stats.benk || 0) >= 5) g.achieve("Ikke tenk bare benk");
        return g.say(pick(R.bench), "proud");
      case "skiwall":
      case "trophies":
      case "gearfloor": {
        const C2 = C.collection;
        const list = id === "skiwall" ? C2.skis : id === "gearfloor" ? C2.gear : C2.medals;
        const have = list.filter(x => S.collection[x.id]);
        if (!have.length) return g.say(pick({
          skiwall: ["Skiveggen æ tom! E må vinne ski på DJ-sett og skiturar.", "Her ska Black Crows-skia henge. Ein dag."],
          trophies: ["Her ska TF-medalja henge. Og «TF sin kjekkaste». Snart.", "Tom vegg. Fyll han med trofé, DJ LUX!"],
          gearfloor: ["Ikkje noko utstyr enno. Vinn det på DJ-sett og skiturar!"],
        }[id]), "sad");
        g.say(`${have.length} ${id === "skiwall" ? "par ski" : id === "gearfloor" ? "ting" : "premiar"}! ${pick(have).name} æ favoritten.`, "proud");
        return setTimeout(() => !g.isLocked() && LUX.shop.magazine(), 1200);
      }
      case "gymboard":
        return g.say(pick(R.gymboard), "busy");
    }
  }

  return { render, use };
})();
