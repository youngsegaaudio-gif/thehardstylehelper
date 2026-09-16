import { Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  GENRES,
  VOCAL_STYLES,
  type EraId,
  type GenreId,
  type VocalSource,
} from "@/lib/hs-catalog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const ERAS: { id: EraId | "all"; label: string }[] = [
  { id: "all", label: "All eras" },
  { id: "90s", label: "90s" },
  { id: "00s", label: "00s" },
  { id: "10s", label: "10s" },
  { id: "20s", label: "20s" },
];

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-full px-3.5 text-xs font-medium transition-[background-color,color] duration-150",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-surface-2 text-muted shadow-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-muted">{children}</p>
  );
}

export function Page({
  children,
  narrow,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 sm:py-12", narrow ? "max-w-3xl" : "max-w-6xl")}>
      {children}
    </div>
  );
}

export function PageTitle({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-8 max-w-2xl">
      <Eyebrow>{kicker}</Eyebrow>
      <h1 className="font-display mt-2 text-3xl leading-none tracking-wide text-foreground sm:text-5xl">
        {title}
      </h1>
      {lede ? <p className="mt-4 text-base leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
        aria-label="Search"
      />
    </div>
  );
}

export function StyleChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip active={value === "all"} onClick={() => onChange("all")}>
        All styles
      </Chip>
      {VOCAL_STYLES.map((s) => (
        <Chip key={s.id} active={value === s.id} onClick={() => onChange(value === s.id ? "all" : s.id)}>
          {s.label}
        </Chip>
      ))}
    </div>
  );
}

export function GenreChips({
  value,
  onChange,
}: {
  value: GenreId | "all";
  onChange: (id: GenreId | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip active={value === "all"} onClick={() => onChange("all")}>
        All lanes
      </Chip>
      {GENRES.map((g) => (
        <Chip key={g.id} active={value === g.id} onClick={() => onChange(value === g.id ? "all" : g.id)}>
          {g.label}
        </Chip>
      ))}
    </div>
  );
}

export function EraChips({
  era,
  nicheOnly,
  onEra,
  onNiche,
}: {
  era: EraId | "all";
  nicheOnly: boolean;
  onEra: (id: EraId | "all") => void;
  onNiche: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ERAS.map((e) => (
        <Chip key={e.id} active={era === e.id} onClick={() => onEra(e.id)}>
          {e.label}
        </Chip>
      ))}
      <Chip active={nicheOnly} onClick={onNiche}>
        Niche cuts
      </Chip>
    </div>
  );
}

export function VocalCard({
  v,
  onPick,
}: {
  v: VocalSource;
  onPick: (v: VocalSource) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(v)}
      className="flex h-full w-full flex-col rounded-xl bg-surface p-4 text-left shadow-border transition-[background-color,box-shadow] duration-150 hover:bg-surface-2 hover:shadow-border-hover"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-snug text-foreground">{v.title}</span>
        <span className="font-mono shrink-0 text-xs tabular-nums text-subtle">{v.year}</span>
      </span>
      <span className="mt-0.5 text-xs text-muted">{v.artist}</span>
      <span className="mt-3 flex flex-wrap gap-1">
        <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs uppercase tracking-wide text-muted">
          {v.era}
        </span>
        <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs uppercase tracking-wide text-muted">
          {v.from}
        </span>
      </span>
      <span className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{v.why}</span>
    </button>
  );
}

export function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-widest text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm leading-snug text-foreground">{value}</dd>
    </div>
  );
}
