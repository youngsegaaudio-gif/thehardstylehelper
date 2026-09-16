import { KEY_NOTES } from "./catalog";
import { progressionVoicings } from "./voicings";
import type { MusicalKey } from "./types";

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

function u16(n: number) {
  return [(n >> 8) & 0xff, n & 0xff];
}
function u32(n: number) {
  return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

type MidiEvent = { tick: number; bytes: number[] };

function trackBytes(events: MidiEvent[]): number[] {
  events.sort((a, b) => a.tick - b.tick || a.bytes[0] - b.bytes[0]);
  const body: number[] = [];
  let t = 0;
  for (const e of events) {
    body.push(...varlen(Math.max(0, e.tick - t)), ...e.bytes);
    t = e.tick;
  }
  body.push(...varlen(0), 0xff, 0x2f, 0x00);
  return [...ascii("MTrk"), ...u32(body.length), ...body];
}

function ascii(s: string) {
  return [...s].map((c) => c.charCodeAt(0));
}

function metaTempo(bpm: number): number[] {
  const us = Math.round(60_000_000 / bpm);
  return [0xff, 0x51, 0x03, (us >> 16) & 0xff, (us >> 8) & 0xff, us & 0xff];
}

function metaName(name: string): number[] {
  const chars = ascii(name.slice(0, 32));
  return [0xff, 0x03, chars.length, ...chars];
}

function metaMarker(name: string): number[] {
  const chars = ascii(name.slice(0, 32));
  return [0xff, 0x06, chars.length, ...chars];
}

const PPQ = 96;

function noteOn(tick: number, note: number, vel: number, ch = 0): MidiEvent {
  return { tick, bytes: [0x90 | ch, note & 0x7f, vel & 0x7f] };
}
function noteOff(tick: number, note: number, ch = 0): MidiEvent {
  return { tick, bytes: [0x80 | ch, note & 0x7f, 0] };
}

function addNote(events: MidiEvent[], start: number, dur: number, note: number, vel: number) {
  const n = Math.max(0, Math.min(127, note));
  events.push(noteOn(start, n, vel), noteOff(start + Math.max(1, dur), n));
}

export type MidiKind =
  | "kick"
  | "clap"
  | "hats"
  | "chords"
  | "lead"
  | "bass"
  | "screech"
  | "snare-roll"
  | "extra-kick"
  | "pvc-fill";

type MidiOpts = {
  bpm: number;
  key: MusicalKey;
  bars?: number;
  /** 0-based last bars of each phrase */
  fillBars?: number[];
  /** 0-based first bars of the next phrase */
  impactBars?: number[];
  /** 0-based bars that get a snare roll (build tails) */
  rollBars?: number[];
};


function fillKind(kind: MidiKind, opts: MidiOpts): MidiEvent[] {
  const bars = opts.bars ?? 16;
  const events: MidiEvent[] = [];
  const bar = PPQ * 4;
  const beat = PPQ;
  const eighth = beat / 2;
  const sixteenth = beat / 4;

  if (kind === "kick") {
    for (let b = 0; b < bars; b++) {
      for (let q = 0; q < 4; q++) {
        addNote(events, b * bar + q * beat, beat - 4, 36, 112);
      }
    }
  }

  if (kind === "clap") {
    for (let b = 0; b < bars; b++) {
      addNote(events, b * bar + beat, beat / 2, 39, 104);
      addNote(events, b * bar + beat * 3, beat / 2, 39, 104);
    }
  }

  if (kind === "hats") {
    for (let b = 0; b < bars; b++) {
      for (let e = 0; e < 8; e++) {
        addNote(events, b * bar + e * eighth, eighth - 2, 42, e % 2 === 0 ? 88 : 72);
      }
    }
  }

  if (kind === "chords") {
    const voicings = progressionVoicings(opts.key);
    for (let b = 0; b < bars; b++) {
      const chord = voicings[b % voicings.length];
      const start = b * bar;
      for (const n of chord.midi) addNote(events, start, bar - 8, n, 92);
    }
  }

  if (kind === "lead") {
    const scale = KEY_NOTES[opts.key].scale;
    const pattern = [0, 2, 3, 2, 4, 3, 2, 0, 4, 5, 4, 3, 2, 3, 4, 7];
    for (let b = 0; b < bars; b++) {
      for (let s = 0; s < 4; s++) {
        const idx = pattern[(b * 4 + s) % pattern.length] % scale.length;
        const note = scale[idx] + 12;
        const dur = s === 0 ? beat - 2 : beat / 2;
        addNote(events, b * bar + s * beat, dur, note, s === 0 ? 108 : 96);
      }
    }
  }

  if (kind === "bass") {
    const root = KEY_NOTES[opts.key].root - 24;
    for (let b = 0; b < bars; b++) {
      for (let e = 0; e < 8; e++) {
        if (e % 2 === 1) {
          addNote(events, b * bar + e * eighth, eighth - 4, root, 108);
        }
      }
    }
  }

  if (kind === "screech") {
    const root = KEY_NOTES[opts.key].scale[4] + 24;
    for (let b = 0; b < bars; b++) {
      if (b % 4 === 0) {
        addNote(events, b * bar, beat, root, 110);
      }
    }
  }

  if (kind === "snare-roll") {
    const rolls =
      opts.rollBars && opts.rollBars.length
        ? opts.rollBars
        : Array.from({ length: bars }, (_, i) => i);
    for (let i = 0; i < rolls.length; i++) {
      const b = rolls[i];
      let step = eighth;
      if (i >= rolls.length - 4) step = sixteenth;
      if (i >= rolls.length - 2) step = sixteenth / 2;
      const hits = Math.round(bar / step);
      for (let h = 0; h < hits; h++) {
        const vel = Math.min(120, 70 + i * 3 + (h % 2 === 0 ? 8 : 0));
        addNote(events, b * bar + h * step, step - 1, 38, vel);
      }
    }
  }

  if (kind === "extra-kick") {
    const fills = opts.fillBars?.length
      ? opts.fillBars
      : Array.from({ length: bars }, (_, b) => b).filter((b) => (b + 1) % 4 === 0);
    const impacts = opts.impactBars?.length
      ? opts.impactBars
      : Array.from({ length: bars }, (_, b) => b).filter((b) => b % 16 === 0);
    for (const b of fills) {
      addNote(events, b * bar + beat * 3 + eighth, eighth - 2, 36, 118);
    }
    for (const b of impacts) {
      addNote(events, b * bar, beat, 37, 120);
      addNote(events, b * bar, beat * 2, 49, 100);
    }
  }

  if (kind === "pvc-fill") {
    const fills = opts.fillBars?.length
      ? opts.fillBars
      : Array.from({ length: bars }, (_, b) => b).filter((b) => (b + 1) % 8 === 0);
    for (const b of fills) {
      for (let i = 0; i < 8; i++) {
        addNote(events, b * bar + beat * 2 + i * sixteenth, sixteenth - 1, 36, 100 + i);
      }
    }
  }


  return events;
}

function buildSmf0(bpm: number, trackName: string, events: MidiEvent[]): Uint8Array {
  const header = [...ascii("MThd"), ...u32(6), ...u16(0), ...u16(1), ...u16(PPQ)];
  const timed: MidiEvent[] = [
    { tick: 0, bytes: metaName(trackName) },
    { tick: 0, bytes: metaTempo(bpm) },
    { tick: 0, bytes: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08] },
    ...events,
  ];
  return new Uint8Array([...header, ...trackBytes(timed)]);
}

