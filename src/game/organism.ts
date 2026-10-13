/**
 * Órganos CEL / FITNESS / JOKER. No reemplazan mutations.ts.
 * CEL observa. Joker contradice. Nadie escribe canon.
 */
import type { GameState, Mutation } from "./types";

export type Fitness = {
  territories: number;
  owners: number;
  scars: number;
  wasteland: number;
  singularity: number;
  adopted: number;
  memory: number;
};

export type CelSting = {
  observation: string;
  hypothesis: string;
  status: "HIPOTESIS";
  day: number;
};

export type JokerVerdict = {
  decision: "KEEP" | "ROLLBACK" | "UNKNOWN";
  notes: string[];
};

export function worldFitness(s: GameState): Fitness {
  const owners = new Set(Object.values(s.territories).map((t) => t.owner));
  return {
    territories: Object.keys(s.territories).length,
    owners: owners.size,
    scars: s.scars.length,
    wasteland: Object.values(s.territories).filter((t) => t.owner === "wasteland").length,
    singularity: Math.round(s.singularity),
    adopted: s.mutations.filter((m) => m.status === "ADOPTED").length,
    memory: s.memory.length,
  };
}

export function celSting(s: GameState): CelSting | null {
  const fit = worldFitness(s);
  if (fit.territories !== 42) {
    return {
      observation: `Cardinalidad rota: ${fit.territories} territorios`,
      hypothesis: "Una mutación o evento destruyó el mapa",
      status: "HIPOTESIS",
      day: s.day,
    };
  }
  if (fit.wasteland >= 8 && !s.voidcrownEmerged) {
    return {
      observation: `${fit.wasteland} yermos y Voidcrown no ha nacido`,
      hypothesis: "El umbral de emergencia no se está evaluando o es demasiado alto",
      status: "HIPOTESIS",
      day: s.day,
    };
  }
  if (fit.scars >= 3 && fit.adopted === 0 && s.mutations.every((m) => m.status !== "CANDIDATE" && m.status !== "VERIFIED")) {
    return {
      observation: `${fit.scars} cicatrices sin candidata de mutación`,
      hypothesis: "El pipeline no dispara con las causas actuales",
      status: "HIPOTESIS",
      day: s.day,
    };
  }
  const counts = new Map<string, number>();
  for (const t of Object.values(s.territories)) counts.set(t.owner, (counts.get(t.owner) ?? 0) + 1);
  for (const p of s.players) {
    if (!p.alive) continue;
    if ((counts.get(p.id) ?? 0) === 0 && p.id !== "void") {
      return {
        observation: `${p.name} sigue vivo sin territorio`,
        hypothesis: "syncAlive no cerró al jugador",
        status: "HIPOTESIS",
        day: s.day,
      };
    }
  }
  return null;
}

export function jokerFitness(before: Fitness, after: Fitness): JokerVerdict {
  const notes: string[] = [];
  if (after.territories !== 42) {
    return { decision: "ROLLBACK", notes: ["rompe los 42 territorios"] };
  }
  if (after.memory < before.memory) {
    return { decision: "ROLLBACK", notes: ["perdió memoria causal"] };
  }
  if (after.scars + after.adopted + after.wasteland === before.scars + before.adopted + before.wasteland) {
    notes.push("fitness idéntico en cicatrices/mutaciones/yermos");
    return { decision: "UNKNOWN", notes };
  }
  if (after.owners < 1) return { decision: "ROLLBACK", notes: ["sin dueños"] };
  notes.push("cardinalidad intacta");
  return { decision: "KEEP", notes };
}

export function critiqueMutations(s: GameState): void {
  const before = worldFitness(s);
  s.mutations = s.mutations.map((m: Mutation) => {
    if (m.status !== "VERIFIED") return m;
    const sim = structuredClone(s);
    sim.mutations = sim.mutations.map((x) => (x.id === m.id ? { ...x, status: "ADOPTED" as const } : x));
    const verdict = jokerFitness(before, worldFitness(sim));
    if (verdict.decision === "ROLLBACK") {
      return { ...m, status: "REJECTED" as const, result: `joker: ${verdict.notes.join("; ")}` };
    }
    return { ...m, result: `${m.result ?? ""} · joker:${verdict.decision}`.trim() };
  });
}

export function runCel(s: GameState): CelSting | null {
  const sting = celSting(s);
  s.cel = sting;
  if (sting) {
    s.log = [`CEL: ${sting.observation}`, ...s.log].slice(0, 18);
  }
  return sting;
}
