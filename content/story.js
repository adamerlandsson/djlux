// ============================================================
//  THE PLAN (📚 Skule button) – Anna's story, chapter by chapter.
//
//  1. Get kicked out of NTNU (cheat with AI → Professor RipeiSåle)
//  2. Ski season in Japan (powder + a van that always breaks → the Van)
//  3. Teacher in Ål (teach maths + ski at Ål skisenter → Swedish Adam, who always skis first)
//
//  goals: { stat, need, text } – stats are counted in js/story.js (STATS)
//  actions: buttons on the chapter card. game = cheat | boss:<id> | powder:<mode> | teacher
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.story = {
  title: "Planen",
  dream: "Draumen: lærar i Ål, og ski i Ål skisenter KVAR dag.",
  chapters: [
    {
      id: "ntnu",
      title: "Kapittel 1: Bli kasta ut av NTNU",
      intro: [
        "Okei. Planen. Høyr godt etter.",
        "E ska bruke KI på ein skuleprøve. Med vilje. Og bli kasta ut av NTNU.",
        "Då slepp e rapportar KVAR veke, og e kan dra på skisesong i vår!",
        "Men Professor RipeiSåle må TRU at e juksa. Han æ ikkje lett å lure. Eller... han æ veldig lett å lure. Det æ problemet.",
      ],
      tip: "📱 Jukseøkt: 1) kopier KI-tekst medan professoren har ryggen til, 2) slepp når han snur seg, 3) når arket har nok KI-tekst (70 %): la han SJÅ deg kopiere, så du blir teken. Så: 🎓 overtyd Professor RipeiSåle om at du juksa.",
      actions: [
        { label: "📱 Start jukseøkt", game: "cheat" },
        { label: "🎓 Møt Professor RipeiSåle", game: "boss:ripeisaale", need: { stat: "cheatPassed", n: 1 } },
      ],
      goals: [
        { stat: "cheatPassed", need: 1, text: "Bli teken i juks (med nok KI-tekst)" },
        { stat: "boss_ripeisaale", need: 1, text: "Overtyd Professor RipeiSåle" },
      ],
      reward: { coins: 150, item: "kasta_ut", achievement: "Kasta ut av NTNU" },
      done: [
        "E ÆR KASTA UT! E æ fri! FRI!",
        "Mamma kjem til å... nei. Ikkje tenk på mamma.",
        "JAPAN, HER KJEM E! Med ein gammal van e kjøpte på nettet. Kå kan gå gale?",
      ],
    },
    {
      id: "japan",
      title: "Kapittel 2: Skisesong i Japan",
      intro: [
        "Japan! Med Fuji-fjellet i bakgrunnen og meir snø enn heile Hallingdal! LAUSSNØ TE PUNGEN!",
        "E he kjøpt ein van. Han æ frå 1998 og heiter Takeshi.",
        "Takeshi he... nokre problem. Men det fiksar e. E he sett ein YouTube-video.",
      ],
      tip: "🎿 Pudderkjøring: styr Anna (mus / piltastar) og samle ❄️ laussnø. Unngå tre og stein. Når vanen streikar, vel rett verktøy FORT. Så: 🚐 sjefskampen mot sjølve vanen.",
      actions: [
        { label: "🎿 Køyr pudder i Japan", game: "powder:japan" },
        { label: "🚐 Sjefskamp: Vanen", game: "boss:van", need: { stat: "vanFixes", n: 4 } },
      ],
      goals: [
        { stat: "powderJapan", need: 150, text: "Samle 150 ❄️ laussnø i Japan (totalt)" },
        { stat: "vanFixes", need: 4, text: "Fiks vanen 4 gonger" },
        { stat: "boss_van", need: 1, text: "Tem vanen" },
      ],
      reward: { coins: 220, item: "japan_powder", achievement: "Pudderdronning" },
      done: [
        "Takeshi køyrer! Takeshi æ temja! Takeshi... røyk litt. Men han køyrer!",
        "Beste sesongen i mitt liv. E he snø i øyra framleis.",
        "No: heim til Ål. Det æ på tide å bli vaksen. Litt.",
      ],
    },
    {
      id: "al",
      title: "Kapittel 3: Lærar i Ål",
      intro: [
        "Heime i Ål! E he fått jobb som mattelærar! Utan utdanning! Dei va desperate!",
        "Planen: undervise til klokka to, så Ål skisenter.",
        "Men Adam he flytta hit. Og han dreg ALLTID på ski fyrst og let mæg sitje heime med ungane.",
        "Ikkje i dag, Adam. IKKJE i dag.",
      ],
      tip: "🧮 Matte-time: svar på spørsmåla til elevane før tida går ut. 🎿 Ål skisenter: køyr ein tur. Så: 🇸🇪 sjefskampen mot Adam – kvenn tek ungane i dag?",
      actions: [
        { label: "🧮 Matte-time", game: "teacher" },
        { label: "🎿 Ål skisenter", game: "powder:al" },
        { label: "🇸🇪 Sjefskamp: Svenske Adam", game: "boss:adam", need: { stat: "lessonsPassed", n: 2 } },
      ],
      goals: [
        { stat: "lessonsPassed", need: 2, text: "Hald 2 godkjende mattetimar" },
        { stat: "powderAl", need: 80, text: "Samle 80 ❄️ i Ål skisenter (totalt)" },
        { stat: "boss_adam", need: 1, text: "Vinn over Adam: han tek ungane" },
      ],
      reward: { coins: 300, item: "al_laerar", achievement: "Lærar i Ål" },
      done: [
        "Adam tek ungane! E ska på ski! KVAR DAG!",
        "Draumen æ oppnådd. Lærar i Ål. Ski i Ål skisenter. Adam heime med... ja. Vi snakkar ikkje om det.",
        "Men... e he aldri hoppa strikk naken i Asia. Enno.",
      ],
    },
    { id: "asia", title: "Kapittel 4: Backpacking i Asia", soon: true,
      teaser: "Strikkhopp. Naken. Kjem snart." },
  ],
  soonLine: "Neste kapittel æ ikkje skrive enno... Kjem snart!",
};

