import { Bookmark, BookmarkCheck, Copy, Disc3, ExternalLink, Lock, Mic2, RotateCw, Search, Settings2, Unlock } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ARTISTS,
  GENRES,
  GENRE_LABEL,
  VOCALS,
  VOCAL_STYLES,
  searchArtists,
  searchVocals,
  type Artist,
  type EraId,
  type GenreId,
  type VocalSource,
} from "@/lib/hs-catalog";
import {
  BASS_OPTS,
  HOOK_OPTS,
  KEYS,
  KICK_OPTS,
  PHRASE_OPTS,
  VOX_OPTS,
  YOU_DEFAULT,
  barsOf,
  discogsSearch,
  ideaText,
  rollIdea,
  youtubeSearch,
  type Idea,
  type Phrase,
  type PhraseKind,
  type RollOpts,
  type YouPrefs,
} from "@/lib/hs-ideas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SAVE_KEY = "hs-songs-saved-v1";
const YOU_KEY = "hs-songs-you-v1";
const ERAS: { id: EraId | "all"; label: string }[] = [
  { id: "all", label: "All eras" },
  { id: "90s", label: "90s" },
  { id: "00s", label: "00s" },
  { id: "10s", label: "10s" },
  { id: "20s", label: "20s" },
];

type Tab = "ideas" | "you" | "vocals" | "artists" | "saved";

const FILL: Record<PhraseKind, string> = {
  intro: "bg-section-intro",
  break: "bg-section-break",
  build: "bg-section-build",
  drop: "bg-section-drop",
  outro: "bg-section-outro",
};

function loadSaved(): Idea[] {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
    return Array.isArray(raw) ? raw.slice(0, 40) : [];
  } catch {
    return [];
  }
}

function loadYou(): YouPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(YOU_KEY) || "null");
    if (!raw || typeof raw !== "object") return YOU_DEFAULT;
    return { ...YOU_DEFAULT, ...raw };
  } catch {
    return YOU_DEFAULT;
  }
}

function Chip({
  active,
  onClick,
  children,
  locked,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-3.5 text-xs font-medium transition-[background-color,color,opacity] duration-150",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-surface-2 text-muted shadow-border hover:text-foreground",
      )}
    >
      {locked ? <Lock className="size-3" /> : null}
      {children}
    </button>
  );
}

function yt(q: string) {
  return youtubeSearch(q);
}

