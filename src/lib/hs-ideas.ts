import {
  ARTISTS,
  GENRE_LABEL,
  VOCALS,
  type Artist,
  type EraId,
  type GenreId,
  type VocalSource,
} from "./hs-catalog";

export type PhraseKind = "intro" | "break" | "build" | "drop" | "outro";

export type Phrase = {
  kind: PhraseKind;
  bars: number;
  label: string;
};

export type KickKind = "raw" | "pvc" | "musical";
export type BassKind = "reverse" | "offbeat" | "none";
export type HookKind = "screech" | "saw" | "piano" | "vox" | "stab";
export type VoxKind = "chop" | "shout" | "sung" | "none";
export type PhrasePref = "dj" | "mix" | "anthem";

export type YouPrefs = {
  kick: "any" | KickKind;
  bass: "any" | BassKind;
  hook: "any" | HookKind;
  vox: "any" | VoxKind;
  phrases: PhrasePref;
  key: "any" | string;
};

export type Sound = {
  kick: string;
  kickKind: KickKind;
  bass: string;
  bassKind: BassKind;
  hook: string;
  hookKind: HookKind;
  vox: string;
  voxKind: VoxKind;
};

export type Idea = {
  seed: number;
  title: string;
  artist: Artist;
  vocal: VocalSource;
  bpm: number;
  key: string;
  map: string;
  phrases: Phrase[];
  phraseMode: "dj" | "anthem";
  layers: string[];
  sound: Sound;
  chopHow: string;
  process: string[];
  concept: string;
  search: string;
};

export type RollOpts = {
  seed?: number;
  genre?: GenreId | "all";
  era?: EraId | "all";
  nicheOnly?: boolean;
  artistId?: string | null;
  vocalId?: string | null;
  q?: string;
  you?: YouPrefs;
};

export const YOU_DEFAULT: YouPrefs = {
  kick: "any",
  bass: "any",
  hook: "any",
  vox: "any",
  phrases: "mix",
  key: "any",
};

export const KEYS = ["A minor", "G minor", "F minor", "E minor", "D minor", "C# minor"];

export const KICK_OPTS: { id: "any" | KickKind; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "raw", label: "Raw" },
  { id: "pvc", label: "PVC" },
  { id: "musical", label: "Musical" },
];
export const BASS_OPTS: { id: "any" | BassKind; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "reverse", label: "Reverse" },
  { id: "offbeat", label: "Offbeat" },
  { id: "none", label: "None" },
];
export const HOOK_OPTS: { id: "any" | HookKind; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "screech", label: "Screech" },
  { id: "saw", label: "Saw" },
  { id: "piano", label: "Piano" },
  { id: "vox", label: "Vox" },
  { id: "stab", label: "Stab" },
];
export const VOX_OPTS: { id: "any" | VoxKind; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "chop", label: "Chop" },
  { id: "shout", label: "Shout" },
  { id: "sung", label: "Sung" },
  { id: "none", label: "None" },
];
export const PHRASE_OPTS: { id: PhrasePref; label: string; hint: string }[] = [
  { id: "dj", label: "DJ 4×4", hint: "Always 16-bar phrases" },
  { id: "mix", label: "Mix 90/10", hint: "DJ 4×4 most rolls, anthem sometimes" },
  { id: "anthem", label: "Anthem", hint: "32-bar breaks" },
];

