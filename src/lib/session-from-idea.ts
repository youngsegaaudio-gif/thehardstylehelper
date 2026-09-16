import type { GenreId } from "./hs-catalog";
import type { Idea } from "./hs-ideas";
import { KEYS, LAYER_IDS, type LayerId, type MusicalKey, type StyleId, type TrackSession } from "./types";

const GENRE_STYLE: Record<GenreId, StyleId> = {
  euphoric: "hardstyle",
  raw: "rawstyle",
  "extra-raw": "extra-raw",
  classic: "hardstyle",
  early: "early-hardstyle",
  hardcore: "industrial-hardcore",
  uptempo: "uptempo",
  frenchcore: "frenchcore",
  ukhc: "darren-styles",
  happy: "happy-hardcore",
  gabber: "gabber",
  industrial: "industrial-hardcore",
  "hard-techno": "hard-techno",
  jumpstyle: "jumpstyle",
  "hard-trance": "hard-trance",
  freeform: "darren-styles",
  millenium: "millenium",
  terror: "terror",
  psy: "hardstyle",
};

function asKey(k: string): MusicalKey {
  if ((KEYS as readonly string[]).includes(k)) return k as MusicalKey;
  return "G minor";
}

function layersFromIdea(idea: Idea): LayerId[] {
  const layers: LayerId[] = ["kick"];
  const s = idea.sound;
  if (s.bassKind === "reverse") layers.push("reverse-bass");
  if (s.bassKind === "offbeat") layers.push("sub");
  if (s.hookKind === "screech") layers.push("screech");
  if (s.hookKind === "saw" || s.hookKind === "piano") layers.push("lead");
  if (s.hookKind === "stab") layers.push("chords");
  if (s.voxKind !== "none") layers.push("vocal");
  layers.push("fx");
  return layers.filter((id) => (LAYER_IDS as readonly string[]).includes(id));
}

export function sessionFromIdea(idea: Idea): TrackSession {
  return {
    id: `idea-${idea.seed}`,
    name: idea.title,
    style: GENRE_STYLE[idea.artist.genre] ?? "hardstyle",
    bpm: idea.bpm,
    key: asKey(idea.key),
    bar: 0,
    layers: layersFromIdea(idea),
    notes: [
      idea.concept,
      `Vocal: ${idea.vocal.artist} — ${idea.vocal.title} (${idea.vocal.year})`,
      idea.chopHow,
    ].join("\n"),
    checked: [],
    aiCoach: null,
    updatedAt: Date.now(),
  };
}
