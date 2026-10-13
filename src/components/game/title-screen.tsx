import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FACTIONS } from "@/game/factions";
import { importMemoryBundle } from "@/game/living";
import { unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import type { Difficulty, FactionId, Scenario } from "@/game/types";
import { cn } from "@/lib/utils";

export function TitleScreen() {
  const start = useGame((s) => s.start);
  const resume = useGame((s) => s.resume);
  const toHow = useGame((s) => s.toHow);
  const replayCinematic = useGame((s) => s.replayCinematic);
  const hasSave = useGame((s) => s.hasSave);
  const muted = useGame((s) => s.settings.muted);
  const toggleMute = useGame((s) => s.toggleMute);
  const [faction, setFaction] = useState<FactionId>("ceniza");
  const [opponents, setOpponents] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty>("veterano");
  const [scenario, setScenario] = useState<Scenario>("standard");
  const [memNote, setMemNote] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-fg">
      <img
        src="/game/menu.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#08090ccc_0%,#08090c88_40%,#08090cf2_100%)]" />
      <header className="relative z-10 flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">Comando global</p>
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            toggleMute();
          }}
          className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/80"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </header>
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-end gap-6 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10">
        <div>
          <p className="font-display text-sm tracking-[0.28em] text-muted uppercase">Operación</p>
          <h1 className="mt-1 font-display text-5xl leading-[0.95] tracking-[var(--tracking-display)] text-balance uppercase sm:text-6xl">
            Risk Día Zero
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted text-pretty">
            El mapa se parte el primer día. Toma territorios, tira los dados y aguanta los desastres.
            La historia se abre al jugarla. Si se rompe, nace una grieta. Voidcrown no se elige: emerge.
          </p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border bg-surface/90 p-4">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Facción</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {FACTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFaction(f.id)}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2 text-left transition-colors duration-[var(--motion-quick)]",
                  faction === f.id ? "border-border-strong bg-elevated" : "border-border bg-bg/40",
                )}
              >
                <span className="size-3 shrink-0 rounded-full" style={{ background: f.color }} />
                <span>
                  <span className="block text-sm font-medium">{f.name}</span>
                  <span className="block text-[11px] text-muted">{f.doctrine}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted">Rivales</span>
              <select
                value={opponents}
                onChange={(e) => setOpponents(Number(e.target.value))}
                className="mt-1 h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm"
              >
                <option value={1}>1 IA</option>
                <option value={2}>2 IA</option>
                <option value={3}>3 IA</option>
                <option value={4}>4 IA</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-muted">Dificultad</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-1 h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm"
              >
                <option value="recruta">Recluta</option>
                <option value="veterano">Veterano</option>
                <option value="diazero">Leyenda</option>
              </select>
            </label>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setScenario("standard")}
              className={cn(
                "min-h-11 rounded-[var(--radius-md)] border px-3 text-sm",
                scenario === "standard" ? "border-border-strong bg-elevated" : "border-border bg-bg/40",
              )}
            >
              Risk
            </button>
            <button
              type="button"
              onClick={() => setScenario("rift")}
              className={cn(
                "min-h-11 rounded-[var(--radius-md)] border px-3 text-sm",
                scenario === "rift" ? "border-border-strong bg-elevated" : "border-border bg-bg/40",
              )}
            >
              Grieta
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full font-display tracking-[0.14em] uppercase"
            onClick={() => start({ faction, opponents, difficulty, scenario })}
          >
            Entrar al mapa
          </Button>
          {hasSave ? (
            <Button size="lg" variant="secondary" className="w-full" onClick={resume}>
              Continuar partida
            </Button>
          ) : null}
          <Button variant="ghost" className="w-full" onClick={toHow}>
            Cómo se juega
          </Button>
          <Button variant="ghost" className="w-full" onClick={replayCinematic}>
            Ver introducción
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              window.location.href = "/voidcrown/VOIDCROWN_BUILD_UNICO.html";
            }}
          >
            Tierra · build único
          </Button>
          <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-md)] text-sm text-muted">
            Cargar memoria
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(e) => {
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
              }}
            />
          </label>
          {memNote ? <p className="text-center text-xs text-muted">{memNote}</p> : null}
        </div>
      </div>
    </div>
  );
}
