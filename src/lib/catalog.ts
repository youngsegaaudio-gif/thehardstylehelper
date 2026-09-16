import type {
  ArrangementSection,
  LayerId,
  MusicalKey,
  StyleId,
} from "./types";

export const LAYER_LABELS: Record<LayerId, string> = {
  kick: "Kick",
  clap: "Clap / snare",
  hats: "Hats",
  "reverse-bass": "Reverse bass",
  sub: "Sub / bass",
  pad: "Pad",
  chords: "Chord stabs",
  lead: "Lead",
  screech: "Screech",
  vocal: "Vocal",
  fx: "FX / risers",
  atmosphere: "Atmosphere",
};

export type StyleProfile = {
  id: StyleId;
  name: string;
  aka: string;
  bpm: number;
  bpmRange: [number, number];
  defaultKey: MusicalKey;
  energy: string;
  dna: string[];
  arrangement: ArrangementSection[];
  progression: string;
  references: string[];
};

const phrase = (
  kind: ArrangementSection["kind"],
  label: string,
  startBar: number,
  bars: number,
  i: number,
): ArrangementSection => ({
  id: `${kind}-${i}`,
  kind,
  label,
  startBar,
  bars,
});

/** Classic raw / hardstyle 32-bar phrasing, ~5:07 at 150. */
export const RAW_MAP: ArrangementSection[] = [
  phrase("intro", "Kick intro", 0, 16, 0),
  phrase("intro", "Groove in", 16, 16, 1),
  phrase("break", "Break 1", 32, 32, 0),
  phrase("build", "Build 1", 64, 16, 0),
  phrase("drop", "Drop 1", 80, 32, 0),
  phrase("break", "Break 2", 112, 32, 1),
  phrase("build", "Build 2", 144, 16, 1),
  phrase("drop", "Drop 2", 160, 32, 1),
  phrase("outro", "Outro", 192, 16, 0),
];

/** UK hardcore / Darren: piano motif, 170, slightly longer breaks. */
export const UKHC_MAP: ArrangementSection[] = [
  phrase("intro", "Piano / drums in", 0, 16, 0),
  phrase("intro", "Groove", 16, 16, 1),
  phrase("break", "Vocal / piano break", 32, 32, 0),
  phrase("build", "Snare build", 64, 16, 0),
  phrase("drop", "Drop 1", 80, 32, 0),
  phrase("break", "Breakdown 2", 112, 24, 1),
  phrase("build", "Build 2", 136, 16, 1),
  phrase("drop", "Drop 2", 152, 32, 1),
  phrase("outro", "Outro", 184, 16, 0),
];

/** Happy hardcore / S3RL: hook first, shorter phrases, vocal-led. */
export const HAPPY_MAP: ArrangementSection[] = [
  phrase("intro", "Hook tease", 0, 16, 0),
  phrase("break", "Vocal verse", 16, 16, 0),
  phrase("build", "Build 1", 32, 16, 0),
  phrase("drop", "Drop 1", 48, 32, 0),
  phrase("break", "Break / second hook", 80, 16, 1),
  phrase("build", "Build 2", 96, 16, 1),
  phrase("drop", "Drop 2", 112, 32, 1),
  phrase("outro", "Outro", 144, 16, 0),
];

/** Hard techno: DJ-tool phrases, kick stays, filter breaks not emotional choruses. */
export const TECHNO_MAP: ArrangementSection[] = [
  phrase("intro", "Kick in", 0, 32, 0),
  phrase("intro", "Groove", 32, 32, 1),
  phrase("break", "Filter break", 64, 16, 0),
  phrase("build", "Build 1", 80, 16, 0),
  phrase("drop", "Peak 1", 96, 32, 0),
  phrase("break", "Filter break 2", 128, 16, 1),
  phrase("build", "Build 2", 144, 16, 1),
  phrase("drop", "Peak 2", 160, 32, 1),
  phrase("outro", "Outro", 192, 16, 0),
];

export const FRENCH_MAP: ArrangementSection[] = [
  phrase("intro", "Kick in", 0, 16, 0),
  phrase("build", "Build", 16, 16, 0),
  phrase("drop", "Drop 1", 32, 32, 0),
  phrase("break", "Break", 64, 16, 0),
  phrase("build", "Build 2", 80, 16, 1),
  phrase("drop", "Drop 2", 96, 32, 1),
  phrase("outro", "Outro", 128, 8, 0),
];

export const GABBER_MAP: ArrangementSection[] = [
  phrase("intro", "Kick wall", 0, 16, 0),
  phrase("drop", "Drop 1", 16, 32, 0),
  phrase("break", "Stab break", 48, 16, 0),
  phrase("drop", "Drop 2", 64, 32, 1),
  phrase("outro", "Outro", 96, 8, 0),
];

