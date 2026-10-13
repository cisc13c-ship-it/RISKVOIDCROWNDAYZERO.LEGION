let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let cineOsc: OscillatorNode | null = null;
let cineLfo: OscillatorNode | null = null;
let cineGain: GainNode | null = null;
let cineFilter: BiquadFilterNode | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) master.gain.setTargetAtTime(next ? 0 : 0.35, ctx.currentTime, 0.04);
  if (next) silenceSpeech();
}

function beep(freq: number, dur: number, type: OscillatorType = "square", vol = 0.08, slide = 0) {
  if (!ctx || !master || muted) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function sfxClick() {
  beep(420, 0.04, "square", 0.05);
}
export function sfxPlace() {
  beep(180, 0.07, "triangle", 0.07);
}
export function sfxDice() {
  beep(240, 0.05, "square", 0.06);
  beep(310, 0.05, "square", 0.05);
}
export function sfxHit() {
  beep(90, 0.09, "sawtooth", 0.1, -40);
}
export function sfxCapture() {
  beep(220, 0.12, "triangle", 0.08);
  beep(330, 0.16, "triangle", 0.06);
}
export function sfxBoom() {
  beep(55, 0.35, "sawtooth", 0.14, -20);
}
export function sfxWin() {
  beep(440, 0.18, "triangle", 0.08);
  beep(660, 0.22, "triangle", 0.07);
}
export function sfxLose() {
  beep(110, 0.4, "sawtooth", 0.1, -50);
}

function getCtx() {
  unlockAudio();
  return ctx && master ? { ctx, master } : null;
}

export function stopCineBed() {
  const g = getCtx();
  if (cineGain && g) {
    cineGain.gain.setTargetAtTime(0.0001, g.ctx.currentTime, 0.04);
  }
  const kill = (n: OscillatorNode | null) => {
    try {
      n?.stop();
    } catch {
      /* already */
    }
  };
  kill(cineOsc);
  kill(cineLfo);
  cineOsc = null;
  cineLfo = null;
  cineGain = null;
  cineFilter = null;
}

export function setCineMood(mood: "low" | "mid" | "high" | "rift" | "void") {
  const g = getCtx();
  if (!g || muted) return;
  const { ctx: ac, master: m } = g;
  if (!cineOsc || !cineFilter || !cineGain || !cineLfo) {
    stopCineBed();
    cineGain = ac.createGain();
    cineGain.gain.value = 0.0001;
    cineFilter = ac.createBiquadFilter();
    cineFilter.type = "lowpass";
    cineOsc = ac.createOscillator();
    cineOsc.type = "sawtooth";
    cineLfo = ac.createOscillator();
    cineLfo.type = "sine";
    const lfoG = ac.createGain();
    lfoG.gain.value = 12;
    cineLfo.connect(lfoG);
    lfoG.connect(cineOsc.frequency);
    cineOsc.connect(cineFilter);
    cineFilter.connect(cineGain);
    cineGain.connect(m);
    cineOsc.start();
    cineLfo.start();
  }
  const table = {
    low: { f: 55, q: 4, vol: 0.045, lfo: 0.12 },
    mid: { f: 72, q: 6, vol: 0.055, lfo: 0.2 },
    high: { f: 48, q: 8, vol: 0.08, lfo: 0.35 },
    rift: { f: 41, q: 12, vol: 0.07, lfo: 1.8 },
    void: { f: 36, q: 3, vol: 0.06, lfo: 0.08 },
  }[mood];
  const t = ac.currentTime;
  cineOsc.frequency.setTargetAtTime(table.f, t, 0.08);
  cineFilter.frequency.setTargetAtTime(mood === "rift" ? 900 : 420, t, 0.1);
  cineFilter.Q.setTargetAtTime(table.q, t, 0.1);
  cineGain.gain.setTargetAtTime(table.vol, t, 0.12);
  cineLfo.frequency.setTargetAtTime(table.lfo, t, 0.1);
}

export function cineHit() {
  beep(70, 0.5, "sawtooth", 0.16, -30);
  beep(140, 0.28, "triangle", 0.07);
}

export function speakLine(text: string) {
  if (muted) return;
  const syn = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (!syn) return;
  syn.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-MX";
  u.rate = 0.92;
  u.pitch = 0.7;
  u.volume = 0.85;
  syn.speak(u);
}

export function silenceSpeech() {
  if (typeof window === "undefined") return;
  window.speechSynthesis?.cancel();
}
