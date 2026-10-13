import { CINE_KEY, defaultIntro, type IntroRecord } from "./cinematic";

function canStore() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadIntro(): IntroRecord {
  if (!canStore()) return defaultIntro();
  try {
    const raw = localStorage.getItem(CINE_KEY);
    if (!raw) return defaultIntro();
    const parsed = JSON.parse(raw) as Partial<IntroRecord>;
    return {
      version: typeof parsed.version === "number" ? parsed.version : 0,
      seen: !!parsed.seen,
      skipped: !!parsed.skipped,
      seenAt: typeof parsed.seenAt === "string" ? parsed.seenAt : null,
    };
  } catch {
    return defaultIntro();
  }
}

export function saveIntro(rec: IntroRecord) {
  if (!canStore()) return;
  try {
    localStorage.setItem(CINE_KEY, JSON.stringify(rec));
  } catch {
    /* quota */
  }
}
