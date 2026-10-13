/**
 * Capa viva. El código no se recompila: el Director emite MutationPatch.
 * Catástrofe selecciona (esporas, genoma, tumba). No borra el nodo.
 */
import { TERRITORIES, TERRITORY_LIST } from "./map";
import { rememberAction } from "./memory";
import type {
  DisasterKind,
  FactionId,
  GameState,
  PlayerId,
  TerritoryId,
} from "./types";

export type GenomeAxis = "acid" | "heat" | "radiation" | "pressure" | "social" | "synthetic";

export type Genome = Record<GenomeAxis, number>;

export type Biota = {
  pop: number;
  spores: number;
  genome: Genome;
};

export type WorldDoctrine = "NORMAL" | "AUSTERIDAD" | "RESCATE";

export type PatchKind = "genome" | "spore" | "scar" | "doctrine";

export type MutationPatch = {
  id: string;
  day: number;
  kind: PatchKind;
  target: string;
  before: string;
  after: string;
  reason: string;
};

export type ProbeKind = "survey" | "sample" | "seed";

export type Tomb = {
  territory: TerritoryId;
  day: number;
  note: string;
};

export type LivingState = {
  biota: Record<string, Biota>;
  doctrine: WorldDoctrine;
  patches: MutationPatch[];
  generation: number;
  tombs: Tomb[];
  probes: number;
  lastProbe: { kind: ProbeKind; territory: TerritoryId; line: string } | null;
  warning: string | null;
  retentionNote: string;
  gamesRemembered: number;
  retentionWins: number;
  retentionLosses: number;
};

export type RetentionRow = {
  seed: number;
  day: number;
  won: boolean;
  probes: number;
  scars: number;
  doctrine: WorldDoctrine;
  generation: number;
};

export type MindFile = {
  generation: number;
  tombs: Tomb[];
};

const RETENTION_MAX = 20;
const RETENTION_KEY = "rzd-retention-v1";
const MIND_KEY = "rzd-mind-v1";

const AXES: GenomeAxis[] = ["acid", "heat", "radiation", "pressure", "social", "synthetic"];

const DISASTER_AXIS: Record<DisasterKind, GenomeAxis> = {
  impacto: "radiation",
  nuclear: "radiation",
  incendio: "heat",
  tormenta: "pressure",
  tsunami: "pressure",
  pandemia: "acid",
  emp: "synthetic",
  volcan: "heat",
  sismo: "pressure",
};

const FACTION_AXIS: Record<FactionId, GenomeAxis> = {
  ceniza: "heat",
  marea: "pressure",
  nexo: "synthetic",
  horda: "social",
  umbral: "radiation",
  voidcrown: "radiation",
};

type Store = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

let injected: Store | null = null;

export function setLivingStore(store: Store | null) {
  injected = store;
}

function disk(): Store | null {
  if (injected) return injected;
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, Math.round(n)));
}