export function makeMidi(kind: MidiKind, opts: MidiOpts): Uint8Array {
  const names: Record<MidiKind, string> = {
    kick: "HELPER Kick",
    clap: "HELPER Clap",
    hats: "HELPER Hats",
    chords: "HELPER Chords",
    lead: "HELPER Lead",
    bass: "HELPER Bass",
    screech: "HELPER Screech",
    "snare-roll": "HELPER Snare Roll",
    "extra-kick": "HELPER Extra Kick",
    "pvc-fill": "HELPER PVC Fill",
  };
  return buildSmf0(opts.bpm, names[kind], fillKind(kind, opts));
}

export function makeSongMidi(opts: MidiOpts & { markers?: { bar: number; label: string }[] }): Uint8Array {
  const bars = opts.bars ?? 16;
  const bar = PPQ * 4;
  const kinds: MidiKind[] = ["kick", "clap", "hats", "chords", "lead", "bass"];
  const conductor: MidiEvent[] = [
    { tick: 0, bytes: metaName("HELPER") },
    { tick: 0, bytes: metaTempo(opts.bpm) },
    { tick: 0, bytes: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08] },
  ];
  for (const m of opts.markers ?? []) {
    conductor.push({ tick: m.bar * bar, bytes: metaMarker(m.label) });
  }
  const tracks = [
    trackBytes(conductor),
    ...kinds.map((kind) => {
      const events: MidiEvent[] = [
        { tick: 0, bytes: metaName(`HELPER ${kind}`) },
        ...fillKind(kind, { ...opts, bars }),
      ];
      return trackBytes(events);
    }),
  ];
  const header = [
    ...ascii("MThd"),
    ...u32(6),
    ...u16(1),
    ...u16(tracks.length),
    ...u16(PPQ),
  ];
  return new Uint8Array([...header, ...tracks.flat()]);
}

export function downloadMidi(bytes: Uint8Array, filename: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
