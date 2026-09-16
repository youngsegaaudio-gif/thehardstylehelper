export type School = "raw" | "euphoric" | "uk" | "hardcore" | "ar-gang" | "lil-texas";
export type VoxKind = "shout" | "chop" | "sung" | "computer" | "mc" | "crowd";
export type SourceKind = "record" | "tts" | "pack" | "scrap" | "collab" | "hum";

export const SCHOOLS: { id: School; label: string }[] = [
  { id: "ar-gang", label: "AR Gang" },
  { id: "raw", label: "Raw" },
  { id: "euphoric", label: "Euphoric" },
  { id: "lil-texas", label: "Lil Texas" },
  { id: "uk", label: "UK" },
  { id: "hardcore", label: "Hardcore" },
];

export const VOX: { id: VoxKind; label: string }[] = [
  { id: "shout", label: "Shout" },
  { id: "chop", label: "Chop" },
  { id: "sung", label: "Sung" },
  { id: "computer", label: "Computer" },
  { id: "mc", label: "MC" },
  { id: "crowd", label: "Crowd" },
];

export const SOURCES: { id: SourceKind; label: string }[] = [
  { id: "record", label: "Record" },
  { id: "tts", label: "TTS" },
  { id: "pack", label: "Your pack" },
  { id: "scrap", label: "Session scrap" },
  { id: "collab", label: "Collab" },
  { id: "hum", label: "Hum + pitch" },
];

export const KEYS = ["A minor", "G minor", "F minor", "E minor", "D minor"] as const;

export type Cut = {
  seed: number;
  school: School;
  vox: VoxKind;
  source: SourceKind;
  bpm: number;
  key: string;
  vibe: string;
  title: string;
  concept: string;
  structure: string;
  lines: string[];
  chop: string;
  sourceHow: string;
  process: string[];
  idea: string;
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
function pickN<T>(r: () => number, xs: T[], n: number): T[] {
  const pool = xs.slice();
  const out: T[] = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(r() * pool.length);
    out.push(pool.splice(i, 1)[0]!);
  }
  return out;
}

const BPM: Record<School, number[]> = {
  "ar-gang": [150, 152, 154, 155],
  raw: [150, 155, 160],
  euphoric: [148, 150, 152],
  "lil-texas": [158, 160, 164],
  uk: [168, 170, 174],
  hardcore: [175, 180, 190, 200],
};

const TITLES: Record<School, string[]> = {
  "ar-gang": ["Empty Room", "No Melody", "One Line", "Kick First", "Leave Holes", "Cut The Air"],
  raw: ["Wall", "No Pretty", "Dark Break", "Stamp", "Industrial", "Stay Heavy"],
  euphoric: ["Last Eight", "Same Melody", "Open Sky", "Hold The Note", "Climax Left"],
  "lil-texas": ["Bounce Hook", "Chop First", "Offbeat", "Fast Smile", "Hook In Eight"],
  uk: ["Piano Four", "Happy Knife", "Fairground", "170 Bounce", "Riff First"],
  hardcore: ["Kick Wall", "One Shout", "Stop Writing", "Hoover", "Stamp It"],
};

const CONCEPTS: Record<School, string[]> = {
  "ar-gang": [
    "Spoken line in the break. Screech is the only drop hook.",
    "Kick and reverse bass for 32. Vocal is one sentence, not a verse.",
    "Empty 8 bars, then one chopped word. That's the identity.",
  ],
  raw: [
    "Kick is the track. Vocal is a stamp, not a story.",
    "Dark pad break. Shout on the last bar before the wall.",
    "Industrial FX glue. Leave holes so the vox hits.",
  ],
  euphoric: [
    "Break melody becomes the drop lead. Vocal sits in the break only.",
    "Sung hook, 8 bars. Drop restates a chop of the last word.",
    "Choir under the last 8 of drop 2. Lead still wins.",
  ],
  "lil-texas": [
    "Chopped vocal is the rhythm. Happy lead, hard kick.",
    "Hook in 8 bars. Drop hits immediately.",
    "Pitched vox offbeats. Bounce hats, not epic tails.",
  ],
  uk: [
    "4-bar piano riff first. Vocal hook is the song.",
    "Sung line, then a pitched chop of the same line in the drop.",
    "Snare last 4 of the 16. Vocal delay throw in the break only.",
  ],
  hardcore: [
    "Kick wall. Stab. One shout. Stop writing.",
    "Hoover or nothing. Vocal is a stamp on 1.",
    "Short map. Distortion before EQ. Shout clipped.",
  ],
};

const STRUCT: Record<School, string[]> = {
  "ar-gang": ["16 kick · 16 dark break · 8 build · 32 drop · 16 break · 32 drop 2"],
  raw: ["32 kick · 16 break · 16 build · 32 peak · 16 break · 32 peak 2"],
  euphoric: ["16 groove · 32 melody break · 16 build · 32 climax · 16 break · 32 climax 2"],
  "lil-texas": ["8 hook · 32 drop · 16 break · 8 build · 32 drop 2"],
  uk: ["16 piano · 16 vocal · 16 build · 32 bounce · 16 break · 32 bounce 2"],
  hardcore: ["8 kick · 8 shout · 16 peak · 8 break · 16 peak 2 · 8 outro"],
};

