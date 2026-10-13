import { useEffect, useRef } from "react";
import { MAP_H, MAP_W, SEA_LANES, TERRITORIES, TERRITORY_LIST } from "@/game/map";
import { currentPlayer, legalAttackTargets } from "@/game/engine";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export function WorldMap() {
  const game = useGame((s) => s.game);
  const tap = useGame((s) => s.tapTerritory);
  const focus = useGame((s) => s.focusHazard);
  const wrap = useRef<HTMLDivElement>(null);
  const view = useRef({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; pid: number } | null>(null);
  const svgRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const apply = () => {
      const g = svgRef.current;
      if (!g) return;
      g.setAttribute("transform", `translate(${view.current.x} ${view.current.y}) scale(${view.current.k})`);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const prev = view.current.k;
      const next = Math.min(2.6, Math.max(0.85, prev * (e.deltaY > 0 ? 0.92 : 1.08)));
      const z = next / prev;
      view.current.x = mx - (mx - view.current.x) * z;
      view.current.y = my - (my - view.current.y) * z;
      view.current.k = next;
      apply();
    };
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).dataset.terr) return;
      drag.current = { x: e.clientX, y: e.clientY, vx: view.current.x, vy: view.current.y, pid: e.pointerId };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
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

  return (
    <div ref={wrap} className="relative h-full w-full touch-none overflow-hidden bg-bg">
      <img
        src="/game/map.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        crossOrigin="anonymous"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#08090c_95%)]" />
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="relative h-full w-full">
        <g ref={svgRef}>
          {SEA_LANES.map(([a, b]) => {
            const ta = TERRITORIES[a];
            const tb = TERRITORIES[b];
            return (
              <line
                key={`${a}-${b}`}
                x1={ta.cx}
                y1={ta.cy}
                x2={tb.cx}
                y2={tb.cy}
                className="stroke-border-strong"
                strokeWidth={1.4}
                strokeDasharray="5 5"
              />
            );
          })}
          {TERRITORY_LIST.map((def) => {
            const st = game.territories[def.id];
            const owner = game.players.find((p) => p.id === st.owner);
            const fill = st.owner === "void" ? "#c4453c" : (owner?.color ?? "#2a2d33");
            const selected = game.selected === def.id || game.attackFrom === def.id || game.fortifyFrom === def.id;
            const target = legalSet.has(def.id) || game.attackTo === def.id;
            const mine = st.owner === me.id;
            const voided = st.owner === "void";
            return (
              <g key={def.id}>
                <path
                  d={def.path}
                  data-terr="1"
                  role="button"
                  tabIndex={0}
                  aria-label={`${def.name}, ${st.armies} ejércitos`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    tap(def.id);
                  }}
                  className="cursor-pointer"
                  fill={fill}
                  fillOpacity={st.owner === "wasteland" ? 0.22 : voided ? 0.8 : mine ? 0.72 : 0.5}
                  stroke={selected ? "var(--color-fg)" : target || voided ? "var(--color-danger)" : "var(--color-border-strong)"}
                  strokeWidth={selected ? 2.6 : target ? 2.2 : 1}
                />
                {st.hazard ? (
                  <circle
                    data-terr="1"
                    cx={def.cx + 16}
                    cy={def.cy - 14}
                    r={7}
                    fill="var(--color-danger)"
                    className="cursor-pointer"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      focus(def.id);
                    }}
                  >
                    <title>{`${def.name}: ${st.hazard}`}</title>
                  </circle>
                ) : null}
                <text
                  x={def.cx}
                  y={def.cy - 4}
                  textAnchor="middle"
                  fill="var(--color-fg)"
                  stroke="var(--color-bg)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  style={{ fontFamily: "var(--font-sans)", fontSize: 8, fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  {def.short}
                </text>
                <text
                  x={def.cx}
                  y={def.cy + 10}
                  textAnchor="middle"
                  fill="var(--color-fg)"
                  stroke="var(--color-bg)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
                >
                  {st.armies}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
