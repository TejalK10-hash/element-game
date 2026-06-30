# Element Navigator 🚀⚛

A browser-based educational maze game where you guide element-astronauts to their correct space stations — learning how each element powers cutting-edge technology along the way.

Built for the [Hack Club Stardance Challenge](https://stardance.hackclub.com) in partnership with NASA.

## 🎮 How to Play

1. Pick a domain (Space, Underwater, Underground, Earth)
2. An astronaut named after a chemical element appears
3. Navigate the maze using **arrow keys**, **WASD**, or **click/tap**
4. Find the correct space station that matches your element's technology
5. Read the science fact after each level
6. Complete all 10 elements to finish the domain!

## 🚀 Run Locally

Just open `index.html` in your browser — no server or npm required.

For best experience, use the **Live Server** extension in VS Code:
- Right-click `index.html` → "Open with Live Server"

## 🗂 Project Structure

```
element-navigator/
├── index.html      ← Game screens & layout
├── style.css       ← Visual design (space dark theme)
├── data.js         ← All element data, facts, domain config
├── game.js         ← Canvas engine: maze gen, movement, rendering
└── assets/
    ├── astronauts/ ← (optional) custom astronaut sprites per element
    └── stations/   ← (optional) custom station images per domain
```

## ➕ Adding New Domains

In `data.js`, add a new key to the `DOMAINS` object following the same structure as `space`. Then in `index.html`, change the domain card from `locked` to `unlocked` and wire up the `onclick`.

## 🧪 Elements Covered

### Space Domain (v1)
| Symbol | Element | Technology |
|--------|---------|-----------|
| Xe | Xenon | Ion thrusters (NASA Dawn, ESA BepiColombo) |
| Ti | Titanium | Rocket airframes & spacecraft hulls |
| Si | Silicon | Satellite solar panels & ISS power |
| O  | Oxygen | Liquid oxygen rocket oxidizer & life support |
| H  | Hydrogen | Liquid hydrogen fuel (SLS, Falcon 9) |
| Al | Aluminium | Spacecraft structural components |
| Pu | Plutonium | RTG power (Voyager, Perseverance) |
| He | Helium | Tank pressurization & magnet cooling |
| Au | Gold | Thermal radiation shielding & visor coating |
| Nd | Neodymium | Reaction wheels for satellite attitude control |

### Coming Soon
- 🌊 Underwater (8 elements)
- ⛏️ Underground (8 elements)
- 🌱 Earth & Environment (6 elements)

## 🛠 Built With

- Vanilla HTML, CSS, JavaScript — no frameworks
- Canvas 2D API for game rendering
- Recursive backtracker algorithm for maze generation

## 📄 License

Open source — MIT
