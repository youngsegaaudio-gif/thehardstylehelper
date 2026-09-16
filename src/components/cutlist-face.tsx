import { useMemo, useState } from "react";
import {
  SCHOOLS,
  SOURCES,
  VOX,
  KEYS,
  generateCut,
  cutText,
  type Cut,
  type School,
  type SourceKind,
  type VoxKind,
} from "@/lib/cutlist";
import { searchVocals, vibeLines, type VocalHit } from "@/lib/vocal-search";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HIST = "cutlist-hist-v1";

function loadHist(): Cut[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HIST) || "[]");
    return Array.isArray(raw) ? raw.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function speak(text: string) {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92;
  u.pitch = 0.7;
  speechSynthesis.speak(u);
}

export function CutlistFace() {
  const [school, setSchool] = useState<School>("ar-gang");
  const [vox, setVox] = useState<VoxKind>("shout");
  const [source, setSource] = useState<SourceKind>("record");
  const [key, setKey] = useState<string>("A minor");
  const [vibe, setVibe] = useState("");
  const [busy, setBusy] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [hits, setHits] = useState<VocalHit[]>([]);
  const [shops, setShops] = useState<VocalHit[]>([]);
  const [query, setQuery] = useState("");
  const [cut, setCut] = useState<Cut>(() =>
    generateCut({ school: "ar-gang", vox: "shout", source: "record", key: "A minor", seed: 1 }),
  );
  const [hist, setHist] = useState<Cut[]>(() => (typeof window === "undefined" ? [] : loadHist()));

  const saved = useMemo(() => hist.slice(0, 8), [hist]);

  async function roll() {
    setBusy(true);
    let next = generateCut({ school, vox, source, key, vibe });
    if (vibe.trim().length > 1) {
      const ai = await vibeLines({ data: { vibe: vibe.trim(), vox, school, key } });
      if (ai.ok) {
        next = {
          ...next,
          title: ai.title || next.title,
          concept: ai.concept || next.concept,
          lines: ai.lines.length ? ai.lines : next.lines,
        };
      }
    }
    setCut(next);
    const h = [next, ...hist.filter((x) => x.seed !== next.seed)].slice(0, 12);
    setHist(h);
    try {
      localStorage.setItem(HIST, JSON.stringify(h));
    } catch {
      /* ignore */
    }
    setBusy(false);
  }

  async function find() {
    setSearching(true);
    setSearchErr("");
    const res = await searchVocals({
      data: { vibe: vibe.trim() || cut.title, vox, school },
    });
    setSearching(false);
    if (!res.ok) {
      setSearchErr(res.error);
      return;
    }
    setHits(res.hits);
    setShops(res.shops);
    setQuery(res.query);
  }

  function save() {
    const blob = new Blob([cutText(cut)], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `CUTLIST-${cut.title.replace(/\s+/g, "-").toLowerCase()}-${cut.seed}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
        <p className="font-display text-3xl tracking-wide">CUTLIST</p>
        <p className="mt-1 text-xs text-muted">Ideas, vibe, licensed vocal search. No rips.</p>

        <label className="mt-4 block">
          <span className="text-xs uppercase tracking-wider text-muted">Vibe</span>
          <textarea
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="e.g. dark warehouse, anime computer voice, angry one-word shout, happy bounce"
            className="mt-2 min-h-24 w-full rounded-md bg-surface-2 px-3 py-3 text-sm leading-relaxed shadow-border outline-none"
          />
        </label>

        <p className="mt-4 text-xs uppercase tracking-wider text-muted">Style</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SCHOOLS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSchool(s.id)}
              className={cn(
                "h-11 rounded-md px-3 text-xs font-medium",
                school === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted shadow-border",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs uppercase tracking-wider text-muted">Vocal</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {VOX.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setVox(s.id)}
              className={cn(
                "h-11 rounded-md px-3 text-xs font-medium",
                vox === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted shadow-border",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs uppercase tracking-wider text-muted">Source</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSource(s.id)}
              className={cn(
                "h-11 rounded-md px-3 text-xs font-medium",
                source === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted shadow-border",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs uppercase tracking-wider text-muted">Key</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKey(k)}
              className={cn(
                "h-11 rounded-md px-3 text-xs font-medium",
                key === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted shadow-border",
              )}
            >
              {k}
            </button>
          ))}
        </div>

        <Button className="mt-4 w-full" onClick={() => void roll()} disabled={busy}>
          {busy ? "Writing…" : "New idea"}
        </Button>
        <Button className="mt-2 w-full" variant="secondary" onClick={() => void find()} disabled={searching}>
          {searching ? "Searching…" : "Find vocals"}
        </Button>
        <p className="mt-2 font-mono text-xs tabular-nums text-muted">
          {cut.bpm} BPM · {cut.key} · seed {cut.seed}
        </p>

        {(shops.length > 0 || hits.length > 0 || searchErr) && (
          <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
            <p className="text-xs uppercase tracking-wider text-muted">Vocal search</p>
            {query ? <p className="mt-1 font-mono text-xs text-subtle">{query}</p> : null}
            {searchErr ? <p className="mt-2 text-sm text-danger">{searchErr}</p> : null}
            {shops.length > 0 ? (
              <>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">Shops / CC</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {shops.map((h) => (
                    <li key={h.url}>
                      <a
                        href={h.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium underline-offset-2 hover:underline"
                      >
                        {h.title}
                      </a>
                      <span className="ml-2 font-mono text-xs text-muted">{h.host}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {hits.length > 0 ? (
              <>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">Web</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {hits.map((h) => (
                    <li key={h.url}>
                      <a
                        href={h.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium underline-offset-2 hover:underline"
                      >
                        {h.title}
                      </a>
                      <p className="font-mono text-xs text-muted">
                        {h.host} · {h.kind === "license" ? "license / CC" : "listen — don't rip"}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">Shops still work if the web scrape is empty.</p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-subtle">
              Licensed packs and Creative Commons only. Don't strip or rip other people's tracks.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Title</p>
          <p className="mt-1 font-display text-2xl tracking-wide">{cut.title}</p>
          {cut.vibe ? <p className="mt-2 text-xs text-muted">Vibe: {cut.vibe}</p> : null}
          <p className="mt-3 text-sm leading-relaxed text-pretty">{cut.concept}</p>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Structure</p>
          <p className="mt-2 font-mono text-sm leading-relaxed">{cut.structure}</p>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Lines</p>
          <ul className="mt-2 flex flex-col gap-2">
            {cut.lines.map((line) => (
              <li key={line} className="flex items-start justify-between gap-3">
                <p className="text-base font-medium leading-snug text-pretty">{line}</p>
                <button
                  type="button"
                  className="h-11 shrink-0 rounded-md bg-surface px-3 text-xs font-medium shadow-border"
                  onClick={() => speak(line)}
                >
                  Speak
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Where to get it</p>
          <p className="mt-2 text-sm leading-relaxed text-pretty">{cut.sourceHow}</p>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Chop</p>
          <p className="mt-2 text-sm leading-relaxed text-pretty">{cut.chop}</p>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Process</p>
          <ul className="mt-2 flex flex-col gap-2">
            {cut.process.map((p) => (
              <li key={p} className="text-sm leading-relaxed text-pretty">
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Also</p>
          <p className="mt-2 text-sm leading-relaxed text-pretty">{cut.idea}</p>
        </div>

        <Button className="mt-4 w-full" variant="secondary" onClick={save}>
          Save idea
        </Button>

        {saved.length > 0 ? (
          <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
            <p className="text-xs uppercase tracking-wider text-muted">Recent</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {saved.map((h) => (
                <li key={h.seed}>
                  <button
                    type="button"
                    className="flex w-full items-baseline justify-between gap-3 text-left"
                    onClick={() => setCut(h)}
                  >
                    <span className="text-sm">{h.title}</span>
                    <span className="font-mono text-xs tabular-nums text-muted">
                      {h.vox} · {h.bpm}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
