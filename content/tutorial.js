// ============================================================
//  TUTORIAL – the guide that shows every feature. It starts by itself the first time the game is opened,
//  and again from the ❓ Guide button. You can click through it (Neste / Tilbake, or ← →) or close it
//  any time (✖ or Esc).
//
//  target: what to point at (a CSS selector – the first one that exists is used, several can be listed
//          with commas). No target = a card in the middle of the screen.
//  title / text: what it says. Edit freely!
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.tutorial = [
  {
    title: "Velkommen til DJ.LUX! 🎧🎿",
    text: "Dette er eit spel om Anna frå Ål – DJ, skientusiast, TF-leiar for Fæst & Blæst, og (snart) kasta ut av NTNU. " +
      "Denne guiden viser deg alt du kan gjere. Klikk «Neste», eller lukk han når som helst med ✖ om du kjenner spelet frå før.",
  },
  {
    target: "#stage",
    title: "Anna sitt liv",
    text: "Her bur Anna, i kollektivet i Kannikestredet i Trondheim. Ho følgjer den EKTE klokka og veka: sirkeltrening på måndag, " +
      "«Skal vi danse» på tysdag, skule på onsdag, TF-pils på Tyven på torsdag, vors på laurdag og fyllesjuk søndag. Om natta søv ho.",
  },
  {
    target: "#anna",
    title: "Klikk på Anna",
    text: "Klikk på Anna, så reagerer ho. Andletet hennar endrar seg etter humøret – glad, sur, forelska, fyllesjuk...",
  },
  {
    target: '.hotspot[data-label="Vindauget"]',
    title: "Vindauget – Hadi, Jenny, Idunn, Hennie og Adam",
    text: "Klikk på vindauget: då står Hadi (fun facts og «kem e han Edvin egt?»), Jenny («As you shouuuuld, SLAYYY!»), " +
      "Idunn («Tøm og røm!» – og massasje), Hennie (INGEN peanøtter!) eller svenske Adam utanfor. " +
      "Trykk «🚪 Kom inn», så kjem dei inn i stua. Dei dukkar òg opp av seg sjølv innimellom.",
  },
  {
    target: "#msg",
    title: "Prat med gjestane",
    text: "Når nokon er på besøk, går det du skriv her til BÅDE gjesten og Anna – dei svarar etter tur. " +
      "Knappen «💬 Prat» ved gjesten får dei til å prate av seg sjølv, og «👋 Ha det» sender dei heim.",
  },
  {
    target: '.hotspot[data-label="Sandra sitt rom"], #stage',
    title: "Romkameratane",
    text: "Sandra, Marthe og Emma bur her òg. Klikk på dørene deira – eller vent, så stikk dei hovudet ut. " +
      "(Emma vil IKKJE ha Anna og Adam på rommet sitt.)",
  },
  {
    target: "#hotspots",
    title: "Ting du kan klikke på",
    text: "Før musa over rommet: alt med stipla kant kan du klikke på – TV-en, skia, discokula, Ål-plakaten, lampa, " +
      "mobilen, dirty fries på bordet og DJ-pulten. På skulen, i gymsalen og på Tyven er det andre ting.",
  },
  {
    target: "#clock",
    title: "Kvar og korleis",
    text: "Her ser du dag og klokkeslett, kvar Anna er, humøret hennar (😄 😐 😤) og kva ho har på seg.",
  },
  {
    target: "#timetravel",
    title: "Tidsreise ⏰",
    text: "Vil du sjå vors på laurdag eller fyllesjuke søndag med ein gong? Vel ei tid her. «Ekte tid» tek deg tilbake til no.",
  },
  {
    target: ".meters",
    title: "Måla",
    text: "🪙 mynter · 🎧 DJ-nivå · 🎿 ting i SKI-magasinet\n" +
      "HUMØR – kor glad ho er (ski og svenske gutar = opp, skule = ned)\n" +
      "FESTLYST – veks av seg sjølv; full = ho MÅ ut\n" +
      "DIALEKT – Ål-dialekt ↔ Oslo-mål (ho blir sjenert rundt Oslo-folk)\n" +
      "ADAM-O-METER – fullt = Adam-feber\n" +
      "DJ-SKILLS – blir betre for kvart DJ-sett",
  },
  {
    target: "#log",
    title: "Samtalen",
    text: "Alt som blir sagt kjem her. Skriv til Anna i feltet under – ho svarar på hallingmål. Prøv ord som «ski», «Hadi», " +
      "«svenske gutar», «Oslo» eller «skule».",
  },
  {
    target: "#brain-badge",
    title: "Hjernen 🧠",
    text: "«offline» = Anna svarar med ferdigskrivne replikkar. «Claude» = ekte KI-hjerne (krev Python + Claude Code, sjå README). " +
      "Alt anna i spelet fungerer likt i begge.",
  },
  {
    target: '[data-action="school"]',
    title: "📚 Skule – Planen",
    text: "Historia! Kapittel 1: bli kasta ut av NTNU (juks med KI – og bli tatt). Kapittel 2: skisesong i Japan med ein van som alltid " +
      "streikar. Kapittel 3: lærar i Ål. Kvart kapittel har mål og ein sjefskamp: Professor RipeiSåle, vanen og svenske Adam.",
  },
  {
    target: '[data-action="dj"]',
    title: "🎧 DJ – hovudspelet",
    text: "DJ LUX på Jubileumsgallaen til TF på Grafen! Trykk D F J K (eller pads-a) når tonane treffer linja. " +
      "Mellom låtane: still TEMPO på deck B til BPM-en er lik, start B på eittalet (raud lampe), og blend med faderane. " +
      "Gode overgangar = fullt dansegolv. Du får karakter S–D, mynter og premiar.",
  },
  {
    target: '[data-action="adam"]',
    title: "🇸🇪 Spør om Adam",
    text: "Spør Anna om Adam. I starten nektar ho å snakke om det – jo meir ADAM-O-METERET stig, jo meir fortel ho. " +
      "Adam sender òg meldingar, og då vel DU kva ho svarar.",
  },
  {
    target: '[data-action="clothes"]',
    title: "👗 Skift klede",
    text: "Byt mellom kleda ho eig: gallakjolar og skidressar. Fleire kan du kjøpe i butikken.",
  },
  {
    target: '[data-action="games"]',
    title: "🎮 Spel",
    text: "Alle minispela: DJ, laussnø-tur på ski, «Gibberish eller Hallingdal-ord?», «Kva sa Hadi?», «Fisk eller IKEA?», " +
      "redningsaksjon (fyllesjuk søndag), jukseøkt og mattetime i Ål.",
  },
  {
    target: '[data-action="study"]',
    title: "📖 Studer",
    text: "Svensktime for Adam si skuld: er ordet ein svensk fisk eller eit IKEA-møbel?",
  },
  {
    target: '[data-action="magazine"]',
    title: "🎿 SKI-magasin",
    text: "Samlinga di: ski frå Black Crows, Atomic, K2 og fleire, utstyr og medaljar som TF-medalja, «TF sin kjekkaste» og " +
      "«Sponsored Skier». Du vinn dei på DJ-sett og skiturar.",
  },
  {
    target: '[data-action="shop"]',
    title: "🛒 Butikk",
    text: "Bruk myntene: betre DJ-kontrollarar (lettare timing), lysshow (meir stemning), gallakjolar, skidressar – og dirty fries.",
  },
  {
    target: "#fact",
    title: "Dagens Hadi-fakta",
    text: "Hadi veit alt. Ein ny fun fact kvar dag – og når han er på besøk.",
  },
  {
    target: "#music-toggle",
    title: "🎵 Musikk",
    text: "Roleg bakgrunnsmusikk heile tida (ho skrur seg av når du DJ-ar). Klikk her for å slå ho av eller på.",
  },
  {
    target: "#savebar",
    title: "💾 Lagring",
    text: "Spelet lagrar AUTOMATISK i denne nettlesaren – du treng ikkje gjere noko. Men lagringa forsvinn om nettlesaren blir " +
      "tømt, og ho følgjer ikkje med til ein annan PC. Trykk «⬇️ Lagre til fil» for å ta ein kopi, og «⬆️ Hent fil» for å halde fram frå han.",
  },
  {
    target: "#guide-btn",
    title: "❓ Guide",
    text: "Denne guiden kan du opne igjen her når du vil.",
  },
  {
    title: "Klar? 🎉",
    text: "Det var alt! Tips: klikk på vindauget, start eit DJ-sett, og opne «📚 Skule» for å starte historia. " +
      "Laussnø te pungen, og lukke til!",
  },
];
