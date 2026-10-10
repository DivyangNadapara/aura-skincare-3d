// Procedural Web Audio API Soundscape Engine for ÉTHÉRÉ Luxury 3D
// Generates silky ambient drones, crystal glass chimes, and fluid drop acoustics procedurally.

class LuxurySoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.ambientGain = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientFilter = null;
    this.isPlayingAmbient = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  toggleSound() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
    } else {
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.4, this.ctx.currentTime, 0.3);
      }
      this.startAmbientDrone();
      this.playGlassChime(880, 0.15);
    }

    return !this.isMuted;
  }

  startAmbientDrone() {
    if (this.isPlayingAmbient || !this.ctx) return;
    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 3.0);

      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = "lowpass";
      this.ambientFilter.frequency.setValueAtTime(240, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      // Low fundamental (A1 = 55Hz)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = "sine";
      this.ambientOsc1.frequency.setValueAtTime(108, this.ctx.currentTime);

      // Soft harmonic fifth (E2 = 162Hz)
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = "triangle";
      this.ambientOsc2.frequency.setValueAtTime(162, this.ctx.currentTime);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn("Drone init error", e);
    }
  }

  // Subtle glass harmonic tap when hovering or selecting products
  playGlassChime(freq = 1200, volume = 0.08) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.35);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // Liquid droplet acoustic for serum dispenser
  playLiquidDrop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      
      // Pitch drop sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      // Resonant splash ripple
      const splashOsc = this.ctx.createOscillator();
      const splashGain = this.ctx.createGain();
      splashOsc.type = "sine";
      splashOsc.frequency.setValueAtTime(820, now + 0.08);
      splashOsc.frequency.exponentialRampToValueAtTime(1150, now + 0.2);
      splashGain.gain.setValueAtTime(0.0001, now);
      splashGain.gain.setValueAtTime(0.12, now + 0.08);
      splashGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      splashOsc.connect(splashGain);
      splashGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
      splashOsc.start(now + 0.08);
      splashOsc.stop(now + 0.4);
    } catch (e) {}
  }

  // Harmonic chord swell for X-Ray activation / Ritual generation
  playSwell() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A major 7th ethereal chord
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.04 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.04);
        osc.stop(now + 1.3);
      });
    } catch (e) {}
  }

  playChime(freq = 1200, volume = 0.08) {
    this.playGlassChime(freq, volume);
  }

  playDropAcoustic() {
    this.playLiquidDrop();
  }
}

export const soundEngine = new LuxurySoundEngine();
