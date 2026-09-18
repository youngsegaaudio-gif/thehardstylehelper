/** Device-local state: DAW, scanned plugins, last report, reference-list edits, customisation. */
import { create } from "zustand";
import type { Report } from "./analysis";
import { DEFAULT_CUSTOM, effectiveGenres, normaliseCustom, type Customisation, type LaneOverride, type OwnNote, type OwnQuote, type PluginPref } from "./customise";
import type { HhGenre, HhGenreId } from "./genres";
import { identify, type DawId, type PluginRole } from "./plugins-kb";
import type { ScannedPlugin } from "./plugin-scan";
import { HH_REFS, type RefTrack } from "./refs";

const KEY = "hh-helper-v1";

type Persisted = {
  daw: DawId;
  plugins: ScannedPlugin[];
  scannedAt: number | null;
  report: Report | null;
  removedRefs: string[];
  addedRefs: RefTrack[];
  targetLane: HhGenreId | "auto";
  custom: Customisation;
};

const DEFAULTS: Persisted = {
  daw: "logic",
  plugins: [],
  scannedAt: null,
  report: null,
  removedRefs: [],
  addedRefs: [],
  targetLane: "auto",
  custom: DEFAULT_CUSTOM,
};

function load(): Persisted {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return DEFAULTS;
    return { ...DEFAULTS, ...raw, custom: normaliseCustom(raw.custom) };
  } catch {
    return DEFAULTS;
  }
}

function save(p: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* quota or private mode — keep going in memory */
  }
}

export type HhStore = Persisted & {
  ready: boolean;
  hydrate: () => void;
  setDaw: (d: DawId) => void;
  setPlugins: (p: ScannedPlugin[]) => void;
  addPlugins: (p: ScannedPlugin[]) => void;
  removePlugin: (name: string) => void;
  clearPlugins: () => void;
  setReport: (r: Report | null) => void;
  setTargetLane: (g: HhGenreId | "auto") => void;
  removeRef: (id: string) => void;
  restoreRef: (id: string) => void;
  addRef: (r: RefTrack) => void;
  ownedIds: () => string[];
  refs: () => RefTrack[];
  /* customisation */
  genres: () => HhGenre[];
  setCustom: (c: Customisation) => void;
  patchCustom: (patch: Partial<Customisation>) => void;
  setLaneOverride: (id: string, o: LaneOverride | null) => void;
  addCustomLane: (g: HhGenre) => void;
  updateCustomLane: (g: HhGenre) => void;
  removeCustomLane: (id: string) => void;
  toggleLaneHidden: (id: string) => void;
  setRolePin: (role: PluginRole, plugin: string | null) => void;
  setPluginPref: (name: string, pref: PluginPref | null) => void;
  addNote: (n: Omit<OwnNote, "id" | "createdAt">) => void;
  updateNote: (n: OwnNote) => void;
  removeNote: (id: string) => void;
  addQuote: (q: Omit<OwnQuote, "id">) => void;
  removeQuote: (id: string) => void;
  resetCustom: () => void;
};

