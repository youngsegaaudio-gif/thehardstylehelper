import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { searchVocals } from "@/lib/hs-catalog";
import { useVs } from "@/lib/vs-store";
import { Button } from "@/components/ui/button";
import { EraChips, Page, PageTitle, SearchField, StyleChips, VocalCard } from "@/components/site-ui";

export const Route = createFileRoute("/catalog")({
  component: CatalogPage,
  head: () => ({ meta: [{ title: "Catalog · VOCAL SOURCE" }] }),
});

const PAGE = 36;

function CatalogPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const era = useVs((s) => s.era);
  const setEra = useVs((s) => s.setEra);
  const style = useVs((s) => s.style);
  const setStyle = useVs((s) => s.setStyle);
  const nicheOnly = useVs((s) => s.nicheOnly);
  const setNiche = useVs((s) => s.setNiche);
  const pickVocal = useVs((s) => s.pickVocal);
  const [shown, setShown] = useState(PAGE);

  const hits = useMemo(() => searchVocals(q, era, nicheOnly, style), [q, era, nicheOnly, style]);

  useEffect(() => {
    setShown(PAGE);
  }, [q, era, nicheOnly, style]);

  const visible = hits.slice(0, shown);

  return (
    <Page>
      <PageTitle
        kicker="The catalog"
        title="Source vocals"
        lede="Songs people chop into hardstyle. Not hardstyle records. Tap a title to roll it into a production lane."
      />
      <div className="mb-8 flex flex-col gap-3">
        <SearchField value={q} onChange={setQ} placeholder="Search songs, artists, styles" />
        <StyleChips value={style} onChange={setStyle} />
        <EraChips era={era} nicheOnly={nicheOnly} onEra={setEra} onNiche={() => setNiche(!nicheOnly)} />
      </div>
      <p className="mb-4 text-sm text-muted">
        {hits.length} vocals
        {style !== "all" ? ` in ${style}` : ""}
        {era !== "all" ? ` · ${era}` : ""}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((v) => (
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
      {hits.length === 0 ? (
        <p className="rounded-xl bg-surface p-8 text-sm text-muted shadow-border">
          Nothing in that filter. Clear search or switch era.
        </p>
      ) : null}
      {shown < hits.length ? (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setShown((n) => n + PAGE)}>
            Show more · {hits.length - shown} left
          </Button>
        </div>
      ) : null}
    </Page>
  );
}
