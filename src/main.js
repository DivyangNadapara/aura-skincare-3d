import './style.css';
import { realProductsData, scientificMoleculesData, ingredientConflictMatrix } from './productsData.js';
import { soundEngine } from './audio.js';
import { Scene3D } from './scene3d.js';
import Lenis from 'lenis';

// =============================================================
// 1. LENIS SMOOTH SCROLL INITIALIZATION
// =============================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Smooth scroll on anchor link clicks
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -80 });
      }
    }
  });
});

// =============================================================
// 2. STATE MANAGEMENT
// =============================================================
const state = {
  activeProduct: realProductsData[0],
  activeMolecule: scientificMoleculesData[0],
  currentCategory: 'all',
  currentProfile: 'acne',
  viewMode: 'product' // 'product' | 'molecule'
};

// =============================================================
// 3. 3D SCENE INITIALIZATION
// =============================================================
const container = document.getElementById('webgl-container');
let scene3d = null;

if (container) {
  scene3d = new Scene3D(container, soundEngine);
  scene3d.loadProduct(state.activeProduct);

  scene3d.callbacks.onHotspotClick = (hotspotData) => {
    const tooltip = document.getElementById('hotspot-tooltip');
    const title = document.getElementById('tooltip-title');
    const desc = document.getElementById('tooltip-desc');
    if (tooltip && title && desc) {
      title.textContent = hotspotData.title;
      desc.textContent = hotspotData.text;
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.pointerEvents = 'auto';
      tooltip.style.transform = 'translateY(0)';
    }
  };
}

const tooltipClose = document.getElementById('tooltip-close');
if (tooltipClose) {
  tooltipClose.addEventListener('click', () => {
    const tooltip = document.getElementById('hotspot-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.transform = 'translateY(8px)';
    }
  });
}

// =============================================================
// 4. 3D CONTROLS
// =============================================================
const ctrlRotate = document.getElementById('ctrl-rotate');
const ctrlShield = document.getElementById('ctrl-shield');
const ctrlScanner = document.getElementById('ctrl-scanner');
const ctrlDispense = document.getElementById('ctrl-dispense');
const ctrlExplode = document.getElementById('ctrl-explode');
const ctrlToggleView = document.getElementById('ctrl-toggle-view');
const viewChemMolBtn = document.getElementById('view-chem-molecule-btn');

if (ctrlRotate && scene3d) {
  ctrlRotate.addEventListener('click', () => {
    scene3d.isAutoRotating = !scene3d.isAutoRotating;
    ctrlRotate.classList.toggle('active', scene3d.isAutoRotating);
    soundEngine.playGlassChime(680, 0.1);
  });
}

if (ctrlShield && scene3d) {
  ctrlShield.addEventListener('click', () => {
    const isShield = scene3d.toggleUvShield();
    ctrlShield.classList.toggle('active', isShield);
  });
}

if (ctrlScanner && scene3d) {
  ctrlScanner.addEventListener('click', () => {
    const isScan = scene3d.toggleLaserScanner();
    ctrlScanner.classList.toggle('active', isScan);
  });
}

if (ctrlDispense && scene3d) {
  ctrlDispense.addEventListener('click', () => {
    scene3d.dispenseDose();
  });
}

if (ctrlExplode && scene3d) {
  ctrlExplode.addEventListener('click', () => {
    const isExploded = scene3d.toggleExplodedView();
    ctrlExplode.classList.toggle('active', isExploded);
  });
}

function toggleViewMode() {
  if (!scene3d) return;
  if (state.viewMode === 'product') {
    state.viewMode = 'molecule';
    scene3d.loadMolecule(state.activeMolecule);
    if (ctrlToggleView) ctrlToggleView.querySelector('span').textContent = 'View Bottle';
  } else {
    state.viewMode = 'product';
    scene3d.showProductView();
    if (ctrlToggleView) ctrlToggleView.querySelector('span').textContent = 'View Molecule';
  }
}

if (ctrlToggleView) {
  ctrlToggleView.addEventListener('click', toggleViewMode);
}
if (viewChemMolBtn) {
  viewChemMolBtn.addEventListener('click', () => {
    state.viewMode = 'molecule';
    if (scene3d) scene3d.loadMolecule(state.activeMolecule);
    if (ctrlToggleView) ctrlToggleView.querySelector('span').textContent = 'View Bottle';
  });
}

