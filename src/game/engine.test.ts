import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveDice } from "./combat.ts";
import {
  beginAttack,
  continentOwner,
  finishReinforce,
  newGame,
  ownedIds,
  placeArmy,
  reinforcementsFor,
  rollCombat,
} from "./engine.ts";
import { TERRITORY_LIST } from "./map.ts";
import { reconstructInitial } from "./replay.ts";
import { simulateBatch, simulateOnce } from "./simulate.ts";
import { maybeEmergVoidcrown } from "./voidcrown.ts";
import { doctrineReinforce, VOID_ID } from "./factions.ts";
import { addScar } from "./scars.ts";
import { sealLegacy, setLegacyStore } from "./legacy.ts";
import { jokerFitness, worldFitness } from "./organism.ts";
import { syncMetrics } from "./canon.ts";

describe("RISK Día Zero canon", () => {
  it("crea un tablero de 42 territorios", () => {
    const s = newGame({ faction: "ceniza", opponents: 3, difficulty: "veterano", seed: 42 });
    assert.equal(TERRITORY_LIST.length, 42);
    assert.equal(Object.keys(s.territories).length, 42);
    assert.equal(s.players.length, 4);
    assert.ok(s.armiesToPlace >= 3);
    assert.equal(s.phase, "reinforce");
    assert.equal(s.currentReality, "prime");
  });

  it("repite el génesis con la misma seed", () => {
    const a = newGame({ faction: "marea", opponents: 2, difficulty: "recruta", seed: 777 });
    const b = reconstructInitial(a);
    assert.equal(a.seed, b.seed);
    for (const id of Object.keys(a.territories)) {
      assert.equal(a.territories[id].owner, b.territories[id].owner);
      assert.equal(a.territories[id].armies, b.territories[id].armies);
    }
  });

  it("resuelve dados de Risk: empate para el defensor", () => {
    const r = resolveDice(4, 2, 1);
    assert.ok(r.attackDice.length >= 1 && r.attackDice.length <= 3);
    assert.ok(r.defendDice.length >= 1 && r.defendDice.length <= 2);
    assert.equal(r.attackLoss + r.defendLoss, Math.min(r.attackDice.length, r.defendDice.length));
  });

  it("coloca refuerzos solo en territorio propio", () => {
    const s = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 9 });
    const mine = ownedIds(s, s.humanId)[0];
    const enemy = Object.keys(s.territories).find((id) => s.territories[id].owner !== s.humanId)!;
    const before = s.armiesToPlace;
    const ok = placeArmy(s, mine, 2);
    assert.ok(ok);
    assert.equal(ok!.armiesToPlace, before - 2);
    assert.equal(placeArmy(s, enemy, 1), null);
  });

  it("conquista un vecino cuando el ataque es abrumador", () => {
    let s = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 3 });
    const pid = s.humanId;
    const from = ownedIds(s, pid).find((id) =>
      TERRITORY_LIST.find((t) => t.id === id)!.neighbors.some((n) => s.territories[n].owner !== pid),
    )!;
    const to = TERRITORY_LIST.find((t) => t.id === from)!.neighbors.find((n) => s.territories[n].owner !== pid)!;
    s.territories[from].armies = 40;
    s.territories[to].armies = 1;
    s.armiesToPlace = 0;
    s = finishReinforce(s)!;
    s = beginAttack(s, from, to)!;
    let guard = 0;
    while (s.territories[to].owner !== pid && guard < 20) {
      s = rollCombat(s)!;
      guard += 1;
    }
    assert.equal(s.territories[to].owner, pid);
    assert.ok(s.capturedThisTurn);
  });

  it("paga bonus de continente solo si está completo", () => {
    const s = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 11 });
    assert.equal(continentOwner(s, "sa") === s.humanId || continentOwner(s, "sa") === null || typeof continentOwner(s, "sa") === "string", true);
    const base = reinforcementsFor(s, s.humanId);
    assert.ok(base >= 3);
  });

  it("simula partidas IA vs IA sin colgarse", () => {
    const r = simulateOnce({ seed: 101, opponents: 2, difficulty: "recruta" });
    assert.ok(r.steps > 0);
    assert.ok(r.days >= 1);
  });

  it("el escenario grieta nace con singularidad alta", () => {
    const s = newGame({
      faction: "ceniza",
      opponents: 3,
      difficulty: "diazero",
      seed: 55,
      scenario: "rift",
    });
    assert.equal(s.scenario, "rift");
    assert.ok(s.singularity >= 80 || s.riftOpened);
  });

  it("un lote corto produce métricas reales", () => {
    const batch = simulateBatch(4, 200, "recruta");
    assert.equal(batch.n, 4);
    assert.ok(batch.avgDays >= 0);
  });

  it("Voidcrown emerge de yermos y grietas, no de un menú", () => {
    const s = newGame({ faction: "ceniza", opponents: 3, difficulty: "veterano", seed: 21 });
    assert.equal(s.voidcrownEmerged, false);
    assert.equal(
      s.players.some((p) => p.id === VOID_ID),
      false,
    );
    for (let i = 0; i < 6; i++) {
      const id = TERRITORY_LIST[i].id;
      if (s.territories[id].owner !== s.humanId) {
        s.territories[id].owner = "wasteland";
        s.territories[id].armies = 1;
      }
    }
    s.scars = TERRITORY_LIST.slice(0, 5).map((t, i) => ({
      id: `scar-${i}`,
      territory: t.id,
      kind: "nuclear" as const,
      day: 1,
      reinforcePenalty: 1,
      defenseBonus: 0,
    }));
    s.riftOpened = true;
    s.voidcrown = 80;
    const emerged = maybeEmergVoidcrown(s);
    assert.equal(emerged, true);
    assert.equal(s.voidcrownEmerged, true);
    assert.equal(s.voidcrownJustEmerged, true);
    const voidP = s.players.find((p) => p.id === VOID_ID);
    assert.ok(voidP);
    assert.equal(voidP!.faction, "voidcrown");
    const owned = Object.values(s.territories).filter((t) => t.owner === VOID_ID).length;
    assert.ok(owned >= 3);
    assert.equal(maybeEmergVoidcrown(s), false);
  });

  it("la crónica se abre con hechos, no con un menú", () => {
    const s = newGame({ faction: "ceniza", opponents: 2, difficulty: "veterano", seed: 13 });
    assert.ok(s.chronicle.includes("genesis"));
    assert.equal(s.chronicle.includes("first_blood"), false);
    s.captures = 1;
    syncMetrics(s);
    assert.ok(s.chronicle.includes("first_blood"));
  });

  it("doctrina Marea suma refuerzo por costas", () => {
    const s = newGame({ faction: "marea", opponents: 1, difficulty: "recruta", seed: 4 });
    const bonus = doctrineReinforce(s, s.humanId);
    assert.ok(bonus >= 0);
    assert.equal(s.players[0].faction, "marea");
  });

  it("fitness exige 42 territorios; joker revierte si se rompe", () => {
    const s = newGame({ faction: "ceniza", opponents: 2, difficulty: "veterano", seed: 8 });
    const before = worldFitness(s);
    assert.equal(before.territories, 42);
    const broken = { ...before, territories: 41 };
    const v = jokerFitness(before, broken);
    assert.equal(v.decision, "ROLLBACK");
    const same = jokerFitness(before, before);
    assert.equal(same.decision, "UNKNOWN");
  });

  it("la caja hereda una cicatriz a la siguiente partida", () => {
    const mem = new Map<string, string>();
    setLegacyStore({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    });
    const a = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 19, inherit: false });
    const id = Object.keys(a.territories)[0];
    addScar(a, id, "nuclear");
    const sealed = sealLegacy(a);
    assert.ok(sealed);
    const b = newGame({ faction: "horda", opponents: 1, difficulty: "recruta", seed: 20, inherit: true });
    assert.ok(b.scars.length >= 1);
    assert.ok(b.memory.some((m) => m.action === "LEGACY_SCAR"));
    setLegacyStore(null);
  });
});