const FROM_FIT: Record<GenreId, string[]> = {
  euphoric: ["trance", "eurodance", "italo", "house", "dream trance", "art pop", "synth"],
  raw: ["industrial", "big beat", "grime", "alt rnb", "rap", "ebm", "metalcore"],
  "extra-raw": ["industrial", "ebm", "aggrotech", "noise rock", "experimental hip hop", "grime", "rap", "metal"],
  classic: ["trance", "eurodance", "italo", "house", "hands up"],
  early: ["rave", "gabber", "eurodance", "hard trance", "new beat"],
  hardcore: ["gabber", "rave", "industrial", "happy", "metal", "shout"],
  uptempo: ["gabber", "industrial", "aggrotech", "grime", "rap", "happy"],
  frenchcore: ["happy", "eurodance", "rave", "gabber", "hands up"],
  ukhc: ["rave", "happy", "ukg", "uk garage", "hands up", "dnb", "bassline"],
  happy: ["happy", "eurodance", "hands up", "rave", "pop", "ukhc"],
  gabber: ["gabber", "rave", "happy", "new beat", "ebm"],
  industrial: ["industrial", "ebm", "aggrotech", "trip-hop", "industrial metal"],
  "hard-techno": ["industrial", "ebm", "techno", "electro", "house"],
  jumpstyle: ["hands up", "eurodance", "happy", "jumpstyle"],
  "hard-trance": ["hard trance", "trance", "rave", "eurodance"],
  freeform: ["dnb", "jungle", "grime", "idm", "uk garage"],
  millenium: ["rave", "happy", "ukhc", "millenium"],
  terror: ["industrial", "idm", "noise rock", "gabber", "aggrotech"],
  psy: ["art pop", "experimental", "trip-hop", "psychedelic", "idm", "synthwave"],
};

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pick<T>(r: () => number, xs: T[]): T {
  return xs[Math.floor(r() * xs.length)]!;
}

function wordsOf(title: string): string[] {
  return title
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(the|and|for|you|your|this|that|with|from)$/i.test(w));
}

function bar(kind: PhraseKind, bars: number, label: string): Phrase {
  return { kind, bars, label };
}

function djMaps(genre: GenreId): Phrase[][] {
  const inL =
    genre === "ukhc" || genre === "happy" || genre === "millenium"
      ? "hook in"
      : genre === "extra-raw" || genre === "uptempo" || genre === "terror"
        ? "kick wall"
        : "kick in";
  const brL =
    genre === "raw" || genre === "extra-raw" || genre === "industrial"
      ? "filter break"
      : genre === "ukhc" || genre === "happy"
        ? "vocal / piano"
        : "break";
  const dropL = genre === "euphoric" || genre === "classic" ? "drop" : "drop";
  return [
    [
      bar("intro", 16, inL),
      bar("break", 16, brL),
      bar("drop", 16, `${dropL} 1`),
      bar("drop", 16, `${dropL} 1b`),
      bar("break", 16, "break 2"),
      bar("drop", 16, `${dropL} 2`),
      bar("drop", 16, `${dropL} 2b`),
      bar("outro", 16, "outro"),
    ],
    [
      bar("intro", 16, inL),
      bar("drop", 16, `${dropL} 1`),
      bar("break", 16, brL),
      bar("drop", 16, `${dropL} 2`),
      bar("outro", 16, "outro"),
    ],
    [
      bar("intro", 16, inL),
      bar("break", 16, brL),
      bar("drop", 16, `${dropL} 1`),
      bar("break", 16, "break 2"),
      bar("drop", 16, `${dropL} 2`),
      bar("outro", 16, "outro"),
    ],
    [
      bar("intro", 16, "hook"),
      bar("drop", 16, `${dropL} 1`),
      bar("break", 16, "hook 2"),
      bar("drop", 16, `${dropL} 2`),
      bar("outro", 16, "outro"),
    ],
  ];
}

function anthemMap(genre: GenreId): Phrase[] {
  const br =
    genre === "ukhc" || genre === "happy" ? "vocal break" : genre === "psy" ? "story break" : "break";
  return [
    bar("intro", 16, "intro"),
    bar("break", 32, br),
    bar("build", 16, "build"),
    bar("drop", 32, "drop 1"),
    bar("break", 32, "break 2"),
    bar("build", 16, "build 2"),
    bar("drop", 32, "drop 2"),
    bar("outro", 16, "outro"),
  ];
}

