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
- `contact.html` — contact form (Web3Forms-powered)
- 11 topic placeholder pages — `electronic-configuration.html`, `subshell-orbital-concept.html`, `atomic-number.html`, `isotope.html`, `isotone.html`, `isobar.html`, `isomer.html`, `doberiner-triad-law.html`, `newland-octave-rule.html`, `mendeleev-periodic-table.html`, `modern-periodic-table.html`

Every page shares the same header (logo + hamburger) and drawer navigation, so it reads as one cohesive site rather than separate tools.

## Navigation

Top-right hamburger opens a drawer with:
- **Home**
- **Atomic Structure** (accordion) → Electronic Configuration, Subshell & Orbital Concept, Atomic Number, Isotope, Isotone, Isobar, Isomer
- **Periodic Table** (accordion) → Döbereiner's Triad Law, Newland's Octave Rule, Mendeleev's Periodic Table, Modern Periodic Table
- **Contact**

The 11 topic pages are currently placeholders (styled consistently, ready for content) — the reaction predictor and interactive periodic table on the homepage are the two fully-built features.

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

## Publish it on GitHub (free, ~5 minutes)

1. **Create the repo.** Go to [github.com/new](https://github.com/new), name it something like `reagent`, keep it Public, and click **Create repository**.

2. **Upload the files.** On the new repo's page, click **uploading an existing file**, then drag in *every* file from this folder (all the `.html`, `.css`, and `.js` files, plus this README). Commit them directly to the `main` branch.

   *(Prefer the command line?)*
   ```bash
   git init
   git add .
   git commit -m "Reagent: reaction predictor, periodic table, and chemistry notes"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. **Turn on GitHub Pages.** In the repo, go to **Settings → Pages**. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Click **Save**.

4. **Visit your site.** After a minute or two, it's live at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO/
   ```

That's it — no server, no database, free hosting, and it updates automatically every time you push a change to `main`.

## Before you go live

- **Contact form:** `contact.html` still has a placeholder Web3Forms key (`XXXX-XXXX-XXXX`). Get a free key at [web3forms.com](https://web3forms.com) and paste it into the `formData.append('access_key', ...)` line near the bottom of the file.
- **Topic pages:** the 11 Atomic Structure / Periodic Table pages are placeholders. Each one is a normal HTML file with an `.info-card` section — replace the placeholder paragraph with real content whenever you're ready.

## Extending it

- Add more acids/bases/anions in `chem.js` — salts, hydroxides, oxides and carbonates for every metal are generated automatically from the element table.
- Add more reaction rules or named special cases in `chem.js`.
- Add more menu items by editing the drawer markup (same block appears near the top of every page) and adding a new page.
- Change the palette/fonts in `styles.css` (see the `:root` variables at the top) — every page will update, since they all share this one stylesheet.


