import { TERRITORIES } from "./map";
import type { DisasterKind, GameState, PlayerId, Scar, TerritoryId } from "./types";

export function addScar(s: GameState, territory: TerritoryId, kind: DisasterKind): Scar {
  const existing = s.scars.find((c) => c.territory === territory && c.kind === kind);
  if (existing) {
    existing.reinforcePenalty = Math.min(2, existing.reinforcePenalty + 1);
    return existing;
  }
  const scar: Scar = {
    id: `s${s.scars.length + 1}`,
    territory,
    kind,
    day: s.day,
    reinforcePenalty: kind === "nuclear" || kind === "impacto" ? 1 : 0,
    defenseBonus: kind === "incendio" || kind === "emp" ? 0 : kind === "nuclear" ? 1 : 0,
  };
  s.scars = [...s.scars, scar];
  return scar;
}

export function scarsOn(s: GameState, id: TerritoryId): Scar[] {
  return s.scars.filter((c) => c.territory === id);
}

export function scarPenaltyFor(s: GameState, pid: PlayerId): number {
  let n = 0;
  for (const scar of s.scars) {
    if (s.territories[scar.territory]?.owner === pid) n += scar.reinforcePenalty;
  }
  if (s.mutations.some((m) => m.kind === "ash_winter" && m.status === "ADOPTED")) n += 1;
  return n;
}

export function defenseBonusAt(s: GameState, id: TerritoryId): number {
  let b = 0;
  for (const scar of scarsOn(s, id)) b += scar.defenseBonus;
  if (s.mutations.some((m) => m.kind === "hardened_fronts" && m.status === "ADOPTED") && scarsOn(s, id).length) {
    b += 1;
  }
  const owner = s.territories[id]?.owner;
  const p = s.players.find((x) => x.id === owner);
  if (p?.faction === "ceniza" && scarsOn(s, id).length) b += 1;
  return b;
}

export function scarLabel(scar: Scar): string {
  const t = TERRITORIES[scar.territory];
  return `${t?.name ?? scar.territory} · ${scar.kind} · día ${scar.day}`;
}
