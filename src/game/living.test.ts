import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { newGame, probeTerritory } from "./engine.ts";
import { applyDisaster } from "./events.ts";
import { focusPhenomenon, rescueSoak, sealCycle, setLivingStore, loadRetention, RETENTION_LIMIT, selectByCatastrophe, GENOME_AXES } from "./living.ts";
import { TERRITORY_LIST } from "./map.ts";

function memStore() {
  const bag = new Map<string, string>();
  return {
    getItem: (k: string) => bag.get(k) ?? null,
    setItem: (k: string, v: string) => {
      bag.set(k, v);
    },
  };
}

describe("capa viva", () => {
  it("siembra biota de 6 ejes en los 42 nodos", () => {
    const s = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 5 });
    assert.equal(Object.keys(s.living.biota).length, 42);
    for (const id of Object.keys(s.living.biota)) {
      for (const axis of GENOME_AXES) {
        const n = s.living.biota[id].genome[axis];
        assert.ok(n >= 0 && n <= 100);
      }
    }
    assert.equal(s.living.generation, 1);
    assert.equal(s.living.doctrine, "NORMAL");
  });

  it("un desastre selecciona genoma y deja esporas", () => {
    const s = newGame({ faction: "marea", opponents: 1, difficulty: "recruta", seed: 11 });
    const before = Object.values(s.living.biota).reduce((n, b) => n + b.spores, 0);
    applyDisaster(s);
    const after = Object.values(s.living.biota).reduce((n, b) => n + b.spores, 0);
    assert.ok(after > before);
    assert.ok(s.living.patches.length >= 1);
    assert.equal(Object.keys(s.living.biota).length, 42);
  });

  it("población en cero es tumba, no nodo borrado", () => {
    const s = newGame({ faction: "umbral", opponents: 1, difficulty: "recruta", seed: 3 });
    const id = TERRITORY_LIST[0].id;
    s.living.biota[id].pop = 1;
    selectByCatastrophe(s, id, "nuclear", 8);
    assert.equal(s.living.biota[id].pop, 0);
    assert.ok(s.living.biota[id].spores >= 3);
    assert.ok(s.living.tombs.some((t) => t.territory === id));
    assert.ok(s.territories[id]);
  });

  it("sondas: sondeo lee, siembra solo en tierra propia", () => {
    const s = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 9 });
    const mine = Object.keys(s.territories).find((id) => s.territories[id].owner === s.humanId)!;
    const enemy = Object.keys(s.territories).find((id) => s.territories[id].owner !== s.humanId)!;
    s.selected = mine;
    const surveyed = probeTerritory(s, "survey", mine);
    assert.ok(surveyed?.living.lastProbe?.line.includes("Sondeo"));
    assert.equal(probeTerritory(s, "seed", enemy), null);
    const seeded = probeTerritory(s, "seed", mine);
    assert.ok(seeded);
    assert.ok(seeded!.living.biota[mine].pop > s.living.biota[mine].pop);
  });

  it("tocar el fenómeno no coloca ejércitos", () => {
    const s = newGame({ faction: "horda", opponents: 1, difficulty: "recruta", seed: 4 });
    const id = TERRITORY_LIST[2].id;
    const armies = s.territories[id].armies;
    s.territories[id].hazard = "volcan";
    const next = focusPhenomenon(s, id);
    assert.equal(next?.selected, id);
    assert.equal(next?.territories[id].armies, armies);
    assert.match(next?.living.warning ?? "", /volcan/);
  });

  it("rescate afloja un punto de daño en tierra humana", () => {
    const s = newGame({ faction: "ceniza", opponents: 1, difficulty: "recruta", seed: 1 });
    assert.equal(rescueSoak(s, s.humanId), 0);
    s.living.doctrine = "RESCATE";
    assert.equal(rescueSoak(s, s.humanId), 1);
    assert.equal(rescueSoak(s, "p1"), 0);
  });

  it("la memoria de partidas no pasa de 20", () => {
    const store = memStore();
    setLivingStore(store);
    try {
      for (let i = 0; i < 25; i++) {
        const s = newGame({ faction: "nexo", opponents: 1, difficulty: "recruta", seed: 100 + i, inherit: false });
        s.phase = "over";
        s.winner = i % 2 === 0 ? s.humanId : "p1";
        s.day = i + 1;
        sealCycle(s);
      }
      const rows = loadRetention();
      assert.equal(rows.length, RETENTION_LIMIT);
      assert.equal(rows.at(-1)?.day, 25);
      assert.equal(rows[0]?.day, 6);
    } finally {
      setLivingStore(null);
    }
  });
});
