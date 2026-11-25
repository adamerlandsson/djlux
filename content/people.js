// ============================================================
//  PEOPLE – everyone around Anna. js/people.js makes them show up.
//
//  roommates:  shout from their rooms now and then (a name-tagged bubble at the side)
//  window:     Hadi, Jenny, Idunn and Hennie pop up in the living room window sometimes (and when you click it)
//  vorsGuests: chatter at Saturday vors (Oslo people make Anna switch dialect)
//  adam:       the ADAM-O-METER. Mentions fill it, it drains slowly. Full = "Adam-feber".
//  guests:     when you let someone in from the window, they stand in the living room and chat
//
//  The game never repeats a line until most of the others in the same list have been used,
//  so the more lines a list has, the more varied it feels. Add as many as you like!
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.roommates = {
  everySeconds: [90, 200],   // how often someone might shout (when Anna is home)
  chance: 0.55,
  people: {
    sandra: {
      name: "Sandra", from: "Gol", color: "#e86a9a",
      lines: [
        "ANNA! Skal vi danse byrjar om fem minutt!",
        "E lagar dirty fries! Vi du ha?",
        "Kom og sjå TV! Eg vi ikkje sjå åleine!",
        "Nokon he ete osten min. Det va ikkje eg. Det va heller ikkje dirty fries-osten. Den æ heilag.",
        "Anna! Kå heiter han dommaren som alltid gir sjuar? E HATAR han.",
        "E he kjøpt ny frityrolje. Dette blir historisk.",
        "Kan du ta med mjølk på veg heim? Og chips. Og ein ny sofa.",
        "ANNA. Dei har sett på paso doble. PASO DOBLE. Kom!",
        "Har du sett fjernkontrollen? Han va her. No æ han borte. Emma?",
        "E øver på ein jive i gangen. Ikkje kom ut. Jo, kom ut og døm.",
        "Vi har ikkje meir rømme. Dirty fries utan rømme æ berre fries. Krise.",
        "Mamma ringde frå Gol. Ho spør om du et nok. E sa du et dirty fries. Ho va nøgd.",
        "E høyrer bassen frå rommet ditt heilt inn hit. Skru opp!",
        "Ska vi ta ein Gol-Ål-kveld? Berre hallingmål, ingen Oslo-ord?",
        "E sovna til Skal vi danse i går. Kvenn røyk ut?! IKKJE SEI DET. Jo, sei det.",
        "Oppvasken stirer på mæg. E stirer tilbake. Det æ uavgjort.",
        "Kvenn vann TF-quizen på torsdag? Ikkje sei Hadi. Sei ikkje Hadi.",
      ],
      reply: [
        "JA! E kjem!", "Dirty fries? Du æ ein engel, Sandra!", "Vent på mæg!",
        "Sandra, du æ grunnen til at e bur her.", "Rømme-krise?! E spring på butikken. Om ei stund.",
        "Paso doble?! Ingen rører sofaplassen min!", "Ikkje sei kvenn som røyk ut! ...jo, sei det.",
        "Gol-Ål-kveld! Ingen Oslo-ord! Heilt sikker. Liksom. ...FAEN.", "E dømmer jiven din: 9. Det va ein 10, men du snubla.",
        "Mamma di æ ein dronning. Helse.", "Fjernkontrollen? Sjekk under Emma.",
      ],
      effects: { mood: 10 },
    },
    marthe: {
      name: "Marthe", from: "Hallingdal", color: "#e8c34a",
      lines: [
        "Anna, visste du at kjærasten min laga ei hylle i dag? Ei HEIL hylle.",
        "Han he så fine hender. Snekkarhender. Sukk.",
        "Kan du hjelpe mæg med ei melding til kjærasten min? Han æ snekkar, veit du.",
        "Eg saknar han. Han æ berre på jobb. Men likevel.",
        "Kjærasten min seie at sofaen vår æ dårleg bygd. Han vil byggje ein ny. Av eik.",
        "Anna, kan du låne mæg skiskoa dine? Han ska ta mæg med på ski. På tre-ski han laga sjølv.",
        "Han sende mæg eit bilete av ein vinkel. Ein PERFEKT vinkel. E grein litt.",
        "Han sa at e luktar sagflis. På ein god måte. Trur e.",
        "Han laga ein fuglekasse til mæg. Fuglane flytte inn. Dei æ lukkelege. E æ lukkeleg.",
        "Anna, kva gjer ein på ein snekkar-date? Han foreslo Byggmakker.",
        "E har lært ordet «fals». Det æ eit snekkarord. E bruke det i alle setningar no.",
        "Han fiksa døra til Emma. No knirkar ho ikkje. Emma vil ha knirket tilbake.",
        "Anna! Ska vi ha jentekveld? Eg lovar å ikkje snakke om han. Mykje.",
        "Har du lese rapporten? Eg har ikkje. Eg har sett på biletet av hylla.",
      ],
      reply: [
        "Ja, Marthe, vi veit han æ snekkar.", "Ei heil hylle? Wow. Imponerande.", "Lillesøster, du æ for søt.",
        "Byggmakker-date. Det æ faktisk romantisk. I Hallingdal.", "Sagflis-lukt æ eit kompliment i Ål.",
        "Jentekveld JA! Ingen snekkarar. Okei, éin snekkar-historie.", "Ein fuglekasse?! Han æ ein keeper, Marthe.",
        "Marthe, du æ den søtaste lillesøstra e ikkje har.", "Ein perfekt vinkel... ja. Det æ visst stort.",
        "Lån skiskoa! Berre ikkje la han byggje om dei.",
      ],
      effects: { mood: 3 },
    },
    emma: {
      name: "Emma", from: "Östersund", color: "#4fc3c8",
      lines: [
        "Anna! Ni sover INTE i mitt rum i natt, okej?!",
        "Har Adam varit här igen? Varför är mitt täcke på golvet?",
        "Jag har satt ett lås på min dörr. Bara så du vet.",
        "Det är jättemysigt att ni är... vad ni nu är. Men inte i MITT rum.",
        "Varför ligger det en svensk mössa i min säng? Det är inte min mössa.",
        "Jag har satt upp en skylt. «Ingen Adam». Med bild.",
        "Anna, jag hörde kanelbullar. Kanelbullar betyder Adam. Adam betyder INTE mitt rum.",
        "Jag älskar dig, Anna. Men jag älskar mitt rum mer.",
        "Skidor imorgon? Med TF? Bara om Adam sover hemma hos sig själv.",
        "Någon har flyttat min kudde. Kudden pratar inte. Men jag vet.",
        "Jag har köpt en dörrklocka. Till mitt rum. Inifrån.",
      ],
      reply: [
        "Vi gjorde ikkje det! ...den gongen.", "*raudnar* E veit ikkje kå du snakkar om, Emma.", "Lova. Heilt sikkert. Kanskje.",
        "Den lua æ ikkje Adam si. Den æ... min. Svensk mote.", "Ein skilt MED BILETE?! Emma!",
        "Kudden din flytta seg sjølv. Det æ eit fysisk fenomen. Spør Hadi.", "Emma, du æ verdas beste romkamerat. Med lås.",
        "*kviskrar* Ho veit alt. HO VEIT ALT.",
      ],
      effects: { adam: 0.5 },
      adamOnly: true,   // only shows up when the ADAM-O-METER is over half
    },
  },
};

