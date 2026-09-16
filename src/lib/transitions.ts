import { STYLES, totalBars } from "./catalog";
import type { StyleId, TrackSession, TransitionHit } from "./types";

type Recipe = Omit<TransitionHit, "near">;

const TECHNO: Recipe[] = [
  {
    id: "t-mute",
    at: "Last bar of a 16",
    bars: "1 bar",
    what: "Kick mute",
    how: "Mute Peak PVC only. Ghost click or hats can stay. Slam Impact PVC on the next downbeat.",
  },
  {
    id: "t-fill",
    at: "Last 2 beats of a 16 / 32",
    bars: "2 beats",
    what: "Fill PVC roll",
    how: "1/8 then 1/16 extra kicks. HP 60 Hz. Download the extra-kick MIDI.",
  },
  {
    id: "t-impact",
    at: "Bar 1 of every 32",
    bars: "1 hit",
    what: "Impact PVC + crash",
    how: "Longer one-shot on 1. Crash or industrial hit with it. Then back to Peak PVC.",
  },
  {
    id: "t-filter",
    at: "8 bars before a peak",
    bars: "8",
    what: "Kick HP open",
    how: "Channel EQ HP 160 Hz → 20 Hz. No 8-bar white-noise rise — that's hardstyle.",
  },
  {
    id: "t-rev",
    at: "1 bar before a switch",
    bars: "1",
    what: "Reverse extra",
    how: "Reverse the Peak PVC, 1 bar only. Hard techno switches are short.",
  },
  {
    id: "t-hats",
    at: "4 bars before a peak",
    bars: "4",
    what: "Offbeat hats in",
    how: "Open hat on the 'and'. If hats were already in, add 1/16.",
  },
];

const HARDSTYLE: Recipe[] = [
  {
    id: "hs-noise",
    at: "Last 8 of a build",
    bars: "8",
    what: "White noise rise",
    how: "Noise region, −∞ to −12 dB. HP 400 Hz. FX bus, not the kick.",
  },
  {
    id: "hs-rev",
    at: "2 bars before the drop",
    bars: "2",
    what: "Reverse cymbal",
    how: "Reverse crash ending on the downbeat. Classic hardstyle, not a 1-bar techno mute.",
  },
  {
    id: "hs-snare",
    at: "Whole build",
    bars: "16",
    what: "Snare roll",
    how: "1/8 → 1/16 → last 2 bars 1/32. Pitch up 2–4 st on the last bar. Snare-roll MIDI.",
  },
  {
    id: "hs-hp",
    at: "Whole build",
    bars: "16",
    what: "Kick filter open",
    how: "Channel EQ HP 180 Hz → 20 Hz so the drop kick is a door opening.",
  },
  {
    id: "hs-down",
    at: "Last beat into the drop",
    bars: "1 beat",
    what: "Downlifter",
    how: "Short downlifter or impact. Lead stays filtered until bar 1 of the drop.",
  },
];

const RAW: Recipe[] = [
  {
    id: "rw-hp",
    at: "Build",
    bars: "16",
    what: "Kick HP + grit",
    how: "Same HP trick, but keep distortion on. Raw drops should feel dirtier, not prettier.",
  },
  {
    id: "rw-screech",
    at: "Last 2 of the build",
    bars: "2",
    what: "Screech tease",
    how: "Filtered screech, 2 bars, then full on the drop downbeat. Not a climax lead.",
  },
  {
    id: "rw-rev",
    at: "2 bars out",
    bars: "2",
    what: "Reverse / noise",
    how: "Shorter than euphoric hardstyle. Industrial hit on 1 of the drop.",
  },
  {
    id: "rw-fill",
    at: "Last bar of drop phrases",
    bars: "1",
    what: "Kick fill",
    how: "Extra kick 1/8 on the last bar of 16 so the next 16 slams.",
  },
];