function pickPhrases(r: () => number, genre: GenreId, pref: PhrasePref): { mode: "dj" | "anthem"; phrases: Phrase[] } {
  if (pref === "anthem") return { mode: "anthem", phrases: anthemMap(genre) };
  if (pref === "dj" || r() < 0.9) return { mode: "dj", phrases: pick(r, djMaps(genre)) };
  return { mode: "anthem", phrases: anthemMap(genre) };
}

const KICK_LINE: Record<KickKind, string[]> = {
  raw: [
    "Raw mid crunch. Body first, click on top.",
    "Dark punch. Distort the mids, keep the sub clean.",
    "Kick + extra click. Two layers, one mono.",
    "Raw kick, short tail. Leave space for the reverse.",
  ],
  pvc: [
    "PVC clipper kick. Hard peak, short tail.",
    "Brickwall punch. Extra click, no musical tail.",
    "Hard-techno PVC. Peak then click extra.",
    "Clipped kick wall. Mono, loud, no pretty decay.",
  ],
  musical: [
    "Musical 150 punch. Reverse bass sits under it.",
    "Clean punch. Quiet click, long enough for the reverse.",
    "Euphoric kick. Punch then reverse, no extra crunch.",
    "Musical kick. Keep the low-mid round, not crushed.",
  ],
};

const BASS_LINE: Record<BassKind, string[]> = {
  reverse: [
    "Reverse bass locked to the kick.",
    "Reverse bass. Same grid as the kick, nothing fancy.",
    "Reverse bass with a short pitch-down into the 1.",
    "Reverse bass in the pocket. Don't let it fight the kick.",
  ],
  offbeat: [
    "Offbeat bass. UK / happy pocket.",
    "Offbeat bass, not reverse. 170 feel even at 150.",
    "Offbeat bass under the piano / saw.",
    "Offbeat bass. Leave the 1 for the kick only.",
  ],
  none: [
    "No bass. Kick carries the low end.",
    "Kick only. Add a click extra, not a bassline.",
    "No reverse, no offbeat. Empty low-mid on purpose.",
  ],
};

const HOOK_LINE: Record<HookKind, string[]> = {
  screech: [
    "Short screech hook. One motif, not a melody.",
    "Screech on the 1. Leave gaps.",
    "Screech + kick is the drop. No pretty lead.",
  ],
  saw: [
    "Supersaw climax. Break melody becomes the drop.",
    "Saw lead from the break. Same notes, harder.",
    "Stacked saws. Keep the mid clear of the kick.",
  ],
  piano: [
    "Piano motif. UK hardcore / millenium lane.",
    "Piano before the drop. Simple voicing, minor.",
    "Piano hook in the break, stabs in the drop.",
  ],
  vox: [
    "Vocal chop is the hook. No extra lead.",
    "Pitched vox as the melody. Keep it rhythmic.",
    "Vox hook in the break, chops on the drop.",
  ],
  stab: [
    "Stab / hoover. Short, on the 1.",
    "Chord stab instead of a climax saw.",
    "Hoover stab. Gabber / early hardstyle colour.",
  ],
};

const VOX_LINE: Record<VoxKind, string[]> = {
  chop: [
    "Rhythmic chops in the drop. Dry in the break.",
    "Chop on the offbeats. Treat it like a hat.",
    "Grain the chop. Reverse the last hit into the drop.",
  ],
  shout: [
    "Shout hits. Festival 1s, not a verse.",
    "One shout per 16. Don't stack them.",
    "Shout as an impact. Sidechain it to the kick.",
  ],
  sung: [
    "Sung hook in the break. Restate a slice in the drop.",
    "Sung line, dry. No auto-tune soup.",
    "Melody in the break. Drop keeps a 2-bar slice.",
  ],
  none: [
    "No vox in the drop. Kick and hook only.",
    "Skip the vocal, or keep a 1-bar teaser in the break.",
    "Instrumental. Source still listed if you change your mind.",
  ],
};

