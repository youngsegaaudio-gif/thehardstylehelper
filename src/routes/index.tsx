import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ARTISTS, GENRES, VOCALS, VOCAL_STYLES } from "@/lib/hs-catalog";
import { FEATURED, useVs } from "@/lib/vs-store";
import { Button } from "@/components/ui/button";
import { Eyebrow, VocalCard } from "@/components/site-ui";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: "VOCAL SOURCE" }] }),
});

function Home() {
  const navigate = useNavigate();
  const pickVocal = useVs((s) => s.pickVocal);
  const setStyle = useVs((s) => s.setStyle);
  const setGenre = useVs((s) => s.setGenre);
  const cover = FEATURED[0];
  const rest = FEATURED.slice(1, 7);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="hs-staff pointer-events-none absolute inset-x-0 top-10 h-16 opacity-30" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
          <Eyebrow>
            {VOCALS.length} sample vocals · {ARTISTS.length} lanes · 90s–now
          </Eyebrow>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-none tracking-wide text-foreground sm:text-6xl">
            Vocals people chop into hardstyle.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Not hardstyle tracks. Eurodance, house, trance, 90s happy, hands-up — titles
            and years. You source and clear the chop.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 font-display tracking-wide">
              <Link to="/catalog">
                Browse the catalog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12">
              <Link to="/studio">Open the studio</Link>
            </Button>
          </div>
        </div>
      </section>

      {cover ? (
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl content-start items-start gap-5 px-4 py-10 sm:grid-cols-2 sm:items-end sm:gap-10 sm:px-6 sm:py-16">
            <div>
              <Eyebrow>Cover cut</Eyebrow>
              <p className="font-mono mt-3 text-xs tabular-nums text-subtle">{cover.year}</p>
              <h2 className="font-display mt-2 text-3xl leading-none tracking-wide text-foreground sm:text-5xl">
                {cover.title}
              </h2>
              <p className="mt-3 text-sm text-muted">{cover.artist}</p>
            </div>
            <div>
              <p className="text-base leading-relaxed text-foreground">{cover.why}</p>
              <p className="mt-2 text-sm text-muted">
                {cover.from} · {cover.chop} · the kind of vocal a hardstyle break actually wants.
              </p>
              <Button
                className="mt-6"
                onClick={() => {
                  pickVocal(cover);
                  void navigate({ to: "/studio" });
                }}
              >
                Roll this into a track
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>From the catalog</Eyebrow>
            <h2 className="font-display mt-2 text-2xl tracking-wide text-foreground sm:text-3xl">
              Cuts people actually sample
            </h2>
          </div>
          <Link to="/catalog" className="hidden text-sm text-muted hover:text-foreground sm:inline">
            All {VOCALS.length} →
          </Link>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((v) => (
            <li key={v.id}>
              <VocalCard
                v={v}
                onPick={(picked) => {
                  pickVocal(picked);
                  void navigate({ to: "/studio" });
                }}
              />
            </li>
          ))}
        </ul>
        <Link to="/catalog" className="mt-6 inline-flex h-11 items-center text-sm text-muted hover:text-foreground sm:hidden">
          All {VOCALS.length} vocals →
        </Link>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 sm:py-16">
          {[
            {
              n: "01",
              t: "Find a vocal",
              d: "Browse eurodance, house, trance, 90s happy. Tap a title. No lyrics, no audio — just what to look for.",
            },
            {
              n: "02",
              t: "Roll a lane",
              d: "Studio maps it onto a hard-dance act: kick, bass, hook, 16-bar DJ phrases. 90% of rolls stay 4×4.",
            },
            {
              n: "03",
              t: "Source it yourself",
              d: "YouTube and Discogs search the title and year. You sample and clear it. This is a starting point, not a pack.",
            },
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
        <Eyebrow>Styles in the pile</Eyebrow>
        <h2 className="font-display mt-2 text-2xl tracking-wide text-foreground sm:text-3xl">
          Filter the catalog
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {VOCAL_STYLES.map((s) => (
            <li key={s.id}>
              <Link
                to="/catalog"
                onClick={() => setStyle(s.id)}
                className="inline-flex h-11 items-center rounded-full bg-surface px-4 text-sm text-foreground shadow-border hover:bg-surface-2"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Write into these</Eyebrow>
              <h2 className="font-display mt-2 text-2xl tracking-wide text-foreground sm:text-3xl">
                500 production lanes
              </h2>
            </div>
            <Link to="/lanes" className="text-sm text-muted hover:text-foreground">
              All lanes →
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {GENRES.map((g) => {
              const n = ARTISTS.filter((a) => a.genre === g.id).length;
              return (
                <li key={g.id}>
                  <Link
                    to="/lanes"
                    onClick={() => setGenre(g.id, false)}
                    className="block rounded-xl bg-surface p-4 shadow-border transition-[background-color] duration-150 hover:bg-surface-2"
                  >
                    <p className="font-display text-lg tracking-wide text-foreground">{g.label}</p>
                    <p className="mt-1 font-mono text-xs tabular-nums text-muted">
                      {n} acts · {g.bpm} BPM
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
