import { Bookmark, BookmarkCheck, Copy, Disc3, ExternalLink, RotateCw, Settings2, Unlock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { GENRE_LABEL } from "@/lib/hs-catalog";
import { barsOf, discogsSearch, youtubeSearch, type Idea, type Phrase, type PhraseKind } from "@/lib/hs-ideas";
import { useVs, youLocked } from "@/lib/vs-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Meta } from "@/components/site-ui";

const FILL: Record<PhraseKind, string> = {
  intro: "bg-section-intro",
  break: "bg-section-break",
  build: "bg-section-build",
  drop: "bg-section-drop",
  outro: "bg-section-outro",
};

function PhraseStrip({ phrases, mode }: { phrases: Phrase[]; mode: "dj" | "anthem" }) {
  const bars = barsOf(phrases);
  const units = bars / 16;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          {mode === "dj" ? "DJ 4×4" : "Anthem"} · {units} phrases · {bars} bars
        </p>
        <p className="text-xs text-subtle">16 = one phrase</p>
      </div>
      <div className="mt-2 flex h-14 overflow-hidden rounded-md">
        {phrases.map((p, i) => (
          <div
            key={`${p.kind}-${i}`}
            className={cn("flex min-w-0 flex-col justify-center px-1.5", FILL[p.kind])}
            style={{ flexGrow: p.bars, flexBasis: 0 }}
            title={`${p.bars} ${p.label}`}
          >
            <span className="font-mono text-xs tabular-nums text-foreground">{p.bars}</span>
            <span className="truncate text-xs leading-tight text-muted">{p.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-subtle">Mix on the 1. Every block is a multiple of 16.</p>
    </div>
  );
}

export function IdeaCard({ idea }: { idea: Idea }) {
  const saved = useVs((s) => s.saved);
  const you = useVs((s) => s.you);
  const lockArtist = useVs((s) => s.lockArtist);
  const lockVocal = useVs((s) => s.lockVocal);
  const lockGenre = useVs((s) => s.lockGenre);
  const roll = useVs((s) => s.roll);
  const saveIdea = useVs((s) => s.saveIdea);
  const copyIdea = useVs((s) => s.copyIdea);
  const unlockArtist = useVs((s) => s.unlockArtist);
  const unlockVocal = useVs((s) => s.unlockVocal);
  const isSaved = saved.some((s) => s.seed === idea.seed);
  const locked = youLocked(you);
  const v = idea.vocal;
  const a = idea.artist;
  const sound = idea.sound;
  const phrases = idea.phrases ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="lg" className="h-12 flex-1 font-display tracking-wide" onClick={() => roll()}>
          <RotateCw className="size-4" />
          Roll idea
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            onClick={() => toast(saveIdea() === "saved" ? "Saved on this device" : "Removed from saved")}
          >
            {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => void copyIdea().then((ok) => toast(ok ? "Notes copied" : "Could not copy"))}
          >
            <Copy className="size-4" />
            Copy
          </Button>
        </div>
      </div>

      {(lockArtist || lockVocal || lockGenre || locked) && (
        <div className="flex flex-wrap gap-2">
          {locked ? (
            <Link
              to="/sound"
              className="inline-flex h-11 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground"
            >
              <Settings2 className="size-3" /> Your sound
            </Link>
          ) : null}
          {lockGenre ? (
            <span className="inline-flex h-11 items-center rounded-full bg-surface-2 px-3 text-xs text-muted">
              {GENRE_LABEL[a.genre]}
            </span>
          ) : null}
          {lockArtist ? (
            <button
              type="button"
              onClick={unlockArtist}
              className="inline-flex h-11 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground"
            >
              <Unlock className="size-3" /> {a.name}
            </button>
          ) : null}
          {lockVocal ? (
            <button
              type="button"
              onClick={unlockVocal}
              className="inline-flex h-11 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground"
            >
              <Unlock className="size-3" /> {v.title}
            </button>
          ) : null}
        </div>
      )}

      <article className="rounded-xl bg-surface p-5 shadow-border sm:p-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">Working title</p>
        <h2 className="font-display mt-2 text-3xl leading-none tracking-wide text-foreground sm:text-5xl">
          {idea.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">{idea.concept}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Meta label="Lane" value={`${a.name} · ${GENRE_LABEL[a.genre]}`} />
          <Meta label="Grid" value={`${idea.bpm} BPM · ${idea.key}`} />
          <Meta label="Vocal source" value={`${v.artist} — ${v.title} (${v.year})`} />
          <Meta label="Cut" value={`${v.from} · ${v.chop}${v.niche ? " · niche" : ""}`} />
        </dl>

        {sound ? (
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Meta label="Kick" value={sound.kick} />
            <Meta label="Bass" value={sound.bass} />
            <Meta label="Hook" value={sound.hook} />
            <Meta label="Vox" value={sound.vox} />
          </dl>
        ) : null}

        <p className="mt-6 text-sm leading-relaxed text-foreground">{v.why}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{idea.chopHow}</p>

        <div className="mt-6 rounded-lg bg-surface-2 p-4">
          {phrases.length ? (
            <PhraseStrip phrases={phrases} mode={idea.phraseMode ?? "dj"} />
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-widest text-muted">Map</p>
              <p className="mt-1 font-mono text-sm leading-relaxed text-foreground">{idea.map}</p>
            </>
          )}
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted">Layers</p>
          <p className="mt-1 text-sm text-foreground">{idea.layers.join(" · ")}</p>
        </div>

        <ol className="mt-6 space-y-2">
          {idea.process.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="font-mono w-4 shrink-0 text-subtle">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="secondary" className="flex-1">
            <a href={youtubeSearch(idea.search)} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Search YouTube
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={discogsSearch(idea.search)} target="_blank" rel="noreferrer">
              <Disc3 className="size-4" />
              Search Discogs
            </a>
          </Button>
        </div>
      </article>
    </div>
  );
}
