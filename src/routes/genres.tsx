import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, RotateCcw, X } from "lucide-react";
import { BAND_KEYS, BAND_LABELS } from "@/lib/hh/dsp";
import { findGenre } from "@/lib/hh/customise";
import type { HhGenreId } from "@/lib/hh/genres";
import type { RefTrack } from "@/lib/hh/refs";
import { useHh, useLanes } from "@/lib/hh/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, PageTitle, SearchField } from "@/components/site-ui";
import { Bullets, Card, H2, H3, Kicker, LaneChips, Stat, Tag } from "@/components/hh-ui";

export const Route = createFileRoute("/genres")({
  component: GenresPage,
  head: () => ({ meta: [{ title: "Genres · HARDSTYLE HELPER" }] }),
});

function GenresPage() {
  const [lane, setLane] = useState<HhGenreId>("classic");
  const [q, setQ] = useState("");
  const ready = useHh((s) => s.ready);
  const removed = useHh((s) => s.removedRefs);
  const added = useHh((s) => s.addedRefs);
  const removeRef = useHh((s) => s.removeRef);
  const restoreRef = useHh((s) => s.restoreRef);
  const addRef = useHh((s) => s.addRef);
  const report = useHh((s) => s.report);
  const refsAll = useHh((s) => s.refs);
  const lanes = useLanes();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ artist: "", title: "", year: "", bpm: "", note: "" });

  useEffect(() => {
    if (report?.target) setLane(report.target);
  }, [report?.target]);

  const g = findGenre(lanes, lane);
  const refs = useMemo(() => {
    const all = refsAll().filter((r) => r.genre === lane);
    const ql = q.trim().toLowerCase();
    return ql ? all.filter((r) => `${r.artist} ${r.title} ${r.note}`.toLowerCase().includes(ql)) : all;
  }, [lane, q, refsAll, removed, added]); // eslint-disable-line react-hooks/exhaustive-deps
  const removedHere = removed.filter((id) => id.startsWith(`${lane}-`));

  const submit = () => {
    if (!form.artist.trim() || !form.title.trim()) return;
    const id = `${lane}-user-${Date.now()}`;
    const r: RefTrack = {
      id,
      genre: lane,
      artist: form.artist.trim(),
      title: form.title.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      bpm: Number(form.bpm) || g.bpm,
      note: form.note.trim() || "Added by you.",
    };
    addRef(r);
    setForm({ artist: "", title: "", year: "", bpm: "", note: "" });
    setAdding(false);
  };

  return (
    <Page>
      <PageTitle
        kicker="Ten lanes"
        title="Genres and references"
        lede="Every lane has a sonic target the analyser scores against and fifty reference tracks to learn from. Years and BPMs are approximate — edit the list to make it yours."
      />
      <div className="mb-6">
        <LaneChips value={lane} onChange={(v) => v !== "auto" && setLane(v)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <Kicker>
              {g.aka} · {g.years}
            </Kicker>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <H2>{g.label}</H2>
              <Link to="/customise" search={{ tab: "lanes", lane: g.id }} className="inline-flex h-9 items-center rounded-md bg-surface-2 px-3 text-xs text-muted shadow-border hover:text-foreground">
                Edit this lane
              </Link>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{g.summary}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Tempo" value={`${g.targets.bpm[0]}–${g.targets.bpm[1]}`} sub="BPM" />
              <Stat label="Loudness" value={`${g.targets.lufs[0]} to ${g.targets.lufs[1]}`} sub="LUFS integrated" />
              <Stat label="Kick tail" value={`${Math.round(g.targets.kickTail[0] * 100)}–${Math.round(g.targets.kickTail[1] * 100)}%`} sub="of a beat" />
              <Stat label="Tail pitch" value={`${g.targets.kickHz[0]}–${g.targets.kickHz[1]} Hz`} sub="≈ F1–B1" />
            </div>
          </Card>

          <Card>
            <H3>DNA</H3>
            <Bullets items={g.dna} className="mt-3" />
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Kick", g.kick],
              ["Lead", g.lead],
              ["Bass", g.bass],
            ].map(([t, b]) => (
              <Card key={t}>
                <H3>{t}</H3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b}</p>
              </Card>
            ))}
          </div>

          <Card>
            <H3>Spectral target</H3>
            <p className="mt-1 text-xs text-muted">dB relative to the loudest band, measured on finished masters.</p>
            <ul className="mt-3 space-y-2">
              {BAND_KEYS.map((k) => {
                const v = g.targets.bands[k];
                const w = Math.max(4, 100 + v * 3.5);
                return (
                  <li key={k} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-3 text-xs">
                    <span className="text-muted">{BAND_LABELS[k]} Hz</span>
                    <span className="h-2 rounded-full bg-surface-3">
                      <span className="block h-2 rounded-full bg-foreground/70" style={{ width: `${w}%` }} />
                    </span>
                    <span className="font-mono tabular-nums text-foreground">{v > 0 ? "+" : ""}{v}</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <H3>Arrangement</H3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.arrangement}</p>
            <ol className="mt-3 flex flex-wrap gap-1.5">
              {g.template.map((s, i) => (
                <li key={i} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-foreground">
                  {s.label} <span className="font-mono text-subtle">{s.bars}</span>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/arrange" search={{ lane }}>
                Generate a {g.label} arrangement
              </Link>
            </Button>
          </Card>

          <Card>
            <H3>Listen for</H3>
            <Bullets items={g.listenFor} className="mt-3" />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <H3>Artists</H3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.artists.join(", ")}</p>
            <H3 className="mt-4">Labels</H3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.labels.join(", ")}</p>
            <H3 className="mt-4">Events</H3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.events.join(", ")}</p>
          </Card>
          <Card>
            <H3>All lanes at a glance</H3>
            <table className="mt-3 w-full text-xs">
              <thead>
                <tr className="text-left text-subtle">
                  <th className="pb-1 font-medium">Lane</th>
                  <th className="pb-1 font-medium">BPM</th>
                  <th className="pb-1 font-medium">Tail</th>
                  <th className="pb-1 font-medium">LUFS</th>
                </tr>
              </thead>
              <tbody>
                {lanes.map((x) => (
                  <tr key={x.id} className={x.id === lane ? "text-foreground" : "text-muted"}>
                    <td className="py-1">
                      <button type="button" onClick={() => setLane(x.id)} className="text-left hover:text-foreground">
                        {x.label}
                      </button>
                    </td>
                    <td className="py-1 font-mono tabular-nums">{x.targets.bpm[0]}–{x.targets.bpm[1]}</td>
                    <td className="py-1 font-mono tabular-nums">{Math.round(x.targets.kickTail[0] * 100)}–{Math.round(x.targets.kickTail[1] * 100)}%</td>
                    <td className="py-1 font-mono tabular-nums">{x.targets.lufs[0]}…{x.targets.lufs[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Kicker>Reference list</Kicker>
            <H2 className="mt-2">
              {refs.length} {g.label} tracks
            </H2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              A listening list assembled from memory, not a database — verify titles and years before quoting them, and swap in your own references.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAdding((v) => !v)}>
              <Plus className="size-4" />
              Add a track
            </Button>
          </div>
        </div>
        <div className="mt-4 max-w-md">
          <SearchField value={q} onChange={setQ} placeholder="Search this lane" />
        </div>

        {adding ? (
          <Card className="mt-4">
            <div className="grid gap-2 sm:grid-cols-5">
              <Input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Year" inputMode="numeric" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              <Input placeholder="BPM" inputMode="numeric" value={form.bpm} onChange={(e) => setForm({ ...form, bpm: e.target.value })} />
              <Input placeholder="What to learn from it" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={submit}>
                Save to this lane
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        ) : null}

        {!ready ? <p className="mt-4 text-sm text-muted">Loading…</p> : null}
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {refs.map((r, i) => (
            <li key={r.id} className="group flex gap-3 rounded-xl bg-surface p-3 shadow-border">
              <span className="font-mono w-6 shrink-0 pt-0.5 text-xs tabular-nums text-subtle">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-foreground">{r.title}</p>
                <p className="text-xs text-muted">
                  {r.artist} · <span className="font-mono tabular-nums">{r.year}</span> · <span className="font-mono tabular-nums">{r.bpm} BPM</span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{r.note}</p>
                {r.id.includes("-user-") ? <Tag className="mt-2">Yours</Tag> : null}
              </div>
              <button
                type="button"
                aria-label={`Remove ${r.title}`}
                onClick={() => removeRef(r.id)}
                className="h-11 w-8 shrink-0 text-subtle opacity-60 hover:text-foreground hover:opacity-100"
              >
                <X className="mx-auto size-4" />
              </button>
            </li>
          ))}
        </ol>
        {removedHere.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{removedHere.length} removed from this lane.</span>
            {removedHere.map((id) => (
              <button key={id} type="button" onClick={() => restoreRef(id)} className="inline-flex h-9 items-center gap-1 rounded-md bg-surface-2 px-2 shadow-border hover:text-foreground">
                <RotateCcw className="size-3" />
                {id.replace(`${lane}-`, "").replace(/-/g, " ")}
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </Page>
  );
}