// ============================================================
//  📱 JUKSEØKT (chapter 1): hold to copy from the AI while the professor isn't looking.
// ============================================================
LUX.content.cheat = {
  seconds: 50,
  copyPerSecond: 9,         // % of the KI-text per second while holding
  need: 70,                 // % KI-text you need on the sheet before getting caught counts
  suspicionPerSecond: 45,   // when he SEES you copying
  calmPerSecond: 4,         // suspicion fades while you're not copying
  turnedSeconds: [2.5, 5],  // how long he writes on the board (safe to copy)
  watchSeconds: [1.5, 3],   // how long he stares at the class
  warnSeconds: 1.0,         // he clears his throat before turning around

  // the how-to card shown before the game starts
  intro: {
    goal: "Målet: bli TEKEN i juks – men berre når arket er fullt av KI-tekst. Då blir du kasta ut av NTNU (og kan dra på skisesong)!",
    steps: [
      ["🟢", "Når professoren skriv på tavla (ryggen til): HALD inne «Kopier» (eller SPACE) for å fylle arket med KI-tekst."],
      ["🟡", "Når han kremtar, snur han seg snart: SLEPP knappen!"],
      ["🔴", "Ser han deg kopiere før arket er fullt nok, trur han berre du sit på mobilen – og du får berre ei åtvaring. Det vil vi IKKJE."],
      ["✅", "Når KI-baren har passert den kvite streken (70 %): kopier MEDAN han ser på deg. Mistanke-baren fyllest – og du blir teken. Det er planen!"],
    ],
  },

  // the big banner during the game: what to do right now
  banner: {
    turned: "🟢 Han skriv på tavla – HALD «Kopier» no!",
    warn: "🟡 *kremt* Han snur seg – SLEPP!",
    watch: "🔴 Han ser på klassen – ikkje kopier enno!",
    watchSeen: "🔴 HAN SER DEG! Slepp – arket er ikkje fullt nok enno!",
    ready: "✅ Nok KI-tekst! No: kopier MEDAN han ser på deg, så du blir teken!",
    readyTurned: "✅ Nok KI-tekst! Vent til han snur seg – og kopier rett framfor auga hans.",
    readySeen: "✅ JA! Han ser deg – hald fram til mistanke-baren er full!",
  },

  lines: {
    start: "Prøve i matematikkdidaktikk. Mobilar i sekken. ALLE mobilar.",
    turn: ["*skriv på tavla*", "La oss sjå på oppgåve 3...", "*teiknar ein trekant*"],
    warn: ["*kremt*", "Hm?", "*snur seg sakte*"],
    watch: ["*stirer på klassen*", "Eg ser alt.", "Nokon som har spørsmål?"],
    seen: ["Anna? Kva er det du har der?", "ANNA. Er det ein MOBIL?", "Kva står det på skjermen din?!"],
    copying: ["*skriv fort*", "Sjølvsagt! Her er svaret ditt:", "Copy... paste...", "Takk, KI-en!"],
    tooEarly: "For tidleg! Arket hadde for lite KI-tekst, så han trur du berre sat på sosiale medium. «Siste åtvaring, Anna.» Ingen utkasting... Tips: kopier berre når han har ryggen til, til KI-baren passerer den kvite streken.",
    caught: "TEKEN! Med KI-tekst på heile arket! Perfekt! Han er SÅ sint!",
    timeout: "Tida ute... du vart aldri teken, så du leverte ein ekte prøve. Det verste som kunne skje. Tips: når KI-baren er over streken, kopier MEDAN han ser.",
  },
};

