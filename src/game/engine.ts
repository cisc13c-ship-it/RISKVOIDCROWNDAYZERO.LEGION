/**
 * CHECKPOINT — lee /workspace/AGENTS.project.md y src/game/CANON.md antes de editar.
 * RISK es la raíz. Voidcrown emerge. No borres un órgano verificado.
 */
import { attackDiceCount, resolveDice, SET_BONUS } from "./combat";
import { FACTIONS, VOID_ID, doctrineReinforce } from "./factions";
import { areNeighbors, CONTINENTS, TERRITORIES, TERRITORY_LIST } from "./map";
import { nextRng, randInt } from "./rng";
import { rememberAction, recordReplay } from "./memory";
import { scarPenaltyFor, defenseBonusAt } from "./scars";
import { applyDisaster, nukeTerritory } from "./events";
import { adoptVerified, evaluateMutations, proposeMutations } from "./mutations";
import { bloomWasteland, maybeOpenRift } from "./realities";
import { maybeEmergVoidcrown } from "./voidcrown";
import { syncMetrics } from "./canon";
import type {
  CardType,
  Difficulty,
  FactionId,
  GameState,
  Player,
  PlayerId,
  Scenario,
  TerritoryId,
} from "./types";
import { SAVE_VERSION } from "./types";
import { applyLegacy } from "./legacy";
import { critiqueMutations, runCel } from "./organism";
import { bootLiving, doctrineArmyBonus, directorTick, emptyLiving, runProbe, touchWarning } from "./living";
import type { ProbeKind } from "./living";

export { nextRng, randInt };

const START_ARMIES = [40, 35, 30, 25, 20];

function clone(s: GameState): GameState {
  return structuredClone(s);
}

function pushLog(s: GameState, line: string) {
  s.log = [line, ...s.log].slice(0, 18);
}

export function ownedIds(s: GameState, pid: PlayerId): TerritoryId[] {
  return TERRITORY_LIST.filter((t) => s.territories[t.id].owner === pid).map((t) => t.id);
}

export function continentOwner(s: GameState, continentId: string): PlayerId | null {
  const c = CONTINENTS.find((x) => x.id === continentId);
  if (!c) return null;
  const first = s.territories[c.members[0]]?.owner;
  if (!first || first === "wasteland") return null;
  return c.members.every((id) => s.territories[id].owner === first) ? first : null;
}

export function reinforcementsFor(s: GameState, pid: PlayerId): number {
  const n = ownedIds(s, pid).length;
  let r = Math.max(3, Math.floor(n / 3));
  for (const c of CONTINENTS) {
    if (continentOwner(s, c.id) === pid) {
      r += c.bonus;
      if (s.mutations.some((m) => m.kind === "war_economy" && m.status === "ADOPTED")) r += 1;
    }
  }
  r = Math.max(3, r - scarPenaltyFor(s, pid));
  r += doctrineReinforce(s, pid);
  r += doctrineArmyBonus(s, pid);
  if (pid === VOID_ID) r += 2;
  return r;

}

export function playerById(s: GameState, pid: PlayerId): Player | undefined {
  return s.players.find((p) => p.id === pid);
}

export function currentPlayer(s: GameState): Player {
  return s.players[s.current];
}

export function alivePlayers(s: GameState): Player[] {
  return s.players.filter((p) => p.alive);
}

