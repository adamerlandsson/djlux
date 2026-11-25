// ============================================================
//  SCHEDULE – where Anna is and how she feels, based on the real clock.
//
//  blocks: checked from the top, the first one that matches wins. day: 0 = Sunday ... 6 = Saturday.
//  from/to are hours (18.5 = 18:30). A "to" above 24 runs past midnight into the next day
//  (vors on Saturday 18–26 = until 02:00 on Sunday night).
//  Anything that doesn't match a block = "home".
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.schedule = {
  blocks: [
    { ctx: "pils", day: 4, from: 21, to: 25.5 },     // Thursday: TF-pils på Tyven (quiz), til halv to
    { ctx: "vors", day: 6, from: 18, to: 26 },       // Saturday: vors with the Molde folkehøgskule gang
    { ctx: "asleep", from: 2, to: 9 },               // every night
    { ctx: "training", day: 1, from: 18.5, to: 20 }, // Monday: sirkeltrening med TF (she is always late)
    { ctx: "sofa", day: 2, from: 11, to: 15 },       // Tuesday: «Skal vi danse» on the sofa
    { ctx: "school", day: 3, from: 12, to: 16 },     // Wednesday: skule
    { ctx: "hungover", day: 0, from: 9, to: 24 },    // Sunday: hungover and worried
  ],
  // chance that a normal day starts grumpy / happy (the rest is neutral)
  grumpyDayChance: 0.25,
  happyDayChance: 0.4,
  // mood the day starts at, per context (otherwise the daily random mood)
  moodStart: { hungover: 28, vors: 85, pils: 78, school: 30 },
  // which scene (background) each context uses
  scenes: { home: "home", sofa: "home", hungover: "home", asleep: "home", school: "school",
    training: "gym", pils: "bar", vors: "vors", dj: "grafen", ski: "mountain" },
};

