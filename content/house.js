// ============================================================
//  HOUSE – the collective in Kannikestredet, plus the other places.
//
//  backgrounds: a picture to use instead of the drawn scene (null = drawn pixel scene).
//               Put the picture in environments/ and write its path here, e.g.
//               home: "environments/living_room.jpg". Then nudge the hotspots below to match it.
//  hotspots:    clickable things, in % of the stage (x, y = top-left corner, w, h = size).
//  anna:        where Anna stands / lies (CSS values), per scene.
//  window:      the window glass where Hadi and Jenny pop up (in % of the stage).
// ============================================================
window.LUX = window.LUX || {};
LUX.content = LUX.content || {};

LUX.content.house = {
  backgrounds: { home: null, school: null, gym: null, bar: null, vors: null, grafen: null, mountain: null },

  anna: {
    default: { left: "50%", bottom: "8%", height: "62%" },
    sofa: { left: "51%", bottom: "25%", height: "25%" },     // lying on the sofa (her sofa picture covers the drawn sofa)
    school: { left: "50%", bottom: "4%", height: "58%" },
    bar: { left: "40%", bottom: "6%", height: "60%" },
  },

  // the window glass in the drawn living room (Hadi / Jenny appear here)
  window: { left: "31.6%", top: "10.5%", width: "19.1%", height: "31.5%" },
  windowBubble: { left: "53%", top: "24%" },
  windowChoice: { left: "31%", top: "44%" },
  // the roommates' doors in the drawn living room (they open a crack and peek out)
  doors: {
    sandra: { left: "1.25%", top: "23%", width: "8.1%", height: "42.5%" },
    marthe: { left: "10.3%", top: "23%", width: "8.1%", height: "42.5%" },
    emma: { left: "19.4%", top: "23%", width: "8.1%", height: "42.5%" },
  },
  // where roommates' bubbles show up (they shout from their rooms on the left)
  roommateBubble: { left: "2%", top: "4%" },

  hotspots: {
    home: [
      { id: "doorSandra", label: "Sandra sitt rom", x: 0.8, y: 22, w: 8.6, h: 43.5 },
      { id: "doorMarthe", label: "Marthe sitt rom", x: 9.9, y: 22, w: 8.6, h: 43.5 },
      { id: "doorEmma", label: "Emma sitt rom (IKKJE gå inn)", x: 19, y: 22, w: 8.6, h: 43.5 },
      { id: "window", label: "Vindauget", x: 30.3, y: 8.5, w: 21.9, h: 35.5 },
      { id: "poster", label: "Ål-plakaten", x: 58.4, y: 12, w: 8.2, h: 17.5 },
      { id: "disco", label: "Discokula", x: 63.5, y: 2, w: 4, h: 10 },
      { id: "lamp", label: "Stålampa", x: 70.3, y: 30, w: 5.4, h: 46 },
      { id: "skis", label: "Skia", x: 76.5, y: 16, w: 5, h: 49.5 },
      { id: "tv", label: "TV-en", x: 82.5, y: 45, w: 15.3, h: 17 },
      { id: "kitchen", label: "Dirty fries (Sandra laga dei)", x: 50.6, y: 70, w: 5.6, h: 5.5 },
      { id: "phone", label: "Mobilen", x: 57.8, y: 71.5, w: 3, h: 3.5 },
      { id: "decks", label: "DJ-pulten (DJ LUX HQ)", x: 1.9, y: 63.5, w: 25.6, h: 13.5 },
      // the collection on the walls / floor (empty until you win things) → opens the SKI-magasin
      { id: "skiwall", label: "Skiveggen (SKI-magasinet)", x: 81.9, y: 26.5, w: 17, h: 18 },
      { id: "trophies", label: "Trofé og premiar", x: 58.5, y: 31, w: 12, h: 9.5 },
      { id: "gearfloor", label: "Skiutstyret", x: 73.5, y: 77.5, w: 23, h: 9 },
    ],
    school: [
      { id: "whiteboard", label: "Tavla – svensktime", x: 18, y: 8, w: 64, h: 39 },
      { id: "clock", label: "Klokka", x: 86, y: 9, w: 9, h: 15 },
    ],
    gym: [
      { id: "bench", label: "Benken – ikke tenk bare benk", x: 6.9, y: 74, w: 18, h: 14 },
      { id: "gymboard", label: "Tavla med stasjonane", x: 78, y: 16.5, w: 20, h: 26 },
      { id: "gym", label: "Sirkeltrening", x: 26, y: 19, w: 42, h: 7.5 },
      { id: "clock", label: "Klokka", x: 70.8, y: 18.8, w: 5.3, h: 8.5 },
    ],
    bar: [{ id: "bar", label: "Baren på Tyven", x: 60, y: 30, w: 38, h: 40 }],
    vors: [
      { id: "window", label: "Vindauget", x: 30.3, y: 8.5, w: 21.9, h: 35.5 },
      { id: "decks", label: "Musikken", x: 1.9, y: 63.5, w: 25.6, h: 13.5 },
      { id: "disco", label: "Discokula", x: 63.5, y: 2, w: 4, h: 10 },
      { id: "kitchen", label: "Dirty fries", x: 50.6, y: 70, w: 5.6, h: 5.5 },
    ],
    grafen: [],
    mountain: [],
  },
};
