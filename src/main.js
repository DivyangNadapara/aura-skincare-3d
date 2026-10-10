import './style.css';
import { productsData, routineQuizData } from './productsData.js';
import { soundEngine } from './audio.js';
import { Scene3D } from './scene3d.js';
import confetti from 'canvas-confetti';
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

// =============================================================
// 2. STATE MANAGEMENT
// =============================================================
const state = {
  activeProduct: productsData[0],
  currentCategory: 'all',
  cart: [],
  quiz: {
    type: routineQuizData.skinTypes[0].id,
    goal: routineQuizData.goals[0].id,
    climate: routineQuizData.climates[0].id
  }
};

// =============================================================
// 3. 3D SCENE INITIALIZATION
// =============================================================
const container = document.getElementById('webgl-container');
let scene3d = null;

if (container) {
  scene3d = new Scene3D(container, soundEngine);
  scene3d.loadProduct(state.activeProduct);

  // Hotspot Click Hook
  scene3d.callbacks.onHotspotClick = (hotspotData) => {
    const tooltip = document.getElementById('hotspot-tooltip');
    const title = document.getElementById('tooltip-title');
    const desc = document.getElementById('tooltip-desc');
    if (tooltip && title && desc) {
      title.textContent = hotspotData.title;
      desc.textContent = hotspotData.text;
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
      tooltip.style.transform = 'translateY(0)';
    }
  };

  // Dose Dispense Hook
  scene3d.callbacks.onDispenseComplete = () => {
    // Subtle tactile response
  };
}

// Tooltip close button
const tooltipClose = document.getElementById('tooltip-close');
if (tooltipClose) {
  tooltipClose.addEventListener('click', () => {
    const tooltip = document.getElementById('hotspot-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.transform = 'translateY(8px)';
    }
  });
}

// =============================================================
// 4. HERO SECTION 3D CONTROLS
// =============================================================
const ctrlRotate = document.getElementById('ctrl-rotate');
const ctrlXray = document.getElementById('ctrl-xray');
const ctrlDispense = document.getElementById('ctrl-dispense');
const ctrlExplode = document.getElementById('ctrl-explode');
const moodBtns = document.querySelectorAll('.mood-btn');

if (ctrlRotate && scene3d) {
  ctrlRotate.addEventListener('click', () => {
    scene3d.isAutoRotating = !scene3d.isAutoRotating;
    ctrlRotate.classList.toggle('active', scene3d.isAutoRotating);
    soundEngine.playGlassChime(680, 0.1);
  });
}

if (ctrlXray && scene3d) {
  ctrlXray.addEventListener('click', () => {
    const isXRay = scene3d.toggleXRayMode();
    ctrlXray.classList.toggle('active', isXRay);
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

moodBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    moodBtns.forEach((b) => b.classList.remove('active', 'bg-gold/20', 'text-gold', 'border-gold/40'));
    btn.classList.add('active', 'bg-gold/20', 'text-gold', 'border-gold/40');
    const mood = btn.dataset.mood;
    if (scene3d) scene3d.setLightingMood(mood);
  });
});

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
  const tag = document.getElementById('hero-prod-tag');
  const vol = document.getElementById('hero-prod-vol');
  const name = document.getElementById('hero-prod-name');
  const sub = document.getElementById('hero-prod-sub');
  const price = document.getElementById('hero-prod-price');

  if (tag) tag.textContent = prod.tag;
  if (vol) vol.textContent = prod.volume;
  if (name) name.textContent = prod.name;
  if (sub) sub.textContent = prod.subtitle;
  if (price) price.textContent = `$${prod.price}`;

  if (scene3d) {
    scene3d.loadProduct(prod);
  }
}

const heroAddBtn = document.getElementById('hero-add-to-bag');
if (heroAddBtn) {
  heroAddBtn.addEventListener('click', () => {
    addToCart(state.activeProduct);
  });
}

// =============================================================
// 6. PRODUCT SHOWROOM & CATEGORY FILTERING
// =============================================================
const productGrid = document.getElementById('product-grid');
const catPills = document.querySelectorAll('.cat-pill');

