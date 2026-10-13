import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as useLoader, c as BufferGeometry, d as Mesh, f as MeshBasicMaterial, g as Vector3, h as TextureLoader, i as useFrame, l as Color, m as SphereGeometry, n as OrbitControls, o as useThree, p as SRGBColorSpace, r as Canvas, t as Stars, u as Float32BufferAttribute, v as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as TERRITORIES, i as legalAttackTargets, n as useGame, o as TERRITORY_LIST, r as currentPlayer, s as latLonToVec3 } from "./routes-CxUT7MVX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/globe-DULDHQX1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function vec(lat, lon, r = 1.02) {
	const [x, y, z] = latLonToVec3(lat, lon, r);
	return new Vector3(x, y, z);
}
function Earth({ tint }) {
	const day = useLoader(TextureLoader, "/game/earth-day.jpg");
	const night = useLoader(TextureLoader, "/game/earth-night.jpg");
	const clouds = useLoader(TextureLoader, "/game/earth-clouds.jpg");
	const cloudRef = (0, import_react.useRef)(null);
	(0, import_react.useMemo)(() => {
		day.colorSpace = SRGBColorSpace;
		night.colorSpace = SRGBColorSpace;
		day.anisotropy = 8;
		night.anisotropy = 8;
	}, [day, night]);
	useFrame((_, dt) => {
		if (cloudRef.current) cloudRef.current.rotation.y += dt * .012;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			64,
			64
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			map: day,
			emissiveMap: night,
			emissive: new Color("#ffcc88"),
			emissiveIntensity: .28,
			roughness: .82,
			metalness: .04,
			color: tint
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: cloudRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				1.012,
				48,
				48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshLambertMaterial", {
				map: clouds,
				transparent: true,
				opacity: .28,
				depthWrite: false
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1.045,
			32,
			32
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: tint,
			transparent: true,
			opacity: .1,
			side: 1
		})] })
	] });
}
function Markers({ onPick }) {
	const game = useGame((s) => s.game);
	if (!game) return null;
	const me = currentPlayer(game);
	const legal = new Set(game.attackFrom ? legalAttackTargets(game, game.attackFrom) : []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: TERRITORY_LIST.map((def) => {
		const st = game.territories[def.id];
		const owner = game.players.find((p) => p.id === st.owner);
		const color = st.owner === "wasteland" ? "#3a3d44" : st.owner === "void" ? "#c4453c" : owner?.color ?? "#888";
		const selected = game.selected === def.id || game.attackFrom === def.id || game.fortifyFrom === def.id;
		const target = legal.has(def.id) || game.attackTo === def.id;
		const scarred = game.scars.some((c) => c.territory === def.id);
		const r = .018 + Math.min(.02, st.armies * .0016);
		const pos = vec(def.lat, def.lon, 1.02);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: pos,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					onClick: (e) => {
						e.stopPropagation();
						onPick(def.id);
					},
					scale: selected ? 1.35 : target ? 1.2 : 1,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						r,
						12,
						12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: target ? "#e8e6e1" : color })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					scale: selected ? 1.8 : 1.45,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						r,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						color: scarred ? "#c4453c" : color,
						transparent: true,
						opacity: st.hazard ? .38 : .16,
						depthWrite: false
					})]
				}),
				st.owner === me.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					r * .42,
					6,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#e8e6e1" })] }) : null
			]
		}, def.id);
	}) });
}
function Links() {
	const game = useGame((s) => s.game);
	const geom = (0, import_react.useMemo)(() => {
		if (!game?.attackFrom) return null;
		const from = TERRITORIES[game.attackFrom];
		const a = vec(from.lat, from.lon, 1.03);
		const pts = [];
		for (const nid of from.neighbors) {
			const to = TERRITORIES[nid];
			const b = vec(to.lat, to.lon, 1.03);
			pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
		}
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(pts, 3));
		return g;
	}, [game?.attackFrom]);
	if (!geom) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
		geometry: geom,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
			color: "#c8ccd4",
			transparent: true,
			opacity: .45
		})
	});
}
function Bursts() {
	const disaster = useGame((s) => s.game?.lastDisaster);
	const day = useGame((s) => s.game?.day);
	const group = (0, import_react.useRef)(null);
	const bits = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		if (!disaster || !group.current) return;
		bits.current.forEach((b) => {
			group.current?.remove(b.mesh);
			b.mesh.geometry.dispose();
			b.mesh.material.dispose();
		});
		bits.current = [];
		for (const hit of disaster.hits) {
			const t = TERRITORIES[hit.id];
			if (!t) continue;
			const origin = vec(t.lat, t.lon, 1.04);
			for (let i = 0; i < 18; i++) {
				const mesh = new Mesh(new SphereGeometry(.012, 6, 6), new MeshBasicMaterial({ color: disaster.kind === "nuclear" ? "#ff6a3a" : "#e8c9a0" }));
				mesh.position.copy(origin);
				group.current.add(mesh);
				const dir = origin.clone().normalize().add(new Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).multiplyScalar(.8)).normalize();
				bits.current.push({
					p: origin.clone(),
					v: dir.multiplyScalar(.35 + Math.random() * .4),
					life: 1,
					mesh
				});
			}
		}
	}, [disaster, day]);
	useFrame((_, dt) => {
		const d = Math.min(dt, .1);
		bits.current = bits.current.filter((b) => {
			b.life -= d * .9;
			b.p.addScaledVector(b.v, d);
			b.mesh.position.copy(b.p);
			b.mesh.scale.setScalar(Math.max(.01, b.life));
			b.mesh.material.opacity = Math.max(0, b.life);
			b.mesh.material.transparent = true;
			if (b.life <= 0) {
				group.current?.remove(b.mesh);
				b.mesh.geometry.dispose();
				b.mesh.material.dispose();
				return false;
			}
			return true;
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { ref: group });
}
function Phenomena() {
	const game = useGame((s) => s.game);
	const focus = useGame((s) => s.focusHazard);
	const group = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const pulse = 1 + Math.sin(clock.elapsedTime * 3.2) * .22;
		if (!group.current) return;
		group.current.children.forEach((child) => {
			child.scale.setScalar(pulse);
		});
	});
	if (!game) return null;
	const hot = TERRITORY_LIST.filter((d) => game.territories[d.id]?.hazard);
	if (!hot.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		children: hot.map((def) => {
			const kind = game.territories[def.id].hazard;
			const color = kind === "nuclear" || kind === "incendio" || kind === "volcan" ? "#ff6a3a" : kind === "tsunami" || kind === "tormenta" ? "#7eb8c9" : kind === "pandemia" ? "#9aaf6a" : "#e8c9a0";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: vec(def.lat, def.lon, 1.07),
				onClick: (e) => {
					e.stopPropagation();
					focus(def.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.028, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color,
					transparent: true,
					opacity: .92
				})]
			}, def.id);
		})
	});
}
function VoidHalos() {
	const game = useGame((s) => s.game);
	const meshes = (0, import_react.useRef)([]);
	useFrame(({ clock }) => {
		const pulse = 1 + Math.sin(clock.elapsedTime * 2.4) * .16;
		for (const m of meshes.current) if (m) m.scale.setScalar(pulse);
	});
	const voids = TERRITORY_LIST.filter((d) => game?.territories[d.id]?.owner === "void");
	if (!game?.voidcrownEmerged || !voids.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: voids.map((def, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: vec(def.lat, def.lon, 1.028),
		ref: (node) => {
			if (node) meshes.current[i] = node;
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.038,
			10,
			10
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#c4453c",
			transparent: true,
			opacity: .32,
			depthWrite: false
		})]
	}, def.id)) });
}
function Lights({ ember }) {
	const sun = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const t = clock.elapsedTime * .03;
		if (sun.current) sun.current.position.set(Math.cos(t) * 6, 2.2, Math.sin(t) * 6);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
			intensity: ember ? .28 : .42,
			color: ember ? "#3a2018" : "#223044"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			ref: sun,
			intensity: ember ? 1.35 : 1.7,
			color: "#fff5e8",
			position: [
				5,
				2.2,
				3
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				-3,
				1,
				-2
			],
			intensity: ember ? .55 : .35,
			color: ember ? "#c4453c" : "#8aa4c8"
		})
	] });
}
function Scene() {
	const tap = useGame((s) => s.tapTerritory);
	const emerged = useGame((s) => s.game?.voidcrownEmerged);
	const tint = (0, import_react.useMemo)(() => new Color(emerged ? "#d8b8a8" : "#ffffff"), [emerged]);
	const { gl } = useThree();
	(0, import_react.useEffect)(() => {
		gl.setClearColor("#05060a");
		gl.toneMapping = 4;
		gl.toneMappingExposure = 1.05;
	}, [gl]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lights, { ember: !!emerged }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
			radius: 60,
			depth: 40,
			count: 1800,
			factor: 2.4,
			saturation: 0,
			fade: true,
			speed: .4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { tint })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markers, { onPick: tap }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phenomena, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Links, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bursts, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoidHalos, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			enablePan: false,
			enableDamping: true,
			dampingFactor: .08,
			minDistance: 1.65,
			maxDistance: 5.2,
			autoRotate: true,
			autoRotateSpeed: .18
		})
	] });
}
function Globe() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		className: "h-full w-full touch-none",
		camera: {
			position: [
				.2,
				.45,
				2.7
			],
			fov: 42,
			near: .1,
			far: 200
		},
		dpr: [1, 1.6],
		gl: {
			antialias: true,
			powerPreference: "high-performance",
			alpha: false
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
	});
}
//#endregion
export { Globe as default };
