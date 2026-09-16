import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Copy, Download, LoaderCircle } from "lucide-react";
import { ChordStrip } from "@/components/chord-strip";
import { askCoach } from "@/lib/coach-ai";
import { buildCoach, markerList } from "@/lib/coach-engine";
import { kicksFor } from "@/lib/kicks";
import { downloadMacPack } from "@/lib/mac-pack";
import { downloadMidi, makeMidi, makeSongMidi, type MidiKind } from "@/lib/midi";
import { phraseEdges } from "@/lib/phrase-edges";
import { downloadText, notesDocument, slugName } from "@/lib/session-export";
import { logicScripter } from "@/lib/scripter";
import { useTrack, type CoachTab } from "@/lib/store";
import { transitionsAtPlayhead } from "@/lib/transitions";
import type { CoachPack, NoteItem, SectionKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TABS: { id: CoachTab; label: string }[] = [
  { id: "next", label: "Next" },
  { id: "map", label: "Map" },
  { id: "kicks", label: "Kicks" },
  { id: "mix", label: "Mix" },
  { id: "serum", label: "Serum" },
];

const SECTION_FILL: Record<SectionKind, string> = {
  intro: "bg-section-intro",
  break: "bg-section-break",
  build: "bg-section-build",
  drop: "bg-section-drop",
  outro: "bg-section-outro",
};

function copyText(label: string, text: string) {
  void navigator.clipboard.writeText(text);
  toast.success(`Copied ${label}`);
}

function NoteRow({
  item,
  checked,
  onToggle,
}: {
  item: NoteItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex gap-3">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={cn(
          "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-md shadow-border",
          checked ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted",
        )}
      >
        {checked ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-subtle" />}
      </button>
      <div className="min-w-0 flex-1 py-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className={cn("text-sm font-medium", checked && "text-muted line-through")}>
            {item.title}
          </p>
          {item.bars && (
            <span className="font-mono text-xs tabular-nums text-subtle">{item.bars}</span>
          )}
          {item.tag && <Badge tone="muted">{item.tag}</Badge>}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{item.detail}</p>
      </div>
    </li>
  );
}

