// ============================================================
//  MINIGAMES – content for the small games. Add more rounds freely!
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

// ---------- Gibberish eller Hallingdal-ord? ----------
// real: real Hallingdal/dialect words (with the meaning), fake: made-up nonsense
LUX.content.hallingOrd = {
  real: [
    ["kåless", "korleis / hvordan"], ["køffer", "kvifor / hvorfor"], ["kvenn", "hvem"], ["laussnø", "løssnø"],
    ["gidd", "gidder"], ["fæle", "veldig (fæle bra!)"], ["heime", "hjemme"], ["skule", "skole"],
    ["sjå", "se"], ["mykje", "mye"], ["dokker", "dere"], ["kvedl", "kveld"], ["fjedl", "fjell"],
    ["bære", "bare"], ["ette", "etter"], ["tå", "av"], ["halling", "en fra Hallingdal (og en dans!)"],
    ["svolten", "sulten"], ["hugse", "huske"], ["gut", "gutt"],
  ],
  fake: [
    "flimsk", "snorrevad", "kvæsil", "trøllehump", "glubbe", "snæddel", "hyllsk", "brakkeløk",
    "fønning", "skvælpe", "kluttemø", "drønsk", "pjåkel", "snarvegg", "blæmse", "glopp",
  ],
  right: ["Riktig! Du æ nesten halling!", "Ja! Ål-godkjent!", "Rett! Mor mi ville vore stolt."],
  wrong: ["Nei! Det der æ {answer}!", "Feil! E skjemst på dine vegne.", "Hallingdal græt no."],
};

// ---------- Hva sa Hadi? ----------
// hadi: what he says (Brønnøysund-dialect), answers[0] is ALWAYS the right one (they get shuffled)
LUX.content.hvaSaHadi = [
  { hadi: "Kem e han Edvin egt?", answers: ["Hvem er egentlig han Edvin?", "Kan du hente Edvin?", "Edvin er egentlig kul"],
    explain: "«Kem» = hvem, «egt» = egentlig. Ingen veit kvenn Edvin æ. Ikkje Hadi heller." },
  { hadi: "Æ e så svolten at æ kunne ete ein hel kveite.", answers: ["Jeg er så sulten at jeg kunne spist en hel kveite", "Jeg er så sint at jeg kunne kastet en kveite", "Jeg har spist en hel kveite"],
    explain: "«Æ» = jeg på Helgeland. Kveite æ ein diger fisk. Hadi æ diger svolten." },
  { hadi: "Ka du driv me?", answers: ["Hva holder du på med?", "Hvor kjører du?", "Hva drikker du?"],
    explain: "«Ka» = hva, «driv me» = holder på med." },
  { hadi: "Det e itj sant!", answers: ["Det er ikke sant!", "Det er helt sant!", "Det er ikke sand!"],
    explain: "«Itj» = ikke. Typisk Helgeland/Trøndelag." },
  { hadi: "Kor e du hen?", answers: ["Hvor er du?", "Hvem er du?", "Hvordan har du det?"],
    explain: "«Kor» = hvor. Hadi spør alltid kor Anna æ. Og Anna spør alltid kor Hadi æ." },
  { hadi: "Han e så kjekk at æ blir heilt matt.", answers: ["Han er så kjekk at jeg blir helt slapp", "Han er så kjekk at jeg blir sulten", "Han spiller sjakk så jeg blir matt"],
    explain: "«Matt» = slapp og svak. Ikkje sjakk-matt." },
  { hadi: "Visste du at Brønnøysund ligg midt i Norge?", answers: ["Det er sant – Brønnøysund ligger omtrent midt i Norge", "Det er tull – Brønnøysund ligger i Sverige", "Brønnøysund er Norges hovedstad"],
    explain: "Hadi har rett. Han seier det berre litt for ofte." },
  { hadi: "Det va skikkelig gøtt!", answers: ["Det var skikkelig godt/gøy!", "Det var skikkelig gått!", "Det var skikkelig gjørmete!"],
    explain: "«Gøtt» = godt/digg. Brukes om alt frå mat til fæst." },
  { hadi: "Æ må hjem å få mæ ein dupp.", answers: ["Jeg må hjem og ta meg en lur", "Jeg må hjem og ta en dukkert", "Jeg må hjem og dusje"],
    explain: "«Dupp» = lur/høneblund. Hadi tek mange." },
  { hadi: "Sjå på han, han e jo heilt på styr.", answers: ["Se på han, han er jo helt ute av kontroll", "Se på han, han styrer så bra", "Se på han, han er på jobb"],
    explain: "«På styr» = ute av kontroll, vill. Som Anna på vors." },
];

