/** Arrangement generator: per-lane templates, seeded variations, text + MIDI marker export. */
import { HH_GENRE_BY_ID, type HhGenreId, type SectionTemplate } from "./genres";

export type ArrangeMode = "extended" | "radio" | "dj";

export type ArrangedSection = SectionTemplate & {
  id: string;
  startBar: number;
  startSec: number;
  layers: string[];
};

export type Arrangement = {
  genre: HhGenreId;
  mode: ArrangeMode;
  bpm: number;
  seed: number;
  sections: ArrangedSection[];
  totalBars: number;
  totalSec: number;
  notes: string[];
};

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const LAYERS: Record<SectionTemplate["kind"], string[]> = {
  intro: ["kick", "hats", "atmosphere", "sample"],
  break: ["pad", "chords", "vocal / sample", "lead (filtered)", "fx"],
  build: ["snare roll", "riser", "lead", "kick rolls", "vocal"],
  drop: ["kick", "lead / screech", "clap", "hats", "vocal chops", "fx"],
  mid: ["kick (variation)", "sample", "percussion", "screech"],
  outro: ["kick", "hats", "pad", "fx"],
};

const VARIANTS: Record<SectionTemplate["kind"], string[]> = {
  intro: [
    "Open with the kick alone for 8 bars, then hats.",
    "Start on the break chords filtered, kick enters bar 9.",
    "Sample first, kick on bar 5 — a DJ-unfriendly but memorable intro.",
  ],
  break: [
    "Half-time drums under the second half of the break.",
    "Vocal only for the first 8 bars, chords join after.",
    "Bring the lead in dry and quiet as a tease on the last 8.",
  ],
  build: [
    "Cut the kick on the last 2 beats. Silence, then drop.",
    "Reverse the first beat of the drop and place it on the last beat.",
    "Pitch the kick up a semitone every 2 bars for the last 8.",
  ],
  drop: [
    "Bar 17: switch to the second kick variation.",
    "Bars 25–32: strip to kick + vocal, then crash into the next section.",
    "Every 8th bar: tail cut on beat 4.",
  ],
  mid: [
    "Reverse-bass throwback for 16 bars.",
    "Half-time feel with the vocal chops.",
    "Kick roll section: rolls every 2 bars, no lead.",
  ],
  outro: [
    "Repeat the intro backwards: hats out, then kick.",
    "Chords fade over 16 bars while the kick holds.",
    "Hard cut on bar 16 with a reverb tail.",
  ],
};

