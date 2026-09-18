import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, RotateCw } from "lucide-react";
import { arrangementMidi, arrangementText, fmtTime, generateArrangement, type ArrangeMode } from "@/lib/hh/arrange";
import { HH_GENRES, HH_GENRE_BY_ID, type HhGenreId } from "@/lib/hh/genres";
import { useHh } from "@/lib/hh/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, Page, PageTitle } from "@/components/site-ui";
import { Card, CopyButton, H3, Kicker, LaneChips, Stat, Tag } from "@/components/hh-ui";
import { SectionStrip, SECTION_LABEL } from "@/components/hh-charts";

const LANES = new Set<string>(HH_GENRES.map((g) => g.id));

export const Route = createFileRoute("/arrange")({
  component: ArrangePage,
  validateSearch: (s: Record<string, unknown>): { lane?: HhGenreId } =>
    typeof s.lane === "string" && LANES.has(s.lane) ? { lane: s.lane as HhGenreId } : {},
  head: () => ({ meta: [{ title: "Arrange · HARDSTYLE HELPER" }] }),
});

const MODES: { id: ArrangeMode; label: string; hint: string }[] = [
  { id: "extended", label: "Extended", hint: "5–7 minutes, the club version" },
  { id: "radio", label: "Radio edit", hint: "Under four minutes" },
  { id: "dj", label: "DJ tool", hint: "32-bar intro/outro, 8-bar grid" },
];

function ArrangePage() {
  const search = Route.useSearch();
  const report = useHh((s) => s.report);
  const [lane, setLane] = useState<HhGenreId>(search.lane ?? report?.target ?? "classic");
  const [mode, setMode] = useState<ArrangeMode>("extended");
  const [seed, setSeed] = useState(7);
  const [bpm, setBpm] = useState<string>("");

  useEffect(() => {
    if (search.lane) setLane(search.lane);
  }, [search.lane]);

  const g = HH_GENRE_BY_ID[lane];
  const tempo = Number(bpm) > 60 && Number(bpm) < 300 ? Number(bpm) : undefined;
  const a = useMemo(() => generateArrangement(lane, mode, seed, tempo), [lane, mode, seed, tempo]);
  const text = useMemo(() => arrangementText(a), [a]);
  const yours = report?.analysis.structure;

  const downloadMidi = () => {
    const bytes = arrangementMidi(a);
    const blob = new Blob([bytes as BlobPart], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = `${g.label.replace(/\W+/g, "-")}-${a.bpm}bpm-markers.mid`;
    el.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Page>
      <PageTitle kicker="Arrange" title="Track arrangements" lede="A bar-by-bar plan for the lane with what to do in every section. Reroll for variations, export the text, or drop the marker MIDI into your DAW." />
      <div className="flex flex-col gap-3">
        <LaneChips value={lane} onChange={(v) => v !== "auto" && setLane(v)} />
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map((m) => (
            <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
              {m.label}
            </Chip>
          ))}
          <span className="text-xs text-subtle">{MODES.find((m) => m.id === mode)?.hint}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder={`BPM (${g.bpm})`} inputMode="numeric" className="w-32" aria-label="Tempo" />
          <Button variant="outline" onClick={() => setSeed((s) => s + 1)}>
            <RotateCw className="size-4" />
            Reroll
          </Button>
          <CopyButton text={text} label="Copy plan" className="h-11" />
          <Button variant="outline" onClick={downloadMidi}>
            <Download className="size-4" />
            MIDI markers
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Lane" value={g.label} sub={g.aka} />
          <Stat label="Tempo" value={`${a.bpm} BPM`} />
          <Stat label="Length" value={`${a.totalBars} bars`} sub={fmtTime(a.totalSec)} />
          <Stat label="Sections" value={a.sections.length} sub={`${a.sections.filter((s) => s.kind === "drop").length} drops`} />
        </div>
        <div className="mt-4">
          <SectionStrip sections={a.sections.map((s) => ({ kind: s.kind, startBar: s.startBar, bars: s.bars, label: s.label }))} totalBars={a.totalBars} title="Generated plan" />
        </div>
        {yours ? (
          <div className="mt-3">
            <SectionStrip
              sections={yours.sections.map((s) => ({ kind: s.kind, startBar: s.startBar, bars: s.bars, label: SECTION_LABEL[s.kind] }))}
              totalBars={yours.bars}
              title={`Your last analysis (${report?.fileName})`}
            />
          </div>
        ) : null}
      </Card>

      <ol className="mt-4 flex flex-col gap-2">
        {a.sections.map((s) => (
          <li key={s.id} className="grid gap-3 rounded-xl bg-surface p-4 shadow-border sm:grid-cols-[7rem_1fr]">
            <div>
              <p className="font-mono text-xs tabular-nums text-subtle">
                bar {s.startBar + 1} · {fmtTime(s.startSec)}
              </p>
              <H3 className="mt-1 flex items-center gap-2">
                <span className={`size-2 rounded-full sec-${s.kind}`} />
                {s.label}
              </H3>
              <p className="font-mono text-xs tabular-nums text-muted">{s.bars} bars</p>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-foreground">{s.do}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.layers.map((l) => (
                  <Tag key={l}>{l}</Tag>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Card className="mt-4">
        <Kicker>Notes</Kicker>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
          {a.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </Card>
    </Page>
  );
}
