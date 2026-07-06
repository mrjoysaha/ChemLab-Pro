// ============================================================================
// Chem — a small rule-based reaction predictor covering metals, acids, bases,
// oxides, carbonates and salts (the reaction set taught in intro chemistry).
// Exposes window.Chem = { ELEMENTS, EL, DB, lookup, predict, ... }
// ============================================================================
(function (global) {
"use strict";

// ===================== ELEMENT DATABASE (118 elements) =====================
const RAW_ELEMENTS = [
["H","Hydrogen","nonmetal",1],["He","Helium","noble",0],["Li","Lithium","alkali",1],
["Be","Beryllium","alkaline",2],["B","Boron","metalloid",3],["C","Carbon","nonmetal",4],
["N","Nitrogen","nonmetal",-3],["O","Oxygen","nonmetal",-2],["F","Fluorine","halogen",-1],
["Ne","Neon","noble",0],["Na","Sodium","alkali",1],["Mg","Magnesium","alkaline",2],
["Al","Aluminium","posttransition",3],["Si","Silicon","metalloid",4],["P","Phosphorus","nonmetal",-3],
["S","Sulfur","nonmetal",-2],["Cl","Chlorine","halogen",-1],["Ar","Argon","noble",0],
["K","Potassium","alkali",1],["Ca","Calcium","alkaline",2],["Sc","Scandium","transition",3],
["Ti","Titanium","transition",4],["V","Vanadium","transition",3],["Cr","Chromium","transition",3],
["Mn","Manganese","transition",2],["Fe","Iron","transition",2],["Co","Cobalt","transition",2],
["Ni","Nickel","transition",2],["Cu","Copper","transition",2],["Zn","Zinc","posttransition",2],
["Ga","Gallium","posttransition",3],["Ge","Germanium","metalloid",4],["As","Arsenic","metalloid",-3],
["Se","Selenium","nonmetal",-2],["Br","Bromine","halogen",-1],["Kr","Krypton","noble",0],
["Rb","Rubidium","alkali",1],["Sr","Strontium","alkaline",2],["Y","Yttrium","transition",3],
["Zr","Zirconium","transition",4],["Nb","Niobium","transition",5],["Mo","Molybdenum","transition",6],
["Tc","Technetium","transition",4],["Ru","Ruthenium","transition",3],["Rh","Rhodium","transition",3],
["Pd","Palladium","transition",2],["Ag","Silver","transition",1],["Cd","Cadmium","transition",2],
["In","Indium","posttransition",3],["Sn","Tin","posttransition",2],["Sb","Antimony","metalloid",3],
["Te","Tellurium","metalloid",-2],["I","Iodine","halogen",-1],["Xe","Xenon","noble",0],
["Cs","Cesium","alkali",1],["Ba","Barium","alkaline",2],["La","Lanthanum","lanthanide",3],
["Ce","Cerium","lanthanide",3],["Pr","Praseodymium","lanthanide",3],["Nd","Neodymium","lanthanide",3],
["Pm","Promethium","lanthanide",3],["Sm","Samarium","lanthanide",3],["Eu","Europium","lanthanide",3],
["Gd","Gadolinium","lanthanide",3],["Tb","Terbium","lanthanide",3],["Dy","Dysprosium","lanthanide",3],
["Ho","Holmium","lanthanide",3],["Er","Erbium","lanthanide",3],["Tm","Thulium","lanthanide",3],
["Yb","Ytterbium","lanthanide",3],["Lu","Lutetium","lanthanide",3],["Hf","Hafnium","transition",4],
["Ta","Tantalum","transition",5],["W","Tungsten","transition",6],["Re","Rhenium","transition",4],
["Os","Osmium","transition",4],["Ir","Iridium","transition",4],["Pt","Platinum","transition",2],
["Au","Gold","transition",3],["Hg","Mercury","posttransition",2],["Tl","Thallium","posttransition",3],
["Pb","Lead","posttransition",2],["Bi","Bismuth","posttransition",3],["Po","Polonium","metalloid",2],
["At","Astatine","halogen",-1],["Rn","Radon","noble",0],["Fr","Francium","alkali",1],
["Ra","Radium","alkaline",2],["Ac","Actinium","actinide",3],["Th","Thorium","actinide",4],
["Pa","Protactinium","actinide",4],["U","Uranium","actinide",4],["Np","Neptunium","actinide",4],
["Pu","Plutonium","actinide",4],["Am","Americium","actinide",3],["Cm","Curium","actinide",3],
["Bk","Berkelium","actinide",3],["Cf","Californium","actinide",3],["Es","Einsteinium","actinide",3],
["Fm","Fermium","actinide",3],["Md","Mendelevium","actinide",3],["No","Nobelium","actinide",2],
["Lr","Lawrencium","actinide",3],["Rf","Rutherfordium","transition",4],["Db","Dubnium","transition",5],
["Sg","Seaborgium","transition",6],["Bh","Bohrium","transition",4],["Hs","Hassium","transition",4],
["Mt","Meitnerium","transition",4],["Ds","Darmstadtium","transition",4],["Rg","Roentgenium","transition",1],
["Cn","Copernicium","transition",2],["Nh","Nihonium","posttransition",3],["Fl","Flerovium","posttransition",2],
["Mc","Moscovium","posttransition",3],["Lv","Livermorium","posttransition",2],["Ts","Tennessine","halogen",-1],
["Og","Oganesson","noble",0]
];

const ELEMENTS = RAW_ELEMENTS.map(([s,n,cat,charge]) => ({ s, n, cat, charge: Number(charge) }));
const EL = {}; ELEMENTS.forEach(e => EL[e.s] = e);

const METAL_CATS = new Set(["alkali","alkaline","transition","posttransition","lanthanide","actinide"]);
const isMetal = sym => METAL_CATS.has(EL[sym].cat);
const isNoble = sym => EL[sym].cat === "noble";
const isNonmetalLike = sym => !isMetal(sym) && !isNoble(sym);
const DIATOMIC = new Set(["H","N","O","F","Cl","Br","I"]);

const CATEGORY_LABEL = {
  alkali:"Alkali metal", alkaline:"Alkaline earth metal", transition:"Transition metal",
  posttransition:"Post-transition metal", lanthanide:"Lanthanide", actinide:"Actinide",
  metalloid:"Metalloid", nonmetal:"Nonmetal", halogen:"Halogen", noble:"Noble gas"
};

// ===================== REACTIVITY SERIES =====================
const EXPLICIT_REACTIVITY = ["K","Na","Li","Ba","Sr","Ca","Mg","Al","Mn","Zn","Cr","Fe","Cd","Co","Ni","Sn","Pb","H","Sb","Bi","Cu","Hg","Ag","Pd","Pt","Au"];
function reactivityRank(sym){
  const idx = EXPLICIT_REACTIVITY.indexOf(sym);
  if (idx >= 0) return idx * 10;
  const cat = EL[sym].cat;
  const base = { alkali:-5, alkaline:35, lanthanide:65, actinide:60, transition:115, posttransition:155 }[cat];
  return base !== undefined ? base : 900;
}
const H_RANK = reactivityRank("H");
const REACTS_WITH_COLD_WATER = new Set(["Li","Na","K","Rb","Cs","Fr","Ca","Sr","Ba","Ra"]);

// ===================== FRACTIONS (exact rational arithmetic for balancing) =====================
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a || 1; }
function lcm(a,b){ return Math.abs(a*b) / gcd(a,b); }
function frac(n,d){ if (d<0){ n=-n; d=-d; } const g = gcd(n,d) || 1; return { n:n/g, d:d/g }; }
const F0 = frac(0,1);
function fadd(a,b){ return frac(a.n*b.d + b.n*a.d, a.d*b.d); }
function fsub(a,b){ return frac(a.n*b.d - b.n*a.d, a.d*b.d); }
function fmul(a,b){ return frac(a.n*b.n, a.d*b.d); }
function fdiv(a,b){ return frac(a.n*b.d, a.d*b.n); }
function fneg(a){ return frac(-a.n, a.d); }
function fiszero(a){ return a.n === 0; }

// ===================== FORMULA HELPERS =====================
function sub(n){ return n > 1 ? `<sub>${n}</sub>` : ""; }

function crisscross(catSym, catCharge, anionPlain, anionDisplay, anionCharge, anionCounts, anionIsPoly){
  const c = Math.abs(catCharge), a = Math.abs(anionCharge);
  const g = gcd(c,a);
  const catSub = a/g, anSub = c/g;
  const plain = catSym + (catSub>1?catSub:"") + (anionIsPoly && anSub>1 ? `(${anionPlain})${anSub}` : anionPlain + (anSub>1?anSub:""));
  const display = catSym + sub(catSub) + (anionIsPoly && anSub>1 ? `(${anionDisplay})${sub(anSub)}` : anionDisplay + sub(anSub));
  const counts = {};
  counts[catSym] = (counts[catSym]||0) + catSub;
  Object.entries(anionCounts).forEach(([el,n]) => { counts[el] = (counts[el]||0) + n*anSub; });
  return { plain, display, counts };
}

// ===================== ANIONS =====================
const ANIONS = {
  chloride:    { plain:"Cl", display:"Cl", charge:-1, counts:{Cl:1}, poly:false, name:"chloride" },
  bromide:     { plain:"Br", display:"Br", charge:-1, counts:{Br:1}, poly:false, name:"bromide" },
  iodide:      { plain:"I",  display:"I",  charge:-1, counts:{I:1},  poly:false, name:"iodide" },
  fluoride:    { plain:"F",  display:"F",  charge:-1, counts:{F:1},  poly:false, name:"fluoride" },
  sulfate:     { plain:"SO4", display:"SO"+sub(4), charge:-2, counts:{S:1,O:4}, poly:true, name:"sulfate" },
  sulfite:     { plain:"SO3", display:"SO"+sub(3), charge:-2, counts:{S:1,O:3}, poly:true, name:"sulfite" },
  sulfide:     { plain:"S",  display:"S",  charge:-2, counts:{S:1}, poly:false, name:"sulfide" },
  nitrate:     { plain:"NO3", display:"NO"+sub(3), charge:-1, counts:{N:1,O:3}, poly:true, name:"nitrate" },
  phosphate:   { plain:"PO4", display:"PO"+sub(4), charge:-3, counts:{P:1,O:4}, poly:true, name:"phosphate" },
  carbonate:   { plain:"CO3", display:"CO"+sub(3), charge:-2, counts:{C:1,O:3}, poly:true, name:"carbonate" },
  bicarbonate: { plain:"HCO3", display:"HCO"+sub(3), charge:-1, counts:{H:1,C:1,O:3}, poly:true, name:"hydrogencarbonate" },
  hydroxide:   { plain:"OH", display:"OH", charge:-1, counts:{O:1,H:1}, poly:true, name:"hydroxide" },
  acetate:     { plain:"CH3COO", display:"CH"+sub(3)+"COO", charge:-1, counts:{C:2,H:3,O:2}, poly:true, name:"acetate" },
  oxide:       { plain:"O",  display:"O",  charge:-2, counts:{O:1}, poly:false, name:"oxide" }
};

// ===================== ACIDS =====================
const ACIDS = {
  HCl:     { plain:"HCl", display:"HCl", basicity:1, anion:ANIONS.chloride, name:"Hydrochloric acid" },
  H2SO4:   { plain:"H2SO4", display:"H"+sub(2)+"SO"+sub(4), basicity:2, anion:ANIONS.sulfate, name:"Sulfuric acid" },
  HNO3:    { plain:"HNO3", display:"HNO"+sub(3), basicity:1, anion:ANIONS.nitrate, name:"Nitric acid" },
  H3PO4:   { plain:"H3PO4", display:"H"+sub(3)+"PO"+sub(4), basicity:3, anion:ANIONS.phosphate, name:"Phosphoric acid" },
  CH3COOH: { plain:"CH3COOH", display:"CH"+sub(3)+"COOH", basicity:1, anion:ANIONS.acetate, name:"Acetic acid" },
  HBr:     { plain:"HBr", display:"HBr", basicity:1, anion:ANIONS.bromide, name:"Hydrobromic acid" },
  HI:      { plain:"HI", display:"HI", basicity:1, anion:ANIONS.iodide, name:"Hydroiodic acid" },
  HF:      { plain:"HF", display:"HF", basicity:1, anion:ANIONS.fluoride, name:"Hydrofluoric acid" },
  H2S:     { plain:"H2S", display:"H"+sub(2)+"S", basicity:2, anion:ANIONS.sulfide, name:"Hydrosulfuric acid" },
  H2CO3:   { plain:"H2CO3", display:"H"+sub(2)+"CO"+sub(3), basicity:2, anion:ANIONS.carbonate, name:"Carbonic acid" }
};
function acidCounts(a){ const counts = Object.assign({}, a.anion.counts); counts.H = (counts.H||0) + a.basicity; return counts; }

const NONMETAL_OXIDES = {
  CO2:  { plain:"CO2", display:"CO"+sub(2), counts:{C:1,O:2}, anion:ANIONS.carbonate, name:"Carbon dioxide" },
  SO2:  { plain:"SO2", display:"SO"+sub(2), counts:{S:1,O:2}, anion:ANIONS.sulfite, name:"Sulfur dioxide" },
  SO3:  { plain:"SO3", display:"SO"+sub(3), counts:{S:1,O:3}, anion:ANIONS.sulfate, name:"Sulfur trioxide" },
  P2O5: { plain:"P2O5", display:"P"+sub(2)+"O"+sub(5), counts:{P:2,O:5}, anion:ANIONS.phosphate, name:"Phosphorus pentoxide" },
  N2O5: { plain:"N2O5", display:"N"+sub(2)+"O"+sub(5), counts:{N:2,O:5}, anion:ANIONS.nitrate, name:"Dinitrogen pentoxide" }
};

// ===================== BALANCER (rational nullspace) =====================
function balance(speciesCounts, nReact){
  const elements = [...new Set(speciesCounts.flatMap(s => Object.keys(s)))];
  const nSpecies = speciesCounts.length;
  let M = elements.map(el => speciesCounts.map((s,i) => {
    const val = s[el] || 0;
    return frac(i < nReact ? val : -val, 1);
  }));
  let pivotCols = [], r = 0;
  for (let col=0; col<nSpecies && r<M.length; col++){
    let piv = -1;
    for (let row=r; row<M.length; row++){ if(!fiszero(M[row][col])){ piv=row; break; } }
    if (piv===-1) continue;
    [M[r], M[piv]] = [M[piv], M[r]];
    const pv = M[r][col];
    M[r] = M[r].map(v => fdiv(v,pv));
    for (let row=0; row<M.length; row++){
      if (row===r) continue;
      const factor = M[row][col];
      if (fiszero(factor)) continue;
      M[row] = M[row].map((v,ci) => fsub(v, fmul(factor, M[r][ci])));
    }
    pivotCols.push(col); r++;
  }
  const freeCols = [];
  for (let c=0;c<nSpecies;c++) if(!pivotCols.includes(c)) freeCols.push(c);
  if (freeCols.length===0) return null;
  const x = new Array(nSpecies).fill(F0);
  x[freeCols[0]] = frac(1,1);
  for (let i=0;i<pivotCols.length;i++){
    const col = pivotCols[i];
    let val = F0;
    for (const f of freeCols){ val = fadd(val, fmul(M[i][f], x[f])); }
    x[col] = fneg(val);
  }
  let denom = 1;
  x.forEach(fr => { denom = lcm(denom, fr.d); });
  let ints = x.map(fr => Math.round(fr.n * (denom/fr.d)));
  let g = ints.reduce((a,b)=>gcd(a,b), 0) || 1;
  ints = ints.map(v => v/g);
  if (ints.some(v=>v<0)) ints = ints.map(v=>-v);
  if (ints.some(v=>v<=0)) return null;
  return ints;
}

// ===================== COMPOUND DATABASE =====================
const DB = {};
function reg(entry){ DB[entry.plain.toLowerCase()] = entry; return entry; }

ELEMENTS.forEach(el => {
  if (DIATOMIC.has(el.s)) reg({ plain: el.s+"2", display: el.s+sub(2), counts:{[el.s]:2}, type:"element", sym:el.s, name: el.n+" (gas)" });
  else reg({ plain: el.s, display: el.s, counts:{[el.s]:1}, type:"element", sym:el.s, name: el.n });
});

Object.entries(ACIDS).forEach(([key,a]) => {
  reg({ plain:a.plain, display:a.display, counts:acidCounts(a), type:"acid", acidKey:key, name:a.name });
});

Object.entries(NONMETAL_OXIDES).forEach(([key,o]) => {
  reg({ plain:o.plain, display:o.display, counts:o.counts, type:"oxide", oxideClass:"nonmetal", oxideKey:key, name:o.name });
});

reg({ plain:"H2O", display:"H"+sub(2)+"O", counts:{H:2,O:1}, type:"water", name:"Water" });
reg({ plain:"NH4OH", display:"NH"+sub(4)+"OH", counts:{N:1,H:5,O:1}, type:"base", cationSym:"NH4", cationCharge:1, name:"Ammonium hydroxide" });

ELEMENTS.filter(el => isMetal(el.s)).forEach(el => {
  const c = el.charge;
  const mk = (anion, type, extra) => {
    const r = crisscross(el.s, c, anion.plain, anion.display, anion.charge, anion.counts, anion.poly);
    reg(Object.assign({ plain:r.plain, display:r.display, counts:r.counts, type, metalSym:el.s, name:`${el.n} ${anion.name}` }, extra||{}));
  };
  mk(ANIONS.hydroxide, "base", { cationSym: el.s, cationCharge: c });
  mk(ANIONS.oxide, "oxide", { oxideClass:"metal" });
  mk(ANIONS.carbonate, "carbonate");
  mk(ANIONS.bicarbonate, "bicarbonate");
  mk(ANIONS.chloride, "salt", { anionKey:"chloride" });
  mk(ANIONS.sulfate, "salt", { anionKey:"sulfate" });
  mk(ANIONS.nitrate, "salt", { anionKey:"nitrate" });
  mk(ANIONS.sulfide, "salt", { anionKey:"sulfide" });
});

function normalize(str){ return String(str||"").replace(/\s+/g,"").toLowerCase(); }
function lookup(str){ return DB[normalize(str)] || null; }

// ===================== REACTION RULES =====================
function tryRules(x,y){
  if (x.type==="element" && isMetal(x.sym) && y.type==="acid"){
    const acid = ACIDS[y.acidKey];
    if (reactivityRank(x.sym) < H_RANK){
      const salt = crisscross(x.sym, EL[x.sym].charge, acid.anion.plain, acid.anion.display, acid.anion.charge, acid.anion.counts, acid.anion.poly);
      return { products:[ salt, lookup("H2") ], label:"Single displacement",
        note:`${EL[x.sym].n} is more reactive than hydrogen, so it displaces H₂ out of the acid.` };
    }
    return { noReaction:true, note:`${EL[x.sym].n} (${x.sym}) is less reactive than hydrogen, so it can't displace H₂ from ${y.display}. No visible reaction.` };
  }
  if (x.type==="element" && isMetal(x.sym) && y.type==="water"){
    if (REACTS_WITH_COLD_WATER.has(x.sym)){
      const base = crisscross(x.sym, EL[x.sym].charge, ANIONS.hydroxide.plain, ANIONS.hydroxide.display, ANIONS.hydroxide.charge, ANIONS.hydroxide.counts, true);
      return { products:[ base, lookup("H2") ], label:"Reaction with water",
        note:`${EL[x.sym].n} is reactive enough to pull hydrogen straight out of cold water.` };
    }
    return { noReaction:true, note:`${EL[x.sym].n} does not react with cold water under normal conditions.` };
  }
  if (x.type==="oxide" && x.oxideClass==="metal" && y.type==="acid"){
    const acid = ACIDS[y.acidKey];
    const salt = crisscross(x.metalSym, EL[x.metalSym].charge, acid.anion.plain, acid.anion.display, acid.anion.charge, acid.anion.counts, acid.anion.poly);
    return { products:[ salt, lookup("H2O") ], label:"Neutralization (basic oxide + acid)",
      note:`A metal oxide behaves as a base here, neutralizing the acid into a salt and water.` };
  }
  if (x.type==="oxide" && x.oxideClass==="nonmetal" && y.type==="base"){
    const anion = NONMETAL_OXIDES[x.oxideKey].anion;
    const salt = crisscross(y.cationSym, y.cationCharge, anion.plain, anion.display, anion.charge, anion.counts, anion.poly);
    return { products:[ salt, lookup("H2O") ], label:"Acidic oxide + base",
      note:`${x.display} behaves as an acidic oxide and is neutralized by the base.` };
  }
  if (x.type==="acid" && y.type==="base"){
    const acid = ACIDS[x.acidKey];
    const salt = crisscross(y.cationSym, y.cationCharge, acid.anion.plain, acid.anion.display, acid.anion.charge, acid.anion.counts, acid.anion.poly);
    return { products:[ salt, lookup("H2O") ], label:"Neutralization",
      note:`Classic acid + base neutralization: H⁺ from the acid pairs with OH⁻ from the base.` };
  }
  if (x.type==="acid" && (y.type==="carbonate" || y.type==="bicarbonate")){
    const acid = ACIDS[x.acidKey];
    const salt = crisscross(y.metalSym, EL[y.metalSym].charge, acid.anion.plain, acid.anion.display, acid.anion.charge, acid.anion.counts, acid.anion.poly);
    return { products:[ salt, lookup("H2O"), lookup("CO2") ], label:"Acid + carbonate",
      note:`Acids react with carbonates and bicarbonates to release carbon dioxide gas.` };
  }
  if (x.type==="element" && isMetal(x.sym) && y.type==="salt"){
    if (x.sym === y.metalSym) return { noReaction:true, note:"Same metal on both sides — nothing to displace." };
    if (reactivityRank(x.sym) < reactivityRank(y.metalSym)){
      const anion = ANIONS[y.anionKey];
      const newSalt = crisscross(x.sym, EL[x.sym].charge, anion.plain, anion.display, anion.charge, anion.counts, anion.poly);
      const displaced = lookup(y.metalSym) || { plain:y.metalSym, display:y.metalSym, counts:{[y.metalSym]:1} };
      return { products:[ newSalt, displaced ], label:"Single displacement (metal + salt)",
        note:`${EL[x.sym].n} is more reactive than ${EL[y.metalSym].n} and displaces it out of solution.` };
    }
    return { noReaction:true, note:`${EL[x.sym].n} is less reactive than ${EL[y.metalSym].n} — no displacement occurs.` };
  }
  if (x.type==="element" && isMetal(x.sym) && y.type==="element" && isNonmetalLike(y.sym)){
    const nmCharge = EL[y.sym].charge;
    if (nmCharge >= 0) return null;
    const compound = crisscross(x.sym, EL[x.sym].charge, y.sym, y.sym, nmCharge, {[y.sym]:1}, false);
    return { products:[ compound ], label:"Combination reaction",
      note:`Direct combination of a metal and a non-metal forms an ionic compound.` };
  }
  return null;
}

function finalize(a,b,res){
  if (res.noReaction) return { noReaction:true, reactantA:a, reactantB:b, note:res.note };
  const speciesCounts = [a.counts, b.counts, ...res.products.map(p=>p.counts)];
  const coeffs = balance(speciesCounts, 2);
  if (!coeffs) return { error:"Found a plausible product but couldn't balance the equation — try different inputs." };
  return { reactantA:a, reactantB:b, products:res.products, coeffs, label:res.label, note:res.note };
}

function predict(inputA, inputB){
  const a = lookup(inputA), b = lookup(inputB);
  if (!a) return { error: `"${inputA}" isn't a formula this tool recognizes yet.` };
  if (!b) return { error: `"${inputB}" isn't a formula this tool recognizes yet.` };
  const res = tryRules(a,b) || tryRules(b,a);
  if (res) return finalize(a,b,res);
  return { error: `No standard reaction rule matches ${a.display} + ${b.display}. This tool covers metal, acid, base, oxide, carbonate and salt reactions — these two inputs don't fall into a pattern it knows.` };
}

global.Chem = {
  ELEMENTS, EL, CATEGORY_LABEL, DIATOMIC, isMetal, isNoble, isNonmetalLike,
  DB, lookup, normalize, predict, ANIONS, ACIDS, NONMETAL_OXIDES
};

})(window);