export const TRANCE_MAP: ArrangementSection[] = [
  phrase("intro", "Groove in", 0, 16, 0),
  phrase("break", "Melody break", 16, 32, 0),
  phrase("build", "Long build", 48, 32, 0),
  phrase("drop", "Drop 1", 80, 32, 0),
  phrase("break", "Break 2", 112, 32, 1),
  phrase("build", "Build 2", 144, 16, 1),
  phrase("drop", "Drop 2", 160, 32, 1),
  phrase("outro", "Outro", 192, 16, 0),
];

export const HOUSE_MAP: ArrangementSection[] = [
  phrase("intro", "Groove", 0, 32, 0),
  phrase("break", "Breakdown", 32, 16, 0),
  phrase("build", "Build", 48, 16, 0),
  phrase("drop", "Drop 1", 64, 32, 0),
  phrase("break", "Break 2", 96, 16, 1),
  phrase("drop", "Drop 2", 112, 32, 1),
  phrase("outro", "Outro", 144, 16, 0),
];

export const UPTEMPO_MAP: ArrangementSection[] = [
  phrase("intro", "Kick / atmosphere", 0, 16, 0),
  phrase("break", "Break", 16, 16, 0),
  phrase("build", "Build", 32, 16, 0),
  phrase("drop", "Drop 1", 48, 32, 0),
  phrase("break", "Break 2", 80, 16, 1),
  phrase("build", "Build 2", 96, 16, 1),
  phrase("drop", "Drop 2", 112, 32, 1),
  phrase("outro", "Outro", 144, 8, 0),
];

