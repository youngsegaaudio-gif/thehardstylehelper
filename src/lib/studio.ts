import type { Artist, School } from "./artists";

export type StudioPack = {
  idea: string;
  build: string[];
  instruments: { name: string; how: string }[];
  mix: { layer: string; chain: string }[];
  master: string[];
};

const IDEAS: Record<School, string[]> = {
  "ar-gang": [
    "Spoken line in the break, screech as the only drop hook.",
    "Kick + reverse bass first. No melody until drop 2.",
    "Empty 8 bars then a one-shot screech. That's the identity.",
  ],
  "lil-texas": [
    "Chopped vocal as the rhythm. Happy lead, hard kick.",
    "Hook in 8 bars. Drop hits immediately.",
    "Pitched vox offbeats. Bounce hats, not epic tails.",
  ],
  raw: [
    "Kick design is the track. Stab instead of climax saw.",
    "Dark pad break, then a wall. Second drop = extra crunch.",
    "Industrial FX glue. Leave holes for the kick.",
  ],
  euphoric: [
    "Break melody becomes the drop lead. Reverse bass locked.",
    "Longer break, same 32-bar drop. Choir under the last 8.",
    "Climax saw, kick still wins the center.",
  ],
  uk: [
    "4-bar piano riff first. Offbeat bass, not reverse bass.",
    "Vocal hook is the song. Drop restates it.",
    "Snare build last 4 of the 16. Fairground, not warehouse.",
  ],
  hardcore: [
    "Kick wall. Stab. Shout. Stop writing.",
    "Short map. Distortion before EQ.",
    "Hoover or nothing. No pretty break.",
  ],
  techno: [
    "Peak PVC never leaves. 1-bar mute is the transition.",
    "Click extra + sub extra. Stab, not supersaw.",
    "DJ tool. Loop the peak. Filter, don't chorus.",
  ],
};

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pick<T>(r: () => number, xs: T[]): T {
  return xs[Math.floor(r() * xs.length)]!;
}

export function studioFor(artist: Artist, seed: number): StudioPack {
  const r = rng(seed ^ 0x9e3779b9);
  const s = artist.school;
  const raw = s === "ar-gang" || s === "raw";
  const happy = s === "lil-texas" || s === "uk";
  const hc = s === "hardcore";
  const uk = s === "uk";

  const idea = `${artist.name}: ${pick(r, IDEAS[s])}`;

  const build = raw
    ? [
        "Kick 3 — body, click, clip. Nothing else until it punches.",
        "Serum reverse bass, same MIDI as the kick, sidechain Pro-C.",
        "Markers from this map. Mute everything that isn't kick+bass.",
        "Break: atmosphere + one motif. No climax saw.",
        "Drop hook: short screech (Serum noise+saw, 80–180 ms).",
        "FX last. Mix. Then master.",
      ]
    : happy
      ? [
          "Write the 4-bar hook (piano or vox) before the kick is pretty.",
          "Kick 3 at " + artist.bpm + ". Offbeat bass in Serum, not reverse bass.",
          "Markers. Drop restates the hook.",
          "Hats/clap busier than hardstyle. Bounce.",
          "Snare roll last 4 of each build.",
          "Mix. Master quieter than raw — leave the vocal.",
        ]
      : hc
        ? [
            "Kick 3 + Kilohearts Distortion until it hurts. Gate the tail.",
            "Stab or hoover. That's the hook.",
            "Short map. No 32-bar tease.",
            "Shout vox one-liner.",
            "Industrial FX, then stop adding.",
            "Clip hard. Master last.",
          ]
        : [
            "Break melody in Serum first (the drop will copy it).",
            "Kick 3 + reverse bass locked to 1.",
            "Markers. 32-bar phrases.",
            "Build: white noise + snare last 4.",
            "Climax lead = break melody, unison 7, HP 180 Hz.",
            "Mix around the kick. Master with Ozone / Adaptive Limiter.",
          ];

  const instruments = raw
    ? [
        { name: "Kick", how: "Kick 3. Body 70–95 Hz. Click 4 kHz. Kilohearts Distortion after EQ. Soft clip." },
        { name: "Reverse bass", how: "Serum: saw, pitch env down, short. Same notes as kick. Pro-C sc from kick." },
        { name: "Screech", how: "Serum noise + bandpass. 80–180 ms. Slightly left of center." },
        { name: "Stab", how: "Serum or Logic ES2. Beat 1. Short decay." },
        { name: "Atmosphere", how: "Vital/Serum pad, wide, ducked. Break only." },
      ]
    : happy
      ? [
          { name: "Kick", how: "Kick 3, punchy not extra-raw. HP 28 Hz." },
          { name: "Offbeat bass", how: "Serum square/saw on the offbeats. Logic Compressor sc from kick." },
          { name: uk ? "Piano" : "Lead", how: uk ? "Logic Sampler or Serum keys. 4-bar riff." : "Serum supersaw, bounce env, not 4-bar tails." },
          { name: "Vox", how: "Chop in Logic. Pitch. Delay throw in the break only." },
          { name: "Hats", how: "Busier. Slightly right. No reverb wash." },
        ]
      : hc
        ? [
            { name: "Kick", how: "Kick 3 → Kilohearts Distortion → clip. Gate. No reverb." },
            { name: "Stab / hoover", how: "Serum or Logic Retro Synth. Short. Distorted." },
            { name: "Shout", how: "One line. Center. Clip." },
            { name: "FX", how: "Metal hits, noise. Wide." },
          ]
        : [
            { name: "Kick", how: "Kick 3, musical pitch. Reverse bass under it." },
            { name: "Reverse bass", how: "Serum. Sidechain Pro-C. Mono." },
            { name: "Break melody", how: "Serum 2–3 osc, low unison. This is the drop lead later." },
            { name: "Climax lead", how: "Same MIDI as the break. Unison 7, HP 180 Hz, FabFilter Pro-Q scoop 300 Hz." },
            { name: "Pad / choir", how: "Vital or Serum. Wide. Duck on kick." },
          ];

  const mix = [
    { layer: "Kick", chain: "Kick 3 → Logic Channel EQ → Kilohearts Distortion → Logic Clip Distortion / soft clip → FabFilter Pro-C (4:1, atk 8–20 ms)." },
    { layer: "Bass", chain: "Serum → Channel EQ (HP 30, LP 180) → Pro-C sidechain from kick. Mono." },
    { layer: "Leads", chain: "Serum → Pro-Q scoop 250–400 Hz → Kilohearts Chorus optional → delay on send, not insert." },
    { layer: "Vox", chain: "Channel EQ HP 120 → Compressor → delay send. Center." },
    { layer: "FX", chain: "Wide. HP 200 Hz. Never in the kick's 50–100 Hz." },
  ];

  const master = [
    "Bus: FabFilter Pro-Q — tiny dip 300 Hz, air +1 dB at 12 kHz if it needs it.",
    "iZotope Ozone: imager stay near mono under 120 Hz. Maximizer last, or skip it.",
    "Logic Adaptive Limiter on Stereo Out, 0.3–1 dB of gain reduction. If it pumps, you over-limited.",
    "Reference a " + artist.name + " track in the same key. Match punch, not loudness first.",
  ];

  return { idea, build, instruments, mix, master };
}
