import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { STYLES, timestampForBar, totalBars } from "@/lib/catalog";
import { useTrack } from "@/lib/store";
import type { SectionKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FILL: Record<SectionKind, string> = {
  intro: "bg-section-intro",
  break: "bg-section-break",
  build: "bg-section-build",
  drop: "bg-section-drop",
  outro: "bg-section-outro",
};

export function Timeline() {
  const session = useTrack((s) => s.session);
  const setBar = useTrack((s) => s.setBar);
  const profile = STYLES[session.style];
  const total = totalBars(session.style);
  const playPct = ((session.bar + 0.5) / total) * 100;
  const clamped = Math.min(session.bar, total - 1);

  function jump(delta: number) {
    setBar(Math.max(0, Math.min(total - 1, session.bar + delta)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Arrangement
          </p>
          <p className="font-display text-2xl tracking-wide text-foreground">
            {profile.name}
            <span className="ml-2 text-lg text-muted">{session.bpm} BPM</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs tabular-nums text-muted">
            {timestampForBar(session.bpm, clamped)} · bar {clamped + 1}/{total}
          </p>
          <div className="flex">
            <Button size="icon" variant="ghost" onClick={() => jump(-8)} aria-label="Back 8 bars">
              <ChevronsLeft className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => jump(-1)} aria-label="Back 1 bar">
              <ChevronLeft className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => jump(1)} aria-label="Forward 1 bar">
              <ChevronRight className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => jump(8)} aria-label="Forward 8 bars">
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 sm:hidden">
        {profile.arrangement.map((sec) => {
          const active = clamped >= sec.startBar && clamped < sec.startBar + sec.bars;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setBar(sec.startBar)}
              className={cn(
                "flex h-12 items-center justify-between rounded-md px-3 text-left",
                FILL[sec.kind],
                active ? "opacity-100 shadow-border" : "opacity-70",
              )}
            >
              <span className="font-display text-base tracking-wide">{sec.label}</span>
              <span className="font-mono text-xs tabular-nums text-muted">
                bar {sec.startBar + 1} · {sec.bars}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative hidden overflow-x-auto pb-1 sm:block">
        <div className="relative min-w-[640px]">
          <div className="flex h-16 overflow-hidden rounded-lg shadow-border">
            {profile.arrangement.map((sec) => {
              const active = clamped >= sec.startBar && clamped < sec.startBar + sec.bars;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setBar(sec.startBar)}
                  style={{ flexGrow: sec.bars, flexBasis: 0 }}
                  className={cn(
                    "relative flex min-w-0 flex-col items-start justify-between px-2 py-1.5 text-left transition-opacity duration-150",
                    FILL[sec.kind],
                    active ? "opacity-100" : "opacity-70 hover:opacity-90",
                  )}
                >
                  <span className="w-full truncate font-display text-sm tracking-wide text-foreground">
                    {sec.label}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {sec.bars} bars
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="pointer-events-none absolute top-0 z-10 h-16 w-px bg-primary"
            style={{ left: `${playPct}%` }}
          >
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary" />
          </div>

          <div className="mt-2 flex">
            {profile.arrangement.map((sec) => {
              const cells = Math.max(1, Math.round(sec.bars / 8));
              return (
                <div
                  key={`cells-${sec.id}`}
                  className="flex"
                  style={{ flexGrow: sec.bars, flexBasis: 0 }}
                >
                  {Array.from({ length: cells }).map((_, i) => {
                    const bar = sec.startBar + i * 8;
                    const on = clamped >= bar && clamped < bar + 8;
                    return (
                      <button
                        key={bar}
                        type="button"
                        onClick={() => setBar(bar)}
                        className={cn(
                          "h-8 min-w-0 flex-1 border-r border-border text-xs font-mono tabular-nums text-subtle last:border-r-0",
                          on
                            ? "bg-surface-3 text-foreground"
                            : "bg-transparent hover:bg-surface-2 hover:text-muted",
                        )}
                      >
                        {bar + 1}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
