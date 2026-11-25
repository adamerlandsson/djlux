# DJ.LUX 🎧🎿

An interactive pixel-art Anna, built as a surprise. She DJs as **DJ LUX**, skis in deep powder, speaks thick
Hallingdal-dialect (and goes shy Oslo-speak around Oslo people), keeps asking where Hadi is, worries every
Sunday about what she did on Saturday, and absolutely does not talk about Adam.

(Built on the engine of [MI-E](https://github.com/Haakonsater/MI_E-Mediocre-Intelligence-Emulator-).)

**Play online:** <https://adamerlandsson.github.io/djlux/>

## ▶️ Start

| | Without Claude (offline) | With Claude |
|---|---|---|
| You need | Just a browser | Python 3 + Claude Code (logged in) |
| Anna answers | With pre-written lines | Freely, with real AI (still in Hallingdal-dialect) |
| Start | Open `index.html` | `./start-djlux.sh` (Mac/Linux) or double-click `start-djlux.bat` (Windows) |

With Claude the game opens on <http://localhost:8642>. Keep the terminal window open while playing.
Optional: `LUX_MODEL=haiku|sonnet|opus` (default `haiku`), `LUX_PORT=8642`. Every message uses a little Claude quota.
Progress is saved in the browser (`index.html` and `localhost:8642` have separate saves).

Test shortcuts: `index.html?t=6-20` (Saturday 20:00 – weekday-hour, 0 = Sunday), `?dj` (start a gig), `?hadi`, `?jenny`,
`?idunn`, `?hennie` (window visitors), `?sandra`, `?marthe`, `?emma` (roommates), `?adamtext`, `?adamvisit`, `?guest=hadi|jenny|idunn|hennie|adam`
(a guest in the living room), `?kapittel=2` (jump to chapter 2 or 3). The ⏰ menu changes the time too.

## Her week (`content/schedule.js`)

| When | Where |
|---|---|
| Monday 18:30–20 | Sirkeltrening med TF (she's late). Click the bench: «Ikke tenk bare benk!» |
| Tuesday 11–15 | Sofa, «Skal vi danse» |
| Wednesday 12–16 | Skule (NTNU) |
| Thursday 21–01:30 | TF-pils + quiz at Tyven |
| Saturday 18–02 | Vors with the Molde folkehøgskule gang (Hennie, Idunn, Jenny – Oslo people make her shy) |
| Sunday | Hungover on the sofa, worried. «Gjorde e noko gale i går?» |
| Every night 02–09 | Asleep |
| Otherwise | Home in Kannikestredet |

## Meters

**HUMØR** · **FESTLYST** (builds up, fastest Thu–Sat; gigs/skiing/vors use it) · **DIALEKT** (Ål 🏔️ ↔ Oslo 🏙️ –
Oslo people push it down, Hallingdal talk pushes it up) · **ADAM-O-METER** (full = Adam-feber: he texts, she can't
think about anything else, and Emma shouts that they're NOT sleeping in her room) · **DJ-SKILLS** (from gigs).

## Buttons

| | |
|---|---|
| 📚 **Skule** | «Planen» – the story (below) |
| 🎧 **DJ** | DJ LUX at **JubileumsGalla 2026 TF** at Grafen. Notes fall down 4 lanes – hit **D F J K** (or tap the pads) on the line. Between tracks: match the next track's BPM with **◀ ▶** and press **MIX** (space) when the lamp flashes red (the «1»). Grades S–D, coins, DJ-skills, drops for the SKI-magasin. |
| 🇸🇪 **Spør om Adam** | A menu of questions about Adam. What she answers depends on the ADAM-O-METER: 🙊 shy (denial) → 🙂 open (little stories: Chamonix, kanelbullar, «härligt») → 😍 smitten (gushing, then pretending it's nothing). Adam also texts her now and then (you pick her reply), and when the meter is high he knocks on the window – Emma has opinions. Lines in `content/adam.js`. |
| 👗 **Skift klede** | Cycle through owned outfits |
| 🎮 **Spel** | All games: DJ, Laussnø-tur, Gibberish eller Hallingdal-ord?, Hva sa Hadi?, Fisk eller IKEA?, Redningsaksjon (Sundays), Jukseøkt, Matte-time |
| 📖 **Studer** | Fisk eller IKEA? – Swedish lessons, for Adam's sake |
| 🎿 **SKI-magasin** | The collection: Black Crows / Atomic / K2 skis, gear, TF-medalje, TF sin kjekkaste, Sponsored Skier |
| 🛒 **Butikk** | DJ controllers (bigger timing window), light shows (more hype), galla dresses, ski outfits, dirty fries, a round of beer, a bungee voucher. **Everything shows up in the game:** the controller on the DJ desk, the light show in the living room (evenings / vors) and at Grafen, snacks in the room for a while, the voucher on the window. Won skis hang on the ski wall, gear lies on the floor, medals and story prizes hang on the walls – click them to open the SKI-magasin. |

Click things in the room: the three doors (Sandra / Marthe / Emma), window, disco ball, Ål poster, skis, lamp, TV
(Skal vi danse!), phone, fridge, DJ desk.

**The window:** click it (any day, whenever the living room is shown – also at vors and in the middle of the night)
and **Hadi** («kem e han Edvin egt?» + a fun fact), **Jenny** («As you shouuuuld, SLAYYY» – on Sundays she checks that
Anna is OK), **Idunn** (from Hemsedal but speaks Oslo, gives everyone massages, «Tøm og røm!»), **Hennie** (Bygdøy,
VERY allergic to peanuts – Anna gets shy and starts talking Oslo) or **Adam** 🇸🇪 is outside. They also turn up by themselves now and then. Press «🚪 Kom inn!» and they come
into the living room. While a guest is in, **what you type goes to both of them** – the guest and Anna answer in turn –
and **💬 Prat** makes them start a conversation by themselves (👋 *Ha det* sends them home). With the Claude brain they
talk freely (`bridge/guests.md` describes them); offline they use `content/convo.js`.

**Lots of lines, few repeats:** the offline brain has thousands of pre-written lines, and the game never repeats a line
until most of the others in the same list have been used. Add your own anywhere in `content/` – the more, the better.

**Music:** quiet lo-fi background music plays all the time (it changes chords, key and melody as it goes) and fades out
when you DJ – the 🎵 button in the header turns it off. The DJ tracks (`content/dj.js`, synthesized in `js/music.js`)
change as they play: chord progressions, riff variations every 4 bars, fills, a different second drop, and an outro
that adds/removes layers while you mix. 19 tracks in 7 styles; the arrangement is picked at random every time.

## The story: Planen 📚 (`content/story.js`)

1. **Bli kasta ut av NTNU** – 📱 *Jukseøkt*: hold to copy from the AI while the professor writes on the board.
   Get enough AI text, THEN get caught. Boss: **Professor RipeiSåle** – pick the answer that most obviously
   reveals the AI.
2. **Skisesong i Japan** – 🎿 powder runs in Hokkaido; the van **Takeshi** breaks down (pick the right tool fast).
   Boss: **the van** itself.
3. **Lærar i Ål** – 🧮 *Matte-time* (answer the pupils) + Ål skisenter. Boss: **Swedish Adam** – who skis today,
   and who takes the kids?
4. Backpacking i Asia (bungee, naked) – coming soon.

## Change things – no coding needed

Everything Anna says is in `content/`:

| File | What |
|---|---|
| `phrases.js` | fallbacks, Hallingdal→Oslo swaps, Hadi facts, outfit comments |
| `reactions.js` | keyword → reply rules (+ expression and meter effects) |
| `schedule.js` | her week and what she says in each situation |
| `people.js` | Sandra, Marthe, Emma, Hadi, Jenny, Idunn, Hennie, the vors guests, the Adam meter |
| `adam.js` | Adam: the question menu (per meter level), his texts and reply options, window visits |
| `convo.js` | conversations with a guest in the living room (Hadi, Jenny, Idunn, Hennie, Adam) – topics and replies |
| `dj.js` | the DJ game: tracks, timing, points, lines |
| `story.js` | chapters, jukseøkt, skiing, maths lesson, the three bosses' questions |
| `minigames.js` | Hallingdal words, Hva sa Hadi?, Fisk eller IKEA?, hangover rescue, room objects |
| `shop.js` | shop items and the SKI-magasin collection |
| `outfits.js` | wardrobe + which outfit she wears when |
| `house.js` | backgrounds, clickable hotspots, where Anna stands |
| `bridge/persona.md` | who Anna is, for the Claude brain |
| `bridge/guests.md` | who Hadi, Jenny, Idunn, Hennie and Adam are, for the Claude brain (guest conversations) |

## 💾 Saving and the guide

- **The game saves by itself** in the browser while you play (after every action, and every 20 seconds). The bar under
  the header shows «💾 Lagra automatisk 14:37».
- That save lives only in **this browser on this computer** (and `index.html` and `localhost:8642` each have their own).
  Clearing the browser's data or a private window loses it.
- **⬇️ Lagre til fil** downloads the progress as a small file (`DJ.LUX-lagring-<date>.json`) – a backup, or a way to
  move it to another computer / browser. **⬆️ Hent fil** loads such a file again (it asks first, then replaces the
  current progress).
- **❓ Guide** opens the tutorial (`content/tutorial.js`) that points at every feature. It starts by itself the first
  time the game is opened; click through with Neste / Tilbake (← →), or close it any time with ✖ / Esc.
  `index.html?guide` forces it to start.

## 🎨 Pictures

Until real pictures exist, the game uses simple placeholder sprites (`python3 tools/placeholder_sprites.py`).
Put the real pictures in these folders, named exactly like this, and run:

    pip install pillow numpy scipy
    python3 tools/build_sprites.py

**Style for every picture:** pixel art, full body, front-facing, centred, **plain white background**, one figure,
no text, no shadow on the floor, same framing every time (portrait ~4:5, e.g. 921×1152). Use the same reference
photo of Anna for every picture so she looks the same.

`expression/dress/` – Anna in a **dark green galla dress** (the game recolours it to red/blue/black/pink/gold):
`base` (neutral smile) · `excited` · `sad` · `annoyed` · `sour` (grumpy, arms crossed) · `shocked` · `guilty`
(embarrassed, blushing, side-eye) · `dreamy` (thinking about Adam, little hearts) · `sleepy` · `study` (holding a
maths book) · `proud` (holding up a gold medal) · `dj` (headphones on, hands on a DJ controller) · `dance` (arms in
the air, partying) · `sofa` (**landscape**: lying on her back on a sofa, hungover – the sofa itself may be omitted).

`expression/ski/` – the same poses in a **bright blue ski jacket and blue ski pants** (recoloured to orange,
purple, green, black, pink). Nothing else on her should be blue. Plus `ski` (on skis, knees bent,
poles, goggles). `dj` and `dance` are optional here.

`expression/people/` – faces (head + shoulders, white background): `hadi`, `jenny`, `adam` (Swedish ski bum),
`ripeisaale` (a strict professor with glasses), `van` (an old, slightly sad Japanese camper van with a face).

The living room and the TF gym hall are drawn in code at 640×400 (`js/scene-hd.js`) – fairy lights, candles, snow, TV and
people are animated. The other places are simpler 320×200 scenes in `js/scene.js`.

Low-quality pose pictures (few colours, grainy) can be cleaned up with `python3 tools/enhance_sprites.py expression/dress`:
it removes speckle and snaps colours to `base.png`. Pictures that are already good quality are left alone, and the
originals are kept in `assets/source/originals/`.

Backgrounds (optional, landscape, no people): put e.g. `environments/living_room.jpg` and write it in
`content/house.js → backgrounds`, then nudge the hotspot numbers so they match the picture.
