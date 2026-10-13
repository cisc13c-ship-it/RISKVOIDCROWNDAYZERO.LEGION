import type { GameState, Settings } from "./types";
import { DEFAULT_SETTINGS, SAVE_KEY, SAVE_KEY_V1, SAVE_KEY_V2, SAVE_KEY_V3, SAVE_KEY_V4, SAVE_VERSION, SETTINGS_KEY } from "./types";
import { VOID_ID } from "./factions";
import { ensureLiving } from "./living";

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function migrate(raw: unknown): GameState | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Partial<GameState> & { territories?: GameState["territories"]; players?: GameState["players"] };
  if (!parsed.territories || !parsed.players) return null;
  const hasVoid = parsed.players.some((p) => p.id === VOID_ID);
  const state: GameState = {
    version: SAVE_VERSION,
    seed: parsed.seed ?? 1,
    rng: parsed.rng ?? parsed.seed ?? 1,
    day: parsed.day ?? 1,
    difficulty: parsed.difficulty ?? "veterano",
    scenario: parsed.scenario ?? "standard",
    humanId: parsed.humanId ?? "p0",
    players: parsed.players,
    current: parsed.current ?? 0,
    phase: parsed.phase ?? "reinforce",
    territories: parsed.territories,
    selected: parsed.selected ?? null,
    attackFrom: parsed.attackFrom ?? null,
    attackTo: parsed.attackTo ?? null,
    fortifyFrom: parsed.fortifyFrom ?? null,
    armiesToPlace: parsed.armiesToPlace ?? 0,
    capturedThisTurn: parsed.capturedThisTurn ?? false,
    pendingTransferMin: parsed.pendingTransferMin ?? 0,
    pendingTransferMax: parsed.pendingTransferMax ?? 0,
    setBonusIndex: parsed.setBonusIndex ?? 0,
    log: parsed.log ?? [],
    lastCombat: parsed.lastCombat ?? null,
    lastDisaster: parsed.lastDisaster ?? null,
    winner: parsed.winner ?? null,
    loseReason: parsed.loseReason ?? null,
    trades: parsed.trades ?? 0,
    captures: parsed.captures ?? 0,
    memory: parsed.memory ?? [],
    scars: parsed.scars ?? [],
    mutations: parsed.mutations ?? [],
    realities: parsed.realities ?? [],
    currentReality: parsed.currentReality ?? "prime",
    genealogy: parsed.genealogy ?? [],
    singularity: parsed.singularity ?? 0,
    escalation: parsed.escalation ?? 0,
    voidcrown: parsed.voidcrown ?? 0,
    voidcrownEmerged: !!(parsed.voidcrownEmerged && hasVoid),
    voidcrownJustEmerged: parsed.voidcrownJustEmerged ?? false,
    riftOpened: parsed.riftOpened ?? false,
    edai: parsed.edai ?? {
      obs: "Mapa cargado.",
      dec: "Observar.",
      reason: "Partida restaurada.",
      attacksWon: 0,
      attacksLost: 0,
      lastTarget: null,
    },
    replay: parsed.replay ?? [],
    strikeArmed: parsed.strikeArmed ?? false,
    eventResume: parsed.eventResume ?? "begin",
    chronicle: Array.isArray(parsed.chronicle) ? parsed.chronicle : [],
    cel: parsed.cel ?? null,
    living: parsed.living ?? {
      biota: {},
      doctrine: "NORMAL",
      patches: [],
      generation: 1,
      tombs: [],
      probes: 0,
      lastProbe: null,
      warning: null,
      retentionNote: "",
      gamesRemembered: 0,
      retentionWins: 0,
      retentionLosses: 0,
    },
  };
  ensureLiving(state);
  return state;
}

export function saveGame(state: GameState) {
  if (!canStore()) return;
  try {
    const payload = JSON.stringify({ ...state, version: SAVE_VERSION });
    localStorage.setItem(SAVE_KEY, payload);
    localStorage.setItem(`${SAVE_KEY}.bak`, payload);
  } catch {
    /* private mode / quota */
  }
}

export function loadGame(): GameState | null {
  if (!canStore()) return null;
  try {
    const raw =
      localStorage.getItem(SAVE_KEY) ??
      localStorage.getItem(`${SAVE_KEY}.bak`) ??
      localStorage.getItem(SAVE_KEY_V4) ??
      localStorage.getItem(SAVE_KEY_V3) ??
      localStorage.getItem(SAVE_KEY_V2) ??
      localStorage.getItem(SAVE_KEY_V1);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearSave() {
  if (!canStore()) return;
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(`${SAVE_KEY}.bak`);
    localStorage.removeItem(SAVE_KEY_V4);
    localStorage.removeItem(SAVE_KEY_V3);
    localStorage.removeItem(SAVE_KEY_V2);
    localStorage.removeItem(SAVE_KEY_V1);
  } catch {
    /* ignore */
  }
}

export function loadSettings(): Settings {
  if (!canStore()) return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Settings) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: Settings) {
  if (!canStore()) return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}
