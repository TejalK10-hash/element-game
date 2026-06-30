# 🧬 Element Navigator: Connect the Tech

A browser-based educational game where you drag real space-tech elements onto the part of a spacecraft that actually uses them — and learn the engineering reason behind each one.

![Status](https://img.shields.io/badge/status-in--progress-yellow) ![Made with](https://img.shields.io/badge/made%20with-HTML%2FCSS%2FJS-blue)

---

## What is this?

Every element on the spacecraft is a real material used in actual space technology. Xenon isn't just a noble gas — it's literally the fuel NASA's Dawn probe used in its ion thrusters. Titanium isn't just "strong metal" — it's why rocket hulls survive the stress of launch.

**Element Navigator** turns that into a game: drag (or tap) an element badge onto the matching spacecraft hotspot. Get it right, and you unlock a real fact about why that element matters. Get all four, and you walk away knowing more material science than when you started — without it feeling like a lesson.

## How to play

1. Open the game in your browser.
2. Pick an element badge at the bottom of the screen (Silicon, Neodymium, Xenon, or Titanium).
3. Either:
   - **Drag** a line from the badge to the matching glowing hotspot on the spacecraft, or
   - **Tap** the badge to select it, then **tap** the hotspot you think it belongs to.
4. Correct match → +20 points and a fact card about that element.
5. Wrong match → −5 points, and a hint about what that hotspot is actually for.
6. Match all four elements to win and see the full glossary.

## Elements in this version

| Element | Symbol | Spacecraft Part | Real-World Use |
|---|---|---|---|
| Xenon | Xe | Thrusters | Ion thruster propellant — used in missions like NASA's Dawn spacecraft |
| Titanium | Ti | Hull | Rocket airframes & spacecraft hulls — high strength-to-weight ratio |
| Silicon | Si | Solar Panels | The semiconductor at the core of photovoltaic cells, like the ISS's solar arrays |
| Neodymium | Nd | Attitude Control Magnets | Powers reaction wheels & magnetorquers for spacecraft orientation |

## Running it locally

No build step, no dependencies — just open it.

**Option 1 — Just open the file**
```
Double-click index.html
```

**Option 2 — Run a local server (recommended for development)**
```bash
npx serve
```
or use the **Live Server** extension in VS Code (right-click `index.html` → "Open with Live Server").

## Project structure

```
element-game/
├── index.html   # Page structure + inline SVG scene (spacecraft, hotspots, badges)
├── style.css    # Visual styling, gradients, animations
├── game.js      # Game logic — drag/tap matching, scoring, modals
├── data.js      # Element data — names, facts, correct hotspot mappings
└── README.md    # You're here
```

## Tech

Vanilla HTML, CSS, and JavaScript. No frameworks, no build tools. The entire spacecraft scene is a single inline SVG, which keeps the artwork, hotspots, and badge positions in one shared coordinate space — no fighting CSS layout to line things up.

## Roadmap

- [ ] Swap in an illustrated/raster rocket image as an alternative to the procedural SVG
- [ ] Add more elements and spacecraft parts
- [ ] New domains beyond spacecraft — submarines, underground drills, and other extreme-engineering settings, each with their own element set
- [ ] Shuffle mode — hotspot positions randomize so memorization isn't a shortcut

## Credits

Built solo as a personal project. Spacecraft illustration and game logic created from scratch in inline SVG/CSS/JS.
