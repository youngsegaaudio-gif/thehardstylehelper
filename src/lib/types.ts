export const STYLE_IDS = [
  "ar-gang",
  "lil-texas",
  "darren-styles",
  "s3rl",
  "hardstyle",
  "early-hardstyle",
  "rawstyle",
  "extra-raw",
  "hard-techno",
  "schranz",
  "uptempo",
  "frenchcore",
  "gabber",
  "millenium",
  "terror",
  "happy-hardcore",
  "hard-house",
  "hard-trance",
  "jumpstyle",
  "industrial-hardcore",
] as const;

export type StyleId = (typeof STYLE_IDS)[number];

export const KEYS = [
  "A minor",
  "G minor",
  "F minor",
  "E minor",
  "D minor",
  "C minor",
  "B minor",
  "F# minor",
] as const;

export type MusicalKey = (typeof KEYS)[number];

export const LAYER_IDS = [
  "kick",
  "clap",
  "hats",
  "reverse-bass",
  "sub",
  "pad",
  "chords",
  "lead",
  "screech",
  "vocal",
  "fx",
  "atmosphere",
] as const;

export type LayerId = (typeof LAYER_IDS)[number];

export type SectionKind =
  | "intro"
  | "break"
  | "build"
  | "drop"
  | "outro";

export type ArrangementSection = {
  id: string;
  kind: SectionKind;
  label: string;
  startBar: number;
  bars: number;
};

export type NoteItem = {
  id: string;
  title: string;
  detail: string;
  bars?: string;
  tag?: string;
};

export type InstrumentIdea = {
  name: string;
  role: string;
  how: string;
};

export type MixRecipe = {
  layer: string;
  eq: string;
  compression: string;
  plugins: string;
};

export type SerumRecipe = {
  title: string;
  sound: string;
  osc: string[];
  filterEnv: string[];
  fx: string[];
  mix: string[];
};

export type LogicMove = {
  title: string;
  steps: string[];
};

export type SongPlanItem = {
  id: string;
  label: string;
  kind: SectionKind;
  startBar: number;
  bars: number;
  do: string;
};

export type KickKind = "main" | "extra" | "fill" | "ghost" | "impact";

export type KickRecipe = {
  id: string;
  name: string;
  kind: KickKind;
  length: string;
  eq: string;
  compression: string;
  plugins: string;
  where: string;
};

export type TransitionHit = {
  id: string;
  at: string;
  bars: string;
  what: string;
  how: string;
  near?: boolean;
};

export type SpeakerSpot = {
  id: string;
  name: string;
  pan: number;
  place: string;
  ref: string;
};

export type CoachPack = {
  headline: string;
  why: string;
  nextMove: string;
  barPlan: NoteItem[];
  instruments: InstrumentIdea[];
  mix: MixRecipe[];
  serum: SerumRecipe[];
  logic: LogicMove[];
  arrangementNote: string;
  songPlan: SongPlanItem[];
};

export type TrackSession = {
  id: string;
  name: string;
  style: StyleId;
  bpm: number;
  key: MusicalKey;
  bar: number;
  layers: LayerId[];
  notes: string;
  checked: string[];
  aiCoach: CoachPack | null;
  updatedAt: number;
};
