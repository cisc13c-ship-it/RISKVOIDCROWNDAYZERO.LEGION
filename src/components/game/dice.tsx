import { cn } from "@/lib/utils";

function pips(n: number) {
  const map: Record<number, string[]> = {
    1: ["c"],
    2: ["tl", "br"],
    3: ["tl", "c", "br"],
    4: ["tl", "tr", "bl", "br"],
    5: ["tl", "tr", "c", "bl", "br"],
    6: ["tl", "tr", "ml", "mr", "bl", "br"],
  };
  return map[n] ?? [];
}

const pos: Record<string, string> = {
  tl: "left-1 top-1",
  tr: "right-1 top-1",
  ml: "left-1 top-1/2 -translate-y-1/2",
  mr: "right-1 top-1/2 -translate-y-1/2",
  bl: "left-1 bottom-1",
  br: "right-1 bottom-1",
  c: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

export function DiceFace({ value, tone }: { value: number; tone: "atk" | "def" }) {
  return (
    <div
      className={cn(
        "relative size-10 rounded-[var(--radius-sm)] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        tone === "atk" ? "border-border-strong bg-elevated" : "border-border bg-surface",
      )}
    >
      {pips(value).map((p) => (
        <span
          key={p}
          className={cn(
            "absolute size-1.5 rounded-full",
            tone === "atk" ? "bg-fg" : "bg-muted",
            pos[p],
          )}
        />
      ))}
    </div>
  );
}