const LINES: Record<VoxKind, string[]> = {
  shout: [
    "cut it",
    "stay down",
    "no melody",
    "kick first",
    "leave it empty",
    "harder",
    "one more",
    "now",
    "don't stop",
    "this is it",
    "head first",
    "no pretty",
  ],
  chop: [
    "cut",
    "list",
    "head",
    "noise",
    "go",
    "wait",
    "drop",
    "hold",
    "run",
    "back",
    "again",
    "fire",
  ],
  sung: [
    "I keep the lights off when the kick comes in",
    "you said wait, I said now",
    "same melody, harder this time",
    "don't call it pretty, call it loud",
    "I built this in the dark on purpose",
    "leave the last eight empty for me",
  ],
  computer: [
    "system ready",
    "load the kick",
    "vocal offline",
    "cut list confirmed",
    "no melody detected",
    "drop in eight",
    "hold the line",
    "overwrite",
  ],
  mc: [
    "put your hands up if the kick hits",
    "this one is for the floor",
    "make some noise",
    "we go again",
    "harder than last time",
    "let it go",
  ],
  crowd: [
    "hey",
    "ho",
    "yeah",
    "whoa",
    "oi",
    "come on",
  ],
};

const CHOP: Record<VoxKind, string[]> = {
  shout: ["One word. Bar 1 of the drop. No delay in the drop, delay in the break only."],
  chop: [
    "Slice to 1/8. Pitch +5 or +7 on every other hit. Reverse the last slice of the bar.",
    "Gate to 16ths. Keep consonants. Throw the vowel on a send.",
  ],
  sung: ["Keep the full line in the break. Chop the last word into the drop as 1/8s."],
  computer: ["Robot TTS. Short. No vibrato. Slight formant down. Chop the last syllable."],
  mc: ["Leave the full phrase. Don't slice an MC. Delay throw on the last word."],
  crowd: ["Layer 3 takes. Slightly detune. Short. Hits on 1 and 3."],
};

const SOURCE_HOW: Record<SourceKind, string> = {
  record:
    "New audio track in Logic. One line, three takes. Closest mic you have. Dry. Punch in 8 bars.",
  tts: "Generate the lines in a computer / robot / anime TTS you already use. Export wav. Don't stream-rip.",
  pack: "Search your own packs: shout, acapella, vocal chop, hardstyle vox. If you don't own it, skip it.",
  scrap: "Pull an unused take from this session or an old bounce. Pitch it. That's a new hook.",
  collab: "Send the four lines to someone. One take. No stack. You chop.",
  hum: "Hum the rhythm on a mic. Pitch it into the key. Consonants later.",
};

function process(vox: VoxKind, source: SourceKind): string[] {
  const base = [
    "Logic Channel EQ — HP 120 Hz. Scoop 300 if it booms.",
    "Compressor after EQ. Fast atk on shouts, slower on sung.",
    "Delay on a send, not an insert. Mute the send in the drop.",
  ];
  if (vox === "shout" || vox === "crowd") {
    return ["Clip after the compressor. Center.", ...base];
  }
  if (vox === "computer") {
    return ["Formant down a little. Bitcrush optional. Keep it short.", ...base];
  }
  if (vox === "chop") {
    return ["Gate the tail. Pitch with Logic Pitch or your sampler.", ...base];
  }
  if (source === "tts") {
    return ["Export wav from TTS. Don't leave the platform voice raw — EQ and clip.", ...base];
  }
  return base;
}

const EXTRA_IDEAS = [
  "Write the vocal before the kick is pretty.",
  "If the line needs a second sentence, it's too long.",
  "Drop restates one word from the break. That's enough.",
  "Mute the vox for 8 bars. The next hit lands harder.",
  "Same line, two pitches. That's a hook.",
];

export function generateCut(opts: {
  school: School;
  vox: VoxKind;
  source: SourceKind;
  key?: string;
  vibe?: string;
  seed?: number;
}): Cut {
  const seed = opts.seed ?? ((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
  const r = rng(seed);
  const bpm = pick(r, BPM[opts.school]);
  const key = opts.key ?? pick(r, KEYS as unknown as string[]);
  const title = pick(r, TITLES[opts.school]);
  const n = opts.vox === "sung" || opts.vox === "mc" ? 2 : opts.vox === "chop" ? 4 : 3;
  const lines = pickN(r, LINES[opts.vox], n);
  const vibe = (opts.vibe ?? "").trim();
  const concept = vibe
    ? `${pick(r, CONCEPTS[opts.school])} Vibe: ${vibe}.`
    : pick(r, CONCEPTS[opts.school]);
  return {
    seed,
    school: opts.school,
    vox: opts.vox,
    source: opts.source,
    bpm,
    key,
    vibe,
    title,
    concept,
    structure: pick(r, STRUCT[opts.school]),
    lines,
    chop: pick(r, CHOP[opts.vox]),
    sourceHow: SOURCE_HOW[opts.source],
    process: process(opts.vox, opts.source),
    idea: pick(r, EXTRA_IDEAS),
  };
}

export function cutText(c: Cut) {
  return [
    `CUTLIST — ${c.title}`,
    `${c.bpm} BPM · ${c.key} · ${c.school} · ${c.vox} · ${c.source} · seed ${c.seed}`,
    c.vibe ? `VIBE\n${c.vibe}\n` : "",
    ``,
    `CONCEPT`,
    c.concept,
    ``,
    `STRUCTURE`,
    c.structure,
    ``,
    `LINES (original — record / TTS / pack you own. Don't rip acapellas.)`,
    ...c.lines.map((l) => `  ${l}`),
    ``,
    `SOURCE`,
    c.sourceHow,
    ``,
    `CHOP`,
    c.chop,
    ``,
    `PROCESS`,
    ...c.process.map((p) => `  - ${p}`),
    ``,
    `NOTE`,
    c.idea,
  ].join("\n");
}