function kickKind(r: () => number, genre: GenreId, pref: YouPrefs["kick"]): KickKind {
  if (pref !== "any") return pref;
  if (genre === "extra-raw" || genre === "hard-techno" || genre === "uptempo" || genre === "terror") {
    return pick(r, ["pvc", "raw", "raw"]);
  }
  if (genre === "euphoric" || genre === "classic" || genre === "happy" || genre === "ukhc" || genre === "hard-trance") {
    return pick(r, ["musical", "musical", "raw"]);
  }
  return pick(r, ["raw", "raw", "pvc", "musical"]);
}

function bassKind(r: () => number, genre: GenreId, pref: YouPrefs["bass"]): BassKind {
  if (pref !== "any") return pref;
  if (genre === "ukhc" || genre === "happy" || genre === "millenium" || genre === "jumpstyle" || genre === "freeform") {
    return pick(r, ["offbeat", "offbeat", "none"]);
  }
  if (genre === "extra-raw" || genre === "uptempo" || genre === "terror" || genre === "hard-techno") {
    return pick(r, ["none", "none", "reverse"]);
  }
  return pick(r, ["reverse", "reverse", "reverse", "none"]);
}

function hookKind(r: () => number, genre: GenreId, pref: YouPrefs["hook"]): HookKind {
  if (pref !== "any") return pref;
  if (genre === "ukhc" || genre === "happy" || genre === "millenium") return pick(r, ["piano", "saw", "vox"]);
  if (genre === "raw" || genre === "extra-raw") return pick(r, ["screech", "screech", "stab"]);
  if (genre === "gabber" || genre === "hardcore" || genre === "early") return pick(r, ["stab", "screech", "piano"]);
  if (genre === "euphoric" || genre === "classic" || genre === "hard-trance" || genre === "psy") {
    return pick(r, ["saw", "saw", "vox", "piano"]);
  }
  if (genre === "frenchcore") return pick(r, ["stab", "vox", "screech"]);
  return pick(r, ["screech", "saw", "stab", "vox"]);
}

function voxKind(r: () => number, vocal: VocalSource, pref: YouPrefs["vox"]): VoxKind {
  if (pref !== "any") return pref;
  if (/(shout|yell|scream|chant)/.test(vocal.chop)) return pick(r, ["shout", "chop"]);
  if (/(sung|choir|hook)/.test(vocal.chop)) return pick(r, ["sung", "chop", "chop"]);
  if (/(spoken|whisper)/.test(vocal.chop)) return pick(r, ["chop", "shout", "none"]);
  return pick(r, ["chop", "chop", "shout", "sung", "none"]);
}

function makeSound(r: () => number, genre: GenreId, vocal: VocalSource, you: YouPrefs): Sound {
  const k = kickKind(r, genre, you.kick);
  const b = bassKind(r, genre, you.bass);
  const h = hookKind(r, genre, you.hook);
  const v = voxKind(r, vocal, you.vox);
  return {
    kickKind: k,
    bassKind: b,
    hookKind: h,
    voxKind: v,
    kick: pick(r, KICK_LINE[k]),
    bass: pick(r, BASS_LINE[b]),
    hook: pick(r, HOOK_LINE[h]),
    vox: pick(r, VOX_LINE[v]),
  };
}

function layersOf(sound: Sound, genre: GenreId): string[] {
  const bass = sound.bassKind === "none" ? "Click extra" : sound.bassKind === "offbeat" ? "Offbeat bass" : "Reverse bass";
  const extra =
    genre === "uptempo" || genre === "terror"
      ? ["Hats", "Impact", "Noise FX"]
      : genre === "ukhc" || genre === "happy"
        ? ["Hats", "Snare build", "FX"]
        : ["Atmosphere", "FX", "Impact"];
  return ["Kick", bass, sound.hookKind === "vox" ? "Vox hook" : sound.hookKind === "piano" ? "Piano" : sound.hookKind === "saw" ? "Saw lead" : sound.hookKind === "stab" ? "Stab" : "Screech", "Chop bus", ...extra];
}

