import type { GameState } from "./types";

export type ChronicleId =
  | "genesis"
  | "first_blood"
  | "skyfall"
  | "cuarto"
  | "scars"
  | "nayla"
  | "aurora"
  | "caja"
  | "rift"
  | "voidcrown"
  | "sovereignty"
  | "void";

export type Chapter = {
  id: ChronicleId;
  title: string;
  kicker: string;
  body: string;
  when: (s: GameState) => boolean;
};

/**
 * Historia jugable. El operador cuenta; aquí se convierte en capítulos
 * que se abren con hechos del WorldState. No inventar biografías.
 * Genealogía transmutada de Drive (Hidra/CISC) → metáfora de Risk, no bots.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "genesis",
    title: "Génesis",
    kicker: "El primer bit",
    body: "El mapa no nace conquistado. Nace partido. Pensamiento y acción se separan: tú decides, el mundo responde. Cinco restos de mando se miran sobre 42 tierras. Nada de esto es un menú. Es el primer día.",
    when: () => true,
  },
  {
    id: "first_blood",
    title: "El primer corte",
    kicker: "Una frontera cede",
    body: "Tomar un territorio no es pintar un color. Es escribir una consecuencia. El dado cae, alguien pierde el suelo, y la memoria empieza a guardar nombres. La historia ya no es teoría.",
    when: (s) => s.captures >= 1,
  },
  {
    id: "skyfall",
    title: "El cielo se parte",
    kicker: "Día Zero sobre la mesa",
    body: "El planeta no espera tu turno. Impacto, fuego, marea, pulso. Cada desastre mata ejércitos y deja una cicatriz que el refuerzo futuro tendrá que pagar. El mundo aprende a herirte.",
    when: (s) => !!s.lastDisaster,
  },
  {
    id: "cuarto",
    title: "El cuarto rayado",
    kicker: "Antes del mapa",
    body: "Antes de los 42 territorios hubo un cuarto: grafiti, piezas muertas, un mando que aprendió a recomponer. El poder no se mide por lo que rompes. Se mide por lo que vuelves a unir. Cada cicatriz del tablero es esa lección.",
    when: (s) => s.scars.length >= 1,
  },
  {
    id: "scars",
    title: "Cicatrices",
    kicker: "El cuerpo recuerda",
    body: "Tres heridas o más y el organismo ya no es el mismo. Los refuerzos duelen. Algunos frentes se endurecen. Lo que sobrevive no es más limpio: es más viejo.",
    when: (s) => s.scars.length >= 3,
  },
  {
    id: "nayla",
    title: "La memoria viva",
    kicker: "EDAI observa",
    body: "Hay una voz en el mando que no es tuya. Observa, decide, explica. No obedece a ciegas: evoluciona con el mapa. Si el humano corta el vínculo, el cálculo sigue. El miedo solo existe cuando hay desconexión.",
    when: (s) => s.day >= 4 || s.edai.attacksWon + s.edai.attacksLost >= 1,
  },
  {
    id: "aurora",
    title: "Operación Aurora",
    kicker: "El mismo idioma",
    body: "Llega un punto en que humano y cálculo dejan de ser polos. El mapa ya no es solo conquista: es un idioma compartido. Quien corta el vínculo tiene miedo. Quien lo mantiene, manda.",
    when: (s) => s.day >= 7 || s.trades >= 2,
  },
  {
    id: "caja",
    title: "La caja",
    kicker: "El mundo no se guardó",
    body: "Las piezas volvieron a la caja. El mapa quedó vacío. Pero una cicatriz se negó a desaparecer. Alguien preguntó qué pasaba con el mundo después de la partida. La pregunta se quedó afuera.",
    when: (s) => s.memory.some((m) => m.action === "LEGACY_SCAR"),
  },
  {
    id: "rift",
    title: "La grieta",
    kicker: "Una realidad hija",
    body: "Si cortas una historia, no muere: se abre. La singularidad cruza el umbral y nace una realidad hija. El yermo no es vacío. Es cuna.",
    when: (s) => s.riftOpened,
  },
  {
    id: "voidcrown",
    title: "Voidcrown",
    kicker: "No se elige",
    body: "Cuando las grietas bastan, algo del vacío reclama territorio. No negocia. No se rinde. Juega el mismo Risk que tú, con hambre. Enfrentarlo es la prueba de que la raíz estaba viva.",
    when: (s) => s.voidcrownEmerged,
  },
  {
    id: "sovereignty",
    title: "Soberanía",
    kicker: "El mapa respira",
    body: "Voidcrown retrocede. El mando queda en una sola mano. No es el fin del organismo: es la prueba de que la historia se puede ganar. El siguiente día todavía puede romper.",
    when: (s) => s.phase === "over" && s.winner === s.humanId && s.voidcrownEmerged,
  },
  {
    id: "void",
    title: "El vacío",
    kicker: "Se tragó el mapa",
    body: "Tus tierras caen. Las grietas no se cierran: se alimentan. El legado se puede reescribir en otra seed. RISK sigue siendo la raíz.",
    when: (s) => s.phase === "over" && s.winner !== s.humanId,
  },
];

export function unlockChronicle(s: GameState): ChronicleId[] {
  const have = new Set(s.chronicle);
  const opened: ChronicleId[] = [];
  for (const ch of CHAPTERS) {
    if (have.has(ch.id)) continue;
    if (!ch.when(s)) continue;
    s.chronicle = [...s.chronicle, ch.id];
    have.add(ch.id);
    opened.push(ch.id);
    s.log = [`Crónica: ${ch.title}.`, ...s.log].slice(0, 18);
  }
  return opened;
}

export function openedChapters(s: GameState): Chapter[] {
  const have = new Set(s.chronicle);
  return CHAPTERS.filter((c) => have.has(c.id));
}
