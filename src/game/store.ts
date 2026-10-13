import { create } from "zustand";
import { stepAi } from "./ai";
import { sfxBoom, sfxCapture, sfxClick, sfxDice, sfxHit, sfxLose, sfxPlace, sfxWin, setMuted, unlockAudio } from "./audio";
import {
  cancelAttack,
  clickTerritory,
  currentPlayer,
  dismissEvent,
  finishAttack,
  finishReinforce,
  fortify,
  legalAttackTargets,
  newGame,
  placeArmy,
  rollCombat,
  skipFortify,
  tradeCards,
  transferArmies,
  zeroDayStrike,
  probeTerritory,
} from "./engine";
import { focusPhenomenon, sealCycle } from "./living";
import type { ProbeKind } from "./living";
import { clearSave, loadGame, loadSettings, saveGame, saveSettings } from "./save";
import { sealLegacy } from "./legacy";
import { loadIntro, saveIntro } from "./cinematic-save";
import { markIntroComplete, shouldForceIntro } from "./cinematic";
import type { Difficulty, FactionId, GameState, MapView, Scenario, Screen, Settings, TerritoryId } from "./types";

type Store = {
  screen: Screen;
  game: GameState | null;
  settings: Settings;
  hasSave: boolean;
  aiBusy: boolean;
  shake: number;
  start: (opts: { faction: FactionId; opponents: number; difficulty: Difficulty; scenario?: Scenario }) => void;
  resume: () => void;
  toTitle: () => void;
  toHow: () => void;
  tapTerritory: (id: TerritoryId) => void;
  placeAllOnSelected: () => void;
  trade: () => void;
  goAttack: () => void;
  goFortify: () => void;
  roll: () => void;
  blitz: () => void;
  retreat: () => void;
  clearPick: () => void;
  transfer: (n: number) => void;
  doFortify: (n: number) => void;
  skipMove: () => void;
  dismissDisaster: () => void;
  dismissVoidcrown: () => void;
  toggleMute: () => void;
  setMapView: (view: MapView) => void;
  zeroDay: () => void;
  legalTargets: () => TerritoryId[];
  chronicleOpen: boolean;
  openChronicle: () => void;
  closeChronicle: () => void;
  finishCinematic: (skipped: boolean) => void;
  replayCinematic: () => void;
  probe: (kind: ProbeKind) => void;
  focusHazard: (id: TerritoryId) => void;
};

let aiTimer = 0;
let aiAttacks = 0;

function persist(game: GameState | null) {
  if (game && game.phase !== "over") saveGame(game);
  if (game?.phase === "over") {
    sealLegacy(game);
    sealCycle(game);
    clearSave();
  }
}

