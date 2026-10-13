import { SINGULARITY_RIFT, syncMetrics } from "./canon";
import { TERRITORY_LIST } from "./map";
import { rememberAction } from "./memory";
import { randInt } from "./rng";
import type { GameState, Reality } from "./types";

export function maybeOpenRift(s: GameState): boolean {
  if (s.riftOpened) return false;
  if (s.singularity < SINGULARITY_RIFT && !(s.scars.length >= 8 && s.day >= 10 && s.lastDisaster && s.lastDisaster.combo.length >= 2)) {
    return false;
  }
  const parent = s.currentReality;
  const id = `rift-${s.realities.length + 1}`;
  const child: Reality = {
    id,
    parent,
    name: s.voidcrown >= 60 ? "VOIDCROWN" : "GRIETA",
    seed: s.rng,
    dayBorn: s.day,
    divergences: [
      `singularidad ${Math.round(s.singularity)}`,
      `${s.scars.length} cicatrices`,
      `${s.mutations.filter((m) => m.status === "ADOPTED").length} mutaciones`,
    ],
  };
  s.realities = [...s.realities, child];
  s.currentReality = id;
  s.riftOpened = true;
  s.genealogy = [...s.genealogy, { id, parent, cause: "quiebre", day: s.day }];

  s.log = [`Grieta abierta. Realidad ${child.name} nace de ${parent}.`, ...s.log].slice(0, 18);
  rememberAction(s, "world", "RIFT", {
    after: id,
    consequences: child.divergences,
  });
  syncMetrics(s);
  return true;
}

export function bloomWasteland(s: GameState) {
  if (!s.mutations.some((m) => m.kind === "wasteland_bloom" && m.status === "ADOPTED")) return;
  const horde = s.players.find((p) => p.faction === "horda") ?? s.players.find((p) => !p.isHuman);
  if (!horde) return;
  for (const t of TERRITORY_LIST) {
    const st = s.territories[t.id];
    if (st.owner === "wasteland" && randInt(s, 2) === 0) {
      st.owner = horde.id;
      st.armies = 1;
      horde.alive = true;
    }
  }
}
