let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function safe(fn: () => void) {
  try { fn(); } catch { /* audio failure is non-fatal */ }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.1) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playClick() { safe(() => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}); }

export function playCorrect() { safe(() => {
  const ctx = getCtx();
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
    osc.connect(g).connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.3);
  });
}); }

export function playWrong() { safe(() => {
  playTone(300, 0.15, 'square', 0.06);
  setTimeout(() => playTone(220, 0.25, 'square', 0.06), 150);
}); }

export function playBossEntrance() { safe(() => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
  g.gain.setValueAtTime(0.1, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.7);
  setTimeout(() => {
    [400, 500, 600].forEach((f) => {
      playTone(f, 0.2, 'triangle', 0.06);
    });
  }, 500);
}); }

export function playBossDefeat() { safe(() => {
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.08), i * 120);
  });
}); }

export function playMolt() { safe(() => {
  [262, 330, 392, 523, 659, 784].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.06), i * 80);
  });
}); }

export function playClimb() { safe(() => {
  playTone(440, 0.1, 'sine', 0.06);
  setTimeout(() => playTone(660, 0.15, 'sine', 0.06), 100);
}); }

export function playGameOver() { safe(() => {
  [392, 349, 330, 262].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.35, 'triangle', 0.07), i * 200);
  });
}); }

export function playBubble() { safe(() => {
  const freq = 1200 + Math.random() * 400;
  playTone(freq, 0.08, 'sine', 0.04);
}); }

export function playStreak() { safe(() => {
  [600, 750, 900].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.1, 'sine', 0.07), i * 60);
  });
}); }
