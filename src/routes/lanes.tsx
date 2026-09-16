import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ARTISTS, GENRES, searchArtists, type GenreId } from "@/lib/hs-catalog";
import { useVs } from "@/lib/vs-store";
import { GenreChips, Page, PageTitle, SearchField } from "@/components/site-ui";

export const Route = createFileRoute("/lanes")({
  component: LanesPage,
  head: () => ({ meta: [{ title: "Lanes · VOCAL SOURCE" }] }),
});

function LanesPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const genre = useVs((s) => s.genre);
  const setGenre = useVs((s) => s.setGenre);
  const pickArtist = useVs((s) => s.pickArtist);

  const hits = useMemo(() => searchArtists(q, genre), [q, genre]);
  const grouped = useMemo(() => {
    const map = new Map<GenreId, typeof ARTISTS>();
    for (const g of GENRES) map.set(g.id, []);
    for (const a of hits) map.get(a.genre)?.push(a);
    return GENRES.map((g) => ({ ...g, acts: map.get(g.id) ?? [] })).filter((g) => g.acts.length);
  }, [hits]);

  return (
    <Page>
      <PageTitle
        kicker="Production lanes"
        title="500 hard-dance acts"
        lede="These are what you write into — not what you sample. Tap an act to lock the lane and roll a vocal against it."
      />
      <div className="mb-8 flex flex-col gap-3">
        <SearchField value={q} onChange={setQ} placeholder="Search acts" />
        <GenreChips value={genre} onChange={(id) => setGenre(id, false)} />
      </div>
      <p className="mb-6 text-sm text-muted">
        {hits.length} of {ARTISTS.length} acts
      </p>
      <div className="flex flex-col gap-10">
        {grouped.map((g) => (
          <section key={g.id}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl tracking-wide text-foreground">{g.label}</h2>
              <p className="font-mono text-xs tabular-nums text-subtle">
                {g.acts.length} · {g.bpm} BPM
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {g.acts.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => {
                      pickArtist(a);
                      void navigate({ to: "/studio" });
                    }}
                    className="inline-flex h-11 items-center rounded-full bg-surface px-3 text-xs text-foreground shadow-border transition-[background-color] duration-150 hover:bg-surface-2"
                  >
                    {a.name}
                    <span className="ml-1.5 text-subtle">{a.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {hits.length === 0 ? (
        <p className="rounded-xl bg-surface p-8 text-sm text-muted shadow-border">No acts in that filter.</p>
      ) : null}
    </Page>
  );
}
