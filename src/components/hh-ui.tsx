import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Severity } from "@/lib/hh/analysis";
import type { HhGenreId } from "@/lib/hh/genres";
import { useLanes } from "@/lib/hh/store";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/site-ui";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl bg-surface p-4 shadow-border sm:p-5", className)}>{children}</div>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-widest text-muted">{children}</p>;
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("font-display text-xl tracking-wide text-foreground sm:text-2xl", className)}>{children}</h2>;
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-base font-semibold text-foreground", className)}>{children}</h3>;
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-lg bg-surface-2 p-3">
      <p className="text-xs uppercase tracking-widest text-subtle">{label}</p>
      <p className="font-mono mt-1 text-lg tabular-nums text-foreground">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export const SEV: Record<Severity, { label: string; cls: string; dot: string }> = {
  fix: { label: "Fix", cls: "bg-bad/15 text-bad", dot: "bg-bad" },
  check: { label: "Check", cls: "bg-warn/15 text-warn", dot: "bg-warn" },
  good: { label: "Good", cls: "bg-ok/15 text-ok", dot: "bg-ok" },
};

export function Sev({ s }: { s: Severity }) {
  const v = SEV[s];
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-xs font-semibold", v.cls)}>
      <span className={cn("size-1.5 rounded-full", v.dot)} />
      {v.label}
    </span>
  );
}

export function LaneChips({
  value,
  onChange,
  allowAuto,
}: {
  value: HhGenreId | "auto";
  onChange: (g: HhGenreId | "auto") => void;
  allowAuto?: boolean;
}) {
  const lanes = useLanes();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {allowAuto ? (
        <Chip active={value === "auto"} onClick={() => onChange("auto")}>
          Auto
        </Chip>
      ) : null}
      {lanes.map((g) => (
        <Chip key={g.id} active={value === g.id} onClick={() => onChange(g.id)}>
          {g.label}
        </Chip>
      ))}
    </div>
  );
}

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          })
          .catch(() => setDone(false));
      }}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md bg-surface-2 px-3 text-xs font-medium text-muted shadow-border transition-[background-color,color] duration-150 hover:text-foreground",
        className,
      )}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}

export function EasyHard({ easy, hard }: { easy: ReactNode; hard: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-ok">Easy way</p>
        <div className="mt-1.5 text-sm leading-relaxed text-foreground">{easy}</div>
      </div>
      <div className="rounded-lg bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-warn">Hard way</p>
        <div className="mt-1.5 text-sm leading-relaxed text-foreground">{hard}</div>
      </div>
    </div>
  );
}

export function Bullets({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-1.5 text-sm leading-relaxed text-foreground", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-muted" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Details({ summary, children, open }: { summary: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="group rounded-lg bg-surface-2 shadow-border" open={open}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{summary}</span>
        <span className="text-subtle transition-transform duration-150 group-open:rotate-90">›</span>
      </summary>
      <div className="px-3 pb-3">{children}</div>
    </details>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("rounded-full bg-surface-3 px-2 py-0.5 text-xs uppercase tracking-wide text-muted", className)}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted shadow-border">{children}</p>;
}
