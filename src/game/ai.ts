import { CONTINENTS, TERRITORIES } from "./map";
import {
  beginAttack,
  canTrade,
  continentOwner,
  currentPlayer,
  finishReinforce,
  fortify,
  ownedIds,
  placeArmy,
  rollCombat,
  skipFortify,
  tradeCards,
} from "./engine";
import type { Difficulty, GameState, TerritoryId } from "./types";
import { VOID_ID } from "./factions";

function threshold(d: Difficulty, voidActor: boolean): number {
  if (voidActor) return 0;
  if (d === "recruta") return 3;
  if (d === "diazero") return 1;
  return 2;
}

function borderScore(s: GameState, id: TerritoryId): number {
  const t = s.territories[id];
  const pid = currentPlayer(s).id;
  if (t.owner !== pid) return -1;
  let enemies = 0;
  let weakest = 99;
  for (const n of TERRITORIES[id].neighbors) {
    const o = s.territories[n];
    if (o.owner !== pid) {
      enemies += 1;
      weakest = Math.min(weakest, o.armies);
    }
  }
  if (enemies === 0) return 0;
  return enemies * 4 + t.armies - weakest;
}

function almostContinent(s: GameState, pid: string): TerritoryId | null {
  for (const c of CONTINENTS) {
    if (continentOwner(s, c.id) === pid) continue;
    const missing = c.members.filter((id) => s.territories[id].owner !== pid);
    if (missing.length === 1) return missing[0];
  }
  return null;
}

function bestPlace(s: GameState): TerritoryId | null {
  const mine = ownedIds(s, currentPlayer(s).id);
  if (!mine.length) return null;
  let best = mine[0];
  let score = -999;
  for (const id of mine) {
    const sc = borderScore(s, id);
    if (sc > score) {
      score = sc;
      best = id;
    }
  }
  return best;
}

export type AiStep =
  | { kind: "state"; state: GameState; delay: number }
  | { kind: "done"; state: GameState };

function think(s: GameState, obs: string, dec: string, reason: string, target: TerritoryId | null = null) {
  s.edai = { ...s.edai, obs, dec, reason, lastTarget: target };
}

export function stepAi(s0: GameState): AiStep {
  let s = s0;
  const p = currentPlayer(s);
  if (!p.alive || p.isHuman || s.phase === "over") return { kind: "done", state: s };

  if (s.phase !== "ai" && s.phase !== "transfer") {
    return { kind: "done", state: s };
  }

  if (canTrade(p.cards) && p.cards.length >= 3) {
    const traded = tradeCards(s);
    if (traded) {
      think(traded, `${p.name} tiene ${p.cards.length} cartas.`, "Canjear set.", "El bono de set supera un refuerzo suelto.");
      return { kind: "state", state: traded, delay: 280 };
    }
  }

  if (s.armiesToPlace > 0) {
    const id = bestPlace(s);
    if (id) {
      const placed = placeArmy(s, id, s.armiesToPlace);
      if (placed) s = placed;
    }
    const fin = finishReinforce(s);
    if (fin) s = fin;
    think(
      s,
      `${ownedIds(s, p.id).length} territorios propios.`,
      id ? `Apilar en ${id}.` : "Sin frente claro.",
      "Los ejércitos van al borde más débil del enemigo.",
      id,
    );
    return { kind: "state", state: s, delay: 420 };
  }

  const targetNeed = almostContinent(s, p.id);
  const mine = ownedIds(s, p.id);
  const th = threshold(s.difficulty, p.id === VOID_ID);
  type Opt = { from: TerritoryId; to: TerritoryId; ratio: number };
  const opts: Opt[] = [];
  for (const from of mine) {
    const a = s.territories[from];
    if (a.armies < 2) continue;
    for (const to of TERRITORIES[from].neighbors) {
      const d = s.territories[to];
      if (d.owner === p.id) continue;
      const ratio = a.armies - d.armies;
      const bonus = targetNeed === to ? 4 : 0;
      const waste = d.owner === "wasteland" ? 2 : 0;
      const hunt = p.id === VOID_ID && d.owner === s.humanId ? 3 : 0;
      if (ratio + bonus + waste + hunt >= th) opts.push({ from, to, ratio: ratio + bonus + waste + hunt });
    }
  }
  opts.sort((a, b) => b.ratio - a.ratio);

  if (opts.length) {
    const pick = opts[0];
    const started = beginAttack(s, pick.from, pick.to);
    if (!started) return fortifyOrEnd(s);
    const rolled = rollCombat(started);
    if (!rolled) return fortifyOrEnd(started);
    think(
      rolled,
      `Frente ${pick.from} → ${pick.to}. Diferencia ${pick.ratio}.`,
      `Atacar ${pick.to}.`,
      targetNeed === pick.to
        ? "Cierra un continente. El bono cambia la economía."
        : "La ratio de ejércitos supera el umbral de riesgo.",
      pick.to,
    );
    return { kind: "state", state: rolled, delay: 520 };
  }

  return fortifyOrEnd(s);
}

function fortifyOrEnd(s: GameState): AiStep {
  const p = currentPlayer(s);
  const mine = ownedIds(s, p.id);
  let interior: TerritoryId | null = null;
  let interiorArmies = 0;
  let front: TerritoryId | null = null;
  let frontScore = -1;
  for (const id of mine) {
    const enemies = TERRITORIES[id].neighbors.some((n) => s.territories[n].owner !== p.id);
    if (!enemies && s.territories[id].armies > interiorArmies) {
      interior = id;
      interiorArmies = s.territories[id].armies;
    }
    if (enemies) {
      const sc = borderScore(s, id);
      if (sc > frontScore) {
        frontScore = sc;
        front = id;
      }
    }
  }
  if (interior && front && interior !== front && interiorArmies > 2) {
    const moved = fortify(s, interior, front, interiorArmies - 1);
    if (moved) {
      think(moved, "Hay reservas en el interior.", `Mover a ${front}.`, "El frente necesita masa antes del próximo día.");
      return { kind: "done", state: moved };
    }
  }
  think(s, "Sin ataque rentable.", "Fortificar y pasar.", `Umbral ${threshold(s.difficulty, p.id === VOID_ID)}. Esperar refuerzos.`);
  return { kind: "done", state: skipFortify(s) };
}
