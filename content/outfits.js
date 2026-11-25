// ============================================================
//  OUTFITS – Anna's wardrobe.
//
//  Each outfit is a folder in assets/sprites/<id>/ with one image per pose
//  (base, excited, sad, annoyed, sour, shocked, guilty, dreamy, sleepy, study,
//   sofa, dj, dance, ski, proud). Missing poses fall back automatically.
//
//  The sprites are built from the images in expression/<family>/ by:
//      python3 tools/build_sprites.py
//  "family" = which set of pictures the outfit is made from (expression/dress/ or expression/ski/),
//  the colour variants are made by recolouring (see FAMILIES at the top of the script).
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.outfits = {
  // galla dresses (expression/dress/ – generated in dark green)
  kjole_gronn: { name: "Mørkegrøn gallakjole", family: "dress" },
  kjole_rod:   { name: "Raud gallakjole", family: "dress" },
  kjole_bla:   { name: "Blå gallakjole", family: "dress" },
  kjole_svart: { name: "Svart gallakjole", family: "dress" },
  kjole_rosa:  { name: "Rosa gallakjole", family: "dress" },
  kjole_gull:  { name: "Gullkjole (Jubileums-edition) ✨", family: "dress", fancy: true },
  // ski outfits (expression/ski/ – generated in bright blue)
  ski_oransje: { name: "Oransje skidress", family: "ski" },
  ski_bla:     { name: "Blå skidress", family: "ski" },
  ski_lilla:   { name: "Lilla skidress", family: "ski" },
  ski_gronn:   { name: "Grøn skidress", family: "ski" },
  ski_svart:   { name: "Svart skidress", family: "ski" },
  ski_rosa:    { name: "Rosa skidress (Sponsored Skier) ⭐", family: "ski", fancy: true },
};

// Which outfits she picks in which situation (only outfits you own in the shop).
// "dress" / "ski" = any outfit of that family. One is chosen per day, so she doesn't change every second.
LUX.content.outfitRules = {
  dj:       ["dress"],
  vors:     ["dress"],
  pils:     ["ski"],
  ski:      ["ski"],
  school:   ["ski"],
  training: ["ski"],
  home:     ["ski"],
  sofa:     ["dress"],           // the sofa picture is in a dress
  hungover: ["dress"],          // still in last night's dress (the sofa picture is a dress)
  asleep:   ["ski"],
};
