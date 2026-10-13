import { stepAi } from "./ai";
import { currentPlayer, dismissEvent, newGame, skipFortify } from "./engine";
import type { Difficulty, FactionId, GameState, Scenario } from "./types";

export type SimResult = {
  seed: number;
  days: number;
  winner: string | null;
  winnerFaction: string | null;
  rift: boolean;
  voidcrown: boolean;
  scars: number;
  mutations: number;
  steps: number;
  over: boolean;
};

export type SimBatch = {
  n: number;
  results: SimResult[];
  wins: Record<string, number>;
  riftRate: number;
  voidcrownRate: number;
  avgDays: number;
};

function playOut(s0: GameState, maxDays = 36, maxSteps = 3500): SimResult {
  let s = s0;
  let attacks = 0;
  let steps = 0;
  while (s.phase !== "over" && s.day <= maxDays && steps < maxSteps) {
    steps += 1;
    if (s.phase === "event") {
      s = dismissEvent(s);
      attacks = 0;
      continue;
    }
    if (currentPlayer(s).isHuman) break;
    if (attacks > 16) {
      s = skipFortify(s);
      attacks = 0;
      continue;
    }
    const step = stepAi(s);
    if (step.state.lastCombat) attacks += 1;
    s = step.state;
    if (step.kind === "done") attacks = 0;
  }
  const winner = s.players.find((p) => p.id === s.winner);
  return {
    seed: s.seed,
    days: s.day,
    winner: s.winner,
    winnerFaction: winner?.faction ?? null,
    rift: s.riftOpened,
    voidcrown: s.voidcrownEmerged,
    scars: s.scars.length,
    mutations: s.mutations.filter((m) => m.status === "ADOPTED").length,
    steps,
    over: s.phase === "over",
  };
}

export function simulateOnce(opts: {
  faction?: FactionId;
  opponents?: number;
  difficulty?: Difficulty;
  seed: number;
  scenario?: Scenario;
}): SimResult {
  const s = newGame({
    faction: opts.faction ?? "ceniza",
    opponents: opts.opponents ?? 3,
    difficulty: opts.difficulty ?? "veterano",
    seed: opts.seed,
    scenario: opts.scenario ?? "standard",
    observer: true,
  });
  return playOut(s);
}

export function simulateBatch(n: number, seed0 = 1, difficulty: Difficulty = "veterano"): SimBatch {
  const results: SimResult[] = [];
  const wins: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const r = simulateOnce({ seed: (seed0 + i * 9973) >>> 0, difficulty, opponents: 3 });
    results.push(r);
    const key = r.winnerFaction ?? "none";
    wins[key] = (wins[key] ?? 0) + 1;
  }
  const finished = results.filter((r) => r.over);
  return {
    n,
    results,
    wins,
    riftRate: results.filter((r) => r.rift).length / n,
    voidcrownRate: results.filter((r) => r.voidcrown).length / n,
    avgDays: finished.length ? finished.reduce((a, r) => a + r.days, 0) / finished.length : 0,
  };
}
