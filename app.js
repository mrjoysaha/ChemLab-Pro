(function () {
"use strict";
const Chem = window.Chem;

const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const predictBtn = document.getElementById("predictBtn");
const compoundList = document.getElementById("compoundList");
const resultSection = document.getElementById("resultSection");
const resultStrip = document.getElementById("resultStrip");
const indicatorRail = document.getElementById("indicatorRail");
const resultEquation = document.getElementById("resultEquation");
const resultLabel = document.getElementById("resultLabel");
const resultNote = document.getElementById("resultNote");
const elementGrid = document.getElementById("elementGrid");
const pickerGroups = document.getElementById("pickerGroups");

// ---------- populate the datalist (dedupe on plain formula) ----------
const seen = new Set();
Object.values(Chem.DB).forEach(entry => {
  if (seen.has(entry.plain)) return;
  seen.add(entry.plain);
  const opt = document.createElement("option");
  opt.value = entry.plain;
  compoundList.appendChild(opt);
});

// ---------- element browser ----------
Chem.ELEMENTS.forEach(el => {
  const btn = document.createElement("button");
  btn.className = "el-btn";
  btn.type = "button";
  btn.textContent = el.s;
  btn.dataset.cat = el.cat;
  btn.title = `${el.n} — ${Chem.CATEGORY_LABEL[el.cat]}`;
  btn.addEventListener("click", () => fillActiveInput(el.s));
  elementGrid.appendChild(btn);
});

// ---------- quick picks ----------
const QUICK_PICKS = [
  { label: "Metals", items: ["Na","K","Ca","Mg","Al","Zn","Fe","Cu","Ag"] },
  { label: "Acids", items: ["HCl","H2SO4","HNO3","CH3COOH","H3PO4","H2CO3"] },
  { label: "Bases", items: ["NaOH","KOH","Ca(OH)2","Mg(OH)2","NH4OH"] },
  { label: "Oxides", items: ["CO2","SO2","CaO","MgO","Na2O","Al2O3"] },
  { label: "Carbonates", items: ["CaCO3","Na2CO3","NaHCO3"] },
  { label: "Salts", items: ["CuSO4","FeCl2","AgNO3","ZnSO4"] }
];
QUICK_PICKS.forEach(group => {
  const row = document.createElement("div");
  row.className = "picker-group";
  const label = document.createElement("span");
  label.className = "picker-group-label";
  label.textContent = group.label;
  row.appendChild(label);
  group.items.forEach(formula => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = formula;
    chip.addEventListener("click", () => fillActiveInput(formula));
    row.appendChild(chip);
  });
  pickerGroups.appendChild(row);
});

// ---------- track which input to fill next ----------
let activeInput = inputA;
inputA.addEventListener("focus", () => activeInput = inputA);
inputB.addEventListener("focus", () => activeInput = inputB);

function fillActiveInput(formula){
  activeInput.value = formula;
  activeInput = (activeInput === inputA) ? inputB : inputA;
  activeInput.focus();
}

// ---------- hint buttons ----------
document.querySelectorAll(".hint-fill").forEach(btn => {
  btn.addEventListener("click", () => {
    inputA.value = btn.dataset.a;
    inputB.value = btn.dataset.b;
    runPredict();
  });
});

// ---------- predict ----------
predictBtn.addEventListener("click", runPredict);
[inputA, inputB].forEach(inp => inp.addEventListener("keydown", e => {
  if (e.key === "Enter") runPredict();
}));

const STRIP_COLOR = {
  "Single displacement": "var(--red)",
  "Reaction with water": "var(--violet)",
  "Neutralization (basic oxide + acid)": "var(--gold)",
  "Acidic oxide + base": "var(--gold)",
  "Neutralization": "var(--gold)",
  "Acid + carbonate": "var(--red)",
  "Single displacement (metal + salt)": "var(--teal)",
  "Combination reaction": "var(--teal)"
};

function runPredict(){
  const a = inputA.value.trim();
  const b = inputB.value.trim();
  if (!a || !b) return;
  const r = Chem.predict(a, b);
  resultSection.hidden = false;

  if (r.error){
    render({ color:"var(--grey)", label:"Not recognized", note:r.error, equationHTML: `${escapeHTML(a)} + ${escapeHTML(b)} → ?` });
    return;
  }
  if (r.noReaction){
    render({ color:"var(--grey)", label:"No reaction", note:r.note, equationHTML: `${r.reactantA.display} + ${r.reactantB.display} → <em>no visible reaction</em>` });
    return;
  }
  const c = r.coeffs;
  const lhs = coefTerm(c[0], r.reactantA.display) + " + " + coefTerm(c[1], r.reactantB.display);
  const rhs = r.products.map((p,i) => coefTerm(c[2+i], p.display)).join(" + ");
  const equationHTML = `${lhs} <span class="arrow-sep">→</span> ${rhs}`;
  render({ color: STRIP_COLOR[r.label] || "var(--teal)", label:r.label, note:r.note, equationHTML });
}

function coefTerm(n, display){
  return (n>1 ? `<span class="coef">${n}</span>` : "") + display;
}
function escapeHTML(s){
  return s.replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

function render({color, label, note, equationHTML}){
  resultStrip.style.background = color;
  indicatorRail.style.background = color;
  resultEquation.innerHTML = equationHTML;
  resultLabel.textContent = label;
  resultNote.textContent = note;
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
})();
