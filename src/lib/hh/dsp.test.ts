import assert from "node:assert/strict";
import { test } from "node:test";
import { analysePcm, hzToNote } from "./dsp.ts";

/** Synthesise a hardstyle-ish track: tuned kicks at a tempo, chord stabs, a break. */
function synth(bpm: number, seconds: number, fs = 44100) {
  const n = Math.floor(seconds * fs);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const beat = 60 / bpm;
  const bar = beat * 4;
  const tailHz = 43.65; // F1
  const kickLen = 0.32;
  // A minor stab notes (A3 C4 E4)
  const chord = [220, 261.63, 329.63];
  for (let i = 0; i < n; i++) {
    const t = i / fs;
    const barIdx = Math.floor(t / bar);
    const inBreak = barIdx >= 8 && barIdx < 16; // bars 8–15: no kick, chords only
    let v = 0;
    if (!inBreak) {
      const tb = t % beat;
      if (tb < kickLen) {
        const env = Math.exp(-tb * 9);
        const pitch = tailHz + 180 * Math.exp(-tb * 60); // punch sweeps down into the tail
        const phase = 2 * Math.PI * (tailHz * tb + (180 / 60) * (1 - Math.exp(-tb * 60)));
        void pitch;
        v += Math.tanh(2.2 * Math.sin(phase)) * env * 0.9;
      }
    }
    // chord stabs on the off-beats, louder in the break
    const tb = (t + beat / 2) % beat;
    if (tb < 0.18) {
      const env = Math.exp(-tb * 18) * (inBreak ? 0.35 : 0.12);
      for (const f of chord) v += Math.sin(2 * Math.PI * f * t) * env;
    }
    // slight stereo difference in the chord layer only
    left[i] = Math.max(-1, Math.min(1, v));
    right[i] = Math.max(-1, Math.min(1, v * 0.97));
  }
  return { sampleRate: fs, left, right };
}

test("hzToNote maps F1 and A1", () => {
  assert.equal(hzToNote(43.65).note, "F1");
  assert.equal(hzToNote(55).note, "A1");
  assert.ok(Math.abs(hzToNote(55).cents) <= 1);
});

test("analysePcm finds tempo, kick tail pitch, key and a break on a synthetic track", () => {
  const input = synth(150, 40);
  const a = analysePcm(input);
  assert.ok(Math.abs(a.bpm.value - 150) < 1, `bpm ${a.bpm.value}`);
  assert.ok(a.kick.count > 60 && a.kick.count < 80, `kicks ${a.kick.count}`);
  assert.ok(Math.abs(a.kick.hz - 43.65) < 3, `kick hz ${a.kick.hz}`);
  assert.equal(a.kick.note, "F1");
  assert.ok(a.kick.tailBeats > 0.3 && a.kick.tailBeats < 1.05, `tail ${a.kick.tailBeats}`);
  assert.equal(a.key.name, "A minor");
  assert.ok(a.loudness.integrated < 0 && a.loudness.integrated > -30, `lufs ${a.loudness.integrated}`);
  assert.ok(a.loudness.samplePeakDb <= 0.1);
  assert.ok(a.bands.low === 0 || a.bands.sub === 0, "low end should be the loudest band");
  const kinds = a.structure.sections.map((s) => s.kind);
  assert.ok(kinds.includes("drop"), `sections ${kinds.join(",")}`);
  assert.ok(kinds.includes("break"), `sections ${kinds.join(",")}`);
  assert.ok(a.stereo.correlation > 0.9);
});

test("analysePcm handles mono input and short files", () => {
  const { left, sampleRate } = synth(160, 12);
  const a = analysePcm({ sampleRate, left, right: null });
  assert.equal(a.channels, 1);
  assert.ok(Math.abs(a.bpm.value - 160) < 1.5, `bpm ${a.bpm.value}`);
});
