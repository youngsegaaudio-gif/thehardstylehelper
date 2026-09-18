import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Download, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  cloneLane,
  countCustomisations,
  DEFAULT_APPEARANCE,
  DEFAULT_ANALYSIS,
  exportCustom,
  findGenre,
  FINDING_AREAS,
  importCustom,
  MATCH_WEIGHTS,
  type Appearance,
  type LaneOverride,
} from "@/lib/hh/customise";
import { BAND_KEYS, BAND_LABELS } from "@/lib/hh/dsp";
import { HH_GENRES, type GenreTargets, type HhGenre, type SectionTemplate } from "@/lib/hh/genres";
import { identify, PLUGIN_KB, ROLE_LABEL, type PluginRole } from "@/lib/hh/plugins-kb";
import { useHh, useLanes } from "@/lib/hh/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Chip, Page, PageTitle } from "@/components/site-ui";
import { Card, H2, H3, Kicker, Tag } from "@/components/hh-ui";
import { SectionStrip } from "@/components/hh-charts";

type Tab = "lanes" | "analysis" | "plugins" | "content" | "appearance" | "backup";
const TABS: { id: Tab; label: string }[] = [
  { id: "lanes", label: "Lanes" },
  { id: "analysis", label: "Analysis" },
  { id: "plugins", label: "Plugins" },
  { id: "content", label: "Your content" },
  { id: "appearance", label: "Appearance" },
  { id: "backup", label: "Backup" },
];

export const Route = createFileRoute("/customise")({
  component: CustomisePage,
  validateSearch: (s: Record<string, unknown>): { tab?: Tab; lane?: string } => ({
    ...(TABS.some((t) => t.id === s.tab) ? { tab: s.tab as Tab } : {}),
    ...(typeof s.lane === "string" && s.lane ? { lane: s.lane } : {}),
  }),
  head: () => ({ meta: [{ title: "Customise · HARDSTYLE HELPER" }] }),
});

function CustomisePage() {
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search.tab ?? "lanes");
  const custom = useHh((s) => s.custom);
  const ready = useHh((s) => s.ready);
  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);
  const n = countCustomisations(custom);

  return (
    <Page>
      <PageTitle
        kicker="Customise"
        title="Make it yours"
        lede="Every number the helper judges you against, every template it generates from, which plugins it names, what it says and how it looks. All of it is editable and lives on this device."
      />
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Chip>
        ))}
        <span className="ml-auto font-mono text-xs tabular-nums text-subtle">{ready ? `${n} customisation${n === 1 ? "" : "s"} active` : "…"}</span>
      </div>
      <div className="mt-6">
        {tab === "lanes" ? <LanesTab initial={search.lane} /> : null}
        {tab === "analysis" ? <AnalysisTab /> : null}
        {tab === "plugins" ? <PluginsTab /> : null}
        {tab === "content" ? <ContentTab /> : null}
        {tab === "appearance" ? <AppearanceTab /> : null}
        {tab === "backup" ? <BackupTab /> : null}
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

function NumPair({ label, value, onChange, step = 1, unit }: { label: string; value: [number, number]; onChange: (v: [number, number]) => void; step?: number; unit?: string }) {
  return (
    <Field label={`${label}${unit ? ` (${unit})` : ""}`}>
      <div className="flex items-center gap-2">
        <Input type="number" step={step} value={value[0]} onChange={(e) => onChange([Number(e.target.value), value[1]])} className="h-10 font-mono text-sm" aria-label={`${label} minimum`} />
        <span className="text-xs text-subtle">to</span>
        <Input type="number" step={step} value={value[1]} onChange={(e) => onChange([value[0], Number(e.target.value)])} className="h-10 font-mono text-sm" aria-label={`${label} maximum`} />
      </div>
    </Field>
  );
}