export const STYLES: Record<StyleId, StyleProfile> = {
  "ar-gang": {
    id: "ar-gang",
    name: "AR Gang",
    aka: "Rawstyle",
    bpm: 152,
    bpmRange: [150, 155],
    defaultKey: "G minor",
    energy: "Dark, industrial, reverse-bass first",
    dna: [
      "Kick and reverse bass locked before any melody",
      "Screeches as the drop hook, not pretty supersaws",
      "Breaks stay dark — pads, atmospheres, spoken or chopped vox",
      "Second drop adds a layer or pitch-up, never a full rewrite",
      "Minor keys only. Stabs on 1, sometimes 1 and 3",
    ],
    arrangement: RAW_MAP,
    progression: "i – VI – III – VII",
    references: [
      "Raw kick + reverse bass as the whole identity",
      "Screech in the mid-highs, short tails",
      "Break = tension, not a pop chorus",
    ],
  },
  "lil-texas": {
    id: "lil-texas",
    name: "Lil Texas",
    aka: "Happy hardstyle",
    bpm: 160,
    bpmRange: [155, 170],
    defaultKey: "A minor",
    energy: "Aggressive kick, happy melody, vocal chops",
    dna: [
      "Hard kick like rawstyle, topline like happy hardcore",
      "Pitched vocal chops as a rhythmic instrument",
      "Supersaw leads with bounce, not epic trance tails",
      "Claps and hats busier than classic hardstyle",
      "Drops hit immediately — less 32-bar tease",
    ],
    arrangement: HAPPY_MAP,
    progression: "i – VI – VII – i",
    references: [
      "Kick punch + happy hook in the same drop",
      "Chopped vox on offbeats",
      "Faster hats, more bounce",
    ],
  },
  "darren-styles": {
    id: "darren-styles",
    name: "Darren Styles",
    aka: "UK hardcore",
    bpm: 170,
    bpmRange: [168, 175],
    defaultKey: "A minor",
    energy: "Piano-led, emotional, rolling bass",
    dna: [
      "Piano motif is the song — write it before the drop",
      "Rolling / offbeat bass under the 170 kick, not reverse bass",
      "Supersaw stacks double the piano, not replace it",
      "Vocals sit in the break; drop is instrumental power",
      "Snare builds are long and clean, not over-FX'd",
    ],
    arrangement: UKHC_MAP,
    progression: "i – VI – III – VII  (or I – V – vi – IV in relative major)",
    references: [
      "Piano hook you can hum",
      "170 rolling bass",
      "Emotional break → huge saw drop",
    ],
  },
  s3rl: {
    id: "s3rl",
    name: "S3RL",
    aka: "Happy hardcore",
    bpm: 175,
    bpmRange: [170, 180],
    defaultKey: "F minor",
    energy: "Hook-first, anime/nightcore vocal, simple lead",
    dna: [
      "Vocal hook in the first 16 bars — the track is the catchphrase",
      "Leads are simple, catchy, often monophonic",
      "Nightcore-style pitch on vox is a feature, not a joke",
      "Drops are bouncy 4/4, not raw-distorted",
      "Keep arrangement tight. No 64-bar cinematic intros",
    ],
    arrangement: HAPPY_MAP,
    progression: "i – III – VII – IV",
    references: [
      "One unforgettable vocal line",
      "Bouncy kick, clean lead",
      "Short, replayable structure",
    ],
  },
  hardstyle: {
    id: "hardstyle",
    name: "Hardstyle",
    aka: "Classic / euphoric",
    bpm: 150,
    bpmRange: [148, 153],
    defaultKey: "A minor",
    energy: "Reverse bass, climax lead, 32-bar phrases",
    dna: [
      "Reverse bass is the groove — kick on 1, bass filling the rest",
      "Climax lead in the drop, melody born in the break",
      "32-bar phrases. Do not skip the second break",
      "Kick punch + click, not wall of distortion",
      "White noise and reverse FX for every transition",
    ],
    arrangement: RAW_MAP,
    progression: "i – VI – III – VII",
    references: [
      "Break melody becomes drop lead",
      "Reverse bass locked to kick",
      "Second drop = extra unison / extra octave",
    ],
  },
  rawstyle: {
    id: "rawstyle",
    name: "Rawstyle",
    aka: "Industrial hardstyle",
    bpm: 152,
    bpmRange: [150, 160],
    defaultKey: "G minor",
    energy: "Distorted kick, screech, no pretty climax",
    dna: [
      "Kick design is the drop. If the kick is weak, stop writing melody",
      "Screeches, stabs, and atmospheres instead of euphoric leads",
      "Breaks are dark and sparse",
      "Compression and clipper on the kick bus, not a limiter-only chain",
      "Leave space. Raw is empty + violent, not dense",
    ],
    arrangement: RAW_MAP,
    progression: "i – VII – VI – VII",
    references: [
      "Kick first",
      "Screech as hook",
      "Dark break, violent drop",
    ],
  },
  "hard-techno": {
    id: "hard-techno",
    name: "Hard techno",
    aka: "PVC / peak-time",
    bpm: 148,
    bpmRange: [142, 155],
    defaultKey: "E minor",
    energy: "PVC kick, extra layers, short switches, DJ tool",
    dna: [
      "The kick is a PVC stack: peak + click extra + sub extra. No reverse bass",
      "Transitions are 1-bar mutes, fill rolls, and impacts — not 16-bar snare poems",
      "Stabs and industrial FX, not climax supersaws",
      "Kick barely leaves. Filter it, don't write a pop break",
      "Extra kicks live at phrase edges (last bar of 16, downbeat of 32)",
    ],
    arrangement: TECHNO_MAP,
    progression: "i – VII – VI – VII",
    references: [
      "Peak PVC every beat",
      "Extra kick fills at 16s",
      "1-bar mute → impact slam",
    ],
  },
  uptempo: {
    id: "uptempo",
    name: "Uptempo",
    aka: "Hardcore / uptempo",
    bpm: 205,
    bpmRange: [195, 220],
    defaultKey: "E minor",
    energy: "Fast distorted kicks, short phrases, industrial FX",
    dna: [
      "Kick is 90% of the drop. Distortion before EQ",
      "No reverse bass — gabber kicks and offbeat hoovers or nothing",
      "Phrases stay short. Hits come early",
      "Vocals are shouts, chops, or one-liners",
      "High-passed everything that isn't the kick",
    ],
    arrangement: UPTEMPO_MAP,
    progression: "i – VI – i – VII",
    references: [
      "Kick wall",
      "Industrial FX",
      "Short, punishing drops",
    ],
  },
  "happy-hardcore": {
    id: "happy-hardcore",
    name: "Happy hardcore",
    aka: "UK happy / freeform-adjacent",
    bpm: 170,
    bpmRange: [165, 180],
    defaultKey: "A minor",
    energy: "Piano, hoover, pitched vox, 170 bounce",
    dna: [
      "Piano or hoover riff is the hook",
      "Offbeat bass, not reverse bass",
      "Pitched-up vocals, major-colour even in minor keys",
      "Stabs and arps, busy but clean",
      "Drops should feel like a fairground, not a warehouse",
    ],
    arrangement: UKHC_MAP,
    progression: "i – III – IV – VII",
    references: [
      "Piano riff",
      "Offbeat bass",
      "Pitched vocal hook",
    ],
  },
  "early-hardstyle": {
    id: "early-hardstyle",
    name: "Early hardstyle",
    aka: "Reverse bass era",
    bpm: 140,
    bpmRange: [138, 150],
    defaultKey: "A minor",
    energy: "Slow reverse bass, pitched kicks, 140",
    dna: [
      "Reverse bass is the whole groove",
      "Pitched kicks, less clipper-wall",
      "Longer phrases, trance DNA",
    ],
    arrangement: RAW_MAP,
    progression: "i – VI – III – VII",
    references: ["140 reverse bass", "Pitched kick", "Trance break into hard kick"],
  },
  "extra-raw": {
    id: "extra-raw",
    name: "Extra raw",
    aka: "Xtra raw",
    bpm: 160,
    bpmRange: [155, 165],
    defaultKey: "E minor",
    energy: "Faster raw, screaming kicks, no melody needed",
    dna: [
      "Kick design is the track",
      "Screeches as one-shots",
      "Breaks are noise and voice",
    ],
    arrangement: RAW_MAP,
    progression: "i – VII – VI – VII",
    references: ["Kick first", "Screech hits", "Empty + violent"],
  },
  schranz: {
    id: "schranz",
    name: "Schranz",
    aka: "Hard techno loop",
    bpm: 150,
    bpmRange: [145, 155],
    defaultKey: "E minor",
    energy: "Loop techno, industrial hats, relentless kick",
    dna: [
      "Kick never leaves",
      "Looped industrial percussion",
      "DJ tool, not a song",
    ],
    arrangement: TECHNO_MAP,
    progression: "i – VII – i – VII",
    references: ["Loop kick", "Metal hats", "No chorus"],
  },
  frenchcore: {
    id: "frenchcore",
    name: "Frenchcore",
    aka: "200 BPM hardcore",
    bpm: 200,
    bpmRange: [190, 210],
    defaultKey: "A minor",
    energy: "Distorted 200 kicks, offbeat bass, rave stabs",
    dna: [
      "Distorted kick on every beat",
      "Offbeat bass under it",
      "Stabs and vox shouts",
    ],
    arrangement: FRENCH_MAP,
    progression: "i – VI – VII – i",
    references: ["200 kick", "Offbeat bass", "Rave stab"],
  },
  gabber: {
    id: "gabber",
    name: "Gabber",
    aka: "Rotterdam",
    bpm: 180,
    bpmRange: [170, 190],
    defaultKey: "E minor",
    energy: "Hoover, distorted kick, short track",
    dna: [
      "Overdriven kick",
      "Hoover or stab hook",
      "No pretty break",
    ],
    arrangement: GABBER_MAP,
    progression: "i – VII – VI – VII",
    references: ["Hoover", "Kick wall", "Short arrangement"],
  },
  millenium: {
    id: "millenium",
    name: "Millennium",
    aka: "Early hardcore",
    bpm: 175,
    bpmRange: [165, 185],
    defaultKey: "A minor",
    energy: "Classic hardcore kicks, stabs, 90s rave",
    dna: [
      "Stamp kick, not modern PVC",
      "Rave stabs and hoovers",
      "Simple 16s",
    ],
    arrangement: GABBER_MAP,
    progression: "i – III – VII – i",
    references: ["Stamp kick", "Rave stab", "Classic hardcore"],
  },
  terror: {
    id: "terror",
    name: "Terror",
    aka: "Terrorcore",
    bpm: 210,
    bpmRange: [200, 230],
    defaultKey: "E minor",
    energy: "Faster than uptempo, industrial noise, no hook needed",
    dna: [
      "Kick is a weapon",
      "Noise and screams",
      "Phrases tiny",
    ],
    arrangement: UPTEMPO_MAP,
    progression: "i – i – i – VII",
    references: ["Noise kick", "Screams", "No melody"],
  },
  "hard-house": {
    id: "hard-house",
    name: "Hard house",
    aka: "UK hard house / donk-adjacent",
    bpm: 142,
    bpmRange: [138, 148],
    defaultKey: "A minor",
    energy: "Offbeat bass, stabs, 142 four-to-the-floor",
    dna: [
      "Offbeat bass is the groove",
      "Stabs on the 1",
      "DJ-friendly 32s",
    ],
    arrangement: HOUSE_MAP,
    progression: "i – VI – VII – i",
    references: ["Offbeat bass", "Stab hook", "142 groove"],
  },
  "hard-trance": {
    id: "hard-trance",
    name: "Hard trance",
    aka: "140 trance / early hard",
    bpm: 142,
    bpmRange: [138, 148],
    defaultKey: "A minor",
    energy: "Long builds, supersaw, harder kick than trance",
    dna: [
      "Melody in the break",
      "Long snare build",
      "Kick harder than trance, softer than raw",
    ],
    arrangement: TRANCE_MAP,
    progression: "i – VI – III – VII",
    references: ["Long build", "Supersaw", "Harder kick"],
  },
  jumpstyle: {
    id: "jumpstyle",
    name: "Jumpstyle",
    aka: "Jump / tekstyle",
    bpm: 150,
    bpmRange: [140, 155],
    defaultKey: "A minor",
    energy: "Bouncy reverse-ish kick, happy stabs",
    dna: [
      "Bounce over distortion",
      "Simple stab hook",
      "Danceable 150",
    ],
    arrangement: HAPPY_MAP,
    progression: "i – VI – VII – i",
    references: ["Bouncy kick", "Stab riff", "Happy energy"],
  },
  "industrial-hardcore": {
    id: "industrial-hardcore",
    name: "Industrial hardcore",
    aka: "Industrial / crossbreed-adjacent",
    bpm: 175,
    bpmRange: [165, 185],
    defaultKey: "E minor",
    energy: "Broken drums optional, industrial FX, dark",
    dna: [
      "Texture over pretty leads",
      "Kicks distorted and mid-heavy",
      "Dark atmospheres",
    ],
    arrangement: UPTEMPO_MAP,
    progression: "i – VII – VI – VII",
    references: ["Industrial FX", "Dark kick", "No climax saw"],
  },
};

