/**
 * CAPÍTULO I — La caja no olvida.
 * Una cicatriz sobrevive al fin de partida. No es un save completo.
 */
import { TERRITORIES } from "./map";
import { rememberAction } from "./memory";
import { addScar } from "./scars";
import type { DisasterKind, GameState, TerritoryId } from "./types";

export const LEGACY_KEY = "rzd-legacy-v1";

export type WorldLegacy = {
  territory: TerritoryId;
  kind: DisasterKind;
  fromSeed: number;
  fromDay: number;
};

type Store = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

let injected: Store | null = null;

export function setLegacyStore(store: Store | null) {
  injected = store;
}

function store(): Store | null {
  if (injected) return injected;
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

export function sealLegacy(s: GameState): WorldLegacy | null {
  const scar = s.scars[0];
  if (!scar) return null;
  const payload: WorldLegacy = {
    territory: scar.territory,
    kind: scar.kind,
    fromSeed: s.seed,
    fromDay: s.day,
  };
  const api = store();
  if (api) {
    try {
      api.setItem(LEGACY_KEY, JSON.stringify(payload));
    } catch {
      /* quota */
    }
  }
  return payload;
}

export function loadLegacy(): WorldLegacy | null {
  const api = store();
  if (!api) return null;
  try {
    const raw = api.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorldLegacy;
    if (!parsed.territory || !parsed.kind) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function applyLegacy(s: GameState): boolean {
  const legacy = loadLegacy();
  if (!legacy) return false;
  const t = s.territories[legacy.territory];
  if (!t) return false;
  addScar(s, legacy.territory, legacy.kind);
  t.hazard = legacy.kind;
  if (t.armies > 1) t.armies -= 1;
  const name = TERRITORIES[legacy.territory]?.name ?? legacy.territory;
  s.log = [`La caja no olvidó ${name}.`, ...s.log].slice(0, 18);
  rememberAction(s, "world", "LEGACY_SCAR", {
    target: legacy.territory,
    after: legacy.kind,
    consequences: [`heredada de seed ${legacy.fromSeed} día ${legacy.fromDay}`],
  });
  return true;
}
