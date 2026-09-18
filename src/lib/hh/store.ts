/** Device-local state: DAW, scanned plugins, last report, reference-list edits. */
import { create } from "zustand";
import type { Report } from "./analysis";
import type { HhGenreId } from "./genres";
import { identify, type DawId } from "./plugins-kb";
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
};

const DEFAULTS: Persisted = {
  daw: "logic",
  plugins: [],
  scannedAt: null,
  report: null,
  removedRefs: [],
  addedRefs: [],
  targetLane: "auto",
};

function load(): Persisted {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return DEFAULTS;
    return { ...DEFAULTS, ...raw };
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
      ...patch,
    };
    save(next);
    set(next);
  };
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
      for (const p of get().plugins) {
        const kb = identify(p.name).kb;
        if (kb) ids.add(kb.id);
      }
      return [...ids];
    },
    refs: () => {
      const removed = new Set(get().removedRefs);
      return [...HH_REFS.filter((r) => !removed.has(r.id)), ...get().addedRefs];
    },
  };
});