export const STYLE_LIST = Object.values(STYLES);

export type StyleFamily = "raw" | "happy" | "uk" | "up" | "techno" | "euphoric";

export function family(style: StyleId): StyleFamily {
  if (style === "ar-gang" || style === "rawstyle" || style === "extra-raw" || style === "industrial-hardcore")
    return "raw";
  if (style === "s3rl" || style === "lil-texas" || style === "happy-hardcore" || style === "jumpstyle")
    return "happy";
  if (style === "darren-styles" || style === "hard-house") return "uk";
  if (style === "uptempo" || style === "frenchcore" || style === "gabber" || style === "millenium" || style === "terror")
    return "up";
  if (style === "hard-techno" || style === "schranz") return "techno";
  return "euphoric";
}

export function totalBars(style: StyleId): number {
  const map = STYLES[style].arrangement;
  const last = map[map.length - 1];
  return last.startBar + last.bars;
}

export function sectionAt(style: StyleId, bar: number): ArrangementSection {
  const map = STYLES[style].arrangement;
  const clamped = Math.max(0, Math.min(bar, totalBars(style) - 1));
  for (let i = map.length - 1; i >= 0; i--) {
    if (clamped >= map[i].startBar) return map[i];
  }
  return map[0];
}

export function barsLeftInSection(style: StyleId, bar: number): number {
  const s = sectionAt(style, bar);
  return s.startBar + s.bars - bar;
}

