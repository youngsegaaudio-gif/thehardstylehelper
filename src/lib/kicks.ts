import type { KickRecipe, StyleId, TrackSession } from "./types";
import { family } from "./catalog";

const PVC: KickRecipe[] = [
  {
    id: "peak-pvc",
    name: "Peak PVC",
    kind: "main",
    length: "90–130 ms. If it rings past the next hat, gate it.",
    eq: "HP 28 Hz. Body +3–5 dB at 70–95 Hz, tuned to the key. Scoop 280–450 Hz. Click +2–4 dB at 3.5–5 kHz.",
    compression: "Clip 2–4 dB after distortion, not before. Compressor 4:1, attack 8–20 ms, release 40–70 ms.",
    plugins:
      "Kick 3 or one-shot → Channel EQ → Kilohearts Distortion / Logic Overdrive → soft clipper → FabFilter Pro-C or Logic Comp. No reverb.",
    where: "Every beat of the groove and peak. This is the kick. Mute it for 1 bar only at a switch.",
  },
  {
    id: "click-extra",
    name: "Click extra",
    kind: "extra",
    length: "20–40 ms. No tail.",
    eq: "HP 2 kHz. Tiny bump at 4–6 kHz. Nothing below 1 kHz.",
    compression: "None, or a clipper if it splatters. Keep transient.",
    plugins: "Transient sample or Kick 3 click layer on its own track. Logic: no send, no bus with the body.",
    where: "Layered on the Peak PVC the whole track, 6–8 dB under. This is the extra, not a second kick in the low end.",
  },
  {
    id: "sub-extra",
    name: "Sub extra",
    kind: "extra",
    length: "Same gate as the PVC. Sine, no click.",
    eq: "Sine 45–60 Hz tuned to the key root. LP 80 Hz. HP 25 Hz.",
    compression: "Sidechain/gate from the main PVC so it never hums between hits.",
    plugins: "Logic Test Oscillator or Serum sine → Channel EQ → Compressor (sc from kick).",
    where: "Peak sections only. Mute in intro and filter breaks so the drop has weight to gain.",
  },
  {
    id: "mid-pvc",
    name: "Mid PVC extra",
    kind: "extra",
    length: "Same as Peak PVC.",
    eq: "HP 200 Hz, LP 1.5–2 kHz. This is the boxy 'pvc' mid, not the body.",
    compression: "Heavy distortion, then clip. Blend 15–25% under the main.",
    plugins: "Copy of the main kick → Channel EQ (band-pass) → Distortion (Kilohearts / Saturn / Overdrive) → clip → fader.",
    where: "Peaks only. If the kick gets small on a club system, this layer is too loud or too 400 Hz.",
  },
  {
    id: "ghost-pvc",
    name: "Ghost PVC",
    kind: "ghost",
    length: "Shorter than the peak. HP so it is pulse, not weight.",
    eq: "HP 120–180 Hz. −12 to −18 dB vs the peak.",
    compression: "None.",
    plugins: "Same sample, duplicate track, quieter, filtered.",
    where: "Filter breaks and the bar before a mute-slam, so the 4/4 never fully dies.",
  },
  {
    id: "fill-pvc",
    name: "Fill PVC (extra kick roll)",
    kind: "fill",
    length: "Shorter hits. 1/8 then 1/16.",
    eq: "Same as Peak PVC but HP 60 Hz so the roll doesn't melt the sub.",
    compression: "Clip a bit harder so the roll reads.",
    plugins: "Same kick bus or a duplicate. MIDI: extra-kick / pvc-fill from HELPER.",
    where: "Last bar of every 16. Last two beats of a 32. Not in the middle of a phrase.",
  },
  {
    id: "impact-pvc",
    name: "Impact PVC",
    kind: "impact",
    length: "180–250 ms. One-shot. Longer than the groove kick.",
    eq: "Body + click. Allow a little 150 Hz for the slam, then it must get out of the way.",
    compression: "Clip into the downbeat. No sustain after beat 2.",
    plugins: "Heavier Kick 3 patch or a different one-shot. Own track. Region only on the downbeat.",
    where: "Bar 1 of a new 32, and the slam after a 1-bar kick mute.",
  },
  {
    id: "reverse-pvc",
    name: "Reverse extra",
    kind: "extra",
    length: "1 beat to 1 bar, reversed.",
    eq: "HP 80 Hz so it doesn't rumble the incoming kick.",
    compression: "None. Volume swell into the downbeat.",
    plugins: "Logic: reverse the Peak PVC region, or Bounce in Place → reverse.",
    where: "1 bar before a section switch. Hard techno: 1 bar, not 8. Hardstyle: 2-bar reverse cymbal instead.",
  },
  {
    id: "noise-extra",
    name: "Noise / metal extra",
    kind: "extra",
    length: "20–50 ms burst.",
    eq: "HP 1 kHz. Distorted pink noise or a metal hit.",
    compression: "Clip. It is spice, not a kick.",
    plugins: "Serum noise osc or a found hit → distortion → short env.",
    where: "With Impact PVC, or on industrial breakdowns. Every 4 bars max or it turns into a hat.",
  },
  {
    id: "pickup-extra",
    name: "Pickup extra",
    kind: "extra",
    length: "One 16th.",
    eq: "Same as click extra, or a tiny PVC.",
    compression: "None.",
    plugins: "Same extra-kick track. MIDI: last 16th before bar 1 of a peak.",
    where: "Into Peak 1 and Peak 2. Skip it in the intro.",
  },
];

const RAW_EXTRAS = new Set([
  "peak-pvc",
  "click-extra",
  "sub-extra",
  "fill-pvc",
  "impact-pvc",
  "reverse-pvc",
]);

const UPTEMPO_EXTRAS = new Set([
  "peak-pvc",
  "click-extra",
  "fill-pvc",
  "impact-pvc",
  "noise-extra",
]);

export function kicksFor(style: StyleId): KickRecipe[] {
  const f = family(style);
  if (f === "techno") return PVC;
  if (f === "up") return PVC.filter((k) => UPTEMPO_EXTRAS.has(k.id));
  if (f === "raw") return PVC.filter((k) => RAW_EXTRAS.has(k.id));
  return PVC.filter((k) =>
    ["peak-pvc", "click-extra", "sub-extra", "fill-pvc", "reverse-pvc"].includes(k.id),
  );
}

export function kicksDocument(session: TrackSession): string {
  const list = kicksFor(session.style);
  const lines = [
    `HELPER — PVC / extra kicks · ${session.style} · ${session.bpm} BPM · ${session.key}`,
    "",
    ...list.flatMap((k) => [
      `${k.name}  [${k.kind}]  ${k.length}`,
      `  Where: ${k.where}`,
      `  EQ: ${k.eq}`,
      `  Comp: ${k.compression}`,
      `  Chain: ${k.plugins}`,
      "",
    ]),
  ];
  return lines.join("\n");
}
