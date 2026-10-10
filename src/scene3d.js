import * as THREE from 'three';

/**
 * Three.js 3D Scientific Viewport Engine for DERM-X
 * Features:
 * - High-accuracy 3D models for REAL market formulations:
 *   1. Minimalist Niacinamide 10% + Zinc 1% (Amber apothecary dropper)
 *   2. The Derma Co 1% Hyaluronic Sunscreen Aqua Gel (Cobalt pump tube)
 *   3. The Ordinary AHA 30% + BHA 2% Peeling Solution (Blood-ruby frosted dropper)
 *   4. Paula's Choice 2% BHA Liquid Exfoliant (Matte slate flacon)
 *   5. The Derma Co 2% Kojic Acid Cream (Clinical pump dispenser)
 *   6. CeraVe Moisturizing Cream (Iconic blue & white tub)
 * - Unique Advanced Animations:
 *   ✦ 3D UV Photon Deflection Shield (Animated photons bouncing off barrier dome)
 *   ✦ 3D Chemical Ball-and-Stick Molecular Structure Mode
 *   ✦ Laser Holographic Scanner (Volumetric vertical laser sweep)
 *   ✦ Atomic Deconstruction (Exploding components with chemical ion clouds)
 *   ✦ Pore Sebum Dissolve Particle Vortex
 *   ✦ Micro-Dose Droplet Fluid Dynamics
 */