export function SongsFace() {
  const [tab, setTab] = useState<Tab>("ideas");
  const [genre, setGenre] = useState<GenreId | "all">("all");
  const [era, setEra] = useState<EraId | "all">("all");
  const [nicheOnly, setNicheOnly] = useState(false);
  const [q, setQ] = useState("");
  const [style, setStyle] = useState<string>("all");
  const [lockGenre, setLockGenre] = useState(false);
  const [lockArtist, setLockArtist] = useState<string | null>(null);
  const [lockVocal, setLockVocal] = useState<string | null>(null);
  const [you, setYou] = useState<YouPrefs>(YOU_DEFAULT);
  const youRef = useRef(you);
  youRef.current = you;
  const [idea, setIdea] = useState<Idea>(() => rollIdea({ seed: 7, nicheOnly: false, you: YOU_DEFAULT }));
  const [saved, setSaved] = useState<Idea[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(loadSaved());
    setYou(loadYou());
    setReady(true);
  }, []);

  const artistHits = useMemo(() => searchArtists(q, genre), [q, genre]);
  const vocalHits = useMemo(() => searchVocals(q, era, nicheOnly, style), [q, era, nicheOnly, style]);
  const grouped = useMemo(() => {
    const map = new Map<GenreId, Artist[]>();
    for (const g of GENRES) map.set(g.id, []);
    for (const a of artistHits) map.get(a.genre)?.push(a);
    return GENRES.map((g) => ({ ...g, acts: map.get(g.id) ?? [] })).filter((g) => g.acts.length);
  }, [artistHits]);

  const isSaved = saved.some((s) => s.seed === idea.seed);
  const youLocked =
    you.kick !== "any" ||
    you.bass !== "any" ||
    you.hook !== "any" ||
    you.vox !== "any" ||
    you.phrases !== "mix" ||
    you.key !== "any";

  function persist(next: Idea[]) {
    setSaved(next);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function persistYou(patch: Partial<YouPrefs>) {
    setYou((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(YOU_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      youRef.current = next;
      return next;
    });
  }

  function resetYou() {
    persistYou(YOU_DEFAULT);
  }

  function roll(extra?: Partial<RollOpts>) {
    const next = rollIdea({
      genre: extra?.genre ?? (genre !== "all" ? genre : "all"),
      era,
      nicheOnly,
      artistId: extra?.artistId ?? lockArtist,
      vocalId: extra?.vocalId ?? lockVocal,
      q: extra?.q ?? q,
      you: extra?.you ?? youRef.current,
      seed: Date.now() ^ Math.floor(Math.random() * 1e9),
    });
    setIdea(next);
    setTab("ideas");
  }

  function saveIdea() {
    if (isSaved) {
      persist(saved.filter((s) => s.seed !== idea.seed));
      toast("Removed from saved");
      return;
    }
    persist([idea, ...saved.filter((s) => s.seed !== idea.seed)].slice(0, 40));
    toast("Saved on this device");
  }

  async function copyIdea(target: Idea = idea) {
    try {
      await navigator.clipboard.writeText(ideaText(target));
      toast("Notes copied");
    } catch {
      toast("Could not copy");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="relative mb-6 overflow-hidden rounded-xl bg-surface px-4 py-5 shadow-border sm:px-6 sm:py-7">
        <div className="hs-staff pointer-events-none absolute inset-x-4 top-4 h-10 opacity-40 sm:inset-x-6" />
        <p className="relative text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
          {ARTISTS.length} lanes · {VOCALS.length} sample vocals · DJ 4×4
        </p>
        <h1 className="font-display relative mt-2 text-[1.7rem] leading-[1.05] tracking-wide text-foreground sm:text-4xl">
          VOCAL
          <span className="block text-muted">SOURCE</span>
        </h1>
        <p className="relative mt-3 max-w-prose text-sm leading-relaxed text-muted">
          Vocals people chop into hardstyle. Not hardstyle tracks. 16-bar DJ
          phrases, 90% of rolls. Titles and years only — you source and clear
          the chop.
        </p>
      </header>

      <nav className="mb-4 flex gap-1 overflow-x-auto pb-1" aria-label="Sections">
        {(
          [
            ["ideas", "Ideas"],
            ["you", "You"],
            ["vocals", "Vocals"],
            ["artists", "Artists"],
            ["saved", `Saved${ready && saved.length ? ` ${saved.length}` : ""}`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-11 shrink-0 rounded-lg px-4 text-sm font-medium transition-[background-color,color] duration-150",
              tab === id
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab !== "you" ? (
        <div className="mb-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                tab === "artists"
                  ? "Search acts"
                  : tab === "vocals"
                    ? "Search songs, artists, styles"
                    : "Filter the next roll"
              }
              className="pl-10"
              aria-label="Search"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tab === "vocals" ? (
              <>
                <Chip active={style === "all"} onClick={() => setStyle("all")}>
                  All styles
                </Chip>
                {VOCAL_STYLES.map((s) => (
                  <Chip
                    key={s.id}
                    active={style === s.id}
                    onClick={() => setStyle((cur) => (cur === s.id ? "all" : s.id))}
                  >
                    {s.label}
                  </Chip>
                ))}
              </>
            ) : (
              <>
                <Chip
                  active={genre === "all"}
                  onClick={() => {
                    setGenre("all");
                    setLockGenre(false);
                  }}
                >
                  All genres
                </Chip>
                {GENRES.map((g) => (
                  <Chip
                    key={g.id}
                    active={genre === g.id}
                    locked={lockGenre && genre === g.id}
                    onClick={() => {
                      setGenre(g.id);
                      if (genre === g.id) setLockGenre((v) => !v);
                      else setLockGenre(false);
                    }}
                  >
                    {g.label}
                  </Chip>
                ))}
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ERAS.map((e) => (
              <Chip key={e.id} active={era === e.id} onClick={() => setEra(e.id)}>
                {e.label}
              </Chip>
            ))}
            <Chip active={nicheOnly} onClick={() => setNicheOnly((v) => !v)}>
              Niche cuts
            </Chip>
          </div>
        </div>
      ) : null}

      {tab === "ideas" ? (
        <IdeaPanel
          idea={idea}
          isSaved={isSaved}
          lockArtist={lockArtist}
          lockVocal={lockVocal}
          lockGenre={lockGenre && genre !== "all"}
          youLocked={youLocked}
          onRoll={() => roll()}
          onSave={saveIdea}
          onCopy={() => void copyIdea()}
          onUnlockArtist={() => setLockArtist(null)}
          onUnlockVocal={() => setLockVocal(null)}
          onYou={() => setTab("you")}
        />
      ) : null}

      {tab === "you" ? (
        <YouPanel
          you={you}
          onChange={persistYou}
          onRoll={() => roll()}
          onReset={resetYou}
        />
      ) : null}

      {tab === "vocals" ? (
        <VocalPanel
          hits={vocalHits}
          onPick={(v) => {
            setLockVocal(v.id);
            roll({ vocalId: v.id });
          }}
        />
      ) : null}

      {tab === "artists" ? (
        <ArtistPanel
          grouped={grouped}
          total={artistHits.length}
          onPick={(a) => {
            setLockArtist(a.id);
            setGenre(a.genre);
            setLockGenre(true);
            roll({ artistId: a.id, genre: a.genre });
          }}
        />
      ) : null}

      {tab === "saved" ? (
        <SavedPanel
          ready={ready}
          saved={saved}
          onOpen={(item) => {
            setIdea(item);
            setTab("ideas");
          }}
          onCopy={(item) => void copyIdea(item)}
          onRemove={(item) => persist(saved.filter((s) => s.seed !== item.seed))}
        />
      ) : null}

      <p className="mt-8 pb-10 text-center text-xs leading-relaxed text-subtle">
        Search, sample, and clear what you use. This list is a starting point —
        not a stem pack and not a lyric sheet.
      </p>
    </div>
  );
}

function PhraseStrip({ phrases, mode }: { phrases: Phrase[]; mode: "dj" | "anthem" }) {
  const bars = barsOf(phrases);
  const units = bars / 16;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          {mode === "dj" ? "DJ 4×4" : "Anthem"} · {units} phrases · {bars} bars
        </p>
        <p className="text-[11px] text-subtle">16 = one phrase</p>
      </div>
      <div className="mt-2 flex h-14 overflow-hidden rounded-md">
        {phrases.map((p, i) => (
          <div
            key={`${p.kind}-${i}`}
            className={cn("flex min-w-0 flex-col justify-center px-1.5", FILL[p.kind])}
            style={{ flexGrow: p.bars, flexBasis: 0 }}
            title={`${p.bars} ${p.label}`}
          >
            <span className="font-mono text-[11px] tabular-nums text-foreground">{p.bars}</span>
            <span className="truncate text-[10px] leading-tight text-muted">{p.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-subtle">
        Mix on the 1. Every block is a multiple of 16.
      </p>
    </div>
  );
}

function IdeaPanel({
  idea,
  isSaved,
  lockArtist,
  lockVocal,
  lockGenre,
  youLocked,
  onRoll,
  onSave,
  onCopy,
  onUnlockArtist,
  onUnlockVocal,
  onYou,
}: {
  idea: Idea;
  isSaved: boolean;
  lockArtist: string | null;
  lockVocal: string | null;
  lockGenre: boolean;
  youLocked: boolean;
  onRoll: () => void;
  onSave: () => void;
  onCopy: () => void;
  onUnlockArtist: () => void;
  onUnlockVocal: () => void;
  onYou: () => void;
}) {
  const v = idea.vocal;
  const a = idea.artist;
  const sound = idea.sound;
  const phrases = idea.phrases ?? [];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="lg" className="h-12 flex-1 font-display tracking-wide" onClick={onRoll}>
          <RotateCw className="size-4" />
          Roll idea
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 sm:flex-none" onClick={onSave}>
            {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={onCopy}>
            <Copy className="size-4" />
            Copy
          </Button>
        </div>
      </div>

      {(lockArtist || lockVocal || lockGenre || youLocked) && (
        <div className="flex flex-wrap gap-2">
          {youLocked ? (
            <button
              type="button"
              onClick={onYou}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground"
            >
              <Settings2 className="size-3" /> Your sound
            </button>
          ) : null}
          {lockGenre ? (
            <span className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted">
              <Lock className="size-3" /> {GENRE_LABEL[a.genre]}
            </span>
          ) : null}
          {lockArtist ? (
            <button
              type="button"
              onClick={onUnlockArtist}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground"
            >
              <Unlock className="size-3" /> {a.name}
            </button>
          ) : null}
          {lockVocal ? (
            <button
              type="button"
              onClick={onUnlockVocal}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground"
            >
              <Unlock className="size-3" /> {v.title}
            </button>
          ) : null}
        </div>
      )}

      <article className="rounded-xl bg-surface p-5 shadow-border sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Working title</p>
        <h2 className="font-display mt-1 text-3xl leading-none tracking-wide text-foreground sm:text-4xl">
          {idea.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{idea.concept}</p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <Meta label="Lane" value={`${a.name} · ${GENRE_LABEL[a.genre]}`} />
          <Meta label="Grid" value={`${idea.bpm} BPM · ${idea.key}`} />
          <Meta label="Vocal source" value={`${v.artist} — ${v.title} (${v.year})`} />
          <Meta label="Cut" value={`${v.from} · ${v.chop}${v.niche ? " · niche" : ""}`} />
        </dl>

        {sound ? (
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <Meta label="Kick" value={sound.kick} />
            <Meta label="Bass" value={sound.bass} />
            <Meta label="Hook" value={sound.hook} />
            <Meta label="Vox" value={sound.vox} />
          </dl>
        ) : null}

        <p className="mt-5 text-sm leading-relaxed text-foreground">{v.why}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{idea.chopHow}</p>

        <div className="mt-5 rounded-lg bg-surface-2 p-4">
          {phrases.length ? (
            <PhraseStrip phrases={phrases} mode={idea.phraseMode ?? "dj"} />
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Map</p>
              <p className="mt-1 font-mono text-sm leading-relaxed text-foreground">{idea.map}</p>
            </>
          )}
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Layers</p>
          <p className="mt-1 text-sm text-foreground">{idea.layers.join(" · ")}</p>
        </div>

        <ol className="mt-5 space-y-2">
          {idea.process.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="font-mono w-4 shrink-0 text-subtle">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="secondary" className="flex-1">
            <a href={yt(idea.search)} target="_blank" rel="noreferrer">
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

function YouPanel({
  you,
  onChange,
  onRoll,
  onReset,
}: {
  you: YouPrefs;
  onChange: (patch: Partial<YouPrefs>) => void;
  onRoll: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted">
        Lock the sound of the next roll. Mix keeps DJ 4×4 phrases 90% of the
        time. Anything else stays random.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="lg" className="h-12 flex-1 font-display tracking-wide" onClick={onRoll}>
          <RotateCw className="size-4" />
          Roll with this
        </Button>
        <Button variant="outline" className="h-12" onClick={onReset}>
          Reset
        </Button>
      </div>

      <Field label="Phrases">
        {PHRASE_OPTS.map((o) => (
          <Chip key={o.id} active={you.phrases === o.id} onClick={() => onChange({ phrases: o.id })}>
            {o.label}
          </Chip>
        ))}
        <p className="w-full pt-1 text-[11px] text-subtle">
          {PHRASE_OPTS.find((o) => o.id === you.phrases)?.hint}
        </p>
      </Field>

      <Field label="Kick">
        {KICK_OPTS.map((o) => (
          <Chip key={o.id} active={you.kick === o.id} onClick={() => onChange({ kick: o.id })}>
            {o.label}
          </Chip>
        ))}
      </Field>

      <Field label="Bass">
        {BASS_OPTS.map((o) => (
          <Chip key={o.id} active={you.bass === o.id} onClick={() => onChange({ bass: o.id })}>
            {o.label}
          </Chip>
        ))}
      </Field>

      <Field label="Hook">
        {HOOK_OPTS.map((o) => (
          <Chip key={o.id} active={you.hook === o.id} onClick={() => onChange({ hook: o.id })}>
            {o.label}
          </Chip>
        ))}
      </Field>

      <Field label="Vox">
        {VOX_OPTS.map((o) => (
          <Chip key={o.id} active={you.vox === o.id} onClick={() => onChange({ vox: o.id })}>
            {o.label}
          </Chip>
        ))}
      </Field>

      <Field label="Key">
        <Chip active={you.key === "any"} onClick={() => onChange({ key: "any" })}>
          Any
        </Chip>
        {KEYS.map((k) => (
          <Chip key={k} active={you.key === k} onClick={() => onChange({ key: k })}>
            {k.replace(" minor", " min")}
          </Chip>
        ))}
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm leading-snug text-foreground">{value}</dd>
    </div>
  );
}

function VocalPanel({ hits, onPick }: { hits: VocalSource[]; onPick: (v: VocalSource) => void }) {
  return (
    <div>
      <p className="mb-3 text-xs text-muted">{hits.length} source vocals · tap one to roll a hard-dance idea around it</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {hits.map((v) => (
          <li key={v.id}>
            <button
              type="button"
              onClick={() => onPick(v)}
              className="flex h-full w-full flex-col rounded-lg bg-surface p-4 text-left shadow-border transition-[background-color] duration-150 hover:bg-surface-2"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold leading-snug text-foreground">{v.title}</span>
                <span className="font-mono shrink-0 text-[11px] text-subtle">{v.year}</span>
              </span>
              <span className="mt-0.5 text-xs text-muted">{v.artist}</span>
              <span className="mt-2 flex flex-wrap gap-1">
                <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  {v.era}
                </span>
                <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  {v.from}
                </span>
                {v.niche ? (
                  <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground">
                    niche
                  </span>
                ) : null}
              </span>
              <span className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{v.why}</span>
            </button>
          </li>
        ))}
      </ul>
      {hits.length === 0 ? (
        <p className="rounded-lg bg-surface p-6 text-sm text-muted shadow-border">
          Nothing in that filter. Clear search or switch era.
        </p>
      ) : null}
    </div>
  );
}

function ArtistPanel({
  grouped,
  total,
  onPick,
}: {
  grouped: { id: GenreId; label: string; bpm: number; acts: Artist[] }[];
  total: number;
  onPick: (a: Artist) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs text-muted">
        {total} of {ARTISTS.length} acts · tap one to lock the lane and roll
      </p>
      <div className="flex flex-col gap-6">
        {grouped.map((g) => (
          <section key={g.id}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg tracking-wide text-foreground">{g.label}</h2>
              <p className="text-xs text-subtle">
                {g.acts.length} · {g.bpm} BPM
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {g.acts.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onPick(a)}
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
      {total === 0 ? (
        <p className="rounded-lg bg-surface p-6 text-sm text-muted shadow-border">No acts in that filter.</p>
      ) : null}
    </div>
  );
}

function SavedPanel({
  ready,
  saved,
  onOpen,
  onCopy,
  onRemove,
}: {
  ready: boolean;
  saved: Idea[];
  onOpen: (idea: Idea) => void;
  onCopy: (idea: Idea) => void;
  onRemove: (idea: Idea) => void;
}) {
  if (!ready) {
    return <p className="text-sm text-muted">Loading saved ideas…</p>;
  }
  if (!saved.length) {
    return (
      <div className="rounded-xl bg-surface px-5 py-10 text-center shadow-border">
        <Mic2 className="mx-auto size-6 text-subtle" />
        <p className="mt-3 text-sm text-muted">Nothing saved yet. Roll an idea and keep it on this device.</p>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {saved.map((item) => (
        <li
          key={item.seed}
          className="flex flex-col gap-3 rounded-lg bg-surface p-4 shadow-border sm:flex-row sm:items-center"
        >
          <button type="button" onClick={() => onOpen(item)} className="min-w-0 flex-1 text-left">
            <p className="font-display text-lg tracking-wide text-foreground">{item.title}</p>
            <p className="truncate text-xs text-muted">
              {item.artist.name} · {item.vocal.artist} — {item.vocal.title} ({item.vocal.year})
            </p>
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onCopy(item)}>
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onRemove(item)}>
              Remove
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