LUX.content.window = {
  everySeconds: [100, 250],
  chance: 0.5,
  // Anna's reaction when someone knocks at night (she comes out of her room, half asleep)
  asleepReacts: [
    "*kjem ut av rommet i pyjamas* Kvenn bankar på vindauget klokka FIRE?!", "*gnir seg i augo* Hæ... kå... no?", "Zzz... HÆ?! Kven æ det?",
    "*med ein sokk på* E SØV! ...okei, e søv ikkje no lenger.", "*i dyna som ei kappe* Det betre vere laussnø eller brann.",
    "Æ dæ morgon? Nei. Køffer æ dæ folk i vindauget?",
  ],
  //  name/from/emoji/image: who it is · knock: the sound · lines: what they say in the window
  //  (a line can be ["their line", "Anna's answer"]; otherwise Anna answers with one of annaAfter)
  //  annaReacts: Anna's first reaction · annaAfter: her answer to their line · comeIn: when you let them in
  //  bye: when they leave · face: Anna's expression around them · dialekt: change of the DIALEKT meter
  visitors: {
    hadi: {
      name: "Hadi", from: "Brønnøysund", emoji: "🧔🏽", image: "assets/sprites/hadi/face.png",
      knock: ["*bank bank*", "*tapp tapp på ruta*", "*bank... bank-bank*", "*pressa nasen mot ruta*"],
      lines: [
        "Kem e han Edvin egt?",
        "Hei! Ka du driv me? Æ har ein funfact te dæ!",
        "Visste du at Brønnøysund ligg midt i Norge? Akkurat midt i!",
        "Æ gikk forbi og tenkte: Anna treng ein funfact. Og æ treng ein dorull.",
        "Æ har nettopp vore på Torghatten. Hullet e framleis der. Bra.",
        "Hei! Æ har med snacks. Ingen peanøtter. Æ lærte det på den harde måten.",
        "Ka skjer? Æ har funne ut nokka om Edvin! ...nei, æ har ikkje det.",
        "Æ kjente lukta av dirty fries heilt fra Bakklandet.",
        "Æ skal på quiz på torsdag. Æ treng ein lagkamerat som kan hallingdans.",
        "Æ e her! Ingen spurte, men æ e her!",
      ],
      factIntro: "Visste du forresten at...",
      annaReacts: [
        "HADI! Kor he du vore?!", "Hadi! E spurte etter dæg i går!", "Kvenn æ Edvin, Hadi? KVENN?",
        "HADI! Du svare aldri på melding, men du dukkar opp i vindauget?!", "Hadi! Midt i Noreg, sant? MIDT I?",
        "Kjem du med fakta eller snacks? Begge? Begge æ rett svar.",
      ],
      bye: [
        "Ha det! Æ må te Brønnøysund!", "Kem e han Edvin egt? Tenk på det!", "Æ må gå, bussen min går om... no.",
        "Ha det! Visste du at «ha det» e ein forkorting? Av nokka. Æ sjekke.", "Snakkes! Ikkje gløym: midt i Norge!",
      ],
      comeIn: ["Æ kjem inn! Har dokker dirty fries?", "Æ kjæm! Tørk av beina? Æ tørk av beina.", "Endelig! Det e kaldt her ute, som i Brønnøysund i juli."],
      effects: { mood: 10 },
    },
    jenny: {
      name: "Jenny", from: "Molde fhs", emoji: "👱‍♀️", image: "assets/sprites/jenny/face.png",
      knock: ["*tapp tapp*", "*vinkar ivrig*", "*teiknar hjarte på ruta*", "*hoppar opp og ned*"],
      lines: [
        "As you shouuuuld, SLAYYY!",
        "Hei fineste! Den kjolen? As you shouuuld!",
        "Molde folkehøgskole-gjengen er på vei, liksom! SLAYYY!",
        "Jeg bare MÅTTE se deg! Du er så fin i dag, liksom!",
        "Hei vennen! Jeg har med glitter. Bare i tilfelle.",
        "Hennie sier hei! Og at du må gjemme peanøttene.",
        "Jeg gikk forbi og så at det lyste. Det er et tegn, liksom!",
        "Vors på lørdag? Jeg har allerede laget spilleliste. Den er SYKT bra.",
        "Har du sett Skal vi danse? Jeg grein. Helt seriøst.",
        "Du har noe i... nei, det var bare glitter. SLAYYY.",
      ],
      // when Anna is hungover / has had too much: Jenny checks on her
      care: [
        "Hei vennen, går det bra med deg? Du var helt fin i går, jeg lover!",
        "Jeg tok med vann og en bolle. Du gjorde INGENTING rart. Lover.",
        "Drikk vann, a. Du var så søt i går. Bare søt, liksom.",
        "Jeg har med Bris og en burger. Ikke spør, bare spis.",
        "Du var helt fin! Du danset bare litt med dørvakta. Han smilte!",
        "Vennen! Har du sovet? Drukket vann? Spist? Ett av dem?",
      ],
      annaReacts: [
        "JENNY! SLAYYY!", "Jenny! Du æ best!", "*vinkar tilbake*", "JENNY! Du lyser opp heile Kannikestredet!",
        "Jenny! E høyrde «slay» før e såg dæg.", "Er det... glitter på ruta? JENNY.",
      ],
      annaAfter: ["SLAYYY!", "As you shouuuuld! ...sa e det rett?", "Jenny, du æ for mykje. På den beste måten.", "Glitter? Ja takk. Alltid."],
      annaCared: [
        "...lovar du? Ingenting rart? Heilt sikker?", "Jenny, du æ ein engel. Kå gjorde e EIGENTLEG?",
        "*under pleddet* ...takk. Du æ ein helgen. Ein Oslo-helgen.", "Du seie «helt fin» med DET andletet? Å nei.",
      ],
      bye: ["Slayyy, vi ses!", "Drikk vann! Glad i deg!", "Ha det, fineste! As you shouuuuld!", "Må løpe, Hennie venter! Kyss!"],
      comeIn: ["Yay, jeg kommer inn!", "Jeg kommer! Har du vann? Du trenger vann.", "SLAYYY, jeg er på vei inn!"],
      face: "party",
      effects: { mood: 15, festlyst: 10 },
    },
    idunn: {
      name: "Idunn", from: "Hemsedal", emoji: "👩🏽‍🦱", image: "assets/sprites/idunn/face.png",
      knock: ["*tapp tapp*", "*bank bank – TØM OG RØM*", "*gnir på ruta som om det var ein skulder*"],
      lines: [
        "Tøm og røm! ...okei, du har ikke noe å tømme. Men røm!",
        ["Hei Anna! Du ser stram ut i skuldrene. Selv herfra.", "Skuldrene mine?! Ja. Dei æ stramme. Fiks dei."],
        ["Jeg har med massasjeolje. Lavendel. For energien, liksom.", "Lavendel-energi. Okei. E æ open for det."],
        "Vi skal til Tyven! Tøm og røm, kom igjen!",
        ["Hemsedal hadde 40 cm i natt. Bare så du vet. Ål hadde... noe.", "Hemsedal-snø æ ikkje ekte snø. Det æ Oslo-snø."],
        "Jeg har vært på yoga. Nå er jeg helt zen. Klar for vors.",
        ["Bussen var full, men jeg ga sjåføren en nakkemassasje, så vi kom fram fortere.", "Massasje på bussen?! Idunn, du æ ein naturkraft."],
        "Hei! Jeg er fra Hemsedal, men jeg snakker Oslo. Det bare ble sånn. Igjen.",
        "Det er fredag et sted i verden. Tøm og røm!",
        "Jeg traff Hadi. Han spurte om Edvin. Jeg ga ham massasje. Han glemte Edvin. I fem minutter.",
      ],
      annaReacts: [
        "IDUNN! Hemsedal-jenta!", "Idunn! Snakk hallingmål, du æ frå Hemsedal!", "Idunn! Er det massasje-tid?",
        "Tøm og røm-dronninga! Kå gjer du her?", "Idunn! Du æ sju kilometer frå Ål-dialekt og velje Oslo. KØFFER?",
      ],
      annaAfter: [
        "Tøm og røm! ...e har ingenting å tømme. E røm likevel.", "Idunn, du æ frå HEMSEDAL. Sei det på hallingmål!",
        "Hihi. Klassisk Idunn.", "TØM OG RØM! ...no seie e det òg. Kå har du gjort med mæg?",
      ],
      comeIn: ["Jeg kommer inn! Legg deg på sofaen, skuldrene først.", "Tøm og røm – inn! Hvor er teppet?", "Jeg tar med oljen inn!"],
      bye: ["Tøm og røm! Ha det!", "Ha det, vennen! Strekk ut nakken!", "Må stikke – tøm og røm, vi ses på Tyven!", "Pust ut, Anna. Ha det!"],
      face: "happy",
      dialekt: -8,
      effects: { mood: 15, festlyst: 10 },
    },
    hennie: {
      name: "Hennie", from: "Bygdøy", emoji: "👱🏼‍♀️", image: "assets/sprites/hennie/face.png",
      knock: ["*tapp tapp*", "*bank bank* Hallooo?", "*vinkar med ein EpiPen*"],
      lines: [
        ["Hei Anna! Er det peanøtter i huset? Bare spør, liksom.", "*sjenert* Ja, nei, ingen peanøtter. Sjekka to gonger. Ganger."],
        ["Herregud, så koselig vindu! Er det... er det peanøttsmør på karmen?!", "Det æ... det er kitt! Vanlig kitt! Ingen nøtter!"],
        ["Hei! Jeg var på vei fra hytta i Hafjell. Pappa kjørte meg. Med båten. Neida.", "Hafjell! Så... fint. Vi he... vi har også fjell i Ål."],
        ["Du snakker så søtt, liksom! Si «laussnø» igjen!", "Laussnø. *raudnar* Laussnø, liksom."],
        "Jenny sa du hadde vors-planer. Jeg tar med alkoholfri cava. Og EpiPen.",
        "Helt seriøst, Trondheim er så sjarmerende. Litt som Bygdøy. Bare... nei.",
        "Jeg har kjøpt nye ski. De er SÅ in denne sesongen, liksom.",
        "Har du sett at det står «kan inneholde spor av nøtter» på ALT nå? Jeg dør.",
        ["Hei! Jeg vil bare si at du var helt fin på lørdag. Du gjorde ingenting rart.", "«Ingenting rart»?! Kå gjorde e?!"],
        ["Mamma lurer på om du vil være med på hytta i påsken? Det er peanøttfritt!", "Hytta i påsken? JA. Altså: ja, det hadde vært sykt hyggelig."],
      ],
      annaReacts: [
        "*sjenert* Å, hei Hennie! Jeg er bare... heime. Hjemme. Liksom.", "Hennie! Ingen peanøtter her, jeg lover!",
        "*rettar på håret* Hei! Det er... sånn helt vanlig her, altså.", "HENNIE! E... jeg mener: hei, Hennie!",
        "Hennie! *gøymer peanøttposen bak ryggen*",
      ],
      annaAfter: [
        "*sjenert* Så... sykt fint, liksom.", "Ja! Altså... ja. Helt enig. Liksom.", "*kviskrar* Køffer snakkar e Oslo no?",
        "Herregud, ja. ...sa e nettopp herregud?",
      ],
      comeIn: ["Jeg kommer inn! Har du tørket av bordet? Nøttestøv, liksom.", "Yay! Jeg tar av meg skoene. Er det gulvvarme?", "Jeg kommer! Herregud så koselig!"],
      bye: ["Ha det, vennen! Ingen peanøtter!", "Må stikke, mamma ringer. Klem!", "Ha det! Si «laussnø» en gang til! ...Åh, så søtt.", "Vi ses på vors! Herregud!"],
      face: "shy",
      dialekt: -25,
      effects: { mood: 10, festlyst: 10 },
    },
  },
};

