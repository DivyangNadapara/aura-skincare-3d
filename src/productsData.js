// DERM-X: Real Market Skincare Formulations Knowledge Database
// Objective: Dermatological education, molecular analysis, and biochemical mechanisms.
// Zero commercial bias — pure formulation science.

export const realProductsData = [
  {
    id: "minimalist-niacinamide-10",
    name: "Minimalist Niacinamide 10% + Zinc 1%",
    brand: "Minimalist",
    brandOrigin: "Jaipur, India",
    category: "serums",
    categoryName: "Barrier & Sebum Regulating Serum",
    keyActives: "10% Niacinamide (Lonza, Switzerland) + 1% Zinc PCA + EU Aloe Vera",
    ph: "5.5 - 6.0",
    volume: "30ml / 1.0 fl. oz.",
    molecularWeight: "Niacinamide: 122.12 g/mol | Zinc PCA: 321.6 g/mol",
    modelType: "minimalist-dropper",
    liquidColor: 0xffffff,
    emissiveColor: 0x222222,
    accentColor: "#22c55e",
    bottleType: "apothecary-amber",
    tag: "Cult Favorite · Sebum Regulator",
    subtitle: "High-Purity Lonza Vitamin B3 with European Zinc PCA",
    scientificDescription: "Formulated with ultra-pure Grade Niacinamide from Lonza (Switzerland) with verified residual nicotinic acid content below 100ppm to eliminate flushing. Zinc PCA inhibits 5-alpha reductase to regulate sebum production and reduce Propionibacterium acnes colonization.",
    biochemistry: {
      mechanism: "Niacinamide acts as a precursor to NAD+/NADH coenzymes essential for cellular ATP production, DNA repair, and synthesis of epidermal ceramides, free fatty acids, and cholesterol.",
      targetLayer: "Stratum Basale & Sebaceous Glandular Ducts",
      daltonRating: "122 Da (Ultra-High Trans-Epidermal Permeability)",
      comedogenicRating: "0 (Non-comedogenic)"
    },
    activesBreakdown: [
      { name: "Niacinamide (10%)", desc: "Pharmaceutical grade Vitamin B3; upregulates SPT (serine palmitoyltransferase) enzyme to boost natural ceramide synthesis by +34%." },
      { name: "Zinc PCA (1%)", desc: "Zinc combined with L-Pyrrolidone Carboxylic Acid; potent physiological astringent and 5-alpha reductase inhibitor reducing sebum excretion rate." },
      { name: "EUK-134 (0.01%)", desc: "Manganese-based biomimetic antioxidant that mimics natural catalase and superoxide dismutase enzymes to neutralize peroxynitrite radicals." },
      { name: "Centella Asiatica Extract", desc: "Rich in madecassoside and asiatic acid; down-regulates pro-inflammatory cytokines TNF-alpha and IL-1beta." }
    ],
    vehicleBase: "Aloe Barbadensis Leaf Juice (Cold-processed EU standard base instead of plain deionized water)",
    conflictsWith: ["Direct Vitamin C (L-Ascorbic Acid) at pH < 3.5 in simultaneous application"],
    idealPairsWith: ["Hyaluronic Acid", "Salicylic Acid", "Ceramides", "Retinol"],
    dermatologistNote: "Ideal for oily, combination, and acne-prone skin with post-inflammatory erythema (PIE). Can be safely paired with retinoids at night to mitigate barrier dryness."
  },
  {
    id: "derma-co-hyaluronic-sunscreen",
    name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel",
    brand: "The Derma Co",
    brandOrigin: "Gurugram, India",
    category: "sunscreens",
    categoryName: "Broad Spectrum Hybrid Photoprotection",
    keyActives: "1% Multi-Molecular Hyaluronic Acid + Vitamin E + Titanium Dioxide + Organic UV Filters",
    ph: "6.0 - 6.5",
    volume: "50g / 1.76 oz.",
    molecularWeight: "HA Polymer: 50 - 1,500 kDa | UV Filters: 228 - 627 g/mol",
    modelType: "dermaco-pump",
    liquidColor: 0x93c5fd,
    emissiveColor: 0x1d4ed8,
    accentColor: "#3b82f6",
    bottleType: "blue-pump-tube",
    tag: "Derm-Approved · Zero White Cast",
    subtitle: "SPF 50 PA++++ Hybrid Chemical & Physical Blue Light Shield",
    scientificDescription: "An ultra-lightweight aqua gel matrix engineered to provide PA++++ critical wavelength protection (λc ≥ 370nm). Incorporates encapsulated organic filters with micro-fine mineral shields suspended in an osmotic hyaluronic gel network.",
    biochemistry: {
      mechanism: "Absorbs, reflects, and scatters incident photon energy in both UVA (320-400nm) and UVB (290-320nm) spectra. Neutralizes reactive oxygen species (ROS) induced by high-energy visible blue light (HEV 400-500nm).",
      targetLayer: "Stratum Corneum Surface (Shield Barrier Layer)",
      daltonRating: "Non-penetrating topical shield (Photostable)",
      comedogenicRating: "1 (Safe for acne-prone skin)"
    },
    activesBreakdown: [
      { name: "Multi-Molecular Hyaluronic Acid (1%)", desc: "Dual-weight HA network providing surface hygroscopic moisture retention without greasy occlusion." },
      { name: "Vitamin E (Tocopheryl Acetate)", desc: "Lipophilic chain-breaking antioxidant terminating lipid peroxidation in cell membranes exposed to sun." },
      { name: "Zinc Oxide & Titanium Dioxide", desc: "Micro-dispersed physical blockers refracting and scattering UV photons across the entire spectrum." },
      { name: "Tinosorb M & Octinoxate", desc: "Photostable organic UV absorbers with microfine organic particle technology providing high extinction coefficients." }
    ],
    vehicleBase: "Ultra-Lightweight Aqua Gel with volatile silicones for instantaneous non-sticky dermal flash-off",
    conflictsWith: ["Heavy silicone oils prior to application (may compromise even film formation)"],
    idealPairsWith: ["Antioxidant Serums (Vitamin C, Niacinamide) in morning routines"],
    dermatologistNote: "Apply 2 finger-lengths as the final AM step. Reapply every 2 hours during continuous UV exposure or after heavy perspiration."
  },
  {
    id: "the-ordinary-aha-bha-peeling",
    name: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    brand: "The Ordinary",
    brandOrigin: "DECIEM, Toronto, Canada",
    category: "exfoliants",
    categoryName: "Chemical Exfoliant Peeling Solution",
    keyActives: "30% Alpha Hydroxy Acids (Glycolic, Lactic, Tartaric, Citric) + 2% Salicylic Acid",
    ph: "3.5 - 3.7 (pKa Balanced)",
    volume: "30ml / 1.0 fl. oz.",
    molecularWeight: "Glycolic: 76.05 Da | Lactic: 90.08 Da | Salicylic: 138.12 Da",
    modelType: "ordinary-dropper",
    liquidColor: 0x991b1b,
    emissiveColor: 0x450a0a,
    accentColor: "#ef4444",
    bottleType: "blood-red-dropper",
    tag: "Legendary Resurfacer · 10-Min Wash-Off",
    subtitle: "High-Concentration Epidermal Chemical Peel with Tasmanian Pepperberry",
    scientificDescription: "An intensive clinical-grade home acid peel balancing water-soluble AHAs with oil-soluble Salicylic Acid. Calibrated precisely at pH 3.6 to maintain optimal free acid value (FAV) equal to pKa of glycolic acid (3.6) for maximal keratolytic efficacy with Tasmanian Pepperberry to mitigate acid-induced neuro-sensory stinging.",
    biochemistry: {
      mechanism: "Cleaves calcium-dependent desmosomes (protein bridges) binding stratum corneum corneocytes, accelerating cell desquamation. Salicylic acid lipophilicity enables penetrative dissolution of intra-follicular lipid plugs.",
      targetLayer: "Stratum Corneum & Infundibulum Pores",
      daltonRating: "76 - 138 Da (High cutaneous acid flux)",
      comedogenicRating: "0 (Keratolytic decongestant)"
    },
    activesBreakdown: [
      { name: "Glycolic Acid (AHA)", desc: "Smallest alpha hydroxy acid molecule (76 Da); penetrates deeply to break ionic bonds holding dead keratinocytes." },
      { name: "Salicylic Acid (BHA 2%)", desc: "Oil-soluble beta hydroxy acid; dissolves intracellular cement within sebaceous follicles to purge blackheads." },
      { name: "Tasmanian Pepperberry (Polygodial)", desc: "Botanical active containing polygodial; inhibits TRPV1 vanilloid receptor activation to reduce acute acid erythema." },
      { name: "Black Carrot Extract", desc: "Rich in anthocyanins; provides characteristic deep blood-ruby color and supplemental radical scavenging." }
    ],
    vehicleBase: "Aqueous gel buffer with Sodium Hyaluronate crosspolymer for controlled acid delivery",
    conflictsWith: ["Direct Acids", "Pure Retinoids", "L-Ascorbic Acid", "Copper Peptides", "Physical Scrubs"],
    idealPairsWith: ["Centella / Cica Soothing Lotions", "Barrier Recovery Ceramides (Post-wash)"],
    dermatologistNote: "STRICT MAXIMUM: 10 minutes on dry skin only. Wash off with lukewarm water. Never use on broken or compromised skin barriers. Mandatory SPF 50 the following days."
  },
  {
    id: "paulas-choice-2-bha-liquid",
    name: "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    brandOrigin: "Seattle, Washington, USA",
    category: "exfoliants",
    categoryName: "Pore-Clearing Liquid Exfoliant",
    keyActives: "2% Salicylic Acid + Methylpropanediol + Camellia Sinensis (Green Tea) Leaf Extract",
    ph: "3.2 - 3.8",
    volume: "118ml / 4.0 fl. oz.",
    molecularWeight: "Salicylic Acid: 138.12 Da",
    modelType: "paulas-bottle",
    liquidColor: 0xe2e8f0,
    emissiveColor: 0x334155,
    accentColor: "#94a3b8",
    bottleType: "grey-flacon",
    tag: "Global Holy Grail · Blackhead Dissolver",
    subtitle: "Leave-On Salicylic Acid Exfoliant in Penetration-Enhancing Vehicle",
    scientificDescription: "Recognized as the gold standard in leave-on beta hydroxy acid formulations. Formulated with 2% unneutralized Salicylic Acid solubilized in a specialized methylpropanediol and butylene glycol delivery system that enhances follicular sebum penetration without harsh drying alcohol.",
    biochemistry: {
      mechanism: "Lipophilic salicylic acid diffuses through hydrophobic sebum, dissolves lipid cross-linkages in follicular comedones, and suppresses NF-kappaB inflammatory pathways in the pore lining.",
      targetLayer: "Follicular Canal & Stratum Corneum",
      daltonRating: "138 Da (Lipophilic intra-pore penetration)",
      comedogenicRating: "0 (Clears comedones)"
    },
    activesBreakdown: [
      { name: "Salicylic Acid (2%)", desc: "Oil-soluble keratolytic and anti-inflammatory agent that clears debris, dead cells, and oxidized sebum inside pores." },
      { name: "Methylpropanediol", desc: "Glycol penetration enhancer that increases skin absorption of salicylic acid while providing hydration." },
      { name: "Green Tea Extract (EGCG)", desc: "Potent polyphenol antioxidant that soothes redness and inhibits matrix metalloproteinases." },
      { name: "Sodium Hydroxide Buffer", desc: "Precisely adjusts formulation pH to 3.5 to preserve ~60% free acid bio-availability." }
    ],
    vehicleBase: "Alcohol-free hydrating glycol fluid",
    conflictsWith: ["Strong prescription tretinoin on same night", "High concentration chemical peels"],
    idealPairsWith: ["Niacinamide serums", "Hydrating Hyaluronic toners", "Lightweight gel moisturizers"],
    dermatologistNote: "Apply with fingers or cotton pad after cleansing. Do not rinse. Introduce gradually: 2-3 times per week initially before progressing to nightly use."
  },
  {
    id: "derma-co-2-kojic-acid-cream",
    name: "The Derma Co 2% Kojic Acid Face Cream",
    brand: "The Derma Co",
    brandOrigin: "Gurugram, India",
    category: "creams",
    categoryName: "Melanin Inhibiting Depigmentation Emulsion",
    keyActives: "2% Kojic Acid + 1% Alpha Arbutin + 1% Niacinamide + Tetrahydrocurcumin",
    ph: "5.0 - 5.5",
    volume: "30g / 1.05 oz.",
    molecularWeight: "Kojic: 142.11 Da | Alpha Arbutin: 272.25 Da",
    modelType: "dermaco-kojic-cream",
    liquidColor: 0xfef08a,
    emissiveColor: 0x854d0e,
    accentColor: "#eab308",
    bottleType: "clinical-pump",
    tag: "Targeted PIH & Melasma Solution",
    subtitle: "Multi-Pathway Tyrosinase Inhibitor Complex for Post-Acne Marks",
    scientificDescription: "A clinical multi-targeted depigmentation formulation that attacks melanogenesis at four distinct enzymatic steps: tyrosinase copper chelation, competitive active site inhibition, melanosome transfer blockade, and antioxidant oxidation prevention.",
    biochemistry: {
      mechanism: "Kojic acid binds to the copper ions in the active catalytic center of tyrosinase enzyme, preventing conversion of L-DOPA to dopaquinone, while Alpha Arbutin competitively inhibits tyrosinase activity.",
      targetLayer: "Epidermal Melanocytes in Stratum Basale",
      daltonRating: "142 Da (Reaches basal melanocyte layer)",
      comedogenicRating: "1 (Lightweight emulsion)"
    },
    activesBreakdown: [
      { name: "Kojic Acid (2%)", desc: "Fungal metabolite from Aspergillus oryzae; chelates essential copper cofactor in tyrosinase." },
      { name: "Alpha Arbutin (1%)", desc: "Alpha-glucoside of hydroquinone; competitive inhibitor of tyrosinase with exceptional stability." },
      { name: "Niacinamide (1%)", desc: "Blocks transfer of melanin-filled melanosomes from melanocytes to surrounding keratinocytes by up to 68%." },
      { name: "Tetrahydrocurcumin", desc: "Hydrogenated colorless turmeric active providing superior tyrosinase inhibition without yellow staining." }
    ],
    vehicleBase: "Liposomal delivery cream base with cetearyl octanoate",
    conflictsWith: ["Heavy oxidizing agents that may degrade Kojic acid stability"],
    idealPairsWith: ["Broad Spectrum SPF 50+ (Critical: sun exposure reverses tyrosinase inhibition)", "Gentle Hydrating Cleansers"],
    dermatologistNote: "Highly effective for post-inflammatory hyperpigmentation (PIH) and melasma patches. Best used twice daily for minimum 6-8 weeks for visible tone harmonization."
  },
  {
    id: "cerave-moisturizing-cream",
    name: "CeraVe Moisturizing Cream with 3 Essential Ceramides",
    brand: "CeraVe",
    brandOrigin: "L'Oréal Dermatological Beauty, USA/France",
    category: "creams",
    categoryName: "Lipid Matrix Barrier Restorative",
    keyActives: "Ceramides 1 (EOP), 3 (NP), 6-II (AP) + Phytosphingosine + MVE Multivesicular Emulsion",
    ph: "5.0 - 5.5",
    volume: "340g / 12 oz.",
    molecularWeight: "Ceramides: 500 - 700 Da | Phytosphingosine: 317 Da",
    modelType: "cerave-tub",
    liquidColor: 0xf8fafc,
    emissiveColor: 0x1e3a8a,
    accentColor: "#2563eb",
    bottleType: "clinical-tub",
    tag: "Dermatologist #1 Choice · Eczema Safe",
    subtitle: "Patented MVE Technology Providing 24-Hour Controlled-Release Lipid Matrix",
    scientificDescription: "Developed with dermatologists to restore the natural cutaneous barrier using bio-identical skin lipids in the physiologic 3:1:1 ratio. Features patented Multivesicular Emulsion (MVE) delivery technology consisting of concentric lipid-water spheres that break down sequentially over 24 hours.",
    biochemistry: {
      mechanism: "Reconstructs the lipid lamellae (brick and mortar architecture) of the stratum corneum, locking in natural moisturizing factors (NMF) and preventing trans-epidermal water loss (TEWL).",
      targetLayer: "Stratum Corneum Intercellular Lipid Lamellae",
      daltonRating: "Lamellar membrane lipid integration",
      comedogenicRating: "0 (Accepted by National Eczema Association)"
    },
    activesBreakdown: [
      { name: "Ceramide NP (Ceramide 3)", desc: "Reinforces skin barrier resilience and reduces transepidermal moisture evaporation." },
      { name: "Ceramide AP (Ceramide 6-II)", desc: "Supports natural cellular desquamation and smoothens rough, cracked skin texture." },
      { name: "Ceramide EOP (Ceramide 1)", desc: "Long-chain omega-hydroxy fatty acid ceramide binding the entire bilayer together into tight sheets." },
      { name: "Phytosphingosine", desc: "Precursor lipid with natural anti-microbial and anti-inflammatory properties that defends against skin pathogens." }
    ],
    vehicleBase: "MVE multivesicular spheres suspended in rich non-greasy petrolatum-glycerin matrix",
    conflictsWith: ["None (Universally compatible barrier restorative)"],
    idealPairsWith: ["All active acids, retinoids, benzoyl peroxide, and drying treatments"],
    dermatologistNote: "The universal baseline barrier repair cream. Safe for face and body, sensitive skin, eczema, and psoriasis. Use immediately after cleansing on damp skin."
  }
];