const UPTEMPO: Recipe[] = [
  {
    id: "up-roll",
    at: "Last 1–2 bars",
    bars: "2",
    what: "Kick roll",
    how: "1/8 then 1/16 gabber kicks. No 16-bar snare poem.",
  },
  {
    id: "up-hit",
    at: "Downbeat of the next phrase",
    bars: "1 hit",
    what: "Industrial impact",
    how: "Metal/noise extra + crash. Then the wall continues.",
  },
];

const UKHC: Recipe[] = [
  {
    id: "uk-snare",
    at: "Build (16 bars)",
    bars: "16",
    what: "Snare build",
    how: "Clean 1/8 → 1/16 → 1/32. Piano/lead filtered until the drop.",
  },
  {
    id: "uk-crash",
    at: "Drop downbeat",
    bars: "1",
    what: "Crash + kick",
    how: "Crash on 1 with the 170 kick. Rolling bass in on the 'and'.",
  },
  {
    id: "uk-piano",
    at: "Last 4 of the break",
    bars: "4",
    what: "Piano filter open",
    how: "LP opens into the snare build so the riff is already in the room.",
  },
];

const HAPPY: Recipe[] = [
  {
    id: "hp-vox",
    at: "Last bar of the break",
    bars: "1",
    what: "Vocal throw",
    how: "Delay on the last word, then drums. The drop is the hook + bounce.",
  },
  {
    id: "hp-snare",
    at: "Build",
    bars: "8–16",
    what: "Short snare build",
    how: "Shorter than Darren. 8 bars is enough. Crash on 1.",
  },
];

export function transitionsFor(style: StyleId): Recipe[] {
  if (style === "hard-techno") return TECHNO;
  if (style === "uptempo") return UPTEMPO;
  if (style === "ar-gang" || style === "rawstyle") return RAW;
  if (style === "darren-styles" || style === "happy-hardcore") return UKHC;
  if (style === "s3rl" || style === "lil-texas") return HAPPY;
  return HARDSTYLE;
}

function nearPlayhead(session: TrackSession, rec: Recipe): boolean {
  const section = STYLES[session.style].arrangement.find(
    (s) => session.bar >= s.startBar && session.bar < s.startBar + s.bars,
  );
  if (!section) return false;
  const into = session.bar - section.startBar;
  const left = section.startBar + section.bars - session.bar;
  if (rec.at.toLowerCase().includes("build") && section.kind === "build") return true;
  if (rec.at.toLowerCase().includes("drop") && section.kind === "drop" && into < 2) return true;
  if (rec.at.toLowerCase().includes("last bar") && left <= 1) return true;
  if (rec.at.toLowerCase().includes("last 2") && left <= 2) return true;
  if (rec.at.toLowerCase().includes("1 bar before") && left <= 1) return true;
  if (rec.at.toLowerCase().includes("8 bars") && left <= 8 && section.kind === "build") return true;
  if (rec.at.toLowerCase().includes("4 bars") && left <= 4) return true;
  if (rec.at.toLowerCase().includes("bar 1") && into < 2) return true;
  return false;
}

export function transitionsAtPlayhead(session: TrackSession): TransitionHit[] {
  return transitionsFor(session.style).map((t) => ({
    ...t,
    near: nearPlayhead(session, t),
  }));
}

export function transitionMarkerBars(style: StyleId): { bar: number; label: string }[] {
  const total = totalBars(style);
  const out: { bar: number; label: string }[] = [];
  for (let b = 16; b < total; b += 16) {
    out.push({ bar: b - 1, label: "Fill / mute" });
    out.push({ bar: b, label: "Impact" });
  }
  return out;
}

export function transitionsDocument(session: TrackSession): string {
  const list = transitionsFor(session.style);
  const style = STYLES[session.style];
  return [
    `HELPER — Transitions · ${style.name}`,
    `Where to put switches at ${session.bpm} BPM.`,
    "",
    ...list.flatMap((t) => [`${t.at}  [${t.bars}]  ${t.what}`, `  ${t.how}`, ""]),
  ].join("\n");
}
