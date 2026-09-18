/**
 * Everything the user can override, in one serialisable object.
 * Lanes, analysis behaviour, plugin preferences, own notes, appearance.
 * `effectiveGenres()` folds overrides and custom lanes into the built-in list.
 */
import { HH_GENRES, type GenreTargets, type HhGenre, type HhGenreId, type SectionTemplate } from "./genres";
import type { PluginRole } from "./plugins-kb";

export type FindingAreaId = "tempo" | "kick" | "low" | "mids" | "highs" | "loudness" | "dynamics" | "stereo" | "key" | "structure";
export const FINDING_AREAS: { id: FindingAreaId; label: string }[] = [
  { id: "tempo", label: "Tempo" },
  { id: "kick", label: "Kick" },
  { id: "low", label: "Low end" },
  { id: "mids", label: "Mids" },
  { id: "highs", label: "Highs" },
  { id: "loudness", label: "Loudness" },
  { id: "dynamics", label: "Dynamics" },
  { id: "stereo", label: "Stereo" },
  { id: "key", label: "Key" },
  { id: "structure", label: "Structure" },
];

export type MatchWeightId = "bpm" | "bands" | "lufs" | "tail" | "crest" | "width";
export const MATCH_WEIGHTS: { id: MatchWeightId; label: string; def: number }[] = [
  { id: "bpm", label: "Tempo", def: 3 },
  { id: "bands", label: "Spectral balance", def: 2.5 },
  { id: "lufs", label: "Loudness", def: 1 },
  { id: "tail", label: "Kick tail", def: 2 },
  { id: "crest", label: "Dynamics", def: 0.7 },
  { id: "width", label: "Stereo width", def: 0.5 },
];

export type Strictness = "loose" | "normal" | "strict";

export type AnalysisPrefs = {
  strictness: Strictness;
  areas: Record<FindingAreaId, boolean>;
  approach: "both" | "easy" | "hard";
  weights: Record<MatchWeightId, number>;
  /** how many references to list under a report */
  refCount: number;
};

export type LaneOverride = Partial<Pick<HhGenre, "label" | "aka" | "years" | "bpm" | "summary" | "kick" | "lead" | "bass" | "arrangement" | "dna" | "listenFor" | "artists" | "labels" | "events">> & {
  targets?: Partial<GenreTargets>;
  template?: SectionTemplate[];
};

export type PluginPref = { note?: string; roles?: PluginRole[]; hidden?: boolean; favourite?: boolean };

export type OwnNote = { id: string; title: string; body: string; tags: string[]; createdAt: number };
export type OwnQuote = { id: string; text: string; who: string };

export type Appearance = {
  /** hex accent for primary buttons / active chips, null = default ink */
  accent: string | null;
  /** hex for the "your track" chart series */
  series: string | null;
  font: "display" | "plain";
  density: "comfortable" | "compact";
  /** show the lane fit list, spectrum and structure cards on the report */
  reportCards: { fit: boolean; spectrum: boolean; structure: boolean; refs: boolean; serum: boolean; laneNotes: boolean };
};

export type Customisation = {
  version: 1;
  laneOverrides: Record<string, LaneOverride>;
  customLanes: HhGenre[];
  hiddenLanes: string[];
  analysis: AnalysisPrefs;
  rolePins: Partial<Record<PluginRole, string>>;
  pluginPrefs: Record<string, PluginPref>;
  notes: OwnNote[];
  quotes: OwnQuote[];
  appearance: Appearance;
};

export const DEFAULT_ANALYSIS: AnalysisPrefs = {
  strictness: "normal",
  areas: Object.fromEntries(FINDING_AREAS.map((a) => [a.id, true])) as Record<FindingAreaId, boolean>,
  approach: "both",
  weights: Object.fromEntries(MATCH_WEIGHTS.map((w) => [w.id, w.def])) as Record<MatchWeightId, number>,
  refCount: 6,
};

export const DEFAULT_APPEARANCE: Appearance = {
  accent: null,
  series: null,
  font: "display",
  density: "comfortable",
  reportCards: { fit: true, spectrum: true, structure: true, refs: true, serum: true, laneNotes: true },
};

export const DEFAULT_CUSTOM: Customisation = {
  version: 1,
  laneOverrides: {},
  customLanes: [],
  hiddenLanes: [],
  analysis: DEFAULT_ANALYSIS,
  rolePins: {},
  pluginPrefs: {},
  notes: [],
  quotes: [],
  appearance: DEFAULT_APPEARANCE,
};

const isObj = (x: unknown): x is Record<string, unknown> => Boolean(x) && typeof x === "object" && !Array.isArray(x);

