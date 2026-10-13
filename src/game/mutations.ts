import { worldFingerprint } from "./canon";
import { rememberAction } from "./memory";
import type { GameState, Mutation, MutationKind } from "./types";

const CATALOG: Record<MutationKind, { cause: (s: GameState) => boolean; evidence: (s: GameState) => string; label: string }> = {
  ash_winter: {
    label: "Invierno de ceniza",
    cause: (s) => s.scars.filter((c) => c.kind === "nuclear" || c.kind === "impacto" || c.kind === "volcan").length >= 3,
    evidence: (s) => `${s.scars.filter((c) => c.kind === "nuclear" || c.kind === "impacto" || c.kind === "volcan").length} cicatrices de impacto/nuclear/volcán`,
  },
  hardened_fronts: {
    label: "Frentes endurecidos",
    cause: (s) => s.scars.length >= 5,
    evidence: (s) => `${s.scars.length} cicatrices persistentes`,
  },
  wasteland_bloom: {
    label: "Floración del yermo",
    cause: (s) => Object.values(s.territories).filter((t) => t.owner === "wasteland").length >= 4,
    evidence: (s) => `${Object.values(s.territories).filter((t) => t.owner === "wasteland").length} territorios yermos`,
  },
  war_economy: {
    label: "Economía de guerra",
    cause: (s) => s.trades >= 3 || s.day >= 10,
    evidence: (s) => `${s.trades} sets canjeados · día ${s.day}`,
  },
  rift_bleed: {
    label: "Sangrado de grieta",
    cause: (s) => s.singularity >= 70 || s.riftOpened,
    evidence: (s) => `singularidad ${Math.round(s.singularity)}`,
  },
};

export function proposeMutations(s: GameState) {
  for (const kind of Object.keys(CATALOG) as MutationKind[]) {
    if (s.mutations.some((m) => m.kind === kind && (m.status === "ADOPTED" || m.status === "CANDIDATE" || m.status === "VERIFIED"))) {
      continue;
    }
    const spec = CATALOG[kind];
    if (!spec.cause(s)) continue;
    const mut: Mutation = {
      id: `u${s.mutations.length + 1}`,
      parent: s.mutations.filter((m) => m.status === "ADOPTED").at(-1)?.id ?? null,
      kind,
      cause: spec.label,
      status: "CANDIDATE",
      evidence: spec.evidence(s),
      day: s.day,
    };
    s.mutations = [...s.mutations, mut];
    rememberAction(s, "world", "MUTATION_CANDIDATE", {
      after: kind,
      consequences: [spec.evidence(s)],
    });
  }
}

export function evaluateMutations(s: GameState) {
  s.mutations = s.mutations.map((m) => {
    if (m.status !== "CANDIDATE") return m;
    const spec = CATALOG[m.kind];
    const stillHolds = spec.cause(s);
    const sim = structuredClone(s);
    sim.mutations = sim.mutations.map((x) => (x.id === m.id ? { ...x, status: "ADOPTED" as const } : x));
    const keys = Object.keys(sim.territories).length;
    const fp = worldFingerprint(sim);
    const verified = stillHolds && keys === 42 && fp.length > 0;
    return {
      ...m,
      status: verified ? "VERIFIED" : "REJECTED",
      result: verified ? `causa vigente · 42 territorios · ${spec.evidence(s)}` : "causa rota o mundo inválido",
    };
  });
}

export function adoptVerified(s: GameState) {
  s.mutations = s.mutations.map((m) => {
    if (m.status !== "VERIFIED") return m;
    rememberAction(s, "world", "MUTATION_ADOPTED", { after: m.kind, consequences: [m.evidence] });
    s.log = [`Mutación adoptada: ${CATALOG[m.kind].label}.`, ...s.log].slice(0, 18);
    return { ...m, status: "ADOPTED" as const };
  });
}

export function mutationLabel(kind: MutationKind): string {
  return CATALOG[kind].label;
}