// Saturday vors: guests chatter. dialekt: how much Anna's dialect drops (Oslo people → shy)
LUX.content.vorsGuests = {
  everySeconds: [32, 65],
  guests: [
    { name: "Hennie", from: "Bygdøy",
      lines: [
        "Er det peanøtter i den skåla?! Eg er SÅ allergisk!", "Herregud, så koselig vors, liksom!", "Anna, du snakker så søtt, liksom!",
        "Hvem har med seg peanøttsmør-chips?! HVEM?!", "Jeg har EpiPen i veska. Og leppestift. Prioriteringer.",
        "Pappa sier hei! Han vet ikke hvem du er, men han sier hei.", "Kan vi sette på noe après-ski? Jeg er SÅ i après-modus.",
        "Anna, si «kå» igjen! Herregud, jeg dør.", "Dette er det beste voret siden Molde, helt seriøst.",
      ],
      anna: [
        "*sjenert* Nei da, det er ikke peanøtter, liksom. Jeg sjekket.", "Ja, jeg er liksom fra... ja. Hallingdal.",
        "*kviskrar* Køffer snakkar e Oslo no? E HØYRER det sjølv.", "Kå? Hva. Hva, mener jeg. Liksom.",
        "Après-ski? Ja! Sykt... digg. Sier man det?", "Ingen peanøtter! Jeg har ristet alle skålene!",
      ],
      dialekt: -25 },
    { name: "Idunn", from: "Hemsedal",
      lines: [
        "Noen som vil ha massasje? Anna, skuldrene dine er SÅ stramme.", "Sitt stille, jeg masserer deg.",
        "Eg er fra Hemsedal, men jeg snakker liksom Oslo. Det bare ble sånn.", "TØM OG RØM! Taxien kommer om ti!",
        "Tøm og røm, folkens! Halvfulle glass er en fornærmelse.", "Hemsedal har bedre afterski enn Ål. Bare sier det.",
        "Kom igjen, alle sammen: tøm... og... RØM!", "Jeg masserte dørvakta på Studentersamfundet en gang. Vi kom inn gratis.",
        "Anna, du er så spent i nakken. Er det Adam? Det er Adam.",
      ],
      anna: [
        "Åh... ja... DER. Idunn, du er en gave.", "Massasje på vors? Molde folkehøgskule æ livet!",
        "TØM OG RØM! ...vent, e har nettopp fylt glaset.", "Hemsedal?! Ål æ betre! Det æ fakta, Idunn!",
        "Du æ frå HEMSEDAL. Sei «kå». Sei det!", "*lukkar augo* Ikkje stopp. Aldri stopp.",
      ],
      dialekt: -10 },
    { name: "Jenny", from: "Molde fhs",
      lines: [
        "As you shouuuuld, SLAYYY!", "Anna, du ser HELT sykt bra ut i kveld!", "Har du drukket vann? Bra. SLAYYY.",
        "Spillelista mi er klar. Det er bare Robyn. SLAYYY.", "Glitter-tid! Alle står stille!",
        "Jeg passer på deg i kveld, vennen. Ikke noe bord-dansing. Litt bord-dansing.", "Skål for Molde folkehøgskole!",
      ],
      anna: ["SLAYYY!", "Jenny! Ein skål for Molde!", "Robyn! E ELSKAR Robyn!", "Litt bord-dansing. LITT.", "Glitter i håret? Igjen? JA."],
      dialekt: 0 },
    { name: "Hadi", from: "Brønnøysund",
      lines: [
        "Kem e han Edvin egt? Nokon her som heite Edvin?", "Visste dokker at @fact", "Æ har med snacks. Ingen peanøtter, Hennie!",
        "Æ dansar som ein krabbe, men ein glad krabbe.",
      ],
      anna: ["HADI KOM! Vorset æ komplett!", "Edvin, om du æ her: sei fra!", "Hadi, du æ ein krabbe e elskar."],
      dialekt: 5 },
  ],
};

