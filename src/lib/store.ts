import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STYLES } from "./catalog";
import type { CoachPack, LayerId, StyleId, TrackSession } from "./types";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function newSession(partial?: Partial<TrackSession>): TrackSession {
  const style: StyleId = partial?.style ?? "hardstyle";
  const profile = STYLES[style];
  return {
    id: partial?.id ?? uid(),
    name: partial?.name ?? "Untitled track",
    style,
    bpm: partial?.bpm ?? profile.bpm,
    key: partial?.key ?? profile.defaultKey,
    bar: partial?.bar ?? 0,
    layers: partial?.layers ?? ["kick"],
    notes: partial?.notes ?? "",
    checked: partial?.checked ?? [],
    aiCoach: partial?.aiCoach ?? null,
    updatedAt: Date.now(),
  };
}

const PRESETS: { label: string; session: Partial<TrackSession> }[] = [
  {
    label: "AR Gang raw drop",
    session: {
      name: "Raw drop",
      style: "ar-gang",
      key: "G minor",
      bar: 80,
      layers: ["kick", "reverse-bass", "atmosphere"],
      notes: "Kick is close. Need a screech hook and a darker break melody.",
    },
  },
  {
    label: "Darren piano",
    session: {
      name: "Piano 170",
      style: "darren-styles",
      key: "A minor",
      bar: 32,
      layers: ["kick", "chords", "pad"],
      notes: "4-bar piano riff in the break. Drop still empty.",
    },
  },
  {
    label: "S3RL vocal",
    session: {
      name: "Vocal hook",
      style: "s3rl",
      key: "F minor",
      bar: 16,
      layers: ["kick", "vocal", "hats"],
      notes: "Vocal hook is in. Need a simple lead and a tight drop.",
    },
  },
  {
    label: "Lil Texas energy",
    session: {
      name: "Texas energy",
      style: "lil-texas",
      key: "A minor",
      bar: 48,
      layers: ["kick", "clap", "vocal"],
      notes: "Chopped vox working. Drop wants happy lead + harder kick.",
    },
  },
  {
    label: "Hard techno PVC",
    session: {
      name: "PVC peak",
      style: "hard-techno",
      key: "E minor",
      bar: 96,
      layers: ["kick", "hats", "atmosphere"],
      notes: "Peak PVC is close. Need click extra, fill rolls at the 16s, and a stab.",
    },
  },
];

export type CoachTab = "next" | "map" | "kicks" | "mix" | "serum" | "logic";

type Store = {
  session: TrackSession;
  saved: TrackSession[];
  tab: CoachTab;
  setTab: (tab: CoachTab) => void;
  patch: (partial: Partial<TrackSession>) => void;
  setStyle: (style: StyleId) => void;
  toggleLayer: (id: LayerId) => void;
  toggleChecked: (id: string) => void;
  setBar: (bar: number) => void;
  setAiCoach: (pack: CoachPack | null) => void;
  saveCurrent: () => void;
  loadSession: (id: string) => void;
  newTrack: () => void;
  loadPreset: (index: number) => void;
  presets: typeof PRESETS;
};

export const useTrack = create<Store>()(
  persist(
    (set, get) => ({
      session: newSession(),
      saved: [],
      tab: "next",
      presets: PRESETS,
      setTab: (tab) => set({ tab }),
      patch: (partial) =>
        set({
          session: { ...get().session, ...partial, updatedAt: Date.now() },
        }),
      setStyle: (style) => {
        const profile = STYLES[style];
        const s = get().session;
        const total = profile.arrangement.reduce((n, x) => n + x.bars, 0);
        set({
          session: {
            ...s,
            style,
            bpm: profile.bpm,
            key: profile.defaultKey,
            bar: Math.min(s.bar, total - 1),
            aiCoach: null,
            updatedAt: Date.now(),
          },
        });
      },
      toggleLayer: (id) => {
        const layers = get().session.layers;
        const next = layers.includes(id) ? layers.filter((x) => x !== id) : [...layers, id];
        set({ session: { ...get().session, layers: next, updatedAt: Date.now() } });
      },
      toggleChecked: (id) => {
        const checked = get().session.checked;
        const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
        set({ session: { ...get().session, checked: next, updatedAt: Date.now() } });
      },
      setBar: (bar) =>
        set({
          session: { ...get().session, bar: Math.max(0, bar), updatedAt: Date.now() },
        }),
      setAiCoach: (pack) =>
        set({ session: { ...get().session, aiCoach: pack, updatedAt: Date.now() } }),
      saveCurrent: () => {
        const cur = get().session;
        const saved = get().saved.filter((s) => s.id !== cur.id);
        set({ saved: [{ ...cur, updatedAt: Date.now() }, ...saved].slice(0, 12) });
      },
      loadSession: (id) => {
        const found = get().saved.find((s) => s.id === id);
        if (found) set({ session: found, tab: "next" });
      },
      newTrack: () => set({ session: newSession(), tab: "next" }),
      loadPreset: (index) => {
        const p = PRESETS[index];
        if (p) set({ session: newSession(p.session), tab: "next" });
      },
    }),
    {
      name: "helper-session-v1",
      skipHydration: true,
      partialize: (s) => ({ session: s.session, saved: s.saved }),
    },
  ),
);
