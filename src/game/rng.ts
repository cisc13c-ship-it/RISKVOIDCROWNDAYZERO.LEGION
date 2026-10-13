export function mulberry32(seed: number): number {
  let s = seed | 0;
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return (t ^ (t >>> 14)) >>> 0;
}

export function unit(seed: number): number {
  return mulberry32(seed) / 4294967296;
}

export type RngHolder = { rng: number };

export function nextRng(s: RngHolder): number {
  s.rng = mulberry32(s.rng);
  return unit(s.rng);
}

export function randInt(s: RngHolder, n: number): number {
  if (n <= 0) return 0;
  return Math.floor(nextRng(s) * n);
}
