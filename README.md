# Reagent — a reaction predictor

A small, dependency-free website: type in two elements or compounds (e.g. `Zn` and `H2SO4`) and it predicts the product and shows the **balanced** equation (`Zn + H2SO4 → ZnSO4 + H2`).

No build step, no backend — just `index.html`, `styles.css`, `chem.js`, and `app.js`. Open `index.html` in a browser and it works.

## What it covers

- All 118 elements, with reactivity-series-aware predictions
- Metal + acid → salt + hydrogen
- Reactive metal + water → metal hydroxide + hydrogen
- Metal oxide + acid, or acidic oxide + base → salt + water
- Acid + base → salt + water (neutralization)
- Acid + carbonate/bicarbonate → salt + water + CO2
- Metal + salt → single displacement (reactivity-series based)
- Metal + non-metal → direct combination

Equations are balanced with a real linear-algebra solver (not hardcoded), so it handles cases like `2Al + 6HCl → 2AlCl3 + 3H2` correctly.

It's a teaching tool, not a full chemistry simulator — it doesn't cover organic chemistry, redox half-equations, or every oxidation state of every element.

## Publish it on GitHub (free, ~5 minutes)

1. **Create the repo.** Go to [github.com/new](https://github.com/new), name it something like `reagent` or `reaction-predictor`, keep it Public, and click **Create repository**.

2. **Upload the files.** On the new repo's page, click **uploading an existing file**, then drag in all four files from this folder:
   - `index.html`
   - `styles.css`
   - `chem.js`
   - `app.js`
   - `README.md`

   Commit them directly to the `main` branch.

   *(Prefer the command line?)*
   ```bash
   git init
   git add .
   git commit -m "Reagent: reaction predictor"
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

- Add more acids/bases in `chem.js` under `ACIDS` — everything else (salts, neutralization, etc.) is generated automatically from the element table.
- Add more reaction rules in the `tryRules()` function in `chem.js`.
- Change the palette/fonts in `styles.css` (see the `:root` variables at the top).