function fitVocal(v: VocalSource, genre: GenreId): number {
  const likes = FROM_FIT[genre] ?? [];
  const src = v.from.toLowerCase().replace(/-/g, " ");
  if (likes.some((x) => src.includes(x.replace(/-/g, " ")))) return 3;
  if (genre === "extra-raw" || genre === "uptempo" || genre === "terror") {
    if (/(shout|whisper|spoken|yell|scream|chant|rap)/.test(v.chop)) return 2;
  }
  if (genre === "euphoric" || genre === "classic" || genre === "happy" || genre === "ukhc") {
    if (/(hook|sung|choir|vocal pad)/.test(v.chop)) return 2;
  }
  return 1;
}

function poolArtists(opts: RollOpts): Artist[] {
  if (opts.artistId) {
    const hit = ARTISTS.find((a) => a.id === opts.artistId);
    if (hit) return [hit];
  }
  let list = ARTISTS;
  if (opts.genre && opts.genre !== "all") list = list.filter((a) => a.genre === opts.genre);
  const needle = (opts.q ?? "").trim().toLowerCase();
  if (needle) list = list.filter((a) => a.name.toLowerCase().includes(needle));
  return list.length ? list : ARTISTS;
}

function poolVocals(opts: RollOpts, genre: GenreId): VocalSource[] {
  if (opts.vocalId) {
    const hit = VOCALS.find((v) => v.id === opts.vocalId);
    if (hit) return [hit];
  }
  let list = VOCALS;
  if (opts.era && opts.era !== "all") list = list.filter((v) => v.era === opts.era);
  if (opts.nicheOnly) list = list.filter((v) => v.niche);
  const needle = (opts.q ?? "").trim().toLowerCase();
  if (needle) {
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(needle) ||
        v.artist.toLowerCase().includes(needle) ||
        v.from.toLowerCase().includes(needle),
    );
  }
  if (!list.length) list = VOCALS.filter((v) => (opts.nicheOnly ? v.niche : true));
  if (!list.length) list = VOCALS;
  const ranked = [...list].sort((a, b) => fitVocal(b, genre) - fitVocal(a, genre));
  const best = ranked[0] ? fitVocal(ranked[0], genre) : 1;
  const top = ranked.filter((v) => fitVocal(v, genre) >= Math.max(1, best - 1));
  return top.length ? top : ranked;
}

function makeTitle(r: () => number, vocal: VocalSource, artist: Artist): string {
  const ws = wordsOf(vocal.title);
  const w = (pick(r, ws.length ? ws : ["Cut"]) ?? "Cut").toUpperCase();
  const tail = pick(r, ["DROP", "BREAK", "CUT", "CALL", "LOCK", "GRID", "CORE", "MARK"]);
  const lane = GENRE_LABEL[artist.genre].split(" ")[0]!.toUpperCase();
  if (r() < 0.35) return `${w} ${tail}`;
  if (r() < 0.5) return `${w} / ${lane}`;
  return `${lane} ${w}`;
}

function mapLine(phrases: Phrase[]): string {
  return phrases.map((p) => `${p.bars} ${p.label}`).join(" · ");
}

function phraseCount(phrases: Phrase[]): number {
  return phrases.reduce((n, p) => n + p.bars, 0) / 16;
}

export function barsOf(phrases: Phrase[]): number {
  return phrases.reduce((n, p) => n + p.bars, 0);
}

function chopHow(vocal: VocalSource, key: string, sound: Sound): string {
  if (sound.voxKind === "none") {
    return `Kick and ${sound.hookKind} carry it. Optional 1-bar teaser from ${vocal.title} in the break only.`;
  }
  return `Isolate the ${vocal.chop}. Pitch to ${key}. Grain 20–60 ms if it clicks. Reverse the last hit into the drop.`;
}