// Sound Toggle Header Button
const soundToggle = document.getElementById('sound-toggle');
const soundLabel = document.getElementById('sound-label');

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    const isAudioOn = soundEngine.toggleSound();
    if (isAudioOn) {
      soundToggle.classList.remove('muted');
      if (soundLabel) soundLabel.textContent = 'Audio On';
    } else {
      soundToggle.classList.add('muted');
      if (soundLabel) soundLabel.textContent = 'Audio Off';
    }
  });
}

// =============================================================
// 5. HERO METADATA UPDATE
// =============================================================
function updateHeroMeta(prod) {
  state.activeProduct = prod;
  state.viewMode = 'product';

  const tag = document.getElementById('hero-prod-tag');
  const vol = document.getElementById('hero-prod-vol');
  const name = document.getElementById('hero-prod-name');
  const sub = document.getElementById('hero-prod-sub');
  const ph = document.getElementById('spec-ph');
  const mw = document.getElementById('spec-mw');
  const layer = document.getElementById('spec-layer');
  const base = document.getElementById('spec-base');
  const mech = document.getElementById('hero-prod-mechanism');

  if (tag) tag.textContent = prod.tag;
  if (vol) vol.textContent = `${prod.brand} · ${prod.volume}`;
  if (name) name.textContent = prod.name;
  if (sub) sub.textContent = prod.subtitle;
  if (ph) ph.textContent = prod.ph;
  if (mw) mw.textContent = prod.molecularWeight;
  if (layer) layer.textContent = prod.biochemistry.targetLayer;
  if (base) base.textContent = prod.vehicleBase.substring(0, 36) + '...';
  if (mech) mech.textContent = prod.biochemistry.mechanism;

  if (ctrlToggleView) ctrlToggleView.querySelector('span').textContent = 'View Molecule';

  if (scene3d) {
    scene3d.loadProduct(prod);
  }
}

// =============================================================
// 6. REAL PRODUCT SHOWROOM & CATEGORY FILTERING
// =============================================================
const productGrid = document.getElementById('product-grid');
const catPills = document.querySelectorAll('.cat-pill');

function renderProductGrid() {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  const filtered = state.currentCategory === 'all'
    ? realProductsData
    : realProductsData.filter(p => p.category === state.currentCategory);

  filtered.forEach(p => {
    const isSelected = state.activeProduct.id === p.id;
    const card = document.createElement('div');
    card.className = `product-card ${isSelected ? 'selected' : ''}`;
    
    // Actives pills
    const activesBadges = (p.activesBreakdown || [])
      .slice(0, 2)
      .map(a => `<span class="tag-pill" style="font-size:0.62rem; padding:0.15rem 0.55rem; background:rgba(255,255,255,0.04); color:var(--pearl-muted);">${a.name}</span>`)
      .join('');

    card.innerHTML = `
      <div>
        <div class="meta-card-header">
          <span class="tag-pill" style="color:var(--blue-light); border-color:rgba(59,130,246,0.3); background:rgba(59,130,246,0.1);">${p.brand}</span>
          <span class="volume-tag">pH ${p.ph}</span>
        </div>
        <h3 class="meta-prod-name" style="font-size:1.15rem; margin-top:0.35rem;">${p.name}</h3>
        <p class="meta-prod-sub" style="margin-bottom:0.65rem;">${p.subtitle}</p>
        <p class="hero-desc" style="font-size:0.75rem; margin-bottom:1rem; line-height:1.5;">${p.scientificDescription}</p>
        
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem;">
          ${activesBadges}
        </div>
      </div>

      <div class="meta-card-footer" style="padding-top:0.85rem; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--emerald-light);">${p.volume}</span>
        <button class="inspect-btn btn-primary" data-id="${p.id}" style="padding:0.45rem 1rem; font-size:0.6875rem;">
          Load in 3D Lab
        </button>
      </div>
    `;

    const inspectBtn = card.querySelector('.inspect-btn');
    inspectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateHeroMeta(p);
      renderProductGrid();
      soundEngine.playGlassChime(920, 0.15);
      const hero = document.getElementById('hero-stage');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    });

    card.addEventListener('click', () => {
      updateHeroMeta(p);
      renderProductGrid();
    });

    productGrid.appendChild(card);
  });
}