function renderProductGrid() {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  const filtered = state.currentCategory === 'all'
    ? productsData
    : productsData.filter(p => {
        if (state.currentCategory === 'serums') return p.category === 'serums';
        if (state.currentCategory === 'creams') return p.category === 'creams';
        if (state.currentCategory === 'mists') return p.modelType === 'mist';
        if (state.currentCategory === 'oils') return p.modelType === 'nectar';
        return true;
      });

  filtered.forEach(p => {
    const isSelected = state.activeProduct.id === p.id;
    const card = document.createElement('div');
    card.className = `product-card ${isSelected ? 'selected' : ''}`;
    
    // Key actives pills
    const activeTags = (p.actives || [])
      .slice(0, 2)
      .map(a => `<span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-pearl/80">${a.name}</span>`)
      .join('');

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] uppercase tracking-wider text-gold font-mono">${p.categoryName || 'Cellular Core'}</span>
          <span class="text-xs text-pearl/50 font-mono">${p.volume}</span>
        </div>
        <h3 class="font-serif text-lg text-pearl font-medium leading-snug">${p.name}</h3>
        <p class="text-xs text-gold/80 tracking-wide mt-1 mb-3">${p.subtitle}</p>
        <p class="text-xs text-pearl/60 line-clamp-2 font-light leading-relaxed mb-4">${p.description}</p>
        
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${activeTags}
        </div>
      </div>

      <div class="pt-4 border-t border-white/10 flex items-center justify-between">
        <span class="font-serif text-xl text-pearl">$${p.price}</span>
        <div class="flex items-center space-x-2">
          <button class="inspect-btn px-3 py-1.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black text-[11px] font-semibold tracking-wider uppercase transition-all" data-id="${p.id}">
            Inspect 3D
          </button>
          <button class="add-card-btn p-2 rounded-full bg-white/10 hover:bg-gold hover:text-black text-pearl transition-all" data-id="${p.id}" title="Add to Bag">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Click handler to inspect in 3D
    const inspectBtn = card.querySelector('.inspect-btn');
    inspectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateHeroMeta(p);
      renderProductGrid();
      soundEngine.playGlassChime(920, 0.15);
      // Smooth scroll back to 3D stage
      const hero = document.getElementById('hero-stage');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    });

    // Card click also inspects
    card.addEventListener('click', () => {
      updateHeroMeta(p);
      renderProductGrid();
    });

    // Add to cart button
    const addBtn = card.querySelector('.add-card-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(p);
    });

    productGrid.appendChild(card);
  });
}

catPills.forEach(pill => {
  pill.addEventListener('click', () => {
    catPills.forEach(p => p.classList.remove('active', 'bg-gold', 'text-black'));
    pill.classList.add('active', 'bg-gold', 'text-black');
    state.currentCategory = pill.dataset.cat;
    soundEngine.playGlassChime(760, 0.1);
    renderProductGrid();
  });
});

renderProductGrid();

// =============================================================
// 7. DIAGNOSTIC QUIZ SYSTEM
// =============================================================
function initDiagnosticQuiz() {
  const typesContainer = document.getElementById('quiz-types');
  const goalsContainer = document.getElementById('quiz-goals');
  const climatesContainer = document.getElementById('quiz-climates');

  if (!typesContainer || !goalsContainer || !climatesContainer) return;

  // Render Skin Types
  typesContainer.innerHTML = routineQuizData.skinTypes.map((t, idx) => `
    <button class="quiz-opt ${idx === 0 ? 'active' : ''}" data-type="${t.id}">
      <span class="text-xs font-bold text-pearl block">${t.label}</span>
      <span class="text-[11px] text-pearl/50 mt-1 block font-light leading-snug">${t.desc}</span>
    </button>
  `).join('');

  // Render Goals
  goalsContainer.innerHTML = routineQuizData.goals.map((g, idx) => `
    <button class="quiz-opt ${idx === 0 ? 'active' : ''}" data-goal="${g.id}">
      <span class="text-xs font-bold text-pearl block">${g.label}</span>
      <span class="text-[11px] text-pearl/50 mt-1 block font-light leading-snug">${g.focus}</span>
    </button>
  `).join('');

  // Render Climates
  climatesContainer.innerHTML = routineQuizData.climates.map((c, idx) => `
    <button class="quiz-opt ${idx === 0 ? 'active' : ''}" data-climate="${c.id}">
      <span class="text-xs font-bold text-pearl block">${c.label}</span>
      <span class="text-[11px] text-pearl/50 mt-1 block font-light leading-snug">${c.detail}</span>
    </button>
  `).join('');

  // Click handlers
  typesContainer.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      typesContainer.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.quiz.type = btn.dataset.type;
      soundEngine.playGlassChime(600, 0.08);
      updatePrescription();
    });
  });

  goalsContainer.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      goalsContainer.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.quiz.goal = btn.dataset.goal;
      soundEngine.playGlassChime(720, 0.08);
      updatePrescription();
    });
  });

  climatesContainer.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      climatesContainer.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.quiz.climate = btn.dataset.climate;
      soundEngine.playGlassChime(840, 0.08);
      updatePrescription();
    });
  });

  updatePrescription();
}

