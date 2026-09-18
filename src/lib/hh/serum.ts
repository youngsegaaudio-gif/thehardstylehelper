/** Serum patches and filter advice. Shown by default on every analysis. */
import type { HhGenreId } from "./genres";

export type SerumPatch = {
  id: string;
  name: string;
  use: string;
  lanes: HhGenreId[];
  osc: string[];
  filter: string[];
  env: string[];
  fx: string[];
  mix: string[];
  hard?: string;
};

export const SERUM_PATCHES: SerumPatch[] = [
  {
    id: "supersaw",
    name: "Euphoric supersaw lead",
    use: "The main drop lead in classic, euphoric and rawphoric tracks.",
    lanes: ["classic", "euphoric", "rawphoric", "frenchcore"],
    osc: [
      "OSC A: Basic Shapes → Saw, unison 7, detune 0.12–0.18, blend 75%, width 90%",
      "OSC B: same saw one octave down, unison 3, detune 0.08, level -6 dB",
      "Sub: sine at -12 dB, one octave below B, unison off (keeps the centre solid)",
      "Noise: off — air comes from the FX, not noise",
    ],
    filter: [
      "MG Low 12, cutoff 3–5 kHz, resonance 10%, drive 15%",
      "Filter key-track 30% so high notes open up",
    ],
    env: [
      "Env 1 (amp): A 5 ms, D 300 ms, S 80%, R 200 ms",
      "Env 2 → cutoff +30%: A 0, D 400 ms, S 0 — the 'pluck' on every note",
      "Env 3 → OSC A/B fine pitch +40 cents: A 0, D 60 ms, S 0 for the hardstyle 'bend' on note starts",
    ],
    fx: [
      "Hyper/Dimension: Hyper rate 0.5, detune 25%, unison 3; Dimension size 40%, mix 30%",
      "Distortion: Tube, drive 10%, pre-filter — just glue",
      "EQ: HP 250 Hz (12 dB), +2 dB at 3 kHz",
      "Delay: ping-pong 1/8 dotted, feedback 30%, HP 500 Hz, mix 15%",
      "Reverb: Hall size 50%, decay 3 s, mix 12%, low cut 400 Hz",
    ],
    mix: [
      "Play in octaves (root + octave) for the chorus; single line in the verse",
      "Bus: OTT 25%, then a compressor 2:1 with 20 ms attack, sidechain to the kick 3–4 dB",
      "HP at 250–300 Hz on the bus so the kick tail owns the low end",
    ],
    hard: "Layer three instances: this patch (wide), a narrow 1-voice pluck for attack (-8 dB), and a copy pitched +12 with LP at 6 kHz for air (-12 dB). Pan the pluck centre, widen only the air layer.",
  },
  {
    id: "screech",
    name: "Raw screech",
    use: "The rhythmic hook in raw, xtra raw and hardcore drops.",
    lanes: ["raw", "xtra-raw", "hardcore", "early"],
    osc: [
      "OSC A: Analog → Saw Round or any 'Squeal' table, unison 2, detune 0.05, WT position modulated",
      "OSC B: Basic Shapes → Square, +7 semitones, level -10 dB for metallic beating",
      "Noise: off. Sub: off — screeches live above 400 Hz",
    ],
    filter: [
      "Comb+ (or Cmb+ Flange), cutoff tracked to key 100%, resonance 40–60% — this is the vowel",
      "Second instance idea: Formant filter with Env 2 sweeping 'vowel' for talking screeches",
    ],
    env: [
      "Env 1 (amp): A 0, D 250 ms, S 60%, R 80 ms",
      "Env 2 → filter cutoff +25% AND → OSC A pitch +7 semitones: A 0, D 90 ms, S 0 — the pitch-drop start",
      "LFO 1 (1/16 sync, saw down) → WT position 40% for the 'ticking' texture",
    ],
    fx: [
      "Distortion FIRST: Tube or Diode, drive 45%, post-filter off",
      "Phaser: rate 0.3 Hz, depth 80%, feedback 60%, stages 8 — the sweep",
      "Flanger: rate 0.1 Hz, feedback 40%, mix 30%",
      "EQ: HP 400 Hz, dip -3 dB at 2.5 kHz if harsh",
      "Hyper: 2 voices, detune 10%, mix 40%",
      "Delay: 1/16, feedback 20%, mix 10%",
    ],
    mix: [
      "Write it as a rhythm on one or two notes; the filter and pitch do the melody",
      "Bus: OTT 40%, Pro-Q dynamic dip at 3 kHz -3 dB, then a limiter",
      "Sidechain hard to the kick (Kickstart curve 5) so the kick's tok stays clean",
    ],
    hard: "Automate the phaser rate and Comb cutoff by hand across the drop (rise over 8 bars, reset). Stack a second screech an octave up through a formant filter and pan them ±20.",
  },
  {
    id: "kicktail",
    name: "Kick tail (Serum as the kick body)",
    use: "A tuned, distorted tail to layer under a punch sample — hardstyle, raw and rawphoric.",
    lanes: ["classic", "euphoric", "raw", "xtra-raw", "rawphoric"],
    osc: [
      "OSC A: Basic Shapes → Sine, unison off, level 100%",
      "OSC B: Basic Shapes → Triangle, same pitch, level -6 dB for harmonics",
      "Play the root note in octave 1 (F1 = 43.65 Hz, G1 = 49, A1 = 55)",
    ],
    filter: [
      "MG Low 24, cutoff 900 Hz, resonance 20%, drive 30% — the filter distortion is part of the tone",
      "Env 2 → cutoff -40%: A 0, D 150 ms so the tail darkens as it decays",
    ],
    env: [
      "Env 1 (amp): A 0, D 1 beat (400 ms at 150 BPM), S 0, R 30 ms — hold matches the beat",
      "Env 3 → OSC A/B coarse pitch +36 semitones: A 0, D 35 ms, S 0 — the pitch drop that makes the punch join the tail",
      "Env 3 curve: pull it convex so the pitch falls fast then settles",
    ],
    fx: [
      "Distortion: Hard Clip drive 60% (pre-filter) → this is the 'raw' amount",
      "Second distortion via the Filter drive; a third stage lives outside Serum (Saturn/Trash/Phat FX)",
      "EQ: +4 dB at 250 Hz Q 1.5 for the tok, -3 dB at 1.5 kHz, LP 8 kHz",
      "Compressor: ratio 4:1, attack 5 ms, release 100 ms, threshold until 4 dB GR",
    ],
    mix: [
      "Bounce to audio; the tail is never played live from Serum",
      "Layer: clean punch sample (first 30 ms) + this tail starting 10 ms later, crossfade 10 ms",
      "Mono below 150 Hz; a multiband compressor on the kick bus to steady the sub",
    ],
    hard: "Make three tails at different distortion amounts, then automate which plays per 8-bar block (clean in the verse-drop, dirty in the last 16). Cut the tail at 3/4 beat on every 4th bar for a 'gap' edit.",
  },
  {
    id: "reversebass",
    name: "Reverse bass",
    use: "Early hardstyle and mid-section throwbacks in raw.",
    lanes: ["early", "raw", "hardcore"],
    osc: [
      "OSC A: Basic Shapes → Saw, unison off, level 100%, octave 1 (same root as the kick)",
      "OSC B: Sine one octave up, level -10 dB",
    ],
    filter: ["MG Low 24, cutoff 500 Hz, resonance 30%, drive 40%"],
    env: [
      "Env 1: A 200 ms (this IS the reverse), D 0, S 100%, R 20 ms",
      "Place notes on the off-beat ('and'), length 1/8 so the swell ends exactly on the kick",
      "Env 2 → cutoff +30%: A 200 ms, D 0, S 100% so it brightens as it swells",
    ],
    fx: ["Distortion: Tube 40%", "EQ: HP 45 Hz, LP 3 kHz", "Compressor 4:1 fast"],
    mix: [
      "Alternative: render one saw hit, reverse the audio, fade in — the classic method",
      "Sidechain from the kick with a fast release so kick and bass never overlap",
      "Mono; sits at the same pitch as the kick tail",
    ],
  },
  {
    id: "psybass",
    name: "Psy rolling bass",
    use: "Psystyle: the 16th-note bass between the kicks.",
    lanes: ["psy"],
    osc: ["OSC A: Saw, unison off, octave 1", "OSC B: Square -12 dB, same pitch", "Sub: off (the saw is the sub)"],
    filter: ["MG Low 24, cutoff 300 Hz, resonance 20%, drive 25%", "Env 2 → cutoff +35%: A 0, D 90 ms, S 0 — per-note pluck"],
    env: ["Env 1: A 0, D 120 ms, S 0, R 10 ms — short and tight", "Notes: rest on the kick, then three 1/16 notes (x-x-x-x pattern: kick, bass, bass, bass)"],
    fx: ["Distortion: Tube 20%", "EQ: HP 35 Hz, +2 dB at 90 Hz", "Compressor fast, 3 dB GR"],
    mix: ["Mono, sidechained to the kick with a 30 ms release", "Kick must be shorter than a 1/16 so the first bass note is clean"],
  },
  {
    id: "frenchbounce",
    name: "Frenchcore bounce",
    use: "The off-beat bass hit in frenchcore.",
    lanes: ["frenchcore"],
    osc: ["OSC A: Square, unison off, octave 1 or 2 (a fifth above the kick works)", "OSC B: Saw -8 dB"],
    filter: ["MG Low 12, cutoff 800 Hz, resonance 15%, drive 50%"],
    env: ["Env 1: A 0, D 110 ms, S 0 — one hit per off-beat", "Env 2 → pitch +5 semitones: A 0, D 25 ms for a bouncy attack"],
    fx: ["Distortion: Diode 50%", "EQ: HP 50 Hz, +3 dB at 200 Hz", "Compressor 4:1"],
    mix: ["Sidechain to the kick, mono", "Tune it a fifth above the kick or to the same root — try both per track"],
  },
  {
    id: "pluck",
    name: "Pluck (attack layer / arps)",
    use: "Arpeggios in builds; the attack layer under a supersaw.",
    lanes: ["classic", "euphoric", "rawphoric", "psy", "frenchcore"],
    osc: ["OSC A: Saw, unison 1", "OSC B: Square +12, level -6 dB"],
    filter: ["MG Low 24, cutoff 400 Hz, resonance 25%", "Env 2 → cutoff +60%: A 0, D 250 ms, S 0"],
    env: ["Env 1: A 0, D 300 ms, S 0, R 100 ms"],
    fx: ["Hyper 2 voices 15%", "Delay 1/8 dotted 25%", "Reverb 15%"],
    mix: ["HP 300 Hz", "Under the supersaw at -6 to -8 dB, centre"],
  },
  {
    id: "riser",
    name: "Riser / noise sweep",
    use: "Every build in every lane.",
    lanes: ["early", "classic", "euphoric", "raw", "xtra-raw", "rawphoric", "psy", "hardcore", "uptempo", "frenchcore"],
    osc: ["Noise: white noise 100%, OSC A saw -20 dB pitched by Env 3 over 8 bars (use a long envelope or an LFO in env mode)"],
    filter: ["MG Band 12, cutoff modulated from 200 Hz to 8 kHz across the build (LFO 1 env mode, rate 8 bars)"],
    env: ["Env 1: A 8 bars is impossible — instead hold a note for 8 bars and automate LFO 1 rate"],
    fx: ["Reverb: Plate, decay 2 s, mix 40%", "Delay 1/4, feedback 50% for the last bar", "EQ: HP 400 Hz"],
    mix: ["Render it, then reverse a copy for a 'suck' into silence before the drop"],
  },
];

