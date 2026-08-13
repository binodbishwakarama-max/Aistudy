/**
 * Google-Level Web Audio Synthesis Engine for MindFlow
 * Pure Web Audio API — zero network latency, zero MP3 downloads, zero audio glitches.
 */

const STORAGE_KEY_ENABLED = 'mindflow_sound_enabled';
const STORAGE_KEY_VOLUME = 'mindflow_sound_volume';

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const getSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
  return stored === null ? true : stored === '1';
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ENABLED, enabled ? '1' : '0');
};

export const getSoundVolume = () => {
  if (typeof window === 'undefined') return 0.5;
  const stored = localStorage.getItem(STORAGE_KEY_VOLUME);
  return stored === null ? 0.5 : Math.max(0, Math.min(1, parseFloat(stored) || 0.5));
};

export const setSoundVolume = (volume) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VOLUME, volume.toString());
};

/**
 * Play a synthesized sound effect
 */
export const playSound = (type = 'click') => {
  if (!getSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const volume = getSoundVolume();
  if (volume <= 0) return;

  const now = ctx.currentTime;

  try {
    switch (type) {
      // 1. Subtle Paper / Wooden Card Flip
      case 'cardFlip': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gain.gain.setValueAtTime(volume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      // 2. Warm Harmonic Correct Answer Chime (C5 -> E5 -> G5)
      case 'correct': {
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0.001, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(volume * 0.12, now + idx * 0.06 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
        break;
      }

      // 3. Low Muted Incorrect Bump
      case 'incorrect': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(volume * 0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      // 4. Celebratory Achievement Arpeggio (C5 -> E5 -> G5 -> C6)
      case 'achievement': {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.001, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(volume * 0.15, now + idx * 0.08 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
        break;
      }

      // 5. Minimal Haptic UI Click
      case 'click':
      default: {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

        gain.gain.setValueAtTime(volume * 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }
    }
  } catch (err) {
    console.debug('Audio play failed:', err);
  }
};