function process(vocal: VocalSource, artist: Artist, key: string, sound: Sound, mode: "dj" | "anthem"): string[] {
  const grid =
    mode === "dj"
      ? "Write in 16-bar DJ phrases. Mix in on the 1. No 4-bar tricks."
      : "Anthem map. 32-bar breaks, still land every section on a 16.";
  return [
    `Find a clean copy of ${vocal.artist} — ${vocal.title} (${vocal.year}). Title and year only — no rips, no pasted lyrics.`,
    vocal.why,
    `Lane: ${artist.name} · ${GENRE_LABEL[artist.genre]}. ${artist.tag}`,
    sound.kick,
    sound.bass,
    sound.hook,
    sound.vox,
    grid,
    `Pitch chops to ${key}. Sidechain the vox bus to the kick.`,
  ];
}

function concept(artist: Artist, vocal: VocalSource, sound: Sound, mode: "dj" | "anthem"): string {
  const niche = vocal.niche ? "Niche cut." : "Known hook — keep the chop short so it does not become a cover.";
  const grid = mode === "dj" ? "DJ 4×4." : "Anthem.";
  return `${artist.name} at ${artist.bpm}. ${grid} ${sound.kickKind} kick, ${sound.bassKind} bass, ${sound.hookKind} hook. Source ${vocal.artist}, ${vocal.year}. ${niche}`;
}

export function rollIdea(opts: RollOpts = {}): Idea {
  const seed = opts.seed ?? (Date.now() ^ Math.floor(Math.random() * 1e9));
  const r = rng(seed);
  const you = opts.you ?? YOU_DEFAULT;
  const artists = poolArtists(opts);
  const artist = pick(r, artists);
  const vocals = poolVocals(opts, artist.genre);
  const vocal = pick(r, vocals);
  const key = you.key !== "any" && you.key ? you.key : pick(r, KEYS);
  const { mode, phrases } = pickPhrases(r, artist.genre, you.phrases);
  const sound = makeSound(r, artist.genre, vocal, you);
  return {
    seed,
    title: makeTitle(r, vocal, artist),
    artist,
    vocal,
    bpm: artist.bpm,
    key,
    map: mapLine(phrases),
    phrases,
    phraseMode: mode,
    layers: layersOf(sound, artist.genre),
    sound,
    chopHow: chopHow(vocal, key, sound),
    process: process(vocal, artist, key, sound, mode),
    concept: concept(artist, vocal, sound, mode),
    search: `${vocal.artist} ${vocal.title} ${vocal.year}`,
  };
}

export function ideaText(idea: Idea): string {
  const units = idea.phrases?.length ? phraseCount(idea.phrases) : 0;
  const mode = idea.phraseMode === "anthem" ? "ANTHEM" : "DJ 4x4";
  return [
    `VOCAL SOURCE`,
    `TITLE: ${idea.title}`,
    `LANE: ${idea.artist.name} · ${GENRE_LABEL[idea.artist.genre]} · ${idea.bpm} · ${idea.key}`,
    `GRID: ${mode} · ${units} phrases · ${barsOf(idea.phrases ?? [])} bars`,
    `KICK: ${idea.sound?.kick ?? ""}`,
    `BASS: ${idea.sound?.bass ?? ""}`,
    `HOOK: ${idea.sound?.hook ?? ""}`,
    `VOX: ${idea.sound?.vox ?? ""}`,
    `VOCAL: ${idea.vocal.artist} — ${idea.vocal.title} (${idea.vocal.year})${idea.vocal.niche ? " · niche" : ""}`,
    `FROM: ${idea.vocal.from} · chop: ${idea.vocal.chop}`,
    `WHY: ${idea.vocal.why}`,
    `HOW: ${idea.chopHow}`,
    `MAP: ${idea.map}`,
    `LAYERS: ${idea.layers.join(", ")}`,
    `CONCEPT: ${idea.concept}`,
    ``,
    `PROCESS:`,
    ...idea.process.map((p) => `- ${p}`),
    ``,
    `SEARCH: ${idea.search}`,
    `Titles and years only. Source and clear your own vocals.`,
  ].join("\n");
}

export function youtubeSearch(q: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export function discogsSearch(q: string): string {
  return `https://www.discogs.com/search/?q=${encodeURIComponent(q)}&type=all`;
}
