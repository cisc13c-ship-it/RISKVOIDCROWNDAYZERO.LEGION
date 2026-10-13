import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cineHit, setCineMood, silenceSpeech, speakLine, stopCineBed, unlockAudio } from "@/game/audio";
import { CINE_END_MS, SCENES, progressOf, sceneAt } from "@/game/cinematic";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export function Cinematic() {
  const finish = useGame((s) => s.finishCinematic);
  const muted = useGame((s) => s.settings.muted);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const acc = useRef(0);
  const last = useRef(0);
  const lastId = useRef<string | null>(null);
  const voice = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!started || paused) {
      voice.current?.pause();
      return;
    }
    let raf = 0;
    last.current = performance.now();
    const tick = (now: number) => {
      acc.current += now - last.current;
      last.current = now;
      if (acc.current >= CINE_END_MS) {
        setT(CINE_END_MS);
        stopCineBed();
        silenceSpeech();
        voice.current?.pause();
        finish(false);
        return;
      }
      setT(acc.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, paused, finish]);

  const scene = sceneAt(t);

  useEffect(() => {
    if (!started) return;
    if (lastId.current === scene.id) return;
    lastId.current = scene.id;
    setCineMood(scene.mood);
    if (scene.id === "teoria" || scene.id === "grieta") cineHit();
    if (muted) return;
    const audio = voice.current;
    if (audio && scene.audio) {
      audio.src = scene.audio;
      audio.currentTime = 0;
      void audio.play().catch(() => speakLine(scene.sub));
    } else {
      speakLine(scene.sub);
    }
  }, [scene.id, started, muted, scene.audio, scene.sub, scene.mood]);

  useEffect(() => () => {
    voice.current?.pause();
    stopCineBed();
    silenceSpeech();
  }, []);

  const begin = () => {
    unlockAudio();
    setStarted(true);
    last.current = performance.now();
  };

  const skip = () => {
    voice.current?.pause();
    stopCineBed();
    silenceSpeech();
    finish(true);
  };

  return (
    <div className="relative h-dvh overflow-hidden bg-bg text-fg">
      <img
        src={scene.image}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          scene.glitch ? "cine-frame contrast-125 saturate-50" : "cine-frame",
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#08090cf0_0%,#08090c40_42%,#08090cf5_100%)]" />
      <div className="cine-scan pointer-events-none absolute inset-0" />
      <div className="cine-noise pointer-events-none absolute inset-0" />
      <div className="cine-vignette pointer-events-none absolute inset-0" />
      {scene.glitch ? <div className="cine-glitch pointer-events-none absolute inset-0" /> : null}
      <audio ref={voice} preload="auto" />

      {!started ? (
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="font-display text-xs tracking-[0.32em] text-muted uppercase">El Viejo · transmisión rota</p>
          <h1 className="font-display text-5xl uppercase sm:text-6xl">Voidcrown</h1>
          <p className="max-w-md text-sm text-muted">
            Un bandido de Santa Cristina va a recordar a Flacko, a LEGIÓN y al caos que les contestó. Toca. La voz entra con el gesto.
          </p>
          <Button size="lg" className="min-w-48 font-display uppercase tracking-[0.16em]" onClick={begin}>
            Oír al Viejo
          </Button>
          <button
            type="button"
            className="min-h-11 text-xs uppercase tracking-[0.16em] text-muted"
            onClick={skip}
          >
            Entrar al mapa
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
          <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
            <p className="font-display text-xs tracking-[0.22em] text-muted uppercase">{scene.year}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="min-h-11 rounded-[var(--radius-md)] border border-border bg-surface/80 px-3 text-xs uppercase tracking-[0.14em]"
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? "Seguir" : "Pausa"}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-[var(--radius-md)] border border-border bg-surface/80 px-3 text-xs uppercase tracking-[0.14em]"
                onClick={skip}
              >
                Saltar
              </button>
            </div>
          </header>
          <div className="mx-auto mb-3 w-full max-w-2xl">
            <p className="text-xs tracking-[0.2em] text-muted uppercase">{scene.kicker}</p>
            <h2 className="mt-1 font-display text-3xl uppercase text-balance sm:text-4xl">{scene.line}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{scene.sub}</p>
          </div>
          <div className="mx-auto h-0.5 w-full max-w-2xl overflow-hidden rounded-full bg-elevated">
            <div className="h-full bg-accent" style={{ width: `${progressOf(t) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
