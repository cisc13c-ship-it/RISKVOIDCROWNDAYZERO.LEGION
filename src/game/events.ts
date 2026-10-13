import { syncMetrics } from "./canon";
import { TERRITORIES, TERRITORY_LIST } from "./map";
import { rememberAction } from "./memory";
import { randInt } from "./rng";
import { addScar } from "./scars";
import { rescueSoak, selectByCatastrophe } from "./living";
import type { DisasterKind, GameState, TerritoryId } from "./types";

export type KindDef = {
  kind: DisasterKind;
  name: string;
  flavor: string;
  image: string;
  dmg: [number, number];
  coastal: boolean;
  combo: string;
  sing: number;
};

const KINDS: KindDef[] = [
  { kind: "impacto", name: "Impacto", flavor: "Un cuerpo entra en el mar. El anillo se traga costas.", image: "/game/impact.jpg", dmg: [4, 9], coastal: true, combo: "impacto", sing: 14 },
  { kind: "nuclear", name: "Fuego nuclear", flavor: "Un hongo se abre sobre el continente.", image: "/game/nuke.jpg", dmg: [5, 11], coastal: false, combo: "nuclear", sing: 18 },
  { kind: "incendio", name: "Incendio", flavor: "Las ciudades arden de costa a interior.", image: "/game/fire.jpg", dmg: [2, 6], coastal: false, combo: "fuego", sing: 8 },
  { kind: "tormenta", name: "Tormenta", flavor: "Ciclón y tornados parten el frente.", image: "/game/storm.jpg", dmg: [2, 5], coastal: true, combo: "clima", sing: 8 },
  { kind: "tsunami", name: "Tsunami", flavor: "La marea entra kilómetros tierra adentro.", image: "/game/impact.jpg", dmg: [3, 7], coastal: true, combo: "agua", sing: 10 },
  { kind: "pandemia", name: "Pandemia", flavor: "El contagio viaja por los corredores.", image: "/game/city.jpg", dmg: [2, 4], coastal: false, combo: "bio", sing: 9 },
  { kind: "emp", name: "Pulso", flavor: "La red cae. Los enclaves quedan a oscuras.", image: "/game/strikes.jpg", dmg: [1, 3], coastal: false, combo: "emp", sing: 11 },
  { kind: "volcan", name: "Volcán", flavor: "La corteza se abre. Ceniza y lava cortan el continente.", image: "/game/fire.jpg", dmg: [3, 8], coastal: false, combo: "fuego", sing: 12 },
  { kind: "sismo", name: "Sismo", flavor: "La falla corre bajo las ciudades. Los puentes ceden.", image: "/game/strikes.jpg", dmg: [2, 6], coastal: false, combo: "tierra", sing: 9 },
];

function ashBonus(s: GameState): number {
  return s.mutations.some((m) => m.kind === "ash_winter" && m.status === "ADOPTED") ? 1 : 0;
}

function bleed(s: GameState): boolean {
  return s.mutations.some((m) => m.kind === "rift_bleed" && m.status === "ADOPTED");
}

export function applyDisaster(s: GameState): void {
  const extra = s.difficulty === "diazero" || s.day >= 8 ? 1 : 0;
  const count = 1 + extra + (s.day >= 14 ? 1 : 0);
  const hits: { id: TerritoryId; killed: number }[] = [];
  const combos: string[] = [];
  let last = KINDS[randInt(s, KINDS.length)];
  for (let n = 0; n < count; n++) {
    last = KINDS[randInt(s, KINDS.length)];
    combos.push(last.combo);
    const pool = last.coastal ? TERRITORY_LIST.filter((t) => t.coastal) : TERRITORY_LIST;
    const id = pool[randInt(s, pool.length)].id;
    strikeTerritory(s, id, last, hits);
    if (bleed(s)) {
      const neigh = TERRITORIES[id].neighbors;
      if (neigh.length) strikeTerritory(s, neigh[randInt(s, neigh.length)], last, hits);
    }
    s.singularity = Math.min(140, s.singularity + last.sing);
  }
  s.lastDisaster = {
    kind: last.kind,
    name: last.name,
    flavor: last.flavor,
    image: last.image,
    hits,
    combo: [...new Set(combos)],
  };
  const names = hits.map((h) => `${TERRITORIES[h.id].name} (−${h.killed})`).join(", ");
  s.log = [`${last.name}: ${names}.`, ...s.log].slice(0, 18);
  rememberAction(s, "world", "DISASTER", {
    cause: combos,
    after: last.kind,
    consequences: hits.map((h) => `${h.id}:-${h.killed}`),
  });
  syncMetrics(s);
}

export function strikeTerritory(s: GameState, id: TerritoryId, def: KindDef, hits: { id: TerritoryId; killed: number }[]) {
  const t = s.territories[id];
  if (!t) return;
  const raw = def.dmg[0] + randInt(s, def.dmg[1] - def.dmg[0] + 1) + ashBonus(s);
  const owner = s.players.find((p) => p.id === t.owner);
  const soak = (owner?.faction === "umbral" ? 1 : 0) + rescueSoak(s, t.owner);
  const dmg = Math.max(0, raw - soak);
  const killed = Math.min(t.armies, dmg);
  t.armies -= killed;
  t.hazard = def.kind;
  addScar(s, id, def.kind);
  selectByCatastrophe(s, id, def.kind, killed);
  if (t.armies <= 0) {
    t.armies = 1;
    t.owner = "wasteland";
  }
  hits.push({ id, killed });
}

export function nukeTerritory(s: GameState, id: TerritoryId) {
  const def = KINDS.find((k) => k.kind === "nuclear")!;
  const hits: { id: TerritoryId; killed: number }[] = [];
  strikeTerritory(s, id, def, hits);
  for (const n of TERRITORIES[id].neighbors.slice(0, 2)) {
    strikeTerritory(s, n, { ...def, dmg: [2, 4] }, hits);
  }
  s.singularity = Math.min(140, s.singularity + 22);
  s.lastDisaster = {
    kind: "nuclear",
    name: def.name,
    flavor: def.flavor,
    image: def.image,
    hits,
    combo: ["nuclear", "zero-day"],
  };
  s.log = [`Zero Day sobre ${TERRITORIES[id].name}.`, ...s.log].slice(0, 18);
  rememberAction(s, "world", "NUKE", {
    target: id,
    consequences: hits.map((h) => `${h.id}:-${h.killed}`),
  });
  syncMetrics(s);
}

export const DISASTER_KINDS = KINDS;
