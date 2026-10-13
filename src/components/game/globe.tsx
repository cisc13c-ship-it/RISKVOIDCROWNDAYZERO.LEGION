import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { currentPlayer, legalAttackTargets } from "@/game/engine";
import { TERRITORIES, TERRITORY_LIST, latLonToVec3 } from "@/game/map";
import { useGame } from "@/game/store";
import type { TerritoryId } from "@/game/types";

function vec(lat: number, lon: number, r = 1.02) {
  const [x, y, z] = latLonToVec3(lat, lon, r);
  return new THREE.Vector3(x, y, z);
}

function Earth({ tint }: { tint: THREE.Color }) {
  const day = useLoader(THREE.TextureLoader, "/game/earth-day.jpg");
  const night = useLoader(THREE.TextureLoader, "/game/earth-night.jpg");
  const clouds = useLoader(THREE.TextureLoader, "/game/earth-clouds.jpg");
  const cloudRef = useRef<THREE.Mesh>(null);
  useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    day.anisotropy = 8;
    night.anisotropy = 8;
  }, [day, night]);
  useFrame((_, dt) => {
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.012;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={day}
          emissiveMap={night}
          emissive={new THREE.Color("#ffcc88")}
          emissiveIntensity={0.28}
          roughness={0.82}
          metalness={0.04}
          color={tint}
        />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.012, 48, 48]} />
        <meshLambertMaterial map={clouds} transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.045, 32, 32]} />
        <meshBasicMaterial color={tint} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Markers({
  onPick,
}: {
  onPick: (id: TerritoryId) => void;
}) {
  const game = useGame((s) => s.game);
  if (!game) return null;
  const me = currentPlayer(game);
  const legal = new Set(game.attackFrom ? legalAttackTargets(game, game.attackFrom) : []);
  return (
    <group>
      {TERRITORY_LIST.map((def) => {
        const st = game.territories[def.id];
        const owner = game.players.find((p) => p.id === st.owner);
        const color = st.owner === "wasteland" ? "#3a3d44" : st.owner === "void" ? "#c4453c" : (owner?.color ?? "#888");
        const selected = game.selected === def.id || game.attackFrom === def.id || game.fortifyFrom === def.id;
        const target = legal.has(def.id) || game.attackTo === def.id;
        const scarred = game.scars.some((c) => c.territory === def.id);
        const r = 0.018 + Math.min(0.02, st.armies * 0.0016);
        const pos = vec(def.lat, def.lon, 1.02);
        return (
          <group key={def.id} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onPick(def.id);
              }}
              scale={selected ? 1.35 : target ? 1.2 : 1}
            >
              <sphereGeometry args={[r, 12, 12]} />
              <meshBasicMaterial color={target ? "#e8e6e1" : color} />
            </mesh>
            <mesh scale={selected ? 1.8 : 1.45}>
              <sphereGeometry args={[r, 8, 8]} />
              <meshBasicMaterial
                color={scarred ? "#c4453c" : color}
                transparent
                opacity={st.hazard ? 0.38 : 0.16}
                depthWrite={false}
              />
            </mesh>
            {st.owner === me.id ? (
              <mesh>
                <sphereGeometry args={[r * 0.42, 6, 6]} />
                <meshBasicMaterial color="#e8e6e1" />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function Links() {
  const game = useGame((s) => s.game);
  const geom = useMemo(() => {
    if (!game?.attackFrom) return null;
    const from = TERRITORIES[game.attackFrom];
    const a = vec(from.lat, from.lon, 1.03);
    const pts: number[] = [];
    for (const nid of from.neighbors) {
      const to = TERRITORIES[nid];
      const b = vec(to.lat, to.lon, 1.03);
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [game?.attackFrom]);
  if (!geom) return null;
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#c8ccd4" transparent opacity={0.45} />
    </lineSegments>
  );
}

function Bursts() {
  const disaster = useGame((s) => s.game?.lastDisaster);
  const day = useGame((s) => s.game?.day);
  const group = useRef<THREE.Group>(null);
  const bits = useRef<{ p: THREE.Vector3; v: THREE.Vector3; life: number; mesh: THREE.Mesh }[]>([]);
  useEffect(() => {
    if (!disaster || !group.current) return;
    bits.current.forEach((b) => {
      group.current?.remove(b.mesh);
      b.mesh.geometry.dispose();
      (b.mesh.material as THREE.Material).dispose();
    });
    bits.current = [];
    for (const hit of disaster.hits) {
      const t = TERRITORIES[hit.id];
      if (!t) continue;
      const origin = vec(t.lat, t.lon, 1.04);
      for (let i = 0; i < 18; i++) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.012, 6, 6),
          new THREE.MeshBasicMaterial({ color: disaster.kind === "nuclear" ? "#ff6a3a" : "#e8c9a0" }),
        );
        mesh.position.copy(origin);
        group.current.add(mesh);
        const dir = origin.clone().normalize().add(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.8)).normalize();
        bits.current.push({ p: origin.clone(), v: dir.multiplyScalar(0.35 + Math.random() * 0.4), life: 1, mesh });
      }
    }
  }, [disaster, day]);
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    bits.current = bits.current.filter((b) => {
      b.life -= d * 0.9;
      b.p.addScaledVector(b.v, d);
      b.mesh.position.copy(b.p);
      b.mesh.scale.setScalar(Math.max(0.01, b.life));
      (b.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, b.life);
      (b.mesh.material as THREE.MeshBasicMaterial).transparent = true;
      if (b.life <= 0) {
        group.current?.remove(b.mesh);
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
  });
  return <group ref={group} />;
}

function Phenomena() {
  const game = useGame((s) => s.game);
  const focus = useGame((s) => s.focusHazard);
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 3.2) * 0.22;
    if (!group.current) return;
    group.current.children.forEach((child) => {
      child.scale.setScalar(pulse);
    });
  });
  if (!game) return null;
  const hot = TERRITORY_LIST.filter((d) => game.territories[d.id]?.hazard);
  if (!hot.length) return null;
  return (
    <group ref={group}>
      {hot.map((def) => {
        const kind = game.territories[def.id].hazard;
        const color =
          kind === "nuclear" || kind === "incendio" || kind === "volcan"
            ? "#ff6a3a"
            : kind === "tsunami" || kind === "tormenta"
              ? "#7eb8c9"
              : kind === "pandemia"
                ? "#9aaf6a"
                : "#e8c9a0";
        return (
          <mesh
            key={def.id}
            position={vec(def.lat, def.lon, 1.07)}
            onClick={(e) => {
              e.stopPropagation();
              focus(def.id);
            }}
          >
            <octahedronGeometry args={[0.028, 0]} />
            <meshBasicMaterial color={color} transparent opacity={0.92} />
          </mesh>
        );
      })}
    </group>
  );
}

function VoidHalos() {
  const game = useGame((s) => s.game);
  const meshes = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.16;
    for (const m of meshes.current) {
      if (m) m.scale.setScalar(pulse);
    }
  });
  const voids = TERRITORY_LIST.filter((d) => game?.territories[d.id]?.owner === "void");
  if (!game?.voidcrownEmerged || !voids.length) return null;
  return (
    <group>
      {voids.map((def, i) => (
        <mesh
          key={def.id}
          position={vec(def.lat, def.lon, 1.028)}
          ref={(node) => {
            if (node) meshes.current[i] = node;
          }}
        >
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshBasicMaterial color="#c4453c" transparent opacity={0.32} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Lights({ ember }: { ember: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.03;
    if (sun.current) sun.current.position.set(Math.cos(t) * 6, 2.2, Math.sin(t) * 6);
  });
  return (
    <>
      <ambientLight intensity={ember ? 0.28 : 0.42} color={ember ? "#3a2018" : "#223044"} />
      <directionalLight ref={sun} intensity={ember ? 1.35 : 1.7} color="#fff5e8" position={[5, 2.2, 3]} />
      <pointLight position={[-3, 1, -2]} intensity={ember ? 0.55 : 0.35} color={ember ? "#c4453c" : "#8aa4c8"} />
    </>
  );
}

function Scene() {
  const tap = useGame((s) => s.tapTerritory);
  const emerged = useGame((s) => s.game?.voidcrownEmerged);
  const tint = useMemo(() => new THREE.Color(emerged ? "#d8b8a8" : "#ffffff"), [emerged]);
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor("#05060a");
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
  }, [gl]);
  return (
    <>
      <Lights ember={!!emerged} />
      <Stars radius={60} depth={40} count={1800} factor={2.4} saturation={0} fade speed={0.4} />
      <Suspense fallback={null}>
        <Earth tint={tint} />
      </Suspense>
      <Markers onPick={tap} />
      <Phenomena />
      <Links />
      <Bursts />
      <VoidHalos />
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.65}
        maxDistance={5.2}
        autoRotate
        autoRotateSpeed={0.18}
      />
    </>
  );
}

export default function Globe() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0.2, 0.45, 2.7], fov: 42, near: 0.1, far: 200 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
    >
      <Scene />
    </Canvas>
  );
}
