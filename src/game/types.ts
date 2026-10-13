import type { LivingState } from "./living";

export const SAVE_VERSION = 5 as const;
export const SAVE_KEY = "rzd-save-v5";
export const SAVE_KEY_V4 = "rzd-save-v4";
export const SAVE_KEY_V3 = "rzd-save-v3";
export const SAVE_KEY_V2 = "rzd-save-v2";
export const SAVE_KEY_V1 = "rzd-save-v1";
export const SETTINGS_KEY = "rzd-settings-v1";

export type Difficulty = "recruta" | "veterano" | "diazero";
export type Phase = "reinforce" | "attack" | "fortify" | "transfer" | "ai" | "event" | "over";
export type CardType = "inf" | "cav" | "art";
export type DisasterKind =
  | "impacto"
  | "nuclear"
  | "incendio"
  | "tormenta"
  | "tsunami"
  | "pandemia"
  | "emp"
  | "volcan"
  | "sismo";
export type Screen = "cinematic" | "title" | "how" | "play" | "lab";
export type MapView = "globe" | "tactical";
export type Scenario = "standard" | "rift";

export type ContinentId = "na" | "sa" | "eu" | "af" | "as" | "oc";
export type PlayerId = string;
export type FactionId = "ceniza" | "marea" | "nexo" | "horda" | "umbral" | "voidcrown";
export type TerritoryId = string;

export type MutationKind = "ash_winter" | "hardened_fronts" | "wasteland_bloom" | "war_economy" | "rift_bleed";
export type MutationStatus =
  | "CANDIDATE"
  | "SIMULATING"
  | "TESTED"
  | "VERIFIED"
  | "ADOPTED"
  | "REJECTED"
  | "ROLLED_BACK";

export type Player = {
  id: PlayerId;
  faction: FactionId;
  name: string;
  color: string;
  isHuman: boolean;
  cards: CardType[];
  alive: boolean;
  zeroDayUsed: boolean;
};

export type TerritoryState = {
  owner: PlayerId | "wasteland";
  armies: number;
  hazard: DisasterKind | null;
};

export type CombatSnap = {
  from: TerritoryId;
  to: TerritoryId;
  attackDice: number[];
  defendDice: number[];
  attackLoss: number;
  defendLoss: number;
};

export type DisasterEvent = {
  kind: DisasterKind;
  name: string;
  flavor: string;
  image: string;
  hits: { id: TerritoryId; killed: number }[];
  combo: string[];
};

export type MemoryRecord = {
  id: string;
  day: number;
  actor: PlayerId | "world" | "edai";
  action: string;
  target?: TerritoryId;
  cause: string[];
  before: string;
  after: string;
  consequences: string[];
};

export type Scar = {
  id: string;
  territory: TerritoryId;
  kind: DisasterKind;
  day: number;
  reinforcePenalty: number;
  defenseBonus: number;
};

export type Mutation = {
  id: string;
  parent: string | null;
  kind: MutationKind;
  cause: string;
  status: MutationStatus;
  evidence: string;
  day: number;
  result?: string;
};

export type Reality = {
  id: string;
  parent: string | null;
  name: string;
  seed: number;
  dayBorn: number;
  divergences: string[];
};

export type GenealogyNode = {
  id: string;
  parent: string | null;
  cause: string;
  day: number;
};

export type EdaiMind = {
  obs: string;
  dec: string;
  reason: string;
  attacksWon: number;
  attacksLost: number;
  lastTarget: TerritoryId | null;
};

export type ReplayAction = {
  kind: string;
  args: unknown[];
  rng: number;
};

export type GameState = {
  version: typeof SAVE_VERSION;
  seed: number;
  rng: number;
  day: number;
  difficulty: Difficulty;
  scenario: Scenario;
  humanId: PlayerId;
  players: Player[];
  current: number;
  phase: Phase;
  territories: Record<TerritoryId, TerritoryState>;
  selected: TerritoryId | null;
  attackFrom: TerritoryId | null;
  attackTo: TerritoryId | null;
  fortifyFrom: TerritoryId | null;
  armiesToPlace: number;
  capturedThisTurn: boolean;
  pendingTransferMin: number;
  pendingTransferMax: number;
  setBonusIndex: number;
  log: string[];
  lastCombat: CombatSnap | null;
  lastDisaster: DisasterEvent | null;
  winner: PlayerId | null;
  loseReason: string | null;
  trades: number;
  captures: number;
  memory: MemoryRecord[];
  scars: Scar[];
  mutations: Mutation[];
  realities: Reality[];
  currentReality: string;
  genealogy: GenealogyNode[];
  singularity: number;
  escalation: number;
  voidcrown: number;
  voidcrownEmerged: boolean;
  voidcrownJustEmerged: boolean;
  riftOpened: boolean;
  edai: EdaiMind;
  replay: ReplayAction[];
  strikeArmed: boolean;
  eventResume: "begin" | "fortify";
  chronicle: string[];
  cel: {
    observation: string;
    hypothesis: string;
    status: "HIPOTESIS";
    day: number;
  } | null;
  living: LivingState;
};

export type Settings = {
  muted: boolean;
  reducedShake: boolean;
  mapView: MapView;
};

export const DEFAULT_SETTINGS: Settings = {
  muted: false,
  reducedShake: false,
  mapView: "globe",
};