// ============================================================
//  🎿 PUDDERKJØRING – steer down the mountain, collect powder, avoid trees and rocks.
//  mode japan: the van breaks down every now and then (pick the right tool fast).
// ============================================================
LUX.content.powder = {
  seconds: 40,
  modes: {
    free: { title: "🎿 Laussnø-tur", place: "Ein fjellside i Hallingdal" },
    japan: { title: "🎿 Pudder i Japan", place: "Ved Fuji-fjellet", van: true, more: 1.3 },
    al: { title: "🎿 Ål skisenter", place: "Ål skisenter", more: 0.9 },
  },
  items: [
    { kind: "powder", emoji: "❄️", points: 1, weight: 10 },
    { kind: "powder", emoji: "🌨️", points: 3, weight: 2 },
    { kind: "bad", emoji: "🌲", weight: 3 },
    { kind: "bad", emoji: "🪨", weight: 1.5 },
    { kind: "bonus", emoji: "🍜", weight: 0.6, line: "Ramen! Energi!" },
  ],
  crashPenalty: 3,
  vanEvery: [9, 14],      // seconds between breakdowns (japan)
  vanSeconds: 4,          // time to pick the right tool
  vanProblems: [
    { text: "🚐 Takeshi kokar! Kvit røyk frå panseret!", fix: "💧 Kjølevatn", wrong: ["🔨 Hammar", "🎵 Høgare musikk"] },
    { text: "🚐 Takeshi startar ikkje. Klikk, klikk, klikk...", fix: "🔋 Startkablar", wrong: ["💧 Kjølevatn", "🧹 Kost"] },
    { text: "🚐 Takeshi står fast i laussnø!", fix: "⛓️ Snøkjetting", wrong: ["🔋 Startkablar", "🍜 Ramen"] },
    { text: "🚐 Sidespegelen datt av!", fix: "🩹 Gaffatape", wrong: ["⛓️ Snøkjetting", "💧 Kjølevatn"] },
    { text: "🚐 Vindusviskarane frys fast!", fix: "🧴 Frostvæske", wrong: ["🩹 Gaffatape", "🔨 Hammar"] },
    { text: "🚐 Det bankar frå hjulet!", fix: "🔧 Skiftenøkkel", wrong: ["🧴 Frostvæske", "🎵 Høgare musikk"] },
  ],
  lines: {
    start: ["LAUSSNØ TE PUNGEN!", "Sjå på dette! Pudder heilt opp!", "Her kjem DJ LUX!"],
    crash: ["AU! Tre!", "Stein! Kvenn la den der?!", "Den va meint. Backflip-forsøk."],
    vanFixed: ["Fiksa! Takeshi lever!", "Ha! YouTube-mekanikar!", "Takeshi, du æ fin igjen."],
    vanFailed: ["Nei nei nei, Takeshi!", "Feil verktøy... han røyk meir no.", "Takeshi æ sint på mæg."],
    end: { great: "For ein tur! Snø i alle hol!", ok: "Fin tur! Litt for mykje tre.", bad: "Eg såg fleire tre enn snø." },
  },
};