export function generateArrangement(genre: HhGenreId, mode: ArrangeMode, seed: number, bpm?: number): Arrangement {
  const g = HH_GENRE_BY_ID[genre];
  const r = rng(seed);
  const tempo = bpm ?? g.bpm;
  let template = g.template.map((s) => ({ ...s }));

  if (mode === "radio") {
    // shorter: halve intro/outro, trim breaks, single mid
    template = template.map((s) => {
      if (s.kind === "intro" || s.kind === "outro") return { ...s, bars: Math.max(4, Math.round(s.bars / 2)) };
      if (s.kind === "break") return { ...s, bars: Math.max(8, Math.round(s.bars / 2)) };
      if (s.kind === "mid") return { ...s, bars: Math.max(8, s.bars - 8) };
      return s;
    });
    // one intro only
    const firstIntro = template.findIndex((s) => s.kind === "intro");
    template = template.filter((s, i) => s.kind !== "intro" || i === firstIntro);
    const lastOutro = template.map((s) => s.kind).lastIndexOf("outro");
    template = template.filter((s, i) => s.kind !== "outro" || i === lastOutro);
  }
  if (mode === "dj") {
    // longer intro/outro, all 16-bar multiples
    template = template.map((s) => {
      if (s.kind === "intro" || s.kind === "outro") return { ...s, bars: Math.max(32, s.bars) };
      return { ...s, bars: Math.max(8, Math.round(s.bars / 8) * 8) };
    });
  }

  // seeded variation: sometimes lengthen a break, shorten a mid, add a variant note
  const sections: ArrangedSection[] = [];
  let bar = 0;
  const notes: string[] = [];
  template.forEach((s, i) => {
    let bars = s.bars;
    if (s.kind === "break" && r() > 0.6 && mode !== "radio") bars += 8;
    if (s.kind === "mid" && r() > 0.7) bars = Math.max(8, bars - 8);
    const variant = VARIANTS[s.kind][Math.floor(r() * VARIANTS[s.kind].length)];
    const doText = r() > 0.35 ? `${s.do} ${variant}` : s.do;
    sections.push({
      ...s,
      bars,
      do: doText,
      id: `${s.kind}-${i}`,
      startBar: bar,
      startSec: (bar * 4 * 60) / tempo,
      layers: LAYERS[s.kind],
    });
    bar += bars;
  });
  const totalBars = bar;
  const totalSec = (totalBars * 4 * 60) / tempo;
  notes.push(`${g.label} at ${tempo} BPM — ${totalBars} bars, ${fmtTime(totalSec)}.`);
  notes.push(g.arrangement);
  if (mode === "dj") notes.push("DJ mode: 32-bar intro and outro, every section on an 8-bar grid.");
  if (mode === "radio") notes.push("Radio mode: under four minutes, one intro, short breaks.");
  return { genre, mode, bpm: tempo, seed, sections, totalBars, totalSec, notes };
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function arrangementText(a: Arrangement): string {
  const g = HH_GENRE_BY_ID[a.genre];
  const lines = [
    `${g.label} arrangement — ${a.bpm} BPM — ${a.totalBars} bars (${fmtTime(a.totalSec)})`,
    "",
    ...a.sections.map(
      (s) =>
        `${String(s.startBar + 1).padStart(3)}  ${s.label.padEnd(16)} ${String(s.bars).padStart(3)} bars  ${fmtTime(s.startSec)}\n     ${s.do}\n     layers: ${s.layers.join(", ")}`,
    ),
    "",
    ...a.notes,
  ];
  return lines.join("\n");
}

/* --- MIDI marker file (type 0, tempo + markers only) --- */

function varlen(n: number): number[] {
  const bytes: number[] = [];
  let buffer = n & 0x7f;
  while ((n >>= 7)) {
    buffer <<= 8;
    buffer |= (n & 0x7f) | 0x80;
  }
  for (;;) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0) & 0x7f);
const u32 = (n: number) => [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];

export function arrangementMidi(a: Arrangement): Uint8Array {
  const PPQ = 96;
  const events: { tick: number; bytes: number[] }[] = [];
  const us = Math.round(60_000_000 / a.bpm);
  events.push({ tick: 0, bytes: [0xff, 0x51, 0x03, (us >> 16) & 0xff, (us >> 8) & 0xff, us & 0xff] });
  events.push({ tick: 0, bytes: [0xff, 0x58, 0x04, 4, 2, 24, 8] });
  for (const s of a.sections) {
    const name = ascii(`${s.label} (${s.bars})`.slice(0, 40));
    events.push({ tick: s.startBar * 4 * PPQ, bytes: [0xff, 0x06, name.length, ...name] });
  }
  const endName = ascii("End");
  events.push({ tick: a.totalBars * 4 * PPQ, bytes: [0xff, 0x06, endName.length, ...endName] });
  events.sort((x, y) => x.tick - y.tick);
  const body: number[] = [];
  let t = 0;
  for (const e of events) {
    body.push(...varlen(e.tick - t), ...e.bytes);
    t = e.tick;
  }
  body.push(0x00, 0xff, 0x2f, 0x00);
  const track = [...ascii("MTrk"), ...u32(body.length), ...body];
  const header = [...ascii("MThd"), ...u32(6), 0, 0, 0, 1, (PPQ >> 8) & 0xff, PPQ & 0xff];
  return new Uint8Array([...header, ...track]);
}
