import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mic2 } from "lucide-react";
import { useVs } from "@/lib/vs-store";
import { Button } from "@/components/ui/button";
import { Page, PageTitle } from "@/components/site-ui";
import { toast } from "sonner";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
  head: () => ({ meta: [{ title: "Saved · VOCAL SOURCE" }] }),
});

function SavedPage() {
  const navigate = useNavigate();
  const ready = useVs((s) => s.ready);
  const saved = useVs((s) => s.saved);
  const openSaved = useVs((s) => s.openSaved);
  const copyIdea = useVs((s) => s.copyIdea);
  const removeSaved = useVs((s) => s.removeSaved);

  return (
    <Page narrow>
      <PageTitle
        kicker="This device"
        title="Saved ideas"
        lede="Kept in this browser only. Open one to keep rolling from it."
      />
      {!ready ? <p className="text-sm text-muted">Loading saved ideas…</p> : null}
      {ready && !saved.length ? (
        <div className="rounded-xl bg-surface px-5 py-12 text-center shadow-border">
          <Mic2 className="mx-auto size-6 text-subtle" />
          <p className="mt-3 text-sm text-muted">Nothing saved yet.</p>
          <Button asChild className="mt-6">
            <Link to="/studio">Roll an idea</Link>
          </Button>
        </div>
      ) : null}
      {ready && saved.length ? (
        <ul className="flex flex-col gap-2">
          {saved.map((item) => (
            <li
              key={item.seed}
              className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-border sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => {
                  openSaved(item);
                  void navigate({ to: "/studio" });
                }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="font-display text-lg tracking-wide text-foreground">{item.title}</p>
                <p className="truncate text-xs text-muted">
                  {item.artist.name} · {item.vocal.artist} — {item.vocal.title} ({item.vocal.year})
                </p>
              </button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void copyIdea(item).then((ok) => toast(ok ? "Notes copied" : "Could not copy"))}
                >
                  Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeSaved(item)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </Page>
  );
}
