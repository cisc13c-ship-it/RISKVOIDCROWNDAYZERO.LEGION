import { Cinematic } from "@/components/game/cinematic";
import { HowTo } from "@/components/game/how-to";
import { PlayScreen } from "@/components/game/play-screen";
import { TitleScreen } from "@/components/game/title-screen";
import { setMuted, unlockAudio } from "@/game/audio";
import { shouldForceIntro } from "@/game/cinematic";
import { loadIntro } from "@/game/cinematic-save";
import { loadGame, loadSettings } from "@/game/save";
import { useGame } from "@/game/store";
import { useEffect, useState } from "react";

export function AppShell() {
  const screen = useGame((s) => s.screen);
  const muted = useGame((s) => s.settings.muted);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    const intro = loadIntro();
    useGame.setState({
      hasSave: !!loadGame(),
      settings,
      screen: shouldForceIntro(intro) ? "cinematic" : "title",
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

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  if (!ready) return <div className="h-dvh bg-bg" />;
  if (screen === "cinematic") return <Cinematic />;
  if (screen === "how") return <HowTo />;
  if (screen === "play") return <PlayScreen />;
  return <TitleScreen />;
}
