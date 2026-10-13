import type { ContinentId, TerritoryId } from "./types";

export type ContinentDef = {
  id: ContinentId;
  name: string;
  bonus: number;
  members: TerritoryId[];
};

export type TerritoryDef = {
  id: TerritoryId;
  name: string;
  short: string;
  continent: ContinentId;
  cx: number;
  cy: number;
  r: number;
  lat: number;
  lon: number;
  neighbors: TerritoryId[];
  coastal: boolean;
  path: string;
};

export const MAP_W = 1100;
export const MAP_H = 620;

function hex(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    pts.push(`${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `${pts.join(" ")}Z`;
}

type Spec = Omit<TerritoryDef, "path">;

const SPECS: Spec[] = [
  { id: "alaska", name: "Alaska", short: "ALA", continent: "na", cx: 70, cy: 86, r: 32, lat: 64, lon: -153, coastal: true, neighbors: ["nwt", "alberta", "kamchatka"] },
  { id: "nwt", name: "Yukón", short: "YUK", continent: "na", cx: 140, cy: 72, r: 32, lat: 64, lon: -116, coastal: true, neighbors: ["alaska", "alberta", "ontario", "greenland"] },
  { id: "greenland", name: "Groenlandia", short: "GRO", continent: "na", cx: 248, cy: 58, r: 32, lat: 72, lon: -40, coastal: true, neighbors: ["nwt", "ontario", "quebec", "iceland"] },
  { id: "alberta", name: "Alberta", short: "ALB", continent: "na", cx: 92, cy: 148, r: 30, lat: 55, lon: -115, coastal: false, neighbors: ["alaska", "nwt", "ontario", "westus"] },
  { id: "ontario", name: "Ontario", short: "ONT", continent: "na", cx: 162, cy: 138, r: 30, lat: 50, lon: -85, coastal: true, neighbors: ["nwt", "alberta", "westus", "eastus", "quebec", "greenland"] },
  { id: "quebec", name: "Quebec", short: "QUE", continent: "na", cx: 230, cy: 128, r: 30, lat: 50, lon: -70, coastal: true, neighbors: ["greenland", "ontario", "eastus"] },
  { id: "westus", name: "California", short: "CAL", continent: "na", cx: 92, cy: 214, r: 30, lat: 37, lon: -120, coastal: true, neighbors: ["alberta", "ontario", "eastus", "camerica"] },
  { id: "eastus", name: "Nueva York", short: "NY", continent: "na", cx: 168, cy: 204, r: 30, lat: 38, lon: -80, coastal: true, neighbors: ["ontario", "quebec", "westus", "camerica"] },
  { id: "camerica", name: "México", short: "MEX", continent: "na", cx: 128, cy: 276, r: 30, lat: 20, lon: -100, coastal: true, neighbors: ["westus", "eastus", "venezuela"] },

  { id: "venezuela", name: "Venezuela", short: "VEN", continent: "sa", cx: 168, cy: 340, r: 30, lat: 8, lon: -66, coastal: true, neighbors: ["camerica", "peru", "brazil"] },
  { id: "peru", name: "Perú", short: "PER", continent: "sa", cx: 122, cy: 404, r: 30, lat: -10, lon: -75, coastal: true, neighbors: ["venezuela", "brazil", "argentina"] },
  { id: "brazil", name: "Brasil", short: "BRA", continent: "sa", cx: 200, cy: 404, r: 34, lat: -10, lon: -50, coastal: true, neighbors: ["venezuela", "peru", "argentina", "nafrica"] },
  { id: "argentina", name: "Argentina", short: "ARG", continent: "sa", cx: 156, cy: 478, r: 32, lat: -35, lon: -64, coastal: true, neighbors: ["peru", "brazil"] },

  { id: "iceland", name: "Islandia", short: "ISL", continent: "eu", cx: 330, cy: 64, r: 26, lat: 65, lon: -18, coastal: true, neighbors: ["greenland", "gb", "scandinavia"] },
  { id: "scandinavia", name: "Escandinavia", short: "ESC", continent: "eu", cx: 410, cy: 58, r: 30, lat: 62, lon: 15, coastal: true, neighbors: ["iceland", "gb", "neurope", "ukraine"] },
  { id: "gb", name: "Gran Bretaña", short: "GB", continent: "eu", cx: 338, cy: 124, r: 28, lat: 54, lon: -2, coastal: true, neighbors: ["iceland", "scandinavia", "neurope", "weurope"] },
  { id: "neurope", name: "Europa Norte", short: "EN", continent: "eu", cx: 408, cy: 118, r: 28, lat: 52, lon: 10, coastal: true, neighbors: ["gb", "scandinavia", "weurope", "seurope", "ukraine"] },
  { id: "weurope", name: "Europa Oeste", short: "EO", continent: "eu", cx: 338, cy: 186, r: 30, lat: 46, lon: 2, coastal: true, neighbors: ["gb", "neurope", "seurope", "nafrica"] },
  { id: "seurope", name: "Europa Sur", short: "ES", continent: "eu", cx: 408, cy: 180, r: 28, lat: 42, lon: 15, coastal: true, neighbors: ["weurope", "neurope", "ukraine", "mideast", "egypt", "nafrica"] },
  { id: "ukraine", name: "Ucrania", short: "UCR", continent: "eu", cx: 488, cy: 124, r: 34, lat: 50, lon: 32, coastal: true, neighbors: ["scandinavia", "neurope", "seurope", "ural", "afghanistan", "mideast"] },

  { id: "nafrica", name: "Norte de África", short: "NAF", continent: "af", cx: 348, cy: 268, r: 34, lat: 28, lon: 8, coastal: true, neighbors: ["brazil", "weurope", "seurope", "egypt", "eafrica", "congo"] },
  { id: "egypt", name: "Egipto", short: "EGI", continent: "af", cx: 430, cy: 258, r: 28, lat: 27, lon: 30, coastal: true, neighbors: ["seurope", "mideast", "eafrica", "nafrica"] },
  { id: "congo", name: "Congo", short: "CON", continent: "af", cx: 348, cy: 342, r: 30, lat: -1, lon: 22, coastal: true, neighbors: ["nafrica", "eafrica", "safrica"] },
  { id: "eafrica", name: "África Este", short: "AE", continent: "af", cx: 428, cy: 336, r: 30, lat: 0, lon: 38, coastal: true, neighbors: ["egypt", "mideast", "madagascar", "safrica", "congo", "nafrica"] },
  { id: "safrica", name: "Sudáfrica", short: "SAF", continent: "af", cx: 368, cy: 416, r: 32, lat: -28, lon: 25, coastal: true, neighbors: ["congo", "eafrica", "madagascar"] },
  { id: "madagascar", name: "Madagascar", short: "MAD", continent: "af", cx: 452, cy: 424, r: 26, lat: -20, lon: 47, coastal: true, neighbors: ["eafrica", "safrica"] },

  { id: "ural", name: "Ural", short: "URA", continent: "as", cx: 572, cy: 78, r: 30, lat: 60, lon: 60, coastal: false, neighbors: ["ukraine", "siberia", "china", "afghanistan"] },
  { id: "siberia", name: "Siberia", short: "SIB", continent: "as", cx: 652, cy: 62, r: 32, lat: 62, lon: 90, coastal: true, neighbors: ["ural", "yakutsk", "irkutsk", "mongolia", "china"] },
  { id: "yakutsk", name: "Yakutia", short: "YAK", continent: "as", cx: 736, cy: 58, r: 30, lat: 66, lon: 130, coastal: true, neighbors: ["siberia", "kamchatka", "irkutsk"] },
  { id: "kamchatka", name: "Kamchatka", short: "KAM", continent: "as", cx: 822, cy: 78, r: 32, lat: 56, lon: 160, coastal: true, neighbors: ["yakutsk", "irkutsk", "japan", "alaska", "mongolia"] },
  { id: "irkutsk", name: "Irkutsk", short: "IRK", continent: "as", cx: 694, cy: 122, r: 28, lat: 55, lon: 105, coastal: false, neighbors: ["siberia", "yakutsk", "kamchatka", "mongolia"] },
  { id: "mongolia", name: "Mongolia", short: "MON", continent: "as", cx: 704, cy: 182, r: 30, lat: 46, lon: 105, coastal: false, neighbors: ["siberia", "irkutsk", "kamchatka", "japan", "china"] },
  { id: "japan", name: "Japón", short: "JPN", continent: "as", cx: 798, cy: 168, r: 26, lat: 36, lon: 138, coastal: true, neighbors: ["kamchatka", "mongolia"] },
  { id: "afghanistan", name: "Afganistán", short: "AFG", continent: "as", cx: 568, cy: 168, r: 30, lat: 34, lon: 66, coastal: false, neighbors: ["ukraine", "ural", "china", "india", "mideast"] },
  { id: "china", name: "China", short: "CHI", continent: "as", cx: 656, cy: 236, r: 36, lat: 35, lon: 105, coastal: true, neighbors: ["ural", "siberia", "mongolia", "siam", "india", "afghanistan"] },
  { id: "mideast", name: "Oriente Medio", short: "OME", continent: "as", cx: 500, cy: 220, r: 32, lat: 28, lon: 45, coastal: true, neighbors: ["ukraine", "seurope", "egypt", "eafrica", "india", "afghanistan"] },
  { id: "india", name: "India", short: "IND", continent: "as", cx: 572, cy: 248, r: 30, lat: 22, lon: 78, coastal: true, neighbors: ["mideast", "afghanistan", "china", "siam"] },
  { id: "siam", name: "Siam", short: "SIA", continent: "as", cx: 656, cy: 304, r: 28, lat: 15, lon: 101, coastal: true, neighbors: ["india", "china", "indonesia"] },

  { id: "indonesia", name: "Indonesia", short: "IDO", continent: "oc", cx: 724, cy: 360, r: 30, lat: -2, lon: 118, coastal: true, neighbors: ["siam", "newguinea", "waus"] },
  { id: "newguinea", name: "Nueva Guinea", short: "NG", continent: "oc", cx: 804, cy: 348, r: 28, lat: -6, lon: 143, coastal: true, neighbors: ["indonesia", "waus", "eaus"] },
  { id: "waus", name: "Australia Oeste", short: "AO", continent: "oc", cx: 724, cy: 434, r: 32, lat: -25, lon: 122, coastal: true, neighbors: ["indonesia", "newguinea", "eaus"] },
  { id: "eaus", name: "Australia Este", short: "AE2", continent: "oc", cx: 804, cy: 434, r: 32, lat: -25, lon: 145, coastal: true, neighbors: ["newguinea", "waus"] },
];

export const TERRITORIES: Record<TerritoryId, TerritoryDef> = Object.fromEntries(
  SPECS.map((s) => [s.id, { ...s, path: hex(s.cx, s.cy, s.r) }]),
);

export const TERRITORY_LIST = SPECS.map((s) => TERRITORIES[s.id]);

export const CONTINENTS: ContinentDef[] = [
  { id: "na", name: "América del Norte", bonus: 5, members: SPECS.filter((s) => s.continent === "na").map((s) => s.id) },
  { id: "sa", name: "América del Sur", bonus: 2, members: SPECS.filter((s) => s.continent === "sa").map((s) => s.id) },
  { id: "eu", name: "Europa", bonus: 5, members: SPECS.filter((s) => s.continent === "eu").map((s) => s.id) },
  { id: "af", name: "África", bonus: 3, members: SPECS.filter((s) => s.continent === "af").map((s) => s.id) },
  { id: "as", name: "Asia", bonus: 7, members: SPECS.filter((s) => s.continent === "as").map((s) => s.id) },
  { id: "oc", name: "Oceanía", bonus: 2, members: SPECS.filter((s) => s.continent === "oc").map((s) => s.id) },
];

export const SEA_LANES: [TerritoryId, TerritoryId][] = [
  ["alaska", "kamchatka"],
  ["greenland", "iceland"],
  ["brazil", "nafrica"],
  ["siam", "indonesia"],
];

export function areNeighbors(a: TerritoryId, b: TerritoryId): boolean {
  return TERRITORIES[a]?.neighbors.includes(b) ?? false;
}

export function latLonToVec3(lat: number, lon: number, r = 1): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}
