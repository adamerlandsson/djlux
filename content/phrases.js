// ============================================================
//  PHRASES – edit freely! Anna's general vocabulary.
//  She speaks Norwegian with a BIG Hallingdal (Ål) accent:
//    e = jeg, æ = er, dæ = det, kå = hva, kvenn = hvem, køffer = hvorfor, kor = hvor,
//    kåless = hvordan, mæg = meg, dæg = deg, ikkje, bære, sjå, skule, heime, mykje, no ...
//  When she's shy (DIALEKT meter low – Oslo people around) words get swapped to Oslo-speak.
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

// The title cycles through these
LUX.content.acronyms = [
  "Dansegulvets Juling-Leverandør · Laussnø Under X-mas",
  "Definitivt Jævlig Lur · Ålings Utvalde X-faktor",
  "Dårleg Jukser · Litt Ute av eXamen",
  "Dronning av Jubileumsgallaen · Laussnø Ut X",
  "DJ · Lærar · Utkasta · eXpert på svenske gutar",
];

// Used when nothing else matches
LUX.content.fallbacks = [
  "Hæ? Kå mæine du?",
  "Ja! Nei. Jo? Kå va spørsmålet?",
  "Det minner mæg om laussnø. Alt minner mæg om laussnø.",
  "Okei okei okei. Interessant. Fæle interessant.",
  "E skjønte halvparten. Den beste halvparten.",
  "Det der gje ingen meining, men e nikke berre.",
  "Hmm. Det må e spørje Hadi om.",
  "Seie du det? Det sa dei ikkje i Ål.",
  "Kå? Sei det ein gong til, men på hallingmål.",
  "Det der må e tenkje på. På ski. I laussnø.",
  "Interessant! E forstod ingenting, men e støttar dæg.",
  "Hmm. Det høyrest ut som noko Idunn ville sagt. Tøm og røm?",
  "E veit ikkje heilt kå e ska seie. Det skjer aldri. Nyt det.",
  "Ja. Nei. Kanskje. Det æ dei tre svara e har.",
  "Hallo? E høyrde berre «laussnø». Va det det du sa?",
  "Det svaret finst ikkje i Ål. Prøv Gol.",
  "Okei, men kå seie Jenny om det? Ho seie sikkert «SLAYYY».",
  "Det minner mæg om ein Hadi-fakta. E hugsar ikkje kva for ein.",
  "*nikkar seriøst* Ja. Absolutt. Kå va spørsmålet igjen?",
  "E he ingen meining om det. E he meiningar om ski, DJ og svenske gutar.",
  "Det der skal e bruke i revyen. Utan å spørje.",
  "Seie du det? Kvenn seie det? Ein Oslo-person?",
  "Høyr her: alt ordnar seg. Det seie mamma i Ål. Ho tek aldri feil.",
  "Eg trur svaret æ dirty fries. Svaret æ ofte dirty fries.",
];

// Randomly glued onto the start or end of replies
LUX.content.openers = ["Altså, ", "Nei men, ", "Okei så, ", "Høyr her: ", "Uff, ", "Hallo, ", "Jaså, "];
LUX.content.closers = [", altså!", ", sant?", ", ikkje sant?", ". Ja ja.", ". SKÅL!", "!", ", ass."];

// Hallingdal → Oslo swaps. Used when DIALEKT is low (she gets shy around Oslo people).
// Lower DIALEKT = more words swapped.
LUX.content.osloSwaps = {
  "e": "jeg", "æ": "er", "dæ": "det", "kå": "hva", "kvenn": "hvem", "køffer": "hvorfor", "kor": "hvor",
  "kåless": "hvordan", "mæg": "meg", "dæg": "deg", "mæ": "med", "ikkje": "ikke", "bære": "bare", "berre": "bare",
  "sjå": "se", "skule": "skole", "heime": "hjemme", "mykje": "mye", "no": "nå", "ein": "en", "eit": "et",
  "gidd": "gidder", "høyr": "hør", "kjem": "kommer", "ho": "hun", "heilt": "helt", "fæle": "sykt",
  "vi": "vi", "dei": "de", "dokker": "dere", "seie": "sier", "sei": "si", "veit": "vet", "korleis": "hvordan",
  "spørje": "spørre", "fekk": "fikk", "gjer": "gjør", "søv": "sover", "ska": "skal", "nokon": "noen", "noko": "noe",
};
// Oslo fillers she starts using when she's really shy
LUX.content.osloFillers = ["liksom", "sånn", "lissom", "a", "typ"];

// Responses to clicking on Anna herself
LUX.content.poked = [
  "Au! Kå driv du mæ?",
  "Ikkje kil! E æ kilen!",
  "*gjer ein liten dans*",
  "Hihi! E trudde du va Adam.",
  "Vi du sjå ein backflip? Ikkje inne, sa Emma.",
  "Hei! Det kilar! Stopp! Fortset! STOPP!",
  "Kå? Har e noko i andletet? Æ dæ glitter? Det æ glitter.",
  "Au! Det va skuldra som Idunn nettopp masserte!",
  "*poserer* DJ LUX. Ingen bilete utan avtale.",
  "Ikkje rør! E æ nyvoksa. Eller... skia æ nyvoksa.",
  "Ein gong te, og e tek ein 360. I stua.",
  "*hoppar* E trudde det va Emma med ein ny lås!",
  "Hei! Ikkje pirk! Det æ for mykje energi i mæg allereie!",
  "Hihi. Ein gong til og e sett på Hallingdal-songen.",
  "*gjer ein hallingkast* Ikkje inne, sa Emma. Oi. Lampa.",
  "Kå vil du? Fakta? Dans? Laussnø? E he alt!",
];

