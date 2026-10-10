import * as THREE from 'three';

/**
 * Three.js 3D Viewport Engine for ÆTHÆRA Luxury Cellular Skincare
 * Features:
 * - Dynamic PBR materials (refractive glass, translucent serums, brushed gold, frosted midnight jar)
 * - Procedural models for all 4 luxury skincare products
 * - Floating 24K gold foil particles & ambient bioluminescent cellular spores
 * - X-Ray / Cellular Hologram mode
 * - Dose Dispenser pipette animation with liquid drop physics
 * - Dynamic studio lighting moods (Dawn, Midnight, Solar)
 * - Smooth orbit drag, mouse parallax, and auto-idle rotation
 * - Interactive 3D annotation hotspots
 */
export class Scene3D {
  constructor(canvasContainer, soundEngine) {
    this.container = canvasContainer;
    this.sound = soundEngine;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.envTexture = null;

    // Groups
    this.mainGroup = null;
    this.productGroup = null;
    this.particlesGroup = null;
    this.dropletGroup = null;
    this.goldFlakesGroup = null;
    this.hotspotsGroup = null;

    // Lighting
    this.lights = {};
    this.currentLightingMood = 'dawn'; // dawn | midnight | solar

    // State
    this.currentProduct = null;
    this.isXRay = false;
    this.isDispensing = false;
    this.isAutoRotating = true;
    this.isExploded = false;
    this.dispenseProgress = 0;
    this.hotspotsVisible = true;

    // Interaction / Drag
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.1, y: 0.4 };
    this.currentRotation = { x: 0.1, y: 0.4 };
    this.mouseNormalized = { x: 0, y: 0 };

