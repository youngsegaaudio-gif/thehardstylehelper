import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FileAudio, RotateCw, Upload } from "lucide-react";
import { toast } from "sonner";
import { buildReport, type Finding, type Report } from "@/lib/hh/analysis";
import { HH_GENRE_BY_ID, type HhGenreId } from "@/lib/hh/genres";
import { DAWS } from "@/lib/hh/plugins-kb";
import { ACCEPTED, analyseFile } from "@/lib/hh/run-analysis";
import { FILTER_MIX_RULES, SERUM_PATCHES } from "@/lib/hh/serum";
import { useHh } from "@/lib/hh/store";
import { fmtTime } from "@/lib/hh/arrange";
import { Button } from "@/components/ui/button";
import { Chip, Page, PageTitle } from "@/components/site-ui";
import { Bullets, Card, CopyButton, Details, EasyHard, H2, H3, Kicker, LaneChips, Sev, Stat, Tag } from "@/components/hh-ui";
import { BandCompare, EnergyBars, MatchBars, SECTION_LABEL, SectionLegend, SectionStrip, SpectrumChart } from "@/components/hh-charts";

export const Route = createFileRoute("/analyse")({
  component: AnalysePage,
  head: () => ({ meta: [{ title: "Analyse · HARDSTYLE HELPER" }] }),
});