export function barDurationSec(bpm: number): number {
  return (60 / bpm) * 4;
}

export function timestampForBar(bpm: number, bar: number): string {
  const sec = bar * barDurationSec(bpm);
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const KEY_NOTES: Record<MusicalKey, { root: number; scale: number[]; chords: string[] }> =
  {
    "A minor": {
      root: 57,
      scale: [57, 59, 60, 62, 64, 65, 67, 69],
      chords: ["Am", "F", "C", "G"],
    },
    "G minor": {
      root: 55,
      scale: [55, 57, 58, 60, 62, 63, 65, 67],
      chords: ["Gm", "Eb", "Bb", "F"],
    },
    "F minor": {
      root: 53,
      scale: [53, 55, 56, 58, 60, 61, 63, 65],
      chords: ["Fm", "Db", "Ab", "Eb"],
    },
    "E minor": {
      root: 52,
      scale: [52, 54, 55, 57, 59, 60, 62, 64],
      chords: ["Em", "C", "G", "D"],
    },
    "D minor": {
      root: 50,
      scale: [50, 52, 53, 55, 57, 58, 60, 62],
      chords: ["Dm", "Bb", "F", "C"],
    },
    "C minor": {
      root: 48,
      scale: [48, 50, 51, 53, 55, 56, 58, 60],
      chords: ["Cm", "Ab", "Eb", "Bb"],
    },
    "B minor": {
      root: 59,
      scale: [59, 61, 62, 64, 66, 67, 69, 71],
      chords: ["Bm", "G", "D", "A"],
    },
    "F# minor": {
      root: 54,
      scale: [54, 56, 57, 59, 61, 62, 64, 66],
      chords: ["F#m", "D", "A", "E"],
    },
  };
