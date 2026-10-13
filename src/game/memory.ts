import type { GameState, MemoryRecord, PlayerId, TerritoryId } from "./types";

export function remember(
  s: GameState,
  rec: Omit<MemoryRecord, "id" | "day"> & { day?: number },
): MemoryRecord {
  const row: MemoryRecord = {
    id: `m${s.memory.length + 1}`,
    day: rec.day ?? s.day,
    actor: rec.actor,
    action: rec.action,
    target: rec.target,
    cause: rec.cause,
    before: rec.before,
    after: rec.after,
    consequences: rec.consequences,
  };
  s.memory = [...s.memory, row].slice(-240);
  return row;
}

export function rememberAction(
  s: GameState,
  actor: PlayerId | "world" | "edai",
  action: string,
  opts: {
    target?: TerritoryId;
    cause?: string[];
    before?: string;
    after?: string;
    consequences?: string[];
  } = {},
) {
  remember(s, {
    actor,
    action,
    target: opts.target,
    cause: opts.cause ?? [],
    before: opts.before ?? "",
    after: opts.after ?? "",
    consequences: opts.consequences ?? [],
  });
}

export function recordReplay(s: GameState, kind: string, args: unknown[] = []) {
  s.replay = [...s.replay, { kind, args, rng: s.rng }].slice(-800);
}

export function memoryForTerritory(s: GameState, id: TerritoryId): MemoryRecord[] {
  return s.memory.filter((m) => m.target === id);
}
