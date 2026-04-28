# SaveForge 🎮

A multi-engine save file editor that runs entirely in your browser. No uploads, no server, your save files never leave your machine.

## Supported Engines

| Engine | Format | Status |
|--------|--------|--------|
| RPG Maker MV/MZ | `.rpgsave` `.rmmzsave` | ✅ Full support |
| Ren'Py | `.save` `.rpysav` | 🟡 Partial (metadata + game state) |
| GameMaker | `.ini` `.sav` | ✅ Full support |
| Unity | `.dat` `.es3` | 🟡 Best effort |
| Generic JSON | `.json` | ✅ Full support |
| Generic INI | `.ini` `.cfg` | ✅ Full support |

## Features

-  Auto-detects engine from file extension
-  Edit fields directly in the browser
-  Export patched save file instantly
-  RPG Maker semantic view (party, actors, inventory, variables, switches)
-  Optional data file enrichment for named variables and items
-  Search fields by name or value

## RPG Maker Data Enrichment

For RPG Maker saves, you can load your game's `data/` folder to get named variables and switches instead of raw IDs. Drop `System.json` for variable/switch names, `Items.json` for item names, `Actors.json` for actor names etc.

## Tech Stack

- React + Vite
- fflate (zlib compression)
- pickleparser (Ren'Py pickle parsing)
- 100% client-side — no backend

## Getting Started

```bash
git clone https://github.com/yourusername/saveforge
cd saveforge
npm install
npm run dev
```

## Roadmap

- [ ] Full Ren'Py pickle support
- [ ] Unity binary save support
- [ ] Game-specific profiles (Stardew Valley, Omori, etc.)
- [ ] Dark/light theme toggle
- [ ] Mobile support

## License

MIT
