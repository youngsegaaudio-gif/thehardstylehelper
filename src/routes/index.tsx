import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, AudioWaveform, BookOpen, FolderSearch, LayoutList, MessageSquare, SlidersHorizontal, Waves, Music } from "lucide-react";
import { findGenre } from "@/lib/hh/customise";
import { QUOTES } from "@/lib/hh/knowledge";
import { PLUGIN_KB } from "@/lib/hh/plugins-kb";
import { useHh, useLanes } from "@/lib/hh/store";
import { VOCALS } from "@/lib/hs-catalog";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/site-ui";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: "HARDSTYLE HELPER" }] }),
});

const FEATURES = [
  { to: "/analyse" as const, icon: AudioWaveform, t: "Analyse your track", d: "Drop a bounce. Tempo, key, kick tail and pitch, loudness, spectrum, width, structure — scored against ten lanes and turned into fixes." },
  { to: "/genres" as const, icon: LayoutList, t: "Ten lanes, 500 references", d: "Early, classic, euphoric, raw, xtra raw, rawphoric, psy, hardcore, uptempo, frenchcore. Targets and fifty tracks each." },
  { to: "/plugins" as const, icon: FolderSearch, t: "Scan your plugins", d: "Point it at your plugin folder. Every plugin explained: what it is, how hardstyle uses it, easy and hard moves. Advice then uses what you own." },
  { to: "/mix" as const, icon: SlidersHorizontal, t: "Mixing & mastering", d: "Kick, bass, leads, drums, vocals, FX, buses, master — the easy way, the hard way, and the methods people use." },
  { to: "/serum" as const, icon: Waves, t: "Serum & filters", d: "Init-patch recipes for leads, screeches, tails, reverse bass, psy bass, bounce. Filter types and filter rules." },
  { to: "/arrange" as const, icon: Music, t: "Arrangements", d: "Bar-by-bar plans per lane in extended, radio or DJ form, with what to do in every section. Export text or MIDI markers." },
  { to: "/ask" as const, icon: MessageSquare, t: "Ask anything", d: "Search everything the helper knows, or ask the AI coach with your scan and last analysis as context." },
  { to: "/learn" as const, icon: BookOpen, t: "Learn", d: "History, glossary, labels, events, FAQ and the sayings producers repeat." },
];

function Home() {
  const report = useHh((s) => s.report);
  const pluginCount = useHh((s) => s.plugins.length);
  const ownQuotes = useHh((s) => s.custom.quotes);
  const lanes = useLanes();
  const pool = ownQuotes.length ? [...ownQuotes, ...QUOTES] : QUOTES;
  const quote = pool[new Date().getDate() % pool.length];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="hs-staff pointer-events-none absolute inset-x-0 top-10 h-16 opacity-30" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
          <Eyebrow>
            {lanes.length} lanes · 500 references · {PLUGIN_KB.length} plugins known
          </Eyebrow>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-none tracking-wide text-foreground sm:text-6xl">
            Analyse your track. Get told what to fix.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A hardstyle session coach. It listens to your bounce, scores it against ten lanes, scans the plugins on your computer, and gives you the easy fix and the hard fix for every finding.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 font-display tracking-wide">
              <Link to="/analyse">
                Analyse a track
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12">
              <Link to="/plugins">{pluginCount ? `Your ${pluginCount} plugins` : "Scan your plugins"}</Link>
            </Button>
          </div>
        </div>
      </section>

      {report ? (
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <Eyebrow>Last analysis</Eyebrow>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{report.summary}</p>
            <Link to="/analyse" className="mt-3 inline-flex h-11 items-center text-sm text-muted underline-offset-2 hover:text-foreground hover:underline">
              Open the report — judged against {findGenre(lanes, report.target).label} →
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <li key={f.to}>
              <Link to={f.to} className="flex h-full flex-col rounded-xl bg-surface p-4 shadow-border transition-[background-color,box-shadow] duration-150 hover:bg-surface-2 hover:shadow-border-hover">
                <f.icon className="size-5 text-muted" />
                <p className="font-display mt-3 text-lg leading-tight tracking-wide text-foreground">{f.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 sm:py-16">
          {[
            { n: "01", t: "Bounce it", d: "Export a WAV or MP3 of the whole track or just a drop. Nothing is uploaded — analysis runs in your browser." },
            { n: "02", t: "Read the findings", d: "Fix / check / good on tempo, kick, low end, mids, highs, loudness, dynamics, width, key and structure — with the lane's numbers next to yours." },
            { n: "03", t: "Do the easy or the hard fix", d: "Each finding names the plugins you own for the job, the Serum patch when one applies, and the closest references to listen to." },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-mono text-xs tabular-nums text-subtle">{s.n}</p>
              <h3 className="font-display mt-2 text-xl tracking-wide text-foreground">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Eyebrow>The lanes</Eyebrow>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {lanes.map((g) => (
            <li key={g.id}>
              <Link to="/genres" className="block rounded-xl bg-surface p-4 shadow-border transition-[background-color] duration-150 hover:bg-surface-2">
                <p className="font-display text-base tracking-wide text-foreground">{g.label}</p>
                <p className="mt-1 font-mono text-xs tabular-nums text-muted">
                  {g.targets.bpm[0]}–{g.targets.bpm[1]} BPM · {g.years}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-16">
          <div>
            <Eyebrow>Studio saying</Eyebrow>
            <p className="font-display mt-3 text-2xl leading-snug tracking-wide text-foreground">“{quote.text}”</p>
            <p className="mt-2 text-sm text-muted">{quote.who}</p>
          </div>
          <div>
            <Eyebrow>Also here</Eyebrow>
            <p className="font-display mt-3 text-2xl leading-snug tracking-wide text-foreground">Vocal source</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {VOCALS.length} vocals people chop into hardstyle, mapped onto production lanes with the idea roller.
            </p>
            <Link to="/catalog" className="mt-3 inline-flex h-11 items-center text-sm text-muted underline-offset-2 hover:text-foreground hover:underline">
              Browse the vocal catalog →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
