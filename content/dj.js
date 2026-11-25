// ============================================================
//  DJ LUX – the main game. JubileumsGalla 2026 TF (40 years of TF) at Grafen.
//
//  A set = 3 tracks of synthesized techno (js/music.js): intro → build → DROP → break → build → DROP → outro.
//  During a track, notes fall down 4 lanes (keys D F J K, or tap the pads) – fewer in the intro, most in the drop.
//  Between two tracks comes the TRANSITION on a first-person DJ board: match the BPM of deck B, start it on
//  the "1" (red lamp), then blend – channel fader A down, channel fader B up (W/S and ↑/↓, or drag; on a
//  phone you can drag both at once). You hear both decks through their faders while you blend.
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.dj = {
  venue: "Grafen",
  event: "JubileumsGalla 2026 TF",
  tracksPerSet: 3,
  perfectMs: 55,           // timing windows (the controller in the shop adds more)
  goodMs: 120,
  lanes: [
    { key: "KeyD", label: "D", name: "KICK", color: "#4fc3c8" },
    { key: "KeyF", label: "F", name: "CLAP", color: "#6ac94a" },
    { key: "KeyJ", label: "J", name: "SYNTH", color: "#e8c34a" },
    { key: "KeyK", label: "K", name: "DROP", color: "#e86a9a" },
  ],
  // how many notes per 8th note in each part of a track (0–1). The drop is busiest.
  density: { intro: 0.08, build: 0.14, drop: 0.24, break: 0.05, outro: 0 },
  // points
  perfect: 100, good: 50,
  heat: { perfect: 3, good: 1.5, miss: -5, drop: 12, mixPerfect: 25, mixGood: 12, mixBad: -20 },
  // grades from the share of max points (and the floor must not be empty)
  grades: [["S", 0.88], ["A", 0.72], ["B", 0.52], ["C", 0.33], ["D", 0]],
  coinsPerGrade: { S: 80, A: 55, B: 35, C: 20, D: 8 },
  xpPerGrade: { S: 18, A: 12, B: 8, C: 5, D: 2 },   // DJ-SKILLS
  dropChance: { S: 0.9, A: 0.6, B: 0.35, C: 0.15, D: 0.05 },  // chance of a ski / gear drop

  // the transition (POV DJ board)
  mix: {
    pitchOffset: [4, 10],  // the next track starts this many BPM off
    maxBars: 24,           // bars before the crowd gives up and you get an abrupt cut
    goodBlendBeats: [4, 32], // a smooth blend takes this many beats (too fast = abrupt)
  },

  // tracks: bpm, root (bass note in Hz), style = acid | hard | melodic | rave | minimal | house | trance
  tracks: [
    { name: "Laussnø te pungen (DJ LUX Edit)", bpm: 128, root: 55, style: "acid" },
    { name: "Hallingdal Hardstyle", bpm: 140, root: 49, style: "hard" },
    { name: "Swedish Boys (Limousine Mix)", bpm: 126, root: 58.27, style: "melodic" },
    { name: "Molde Folkehøgskule Anthem", bpm: 130, root: 61.74, style: "rave" },
    { name: "Bungy Naken i Bangkok", bpm: 138, root: 51.91, style: "hard" },
    { name: "Fæst & Blæst (TF-40 Remix)", bpm: 132, root: 55, style: "acid" },
    { name: "Silent Disco i Ål", bpm: 124, root: 65.41, style: "minimal" },
    { name: "Professor RipeiSåle (Angry Mix)", bpm: 145, root: 46.25, style: "hard" },
    { name: "Kem e han Edvin egt?", bpm: 127, root: 58.27, style: "rave" },
    { name: "Skal vi danse? (Paso Doble House)", bpm: 124, root: 61.74, style: "house" },
    { name: "Dirty Fries & Disco", bpm: 122, root: 55, style: "house" },
    { name: "Kanelbullar i Chamonix", bpm: 126, root: 65.41, style: "melodic" },
    { name: "Niseko Pudder (Van Breakdown Mix)", bpm: 136, root: 49, style: "trance" },
    { name: "Ål Skisenter 6:00 AM", bpm: 134, root: 51.91, style: "trance" },
    { name: "Dina (Baller Mix)", bpm: 142, root: 46.25, style: "hard" },
    { name: "As You Shouuuld (SLAYYY Edit)", bpm: 125, root: 58.27, style: "house" },
    { name: "Sirkeltrening (Burpee Acid)", bpm: 133, root: 51.91, style: "acid" },
    { name: "Hallingkast", bpm: 129, root: 61.74, style: "rave" },
    { name: "Laussnø til Pungen (Sunrise Mix)", bpm: 123, root: 65.41, style: "minimal" },
  ],

  lines: {
    intro: [
      "DJ LUX på Grafen! TF fyller 40! E æ SÅ klar!",
      "Kronlysa, gallakjolane, TF-folket... og MÆG bak pulten. Kom igjen!",
      "Jubileumsgallaen! Om dette går bra, blir e legende. Om ikkje, flyttar e heim til Ål.",
    ],
    perfect: ["JA!", "Rein!", "Sjå dei hoppe!", "LAUSSNØ!"],
    miss: ["Oi.", "Ingen høyrde det.", "Det va... meint.", "Ups!"],
    drop: ["DROOOP!", "HER KJEM DROPPET!", "HENDENE I VÊRET!"],
    mixStart: ["Overgang! Match BPM-en, start neste låt på eittaret, og blend!", "No: beatmatch! Sjå på lampene!"],
    mixPerfect: ["PERFEKT overgang! Dei merka det ikkje eingong!", "Sømlaust! Som ein 360 i laussnø!"],
    mixGood: ["Grei overgang! Litt ujamt, men dansegolvet lever!", "Okei! Ingen grein."],
    mixBad: ["Togkrasj... TOGKRASJ! Alle høyrde det!", "Det der va to sangar som slost. Uff."],
    floorEmpty: ["Dansegolvet æ tomt... Hallo? Kor gjekk alle?", "Berre Idunn dansar no. Og ho gjev massasje."],
    floorHot: ["Grafen KOKAR!", "Nokon starta ein moshpit på ein GALLA!", "Jenny ropar «SLAYYY»!"],
    result: {
      S: "Kå skjedde?! Heile TF stod på bordet! E æ ein legende!",
      A: "For eit sett! Grafen vil aldri bli den same!",
      B: "Bra sett! Nokon dansa. Mange dansa. E tel det som ein siger.",
      C: "Det gjekk... greitt. E skuldar på lydanlegget.",
      D: "Det æ ikkje eg, det æ Grafen sin akustikk. Truleg.",
    },
  },
};