export const scientificMoleculesData = [
  {
    id: "niacinamide",
    name: "Niacinamide (Vitamin B3)",
    chemicalFormula: "C₆H₆N₂O",
    molarMass: "122.12 g/mol",
    solubility: "Water-soluble (Hydrophilic)",
    pKa: "3.35 (Weak base)",
    role: "Cellular ATP & Ceramide Synthesis Upregulator",
    clinicalEfficacy: "Reduces sebum excretion by 30-40%, diminishes PIH in 4 weeks, upregulates collagen by +54%.",
    atoms: [
      { element: "N", x: 0, y: 1.2, z: 0, color: 0x3b82f6, radius: 0.18, label: "Nitrogen (Ring)" },
      { element: "C", x: 1.0, y: 0.6, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 2" },
      { element: "C", x: 1.0, y: -0.8, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 3" },
      { element: "C", x: 0, y: -1.4, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 4" },
      { element: "C", x: -1.0, y: -0.8, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 5" },
      { element: "C", x: -1.0, y: 0.6, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 6" },
      { element: "C", x: 2.2, y: -1.5, z: 0.2, color: 0x475569, radius: 0.22, label: "Carbonyl C" },
      { element: "O", x: 3.1, y: -1.0, z: 0.4, color: 0xef4444, radius: 0.2, label: "Oxygen =O" },
      { element: "N", x: 2.3, y: -2.8, z: 0.1, color: 0x3b82f6, radius: 0.18, label: "Amide NH₂" }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [2, 6], [6, 7], [6, 8]
    ]
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid (Beta Hydroxy Acid)",
    chemicalFormula: "C₇H₆O₃",
    molarMass: "138.12 g/mol",
    solubility: "Lipophilic (Oil-soluble)",
    pKa: "2.97 (Carboxylic Acid)",
    role: "Desmolytic Pores & Sebum Keratolytic",
    clinicalEfficacy: "Penetrates sebum plugs, clears open/closed comedones, reduces inflammatory papules by 47%.",
    atoms: [
      { element: "C", x: 0, y: 1.1, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 1" },
      { element: "C", x: 1.0, y: 0.5, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 2" },
      { element: "C", x: 1.0, y: -0.9, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 3" },
      { element: "C", x: 0, y: -1.6, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 4" },
      { element: "C", x: -1.0, y: -0.9, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 5" },
      { element: "C", x: -1.0, y: 0.5, z: 0, color: 0x475569, radius: 0.22, label: "Carbon 6" },
      { element: "C", x: 0, y: 2.4, z: 0, color: 0x475569, radius: 0.22, label: "Carboxyl C" },
      { element: "O", x: -1.0, y: 3.1, z: 0, color: 0xef4444, radius: 0.2, label: "Carbonyl =O" },
      { element: "O", x: 1.1, y: 3.0, z: 0, color: 0xef4444, radius: 0.2, label: "Hydroxyl -OH" },
      { element: "O", x: 2.2, y: 1.2, z: 0, color: 0xef4444, radius: 0.2, label: "Phenolic -OH" }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [0, 6], [6, 7], [6, 8], [1, 9]
    ]
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid (D-Glucuronic + GlcNAc)",
    chemicalFormula: "(C₁₄H₂₁NO₁₁)ₙ",
    molarMass: "50 kDa - 2,000 kDa",
    solubility: "Highly Hydrophilic (Binds 1000x its weight in water)",
    pKa: "3.0 - 4.0",
    role: "Osmotic Hydration & Viscoelastic Matrix Scaffold",
    clinicalEfficacy: "Increases stratum corneum moisture by +96%, reduces transepidermal water loss, accelerates wound re-epithelialization.",
    atoms: [
      { element: "C", x: -1.5, y: 0.5, z: 0, color: 0x475569, radius: 0.22, label: "Glucuronic C1" },
      { element: "C", x: -0.8, y: 1.4, z: 0.2, color: 0x475569, radius: 0.22, label: "C2" },
      { element: "C", x: 0.4, y: 1.2, z: 0, color: 0x475569, radius: 0.22, label: "C3" },
      { element: "C", x: 0.8, y: 0, z: -0.2, color: 0x475569, radius: 0.22, label: "C4" },
      { element: "O", x: 0, y: -0.8, z: 0, color: 0xef4444, radius: 0.2, label: "Ring Oxygen" },
      { element: "C", x: -1.2, y: -0.7, z: 0, color: 0x475569, radius: 0.22, label: "C5" },
      { element: "C", x: 2.1, y: -0.2, z: 0, color: 0x475569, radius: 0.22, label: "GlcNAc C1" },
      { element: "N", x: 2.6, y: 0.8, z: 0.2, color: 0x3b82f6, radius: 0.18, label: "Acetamido N" },
      { element: "O", x: 3.5, y: -0.6, z: 0, color: 0xef4444, radius: 0.2, label: "Hydroxyl O" }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [3, 6], [6, 7], [6, 8]
    ]
  }
];

export const ingredientConflictMatrix = [
  {
    pair: ["AHA / BHA", "Retinoids (Retinol / Tretinoin)"],
    status: "caution",
    label: "High Irritation Risk (Do Not Layer Concurrently)",
    severity: "High",
    science: "Both increase cellular turnover through distinct pathways. Concurrent application overwhelms the stratum corneum, causing acute barrier disruption, burning, erythema, and increased transepidermal water loss (TEWL).",
    recommendation: "Alternate nights (e.g. BHA on Monday/Thursday, Retinoid on Tuesday/Friday/Sunday). Always follow with a ceramide cream."
  },
  {
    pair: ["Direct Vitamin C (L-Ascorbic Acid)", "Niacinamide (High Dose)"],
    status: "myth-busted",
    label: "Safe to Pair (Old Chemistry Myth Debunked)",
    severity: "Negligible",
    science: "The historic belief that Vitamin C and Niacinamide cancel each other or form yellow niacin comes from 1960s experiments conducted at unphysiologically high temperatures (>80°C) over weeks. Under ambient human skin conditions, modern stabilized serums can be applied together.",
    recommendation: "Allow 2-3 minutes between applications if skin is prone to temporary acidic flushing."
  },
  {
    pair: ["Salicylic Acid (BHA)", "Benzoyl Peroxide (BPO)"],
    status: "caution",
    label: "Severe Barrier Dehydration Hazard",
    severity: "Moderate-High",
    science: "Benzoyl peroxide is a potent oxidizing antimicrobial, while salicylic acid is a lipophilic keratolytic. Using them simultaneously causes extreme peeling, lipid depletion, and contact dermatitis.",
    recommendation: "Use Salicylic Acid in morning/alternate days, and Benzoyl Peroxide strictly as a localized short-contact spot treatment."
  },
  {
    pair: ["Hyaluronic Acid", "Ceramides (NP, AP, EOP)"],
    status: "synergy",
    label: "Gold Standard Barrier Synergy (100% Recommended)",
    severity: "Optimal",
    science: "Hyaluronic acid acts as an internal hygroscopic water reservoir, while ceramides construct the hydrophobic lipid mortar that seals that water inside the stratum corneum, preventing evaporative moisture loss.",
    recommendation: "Apply Hyaluronic Acid onto slightly damp skin first, then immediately seal with a ceramide cream (e.g. CeraVe)."
  },
  {
    pair: ["Kojic Acid", "Alpha Arbutin"],
    status: "synergy",
    label: "Dual Tyrosinase Blockade Synergy",
    severity: "Optimal",
    science: "Kojic acid chelates the copper co-factor of tyrosinase, while Alpha Arbutin competitively occupies the active enzyme binding site. This two-prong attack yields significantly superior melasma and PIH clearance than either alone.",
    recommendation: "Apply twice daily followed religiously by SPF 50+ sunscreen in the morning."
  }
];