LUX.content.adamMeter = {
  perMention: 8,          // % per mention
  drainSeconds: 900,      // empties in 15 min
  feverSeconds: 120,      // Adam-feber lasts this long
  afterFever: 30,
  feverMood: 15,
  // the meter is full: Adam texts / calls, and for a while she can't talk about anything else
  fever: {
    call: [
      ["📱 *melding frå Adam* «Hej! Vad gör du? Ska vi åka skidor imorgon?»", "*raudnar* ...kvifor smiler e så mykje?", "Han skreiv «hej». Kå betyr det? Kå betyr «hej»?!"],
      ["📱 *Adam ringer*", "H-hei Adam! ...nei, e gjer ingenting. Ja. Nei. Kanskje. Hade!", "...e sa «hade» før han sa noko. Det gjekk fint."],
      ["📱 *melding frå Adam* «Jag bakade för mycket kanelbullar. Hjälp?»", "Han treng HJELP. Med BULLAR. E æ på veg.", "Ikkje sei det til Emma."],
      ["📱 *Adam sende eit bilete av laussnø*", "Det æ... det æ det vakraste biletet e har sett.", "Snøen. E mæine snøen. Berre snøen."],
    ],
    during: [
      "Adam sa «härligt» i dag. Kå trur du han meinte?",
      "E tenkje ikkje på Adam. E tenkje på... ski. Med Adam. NEI.",
      "Kå æ vi? Ingen veit. Ikkje spør.",
      "Svenske gutar seie «kul» på ein heilt spesiell måte.",
      "Har du nokon gong tenkt på kor fint ordet «lagom» æ? Nei? E heller ikkje. Før no.",
      "Kanelbullar æ eigentleg det beste brødet som finst. Ikkje av nokon spesiell grunn.",
      "Chamonix æ sikkert fint. Ikkje at e bryr mæg. E googla det berre.",
      "Kva skjer om ein seie «hej» tilbake med eit hjarte? Hypotetisk.",
      "E smiler ikkje. Dette æ ansiktet mitt. Det ser berre slik ut i dag.",
      "Uff, kor varmt det æ her inne. Æ dæ varmt? Det æ varmt.",
    ],
    end: ["Okei. Ferdig å tenke på Adam. Heilt ferdig.", "Kå snakka vi om? Ikkje Adam. Noko anna.", "Puh. Tilbake til normalen. Kva æ normalen?", "Okei, e æ kul no. Ser e kul ut? Sei at e ser kul ut."],
  },
};