catPills.forEach(pill => {
  pill.addEventListener('click', () => {
    catPills.forEach(p => p.classList.remove('active', 'bg-blue'));
    pill.classList.add('active');
    state.currentCategory = pill.dataset.cat;
    soundEngine.playGlassChime(760, 0.1);
    renderProductGrid();
  });
});

renderProductGrid();

// =============================================================
// 7. 3D MOLECULAR CHEMICAL EXPLORER
// =============================================================
const molPills = document.querySelectorAll('.mol-pill');
const molCard = document.getElementById('active-molecule-card');

function renderMoleculeDetails(mol) {
  state.activeMolecule = mol;
  if (!molCard) return;

  molCard.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1.5rem;">
      <div style="display:flex; flex-direction:column; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:1rem;">
        <div>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--emerald-light);">${mol.chemicalFormula} · ${mol.molarMass}</span>
          <h3 style="font-size:1.6rem; font-weight:800; color:#fff; margin-top:0.25rem;">${mol.name}</h3>
        </div>
        <div style="display:flex; gap:1rem; margin-top:0.75rem; flex-wrap:wrap;">
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--blue-light);">Solubility: ${mol.solubility}</span>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--gold);">pKa: ${mol.pKa}</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem;">
        <div style="padding:1rem; border-radius:0.75rem; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:0.6875rem; font-family:var(--font-mono); color:var(--pearl-subtle); text-transform:uppercase;">Biological Function</span>
          <p style="font-size:0.875rem; color:#fff; font-weight:600; margin-top:0.35rem;">${mol.role}</p>
        </div>
        <div style="padding:1rem; border-radius:0.75rem; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:0.6875rem; font-family:var(--font-mono); color:var(--pearl-subtle); text-transform:uppercase;">Clinical Proof</span>
          <p style="font-size:0.875rem; color:var(--emerald-light); font-weight:600; margin-top:0.35rem;">${mol.clinicalEfficacy}</p>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.5rem;">
        <span style="font-size:0.75rem; color:var(--pearl-subtle);">Currently viewing 3D ball-and-stick valence model in hero viewport.</span>
        <button id="mol-inspect-3d-btn" class="btn-primary" style="padding:0.45rem 1rem; font-size:0.75rem;">
          Render in 3D Canvas
        </button>
      </div>
    </div>
  `;

  const btn = document.getElementById('mol-inspect-3d-btn');
  if (btn) {
    btn.onclick = () => {
      state.viewMode = 'molecule';
      if (scene3d) scene3d.loadMolecule(mol);
      const hero = document.getElementById('hero-stage');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    };
  }
}

molPills.forEach(pill => {
  pill.addEventListener('click', () => {
    molPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const molId = pill.dataset.mol;
    const mol = scientificMoleculesData.find(m => m.id === molId);
    if (mol) {
      renderMoleculeDetails(mol);
      if (scene3d && state.viewMode === 'molecule') {
        scene3d.loadMolecule(mol);
      }
      soundEngine.playGlassChime(880, 0.12);
    }
  });
});

renderMoleculeDetails(scientificMoleculesData[0]);

// =============================================================
// 8. CUTANEOUS SKIN PENETRATION SIMULATOR
// =============================================================
const simBtns = document.querySelectorAll('.sim-btn');
const fluxSc = document.getElementById('flux-sc');
const fluxSg = document.getElementById('flux-sg');
const fluxSb = document.getElementById('flux-sb');
const simName = document.getElementById('sim-active-name');
const simDesc = document.getElementById('sim-active-desc');

const penetrationData = {
  salicylic: {
    name: "Salicylic Acid (BHA · 138.12 Da)",
    sc: "100% Penetration",
    sg: "88% Active Flux",
    sb: "Lipophilic Pore Clearance",
    passSc: true, passSg: true, passSb: true,
    desc: "Being lipophilic (oil-soluble), salicylic acid dissolves through hydrophobic sebum in the infundibulum pore canal, cleaving intracellular desmosomes to unblock blackheads and reduce micro-comedones."
  },
  niacinamide: {
    name: "Niacinamide (Vitamin B3 · 122.12 Da)",
    sc: "100% Penetration",
    sg: "96% Cellular Influx",
    sb: "Basale Keratinocyte Diffusion",
    passSc: true, passSg: true, passSb: true,
    desc: "With a tiny molecular weight of only 122 Da, Niacinamide rapidly crosses the stratum corneum and diffuses into living basal cells to upregulate NAD+ levels and stimulate endogenous ceramide synthesis."
  },
  'ha-high': {
    name: "High Molecular Weight Hyaluronic Acid (1,500 kDa)",
    sc: "Surface Film Forming",
    sg: "0% (Blocked by 500-Da Rule)",
    sb: "0% Penetration",
    passSc: true, passSg: false, passSb: false,
    desc: "Exceeding the 500-Dalton rule by 3,000x, high molecular weight HA cannot penetrate the stratum corneum. Instead, it forms a breathable, non-occlusive hydration film on the surface, holding 1,000x its weight in water to prevent trans-epidermal moisture loss (TEWL)."
  },
  ceramide: {
    name: "Ceramide NP (Ceramide 3 · 580 Da)",
    sc: "Lamellar Bilayer Integration",
    sg: "Membrane Sealant",
    sb: "Barrier Lock",
    passSc: true, passSg: true, passSb: false,
    desc: "At ~580 Da, Ceramides integrate directly into the intercellular lipid matrix (the 'mortar' of the skin), repairing microscopic fractures in the skin barrier rather than penetrating into living deeper tissues."
  }
};

simBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    simBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const activeKey = btn.dataset.active;
    const data = penetrationData[activeKey];
    if (!data) return;

    if (simName) simName.textContent = data.name;
    if (simDesc) simDesc.textContent = data.desc;

    if (fluxSc) {
      fluxSc.textContent = data.sc;
      fluxSc.className = `flux-status ${data.passSc ? 'status-pass' : 'status-block'}`;
    }
    if (fluxSg) {
      fluxSg.textContent = data.sg;
      fluxSg.className = `flux-status ${data.passSg ? 'status-pass' : 'status-block'}`;
    }
    if (fluxSb) {
      fluxSb.textContent = data.sb;
      fluxSb.className = `flux-status ${data.passSb ? 'status-pass' : 'status-block'}`;
    }

    soundEngine.playGlassChime(1050, 0.1);
  });
});

// =============================================================
// 9. INGREDIENT CONFLICT & SYNERGY COLLIDER
// =============================================================
const ingSelectA = document.getElementById('collider-ing-a');
const ingSelectB = document.getElementById('collider-ing-b');
const runCollisionBtn = document.getElementById('run-collision-btn');
const colBadge = document.getElementById('col-status-badge');
const colSeverity = document.getElementById('col-severity');
const colTitle = document.getElementById('col-title');
const colScience = document.getElementById('col-science');
const colAdvice = document.getElementById('col-advice');

function runCollisionTest() {
  if (!ingSelectA || !ingSelectB) return;
  const valA = ingSelectA.value;
  const valB = ingSelectB.value;

  const match = ingredientConflictMatrix.find(item => 
    (item.pair[0] === valA && item.pair[1] === valB) ||
    (item.pair[0] === valB && item.pair[1] === valA)
  );

  soundEngine.playGlassChime(1300, 0.15);

  if (match) {
    if (colTitle) colTitle.textContent = `${match.pair[0]} + ${match.pair[1]}`;
    if (colSeverity) colSeverity.textContent = `Severity / Efficacy: ${match.severity}`;
    if (colScience) colScience.textContent = match.science;
    if (colAdvice) colAdvice.textContent = match.recommendation;

    if (colBadge) {
      colBadge.textContent = match.label;
      if (match.status === 'caution') {
        colBadge.className = 'col-badge badge-caution';
      } else if (match.status === 'synergy') {
        colBadge.className = 'col-badge badge-synergy';
      } else {
        colBadge.className = 'col-badge badge-myth';
      }
    }
  } else {
    // General safe pairing
    if (colTitle) colTitle.textContent = `${valA} + ${valB}`;
    if (colSeverity) colSeverity.textContent = 'Compatibility: Compatible';
    if (colScience) colScience.textContent = 'No acute biochemical cross-reactivity or formulation destabilization documented in peer-reviewed clinical studies. These ingredients can generally be layered safely.';
    if (colAdvice) colAdvice.textContent = 'Apply the thinner, water-based product first, followed by the heavier emulsion or cream. Monitor for individual tolerance.';
    if (colBadge) {
      colBadge.textContent = 'Safe Layering Synergy';
      colBadge.className = 'col-badge badge-synergy';
    }
  }
}

if (runCollisionBtn) {
  runCollisionBtn.addEventListener('click', runCollisionTest);
}

// =============================================================
// 10. INTERACTIVE pH & FREE ACID REACTOR
// =============================================================
const phSlider = document.getElementById('ph-slider');
const phDisplayVal = document.getElementById('ph-display-val');
const freeAcidPerc = document.getElementById('free-acid-perc');
const reactorTitle = document.getElementById('reactor-analysis-title');
const reactorText = document.getElementById('reactor-analysis-text');

if (phSlider) {
  phSlider.addEventListener('input', (e) => {
    const ph = parseFloat(e.target.value);
    if (phDisplayVal) phDisplayVal.textContent = ph.toFixed(1);

    // Henderson-Hasselbalch calculation for Glycolic Acid (pKa = 3.6)
    const pKa = 3.6;
    const fraction = 1 / (1 + Math.pow(10, ph - pKa));
    const percentage = (fraction * 100).toFixed(1);

    if (freeAcidPerc) freeAcidPerc.textContent = `${percentage}%`;

    if (reactorTitle && reactorText) {
      if (ph < 3.0) {
        reactorTitle.textContent = `Extreme Acidity Hazard (pH ${ph.toFixed(1)} · ${percentage}% Free Acid)`;
        reactorText.textContent = `At pH ${ph.toFixed(1)}, the acid is almost entirely un-ionized (${percentage}% free acid). This penetrates so rapidly that it causes caustic protein coagulation and severe dermal blistering unless neutralized immediately by trained dermatologists.`;
      } else if (ph <= 3.8) {
        reactorTitle.textContent = `Clinical Peeling Equilibrium (pH ${ph.toFixed(1)} · ${percentage}% Free Acid)`;
        reactorText.textContent = `Balanced at pH ${ph.toFixed(1)} (exemplified by The Ordinary AHA 30% Peel at pH 3.6). Provides approximately ${percentage}% active free acid for potent keratolytic cell shedding while remaining safely buffered against uncontrolled chemical burns.`;
      } else if (ph <= 5.0) {
        reactorTitle.textContent = `Gentle Daily Resurfacing (pH ${ph.toFixed(1)} · ${percentage}% Free Acid)`;
        reactorText.textContent = `At pH ${ph.toFixed(1)}, free acid is diminished to ${percentage}%. Ideal for slow daily micro-exfoliation without stinging or redness, suitable for sensitive or rosacea-prone skin.`;
      } else {
        reactorTitle.textContent = `Acid Inactivation Threshold (pH ${ph.toFixed(1)} · ${percentage}% Free Acid)`;
        reactorText.textContent = `At pH ${ph.toFixed(1)}, free acid drops to only ${percentage}%. Nearly 99% of the acid molecules are ionized salts incapable of penetrating the lipid barrier, rendering any exfoliating claims chemically inert.`;
      }
    }
  });
}

// =============================================================
// 11. DERMATOLOGICAL ROUTINE ARCHITECT
// =============================================================
const profileBtns = document.querySelectorAll('.profile-btn');
const routineCard = document.getElementById('routine-schedule-card');

const routineDatabase = {
  acne: {
    title: "Oily, Acne-Prone & Sebum-Congested Protocol",
    am: [
      { step: "01", prod: "Gentle Salicylic Acid Foaming Wash", detail: "Dissolves surface sebum without stripping skin lipid mantle." },
      { step: "02", prod: "Minimalist Niacinamide 10% + Zinc 1%", detail: "Regulates 5-alpha reductase and curbs daytime oil shine." },
      { step: "03", prod: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel", detail: "Essential SPF 50 PA++++ protection with zero pore-clogging residue." }
    ],
    pm: [
      { step: "01", prod: "Double Cleanse (Micellar Water / Cleanser)", detail: "Removes organic sunscreen filters and airborne pollution." },
      { step: "02", prod: "Paula's Choice 2% BHA Liquid Exfoliant", detail: "Lipophilic Salicylic Acid penetrates into pore canal (Use 3x weekly)." },
      { step: "03", prod: "Lightweight Ceramide Emulsion", detail: "Restores barrier lipids and calms active micro-inflammation." }
    ]
  },
  pigmentation: {
    title: "Hyperpigmentation, Melasma & PIH Protocol",
    am: [
      { step: "01", prod: "Antioxidant Vitamin C Serum (10-15%)", detail: "Scavenges UV-induced reactive oxygen species (ROS)." },
      { step: "02", prod: "The Derma Co 2% Kojic Acid Face Cream", detail: "Chelates copper ions in tyrosinase to stop melanin synthesis." },
      { step: "03", prod: "The Derma Co 1% Hyaluronic Sunscreen (Mandatory)", detail: "Prevents UV reactivation of melanocytes." }
    ],
    pm: [
      { step: "01", prod: "Gentle Non-Stripping Cleanser", detail: "Prepares stratum corneum for active absorption." },
      { step: "02", prod: "Minimalist Niacinamide 10% + Alpha Arbutin", detail: "Inhibits melanosome transfer to surrounding skin cells." },
      { step: "03", prod: "CeraVe Moisturizing Cream", detail: "MVE technology locks in depigmentation actives overnight." }
    ]
  },
  barrier: {
    title: "Compromised Barrier, Redness & Eczema-Prone Protocol",
    am: [
      { step: "01", prod: "Water Rinse / Ultra-Gentle Hydrating Cleanser", detail: "Preserves natural moisturizing factors (NMF)." },
      { step: "02", prod: "Hyaluronic Acid + Centella Asiatica Serum", detail: "Provides osmotic moisture cushion to damaged keratinocytes." },
      { step: "03", prod: "Mineral Physical SPF 50 (Zinc Oxide Base)", detail: "Non-irritating physical photon reflection shield." }
    ],
    pm: [
      { step: "01", prod: "Gentle Cream Cleanser", detail: "Cleanses without emulsifying natural ceramides." },
      { step: "02", prod: "CeraVe Moisturizing Cream with 3 Ceramides", detail: "Bio-identical Ceramides 1, 3, 6-II repair lipid bilayer fractures." },
      { step: "03", prod: "Pure Petrolatum / Squalane Slugging (Optional)", detail: "Creates temporary occlusion over severe cracked spots." }
    ]
  }
};

function renderRoutine(profileKey) {
  const data = routineDatabase[profileKey];
  if (!data || !routineCard) return;

  const amSteps = data.am.map(s => `
    <div style="padding:0.75rem 1rem; border-radius:0.65rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); display:flex; gap:0.75rem;">
      <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--blue-light); font-weight:700;">AM ${s.step}</span>
      <div>
        <h5 style="font-size:0.8125rem; font-weight:700; color:#fff;">${s.prod}</h5>
        <p style="font-size:0.75rem; color:var(--pearl-muted); margin-top:2px;">${s.detail}</p>
      </div>
    </div>
  `).join('');

  const pmSteps = data.pm.map(s => `
    <div style="padding:0.75rem 1rem; border-radius:0.65rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); display:flex; gap:0.75rem;">
      <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--emerald-light); font-weight:700;">PM ${s.step}</span>
      <div>
        <h5 style="font-size:0.8125rem; font-weight:700; color:#fff;">${s.prod}</h5>
        <p style="font-size:0.75rem; color:var(--pearl-muted); margin-top:2px;">${s.detail}</p>
      </div>
    </div>
  `).join('');

  routineCard.innerHTML = `
    <div>
      <h4 style="font-size:1.15rem; font-weight:700; color:#fff; margin-bottom:1.25rem;">${data.title}</h4>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
        <div>
          <span style="font-size:0.6875rem; font-family:var(--font-mono); color:var(--blue-light); text-transform:uppercase; display:block; margin-bottom:0.65rem;">☀️ Morning (AM) Layering Sequence</span>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${amSteps}
          </div>
        </div>
        <div>
          <span style="font-size:0.6875rem; font-family:var(--font-mono); color:var(--emerald-light); text-transform:uppercase; display:block; margin-bottom:0.65rem;">🌙 Evening (PM) Treatment Sequence</span>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${pmSteps}
          </div>
        </div>
      </div>
    </div>
  `;
}

profileBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    profileBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const profile = btn.dataset.profile;
    renderRoutine(profile);
    soundEngine.playGlassChime(950, 0.1);
  });
});

renderRoutine('acne');

// =============================================================
// 12. CUSTOM MAGNETIC CURSOR
// =============================================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  document.querySelectorAll('button, a, input, select, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });
}

console.log('✨ DERM-X Molecular Skincare Engine Initialized Successfully.');