export const useGame = create<Store>((set, get) => ({
  screen: "title",
  game: null,
  settings: { muted: false, reducedShake: false, mapView: "globe" },
  hasSave: false,
  aiBusy: false,
  shake: 0,
  chronicleOpen: false,

  start: (opts) => {
    unlockAudio();
    aiAttacks = 0;
    const game = newGame({ ...opts, inherit: true });
    persist(game);
    set({ screen: "play", game, hasSave: true, aiBusy: false, chronicleOpen: false });
    if (!currentPlayer(game).isHuman) runAi();
  },

  resume: () => {
    unlockAudio();
    const game = loadGame();
    if (!game) return;
    set({ screen: "play", game });
    if (game.phase === "ai") runAi();
  },

  toTitle: () => set({ screen: "title", game: null, hasSave: !!loadGame() }),
  toHow: () => set({ screen: "how" }),
  finishCinematic: (skipped) => {
    saveIntro(markIntroComplete(skipped));
    set({ screen: "title" });
  },
  replayCinematic: () => {
    unlockAudio();
    set({ screen: "cinematic" });
  },

  probe: (kind) => {
    const { game } = get();
    if (!game?.selected) return;
    const next = probeTerritory(game, kind, game.selected);
    if (!next) return;
    sfxClick();
    persist(next);
    set({ game: next });
  },

  focusHazard: (id) => {
    const { game } = get();
    if (!game || get().aiBusy) return;
    const next = focusPhenomenon(game, id);
    if (!next) return;
    sfxClick();
    persist(next);
    set({ game: next });
  },

  tapTerritory: (id) => {
    const { game } = get();
    if (!game || get().aiBusy) return;
    sfxClick();
    const next = clickTerritory(game, id);
    if (next) {
      persist(next);
      set({ game: next });
    }
  },

  placeAllOnSelected: () => {
    const { game } = get();
    if (!game?.selected) return;
    const next = placeArmy(game, game.selected, game.armiesToPlace);
    if (next) {
      sfxPlace();
      persist(next);
      set({ game: next });
    }
  },

  trade: () => {
    const { game } = get();
    if (!game) return;
    const next = tradeCards(game);
    if (next) {
      sfxPlace();
      persist(next);
      set({ game: next });
    }
  },

  goAttack: () => {
    const { game } = get();
    if (!game) return;
    const next = finishReinforce(game);
    if (next) {
      persist(next);
      set({ game: next });
    }
  },

  goFortify: () => {
    const { game } = get();
    if (!game) return;
    const next = finishAttack(game);
    persist(next);
    set({ game: next });
  },

  roll: () => {
    const { game } = get();
    if (!game) return;
    const next = rollCombat(game);
    if (!next) return;
    sfxDice();
    if (next.lastCombat) {
      if (next.lastCombat.defendLoss) sfxHit();
      bumpShake(0.45);
    }
    if (next.phase === "transfer" || (next.lastCombat && next.territories[next.lastCombat.to].owner === currentPlayer(next).id && next.lastCombat.defendLoss)) {
      sfxCapture();
    }
    persist(next);
    set({ game: next });
  },

  blitz: () => {
    let g = get().game;
    if (!g) return;
    for (let i = 0; i < 40; i++) {
      if (!g.attackFrom || !g.attackTo) break;
      if (g.phase === "transfer" || g.phase === "over") break;
      const from = g.territories[g.attackFrom];
      const to = g.territories[g.attackTo];
      if (from.armies < 2 || to.armies < 1) break;
      const n = rollCombat(g);
      if (!n) break;
      g = n;
      if (g.phase === "transfer" || g.phase === "over") break;
    }
    sfxDice();
    sfxHit();
    bumpShake(0.6);
    persist(g);
    set({ game: g });
  },

  retreat: () => {
    const { game } = get();
    if (!game) return;
    const next = cancelAttack(game);
    persist(next);
    set({ game: next });
  },

  clearPick: () => {
    const { game } = get();
    if (!game) return;
    const next = {
      ...game,
      selected: null,
      attackFrom: null,
      attackTo: null,
      fortifyFrom: null,
    };
    set({ game: next });
  },

  transfer: (n) => {
    const { game } = get();
    if (!game) return;
    const next = transferArmies(game, n);
    if (!next) return;
    sfxPlace();
    persist(next);
    set({ game: next });
  },

  doFortify: (n) => {
    const { game } = get();
    if (!game || !game.fortifyFrom || !game.selected) return;
    const next = fortify(game, game.fortifyFrom, game.selected, n);
    if (!next) return;
    persist(next);
    set({ game: next });
    if (next.phase === "event") sfxBoom();
    if (next.phase === "ai") runAi();
    if (next.phase === "over") endSfx(next);
  },

  skipMove: () => {
    const { game } = get();
    if (!game) return;
    const next = game.phase === "fortify" || game.phase === "attack" ? (game.phase === "attack" ? finishAttack(game) : skipFortify(game)) : game;
    persist(next);
    set({ game: next });
    if (next.phase === "event") sfxBoom();
    if (next.phase === "ai") runAi();
    if (next.phase === "over") endSfx(next);
  },

  dismissDisaster: () => {
    const { game } = get();
    if (!game) return;
    const next = dismissEvent(game);
    persist(next);
    set({ game: next });
    if (next.phase === "ai") runAi();
  },

  dismissVoidcrown: () => {
    const { game } = get();
    if (!game) return;
    const next = { ...game, voidcrownJustEmerged: false };
    persist(next);
    set({ game: next });
  },

  toggleMute: () => {
    const settings = { ...get().settings, muted: !get().settings.muted };
    saveSettings(settings);
    set({ settings });
    setMuted(settings.muted);
  },

  setMapView: (view) => {
    const settings = { ...get().settings, mapView: view };
    saveSettings(settings);
    set({ settings });
  },

  zeroDay: () => {
    const { game } = get();
    if (!game?.selected) return;
    const next = zeroDayStrike(game, game.selected);
    if (!next) return;
    sfxBoom();
    bumpShake(0.9);
    persist(next);
    set({ game: next });
  },

  legalTargets: () => {
    const { game } = get();
    if (!game?.attackFrom) return [];
    return legalAttackTargets(game, game.attackFrom);
  },

  openChronicle: () => set({ chronicleOpen: true }),
  closeChronicle: () => set({ chronicleOpen: false }),
}));

function bumpShake(n: number) {
  useGame.setState({ shake: Math.min(1, useGame.getState().shake + n) });
}

function endSfx(g: GameState) {
  if (g.winner === g.humanId) sfxWin();
  else sfxLose();
}

function runAi() {
  useGame.setState({ aiBusy: true });
  aiAttacks = 0;
  window.clearTimeout(aiTimer);
  const tick = () => {
    const { game } = useGame.getState();
    if (!game) {
      useGame.setState({ aiBusy: false });
      return;
    }
    if (game.phase === "over") {
      useGame.setState({ aiBusy: false });
      endSfx(game);
      persist(game);
      return;
    }
    if (game.phase === "event") {
      useGame.setState({ aiBusy: false });
      sfxBoom();
      persist(game);
      return;
    }
    if (currentPlayer(game).isHuman) {
      useGame.setState({ aiBusy: false });
      persist(game);
      return;
    }
    if (aiAttacks > 16) {
      const ended = skipFortify(game);
      persist(ended);
      useGame.setState({ game: ended });
      aiAttacks = 0;
      aiTimer = window.setTimeout(tick, 360);
      return;
    }
    const step = stepAi(game);
    if (step.state.lastCombat) {
      aiAttacks += 1;
      sfxDice();
      bumpShake(0.25);
    }
    persist(step.state);
    useGame.setState({ game: step.state });
    if (step.kind === "done") {
      if (step.state.phase === "over") {
        useGame.setState({ aiBusy: false });
        endSfx(step.state);
        return;
      }
      if (step.state.phase === "event") {
        useGame.setState({ aiBusy: false });
        sfxBoom();
        return;
      }
      if (!currentPlayer(step.state).isHuman) {
        aiAttacks = 0;
        aiTimer = window.setTimeout(tick, 400);
        return;
      }
      useGame.setState({ aiBusy: false });
      return;
    }
    aiTimer = window.setTimeout(tick, step.delay);
  };
  aiTimer = window.setTimeout(tick, 380);
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      const g = useGame.getState().game;
      persist(g);
    }
  });
}