function mix(seed: number, id: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

function genomeAt(seed: number, id: string, coastal: boolean): Genome {
  const h = mix(seed, id);
  const g = (shift: number, base: number) => clamp(base + ((h >> shift) & 31) - 8);
  return {
    acid: g(0, 28),
    heat: g(5, coastal ? 22 : 36),
    radiation: g(10, 18),
    pressure: g(15, coastal ? 48 : 24),
    social: g(20, 34),
    synthetic: g(25, 16),
  };
}

function baseBiota(seed: number, id: string, coastal: boolean): Biota {
  const h = mix(seed ^ 0x9e3779b9, id);
  return {
    pop: 24 + (h % 28),
    spores: h % 3,
    genome: genomeAt(seed, id, coastal),
  };
}

export function loadRetention(): RetentionRow[] {
  const api = disk();
  if (!api) return [];
  try {
    const raw = api.getItem(RETENTION_KEY);
    if (!raw) return [];
    const rows = JSON.parse(raw) as RetentionRow[];
    return Array.isArray(rows) ? rows.slice(-RETENTION_MAX) : [];
  } catch {
    return [];
  }
}

export function loadMind(): MindFile | null {
  const api = disk();
  if (!api) return null;
  try {
    const raw = api.getItem(MIND_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MindFile;
    if (!parsed || typeof parsed.generation !== "number") return null;
    return { generation: parsed.generation, tombs: Array.isArray(parsed.tombs) ? parsed.tombs : [] };
  } catch {
    return null;
  }
}

function saveMind(mind: MindFile) {
  const api = disk();
  if (!api) return;
  try {
    api.setItem(MIND_KEY, JSON.stringify(mind));
  } catch {
    /* quota */
  }
}

function saveRetention(rows: RetentionRow[]) {
  const api = disk();
  if (!api) return;
  try {
    api.setItem(RETENTION_KEY, JSON.stringify(rows.slice(-RETENTION_MAX)));
  } catch {
    /* quota */
  }
}

export function emptyLiving(): LivingState {
  return {
    biota: {},
    doctrine: "NORMAL",
    patches: [],
    generation: 1,
    tombs: [],
    probes: 0,
    lastProbe: null,
    warning: null,
    retentionNote: "Director en observación.",
    gamesRemembered: 0,
    retentionWins: 0,
    retentionLosses: 0,
  };
}

function pushPatch(s: GameState, patch: Omit<MutationPatch, "id" | "day">) {
  const row: MutationPatch = {
    id: `p${s.living.patches.length + 1}`,
    day: s.day,
    ...patch,
  };
  s.living.patches = [...s.living.patches, row].slice(-16);
}

export function bootLiving(s: GameState, inherit: boolean) {
  const mind = inherit ? loadMind() : null;
  const rows = inherit ? loadRetention() : [];
  const wins = rows.filter((r) => r.won).length;
  const losses = rows.length - wins;
  let doctrine: WorldDoctrine = "NORMAL";
  let note = "Director en observación. Aún no hay partidas en la memoria de 20.";
  if (rows.length >= 3 && losses >= wins + 2) {
    doctrine = "RESCATE";
    note = `Director recuerda ${losses} derrotas en ${rows.length}/20. Afloja el siguiente golpe sobre ti.`;
  } else if (rows.length >= 3 && rows.reduce((n, r) => n + r.day, 0) / rows.length < 8) {
    doctrine = "AUSTERIDAD";
    note = "Las partidas mueren pronto. El Director endurece tu refuerzo y la biota social cede.";
  } else if (rows.length) {
    note = `Memoria ${rows.length}/20. Victorias ${wins}. El Director sigue observando.`;
  }
  s.living = {
    ...emptyLiving(),
    doctrine,
    generation: mind ? mind.generation + 1 : 1,
    tombs: mind?.tombs?.slice(-24) ?? [],
    retentionNote: note,
    gamesRemembered: rows.length,
    retentionWins: wins,
    retentionLosses: losses,
  };
  for (const t of TERRITORY_LIST) {
    s.living.biota[t.id] = baseBiota(s.seed, t.id, t.coastal);
  }
  for (const tomb of s.living.tombs) {
    const b = s.living.biota[tomb.territory];
    if (!b) continue;
    b.pop = Math.max(0, b.pop - 12);
    b.spores += 4;
  }
  if (doctrine !== "NORMAL") {
    pushPatch(s, {
      kind: "doctrine",
      target: "global",
      before: "NORMAL",
      after: doctrine,
      reason: note,
    });
  }
}

export function ensureLiving(s: GameState) {
  if (s.living?.biota && Object.keys(s.living.biota).length >= TERRITORY_LIST.length) return;
  bootLiving(s, false);
}

/** La catástrofe selecciona un eje y deja esporas. Pop 0 = tumba, no borrado. */
export function selectByCatastrophe(s: GameState, id: TerritoryId, kind: DisasterKind, killed: number) {
  if (!s.living?.biota?.[id]) return;
  const b = s.living.biota[id];
  const axis = DISASTER_AXIS[kind];
  const before = `${axis}:${b.genome[axis]} pop:${b.pop} esp:${b.spores}`;
  b.genome[axis] = clamp(b.genome[axis] + 6 + Math.min(12, killed));
  b.pop = clamp(b.pop - Math.max(1, killed), 0, 100);
  b.spores = clamp(b.spores + 1 + Math.floor(killed / 3), 0, 100);
  if (b.pop <= 0) {
    b.spores = Math.max(b.spores, 3);
    const name = TERRITORIES[id]?.name ?? id;
    if (!s.living.tombs.some((t) => t.territory === id)) {
      s.living.tombs = [...s.living.tombs, { territory: id, day: s.day, note: `${name} cayó. Las esporas se quedaron.` }].slice(-24);
    }
  }
  pushPatch(s, {
    kind: b.pop <= 0 ? "spore" : "genome",
    target: id,
    before,
    after: `${axis}:${b.genome[axis]} pop:${b.pop} esp:${b.spores}`,
    reason: `${kind} selecciona ${axis}. No borra el nodo.`,
  });
}

export function rescueSoak(s: GameState, owner: PlayerId | "wasteland"): number {
  if (!s.living) return 0;
  if (s.living.doctrine === "RESCATE" && owner === s.humanId) return 1;
  return 0;
}

export function doctrineArmyBonus(s: GameState, pid: PlayerId): number {
  if (!s.living) return 0;
  if (s.living.doctrine === "AUSTERIDAD" && pid === s.humanId) return 1;
  return 0;
}

export function directorTick(s: GameState) {
  if (!s.living) return;
  const scars = s.scars.length;
  let next = s.living.doctrine;
  if (s.living.retentionLosses >= s.living.retentionWins + 2 && s.living.gamesRemembered >= 3) next = "RESCATE";
  else if (scars >= 6) next = "AUSTERIDAD";
  if (next === s.living.doctrine) {
    const last = s.living.patches.at(-1);
    if (last) s.log = [`Director: ${last.reason}`, ...s.log].slice(0, 18);
    return;
  }
  const before = s.living.doctrine;
  s.living.doctrine = next;
  const reason =
    next === "RESCATE"
      ? "Demasiadas derrotas en la memoria. Doctrina de rescate."
      : "El mapa está cicatrizado. Doctrina de austeridad.";
  pushPatch(s, { kind: "doctrine", target: "global", before, after: next, reason });
  s.log = [`Director emite ${next}. ${reason}`, ...s.log].slice(0, 18);
  rememberAction(s, "world", "MUTATION_PATCH", { after: next, consequences: [reason] });
}

export function warningFor(s: GameState, id: TerritoryId): string | null {
  const t = s.territories[id];
  const b = s.living?.biota?.[id];
  const name = TERRITORIES[id]?.name ?? id;
  if (!t) return null;
  if (t.hazard) {
    const hazard = t.hazard;
    return `${name}: ${hazard} activo. El fenómeno avisa. Si entras, la cicatriz se queda.`;
  }
  if (b && b.genome.radiation >= 72) return `${name}: radiación incompatible. La biota ya no es la de ayer.`;
  if (b && b.spores >= 8) return `${name}: esporas densas. La catástrofe seleccionó vida, no la borró.`;
  if (s.riftOpened && s.scars.some((c) => c.territory === id)) {
    return `${name}: cicatriz sobre grieta. El portal está marcado. Insistir tiene coste.`;
  }
  return null;
}

export function touchWarning(s: GameState) {
  if (!s.living) return;
  s.living.warning = s.selected ? warningFor(s, s.selected) : s.living.warning;
}

export function focusPhenomenon(s0: GameState, id: TerritoryId): GameState | null {
  if (!s0.territories[id]) return null;
  const s = structuredClone(s0);
  if (s.phase === "attack" && s.attackFrom && s.attackTo) return s0;
  if (!s.living) bootLiving(s, false);
  s.selected = id;
  s.living.warning = warningFor(s, id) ?? `${TERRITORIES[id]?.name ?? id}: sin fenómeno. La biota sigue.`;
  return s;
}

function humanCanProbe(s: GameState): boolean {
  const me = s.players[s.current];
  if (!me?.isHuman) return false;
  if (s.phase !== "reinforce" && s.phase !== "attack" && s.phase !== "fortify") return false;
  if (s.attackFrom && s.attackTo) return false;
  return true;
}

export function runProbe(s0: GameState, kind: ProbeKind, id: TerritoryId): GameState | null {
  if (!humanCanProbe(s0)) return null;
  if (!s0.territories[id] || !s0.living?.biota?.[id]) return null;
  const s = structuredClone(s0);
  const b = s.living.biota[id];
  const name = TERRITORIES[id]?.name ?? id;
  const me = s.players.find((p) => p.id === s.humanId);
  if (kind === "seed" && s.territories[id].owner !== s.humanId) return null;
  if (kind === "survey") {
    const g = b.genome;
    const line = `Sondeo ${name}: ác ${g.acid} cal ${g.heat} rad ${g.radiation} pre ${g.pressure} soc ${g.social} sin ${g.synthetic} · pop ${b.pop} esp ${b.spores}`;
    s.living.lastProbe = { kind, territory: id, line };
    s.living.probes += 1;
    s.living.warning = warningFor(s, id);
    s.selected = id;
    s.log = [line, ...s.log].slice(0, 18);
    return s;
  }
  if (kind === "sample") {
    const before = b.pop;
    b.pop = clamp(b.pop - 2, 0, 100);
    b.spores = clamp(b.spores + 1, 0, 100);
    if (b.pop <= 0) {
      b.spores = Math.max(b.spores, 3);
      if (!s.living.tombs.some((t) => t.territory === id)) {
        s.living.tombs = [...s.living.tombs, { territory: id, day: s.day, note: `${name}: muestra hasta la tumba.` }].slice(-24);
      }
    }
    const line = `Muestra ${name}: población ${before}→${b.pop}. Esporas ${b.spores}.`;
    pushPatch(s, { kind: "spore", target: id, before: `pop:${before}`, after: `pop:${b.pop}`, reason: "Sonda de muestra." });
    s.living.lastProbe = { kind, territory: id, line };
    s.living.probes += 1;
    s.selected = id;
    s.living.warning = warningFor(s, id);
    s.log = [line, ...s.log].slice(0, 18);
    return s;
  }
  const axis = FACTION_AXIS[me?.faction ?? "ceniza"];
  const before = b.genome[axis];
  b.genome[axis] = clamp(before + 8);
  b.pop = clamp(b.pop + 6, 0, 100);
  b.spores = clamp(b.spores + 2, 0, 100);
  const line = `Siembra ${name}: ${axis} ${before}→${b.genome[axis]}. La facción deja genoma, no bandera.`;
  pushPatch(s, { kind: "genome", target: id, before: `${axis}:${before}`, after: `${axis}:${b.genome[axis]}`, reason: "Sonda de siembra." });
  s.living.lastProbe = { kind, territory: id, line };
  s.living.probes += 1;
  s.selected = id;
  s.living.warning = warningFor(s, id);
  s.log = [line, ...s.log].slice(0, 18);
  rememberAction(s, s.humanId, "PROBE_SEED", { target: id, after: axis });
  return s;
}

export function sealCycle(s: GameState) {
  if (!s.living) return;
  const won = s.winner === s.humanId;
  const row: RetentionRow = {
    seed: s.seed,
    day: s.day,
    won,
    probes: s.living.probes,
    scars: s.scars.length,
    doctrine: s.living.doctrine,
    generation: s.living.generation,
  };
  const next = [...loadRetention(), row].slice(-RETENTION_MAX);
  saveRetention(next);
  saveMind({ generation: s.living.generation, tombs: s.living.tombs });
}

export function livingStats(s: GameState) {
  const rows = Object.values(s.living?.biota ?? {});
  return {
    pop: rows.reduce((n, b) => n + b.pop, 0),
    spores: rows.reduce((n, b) => n + b.spores, 0),
    scars: s.scars.length,
    gen: s.living?.generation ?? 1,
    doctrine: s.living?.doctrine ?? "NORMAL",
    games: s.living?.gamesRemembered ?? 0,
    probes: s.living?.probes ?? 0,
  };
}

export function memoryBundle(s: GameState) {
  return {
    kind: "VOIDCROWN_MEM",
    version: 1,
    seed: s.seed,
    day: s.day,
    living: s.living,
    memory: s.memory,
    scars: s.scars,
    chronicle: s.chronicle,
    mutations: s.mutations,
  };
}

export function importMemoryBundle(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const bag = raw as { kind?: string; living?: LivingState };
  if (bag.kind !== "VOIDCROWN_MEM" || !bag.living) return false;
  saveMind({ generation: bag.living.generation ?? 1, tombs: bag.living.tombs ?? [] });
  return true;
}

export const GENOME_AXES = AXES;
export const RETENTION_LIMIT = RETENTION_MAX;