function updatePrescription() {
  const prescTitle = document.getElementById('presc-title');
  const prescItems = document.getElementById('presc-items');
  if (!prescItems) return;

  // Tailored recommendation logic
  let selected3 = [];
  if (state.quiz.goal === 'barrier' || state.quiz.type === 'reactive') {
    selected3 = [productsData[2] || productsData[0], productsData[0], productsData[1]];
    if (prescTitle) prescTitle.textContent = 'Cellular Lipid Shield & Redness Calming Ritual';
  } else if (state.quiz.goal === 'glow') {
    selected3 = [productsData[2] || productsData[0], productsData[3] || productsData[0], productsData[0]];
    if (prescTitle) prescTitle.textContent = '24K Luminescence & Cellular Resurfacing Protocol';
  } else {
    selected3 = [productsData[0], productsData[1], productsData[2] || productsData[0]];
    if (prescTitle) prescTitle.textContent = 'Core Cellular Senescence Reversal Prescription';
  }

  prescItems.innerHTML = selected3.map((prod, idx) => `
    <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center space-x-3">
      <div class="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
        0${idx + 1}
      </div>
      <div class="overflow-hidden">
        <h5 class="text-xs font-semibold text-pearl truncate">${prod.name}</h5>
        <span class="text-[10px] text-gold/80 block mt-0.5">$${prod.price} · ${prod.volume}</span>
      </div>
    </div>
  `).join('');

  // Add full ritual button
  const addRitualBtn = document.getElementById('add-ritual-to-bag');
  if (addRitualBtn) {
    addRitualBtn.onclick = () => {
      selected3.forEach(item => addToCart(item, false));
      updateCartUI();
      openCartDrawer();
      soundEngine.playSwell();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
  }
}

initDiagnosticQuiz();

// =============================================================
// 8. LUXURY SHOPPING BAG SYSTEM
// =============================================================
const bagDrawer = document.getElementById('bag-drawer');
const bagTrigger = document.getElementById('bag-trigger');
const bagClose = document.getElementById('bag-close');
const bagBackdrop = document.getElementById('bag-backdrop');
const bagList = document.getElementById('bag-items-list');
const bagCount = document.getElementById('bag-count');
const bagItemTotal = document.getElementById('bag-item-total');
const bagSubtotal = document.getElementById('bag-subtotal');
const shippingBar = document.getElementById('shipping-bar');
const shippingLabel = document.getElementById('shipping-label');
const shippingPerc = document.getElementById('shipping-perc');
const checkoutBtn = document.getElementById('bag-checkout-btn');

function openCartDrawer() {
  if (bagDrawer) bagDrawer.classList.add('open');
  soundEngine.playGlassChime(780, 0.12);
}

function closeCartDrawer() {
  if (bagDrawer) bagDrawer.classList.remove('open');
}

if (bagTrigger) bagTrigger.addEventListener('click', openCartDrawer);
if (bagClose) bagClose.addEventListener('click', closeCartDrawer);
if (bagBackdrop) bagBackdrop.addEventListener('click', closeCartDrawer);

function addToCart(product, openDrawer = true) {
  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: product.id, product, qty: 1 });
  }

  soundEngine.playGlassChime(1100, 0.18);
  updateCartUI();
  if (openDrawer) openCartDrawer();
}

