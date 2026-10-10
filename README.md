# ⚗️ DERM-X: The Molecular Skincare Knowledge Engine

> **A 100% non-commercial, interactive 3D dermatological science encyclopedia analyzing real market formulations.**  
> Cut through cosmetic marketing claims. Examine biochemical mechanisms, Dalton permeability, pKa acid ionization, and 3D molecular structures for:  
> **Minimalist**, **The Derma Co**, **The Ordinary**, **Paula's Choice**, and **CeraVe**.

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=flat&logo=three.js)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-3D_Molecular_Simulation-blue?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Web Audio API](https://img.shields.io/badge/Audio-Procedural_Synthesizer-emerald?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Status](https://img.shields.io/badge/Purpose-Open_Scientific_Education-success)](https://github.com/DivyangNadapara/aura-skincare-3d)

---

## 🌟 Real Market Products Analyzed

1. **Minimalist Niacinamide 10% + Zinc 1%**:
   - High-purity Swiss Lonza Vitamin B3 ($122\,\text{Da}$) with European Zinc PCA in a cold-processed EU Aloe Vera base.
   - 3D Model: Amber apothecary glass flacon with matte black dropper collar and clean typographic label.
2. **The Derma Co 1% Hyaluronic Sunscreen Aqua Gel**:
   - Broad-spectrum SPF 50 PA++++ hybrid photoprotection with micro-dispersed mineral filters and 1% multi-molecular HA.
   - 3D Model: Vibrant cobalt blue pump tube with translucent cap.
3. **The Ordinary AHA 30% + BHA 2% Peeling Solution**:
   - 10-minute acid resurfacing facial with Glycolic, Lactic, Tartaric, and Salicylic acids balanced at pH 3.6 with Tasmanian Pepperberry.
   - 3D Model: Frosted glass dropper with vivid blood-ruby liquid core.
4. **Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant**:
   - Leave-on Salicylic Acid ($138\,\text{Da}$) solubilized in a penetration-enhancing glycol vehicle with Green Tea polyphenols.
   - 3D Model: Matte dark slate flacon with silver trim.
5. **The Derma Co 2% Kojic Acid Face Cream**:
   - Multi-pathway tyrosinase inhibitor complex with 2% Kojic Acid, 1% Alpha Arbutin, and 1% Niacinamide for melasma and PIH.
   - 3D Model: Clinical white dispenser with gold accent band.
6. **CeraVe Moisturizing Cream with 3 Essential Ceramides**:
   - Bio-identical Ceramides 1, 3, 6-II in a 3:1:1 physiologic ratio delivered via patented 24-hour Multivesicular Emulsion (MVE).
   - 3D Model: Iconic broad white tub with royal blue screw cap.

---

## 🔬 Unique 3D Visual & Interactive Animations

- 🛡️ **3D UV Photon Deflection Shield**:
  - Activates a glowing geodesic forcefield dome over the sunscreen and simulates animated ultraviolet photon particle rays deflecting off the barrier.
- ⚗️ **3D Ball-and-Stick Chemical Molecular Viewer**:
  - Switch the hero canvas from product view to actual 3D chemical structures. Inspect atoms (Carbon, Oxygen, Nitrogen, Hydrogen) and covalent bonds for Niacinamide ($C_6H_6N_2O$), Salicylic Acid ($C_7H_6O_3$), and Hyaluronic Acid!
- ⚡ **Holographic Laser Chemical Scanner**:
  - A volumetric laser beam sweeps vertically across the bottle, displaying active ingredient percentages and vehicle bases in real-time HUD graphics.
- 💥 **Atomic Deconstruction (Explode into Ions)**:
  - Disassembles the bottle components outward while releasing an illuminated cloud of chemical active ions.
- 🧬 **Cutaneous Skin Layer Penetration Simulator**:
  - Interactive cross-section of the Stratum Corneum, Granulosum, and Basale demonstrating the 500-Dalton rule and lipophilic pore clearance.
- 🧪 **Active Ingredient Conflict & Synergy Collider**:
  - Test pairing interactions (e.g. *AHA/BHA + Retinoids* vs *Hyaluronic Acid + Ceramides* vs *Vitamin C + Niacinamide*) with real dermatological mechanisms.
- 📊 **Interactive pH & Free Acid Bioavailability Reactor**:
  - Live slider calculating the un-ionized free acid fraction using the Henderson-Hasselbalch equation ($\alpha = \frac{1}{1 + 10^{(pH - pKa)}}$).
- 📋 **Evidence-Based Routine Architect**:
  - Unbiased AM/PM layering schedules based on skin conditions (Acne, Hyperpigmentation, Impaired Barrier) with exact wait times.

---

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript (ES Modules), HTML5, Modern CSS3
- **3D Graphics**: [Three.js](https://threejs.org/) (Custom PBR shaders, procedural geometry, instanced particles)
- **Smooth Inertia Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Audio Synthesis**: Native Web Audio API (Harmonic drones, acoustic droplets, resonant chimes)
- **Build Tool**: [Vite](https://vitejs.dev/)

---

## 🚀 Running Locally

```bash
# Clone repository
git clone https://github.com/DivyangNadapara/aura-skincare-3d.git
cd aura-skincare-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📜 Scientific References & Acknowledgements

- British Journal of Dermatology (BJD)
- Journal of the American Academy of Dermatology (JAAD)
- Contact Dermatitis Clinical Database
- Formulations cross-referenced with manufacturer Certificates of Analysis (CoA) and INCI declarations.