const AREAS: { id: Finding["area"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kick", label: "Kick" },
  { id: "low", label: "Low end" },
  { id: "mids", label: "Mids" },
  { id: "highs", label: "Highs" },
  { id: "loudness", label: "Loudness" },
  { id: "dynamics", label: "Dynamics" },
  { id: "stereo", label: "Stereo" },
  { id: "tempo", label: "Tempo" },
  { id: "key", label: "Key" },
  { id: "structure", label: "Structure" },
];

function AnalysePage() {
  const ready = useHh((s) => s.ready);
  const report = useHh((s) => s.report);
  const setReport = useHh((s) => s.setReport);
  const targetLane = useHh((s) => s.targetLane);
  const setTargetLane = useHh((s) => s.setTargetLane);
  const daw = useHh((s) => s.daw);
  const plugins = useHh((s) => s.plugins);
  const ownedIds = useHh((s) => s.ownedIds);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ p: 0, label: "" });
  const [drag, setDrag] = useState(false);
  const [area, setArea] = useState<Finding["area"] | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(
    async (file: File) => {
      setBusy(true);
      setProgress({ p: 0, label: "Starting" });
      try {
        const analysis = await analyseFile(file, (p, label) => setProgress({ p, label }));
        const r = buildReport(analysis, { fileName: file.name, target: targetLane, owned: ownedIds(), daw });
        setReport(r);
        toast(`Analysed ${file.name}`);
      } catch (e) {
        toast((e as Error).message || "Could not analyse that file.");
      } finally {
        setBusy(false);
      }
    },
    [daw, ownedIds, setReport, targetLane],
  );

  const rejudge = (lane: HhGenreId | "auto") => {
    setTargetLane(lane);
    if (report) setReport(buildReport(report.analysis, { fileName: report.fileName, target: lane, owned: ownedIds(), daw }));
  };

  const findings = useMemo(() => (report ? report.findings.filter((f) => area === "all" || f.area === area) : []), [report, area]);

  return (
    <Page>
      <PageTitle
        kicker="Analyse"
        title="Analyse your track"
        lede="Drop a bounce (WAV, MP3, AIFF, FLAC…). It stays in your browser. You get tempo, key, kick tail and pitch, loudness, spectrum, width and structure — scored against ten lanes, then turned into fixes with the plugins you own."
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void run(f);
        }}
        className={`rounded-xl bg-surface p-6 text-center shadow-border transition-[box-shadow,background-color] duration-150 ${drag ? "bg-surface-2 shadow-border-hover" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void run(f);
            e.target.value = "";
          }}
        />
        <FileAudio className="mx-auto size-6 text-subtle" />
        {busy ? (
          <div className="mx-auto mt-4 max-w-sm">
            <p className="text-sm text-foreground">{progress.label}…</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-foreground transition-[width] duration-200" style={{ width: `${Math.round(progress.p * 100)}%` }} />
            </div>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-foreground">Drop an audio file here</p>
            <p className="mt-1 text-xs text-muted">or</p>
            <Button className="mt-3 h-12 font-display tracking-wide" onClick={() => inputRef.current?.click()}>
              <Upload className="size-4" />
              Choose a file
            </Button>
            <p className="mt-3 text-xs text-muted">
              Judging against: {targetLane === "auto" ? "the closest lane (auto)" : HH_GENRE_BY_ID[targetLane].label} · DAW {DAWS.find((d) => d.id === daw)?.label} · {plugins.length ? `${plugins.length} plugins scanned` : "no plugin scan yet"}
            </p>
          </>
        )}
      </div>
      <div className="mt-3">
        <LaneChips value={targetLane} onChange={rejudge} allowAuto />
      </div>

      {!report && ready && !busy ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["What it measures", "Tempo and beat grid, key, integrated/short-term LUFS and loudness range, true-peak estimate, crest factor, six-band balance and a 48-point spectrum, stereo correlation and width, kick count, tail length and tail pitch, and a bar-by-bar structure."],
            ["What it compares to", "Each lane's target: BPM window, spectral balance of finished masters, loudness window, kick tail as a share of the beat, crest factor, width. Auto picks the best fit; choose a lane to be judged against it instead."],
            ["What you get", "Findings ranked fix / check / good, each with your number vs the target, an easy fix and a hard fix, the plugins from your scan for the job, the matching Serum patch, and six references from the lane closest to your tempo."],
          ].map(([t, d]) => (
            <Card key={t}>
              <H3>{t}</H3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </Card>
          ))}
        </div>
      ) : null}

      {report ? <ReportView report={report} findings={findings} area={area} setArea={setArea} onPick={(id) => rejudge(id as HhGenreId)} /> : null}
    </Page>
  );
}

function ReportView({
  report,
  findings,
  area,
  setArea,
  onPick,
}: {
  report: Report;
  findings: Finding[];
  area: Finding["area"] | "all";
  setArea: (a: Finding["area"] | "all") => void;
  onPick: (id: string) => void;
}) {
  const a = report.analysis;
  const g = HH_GENRE_BY_ID[report.target];
  const counts = { fix: report.findings.filter((f) => f.severity === "fix").length, check: report.findings.filter((f) => f.severity === "check").length, good: report.findings.filter((f) => f.severity === "good").length };
  const patches = SERUM_PATCHES.filter((p) => p.lanes.includes(report.target)).slice(0, 3);
  const reportText = [
    report.summary,
    "",
    ...report.findings.map((f) => `[${f.severity.toUpperCase()}] ${f.title}\n  measured: ${f.measured}\n  target: ${f.target}\n  easy: ${f.easy}\n  hard: ${f.hard}${f.plugins.length ? `\n  plugins: ${f.plugins.join(", ")}` : ""}`),
  ].join("\n");

  return (
    <div className="mt-8 flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Kicker>Report · {new Date(report.createdAt).toLocaleString()}</Kicker>
            <H2 className="mt-2 truncate">{report.fileName}</H2>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{report.summary}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <CopyButton text={reportText} label="Copy report" className="h-11" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          <Stat label="Tempo" value={a.bpm.value} sub={`BPM · ${Math.round(a.bpm.confidence * 100)}% sure`} />
          <Stat label="Key" value={a.key.name} sub={`${Math.round(a.key.confidence * 100)}% · ${a.key.alt[0]}`} />
          <Stat label="Loudness" value={a.loudness.integrated} sub={`LUFS-I · ST max ${a.loudness.shortTermMax}`} />
          <Stat label="True peak" value={a.loudness.truePeakDb} sub="dBTP (estimate)" />
          <Stat label="Kick tail" value={`${Math.round(a.kick.tailBeats * 100)}%`} sub={`${a.kick.tailMs} ms of a beat`} />
          <Stat label="Kick note" value={a.kick.note} sub={a.kick.hz ? `${a.kick.hz} Hz · ${a.kick.cents > 0 ? "+" : ""}${a.kick.cents}¢` : "not found"} />
          <Stat label="Crest" value={a.loudness.crest} sub={`dB · LRA ${a.loudness.lra}`} />
          <Stat label="Length" value={fmtTime(a.durationSec)} sub={`${a.structure.bars} bars · ${a.channels === 2 ? "stereo" : "mono"}`} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-baseline justify-between gap-2">
            <H3>Lane fit</H3>
            <span className="text-xs text-muted">{report.targetMode === "auto" ? "auto: best fit" : "judging against your pick"}</span>
          </div>
          <div className="mt-3">
            <MatchBars rows={report.matches.map((m) => ({ id: m.genre, label: HH_GENRE_BY_ID[m.genre].label, score: m.score }))} activeId={report.target} onPick={onPick} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {report.matches[0].reasons.length ? `${HH_GENRE_BY_ID[report.matches[0].genre].label}: ${report.matches[0].reasons.join("; ")}.` : "Click a lane to be judged against it."}
          </p>
        </Card>
        <Card className="lg:col-span-2">
          <H3>Spectrum vs {g.label}</H3>
          <div className="mt-3">
            <SpectrumChart spectrum={a.spectrum} target={g.targets.bands} />
          </div>
          <Details summary="Band table">
            <BandCompare bands={a.bands} target={g.targets.bands} />
          </Details>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <H3>Structure</H3>
          <SectionLegend />
        </div>
        <div className="mt-3">
          <SectionStrip sections={a.structure.sections.map((s) => ({ kind: s.kind, startBar: s.startBar, bars: s.bars, label: SECTION_LABEL[s.kind], energy: s.energy }))} totalBars={a.structure.bars} />
        </div>
        <div className="mt-2">
          <EnergyBars energyPerBar={a.structure.energyPerBar} kicksPerBar={a.structure.kicksPerBar} sections={a.structure.sections.map((s) => ({ kind: s.kind, startBar: s.startBar, bars: s.bars, label: SECTION_LABEL[s.kind] }))} />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Bar grid from the detected tempo and beat phase; a drop is a loud section with a kick on every beat. Compare with the lane template on the{" "}
          <Link to="/arrange" search={{ lane: report.target }} className="underline underline-offset-2 hover:text-foreground">
            Arrange page
          </Link>
          .
        </p>
      </Card>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Kicker>Findings against {g.label}</Kicker>
            <H2 className="mt-2">
              {counts.fix} to fix · {counts.check} to check · {counts.good} good
            </H2>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {AREAS.map((x) => (
            <Chip key={x.id} active={area === x.id} onClick={() => setArea(x.id)}>
              {x.label}
            </Chip>
          ))}
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {findings.map((f) => (
            <li key={f.id}>
              <FindingCard f={f} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <Kicker>Listen to</Kicker>
          <H3 className="mt-2">Closest {g.label} references by tempo</H3>
          <ol className="mt-3 flex flex-col gap-2">
            {report.refs.map((r) => (
              <li key={r.id} className="rounded-lg bg-surface-2 p-3">
                <p className="text-sm font-semibold text-foreground">
                  {r.artist} — {r.title}
                </p>
                <p className="font-mono text-xs tabular-nums text-muted">
                  {r.year} · {r.bpm} BPM
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{r.note}</p>
              </li>
            ))}
          </ol>
          <Link to="/genres" className="mt-3 inline-flex h-11 items-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline">
            All 50 {g.label} references →
          </Link>
        </Card>
        <Card>
          <Kicker>Default advice</Kicker>
          <H3 className="mt-2">Serum and filters for {g.label}</H3>
          <ul className="mt-3 flex flex-col gap-2">
            {patches.map((p) => (
              <li key={p.id}>
                <Details summary={<span>{p.name} <span className="text-xs text-muted">— {p.use}</span></span>}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Oscillators</p>
                      <Bullets items={p.osc} className="mt-1.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Filter</p>
                      <Bullets items={p.filter} className="mt-1.5" />
                    </div>
                  </div>
                  <Link to="/serum" className="mt-3 inline-flex h-9 items-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline">
                    Full patch on the Serum page →
                  </Link>
                </Details>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-subtle">Filter rules</p>
          <Bullets items={FILTER_MIX_RULES.slice(0, 3).map((r) => `${r.title}: ${r.body}`)} className="mt-2 text-xs" />
        </Card>
      </div>

      <Card>
        <Kicker>Lane notes</Kicker>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{g.summary}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["Kick", g.kick],
            ["Lead", g.lead],
            ["Arrangement", g.arrangement],
          ].map(([t, b]) => (
            <div key={t}>
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle">{t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{b}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/ask">Ask a question about this</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/mix">Mixing & mastering guide</Link>
        </Button>
        <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <RotateCw className="size-4" />
          Analyse another
        </Button>
      </div>
    </div>
  );
}

function FindingCard({ f }: { f: Finding }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <Sev s={f.severity} />
        <Tag>{f.area}</Tag>
        <H3 className="min-w-0 flex-1">{f.title}</H3>
      </div>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-surface-2 p-3">
          <dt className="text-xs uppercase tracking-widest text-subtle">Measured</dt>
          <dd className="font-mono mt-1 text-sm tabular-nums text-foreground">{f.measured}</dd>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <dt className="text-xs uppercase tracking-widest text-subtle">Lane target</dt>
          <dd className="font-mono mt-1 text-sm tabular-nums text-foreground">{f.target}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm leading-relaxed text-muted">{f.detail}</p>
      <div className="mt-3">
        <EasyHard easy={f.easy} hard={f.hard} />
      </div>
      {f.plugins.length || f.serum ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          {f.plugins.length ? (
            <>
              <span>Use:</span>
              {f.plugins.map((p) => (
                <Tag key={p} className="normal-case tracking-normal text-foreground">
                  {p}
                </Tag>
              ))}
            </>
          ) : null}
          {f.serum ? (
            <Link to="/serum" className="underline underline-offset-2 hover:text-foreground">
              {f.serum}
            </Link>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
