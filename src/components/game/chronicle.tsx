import { BookOpen, X } from "lucide-react";
import { CHAPTERS, openedChapters } from "@/game/lore";
import type { GameState } from "@/game/types";

export function ChroniclePanel({
  game,
  onClose,
}: {
  game: GameState;
  onClose: () => void;
}) {
  const chapters = openedChapters(game);
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/70 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:items-center">
      <div className="max-h-[min(36rem,88dvh)] w-full max-w-lg overflow-y-auto rounded-[var(--radius-xl)] border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xs tracking-[0.22em] text-muted uppercase">Crónica</p>
            <h2 className="mt-1 font-display text-2xl uppercase">La historia jugada</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border"
            aria-label="Cerrar crónica"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          {chapters.length} de {CHAPTERS.length} capítulos. Se abren con lo que haces, no con un menú.
        </p>
        <ol className="mt-4 space-y-4">
          {chapters.map((ch) => (
            <li key={ch.id} className="border-l-2 border-accent pl-3">
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{ch.kicker}</p>
              <p className="font-display text-lg uppercase">{ch.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{ch.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ChronicleButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface/90"
      aria-label="Crónica"
    >
      <BookOpen className="size-4" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-accent px-1 text-[10px] leading-4 text-white tabular-nums">
          {count}
        </span>
      ) : null}
    </button>
  );
}
