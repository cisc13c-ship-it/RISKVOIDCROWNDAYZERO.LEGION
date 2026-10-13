import type { GameState } from "./types";
import { unlockChronicle } from "./lore";

export const SINGULARITY_RIFT = 100;
export const VOIDCROWN_THRESHOLD = 80;

export function computeEscalation(s: GameState): number {
  const waste = Object.values(s.territories).filter((t) => t.owner === "wasteland").length;
  const nuclear = s.scars.filter((c) => c.kind === "nuclear").length;
  return Math.min(100, s.day * 3 + waste * 4 + nuclear * 8 + s.trades * 2);
}

export function computeVoidcrown(s: GameState): number {
  const scarScore = 20 * Math.min(1, s.scars.length / 12);
  const realityScore = 20 * Math.min(1, Math.max(0, s.realities.length - 1) / 1);
  const mutScore = 20 * Math.min(1, s.mutations.filter((m) => m.status === "ADOPTED").length / 2);
  const singScore = 20 * Math.min(1, s.singularity / 100);
  const dayScore = 20 * Math.min(1, s.day / 20);
  return Math.round(scarScore + realityScore + mutScore + singScore + dayScore);
}

export function syncMetrics(s: GameState) {
  s.escalation = computeEscalation(s);
  s.voidcrown = computeVoidcrown(s);
  if (!s.voidcrownEmerged && s.voidcrown >= VOIDCROWN_THRESHOLD && s.riftOpened) {
    s.voidcrownEmerged = true;
  }
  unlockChronicle(s);
}

export function worldFingerprint(s: GameState): string {
  const parts = Object.entries(s.territories)
    .map(([id, t]) => `${id}:${t.owner}:${t.armies}`)
    .sort();
  return `${s.day}|${s.current}|${s.phase}|${parts.join(",")}`;
}
