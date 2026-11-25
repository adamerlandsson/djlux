// DJ.LUX main loop: schedule, mood, outfits, meters, rendering – and LUX.game, the API the games use.
(() => {
  const C = LUX.content;
  const $ = s => document.querySelector(s);
  const pick = arr => LUX.ui.pick(arr);   // no-repeat pick (js/ui.js)
  const clamp = v => Math.max(0, Math.min(100, v));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // expression -> pose (image name inside the outfit folder)
  const POSES = {
    neutral: "base", happy: "base", excited: "excited", dreamy: "dreamy", shocked: "shocked",
    grumpy: "sour", annoyed: "annoyed", sad: "sad", guilty: "guilty", shy: "guilty", sleepy: "sleepy",
    hungover: "sofa", lounging: "sofa", busy: "study", proud: "proud", party: "dance", djing: "dj", skiing: "ski",
  };
  // used when an outfit doesn't have a pose (yet)
  const POSE_FALLBACKS = { sofa: "sleepy", sour: "annoyed", annoyed: "base", guilty: "base", sad: "base",
    sleepy: "base", dreamy: "base", excited: "base", shocked: "base", study: "base", proud: "excited",
    dance: "excited", dj: "excited", ski: "excited" };

  const DAYS = ["Søndag", "Måndag", "Tysdag", "Onsdag", "Torsdag", "Fredag", "Laurdag"];
  const MOOD_EMOJI = { happy: "😄", neutral: "😐", grumpy: "😤" };

  // ---------- state (saved in localStorage) ----------
  const SAVE_KEY = "djlux-save-v1";
  const freeOutfits = () => C.shop.outfits.filter(o => !o.price && !o.sponsor).map(o => o.id);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); } catch { saved = {}; }
  const state = Object.assign(
    { mood: 60, festlyst: 40, dialekt: 90, adam: 0, dj: 0, name: null,
      adamCount: 0, talks: 0, hungoverTalks: 0, outfitChanges: 0, skipped: 0, gigs: 0, bestGrade: null,
      moodDay: null, outfitOverride: null, achievements: [], coins: 0, tvChannel: -1,
      chapter: 0, stats: {}, collection: {}, sponsored: false,
      owned: { gear: ["laptop"], lights: ["ingen"], outfits: freeOutfits() },
      equipped: { gear: "laptop", lights: "ingen" } },
    saved,
  );
  let saveFrozen = false;   // set while a save file is being loaded (js/savefile.js)
  const save = () => {
    if (saveFrozen) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); LUX.savefile?.saved(); } catch {}
  };
  state.owned.outfits = [...new Set([...freeOutfits(), ...state.owned.outfits])].filter(id => C.outfits[id]);

  let brain = LUX.ScriptedBrain;
  let busy = false;      // Anna is talking
  let locked = 0;        // a game is open
  let activity = null, activityUntil = 0;
  let idleTimer = null;
  let typingToken = 0;
  let timeOffset = 0;    // for the time-travel dropdown
  let context = null;
  let lastOutfit = null;

  // ---------- time, schedule & mood ----------
  const now = () => new Date(Date.now() + timeOffset);
  const dateKey = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  // same random number all day for the same key
  function dailyRandom(key) {
    let h = 2166136261;
    for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return ((h >>> 0) % 10000) / 10000;
  }

  function blockMatches(b, d) {
    const h = d.getHours() + d.getMinutes() / 60, day = d.getDay();
    if (b.day === undefined) return b.from < b.to ? h >= b.from && h < b.to : h >= b.from || h < b.to;
    if (day === b.day && h >= b.from && h < Math.min(24, b.to)) return true;
    return b.to > 24 && day === (b.day + 1) % 7 && h < b.to - 24;   // runs past midnight
  }

  function scheduleContext(d) {
    if (activity && Date.now() < activityUntil) return activity;
    const b = C.schedule.blocks.find(x => blockMatches(x, d));
    return b ? b.ctx : "home";
  }

  function moodBase(d) {
    const ctx = scheduleContext(d);
    if (C.schedule.moodStart[ctx] !== undefined) return C.schedule.moodStart[ctx];
    const r = dailyRandom("mood" + dateKey(d));
    if (r < C.schedule.grumpyDayChance) return 25;
    if (r < C.schedule.grumpyDayChance + C.schedule.happyDayChance) return 82;
    return 55;
  }

  const moodLabel = () => (state.mood < 35 ? "grumpy" : state.mood > 65 ? "happy" : "neutral");

  function newDayCheck() {
    const key = dateKey(now());
    if (state.moodDay !== key) {
      state.moodDay = key;
      state.mood = moodBase(now());
      state.outfitOverride = null;
    }
  }

  // ---------- outfits ----------
  function currentOutfit() {
    const o = state.outfitOverride;
    if (o && o.key === state.moodDay + context && state.owned.outfits.includes(o.id)) return o.id;
    const rule = C.outfitRules[context] || ["ski"];
    // prefer outfits that have real pictures (not placeholders) – see assets/sprites/manifest.js
    const real = window.LUX_REAL || [];
    const isReal = id => !real.length || real.includes(C.outfits[id].family) || real.includes(id);
    const owned = state.owned.outfits.filter(isReal).length ? state.owned.outfits.filter(isReal) : state.owned.outfits;
    let list = owned.filter(id => rule.includes(id) || rule.includes(C.outfits[id].family));
    if (!list.length) list = owned;
    return list[Math.floor(dailyRandom(state.moodDay + context) * list.length)];
  }

  function resolvePose(outfitId, pose) {
    const available = (window.LUX_SPRITES || {})[outfitId] || [];
    if (!available.length) return { pose, fellBack: false };
    let p = pose, fellBack = false;
    while (!available.includes(p) && POSE_FALLBACKS[p]) { p = POSE_FALLBACKS[p]; fellBack = true; }
    if (!available.includes(p)) { p = available.includes("base") ? "base" : available[0]; fellBack = true; }
    return { pose: p, fellBack };
  }

  // ---------- rendering ----------
  const img = $("#anna");
  const wrap = $("#anna-wrap");

  function setExpression(expr) {
    let outfit = currentOutfit();
    const wanted = POSES[expr] || POSES.neutral;
    // lying on the sofa: always use the real sofa picture – in a dress she owns if this outfit has none
    if (wanted === "sofa" && !((window.LUX_SPRITES || {})[outfit] || []).includes("sofa")) {
      const withSofa = state.owned.outfits.filter(id => ((window.LUX_SPRITES || {})[id] || []).includes("sofa"));
      if (withSofa.length) outfit = withSofa.includes("kjole_gronn") ? "kjole_gronn" : withSofa[0];
    }
    const { pose, fellBack } = resolvePose(outfit, wanted);
    // no sofa sprite for this outfit? then just tip the standing one over onto the sofa 😄
    wrap.classList.toggle("lying", wanted === "sofa" && fellBack);
    wrap.classList.toggle("on-sofa", pose === "sofa");
    const src = `assets/sprites/${outfit}/${pose}.png`;
    if (!img.src.endsWith(src)) {
      img.src = src;
      img.className = pose;
      void img.offsetWidth; // restart animation
      img.classList.add("pop");
    }
  }

  function idleExpression() {
    const byContext = { hungover: "hungover", sofa: "lounging", asleep: "sleepy", school: "busy", training: "annoyed",
      pils: "party", vors: "party", dj: "djing", ski: "skiing" };
    if (byContext[context]) return byContext[context];
    if (adamFever()) return "dreamy";
    return { happy: "happy", grumpy: "grumpy", neutral: "neutral" }[moodLabel()];
  }

  function backToIdleSoon(ms = 7000) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => !busy && !locked && setExpression(idleExpression()), ms);
  }

  async function typeBubble(text) {
    const token = ++typingToken;
    const bubble = $("#bubble");
    bubble.classList.remove("hidden");
    bubble.textContent = "";
    for (let i = 0; i < text.length; i++) {
      if (token !== typingToken) return; // someone else started talking
      bubble.textContent += text[i];
      if (i % 3 === 0 && text[i] !== " ") LUX.sound.typing();
      await sleep(text[i] === "." ? 60 : 22);
    }
  }

  function log(cls, text) {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = text;
    $("#log").appendChild(p);
    $("#log").scrollTop = 1e9;
  }

  // instant line without asking the brain (used by games, room objects and people)
  function say(text, expression, { log: doLog = true } = {}) {
    if (expression) setExpression(expression);
    if (doLog) log("anna", "ANNA: " + text);
    typeBubble(text);
    if (!locked) backToIdleSoon();
  }

  const djLevel = () => 1 + Math.floor(state.dj / 10);

  function renderMeters() {
    for (const el of document.querySelectorAll(".meter")) {
      const key = el.dataset.key;
      const v = state[key];
      el.querySelector("i").style.width = v + "%";
      el.classList.toggle("full", v >= 100 || (key === "adam" && adamFever()));
    }
    const d = $(".meter[data-key=dialekt] label");
    if (d) d.textContent = `DIALEKT (${state.dialekt >= 50 ? "Ål 🏔️" : "Oslo 🏙️"})`;
    $("#coins").textContent = `🪙 ${state.coins}`;
    $("#djlevel").textContent = `🎧 ${djLevel()}`;
    $("#skicount").textContent = `🎿 ${Object.keys(state.collection).length}`;
    $("#achievements").innerHTML = state.achievements.map(a => `<span>🏆 ${a}</span>`).join("");
  }

  function renderClock() {
    const d = now();
    const time = `${DAYS[d.getDay()]} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const where = C.contexts[context]?.label || "";
    $("#clock").textContent = `${time} · ${where} · ${MOOD_EMOJI[moodLabel()]} · 👗 ${C.outfits[currentOutfit()].name}`;
  }

  const renderAll = () => { renderMeters(); renderClock(); };

  function fx(cls, emoji, count = 1) {
    const box = $("#fx");
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = cls;
      el.textContent = emoji;
      el.style.left = 45 + Math.random() * 15 + "%";
      el.style.top = 55 + Math.random() * 20 + "%";
      el.style.animationDelay = i * 0.15 + "s";
      box.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  }

  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.remove("hidden");
    LUX.sound.jingle();
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.add("hidden"), 3000);
  }

  function achieve(name) {
    if (state.achievements.includes(name)) return;
    state.achievements.push(name);
    toast("🏆 " + name);
    renderMeters();
  }

  // add something to the SKI-magasin collection
  function collect(id) {
    const all = [...C.collection.skis, ...C.collection.gear, ...C.collection.medals];
    const item = all.find(x => x.id === id);
    if (!item) return null;
    const isNew = !state.collection[id];
    state.collection[id] = (state.collection[id] || 0) + 1;
    // where it shows up in the living room (js/scene-hd.js)
    const where = C.collection.skis.includes(item) ? "heng på skiveggen i stua"
      : C.collection.gear.includes(item) ? "ligg på golvet i stua"
      : { tf_kjekkeste: "står på høgtalaren i stua", al_laerar: "ligg på stuebordet" }[id] || "heng på veggen i stua";
    if (isNew) setTimeout(() => toast(`🎿 Nytt i SKI-magasinet: ${item.name} – ${where}`), 1200);
    if (id === "sponsored" && !state.sponsored) {
      state.sponsored = true;
      if (!state.owned.outfits.includes("ski_rosa")) state.owned.outfits.push("ski_rosa");
    }
    renderMeters();
    return { item, isNew };
  }

  function checkAchievements() {
    if (state.adamCount >= 10) achieve("Vi snakkar ikkje om Adam");
    if (state.talks >= 25) achieve("Skjønte hallingmål");
    if (state.hungoverTalks >= 10) achieve("Søndagsangst");
    if (state.skipped >= 1) achieve("Skulka for DJ-pulten");
    if (state.outfitChanges >= 5) achieve("Garderobe-dronning");
    if (state.gigs >= 1) achieve("Første gig på Grafen");
    if (state.dialekt <= 10) achieve("Full Oslo-modus");
    if (state.coins >= 500) achieve("DJ-millionær");
    if (Object.keys(state.collection).length >= 10) achieve("Samlar");
    LUX.story.check();
  }

  // ---------- scene / context ----------
  function applyContext(announce) {
    const prev = context;
    context = scheduleContext(now());
    const d = now();
    const scene = C.schedule.scenes[context] || "home";
    LUX.scene.setHour(d.getHours() + d.getMinutes() / 60);
    LUX.scene.setScene(scene, context);
    const pos = C.house.anna[scene] || C.house.anna.default;
    for (const [prefix, p] of [["anna", pos], ["sofa", C.house.anna.sofa]]) {
      for (const k of ["left", "bottom", "height"]) wrap.style.setProperty(`--${prefix}-${k}`, p[k]);
    }
    if (prev !== context) LUX.scene.setTV(["sofa", "hungover"].includes(context) || (context === "home" && d.getHours() >= 19));
    LUX.room.render(scene);
    $("#stage").dataset.context = context;
    const outfit = currentOutfit();
    if (outfit !== lastOutfit && prev === context && !busy && !locked) setExpression(idleExpression());
    lastOutfit = outfit;
    if (prev !== context) {
      if (!busy && !locked) setExpression(idleExpression());
      // say something when the situation changes on its own
      if (announce && prev && !["dj", "ski"].includes(prev) && !["dj", "ski"].includes(context) && !busy && !locked) {
        respond(`(Anna arrives: she is now ${C.contexts[context].label})`, {});
      }
    }
    renderClock();
  }

  // ---------- ADAM-O-METER & Adam-feber ----------
  const A = C.adamMeter;
  const adamFever = () => Date.now() < (state.adamFeverUntil || 0);

  function adam(amount = 1) {
    if (!adamFever()) state.adam = clamp(state.adam + amount * A.perMention);
    state.adamCount++;
    fx("heart", "💗", 3);
  }

  async function startAdamFever() {
    state.adamFeverUntil = Date.now() + A.feverSeconds * 1000;
    achieve("Adam-feber");
    lock();
    LUX.sound.ring();
    const call = pick(A.fever.call);
    for (const line of call) {
      say(line, ["hungover", "sofa"].includes(context) ? "hungover" : "dreamy");
      fx("heart", "💗", 5);
      await sleep(Math.max(2400, line.length * 55));
    }
    state.mood = clamp(state.mood + A.feverMood);
    unlock();
    renderAll();
    if (LUX.people.home()) setTimeout(() => LUX.people.roommate("emma"), 4000); // Emma heard that
  }

  function endAdamFever() {
    state.adamFeverUntil = 0;
    state.adam = A.afterFever;
    if (!busy && !locked && context !== "asleep") say(pick(A.fever.end), "neutral");
    renderMeters();
  }

  // ---------- brain ----------
  function rollEvents(message = "") {
    const events = [];
    const chance = adamFever() ? 0.8 : 0.04 + (state.adam / 100) * 0.25 + (/adam/i.test(message) ? 0.9 : 0);
    if (Math.random() < chance) events.push("ADAM");
    return events;
  }

  function applyEffects(effects = {}) {
    for (const k of ["mood", "festlyst", "dialekt"]) if (effects[k]) state[k] = clamp(state[k] + effects[k]);
    if (effects.dj) state.dj = clamp(state.dj + effects.dj);
    if (effects.adam) adam(effects.adam);
    if (effects.name) state.name = effects.name;
  }

  function brainState() {
    const d = now();
    return {
      mood: state.mood, festlyst: state.festlyst, dialekt: state.dialekt, adam: state.adam, adamFever: adamFever(),
      adamLevel: LUX.adam.level(state.adam), guest: LUX.people.guest(),
      djLevel: djLevel(), gigs: state.gigs, coins: state.coins, sponsored: state.sponsored, name: state.name,
      chapter: LUX.story.chapter().title, skis: Object.keys(state.collection).length,
      context, moodLabel: moodLabel(), outfit: C.outfits[currentOutfit()].name,
      day: DAYS[d.getDay()], time: `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`,
    };
  }

  function setControls() {
    document.querySelectorAll("#panel button, #timetravel").forEach(b => (b.disabled = busy || locked > 0));
    $("#stage").classList.toggle("locked", busy || locked > 0);
  }

  async function respond(message, extra = {}) {
    if (busy || locked) return;
    busy = true;
    setControls();
    applyEffects(extra.effects);
    const events = [...new Set([...rollEvents(message), ...(extra.events || [])])];
    let r;
    try {
      r = await brain.reply({ message, events, state: brainState() });
    } catch (e) {
      console.warn("Brain failed, falling back to offline brain", e);
      log("sys", "(Claude-hjernen svarte ikkje – brukar offline-hjernen)");
      r = await LUX.ScriptedBrain.reply({ message, events, state: brainState() });
    }
    applyEffects(r.effects);
    setExpression(extra.expression || r.expression);
    if ((r.events || events).includes("ADAM")) adam();
    state.talks++;
    if (context === "hungover") state.hungoverTalks++;
    log("anna", "ANNA: " + r.text);
    await typeBubble(r.text);
    checkAchievements();
    renderAll();
    save();
    busy = false;
    setControls();
    backToIdleSoon();
  }

  function lock() { locked++; clearTimeout(idleTimer); setControls(); }
  function unlock() { locked = Math.max(0, locked - 1); checkAchievements(); renderAll(); save(); setControls(); }

  // ---------- the API games / room / shop / people use ----------
  LUX.game = {
    state, now, save, say, respond, setExpression, brainState,
    saveKey: SAVE_KEY,
    freezeSave: () => (saveFrozen = true),
    usingClaude: () => brain === LUX.ClaudeBrain,
    // like say(), but waits until the bubble has been typed out
    async sayWait(text, expression) {
      if (expression) setExpression(expression);
      log("anna", "ANNA: " + text);
      await typeBubble(text);
    }, achieve, toast, adam, collect, renderAll, fx, log,
    sound: LUX.sound,
    get context() { return context; },
    moodLabel, djLevel,
    outfit: currentOutfit,
    isBusy: () => busy,
    isLocked: () => locked > 0,
    idleSoon: () => backToIdleSoon(3000),
    lock, unlock,
    stat: (k, n = 1) => { state.stats[k] = (state.stats[k] || 0) + n; },
    change(k, n) { state[k] = clamp(state[k] + n); renderMeters(); },
    setActivity(name, ms) {
      activity = name;
      activityUntil = name ? (ms ? Date.now() + ms : Infinity) : 0;
      applyContext(false);
    },
    addCoins(n) {
      n = Math.round(n * (state.sponsored ? 1.5 : 1));
      state.coins += n;
      fx("coin", `+${n} 🪙`);
      renderMeters();
      return n;
    },
    wearOutfit(id) {
      state.outfitOverride = { key: state.moodDay + context, id };
      state.outfitChanges++;
      lastOutfit = id;
      say(pick(C.wardrobe).replace("{outfit}", C.outfits[id].name), "happy");
      renderClock();
      save();
    },
  };

  // ---------- actions ----------
  function goDJ() {
    if (context === "asleep" || (["school", "hungover", "sofa", "training"].includes(context) && state.festlyst < 90)) {
      return respond(`(Anna refuses to DJ because she is ${C.contexts[context].label})`);
    }
    if (context === "school") state.skipped++;
    LUX.dj.start();
  }

  function changeClothes() {
    const ids = state.owned.outfits;
    LUX.game.wearOutfit(ids[(ids.indexOf(currentOutfit()) + 1) % ids.length]);
  }

  const actions = {
    school: () => LUX.story.show(),
    dj: goDJ,
    adam: () => LUX.adam.menu(),
    study: () => ["hungover", "asleep"].includes(context)
      ? respond(`(Anna refuses to study because she is ${C.contexts[context].label})`)
      : LUX.minigames.fiskEllerIkea(),
    clothes: changeClothes,
    games: () => LUX.minigames.menu(),
    magazine: () => LUX.shop.magazine(),
    shop: () => LUX.shop.open(),
  };

  // ---------- wiring ----------
  $("#chat").addEventListener("submit", e => {
    e.preventDefault();
    const msg = $("#msg").value.trim();
    if (!msg || busy || locked) return;
    $("#msg").value = "";
    log("you", "Du: " + msg);
    // a guest in the living room? then you talk to both of them
    if (LUX.people.guest()) return LUX.convo.talk(msg);
    respond(msg);
  });

  document.querySelectorAll("[data-action]").forEach(b =>
    b.addEventListener("click", () => {
      if (busy || locked) return;
      if (!["games", "magazine", "shop", "school", "adam"].includes(b.dataset.action)) log("you", "Du: " + b.textContent);
      actions[b.dataset.action]();
    })
  );

  $("#overlay .ov-close").addEventListener("click", () => LUX.ui.close());

  img.addEventListener("click", () => {
    if (busy || locked) return;
    setExpression(pick(["shocked", "excited", "party"]));
    say(pick(C.poked));
    backToIdleSoon(4000);
  });

  // time travel (for testing the schedule): value = "weekday-hour" or "real"
  $("#timetravel").addEventListener("change", e => {
    const v = e.target.value;
    if (v === "real") timeOffset = 0;
    else {
      const [dow, hour] = v.split("-").map(Number);
      const t = new Date();
      t.setDate(t.getDate() + ((dow - t.getDay() + 7) % 7));
      t.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
      timeOffset = t - Date.now();
    }
    state.moodDay = null;
    newDayCheck();
    applyContext(true);
    renderMeters();
  });

  // acronym cycling + Hadi fact of the day
  let ai = 0;
  setInterval(() => ($("#acronym").textContent = C.acronyms[++ai % C.acronyms.length]), 4000);
  const dayIndex = Math.floor(Date.now() / 864e5) % C.hadiFacts.length;
  $("#fact").textContent = "🧔🏽 Dagens Hadi-fakta: " + C.hadiFacts[dayIndex];

  // time passes: festlyst builds up (fast on Thursday/Saturday), dialekt drifts back to Ål, mood to the day's base
  setInterval(() => {
    newDayCheck();
    const day = now().getDay();
    state.festlyst = clamp(state.festlyst + ([4, 5, 6].includes(day) ? 0.35 : 0.18));
    state.dialekt = clamp(state.dialekt + (90 - state.dialekt) * 0.004);
    if (!locked) state.mood += (moodBase(now()) - state.mood) * 0.003;
    if (adamFever()) {
      if (Math.random() < 0.3) fx("heart", "💗", 1);
    } else if (state.adamFeverUntil) {
      endAdamFever();
    } else if (state.adam >= 100 && !busy && !locked && !["asleep", "dj", "ski"].includes(context)) {
      startAdamFever();
    } else {
      state.adam = clamp(state.adam - 100 / A.drainSeconds);
    }
    applyContext(true);
    renderMeters();
    if (!busy && !locked && state.festlyst >= 100 && Math.random() < 0.03 && context !== "asleep") {
      respond("(Anna is extremely restless and wants to party / DJ / ski NOW)", { expression: "party" });
    }
    if (++secondsRun % 20 === 0) save();   // the meters move by themselves – save them now and then too
  }, 1000);
  let secondsRun = 0;
  addEventListener("pagehide", save);

  // ---------- boot ----------
  document.getElementById("unzip-warning")?.remove();   // the game files loaded fine
  LUX.scene.init($("#scene"));
  LUX.scene.setLamp(state.lampOn ?? true);
  LUX.people.init();
  LUX.adam.init();
  LUX.bgm.init();
  LUX.savefile.init();
  if (!state.storySeen) $('[data-action="school"]').classList.add("new");
  // index.html?t=6-20 starts at Saturday 20:00 (same values as the dropdown)
  const params = new URLSearchParams(location.search);
  // index.html?kapittel=2 jumps straight to chapter 2 (for testing – 1, 2 or 3)
  if (params.get("kapittel")) {
    state.chapter = Math.max(0, Math.min(C.story.chapters.length - 1, Number(params.get("kapittel")) - 1));
    state.chapterIntroSeen = null;
    save();
  }
  const startTime = params.get("t");
  if (startTime) {
    const sel = $("#timetravel");
    if (![...sel.options].some(o => o.value === startTime)) sel.add(new Option(startTime, startTime));
    sel.value = startTime;
    sel.dispatchEvent(new Event("change"));
  }
  newDayCheck();
  applyContext(false);
  renderAll();
  (async () => {
    if (await LUX.ClaudeBrain.available()) {
      brain = LUX.ClaudeBrain;
      $("#brain-badge").textContent = "🧠 Claude";
      $("#brain-badge").classList.add("claude");
    }
    log("sys", `DJ.LUX starta med ${brain.name}-hjernen.`);
    // greeting always from the offline brain, so it's instant
    const hello = await LUX.ScriptedBrain.reply({ message: "(DJ.LUX starts)", events: [], state: brainState() });
    const text = state.name ? `${state.name}! ${hello.text}` : hello.text;
    log("anna", "ANNA: " + text);
    typeBubble(text);
    // test shortcuts: ?hadi ?jenny ?sandra ?marthe ?emma ?dj
    for (const who of Object.keys(C.window.visitors)) if (params.has(who)) setTimeout(() => LUX.people.visit(who), 1500);
    for (const who of ["sandra", "marthe", "emma"]) if (params.has(who)) setTimeout(() => LUX.people.roommate(who, true), 1500);
    if (params.has("adamtext")) setTimeout(() => LUX.adam.text(true), 1500);
    if (params.get("guest")) setTimeout(() => LUX.people.enterGuest(params.get("guest")), 1500);
    if (params.has("adamvisit")) setTimeout(() => { state.adam = Math.max(state.adam, 70); LUX.adam.visit(); }, 1500);
    if (params.has("dj")) setTimeout(() => LUX.dj.start(), 800);
    // the tutorial: by itself the first time (or with ?guide), and from the ❓ Guide button
    LUX.tutorial.init();
    if (params.has("guide") || (!state.tutorialSeen && !params.has("dj"))) setTimeout(() => LUX.tutorial.start(), 1800);
  })();
})();