export type FilterTip = { title: string; body: string; where: string };

export const SERUM_FILTER_GUIDE: FilterTip[] = [
  { title: "MG Low 12 / 24", body: "The default low-pass. 12 dB is gentler and keeps leads bright; 24 dB is for basses and tails where you want everything above the cutoff gone. Drive adds Moog-style grit — use it on tails.", where: "Leads (12), tails and basses (24)" },
  { title: "Comb+ / Comb-", body: "The screech filter. It adds a harmonic series at the cutoff; with key-tracking at 100% the comb tuning follows the note so the vowel stays consistent. Resonance is the vowel strength.", where: "Screeches, zaag leads" },
  { title: "Formant", body: "Vowel shapes (a-e-i-o-u). Sweep it with an envelope for talking screeches; hold it on 'o' for a round hoover.", where: "Talking screeches, hoovers" },
  { title: "French LP / Ladder", body: "Smooth analogue-style low-passes with strong resonance. French LP with high resonance gives acid squelch for psy bass lines.", where: "Psy bass, acid lines" },
  { title: "Flange / Phase", body: "Modulation-style filters. Phase 12/24 with cutoff modulated by an LFO is a built-in phaser — the screech sweep without an FX slot.", where: "Screech movement" },
  { title: "Ring Mod / Sample & Hold", body: "Metallic, inharmonic. Ring Mod at a fixed frequency on a saw = hoover-adjacent metal; S&H at 1/16 makes stepped textures for builds.", where: "Metallic stabs, build textures" },
  { title: "Multi / Band / Notch", body: "Band-pass with resonance is the riser filter; Notch swept slowly on a pad adds movement without changing its level.", where: "Risers, pads" },
  { title: "Reverb / Delay filters", body: "Serum's 'Reverb' and 'Delay' filter types put space inside the voice. Delay filter tuned to the note = comb-ish pluck; Reverb filter on a pad = instant width.", where: "Plucks, pads" },
];

