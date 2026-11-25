// Butikk (DJ gear, light shows, dresses, ski outfits, misc) and the SKI-magasin (collection).
window.LUX = window.LUX || {};

LUX.shop = (() => {
  const C = LUX.content;
  const { el, open } = LUX.ui;
  const G = () => LUX.game;
  const RARITY = ["", "Vanleg", "Uvanleg", "Sjeldan", "LEGENDARISK"];

  // ---------- SKI-magasin ----------
  function magazine() {
    const S = G().state;
    const body = open("🎿 SKI-magasin", { wide: true });
    const all = [...C.collection.skis, ...C.collection.gear, ...C.collection.medals];
    const found = all.filter(x => S.collection[x.id]).length;
    body.append(el("p", {}, `Samla: ${found} / ${all.length}  ·  DJ-gigs: ${S.gigs}  ·  Beste karakter: ${S.bestGrade || "–"}` +
      (S.sponsored ? "  ·  ⭐ SPONSORED SKIER" : "")));
    const section = (title, items, icon) => {
      body.append(el("h3", { class: "mz-head" }, title));
      const grid = el("div", { class: "jr-grid" });
      for (const it of items) {
        const n = S.collection[it.id];
        grid.append(el("div", { class: `jr-card r${it.rarity}` + (n ? "" : " unknown") },
          el("div", { class: "mz-icon" }, n ? icon(it) : "❔"),
          el("b", {}, n ? it.name : "???"),
          el("i", {}, RARITY[it.rarity]),
          el("small", {}, n ? `${it.desc}${n > 1 ? ` (×${n})` : ""}` : "Vinn på DJ-gigs, skiturar eller i Planen.")));
      }
      body.append(grid);
    };
    section("🎿 Ski", C.collection.skis, () => "🎿");
    section("🥽 Utstyr", C.collection.gear, it => ({ hjelm: "⛑️", goggles: "🥽", staver: "🦯", skredsokar: "📡", feller: "🧦", airbag: "🎒", skisko: "🥾" })[it.id] || "🎒");
    section("🏅 Medaljar og trofé", C.collection.medals, it => it.name.split(" ")[0]);
  }

  // a random drop from skis + gear, rarer things less often
  function randomDrop(luck = 0) {
    const pool = [...C.collection.skis, ...C.collection.gear];
    const weights = pool.map(x => [0, 10, 5, 2 + luck, 0.6 + luck / 2][x.rarity]);
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) if ((r -= weights[i]) <= 0) return pool[i].id;
    return pool[0].id;
  }

  // ---------- shop ----------
  function shop(tab = "gear") {
    const S = G().state;
    const body = open("🛒 Butikk", { wide: true });
    const tabs = { gear: "🎛️ DJ-utstyr", lights: "💡 Lysshow", dress: "👗 Gallakjolar", ski: "🎿 Skidressar", misc: "🛍️ Diverse" };
    body.append(el("div", { class: "sh-top" },
      ...Object.entries(tabs).map(([id, name]) => el("button", { class: id === tab ? "active" : "", onclick: () => shop(id) }, name)),
      el("span", { class: "sh-coins" }, `🪙 ${S.coins}`)));
    const list = el("div", { class: "sh-list" });
    body.append(list);

    if (tab === "misc") {
      for (const item of C.shop.misc) {
        const btn = el("button", { onclick: () => buyMisc(item) }, `Kjøp ${item.price} 🪙`);
        btn.disabled = S.coins < item.price;
        list.append(el("div", { class: "sh-item" }, el("div", {}, el("b", {}, item.name)), btn));
      }
      return;
    }
    if (tab === "dress" || tab === "ski") {
      for (const item of C.shop.outfits.filter(o => C.outfits[o.id].family === (tab === "dress" ? "dress" : "ski"))) {
        const o = C.outfits[item.id];
        const owned = S.owned.outfits.includes(item.id);
        let btn;
        if (!owned && item.sponsor) btn = el("button", { disabled: "" }, "⭐ Berre for Sponsored Skiers");
        else if (!owned) { btn = el("button", { onclick: () => buyOutfit(item) }, `Kjøp ${item.price} 🪙`); btn.disabled = S.coins < item.price; }
        else if (G().outfit() === item.id) btn = el("button", { disabled: "" }, "✔ På no");
        else btn = el("button", { onclick: () => { G().wearOutfit(item.id); shop(tab); } }, "Ta på");
        const pic = el("img", { src: `assets/sprites/${item.id}/base.png`, alt: o.name });
        pic.onerror = () => pic.remove();
        list.append(el("div", { class: "sh-item" + (owned ? " owned" : "") + (o.fancy ? " fancy" : "") },
          pic, el("div", {}, el("b", {}, o.name), el("small", {}, o.fancy ? "Ekstra fancy ✨" : "")), btn));
      }
      return;
    }
    for (const item of C.shop[tab]) {
      const owned = S.owned[tab].includes(item.id);
      const equipped = S.equipped[tab] === item.id;
      const extra = tab === "gear" ? `  (+${item.window} ms timing)` : `  (×${item.hype} hype)`;
      let btn;
      if (!owned) { btn = el("button", { onclick: () => buy(tab, item) }, `Kjøp ${item.price} 🪙`); btn.disabled = S.coins < item.price; }
      else if (equipped) btn = el("button", { disabled: "" }, "✔ I bruk");
      else btn = el("button", { onclick: () => equip(tab, item) }, "Bruk");
      list.append(el("div", { class: "sh-item" + (owned ? " owned" : "") },
        el("div", {}, el("b", {}, item.name), el("small", {}, item.desc + extra)), btn));
    }
  }

  function pay(price) {
    const S = G().state;
    if (S.coins < price) return false;
    S.coins -= price;
    G().sound.jingle();
    G().renderAll();
    return true;
  }

  function buy(tab, item) {
    if (!pay(item.price)) return;
    G().state.owned[tab].push(item.id);
    equip(tab, item);
  }

  // where the things you buy show up in the game (content/shop.js → where)
  const WHERE = {
    gear: "Han står på DJ-pulten i stua no – og blir med på Grafen.",
    lights: "Sjå stua i kveld (eller på vors) – og på Grafen når du DJ-ar!",
  };

  function equip(tab, item) {
    G().state.equipped[tab] = item.id;
    G().say((tab === "gear" ? `${item.name}! DJ LUX oppgraderer!` : `${item.name}! Dansegolvet kjem til å KOKE.`) +
      " " + (item.where || WHERE[tab]), "djing");
    if (item.price) G().toast("🛋️ " + (item.where || WHERE[tab]));
    G().save();
    shop(tab);
  }

  function buyOutfit(item) {
    if (!pay(item.price)) return;
    G().state.owned.outfits.push(item.id);
    G().wearOutfit(item.id);
    shop(C.outfits[item.id].family);
  }

  function buyMisc(item) {
    if (!pay(item.price)) return;
    const S = G().state;
    for (const [k, v] of Object.entries(item.effects)) G().change(k, v);
    // it shows up in the living room (js/scene-hd.js): on the table for a while, or for good
    S.items = S.items || {};
    if (item.stayMinutes) S.items[item.id + "Until"] = Math.max(Date.now(), S.items[item.id + "Until"] || 0) + item.stayMinutes * 60000;
    if (item.keep) S.items[item.id] = true;
    G().say(item.line, "excited");
    if (item.where) G().toast("🛋️ " + item.where);
    G().save();
    shop("misc");
  }

  return { magazine, open: shop, randomDrop };
})();
