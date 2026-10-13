import type { FactionId, GameState, PlayerId } from "./types";
import { TERRITORIES } from "./map";

export type FactionDef = {
  id: FactionId;
  name: string;
  blurb: string;
  color: string;
  doctrine: string;
};

export const FACTIONS: FactionDef[] = [
  { id: "ceniza", name: "Ceniza", blurb: "Restos del mando continental.", doctrine: "Cicatrices propias +1 defensa.", color: "#8f8a82" },
  { id: "marea", name: "Marea", blurb: "Flotas que aún controlan costas.", doctrine: "+1 refuerzo cada 4 costas.", color: "#3f6f78" },
  { id: "nexo", name: "Nexo", blurb: "Red satelital y enclaves técnicos.", doctrine: "Al conquistar deja 1 de guarnición.", color: "#6d7d92" },
  { id: "horda", name: "Horda", blurb: "Señores de la guerra del interior.", doctrine: "+1 refuerzo si el interior supera a la costa.", color: "#9a5848" },
  { id: "umbral", name: "Umbral", blurb: "Enclaves que viven bajo tierra.", doctrine: "Desastres matan 1 menos en tus tierras.", color: "#5c6358" },
];

export const VOID_ID = "void";

export const VOIDCROWN: FactionDef = {
  id: "voidcrown",
  name: "Voidcrown",
  blurb: "No se elige. Emerge.",
  doctrine: "+2 refuerzos. Consume yermos.",
  color: "#c4453c",
};

export function factionById(id: FactionId): FactionDef {
  if (id === "voidcrown") return VOIDCROWN;
  return FACTIONS.find((f) => f.id === id) ?? FACTIONS[0];
}

export function playerFaction(s: GameState, pid: PlayerId): FactionId | null {
  return s.players.find((p) => p.id === pid)?.faction ?? null;
}

export function coastalOwned(s: GameState, pid: PlayerId): number {
  return Object.entries(s.territories).filter(([id, t]) => t.owner === pid && TERRITORIES[id]?.coastal).length;
}

export function inlandOwned(s: GameState, pid: PlayerId): number {
  return Object.entries(s.territories).filter(([id, t]) => t.owner === pid && TERRITORIES[id] && !TERRITORIES[id].coastal).length;
}

export function doctrineReinforce(s: GameState, pid: PlayerId): number {
  const f = playerFaction(s, pid);
  if (f === "marea") return Math.floor(coastalOwned(s, pid) / 4);
  if (f === "horda") return inlandOwned(s, pid) > coastalOwned(s, pid) ? 1 : 0;
  return 0;
}