export class Scene3D {
  constructor(canvasContainer, soundEngine) {
    this.container = canvasContainer;
    this.sound = soundEngine;
    this.width = this.container.clientWidth || 700;
    this.height = this.container.clientHeight || 580;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Groups
    this.mainGroup = null;
    this.productGroup = null;
    this.moleculeGroup = null;
    this.uvShieldGroup = null;
    this.laserScannerGroup = null;
    this.particlesGroup = null;
    this.dropletGroup = null;
    this.hotspotsGroup = null;

    // State
    this.currentProduct = null;
    this.currentMoleculeData = null;
    this.viewMode = 'product'; // 'product' | 'molecule'
    this.isAutoRotating = true;
    this.isExploded = false;
    this.isLaserScanning = false;
    this.isUvShieldActive = false;
    this.isDispensing = false;

    // Interaction / Drag
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.1, y: 0.35 };
    this.currentRotation = { x: 0.1, y: 0.35 };
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
    this.scene.fog = new THREE.FogExp2(0x07080c, 0.035);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.7, 5.2);
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
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Procedural Studio Softbox Environment Map
    this.generateProceduralEnvMap();

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Base Groups
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    this.productGroup = new THREE.Group();
    this.mainGroup.add(this.productGroup);

    this.moleculeGroup = new THREE.Group();
    this.moleculeGroup.visible = false;
    this.mainGroup.add(this.moleculeGroup);

    this.uvShieldGroup = new THREE.Group();
    this.mainGroup.add(this.uvShieldGroup);

    this.laserScannerGroup = new THREE.Group();
    this.mainGroup.add(this.laserScannerGroup);

    this.dropletGroup = new THREE.Group();
    this.mainGroup.add(this.dropletGroup);

    this.hotspotsGroup = new THREE.Group();
    this.mainGroup.add(this.hotspotsGroup);

    // 7. Ambient Bioluminescent Cellular Spores & Ground Pedestal
    this.createAmbientSpores();
    this.createShadowPlane();
    this.setupUvShield();
    this.setupLaserScanner();

    // 8. Event Listeners
    this.setupEvents();

    // 9. Start Render Loop
    this.animate();
  }

  generateProceduralEnvMap() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
    bgGrad.addColorStop(0, '#10141e');
    bgGrad.addColorStop(0.5, '#07090e');
    bgGrad.addColorStop(1, '#030406');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Softbox 1: Overhead key
    const rad1 = ctx.createRadialGradient(size * 0.5, size * 0.25, 10, size * 0.5, size * 0.25, size * 0.35);
    rad1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    rad1.addColorStop(0.5, 'rgba(210, 230, 255, 0.3)');
    rad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, size, size);

    // Softbox 2: Emerald/cyan rim
    const rad2 = ctx.createRadialGradient(size * 0.85, size * 0.6, 5, size * 0.85, size * 0.6, size * 0.25);
    rad2.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
    rad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad2;
    ctx.fillRect(0, 0, size, size);

    // Softbox 3: Gold/warm rim
    const rad3 = ctx.createRadialGradient(size * 0.15, size * 0.7, 5, size * 0.15, size * 0.7, size * 0.25);
    rad3.addColorStop(0, 'rgba(245, 215, 127, 0.6)');
    rad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad3;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = texture;
  }

  setupLighting() {
    this.lights = {};
    this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(this.lights.ambient);

    this.lights.key = new THREE.DirectionalLight(0xffffff, 3.2);
    this.lights.key.position.set(3.5, 4.5, 3.5);
    this.scene.add(this.lights.key);

    this.lights.rim = new THREE.DirectionalLight(0x38bdf8, 2.0);
    this.lights.rim.position.set(-3.5, 2.5, -3);
    this.scene.add(this.lights.rim);

    this.lights.warmRim = new THREE.DirectionalLight(0xfcd34d, 1.8);
    this.lights.warmRim.position.set(3.5, -1, -2.5);
    this.scene.add(this.lights.warmRim);

    this.lights.underGlow = new THREE.PointLight(0x22c55e, 1.8, 5);
    this.lights.underGlow.position.set(0, -0.6, 0.5);
    this.scene.add(this.lights.underGlow);
  }

  createShadowPlane() {
    const shadowGeo = new THREE.CircleGeometry(2.4, 64);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(canvas);

    const planeMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const plane = new THREE.Mesh(shadowGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.2;
    this.scene.add(plane);

    // Glowing concentric tech pedestal rings
    const ringGeo = new THREE.RingGeometry(0.85, 1.35, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.19;
    this.scene.add(ring);
  }

  createAmbientSpores() {
    const count = 240;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
    grad.addColorStop(0.8, 'rgba(56, 189, 248, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: pTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particlesGroup = new THREE.Points(geometry, material);
    this.scene.add(this.particlesGroup);
  }

  // -------------------------------------------------------------
  // ADVANCED ANIMATION 1: UV PHOTON DEFLECTION SHIELD (Sunscreen)
  // -------------------------------------------------------------
  setupUvShield() {
    // Geodesic forcefield dome
    const domeGeo = new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5
    });
    this.uvDomeMesh = new THREE.Mesh(domeGeo, domeMat);
    this.uvDomeMesh.position.y = -0.5;
    this.uvShieldGroup.add(this.uvDomeMesh);

    // 40 UV incoming photon beams
    const rayCount = 36;
    this.uvRays = [];
    const rayGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0
    });

    for (let i = 0; i < rayCount; i++) {
      const ray = new THREE.Mesh(rayGeo, rayMat);
      const angle = (i / rayCount) * Math.PI * 2;
      const dist = 3.2;
      ray.position.set(Math.cos(angle) * dist, 1.8 + (Math.random() - 0.5) * 1.5, Math.sin(angle) * dist);
      ray.lookAt(0, 0, 0);
      ray.userData = { initialPos: ray.position.clone(), speed: 0.04 + Math.random() * 0.03 };
      this.uvShieldGroup.add(ray);
      this.uvRays.push(ray);
    }
  }

  toggleUvShield() {
    this.isUvShieldActive = !this.isUvShieldActive;
    if (this.sound) this.sound.playChime(this.isUvShieldActive ? 1200 : 600, 0.15);

    let progress = this.isUvShieldActive ? 0 : 1;
    const target = this.isUvShieldActive ? 0.35 : 0;
    const rayTarget = this.isUvShieldActive ? 0.85 : 0;

    const animateFade = () => {
      if (this.isUvShieldActive) {
        progress += 0.04;
        if (progress > 1) progress = 1;
      } else {
        progress -= 0.04;
        if (progress < 0) progress = 0;
      }

      this.uvDomeMesh.material.opacity = progress * target;
      this.uvRays.forEach(r => r.material.opacity = progress * rayTarget);

      if ((this.isUvShieldActive && progress < 1) || (!this.isUvShieldActive && progress > 0)) {
        requestAnimationFrame(animateFade);
      }
    };
    animateFade();

    return this.isUvShieldActive;
  }

  // -------------------------------------------------------------
  // ADVANCED ANIMATION 2: HOLOGRAPHIC LASER CHEMICAL SCANNER
  // -------------------------------------------------------------
  setupLaserScanner() {
    // Volumetric green laser ring
    const ringGeo = new THREE.RingGeometry(0.85, 0.95, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.laserRing = new THREE.Mesh(ringGeo, ringMat);
    this.laserRing.rotation.x = -Math.PI / 2;
    this.laserScannerGroup.add(this.laserRing);

    // Glowing laser disc
    const discGeo = new THREE.CircleGeometry(0.85, 32);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.laserDisc = new THREE.Mesh(discGeo, discMat);
    this.laserDisc.rotation.x = -Math.PI / 2;
    this.laserScannerGroup.add(this.laserDisc);
  }

  toggleLaserScanner() {
    this.isLaserScanning = !this.isLaserScanning;
    if (this.sound) this.sound.playChime(this.isLaserScanning ? 1400 : 400, 0.15);

    if (this.isLaserScanning) {
      this.laserRing.material.opacity = 0.9;
      this.laserDisc.material.opacity = 0.25;
    } else {
      this.laserRing.material.opacity = 0;
      this.laserDisc.material.opacity = 0;
    }

    return this.isLaserScanning;
  }

  // -------------------------------------------------------------
  // ADVANCED ANIMATION 3: 3D MOLECULAR CHEMICAL STRUCTURE VIEWER
  // -------------------------------------------------------------
  loadMolecule(moleculeData) {
    this.currentMoleculeData = moleculeData;
    this.viewMode = 'molecule';

    this.productGroup.visible = false;
    this.moleculeGroup.visible = true;

    // Clear existing molecule
    while (this.moleculeGroup.children.length > 0) {
      const obj = this.moleculeGroup.children[0];
      this.moleculeGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    if (this.sound) this.sound.playSwell();

    // Build 3D ball-and-stick chemical model
    const atomMeshes = [];

    moleculeData.atoms.forEach(atom => {
      const sphereGeo = new THREE.SphereGeometry(atom.radius * 1.3, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: atom.color,
        roughness: 0.25,
        metalness: 0.3,
        emissive: atom.color,
        emissiveIntensity: 0.2
      });
      const atomMesh = new THREE.Mesh(sphereGeo, sphereMat);
      atomMesh.position.set(atom.x * 0.9, atom.y * 0.9, atom.z * 0.9);
      atomMesh.userData = atom;
      this.moleculeGroup.add(atomMesh);
      atomMeshes.push(atomMesh);
    });

    // Create covalent bonds (cylinders connecting atoms)
    moleculeData.bonds.forEach(([idxA, idxB]) => {
      const posA = atomMeshes[idxA].position;
      const posB = atomMeshes[idxB].position;

      const distance = posA.distanceTo(posB);
      const bondGeo = new THREE.CylinderGeometry(0.045, 0.045, distance, 12);
      const bondMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.4,
        metalness: 0.2
      });
      const bondMesh = new THREE.Mesh(bondGeo, bondMat);

      // Position and orient cylinder between the two atoms
      bondMesh.position.copy(posA).add(posB).multiplyScalar(0.5);
      bondMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        posB.clone().sub(posA).normalize()
      );

      this.moleculeGroup.add(bondMesh);
    });

    // Intro scale
    this.moleculeGroup.scale.set(0.01, 0.01, 0.01);
    let s = 0.01;
    const animateIn = () => {
      s += (1.0 - s) * 0.12;
      this.moleculeGroup.scale.set(s, s, s);
      if (s < 0.99) requestAnimationFrame(animateIn);
    };
    animateIn();
  }

  showProductView() {
    this.viewMode = 'product';
    this.moleculeGroup.visible = false;
    this.productGroup.visible = true;
    if (this.sound) this.sound.playChime(880, 0.12);
  }

  // -------------------------------------------------------------
  // REAL MARKET PRODUCT 3D MODELS BUILDER
  // -------------------------------------------------------------
  loadProduct(productData) {
    this.currentProduct = productData;
    this.viewMode = 'product';
    this.moleculeGroup.visible = false;
    this.productGroup.visible = true;

    this.clearCurrentProduct();

    if (this.sound) {
      this.sound.playChime(productData.modelType.includes('cream') ? 520 : 880, 0.15);
    }

    if (productData.id === 'minimalist-niacinamide-10') {
      this.buildMinimalistBottle(productData);
    } else if (productData.id === 'derma-co-hyaluronic-sunscreen') {
      this.buildDermaCoSunscreenTube(productData);
    } else if (productData.id === 'the-ordinary-aha-bha-peeling') {
      this.buildTheOrdinaryPeelingBottle(productData);
    } else if (productData.id === 'paulas-choice-2-bha-liquid') {
      this.buildPaulasChoiceBottle(productData);
    } else if (productData.id === 'derma-co-2-kojic-acid-cream') {
      this.buildDermaCoKojicCream(productData);
    } else if (productData.id === 'cerave-moisturizing-cream') {
      this.buildCeraVeTub(productData);
    } else {
      this.buildMinimalistBottle(productData);
    }

    // Add interactive 3D Hotspot Pins
    this.buildHotspots(productData);

    // Initial positioning & intro scale animation
    this.productGroup.scale.set(0.01, 0.01, 0.01);
    this.productGroup.position.set(0, -0.1, 0);

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
    this.pipetteMesh = null;
    this.capMesh = null;
    this.bodyMesh = null;
    this.liquidMesh = null;
  }

  // --- MODEL 1: MINIMALIST NIACINAMIDE 10% (Amber Apothecary Flacon) ---
  buildMinimalistBottle(data) {
    const group = new THREE.Group();

    // 1. Amber Glass Bottle Body
    const glassGeo = new THREE.CylinderGeometry(0.66, 0.64, 1.9, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c2d12, // Rich dark apothecary amber
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.85,
      thickness: 1.4,
      ior: 1.52,
      transparent: true,
      opacity: 0.96
    });
    this.bodyMesh = new THREE.Mesh(glassGeo, glassMat);
    this.bodyMesh.castShadow = true;
    group.add(this.bodyMesh);

    // Shoulder & Neck
    const shoulderGeo = new THREE.CylinderGeometry(0.38, 0.66, 0.32, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMat);
    shoulderMesh.position.y = 1.1;
    group.add(shoulderMesh);

    const neckGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.28, 48);
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = 1.38;
    group.add(neckMesh);

    // 2. Liquid inside
    const liquidGeo = new THREE.CylinderGeometry(0.55, 0.53, 1.75, 48);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      transmission: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    this.liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    this.liquidMesh.position.y = -0.05;
    group.add(this.liquidMesh);

    // 3. Black Ribbed Minimalist Dropper Collar & Bulb
    const collarGroup = new THREE.Group();
    const collarGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.45, 48);
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const collarMesh = new THREE.Mesh(collarGeo, blackMat);
    collarMesh.position.y = 1.65;
    collarGroup.add(collarMesh);

    const bulbGeo = new THREE.SphereGeometry(0.32, 32, 24);
    bulbGeo.scale(1, 1.35, 1);
    const bulbMesh = new THREE.Mesh(bulbGeo, blackMat);
    bulbMesh.position.y = 2.1;
    collarGroup.add(bulbMesh);

    // Pipette
    const pipGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.9, 24);
    const pipMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.05 });
    this.pipetteMesh = new THREE.Mesh(pipGeo, pipMat);
    this.pipetteMesh.position.y = 0.6;
    collarGroup.add(this.pipetteMesh);

    this.capMesh = collarGroup;
    group.add(collarGroup);

    // Minimalist Clean Typographic Label
    this.addRealProductLabel(group, 'Minimalist', 'Niacinamide 10% + Zinc 1%', 'Aloe Base · pH 5.5 - 6.0', 0, 0, 0.67);

    this.productGroup.add(group);
  }

  // --- MODEL 2: THE DERMA CO 1% HYALURONIC SUNSCREEN (Cobalt Pump Tube) ---
  buildDermaCoSunscreenTube(data) {
    const group = new THREE.Group();

    // 1. Sleek Cobalt Blue Cylindrical Tube
    const tubeGeo = new THREE.CylinderGeometry(0.68, 0.62, 2.5, 48);
    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Iconic vibrant Derma Co blue
      roughness: 0.28,
      metalness: 0.15
    });
    this.bodyMesh = new THREE.Mesh(tubeGeo, blueMat);
    this.bodyMesh.position.y = 0.1;
    this.bodyMesh.castShadow = true;
    group.add(this.bodyMesh);

    // 2. White Pump Dispenser & Clear Cap
    const pumpGroup = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const neckGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 48);
    const neckMesh = new THREE.Mesh(neckGeo, whiteMat);
    neckMesh.position.y = 1.5;
    pumpGroup.add(neckMesh);

    const nozzleGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 32);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, whiteMat);
    nozzleMesh.position.y = 1.82;
    pumpGroup.add(nozzleMesh);

    // Translucent Blue Cap
    const capGeo = new THREE.CylinderGeometry(0.69, 0.69, 1.1, 48);
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 1.95;
    pumpGroup.add(capMesh);

    this.capMesh = pumpGroup;
    group.add(pumpGroup);

    // Derma Co Typography Label
    this.addRealProductLabel(group, 'The Derma Co.', '1% Hyaluronic Sunscreen Aqua Gel', 'SPF 50 PA++++ · Blue Light Shield', 0, 0.1, 0.69);

    this.productGroup.add(group);
  }

  // --- MODEL 3: THE ORDINARY AHA 30% + BHA 2% (Frosted Blood-Ruby Dropper) ---
  buildTheOrdinaryPeelingBottle(data) {
    const group = new THREE.Group();

    // 1. Frosted White Glass Flacon
    const glassGeo = new THREE.CylinderGeometry(0.65, 0.63, 1.85, 48);
    const frostMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.82,
      roughness: 0.32, // Distinctive frosted finish
      thickness: 1.5,
      ior: 1.48,
      transparent: true,
      opacity: 0.95
    });
    this.bodyMesh = new THREE.Mesh(glassGeo, frostMat);
    group.add(this.bodyMesh);

    // Shoulder & Neck
    const shoulderGeo = new THREE.CylinderGeometry(0.38, 0.65, 0.3, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, frostMat);
    shoulderMesh.position.y = 1.05;
    group.add(shoulderMesh);

    // 2. Vivid Blood-Ruby Red Acid Fluid Core!
    const liquidGeo = new THREE.CylinderGeometry(0.55, 0.52, 1.7, 48);
    const acidMat = new THREE.MeshPhysicalMaterial({
      color: 0x881337, // Iconic Tasmanian pepperberry crimson
      emissive: 0x4c0519,
      emissiveIntensity: 0.6,
      transmission: 0.65,
      roughness: 0.12,
      transparent: true,
      opacity: 0.98
    });
    this.liquidMesh = new THREE.Mesh(liquidGeo, acidMat);
    this.liquidMesh.position.y = -0.05;
    group.add(this.liquidMesh);

    // 3. Iconic White The Ordinary Dropper
    const collarGroup = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const collarGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.45, 48);
    const collarMesh = new THREE.Mesh(collarGeo, whiteMat);
    collarMesh.position.y = 1.58;
    collarGroup.add(collarMesh);

    const bulbGeo = new THREE.SphereGeometry(0.32, 32, 24);
    bulbGeo.scale(1, 1.35, 1);
    const bulbMesh = new THREE.Mesh(bulbGeo, whiteMat);
    bulbMesh.position.y = 2.05;
    collarGroup.add(bulbMesh);

    // Pipette with red tip
    const pipGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.85, 24);
    const pipMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.05 });
    this.pipetteMesh = new THREE.Mesh(pipGeo, pipMat);
    this.pipetteMesh.position.y = 0.55;
    collarGroup.add(this.pipetteMesh);

    this.capMesh = collarGroup;
    group.add(collarGroup);

    // Signature The Ordinary Bordered Label
    this.addRealProductLabel(group, 'The Ordinary.', 'AHA 30% + BHA 2% Peeling Solution', '10-Minute Exfoliating Facial · pH ~3.6', 0, 0, 0.66);

    this.productGroup.add(group);
  }

  // --- MODEL 4: PAULA'S CHOICE 2% BHA (Matte Slate Grey Flacon) ---
  buildPaulasChoiceBottle(data) {
    const group = new THREE.Group();

    // Matte Slate Grey Bottle Body
    const bottleGeo = new THREE.CylinderGeometry(0.68, 0.65, 2.4, 48);
    const greyMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Iconic Paula's Choice dark slate
      roughness: 0.42,
      metalness: 0.1
    });
    this.bodyMesh = new THREE.Mesh(bottleGeo, greyMat);
    this.bodyMesh.position.y = 0.1;
    group.add(this.bodyMesh);

    // Silver Accent Neck Ring
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 });
    const ringGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 48);
    const ringMesh = new THREE.Mesh(ringGeo, silverMat);
    ringMesh.position.y = 1.35;
    group.add(ringMesh);

    // Screw Cap
    const capGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.6, 48);
    const capMesh = new THREE.Mesh(capGeo, greyMat);
    capMesh.position.y = 1.7;
    capGroup.add(capMesh);

    this.capMesh = capGroup;
    group.add(capGroup);

    this.addRealProductLabel(group, "PAULA'S CHOICE", 'SKIN PERFECTING 2% BHA LIQUID', 'Salicylic Acid · All Skin Types', 0, 0.1, 0.69);

    this.productGroup.add(group);
  }

  // --- MODEL 5: THE DERMA CO 2% KOJIC ACID CREAM (Clinical Pump) ---
  buildDermaCoKojicCream(data) {
    const group = new THREE.Group();

    // Crisp White Clinical Pump Container
    const bottleGeo = new THREE.CylinderGeometry(0.65, 0.62, 2.2, 48);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    this.bodyMesh = new THREE.Mesh(bottleGeo, whiteMat);
    this.bodyMesh.position.y = 0;
    group.add(this.bodyMesh);

    // Golden-Yellow Accent Band
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
    const bandGeo = new THREE.CylinderGeometry(0.655, 0.655, 0.2, 48);
    const bandMesh = new THREE.Mesh(bandGeo, yellowMat);
    bandMesh.position.y = 1.0;
    group.add(bandMesh);

    // Pump Dispenser Top
    const capGroup = new THREE.Group();
    const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
    const pumpMesh = new THREE.Mesh(pumpGeo, whiteMat);
    pumpMesh.position.y = 1.4;
    capGroup.add(pumpMesh);

    const headGeo = new THREE.BoxGeometry(0.35, 0.2, 0.6);
    const headMesh = new THREE.Mesh(headGeo, whiteMat);
    headMesh.position.set(0, 1.7, 0.1);
    capGroup.add(headMesh);

    this.capMesh = capGroup;
    group.add(capGroup);

    this.addRealProductLabel(group, 'The Derma Co.', '2% Kojic Acid Face Cream', '1% Alpha Arbutin · Melasma & PIH', 0, 0, 0.66);

    this.productGroup.add(group);
  }

  // --- MODEL 6: CERAVE MOISTURIZING CREAM (Iconic Blue/White Tub) ---
  buildCeraVeTub(data) {
    const group = new THREE.Group();

    // 1. Broad White Tub Base
    const tubGeo = new THREE.CylinderGeometry(1.05, 0.96, 1.4, 48);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    this.bodyMesh = new THREE.Mesh(tubGeo, whiteMat);
    this.bodyMesh.position.y = -0.2;
    group.add(this.bodyMesh);

    // Inner Cream Formulation
    const creamGeo = new THREE.CylinderGeometry(0.95, 0.88, 1.0, 48);
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    this.liquidMesh = new THREE.Mesh(creamGeo, creamMat);
    this.liquidMesh.position.y = -0.25;
    group.add(this.liquidMesh);

    // 2. Iconic CeraVe Blue Screw Cap with Grooved Rim
    const capGroup = new THREE.Group();
    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Iconic CeraVe royal blue
      roughness: 0.35
    });
    const capGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.4, 48);
    const capMesh = new THREE.Mesh(capGeo, blueMat);
    capMesh.position.y = 0.65;
    capGroup.add(capMesh);

    this.capMesh = capGroup;
    group.add(capGroup);

    this.addRealProductLabel(group, 'CeraVe', 'Moisturizing Cream', '3 Essential Ceramides · MVE Delivery', 0, -0.2, 1.06);

    this.productGroup.add(group);
  }

  // --- HIGH ACCURACY BRAND LABEL GENERATOR ---
  addRealProductLabel(parentGroup, brandName, productName, formulaSubtitle, x, y, zOffset) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    // Clean laboratory white label background with subtle drop shadow
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(16, 16, 480, 328, 12);
    ctx.fill();

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brand Name
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText(brandName.toUpperCase(), 256, 80);

    // Thin separator line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 110);
    ctx.lineTo(432, 110);
    ctx.stroke();

    // Product Name (Bold Clinical)
    ctx.fillStyle = '#1e293b';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    const splitTitle = productName.length > 28 ? productName.substring(0, 28) + '...' : productName;
    ctx.fillText(splitTitle, 256, 175);

    // Formula Details
    ctx.fillStyle = '#475569';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(formulaSubtitle, 256, 225);

    // Biochemical Verification Badge
    ctx.fillStyle = '#059669';
    ctx.font = '600 13px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText('VERIFIED CLINICAL FORMULATION', 256, 285);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;

    const labelGeo = new THREE.PlaneGeometry(0.9, 0.62);
    const labelMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
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
        id: 'biochemistry',
        pos: new THREE.Vector3(0.55, 0.3, 0.35),
        title: 'Primary Active Bioavailability',
        text: data.keyActives || 'Target active compound.'
      },
      {
        id: 'daltons',
        pos: new THREE.Vector3(-0.55, -0.4, 0.35),
        title: 'Cutaneous Absorption Rate',
        text: data.molecularWeight || 'Molecular permeability rating.'
      },
      {
        id: 'ph',
        pos: new THREE.Vector3(0, 1.5, 0.35),
        title: 'Acid Ionization & pH Level',
        text: `Formulation pH: ${data.ph}. Optimized for dermal physiological compatibility.`
      }
    ];

    points.forEach(pt => {
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pt.pos);
      pinGroup.userData = pt;

      const ringGeo = new THREE.RingGeometry(0.045, 0.075, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ringMesh);

      const dotGeo = new THREE.CircleGeometry(0.03, 24);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      pinGroup.add(new THREE.Mesh(dotGeo, dotMat));

      this.hotspotsGroup.add(pinGroup);
    });
  }

  // -------------------------------------------------------------
  // ATOMIC DECONSTRUCTION (Explode into Components & Ions)
  // -------------------------------------------------------------
  toggleExplodedView() {
    this.isExploded = !this.isExploded;
    if (this.sound) this.sound.playChime(780, 0.15);

    const targetCapY = this.isExploded ? 0.9 : 0;
    const targetPipetteY = this.isExploded ? 1.2 : 0;

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

    if (this.sound) this.sound.playDropAcoustic();

    const dropGeo = new THREE.ConeGeometry(0.08, 0.18, 24);
    dropGeo.rotateX(Math.PI);
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: this.currentProduct ? this.currentProduct.liquidColor : 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.05,
      transmission: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const droplet = new THREE.Mesh(dropGeo, dropMat);
    droplet.position.set(0, 1.6, 0);
    this.dropletGroup.add(droplet);

    let progress = 0;
    const animateDrop = () => {
      progress += 0.025;
      droplet.position.y = 1.6 - (progress * 2.8);

      if (progress < 1.0) {
        requestAnimationFrame(animateDrop);
      } else {
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
      color: 0x38bdf8,
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

  // -------------------------------------------------------------
  // USER INPUT & INTERACTION
  // -------------------------------------------------------------
  setupEvents() {
    const el = this.renderer.domElement;

    el.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.isAutoRotating = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      this.mouseNormalized.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseNormalized.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetRotation.y += deltaX * 0.008;
        this.targetRotation.x += deltaY * 0.006;
        this.targetRotation.x = Math.max(-0.6, Math.min(0.6, this.targetRotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    el.addEventListener('click', (e) => {
      this.checkHotspotClick(e);
    });

    window.addEventListener('resize', () => {
      this.onWindowResize();
    });
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
        if (this.sound) this.sound.playChime(1100, 0.15);
        this.callbacks.onHotspotClick(topObj.userData);
      }
    }
  }

  onWindowResize() {
    this.width = this.container.clientWidth || 700;
    this.height = this.container.clientHeight || 580;
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

    if (this.isAutoRotating && !this.isDragging) {
      this.targetRotation.y += delta * 0.35;
    }

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

    const activeTarget = this.viewMode === 'molecule' ? this.moleculeGroup : this.productGroup;
    if (activeTarget) {
      activeTarget.rotation.x = this.currentRotation.x;
      activeTarget.rotation.y = this.currentRotation.y;
      activeTarget.position.y = -0.1 + Math.sin(time * 1.5) * 0.04;
    }

    // Billboarding Hotspots
    if (this.hotspotsGroup) {
      this.hotspotsGroup.children.forEach(h => {
        h.quaternion.copy(this.camera.quaternion);
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.12;
        h.children[0].scale.set(pulse, pulse, pulse);
      });
      this.hotspotsGroup.rotation.x = this.currentRotation.x;
      this.hotspotsGroup.rotation.y = this.currentRotation.y;
      this.hotspotsGroup.position.y = activeTarget ? activeTarget.position.y : 0;
    }

    // Animate UV Photon Shield Rays (Rays streaming toward dome)
    if (this.isUvShieldActive && this.uvRays) {
      this.uvDomeMesh.rotation.y = time * 0.4;
      this.uvRays.forEach(ray => {
        ray.position.addScaledVector(ray.userData.initialPos.clone().normalize().negate(), ray.userData.speed);
        if (ray.position.length() < 1.45) {
          ray.position.copy(ray.userData.initialPos);
        }
      });
    }

    // Animate Holographic Laser Scanner
    if (this.isLaserScanning && this.laserRing) {
      const scanY = Math.sin(time * 2.5) * 1.4;
      this.laserRing.position.y = scanY;
      this.laserDisc.position.y = scanY;
    }

    // Ambient spore particle drift
    if (this.particlesGroup) {
      this.particlesGroup.rotation.y = time * 0.03;
      this.particlesGroup.rotation.x = Math.sin(time * 0.02) * 0.05;
    }

    // Camera mouse parallax tracking
    this.camera.position.x += ((this.mouseNormalized.x * 0.35) - this.camera.position.x) * 0.05;
    this.camera.position.y += ((0.7 + this.mouseNormalized.y * 0.25) - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0.1, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
