import { useId, useMemo, useState } from "react";
import { BAND_KEYS, BAND_LABELS, BAND_RANGES, type BandKey, type SectionKind } from "@/lib/hh/dsp";
import type { BandTarget } from "@/lib/hh/genres";
import { cn } from "@/lib/utils";

/* Section colours are categorical slots from a validated dark palette (styles.css: --color-sec-*). */
export const SECTION_LABEL: Record<SectionKind, string> = {
  intro: "Intro",
  break: "Break",
  build: "Build",
  drop: "Drop",
  mid: "Mid",
  outro: "Outro",
};
const KINDS: SectionKind[] = ["intro", "break", "build", "drop", "mid", "outro"];

export function SectionLegend() {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {KINDS.map((k) => (
        <li key={k} className="flex items-center gap-1.5 text-xs text-muted">
          <span className={cn("size-2.5 rounded-sm", `sec-${k}`)} />
          {SECTION_LABEL[k]}
        </li>
      ))}
    </ul>
  );
}

export type StripSection = { kind: SectionKind; startBar: number; bars: number; label: string; energy?: number };

/** A horizontal timeline of sections with 2px surface gaps, direct labels where they fit, hover readout. */
export function SectionStrip({ sections, totalBars, title }: { sections: StripSection[]; totalBars: number; title?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const h = sections[hover ?? -1];
  return (
    <div>
      {title ? <p className="mb-1.5 text-xs text-muted">{title}</p> : null}
      <div className="flex h-9 w-full gap-[2px] rounded-md bg-surface-2 p-[2px]" role="list" aria-label={title ?? "Sections"}>
        {sections.map((s, i) => {
          const w = (s.bars / Math.max(1, totalBars)) * 100;
          const showLabel = w > 9;
          return (
            <button
              type="button"
              role="listitem"
              key={`${s.kind}-${s.startBar}-${i}`}
              style={{ width: `${w}%` }}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${s.label}, bars ${s.startBar + 1}–${s.startBar + s.bars}`}
              className={cn(
                "relative h-full min-w-[3px] overflow-visible rounded-[3px] text-left transition-opacity duration-150",
                `sec-${s.kind}`,
                hover !== null && hover !== i ? "opacity-70" : "",
              )}
            >
              {showLabel ? (
                <span className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 truncate text-[11px] font-medium text-[#0c0c0b]/85">
                  {s.label} <span className="font-mono tabular-nums opacity-70">{s.bars}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 h-4 font-mono text-xs tabular-nums text-muted" aria-live="polite">
        {h ? `${h.label}: bars ${h.startBar + 1}–${h.startBar + h.bars} (${h.bars})${h.energy !== undefined ? ` · ${h.energy} dB` : ""}` : `${totalBars} bars`}
      </p>
    </div>
  );
}

/** Energy per bar as thin columns, coloured by the section the bar belongs to. */
export function EnergyBars({ energyPerBar, kicksPerBar, sections }: { energyPerBar: number[]; kicksPerBar: number[]; sections: StripSection[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = energyPerBar.length;
  const W = 800;
  const H = 120;
  const pad = { l: 34, r: 6, t: 6, b: 18 };
  const min = -36;
  const x = (i: number) => pad.l + (i / Math.max(1, n)) * (W - pad.l - pad.r);
  const bw = Math.max(1, (W - pad.l - pad.r) / Math.max(1, n) - 1);
  const y = (db: number) => pad.t + ((0 - Math.max(min, db)) / (0 - min)) * (H - pad.t - pad.b);
  const kindAt = (bar: number) => sections.find((s) => bar >= s.startBar && bar < s.startBar + s.bars)?.kind ?? "mid";
  const ticks = [0, -12, -24, -36];
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Energy per bar">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="currentColor" className="text-border" strokeWidth={1} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize={9} className="fill-subtle font-mono">
              {t}
            </text>
          </g>
        ))}
        {energyPerBar.map((e, i) => (
          <rect
            key={i}
            x={x(i)}
            y={y(e)}
            width={bw}
            height={Math.max(1, y(min) - y(e))}
            rx={1}
            className={cn(`fill-sec-${kindAt(i)}`, hover !== null && hover !== i ? "opacity-70" : "")}
          />
        ))}
        {/* hit layer */}
        {energyPerBar.map((_, i) => (
          <rect key={`h${i}`} x={x(i) - 0.5} y={pad.t} width={bw + 1} height={H - pad.t - pad.b} fill="transparent" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} />
        ))}
        {[0, 32, 64, 96, 128, 160, 192, 224].filter((b) => b < n).map((b) => (
          <text key={b} x={x(b)} y={H - 5} fontSize={9} className="fill-subtle font-mono">
            {b + 1}
          </text>
        ))}
      </svg>
      <p className="mt-1 h-4 font-mono text-xs tabular-nums text-muted" aria-live="polite">
        {hover !== null ? `bar ${hover + 1}: ${energyPerBar[hover]} dB · ${kicksPerBar[hover]} kicks · ${SECTION_LABEL[kindAt(hover)]}` : "bar energy in dB below the loudest bar · hover a bar"}
      </p>
    </div>
  );
}

/** Spectrum curve (2px line) with the lane's band targets as short flat segments. */
export function SpectrumChart({ spectrum, target }: { spectrum: { hz: number; db: number }[]; target?: BandTarget }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 800;
  const H = 220;
  const pad = { l: 34, r: 10, t: 10, b: 24 };
  const min = -60;
  const lx = (hz: number) => pad.l + (Math.log10(hz / 20) / 3) * (W - pad.l - pad.r);
  const y = (db: number) => pad.t + ((0 - Math.max(min, db)) / (0 - min)) * (H - pad.t - pad.b);
  const path = useMemo(() => spectrum.map((p, i) => `${i ? "L" : "M"}${lx(p.hz).toFixed(1)},${y(p.db).toFixed(1)}`).join(" "), [spectrum]); // eslint-disable-line react-hooks/exhaustive-deps
  const area = `${path} L${lx(spectrum[spectrum.length - 1]?.hz ?? 20000).toFixed(1)},${y(min)} L${lx(20).toFixed(1)},${y(min)} Z`;
  const fticks = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  const h = hover !== null ? spectrum[hover] : null;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Spectrum of the track with lane targets">
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x={pad.l} y={pad.t} width={W - pad.l - pad.r} height={H - pad.t - pad.b} />
          </clipPath>
        </defs>
        {[0, -12, -24, -36, -48, -60].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="currentColor" className="text-border" strokeWidth={1} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize={9} className="fill-subtle font-mono">
              {t}
            </text>
          </g>
        ))}
        {fticks.map((f) => (
          <text key={f} x={lx(f)} y={H - 6} textAnchor="middle" fontSize={9} className="fill-subtle font-mono">
            {f >= 1000 ? `${f / 1000}k` : f}
          </text>
        ))}
        <g clipPath={`url(#${id}-clip)`}>
          <path d={area} className="fill-series-1" opacity={0.1} />
          <path d={path} fill="none" className="stroke-series-1" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {target
            ? BAND_KEYS.map((k) => {
                const [lo, hi] = BAND_RANGES[k];
                return <line key={k} x1={lx(lo) + 2} x2={lx(hi) - 2} y1={y(target[k])} y2={y(target[k])} className="stroke-series-2" strokeWidth={2} strokeLinecap="round" />;
              })
            : null}
          {h ? (
            <g>
              <line x1={lx(h.hz)} x2={lx(h.hz)} y1={pad.t} y2={H - pad.b} stroke="currentColor" className="text-muted" strokeWidth={1} />
              <circle cx={lx(h.hz)} cy={y(h.db)} r={4} className="fill-series-1 stroke-surface" strokeWidth={2} />
            </g>
          ) : null}
        </g>
        <rect
          x={pad.l}
          y={pad.t}
          width={W - pad.l - pad.r}
          height={H - pad.t - pad.b}
          fill="transparent"
          onPointerMove={(e) => {
            const r = (e.currentTarget as SVGRectElement).getBoundingClientRect();
            const px = pad.l + ((e.clientX - r.left) / r.width) * (W - pad.l - pad.r);
            let best = 0;
            let bd = Infinity;
            spectrum.forEach((p, i) => {
              const d = Math.abs(lx(p.hz) - px);
              if (d < bd) {
                bd = d;
                best = i;
              }
            });
            setHover(best);
          }}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <ul className="flex gap-3 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-series-1" /> Your track
          </li>
          {target ? (
            <li className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-series-2" /> Lane target (per band)
            </li>
          ) : null}
        </ul>
        <p className="h-4 font-mono text-xs tabular-nums text-muted" aria-live="polite">
          {h ? `${h.hz >= 1000 ? `${(h.hz / 1000).toFixed(1)} kHz` : `${h.hz} Hz`} · ${h.db} dB` : "dB below the peak of the curve"}
        </p>
      </div>
    </div>
  );
}

/** Six bands, measured vs lane target, as paired thin bars with direct value labels. */
export function BandCompare({ bands, target }: { bands: Record<BandKey, number>; target: BandTarget }) {
  const min = -30;
  const w = (v: number) => `${Math.max(2, ((Math.max(min, v) - min) / (0 - min)) * 100)}%`;
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {BAND_KEYS.map((k) => (
          <li key={k} className="grid grid-cols-[8rem_1fr] items-center gap-3 sm:grid-cols-[10rem_1fr]">
            <span className="text-xs text-muted">{BAND_LABELS[k]} Hz</span>
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 rounded-r-[4px] bg-series-1" style={{ width: w(bands[k]) }} />
                <span className="font-mono text-xs tabular-nums text-foreground">{bands[k] > 0 ? "+" : ""}{bands[k]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 rounded-r-[4px] bg-series-2" style={{ width: w(target[k]) }} />
                <span className="font-mono text-xs tabular-nums text-muted">{target[k] > 0 ? "+" : ""}{target[k]}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex gap-3 text-xs text-muted">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-series-1" /> Your track
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-series-2" /> Lane target
        </li>
      </ul>
    </div>
  );
}

/** One series: fit per lane as thin bars, value at the tip. */
export function MatchBars({ rows, activeId, onPick }: { rows: { id: string; label: string; score: number }[]; activeId?: string; onPick?: (id: string) => void }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => onPick?.(r.id)}
            className={cn("grid w-full grid-cols-[7rem_1fr_3rem] items-center gap-2 rounded-md px-1 py-1 text-left hover:bg-surface-2", activeId === r.id ? "bg-surface-2" : "")}
          >
            <span className={cn("truncate text-xs", activeId === r.id ? "text-foreground" : "text-muted")}>{r.label}</span>
            <span className="h-2.5 rounded-r-[4px] bg-series-1" style={{ width: `${Math.max(2, r.score)}%`, opacity: activeId && activeId !== r.id ? 0.6 : 1 }} />
            <span className="font-mono text-right text-xs tabular-nums text-foreground">{r.score}%</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
