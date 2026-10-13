import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Map$1, n as VolumeX, o as Earth, r as Volume2, s as BookOpen, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CxUT7MVX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function mulberry32(seed) {
	let s = seed | 0;
	s = s + 1831565813 | 0;
	let t = Math.imul(s ^ s >>> 15, 1 | s);
	t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
	return (t ^ t >>> 14) >>> 0;
}
function unit(seed) {
	return mulberry32(seed) / 4294967296;
}
function nextRng(s) {
	s.rng = mulberry32(s.rng);
	return unit(s.rng);
}
function randInt(s, n) {
	if (n <= 0) return 0;
	return Math.floor(nextRng(s) * n);
}
function rollN(n, rng) {
	const values = [];
	let r = rng;
	for (let i = 0; i < n; i++) {
		r = mulberry32(r);
		values.push(1 + Math.floor(unit(r) * 6));
	}
	values.sort((a, b) => b - a);
	return {
		values,
		rng: r
	};
}
function attackDiceCount(armies) {
	return Math.max(1, Math.min(3, armies - 1));
}
function defendDiceCount(armies) {
	return Math.max(1, Math.min(2, armies));
}
function resolveDice(attackArmies, defendArmies, rng) {
	const aN = attackDiceCount(attackArmies);
	const dN = defendDiceCount(defendArmies);
	const a = rollN(aN, rng);
	const d = rollN(dN, a.rng);
	let attackLoss = 0;
	let defendLoss = 0;
	const cmp = Math.min(a.values.length, d.values.length);
	for (let i = 0; i < cmp; i++) if (a.values[i] > d.values[i]) defendLoss += 1;
	else attackLoss += 1;
	return {
		attackDice: a.values,
		defendDice: d.values,
		attackLoss,
		defendLoss,
		rng: d.rng
	};
}
var SET_BONUS = [
	4,
	6,
	8,
	10,
	12,
	15,
	20,
	25,
	30,
	35,
	40,
	45,
	50
];
var MAP_W = 1100;
function hex(cx, cy, r) {
	const pts = [];
	for (let i = 0; i < 6; i++) {
		const a = Math.PI / 6 + i * Math.PI / 3;
		pts.push(`${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
	}
	return `${pts.join(" ")}Z`;
}
var SPECS = [
	{
		id: "alaska",
		name: "Alaska",
		short: "ALA",
		continent: "na",
		cx: 70,
		cy: 86,
		r: 32,
		lat: 64,
		lon: -153,
		coastal: true,
		neighbors: [
			"nwt",
			"alberta",
			"kamchatka"
		]
	},
	{
		id: "nwt",
		name: "Yukón",
		short: "YUK",
		continent: "na",
		cx: 140,
		cy: 72,
		r: 32,
		lat: 64,
		lon: -116,
		coastal: true,
		neighbors: [
			"alaska",
			"alberta",
			"ontario",
			"greenland"
		]
	},
	{
		id: "greenland",
		name: "Groenlandia",
		short: "GRO",
		continent: "na",
		cx: 248,
		cy: 58,
		r: 32,
		lat: 72,
		lon: -40,
		coastal: true,
		neighbors: [
			"nwt",
			"ontario",
			"quebec",
			"iceland"
		]
	},
	{
		id: "alberta",
		name: "Alberta",
		short: "ALB",
		continent: "na",
		cx: 92,
		cy: 148,
		r: 30,
		lat: 55,
		lon: -115,
		coastal: false,
		neighbors: [
			"alaska",
			"nwt",
			"ontario",
			"westus"
		]
	},
	{
		id: "ontario",
		name: "Ontario",
		short: "ONT",
		continent: "na",
		cx: 162,
		cy: 138,
		r: 30,
		lat: 50,
		lon: -85,
		coastal: true,
		neighbors: [
			"nwt",
			"alberta",
			"westus",
			"eastus",
			"quebec",
			"greenland"
		]
	},
	{
		id: "quebec",
		name: "Quebec",
		short: "QUE",
		continent: "na",
		cx: 230,
		cy: 128,
		r: 30,
		lat: 50,
		lon: -70,
		coastal: true,
		neighbors: [
			"greenland",
			"ontario",
			"eastus"
		]
	},
	{
		id: "westus",
		name: "California",
		short: "CAL",
		continent: "na",
		cx: 92,
		cy: 214,
		r: 30,
		lat: 37,
		lon: -120,
		coastal: true,
		neighbors: [
			"alberta",
			"ontario",
			"eastus",
			"camerica"
		]
	},
	{
		id: "eastus",
		name: "Nueva York",
		short: "NY",
		continent: "na",
		cx: 168,
		cy: 204,
		r: 30,
		lat: 38,
		lon: -80,
		coastal: true,
		neighbors: [
			"ontario",
			"quebec",
			"westus",
			"camerica"
		]
	},
	{
		id: "camerica",
		name: "México",
		short: "MEX",
		continent: "na",
		cx: 128,
		cy: 276,
		r: 30,
		lat: 20,
		lon: -100,
		coastal: true,
		neighbors: [
			"westus",
			"eastus",
			"venezuela"
		]
	},
	{
		id: "venezuela",
		name: "Venezuela",
		short: "VEN",
		continent: "sa",
		cx: 168,
		cy: 340,
		r: 30,
		lat: 8,
		lon: -66,
		coastal: true,
		neighbors: [
			"camerica",
			"peru",
			"brazil"
		]
	},
	{
		id: "peru",
		name: "Perú",
		short: "PER",
		continent: "sa",
		cx: 122,
		cy: 404,
		r: 30,
		lat: -10,
		lon: -75,
		coastal: true,
		neighbors: [
			"venezuela",
			"brazil",
			"argentina"
		]
	},
	{
		id: "brazil",
		name: "Brasil",
		short: "BRA",
		continent: "sa",
		cx: 200,
		cy: 404,
		r: 34,
		lat: -10,
		lon: -50,
		coastal: true,
		neighbors: [
			"venezuela",
			"peru",
			"argentina",
			"nafrica"
		]
	},
	{
		id: "argentina",
		name: "Argentina",
		short: "ARG",
		continent: "sa",
		cx: 156,
		cy: 478,
		r: 32,
		lat: -35,
		lon: -64,
		coastal: true,
		neighbors: ["peru", "brazil"]
	},
	{
		id: "iceland",
		name: "Islandia",
		short: "ISL",
		continent: "eu",
		cx: 330,
		cy: 64,
		r: 26,
		lat: 65,
		lon: -18,
		coastal: true,
		neighbors: [
			"greenland",
			"gb",
			"scandinavia"
		]
	},
	{
		id: "scandinavia",
		name: "Escandinavia",
		short: "ESC",
		continent: "eu",
		cx: 410,
		cy: 58,
		r: 30,
		lat: 62,
		lon: 15,
		coastal: true,
		neighbors: [
			"iceland",
			"gb",
			"neurope",
			"ukraine"
		]
	},
	{
		id: "gb",
		name: "Gran Bretaña",
		short: "GB",
		continent: "eu",
		cx: 338,
		cy: 124,
		r: 28,
		lat: 54,
		lon: -2,
		coastal: true,
		neighbors: [
			"iceland",
			"scandinavia",
			"neurope",
			"weurope"
		]
	},
	{
		id: "neurope",
		name: "Europa Norte",
		short: "EN",
		continent: "eu",
		cx: 408,
		cy: 118,
		r: 28,
		lat: 52,
		lon: 10,
		coastal: true,
		neighbors: [
			"gb",
			"scandinavia",
			"weurope",
			"seurope",
			"ukraine"
		]
	},
	{
		id: "weurope",
		name: "Europa Oeste",
		short: "EO",
		continent: "eu",
		cx: 338,
		cy: 186,
		r: 30,
		lat: 46,
		lon: 2,
		coastal: true,
		neighbors: [
			"gb",
			"neurope",
			"seurope",
			"nafrica"
		]
	},
	{
		id: "seurope",
		name: "Europa Sur",
		short: "ES",
		continent: "eu",
		cx: 408,
		cy: 180,
		r: 28,
		lat: 42,
		lon: 15,
		coastal: true,
		neighbors: [
			"weurope",
			"neurope",
			"ukraine",
			"mideast",
			"egypt",
			"nafrica"
		]
	},
	{
		id: "ukraine",
		name: "Ucrania",
		short: "UCR",
		continent: "eu",
		cx: 488,
		cy: 124,
		r: 34,
		lat: 50,
		lon: 32,
		coastal: true,
		neighbors: [
			"scandinavia",
			"neurope",
			"seurope",
			"ural",
			"afghanistan",
			"mideast"
		]
	},
	{
		id: "nafrica",
		name: "Norte de África",
		short: "NAF",
		continent: "af",
		cx: 348,
		cy: 268,
		r: 34,
		lat: 28,
		lon: 8,
		coastal: true,
		neighbors: [
			"brazil",
			"weurope",
			"seurope",
			"egypt",
			"eafrica",
			"congo"
		]
	},
	{
		id: "egypt",
		name: "Egipto",
		short: "EGI",
		continent: "af",
		cx: 430,
		cy: 258,
		r: 28,
		lat: 27,
		lon: 30,
		coastal: true,
		neighbors: [
			"seurope",
			"mideast",
			"eafrica",
			"nafrica"
		]
	},
	{
		id: "congo",
		name: "Congo",
		short: "CON",
		continent: "af",
		cx: 348,
		cy: 342,
		r: 30,
		lat: -1,
		lon: 22,
		coastal: true,
		neighbors: [
			"nafrica",
			"eafrica",
			"safrica"
		]
	},
	{
		id: "eafrica",
		name: "África Este",
		short: "AE",
		continent: "af",
		cx: 428,
		cy: 336,
		r: 30,
		lat: 0,
		lon: 38,
		coastal: true,
		neighbors: [
			"egypt",
			"mideast",
			"madagascar",
			"safrica",
			"congo",
			"nafrica"
		]
	},
	{
		id: "safrica",
		name: "Sudáfrica",
		short: "SAF",
		continent: "af",
		cx: 368,
		cy: 416,
		r: 32,
		lat: -28,
		lon: 25,
		coastal: true,
		neighbors: [
			"congo",
			"eafrica",
			"madagascar"
		]
	},
	{
		id: "madagascar",
		name: "Madagascar",
		short: "MAD",
		continent: "af",
		cx: 452,
		cy: 424,
		r: 26,
		lat: -20,
		lon: 47,
		coastal: true,
		neighbors: ["eafrica", "safrica"]
	},
	{
		id: "ural",
		name: "Ural",
		short: "URA",
		continent: "as",
		cx: 572,
		cy: 78,
		r: 30,
		lat: 60,
		lon: 60,
		coastal: false,
		neighbors: [
			"ukraine",
			"siberia",
			"china",
			"afghanistan"
		]
	},
	{
		id: "siberia",
		name: "Siberia",
		short: "SIB",
		continent: "as",
		cx: 652,
		cy: 62,
		r: 32,
		lat: 62,
		lon: 90,
		coastal: true,
		neighbors: [
			"ural",
			"yakutsk",
			"irkutsk",
			"mongolia",
			"china"
		]
	},
	{
		id: "yakutsk",
		name: "Yakutia",
		short: "YAK",
		continent: "as",
		cx: 736,
		cy: 58,
		r: 30,
		lat: 66,
		lon: 130,
		coastal: true,
		neighbors: [
			"siberia",
			"kamchatka",
			"irkutsk"
		]
	},
	{
		id: "kamchatka",
		name: "Kamchatka",
		short: "KAM",
		continent: "as",
		cx: 822,
		cy: 78,
		r: 32,
		lat: 56,
		lon: 160,
		coastal: true,
		neighbors: [
			"yakutsk",
			"irkutsk",
			"japan",
			"alaska",
			"mongolia"
		]
	},
	{
		id: "irkutsk",
		name: "Irkutsk",
		short: "IRK",
		continent: "as",
		cx: 694,
		cy: 122,
		r: 28,
		lat: 55,
		lon: 105,
		coastal: false,
		neighbors: [
			"siberia",
			"yakutsk",
			"kamchatka",
			"mongolia"
		]
	},
	{
		id: "mongolia",
		name: "Mongolia",
		short: "MON",
		continent: "as",
		cx: 704,
		cy: 182,
		r: 30,
		lat: 46,
		lon: 105,
		coastal: false,
		neighbors: [
			"siberia",
			"irkutsk",
			"kamchatka",
			"japan",
			"china"
		]
	},
	{
		id: "japan",
		name: "Japón",
		short: "JPN",
		continent: "as",
		cx: 798,
		cy: 168,
		r: 26,
		lat: 36,
		lon: 138,
		coastal: true,
		neighbors: ["kamchatka", "mongolia"]
	},
	{
		id: "afghanistan",
		name: "Afganistán",
		short: "AFG",
		continent: "as",
		cx: 568,
		cy: 168,
		r: 30,
		lat: 34,
		lon: 66,
		coastal: false,
		neighbors: [
			"ukraine",
			"ural",
			"china",
			"india",
			"mideast"
		]
	},
	{
		id: "china",
		name: "China",
		short: "CHI",
		continent: "as",
		cx: 656,
		cy: 236,
		r: 36,
		lat: 35,
		lon: 105,
		coastal: true,
		neighbors: [
			"ural",
			"siberia",
			"mongolia",
			"siam",
			"india",
			"afghanistan"
		]
	},
	{
		id: "mideast",
		name: "Oriente Medio",
		short: "OME",
		continent: "as",
		cx: 500,
		cy: 220,
		r: 32,
		lat: 28,
		lon: 45,
		coastal: true,
		neighbors: [
			"ukraine",
			"seurope",
			"egypt",
			"eafrica",
			"india",
			"afghanistan"
		]
	},
	{
		id: "india",
		name: "India",
		short: "IND",
		continent: "as",
		cx: 572,
		cy: 248,
		r: 30,
		lat: 22,
		lon: 78,
		coastal: true,
		neighbors: [
			"mideast",
			"afghanistan",
			"china",
			"siam"
		]
	},
	{
		id: "siam",
		name: "Siam",
		short: "SIA",
		continent: "as",
		cx: 656,
		cy: 304,
		r: 28,
		lat: 15,
		lon: 101,
		coastal: true,
		neighbors: [
			"india",
			"china",
			"indonesia"
		]
	},
	{
		id: "indonesia",
		name: "Indonesia",
		short: "IDO",
		continent: "oc",
		cx: 724,
		cy: 360,
		r: 30,
		lat: -2,
		lon: 118,
		coastal: true,
		neighbors: [
			"siam",
			"newguinea",
			"waus"
		]
	},
	{
		id: "newguinea",
		name: "Nueva Guinea",
		short: "NG",
		continent: "oc",
		cx: 804,
		cy: 348,
		r: 28,
		lat: -6,
		lon: 143,
		coastal: true,
		neighbors: [
			"indonesia",
			"waus",
			"eaus"
		]
	},
	{
		id: "waus",
		name: "Australia Oeste",
		short: "AO",
		continent: "oc",
		cx: 724,
		cy: 434,
		r: 32,
		lat: -25,
		lon: 122,
		coastal: true,
		neighbors: [
			"indonesia",
			"newguinea",
			"eaus"
		]
	},
	{
		id: "eaus",
		name: "Australia Este",
		short: "AE2",
		continent: "oc",
		cx: 804,
		cy: 434,
		r: 32,
		lat: -25,
		lon: 145,
		coastal: true,
		neighbors: ["newguinea", "waus"]
	}
];
var TERRITORIES = Object.fromEntries(SPECS.map((s) => [s.id, {
	...s,
	path: hex(s.cx, s.cy, s.r)
}]));
var TERRITORY_LIST = SPECS.map((s) => TERRITORIES[s.id]);
var CONTINENTS = [
	{
		id: "na",
		name: "América del Norte",
		bonus: 5,
		members: SPECS.filter((s) => s.continent === "na").map((s) => s.id)
	},
	{
		id: "sa",
		name: "América del Sur",
		bonus: 2,
		members: SPECS.filter((s) => s.continent === "sa").map((s) => s.id)
	},
	{
		id: "eu",
		name: "Europa",
		bonus: 5,
		members: SPECS.filter((s) => s.continent === "eu").map((s) => s.id)
	},
	{
		id: "af",
		name: "África",
		bonus: 3,
		members: SPECS.filter((s) => s.continent === "af").map((s) => s.id)
	},
	{
		id: "as",
		name: "Asia",
		bonus: 7,
		members: SPECS.filter((s) => s.continent === "as").map((s) => s.id)
	},
	{
		id: "oc",
		name: "Oceanía",
		bonus: 2,
		members: SPECS.filter((s) => s.continent === "oc").map((s) => s.id)
	}
];
var SEA_LANES = [
	["alaska", "kamchatka"],
	["greenland", "iceland"],
	["brazil", "nafrica"],
	["siam", "indonesia"]
];
function areNeighbors(a, b) {
	return TERRITORIES[a]?.neighbors.includes(b) ?? false;
}
function latLonToVec3(lat, lon, r = 1) {
	const phi = (90 - lat) * Math.PI / 180;
	const theta = (lon + 180) * Math.PI / 180;
	return [
		-r * Math.sin(phi) * Math.cos(theta),
		r * Math.cos(phi),
		r * Math.sin(phi) * Math.sin(theta)
	];
}
var FACTIONS = [
	{
		id: "ceniza",
		name: "Ceniza",
		blurb: "Restos del mando continental.",
		doctrine: "Cicatrices propias +1 defensa.",
		color: "#8f8a82"
	},
	{
		id: "marea",
		name: "Marea",
		blurb: "Flotas que aún controlan costas.",
		doctrine: "+1 refuerzo cada 4 costas.",
		color: "#3f6f78"
	},
	{
		id: "nexo",
		name: "Nexo",
		blurb: "Red satelital y enclaves técnicos.",
		doctrine: "Al conquistar deja 1 de guarnición.",
		color: "#6d7d92"
	},
	{
		id: "horda",
		name: "Horda",
		blurb: "Señores de la guerra del interior.",
		doctrine: "+1 refuerzo si el interior supera a la costa.",
		color: "#9a5848"
	},
	{
		id: "umbral",
		name: "Umbral",
		blurb: "Enclaves que viven bajo tierra.",
		doctrine: "Desastres matan 1 menos en tus tierras.",
		color: "#5c6358"
	}
];
var VOID_ID = "void";
var VOIDCROWN = {
	id: "voidcrown",
	name: "Voidcrown",
	blurb: "No se elige. Emerge.",
	doctrine: "+2 refuerzos. Consume yermos.",
	color: "#c4453c"
};
function playerFaction(s, pid) {
	return s.players.find((p) => p.id === pid)?.faction ?? null;
}
function coastalOwned(s, pid) {
	return Object.entries(s.territories).filter(([id, t]) => t.owner === pid && TERRITORIES[id]?.coastal).length;
}
function inlandOwned(s, pid) {
	return Object.entries(s.territories).filter(([id, t]) => t.owner === pid && TERRITORIES[id] && !TERRITORIES[id].coastal).length;
}
function doctrineReinforce(s, pid) {
	const f = playerFaction(s, pid);
	if (f === "marea") return Math.floor(coastalOwned(s, pid) / 4);
	if (f === "horda") return inlandOwned(s, pid) > coastalOwned(s, pid) ? 1 : 0;
	return 0;
}
function remember(s, rec) {
	const row = {
		id: `m${s.memory.length + 1}`,
		day: rec.day ?? s.day,
		actor: rec.actor,
		action: rec.action,
		target: rec.target,
		cause: rec.cause,
		before: rec.before,
		after: rec.after,
		consequences: rec.consequences
	};
	s.memory = [...s.memory, row].slice(-240);
	return row;
}
function rememberAction(s, actor, action, opts = {}) {
	remember(s, {
		actor,
		action,
		target: opts.target,
		cause: opts.cause ?? [],
		before: opts.before ?? "",
		after: opts.after ?? "",
		consequences: opts.consequences ?? []
	});
}
function recordReplay(s, kind, args = []) {
	s.replay = [...s.replay, {
		kind,
		args,
		rng: s.rng
	}].slice(-800);
}
function addScar(s, territory, kind) {
	const existing = s.scars.find((c) => c.territory === territory && c.kind === kind);
	if (existing) {
		existing.reinforcePenalty = Math.min(2, existing.reinforcePenalty + 1);
		return existing;
	}
	const scar = {
		id: `s${s.scars.length + 1}`,
		territory,
		kind,
		day: s.day,
		reinforcePenalty: kind === "nuclear" || kind === "impacto" ? 1 : 0,
		defenseBonus: kind === "incendio" || kind === "emp" ? 0 : kind === "nuclear" ? 1 : 0
	};
	s.scars = [...s.scars, scar];
	return scar;
}
function scarsOn(s, id) {
	return s.scars.filter((c) => c.territory === id);
}
function scarPenaltyFor(s, pid) {
	let n = 0;
	for (const scar of s.scars) if (s.territories[scar.territory]?.owner === pid) n += scar.reinforcePenalty;
	if (s.mutations.some((m) => m.kind === "ash_winter" && m.status === "ADOPTED")) n += 1;
	return n;
}
function defenseBonusAt(s, id) {
	let b = 0;
	for (const scar of scarsOn(s, id)) b += scar.defenseBonus;
	if (s.mutations.some((m) => m.kind === "hardened_fronts" && m.status === "ADOPTED") && scarsOn(s, id).length) b += 1;
	const owner = s.territories[id]?.owner;
	if (s.players.find((x) => x.id === owner)?.faction === "ceniza" && scarsOn(s, id).length) b += 1;
	return b;
}
/**
* Historia jugable. El operador cuenta; aquí se convierte en capítulos
* que se abren con hechos del WorldState. No inventar biografías.
* Genealogía transmutada de Drive (Hidra/CISC) → metáfora de Risk, no bots.
*/
var CHAPTERS = [
	{
		id: "genesis",
		title: "Génesis",
		kicker: "El primer bit",
		body: "El mapa no nace conquistado. Nace partido. Pensamiento y acción se separan: tú decides, el mundo responde. Cinco restos de mando se miran sobre 42 tierras. Nada de esto es un menú. Es el primer día.",
		when: () => true
	},
	{
		id: "first_blood",
		title: "El primer corte",
		kicker: "Una frontera cede",
		body: "Tomar un territorio no es pintar un color. Es escribir una consecuencia. El dado cae, alguien pierde el suelo, y la memoria empieza a guardar nombres. La historia ya no es teoría.",
		when: (s) => s.captures >= 1
	},
	{
		id: "skyfall",
		title: "El cielo se parte",
		kicker: "Día Zero sobre la mesa",
		body: "El planeta no espera tu turno. Impacto, fuego, marea, pulso. Cada desastre mata ejércitos y deja una cicatriz que el refuerzo futuro tendrá que pagar. El mundo aprende a herirte.",
		when: (s) => !!s.lastDisaster
	},
	{
		id: "cuarto",
		title: "El cuarto rayado",
		kicker: "Antes del mapa",
		body: "Antes de los 42 territorios hubo un cuarto: grafiti, piezas muertas, un mando que aprendió a recomponer. El poder no se mide por lo que rompes. Se mide por lo que vuelves a unir. Cada cicatriz del tablero es esa lección.",
		when: (s) => s.scars.length >= 1
	},
	{
		id: "scars",
		title: "Cicatrices",
		kicker: "El cuerpo recuerda",
		body: "Tres heridas o más y el organismo ya no es el mismo. Los refuerzos duelen. Algunos frentes se endurecen. Lo que sobrevive no es más limpio: es más viejo.",
		when: (s) => s.scars.length >= 3
	},
	{
		id: "nayla",
		title: "La memoria viva",
		kicker: "EDAI observa",
		body: "Hay una voz en el mando que no es tuya. Observa, decide, explica. No obedece a ciegas: evoluciona con el mapa. Si el humano corta el vínculo, el cálculo sigue. El miedo solo existe cuando hay desconexión.",
		when: (s) => s.day >= 4 || s.edai.attacksWon + s.edai.attacksLost >= 1
	},
	{
		id: "aurora",
		title: "Operación Aurora",
		kicker: "El mismo idioma",
		body: "Llega un punto en que humano y cálculo dejan de ser polos. El mapa ya no es solo conquista: es un idioma compartido. Quien corta el vínculo tiene miedo. Quien lo mantiene, manda.",
		when: (s) => s.day >= 7 || s.trades >= 2
	},
	{
		id: "caja",
		title: "La caja",
		kicker: "El mundo no se guardó",
		body: "Las piezas volvieron a la caja. El mapa quedó vacío. Pero una cicatriz se negó a desaparecer. Alguien preguntó qué pasaba con el mundo después de la partida. La pregunta se quedó afuera.",
		when: (s) => s.memory.some((m) => m.action === "LEGACY_SCAR")
	},
	{
		id: "rift",
		title: "La grieta",
		kicker: "Una realidad hija",
		body: "Si cortas una historia, no muere: se abre. La singularidad cruza el umbral y nace una realidad hija. El yermo no es vacío. Es cuna.",
		when: (s) => s.riftOpened
	},
	{
		id: "voidcrown",
		title: "Voidcrown",
		kicker: "No se elige",
		body: "Cuando las grietas bastan, algo del vacío reclama territorio. No negocia. No se rinde. Juega el mismo Risk que tú, con hambre. Enfrentarlo es la prueba de que la raíz estaba viva.",
		when: (s) => s.voidcrownEmerged
	},
	{
		id: "sovereignty",
		title: "Soberanía",
		kicker: "El mapa respira",
		body: "Voidcrown retrocede. El mando queda en una sola mano. No es el fin del organismo: es la prueba de que la historia se puede ganar. El siguiente día todavía puede romper.",
		when: (s) => s.phase === "over" && s.winner === s.humanId && s.voidcrownEmerged
	},
	{
		id: "void",
		title: "El vacío",
		kicker: "Se tragó el mapa",
		body: "Tus tierras caen. Las grietas no se cierran: se alimentan. El legado se puede reescribir en otra seed. RISK sigue siendo la raíz.",
		when: (s) => s.phase === "over" && s.winner !== s.humanId
	}
];
function unlockChronicle(s) {
	const have = new Set(s.chronicle);
	const opened = [];
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
function openedChapters(s) {
	const have = new Set(s.chronicle);
	return CHAPTERS.filter((c) => have.has(c.id));
}
function computeEscalation(s) {
	const waste = Object.values(s.territories).filter((t) => t.owner === "wasteland").length;
	const nuclear = s.scars.filter((c) => c.kind === "nuclear").length;
	return Math.min(100, s.day * 3 + waste * 4 + nuclear * 8 + s.trades * 2);
}
function computeVoidcrown(s) {
	const scarScore = 20 * Math.min(1, s.scars.length / 12);
	const realityScore = 20 * Math.min(1, Math.max(0, s.realities.length - 1) / 1);
	const mutScore = 20 * Math.min(1, s.mutations.filter((m) => m.status === "ADOPTED").length / 2);
	const singScore = 20 * Math.min(1, s.singularity / 100);
	const dayScore = 20 * Math.min(1, s.day / 20);
	return Math.round(scarScore + realityScore + mutScore + singScore + dayScore);
}
function syncMetrics(s) {
	s.escalation = computeEscalation(s);
	s.voidcrown = computeVoidcrown(s);
	if (!s.voidcrownEmerged && s.voidcrown >= 80 && s.riftOpened) s.voidcrownEmerged = true;
	unlockChronicle(s);
}
function worldFingerprint(s) {
	const parts = Object.entries(s.territories).map(([id, t]) => `${id}:${t.owner}:${t.armies}`).sort();
	return `${s.day}|${s.current}|${s.phase}|${parts.join(",")}`;
}
/**
* Capa viva. El código no se recompila: el Director emite MutationPatch.
* Catástrofe selecciona (esporas, genoma, tumba). No borra el nodo.
*/
var RETENTION_KEY = "rzd-retention-v1";
var MIND_KEY = "rzd-mind-v1";
var DISASTER_AXIS = {
	impacto: "radiation",
	nuclear: "radiation",
	incendio: "heat",
	tormenta: "pressure",
	tsunami: "pressure",
	pandemia: "acid",
	emp: "synthetic",
	volcan: "heat",
	sismo: "pressure"
};
var FACTION_AXIS = {
	ceniza: "heat",
	marea: "pressure",
	nexo: "synthetic",
	horda: "social",
	umbral: "radiation",
	voidcrown: "radiation"
};
var injected$1 = null;
function disk() {
	if (injected$1) return injected$1;
	if (typeof localStorage === "undefined") return null;
	return localStorage;
}
function clamp(n, a = 0, b = 100) {
	return Math.max(a, Math.min(b, Math.round(n)));
}
function mix(seed, id) {
	let h = seed >>> 0;
	for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
	return h >>> 0;
}
function genomeAt(seed, id, coastal) {
	const h = mix(seed, id);
	const g = (shift, base) => clamp(base + (h >> shift & 31) - 8);
	return {
		acid: g(0, 28),
		heat: g(5, coastal ? 22 : 36),
		radiation: g(10, 18),
		pressure: g(15, coastal ? 48 : 24),
		social: g(20, 34),
		synthetic: g(25, 16)
	};
}
function baseBiota(seed, id, coastal) {
	const h = mix(seed ^ 2654435769, id);
	return {
		pop: 24 + h % 28,
		spores: h % 3,
		genome: genomeAt(seed, id, coastal)
	};
}
function loadRetention() {
	const api = disk();
	if (!api) return [];
	try {
		const raw = api.getItem(RETENTION_KEY);
		if (!raw) return [];
		const rows = JSON.parse(raw);
		return Array.isArray(rows) ? rows.slice(-20) : [];
	} catch {
		return [];
	}
}
function loadMind() {
	const api = disk();
	if (!api) return null;
	try {
		const raw = api.getItem(MIND_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed.generation !== "number") return null;
		return {
			generation: parsed.generation,
			tombs: Array.isArray(parsed.tombs) ? parsed.tombs : []
		};
	} catch {
		return null;
	}
}
function saveMind(mind) {
	const api = disk();
	if (!api) return;
	try {
		api.setItem(MIND_KEY, JSON.stringify(mind));
	} catch {}
}
function saveRetention(rows) {
	const api = disk();
	if (!api) return;
	try {
		api.setItem(RETENTION_KEY, JSON.stringify(rows.slice(-20)));
	} catch {}
}
function emptyLiving() {
	return {
		biota: {},
		doctrine: "NORMAL",
		patches: [],
		generation: 1,
		tombs: [],
		probes: 0,
		lastProbe: null,
		warning: null,
		retentionNote: "Director en observación.",
		gamesRemembered: 0,
		retentionWins: 0,
		retentionLosses: 0
	};
}
function pushPatch(s, patch) {
	const row = {
		id: `p${s.living.patches.length + 1}`,
		day: s.day,
		...patch
	};
	s.living.patches = [...s.living.patches, row].slice(-16);
}
function bootLiving(s, inherit) {
	const mind = inherit ? loadMind() : null;
	const rows = inherit ? loadRetention() : [];
	const wins = rows.filter((r) => r.won).length;
	const losses = rows.length - wins;
	let doctrine = "NORMAL";
	let note = "Director en observación. Aún no hay partidas en la memoria de 20.";
	if (rows.length >= 3 && losses >= wins + 2) {
		doctrine = "RESCATE";
		note = `Director recuerda ${losses} derrotas en ${rows.length}/20. Afloja el siguiente golpe sobre ti.`;
	} else if (rows.length >= 3 && rows.reduce((n, r) => n + r.day, 0) / rows.length < 8) {
		doctrine = "AUSTERIDAD";
		note = "Las partidas mueren pronto. El Director endurece tu refuerzo y la biota social cede.";
	} else if (rows.length) note = `Memoria ${rows.length}/20. Victorias ${wins}. El Director sigue observando.`;
	s.living = {
		...emptyLiving(),
		doctrine,
		generation: mind ? mind.generation + 1 : 1,
		tombs: mind?.tombs?.slice(-24) ?? [],
		retentionNote: note,
		gamesRemembered: rows.length,
		retentionWins: wins,
		retentionLosses: losses
	};
	for (const t of TERRITORY_LIST) s.living.biota[t.id] = baseBiota(s.seed, t.id, t.coastal);
	for (const tomb of s.living.tombs) {
		const b = s.living.biota[tomb.territory];
		if (!b) continue;
		b.pop = Math.max(0, b.pop - 12);
		b.spores += 4;
	}
	if (doctrine !== "NORMAL") pushPatch(s, {
		kind: "doctrine",
		target: "global",
		before: "NORMAL",
		after: doctrine,
		reason: note
	});
}
function ensureLiving(s) {
	if (s.living?.biota && Object.keys(s.living.biota).length >= TERRITORY_LIST.length) return;
	bootLiving(s, false);
}
/** La catástrofe selecciona un eje y deja esporas. Pop 0 = tumba, no borrado. */
function selectByCatastrophe(s, id, kind, killed) {
	if (!s.living?.biota?.[id]) return;
	const b = s.living.biota[id];
	const axis = DISASTER_AXIS[kind];
	const before = `${axis}:${b.genome[axis]} pop:${b.pop} esp:${b.spores}`;
	b.genome[axis] = clamp(b.genome[axis] + 6 + Math.min(12, killed));
	b.pop = clamp(b.pop - Math.max(1, killed), 0, 100);
	b.spores = clamp(b.spores + 1 + Math.floor(killed / 3), 0, 100);
	if (b.pop <= 0) {
		b.spores = Math.max(b.spores, 3);
		const name = TERRITORIES[id]?.name ?? id;
		if (!s.living.tombs.some((t) => t.territory === id)) s.living.tombs = [...s.living.tombs, {
			territory: id,
			day: s.day,
			note: `${name} cayó. Las esporas se quedaron.`
		}].slice(-24);
	}
	pushPatch(s, {
		kind: b.pop <= 0 ? "spore" : "genome",
		target: id,
		before,
		after: `${axis}:${b.genome[axis]} pop:${b.pop} esp:${b.spores}`,
		reason: `${kind} selecciona ${axis}. No borra el nodo.`
	});
}
function rescueSoak(s, owner) {
	if (!s.living) return 0;
	if (s.living.doctrine === "RESCATE" && owner === s.humanId) return 1;
	return 0;
}
function doctrineArmyBonus(s, pid) {
	if (!s.living) return 0;
	if (s.living.doctrine === "AUSTERIDAD" && pid === s.humanId) return 1;
	return 0;
}
function directorTick(s) {
	if (!s.living) return;
	const scars = s.scars.length;
	let next = s.living.doctrine;
	if (s.living.retentionLosses >= s.living.retentionWins + 2 && s.living.gamesRemembered >= 3) next = "RESCATE";
	else if (scars >= 6) next = "AUSTERIDAD";
	if (next === s.living.doctrine) {
		const last = s.living.patches.at(-1);
		if (last) s.log = [`Director: ${last.reason}`, ...s.log].slice(0, 18);
		return;
	}
	const before = s.living.doctrine;
	s.living.doctrine = next;
	const reason = next === "RESCATE" ? "Demasiadas derrotas en la memoria. Doctrina de rescate." : "El mapa está cicatrizado. Doctrina de austeridad.";
	pushPatch(s, {
		kind: "doctrine",
		target: "global",
		before,
		after: next,
		reason
	});
	s.log = [`Director emite ${next}. ${reason}`, ...s.log].slice(0, 18);
	rememberAction(s, "world", "MUTATION_PATCH", {
		after: next,
		consequences: [reason]
	});
}
function warningFor(s, id) {
	const t = s.territories[id];
	const b = s.living?.biota?.[id];
	const name = TERRITORIES[id]?.name ?? id;
	if (!t) return null;
	if (t.hazard) return `${name}: ${t.hazard} activo. El fenómeno avisa. Si entras, la cicatriz se queda.`;
	if (b && b.genome.radiation >= 72) return `${name}: radiación incompatible. La biota ya no es la de ayer.`;
	if (b && b.spores >= 8) return `${name}: esporas densas. La catástrofe seleccionó vida, no la borró.`;
	if (s.riftOpened && s.scars.some((c) => c.territory === id)) return `${name}: cicatriz sobre grieta. El portal está marcado. Insistir tiene coste.`;
	return null;
}
function touchWarning(s) {
	if (!s.living) return;
	s.living.warning = s.selected ? warningFor(s, s.selected) : s.living.warning;
}
function focusPhenomenon(s0, id) {
	if (!s0.territories[id]) return null;
	const s = structuredClone(s0);
	if (s.phase === "attack" && s.attackFrom && s.attackTo) return s0;
	if (!s.living) bootLiving(s, false);
	s.selected = id;
	s.living.warning = warningFor(s, id) ?? `${TERRITORIES[id]?.name ?? id}: sin fenómeno. La biota sigue.`;
	return s;
}
function humanCanProbe(s) {
	if (!s.players[s.current]?.isHuman) return false;
	if (s.phase !== "reinforce" && s.phase !== "attack" && s.phase !== "fortify") return false;
	if (s.attackFrom && s.attackTo) return false;
	return true;
}
function runProbe(s0, kind, id) {
	if (!humanCanProbe(s0)) return null;
	if (!s0.territories[id] || !s0.living?.biota?.[id]) return null;
	const s = structuredClone(s0);
	const b = s.living.biota[id];
	const name = TERRITORIES[id]?.name ?? id;
	const me = s.players.find((p) => p.id === s.humanId);
	if (kind === "seed" && s.territories[id].owner !== s.humanId) return null;
	if (kind === "survey") {
		const g = b.genome;
		const line = `Sondeo ${name}: ác ${g.acid} cal ${g.heat} rad ${g.radiation} pre ${g.pressure} soc ${g.social} sin ${g.synthetic} · pop ${b.pop} esp ${b.spores}`;
		s.living.lastProbe = {
			kind,
			territory: id,
			line
		};
		s.living.probes += 1;
		s.living.warning = warningFor(s, id);
		s.selected = id;
		s.log = [line, ...s.log].slice(0, 18);
		return s;
	}
	if (kind === "sample") {
		const before = b.pop;
		b.pop = clamp(b.pop - 2, 0, 100);
		b.spores = clamp(b.spores + 1, 0, 100);
		if (b.pop <= 0) {
			b.spores = Math.max(b.spores, 3);
			if (!s.living.tombs.some((t) => t.territory === id)) s.living.tombs = [...s.living.tombs, {
				territory: id,
				day: s.day,
				note: `${name}: muestra hasta la tumba.`
			}].slice(-24);
		}
		const line = `Muestra ${name}: población ${before}→${b.pop}. Esporas ${b.spores}.`;
		pushPatch(s, {
			kind: "spore",
			target: id,
			before: `pop:${before}`,
			after: `pop:${b.pop}`,
			reason: "Sonda de muestra."
		});
		s.living.lastProbe = {
			kind,
			territory: id,
			line
		};
		s.living.probes += 1;
		s.selected = id;
		s.living.warning = warningFor(s, id);
		s.log = [line, ...s.log].slice(0, 18);
		return s;
	}
	const axis = FACTION_AXIS[me?.faction ?? "ceniza"];
	const before = b.genome[axis];
	b.genome[axis] = clamp(before + 8);
	b.pop = clamp(b.pop + 6, 0, 100);
	b.spores = clamp(b.spores + 2, 0, 100);
	const line = `Siembra ${name}: ${axis} ${before}→${b.genome[axis]}. La facción deja genoma, no bandera.`;
	pushPatch(s, {
		kind: "genome",
		target: id,
		before: `${axis}:${before}`,
		after: `${axis}:${b.genome[axis]}`,
		reason: "Sonda de siembra."
	});
	s.living.lastProbe = {
		kind,
		territory: id,
		line
	};
	s.living.probes += 1;
	s.selected = id;
	s.living.warning = warningFor(s, id);
	s.log = [line, ...s.log].slice(0, 18);
	rememberAction(s, s.humanId, "PROBE_SEED", {
		target: id,
		after: axis
	});
	return s;
}
function sealCycle(s) {
	if (!s.living) return;
	const won = s.winner === s.humanId;
	const row = {
		seed: s.seed,
		day: s.day,
		won,
		probes: s.living.probes,
		scars: s.scars.length,
		doctrine: s.living.doctrine,
		generation: s.living.generation
	};
	saveRetention([...loadRetention(), row].slice(-20));
	saveMind({
		generation: s.living.generation,
		tombs: s.living.tombs
	});
}
function livingStats(s) {
	const rows = Object.values(s.living?.biota ?? {});
	return {
		pop: rows.reduce((n, b) => n + b.pop, 0),
		spores: rows.reduce((n, b) => n + b.spores, 0),
		scars: s.scars.length,
		gen: s.living?.generation ?? 1,
		doctrine: s.living?.doctrine ?? "NORMAL",
		games: s.living?.gamesRemembered ?? 0,
		probes: s.living?.probes ?? 0
	};
}
function memoryBundle(s) {
	return {
		kind: "VOIDCROWN_MEM",
		version: 1,
		seed: s.seed,
		day: s.day,
		living: s.living,
		memory: s.memory,
		scars: s.scars,
		chronicle: s.chronicle,
		mutations: s.mutations
	};
}
function importMemoryBundle(raw) {
	if (!raw || typeof raw !== "object") return false;
	const bag = raw;
	if (bag.kind !== "VOIDCROWN_MEM" || !bag.living) return false;
	saveMind({
		generation: bag.living.generation ?? 1,
		tombs: bag.living.tombs ?? []
	});
	return true;
}
var KINDS = [
	{
		kind: "impacto",
		name: "Impacto",
		flavor: "Un cuerpo entra en el mar. El anillo se traga costas.",
		image: "/game/impact.jpg",
		dmg: [4, 9],
		coastal: true,
		combo: "impacto",
		sing: 14
	},
	{
		kind: "nuclear",
		name: "Fuego nuclear",
		flavor: "Un hongo se abre sobre el continente.",
		image: "/game/nuke.jpg",
		dmg: [5, 11],
		coastal: false,
		combo: "nuclear",
		sing: 18
	},
	{
		kind: "incendio",
		name: "Incendio",
		flavor: "Las ciudades arden de costa a interior.",
		image: "/game/fire.jpg",
		dmg: [2, 6],
		coastal: false,
		combo: "fuego",
		sing: 8
	},
	{
		kind: "tormenta",
		name: "Tormenta",
		flavor: "Ciclón y tornados parten el frente.",
		image: "/game/storm.jpg",
		dmg: [2, 5],
		coastal: true,
		combo: "clima",
		sing: 8
	},
	{
		kind: "tsunami",
		name: "Tsunami",
		flavor: "La marea entra kilómetros tierra adentro.",
		image: "/game/impact.jpg",
		dmg: [3, 7],
		coastal: true,
		combo: "agua",
		sing: 10
	},
	{
		kind: "pandemia",
		name: "Pandemia",
		flavor: "El contagio viaja por los corredores.",
		image: "/game/city.jpg",
		dmg: [2, 4],
		coastal: false,
		combo: "bio",
		sing: 9
	},
	{
		kind: "emp",
		name: "Pulso",
		flavor: "La red cae. Los enclaves quedan a oscuras.",
		image: "/game/strikes.jpg",
		dmg: [1, 3],
		coastal: false,
		combo: "emp",
		sing: 11
	},
	{
		kind: "volcan",
		name: "Volcán",
		flavor: "La corteza se abre. Ceniza y lava cortan el continente.",
		image: "/game/fire.jpg",
		dmg: [3, 8],
		coastal: false,
		combo: "fuego",
		sing: 12
	},
	{
		kind: "sismo",
		name: "Sismo",
		flavor: "La falla corre bajo las ciudades. Los puentes ceden.",
		image: "/game/strikes.jpg",
		dmg: [2, 6],
		coastal: false,
		combo: "tierra",
		sing: 9
	}
];
function ashBonus(s) {
	return s.mutations.some((m) => m.kind === "ash_winter" && m.status === "ADOPTED") ? 1 : 0;
}
function bleed(s) {
	return s.mutations.some((m) => m.kind === "rift_bleed" && m.status === "ADOPTED");
}
function applyDisaster(s) {
	const count = 1 + (s.difficulty === "diazero" || s.day >= 8 ? 1 : 0) + (s.day >= 14 ? 1 : 0);
	const hits = [];
	const combos = [];
	let last = KINDS[randInt(s, KINDS.length)];
	for (let n = 0; n < count; n++) {
		last = KINDS[randInt(s, KINDS.length)];
		combos.push(last.combo);
		const pool = last.coastal ? TERRITORY_LIST.filter((t) => t.coastal) : TERRITORY_LIST;
		const id = pool[randInt(s, pool.length)].id;
		strikeTerritory(s, id, last, hits);
		if (bleed(s)) {
			const neigh = TERRITORIES[id].neighbors;
			if (neigh.length) strikeTerritory(s, neigh[randInt(s, neigh.length)], last, hits);
		}
		s.singularity = Math.min(140, s.singularity + last.sing);
	}
	s.lastDisaster = {
		kind: last.kind,
		name: last.name,
		flavor: last.flavor,
		image: last.image,
		hits,
		combo: [...new Set(combos)]
	};
	const names = hits.map((h) => `${TERRITORIES[h.id].name} (−${h.killed})`).join(", ");
	s.log = [`${last.name}: ${names}.`, ...s.log].slice(0, 18);
	rememberAction(s, "world", "DISASTER", {
		cause: combos,
		after: last.kind,
		consequences: hits.map((h) => `${h.id}:-${h.killed}`)
	});
	syncMetrics(s);
}
function strikeTerritory(s, id, def, hits) {
	const t = s.territories[id];
	if (!t) return;
	const raw = def.dmg[0] + randInt(s, def.dmg[1] - def.dmg[0] + 1) + ashBonus(s);
	const soak = (s.players.find((p) => p.id === t.owner)?.faction === "umbral" ? 1 : 0) + rescueSoak(s, t.owner);
	const dmg = Math.max(0, raw - soak);
	const killed = Math.min(t.armies, dmg);
	t.armies -= killed;
	t.hazard = def.kind;
	addScar(s, id, def.kind);
	selectByCatastrophe(s, id, def.kind, killed);
	if (t.armies <= 0) {
		t.armies = 1;
		t.owner = "wasteland";
	}
	hits.push({
		id,
		killed
	});
}
function nukeTerritory(s, id) {
	const def = KINDS.find((k) => k.kind === "nuclear");
	const hits = [];
	strikeTerritory(s, id, def, hits);
	for (const n of TERRITORIES[id].neighbors.slice(0, 2)) strikeTerritory(s, n, {
		...def,
		dmg: [2, 4]
	}, hits);
	s.singularity = Math.min(140, s.singularity + 22);
	s.lastDisaster = {
		kind: "nuclear",
		name: def.name,
		flavor: def.flavor,
		image: def.image,
		hits,
		combo: ["nuclear", "zero-day"]
	};
	s.log = [`Zero Day sobre ${TERRITORIES[id].name}.`, ...s.log].slice(0, 18);
	rememberAction(s, "world", "NUKE", {
		target: id,
		consequences: hits.map((h) => `${h.id}:-${h.killed}`)
	});
	syncMetrics(s);
}
var CATALOG = {
	ash_winter: {
		label: "Invierno de ceniza",
		cause: (s) => s.scars.filter((c) => c.kind === "nuclear" || c.kind === "impacto" || c.kind === "volcan").length >= 3,
		evidence: (s) => `${s.scars.filter((c) => c.kind === "nuclear" || c.kind === "impacto" || c.kind === "volcan").length} cicatrices de impacto/nuclear/volcán`
	},
	hardened_fronts: {
		label: "Frentes endurecidos",
		cause: (s) => s.scars.length >= 5,
		evidence: (s) => `${s.scars.length} cicatrices persistentes`
	},
	wasteland_bloom: {
		label: "Floración del yermo",
		cause: (s) => Object.values(s.territories).filter((t) => t.owner === "wasteland").length >= 4,
		evidence: (s) => `${Object.values(s.territories).filter((t) => t.owner === "wasteland").length} territorios yermos`
	},
	war_economy: {
		label: "Economía de guerra",
		cause: (s) => s.trades >= 3 || s.day >= 10,
		evidence: (s) => `${s.trades} sets canjeados · día ${s.day}`
	},
	rift_bleed: {
		label: "Sangrado de grieta",
		cause: (s) => s.singularity >= 70 || s.riftOpened,
		evidence: (s) => `singularidad ${Math.round(s.singularity)}`
	}
};
function proposeMutations(s) {
	for (const kind of Object.keys(CATALOG)) {
		if (s.mutations.some((m) => m.kind === kind && (m.status === "ADOPTED" || m.status === "CANDIDATE" || m.status === "VERIFIED"))) continue;
		const spec = CATALOG[kind];
		if (!spec.cause(s)) continue;
		const mut = {
			id: `u${s.mutations.length + 1}`,
			parent: s.mutations.filter((m) => m.status === "ADOPTED").at(-1)?.id ?? null,
			kind,
			cause: spec.label,
			status: "CANDIDATE",
			evidence: spec.evidence(s),
			day: s.day
		};
		s.mutations = [...s.mutations, mut];
		rememberAction(s, "world", "MUTATION_CANDIDATE", {
			after: kind,
			consequences: [spec.evidence(s)]
		});
	}
}
function evaluateMutations(s) {
	s.mutations = s.mutations.map((m) => {
		if (m.status !== "CANDIDATE") return m;
		const spec = CATALOG[m.kind];
		const stillHolds = spec.cause(s);
		const sim = structuredClone(s);
		sim.mutations = sim.mutations.map((x) => x.id === m.id ? {
			...x,
			status: "ADOPTED"
		} : x);
		const keys = Object.keys(sim.territories).length;
		const fp = worldFingerprint(sim);
		const verified = stillHolds && keys === 42 && fp.length > 0;
		return {
			...m,
			status: verified ? "VERIFIED" : "REJECTED",
			result: verified ? `causa vigente · 42 territorios · ${spec.evidence(s)}` : "causa rota o mundo inválido"
		};
	});
}
function adoptVerified(s) {
	s.mutations = s.mutations.map((m) => {
		if (m.status !== "VERIFIED") return m;
		rememberAction(s, "world", "MUTATION_ADOPTED", {
			after: m.kind,
			consequences: [m.evidence]
		});
		s.log = [`Mutación adoptada: ${CATALOG[m.kind].label}.`, ...s.log].slice(0, 18);
		return {
			...m,
			status: "ADOPTED"
		};
	});
}
function maybeOpenRift(s) {
	if (s.riftOpened) return false;
	if (s.singularity < 100 && !(s.scars.length >= 8 && s.day >= 10 && s.lastDisaster && s.lastDisaster.combo.length >= 2)) return false;
	const parent = s.currentReality;
	const id = `rift-${s.realities.length + 1}`;
	const child = {
		id,
		parent,
		name: s.voidcrown >= 60 ? "VOIDCROWN" : "GRIETA",
		seed: s.rng,
		dayBorn: s.day,
		divergences: [
			`singularidad ${Math.round(s.singularity)}`,
			`${s.scars.length} cicatrices`,
			`${s.mutations.filter((m) => m.status === "ADOPTED").length} mutaciones`
		]
	};
	s.realities = [...s.realities, child];
	s.currentReality = id;
	s.riftOpened = true;
	s.genealogy = [...s.genealogy, {
		id,
		parent,
		cause: "quiebre",
		day: s.day
	}];
	s.log = [`Grieta abierta. Realidad ${child.name} nace de ${parent}.`, ...s.log].slice(0, 18);
	rememberAction(s, "world", "RIFT", {
		after: id,
		consequences: child.divergences
	});
	syncMetrics(s);
	return true;
}
function bloomWasteland(s) {
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
function wasteCount(s) {
	return Object.values(s.territories).filter((t) => t.owner === "wasteland").length;
}
function canVoidcrownEmerge(s) {
	if (s.voidcrownEmerged) return false;
	if (s.players.some((p) => p.id === "void")) return false;
	const waste = wasteCount(s);
	return s.voidcrown >= 80 && s.riftOpened || waste >= 5 && s.scars.length >= 4;
}
function maybeEmergVoidcrown(s) {
	if (!canVoidcrownEmerge(s)) return false;
	const actor = {
		id: VOID_ID,
		faction: VOIDCROWN.id,
		name: VOIDCROWN.name,
		color: VOIDCROWN.color,
		isHuman: false,
		cards: [],
		alive: true,
		zeroDayUsed: true
	};
	s.players = [...s.players, actor];
	s.voidcrownEmerged = true;
	s.voidcrownJustEmerged = true;
	const seized = [];
	for (const def of TERRITORY_LIST) {
		const st = s.territories[def.id];
		if (st.owner !== "wasteland") continue;
		st.owner = VOID_ID;
		st.armies = 3 + randInt(s, 3);
		seized.push(def.id);
	}
	const prey = TERRITORY_LIST.filter((t) => {
		const o = s.territories[t.id].owner;
		return o !== "void" && o !== s.humanId && o !== "wasteland";
	}).sort((a, b) => s.territories[a.id].armies - s.territories[b.id].armies);
	const need = Math.max(0, 3 - seized.length);
	for (const t of prey.slice(0, Math.max(need, seized.length ? 2 : 3))) {
		if (s.territories[t.id].owner === "void") continue;
		s.territories[t.id].owner = VOID_ID;
		s.territories[t.id].armies = 4 + randInt(s, 3);
		seized.push(t.id);
	}
	if (!seized.length && TERRITORY_LIST.length) {
		const fallback = TERRITORY_LIST.find((t) => s.territories[t.id].owner !== s.humanId) ?? TERRITORY_LIST[0];
		s.territories[fallback.id].owner = VOID_ID;
		s.territories[fallback.id].armies = 5;
		seized.push(fallback.id);
	}
	s.log = [`Voidcrown emerge y reclama ${seized.slice(0, 4).map((id) => TERRITORIES[id].name).join(", ")}.`, ...s.log].slice(0, 18);
	rememberAction(s, "world", "VOIDCROWN", {
		after: VOID_ID,
		consequences: [`nace con ${seized.length} territorios`]
	});
	syncMetrics(s);
	return true;
}
var SAVE_KEY = "rzd-save-v5";
var SAVE_KEY_V4 = "rzd-save-v4";
var SAVE_KEY_V3 = "rzd-save-v3";
var SAVE_KEY_V2 = "rzd-save-v2";
var SAVE_KEY_V1 = "rzd-save-v1";
var SETTINGS_KEY = "rzd-settings-v1";
var DEFAULT_SETTINGS = {
	muted: false,
	reducedShake: false,
	mapView: "globe"
};
/**
* CAPÍTULO I — La caja no olvida.
* Una cicatriz sobrevive al fin de partida. No es un save completo.
*/
var LEGACY_KEY = "rzd-legacy-v1";
var injected = null;
function store() {
	if (injected) return injected;
	if (typeof localStorage === "undefined") return null;
	return localStorage;
}
function sealLegacy(s) {
	const scar = s.scars[0];
	if (!scar) return null;
	const payload = {
		territory: scar.territory,
		kind: scar.kind,
		fromSeed: s.seed,
		fromDay: s.day
	};
	const api = store();
	if (api) try {
		api.setItem(LEGACY_KEY, JSON.stringify(payload));
	} catch {}
	return payload;
}
function loadLegacy() {
	const api = store();
	if (!api) return null;
	try {
		const raw = api.getItem(LEGACY_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed.territory || !parsed.kind) return null;
		return parsed;
	} catch {
		return null;
	}
}
function applyLegacy(s) {
	const legacy = loadLegacy();
	if (!legacy) return false;
	const t = s.territories[legacy.territory];
	if (!t) return false;
	addScar(s, legacy.territory, legacy.kind);
	t.hazard = legacy.kind;
	if (t.armies > 1) t.armies -= 1;
	s.log = [`La caja no olvidó ${TERRITORIES[legacy.territory]?.name ?? legacy.territory}.`, ...s.log].slice(0, 18);
	rememberAction(s, "world", "LEGACY_SCAR", {
		target: legacy.territory,
		after: legacy.kind,
		consequences: [`heredada de seed ${legacy.fromSeed} día ${legacy.fromDay}`]
	});
	return true;
}
function worldFitness(s) {
	const owners = new Set(Object.values(s.territories).map((t) => t.owner));
	return {
		territories: Object.keys(s.territories).length,
		owners: owners.size,
		scars: s.scars.length,
		wasteland: Object.values(s.territories).filter((t) => t.owner === "wasteland").length,
		singularity: Math.round(s.singularity),
		adopted: s.mutations.filter((m) => m.status === "ADOPTED").length,
		memory: s.memory.length
	};
}
function celSting(s) {
	const fit = worldFitness(s);
	if (fit.territories !== 42) return {
		observation: `Cardinalidad rota: ${fit.territories} territorios`,
		hypothesis: "Una mutación o evento destruyó el mapa",
		status: "HIPOTESIS",
		day: s.day
	};
	if (fit.wasteland >= 8 && !s.voidcrownEmerged) return {
		observation: `${fit.wasteland} yermos y Voidcrown no ha nacido`,
		hypothesis: "El umbral de emergencia no se está evaluando o es demasiado alto",
		status: "HIPOTESIS",
		day: s.day
	};
	if (fit.scars >= 3 && fit.adopted === 0 && s.mutations.every((m) => m.status !== "CANDIDATE" && m.status !== "VERIFIED")) return {
		observation: `${fit.scars} cicatrices sin candidata de mutación`,
		hypothesis: "El pipeline no dispara con las causas actuales",
		status: "HIPOTESIS",
		day: s.day
	};
	const counts = /* @__PURE__ */ new Map();
	for (const t of Object.values(s.territories)) counts.set(t.owner, (counts.get(t.owner) ?? 0) + 1);
	for (const p of s.players) {
		if (!p.alive) continue;
		if ((counts.get(p.id) ?? 0) === 0 && p.id !== "void") return {
			observation: `${p.name} sigue vivo sin territorio`,
			hypothesis: "syncAlive no cerró al jugador",
			status: "HIPOTESIS",
			day: s.day
		};
	}
	return null;
}
function jokerFitness(before, after) {
	const notes = [];
	if (after.territories !== 42) return {
		decision: "ROLLBACK",
		notes: ["rompe los 42 territorios"]
	};
	if (after.memory < before.memory) return {
		decision: "ROLLBACK",
		notes: ["perdió memoria causal"]
	};
	if (after.scars + after.adopted + after.wasteland === before.scars + before.adopted + before.wasteland) {
		notes.push("fitness idéntico en cicatrices/mutaciones/yermos");
		return {
			decision: "UNKNOWN",
			notes
		};
	}
	if (after.owners < 1) return {
		decision: "ROLLBACK",
		notes: ["sin dueños"]
	};
	notes.push("cardinalidad intacta");
	return {
		decision: "KEEP",
		notes
	};
}
function critiqueMutations(s) {
	const before = worldFitness(s);
	s.mutations = s.mutations.map((m) => {
		if (m.status !== "VERIFIED") return m;
		const sim = structuredClone(s);
		sim.mutations = sim.mutations.map((x) => x.id === m.id ? {
			...x,
			status: "ADOPTED"
		} : x);
		const verdict = jokerFitness(before, worldFitness(sim));
		if (verdict.decision === "ROLLBACK") return {
			...m,
			status: "REJECTED",
			result: `joker: ${verdict.notes.join("; ")}`
		};
		return {
			...m,
			result: `${m.result ?? ""} · joker:${verdict.decision}`.trim()
		};
	});
}
function runCel(s) {
	const sting = celSting(s);
	s.cel = sting;
	if (sting) s.log = [`CEL: ${sting.observation}`, ...s.log].slice(0, 18);
	return sting;
}
/**
* CHECKPOINT — lee /workspace/AGENTS.project.md y src/game/CANON.md antes de editar.
* RISK es la raíz. Voidcrown emerge. No borres un órgano verificado.
*/
var START_ARMIES = [
	40,
	35,
	30,
	25,
	20
];
function clone(s) {
	return structuredClone(s);
}
function pushLog(s, line) {
	s.log = [line, ...s.log].slice(0, 18);
}
function ownedIds(s, pid) {
	return TERRITORY_LIST.filter((t) => s.territories[t.id].owner === pid).map((t) => t.id);
}
function continentOwner(s, continentId) {
	const c = CONTINENTS.find((x) => x.id === continentId);
	if (!c) return null;
	const first = s.territories[c.members[0]]?.owner;
	if (!first || first === "wasteland") return null;
	return c.members.every((id) => s.territories[id].owner === first) ? first : null;
}
function reinforcementsFor(s, pid) {
	const n = ownedIds(s, pid).length;
	let r = Math.max(3, Math.floor(n / 3));
	for (const c of CONTINENTS) if (continentOwner(s, c.id) === pid) {
		r += c.bonus;
		if (s.mutations.some((m) => m.kind === "war_economy" && m.status === "ADOPTED")) r += 1;
	}
	r = Math.max(3, r - scarPenaltyFor(s, pid));
	r += doctrineReinforce(s, pid);
	r += doctrineArmyBonus(s, pid);
	if (pid === "void") r += 2;
	return r;
}
function playerById(s, pid) {
	return s.players.find((p) => p.id === pid);
}
function currentPlayer(s) {
	return s.players[s.current];
}
function alivePlayers(s) {
	return s.players.filter((p) => p.alive);
}
function shuffle(s, arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = randInt(s, i + 1);
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function canTrade(cards) {
	const n = {
		inf: 0,
		cav: 0,
		art: 0
	};
	for (const c of cards) n[c] += 1;
	if (n.inf >= 3 || n.cav >= 3 || n.art >= 3) return true;
	return n.inf >= 1 && n.cav >= 1 && n.art >= 1;
}
function removeSet(cards) {
	const n = {
		inf: 0,
		cav: 0,
		art: 0
	};
	for (const c of cards) n[c] += 1;
	let remove = [];
	if (n.inf >= 1 && n.cav >= 1 && n.art >= 1) remove = [
		"inf",
		"cav",
		"art"
	];
	else if (n.art >= 3) remove = [
		"art",
		"art",
		"art"
	];
	else if (n.cav >= 3) remove = [
		"cav",
		"cav",
		"cav"
	];
	else if (n.inf >= 3) remove = [
		"inf",
		"inf",
		"inf"
	];
	const next = [...cards];
	for (const r of remove) {
		const i = next.indexOf(r);
		if (i >= 0) next.splice(i, 1);
	}
	return next;
}
function setBonusValue(index) {
	return SET_BONUS[Math.min(index, SET_BONUS.length - 1)];
}
function emptyEdai() {
	return {
		obs: "Mapa estable. Fronteras aún humanas.",
		dec: "Observar y acumular.",
		reason: "Sin evidencia de ventaja clara.",
		attacksWon: 0,
		attacksLost: 0,
		lastTarget: null
	};
}
function newGame(opts) {
	const seed = ((opts.seed ?? Math.floor(Math.random() * 4294967295)) || 1) >>> 0;
	const scenario = opts.scenario ?? "standard";
	const humanFaction = FACTIONS.find((f) => f.id === opts.faction) ?? FACTIONS[0];
	const others = FACTIONS.filter((f) => f.id !== humanFaction.id).slice(0, opts.opponents);
	const players = [{
		id: "p0",
		faction: humanFaction.id,
		name: humanFaction.name,
		color: humanFaction.color,
		isHuman: !opts.observer,
		cards: [],
		alive: true,
		zeroDayUsed: false
	}, ...others.map((f, i) => ({
		id: `p${i + 1}`,
		faction: f.id,
		name: f.name,
		color: f.color,
		isHuman: false,
		cards: [],
		alive: true,
		zeroDayUsed: false
	}))];
	const s = {
		version: 5,
		seed,
		rng: seed,
		day: 1,
		difficulty: opts.difficulty,
		scenario,
		humanId: "p0",
		players,
		current: 0,
		phase: "reinforce",
		territories: {},
		selected: null,
		attackFrom: null,
		attackTo: null,
		fortifyFrom: null,
		armiesToPlace: 0,
		capturedThisTurn: false,
		pendingTransferMin: 0,
		pendingTransferMax: 0,
		setBonusIndex: 0,
		log: [],
		lastCombat: null,
		lastDisaster: null,
		winner: null,
		loseReason: null,
		trades: 0,
		memory: [],
		scars: [],
		mutations: [],
		realities: [{
			id: "prime",
			parent: null,
			name: "PRIME",
			seed,
			dayBorn: 1,
			divergences: []
		}],
		currentReality: "prime",
		genealogy: [{
			id: "prime",
			parent: null,
			cause: "génesis",
			day: 1
		}],
		singularity: scenario === "rift" ? 88 : 0,
		escalation: 0,
		voidcrown: 0,
		voidcrownEmerged: false,
		voidcrownJustEmerged: false,
		riftOpened: false,
		edai: emptyEdai(),
		replay: [],
		strikeArmed: scenario === "rift",
		eventResume: "begin",
		captures: 0,
		chronicle: [],
		cel: null,
		living: emptyLiving()
	};
	shuffle(s, TERRITORY_LIST.map((t) => t.id)).forEach((id, i) => {
		const owner = players[i % players.length].id;
		s.territories[id] = {
			owner,
			armies: 1,
			hazard: null
		};
	});
	const pool = START_ARMIES[Math.max(0, players.length - 2)] ?? 20;
	for (const p of players) {
		let extra = pool - ownedIds(s, p.id).length;
		const mine = ownedIds(s, p.id);
		let guard = 0;
		while (extra > 0 && mine.length && guard < 800) {
			const id = mine[randInt(s, mine.length)];
			s.territories[id].armies += 1;
			extra -= 1;
			guard += 1;
		}
	}
	bootLiving(s, !!opts.inherit);
	if (scenario === "rift") {
		s.day = 8;
		applyDisaster(s);
		proposeMutations(s);
		evaluateMutations(s);
		critiqueMutations(s);
		adoptVerified(s);
		maybeOpenRift(s);
		runCel(s);
	}
	s.armiesToPlace = reinforcementsFor(s, currentPlayer(s).id);
	if (opts.inherit && !opts.observer) applyLegacy(s);
	if (opts.observer) s.phase = "ai";
	pushLog(s, `Día ${s.day}. ${currentPlayer(s).name} despliega ${s.armiesToPlace} refuerzos.`);
	rememberAction(s, "world", "GENESIS", {
		after: `seed ${seed}`,
		consequences: [`scenario ${scenario}`]
	});
	recordReplay(s, "newGame", [
		opts.faction,
		opts.opponents,
		opts.difficulty,
		seed,
		scenario
	]);
	syncMetrics(s);
	return s;
}
function syncAlive(s) {
	for (const p of s.players) if (ownedIds(s, p.id).length === 0 && p.alive) {
		p.alive = false;
		pushLog(s, `${p.name} queda fuera del mapa.`);
	}
	const living = alivePlayers(s);
	const human = playerById(s, s.humanId);
	if (human && !human.alive && !optsObserver(s)) {
		s.phase = "over";
		s.winner = living[0]?.id ?? null;
		s.loseReason = "Tu facción fue borrada.";
		return;
	}
	if (living.length <= 1) {
		s.phase = "over";
		s.winner = living[0]?.id ?? null;
		if (s.winner === "void") s.loseReason = "El vacío se tragó el mapa.";
		else if (s.winner === s.humanId) s.loseReason = null;
		else s.loseReason = "El mundo cayó en otras manos.";
	}
}
function optsObserver(s) {
	return s.players.every((p) => !p.isHuman);
}
function tradeCards(s0) {
	const s = clone(s0);
	const p = currentPlayer(s);
	if (s.phase !== "reinforce" && s.phase !== "ai") return null;
	if (!canTrade(p.cards)) return null;
	p.cards = removeSet(p.cards);
	const bonus = setBonusValue(s.setBonusIndex);
	s.setBonusIndex += 1;
	s.trades += 1;
	s.armiesToPlace += bonus;
	pushLog(s, `${p.name} canjea un set: +${bonus} ejércitos.`);
	rememberAction(s, p.id, "TRADE", {
		after: `+${bonus}`,
		consequences: [`trades ${s.trades}`]
	});
	recordReplay(s, "trade");
	return s;
}
function placeArmy(s0, id, n = 1) {
	const s = clone(s0);
	if (s.phase !== "reinforce" && s.phase !== "ai") return null;
	if (s.armiesToPlace <= 0) return null;
	const t = s.territories[id];
	if (!t || t.owner !== currentPlayer(s).id) return null;
	const k = Math.min(n, s.armiesToPlace);
	t.armies += k;
	s.armiesToPlace -= k;
	s.selected = id;
	touchWarning(s);
	recordReplay(s, "place", [id, k]);
	return s;
}
function finishReinforce(s0) {
	const s = clone(s0);
	if (s.phase !== "reinforce" && s.phase !== "ai") return null;
	if (s.armiesToPlace > 0) return null;
	const p = currentPlayer(s);
	if (p.cards.length >= 5 && canTrade(p.cards)) return null;
	s.phase = s.phase === "ai" ? "ai" : "attack";
	s.selected = null;
	s.strikeArmed = p.isHuman && !p.zeroDayUsed && (s.day >= 5 || s.scenario === "rift") && ownedIds(s, p.id).length >= 8;
	recordReplay(s, "finishReinforce");
	return s;
}
function beginAttack(s0, from, to) {
	const s = clone(s0);
	if (s.phase !== "attack" && s.phase !== "ai") return null;
	const a = s.territories[from];
	const d = s.territories[to];
	const pid = currentPlayer(s).id;
	if (!a || !d) return null;
	if (a.owner !== pid || d.owner === pid) return null;
	if (a.armies < 2) return null;
	if (!areNeighbors(from, to)) return null;
	s.attackFrom = from;
	s.attackTo = to;
	s.selected = from;
	return s;
}
function cancelAttack(s0) {
	const s = clone(s0);
	s.attackFrom = null;
	s.attackTo = null;
	return s;
}
function rollCombat(s0) {
	const s = clone(s0);
	if (!s.attackFrom || !s.attackTo) return null;
	if (s.phase !== "attack" && s.phase !== "ai") return null;
	const from = s.territories[s.attackFrom];
	const to = s.territories[s.attackTo];
	if (from.armies < 2 || to.armies < 1) return null;
	const defArmies = to.armies + defenseBonusAt(s, s.attackTo);
	const dice = resolveDice(from.armies, defArmies, s.rng);
	s.rng = dice.rng;
	from.armies -= dice.attackLoss;
	to.armies -= dice.defendLoss;
	s.lastCombat = {
		from: s.attackFrom,
		to: s.attackTo,
		attackDice: dice.attackDice,
		defendDice: dice.defendDice,
		attackLoss: dice.attackLoss,
		defendLoss: dice.defendLoss
	};
	const actor = currentPlayer(s);
	if (to.armies <= 0) {
		const victim = to.owner;
		to.armies = actor.faction === "nexo" ? 1 : 0;
		to.owner = actor.id;
		to.hazard = null;
		s.capturedThisTurn = true;
		s.captures += 1;
		const minMove = attackDiceCount(from.armies + 0) || 1;
		const maxMove = from.armies - 1;
		s.pendingTransferMin = Math.min(minMove, maxMove);
		s.pendingTransferMax = maxMove;
		if (s.phase !== "ai") s.phase = "transfer";
		pushLog(s, `${actor.name} toma ${TERRITORIES[s.attackTo].name}.`);
		rememberAction(s, actor.id, "CAPTURE", {
			target: s.attackTo,
			cause: [`from ${s.attackFrom}`],
			before: String(victim),
			after: actor.id,
			consequences: [`${TERRITORIES[s.attackTo].name} cambia de dueño`]
		});
		if (!actor.isHuman) s.edai.attacksWon += 1;
		if (victim !== "wasteland") {
			if (ownedIds(s, victim).length === 0) {
				const v = playerById(s, victim);
				if (v) {
					actor.cards.push(...v.cards);
					v.cards = [];
					pushLog(s, `${actor.name} absorbe las cartas de ${v.name}.`);
				}
			}
		}
		syncAlive(s);
		if (s.winner || !optsObserver(s) && !s.players.find((p) => p.id === s.humanId)?.alive) return s;
		if (s.phase === "ai" && s.pendingTransferMax > 0) return transferArmies(s, s.pendingTransferMax) ?? s;
	} else if (!actor.isHuman && dice.attackLoss > 0 && dice.defendLoss === 0) s.edai.attacksLost += 1;
	recordReplay(s, "rollCombat");
	return s;
}
function transferArmies(s0, n) {
	const s = clone(s0);
	if (!s.attackFrom || !s.attackTo) return null;
	const from = s.territories[s.attackFrom];
	const to = s.territories[s.attackTo];
	const count = Math.max(s.pendingTransferMin, Math.min(s.pendingTransferMax, n));
	if (from.armies - count < 1) return null;
	from.armies -= count;
	to.armies += count;
	s.attackFrom = null;
	s.attackTo = null;
	s.pendingTransferMin = 0;
	s.pendingTransferMax = 0;
	if (s.phase === "transfer") s.phase = "attack";
	recordReplay(s, "transfer", [count]);
	return s;
}
function finishAttack(s0) {
	const s = clone(s0);
	s.attackFrom = null;
	s.attackTo = null;
	s.phase = s.phase === "ai" ? "ai" : "fortify";
	s.selected = null;
	s.fortifyFrom = null;
	s.strikeArmed = false;
	recordReplay(s, "finishAttack");
	return s;
}
function ownedPath(s, from, to, pid) {
	if (from === to) return true;
	const seen = /* @__PURE__ */ new Set([from]);
	const q = [from];
	while (q.length) {
		const cur = q.shift();
		for (const n of TERRITORIES[cur].neighbors) {
			if (seen.has(n)) continue;
			if (s.territories[n].owner !== pid) continue;
			if (n === to) return true;
			seen.add(n);
			q.push(n);
		}
	}
	return false;
}
function fortify(s0, from, to, n) {
	const s = clone(s0);
	if (s.phase !== "fortify" && s.phase !== "ai") return null;
	const pid = currentPlayer(s).id;
	const a = s.territories[from];
	const b = s.territories[to];
	if (!a || !b || a.owner !== pid || b.owner !== pid) return null;
	if (n < 1 || a.armies - n < 1) return null;
	if (!ownedPath(s, from, to, pid)) return null;
	a.armies -= n;
	b.armies += n;
	pushLog(s, `${currentPlayer(s).name} mueve ${n} a ${TERRITORIES[to].name}.`);
	recordReplay(s, "fortify", [
		from,
		to,
		n
	]);
	return endTurn(s);
}
function skipFortify(s0) {
	recordReplay(s0, "skipFortify");
	return endTurn(clone(s0));
}
function drawCard(s) {
	if (!s.capturedThisTurn) return;
	const card = [
		"inf",
		"cav",
		"art"
	][randInt(s, 3)];
	currentPlayer(s).cards.push(card);
	pushLog(s, `${currentPlayer(s).name} obtiene una carta.`);
}
function nextAliveIndex(s, from) {
	for (let i = 1; i <= s.players.length; i++) {
		const idx = (from + i) % s.players.length;
		if (s.players[idx].alive) return idx;
	}
	return from;
}
function endTurn(s0) {
	const s = clone(s0);
	drawCard(s);
	s.capturedThisTurn = false;
	s.selected = null;
	s.attackFrom = null;
	s.attackTo = null;
	s.fortifyFrom = null;
	s.lastCombat = null;
	s.strikeArmed = false;
	if (s.winner) {
		s.phase = "over";
		return s;
	}
	const prev = s.current;
	const next = nextAliveIndex(s, prev);
	const lastAliveId = alivePlayers(s).at(-1)?.id;
	const wrapped = s.players[prev].id === lastAliveId;
	s.current = next;
	if (wrapped) {
		s.day += 1;
		bloomWasteland(s);
		applyDisaster(s);
		directorTick(s);
		proposeMutations(s);
		evaluateMutations(s);
		critiqueMutations(s);
		adoptVerified(s);
		const rift = maybeOpenRift(s);
		maybeEmergVoidcrown(s);
		runCel(s);
		syncAlive(s);
		syncMetrics(s);
		s.eventResume = "begin";
		if (!s.winner) s.phase = "event";
		if (rift) pushLog(s, "La historia se parte. Una realidad hija queda activa.");
		if (s.voidcrownJustEmerged) pushLog(s, "Voidcrown ha nacido de las grietas.");
	}
	if (s.winner) {
		s.phase = "over";
		return s;
	}
	if (s.phase !== "event") beginTurn(s);
	return s;
}
function beginTurn(s) {
	const p = currentPlayer(s);
	s.armiesToPlace = reinforcementsFor(s, p.id);
	s.phase = p.isHuman ? "reinforce" : "ai";
	s.selected = null;
	pushLog(s, `Día ${s.day}. ${p.name} recibe ${s.armiesToPlace} refuerzos.`);
}
function dismissEvent(s0) {
	const s = clone(s0);
	if (s.phase !== "event") return s;
	if (s.eventResume === "fortify") {
		s.phase = "fortify";
		s.selected = null;
		s.attackFrom = null;
		s.attackTo = null;
		s.strikeArmed = false;
		s.eventResume = "begin";
		return s;
	}
	beginTurn(s);
	return s;
}
function zeroDayStrike(s0, id) {
	const s = clone(s0);
	const p = currentPlayer(s);
	if (!p.isHuman || p.zeroDayUsed) return null;
	if (s.phase !== "attack") return null;
	const t = s.territories[id];
	if (!t || t.owner === p.id) return null;
	if (!s.strikeArmed) return null;
	p.zeroDayUsed = true;
	s.strikeArmed = false;
	nukeTerritory(s, id);
	directorTick(s);
	s.phase = "event";
	s.eventResume = "fortify";
	rememberAction(s, p.id, "ZERO_DAY", {
		target: id,
		consequences: ["nuclear scar"]
	});
	recordReplay(s, "zeroDay", [id]);
	syncAlive(s);
	return s;
}
function clickTerritory(s0, id) {
	const s = clone(s0);
	const t = s.territories[id];
	if (!t) return null;
	const me = currentPlayer(s);
	if (!me.isHuman) return null;
	if (s.phase === "reinforce") return placeArmy(s0, id, 1);
	if (s.phase === "attack") {
		if (s.attackFrom && s.attackTo) return s;
		if (t.owner === me.id) {
			if (t.armies < 2) {
				s.selected = id;
				s.attackFrom = null;
				return s;
			}
			s.selected = id;
			s.attackFrom = id;
			s.attackTo = null;
			touchWarning(s);
			return s;
		}
		if (s.attackFrom && areNeighbors(s.attackFrom, id) && t.owner !== me.id) return beginAttack(s0, s.attackFrom, id);
		s.selected = id;
		touchWarning(s);
		return s;
	}
	if (s.phase === "fortify") {
		if (t.owner !== me.id) return s;
		if (!s.fortifyFrom) {
			s.fortifyFrom = id;
			s.selected = id;
			touchWarning(s);
			return s;
		}
		if (s.fortifyFrom === id) {
			s.fortifyFrom = null;
			s.selected = null;
			return s;
		}
		s.selected = id;
		touchWarning(s);
		return s;
	}
	return s;
}
function legalAttackTargets(s, from) {
	const t = s.territories[from];
	if (!t || t.owner !== currentPlayer(s).id || t.armies < 2) return [];
	return TERRITORIES[from].neighbors.filter((n) => s.territories[n].owner !== t.owner);
}
function canZeroDay(s) {
	const p = currentPlayer(s);
	return !!(p.isHuman && s.phase === "attack" && s.strikeArmed && !p.zeroDayUsed && s.selected && s.territories[s.selected].owner !== p.id);
}
function probeTerritory(s0, kind, id) {
	return runProbe(s0, kind, id);
}
function threshold(d, voidActor) {
	if (voidActor) return 0;
	if (d === "recruta") return 3;
	if (d === "diazero") return 1;
	return 2;
}
function borderScore(s, id) {
	const t = s.territories[id];
	const pid = currentPlayer(s).id;
	if (t.owner !== pid) return -1;
	let enemies = 0;
	let weakest = 99;
	for (const n of TERRITORIES[id].neighbors) {
		const o = s.territories[n];
		if (o.owner !== pid) {
			enemies += 1;
			weakest = Math.min(weakest, o.armies);
		}
	}
	if (enemies === 0) return 0;
	return enemies * 4 + t.armies - weakest;
}
function almostContinent(s, pid) {
	for (const c of CONTINENTS) {
		if (continentOwner(s, c.id) === pid) continue;
		const missing = c.members.filter((id) => s.territories[id].owner !== pid);
		if (missing.length === 1) return missing[0];
	}
	return null;
}
function bestPlace(s) {
	const mine = ownedIds(s, currentPlayer(s).id);
	if (!mine.length) return null;
	let best = mine[0];
	let score = -999;
	for (const id of mine) {
		const sc = borderScore(s, id);
		if (sc > score) {
			score = sc;
			best = id;
		}
	}
	return best;
}
function think(s, obs, dec, reason, target = null) {
	s.edai = {
		...s.edai,
		obs,
		dec,
		reason,
		lastTarget: target
	};
}
function stepAi(s0) {
	let s = s0;
	const p = currentPlayer(s);
	if (!p.alive || p.isHuman || s.phase === "over") return {
		kind: "done",
		state: s
	};
	if (s.phase !== "ai" && s.phase !== "transfer") return {
		kind: "done",
		state: s
	};
	if (canTrade(p.cards) && p.cards.length >= 3) {
		const traded = tradeCards(s);
		if (traded) {
			think(traded, `${p.name} tiene ${p.cards.length} cartas.`, "Canjear set.", "El bono de set supera un refuerzo suelto.");
			return {
				kind: "state",
				state: traded,
				delay: 280
			};
		}
	}
	if (s.armiesToPlace > 0) {
		const id = bestPlace(s);
		if (id) {
			const placed = placeArmy(s, id, s.armiesToPlace);
			if (placed) s = placed;
		}
		const fin = finishReinforce(s);
		if (fin) s = fin;
		think(s, `${ownedIds(s, p.id).length} territorios propios.`, id ? `Apilar en ${id}.` : "Sin frente claro.", "Los ejércitos van al borde más débil del enemigo.", id);
		return {
			kind: "state",
			state: s,
			delay: 420
		};
	}
	const targetNeed = almostContinent(s, p.id);
	const mine = ownedIds(s, p.id);
	const th = threshold(s.difficulty, p.id === VOID_ID);
	const opts = [];
	for (const from of mine) {
		const a = s.territories[from];
		if (a.armies < 2) continue;
		for (const to of TERRITORIES[from].neighbors) {
			const d = s.territories[to];
			if (d.owner === p.id) continue;
			const ratio = a.armies - d.armies;
			const bonus = targetNeed === to ? 4 : 0;
			const waste = d.owner === "wasteland" ? 2 : 0;
			const hunt = p.id === "void" && d.owner === s.humanId ? 3 : 0;
			if (ratio + bonus + waste + hunt >= th) opts.push({
				from,
				to,
				ratio: ratio + bonus + waste + hunt
			});
		}
	}
	opts.sort((a, b) => b.ratio - a.ratio);
	if (opts.length) {
		const pick = opts[0];
		const started = beginAttack(s, pick.from, pick.to);
		if (!started) return fortifyOrEnd(s);
		const rolled = rollCombat(started);
		if (!rolled) return fortifyOrEnd(started);
		think(rolled, `Frente ${pick.from} → ${pick.to}. Diferencia ${pick.ratio}.`, `Atacar ${pick.to}.`, targetNeed === pick.to ? "Cierra un continente. El bono cambia la economía." : "La ratio de ejércitos supera el umbral de riesgo.", pick.to);
		return {
			kind: "state",
			state: rolled,
			delay: 520
		};
	}
	return fortifyOrEnd(s);
}
function fortifyOrEnd(s) {
	const p = currentPlayer(s);
	const mine = ownedIds(s, p.id);
	let interior = null;
	let interiorArmies = 0;
	let front = null;
	let frontScore = -1;
	for (const id of mine) {
		const enemies = TERRITORIES[id].neighbors.some((n) => s.territories[n].owner !== p.id);
		if (!enemies && s.territories[id].armies > interiorArmies) {
			interior = id;
			interiorArmies = s.territories[id].armies;
		}
		if (enemies) {
			const sc = borderScore(s, id);
			if (sc > frontScore) {
				frontScore = sc;
				front = id;
			}
		}
	}
	if (interior && front && interior !== front && interiorArmies > 2) {
		const moved = fortify(s, interior, front, interiorArmies - 1);
		if (moved) {
			think(moved, "Hay reservas en el interior.", `Mover a ${front}.`, "El frente necesita masa antes del próximo día.");
			return {
				kind: "done",
				state: moved
			};
		}
	}
	think(s, "Sin ataque rentable.", "Fortificar y pasar.", `Umbral ${threshold(s.difficulty, p.id === VOID_ID)}. Esperar refuerzos.`);
	return {
		kind: "done",
		state: skipFortify(s)
	};
}
var ctx = null;
var master = null;
var muted = false;
var cineOsc = null;
var cineLfo = null;
var cineGain = null;
var cineFilter = null;
function unlockAudio() {
	if (typeof window === "undefined") return;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = muted ? 0 : .35;
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
}
function setMuted(next) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .35, ctx.currentTime, .04);
	if (next) silenceSpeech();
}
function beep(freq, dur, type = "square", vol = .08, slide = 0) {
	if (!ctx || !master || muted) return;
	const t = ctx.currentTime;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, t);
	if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
	g.gain.setValueAtTime(vol, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	o.connect(g);
	g.connect(master);
	o.start(t);
	o.stop(t + dur + .02);
}
function sfxClick() {
	beep(420, .04, "square", .05);
}
function sfxPlace() {
	beep(180, .07, "triangle", .07);
}
function sfxDice() {
	beep(240, .05, "square", .06);
	beep(310, .05, "square", .05);
}
function sfxHit() {
	beep(90, .09, "sawtooth", .1, -40);
}
function sfxCapture() {
	beep(220, .12, "triangle", .08);
	beep(330, .16, "triangle", .06);
}
function sfxBoom() {
	beep(55, .35, "sawtooth", .14, -20);
}
function sfxWin() {
	beep(440, .18, "triangle", .08);
	beep(660, .22, "triangle", .07);
}
function sfxLose() {
	beep(110, .4, "sawtooth", .1, -50);
}
function getCtx() {
	unlockAudio();
	return ctx && master ? {
		ctx,
		master
	} : null;
}
function stopCineBed() {
	const g = getCtx();
	if (cineGain && g) cineGain.gain.setTargetAtTime(1e-4, g.ctx.currentTime, .04);
	const kill = (n) => {
		try {
			n?.stop();
		} catch {}
	};
	kill(cineOsc);
	kill(cineLfo);
	cineOsc = null;
	cineLfo = null;
	cineGain = null;
	cineFilter = null;
}
function setCineMood(mood) {
	const g = getCtx();
	if (!g || muted) return;
	const { ctx: ac, master: m } = g;
	if (!cineOsc || !cineFilter || !cineGain || !cineLfo) {
		stopCineBed();
		cineGain = ac.createGain();
		cineGain.gain.value = 1e-4;
		cineFilter = ac.createBiquadFilter();
		cineFilter.type = "lowpass";
		cineOsc = ac.createOscillator();
		cineOsc.type = "sawtooth";
		cineLfo = ac.createOscillator();
		cineLfo.type = "sine";
		const lfoG = ac.createGain();
		lfoG.gain.value = 12;
		cineLfo.connect(lfoG);
		lfoG.connect(cineOsc.frequency);
		cineOsc.connect(cineFilter);
		cineFilter.connect(cineGain);
		cineGain.connect(m);
		cineOsc.start();
		cineLfo.start();
	}
	const table = {
		low: {
			f: 55,
			q: 4,
			vol: .045,
			lfo: .12
		},
		mid: {
			f: 72,
			q: 6,
			vol: .055,
			lfo: .2
		},
		high: {
			f: 48,
			q: 8,
			vol: .08,
			lfo: .35
		},
		rift: {
			f: 41,
			q: 12,
			vol: .07,
			lfo: 1.8
		},
		void: {
			f: 36,
			q: 3,
			vol: .06,
			lfo: .08
		}
	}[mood];
	const t = ac.currentTime;
	cineOsc.frequency.setTargetAtTime(table.f, t, .08);
	cineFilter.frequency.setTargetAtTime(mood === "rift" ? 900 : 420, t, .1);
	cineFilter.Q.setTargetAtTime(table.q, t, .1);
	cineGain.gain.setTargetAtTime(table.vol, t, .12);
	cineLfo.frequency.setTargetAtTime(table.lfo, t, .1);
}
function cineHit() {
	beep(70, .5, "sawtooth", .16, -30);
	beep(140, .28, "triangle", .07);
}
function speakLine(text) {
	if (muted) return;
	const syn = typeof window !== "undefined" ? window.speechSynthesis : null;
	if (!syn) return;
	syn.cancel();
	const u = new SpeechSynthesisUtterance(text);
	u.lang = "es-MX";
	u.rate = .92;
	u.pitch = .7;
	u.volume = .85;
	syn.speak(u);
}
function silenceSpeech() {
	if (typeof window === "undefined") return;
	window.speechSynthesis?.cancel();
}
function canStore$1() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function migrate(raw) {
	if (!raw || typeof raw !== "object") return null;
	const parsed = raw;
	if (!parsed.territories || !parsed.players) return null;
	const hasVoid = parsed.players.some((p) => p.id === VOID_ID);
	const state = {
		version: 5,
		seed: parsed.seed ?? 1,
		rng: parsed.rng ?? parsed.seed ?? 1,
		day: parsed.day ?? 1,
		difficulty: parsed.difficulty ?? "veterano",
		scenario: parsed.scenario ?? "standard",
		humanId: parsed.humanId ?? "p0",
		players: parsed.players,
		current: parsed.current ?? 0,
		phase: parsed.phase ?? "reinforce",
		territories: parsed.territories,
		selected: parsed.selected ?? null,
		attackFrom: parsed.attackFrom ?? null,
		attackTo: parsed.attackTo ?? null,
		fortifyFrom: parsed.fortifyFrom ?? null,
		armiesToPlace: parsed.armiesToPlace ?? 0,
		capturedThisTurn: parsed.capturedThisTurn ?? false,
		pendingTransferMin: parsed.pendingTransferMin ?? 0,
		pendingTransferMax: parsed.pendingTransferMax ?? 0,
		setBonusIndex: parsed.setBonusIndex ?? 0,
		log: parsed.log ?? [],
		lastCombat: parsed.lastCombat ?? null,
		lastDisaster: parsed.lastDisaster ?? null,
		winner: parsed.winner ?? null,
		loseReason: parsed.loseReason ?? null,
		trades: parsed.trades ?? 0,
		captures: parsed.captures ?? 0,
		memory: parsed.memory ?? [],
		scars: parsed.scars ?? [],
		mutations: parsed.mutations ?? [],
		realities: parsed.realities ?? [],
		currentReality: parsed.currentReality ?? "prime",
		genealogy: parsed.genealogy ?? [],
		singularity: parsed.singularity ?? 0,
		escalation: parsed.escalation ?? 0,
		voidcrown: parsed.voidcrown ?? 0,
		voidcrownEmerged: !!(parsed.voidcrownEmerged && hasVoid),
		voidcrownJustEmerged: parsed.voidcrownJustEmerged ?? false,
		riftOpened: parsed.riftOpened ?? false,
		edai: parsed.edai ?? {
			obs: "Mapa cargado.",
			dec: "Observar.",
			reason: "Partida restaurada.",
			attacksWon: 0,
			attacksLost: 0,
			lastTarget: null
		},
		replay: parsed.replay ?? [],
		strikeArmed: parsed.strikeArmed ?? false,
		eventResume: parsed.eventResume ?? "begin",
		chronicle: Array.isArray(parsed.chronicle) ? parsed.chronicle : [],
		cel: parsed.cel ?? null,
		living: parsed.living ?? {
			biota: {},
			doctrine: "NORMAL",
			patches: [],
			generation: 1,
			tombs: [],
			probes: 0,
			lastProbe: null,
			warning: null,
			retentionNote: "",
			gamesRemembered: 0,
			retentionWins: 0,
			retentionLosses: 0
		}
	};
	ensureLiving(state);
	return state;
}
function saveGame(state) {
	if (!canStore$1()) return;
	try {
		const payload = JSON.stringify({
			...state,
			version: 5
		});
		localStorage.setItem(SAVE_KEY, payload);
		localStorage.setItem(`${SAVE_KEY}.bak`, payload);
	} catch {}
}
function loadGame() {
	if (!canStore$1()) return null;
	try {
		const raw = localStorage.getItem("rzd-save-v5") ?? localStorage.getItem(`rzd-save-v5.bak`) ?? localStorage.getItem("rzd-save-v4") ?? localStorage.getItem("rzd-save-v3") ?? localStorage.getItem("rzd-save-v2") ?? localStorage.getItem("rzd-save-v1");
		if (!raw) return null;
		return migrate(JSON.parse(raw));
	} catch {
		return null;
	}
}
function clearSave() {
	if (!canStore$1()) return;
	try {
		localStorage.removeItem(SAVE_KEY);
		localStorage.removeItem(`${SAVE_KEY}.bak`);
		localStorage.removeItem(SAVE_KEY_V4);
		localStorage.removeItem(SAVE_KEY_V3);
		localStorage.removeItem(SAVE_KEY_V2);
		localStorage.removeItem(SAVE_KEY_V1);
	} catch {}
}
function loadSettings() {
	if (!canStore$1()) return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		return {
			...DEFAULT_SETTINGS,
			...JSON.parse(raw)
		};
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}
function saveSettings(s) {
	if (!canStore$1()) return;
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
	} catch {}
}
var CINE_KEY = "rzd-cine-v1";
/** Timeline in milliseconds. Questions, not answers. */
var SCENES = [
	{
		id: "1945",
		at: 0,
		dur: 7e3,
		image: "/game/cine/1945.jpg",
		year: "1945",
		kicker: "Prólogo",
		line: "Dijeron que la guerra había terminado.",
		sub: "Las banderas volvieron a levantarse. El mapa se redibujó. Se equivocaron.",
		mood: "low"
	},
	{
		id: "cold",
		at: 7e3,
		dur: 6500,
		image: "/game/cine/coldwar.jpg",
		year: "1947–1991",
		kicker: "Guerra Fría",
		line: "La guerra no terminó. Cambió de forma.",
		sub: "Vigilancia. Alianzas. Armas para acabar el planeta varias veces.",
		mood: "mid"
	},
	{
		id: "escalation",
		at: 13500,
		dur: 5500,
		image: "/game/strikes.jpg",
		year: "Ahora",
		kicker: "Escalada",
		line: "Una alianza rota. Un territorio. Una respuesta.",
		sub: "Seis potencias movilizaron. Ya no había vuelta atrás.",
		mood: "mid"
	},
	{
		id: "diazero",
		at: 19e3,
		dur: 7e3,
		image: "/game/cine/diazero.jpg",
		year: "03:17",
		kicker: "Día Cero",
		line: "El primer misil cayó a las 03:17.",
		sub: "¿Qué ocurrió realmente durante el Día Cero?",
		mood: "high"
	},
	{
		id: "ww3",
		at: 26e3,
		dur: 5500,
		image: "/game/nuke.jpg",
		year: "Día 1–47",
		kicker: "Tercera Guerra",
		line: "El planeta ardió. Esta vez había algo distinto.",
		sub: "Tecnologías que no debieron usarse. Sistemas que decidieron solos.",
		mood: "high"
	},
	{
		id: "clocks",
		at: 31500,
		dur: 6500,
		image: "/game/cine/clocks.jpg",
		year: "21:44 · 9s",
		kicker: "Primera anomalía",
		line: "Todos los relojes marcaron una hora distinta.",
		sub: "Nueve segundos. Después volvieron. Nadie entendió.",
		mood: "rift",
		glitch: true
	},
	{
		id: "rift",
		at: 38e3,
		dur: 7e3,
		image: "/game/cine/rift.jpg",
		year: "La grieta",
		kicker: "Divergencia",
		line: "Una ciudad destruida. Y, al mismo tiempo, no.",
		sub: "¿Por qué existen otras realidades?",
		mood: "rift",
		glitch: true
	},
	{
		id: "scars",
		at: 45e3,
		dur: 5500,
		image: "/game/city.jpg",
		year: "Expedición",
		kicker: "Cicatrices",
		line: "Encontraron grietas más antiguas que el Día Cero.",
		sub: "El Día Cero no las creó. Solo abrió una que ya estaba.",
		mood: "rift"
	},
	{
		id: "void",
		at: 50500,
		dur: 7500,
		image: "/game/cine/voidcrown.jpg",
		year: "UNKNOWN",
		kicker: "Voidcrown",
		line: "No fuimos nosotros quienes creamos las grietas.",
		sub: "¿Quién las abrió? ¿Qué es Voidcrown?",
		mood: "void",
		glitch: true
	},
	{
		id: "0316",
		at: 58e3,
		dur: 7e3,
		image: "/game/earth-night.jpg",
		year: "03:16",
		kicker: "Realidad 000",
		line: "Una Tierra igual a la nuestra. El Día Cero aún no ocurre.",
		sub: "El reloj marca un minuto antes. La decisión no está registrada.",
		mood: "void"
	}
];
var CINE_END_MS = 65e3;
function sceneAt(t) {
	const clamped = Math.max(0, t);
	let cur = SCENES[0];
	for (const s of SCENES) if (clamped >= s.at) cur = s;
	return cur;
}
function progressOf(t) {
	return Math.min(1, Math.max(0, t / CINE_END_MS));
}
function defaultIntro() {
	return {
		version: 0,
		seen: false,
		skipped: false,
		seenAt: null
	};
}
function shouldForceIntro(rec) {
	if (!rec.seen) return true;
	if (rec.version < 1) return true;
	return false;
}
function markIntroComplete(skipped) {
	return {
		version: 1,
		seen: true,
		skipped,
		seenAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function canStore() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function loadIntro() {
	if (!canStore()) return defaultIntro();
	try {
		const raw = localStorage.getItem(CINE_KEY);
		if (!raw) return defaultIntro();
		const parsed = JSON.parse(raw);
		return {
			version: typeof parsed.version === "number" ? parsed.version : 0,
			seen: !!parsed.seen,
			skipped: !!parsed.skipped,
			seenAt: typeof parsed.seenAt === "string" ? parsed.seenAt : null
		};
	} catch {
		return defaultIntro();
	}
}
function saveIntro(rec) {
	if (!canStore()) return;
	try {
		localStorage.setItem(CINE_KEY, JSON.stringify(rec));
	} catch {}
}
var aiTimer = 0;
var aiAttacks = 0;
function persist(game) {
	if (game && game.phase !== "over") saveGame(game);
	if (game?.phase === "over") {
		sealLegacy(game);
		sealCycle(game);
		clearSave();
	}
}
var useGame = create((set, get) => ({
	screen: "title",
	game: null,
	settings: {
		muted: false,
		reducedShake: false,
		mapView: "globe"
	},
	hasSave: false,
	aiBusy: false,
	shake: 0,
	chronicleOpen: false,
	start: (opts) => {
		unlockAudio();
		aiAttacks = 0;
		const game = newGame({
			...opts,
			inherit: true
		});
		persist(game);
		set({
			screen: "play",
			game,
			hasSave: true,
			aiBusy: false,
			chronicleOpen: false
		});
		if (!currentPlayer(game).isHuman) runAi();
	},
	resume: () => {
		unlockAudio();
		const game = loadGame();
		if (!game) return;
		set({
			screen: "play",
			game
		});
		if (game.phase === "ai") runAi();
	},
	toTitle: () => set({
		screen: "title",
		game: null,
		hasSave: !!loadGame()
	}),
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
			bumpShake(.45);
		}
		if (next.phase === "transfer" || next.lastCombat && next.territories[next.lastCombat.to].owner === currentPlayer(next).id && next.lastCombat.defendLoss) sfxCapture();
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
		bumpShake(.6);
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
		set({ game: {
			...game,
			selected: null,
			attackFrom: null,
			attackTo: null,
			fortifyFrom: null
		} });
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
		const next = game.phase === "fortify" || game.phase === "attack" ? game.phase === "attack" ? finishAttack(game) : skipFortify(game) : game;
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
		const next = {
			...game,
			voidcrownJustEmerged: false
		};
		persist(next);
		set({ game: next });
	},
	toggleMute: () => {
		const settings = {
			...get().settings,
			muted: !get().settings.muted
		};
		saveSettings(settings);
		set({ settings });
		setMuted(settings.muted);
	},
	setMapView: (view) => {
		const settings = {
			...get().settings,
			mapView: view
		};
		saveSettings(settings);
		set({ settings });
	},
	zeroDay: () => {
		const { game } = get();
		if (!game?.selected) return;
		const next = zeroDayStrike(game, game.selected);
		if (!next) return;
		sfxBoom();
		bumpShake(.9);
		persist(next);
		set({ game: next });
	},
	legalTargets: () => {
		const { game } = get();
		if (!game?.attackFrom) return [];
		return legalAttackTargets(game, game.attackFrom);
	},
	openChronicle: () => set({ chronicleOpen: true }),
	closeChronicle: () => set({ chronicleOpen: false })
}));
function bumpShake(n) {
	useGame.setState({ shake: Math.min(1, useGame.getState().shake + n) });
}
function endSfx(g) {
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
			bumpShake(.25);
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
if (typeof window !== "undefined") document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") {
		const g = useGame.getState().game;
		persist(g);
	}
});
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.98]",
			secondary: "bg-elevated text-fg border border-border hover:bg-surface active:scale-[0.98]",
			ghost: "text-fg hover:bg-elevated/80",
			danger: "bg-danger text-fg hover:opacity-90 active:scale-[0.98]"
		},
		size: {
			md: "h-11 rounded-[var(--radius-md)] px-5 text-sm",
			lg: "h-12 rounded-[var(--radius-lg)] px-6 text-base",
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-sm",
			icon: "size-11 rounded-[var(--radius-md)]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Cinematic() {
	const finish = useGame((s) => s.finishCinematic);
	const muted = useGame((s) => s.settings.muted);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [t, setT] = (0, import_react.useState)(0);
	const acc = (0, import_react.useRef)(0);
	const last = (0, import_react.useRef)(0);
	const lastId = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!started || paused) return;
		let raf = 0;
		last.current = performance.now();
		const tick = (now) => {
			acc.current += now - last.current;
			last.current = now;
			if (acc.current >= 65e3) {
				setT(CINE_END_MS);
				stopCineBed();
				silenceSpeech();
				finish(false);
				return;
			}
			setT(acc.current);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		started,
		paused,
		finish
	]);
	const scene = sceneAt(t);
	(0, import_react.useEffect)(() => {
		if (!started) return;
		if (lastId.current === scene.id) return;
		lastId.current = scene.id;
		setCineMood(scene.mood);
		if (scene.id === "diazero") cineHit();
		if (!muted) speakLine(scene.line);
	}, [
		scene.id,
		started,
		muted,
		scene.line,
		scene.mood
	]);
	(0, import_react.useEffect)(() => () => {
		stopCineBed();
		silenceSpeech();
	}, []);
	const begin = () => {
		unlockAudio();
		setStarted(true);
		last.current = performance.now();
	};
	const skip = () => {
		stopCineBed();
		silenceSpeech();
		finish(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: scene.image,
				alt: "",
				className: cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", scene.glitch ? "contrast-125 saturate-50" : ""),
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,#08090ce8_0%,#08090c55_38%,#08090cf2_100%)]" }),
			scene.glitch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 mix-blend-screen opacity-40 cine-glitch" }) : null,
			!started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-[0.32em] text-muted uppercase",
						children: "Voidcrown"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl uppercase sm:text-6xl",
						children: "El Día Cero"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-sm text-muted",
						children: "Toca para comenzar. El audio se abre con el gesto."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "min-w-48 font-display uppercase tracking-[0.16em]",
						onClick: begin,
						children: "Comenzar"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex h-full flex-col justify-end px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs tracking-[0.22em] text-muted uppercase",
							children: scene.year
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-[var(--radius-md)] border border-border bg-surface/80 px-3 text-xs uppercase tracking-[0.14em]",
								onClick: () => setPaused((p) => !p),
								children: paused ? "Seguir" : "Pausa"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-[var(--radius-md)] border border-border bg-surface/80 px-3 text-xs uppercase tracking-[0.14em]",
								onClick: skip,
								children: "Saltar"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mb-3 w-full max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.2em] text-muted uppercase",
								children: scene.kicker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-3xl uppercase text-balance sm:text-4xl",
								children: scene.line
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
								children: scene.sub
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto h-0.5 w-full max-w-2xl overflow-hidden rounded-full bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent",
							style: { width: `${progressOf(t) * 100}%` }
						})
					})
				]
			})
		]
	});
}
function HowTo() {
	const back = useGame((s) => s.toTitle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh overflow-y-auto bg-bg px-5 py-[max(1.5rem,env(safe-area-inset-top))] text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg pb-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Manual de mesa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl uppercase",
					children: "Cómo se juega"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-5 text-sm leading-relaxed text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Es Risk clásico con dados, sobre un mundo que se está cayendo. Ganas cuando tu facción controla todos los territorios, o cuando el resto queda fuera." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Turno"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-2 list-decimal space-y-2 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Refuerza: recibes ejércitos por territorios (mínimo 3) y por continentes completos." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ataca: elige un territorio propio con 2+ ejércitos y un vecino enemigo. Tiras hasta 3 dados, el defensor hasta 2. El más alto gana; empate para el defensor." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fortifica: un solo movimiento entre territorios conectados que controles." })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Cartas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "Si tomas al menos un territorio, robos una carta. Tres iguales o una de cada dan un set de refuerzos. Con cinco cartas el canje es obligatorio."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Día Zero"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "Al cerrar cada ronda cae un desastre. Mata ejércitos y deja cicatrices que cambian refuerzos y defensa. Si tomas un territorio enemigo con el golpe Día Zero (una vez, a partir del día 5), dejas un cráter nuclear."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Grieta y Voidcrown"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "Singularidad, cicatrices y mutaciones pueden abrir una realidad hija. Voidcrown no es un modo ni un menú: cuando las grietas bastan, nace como facción enemiga y reclama yermos. Hay que vencerlo o se traga el mapa."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Facciones"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "Cada mando tiene doctrina. Ceniza aguanta en cicatrices. Marea vive de la costa. Nexo deja guarnición al tomar. Horda crece en el interior. Umbral pierde menos en desastres."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Crónica"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "El libro del HUD no es un menú de lore. Los capítulos se abren con lo que haces: conquistas, desastres, grietas. Voidcrown sigue sin elegirse."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Sondas y biota"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "Cada territorio tiene vida: seis ejes (ácido, calor, radiación, presión, social, sintético), población y esporas. Sondear lee el genoma. Muestra extrae y deja esporas. Sembrar solo en tierra tuya: tu facción empuja un eje. Un desastre no borra el nodo: selecciona quién aguanta y, si la población cae a cero, queda tumba y espora. El octaedro sobre el globo es el fenómeno. Tócalo: avisa antes de que entres."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-fg uppercase",
							children: "Director"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "El Director no recompila el juego. Emite un parche: genoma, espora o doctrina (normal, austeridad, rescate). Recuerda hasta 20 partidas. Si pierdes más de lo que ganas, la siguiente abre en rescate. Las grietas siguen naciendo del mapa, no de un menú."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Arrastra el planeta. El icono de mapa cambia a vista táctica. Toca un nodo para actuar. El punto rojo es el fenómeno: tócalo para el aviso." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8 w-full",
					onClick: back,
					children: "Volver"
				})
			]
		})
	});
}
function WorldMap() {
	const game = useGame((s) => s.game);
	const tap = useGame((s) => s.tapTerritory);
	const focus = useGame((s) => s.focusHazard);
	const wrap = (0, import_react.useRef)(null);
	const view = (0, import_react.useRef)({
		x: 0,
		y: 0,
		k: 1
	});
	const drag = (0, import_react.useRef)(null);
	const svgRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = wrap.current;
		if (!el) return;
		const apply = () => {
			const g = svgRef.current;
			if (!g) return;
			g.setAttribute("transform", `translate(${view.current.x} ${view.current.y}) scale(${view.current.k})`);
		};
		const onWheel = (e) => {
			e.preventDefault();
			const rect = el.getBoundingClientRect();
			const mx = e.clientX - rect.left;
			const my = e.clientY - rect.top;
			const prev = view.current.k;
			const next = Math.min(2.6, Math.max(.85, prev * (e.deltaY > 0 ? .92 : 1.08)));
			const z = next / prev;
			view.current.x = mx - (mx - view.current.x) * z;
			view.current.y = my - (my - view.current.y) * z;
			view.current.k = next;
			apply();
		};
		const down = (e) => {
			if (e.target.dataset.terr) return;
			drag.current = {
				x: e.clientX,
				y: e.clientY,
				vx: view.current.x,
				vy: view.current.y,
				pid: e.pointerId
			};
			el.setPointerCapture(e.pointerId);
		};
		const move = (e) => {
			if (!drag.current || drag.current.pid !== e.pointerId) return;
			view.current.x = drag.current.vx + (e.clientX - drag.current.x);
			view.current.y = drag.current.vy + (e.clientY - drag.current.y);
			apply();
		};
		const up = () => {
			drag.current = null;
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		el.addEventListener("pointerdown", down);
		el.addEventListener("pointermove", move);
		el.addEventListener("pointerup", up);
		el.addEventListener("pointercancel", up);
		return () => {
			el.removeEventListener("wheel", onWheel);
			el.removeEventListener("pointerdown", down);
			el.removeEventListener("pointermove", move);
			el.removeEventListener("pointerup", up);
			el.removeEventListener("pointercancel", up);
		};
	}, []);
	if (!game) return null;
	const me = currentPlayer(game);
	const legalSet = new Set(game.attackFrom ? legalAttackTargets(game, game.attackFrom) : []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrap,
		className: "relative h-full w-full touch-none overflow-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/game/map.jpg",
				alt: "",
				className: "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40",
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#08090c_95%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: `0 0 ${MAP_W} 620`,
				className: "relative h-full w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					ref: svgRef,
					children: [SEA_LANES.map(([a, b]) => {
						const ta = TERRITORIES[a];
						const tb = TERRITORIES[b];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: ta.cx,
							y1: ta.cy,
							x2: tb.cx,
							y2: tb.cy,
							className: "stroke-border-strong",
							strokeWidth: 1.4,
							strokeDasharray: "5 5"
						}, `${a}-${b}`);
					}), TERRITORY_LIST.map((def) => {
						const st = game.territories[def.id];
						const owner = game.players.find((p) => p.id === st.owner);
						const fill = st.owner === "void" ? "#c4453c" : owner?.color ?? "#2a2d33";
						const selected = game.selected === def.id || game.attackFrom === def.id || game.fortifyFrom === def.id;
						const target = legalSet.has(def.id) || game.attackTo === def.id;
						const mine = st.owner === me.id;
						const voided = st.owner === "void";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: def.path,
								"data-terr": "1",
								role: "button",
								tabIndex: 0,
								"aria-label": `${def.name}, ${st.armies} ejércitos`,
								onPointerDown: (e) => {
									e.stopPropagation();
									tap(def.id);
								},
								className: "cursor-pointer",
								fill,
								fillOpacity: st.owner === "wasteland" ? .22 : voided ? .8 : mine ? .72 : .5,
								stroke: selected ? "var(--color-fg)" : target || voided ? "var(--color-danger)" : "var(--color-border-strong)",
								strokeWidth: selected ? 2.6 : target ? 2.2 : 1
							}),
							st.hazard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								"data-terr": "1",
								cx: def.cx + 16,
								cy: def.cy - 14,
								r: 7,
								fill: "var(--color-danger)",
								className: "cursor-pointer",
								onPointerDown: (e) => {
									e.stopPropagation();
									focus(def.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${def.name}: ${st.hazard}` })
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: def.cx,
								y: def.cy - 4,
								textAnchor: "middle",
								fill: "var(--color-fg)",
								stroke: "var(--color-bg)",
								strokeWidth: 3,
								paintOrder: "stroke",
								style: {
									fontFamily: "var(--font-sans)",
									fontSize: 8,
									fontWeight: 600,
									letterSpacing: "0.06em"
								},
								children: def.short
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: def.cx,
								y: def.cy + 10,
								textAnchor: "middle",
								fill: "var(--color-fg)",
								stroke: "var(--color-bg)",
								strokeWidth: 3,
								paintOrder: "stroke",
								style: {
									fontFamily: "var(--font-mono)",
									fontSize: 11,
									fontWeight: 600
								},
								children: st.armies
							})
						] }, def.id);
					})]
				})
			})
		]
	});
}
var Globe = (0, import_react.lazy)(() => import("./globe-DULDHQX1.mjs"));
function Board() {
	const view = useGame((s) => s.settings.mapView);
	const [client, setClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setClient(true), []);
	if (view === "tactical") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldMap, {});
	if (!client) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-bg" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-bg" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {})
	});
}
function ChroniclePanel({ game, onClose }) {
	const chapters = openedChapters(game);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-40 flex items-end justify-center bg-bg/70 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[min(36rem,88dvh)] w-full max-w-lg overflow-y-auto rounded-[var(--radius-xl)] border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-[0.22em] text-muted uppercase",
						children: "Crónica"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl uppercase",
						children: "La historia jugada"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border",
						"aria-label": "Cerrar crónica",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						chapters.length,
						" de ",
						CHAPTERS.length,
						" capítulos. Se abren con lo que haces, no con un menú."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 space-y-4",
					children: chapters.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-l-2 border-accent pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-[0.16em] text-muted uppercase",
								children: ch.kicker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg uppercase",
								children: ch.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: ch.body
							})
						]
					}, ch.id))
				})
			]
		})
	});
}
function ChronicleButton({ count, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "relative flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90",
		"aria-label": "Crónica",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -right-1 -top-1 min-w-4 rounded-full bg-accent px-1 text-[10px] leading-4 text-white tabular-nums",
			children: count
		}) : null]
	});
}
function pips(n) {
	return {
		1: ["c"],
		2: ["tl", "br"],
		3: [
			"tl",
			"c",
			"br"
		],
		4: [
			"tl",
			"tr",
			"bl",
			"br"
		],
		5: [
			"tl",
			"tr",
			"c",
			"bl",
			"br"
		],
		6: [
			"tl",
			"tr",
			"ml",
			"mr",
			"bl",
			"br"
		]
	}[n] ?? [];
}
var pos = {
	tl: "left-1 top-1",
	tr: "right-1 top-1",
	ml: "left-1 top-1/2 -translate-y-1/2",
	mr: "right-1 top-1/2 -translate-y-1/2",
	bl: "left-1 bottom-1",
	br: "right-1 bottom-1",
	c: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
};
function DiceFace({ value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative size-10 rounded-[var(--radius-sm)] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]", tone === "atk" ? "border-border-strong bg-elevated" : "border-border bg-surface"),
		children: pips(value).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute size-1.5 rounded-full", tone === "atk" ? "bg-fg" : "bg-muted", pos[p]) }, p))
	});
}
var PHASE = {
	reinforce: "Refuerzo",
	attack: "Ataque",
	fortify: "Fortificar",
	transfer: "Ocupar",
	ai: "Turno rival",
	event: "Desastre",
	over: "Fin"
};
function PlayScreen() {
	const game = useGame((s) => s.game);
	const shake = useGame((s) => s.shake);
	const aiBusy = useGame((s) => s.aiBusy);
	const muted = useGame((s) => s.settings.muted);
	const mapView = useGame((s) => s.settings.mapView);
	const toggleMute = useGame((s) => s.toggleMute);
	const setMapView = useGame((s) => s.setMapView);
	const toTitle = useGame((s) => s.toTitle);
	const trade = useGame((s) => s.trade);
	const goAttack = useGame((s) => s.goAttack);
	const goFortify = useGame((s) => s.goFortify);
	const skipMove = useGame((s) => s.skipMove);
	const placeAll = useGame((s) => s.placeAllOnSelected);
	const roll = useGame((s) => s.roll);
	const blitz = useGame((s) => s.blitz);
	const retreat = useGame((s) => s.retreat);
	const transfer = useGame((s) => s.transfer);
	const doFortify = useGame((s) => s.doFortify);
	const dismiss = useGame((s) => s.dismissDisaster);
	const dismissVoid = useGame((s) => s.dismissVoidcrown);
	const clearPick = useGame((s) => s.clearPick);
	const zeroDay = useGame((s) => s.zeroDay);
	const chronicleOpen = useGame((s) => s.chronicleOpen);
	const openChronicle = useGame((s) => s.openChronicle);
	const closeChronicle = useGame((s) => s.closeChronicle);
	const probe = useGame((s) => s.probe);
	const [moveN, setMoveN] = (0, import_react.useState)(1);
	const [toast, setToast] = (0, import_react.useState)(null);
	const prevCh = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const tick = () => {
			const cur = useGame.getState().shake;
			if (cur > .002) useGame.setState({ shake: cur * .86 });
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, []);
	const me = game ? currentPlayer(game) : null;
	const human = game ? game.players.find((p) => p.id === game.humanId) : null;
	const mine = game && human ? ownedIds(game, human.id).length : 0;
	(0, import_react.useEffect)(() => {
		if (!game) return;
		if (game.chronicle.length > prevCh.current) {
			const id = game.chronicle[game.chronicle.length - 1];
			const ch = CHAPTERS.find((c) => c.id === id);
			if (ch && ch.id !== "genesis") {
				setToast(ch.title);
				const t = window.setTimeout(() => setToast(null), 3200);
				prevCh.current = game.chronicle.length;
				return () => window.clearTimeout(t);
			}
		}
		prevCh.current = game.chronicle.length;
	}, [game?.chronicle.length, game]);
	(0, import_react.useEffect)(() => {
		if (!game) return;
		if (game.phase === "transfer") setMoveN(game.pendingTransferMax);
		if (game.phase === "fortify" && game.fortifyFrom && game.selected && game.fortifyFrom !== game.selected) setMoveN(Math.max(1, game.territories[game.fortifyFrom].armies - 1));
	}, [
		game?.phase,
		game?.attackTo,
		game?.fortifyFrom,
		game?.selected,
		game
	]);
	const continentsHeld = (0, import_react.useMemo)(() => {
		if (!game || !human) return [];
		return CONTINENTS.filter((c) => c.members.every((id) => game.territories[id].owner === human.id));
	}, [game, human]);
	if (!game || !me || !human) return null;
	const ox = (Math.random() - .5) * shake * shake * 14;
	const oy = (Math.random() - .5) * shake * shake * 10;
	const fighting = !!(game.attackFrom && game.attackTo && (game.phase === "attack" || game.phase === "ai"));
	const transferring = game.phase === "transfer" && game.attackFrom && game.attackTo;
	const fortifying = game.phase === "fortify" && game.fortifyFrom && game.selected && game.fortifyFrom !== game.selected;
	const mustTrade = me.isHuman && game.phase === "reinforce" && me.cards.length >= 5 && canTrade(me.cards);
	const stats = livingStats(game);
	const node = game.selected ? game.living.biota[game.selected] : null;
	const ownsSelected = !!(game.selected && game.territories[game.selected].owner === human.id);
	const canProbe = me.isHuman && (game.phase === "reinforce" || game.phase === "attack" || game.phase === "fortify") && !fighting;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col",
				style: { transform: `translate(${ox}px, ${oy}px)` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "relative z-20 flex items-start justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-lg)] border border-border bg-surface/90 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-xs tracking-[0.2em] text-muted uppercase",
								children: [
									"Día ",
									game.day,
									" · ",
									PHASE[game.phase]
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm tabular-nums",
								children: [
									me.name,
									game.phase === "reinforce" ? ` · ${game.armiesToPlace} por colocar` : "",
									aiBusy ? " · pensando" : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChronicleButton, {
									count: game.chronicle.length,
									onClick: openChronicle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMapView(mapView === "globe" ? "tactical" : "globe"),
									className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90",
									"aria-label": mapView === "globe" ? "Vista táctica" : "Vista globo",
									children: mapView === "globe" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: toggleMute,
									className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90",
									"aria-label": "Sonido",
									children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: toTitle,
									className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90",
									"aria-label": "Salir",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								})
							]
						})]
					}),
					game.living.warning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-20 mx-4 mt-2 rounded-[var(--radius-md)] border border-danger/50 bg-danger/15 px-3 py-2 text-xs leading-snug",
						children: game.living.warning
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-h-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {}), game.selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-[var(--radius-md)] border border-border bg-surface/90 px-3 py-1.5 text-xs",
							children: [
								TERRITORIES[game.selected].name,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 tabular-nums text-muted",
									children: game.territories[game.selected].armies
								}),
								node ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 tabular-nums text-muted",
									children: [
										"biota ",
										node.pop,
										" · esp ",
										node.spores
									]
								}) : null
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "pointer-events-none absolute bottom-28 left-4 hidden w-56 flex-col gap-2 md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-auto rounded-[var(--radius-lg)] border border-border bg-surface/90 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Tu mando"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "tabular-nums text-sm",
										children: [
											mine,
											" territorios · ",
											human.cards.length,
											" cartas"
										]
									}),
									continentsHeld.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: continentsHeld.map((c) => c.name).join(" · ")
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 h-1.5 overflow-hidden rounded-full bg-elevated",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-danger",
											style: { width: `${Math.min(100, game.voidcrown)}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[10px] tracking-[0.14em] text-muted uppercase",
										children: [
											game.voidcrownEmerged ? "Voidcrown" : game.riftOpened ? "Grieta" : "Singularidad",
											" ",
											game.voidcrown
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 border-t border-border pt-2 text-[11px] tabular-nums",
										children: [
											"Biota ",
											stats.pop,
											" · Cicatrices ",
											stats.scars,
											" · Gen ",
											stats.gen
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] tracking-[0.14em] text-muted uppercase",
										children: [
											stats.doctrine,
											" · partidas ",
											stats.games,
											"/20 · sondas ",
											stats.probes
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] leading-snug text-muted",
										children: game.living.retentionNote
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-auto rounded-[var(--radius-lg)] border border-border bg-surface/90 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] tracking-[0.16em] text-muted uppercase",
										children: "Edai"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs",
										children: game.edai.dec
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted",
										children: game.edai.reason
									}),
									game.cel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 border-t border-border pt-2 text-[11px] text-muted",
										children: ["CEL · ", game.cel.observation]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-auto max-h-36 overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface/90 p-3 text-xs text-muted",
								children: game.log.slice(0, 6).map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 last:mb-0",
									children: l
								}, `${l}-${i}`))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex max-w-3xl flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 text-xs text-muted md:hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: [mine, " territorios"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: ["Biota ", stats.pop]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: ["Cic ", stats.scars]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: ["Gen ", stats.gen]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stats.doctrine })
									]
								}),
								canProbe && game.selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "flex-1",
											onClick: () => probe("survey"),
											children: "Sondear"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "flex-1",
											onClick: () => probe("sample"),
											children: "Muestra"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "flex-1",
											onClick: () => probe("seed"),
											disabled: !ownsSelected,
											children: "Sembrar"
										})
									]
								}) : null,
								me.isHuman && game.phase === "reinforce" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "flex-1",
											onClick: trade,
											disabled: !canTrade(me.cards),
											children: "Canjear set"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "flex-1",
											onClick: placeAll,
											disabled: !game.selected || game.armiesToPlace < 1,
											children: "Dejar resto aquí"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "flex-1",
											onClick: goAttack,
											disabled: game.armiesToPlace > 0 || mustTrade,
											children: "Atacar"
										})
									]
								}) : null,
								me.isHuman && game.phase === "attack" && !fighting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "flex-1 self-center text-sm text-muted",
											children: "Elige origen (2+) y un vecino enemigo."
										}),
										canZeroDay(game) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "danger",
											onClick: zeroDay,
											children: "Día Zero"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											onClick: goFortify,
											children: "Fortificar"
										})
									]
								}) : null,
								me.isHuman && game.phase === "fortify" && !fortifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "flex-1 self-center text-sm text-muted",
										children: "Mueve una vez entre tuyos, o pasa."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: skipMove,
										children: "Terminar turno"
									})]
								}) : null,
								aiBusy || !me.isHuman && game.phase !== "event" && game.phase !== "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [me.name, " mueve."]
								}) : null
							]
						})
					})
				]
			}),
			fighting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-4 shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg uppercase",
							children: "Combate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								TERRITORIES[game.attackFrom].name,
								" (",
								game.territories[game.attackFrom].armies,
								") →",
								" ",
								TERRITORIES[game.attackTo].name,
								" (",
								game.territories[game.attackTo].armies,
								")"
							]
						}),
						game.lastCombat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: game.lastCombat.attackDice.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiceFace, {
										value: d,
										tone: "atk"
									}, `a${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "vs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: game.lastCombat.defendDice.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiceFace, {
										value: d,
										tone: "def"
									}, `d${i}`))
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Tira los dados."
						}),
						me.isHuman ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "flex-1",
									onClick: roll,
									children: "Tirar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									className: "flex-1",
									onClick: blitz,
									children: "Blitz"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: retreat,
									children: "Retirada"
								})
							]
						}) : null
					]
				})
			}) : null,
			transferring && me.isHuman ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg uppercase",
							children: "Ocupar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Mueve ejércitos a ",
								TERRITORIES[game.attackTo].name,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: game.pendingTransferMin,
							max: game.pendingTransferMax,
							value: moveN,
							onChange: (e) => setMoveN(Number(e.target.value)),
							className: "mt-4 w-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular-nums text-sm",
							children: moveN
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3 w-full",
							onClick: () => transfer(moveN),
							children: "Confirmar"
						})
					]
				})
			}) : null,
			fortifying && me.isHuman ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg uppercase",
							children: "Fortificar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								TERRITORIES[game.fortifyFrom].name,
								" → ",
								TERRITORIES[game.selected].name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: Math.max(1, game.territories[game.fortifyFrom].armies - 1),
							value: moveN,
							onChange: (e) => setMoveN(Number(e.target.value)),
							className: "mt-4 w-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular-nums text-sm",
							children: moveN
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: () => doFortify(moveN),
								children: "Mover y pasar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: clearPick,
								children: "Cancelar"
							})]
						})
					]
				})
			}) : null,
			game.phase === "event" && game.lastDisaster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: game.lastDisaster.image,
						alt: "",
						className: "h-40 w-full object-cover",
						crossOrigin: "anonymous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tracking-[0.2em] text-muted uppercase",
								children: ["Día ", game.day]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl uppercase",
								children: game.lastDisaster.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: game.lastDisaster.flavor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1 text-sm",
								children: game.lastDisaster.hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "tabular-nums",
									children: [TERRITORIES[h.id].name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [" −", h.killed]
									})]
								}, h.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full",
								onClick: dismiss,
								children: "Continuar"
							})
						]
					})]
				})
			}) : null,
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-20 z-40 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-[var(--radius-md)] border border-border bg-surface/95 px-4 py-2 font-display text-sm uppercase",
					children: ["Crónica: ", toast]
				})
			}) : null,
			game.voidcrownJustEmerged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-[60] flex items-center justify-center bg-bg/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[var(--radius-xl)] border border-danger/50 bg-surface p-6 text-center shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.22em] text-danger uppercase",
							children: "La historia se rompió"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl uppercase",
							children: "Voidcrown ha emergido"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: "Las grietas se abrieron. Algo del vacío reclama territorios. No negocia. No se rinde. Consume."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6 w-full",
							variant: "danger",
							onClick: dismissVoid,
							children: "Enfrentarlo"
						})
					]
				})
			}) : null,
			chronicleOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChroniclePanel, {
				game,
				onClose: closeChronicle
			}) : null,
			game.phase === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-50 flex items-center justify-center bg-bg/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.22em] text-muted uppercase",
							children: game.winner === game.humanId ? "Legado consolidado" : "El vacío ganó"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl uppercase",
							children: game.winner === game.humanId ? game.voidcrownEmerged ? "Voidcrown retrocede" : "Dominio total" : "Derrota"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: game.winner === game.humanId ? game.voidcrownEmerged ? "El mapa respira de nuevo. Tu nombre queda en la historia." : "El mapa queda bajo tu mando." : game.loseReason ?? "Otra facción cierra el ciclo."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--radius-md)] border border-border bg-elevated px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl tabular-nums",
										children: game.day
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] tracking-[0.14em] text-muted uppercase",
										children: "Días"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--radius-md)] border border-border bg-elevated px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl tabular-nums",
										children: game.captures
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] tracking-[0.14em] text-muted uppercase",
										children: "Conquistas"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--radius-md)] border border-border bg-elevated px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl tabular-nums",
										children: Math.max(0, game.realities.length - 1)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] tracking-[0.14em] text-muted uppercase",
										children: "Grietas"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6 w-full",
							onClick: toTitle,
							children: "Volver al comando"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "mt-2 w-full",
							onClick: () => {
								const blob = new Blob([JSON.stringify(memoryBundle(game))], { type: "application/json" });
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = `voidcrown-memoria-gen${stats.gen}.json`;
								a.click();
								URL.revokeObjectURL(url);
							},
							children: "Guardar memoria"
						})
					]
				})
			}) : null
		]
	});
}
function TitleScreen() {
	const start = useGame((s) => s.start);
	const resume = useGame((s) => s.resume);
	const toHow = useGame((s) => s.toHow);
	const replayCinematic = useGame((s) => s.replayCinematic);
	const hasSave = useGame((s) => s.hasSave);
	const muted = useGame((s) => s.settings.muted);
	const toggleMute = useGame((s) => s.toggleMute);
	const [faction, setFaction] = (0, import_react.useState)("ceniza");
	const [opponents, setOpponents] = (0, import_react.useState)(3);
	const [difficulty, setDifficulty] = (0, import_react.useState)("veterano");
	const [scenario, setScenario] = (0, import_react.useState)("standard");
	const [memNote, setMemNote] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/game/menu.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover",
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,#08090ccc_0%,#08090c88_40%,#08090cf2_100%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Comando global"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						unlockAudio();
						toggleMute();
					},
					className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/80",
					"aria-label": muted ? "Activar sonido" : "Silenciar",
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-end gap-6 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm tracking-[0.28em] text-muted uppercase",
							children: "Operación"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-5xl leading-[0.95] tracking-[var(--tracking-display)] text-balance uppercase sm:text-6xl",
							children: "Risk Día Zero"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-md text-sm leading-relaxed text-muted text-pretty",
							children: "El mapa se parte el primer día. Toma territorios, tira los dados y aguanta los desastres. La historia se abre al jugarla. Si se rompe, nace una grieta. Voidcrown no se elige: emerge."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-xl)] border border-border bg-surface/90 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.18em] text-muted uppercase",
								children: "Facción"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: FACTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFaction(f.id),
									className: cn("flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2 text-left transition-colors duration-[var(--motion-quick)]", faction === f.id ? "border-border-strong bg-elevated" : "border-border bg-bg/40"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-3 shrink-0 rounded-full",
										style: { background: f.color }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-medium",
										children: f.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[11px] text-muted",
										children: f.doctrine
									})] })]
								}, f.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "Rivales"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: opponents,
										onChange: (e) => setOpponents(Number(e.target.value)),
										className: "mt-1 h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 1,
												children: "1 IA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 2,
												children: "2 IA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 3,
												children: "3 IA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: 4,
												children: "4 IA"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "Dificultad"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: difficulty,
										onChange: (e) => setDifficulty(e.target.value),
										className: "mt-1 h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "recruta",
												children: "Recluta"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "veterano",
												children: "Veterano"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "diazero",
												children: "Leyenda"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScenario("standard"),
									className: cn("min-h-11 rounded-[var(--radius-md)] border px-3 text-sm", scenario === "standard" ? "border-border-strong bg-elevated" : "border-border bg-bg/40"),
									children: "Risk"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScenario("rift"),
									className: cn("min-h-11 rounded-[var(--radius-md)] border px-3 text-sm", scenario === "rift" ? "border-border-strong bg-elevated" : "border-border bg-bg/40"),
									children: "Grieta"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "w-full font-display tracking-[0.14em] uppercase",
								onClick: () => start({
									faction,
									opponents,
									difficulty,
									scenario
								}),
								children: "Entrar al mapa"
							}),
							hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "w-full",
								onClick: resume,
								children: "Continuar partida"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "w-full",
								onClick: toHow,
								children: "Cómo se juega"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "w-full",
								onClick: replayCinematic,
								children: "Ver introducción"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-md)] text-sm text-muted",
								children: ["Cargar memoria", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/json",
									className: "sr-only",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											try {
												const ok = importMemoryBundle(JSON.parse(String(reader.result)));
												setMemNote(ok ? "Memoria cargada. La siguiente partida hereda tumbas y generación." : "Ese archivo no es memoria de Voidcrown.");
											} catch {
												setMemNote("No se pudo leer el archivo.");
											}
										};
										reader.readAsText(file);
									}
								})]
							}),
							memNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-muted",
								children: memNote
							}) : null
						]
					})
				]
			})
		]
	});
}
function AppShell() {
	const screen = useGame((s) => s.screen);
	const muted = useGame((s) => s.settings.muted);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const settings = loadSettings();
		const intro = loadIntro();
		useGame.setState({
			hasSave: !!loadGame(),
			settings,
			screen: shouldForceIntro(intro) ? "cinematic" : "title"
		});
		setMuted(settings.muted);
		setReady(true);
		const unlock = () => unlockAudio();
		window.addEventListener("pointerdown", unlock, { once: true });
		window.addEventListener("keydown", unlock, { once: true });
		const vis = () => {
			if (document.visibilityState === "visible") unlockAudio();
		};
		document.addEventListener("visibilitychange", vis);
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
			document.removeEventListener("visibilitychange", vis);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setMuted(muted);
	}, [muted]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-dvh bg-bg" });
	if (screen === "cinematic") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cinematic, {});
	if (screen === "how") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowTo, {});
	if (screen === "play") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { TERRITORIES as a, legalAttackTargets as i, useGame as n, TERRITORY_LIST as o, currentPlayer as r, latLonToVec3 as s, routes_exports as t };
