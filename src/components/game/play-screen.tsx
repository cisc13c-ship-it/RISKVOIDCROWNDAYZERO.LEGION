import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2, Map as MapIcon, Volume2, VolumeX, X } from "lucide-react";
import { Board } from "@/components/game/board";
import { ChronicleButton, ChroniclePanel } from "@/components/game/chronicle";
import { DiceFace } from "@/components/game/dice";
import { Button } from "@/components/ui/button";
import { canTrade, canZeroDay, currentPlayer, ownedIds } from "@/game/engine";
import { CONTINENTS, TERRITORIES } from "@/game/map";
import { CHAPTERS } from "@/game/lore";
import { livingStats, memoryBundle } from "@/game/living";
import { useGame } from "@/game/store";

const PHASE: Record<string, string> = {
  reinforce: "Refuerzo",
  attack: "Ataque",
  fortify: "Fortificar",
  transfer: "Ocupar",
  ai: "Turno rival",
  event: "Desastre",
  over: "Fin",
};

export function PlayScreen() {
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

  const [moveN, setMoveN] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const prevCh = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const cur = useGame.getState().shake;
      if (cur > 0.002) useGame.setState({ shake: cur * 0.86 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const me = game ? currentPlayer(game) : null;
  const human = game ? game.players.find((p) => p.id === game.humanId) : null;
  const mine = game && human ? ownedIds(game, human.id).length : 0;

  useEffect(() => {
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

  useEffect(() => {
    if (!game) return;
    if (game.phase === "transfer") setMoveN(game.pendingTransferMax);
    if (game.phase === "fortify" && game.fortifyFrom && game.selected && game.fortifyFrom !== game.selected) {
      setMoveN(Math.max(1, game.territories[game.fortifyFrom].armies - 1));
    }
  }, [game?.phase, game?.attackTo, game?.fortifyFrom, game?.selected, game]);

  const continentsHeld = useMemo(() => {
    if (!game || !human) return [];
    return CONTINENTS.filter((c) => c.members.every((id) => game.territories[id].owner === human.id));
  }, [game, human]);

  if (!game || !me || !human) return null;

  const ox = (Math.random() - 0.5) * shake * shake * 14;
  const oy = (Math.random() - 0.5) * shake * shake * 10;
  const fighting = !!(game.attackFrom && game.attackTo && (game.phase === "attack" || game.phase === "ai"));
  const transferring = game.phase === "transfer" && game.attackFrom && game.attackTo;
  const fortifying =
    game.phase === "fortify" && game.fortifyFrom && game.selected && game.fortifyFrom !== game.selected;
  const mustTrade = me.isHuman && game.phase === "reinforce" && me.cards.length >= 5 && canTrade(me.cards);
  const stats = livingStats(game);
  const node = game.selected ? game.living.biota[game.selected] : null;
  const ownsSelected = !!(game.selected && game.territories[game.selected].owner === human.id);
  const canProbe = me.isHuman && (game.phase === "reinforce" || game.phase === "attack" || game.phase === "fortify") && !fighting;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ transform: `translate(${ox}px, ${oy}px)` }}
      >
        <header className="relative z-20 flex items-start justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface/90 px-3 py-2">
            <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">
              Día {game.day} · {PHASE[game.phase]}
            </p>
            <p className="text-sm tabular-nums">
              {me.name}
              {game.phase === "reinforce" ? ` · ${game.armiesToPlace} por colocar` : ""}
              {aiBusy ? " · pensando" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <ChronicleButton count={game.chronicle.length} onClick={openChronicle} />
            <button
              type="button"
              onClick={() => setMapView(mapView === "globe" ? "tactical" : "globe")}
              className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90"
              aria-label={mapView === "globe" ? "Vista táctica" : "Vista globo"}
            >
              {mapView === "globe" ? <MapIcon className="size-4" /> : <Globe2 className="size-4" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90"
              aria-label="Sonido"
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <button
              type="button"
              onClick={toTitle}
              className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90"
              aria-label="Salir"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {game.living.warning ? (
          <div className="relative z-20 mx-4 mt-2 rounded-[var(--radius-md)] border border-danger/50 bg-danger/15 px-3 py-2 text-xs leading-snug">
            {game.living.warning}
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1">
          <Board />
          {game.selected ? (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-[var(--radius-md)] border border-border bg-surface/90 px-3 py-1.5 text-xs">
              {TERRITORIES[game.selected].name}
              <span className="ml-2 tabular-nums text-muted">{game.territories[game.selected].armies}</span>
              {node ? (
                <span className="ml-2 tabular-nums text-muted">
                  biota {node.pop} · esp {node.spores}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="pointer-events-none absolute bottom-28 left-4 hidden w-56 flex-col gap-2 md:flex">
          <div className="pointer-events-auto rounded-[var(--radius-lg)] border border-border bg-surface/90 p-3">
            <p className="text-xs text-muted">Tu mando</p>
            <p className="tabular-nums text-sm">
              {mine} territorios · {human.cards.length} cartas
            </p>
            {continentsHeld.length ? (
              <p className="mt-1 text-xs text-muted">{continentsHeld.map((c) => c.name).join(" · ")}</p>
            ) : null}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full bg-danger"
                style={{ width: `${Math.min(100, game.voidcrown)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] tracking-[0.14em] text-muted uppercase">
              {game.voidcrownEmerged ? "Voidcrown" : game.riftOpened ? "Grieta" : "Singularidad"} {game.voidcrown}
            </p>
            <p className="mt-2 border-t border-border pt-2 text-[11px] tabular-nums">
              Biota {stats.pop} · Cicatrices {stats.scars} · Gen {stats.gen}
            </p>
            <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
              {stats.doctrine} · partidas {stats.games}/20 · sondas {stats.probes}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-muted">{game.living.retentionNote}</p>
          </div>
          <div className="pointer-events-auto rounded-[var(--radius-lg)] border border-border bg-surface/90 p-3">
            <p className="text-[10px] tracking-[0.16em] text-muted uppercase">Edai</p>
            <p className="mt-1 text-xs">{game.edai.dec}</p>
            <p className="mt-1 text-[11px] text-muted">{game.edai.reason}</p>
            {game.cel ? (
              <p className="mt-2 border-t border-border pt-2 text-[11px] text-muted">
                CEL · {game.cel.observation}
              </p>
            ) : null}
          </div>
          <div className="pointer-events-auto max-h-36 overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface/90 p-3 text-xs text-muted">
            {game.log.slice(0, 6).map((l, i) => (
              <p key={`${l}-${i}`} className="mb-1 last:mb-0">
                {l}
              </p>
            ))}
          </div>
        </aside>

        <div className="z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            <div className="flex flex-wrap gap-2 text-xs text-muted md:hidden">
              <span className="tabular-nums">{mine} territorios</span>
              <span className="tabular-nums">Biota {stats.pop}</span>
              <span className="tabular-nums">Cic {stats.scars}</span>
              <span className="tabular-nums">Gen {stats.gen}</span>
              <span>{stats.doctrine}</span>
            </div>
            {canProbe && game.selected ? (
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => probe("survey")}>
                  Sondear
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => probe("sample")}>
                  Muestra
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => probe("seed")} disabled={!ownsSelected}>
                  Sembrar
                </Button>
              </div>
            ) : null}
            {me.isHuman && game.phase === "reinforce" ? (
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={trade} disabled={!canTrade(me.cards)}>
                  Canjear set
                </Button>
                <Button variant="secondary" className="flex-1" onClick={placeAll} disabled={!game.selected || game.armiesToPlace < 1}>
                  Dejar resto aquí
                </Button>
                <Button className="flex-1" onClick={goAttack} disabled={game.armiesToPlace > 0 || mustTrade}>
                  Atacar
                </Button>
              </div>
            ) : null}
            {me.isHuman && game.phase === "attack" && !fighting ? (
              <div className="flex gap-2">
                <p className="flex-1 self-center text-sm text-muted">
                  Elige origen (2+) y un vecino enemigo.
                </p>
                {canZeroDay(game) ? (
                  <Button variant="danger" onClick={zeroDay}>
                    Día Zero
                  </Button>
                ) : null}
                <Button variant="secondary" onClick={goFortify}>
                  Fortificar
                </Button>
              </div>
            ) : null}
            {me.isHuman && game.phase === "fortify" && !fortifying ? (
              <div className="flex gap-2">
                <p className="flex-1 self-center text-sm text-muted">Mueve una vez entre tuyos, o pasa.</p>
                <Button onClick={skipMove}>Terminar turno</Button>
              </div>
            ) : null}
            {aiBusy || (!me.isHuman && game.phase !== "event" && game.phase !== "over") ? (
              <p className="text-sm text-muted">{me.name} mueve.</p>
            ) : null}
          </div>
        </div>
      </div>

      {fighting ? (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-4 shadow-lg">
            <p className="font-display text-lg uppercase">Combate</p>
            <p className="text-sm text-muted">
              {TERRITORIES[game.attackFrom!].name} ({game.territories[game.attackFrom!].armies}) →{" "}
              {TERRITORIES[game.attackTo!].name} ({game.territories[game.attackTo!].armies})
            </p>
            {game.lastCombat ? (
              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="flex gap-1">
                  {game.lastCombat.attackDice.map((d, i) => (
                    <DiceFace key={`a${i}`} value={d} tone="atk" />
                  ))}
                </div>
                <span className="text-xs text-muted">vs</span>
                <div className="flex gap-1">
                  {game.lastCombat.defendDice.map((d, i) => (
                    <DiceFace key={`d${i}`} value={d} tone="def" />
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Tira los dados.</p>
            )}
            {me.isHuman ? (
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={roll}>
                  Tirar
                </Button>
                <Button variant="secondary" className="flex-1" onClick={blitz}>
                  Blitz
                </Button>
                <Button variant="ghost" onClick={retreat}>
                  Retirada
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {transferring && me.isHuman ? (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-4">
            <p className="font-display text-lg uppercase">Ocupar</p>
            <p className="text-sm text-muted">Mueve ejércitos a {TERRITORIES[game.attackTo!].name}.</p>
            <input
              type="range"
              min={game.pendingTransferMin}
              max={game.pendingTransferMax}
              value={moveN}
              onChange={(e) => setMoveN(Number(e.target.value))}
              className="mt-4 w-full"
            />
            <p className="tabular-nums text-sm">{moveN}</p>
            <Button className="mt-3 w-full" onClick={() => transfer(moveN)}>
              Confirmar
            </Button>
          </div>
        </div>
      ) : null}

      {fortifying && me.isHuman ? (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-4">
            <p className="font-display text-lg uppercase">Fortificar</p>
            <p className="text-sm text-muted">
              {TERRITORIES[game.fortifyFrom!].name} → {TERRITORIES[game.selected!].name}
            </p>
            <input
              type="range"
              min={1}
              max={Math.max(1, game.territories[game.fortifyFrom!].armies - 1)}
              value={moveN}
              onChange={(e) => setMoveN(Number(e.target.value))}
              className="mt-4 w-full"
            />
            <p className="tabular-nums text-sm">{moveN}</p>
            <div className="mt-3 flex gap-2">
              <Button className="flex-1" onClick={() => doFortify(moveN)}>
                Mover y pasar
              </Button>
              <Button variant="secondary" onClick={clearPick}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {game.phase === "event" && game.lastDisaster ? (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            <img
              src={game.lastDisaster.image}
              alt=""
              className="h-40 w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="p-4">
              <p className="text-xs tracking-[0.2em] text-muted uppercase">Día {game.day}</p>
              <h2 className="font-display text-2xl uppercase">{game.lastDisaster.name}</h2>
              <p className="mt-1 text-sm text-muted">{game.lastDisaster.flavor}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {game.lastDisaster.hits.map((h) => (
                  <li key={h.id} className="tabular-nums">
                    {TERRITORIES[h.id].name}
                    <span className="text-muted"> −{h.killed}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full" onClick={dismiss}>
                Continuar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-40 flex justify-center px-4">
          <p className="rounded-[var(--radius-md)] border border-border bg-surface/95 px-4 py-2 font-display text-sm uppercase">
            Crónica: {toast}
          </p>
        </div>
      ) : null}

      {game.voidcrownJustEmerged ? (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-bg/80 p-4">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-danger/50 bg-surface p-6 text-center shadow-lg">
            <p className="text-xs tracking-[0.22em] text-danger uppercase">La historia se rompió</p>
            <h2 className="mt-2 font-display text-3xl uppercase">Voidcrown ha emergido</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Las grietas se abrieron. Algo del vacío reclama territorios. No negocia. No se rinde. Consume.
            </p>
            <Button className="mt-6 w-full" variant="danger" onClick={dismissVoid}>
              Enfrentarlo
            </Button>
          </div>
        </div>
      ) : null}

      {chronicleOpen ? <ChroniclePanel game={game} onClose={closeChronicle} /> : null}

      {game.phase === "over" ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg/80 p-4">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center">
            <p className="text-xs tracking-[0.22em] text-muted uppercase">
              {game.winner === game.humanId ? "Legado consolidado" : "El vacío ganó"}
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase">
              {game.winner === game.humanId
                ? game.voidcrownEmerged
                  ? "Voidcrown retrocede"
                  : "Dominio total"
                : "Derrota"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {game.winner === game.humanId
                ? game.voidcrownEmerged
                  ? "El mapa respira de nuevo. Tu nombre queda en la historia."
                  : "El mapa queda bajo tu mando."
                : (game.loseReason ?? "Otra facción cierra el ciclo.")}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-[var(--radius-md)] border border-border bg-elevated px-2 py-3">
                <p className="font-display text-xl tabular-nums">{game.day}</p>
                <p className="text-[10px] tracking-[0.14em] text-muted uppercase">Días</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border bg-elevated px-2 py-3">
                <p className="font-display text-xl tabular-nums">{game.captures}</p>
                <p className="text-[10px] tracking-[0.14em] text-muted uppercase">Conquistas</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border bg-elevated px-2 py-3">
                <p className="font-display text-xl tabular-nums">{Math.max(0, game.realities.length - 1)}</p>
                <p className="text-[10px] tracking-[0.14em] text-muted uppercase">Grietas</p>
              </div>
            </div>
            <Button className="mt-6 w-full" onClick={toTitle}>
              Volver al comando
            </Button>
            <Button
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => {
                const blob = new Blob([JSON.stringify(memoryBundle(game))], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `voidcrown-memoria-gen${stats.gen}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Guardar memoria
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