// After changing clothes ({outfit} = outfit name)
LUX.content.wardrobe = [
  "Nye klede! {outfit}. E ser rå ut, sant?",
  "{outfit} i dag. Fordi e kan.",
  "Hmm, {outfit}... ja. Dette æ DJ LUX-energi.",
  "{outfit}! Adam kjem til å... nei. Ikkje tenk på Adam.",
  "{outfit}. Jenny kjem til å seie SLAYYY. Det æ målet.",
  "Sjå her: {outfit}. Sandra seie e ser ut som ein Skal vi danse-deltakar.",
  "{outfit} på. Ingen peanøtter på. Hennie kan kome.",
  "{outfit}! Klar for alt: ski, DJ, fæst, rapport. Okei, ikkje rapport.",
  "E he på {outfit}. Kva synest du? Nei, ikkje svar. E veit. Rå.",
  "{outfit}. Idunn seie den gjev «god energi». E trur ho har rett.",
];

// "Dagens Hadi-fakta" – the fact box at the bottom of the screen (Hadi tells her everything)
LUX.content.hadiFacts = [
  "Ein snøfnugg treng ca. ein time på å falle ned frå skya.",
  "Brønnøysund ligg midt i Noreg. MIDT i!",
  "Kråker kan kjenne att ansikt. Og dei held nag.",
  "Ål skisenter opna i 1960-åra. Trur æ. Ingen har sjekka.",
  "Ein kan ikkje nyse med opne augo. Prøv. Nei, ikkje prøv.",
  "Dei lengste DJ-setta i verda har vart i over ei veke. Utan søvn!",
  "Sjiraffar søv berre ca. to timar i døgnet. Som Anna i fadderveka.",
  "Hjartet ditt slår i takt med musikken du høyrer på. Litt. Kanskje.",
  "Bananar æ litt radioaktive. Ikkje et 10 millionar på ein gong.",
  "Sverige he over 260 000 øyar. Og nokre svenske gutar.",
  "Ein strutse sitt auge æ større enn hjernen hans.",
  "Japan får nokre stader over 10 meter snø i året. Det æ MYKJE laussnø te pungen.",
  "Honning går aldri ut på dato.",
  "Brønnøysund-dialekten e den finaste i landet. Det e berre fakta.",
  "Torghatten har eit hol tvers gjennom fjellet. 160 meter langt! Og det e midt i Norge. Nesten.",
  "Ein blekksprut har tre hjarte. Og blått blod. Og ingen rapportar.",
  "Kua har bestevenner. Dei blir stressa når dei blir skilt.",
  "Norge har over 1000 fjelltoppar som er høgare enn 2000 meter. Ingen av dem e i Brønnøysund.",
  "Sauer kan kjenne att andlet. Opptil 50 stykk. Den sauen Anna landa på hugsar henne.",
  "Rein kan sjå ultrafiolett lys. Snø ser heilt annleis ut for dei.",
  "Kanelbullens dag e 4. oktober i Sverige. Adam feirar den. Sjølvsagt.",
  "Peanøtter e eigentleg ikkje nøtter. Dei e belgfrukter! Hennie bryr seg ikkje.",
  "Kokosnøtt e ikkje ei nøtt heller. Ingenting e det det heiter.",
  "Ein person går i snitt rundt jorda fire gonger i løpet av livet. Hadi har gått til Brønnøysund. Same ting.",
  "Det finst meir enn 200 typer snøkrystallar. Alle e unike. Som Edvin.",
  "Hallingdansen va opphavleg ein måte å vise styrke på. Og å sparke lamper.",
  "Ein tusenbein har ikkje tusen bein. Ein tusenbein e ein løgnar.",
  "Ål kommune har rundt 4700 innbyggarar. Og éin DJ LUX.",
  "Hjartet til ein blåkval e så stort som ein liten bil.",
  "Trondheim va hovudstad i Norge før Oslo. Oslo snakkar ikkje om det.",
  "Pingvinar gir småstein til den dei likar. Adam gir kanelbullar. Same ting.",
  "Det e meir enn 1700 bruer i Venezia, nei, 400. Det e mange uansett.",
  "Bier dansar for å fortelje kvarandre kor maten e. Akkurat som Anna og dirty fries.",
  "Ein snøskred kan gå i over 300 km/t. Ha alltid skredsøkar. Hadi sjekka at han verkar.",
  "Hemsedal og Ål e naboar. Dei har krangla om kven som har best snø sidan istida.",
  "Ein snigel kan sove i tre år. Som Anna etter Jubileumsgallaen.",
  "Hjernen bruker ca. 20 prosent av energien din. Under rapportskriving: 90.",
  "Lyden av bass reiser lenger enn lyden av diskant. Det e derfor naboane høyrer DJ LUX.",
  "Det e fleire sauer enn menneske i Hallingdal om sommaren. Dei dansar ikkje halling. Enno.",
  "Den første skiheisen i Norge kom i 1940-åra. Før det gikk folk opp. Som på topptur. Heile tida.",
  "Ein vanleg sky veg like mykje som 100 elefantar.",
  "Ein kan ikkje humme mens ein held seg for nasen. Du prøvde nettopp.",
  "Kråker kan løyse gåter som fem-åringar. Og dei hugsar kem som var slem mot dei.",
  "Folk frå Brønnøysund ler meir enn andre nordmenn. Det e ein studie. Æ gjorde han.",
  "Robyn har ein låt om å danse åleine. Han e laga for Anna.",
  "Kanelbullar vart populære i Sverige etter krigen, då sukker vart lett å få tak i igjen.",
];