export const useHh = create<HhStore>((set, get) => {
  const persist = (patch: Partial<Persisted>) => {
    const s = get();
    const next: Persisted = {
      daw: s.daw,
      plugins: s.plugins,
      scannedAt: s.scannedAt,
      report: s.report,
      removedRefs: s.removedRefs,
      addedRefs: s.addedRefs,
      targetLane: s.targetLane,
      custom: s.custom,
      ...patch,
    };
    save(next);
    set(next);
  };
  const custom = (patch: Partial<Customisation>) => persist({ custom: { ...get().custom, ...patch } });
  return {
    ...DEFAULTS,
    ready: false,
    hydrate: () => {
      if (get().ready) return;
      set({ ...load(), ready: true });
    },
    setDaw: (daw) => persist({ daw }),
    setPlugins: (plugins) => persist({ plugins, scannedAt: Date.now() }),
    addPlugins: (more) => {
      const map = new Map(get().plugins.map((p) => [p.name.toLowerCase(), p]));
      for (const p of more) {
        const cur = map.get(p.name.toLowerCase());
        if (cur) {
          for (const f of p.formats) if (!cur.formats.includes(f)) cur.formats.push(f);
        } else map.set(p.name.toLowerCase(), { ...p, formats: [...p.formats] });
      }
      persist({ plugins: [...map.values()].sort((a, b) => a.name.localeCompare(b.name)), scannedAt: Date.now() });
    },
    removePlugin: (name) => persist({ plugins: get().plugins.filter((p) => p.name !== name) }),
    clearPlugins: () => persist({ plugins: [], scannedAt: null }),
    setReport: (report) => persist({ report }),
    setTargetLane: (targetLane) => persist({ targetLane }),
    removeRef: (id) => persist({ removedRefs: [...new Set([...get().removedRefs, id])], addedRefs: get().addedRefs.filter((r) => r.id !== id) }),
    restoreRef: (id) => persist({ removedRefs: get().removedRefs.filter((x) => x !== id) }),
    addRef: (r) => persist({ addedRefs: [...get().addedRefs.filter((x) => x.id !== r.id), r] }),
    ownedIds: () => {
      const ids = new Set<string>();
      const prefs = get().custom.pluginPrefs;
      for (const p of get().plugins) {
        if (prefs[p.name]?.hidden) continue;
        const kb = identify(p.name).kb;
        if (kb) ids.add(kb.id);
      }
      return [...ids];
    },
    refs: () => {
      const removed = new Set(get().removedRefs);
      return [...HH_REFS.filter((r) => !removed.has(r.id)), ...get().addedRefs];
    },

    genres: () => effectiveGenres(get().custom),
    setCustom: (c) => persist({ custom: normaliseCustom(c) }),
    patchCustom: (patch) => custom(patch),
    setLaneOverride: (id, o) => {
      const next = { ...get().custom.laneOverrides };
      if (o && Object.keys(o).length) next[id] = o;
      else delete next[id];
      custom({ laneOverrides: next });
    },
    addCustomLane: (g) => custom({ customLanes: [...get().custom.customLanes, g] }),
    updateCustomLane: (g) => custom({ customLanes: get().custom.customLanes.map((x) => (x.id === g.id ? g : x)) }),
    removeCustomLane: (id) => {
      const c = get().custom;
      const overrides = { ...c.laneOverrides };
      delete overrides[id];
      custom({ customLanes: c.customLanes.filter((x) => x.id !== id), hiddenLanes: c.hiddenLanes.filter((x) => x !== id), laneOverrides: overrides });
      if (get().targetLane === id) persist({ targetLane: "auto" });
    },
    toggleLaneHidden: (id) => {
      const h = get().custom.hiddenLanes;
      custom({ hiddenLanes: h.includes(id) ? h.filter((x) => x !== id) : [...h, id] });
    },
    setRolePin: (role, plugin) => {
      const pins = { ...get().custom.rolePins };
      if (plugin && plugin.trim()) pins[role] = plugin.trim();
      else delete pins[role];
      custom({ rolePins: pins });
    },
    setPluginPref: (name, pref) => {
      const prefs = { ...get().custom.pluginPrefs };
      if (pref && (pref.note || pref.roles?.length || pref.hidden || pref.favourite)) prefs[name] = pref;
      else delete prefs[name];
      custom({ pluginPrefs: prefs });
    },
    addNote: (n) => custom({ notes: [{ ...n, id: `note-${Date.now().toString(36)}`, createdAt: Date.now() }, ...get().custom.notes] }),
    updateNote: (n) => custom({ notes: get().custom.notes.map((x) => (x.id === n.id ? n : x)) }),
    removeNote: (id) => custom({ notes: get().custom.notes.filter((x) => x.id !== id) }),
    addQuote: (q) => custom({ quotes: [...get().custom.quotes, { ...q, id: `q-${Date.now().toString(36)}` }] }),
    removeQuote: (id) => custom({ quotes: get().custom.quotes.filter((x) => x.id !== id) }),
    resetCustom: () => persist({ custom: DEFAULT_CUSTOM }),
  };
});

/** Effective lanes as a hook (re-renders when customisation changes). */
export function useLanes(): HhGenre[] {
  const c = useHh((s) => s.custom);
  return effectiveGenres(c);
}