LUX.content.contexts = {
  asleep: {
    label: "Søv (på rommet sitt)",
    greetings: ["*frå rommet* KVENN æ dæ?! E søv!", "*mumle* ...fem minutt te...", "*under dyna* Om det ikkje æ laussnø, gå vekk.", "Zzz... e æ vaken. E æ IKKJE vaken."],
    lines: [
      "Zzz... laussnø... zzz...",
      "*ropa frå rommet* E SØV!",
      "Mmh... Adam...? Nei. Zzz.",
      "*snork* ...backflip... *snork*",
      "Æ dæ du, Sandra? Gå og legg dæg!",
      "Zzz... DJ LUX på Grafen... zzz...",
      "*mumle* ...tøm og røm... zzz...",
      "Zzz... nei, Professor... e skreiv han sjølv... zzz...",
      "*snork* ...Hennie... ingen peanøtter... *snork*",
      "Zzz... kem e han Edvin... zzz...",
      "*drøymer* ...ein meter pudder... i Ål... zzz...",
      "Mmmh... kanelbullar... zzz...",
    ],
    refuseDJ: ["*frå rommet* Klokka æ kå?! Nei. Vi DJ-a i morgon."],
    refuseStudy: ["*frå rommet* E studere i draume. God natt."],
  },

  home: {
    label: "Heime i Kannikestredet",
    greetings: {
      happy: ["HEI! E æ heime! Kå ska vi finne på?", "Nei men hei! E he hatt ein HEILT rå dag!", "Heisann! Snø i fjellet, pils i kjøleskapet, livet æ godt!", "HEI! E æ i ein så god mood at e kunne gjort ein backflip. Inne. Ikkje sei det til Emma."],
      neutral: ["Hei hei. Endeleg heime.", "Heisann! Kå skjer?", "Hei! E sitt berre her og tenkjer på ski.", "Hallais. Kå ska vi gjere? Ikkje rapport."],
      grumpy: ["Hmpf. Hei.", "Ikkje spør kåless dagen min va.", "Hei. Det regna. Det va rapport. Det va tomt for rømme.", "Ugh. Hei. Snakk om noko fint. Laussnø, til dømes."],
    },
    happy: [
      "E æ i SÅ godt humør i dag!",
      "Snart helg, snart fæst, snart laussnø. Livet æ godt.",
      "Ska vi sette på musikk? E he ein ny edit!",
      "Kå om vi har vors i dag òg? Det æ ikkje laurdag, men det æ ein laurdag i hjartet.",
      "E he så mykje energi at e kunne DJ-a ei heil veke. Utan søvn. Som Hadi-faktaen.",
      "Sjå på skia på veggen. Sjå på dei! Dei ventar på mæg!",
      "E ringde mamma. Det snør i Ål. E grein litt.",
      "I dag æ ein «laussnø te pungen»-dag. E kjenner det.",
    ],
    grumpy: [
      "Rapport. Igjen. KVAR einaste veke. Køffer?!",
      "E vi bære gå på ski. Æ dæ for mykje forlangt?",
      "Kvenn he ete dei siste dirty friesa? SANDRA?",
      "E burde vore proff i handball. Om e ikkje hadde vakse opp i Ål.",
      "Kor æ Hadi? Han svare ikkje på melding.",
      "Kvifor æ det ikkje laussnø i dag? Kven har ansvaret for dette?",
      "Rapporten stirer på mæg frå skrivebordet. E stirer tilbake. Ingen vinn.",
      "Emma he flytta skoa mine. Igjen. Til gangen. Der dei høyrer heime. Uff.",
      "Mobilen døydde. Midt i ein Adam-... midt i ein melding. Frå nokon.",
      "Ikkje tenk bare benk. Tenk... ingenting. E orkar ikkje tenke.",
    ],
  },

  sofa: {
    label: "I sofaen – «Skal vi danse»",
    greetings: ["ÅÅÅ, sett dæg ned! «Skal vi danse» æ på!", "Hysj! Dei danse paso doble no!", "Sandra! Det byrjar! Dirty fries, fjernkontroll, PLEDD!", "Du kjem akkurat til jiven! Sitt! Ikkje snakk!"],
    lines: [
      "ÅÅÅ, e vi bære sjå på Skal vi danse mæ ho Sandra, e gidd ikkje skule idag.",
      "Den dansen der fortjene ein tiar. Minst.",
      "E kunne gjort den heisen. Med backflip.",
      "Sandra, lag dirty fries! Dette æ ein krisesituasjon!",
      "Dommaren æ HEILT på jordet!",
      "Den løftet der? E kunne gjort det med Hadi. Hadi veit det ikkje enno.",
      "Kvenn stemmer på han?! Han dansar som ein elg på glatt is!",
      "Sandra grin. E grin. Vi grin saman. Det æ tysdag.",
      "Om e va på Skal vi danse, ville e dansa hallingdans i finalen. Og vunne.",
      "Den kjolen der! E vil ha den kjolen til gallaen!",
      "Tiar! TIAR! Dommaren ga sjuar. E HATAR sjuar-dommaren.",
    ],
    refuseDJ: ["Ikkje no! Dei he ikkje kåra kvenn som ryk ut enno!"],
    refuseStudy: ["Studere? Det æ tysdag og Skal vi danse. Nei."],
  },

  school: {
    label: "På skulen (NTNU)",
    greetings: ["*kviskra* Hei! E sitt på forelesning!", "Psst, e æ på skulen. Matte. MATTE.", "*kviskra* Redd mæg. Det æ didaktikk.", "*gjeispar* Hei. E lærer... noko. Trur e."],
    lines: [
      "*kviskra* Foreleseren ser på mæg.",
      "E tek notat. Det vil sei, e teikna ski i margen.",
      "Ein rapport til. Kvar veke. E orke ikkje.",
      "Æ klokka fire snart? Nei. Uff.",
      "Pythagoras va sikkert ikkje frå Ål. Det merkast.",
      "*kviskra* Ho ved sidan av mæg tek notat i fire fargar. E he ein blyant og eit håp.",
      "Gruppearbeid. E æ på gruppe med tre som har lest pensum. E he lest menyen på Tyven.",
      "E rekna ut at det æ 47 timar til laurdag. Det æ den einaste matten e he gjort i dag.",
      "Professor RipeiSåle seie «spørsmål?». Ingen spør. Han seie det igjen. Det æ ein kamp.",
      "*teiknar ein skihoppar i margen* Dette æ eigentleg geometri.",
      "Om e skriv «laussnø» i rapporten, trur du nokon merkar det?",
    ],
    refuseDJ: ["E æ på skulen! ...men bassen kallar."],
    refuseStudy: ["E ÆR på skulen! Kå trur du e gjer?"],
  },

  training: {
    label: "Sirkeltrening med TF",
    greetings: ["*kjem springande* E æ BERRE litt sein! Kå post æ vi på?", "Sirkeltrening! Burpees! Køffer gjer e dette?", "Ikke tenk bare benk!"],
    lines: [
      "Ikke tenk bare benk!",
      "Ikke tenk bare benk! ...det æ mitt livsmotto. Også utanfor gymmen.",
      "*pesa* E kom berre... sju minutt for seint. Det æ rekord.",
      "Burpees æ den einaste tingen e hata meir enn rapportar.",
      "Om e hadde spela på eit betre handballag... då hadde e vore landslaget no.",
      "Planken! Tretti sekund! E tenkje på laussnø!",
      "Kvenn har laga denne sirkelen? Professor RipeiSåle?",
      "Utfall! Kvenn fann på utfall? Det va sikkert ein svenske.",
      "*på matta* E kviler ikkje. E visualiserer laussnø.",
      "TF-sirkel: 30 sekund jobb, 15 sekund klage. E æ best på klaginga.",
      "Ikke tenk bare benk! ...men benk æ det einaste e kan.",
      "Kvenn har sett på Hallingdal-songen på høgtalaren? ...det va mæg. Det hjelper.",
    ],
    refuseDJ: ["E ska trene! ...etterpå, kanskje."],
    refuseStudy: ["E trene! Hjernen æ på pause."],
  },

  pils: {
    label: "TF-pils på Tyven",
    greetings: ["SKÅL! TF-pils på Tyven! Vi he quiz!", "Hei! E e med på quizlaget «Laussnø te pungen»!", "Torsdag! Tyven! TF! Kvenn tek første runde?", "Hei! Hadi kjem kanskje. Han kjem aldri. Men kanskje."],
    lines: [
      "Neste spørsmål! E VEIT DET! ...nei, e veit ikkje.",
      "Ein pils til? Ja. Det æ torsdag. Det tel ikkje.",
      "Hadi sa at ein kan ikkje nyse med opne augo. Vi fekk poeng!",
      "Kvenn ska vi kåre te TF sin kjekkaste i år?",
      "Æ dæ nokon som vi hoppe strikk?",
      "Spørsmål 7: «Kva fjell har hol i?» TORGHATTEN! Takk, Hadi!",
      "Vi kom på andreplass. Av to lag. Det tel som pallplass.",
      "Idunn sende melding: «tøm og røm». Ho æ ikkje eingong her.",
      "Ein pils til, og så ska e heim. Det seie e kvar torsdag. Det stemmer aldri.",
      "Quizmasteren spør om Sverige. Alle ser på mæg. KØFFER ser alle på mæg?",
      "Lagnamn-idé: «Ikke tenk bare benk». Vi vinn ikkje, men vi ser sterke ut.",
    ],
    refuseDJ: ["E æ på quiz! DJ LUX tek fri i kveld. Nesten."],
    refuseStudy: ["Studere? På Tyven? Ha."],
  },

  vors: {
    label: "Vors med Molde folkehøgskule-gjengen",
    greetings: ["VORS! Molde folkehøgskule æ livet, altså!", "Hei hei! Jenny, sett på musikk! Hennie, INGEN peanøtter!", "Velkommen til vors! Idunn, IKKJE seie tøm og røm enno! Vi he nettopp byrja!", "Glitter, pils og Molde-gjengen! Kvelden æ perfekt allereie!"],
    lines: [
      "Molde folkehøgskule æ livet, altså!",
      "Idunn, massasje? JA TAKK.",
      "Hørte e limousine og swedish boys?",
      "Ska vi starte ein moshpit? I stua? JA.",
      "Hennie, ikkje rør den skåla. Den he peanøtter!",
      "E ska BERRE ta ein. Eller to.",
      "Idunn sa «tøm og røm» for tredje gong. Klokka æ halv sju.",
      "Jenny, e he drukke vatn! Sjå! Det æ ei vassflaske! Med vin i. Nei da.",
      "Hennie sjekkar chipsskåla med lommelykt. Det æ sånn ein veit at det æ vors.",
      "Kvenn sette på Hallingdal-songen? ...e veit kvenn. Det va DJ LUX.",
      "Taxien kjem om ti! Tøm og røm! ...no seie e det òg.",
      "E æ ikkje full. E æ berre... veldig glad i alle her. ALLE. Glad i dokker!",
      "Moshpit-alarm! Alle møblane inn mot veggen!",
    ],
    refuseDJ: ["Vi dreg snart! DJ-pulten æ på byen i kveld!"],
    refuseStudy: ["Studere? På VORS? Kvenn æ du?"],
  },

  hungover: {
    label: "Fyllesjuk og bekymra",
    greetings: ["Uffff... snakk lågare.", "*ligg på sofaen* Hei. Gjorde e noko gale i går?", "E drikk aldri meir. Hei, forresten."],
    lines: [
      "Gjorde e noko gale i går? Sei det. E tolar det.",
      "Alle seie e ikkje gjorde noko rart. Men det seie dei JO.",
      "Kvenn sende e melding til i går? Ikkje sjå på mobilen min.",
      "Hovudet mitt. Mitt stakkars hovud.",
      "Jenny seie e va «helt fin». Det æ det verste ho kan seie.",
      "E ska aldri drikke att. Til torsdag.",
      "Hennie seie e va «helt fin». Jenny seie e va «helt fin». Idunn seie «tøm og røm». Kva betyr DET?",
      "E fann ein kvittering for 14 kebabar. E et ikkje 14 kebabar. Trur e.",
      "Kvifor ligg det ei svensk lue her? Ikkje spør. Ikkje spør mæg.",
      "Sofaen og e æ eitt no. Vi æ ein person. Kall oss Sofanna.",
      "Hadi sende ein fun fact klokka ni. E las han fire gonger. E forstår han ikkje.",
      "*under pleddet* E he sendt ein talemelding til fire personar. Ingen av dei svarar. Det æ eit teikn.",
    ],
    food: ["Dirty fries... ja takk. Sandra, du æ ein engel.", "Feit mat. No. Takk.", "Mat? Ja. Men e reise mæg ikkje.", "Grandiosa. Heil. Åleine. Ingen dommar.", "Ein burger og ein Bris. Jenny veit. Jenny veit alltid."],
    refuseDJ: ["DJ-e? I dag? Nei. Sofa.", "Ein einaste bass-tone og e døyr."],
    refuseStudy: ["Studere? Det æ søndag. Og e æ døyande."],
  },

  dj: { label: "DJ LUX på Grafen", greetings: ["DJ LUX æ klar!"], lines: [] },
  ski: { label: "På ski", greetings: ["LAUSSNØ!"], lines: [] },
};
