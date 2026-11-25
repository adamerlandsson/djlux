// ============================================================
//  ADAM – the Swedish ski bum from Stockholm (lived in Chamonix). Nobody knows what they are.
//
//  How Anna talks about him depends on the ADAM-O-METER:
//    shy      (under 35 %)  – denial, "vi snakkar ikkje om det"
//    open     (35–70 %)     – she opens up and tells little stories
//    smitten  (over 70 %)   – gushing... and then catching herself
//
//  questions: the "🇸🇪 Spør om Adam" menu. lines per level, effects on the meters.
//  texts:     Adam texts her now and then – you pick her reply.
//  visit:     when the meter is high, Adam sometimes knocks on the window. Emma has opinions.
//  stories:   little Adam facts she drops in conversation (open / smitten).
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.adam = {
  levels: { open: 35, smitten: 70 },

  questions: [
    {
      q: "Kå æ de to eigentleg?",
      shy: ["Kå vi æ? Ingenting. Vener. Skivener. Ikkje spør.", "*raudnar* Vi snakkar ikkje om det. Neste spørsmål."],
      open: ["Det æ... komplisert. Han æ fin. Vi æ... noko. Kanskje. Vi har ikkje snakka om det.", "Vi har ikkje definert det. Det æ veldig moderne av oss, sant?"],
      smitten: ["Kjærast? NEI! Altså... kanskje. Om han spør. Han har ikkje spurt. Køffer har han ikkje spurt?!", "Vi æ... *smiler* ...ingenting. Absolutt ingenting. *smiler meir*"],
      effects: { adam: 1 },
    },
    {
      q: "Korleis møttest de?",
      shy: ["Gjennom TF. Han va på ein tur. Det æ heile historia. Slutt."],
      open: ["På ein TF-tur! Han tok ein 360 og landa på rumpa rett framfor mæg. E lo så e grein.", "Han spurde om e ville låne goggles. Han hadde sine eigne. Ingen låner goggles."],
      smitten: ["På toppen av ein topptur. Sola gjekk ned, han sa «härligt», og e tenkte: å nei. Å NEI.", "Han delte Kvikk Lunsj med mæg på toppen. Ein heil fjerdedel. Svenskar deler ALDRI Kvikk Lunsj."],
      effects: { adam: 1, mood: 5 },
    },
    {
      q: "Kå likar du med han?",
      shy: ["Likar? Han har fine ski. Det æ alt.", "Han æ... grei. Normalt grei. Heilt vanleg grei."],
      open: ["Han æ roleg. Og han lagar kanelbullar. Og han seier «kul» på den svenske måten.", "Han ler av vitsane mine. Sjølv dei dårlege. SÆRLEG dei dårlege."],
      smitten: ["Alt?! Håret. Latteren. At han har budd i Chamonix men ALDRI snakkar om det. Okei, han snakkar litt om det.", "Han heldt handa mi i skiheisen. I tre sekund. E tel framleis."],
      effects: { adam: 1.5, mood: 10 },
    },
    {
      q: "Er han god på ski?",
      shy: ["Han æ... grei. E æ betre. Skriv det ned."],
      open: ["Han æ RÅ i offpist. Chamonix-skulert. Men e tek backflip og det gjer ikkje han. 1–0 til Ål.", "Han køyrer fort. Litt for fort. Litt for kult."],
      smitten: ["Han køyrer som om fjellet æ hans. Og så ventar han på mæg nedst. Kvar gong. *sukk*", "Han lærte mæg ein ny sving. E lærte han ein backflip. Han landa på hovudet. Det va romantisk."],
      effects: { adam: 1, festlyst: 5 },
    },
    {
      q: "Lær meg noko svensk han seier!",
      shy: ["Han seier «hej». Det æ alt e veit. Vi snakkar ikkje mykje. Ikkje på den måten. Uff."],
      open: ["«Härligt!» – det seier han om alt. Laussnø? Härligt. Pizza? Härligt. Mæg? ...også härligt.", "«Fika» – det æ kaffi, men heilag. Han tek fika tre gonger om dagen.", "«Lagom» – ikkje for mykje, ikkje for lite. Ingen i Hallingdal forstår dette ordet."],
      smitten: ["«Älskling»... nei, det har han ikkje sagt. E berre... øver. Glem det.", "«Mysig»! Det betyr koseleg. Han sa at e va mysig. MYSIG. Kå betyr det?!"],
      effects: { adam: 1, dialekt: -5 },
    },
    {
      q: "Skal du møte han i helga?",
      shy: ["Kanskje. Tilfeldigvis. Om han tilfeldigvis æ på same vors. Tilfeldigvis."],
      open: ["Han kjem kanskje på vors på laurdag. Jenny har allereie sagt «slayyy». Det hjelper ikkje.", "Vi ska kanskje på topptur søndag. Om e ikkje æ fyllesjuk. E kjem til å vere fyllesjuk."],
      smitten: ["JA. Laurdag. Og søndag. Og kanskje måndag. Ikkje sei det til Emma.", "Han spurde om e ville sjå på Skal vi danse med han. SKAL VI DANSE. Han veit kven e æ."],
      effects: { adam: 1.5, festlyst: 10 },
    },
    {
      q: "Kå synest Emma om han?",
      shy: ["Emma? Emma synest ingenting. Emma har ikkje noko med det. Køffer spør du?"],
      open: ["Emma likar han. Ho vil berre ikkje at han søv på rommet hennar. Det skjedde EIN gong. To.", "Emma og Adam snakkar svensk saman og eg forstår ingenting. Mistenkeleg."],
      smitten: ["Emma har sett lås på døra. På grunn av Adam. Eller på grunn av mæg. Vi veit ikkje.", "Emma sa «gud, ni är så gulliga». E trur det æ positivt. E har ikkje spurt."],
      effects: { adam: 0.5 },
      emma: true,
    },
    {
      q: "Send han ei melding!",
      text: true,
    },
  ],

  // dropped into conversation when the meter is open / smitten
  stories: [
    "Adam et kanelbulle til frukost. KVAR dag. Han seier det æ «tradition».",
    "Adam har ei lue han aldri tek av. Ikkje inne. Ikkje i dusjen. E trur.",
    "Adam budde i Chamonix i to år. Han seier «Chamonix» med fransk aksent. Det æ irriterande. Og fint.",
    "Adam sa at Hallingdal-dialekten min høyres ut som ein vits. Ein FIN vits, sa han.",
    "Adam tok med mæg på fika. Det va berre kaffi. Men det va ein fin kaffi.",
    "Adam veit kvenn Edvin æ. Han vil ikkje seie det.",
    "Adam seier «pjäxor» om skisko. E har slutta å rette på han. Det æ søtt.",
    "Adam voksa skia mine utan å spørje. Det æ det mest romantiske... det æ ein god service.",
    "Adam bakar ein eigen sats bullar til Hennie. Nøttefri. Med namnet hennar på.",
    "Adam er redd for Emma. Det æ det einaste han æ redd for. Bortsett frå skred.",
    "Adam sa at Ål skisenter har «mysig» stemning. MYSIG. Om Ål!",
    "Adam tek alltid fyrste tur i laussnøen. E tek andre. Og så tek e han igjen på flata.",
    "Adam lærte mæg å seie «det är lugnt». E seie det no når e ikkje æ rolig. Det hjelper ikkje.",
  ],
  // short Adam mentions for when the brain adds an ADAM event (per level)
  mentions: {
    shy: ["...forresten, Adam sende ei melding. Ikkje at det betyr noko.", "Adam? Kvenn snakka om Adam? Ingen. Bra.", "*sjekkar mobilen* Ingenting frå Adam. Ikkje at e bryr mæg.", "Ein svenske i backen i går? Ingen spesiell. Han heitte... ingen.", "*raudnar av ingen grunn* Det æ varmt her. Berre varmt."],
    open: ["Adam sa «härligt» i går. Berre så du veit.", "Apropos ingenting: Adam lagar kanelbullar på laurdag.", "*smiler til mobilen* ...ingenting. Det va ingenting.", "Adam og e ska kanskje på topptur. Som vener. Skivener.", "Adam sende ein video av snø i Åre. Med ein smiley. Ein vanleg smiley."],
    smitten: ["ADAM SENDE EIN HJARTE-EMOJI. Ein raud. Kå betyr ein raud?!", "Har e nemnt Adam i dag? Nei? Adam. Der. Ferdig.", "*sukk* Adam...", "Adam sa «vi». VI. Om oss. I ei setning om fika.", "E har lært meg svensk. «Älskar»... NEI. «Älg». E lærte «älg»."],
  },

  // Adam texts her – you choose the reply
  texts: {
    everySeconds: [190, 400],
    minMeter: 15,
    messages: [
      { from: "Hej! Pudder imorgon? 🎿",
        replies: [
          { text: "JA! Kl 08 i heisen!", line: "E sa ja. E SA JA. Kå har e gjort?!", effects: { adam: 2, mood: 15, festlyst: 10 }, reply: "Härligt! Ses! 😊" },
          { text: "Kanskje... 😏", line: "Kanskje. Spel det kult, Anna. SPEL DET KULT.", effects: { adam: 1, mood: 5 }, reply: "Haha okej, säg till 😉" },
          { text: "E har rapport 😩", line: "Rapport. Igjen. Rapporten øydela livet mitt OG kjærleikslivet mitt.", effects: { mood: -10 }, reply: "Nej! Rapporten kan vänta 😭" },
        ] },
      { from: "Bakade kanelbullar. Vill du ha? 🥐",
        replies: [
          { text: "KOM HIT MED DEI", line: "Kanelbullar! Han bakar! Han BAKAR!", effects: { adam: 2, mood: 20 }, reply: "Kommer om 10 min! 🥰" },
          { text: "Ta med til Sandra òg", line: "Sandra fortener bullar. Og e fortener ein god venninne-score.", effects: { adam: 1, mood: 10 }, reply: "Självklart! Hej Sandra 👋" },
          { text: "👀", line: "Ein emoji. Perfekt. Mystisk. Kul.", effects: { adam: 1 }, reply: "...👀?" },
        ] },
      { from: "Vad gör du? 😊",
        replies: [
          { text: "Ser Skal vi danse 💃", line: "Han får vite sanninga. Skal vi danse æ ein del av pakka.", effects: { adam: 1.5, mood: 5 }, reply: "Haha, jag kommer och tittar! Vem leder?" },
          { text: "DJ-ar! 🎧", line: "DJ LUX øver. Han kan få ein privat konsert. Kanskje.", effects: { adam: 1, dj: 2 }, reply: "Spela något för mig! 🔥" },
          { text: "Ingenting. Heilt ingenting.", line: "E sa ingenting. Det va mystisk. Eller rart. Mest rart.", effects: { adam: 0.5 }, reply: "Okej... mystiskt 🤔" },
        ] },
      { from: "Var det du som tog min mössa? 🧢",
        replies: [
          { text: "Nei 😇", line: "*har lua på seg* Nei. Absolutt ikkje.", effects: { adam: 1.5, mood: 10 }, reply: "Jag ser dig på Insta med den 😂" },
          { text: "Den æ min no", line: "Den æ min. Det æ reglane.", effects: { adam: 2 }, reply: "Okej, du får ha den då ❤️" },
          { text: "Spør Emma", line: "Emma veit alt. Emma får ta skulda.", effects: { adam: 0.5 }, reply: "Emma säger att det var du 😂" },
        ] },
      { from: "Ska vi gå på Tyven på torsdag? 🍻",
        replies: [
          { text: "Quiz-lag saman? 🧠", line: "Lag «Laussnø og Lagom». Vi kjem til å vinne. Eller krangle.", effects: { adam: 2, festlyst: 15 }, reply: "Vi vinner! Hadi får vara med" },
          { text: "Med heile TF!", line: "Med heile TF. Så det ikkje blir eit... ting. Det æ IKKJE eit ting.", effects: { adam: 1, festlyst: 10 }, reply: "Klart! Ju fler desto roligare" },
          { text: "Kanskje 🙈", line: "Kanskje. Klassisk Anna. Uforpliktande. Mystisk.", effects: { adam: 0.5 }, reply: "Haha okej 🙈" },
        ] },
    ],
  },

  // Adam knocks on the window (meter high)
  visit: {
    everySeconds: [250, 520],
    minMeter: 60,
    knock: ["*bank bank*", "*tapp tapp på ruta*"],
    hello: ["Hej Anna! Jag gick förbi... av en slump. 😊", "Hej! Jag har kanelbullar. Och en fråga.", "Tjena! Jag glömde min mössa här. Igen."],
    annaReacts: ["ADAM?! Kå gjer du HER?", "*raudnar* H-hei Adam. Tilfeldig å sjå dæg her. I vindauget.", "Adam! Vent, e ser forferdeleg ut. Ikkje sjå!"],
    choices: [
      { text: "🚪 Slepp han inn", line: "Kom inn då! Men ikkje på Emma sitt rom!", adam: "Härligt! Jag lovar. Inte Emmas rum.", effects: { adam: 3, mood: 15 } },
      { text: "🍪 Ta imot bullane", line: "E tek bullane. Du kan gå no. ...eller bli litt.", adam: "Haha, okej. Hej då då! ❤️", effects: { adam: 1.5, mood: 10 } },
      { text: "🙈 Seinare!", line: "Ikkje no! E har... rapport! Ja. Rapport.", adam: "Okej... vi ses! 😊", effects: { adam: -1 } },
    ],
    emma: ["NEJ NEJ NEJ. Inte i MITT rum!", "Jag hör er! INTE i mitt rum!", "Adam, hej. Mitt rum är LÅST. Bara så du vet."],
  },
};
