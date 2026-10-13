export type CapStatus = "IMPLEMENTADO" | "FUNCIONANDO" | "VERIFICADO" | "PENDIENTE" | "UNKNOWN";

export type Capability = {
  id: string;
  name: string;
  status: CapStatus;
  where: string;
  notes: string;
};

export const CAPABILITIES: Capability[] = [
  { id: "risk", name: "Risk jugable", status: "VERIFICADO", where: "src/game/engine.ts", notes: "Refuerzo, ataque, fortificar, cartas, continentes." },
  { id: "worldstate", name: "WorldState autoritativo", status: "VERIFICADO", where: "src/game/types.ts", notes: "La UI no crea la verdad." },
  { id: "combat", name: "Combate de dados", status: "VERIFICADO", where: "src/game/combat.ts", notes: "Risk clásico, RNG determinista." },
  { id: "economy", name: "Economía militar", status: "FUNCIONANDO", where: "reinforcementsFor", notes: "Territorios + continentes + cicatrices + war_economy." },
  { id: "factions", name: "Facciones", status: "FUNCIONANDO", where: "src/game/factions.ts", notes: "5 facciones, 1–4 IA." },
  { id: "edai", name: "EDAI", status: "FUNCIONANDO", where: "src/game/ai.ts", notes: "Heurística verificable: observa, decide, explica." },
  { id: "events", name: "Eventos / catástrofes", status: "FUNCIONANDO", where: "src/game/events.ts", notes: "9 clases. Alteran WorldState y dejan cicatrices." },
  { id: "memory", name: "Memoria causal", status: "FUNCIONANDO", where: "src/game/memory.ts", notes: "Cadena actor/acción/antes/después/consecuencias." },
  { id: "scars", name: "Cicatrices", status: "FUNCIONANDO", where: "src/game/scars.ts", notes: "Penalizan refuerzo y pueden dar defensa." },
  { id: "mutations", name: "Mutaciones", status: "FUNCIONANDO", where: "src/game/mutations.ts", notes: "Candidata → verificada → adoptada. Nunca idea→canon." },
  { id: "genealogy", name: "Genealogía", status: "FUNCIONANDO", where: "GameState.genealogy", notes: "Padre/causa/día por realidad." },
  { id: "replay", name: "Replay / seed", status: "FUNCIONANDO", where: "src/game/replay.ts", notes: "Misma seed reproduce el génesis. Acciones registradas." },
  { id: "persist", name: "Persistencia", status: "FUNCIONANDO", where: "src/game/save.ts", notes: "localStorage v5 + backup + migración v1–v4." },
  { id: "sim", name: "Simulación headless", status: "FUNCIONANDO", where: "src/game/simulate.ts", notes: "IA vs IA, sin interfaz." },
  { id: "rift", name: "Grietas / realidades", status: "FUNCIONANDO", where: "src/game/realities.ts", notes: "Nace al cruzar umbral, no por botón." },
  { id: "voidcrown", name: "Voidcrown emergente", status: "VERIFICADO", where: "src/game/voidcrown.ts", notes: "Nace de grieta+umbral o 5 yermos. Es facción IA, no menú." },
  { id: "chronicle", name: "Crónica jugable", status: "FUNCIONANDO", where: "src/game/lore.ts", notes: "Capítulos se abren con hechos del WorldState. Historia no es menú." },
  { id: "organism", name: "CEL / Joker / Fitness", status: "FUNCIONANDO", where: "src/game/organism.ts", notes: "Observa, contradice mutaciones VERIFIED. No escribe canon." },
  { id: "legacy", name: "La caja no olvida", status: "FUNCIONANDO", where: "src/game/legacy.ts", notes: "Una cicatriz hereda a la siguiente partida. Capítulo I Drive." },
  { id: "globe", name: "Globo 3D", status: "IMPLEMENTADO", where: "src/components/game/globe.tsx", notes: "Three.js / R3F + texturas locales. Fallback táctico SVG." },
  { id: "zeroday", name: "Golpe Zero Day", status: "FUNCIONANDO", where: "zeroDayStrike", notes: "Una vez por partida. Deja cicatriz nuclear. Botón en fase de ataque." },
  { id: "living", name: "Biota 6 ejes", status: "FUNCIONANDO", where: "src/game/living.ts", notes: "Genoma, esporas, tumbas. Catástrofe selecciona, no borra." },
  { id: "probes", name: "Sondas", status: "FUNCIONANDO", where: "runProbe", notes: "Sondear, muestra, sembrar. Fenómeno clicable en globo y mapa." },
  { id: "director", name: "Director heurístico", status: "FUNCIONANDO", where: "directorTick", notes: "Emite MutationPatch. No recompila. Doctrina NORMAL/AUSTERIDAD/RESCATE." },
  { id: "retention", name: "Memoria de 20 partidas", status: "FUNCIONANDO", where: "sealCycle", notes: "Tope 20. Alimenta la doctrina de la siguiente partida. Export JSON." },
];

export function statusSummary(): Record<CapStatus, number> {
  const out: Record<CapStatus, number> = {
    IMPLEMENTADO: 0,
    FUNCIONANDO: 0,
    VERIFICADO: 0,
    PENDIENTE: 0,
    UNKNOWN: 0,
  };
  for (const c of CAPABILITIES) out[c.status] += 1;
  return out;
}
