import { VOIDCROWN_THRESHOLD, syncMetrics } from "./canon";
import { VOIDCROWN, VOID_ID } from "./factions";
import { TERRITORIES, TERRITORY_LIST } from "./map";
import { rememberAction } from "./memory";
import { randInt } from "./rng";
import type { GameState, Player } from "./types";

function wasteCount(s: GameState): number {
  return Object.values(s.territories).filter((t) => t.owner === "wasteland").length;
}

export function canVoidcrownEmerge(s: GameState): boolean {
  if (s.voidcrownEmerged) return false;
  if (s.players.some((p) => p.id === VOID_ID)) return false;
  const waste = wasteCount(s);
  return (s.voidcrown >= VOIDCROWN_THRESHOLD && s.riftOpened) || (waste >= 5 && s.scars.length >= 4);
}

export function maybeEmergVoidcrown(s: GameState): boolean {
  if (!canVoidcrownEmerge(s)) return false;

  const actor: Player = {
    id: VOID_ID,
    faction: VOIDCROWN.id,
    name: VOIDCROWN.name,
    color: VOIDCROWN.color,
    isHuman: false,
    cards: [],
    alive: true,
    zeroDayUsed: true,
  };
  s.players = [...s.players, actor];
  s.voidcrownEmerged = true;
  s.voidcrownJustEmerged = true;

  const seized: string[] = [];
  for (const def of TERRITORY_LIST) {
    const st = s.territories[def.id];
    if (st.owner !== "wasteland") continue;
    st.owner = VOID_ID;
    st.armies = 3 + randInt(s, 3);
    seized.push(def.id);
  }

  const prey = TERRITORY_LIST.filter((t) => {
    const o = s.territories[t.id].owner;
    return o !== VOID_ID && o !== s.humanId && o !== "wasteland";
  }).sort((a, b) => s.territories[a.id].armies - s.territories[b.id].armies);

  const need = Math.max(0, 3 - seized.length);
  for (const t of prey.slice(0, Math.max(need, seized.length ? 2 : 3))) {
    if (s.territories[t.id].owner === VOID_ID) continue;
    s.territories[t.id].owner = VOID_ID;
    s.territories[t.id].armies = 4 + randInt(s, 3);
    seized.push(t.id);
  }

  if (!seized.length && TERRITORY_LIST.length) {
    const fallback = TERRITORY_LIST.find((t) => s.territories[t.id].owner !== s.humanId) ?? TERRITORY_LIST[0];
    s.territories[fallback.id].owner = VOID_ID;
    s.territories[fallback.id].armies = 5;
    seized.push(fallback.id);
  }

  const names = seized.slice(0, 4).map((id) => TERRITORIES[id].name).join(", ");
  s.log = [`Voidcrown emerge y reclama ${names}.`, ...s.log].slice(0, 18);
  rememberAction(s, "world", "VOIDCROWN", {
    after: VOID_ID,
    consequences: [`nace con ${seized.length} territorios`],
  });
  syncMetrics(s);
  return true;
}

export function isVoid(id: string): boolean {
  return id === VOID_ID;
}