function shuffle<T>(s: GameState, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(s, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function canTrade(cards: CardType[]): boolean {
  const n = { inf: 0, cav: 0, art: 0 };
  for (const c of cards) n[c] += 1;
  if (n.inf >= 3 || n.cav >= 3 || n.art >= 3) return true;
  return n.inf >= 1 && n.cav >= 1 && n.art >= 1;
}

function removeSet(cards: CardType[]): CardType[] {
  const n = { inf: 0, cav: 0, art: 0 };
  for (const c of cards) n[c] += 1;
  let remove: CardType[] = [];
  if (n.inf >= 1 && n.cav >= 1 && n.art >= 1) remove = ["inf", "cav", "art"];
  else if (n.art >= 3) remove = ["art", "art", "art"];
  else if (n.cav >= 3) remove = ["cav", "cav", "cav"];
  else if (n.inf >= 3) remove = ["inf", "inf", "inf"];
  const next = [...cards];
  for (const r of remove) {
    const i = next.indexOf(r);
    if (i >= 0) next.splice(i, 1);
  }
  return next;
}

export function setBonusValue(index: number): number {
  return SET_BONUS[Math.min(index, SET_BONUS.length - 1)];
}

export type NewGameOpts = {
  faction: FactionId;
  opponents: number;
  difficulty: Difficulty;
  seed?: number;
  scenario?: Scenario;
  observer?: boolean;
  inherit?: boolean;
};

function emptyEdai() {
  return {
    obs: "Mapa estable. Fronteras aún humanas.",
    dec: "Observar y acumular.",
    reason: "Sin evidencia de ventaja clara.",
    attacksWon: 0,
    attacksLost: 0,
    lastTarget: null as TerritoryId | null,
  };
}

export function newGame(opts: NewGameOpts): GameState {
  const rawSeed = opts.seed ?? Math.floor(Math.random() * 0xffffffff);
  const seed = (rawSeed || 1) >>> 0;
  const scenario = opts.scenario ?? "standard";
  const humanFaction = FACTIONS.find((f) => f.id === opts.faction) ?? FACTIONS[0];
  const others = FACTIONS.filter((f) => f.id !== humanFaction.id).slice(0, opts.opponents);
  const players: Player[] = [
    {
      id: "p0",
      faction: humanFaction.id,
      name: humanFaction.name,
      color: humanFaction.color,
      isHuman: !opts.observer,
      cards: [],
      alive: true,
      zeroDayUsed: false,
    },
    ...others.map((f, i) => ({
      id: `p${i + 1}`,
      faction: f.id,
      name: f.name,
      color: f.color,
      isHuman: false,
      cards: [] as CardType[],
      alive: true,
      zeroDayUsed: false,
    })),
  ];

  const s: GameState = {
    version: SAVE_VERSION,
    seed,
    rng: seed,
    day: 1,
    difficulty: opts.difficulty,
    scenario,
    humanId: "p0",
    players,
    current: 0,
    phase: "reinforce",
    territories: {},
    selected: null,
    attackFrom: null,
    attackTo: null,
    fortifyFrom: null,
    armiesToPlace: 0,
    capturedThisTurn: false,
    pendingTransferMin: 0,
    pendingTransferMax: 0,
    setBonusIndex: 0,
    log: [],
    lastCombat: null,
    lastDisaster: null,
    winner: null,
    loseReason: null,
    trades: 0,
    memory: [],
    scars: [],
    mutations: [],
    realities: [{ id: "prime", parent: null, name: "PRIME", seed, dayBorn: 1, divergences: [] }],
    currentReality: "prime",
    genealogy: [{ id: "prime", parent: null, cause: "génesis", day: 1 }],
    singularity: scenario === "rift" ? 88 : 0,
    escalation: 0,
    voidcrown: 0,
    voidcrownEmerged: false,
    voidcrownJustEmerged: false,
    riftOpened: false,
    edai: emptyEdai(),
    replay: [],
    strikeArmed: scenario === "rift",
    eventResume: "begin",
    captures: 0,
    chronicle: [],
    cel: null,
    living: emptyLiving(),
  };

  const ids = shuffle(s, TERRITORY_LIST.map((t) => t.id));
  ids.forEach((id, i) => {
    const owner = players[i % players.length].id;
    s.territories[id] = { owner, armies: 1, hazard: null };
  });

  const pool = START_ARMIES[Math.max(0, players.length - 2)] ?? 20;
  for (const p of players) {
    let extra = pool - ownedIds(s, p.id).length;
    const mine = ownedIds(s, p.id);
    let guard = 0;
    while (extra > 0 && mine.length && guard < 800) {
      const id = mine[randInt(s, mine.length)];
      s.territories[id].armies += 1;
      extra -= 1;
      guard += 1;
    }
  }

  bootLiving(s, !!opts.inherit);

  if (scenario === "rift") {
    s.day = 8;
    applyDisaster(s);
    proposeMutations(s);
    evaluateMutations(s);
    critiqueMutations(s);
    adoptVerified(s);
    maybeOpenRift(s);
    runCel(s);
  }

  s.armiesToPlace = reinforcementsFor(s, currentPlayer(s).id);
  if (opts.inherit && !opts.observer) applyLegacy(s);
  if (opts.observer) s.phase = "ai";
  pushLog(s, `Día ${s.day}. ${currentPlayer(s).name} despliega ${s.armiesToPlace} refuerzos.`);
  rememberAction(s, "world", "GENESIS", { after: `seed ${seed}`, consequences: [`scenario ${scenario}`] });
  recordReplay(s, "newGame", [opts.faction, opts.opponents, opts.difficulty, seed, scenario]);
  syncMetrics(s);
  return s;
}

function syncAlive(s: GameState) {
  for (const p of s.players) {
    const n = ownedIds(s, p.id).length;
    if (n === 0 && p.alive) {
      p.alive = false;
      pushLog(s, `${p.name} queda fuera del mapa.`);
    }
  }
  const living = alivePlayers(s);
  const human = playerById(s, s.humanId);
  if (human && !human.alive && !optsObserver(s)) {
    s.phase = "over";
    s.winner = living[0]?.id ?? null;
    s.loseReason = "Tu facción fue borrada.";
    return;
  }
  if (living.length <= 1) {
    s.phase = "over";
    s.winner = living[0]?.id ?? null;
    if (s.winner === VOID_ID) s.loseReason = "El vacío se tragó el mapa.";
    else if (s.winner === s.humanId) s.loseReason = null;
    else s.loseReason = "El mundo cayó en otras manos.";
  }
}

function optsObserver(s: GameState): boolean {
  return s.players.every((p) => !p.isHuman);
}

export function tradeCards(s0: GameState): GameState | null {
  const s = clone(s0);
  const p = currentPlayer(s);
  if (s.phase !== "reinforce" && s.phase !== "ai") return null;
  if (!canTrade(p.cards)) return null;
  p.cards = removeSet(p.cards);
  const bonus = setBonusValue(s.setBonusIndex);
  s.setBonusIndex += 1;
  s.trades += 1;
  s.armiesToPlace += bonus;
  pushLog(s, `${p.name} canjea un set: +${bonus} ejércitos.`);
  rememberAction(s, p.id, "TRADE", { after: `+${bonus}`, consequences: [`trades ${s.trades}`] });
  recordReplay(s, "trade");
  return s;
}

export function placeArmy(s0: GameState, id: TerritoryId, n = 1): GameState | null {
  const s = clone(s0);
  if (s.phase !== "reinforce" && s.phase !== "ai") return null;
  if (s.armiesToPlace <= 0) return null;
  const t = s.territories[id];
  if (!t || t.owner !== currentPlayer(s).id) return null;
  const k = Math.min(n, s.armiesToPlace);
  t.armies += k;
  s.armiesToPlace -= k;
  s.selected = id;
  touchWarning(s);
  recordReplay(s, "place", [id, k]);
  return s;
}

export function finishReinforce(s0: GameState): GameState | null {
  const s = clone(s0);
  if (s.phase !== "reinforce" && s.phase !== "ai") return null;
  if (s.armiesToPlace > 0) return null;
  const p = currentPlayer(s);
  if (p.cards.length >= 5 && canTrade(p.cards)) return null;
  s.phase = s.phase === "ai" ? "ai" : "attack";
  s.selected = null;
  s.strikeArmed = p.isHuman && !p.zeroDayUsed && (s.day >= 5 || s.scenario === "rift") && ownedIds(s, p.id).length >= 8;
  recordReplay(s, "finishReinforce");
  return s;
}

export function beginAttack(s0: GameState, from: TerritoryId, to: TerritoryId): GameState | null {
  const s = clone(s0);
  if (s.phase !== "attack" && s.phase !== "ai") return null;
  const a = s.territories[from];
  const d = s.territories[to];
  const pid = currentPlayer(s).id;
  if (!a || !d) return null;
  if (a.owner !== pid || d.owner === pid) return null;
  if (a.armies < 2) return null;
  if (!areNeighbors(from, to)) return null;
  s.attackFrom = from;
  s.attackTo = to;
  s.selected = from;
  return s;
}

export function cancelAttack(s0: GameState): GameState {
  const s = clone(s0);
  s.attackFrom = null;
  s.attackTo = null;
  return s;
}

export function rollCombat(s0: GameState): GameState | null {
  const s = clone(s0);
  if (!s.attackFrom || !s.attackTo) return null;
  if (s.phase !== "attack" && s.phase !== "ai") return null;
  const from = s.territories[s.attackFrom];
  const to = s.territories[s.attackTo];
  if (from.armies < 2 || to.armies < 1) return null;
  const defArmies = to.armies + defenseBonusAt(s, s.attackTo);
  const dice = resolveDice(from.armies, defArmies, s.rng);
  s.rng = dice.rng;
  from.armies -= dice.attackLoss;
  to.armies -= dice.defendLoss;
  s.lastCombat = {
    from: s.attackFrom,
    to: s.attackTo,
    attackDice: dice.attackDice,
    defendDice: dice.defendDice,
    attackLoss: dice.attackLoss,
    defendLoss: dice.defendLoss,
  };
  const actor = currentPlayer(s);
  if (to.armies <= 0) {
    const victim = to.owner;
    to.armies = actor.faction === "nexo" ? 1 : 0;
    to.owner = actor.id;
    to.hazard = null;
    s.capturedThisTurn = true;
    s.captures += 1;
    const minMove = attackDiceCount(from.armies + 0) || 1;
    const maxMove = from.armies - 1;
    s.pendingTransferMin = Math.min(minMove, maxMove);
    s.pendingTransferMax = maxMove;
    if (s.phase !== "ai") s.phase = "transfer";
    pushLog(s, `${actor.name} toma ${TERRITORIES[s.attackTo].name}.`);
    rememberAction(s, actor.id, "CAPTURE", {
      target: s.attackTo,
      cause: [`from ${s.attackFrom}`],
      before: String(victim),
      after: actor.id,
      consequences: [`${TERRITORIES[s.attackTo].name} cambia de dueño`],
    });
    if (!actor.isHuman) s.edai.attacksWon += 1;
    if (victim !== "wasteland") {
      const left = ownedIds(s, victim).length;
      if (left === 0) {
        const v = playerById(s, victim);
        if (v) {
          actor.cards.push(...v.cards);
          v.cards = [];
          pushLog(s, `${actor.name} absorbe las cartas de ${v.name}.`);
        }
      }
    }
    syncAlive(s);
    if (s.winner || (!optsObserver(s) && !s.players.find((p) => p.id === s.humanId)?.alive)) return s;
    if (s.phase === "ai" && s.pendingTransferMax > 0) {
      return transferArmies(s, s.pendingTransferMax) ?? s;
    }
  } else if (!actor.isHuman && dice.attackLoss > 0 && dice.defendLoss === 0) {
    s.edai.attacksLost += 1;
  }
  recordReplay(s, "rollCombat");
  return s;
}

export function transferArmies(s0: GameState, n: number): GameState | null {
  const s = clone(s0);
  if (!s.attackFrom || !s.attackTo) return null;
  const from = s.territories[s.attackFrom];
  const to = s.territories[s.attackTo];
  const count = Math.max(s.pendingTransferMin, Math.min(s.pendingTransferMax, n));
  if (from.armies - count < 1) return null;
  from.armies -= count;
  to.armies += count;
  s.attackFrom = null;
  s.attackTo = null;
  s.pendingTransferMin = 0;
  s.pendingTransferMax = 0;
  if (s.phase === "transfer") s.phase = "attack";
  recordReplay(s, "transfer", [count]);
  return s;
}

export function finishAttack(s0: GameState): GameState {
  const s = clone(s0);
  s.attackFrom = null;
  s.attackTo = null;
  s.phase = s.phase === "ai" ? "ai" : "fortify";
  s.selected = null;
  s.fortifyFrom = null;
  s.strikeArmed = false;
  recordReplay(s, "finishAttack");
  return s;
}

function ownedPath(s: GameState, from: TerritoryId, to: TerritoryId, pid: PlayerId): boolean {
  if (from === to) return true;
  const seen = new Set<TerritoryId>([from]);
  const q: TerritoryId[] = [from];
  while (q.length) {
    const cur = q.shift()!;
    for (const n of TERRITORIES[cur].neighbors) {
      if (seen.has(n)) continue;
      if (s.territories[n].owner !== pid) continue;
      if (n === to) return true;
      seen.add(n);
      q.push(n);
    }
  }
  return false;
}

export function fortify(s0: GameState, from: TerritoryId, to: TerritoryId, n: number): GameState | null {
  const s = clone(s0);
  if (s.phase !== "fortify" && s.phase !== "ai") return null;
  const pid = currentPlayer(s).id;
  const a = s.territories[from];
  const b = s.territories[to];
  if (!a || !b || a.owner !== pid || b.owner !== pid) return null;
  if (n < 1 || a.armies - n < 1) return null;
  if (!ownedPath(s, from, to, pid)) return null;
  a.armies -= n;
  b.armies += n;
  pushLog(s, `${currentPlayer(s).name} mueve ${n} a ${TERRITORIES[to].name}.`);
  recordReplay(s, "fortify", [from, to, n]);
  return endTurn(s);
}

export function skipFortify(s0: GameState): GameState {
  recordReplay(s0, "skipFortify");
  return endTurn(clone(s0));
}

function drawCard(s: GameState) {
  if (!s.capturedThisTurn) return;
  const types: CardType[] = ["inf", "cav", "art"];
  const card = types[randInt(s, 3)];
  currentPlayer(s).cards.push(card);
  pushLog(s, `${currentPlayer(s).name} obtiene una carta.`);
}

function nextAliveIndex(s: GameState, from: number): number {
  for (let i = 1; i <= s.players.length; i++) {
    const idx = (from + i) % s.players.length;
    if (s.players[idx].alive) return idx;
  }
  return from;
}

export function endTurn(s0: GameState): GameState {
  const s = clone(s0);
  drawCard(s);
  s.capturedThisTurn = false;
  s.selected = null;
  s.attackFrom = null;
  s.attackTo = null;
  s.fortifyFrom = null;
  s.lastCombat = null;
  s.strikeArmed = false;
  if (s.winner) {
    s.phase = "over";
    return s;
  }

  const prev = s.current;
  const next = nextAliveIndex(s, prev);
  const lastAliveId = alivePlayers(s).at(-1)?.id;
  const wrapped = s.players[prev].id === lastAliveId;

  s.current = next;
  if (wrapped) {
    s.day += 1;
    bloomWasteland(s);
    applyDisaster(s);
    directorTick(s);
    proposeMutations(s);
    evaluateMutations(s);
    critiqueMutations(s);
    adoptVerified(s);
    const rift = maybeOpenRift(s);
    maybeEmergVoidcrown(s);
    runCel(s);
    syncAlive(s);
    syncMetrics(s);
    s.eventResume = "begin";
    if (!s.winner) s.phase = "event";
    if (rift) pushLog(s, "La historia se parte. Una realidad hija queda activa.");
    if (s.voidcrownJustEmerged) pushLog(s, "Voidcrown ha nacido de las grietas.");
  }

  if (s.winner) {
    s.phase = "over";
    return s;
  }
  if (s.phase !== "event") beginTurn(s);
  return s;
}

export function beginTurn(s: GameState) {
  const p = currentPlayer(s);
  s.armiesToPlace = reinforcementsFor(s, p.id);
  s.phase = p.isHuman ? "reinforce" : "ai";
  s.selected = null;
  pushLog(s, `Día ${s.day}. ${p.name} recibe ${s.armiesToPlace} refuerzos.`);
}

export function dismissEvent(s0: GameState): GameState {
  const s = clone(s0);
  if (s.phase !== "event") return s;
  if (s.eventResume === "fortify") {
    s.phase = "fortify";
    s.selected = null;
    s.attackFrom = null;
    s.attackTo = null;
    s.strikeArmed = false;
    s.eventResume = "begin";
    return s;
  }
  beginTurn(s);
  return s;
}

export function zeroDayStrike(s0: GameState, id: TerritoryId): GameState | null {
  const s = clone(s0);
  const p = currentPlayer(s);
  if (!p.isHuman || p.zeroDayUsed) return null;
  if (s.phase !== "attack") return null;
  const t = s.territories[id];
  if (!t || t.owner === p.id) return null;
  if (!s.strikeArmed) return null;
  p.zeroDayUsed = true;
  s.strikeArmed = false;
  nukeTerritory(s, id);
  directorTick(s);
  s.phase = "event";
  s.eventResume = "fortify";
  rememberAction(s, p.id, "ZERO_DAY", { target: id, consequences: ["nuclear scar"] });
  recordReplay(s, "zeroDay", [id]);
  syncAlive(s);
  return s;
}

export function clickTerritory(s0: GameState, id: TerritoryId): GameState | null {
  const s = clone(s0);
  const t = s.territories[id];
  if (!t) return null;
  const me = currentPlayer(s);
  if (!me.isHuman) return null;
  if (s.phase === "reinforce") {
    return placeArmy(s0, id, 1);
  }
  if (s.phase === "attack") {
    if (s.attackFrom && s.attackTo) return s;
    if (t.owner === me.id) {
      if (t.armies < 2) {
        s.selected = id;
        s.attackFrom = null;
        return s;
      }
      s.selected = id;
      s.attackFrom = id;
      s.attackTo = null;
      touchWarning(s);
      return s;
    }
    if (s.attackFrom && areNeighbors(s.attackFrom, id) && t.owner !== me.id) {
      return beginAttack(s0, s.attackFrom, id);
    }
    s.selected = id;
    touchWarning(s);
    return s;
  }
  if (s.phase === "fortify") {
    if (t.owner !== me.id) return s;
    if (!s.fortifyFrom) {
      s.fortifyFrom = id;
      s.selected = id;
      touchWarning(s);
      return s;
    }
    if (s.fortifyFrom === id) {
      s.fortifyFrom = null;
      s.selected = null;
      return s;
    }
    s.selected = id;
    touchWarning(s);
    return s;
  }
  return s;
}

export function legalAttackTargets(s: GameState, from: TerritoryId): TerritoryId[] {
  const t = s.territories[from];
  if (!t || t.owner !== currentPlayer(s).id || t.armies < 2) return [];
  return TERRITORIES[from].neighbors.filter((n) => s.territories[n].owner !== t.owner);
}

export function canZeroDay(s: GameState): boolean {
  const p = currentPlayer(s);
  return !!(
    p.isHuman &&
    s.phase === "attack" &&
    s.strikeArmed &&
    !p.zeroDayUsed &&
    s.selected &&
    s.territories[s.selected].owner !== p.id
  );
}

export function probeTerritory(s0: GameState, kind: ProbeKind, id: TerritoryId): GameState | null {
  return runProbe(s0, kind, id);
}

export function armyTotal(s: GameState, pid: PlayerId): number {
  return ownedIds(s, pid).reduce((n, id) => n + s.territories[id].armies, 0);
}
