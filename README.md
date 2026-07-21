# Reagent — reaction predictor, periodic table & chemistry notes

A small, dependency-free, multi-page website. The homepage is a reaction predictor: type in two elements or compounds (e.g. `Zn` and `H2SO4`) and it predicts the product and shows the **balanced** equation. It also has a full clickable periodic table, a right-side navigation drawer, and a set of chemistry topic pages.

No build step, no backend — just static HTML/CSS/JS files. Open `index.html` in a browser and it works. Fully responsive/mobile-friendly.

## Site structure

- `index.html` — homepage: the reaction predictor + periodic table
- `styles.css` — shared styles for the entire site (header, drawer, cards, forms, everything)
- `chem.js` — the element database, reaction rules, and equation balancer
- `periodic-data.js` — detailed per-element data (mass, electron config, ionization energy, etc.)
- `app.js` — homepage UI wiring (predictor, quick picks, element browser, periodic table, modal)
- `nav.js` — the header hamburger + slide-in drawer + accordion menu, shared by every page
- `game.js` — the Tic-Tac-Toe mini-game (opened from the drawer's "Game" button), shared by every page
- `contact.html` — contact form (Web3Forms-powered)
- 11 topic placeholder pages — `electronic-configuration.html`, `subshell-orbital-concept.html`, `atomic-number.html`, `isotope.html`, `isotone.html`, `isobar.html`, `isomer.html`, `doberiner-triad-law.html`, `newland-octave-rule.html`, `mendeleev-periodic-table.html`, `modern-periodic-table.html`

Every page shares the same header (logo + hamburger) and drawer navigation, so it reads as one cohesive site rather than separate tools.

## Navigation

Top-right hamburger opens a drawer with:
- **Home**
- **Atomic Structure** (accordion) → Electronic Configuration, Subshell & Orbital Concept, Atomic Number, Isotope, Isotone, Isobar, Isomer
- **Periodic Table** (accordion) → Döbereiner's Triad Law, Newland's Octave Rule, Mendeleev's Periodic Table, Modern Periodic Table
- **Contact**
- **Game** — opens a popup with Tic-Tac-Toe (not a page navigation)

The 11 topic pages are currently placeholders (styled consistently, ready for content) — the reaction predictor, interactive periodic table, and Tic-Tac-Toe game are the fully-built features.

## Tic-Tac-Toe

Clicking "Game" in the drawer (available from any page) opens a popup with:
- **Single Player** — you play X against an AI playing O. The AI uses minimax search, so it's mathematically unbeatable — best case for a human is a draw.
- **Two Player** — hot-seat mode, X and O alternate on the same device.
- X and O are drawn in two distinct colors (teal and red, matching the site's indicator palette) with an animated hand-drawn stroke effect, and the winning line draws itself across the board in gold.
- A running scoreboard (X wins / O wins / draws) persists for the browser session.

The game shares one `game.js` file across every page — same pattern as the drawer, so it doesn't need to be re-implemented per page.

## What the reaction predictor covers

- All 118 elements, with reactivity-series-aware predictions
- Metal + acid → salt + hydrogen
- Reactive metal + water → metal hydroxide + hydrogen
- Metal oxide + acid, acidic oxide + base, or metal oxide + acidic oxide → salt (+ water)
- Acidic/basic oxide + water → acid or hydroxide
- Acid + base → salt + water (neutralization)
- Acid + carbonate/bicarbonate → salt + water + CO2
- Metal + salt → single displacement (reactivity-series based)
- Salt/carbonate/base + salt/carbonate/base → double displacement / precipitation (simplified solubility rules — e.g. `AgNO3 + NaCl → AgCl↓ + NaNO3`, `FeCl3 + NaOH → Fe(OH)3↓ + NaCl`)
- Metal + non-metal → direct combination
- Any hydrocarbon/alcohol + O2 → combustion, balanced generically for any CxHyOz fuel formula
- A few named special cases: H2 + O2 → H2O, ammonia's weak-base equilibrium with water, the Haber process
- Variable-valency metals (Fe, Cu, Sn, Pb, Cr, Mn, Co, Ni, Hg, Au, Ti) are supported with both of their common oxidation states (e.g. both FeCl2/FeCl3 and FeO/Fe2O3)

Equations are balanced with a real linear-algebra solver (not hardcoded), so it handles cases like `2Al + 6HCl → 2AlCl3 + 3H2` or `2C8H18 + 25O2 → 16CO2 + 18H2O` correctly.

It's a teaching tool, not a full chemistry simulator — it doesn't cover organic reaction mechanisms, redox half-equations, or a complete Ksp-based solubility treatment.

## Periodic table

Below the element browser is a full 7×18 periodic table (lanthanide/actinide rows placed correctly below the main body), color-coded by category. Tap any element for a popup with category, atomic mass, standard state, electron configuration, oxidation states, electronegativity (Pauling), atomic radius (van der Waals), ionization energy, electron affinity, melting/boiling point, density, and year discovered.

For short-lived synthetic elements (roughly atomic number 104+), many physical properties have never been measured — those fields show "—" rather than a fabricated number.


## Extending it

- Add more acids/bases/anions in `chem.js` — salts, hydroxides, oxides and carbonates for every metal are generated automatically from the element table.
- Add more reaction rules or named special cases in `chem.js`.
- Add more menu items by editing the drawer markup (same block appears near the top of every page) and adding a new page.
- Change the palette/fonts in `styles.css` (see the `:root` variables at the top) — every page will update, since they all share this one stylesheet.