function Lines({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  return (
    <Field label={label} hint={hint ?? "One per line"}>
      <Textarea value={value.join("\n")} onChange={(e) => onChange(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} className="min-h-24 text-sm" />
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* lanes                                                               */

function LanesTab({ initial }: { initial?: string }) {
  const lanes = useLanes();
  const custom = useHh((s) => s.custom);
  const setLaneOverride = useHh((s) => s.setLaneOverride);
  const addCustomLane = useHh((s) => s.addCustomLane);
  const updateCustomLane = useHh((s) => s.updateCustomLane);
  const removeCustomLane = useHh((s) => s.removeCustomLane);
  const toggleLaneHidden = useHh((s) => s.toggleLaneHidden);
  const allLanes = useMemo(() => {
    const hidden = new Set(custom.hiddenLanes);
    const built = HH_GENRES.map((g) => ({ g, hidden: hidden.has(g.id), custom: false }));
    const own = custom.customLanes.map((g) => ({ g, hidden: hidden.has(g.id), custom: true }));
    return [...built, ...own];
  }, [custom]);
  const [sel, setSel] = useState<string>(initial && allLanes.some((x) => x.g.id === initial) ? initial : "classic");
  useEffect(() => {
    if (initial) setSel(initial);
  }, [initial]);
  const [newName, setNewName] = useState("");

  const entry = allLanes.find((x) => x.g.id === sel) ?? allLanes[0];
  const base = entry.g;
  const effective = findGenre(lanes.length ? [...lanes, ...allLanes.map((x) => x.g)] : allLanes.map((x) => x.g), sel);
  const override = custom.laneOverrides[sel] ?? {};
  const isCustom = entry.custom;

  /** For built-in lanes we store a diff; for custom lanes we store the full lane. */
  const patch = (p: LaneOverride) => {
    if (isCustom) {
      const merged: HhGenre = {
        ...base,
        ...p,
        targets: p.targets ? { ...base.targets, ...p.targets, bands: { ...base.targets.bands, ...(p.targets.bands ?? {}) } } : base.targets,
        template: p.template ?? base.template,
      } as HhGenre;
      updateCustomLane(merged);
    } else {
      const next: LaneOverride = { ...override, ...p };
      if (p.targets) next.targets = { ...(override.targets ?? {}), ...p.targets, ...(p.targets.bands ? { bands: { ...(override.targets?.bands ?? {}), ...p.targets.bands } } : {}) } as Partial<GenreTargets>;
      setLaneOverride(sel, next);
    }
  };
  const t = effective.targets;
  const setT = (k: keyof GenreTargets, v: GenreTargets[keyof GenreTargets]) => patch({ targets: { [k]: v } as Partial<GenreTargets> });

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <div className="flex flex-col gap-3">
        <Card>
          <Kicker>Lanes</Kicker>
          <ul className="mt-2 flex flex-col gap-1">
            {allLanes.map(({ g, hidden, custom: isOwn }) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setSel(g.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm ${sel === g.id ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"} ${hidden ? "line-through opacity-60" : ""}`}
                >
                  <span className="truncate">{findGenre([...lanes, g], g.id).label}</span>
                  <span className="flex gap-1">
                    {isOwn ? <Tag>yours</Tag> : custom.laneOverrides[g.id] ? <Tag>edited</Tag> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <Kicker>New lane</Kicker>
          <p className="mt-1 text-xs text-muted">Clone the selected lane, then change anything.</p>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name, e.g. My raw 2024" className="mt-2 h-10" />
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              const name = newName.trim();
              if (!name) return;
              const g = cloneLane(effective, name);
              addCustomLane(g);
              setSel(g.id);
              setNewName("");
              toast(`Created ${name}`);
            }}
          >
            <Plus className="size-4" />
            Clone “{effective.label}”
          </Button>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Kicker>{isCustom ? "Your lane" : "Built-in lane"}</Kicker>
              <H2 className="mt-1">{effective.label}</H2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleLaneHidden(sel)}>
                {entry.hidden ? "Show in app" : "Hide from app"}
              </Button>
              {isCustom ? (
                <Button variant="ghost" size="sm" onClick={() => { removeCustomLane(sel); setSel("classic"); }}>
                  <Trash2 className="size-4" />
                  Delete lane
                </Button>
              ) : custom.laneOverrides[sel] ? (
                <Button variant="ghost" size="sm" onClick={() => setLaneOverride(sel, null)}>
                  <RotateCcw className="size-4" />
                  Reset to built-in
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm">
                <Link to="/genres">View</Link>
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Label"><Input value={effective.label} onChange={(e) => patch({ label: e.target.value })} className="h-10" /></Field>
            <Field label="Also known as"><Input value={effective.aka} onChange={(e) => patch({ aka: e.target.value })} className="h-10" /></Field>
            <Field label="Years"><Input value={effective.years} onChange={(e) => patch({ years: e.target.value })} className="h-10" /></Field>
            <Field label="Default tempo"><Input type="number" value={effective.bpm} onChange={(e) => patch({ bpm: Number(e.target.value) || effective.bpm })} className="h-10 font-mono" /></Field>
          </div>
          <div className="mt-3">
            <Field label="Summary"><Textarea value={effective.summary} onChange={(e) => patch({ summary: e.target.value })} className="min-h-20 text-sm" /></Field>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Kick"><Textarea value={effective.kick} onChange={(e) => patch({ kick: e.target.value })} className="min-h-24 text-sm" /></Field>
            <Field label="Lead"><Textarea value={effective.lead} onChange={(e) => patch({ lead: e.target.value })} className="min-h-24 text-sm" /></Field>
            <Field label="Bass"><Textarea value={effective.bass} onChange={(e) => patch({ bass: e.target.value })} className="min-h-24 text-sm" /></Field>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Lines label="DNA" value={effective.dna} onChange={(v) => patch({ dna: v })} />
            <Lines label="Listen for" value={effective.listenFor} onChange={(v) => patch({ listenFor: v })} />
            <Lines label="Artists" value={effective.artists} onChange={(v) => patch({ artists: v })} />
            <Lines label="Labels" value={effective.labels} onChange={(v) => patch({ labels: v })} />
          </div>
        </Card>

        <Card>
          <Kicker>Analysis targets</Kicker>
          <p className="mt-1 text-xs text-muted">What a finished master in this lane lands on. The analyser scores your track against these and writes the findings from them.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <NumPair label="Tempo" unit="BPM" value={t.bpm} onChange={(v) => setT("bpm", v)} />
            <NumPair label="Loudness" unit="LUFS" step={0.5} value={t.lufs} onChange={(v) => setT("lufs", v)} />
            <NumPair label="Kick tail" unit="share of a beat" step={0.05} value={t.kickTail} onChange={(v) => setT("kickTail", v)} />
            <NumPair label="Kick tail pitch" unit="Hz" value={t.kickHz} onChange={(v) => setT("kickHz", v)} />
            <NumPair label="Crest factor" unit="dB" step={0.5} value={t.crest} onChange={(v) => setT("crest", v)} />
            <NumPair label="Width (side/mid)" unit="dB" step={0.5} value={t.width} onChange={(v) => setT("width", v)} />
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted">Spectral balance · dB relative to the loudest band</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {BAND_KEYS.map((k) => (
              <label key={k} className="flex items-center justify-between gap-2 rounded-lg bg-surface-2 px-3 py-2 text-xs">
                <span className="text-muted">{BAND_LABELS[k]} Hz</span>
                <Input type="number" step={0.5} value={t.bands[k]} onChange={(e) => patch({ targets: { bands: { ...t.bands, [k]: Number(e.target.value) } } as Partial<GenreTargets> })} className="h-9 w-20 font-mono text-xs" aria-label={`${BAND_LABELS[k]} target`} />
              </label>
            ))}
          </div>
        </Card>

        <TemplateEditor template={effective.template} onChange={(template) => patch({ template })} />
      </div>
    </div>
  );
}

const KINDS: SectionTemplate["kind"][] = ["intro", "break", "build", "drop", "mid", "outro"];

function TemplateEditor({ template, onChange }: { template: SectionTemplate[]; onChange: (t: SectionTemplate[]) => void }) {
  const total = template.reduce((n, s) => n + s.bars, 0);
  let bar = 0;
  const strip = template.map((s) => {
    const item = { kind: s.kind, startBar: bar, bars: s.bars, label: s.label };
    bar += s.bars;
    return item;
  });
  const update = (i: number, p: Partial<SectionTemplate>) => onChange(template.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= template.length) return;
    const next = [...template];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Kicker>Arrangement template</Kicker>
          <p className="mt-1 text-xs text-muted">{template.length} sections · {total} bars. Used by the Arrange page and the structure finding.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => onChange([...template, { kind: "drop", label: "New section", bars: 16, do: "" }])}>
          <Plus className="size-4" />
          Add section
        </Button>
      </div>
      <div className="mt-3">
        <SectionStrip sections={strip} totalBars={total} />
      </div>
      <ol className="mt-3 flex flex-col gap-2">
        {template.map((s, i) => (
          <li key={i} className="grid gap-2 rounded-lg bg-surface-2 p-3 sm:grid-cols-[7rem_1fr_5rem_auto]">
            <select value={s.kind} onChange={(e) => update(i, { kind: e.target.value as SectionTemplate["kind"] })} className="h-10 rounded-md bg-bg px-2 text-sm text-foreground shadow-border" aria-label="Section kind">
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <div className="flex flex-col gap-2">
              <Input value={s.label} onChange={(e) => update(i, { label: e.target.value })} className="h-10" aria-label="Section label" />
              <Textarea value={s.do} onChange={(e) => update(i, { do: e.target.value })} className="min-h-16 text-sm" placeholder="What to do in this section" aria-label="Section instructions" />
            </div>
            <Input type="number" min={1} value={s.bars} onChange={(e) => update(i, { bars: Math.max(1, Number(e.target.value) || 1) })} className="h-10 font-mono" aria-label="Bars" />
            <div className="flex gap-1 sm:flex-col">
              <button type="button" onClick={() => move(i, -1)} className="h-9 w-9 rounded-md bg-bg text-muted shadow-border hover:text-foreground" aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="h-9 w-9 rounded-md bg-bg text-muted shadow-border hover:text-foreground" aria-label="Move down">↓</button>
              <button type="button" onClick={() => onChange(template.filter((_, j) => j !== i))} className="h-9 w-9 rounded-md bg-bg text-muted shadow-border hover:text-bad" aria-label="Remove section">×</button>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* analysis                                                            */

function AnalysisTab() {
  const prefs = useHh((s) => s.custom.analysis);
  const patchCustom = useHh((s) => s.patchCustom);
  const set = (p: Partial<typeof prefs>) => patchCustom({ analysis: { ...prefs, ...p } });
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Kicker>Strictness</Kicker>
        <p className="mt-1 text-xs text-muted">How far from a lane target a number can be before it's flagged.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["loose", "normal", "strict"] as const).map((s) => (
            <Chip key={s} active={prefs.strictness === s} onClick={() => set({ strictness: s })}>
              {s}
            </Chip>
          ))}
        </div>
        <p className="mt-2 text-xs text-subtle">Strict flags at 70% of the normal tolerance, loose at 150%.</p>

        <Kicker><span className="mt-6 block">Fix style</span></Kicker>
        <p className="mt-1 text-xs text-muted">Show both approaches on every finding, or only one.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["both", "easy", "hard"] as const).map((s) => (
            <Chip key={s} active={prefs.approach === s} onClick={() => set({ approach: s })}>
              {s === "both" ? "Easy + hard" : s === "easy" ? "Easy way only" : "Hard way only"}
            </Chip>
          ))}
        </div>

        <Kicker><span className="mt-6 block">References under a report</span></Kicker>
        <Input type="number" min={1} max={50} value={prefs.refCount} onChange={(e) => set({ refCount: Math.max(1, Math.min(50, Number(e.target.value) || 6)) })} className="mt-2 h-10 w-24 font-mono" aria-label="Reference count" />
      </Card>
      <Card>
        <Kicker>Finding areas</Kicker>
        <p className="mt-1 text-xs text-muted">Turn off what you don't want to hear about.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FINDING_AREAS.map((a) => (
            <Chip key={a.id} active={prefs.areas[a.id]} onClick={() => set({ areas: { ...prefs.areas, [a.id]: !prefs.areas[a.id] } })}>
              {a.label}
            </Chip>
          ))}
        </div>

        <Kicker><span className="mt-6 block">Lane-fit weights</span></Kicker>
        <p className="mt-1 text-xs text-muted">What counts most when the analyser decides which lane your track is closest to.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {MATCH_WEIGHTS.map((w) => (
            <li key={w.id} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-2 text-xs sm:grid-cols-[9rem_1fr_3rem] sm:gap-3">
              <span className="text-muted">{w.label}</span>
              <input type="range" min={0} max={5} step={0.5} value={prefs.weights[w.id]} onChange={(e) => set({ weights: { ...prefs.weights, [w.id]: Number(e.target.value) } })} aria-label={`${w.label} weight`} className="w-full min-w-0 accent-[var(--color-primary)]" />
              <span className="font-mono text-right tabular-nums text-foreground">{prefs.weights[w.id]}</span>
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" className="mt-3" onClick={() => patchCustom({ analysis: DEFAULT_ANALYSIS })}>
          <RotateCcw className="size-4" />
          Reset analysis settings
        </Button>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* plugins                                                             */

const PIN_ROLES: PluginRole[] = ["eq", "dynamic-eq", "compressor", "multiband", "limiter", "clipper", "saturation", "distortion", "reverb", "delay", "imager", "meter", "synth", "kick", "sampler", "sidechain", "resonance", "transient"];

function PluginsTab() {
  const pins = useHh((s) => s.custom.rolePins);
  const setRolePin = useHh((s) => s.setRolePin);
  const plugins = useHh((s) => s.plugins);
  const prefs = useHh((s) => s.custom.pluginPrefs);
  const setPluginPref = useHh((s) => s.setPluginPref);
  const [drafts, setDrafts] = useState<Partial<Record<PluginRole, string>>>({});
  const suggestions = useMemo(() => {
    const names = new Set<string>();
    plugins.forEach((p) => names.add(p.name));
    PLUGIN_KB.forEach((k) => names.add(k.name));
    return [...names].sort();
  }, [plugins]);
  const ownedFor = (role: PluginRole) => plugins.filter((p) => identify(p.name).roles.includes(role) || prefs[p.name]?.roles?.includes(role)).map((p) => p.name);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Kicker>Pin a plugin to a job</Kicker>
        <p className="mt-1 text-xs text-muted">When a finding needs an EQ, a limiter, a clipper… it names your pinned plugin instead of guessing from the scan. Type any name.</p>
        <datalist id="hh-plugin-names">
          {suggestions.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <ul className="mt-3 flex flex-col gap-2">
          {PIN_ROLES.map((role) => {
            const own = ownedFor(role);
            return (
              <li key={role} className="grid items-center gap-2 sm:grid-cols-[9rem_1fr_auto]">
                <span className="text-xs text-muted">{ROLE_LABEL[role]}</span>
                <Input
                  list="hh-plugin-names"
                  value={drafts[role] ?? pins[role] ?? ""}
                  placeholder={own.length ? `e.g. ${own[0]}` : "not pinned"}
                  onChange={(e) => setDrafts({ ...drafts, [role]: e.target.value })}
                  onBlur={() => {
                    if (drafts[role] !== undefined) {
                      setRolePin(role, drafts[role] || null);
                      setDrafts({ ...drafts, [role]: undefined });
                    }
                  }}
                  className="h-9 text-sm"
                  aria-label={`Pinned ${ROLE_LABEL[role]}`}
                />
                {pins[role] ? (
                  <button type="button" onClick={() => setRolePin(role, null)} className="h-9 text-xs text-subtle hover:text-foreground">
                    clear
                  </button>
                ) : (
                  <span className="text-xs text-subtle">{own.length ? `${own.length} owned` : ""}</span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
      <Card>
        <Kicker>Plugin notes and overrides</Kicker>
        <p className="mt-1 text-xs text-muted">Set on the Plugins page per plugin: favourites float to the top, hidden ones are never named in advice, role overrides fix wrong guesses. This is the list of what you've changed.</p>
        {Object.keys(prefs).length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Nothing yet.{" "}
            <Link to="/plugins" className="underline underline-offset-2 hover:text-foreground">
              Open Plugins
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {Object.entries(prefs).map(([name, p]) => (
              <li key={name} className="flex items-start justify-between gap-3 rounded-lg bg-surface-2 p-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {p.favourite ? "★ " : ""}
                    {name}
                    {p.hidden ? <Tag className="ml-2">hidden</Tag> : null}
                  </p>
                  {p.roles?.length ? <p className="text-xs text-muted">roles: {p.roles.map((r) => ROLE_LABEL[r]).join(", ")}</p> : null}
                  {p.note ? <p className="mt-1 text-xs text-muted">{p.note}</p> : null}
                </div>
                <button type="button" onClick={() => setPluginPref(name, null)} className="shrink-0 text-xs text-subtle hover:text-foreground">
                  reset
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* content                                                             */

function ContentTab() {
  const notes = useHh((s) => s.custom.notes);
  const quotes = useHh((s) => s.custom.quotes);
  const addNote = useHh((s) => s.addNote);
  const updateNote = useHh((s) => s.updateNote);
  const removeNote = useHh((s) => s.removeNote);
  const addQuote = useHh((s) => s.addQuote);
  const removeQuote = useHh((s) => s.removeQuote);
  const [n, setN] = useState({ title: "", body: "", tags: "" });
  const [q, setQ] = useState({ text: "", who: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState({ title: "", body: "", tags: "" });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Kicker>Your notes</Kicker>
        <p className="mt-1 text-xs text-muted">Your own tips and recipes. They show on Learn, rank first in Ask, and go to the AI coach as context.</p>
        <div className="mt-3 flex flex-col gap-2">
          <Input value={n.title} onChange={(e) => setN({ ...n, title: e.target.value })} placeholder="Title, e.g. My kick chain" className="h-10" />
          <Textarea value={n.body} onChange={(e) => setN({ ...n, body: e.target.value })} placeholder="The note" className="min-h-24 text-sm" />
          <div className="flex gap-2">
            <Input value={n.tags} onChange={(e) => setN({ ...n, tags: e.target.value })} placeholder="tags, comma separated" className="h-10" />
            <Button
              onClick={() => {
                if (!n.title.trim()) return;
                addNote({ title: n.title.trim(), body: n.body.trim(), tags: n.tags.split(",").map((x) => x.trim()).filter(Boolean) });
                setN({ title: "", body: "", tags: "" });
              }}
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg bg-surface-2 p-3">
              {editing === note.id ? (
                <div className="flex flex-col gap-2">
                  <Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className="h-9" />
                  <Textarea value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} className="min-h-20 text-sm" />
                  <Input value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} className="h-9" placeholder="tags" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { updateNote({ ...note, title: edit.title.trim() || note.title, body: edit.body, tags: edit.tags.split(",").map((x) => x.trim()).filter(Boolean) }); setEditing(null); }}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <H3>{note.title}</H3>
                    <div className="flex shrink-0 gap-2 text-xs">
                      <button type="button" className="text-subtle hover:text-foreground" onClick={() => { setEditing(note.id); setEdit({ title: note.title, body: note.body, tags: note.tags.join(", ") }); }}>
                        edit
                      </button>
                      <button type="button" className="text-subtle hover:text-bad" onClick={() => removeNote(note.id)}>
                        delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{note.body}</p>
                  {note.tags.length ? <p className="mt-1 text-xs text-subtle">{note.tags.join(" · ")}</p> : null}
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <Kicker>Your sayings</Kicker>
        <p className="mt-1 text-xs text-muted">Show up with the built-in studio sayings on the home page, Ask and Learn.</p>
        <div className="mt-3 flex flex-col gap-2">
          <Input value={q.text} onChange={(e) => setQ({ ...q, text: e.target.value })} placeholder="The saying" className="h-10" />
          <div className="flex gap-2">
            <Input value={q.who} onChange={(e) => setQ({ ...q, who: e.target.value })} placeholder="Who said it (you, a mate, a forum)" className="h-10" />
            <Button
              onClick={() => {
                if (!q.text.trim()) return;
                addQuote({ text: q.text.trim(), who: q.who.trim() || "You" });
                setQ({ text: "", who: "" });
              }}
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {quotes.map((qu) => (
            <li key={qu.id} className="flex items-start justify-between gap-3 rounded-lg bg-surface-2 p-3">
              <div>
                <p className="font-display text-base leading-snug tracking-wide text-foreground">“{qu.text}”</p>
                <p className="mt-1 text-xs text-muted">{qu.who}</p>
              </div>
              <button type="button" className="shrink-0 text-xs text-subtle hover:text-bad" onClick={() => removeQuote(qu.id)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* appearance                                                          */

const ACCENTS = ["#e8e2d6", "#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#9085e9", "#e66767"];

function AppearanceTab() {
  const ap = useHh((s) => s.custom.appearance);
  const patchCustom = useHh((s) => s.patchCustom);
  const set = (p: Partial<Appearance>) => patchCustom({ appearance: { ...ap, ...p } });
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Kicker>Accent colour</Kicker>
        <p className="mt-1 text-xs text-muted">Primary buttons and active chips.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ACCENTS.map((c) => (
            <button key={c} type="button" aria-label={`Accent ${c}`} onClick={() => set({ accent: c === "#e8e2d6" ? null : c })} className={`size-9 rounded-full ${(ap.accent ?? "#e8e2d6") === c ? "ring-2 ring-foreground ring-offset-2 ring-offset-bg" : ""}`} style={{ background: c }} />
          ))}
          <input type="color" value={ap.accent ?? "#e8e2d6"} onChange={(e) => set({ accent: e.target.value })} aria-label="Custom accent" className="h-9 w-12 cursor-pointer rounded-md bg-surface-2" />
        </div>
        <Kicker><span className="mt-6 block">Chart colour for your track</span></Kicker>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ACCENTS.slice(1).map((c) => (
            <button key={c} type="button" aria-label={`Series ${c}`} onClick={() => set({ series: c === "#3987e5" ? null : c })} className={`size-9 rounded-full ${(ap.series ?? "#3987e5") === c ? "ring-2 ring-foreground ring-offset-2 ring-offset-bg" : ""}`} style={{ background: c }} />
          ))}
          <input type="color" value={ap.series ?? "#3987e5"} onChange={(e) => set({ series: e.target.value })} aria-label="Custom series colour" className="h-9 w-12 cursor-pointer rounded-md bg-surface-2" />
        </div>
        <p className="mt-2 text-xs text-subtle">The lane-target series stays orange so the two never collide.</p>
      </Card>
      <Card>
        <Kicker>Type and density</Kicker>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={ap.font === "display"} onClick={() => set({ font: "display" })}>
            Display headings
          </Chip>
          <Chip active={ap.font === "plain"} onClick={() => set({ font: "plain" })}>
            Plain headings
          </Chip>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={ap.density === "comfortable"} onClick={() => set({ density: "comfortable" })}>
            Comfortable
          </Chip>
          <Chip active={ap.density === "compact"} onClick={() => set({ density: "compact" })}>
            Compact
          </Chip>
        </div>
        <Kicker><span className="mt-6 block">Report cards</span></Kicker>
        <p className="mt-1 text-xs text-muted">Which blocks appear on an analysis report.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["fit", "Lane fit"],
              ["spectrum", "Spectrum"],
              ["structure", "Structure"],
              ["refs", "References"],
              ["serum", "Serum advice"],
              ["laneNotes", "Lane notes"],
            ] as const
          ).map(([k, label]) => (
            <Chip key={k} active={ap.reportCards[k]} onClick={() => set({ reportCards: { ...ap.reportCards, [k]: !ap.reportCards[k] } })}>
              {label}
            </Chip>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => patchCustom({ appearance: DEFAULT_APPEARANCE })}>
          <RotateCcw className="size-4" />
          Reset appearance
        </Button>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* backup                                                              */

function BackupTab() {
  const custom = useHh((s) => s.custom);
  const setCustom = useHh((s) => s.setCustom);
  const resetCustom = useHh((s) => s.resetCustom);
  const plugins = useHh((s) => s.plugins);
  const daw = useHh((s) => s.daw);
  const addedRefs = useHh((s) => s.addedRefs);
  const removedRefs = useHh((s) => s.removedRefs);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState(false);
  const n = countCustomisations(custom);

  const download = (full: boolean) => {
    const text = full
      ? JSON.stringify({ app: "hardstyle-helper", exportedAt: new Date().toISOString(), custom, daw, plugins, addedRefs, removedRefs }, null, 2)
      : exportCustom(custom);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = full ? "hardstyle-helper-backup.json" : "hardstyle-helper-customisation.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <Kicker>Export</Kicker>
        <p className="mt-1 text-xs text-muted">Move your setup to another machine, share a lane profile, or keep a backup. {n} customisation{n === 1 ? "" : "s"} active.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => download(false)}>
            <Download className="size-4" />
            Customisation only
          </Button>
          <Button variant="outline" onClick={() => download(true)}>
            <Download className="size-4" />
            Everything (plugins, refs, DAW)
          </Button>
        </div>
      </Card>
      <Card>
        <Kicker>Import</Kicker>
        <p className="mt-1 text-xs text-muted">A file exported here. Replaces your customisation; plugin scans and reference edits in a full backup are restored too.</p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try {
              const text = await f.text();
              const raw = JSON.parse(text) as Record<string, unknown>;
              setCustom(importCustom(text));
              const st = useHh.getState();
              if (Array.isArray(raw.plugins)) st.setPlugins(raw.plugins as typeof plugins);
              if (typeof raw.daw === "string") st.setDaw(raw.daw as typeof daw);
              if (Array.isArray(raw.addedRefs)) for (const r of raw.addedRefs as typeof addedRefs) st.addRef(r);
              if (Array.isArray(raw.removedRefs)) for (const id of raw.removedRefs as string[]) st.removeRef(id);
              toast("Imported.");
            } catch {
              toast("That file isn't a Hardstyle Helper export.");
            }
          }}
        />
        <Button variant="outline" className="mt-3" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" />
          Choose a file
        </Button>
        <Kicker><span className="mt-6 block">Reset</span></Kicker>
        <p className="mt-1 text-xs text-muted">Back to the built-in lanes, settings and looks. Plugin scans, reference edits and your last report stay.</p>
        {confirm ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { resetCustom(); setConfirm(false); toast("Customisation reset."); }}>
              Yes, reset everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="ghost" className="mt-3" onClick={() => setConfirm(true)}>
            <RotateCcw className="size-4" />
            Reset all customisation
          </Button>
        )}
      </Card>
    </div>
  );
}
