# Reagent — a reaction predictor + periodic table

A small, dependency-free website: type in two elements or compounds (e.g. `Zn` and `H2SO4`) and it predicts the product and shows the **balanced** equation (`Zn + H2SO4 → ZnSO4 + H2`). Also includes a full, clickable, colour-coded periodic table.

No build step, no backend — just `index.html`, `styles.css`, `chem.js`, `periodic-data.js`, and `app.js`. Open `index.html` in a browser and it works. Fully responsive/mobile-friendly.

## What it covers

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
- Any hydrocarbon/alcohol + O2 → combustion (CO2 + H2O), balanced generically for any CxHyOz fuel formula
- A few named special cases: H2 + O2 → H2O, ammonia's weak-base equilibrium with water, the Haber process, and other classic textbook combinations
- Variable-valency metals (Fe, Cu, Sn, Pb, Cr, Mn, Co, Ni, Hg, Au, Ti) are supported with both of their common oxidation states (e.g. both FeCl2/FeCl3 and FeO/Fe2O3)

Equations are balanced with a real linear-algebra solver (not hardcoded), so it handles cases like `2Al + 6HCl → 2AlCl3 + 3H2` or `2C8H18 + 25O2 → 16CO2 + 18H2O` correctly.

Input is forgiving: leading coefficients (`2HCl`), physical-state tags (`H2O(l)`, `O2(g)`), and descriptive tags (`NaOH(base)`) are all stripped automatically, and bare diatomic elements (`Cl` → `Cl2`) resolve on their own.

It's a teaching tool, not a full chemistry simulator — it doesn't cover organic reaction mechanisms, redox half-equations, or a complete Ksp-based solubility treatment.

## Periodic table

Below the element browser is a full 7×18 periodic table (with the lanthanide/actinide rows placed correctly below the main body), color-coded by category. Tap any element to open a detail popup with:

- Category (metal/metalloid/nonmetal/etc.), atomic mass, standard state
- Electron configuration, oxidation states
- Electronegativity (Pauling), atomic radius (van der Waals)
- Ionization energy, electron affinity
- Melting point, boiling point, density
- Year discovered

For short-lived synthetic elements (roughly atomic number 104+), many physical properties have never been measured experimentally — those fields show "—" rather than a fabricated number, with electron configurations and oxidation states marked "(predicted)" where they're theoretical rather than observed.

## Publish it on GitHub (free, ~5 minutes)

1. **Create the repo.** Go to [github.com/new](https://github.com/new), name it something like `reagent` or `reaction-predictor`, keep it Public, and click **Create repository**.

2. **Upload the files.** On the new repo's page, click **uploading an existing file**, then drag in all five files from this folder:
   - `index.html`
   - `styles.css`
   - `chem.js`
   - `periodic-data.js`
   - `app.js`
   - `README.md`

   Commit them directly to the `main` branch.

   *(Prefer the command line?)*
   ```bash
   git init
   git add .
   git commit -m "Reagent: reaction predictor + periodic table"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. **Turn on GitHub Pages.** In the repo, go to **Settings → Pages**. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Click **Save**.

4. **Visit your site.** After a minute or two, it's live at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO/
   ```
   GitHub shows the exact URL at the top of the Pages settings page once it's built.

That's it — no server, no database, free hosting, and it updates automatically every time you push a change to `main`.

## Extending it

- Add more acids/bases/anions in `chem.js` — salts, hydroxides, oxides and carbonates for every metal are generated automatically from the element table.
- Add more named special-case reactions via `addSpecial(...)` in `chem.js`.
- Add more fuels/organics to the `FUELS` table for combustion coverage.
- Tweak solubility rules in `isSoluble()` if you want a different (or more complete) solubility table.
- Update `periodic-data.js` if you want more precision on any element's physical properties.
- Change the palette/fonts in `styles.css` (see the `:root` variables at the top).