function updateCartUI() {
  const totalCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = state.cart.reduce((sum, i) => sum + (i.product.price * i.qty), 0);

  if (bagCount) bagCount.textContent = totalCount;
  if (bagItemTotal) bagItemTotal.textContent = `(${totalCount} items)`;
  if (bagSubtotal) bagSubtotal.textContent = `$${subtotal}`;

  // Free shipping threshold ($200)
  const freeThreshold = 200;
  const progress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  if (shippingBar) shippingBar.style.width = `${progress}%`;
  if (shippingPerc) shippingPerc.textContent = `${progress}%`;

  if (shippingLabel) {
    if (subtotal >= freeThreshold) {
      shippingLabel.textContent = 'Complimentary Swiss Courier Courier unlocked!';
    } else {
      shippingLabel.textContent = `Add $${freeThreshold - subtotal} for complimentary Swiss Courier shipping`;
    }
  }

  // Render items
  if (!bagList) return;
  if (state.cart.length === 0) {
    bagList.innerHTML = `
      <div class="empty-bag-state py-16 text-center text-pearl/50">
        <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-3 text-gold/60">◇</div>
        <p class="text-sm font-light">Your formulation bag is currently empty.</p>
        <p class="text-xs text-pearl/40 mt-1">Select a flacon above to begin your cellular ritual.</p>
      </div>
    `;
    return;
  }

  bagList.innerHTML = state.cart.map(item => `
    <div class="bag-item-card">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-serif">
          Æ
        </div>
        <div>
          <h4 class="text-xs font-semibold text-pearl leading-snug">${item.product.name}</h4>
          <span class="text-[11px] text-gold/80 block mt-0.5">$${item.product.price} each</span>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <div class="flex items-center border border-white/10 rounded-full bg-black/40">
          <button class="qty-btn px-2.5 py-0.5 text-xs text-pearl/70 hover:text-white" data-action="dec" data-id="${item.id}">-</button>
          <span class="text-xs font-mono px-2 text-pearl">${item.qty}</span>
          <button class="qty-btn px-2.5 py-0.5 text-xs text-pearl/70 hover:text-white" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn text-pearl/40 hover:text-rose-400 text-xs ml-2" data-id="${item.id}">✕</button>
      </div>
    </div>
  `).join('');

  // Hook item buttons
  bagList.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const target = state.cart.find(i => i.id === id);
      if (target) {
        if (action === 'inc') target.qty += 1;
        if (action === 'dec') {
          target.qty -= 1;
          if (target.qty <= 0) {
            state.cart = state.cart.filter(i => i.id !== id);
          }
        }
        soundEngine.playGlassChime(640, 0.08);
        updateCartUI();
      }
    });
  });

  bagList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      state.cart = state.cart.filter(i => i.id !== id);
      soundEngine.playGlassChime(420, 0.08);
      updateCartUI();
    });
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
    soundEngine.playSwell();
    alert('Thank you for reserving your cellular longevity allocation. A courier dispatch notification has been transmitted.');
    state.cart = [];
    updateCartUI();
    closeCartDrawer();
  });
}

// =============================================================
// 9. ANIMATED CLINICAL COUNTERS ON SCROLL
// =============================================================
const counters = document.querySelectorAll('.stat-counter');
let countersTriggered = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      countersTriggered = true;
      counters.forEach(c => {
        const target = parseFloat(c.dataset.target);
        let current = 0;
        const step = target / 40;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            c.textContent = target;
            clearInterval(interval);
          } else {
            c.textContent = target % 1 === 0 ? Math.round(current) : current.toFixed(1);
          }
        }, 30);
      });
    }
  });
}, { threshold: 0.3 });

const scienceSection = document.getElementById('science');
if (scienceSection) counterObserver.observe(scienceSection);

// =============================================================
// 10. CUSTOM MAGNETIC CURSOR
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

  document.querySelectorAll('button, a, .quiz-opt, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });
}

// =============================================================
// 11. NEWSLETTER TOAST
// =============================================================
const newsForm = document.getElementById('newsletter-form');
if (newsForm) {
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    soundEngine.playGlassChime(1200, 0.2);
    confetti({ particleCount: 50, spread: 50 });
    alert('Thank you for subscribing to the VIP Longevity Journal.');
    newsForm.reset();
  });
}

console.log('✨ ÆTHÆRA CELLULAR LABS 3D Initialized Successfully.');
