/**
 * Minimal synthesized soundscape: antique tick, gear murmur, chime, paper.
 * No audio assets, starts muted, only created after a user gesture.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let tickTimer: ReturnType<typeof setInterval> | null = null;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  void ctx.resume();
  return ctx;
}

function noiseBurst(duration: number, freq: number, gain: number) {
  const c = ensure();
  if (!c || !master) return;
  const len = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 2;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(master);
  src.start();
}

function tone(freq: number, duration: number, gain: number, type: OscillatorType = "sine") {
  const c = ensure();
  if (!c || !master) return;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(master);
  osc.start();
  osc.stop(c.currentTime + duration + 0.05);
}

export const royalAudio = {
  start() {
    ensure();
    if (tickTimer) return;
    tickTimer = setInterval(() => noiseBurst(0.06, 2100, 0.5), 1000);
  },
  setEnabled(on: boolean) {
    const c = ensure();
    if (!c || !master) return;
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(on ? 0.35 : 0, c.currentTime + 0.6);
  },
  gears() {
    noiseBurst(0.9, 420, 0.35);
    tone(74, 1.4, 0.06, "triangle");
  },
  chime() {
    [1046.5, 1568, 2093].forEach((f, i) => setTimeout(() => tone(f, 2.4, 0.09, "sine"), i * 220));
  },
  paper() {
    noiseBurst(0.35, 4200, 0.28);
  },
  wax() {
    noiseBurst(0.12, 900, 0.4);
    tone(120, 0.3, 0.08, "triangle");
  },
  dispose() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = null;
    void ctx?.close();
    ctx = null;
    master = null;
  },
};
