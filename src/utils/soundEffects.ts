import { Rarity } from '../types';

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * CS:GO case ticker sound (crisp mechanical click)
 */
export function playTickSound(playbackRate = 1) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sharp tick click
    osc.type = 'triangle';
    const baseFreq = 850 + Math.random() * 150;
    osc.frequency.setValueAtTime(baseFreq * playbackRate, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch {
    // AudioContext may be blocked before interaction
  }
}

/**
 * Heavy mechanical case unlock latch sound
 */
export function playCaseUnlockSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Metal thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);

    // Metal click overlay
    setTimeout(() => {
      if (!ctx || !soundEnabled) return;
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sawtooth';
      clickOsc.frequency.setValueAtTime(1400, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

      clickGain.gain.setValueAtTime(0.3, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start();
      clickOsc.stop(ctx.currentTime + 0.09);
    }, 80);
  } catch {
    // Ignore audio error
  }
}

/**
 * Reveal fanfare sound corresponding to CS:GO rarity
 */
export function playDropSound(rarity: Rarity) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (rarity === 'blue') {
      // Clean chime
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } else if (rarity === 'purple') {
      // Purple victory chord
      const notes = [392, 493.88, 587.33, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.28, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.6);
      });
    } else if (rarity === 'pink') {
      // Pink fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.25, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.75);
      });
    } else if (rarity === 'red') {
      // Dramatic CS:GO Covert bass drop + fanfare
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(180, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      subGain.gain.setValueAtTime(0.6, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.95);

      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + 0.15 + idx * 0.08);
        gain.gain.setValueAtTime(0.3, now + 0.15 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15 + idx * 0.08 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.15 + idx * 0.08);
        osc.stop(now + 0.15 + idx * 0.08 + 0.85);
      });
    } else {
      // GOLD / KNIFE: Epic shimmering fanfare + sub boom
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(220, now);
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.8);
      subGain.gain.setValueAtTime(0.7, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 1.25);

      const bells = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093];
      bells.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.06);
        gain.gain.setValueAtTime(0.35, now + 0.1 + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + idx * 0.06 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.1 + idx * 0.06);
        osc.stop(now + 0.1 + idx * 0.06 + 1.3);
      });
    }
  } catch {
    // Ignore audio errors
  }
}