// ============================================================
//  🧮 MATTE-TIME (chapter 3): the pupils ask, you answer before the bell.
// ============================================================
LUX.content.teacher = {
  seconds: 60,
  questionSeconds: 8,
  need: 0.7,        // share right to pass
  questions: 10,
  pupils: ["Ola", "Kari", "Torstein", "Ingrid", "Sigurd", "Mathilde", "Halvor", "Live"],
  distractions: [
    "📱 Melding frå Adam: «Åker till backen nu! Hej då!»",
    "❄️ SNØVARSEL: 30 cm laussnø i Ål skisenter!",
    "📱 Hadi: «kem e han Edvin egt?»",
    "🔔 Ein elev: «Lærar, kan du vise ein backflip?»",
  ],
  lines: {
    right: ["Riktig! Godt jobba!", "Ja! Du blir mattelærar ein dag du òg.", "Perfekt!"],
    wrong: ["Hmm, nesten! Eller... ikkje nesten.", "Nei, men fint forsøk!", "Det va... kreativt."],
    passed: "Timen æ ferdig! Alle lærte noko! Mest e. No: SKI!",
    failed: "Ungane lærte ingenting. E lærte at e treng kaffi.",
  },
};

// ============================================================
//  BOSS FIGHTS – the same engine for all three (js/games/boss.js).
//  enemy bar goes down on a right answer, Anna's bar goes down on a wrong / slow one.
//  q: the question, a: answers – the RIGHT one is always first (they get shuffled).
//  helps: heal (+Anna's bar), fifty (removes two wrong), skip (damage + next question)
// ============================================================
LUX.content.bosses = {
  ripeisaale: {
    name: "Professor RipeiSåle",
    face: "🧑‍🏫",
    image: "assets/sprites/ripeisaale/face.png",
    enemyBar: "🧐 Trur du er uskuldig",
    playerBar: "😬 Nervar",
    task: "Vel svaret som avslører at du brukte KI. Du VIL bli kasta ut!",
    seconds: 14, secondsAngry: 10, hit: 14, speedBonus: 6, wrong: 20, timeout: 25,
    helps: [
      { kind: "heal", label: "💊 Pust med magen", amount: 30, line: "*pustar* Ro. E æ ein skodespelar. Revy-trening, vettu.", enemy: "Kvifor puster du så rart?" },
      { kind: "fifty", label: "📞 Ring Hadi (50/50)", line: "Hadi kviskrar: «ta det som høyres mest ut som ein robot.»", enemy: "Ringer du nokon? NO?!" },
      { kind: "skip", label: "🎭 Revy-avleiing", damage: 12, line: "*gjer ein dramatisk monolog om Pythagoras*", enemy: "...kva i all verda var det?" },
    ],
    lines: {
      start: ["Anna. Sett deg. Vi må snakke om rapporten din.", "Eg har lese rapporten din. To gonger. Han var... perfekt. Mistenkeleg perfekt."],
      ask: ["Spørsmål:", "Forklar meg dette:", "Og så:"],
      hit: ["...dette er ikkje skrive av eit menneske.", "Du innrømmer det?!", "Eg trudde aldri du ville... ANNA!"],
      miss: ["Hm. Det høyrdest ekte ut. Kanskje du er uskuldig likevel.", "Det var faktisk eit godt svar. Irriterande."],
      timeout: ["Du seier ingenting? Det er mistenkeleg uskuldig.", "Stillheit. Typisk ærleg student."],
      angry: "Eg skjønar ingenting lenger. Svar FORT.",
      won: "ANNA. Du er herved KASTA UT av NTNU. Ut. UT!",
      lost: "Veit du kva? Eg trur deg. Du er uskuldig. Lever neste rapport på fredag.",
      annaWon: "JAAA! E æ kasta ut! Takk, professor! Ha det!",
      annaLost: "Nei! Han trudde på mæg! Det verste som kunne skje! Ny rapport på fredag...",
    },
    questions: [
      { q: "Kven skreiv denne rapporten?", a: ["«Som ein KI-språkmodell kan eg ikkje ha forfattarskap.»", "Eg, sjølvsagt.", "Det var eit gruppearbeid.", "Eg og Sandra, over dirty fries."] },
      { q: "Kvifor står det «Regenerer svar» nedst på side 4?", a: ["Det er ein viktig del av den pedagogiske metoden.", "Det er ein trykkfeil.", "Det står ikkje der.", "Kva for side?"] },
      { q: "Kvifor er rapporten på perfekt nynorsk når du snakkar hallingmål?", a: ["Eg har ein assistent. Han er veldig flink. Og digital.", "Eg øvde i heile sommar.", "Mamma er norsklærar.", "Kva meiner du? Eg snakkar alltid sånn."] },
      { q: "Kva er kjeldene dine?", a: ["Tolv bøker som dessverre ikkje finst.", "Pensumboka.", "Forelesingane dine.", "Hadi."] },
      { q: "Kvifor byrjar innleiinga med «Sjølvsagt! Her er rapporten din:»?", a: ["Eg er veldig høfleg mot meg sjølv.", "Det er ein vanleg måte å byrje på.", "Kva innleiing?", "Det var ein vits."] },
      { q: "Kor lang tid brukte du på rapporten?", a: ["Fire sekund. Kanskje fem.", "Tjue timar.", "Ei heil veke.", "Heile helga, derfor er eg trøytt."] },
      { q: "Kvifor har rapporten 47 emojiar?", a: ["🚀✨ Det gjer læringa meir engasjerande! 🎯", "Det er ikkje så mange.", "Det var autokorrektur.", "Eg likar emojiar."] },
      { q: "Kva er 7 · 8?", a: ["Godt spørsmål! La oss bryte det ned steg for steg...", "56.", "54.", "Det må eg sjekke med Hadi."] },
      { q: "Kvifor står det «Eg håpar dette hjelper!» i konklusjonen?", a: ["Eg håpar verkeleg at det hjelper.", "Det er ein vanleg avslutning.", "Det står ikkje der.", "Det var Sandra som skreiv det."] },
      { q: "Forklar Pythagoras' setning med eigne ord.", a: ["Absolutt! Her er ei utfyllande forklaring i fem punkt med kjelder.", "a² + b² = c².", "Noko med ein trekant.", "Pass."] },
      { q: "Kvifor refererer rapporten til «min kunnskapsavgrensing i 2023»?", a: ["Eg slutta å lære i 2023. Det var eit tungt år.", "Det er ein skrivefeil.", "Det handlar om pensum.", "Kva er ei kunnskapsavgrensing?"] },
      { q: "Kvifor heiter fila «rapport_final_KI_versjon3_ikkje_vis_professor.pdf»?", a: ["Det er eit veldig vanleg filnamn.", "Laptopen namngav ho sjølv.", "Det var Hadi som lagra ho.", "Kva fil?"] },
    ],
  },

  van: {
    name: "Vanen Takeshi",
    face: "🚐",
    image: "assets/sprites/van/face.png",
    enemyBar: "🚐 Takeshi sin trass",
    playerBar: "😤 Tolmod",
    task: "Takeshi he ALLE problema på ein gong. Vel rett reparasjon for kvart symptom!",
    seconds: 12, secondsAngry: 8, hit: 12, speedBonus: 5, wrong: 18, timeout: 22,
    helps: [
      { kind: "heal", label: "🍜 Ramen-pause", amount: 30, line: "*slurp* Ramen frå konbini. Ny energi!", enemy: "*Takeshi dryp olje i protest*" },
      { kind: "fifty", label: "📞 Ring Hadi (50/50)", line: "Hadi: «I Brønnøysund fiksa vi alt med gaffatape. Men ikkje det der.»", enemy: "*klikk... klikk...*" },
      { kind: "skip", label: "🦶 Spark på dekket", damage: 10, line: "*SPARK* Ta den, Takeshi!", enemy: "*motoren hostar... og går?!*" },
    ],
    lines: {
      start: ["*Takeshi hostar*", "*Takeshi lagar ein lyd ingen bil skal lage*"],
      ask: ["Nytt problem:", "No skjer dette:", "*Takeshi blinkar med alle lamper*"],
      hit: ["*motoren går jamnare*", "*Takeshi kviner nøgd*", "*ei lampe sluknar*"],
      miss: ["*PANG* Det gjorde det verre.", "*Takeshi røyk meir no*", "*ein ny lyd. Ein dårleg lyd.*"],
      timeout: ["*Takeshi ventar ikkje på nokon*", "*det dryp noko grønt*"],
      angry: "*ALLE varsellamper lyser. Takeshi er SINT.*",
      won: "*vrrrrooom* Takeshi køyrer som ein drøym!",
      lost: "*Takeshi døyr. Igjen.* Ein japansk bonde må slepe dykk...",
      annaWon: "TAKESHI! E elskar dæg! Til fjellet!",
      annaLost: "Takeshi... kvifor gjer du dette mot mæg? Ny runde i morgon.",
    },
    questions: [
      { q: "Kvit røyk frå panseret!", a: ["Fyll på kjølevatn", "Skru opp musikken", "Klapp han på panseret", "Køyr fortare"] },
      { q: "Han startar ikkje. Det klikkar berre.", a: ["Startkablar frå ein snill bonde", "Bytt dekk", "Skrik", "Spel DJ LUX for han"] },
      { q: "Det bankar frå hjulet i svingane!", a: ["Stram hjulboltane", "Svinge mindre", "Fyll olje", "Sett på snøkjetting"] },
      { q: "Vindusviskarane frys fast!", a: ["Spylarvæske med frostvæske", "Varmt vatn på ruta", "Køyr utan å sjå", "Ring Adam"] },
      { q: "Han står fast i to meter laussnø!", a: ["Spade og snøkjetting", "Gi meir gass", "Vent til våren", "Ta ein backflip ut"] },
      { q: "Oljelampa lyser!", a: ["Etterfyll motorolje", "Teip over lampa", "Fyll kjølevatn", "Ignorer, det går fint"] },
      { q: "Det luktar brent etter fjellvegen ned!", a: ["La bremsane kjøle seg, motorbrems neste gong", "Brems hardare", "Opne vindauga", "Kjøp eit luktetre"] },
      { q: "Dieselen he gelert i kulda!", a: ["Vinterdiesel og varm han opp", "Tilsett ramen-kraft", "Fyll bensin i staden", "Rist vanen"] },
      { q: "Sidespegelen datt av!", a: ["Gaffatape. Mykje gaffatape.", "Lim med tyggis", "Køyr utan", "Kjøp ein ny van"] },
      { q: "Ein ukjend lyd: «kling-klong»!", a: ["Sjekk eksosopphenget", "Skru opp musikken", "Det er truleg normalt", "Syng med"] },
      { q: "Batteriet er dødt etter ei kald natt!", a: ["Lad det, eller startkablar", "Bytt hjul", "Fyll kjølevatn", "Gi han ein klem"] },
    ],
  },

  adam: {
    name: "Svenske Adam",
    face: "🇸🇪",
    image: "assets/sprites/adam/face.png",
    enemyBar: "🇸🇪 Adam si sjølvtillit",
    playerBar: "🎿 Skilyst",
    task: "Kvenn dreg på ski i dag, og kvenn tek ungane? Vel det beste motargumentet!",
    seconds: 12, secondsAngry: 9, hit: 12, speedBonus: 6, wrong: 18, timeout: 22,
    helps: [
      { kind: "heal", label: "🍫 Kvikk Lunsj", amount: 30, line: "*knekk* Turmat. E æ klar.", enemy: "Får jag en bit? Snälla?" },
      { kind: "fifty", label: "📞 Ring Sandra (50/50)", line: "Sandra: «Anna, du fortener det. Ta ski.»", enemy: "Ringer du Sandra NU?" },
      { kind: "skip", label: "😘 Blunk til Adam", damage: 12, line: "*blunk*", enemy: "...vad pratade vi om? Jag glömde." },
    ],
    lines: {
      start: ["Hej! Det har kommit snö! Jag tänkte att jag åker först, va?", "God morgon, älskl... alltså, Anna. Hej. Jag åker skidor idag."],
      ask: ["Adam:", "Adam igjen:", "Men Adam seier:"],
      hit: ["...okej, det är en bra poäng.", "Hmm. Jävlar.", "Det... kan jag inte säga emot."],
      miss: ["Precis! Så jag åker!", "Haha, tack Anna! Hej då!", "Då är vi överens!"],
      timeout: ["Du säger ingenting? Då tolkar jag det som ett ja!", "Tystnad betyder ja i Sverige."],
      angry: "Okej, nu är jag lite irriterad. Snabbare argument, tack.",
      won: "Okej... DU åker. Jag tar barnen. Igen. Men bara idag!",
      lost: "Hej då! Barnen vill ha pannkakor! Ses i backen!",
      annaWon: "HA! Adam tek ungane! LAUSSNØ, HER KJEM E!",
      annaLost: "Han dro. IGJEN. E sit heime med ungane og pannekaker...",
    },
    questions: [
      { q: "«Jag åkte först igår, så det är rättvist att jag åker först idag också, va?»", a: ["Det æ ikkje sånn rettferd fungerer, Adam.", "Ok, det høyrest rettferdig ut.", "Kanskje.", "Ja, du æ søt."] },
      { q: "«Det har bara kommit 5 cm, det är inte värt det för dig.»", a: ["5 cm i Ål æ 50 cm i Stockholm. E dreg.", "Du har rett, e blir heime.", "Kva er ein centimeter?", "Eg likar ikkje snø uansett."] },
      { q: "«Barnen säger att du är roligast. De vill vara med dig.»", a: ["Då lærer dei at pappa òg kan vere morsom. Bra for dei.", "Åh, så søte. Eg blir.", "Er det sant?", "Kven av ungane?"] },
      { q: "«Jag har bott i Chamonix, jag behöver mer offpist-träning.»", a: ["E tek backflip i Ål skisenter. Kvenn treng trening?", "Ja, Chamonix er stort.", "Okei, du treng det meir.", "Kva er offpist?"] },
      { q: "«Vi kan väl turas om? Jag idag, du nästa vecka.»", a: ["Neste veke meldar dei regn. Netter forsøk.", "Greitt, neste veke.", "Kanskje i påska.", "Eg veit ikkje."] },
      { q: "«Jag har redan packat bilen.»", a: ["Fint! Då æ han klar til mæg.", "Åh, då er det for seint.", "Pakka du skia mine òg?", "Du er så effektiv."] },
      { q: "«Du kan ju rätta matteprov idag istället.»", a: ["Eg retta dei i natt. Med hovudlykt.", "Ja, det må eg.", "Kan du rette dei?", "Kva prov?"] },
      { q: "«Mamma kommer och hälsar på i eftermiddag.»", a: ["Perfekt! Då kan mor di passe ungane.", "Åh nei, då må eg rydde.", "Skal eg lage middag?", "Kva tid kjem ho?"] },
      { q: "«Jag lovade barnen att du skulle baka bullar.»", a: ["Du lova. Du bakar. Ha det!", "Okei, eg bakar.", "Kor mange bollar?", "Med kanel?"] },
      { q: "«Men jag är ju svensk, vi delar lika!»", a: ["Nettopp. Del likt: e tek ski, du tek ungar.", "Det er sant.", "Eg er norsk, vi deler ikkje.", "Kva betyr «lika»?"] },
      { q: "«Det är jättekallt ute, du fryser ju alltid.»", a: ["E he varme skisko frå Ål. Kvenn fryse no?", "Ja, det er kaldt.", "Eg tek på ullundertøy og blir heime.", "Du har rett."] },
    ],
  },
};