// ---------- Fisk eller IKEA? (Swedish lessons – for Adam's sake) ----------
LUX.content.fiskEllerIkea = {
  fish: ["Gädda", "Abborre", "Gös", "Sik", "Harr", "Lake", "Braxen", "Mört", "Sarv", "Siklöja",
         "Öring", "Röding", "Nors", "Björkna", "Sutare", "Ruda", "Löja", "Lax"],
  ikea: ["Billy", "Kallax", "Malm", "Lack", "Poäng", "Ektorp", "Klippan", "Hemnes", "Bekväm",
         "Strandmon", "Tarva", "Gladom", "Ivar", "Nordli", "Brimnes", "Tjusig", "Alex", "Pax"],
  intro: "Svensktime! For Adam sin skuld. Æ dæ ein svensk fisk eller eit IKEA-møbel?",
  right: ["Rett! E kan snart svensk!", "Korrekt! Adam blir imponert!", "Ja! Härligt!"],
  wrong: ["Nei! Det æ ein {answer}!", "Feil. Adam ville ledd av mæg.", "Uff. Svensk æ vanskeleg."],
};

// ---------- Redningsaksjon (Sunday hangover) ----------
// what she can ask for, and what you can give. loud: makes everything worse
LUX.content.rescue = {
  items: [
    { id: "vatn", icon: "💧", name: "Vatn" },
    { id: "fries", icon: "🍟", name: "Dirty fries" },
    { id: "fjern", icon: "📺", name: "Fjernkontroll" },
    { id: "dyne", icon: "🛏️", name: "Dyne" },
    { id: "cola", icon: "🥤", name: "Cola" },
    { id: "pille", icon: "💊", name: "Smertestillande" },
    { id: "bass", icon: "🔊", name: "DJ-anlegget på full", loud: true },
    { id: "gardin", icon: "☀️", name: "Opne gardinene", loud: true },
  ],
  wishes: {
    vatn: ["Vatn... vatn...", "E æ ein turr tørrfisk. VATN."],
    fries: ["Dirty fries. No. Takk.", "Noko feitt... Sandra sine fries?"],
    fjern: ["Kor æ fjernkontrollen?!", "Skal vi danse i reprise... e når ikkje..."],
    dyne: ["E frys... dyne...", "Dyna! Kor æ dyna?"],
    cola: ["Cola. Den svarte medisinen.", "Sukker... cola..."],
    pille: ["Hovudet mitt... noko mot hovudpine...", "Paracet... no..."],
  },
  // she keeps asking this between the wishes
  worry: ["...gjorde e noko gale i går?", "Kvenn sende e melding til?", "Sei at e ikkje dansa på bordet.", "Kvifor har e eit bilete av ein dørvakt på mobilen?", "Æ dæ sant at e song for ein taxi?", "Kvifor seie alle «helt fin» med det andletet?", "Kvenn tok med mæg heim? Var det Jenny? Det va Jenny."],
  loud: ["AAAAH! Køffer?!", "Øyra mine! E hatar dæg!", "LYSET! DET BRENN!"],
  right: ["Ahh... takk.", "Du æ ein engel.", "Mmm. Betre."],
  wrong: ["Det va ikkje det e ba om...", "Kå ska e med det?!"],
};