// ============================================================
//  GUESTS IN THE LIVING ROOM – after a window visit you can let Hadi, Jenny, Idunn, Hennie or Adam in.
//  They stand in the room for a while (staySeconds), chat now and then, react when you click them,
//  and leave by themselves (or when Anna goes out). pos = where they stand (CSS, % of the stage).
//  chat = what they say by themselves · hungover / vors / sofa = extra lines for that situation
//  anna = what Anna says back · face = Anna's expression around them
// ============================================================
LUX.content.guests = {
  staySeconds: 150,
  chatSeconds: [18, 32],
  hadi: {
    name: "Hadi", color: "#e8c34a", pos: { left: "25%", bottom: "11%", height: "58%" },
    enter: ["Ka du driv me? Æ tok med snacks!", "Hei hei! Æ har ein HEIL bunke funfacts te dæ.", "Så her bur dokker! Det e midt i Trondheim. Som Brønnøysund e midt i Norge."],
    chat: [
      "Kem e han Edvin egt?",
      "Visste du at Brønnøysund ligg midt i Norge?",
      "Æ e så svolten at æ kunne ete ein hel kveite.",
      "@fact",
      "@fact",
      "@fact",
      "Det va skikkelig gøtt å kom hit, altså.",
      "Æ har ein teori om Edvin. Han e ein person. Det e teorien.",
      "Torghatten har eit hol tvers gjennom. Ingen veit kem som laga det. Kanskje Edvin.",
      "Ka e passordet på wifien? «laussnøtepungen»? Med store bokstava?",
      "Æ prøvde hallingdans i går. Æ treffte taklampa. Med foten. Det e eit godt tegn.",
      "Visste du at æ veit nesten alt? Unntatt kem Edvin e.",
      "Æ har lagd eit quizlag-namn: «Hadi og dei andre». Det e demokratisk.",
      "Den sofaen der ser ut som han har opplevd ting.",
    ],
    hungover: [
      "Æ har med Solo og boller. Det e vitenskapeleg bevist at det hjelpe. Av mæ.",
      "Du gjorde ingenting rart. Du forklarte berre Brønnøysund te ein taxisjåfør. Med kart.",
      "Visste du at bakrus e verst klokka elleve? Det e klokka elleve no. Beklager.",
    ],
    sofa: ["Ka e Skal vi danse? Æ trudde det va eit spørsmål.", "Han dansaren der e fra Helgeland. Æ kjenne det på knærne hans."],
    poked: ["Hæ? Ka e det?", "Æ har ein funfact te: @fact", "Ikkje kil! Æ e kilen!", "Ja? Har du funne Edvin?", "Æ e ikkje ein knapp! ...men visste du at @fact"],
    anna: [
      "HADI! Det visste e ikkje!", "Kvenn ÆR Edvin?!", "Hadi, du æ eit leksikon.", "E ska bruke den på quiz på torsdag!",
      "Hadi, du kan ikkje berre seie ting og forvente at e trur på dei. ...men e trur på dei.", "Midt i Noreg. Ja. Vi VEIT.",
      "Passordet æ IKKJE det. ...jo, det æ det.", "Hadi, du æ ein skatt. Ein litt rar skatt.", "Visste du at e elskar fakta? Det visste du.",
    ],
    leave: ["Æ må hjem å få mæ ein dupp. Ha det!", "Ha det! Kem e han Edvin egt? Tenk på det!", "Æ må gå. Edvin venta. Neida. Ha det!"],
    effects: { mood: 10 },
  },
  jenny: {
    name: "Jenny", color: "#e86a9a", pos: { left: "25%", bottom: "11%", height: "60%" },
    enter: ["Hei fineste! Så koselig her, liksom!", "SLAYYY! Jeg kom inn, håper det er greit!", "Herregud, så fin stue! Ser du det, Anna? Det er glitter i lufta!"],
    chat: [
      "As you shouuuuld, SLAYYY!",
      "Har du drukket vann i dag? Bra.",
      "Den kjolen der, altså. Helt sykt fin.",
      "Skal vi ha vors på lørdag? Jeg tar med Hennie og Idunn.",
      "Husk: INGEN peanøtter når Hennie kommer.",
      "Du er så flink, Anna. Jeg mener det, liksom.",
      "Jeg har laget en spilleliste til deg. Den heter «DJ LUX sin støttespiller».",
      "Idunn sier tøm og røm om alt nå. Til og med på kaffe.",
      "Adam, a? Hihi. Jeg sier ingenting. Jeg SIER ingenting!",
      "Jeg savner Molde så sykt. Trollstigen, liksom! Fjorden!",
      "Er det her du øver DJ-ing? Det er SÅ deg.",
      "Hold opp, du har fått nye ski på veggen? SLAYYY.",
      "Vi må ha en Molde-gjenforening. Med kostymer. Og vann.",
    ],
    hungover: [
      "Hvordan har du det, vennen? Du var helt fin i går, lover!",
      "Jeg tok med en bolle og vann. Spis litt, a.",
      "Nei, du gjorde ingenting rart. Bare litt dans. Mye dans.",
      "Du sendte meg en talemelding på fire minutter. Den var søt! Mest søt.",
      "Telefonen din er på lading. Ikke se på den før du har spist.",
      "Du sa du elsket meg ti ganger. Det er ikke rart. Det er riktig.",
    ],
    vors: ["SLAYYY, det er vors! Alle sammen: vann mellom hver drink!", "Hvem tar bilde? Jeg tar bilde! Alle sier SLAYYY!"],
    sofa: ["SKAL VI DANSE! Herregud, han dansen der! As you shouuuuld!", "Jeg grein på forrige episode. To ganger."],
    poked: ["Hihi, SLAYYY!", "Hva er det, fineste?", "Klem? Klem.", "Har du drukket vann? Bare sjekker.", "As you shouuuuld!"],
    anna: [
      "SLAYYY!", "Jenny, du æ best.", "Molde folkehøgskule æ livet, altså!", "...lovar du at e ikkje gjorde noko rart?",
      "Jenny, du æ mammaen i gjengen.", "Ein spilleliste TIL MÆG? *grin litt*", "Trollstigen! E saknar Trollstigen!",
      "Vatn. Ja. E drikk vatn. No. Sjå.", "Ikkje sei noko om Adam! ...kå sa du om Adam?",
    ],
    leave: ["Slayyy, vi ses! Drikk vann!", "Må stikke, glad i deg!", "Ha det, vennen! As you shouuuuld!"],
    effects: { mood: 15, festlyst: 5 },
  },
  idunn: {
    name: "Idunn", color: "#c9845a", pos: { left: "25%", bottom: "11%", height: "60%" },
    enter: ["Hei! Legg deg ned, skuldrene først.", "Tøm og røm – og nå er jeg her! Hva skjer?", "Åh, så god energi i denne stua, liksom."],
    chat: [
      "Tøm og røm!",
      "Anna, du er så stram i nakken. Sitt stille.",
      "Hemsedal fikk 30 cm i natt. Bare sier det.",
      "Jeg gjorde yoga i morges. Nå er jeg klar for alt. Spesielt vors.",
      "Hvis jeg sier tøm og røm én gang til, må du stoppe meg. ...tøm og røm!",
      "Massasje er bare å gi kjærlighet med tomlene, liksom.",
      "Visste du at det finnes 400 muskler i... nei, Hadi sa det. Jeg vet ikke.",
      "Vi kunne vært i Hemsedal nå. På afterski. Bare tenk på det.",
      "Jeg snakker Oslo fordi jeg bodde i Oslo i to år. Og fordi Hemsedal er... nei, Hemsedal er fint.",
      "Hvem har sterkere skuldre, Adam eller Hadi? Jeg har massert begge. Jeg sier ingenting.",
      "Har dere te? Kamille? Nei? Pils går også.",
      "Jeg ga Emma en massasje i gangen. Hun sa «tack». Så låste hun døra.",
    ],
    hungover: [
      "Ligg stille. Jeg tar tinningene. Pust inn... og ut. Og glem i går.",
      "Du gjorde ingenting rart! Du bare ropte «tøm og røm» i heisen. Det var mitt ord, men greit.",
      "Vann, ingefær og massasje. Hemsedal-kuren. Funker hver gang.",
    ],
    vors: ["TØM OG RØM! Taxien er bestilt!", "Alle på rekke: skuldermassasje-tog før vi går!"],
    sofa: ["Skal vi danse? Jeg masserer deg under hele episoden.", "Den dansen der krever sykt mye kjernemuskulatur."],
    poked: ["Au! Du har stramme fingre. La meg ta dem.", "Tøm og røm!", "Hihi! Vil du ha massasje?", "Jeg er fra Hemsedal, ikke kilen. Jo, kilen."],
    anna: [
      "Tøm og røm! ...e har ingenting å tømme.", "Hemsedal har IKKJE betre snø enn Ål!", "Åh... ja... skuldrene. Ikkje stopp.",
      "Du æ frå Hemsedal, Idunn. Sei «kå». Berre ein gong.", "Kamille? Vi he... pils og dirty fries.", "Tomlar med kjærleik. Det æ vakkert, Idunn.",
      "Ikkje massér Emma! Ho LÅSER oss inne.", "Stopp deg sjølv! TØM OG RØM! ...å nei, no gjorde e det.",
    ],
    leave: ["Tøm og røm! Ha det!", "Jeg må gå, jeg har massasje-avtale med Hennie sin nakke. Ha det!", "Pust ut, vennen. Tøm og røm!"],
    face: "happy",
    effects: { mood: 15, festlyst: 5 },
  },
  hennie: {
    name: "Hennie", color: "#5a7ab0", pos: { left: "25%", bottom: "11%", height: "61%" },
    enter: ["Hei! Jeg har sjekket gangen for peanøtter. Den er ren.", "Herregud, så sjarmerende! Er det her dere bor? Alle sammen?", "Hei vennen! Jeg tok med alkoholfri cava. Og EpiPen."],
    chat: [
      "Er det peanøtter i den skåla?",
      "Anna, du snakker så søtt, liksom!",
      "Pappa har kjøpt ny båt. Den heter «Bygdøy 2». Den første heter «Bygdøy».",
      "Jeg har lest ingredienslisten på ALT i kjøleskapet. Dere har en farlig sennep.",
      "Si «kå» igjen! Herregud, jeg dør.",
      "Helt seriøst, er det ikke rart at kokosnøtt ikke er en nøtt? Jeg stoler ikke på den.",
      "På hytta i Kvitfjell har vi en nøttefri sone. Det er hele hytta.",
      "Jenny sier du skal spille på Grafen? Jeg kommer! Jeg tar med hele Bygdøy.",
      "Hvilke ski kjører du på nå? Er de in? De ser in ut.",
      "Jeg ble nesten skikkelig sjenert av dialekten din. Den er så... ekte, liksom.",
      "Idunn ga meg massasje på trikken. Folk klappet.",
      "Hvorfor heter det Kannikestredet? Det høres ut som et nøttemerke. Jeg er nervøs.",
    ],
    hungover: [
      "Du var helt fin i går! Du sa bare at Bygdøy er «ein halvøy for folk med båt». Det er jo sant!",
      "Jeg har med smoothie. Nøttefri. Jeg har sjekket tre ganger.",
      "Mamma sier bakrus er en holdning. Hun har aldri hatt bakrus. Tror jeg.",
    ],
    vors: ["HVEM har med Nøtti Frutti?! Ut. UT.", "Après-ski-musikk, NÅ! Jeg er SÅ i modus!"],
    sofa: ["Skal vi danse! Mamma kjenner en av dommerne. Ikke si det til noen.", "Den kjolen der er fra en butikk i Bogstadveien. Jeg vet det."],
    poked: ["Hihi! Herregud!", "Hva er det? Er det en nøtt? ER DET EN NØTT?", "Si «laussnø» igjen!", "Du er så søt, liksom!"],
    anna: [
      "*sjenert* Nei da, ingen peanøtter. Liksom.", "Ja, jeg er fra... Ål. Det ligger... ja.", "Kokosnøtt æ ein frukt! Trur e. Ikkje et den.",
      "*kviskrar* Køffer snakkar e Oslo? Det berre skjer når ho æ her.", "Den sennepen æ ufarleg! ...e kastar han.", "«Bygdøy 2». Sjølvsagt.",
      "Laussnø. *raudnar* Sånn. Liksom.", "Ein nøttefri sone. På heile hytta. Det æ faktisk smart.",
    ],
    leave: ["Ha det, vennen! Hold huset nøttefritt!", "Må stikke, pappa venter med bilen. Klem!", "Ha det! Si «kå» en gang til! ...åh, jeg dør."],
    face: "shy",
    effects: { mood: 10, festlyst: 5, dialekt: -20 },
  },
  adam: {
    name: "Adam 🇸🇪", color: "#2a64b8", pos: { left: "24%", bottom: "10%", height: "62%" },
    enter: ["Härligt! Vilket mysigt vardagsrum.", "Hej! Jag har kanelbullar med mig. Var ska jag sätta dem?", "Hej! Jag tar av mig pjäxorna. Mössan behåller jag."],
    chat: [
      "Ska vi åka skidor imorgon? Det kommer snö.",
      "Vill du ha en kanelbulle? Jag bakade dem själv.",
      "Lagom mycket kaos här. Jag gillar det.",
      "När jag bodde i Chamonix... okej, jag slutar.",
      "Vad tittar vi på? Skal vi danse? Jag är med.",
      "Du är så rolig när du pratar hallingdal.",
      "Asså, prognosen säger puder på lördag. Typ en meter. Typ.",
      "Jag lärde mig ett nytt norskt ord: «digg». Är det digg att säga digg?",
      "Emma tittar på mig genom nyckelhålet. Jag ser hennes öga.",
      "Fika? Det är alltid tid för fika.",
      "Jag har vaxat dina skidor. Jag frågade inte. Förlåt. Det blev grymt.",
      "Varför har ni en pilsback i vardagsrummet? Det är... härligt, faktiskt.",
    ],
    hungover: ["Jag har med mig kaffe och en bulle. Säg inget. Bara ät.", "Du var jättegullig igår. Du sjöng för en taxi."],
    sofa: ["Den där dansaren är svensk. Jag ser det på hans självförtroende.", "Ska vi dansa också? Lagom mycket?"],
    poked: ["Haha, vad gör du?", "Hej på dig. 😊", "*rodnar* ...ja?", "Det kittlas! Sluta! ...fortsätt."],
    anna: [
      "*raudnar* E... ja. Kanelbulle. Ja takk.", "Ikkje sei Chamonix igjen.", "Härligt. ...sa e nettopp härligt?!", "Adam, du kan ikkje berre stå der og vere søt.",
      "Ein meter pudder? Ikkje tull med mæg, Adam.", "Du VOKSA skia mine?! Det æ det finaste nokon he gjort.", "«Digg» æ digg. Slutt å seie digg.",
      "Ikkje sjå mot nøkkelholet. Ho ser oss.",
    ],
    leave: ["Jag måste gå. Hej då! ❤️", "Ses i backen imorgon? Hej då!", "Hej då! Spara en bulle till Sandra."],
    emma: ["Emma (frå rommet): ADAM. Inte. I. Mitt. Rum.", "Emma (frå rommet): Jag hör att du är här, Adam!", "Emma (frå rommet): Jag har en kamera vid min dörr nu, Adam."],
    effects: { mood: 15, adam: 2 },
  },
};
