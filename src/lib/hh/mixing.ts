/** Mixing & mastering guide: per element, easy vs hard, and the methods people use. */

export type Method = { name: string; who: string; how: string };

export type MixTopic = {
  id: string;
  title: string;
  goal: string;
  easy: string[];
  hard: string[];
  methods: Method[];
  numbers: string[];
};

export const MIX_TOPICS: MixTopic[] = [
  {
    id: "kick",
    title: "Kick",
    goal: "Punch you feel, a tail you can tune, mids that carry the track without turning to mud.",
    easy: [
      "Start from a kick sample you like in the lane. Tune it to your key by pitching the tail (not the punch) — check the tail note with the analyser.",
      "EQ: HP 30 Hz, +2 dB at 60–80 Hz (punch), +3 dB at 250 Hz (tok) if it feels hollow, LP 10 kHz on distorted layers.",
      "One compressor on the kick bus: 4:1, attack 10 ms, release 80 ms, 3 dB of gain reduction — evens out the tail.",
      "Multiband compressor with two bands: below 100 Hz slow, above fast. This is the single biggest 'pro kick' move.",
      "Mono. Always mono.",
    ],
    hard: [
      "Split into punch (0–40 ms), tok (40–120 ms, 150–600 Hz) and tail (rest) on three tracks. Process each: punch clean + clipped, tok distorted with a cab sim, tail synthesised in Serum/Kick 3 and distorted twice.",
      "Distortion chain on the tail: soft clip → tube saturation → multiband distortion on 150–600 Hz → LP 8 kHz → clipper. Level-match between stages so you hear tone, not loudness.",
      "Resample the whole kick to audio, then run the resonance suppressor (soothe/dynamic EQ) to notch the two or three ringing frequencies the distortion created.",
      "Make 3–4 variations (clean, dirty, short tail, pitch-up) and arrange them per 8 bars so the drop moves.",
      "Master-level check: the kick alone should read about -8 to -6 LUFS-short-term on the master limiter with 1 dB of gain reduction.",
    ],
    methods: [
      { name: "Sample + layer", who: "Most euphoric and classic producers", how: "Commercial kick pack punch + a tuned tail sample, crossfaded at 20–40 ms." },
      { name: "Synthesised (Kick 2/3, Serum, Operator)", who: "Raw, xtra raw, rawphoric", how: "Draw the pitch envelope, distort in stages, resample, repeat." },
      { name: "Reference kick as a starting point", who: "Everyone learning", how: "Analyse a reference track's drop; match the tail length and note with your own kick, then match the band balance with EQ." },
      { name: "Kick roll edits", who: "Raw, xtra raw, uptempo", how: "Slice the kick every 1/8, 1/16, triplet; pitch each slice up a semitone; use as transitions." },
    ],
    numbers: ["Tail = 60–95% of a beat in classic/raw; 20–45% in early and psy; 30–55% in frenchcore", "Tail note: F1 (43.65 Hz) to A1 (55 Hz) for hardstyle; slightly higher (50–64 Hz) at 175+ BPM", "Kick bus peak -3 dBFS before the master"],
  },
  {
    id: "bass",
    title: "Bass, reverse bass and sub",
    goal: "Only one thing owns 30–120 Hz at any moment.",
    easy: [
      "In classic/euphoric/raw the kick tail IS the bass. Don't add a sub under it — it fights.",
      "If you add a sub (psy, frenchcore, uptempo rolls), sidechain it to the kick with a fast release (30–60 ms) so it never overlaps the punch.",
      "Reverse bass: render a saw note, reverse it, fade in over its length, HP 40 Hz, saturate. Place it on the off-beat.",
    ],
    hard: [
      "Tune the sub/bass to the kick tail's exact frequency (analyser → kick note). If the kick is F1 at +14 cents, tune the bass +14 cents.",
      "Use a dynamic EQ on the bass at the kick's punch frequency (60–90 Hz) keyed to the kick — a mini sidechain that only removes overlap.",
      "Phase-align: nudge the bass sample so its first positive cycle lines up with the kick's tail cycle at the crossover point. Check with a correlation meter on the low band.",
    ],
    methods: [
      { name: "Kick as bass", who: "Classic, euphoric, raw, rawphoric, hardcore", how: "Long tuned tail; no separate bass channel." },
      { name: "Off-beat bass", who: "Early hardstyle, frenchcore, hard trance", how: "A hit on every 'and', same root as the kick or a fifth up." },
      { name: "Rolling 16ths", who: "Psystyle", how: "Kick–bass–bass–bass, short notes, sidechained." },
    ],
    numbers: ["Bass mono below 150 Hz", "Sub sine 3–6 dB under the kick's tail level"],
  },
  {
    id: "lead",
    title: "Leads and screeches",
    goal: "Big and wide without covering the kick's mid-range.",
    easy: [
      "HP the lead bus at 250–300 Hz (screeches 400 Hz).",
      "OTT at 20–30% on the lead bus, then a compressor 2:1 for glue.",
      "Sidechain the lead bus to the kick: 3–5 dB of dip, release 100–150 ms so it pumps in time.",
      "Cut 2 dB at 300–500 Hz on the lead — that is where the kick's tok lives.",
    ],
    hard: [
      "Three-layer lead (wide saw, narrow pluck, octave air), each with its own EQ so only one layer owns 1–3 kHz.",
      "Dynamic EQ on the lead at 60–150 Hz and at the kick's tok frequency, keyed to the kick — the lead moves out of the way only on kick hits.",
      "Mid/side: widen only above 500 Hz; mono the lead's low-mids. Check in mono that the melody still reads.",
      "Automate the lead's LP cutoff per 8 bars in the drop so bars 17–32 feel brighter than 1–16 without a level change.",
    ],
    methods: [
      { name: "Supersaw stack", who: "Classic, euphoric, rawphoric", how: "Serum/Spire/Sylenth ×3, octaves, chorus + hall reverb." },
      { name: "Screech rhythm", who: "Raw, xtra raw, hardcore", how: "One or two notes, comb/formant filter, phaser, pitch bends; the rhythm is the hook." },
      { name: "Vocal-doubled lead", who: "Euphoric", how: "Lead plays the vocal melody an octave up; vocal chops layered." },
      { name: "Acid / pluck", who: "Psy", how: "303-style resonant line + FM plucks, modal scales." },
    ],
    numbers: ["Lead bus peak -6 dBFS", "Lead sidechain dip 3–5 dB", "Lead HP 250–300 Hz"],
  },
  {
    id: "drums",
    title: "Claps, snares, hats and percussion",
    goal: "Top end that reads on a festival system, snare rolls that lift a build.",
    easy: [
      "Clap on beats 2 and 4 layered with a short snare; HP 200 Hz; a little room reverb.",
      "Hats: closed 1/16 pattern with a velocity accent on the off-beat 1/8; HP 500 Hz.",
      "Snare roll build: 1/4 → 1/8 → 1/16 → 1/32 over 16 bars, with a rising pitch and a reverb send opening up.",
    ],
    hard: [
      "Transient shaper on the clap (+attack) and on the hats (-sustain) so they cut through distorted kick mids.",
      "Sidechain the hats and percussion lightly (1–2 dB) to the kick so the groove breathes.",
      "Build with 3 roll layers (snare, clap, tom) each entering 4 bars apart; automate a HP on the kick during the last 8 bars so the roll takes over the low end, then slam the kick back at full.",
    ],
    methods: [
      { name: "909-style tops", who: "Early, classic", how: "Tight closed hats, tom rolls." },
      { name: "Minimal tops", who: "Raw, xtra raw", how: "Almost no hats in the drop; the kick edits are the rhythm." },
      { name: "Pop tops", who: "Euphoric", how: "Layered claps, shakers, crash on every 8 bars." },
    ],
    numbers: ["Clap peak -8 dBFS", "Hats -14 to -18 dBFS", "Snare roll climax at the lead level"],
  },
  {
    id: "vocal",
    title: "Vocals and samples",
    goal: "Intelligible in the break, sitting in front of the lead in the drop.",
    easy: [
      "HP 120–180 Hz, de-ess, compressor 4:1 with 6 dB of GR for spoken samples (they need to be flat and loud).",
      "Sung vocals: slight tuning, a doubler or short chorus, a 1/8 delay throw on the last word of each phrase.",
      "Sidechain the vocal reverb, not the vocal, to the kick.",
    ],
    hard: [
      "Parallel chain: a heavily compressed and saturated copy at -10 dB under the clean vocal for density in the drop.",
      "Dynamic EQ on the lead at the vocal's 2–4 kHz keyed from the vocal so the lead ducks only when the vocal sings.",
      "Chop the vocal to a 1/16 grid, re-pitch chops to the chord tones, and use them as a rhythmic layer that doubles the lead.",
    ],
    methods: [
      { name: "Spoken sample", who: "Early, raw, hardcore, uptempo", how: "Movie or speech sample, pitched down, delay throws." },
      { name: "Sung topline", who: "Euphoric, rawphoric, frenchcore", how: "Full verse/chorus recorded, tuned, layered." },
      { name: "Chops", who: "Euphoric, uptempo", how: "Vocal sliced into a melodic instrument." },
    ],
    numbers: ["Vocal peak -6 dBFS", "Spoken samples 2–3 dB above the lead"],
  },
  {
    id: "fx",
    title: "FX, risers and transitions",
    goal: "Every 8 bars something changes; every 32 bars something big happens.",
    easy: [
      "Crash on bar 1 of every section, reverse crash into it.",
      "Riser (white noise + band-pass sweep) over the last 8 bars of every build.",
      "Impact + sub drop on the first beat of the drop, then the kick.",
      "Kick edits every 8 bars in the drop: tail cut, pitch-up, one bar of rolls.",
    ],
    hard: [
      "Automate a HP on the whole mix (except the riser) in the last 4 bars of a build, then release it on the drop — the 'vacuum'.",
      "Sidechain the riser to a 1/8 pattern so it pulses in time.",
      "Reverse the drop's first beat (kick + lead) and place it as the last beat of the build.",
      "Tempo-synced delay throws on the last screech note before a break; automate feedback to 90% for one bar.",
    ],
    methods: [
      { name: "8-bar rule", who: "All lanes", how: "Something enters or leaves every 8 bars." },
      { name: "Kick edits as transitions", who: "Raw, xtra raw, uptempo", how: "Rolls, stutters, cuts instead of risers." },
      { name: "Silence before the drop", who: "Euphoric, rawphoric", how: "1–2 beats of nothing (or only the vocal) right before beat 1." },
    ],
    numbers: ["Riser peaks 3 dB under the lead", "Impact 1 beat long, HP 40 Hz"],
  },
  {
    id: "bus",
    title: "Bus structure and gain staging",
    goal: "A mix that hits the master at -6 dBFS peak with headroom for the limiter.",
    easy: [
      "Buses: Kick, Drums, Leads, Screech, Vocals, FX, Pads. Master.",
      "Kick bus at -3 dBFS peak. Everything else fits under it.",
      "One compressor per bus (2:1, slow attack) and a limiter only on the master.",
    ],
    hard: [
      "Parallel 'drop bus' with OTT + clipper at -10 dB fed by leads and screeches — instant density in the drop, automated off in breaks.",
      "Bus sidechains: Leads and Pads ducked from the Kick bus; FX ducked from Vocals.",
      "Gain-match every insert (A/B at equal loudness) so you don't mistake louder for better.",
    ],
    methods: [
      { name: "Top-down", who: "Experienced producers", how: "Master chain on from the start; mix into it." },
      { name: "Kick-first", who: "Hardstyle standard", how: "Kick set to -3 dBFS first, everything else mixed against it." },
    ],
    numbers: ["Master peak before limiter: -6 dBFS", "Bus peaks: kick -3, leads -6, vocals -6, drums -8"],
  },
  {
    id: "master",
    title: "Mastering",
    goal: "Loud, clean, translates from earbuds to a festival wall.",
    easy: [
      "Chain: EQ (HP 25 Hz, mono below 120 Hz) → gentle multiband (1 dB per band) → limiter (ceiling -0.3 dBTP).",
      "Target -6 to -7 LUFS integrated for hardstyle; -5 for raw and uptempo. Check with a LUFS meter.",
      "Reference two tracks from the lane at the same loudness and A/B the band balance with the analyser.",
    ],
    hard: [
      "Two-stage loudness: soft clipper 1–2 dB before the limiter, then the limiter for 3–4 dB. Clipping keeps the kick punch that a limiter alone would round off.",
      "Mid/side EQ: +1 dB high shelf on the sides at 8 kHz, HP the sides at 150 Hz, -1 dB at 300 Hz on the mid.",
      "Dynamic EQ at the kick's tok frequency on the master, 1 dB, fast — tames build-up when lead and kick both sit there.",
      "Check loudness range: LRA 4–7 LU is normal; under 3 means the breaks are as loud as the drops (turn them down 2–3 dB in the mix).",
      "True-peak ceiling -1 dBTP for streaming, -0.3 for club plays. Export both.",
    ],
    methods: [
      { name: "Limiter only", who: "Beginners, quick masters", how: "Pro-L/Ozone, aggressive style, push to -6 LUFS." },
      { name: "Clip + limit", who: "Raw, uptempo, hardcore", how: "Clipper takes the kick peaks, limiter the rest." },
      { name: "Multiband + limiter", who: "Euphoric, polished masters", how: "Multiband compressor balances, limiter finishes." },
      { name: "Send it out", who: "Label releases", how: "A mastering engineer with the lane's references. Give them -6 dBFS peak, no limiter, 24-bit." },
    ],
    numbers: ["Integrated: -6 to -7 LUFS (hardstyle), -5 to -6 (raw/uptempo/frenchcore)", "Short-term in the drop: -4 to -5 LUFS", "True peak: -0.3 dBTP club / -1 dBTP streaming", "Crest factor in drops: 7–11 dB"],
  },
];

export const MASTER_TARGETS = [
  { lane: "Early / psy", lufs: "-9 to -6.5", note: "More dynamic; the reverse bass or rolling bass needs air." },
  { lane: "Classic / euphoric / rawphoric", lufs: "-8 to -5.5", note: "Loud but clean; the vocal must stay in front." },
  { lane: "Raw / xtra raw / hardcore", lufs: "-7 to -4.5", note: "The kick tail is compressed to a wall; clipping is part of the sound." },
  { lane: "Uptempo / frenchcore", lufs: "-6.5 to -4", note: "Sub-heavy; watch true peaks on the rolls." },
];
