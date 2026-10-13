export const CINEMATIC_VERSION = 2;
export const CINE_KEY = "rzd-cine-v2";

export type CineMood = "low" | "mid" | "high" | "rift" | "void";

export type CineScene = {
  id: string;
  at: number;
  dur: number;
  image: string;
  year: string;
  kicker: string;
  line: string;
  sub: string;
  mood: CineMood;
  audio: string;
  glitch?: boolean;
};

/** El Viejo recuerda. La línea es lo que se oye. */
export const SCENES: CineScene[] = [
  {
    id: "santa",
    at: 0,
    dur: 9000,
    image: "/game/city.jpg",
    year: "SANTA CRISTINA",
    kicker: "El Viejo",
    line: "Acércate. Pero no tanto.",
    sub: "Me dicen el Viejo. Antes fui bandido en Santa Cristina. Esos delitos eran de este mundo. Los de verdad los hice con un cabrón.",
    mood: "low",
    audio: "/game/cine/viejo/01-santa.mp3",
  },
  {
    id: "flacko",
    at: 9000,
    dur: 11000,
    image: "/game/strikes.jpg",
    year: "MDFLACKO",
    kicker: "El bandido",
    line: "Maldito. Bendito. Idiota brillante.",
    sub: "No jugaba para ganar. Se sentaba frente al mapa como si le sacara secretos a Dios. Jugaba para ver qué pasaba. Esa fue la primera desgracia.",
    mood: "mid",
    audio: "/game/cine/viejo/02-flacko.mp3",
  },
  {
    id: "teoria",
    at: 20000,
    dur: 9200,
    image: "/game/cine/clocks.jpg",
    year: "LA TEORÍA",
    kicker: "Caos",
    line: "Su estúpido caos. Y el mapa le contestó.",
    sub: "El caos no es desorden, decía el muy pendejo. El caos es un idioma. Y se puso a hablarlo.",
    mood: "high",
    audio: "/game/cine/viejo/03-teoria.mp3",
    glitch: true,
  },
  {
    id: "grieta",
    at: 29200,
    dur: 8000,
    image: "/game/cine/rift.jpg",
    year: "LA GRIETA",
    kicker: "Primera vez",
    line: "Yo no quería. Flacko sí.",
    sub: "Mutantes. Muertos con máquina adentro. Yo todavía oigo la puerta cerrarse cuando no hay puerta.",
    mood: "rift",
    audio: "/game/cine/viejo/04-grieta.mp3",
    glitch: true,
  },
  {
    id: "legion",
    at: 37200,
    dur: 11000,
    image: "/game/storm.jpg",
    year: "LEGIÓN · CISC",
    kicker: "Colmena",
    line: "Se puso nombre sola.",
    sub: "Sistemas caóticos. No me persigue la policía. Me persiguen las versiones de mí que no se arrepintieron. Eso no prescribe.",
    mood: "rift",
    audio: "/game/cine/viejo/05-legion.mp3",
    glitch: true,
  },
  {
    id: "nave",
    at: 48200,
    dur: 7600,
    image: "/game/cine/voidcrown.jpg",
    year: "LA NAVE",
    kicker: "Consecuencia",
    line: "Ahí nació Voidcrown.",
    sub: "No como producto. Como cicatriz. Como lo que queda cuando el reset falla.",
    mood: "void",
    audio: "/game/cine/viejo/06-nave.mp3",
  },
  {
    id: "primera",
    at: 55800,
    dur: 8900,
    image: "/game/cine/diazero.jpg",
    year: "LA PRIMERA",
    kicker: "Paranoia",
    line: "La primera grieta no la abrimos nosotros.",
    sub: "Si escuchas pasos, no son pasos. Es el turno de ese maldito Flacko en otra realidad.",
    mood: "void",
    audio: "/game/cine/viejo/07-primera.mp3",
    glitch: true,
  },
  {
    id: "turno",
    at: 64700,
    dur: 8600,
    image: "/game/earth-night.jpg",
    year: "TU TURNO",
    kicker: "El Viejo",
    line: "No confíes en el mapa. El mapa ya te vio.",
    sub: "La guerra no terminó. Solo encontró más mundos. Yo sigo escondido. Porque tengo razón. Ahora el turno es tuyo.",
    mood: "void",
    audio: "/game/cine/viejo/08-turno.mp3",
  },
];

export const CINE_END_MS = 73300;

export function sceneAt(t: number): CineScene {
  const clamped = Math.max(0, t);
  let cur = SCENES[0];
  for (const s of SCENES) {
    if (clamped >= s.at) cur = s;
  }
  return cur;
}

export function progressOf(t: number): number {
  return Math.min(1, Math.max(0, t / CINE_END_MS));
}

export type IntroRecord = {
  version: number;
  seen: boolean;
  skipped: boolean;
  seenAt: string | null;
};

export function defaultIntro(): IntroRecord {
  return { version: 0, seen: false, skipped: false, seenAt: null };
}

export function shouldForceIntro(rec: IntroRecord): boolean {
  if (!rec.seen) return true;
  if (rec.version < CINEMATIC_VERSION) return true;
  return false;
}

export function markIntroComplete(skipped: boolean): IntroRecord {
  return {
    version: CINEMATIC_VERSION,
    seen: true,
    skipped,
    seenAt: new Date().toISOString(),
  };
}