    this.clock = new THREE.Clock();
    this.callbacks = {
      onHotspotClick: null,
      onDispenseComplete: null
    };

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0c10, 0.04);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.8, 5.2);
    this.camera.lookAt(0, 0.1, 0);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Generate Procedural Environment Map for Glass Refractions & Metallic Sheen
    this.generateProceduralEnvMap();

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Base Groups
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    this.productGroup = new THREE.Group();
    this.mainGroup.add(this.productGroup);

    this.dropletGroup = new THREE.Group();
    this.mainGroup.add(this.dropletGroup);

    this.hotspotsGroup = new THREE.Group();
    this.mainGroup.add(this.hotspotsGroup);

    // 7. Ambient Bioluminescent Spores & Studio Floor
    this.createAmbientSpores();
    this.createShadowPlane();

    // 8. Event Listeners
    this.setupEvents();

    // 9. Start Render Loop
    this.animate();
  }

  generateProceduralEnvMap() {
    // High-end studio softbox simulation texture on canvas
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Deep studio gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
    bgGrad.addColorStop(0, '#151822');
    bgGrad.addColorStop(0.5, '#0b0d13');
    bgGrad.addColorStop(1, '#050608');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Softbox 1: Overhead key
    const rad1 = ctx.createRadialGradient(size * 0.5, size * 0.25, 10, size * 0.5, size * 0.25, size * 0.35);
    rad1.addColorStop(0, 'rgba(255, 248, 235, 0.95)');
    rad1.addColorStop(0.4, 'rgba(235, 210, 180, 0.4)');
    rad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, size, size);

    // Softbox 2: Lateral champagne rim
    const rad2 = ctx.createRadialGradient(size * 0.85, size * 0.6, 5, size * 0.85, size * 0.6, size * 0.25);
    rad2.addColorStop(0, 'rgba(240, 220, 190, 0.7)');
    rad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad2;
    ctx.fillRect(0, 0, size, size);

    // Softbox 3: Subtle sapphire cool rim
    const rad3 = ctx.createRadialGradient(size * 0.15, size * 0.7, 5, size * 0.15, size * 0.7, size * 0.25);
    rad3.addColorStop(0, 'rgba(160, 200, 240, 0.5)');
    rad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad3;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.envTexture = texture;
    this.scene.environment = texture;
  }

  setupLighting() {
    this.lightingContainer = new THREE.Group();
    this.scene.add(this.lightingContainer);

    // Ambient fill
    this.lights.ambient = new THREE.AmbientLight(0xfff7ed, 0.7);
    this.lightingContainer.add(this.lights.ambient);

    // Key Light (Main soft directional warm gold)
    this.lights.key = new THREE.DirectionalLight(0xffecd2, 3.2);
    this.lights.key.position.set(3, 4.5, 3.5);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.width = 1024;
    this.lights.key.shadow.mapSize.height = 1024;
    this.lights.key.shadow.bias = -0.0005;
    this.lightingContainer.add(this.lights.key);

    // Rim Light (Sharp contrast & edge glint)
    this.lights.rim = new THREE.DirectionalLight(0xd4af37, 2.5);
    this.lights.rim.position.set(-3.5, 2.8, -3);
    this.lightingContainer.add(this.lights.rim);

    // Secondary Rim Light (Cool balance for crystal refraction)
    this.lights.coolRim = new THREE.DirectionalLight(0x9fc5e8, 1.8);
    this.lights.coolRim.position.set(3.5, -1, -2.5);
    this.lightingContainer.add(this.lights.coolRim);

    // Under-Glow Point Light for liquid luminance
    this.lights.underGlow = new THREE.PointLight(0xf5c99e, 2.2, 5);
    this.lights.underGlow.position.set(0, -0.6, 0.5);
    this.lightingContainer.add(this.lights.underGlow);
  }

  setLightingMood(mood) {
    this.currentLightingMood = mood;
    if (this.sound) this.sound.playChime(640, 0.12);

    if (mood === 'dawn') {
      // Warm Rose-Gold & Champagne Morning
      this.lights.ambient.color.setHex(0xfff5ea);
      this.lights.ambient.intensity = 0.7;
      this.lights.key.color.setHex(0xffebd2);
      this.lights.key.intensity = 3.2;
      this.lights.rim.color.setHex(0xd4af37);
      this.lights.coolRim.color.setHex(0xe8c1a0);
      this.lights.underGlow.color.setHex(0xf5c99e);
      this.scene.fog.color.setHex(0x0c0e14);
    } else if (mood === 'midnight') {
      // Obsidian Velvet & Cool Bio-Luminescence
      this.lights.ambient.color.setHex(0x1a2233);
      this.lights.ambient.intensity = 0.5;
      this.lights.key.color.setHex(0x9ec5fe);
      this.lights.key.intensity = 2.4;
      this.lights.rim.color.setHex(0x4f86f7);
      this.lights.coolRim.color.setHex(0x7048e8);
      this.lights.underGlow.color.setHex(0x38d9a9);
      this.scene.fog.color.setHex(0x050810);
    } else if (mood === 'solar') {
      // High-key Editorial Studio Radiance
      this.lights.ambient.color.setHex(0xffffff);
      this.lights.ambient.intensity = 1.0;
      this.lights.key.color.setHex(0xffffff);
      this.lights.key.intensity = 4.2;
      this.lights.rim.color.setHex(0xffebba);
      this.lights.coolRim.color.setHex(0xdef2ff);
      this.lights.underGlow.color.setHex(0xffd166);
      this.scene.fog.color.setHex(0x12141c);
    }
  }

  createShadowPlane() {
    // Elegant soft ground reflection
    const planeGeo = new THREE.PlaneGeometry(12, 12);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x07080c,
      roughness: 0.65,
      metalness: 0.4
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.2;
    plane.receiveShadow = true;
    this.scene.add(plane);

    // Subtle radial pedestal ring
    const ringGeo = new THREE.RingGeometry(0.8, 1.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.19;
    this.scene.add(ring);
  }

  createAmbientSpores() {
    // 250 micro-spores floating in space with organic drift
    const count = 260;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.04 + 0.015;
      speeds[i] = Math.random() * 0.4 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    // Canvas particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 238, 204, 1)');
    grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.7)');
    grad.addColorStop(0.8, 'rgba(212, 175, 55, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: pTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particlesGroup = new THREE.Points(geometry, material);
    this.scene.add(this.particlesGroup);
  }

  // -------------------------------------------------------------
  // PROCEDURAL LUXURY 3D PRODUCT BUILDERS
  // -------------------------------------------------------------

  loadProduct(productData) {
    this.currentProduct = productData;
    this.clearCurrentProduct();

    if (this.sound) {
      this.sound.playChime(productData.modelType === 'cream' ? 440 : 880, 0.2);
    }

    // Model routing
    if (productData.modelType === 'serum') {
      this.buildSerumDropperModel(productData);
    } else if (productData.modelType === 'cream') {
      this.buildLuxuryCreamJarModel(productData);
    } else if (productData.modelType === 'mist') {
      this.buildGlacierMistModel(productData);
    } else if (productData.modelType === 'nectar') {
      this.buildGoldNectarModel(productData);
    }

    // Add interactive 3D Hotspot Pins
    this.buildHotspots(productData);

    // Initial positioning & intro scale animation
    this.productGroup.scale.set(0.01, 0.01, 0.01);
    this.productGroup.position.set(0, -0.1, 0);

    // Smooth entry scale
    let s = 0.01;
    const animateIn = () => {
      s += (1.0 - s) * 0.12;
      this.productGroup.scale.set(s, s, s);
      if (s < 0.999) {
        requestAnimationFrame(animateIn);
      } else {
        this.productGroup.scale.set(1, 1, 1);
      }
    };
    animateIn();
  }

  clearCurrentProduct() {
    while (this.productGroup.children.length > 0) {
      const obj = this.productGroup.children[0];
      this.productGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    while (this.hotspotsGroup.children.length > 0) {
      const h = this.hotspotsGroup.children[0];
      this.hotspotsGroup.remove(h);
    }

    this.dropletGroup.clear();
    this.goldFlakesGroup = null;
    this.pipetteMesh = null;
    this.capMesh = null;
    this.bodyMesh = null;
    this.liquidMesh = null;
  }

  // --- MODEL 1: CELESTIAL ORCHID BIO-SERUM (Dropper Bottle) ---
  buildSerumDropperModel(data) {
    const bottleGroup = new THREE.Group();

    // 1. Outer Heavy Glass Flacon (Refraction physical material)
    const glassGeo = new THREE.CylinderGeometry(0.68, 0.65, 2.0, 48, 1, false);
    const glassMat = this.createGlassMaterial(0.05, 1.52, 0xffffff);
    this.bodyMesh = new THREE.Mesh(glassGeo, glassMat);
    this.bodyMesh.position.y = 0;
    this.bodyMesh.castShadow = true;
    bottleGroup.add(this.bodyMesh);

    // Rounded Bottle Shoulder
    const shoulderGeo = new THREE.CylinderGeometry(0.42, 0.68, 0.35, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMat);
    shoulderMesh.position.y = 1.15;
    bottleGroup.add(shoulderMesh);

    // Bottle Neck
    const neckGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.3, 48);
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = 1.45;
    bottleGroup.add(neckMesh);

    // 2. Inner Concentrated Liquid Column
    const liquidGeo = new THREE.CylinderGeometry(0.57, 0.54, 1.85, 48);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: data.liquidColor || 0xf5c99e,
      emissive: data.emissiveColor || 0x331b0b,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.68,
      thickness: 1.2,
      ior: 1.4,
      transparent: true,
      opacity: 0.95
    });
    this.liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    this.liquidMesh.position.y = -0.05;
    bottleGroup.add(this.liquidMesh);

    // 3. Gold Metallic Collar / Knurled Ring
    const collarGroup = new THREE.Group();
    const collarGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 48);
    const goldMat = this.createGoldMaterial();
    const collarMesh = new THREE.Mesh(collarGeo, goldMat);
    collarMesh.position.y = 1.68;
    collarMesh.castShadow = true;
    collarGroup.add(collarMesh);

    // Subtle micro-ridge band on collar
    const ridgeGeo = new THREE.TorusGeometry(0.41, 0.02, 16, 48);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, goldMat);
    ridgeMesh.rotation.x = Math.PI / 2;
    ridgeMesh.position.y = 1.68;
    collarGroup.add(ridgeMesh);

    // 4. Soft Luxury Pipette Bulb
    const bulbGeo = new THREE.SphereGeometry(0.34, 32, 24);
    bulbGeo.scale(1, 1.4, 1);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.5,
      metalness: 0.1
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.y = 2.15;
    bulbMesh.castShadow = true;
    collarGroup.add(bulbMesh);

    // 5. Dropper Glass Pipette stem inside liquid
    const pipetteGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.9, 24);
    const pipetteMat = this.createGlassMaterial(0.02, 1.48, 0xffffff);
    this.pipetteMesh = new THREE.Mesh(pipetteGeo, pipetteMat);
    this.pipetteMesh.position.y = 0.6;
    collarGroup.add(this.pipetteMesh);

    // Pipette internal micro-liquid column
    const pipetteLiquidGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.4, 24);
    const pipetteLiquidMat = liquidMat.clone();
    pipetteLiquidMat.emissiveIntensity = 0.7;
    const pipetteLiquidMesh = new THREE.Mesh(pipetteLiquidGeo, pipetteLiquidMat);
    pipetteLiquidMesh.position.y = 0.4;
    collarGroup.add(pipetteLiquidMesh);

    this.capMesh = collarGroup;
    bottleGroup.add(collarGroup);

    // Luxury Label on Glass Surface
    this.addBottleLabel(bottleGroup, data.name, 'BIO-FERMENTED TRIPLE ACTIVE', 0, 0, 0.69);

    this.productGroup.add(bottleGroup);
  }

  // --- MODEL 2: NOCTURNE MARINE RESTORATIVE CRÈME (Luxury Glass Jar) ---
  buildLuxuryCreamJarModel(data) {
    const jarGroup = new THREE.Group();

    // 1. Heavy Midnight Obsidian Frosted Glass Jar
    const jarGeo = new THREE.CylinderGeometry(1.05, 0.98, 1.35, 48);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1428,
      roughness: 0.25,
      metalness: 0.15,
      transmission: 0.55,
      thickness: 1.8,
      ior: 1.5,
      transparent: true,
      opacity: 0.92,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15
    });
    this.bodyMesh = new THREE.Mesh(jarGeo, jarMat);
    this.bodyMesh.position.y = -0.2;
    this.bodyMesh.castShadow = true;
    jarGroup.add(this.bodyMesh);

    // Inner Velvet Cream Emulsion
    const creamGeo = new THREE.CylinderGeometry(0.92, 0.86, 0.95, 48);
    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      roughness: 0.4,
      metalness: 0.05
    });
    this.liquidMesh = new THREE.Mesh(creamGeo, creamMat);
    this.liquidMesh.position.y = -0.25;
    jarGroup.add(this.liquidMesh);

    // 2. Beveled Gold Screw Lid
    const lidGroup = new THREE.Group();
    const goldMat = this.createGoldMaterial();

    const lidGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.42, 48);
    const lidMesh = new THREE.Mesh(lidGeo, goldMat);
    lidMesh.position.y = 0.65;
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Engraved circular medallion on top of lid
    const emblemGeo = new THREE.TorusGeometry(0.65, 0.03, 16, 48);
    const emblemMesh = new THREE.Mesh(emblemGeo, goldMat);
    emblemMesh.rotation.x = Math.PI / 2;
    emblemMesh.position.y = 0.87;
    lidGroup.add(emblemMesh);

    const centerGemGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 32);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.2,
      metalness: 0.8
    });
    const gemMesh = new THREE.Mesh(centerGemGeo, gemMat);
    gemMesh.position.y = 0.88;
    lidGroup.add(gemMesh);

    this.capMesh = lidGroup;
    jarGroup.add(lidGroup);

    // Label on front
    this.addBottleLabel(jarGroup, data.name, 'CELLULAR LIPID RESTORATIVE', 0, -0.2, 1.06);

    this.productGroup.add(jarGroup);
  }

  // --- MODEL 3: FERMENTED ROSE GLACIER HYDRO-MIST (Fluted Spray Bottle) ---
  buildGlacierMistModel(data) {
    const mistGroup = new THREE.Group();

    // 1. Tall Elegant Fluted Glass Column
    const mistGeo = new THREE.CylinderGeometry(0.55, 0.52, 2.6, 48);
    const glassMat = this.createGlassMaterial(0.12, 1.5, 0xfff0f5);
    glassMat.transmission = 0.88;
    this.bodyMesh = new THREE.Mesh(mistGeo, glassMat);
    this.bodyMesh.position.y = 0;
    this.bodyMesh.castShadow = true;
    mistGroup.add(this.bodyMesh);

    // Rose Tinted Essence inside
    const fluidGeo = new THREE.CylinderGeometry(0.48, 0.45, 2.35, 48);
    const fluidMat = new THREE.MeshPhysicalMaterial({
      color: data.liquidColor || 0xffb7b2,
      emissive: 0x4a1525,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.85,
      ior: 1.34,
      transparent: true,
      opacity: 0.85
    });
    this.liquidMesh = new THREE.Mesh(fluidGeo, fluidMat);
    this.liquidMesh.position.y = -0.05;
    mistGroup.add(this.liquidMesh);

    // 2. Micro-mist Golden Atomizer Head
    const sprayGroup = new THREE.Group();
    const goldMat = this.createGoldMaterial();

    const collarGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 36);
    const collarMesh = new THREE.Mesh(collarGeo, goldMat);
    collarMesh.position.y = 1.45;
    sprayGroup.add(collarMesh);

    const pumpGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.45, 36);
    const pumpMesh = new THREE.Mesh(pumpGeo, goldMat);
    pumpMesh.position.y = 1.82;
    pumpMesh.castShadow = true;
    sprayGroup.add(pumpMesh);

    // Spray nozzle aperture
    const nozzleGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const nozzleMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const nozzleMesh = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzleMesh.position.set(0, 1.9, 0.27);
    sprayGroup.add(nozzleMesh);

    // Dipping Straw inside
    const strawGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.4, 16);
    const strawMat = this.createGlassMaterial(0.05, 1.45, 0xffffff);
    const strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.position.y = 0.2;
    sprayGroup.add(strawMesh);

    this.capMesh = sprayGroup;
    mistGroup.add(sprayGroup);

    this.addBottleLabel(mistGroup, data.name, 'GLACIAL FERMENT ESSENCE', 0, 0, 0.56);

    this.productGroup.add(mistGroup);
  }

  // --- MODEL 4: 24K SQUALANE RADIANT YOUTH NECTAR (Faceted Flacon with Gold Flakes) ---
  buildGoldNectarModel(data) {
    const nectarGroup = new THREE.Group();

    // 1. Faceted Hexagonal Luxury Crystal Flacon
    const flaconGeo = new THREE.CylinderGeometry(0.68, 0.65, 2.2, 6, 1);
    const glassMat = this.createGlassMaterial(0.04, 1.58, 0xffffff);
    glassMat.clearcoat = 1.0;
    glassMat.clearcoatRoughness = 0.05;
    this.bodyMesh = new THREE.Mesh(flaconGeo, glassMat);
    this.bodyMesh.position.y = 0;
    this.bodyMesh.castShadow = true;
    nectarGroup.add(this.bodyMesh);

    // Pure 24K Golden Squalane Liquid
    const liquidGeo = new THREE.CylinderGeometry(0.56, 0.53, 2.0, 6, 1);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcc419,
      emissive: 0x7c4a03,
      emissiveIntensity: 0.6,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.75,
      thickness: 1.5,
      ior: 1.45,
      transparent: true,
      opacity: 0.92
    });
    this.liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    this.liquidMesh.position.y = -0.05;
    nectarGroup.add(this.liquidMesh);

    // 2. Suspended 24K Pure Gold Leaf Particles inside liquid
    const flakeCount = 140;
    const flakesGroup = new THREE.Group();
    const flakeGeo = new THREE.BufferGeometry();
    const flakePositions = new Float32Array(flakeCount * 3);
    const flakeRotations = new Float32Array(flakeCount * 3);

    for (let i = 0; i < flakeCount; i++) {
      // Confine inside liquid volume
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.45;
      flakePositions[i * 3 + 0] = Math.cos(angle) * radius;
      flakePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      flakePositions[i * 3 + 2] = Math.sin(angle) * radius;

      flakeRotations[i * 3 + 0] = Math.random() * Math.PI;
      flakeRotations[i * 3 + 1] = Math.random() * Math.PI;
      flakeRotations[i * 3 + 2] = Math.random() * Math.PI;
    }

    // Instanced or discrete meshes for 3D gold leaves
    const goldMat = this.createGoldMaterial();
    goldMat.roughness = 0.2;
    goldMat.metalness = 0.95;

    const singleFlakeGeo = new THREE.PlaneGeometry(0.045, 0.035);
    const instancedFlakes = new THREE.InstancedMesh(singleFlakeGeo, goldMat, flakeCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < flakeCount; i++) {
      dummy.position.set(flakePositions[i * 3], flakePositions[i * 3 + 1], flakePositions[i * 3 + 2]);
      dummy.rotation.set(flakeRotations[i * 3], flakeRotations[i * 3 + 1], flakeRotations[i * 3 + 2]);
      dummy.scale.setScalar(Math.random() * 0.8 + 0.6);
      dummy.updateMatrix();
      instancedFlakes.setMatrixAt(i, dummy.matrix);
    }
    instancedFlakes.instanceMatrix.needsUpdate = true;
    flakesGroup.add(instancedFlakes);
    this.goldFlakesGroup = { mesh: instancedFlakes, count: flakeCount, dummy, positions: flakePositions };
    nectarGroup.add(flakesGroup);

    // 3. Faceted Gold Hexagonal Crown Cap
    const capGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.65, 6, 1);
    const capMesh = new THREE.Mesh(capGeo, goldMat);
    capMesh.position.y = 1.48;
    capMesh.castShadow = true;
    capGroup.add(capMesh);

    // Top crest ring
    const crestGeo = new THREE.TorusGeometry(0.24, 0.04, 16, 24);
    const crestMesh = new THREE.Mesh(crestGeo, goldMat);
    crestMesh.rotation.x = Math.PI / 2;
    crestMesh.position.y = 1.82;
    capGroup.add(crestMesh);

    this.capMesh = capGroup;
    nectarGroup.add(capGroup);

    this.addBottleLabel(nectarGroup, data.name, '24K BIO-ACTIVE CELLULAR SQUALANE', 0, 0, 0.69);

    this.productGroup.add(nectarGroup);
  }

  // --- MATERIAL HELPERS ---
  createGlassMaterial(roughness = 0.05, ior = 1.52, color = 0xffffff) {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: roughness,
      metalness: 0.02,
      transmission: 0.94, // Real light transmission
      thickness: 1.4,     // Refraction thickness
      ior: ior,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
  }

  createGoldMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0xdeb86a,
      roughness: 0.22,
      metalness: 0.92,
      envMapIntensity: 1.8
    });
  }

  // Creates a crisp typographic luxury label mapped directly to the 3D surface
  addBottleLabel(parentGroup, title, subtitle, x, y, zOffset) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    // Subtle frosted label background
    ctx.fillStyle = 'rgba(12, 14, 20, 0.72)';
    ctx.roundRect(20, 20, 472, 300, 16);
    ctx.fill();

    // Metallic gold border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top crest
    ctx.fillStyle = '#d4af37';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('ÆTHÆRA CELLULAR', 256, 75);

    // Monogram icon
    ctx.font = '300 24px "Playfair Display", serif';
    ctx.fillText('◇  LABORATOIRE  ◇', 256, 115);

    // Product Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    const splitTitle = title.length > 24 ? title.substring(0, 24) + '...' : title;
    ctx.fillText(splitTitle.toUpperCase(), 256, 175);

    // Scientific Subtitle
    ctx.fillStyle = '#c5a059';
    ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(subtitle, 256, 215);

    // Vol & Origin footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 12px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('GENÈVE · SWISS BIO-RENEWAL · 30ML', 256, 275);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;

    const labelGeo = new THREE.PlaneGeometry(0.88, 0.6);
    const labelMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(x, y, zOffset);
    parentGroup.add(labelMesh);
  }

  // --- 3D INTERACTIVE HOTSPOTS ---
  buildHotspots(data) {
    const points = [
      {
        id: 'dispenser',
        pos: new THREE.Vector3(0, 1.6, 0.4),
        title: 'Micro-Precision Dosing',
        text: 'Engineered pharmaceutical-grade pipette dispenses exactly 0.15ml of bioactive concentrate per compression.'
      },
      {
        id: 'actives',
        pos: new THREE.Vector3(0.5, 0.2, 0.35),
        title: data.actives ? data.actives[0].name : 'Cellular Actives',
        text: data.actives ? data.actives[0].desc : 'Multi-molecular target complex.'
      },
      {
        id: 'glass',
        pos: new THREE.Vector3(-0.45, -0.6, 0.4),
        title: 'Miron Violet Ultra-Glass',
        text: 'Protects fragile bio-enzymatic cellular peptides from photo-oxidation and thermal breakdown.'
      }
    ];

    points.forEach(pt => {
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pt.pos);
      pinGroup.userData = pt;

      // Outer pulsing ring
      const ringGeo = new THREE.RingGeometry(0.04, 0.065, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ringMesh);

      // Inner glowing core dot
      const dotGeo = new THREE.CircleGeometry(0.026, 24);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      pinGroup.add(dotMesh);

      this.hotspotsGroup.add(pinGroup);
    });
  }

  // -------------------------------------------------------------
  // INTERACTIVE MODES (X-RAY, DISPENSE, EXPLODED)
  // -------------------------------------------------------------

  toggleXRayMode() {
    this.isXRay = !this.isXRay;
    if (this.sound) this.sound.playChime(this.isXRay ? 1100 : 550, 0.15);

    if (this.bodyMesh && this.bodyMesh.material) {
      if (this.isXRay) {
        // Holographic wireframe bioluminescence
        this.bodyMesh.material.wireframe = true;
        this.bodyMesh.material.color.setHex(0x38d9a9);
        this.bodyMesh.material.emissive = new THREE.Color(0x0a3b2c);
        this.bodyMesh.material.emissiveIntensity = 0.8;
      } else {
        this.bodyMesh.material.wireframe = false;
        this.bodyMesh.material.color.setHex(0xffffff);
        this.bodyMesh.material.emissive = new THREE.Color(0x000000);
        this.bodyMesh.material.emissiveIntensity = 0;
      }
    }

    if (this.liquidMesh && this.liquidMesh.material) {
      this.liquidMesh.material.emissiveIntensity = this.isXRay ? 1.5 : 0.45;
    }

    return this.isXRay;
  }

  toggleExplodedView() {
    this.isExploded = !this.isExploded;
    if (this.sound) this.sound.playChime(720, 0.15);

    const targetCapY = this.isExploded ? 0.85 : 0;
    const targetPipetteY = this.isExploded ? 1.1 : 0;

    let p = 0;
    const animateExplode = () => {
      p += 0.08;
      if (this.capMesh) {
        this.capMesh.position.y += (targetCapY - this.capMesh.position.y) * 0.15;
      }
      if (this.pipetteMesh) {
        this.pipetteMesh.position.y += (targetPipetteY - this.pipetteMesh.position.y) * 0.15;
      }
      if (p < 1) requestAnimationFrame(animateExplode);
    };
    animateExplode();

    return this.isExploded;
  }

  dispenseDose() {
    if (this.isDispensing) return;
    this.isDispensing = true;

    if (this.sound) {
      this.sound.playDropAcoustic();
    }

    // Spawn falling glowing droplet with organic teardrop geometry
    const dropGeo = new THREE.ConeGeometry(0.07, 0.16, 24);
    dropGeo.rotateX(Math.PI);
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: this.currentProduct ? this.currentProduct.liquidColor : 0xf5c99e,
      emissive: 0xdeb86a,
      emissiveIntensity: 0.9,
      roughness: 0.05,
      transmission: 0.85,
      ior: 1.45,
      transparent: true,
      opacity: 0.95
    });
    const droplet = new THREE.Mesh(dropGeo, dropMat);
    droplet.position.set(0, 1.6, 0);
    this.dropletGroup.add(droplet);

    let progress = 0;
    const animateDrop = () => {
      progress += 0.025;
      droplet.position.y = 1.6 - (progress * 2.8);
      droplet.scale.set(
        1 + Math.sin(progress * Math.PI) * 0.3,
        1 + progress * 0.4,
        1 + Math.sin(progress * Math.PI) * 0.3
      );

      if (progress < 1.0) {
        requestAnimationFrame(animateDrop);
      } else {
        // Droplet impact ripple on bottom pedestal
        this.createDropRipple(droplet.position.x, -1.18, droplet.position.z);
        this.dropletGroup.remove(droplet);
        this.isDispensing = false;
        if (this.callbacks.onDispenseComplete) {
          this.callbacks.onDispenseComplete();
        }
      }
    };
    animateDrop();
  }

  createDropRipple(x, y, z) {
    const rippleGeo = new THREE.RingGeometry(0.02, 0.05, 32);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.set(x, y, z);
    this.scene.add(ripple);

    let scale = 1;
    let opacity = 0.9;
    const animateRipple = () => {
      scale += 0.35;
      opacity -= 0.035;
      ripple.scale.set(scale, scale, scale);
      rippleMat.opacity = Math.max(0, opacity);
      if (opacity > 0) {
        requestAnimationFrame(animateRipple);
      } else {
        this.scene.remove(ripple);
        rippleGeo.dispose();
        rippleMat.dispose();
      }
    };
    animateRipple();
  }

  resetRotation() {
    this.targetRotation.x = 0.1;
    this.targetRotation.y = 0.4;
    this.isAutoRotating = true;
    if (this.sound) this.sound.playChime(580, 0.1);
  }

  // -------------------------------------------------------------
  // USER INPUT & INTERACTION
  // -------------------------------------------------------------

  setupEvents() {
    const el = this.renderer.domElement;

    // Pointer events for orbit drag
    el.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.isAutoRotating = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      // Parallax mouse position
      const rect = el.getBoundingClientRect();
      this.mouseNormalized.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseNormalized.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetRotation.y += deltaX * 0.008;
        this.targetRotation.x += deltaY * 0.006;
        // Clamp vertical tilt
        this.targetRotation.x = Math.max(-0.6, Math.min(0.6, this.targetRotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Check hotspot hover
      this.checkHotspotHover(e);
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    el.addEventListener('click', (e) => {
      this.checkHotspotClick(e);
    });

    // Resize handling
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });
  }

  checkHotspotHover(e) {
    if (!this.hotspotsVisible) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.hotspotsGroup.children, true);

    if (intersects.length > 0) {
      document.body.style.cursor = 'pointer';
    } else if (!this.isDragging) {
      document.body.style.cursor = 'default';
    }
  }

  checkHotspotClick(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.hotspotsGroup.children, true);

    if (intersects.length > 0) {
      let topObj = intersects[0].object;
      while (topObj.parent && !topObj.userData.title) {
        topObj = topObj.parent;
      }
      if (topObj.userData && topObj.userData.title && this.callbacks.onHotspotClick) {
        if (this.sound) this.sound.playChime(960, 0.15);
        this.callbacks.onHotspotClick(topObj.userData);
      }
    }
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // -------------------------------------------------------------
  // ANIMATION / RENDER LOOP
  // -------------------------------------------------------------

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth rotation lerping
    if (this.isAutoRotating && !this.isDragging) {
      this.targetRotation.y += delta * 0.35;
    }

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

    if (this.productGroup) {
      this.productGroup.rotation.x = this.currentRotation.x;
      this.productGroup.rotation.y = this.currentRotation.y;
      // Gentle floating levitation effect
      this.productGroup.position.y = -0.1 + Math.sin(time * 1.5) * 0.04;
    }

    // Billboarding Hotspots so they always face the camera
    if (this.hotspotsGroup) {
      this.hotspotsGroup.children.forEach(h => {
        h.quaternion.copy(this.camera.quaternion);
        // Pulse ring scale
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.12;
        h.children[0].scale.set(pulse, pulse, pulse);
      });
      this.hotspotsGroup.rotation.x = this.currentRotation.x;
      this.hotspotsGroup.rotation.y = this.currentRotation.y;
      this.hotspotsGroup.position.y = this.productGroup ? this.productGroup.position.y : 0;
    }

    // Animate 24K Suspended Gold Leaf Flakes
    if (this.goldFlakesGroup) {
      const { mesh, count, dummy, positions } = this.goldFlakesGroup;
      for (let i = 0; i < count; i++) {
        const yOffset = Math.sin(time * 0.8 + i) * 0.06;
        dummy.position.set(positions[i * 3], positions[i * 3 + 1] + yOffset, positions[i * 3 + 2]);
        dummy.rotation.x += 0.005;
        dummy.rotation.y += 0.008;
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // Subtle drift of ambient bioluminescent spores
    if (this.particlesGroup) {
      this.particlesGroup.rotation.y = time * 0.03;
      this.particlesGroup.rotation.x = Math.sin(time * 0.02) * 0.05;
    }

    // Camera mouse parallax tracking
    this.camera.position.x += ((this.mouseNormalized.x * 0.35) - this.camera.position.x) * 0.05;
    this.camera.position.y += ((0.8 + this.mouseNormalized.y * 0.25) - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0.1, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
