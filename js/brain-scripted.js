// Offline brain: no AI, just content files + dice rolls.
// Contract (shared with the Claude brain):
//   reply({ message, events, state }) -> Promise<{ text, expression, events, effects }>
window.LUX = window.LUX || {};

LUX.ScriptedBrain = (() => {
  const C = LUX.content;
  const pick = arr => LUX.ui.pick(arr);   // no-repeat pick (js/ui.js)
  const chance = p => Math.random() < p;

  // the lower DIALEKT, the more Hallingdal words turn into Oslo-speak (she gets shy)
  function oslo(text, dialekt) {
    if (dialekt >= 70) return text;
    const p = Math.min(1, (70 - dialekt) / 55);
    for (const [hal, os] of Object.entries(C.osloSwaps)) {
      const re = new RegExp(`(?<![\\wæøåÆØÅ])${hal}(?![\\wæøåÆØÅ])`, "gi");
      text = text.replace(re, m => {
        if (!chance(p)) return m;
        if (m === m.toUpperCase() && m.length > 1) return os.toUpperCase();
        return m[0] === m[0].toUpperCase() ? os[0].toUpperCase() + os.slice(1) : os;
      });
    }
    if (dialekt < 30 && chance(0.6)) text = text.replace(/([^.!?])([.!?])/, `$1, ${pick(C.osloFillers)}$2`);
    return text;
  }

  function matches(message, keyword) {
    const lower = message.toLowerCase();
    if (keyword.includes(" ")) return lower.includes(keyword);
    const words = lower.split(/[^a-zæøåäö0-9]+/);
    return words.some(w => (keyword.length <= 3 ? w === keyword : w.startsWith(keyword)));
  }

  // words that keep their capital letter when an opener ("Altså, ") is glued in front
  const PROPER = ["Adam", "Hadi", "Sandra", "Emma", "Marthe", "Jenny", "Idunn", "Hennie", "Edvin", "Ål", "Gol", "Hemsedal",
    "Hallingdal", "Trondheim", "Oslo", "Bygdøy", "Molde", "Sverige", "Stockholm", "Chamonix", "Japan", "Niseko", "Torghatten",
    "Brønnøysund", "Grafen", "Tyven", "Samfundet", "Vassfjellet", "Kannikestredet", "Bakklandet", "Professor", "RipeiSåle",
    "Pythagoras", "Robyn", "Yr", "Skal", "Fæst", "Jubileumsgallaen", "Grandiosa", "Kvikk", "TF", "DJ", "NTNU", "Fika"];
  const adamCache = {};
  const adamLines = lv => adamCache[lv] || (adamCache[lv] = [...C.adam.questions.filter(q => q[lv]).flatMap(q => q[lv]), ...C.adam.stories]);

  function greeting(state) {
    const ctx = C.contexts[state.context] || C.contexts.home;
    return Array.isArray(ctx.greetings) ? pick(ctx.greetings) : pick(ctx.greetings[state.moodLabel]);
  }

  // "(...)" messages describe a situation from the game, not something the user said
  function situation(msg, state) {
    const ctx = C.contexts[state.context] || {};
    if (/restless/.test(msg)) return { text: pick([
      "E MÅ ut! Fæst, DJ, ski, kva som helst! No!",
      "Festlysta mi æ på hundre. Kvenn bli med på Tyven?",
      "Æ dæ nokon som vi hoppe strikk? Eller berre... dans?",
    ]), expression: "party" };
    if (/refuses to DJ/.test(msg)) return { text: pick(ctx.refuseDJ || ["Ikkje no."]), expression: state.context === "hungover" ? "hungover" : "annoyed" };
    if (/refuses to study/.test(msg)) return { text: pick(ctx.refuseStudy || ["Nei."]), expression: state.context === "hungover" ? "hungover" : "grumpy" };
    if (/arrives|wakes up|starts/.test(msg)) return { text: greeting(state), expression: null };
    return null;
  }

  function baseExpression(state) {
    const by = { hungover: "hungover", sofa: "lounging", school: "busy", vors: "party", pils: "party", asleep: "sleepy" };
    return by[state.context] || { happy: "happy", grumpy: "grumpy", neutral: "neutral" }[state.moodLabel] || "neutral";
  }

  async function reply({ message, events = [], state }) {
    const msg = message.trim();
    let expression = baseExpression(state);
    let effects = {};
    const parts = [];

    const sit = msg.startsWith("(") && situation(msg, state);
    if (sit) {
      parts.push(sit.text);
      expression = sit.expression || expression;
    } else {
      // remember names – must be Capitalized so "jeg er sulten" doesn't make your name "sulten"
      const nameMatch = msg.match(/(?:[Mm]y name is|[Ii]'m|[Ii] am|[Jj]eg heter|[Ee]g heiter|[Jj]eg er|[Ee]g er)\s+([A-ZÆØÅ][a-zæøå]+)/);
      const rule = !nameMatch && C.reactions.find(r => r.keywords.some(k => matches(msg, k)));

      if (state.adamFever && !nameMatch && chance(0.7)) {
        parts.push(pick(C.adamMeter.fever.during));
        expression = "dreamy";
      } else if (state.context === "asleep" && !nameMatch && chance(0.75)) {
        parts.push(pick(C.contexts.asleep.lines));
      } else if (nameMatch) {
        effects.name = nameMatch[1];
        parts.push(`Hei ${nameMatch[1]}! Fint namn. Nesten eit Hallingdal-namn.`);
        expression = "happy";
      } else if (state.context === "hungover" && rule && /mat|fries|pizza|food|sulten/i.test(msg)) {
        parts.push(pick(C.contexts.hungover.food));
        effects = { mood: 15 };
      } else if (state.context === "hungover" && chance(0.5)) {
        parts.push(pick(C.contexts.hungover.lines));
      } else if (rule) {
        // Adam: what she says depends on the ADAM-O-METER (content/adam.js)
        const adamRule = rule.keywords.includes("adam");
        const lv = state.adamLevel || "shy";
        let line = adamRule && lv !== "shy" && chance(0.8)
          ? pick(adamLines(lv))
          : pick(rule.replies);
        if (line === "@greeting") line = greeting(state);
        line = line.replace(/@(\w+)/g, (_, k) => pick(C[k] || [""]));
        if (state.name && chance(0.3)) line = `${state.name}! ${line}`;
        parts.push(line);
        if (!["hungover", "sofa"].includes(state.context)) expression = adamRule ? { shy: "guilty", open: "happy", smitten: "dreamy" }[lv] : rule.expression || expression;
        effects = { ...effects, ...rule.effects };
      } else if (chance(0.3)) {
        parts.push(`Visste du forresten dette? Hadi sa det: ${pick(C.hadiFacts)}`);
        expression = "excited";
      } else {
        parts.push(pick(C.fallbacks));
      }

      // situation flavour on top
      const ctx = C.contexts[state.context];
      if (["school", "training", "pils", "vors", "sofa"].includes(state.context) && ctx.lines?.length && expression !== "shy" && chance(0.35)) parts.push(pick(ctx.lines));
      if (state.context === "home" && state.moodLabel === "grumpy" && chance(0.45)) {
        parts.push(pick(C.contexts.home.grumpy));
        expression = "grumpy";
      }
      if (state.context === "home" && state.moodLabel === "happy" && !["shy", "grumpy", "guilty"].includes(expression) && chance(0.3)) parts.push(pick(C.contexts.home.happy));
      if (state.context === "hungover" && chance(0.4)) parts.push(pick(C.rescue.worry));

      if (chance(0.22)) {
        const opener = pick(C.openers);
        const first = parts[0].split(/[\s!,.?]/)[0];
        const keep = !opener.endsWith(", ") || (first.length > 1 && first === first.toUpperCase()) || [state.name, ...PROPER].includes(first);
        parts[0] = opener + (keep ? parts[0] : parts[0][0].toLowerCase() + parts[0].slice(1));
      }
      const last = parts.length - 1;
      if (chance(0.3) && /\.$/.test(parts[last])) parts[last] = parts[last].slice(0, -1) + pick(C.closers);
    }

    if (events.includes("ADAM") && !/adam/i.test(parts.join(" "))) {
      parts.push(pick(C.adam.mentions[state.adamLevel || "shy"]));
      if (!["hungover", "sofa"].includes(state.context)) expression = "dreamy";
    }

    return { text: oslo(parts.join(" "), state.dialekt ?? 90), expression, events, effects };
  }

  return { name: "offline", reply };
})();
