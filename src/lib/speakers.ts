import { family } from "./catalog";
import type { SpeakerSpot, StyleId } from "./types";

/** Physical monitors. Same for every genre. */
export const MONITORS = [
  "Equilateral triangle: you, left speaker, right speaker. Same distance on all three sides.",
  "Tweeters at ear height. Point at the back of your skull, not the wall behind you.",
  "Pull them off the wall (30 cm+). Corners boom the kick and lie to you.",
  "Sit in the middle. Hard dance is a center kick — if the chair is off, the reverse bass will feel late.",
];

export function speakersFor(style: StyleId): SpeakerSpot[] {
  const f = family(style);
  const kick: SpeakerSpot = {
    id: "kick",
    name: "Kick",
    pan: 0,
    place: "Dead center. Both speakers equally. Never pan a hard-dance kick.",
    ref: f === "techno" ? "Peak PVC is the room. Extra click sits on top, still center." : "Kick 3 / main kick on 1, phantom center.",
  };
  const bass: SpeakerSpot = {
    id: "bass",
    name: f === "uk" || f === "happy" ? "Offbeat / sub" : f === "techno" || f === "up" ? "Sub extra" : "Reverse bass",
    pan: 0,
    place: "Center with the kick. Low end is mono.",
    ref: "If it walks L/R, collapse it. Check in mono.",
  };
  const hats: SpeakerSpot = {
    id: "hats",
    name: "Hats",
    pan: f === "happy" || f === "uk" ? 18 : 8,
    place: "Slightly right (or a stereo pair ±10). Keep the closed hat close to center.",
    ref: "Open hat can sit a bit wider than the closed.",
  };
  const clap: SpeakerSpot = {
    id: "clap",
    name: "Clap / snare",
    pan: 0,
    place: "Center. Tiny stereo width on a top layer only.",
    ref: "Build rolls stay center so the drop punch doesn't jump.",
  };
  const lead: SpeakerSpot = {
    id: "lead",
    name: f === "raw" ? "Screech" : f === "uk" ? "Piano / saw" : "Lead",
    pan: f === "raw" ? -12 : 0,
    place: f === "raw" ? "Just left of center, short. Not a wall." : "Wide stereo, still even. Unison, not hard-pan.",
    ref: f === "euphoric" ? "Climax lead fills both speakers. HP 180 Hz so kick keeps the middle." : "Hook in both ears, body of kick still wins the center.",
  };
  const vox: SpeakerSpot = {
    id: "vox",
    name: "Vocal",
    pan: 0,
    place: "Center. Doubles ±15 max. Delay throws can go wide.",
    ref: "Chopped vox can ping-pong in the break, lock to center in the drop.",
  };
  const fx: SpeakerSpot = {
    id: "fx",
    name: "FX / risers",
    pan: 70,
    place: "Widest thing in the track. Sweeps can move L→R over 8 bars.",
    ref: "Crash slightly left or right of the kick so the downbeat stays punchy.",
  };
  const atmo: SpeakerSpot = {
    id: "atmo",
    name: "Atmosphere / pad",
    pan: -40,
    place: "Wide bed, quieter in the middle. Duck it when the kick is in.",
    ref: "Pads live in the speakers' edges so the drop feels empty in the center.",
  };

  if (f === "techno") return [kick, bass, hats, clap, lead, fx];
  if (f === "up") return [kick, bass, hats, lead, fx, atmo];
  if (f === "raw") return [kick, bass, hats, lead, vox, fx, atmo];
  return [kick, bass, hats, clap, lead, vox, fx, atmo];
}
