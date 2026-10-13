import { lazy, Suspense, useEffect, useState } from "react";
import { WorldMap } from "@/components/game/world-map";
import { useGame } from "@/game/store";

const Globe = lazy(() => import("@/components/game/globe"));

export function Board() {
  const view = useGame((s) => s.settings.mapView);
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  if (view === "tactical") return <WorldMap />;
  if (!client) return <div className="h-full w-full bg-bg" />;
  return (
    <Suspense fallback={<div className="h-full w-full bg-bg" />}>
      <Globe />
    </Suspense>
  );
}
