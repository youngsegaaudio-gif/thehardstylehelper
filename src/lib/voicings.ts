import { KEY_NOTES } from "./catalog";
import type { MusicalKey } from "./types";

const PC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

const ROOT_MIDI: Record<string, number> = {
  C: 48,
  "C#": 49,
  Db: 49,
  D: 50,
  "D#": 51,
  Eb: 51,
  E: 52,
  F: 53,
  "F#": 54,
  Gb: 54,
  G: 55,
  "G#": 56,
  Ab: 56,
  A: 57,
  "A#": 58,
  Bb: 58,
  B: 59,
};

export type ChordVoicing = {
  name: string;
  midi: number[];
  notes: string[];
  intervals: string;
};

export function midiToName(n: number): string {
  return `${PC[((n % 12) + 12) % 12]}${Math.floor(n / 12) - 1}`;
}

function parseChord(name: string): { root: number; minor: boolean } {
  const minor = /[A-G](?:#|b)?m$/.test(name);
  const rootName = minor ? name.slice(0, -1) : name;
  return { root: ROOT_MIDI[rootName] ?? 57, minor };
}

/** Tight stab: root, 5th, octave, 10th. Standard hardstyle / UKHC voicing. */
export function voicingFor(name: string): ChordVoicing {
  const { root, minor } = parseChord(name);
  const third = root + (minor ? 3 : 4);
  const midi = [root, root + 7, root + 12, third + 12];
  return {
    name,
    midi,
    notes: midi.map(midiToName),
    intervals: minor ? "R · 5 · 8 · b3" : "R · 5 · 8 · 3",
  };
}

export function progressionVoicings(key: MusicalKey): ChordVoicing[] {
  return KEY_NOTES[key].chords.map(voicingFor);
}

export function progressionLabel(key: MusicalKey): string {
  return KEY_NOTES[key].chords.join("  –  ");
}

export function scaleNames(key: MusicalKey): string[] {
  return KEY_NOTES[key].scale.map((n) => midiToName(n + 12));
}
