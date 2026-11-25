// ============================================================
//  SHOP + SKI-MAGASIN – what you can buy with coins, and what you can win.
//  Everything you buy or win shows up in the game (drawn in js/scene-hd.js): the DJ controller on the desk in the
//  living room, the light show in the room (evenings / vors) and at Grafen, won skis on the ski wall, gear on the
//  floor, medals and story prizes on the walls, snacks on the table (stayMinutes), the bungee voucher on the window.
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.shop = {
  // DJ controllers: window = extra timing window in ms in the DJ game (bigger = easier), lanes stay 4
  gear: [
    { id: "laptop", name: "Laptop med gratis-app", price: 0, window: 0, desc: "Det fungerer. Stort sett." },
    { id: "ddj", name: "Liten DJ-kontroller", price: 80, window: 20, desc: "Ekte knappar! Ekte jogwheels!" },
    { id: "xdj", name: "Stor alt-i-eitt-kontroller", price: 220, window: 40, desc: "Klubbstandard. DJ LUX-standard." },
    { id: "cdj", name: "Klubboppsett med to CDJ-ar og miksar", price: 500, window: 60, desc: "Grafen-nivå. Folk kjem til å grine." },
  ],
  // light shows: hype = multiplier on how fast the dance floor heats up
  lights: [
    { id: "ingen", name: "Taklampa", price: 0, hype: 1, desc: "Ho æ på. Det æ alt." },
    { id: "disco", name: "Discokule", price: 60, hype: 1.15, desc: "Klassikar. Glitrar på kronlysa." },
    { id: "laser", name: "Laser og røyk", price: 200, hype: 1.3, desc: "Røykvarslaren på Grafen æ litt nervøs." },
    { id: "jubileum", name: "TF-40 lysshow med konfettikanon", price: 450, hype: 1.5, desc: "Jubileumsgallaen fortener det." },
  ],
  // outfits: ids from content/outfits.js. price 0 = owned from the start
  outfits: [
    { id: "kjole_gronn", price: 0 },
    { id: "ski_bla", price: 0 },
    { id: "kjole_rod", price: 60 },
    { id: "kjole_bla", price: 60 },
    { id: "kjole_svart", price: 80 },
    { id: "kjole_rosa", price: 80 },
    { id: "kjole_gull", price: 300 },
    { id: "ski_oransje", price: 50 },
    { id: "ski_lilla", price: 50 },
    { id: "ski_gronn", price: 50 },
    { id: "ski_svart", price: 70 },
    { id: "ski_rosa", price: 0, sponsor: true },   // only for Sponsored Skiers
  ],
  // 🛍️ Diverse: used right away
  misc: [
    { id: "fries", name: "🍟 Dirty fries-ingrediensar til Sandra", price: 15, effects: { mood: 20 },
      line: "Sandra lagar dirty fries! Dette æ den beste dagen i mitt liv.",
      stayMinutes: 20, where: "Dirty friesa står på teppet i stua (i 20 min)." },
    { id: "pils", name: "🍺 Ein runde pils til TF-gjengen", price: 25, effects: { festlyst: 30, mood: 10 },
      line: "SKÅL! For TF! For laussnø! For... kå skåla vi for?",
      stayMinutes: 45, where: "Pilskassa står ved sofaen i stua (i 45 min)." },
    { id: "bungy", name: "🪂 Gåvekort på strikkhopp", price: 120, effects: { mood: 40, festlyst: 20 },
      line: "STRIKKHOPP! Naken eller ikkje naken, det æ spørsmålet...",
      keep: true, where: "Gåvekortet heng teipa på stuevindauget." },
  ],
};

// ============================================================
//  SKI-MAGASIN – the collection (like a sticker album).
//  rarity: 1 common … 4 legendary. Things drop after DJ gigs and ski runs; some come from the story.
// ============================================================
LUX.content.collection = {
  skis: [
    { id: "atomic_bent100", name: "Atomic Bent 100", rarity: 1, desc: "Allround-favoritten. Leikne og trygge." },
    { id: "k2_mindbender", name: "K2 Mindbender 99", rarity: 1, desc: "Til dei som vil gjere alt." },
    { id: "salomon_qst", name: "Salomon QST 106", rarity: 1, desc: "Frikjøring med franske manerar." },
    { id: "volkl_revolt", name: "Völkl Revolt 104", rarity: 2, desc: "Park + pudder = Anna." },
    { id: "atomic_bent110", name: "Atomic Bent 110", rarity: 2, desc: "Breiare. Meir pudder. Meir glede." },
    { id: "k2_reckoner", name: "K2 Reckoner 112", rarity: 2, desc: "For backflip-landing i laussnø." },
    { id: "bc_atris", name: "Black Crows Atris", rarity: 3, desc: "Chamonix-ski. Adam he same. Tilfeldig." },
    { id: "bc_anima", name: "Black Crows Anima", rarity: 3, desc: "Pudder te pungen-ski." },
    { id: "japan_powder", name: "Japansk pudderplanke 120", rarity: 3, desc: "Kjøpt i Niseko. Nesten ein snowboard." },
    { id: "bc_corvus", name: "Black Crows Corvus Freebird", rarity: 4, desc: "Legendariske. Ein toppturdraum." },
    { id: "al_1987", name: "Ål skisenter-ski frå 1987", rarity: 4, desc: "Funne i ein kjellar i Ål. Heilag relikvie." },
  ],
  gear: [
    { id: "hjelm", name: "Hjelm med TF-klistremerke", rarity: 1, desc: "Tryggleik først. Klistremerke andre." },
    { id: "goggles", name: "Goggles med speglglas", rarity: 1, desc: "Ingen ser auga dine. Perfekt søndag." },
    { id: "staver", name: "Toppturstaver", rarity: 1, desc: "Til å peike på laussnø med." },
    { id: "skredsokar", name: "Skredsøkar", rarity: 2, desc: "Obligatorisk. Hadi sjekka at han verkar." },
    { id: "feller", name: "Feller", rarity: 2, desc: "For å gå opp. Det tunge før det gode." },
    { id: "airbag", name: "Airbag-sekk", rarity: 3, desc: "Dyr. Viktig. Rosa." },
    { id: "skisko", name: "Varme skisko frå Ål", rarity: 3, desc: "Dei einaste varme skiskoa i verda." },
  ],
  medals: [
    { id: "tf_medalje", name: "🏅 TF-medalje", rarity: 3, desc: "Utdelt for eit legendarisk sett på Jubileumsgallaen." },
    { id: "tf_kjekkeste", name: "😎 TF sin kjekkaste", rarity: 4, desc: "Kåra av heile TF. Ingen protestar." },
    { id: "sponsored", name: "⭐ Sponsored Skier", rarity: 4, desc: "Sponsorkontrakt! +50 % 🪙 frå alle gigs, og ein rosa skidress." },
    { id: "kasta_ut", name: "📄 Utkastingsbrev frå NTNU", rarity: 3, desc: "Innramma. Heng over senga." },
    { id: "van_temja", name: "🚐 Vanen sin bilnøkkel", rarity: 3, desc: "Vanen æ temja. For no." },
    { id: "al_laerar", name: "🍎 Fast stilling i Ål", rarity: 4, desc: "Lærar i Ål, ski kvar dag. Draumen." },
  ],
};