function PackView({
  pack,
  source,
  fallbackPlan,
}: {
  pack: CoachPack;
  source: "engine" | "ai";
  fallbackPlan: CoachPack["songPlan"];
}) {
  const tab = useTrack((s) => s.tab);
  const setTab = useTrack((s) => s.setTab);
  const session = useTrack((s) => s.session);
  const setBar = useTrack((s) => s.setBar);
  const toggleChecked = useTrack((s) => s.toggleChecked);
  const plan = (pack.songPlan ?? []).length ? pack.songPlan : fallbackPlan;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {source === "ai" ? "Session coach" : "Next move"}
        </p>
        <h2 className="mt-1 font-display text-4xl tracking-wide text-balance text-foreground sm:text-5xl">
          {pack.headline}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          {pack.why}
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Do this now
          </p>
          <p className="mt-2 text-lg leading-snug text-foreground text-pretty">
            {pack.nextMove}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-1 rounded-lg bg-surface-2 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "h-11 flex-1 rounded-md px-2 text-sm font-medium min-w-16",
              tab === t.id
                ? "bg-surface text-foreground shadow-border"
                : "text-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "next" && (
        <div className="flex flex-col gap-6">
          <ol className="flex flex-col gap-4">
            {pack.barPlan.map((item) => (
              <NoteRow
                key={item.id}
                item={item}
                checked={session.checked.includes(item.id)}
                onToggle={() => toggleChecked(item.id)}
              />
            ))}
          </ol>
          <Separator />
          <div>
            <h3 className="font-display text-xl tracking-wide">Instruments to add</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {pack.instruments.map((ins) => (
                <li key={ins.name} className="rounded-lg bg-surface p-4 shadow-border">
                  <p className="text-sm font-medium">{ins.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-muted">
                    {ins.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                    {ins.how}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {pack.arrangementNote && (
            <p className="text-sm leading-relaxed text-muted text-pretty">
              {pack.arrangementNote}
            </p>
          )}
        </div>
      )}

      {tab === "map" && (
        <ol className="flex flex-col gap-2">
          {plan.map((sec) => {
            const active =
              session.bar >= sec.startBar && session.bar < sec.startBar + sec.bars;
            return (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => setBar(sec.startBar)}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-left shadow-border",
                    SECTION_FILL[sec.kind],
                    active ? "opacity-100" : "opacity-75 hover:opacity-90",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-lg tracking-wide">{sec.label}</span>
                    <span className="font-mono text-xs tabular-nums text-muted">
                      bar {sec.startBar + 1} · {sec.bars} bars
                    </span>
                  </div>
                  <span className="text-sm leading-relaxed text-pretty text-foreground">
                    {sec.do}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {tab === "kicks" && <KicksTab />}

      {tab === "mix" && (
        <ul className="flex flex-col gap-3">
          {pack.mix.map((m) => (
            <li key={m.layer} className="rounded-xl bg-surface p-5 shadow-border">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl tracking-wide">{m.layer}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyText(
                      m.layer,
                      `${m.layer}\nEQ: ${m.eq}\nComp: ${m.compression}\nChain: ${m.plugins}`,
                    )
                  }
                >
                  <Copy className="size-4" />
                  Copy
                </Button>
              </div>
              <dl className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">EQ</dt>
                  <dd className="text-pretty text-foreground">{m.eq}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    Compression
                  </dt>
                  <dd className="text-pretty text-foreground">{m.compression}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    Logic chain
                  </dt>
                  <dd className="text-pretty text-foreground">{m.plugins}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}

      {tab === "serum" && (
        <div className="flex flex-col gap-5">
          <ChordStrip musicalKey={session.key} />
          <ul className="flex flex-col gap-3">
            {pack.serum.map((r) => (
              <li key={r.title} className="rounded-xl bg-surface p-5 shadow-border">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl tracking-wide">{r.title}</h3>
                    <p className="mt-1 text-sm text-muted text-pretty">{r.sound}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyText(
                        r.title,
                        [
                          r.title,
                          r.sound,
                          "OSC",
                          ...r.osc,
                          "FILTER / ENV",
                          ...r.filterEnv,
                          "FX",
                          ...r.fx,
                          "MIX",
                          ...r.mix,
                        ].join("\n"),
                      )
                    }
                  >
                    <Copy className="size-4" />
                    Copy
                  </Button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <RecipeList title="Osc" items={r.osc} />
                  <RecipeList title="Filter / env" items={r.filterEnv} />
                  <RecipeList title="FX" items={r.fx} />
                  <RecipeList title="Mixing" items={r.mix} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "logic" && (
        <div className="flex flex-col gap-4">
          <MidiExport />
          {pack.logic.map((m) => (
            <Card key={m.title} className="rounded-xl">
              <CardHeader>
                <CardTitle>{m.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="flex list-decimal flex-col gap-2 pl-4 text-sm leading-relaxed text-muted">
                  {m.steps.map((step) => (
                    <li key={step} className="text-pretty ps-1">
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
          <MarkerList />
        </div>
      )}
    </div>
  );
}

function KicksTab() {
  const session = useTrack((s) => s.session);
  const kicks = kicksFor(session.style);
  const hits = transitionsAtPlayhead(session);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-xl tracking-wide">PVC / extra kicks</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">
          Main PVC plus extras for {session.style === "hard-techno" ? "hard techno" : "this genre"}.
          Extras live at phrase edges — not stacked as a second kick in the sub.
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {kicks.map((k) => (
            <li key={k.id} className="rounded-xl bg-surface p-5 shadow-border">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display text-lg tracking-wide">{k.name}</h4>
                <span className="text-xs uppercase tracking-wider text-muted">{k.kind}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{k.length}</p>
              <dl className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Where</dt>
                  <dd className="text-pretty">{k.where}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">EQ</dt>
                  <dd className="text-pretty">{k.eq}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Comp / clip</dt>
                  <dd className="text-pretty">{k.compression}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Logic chain</dt>
                  <dd className="text-pretty">{k.plugins}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-xl tracking-wide">Transitions this genre</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">
          Where to put the switch. Highlighted rows are close to the playhead.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {hits.map((t) => (
            <li
              key={t.id}
              className={cn(
                "rounded-lg px-4 py-3 shadow-border",
                t.near ? "bg-surface-3" : "bg-surface",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{t.what}</p>
                <p className="font-mono text-xs tabular-nums text-muted">
                  {t.at} · {t.bars}
                </p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{t.how}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecipeList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted">{title}</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-foreground">
        {items.map((x) => (
          <li key={x} className="text-pretty">
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MidiExport() {
  const session = useTrack((s) => s.session);
  const kinds: { id: MidiKind; label: string }[] = [
    { id: "kick", label: "Kick" },
    { id: "clap", label: "Clap" },
    { id: "hats", label: "Hats" },
    { id: "chords", label: "Chords" },
    { id: "lead", label: "Lead" },
    { id: "bass", label: "Bass" },
    { id: "screech", label: "Screech" },
    { id: "snare-roll", label: "Snare roll" },
    { id: "extra-kick", label: "Extra kick" },
    { id: "pvc-fill", label: "PVC fill" },
  ];

  const slug = slugName(session.name);
  const edges = phraseEdges(session.style);
  const midiOpts = {
    bpm: session.bpm,
    key: session.key,
    bars: edges.total,
    fillBars: edges.fillBars,
    impactBars: edges.impactBars,
    rollBars: edges.rollBars,
  };

  function save(kind: MidiKind) {
    const bytes = makeMidi(kind, midiOpts);
    downloadMidi(bytes, `${slug}-${kind}.mid`);
    toast.success(`Saved ${kind}.mid — drop it onto a Logic track`);
  }

  function saveSong() {
    const markers = markerList(session).map((m) => ({
      bar: m.bar - 1,
      label: m.label,
    }));
    const bytes = makeSongMidi({
      ...midiOpts,
      markers,
    });
    downloadMidi(bytes, `${slug}-logic.mid`);
    toast.success(`Saved ${edges.total}-bar Logic MIDI — drag onto arrange`);
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Drop into Logic</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-muted text-pretty">
          One zip: Scripter, full {edges.total}-bar MIDI with markers, extra kicks
          and fills on phrase edges, notes, mix. Not an Audio Unit — paste the
          script. Chords are in {session.key}.
        </p>
        <Button
          onClick={() => {
            downloadMacPack(session);
            toast.success("Saved Logic Mac pack");
          }}
        >
          <Download className="size-4" />
          Download Logic Mac pack
        </Button>
        <Button variant="secondary" onClick={saveSong}>
          <Download className="size-4" />
          Full song MIDI only
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            copyText("Scripter", logicScripter(session));
          }}
        >
          <Copy className="size-4" />
          Copy Scripter
        </Button>
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <Button key={k.id} variant="secondary" onClick={() => save(k.id)}>
              <Download className="size-4" />
              {k.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MarkerList() {
  const session = useTrack((s) => s.session);
  const markers = markerList(session);
  const text = markers.map((m) => `${m.time}  bar ${m.bar}  ${m.label}`).join("\n");
  return (
    <Card className="rounded-xl">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Logic markers</CardTitle>
        <Button size="sm" variant="ghost" onClick={() => copyText("markers", text)}>
          <Copy className="size-4" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1 font-mono text-xs tabular-nums text-muted">
          {markers.map((m) => (
            <li key={`${m.bar}-${m.label}`} className="flex gap-4">
              <span className="w-12">{m.time}</span>
              <span className="w-16">bar {m.bar}</span>
              <span className="text-foreground">{m.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function CoachPanel() {
  const session = useTrack((s) => s.session);
  const setAiCoach = useTrack((s) => s.setAiCoach);
  const pack = buildCoach(session);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<"engine" | "ai">("engine");
  const [aiError, setAiError] = useState<string | null>(null);
  const ask = useServerFn(askCoach);

  const shown = view === "ai" && session.aiCoach ? session.aiCoach : pack;

  async function runAi() {
    setBusy(true);
    setAiError(null);
    try {
      const result = await ask({ data: { session } });
      if (!result.ok) {
        setAiError(result.error);
        toast.error(result.error);
        return;
      }
      setAiCoach(result.pack);
      setView("ai");
      toast.success("Coach updated for this session");
    } catch {
      const msg = "Coach request failed.";
      setAiError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  function downloadNotes() {
    const text = notesDocument(session, shown);
    downloadText(`${slugName(session.name)}-helper.txt`, text);
    toast.success("Saved studio notes");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={runAi} disabled={busy}>
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : null}
          {busy ? "Listening…" : "Coach this session"}
        </Button>
        {session.aiCoach && (
          <div className="flex rounded-md bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setView("engine")}
              className={cn(
                "h-9 rounded px-3 text-xs font-medium",
                view === "engine" ? "bg-surface text-foreground shadow-border" : "text-muted",
              )}
            >
              Guide
            </button>
            <button
              type="button"
              onClick={() => setView("ai")}
              className={cn(
                "h-9 rounded px-3 text-xs font-medium",
                view === "ai" ? "bg-surface text-foreground shadow-border" : "text-muted",
              )}
            >
              Session coach
            </button>
          </div>
        )}
        <Button variant="ghost" onClick={downloadNotes}>
          <Download className="size-4" />
          Notes
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            copyText(
              "notes",
              [shown.headline, shown.nextMove, ...shown.barPlan.map((n) => `• ${n.title}: ${n.detail}`)].join(
                "\n",
              ),
            )
          }
        >
          <Copy className="size-4" />
          Copy
        </Button>
      </div>
      {aiError && (
        <p className="text-sm text-danger text-pretty">
          {aiError} The arrangement map still works offline.
        </p>
      )}
      <PackView
        pack={shown}
        source={view === "ai" && session.aiCoach ? "ai" : "engine"}
        fallbackPlan={pack.songPlan}
      />
    </div>
  );
}
