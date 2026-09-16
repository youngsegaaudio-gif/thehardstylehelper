import { createFileRoute, Link } from "@tanstack/react-router";
import { GENRE_LABEL } from "@/lib/hs-catalog";
import { useVs } from "@/lib/vs-store";
import { IdeaCard } from "@/components/idea-card";
import { GenreChips, Page, PageTitle, SearchField } from "@/components/site-ui";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () => ({ meta: [{ title: "Studio · VOCAL SOURCE" }] }),
});

function StudioPage() {
  const idea = useVs((s) => s.idea);
  const q = useVs((s) => s.q);
  const setQ = useVs((s) => s.setQ);
  const genre = useVs((s) => s.genre);
  const setGenre = useVs((s) => s.setGenre);

  return (
    <Page narrow>
      <PageTitle
        kicker="Studio"
        title="Roll an idea"
        lede="A vocal from the catalog, mapped onto a hard-dance lane. 16-bar DJ phrases, 90% of the time. Lock a genre below or set your sound first."
      />
      <div className="mb-6 flex flex-col gap-3">
        <SearchField value={q} onChange={setQ} placeholder="Filter the next roll" />
        <GenreChips value={genre} onChange={(id) => setGenre(id, id !== "all")} />
        <p className="text-xs text-subtle">
          {genre !== "all" ? `Next roll stays in ${GENRE_LABEL[genre]}. ` : "Any lane. "}
          <Link to="/sound" className="text-muted underline-offset-2 hover:text-foreground hover:underline">
            Lock kick, bass, hook
          </Link>
        </p>
      </div>
      <IdeaCard idea={idea} />
    </Page>
  );
}