export const FILTER_MIX_RULES: FilterTip[] = [
  { title: "High-pass everything that isn't the kick", body: "Leads at 250–300 Hz, screeches at 400 Hz, pads at 200 Hz, vocals at 120–180 Hz, reverb returns at 300–400 Hz. The kick tail is the bass in most lanes; nothing else needs to be down there.", where: "Every channel EQ" },
  { title: "Low-pass distorted kicks", body: "After distortion a kick sprays fizz to 20 kHz. LP at 8–12 kHz (12 dB) on the distorted layer; keep the clean punch layer open for click.", where: "Kick bus" },
  { title: "Filter automation is the build", body: "A 24 dB LP opening from 300 Hz to full over the 8–16 bars of a build on the lead, plus an HP rising on the drums, is 80% of a good build. Automate the filter, not the volume.", where: "Builds" },
  { title: "Resonance for tension, not for tone", body: "Resonance peaks on the build filters (20–30%) make the sweep audible. In the drop, resonance on the lead's LP creates a peak that fights the kick's tok — turn it down there.", where: "Build vs drop" },
  { title: "Steep filters for surgery, gentle for tone", body: "Use 48 dB slopes only to remove things (rumble under a vocal). Use 6–12 dB slopes to shape tone. Steep slopes ring on transients like kicks.", where: "EQ slopes" },
  { title: "Mono below 120–150 Hz", body: "A low-pass on the side channel (mid/side EQ) or an imager band set to 0 width below 120 Hz. Club systems sum the low end anyway; keep it phase-safe.", where: "Master / kick bus" },
  { title: "Dynamic filters beat static ones", body: "A dynamic EQ band on the lead at 60–150 Hz keyed to the kick removes only what the kick needs, only when it plays. Static cuts make leads thin in the break.", where: "Lead bus" },
];
