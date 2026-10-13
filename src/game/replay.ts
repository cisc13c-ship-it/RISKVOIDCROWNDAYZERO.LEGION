import {
  finishAttack,
  finishReinforce,
  fortify,
  newGame,
  placeArmy,
  rollCombat,
  skipFortify,
  tradeCards,
  transferArmies,
  zeroDayStrike,
} from "./engine";
import { VOID_ID } from "./factions";
import type { Difficulty, FactionId, GameState, Scenario, TerritoryId } from "./types";

export function reconstructInitial(s: GameState): GameState {
  return newGame({
    faction: (s.players.find((p) => p.id === s.humanId)?.faction ?? "ceniza") as FactionId,
    opponents: Math.max(1, s.players.filter((p) => p.id !== VOID_ID && !p.isHuman).length),
    difficulty: s.difficulty,
    seed: s.seed,
    scenario: s.scenario,
    inherit: false,
  });
}

export function applyReplay(kind: string, args: unknown[], state: GameState): GameState {
  switch (kind) {
    case "newGame":
      return newGame({
        faction: args[0] as FactionId,
        opponents: Number(args[1]),
        difficulty: args[2] as Difficulty,
        seed: Number(args[3]),
        scenario: (args[4] as Scenario) ?? "standard",
        inherit: false,
      });
    case "place": {
      const next = placeArmy(state, args[0] as TerritoryId, Number(args[1] ?? 1));
      return next ?? state;
    }
    case "trade":
      return tradeCards(state) ?? state;
    case "finishReinforce":
      return finishReinforce(state) ?? state;
    case "rollCombat":
      return rollCombat(state) ?? state;
    case "transfer":
      return transferArmies(state, Number(args[0] ?? 1)) ?? state;
    case "finishAttack":
      return finishAttack(state);
    case "fortify": {
      const next = fortify(state, args[0] as TerritoryId, args[1] as TerritoryId, Number(args[2]));
      return next ?? state;
    }
    case "skipFortify":
      return skipFortify(state);
    case "zeroDay":
      return zeroDayStrike(state, args[0] as TerritoryId) ?? state;
    default:
      return state;
  }
}

export function runReplay(actions: GameState["replay"]): GameState | null {
  if (!actions.length) return null;
  const first = actions[0];
  if (first.kind !== "newGame") return null;
  let s = applyReplay(first.kind, first.args, {} as GameState);
  for (const a of actions.slice(1)) {
    s = applyReplay(a.kind, a.args, s);
  }
  return s;
}