// ---------- Room objects (js/room.js) ----------
LUX.content.room = {
  tv: {
    channels: [
      { name: "Skal vi danse", color: "#d95ab0", line: "SKAL VI DANSE! Sandra, kom! KOM!" },
      { name: "Skiflyging", color: "#5a8fd9", line: "Dei der flyg. E tek backflip. Same greia." },
      { name: "Handball-landskamp", color: "#3aa04a", line: "E kunne vore der. Om e ikkje hadde vakse opp i Ål. *sukk*" },
      { name: "Vêrmeldinga", color: "#9ad1ff", line: "SNØ i Hallingdal! 40 cm! LAUSSNØ TE PUNGEN!" },
      { name: "Svensk realityserie", color: "#e8c34a", line: "Svenske gutar på TV. E bli her ei stund." },
      { name: "Nyheiter", color: "#8a8a9a", line: "Uff. Skift kanal. For deprimerande." },
    ],
  },
  kitchen: {
    lines: ["Sandra! Er det dirty fries att?", "Rester frå i går. Pizza. Frukost.", "Kjøleskapet seie: berre ost og pils. Perfekt."],
    grumpy: ["KVENN HE ETE DEI SISTE FRIESA?!", "Det finst ingenting her. Ingenting. Som rapporten min."],
  },
  window: {
    day: ["Snør det? Nei. Berre Trondheim-regn.", "Kanskje e skulle ha vore på fjellet no..."],
    evening: ["Kveldssol over Nidelva. Fint. Men ikkje Ål-fint.", "Snart kveld. Snart fæst?"],
    night: ["Mørkt. Stjerner. Kanskje snø i morgon?", "Ein kan sjå Hallingdal herifrå. Nei. Men nesten."],
  },
  phone: [
    "📱 Adam: «Hej 😊»", "📱 Hadi: «kem e han Edvin egt?»", "📱 Jenny: «As you shouuuld SLAYYY 💅»",
    "📱 TF Fæst & Blæst: «Kven har ansvaret for konfettien?!»", "📱 Mamma: «Har du levert rapporten?»",
  ],
  skis: [
    "Skia mine! Dei he sett meir laussnø enn nokon i heile NTNU.",
    "E kunne stått på ski no. Akkurat no. Køffer står e ikkje på ski?",
    "Ein dag ska e ha ein heil vegg med ski. Black Crows i kvar farge.",
  ],
  decks: [
    "DJ LUX-hovudkvarteret. Ikkje rør. Eller... rør. Lag ein beat!",
    "E øver til Jubileumsgallaen. Grafen ska KOKE.",
    "Den knappen? Det æ DROP-knappen. Den æ farleg.",
  ],
  poster: [
    "Ål! Heime! Verdas finaste stad.",
    "Ål skisenter. Ein dag ska e vere der kvar dag.",
    "Plakaten heng skeivt. Det æ Hallingdal-stil.",
  ],
  disco: ["*skrur på discokula* FÆST!", "Discokula æ for nødsituasjonar. Som tysdagar."],
  doorSandra: ["*bankar* Sandra? Skal vi danse om ti minutt!", "Sandra søv. Eller ho ser på TV utan mæg. FORRÆDAR."],
  doorMarthe: ["*bankar* Marthe? ...ho snakkar i telefonen med snekkaren.", "Marthe, lillesøster, kom ut og vere sosial!"],
  doorEmma: ["Emma sitt rom. E går IKKJE inn der. Ikkje meir.", "Det æ lås på døra no. Rettferdig."],
  lamp: {
    on: ["Lys! No ser e igjen.", "Ahh. Koseleg."],
    off: ["Fæst-mørke. Perfekt for discokula.", "Mørkt. Som i ein klubb. Godt."],
    offHungover: ["Takk. TAKK. Lyset gjorde vondt.", "Endeleg. La det vere sløkt for alltid."],
  },
  whiteboard: "Matte! Eller... svensktime? Same greia.",
  clock: ["{time}. Æ dæ fri snart?", "Klokka æ {time}. Tida går SÅ sakte."],
  bar: ["Ein pils til? Det æ torsdag. Torsdag tel ikkje.", "Quiz-spørsmål: kvar ligg Brønnøysund? HADI VEIT!"],
  gym: ["Burpees. Neste post. Uff.", "E kom sju minutt for seint. Ingen merka. Alle merka.", "Ikke tenk bare benk!"],
  bench: [
    "Ikke tenk bare benk!",
    "IKKE TENK BARE BENK! *løftar* ...okei, e tenkte litt.",
    "Ikke tenk bare benk. Det gjeld rapportar òg. Ikkje tenk på dei.",
    "Benk! Om e hadde benka slik i handballtida, hadde e vore på landslaget.",
  ],
  gymboard: ["Stasjon 3: BENK. Min favoritt. Ikke tenk bare benk!", "45 sekund på, 15 av. Kvenn fann på dette? Professor RipeiSåle?"],
};
