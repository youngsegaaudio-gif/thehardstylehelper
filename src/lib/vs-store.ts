import { create } from "zustand";
import { VOCALS, type Artist, type EraId, type GenreId, type VocalSource } from "./hs-catalog";
import {
  YOU_DEFAULT,
  ideaText,
  rollIdea,
  type Idea,
  type RollOpts,
  type YouPrefs,
} from "./hs-ideas";

const SAVE_KEY = "hs-songs-saved-v1";
const YOU_KEY = "hs-songs-you-v1";

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

export type VsStore = {
  ready: boolean;
  idea: Idea;
  you: YouPrefs;
  saved: Idea[];
  genre: GenreId | "all";
  era: EraId | "all";
  nicheOnly: boolean;
  style: string;
  q: string;
  lockGenre: boolean;
  lockArtist: string | null;
  lockVocal: string | null;
  hydrate: () => void;
  setQ: (q: string) => void;
  setEra: (era: EraId | "all") => void;
  setStyle: (style: string) => void;
  setNiche: (v: boolean) => void;
  setGenre: (genre: GenreId | "all", lock?: boolean) => void;
  persistYou: (patch: Partial<YouPrefs>) => void;
  resetYou: () => void;
  roll: (extra?: Partial<RollOpts>) => Idea;
  saveIdea: () => "saved" | "removed";
  copyIdea: (target?: Idea) => Promise<boolean>;
  unlockArtist: () => void;
  unlockVocal: () => void;
  pickVocal: (v: VocalSource) => Idea;
  pickArtist: (a: Artist) => Idea;
  openSaved: (idea: Idea) => void;
  removeSaved: (idea: Idea) => void;
};

export const useVs = create<VsStore>((set, get) => ({
  ready: false,
  idea: rollIdea({ seed: 7, nicheOnly: false, you: YOU_DEFAULT }),
  you: YOU_DEFAULT,
  saved: [],
  genre: "all",
  era: "all",
  nicheOnly: false,
  style: "all",
  q: "",
  lockGenre: false,
  lockArtist: null,
  lockVocal: null,

  hydrate: () => {
    if (get().ready) return;
    const you = loadYou();
    set({ ready: true, you, saved: loadSaved() });
  },

  setQ: (q) => set({ q }),
  setEra: (era) => set({ era }),
  setStyle: (style) => set({ style, q: "" }),
  setNiche: (nicheOnly) => set({ nicheOnly }),
  setGenre: (genre, lock) =>
    set({
      genre,
      lockGenre: genre === "all" ? false : (lock ?? false),
    }),

  persistYou: (patch) => {
    const you = { ...get().you, ...patch };
    try {
      localStorage.setItem(YOU_KEY, JSON.stringify(you));
    } catch {
      /* ignore */
    }
    set({ you });
  },

  resetYou: () => {
    try {
      localStorage.setItem(YOU_KEY, JSON.stringify(YOU_DEFAULT));
    } catch {
      /* ignore */
    }
    set({ you: YOU_DEFAULT });
  },

  roll: (extra) => {
    const s = get();
    const lockVocal = extra?.vocalId !== undefined ? extra.vocalId : s.lockVocal;
    const lockArtist = extra?.artistId !== undefined ? extra.artistId : s.lockArtist;
    const next = rollIdea({
      genre: extra?.genre ?? (s.genre !== "all" ? s.genre : "all"),
      era: extra?.era ?? s.era,
      nicheOnly: extra?.nicheOnly ?? s.nicheOnly,
      artistId: extra?.artistId ?? lockArtist,
      vocalId: extra?.vocalId ?? lockVocal,
      q: extra?.q ?? s.q,
      you: extra?.you ?? s.you,
      seed: extra?.seed ?? (Date.now() ^ Math.floor(Math.random() * 1e9)),
    });
    set({ idea: next, lockVocal, lockArtist });
    return next;
  },

  saveIdea: () => {
    const { idea, saved } = get();
    const exists = saved.some((x) => x.seed === idea.seed);
    const next = exists
      ? saved.filter((x) => x.seed !== idea.seed)
      : [idea, ...saved.filter((x) => x.seed !== idea.seed)].slice(0, 40);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    set({ saved: next });
    return exists ? "removed" : "saved";
  },

  copyIdea: async (target) => {
    try {
      await navigator.clipboard.writeText(ideaText(target ?? get().idea));
      return true;
    } catch {
      return false;
    }
  },

  unlockArtist: () => set({ lockArtist: null }),
  unlockVocal: () => set({ lockVocal: null }),

  pickVocal: (v) => get().roll({ vocalId: v.id }),

  pickArtist: (a) => {
    set({ genre: a.genre, lockGenre: true });
    return get().roll({ artistId: a.id, genre: a.genre });
  },

  openSaved: (idea) => set({ idea }),
  removeSaved: (idea) => {
    const next = get().saved.filter((x) => x.seed !== idea.seed);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    set({ saved: next });
  },
}));

export function youLocked(you: YouPrefs) {
  return (
    you.kick !== "any" ||
    you.bass !== "any" ||
    you.hook !== "any" ||
    you.vox !== "any" ||
    you.phrases !== "mix" ||
    you.key !== "any"
  );
}

export const FEATURED_IDS = [
  "alice-deejay-better-off-alone",
  "haddaway-what-is-love",
  "cascada-everytime-we-touch",
  "crystal-waters-gypsy-woman",
  "2-unlimited-no-limit",
  "la-bouche-be-my-lover",
  "gala-freed-from-desire",
  "robin-s-show-me-love",
  "dune-hardcore-vibes",
  "party-animals-have-you-ever-been-mellow",
] as const;

export const FEATURED = FEATURED_IDS.map((id) => VOCALS.find((v) => v.id === id)).filter(
  (v): v is VocalSource => Boolean(v),
);