/** Merge a possibly partial / foreign object onto the defaults without trusting its shape. */
export function normaliseCustom(raw: unknown): Customisation {
  if (!isObj(raw)) return DEFAULT_CUSTOM;
  const a = isObj(raw.analysis) ? raw.analysis : {};
  const ap = isObj(raw.appearance) ? raw.appearance : {};
  const strict = a.strictness;
  return {
    version: 1,
    laneOverrides: isObj(raw.laneOverrides) ? (raw.laneOverrides as Record<string, LaneOverride>) : {},
    customLanes: Array.isArray(raw.customLanes) ? (raw.customLanes as HhGenre[]).filter((l) => isObj(l) && typeof l.id === "string" && isObj(l.targets) && Array.isArray(l.template)) : [],
    hiddenLanes: Array.isArray(raw.hiddenLanes) ? raw.hiddenLanes.filter((x): x is string => typeof x === "string") : [],
    analysis: {
      strictness: strict === "loose" || strict === "strict" ? strict : "normal",
      areas: { ...DEFAULT_ANALYSIS.areas, ...(isObj(a.areas) ? (a.areas as Partial<Record<FindingAreaId, boolean>>) : {}) },
      approach: a.approach === "easy" || a.approach === "hard" ? a.approach : "both",
      weights: { ...DEFAULT_ANALYSIS.weights, ...(isObj(a.weights) ? (a.weights as Partial<Record<MatchWeightId, number>>) : {}) },
      refCount: typeof a.refCount === "number" && a.refCount >= 1 && a.refCount <= 50 ? Math.round(a.refCount) : 6,
    },
    rolePins: isObj(raw.rolePins) ? (raw.rolePins as Partial<Record<PluginRole, string>>) : {},
    pluginPrefs: isObj(raw.pluginPrefs) ? (raw.pluginPrefs as Record<string, PluginPref>) : {},
    notes: Array.isArray(raw.notes) ? (raw.notes as OwnNote[]).filter((n) => isObj(n) && typeof n.title === "string") : [],
    quotes: Array.isArray(raw.quotes) ? (raw.quotes as OwnQuote[]).filter((q) => isObj(q) && typeof q.text === "string") : [],
    appearance: {
      accent: typeof ap.accent === "string" && /^#[0-9a-f]{6}$/i.test(ap.accent) ? ap.accent : null,
      series: typeof ap.series === "string" && /^#[0-9a-f]{6}$/i.test(ap.series) ? ap.series : null,
      font: ap.font === "plain" ? "plain" : "display",
      density: ap.density === "compact" ? "compact" : "comfortable",
      reportCards: { ...DEFAULT_APPEARANCE.reportCards, ...(isObj(ap.reportCards) ? (ap.reportCards as Partial<Appearance["reportCards"]>) : {}) },
    },
  };
}

export function applyOverride(base: HhGenre, o: LaneOverride | undefined): HhGenre {
  if (!o) return base;
  const { targets, template, ...rest } = o;
  return {
    ...base,
    ...rest,
    targets: targets ? { ...base.targets, ...targets, bands: { ...base.targets.bands, ...(targets.bands ?? {}) } } : base.targets,
    template: template && template.length ? template : base.template,
  };
}

/** Built-in lanes with overrides applied, plus custom lanes, minus hidden ones. */
export function effectiveGenres(c: Customisation): HhGenre[] {
  const hidden = new Set(c.hiddenLanes);
  const built = HH_GENRES.map((g) => applyOverride(g, c.laneOverrides[g.id]));
  const custom = c.customLanes.map((g) => applyOverride(g, c.laneOverrides[g.id]));
  return [...built, ...custom].filter((g) => !hidden.has(g.id));
}

export function findGenre(genres: HhGenre[], id: HhGenreId | string | undefined | null): HhGenre {
  return genres.find((g) => g.id === id) ?? genres[0] ?? HH_GENRES[0];
}

export function cloneLane(base: HhGenre, label: string): HhGenre {
  const id = `custom-${Date.now().toString(36)}`;
  return {
    ...base,
    id,
    label,
    aka: `Based on ${base.label}`,
    targets: { ...base.targets, bands: { ...base.targets.bands } },
    template: base.template.map((s) => ({ ...s })),
    dna: [...base.dna],
    listenFor: [...base.listenFor],
    artists: [...base.artists],
    labels: [...base.labels],
    events: [...base.events],
  };
}

/** Threshold multiplier: strict flags sooner, loose later. */
export function strictnessScale(s: Strictness): number {
  return s === "strict" ? 0.7 : s === "loose" ? 1.5 : 1;
}

export function exportCustom(c: Customisation): string {
  return JSON.stringify({ app: "hardstyle-helper", exportedAt: new Date().toISOString(), custom: c }, null, 2);
}

export function importCustom(text: string): Customisation {
  const raw = JSON.parse(text) as unknown;
  const body = isObj(raw) && isObj(raw.custom) ? raw.custom : raw;
  return normaliseCustom(body);
}

export function countCustomisations(c: Customisation): number {
  return (
    Object.keys(c.laneOverrides).length +
    c.customLanes.length +
    c.hiddenLanes.length +
    Object.keys(c.rolePins).length +
    Object.keys(c.pluginPrefs).length +
    c.notes.length +
    c.quotes.length +
    (c.appearance.accent ? 1 : 0) +
    (c.appearance.series ? 1 : 0) +
    (c.appearance.font !== "display" ? 1 : 0) +
    (c.appearance.density !== "comfortable" ? 1 : 0) +
    (c.analysis.strictness !== "normal" ? 1 : 0) +
    (c.analysis.approach !== "both" ? 1 : 0) +
    Object.values(c.analysis.areas).filter((v) => !v).length
  );
}
