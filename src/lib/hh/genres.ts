/**
 * The ten hardstyle lanes the analyser scores a track against.
 *
 * Every profile carries a hand-encoded sonic target: BPM window, spectral
 * balance (dB relative to the loudest band), integrated loudness, kick tail
 * length as a share of the beat, crest factor and stereo width. Those numbers
 * are what a typical club master in that lane lands on — they are references,
 * not laws. The 50 tracks per lane live in `refs.ts`.
 */

export type HhGenreId =
  | "early"
  | "classic"
  | "euphoric"
  | "raw"
  | "xtra-raw"
  | "rawphoric"
  | "psy"
  | "hardcore"
  | "uptempo"
  | "frenchcore";

export const HH_GENRE_IDS: HhGenreId[] = [
  "early",
  "classic",
  "euphoric",
  "raw",
  "xtra-raw",
  "rawphoric",
  "psy",
  "hardcore",
  "uptempo",
  "frenchcore",
];

/** Six-band balance, dB relative to the loudest band (always 0 somewhere). */
export type BandTarget = {
  sub: number; // 20–60 Hz
  low: number; // 60–150 Hz  (kick punch, reverse bass body)
  lowMid: number; // 150–400 Hz
  mid: number; // 400–2000 Hz
  highMid: number; // 2–6 kHz
  high: number; // 6–20 kHz
};

export type GenreTargets = {
  bpm: [number, number];
  bands: BandTarget;
  /** Integrated LUFS window of a finished club master. */
  lufs: [number, number];
  /** Kick low-end tail length as a fraction of one beat. */
  kickTail: [number, number];
  /** Peak-to-RMS in dB of the loudest sections. */
  crest: [number, number];
  /** Side/mid energy in dB (more negative = narrower). */
  width: [number, number];
  /** Typical kick fundamental in Hz for the tail. */
  kickHz: [number, number];
};

export type SectionTemplate = {
  kind: "intro" | "break" | "build" | "drop" | "outro" | "mid";
  label: string;
  bars: number;
  do: string;
};

export type HhGenre = {
  id: HhGenreId;
  label: string;
  aka: string;
  years: string;
  bpm: number;
  summary: string;
  dna: string[];
  kick: string;
  lead: string;
  bass: string;
  arrangement: string;
  listenFor: string[];
  artists: string[];
  labels: string[];
  events: string[];
  targets: GenreTargets;
  /** Default arrangement the generator starts from. */
  template: SectionTemplate[];
};

const t = (kind: SectionTemplate["kind"], label: string, bars: number, action: string): SectionTemplate => ({
  kind,
  label,
  bars,
  do: action,
});

export const HH_GENRES: HhGenre[] = [
  {
    id: "early",
    label: "Early hardstyle",
    aka: "Old-school, reverse bass era",
    years: "2002–2006",
    bpm: 145,
    summary:
      "Born out of hard trance and hard house in the Netherlands and Italy. Short, dry kicks with a reverse bass between them, tribal percussion, pitched screeches, a lot of sampled vocals and very little melody. The groove lives in the off-beat.",
    dna: [
      "Reverse bass on every off-beat (the 'oomph' before the kick)",
      "Short, punchy kick with almost no tuned tail",
      "Tribal toms and tight 16th hats",
      "Screech/pitch-shifted hoovers instead of melodic leads",
      "Shouted or sampled vocal hooks",
      "140–150 BPM, DJ-friendly 16-bar phrases",
    ],
    kick: "Dry and clicky. Punch around 80–120 Hz, a short 909-style body, tail no longer than an 8th note so the reverse bass has room. Distortion is mild — overdrive rather than a wall of clipping.",
    lead: "Screeches: a pitch-shifted, ring-modded hoover or a Virus/Nord-style saw run through a phaser. Melody is a two-note riff, not a chord progression.",
    bass: "Reverse bass is the signature: a reversed, saturated low sine/saw hit that swells INTO the next kick. Sits at the same pitch as the kick tail, usually 45–55 Hz.",
    arrangement: "DJ tool structure. 16-bar intro of kick + hats, a 16–32 bar break with the screech or vocal, a short build, then the groove drop. Two drops, both mostly the same. Outro is a kick-only DJ tail.",
    listenFor: [
      "The gap between kick and reverse bass — early tracks leave air there",
      "How the screech is the hook, not a chord progression",
      "Percussion doing the work a melody does later on",
    ],
    artists: ["The Prophet", "DJ Zany", "Deepack", "Showtek", "Technoboy", "DJ Isaac", "Donkey Rollers", "Alpha Twins", "Pavo", "DJ Luna"],
    labels: ["Scantraxx", "Fusion Records", "Dutch Master Works", "Titanic Records", "Blutonium"],
    events: ["Qlimax (early editions)", "Defqon.1 2003–2006", "Hardstyle Nation", "Decibel"],
    targets: {
      bpm: [138, 150],
      bands: { sub: -9, low: 0, lowMid: -7, mid: -10, highMid: -13, high: -22 },
      lufs: [-9, -6.5],
      kickTail: [0.2, 0.45],
      crest: [9, 13],
      width: [-10, -5],
      kickHz: [48, 62],
    },
    template: [
      t("intro", "Kick intro", 16, "Kick and hats only, reverse bass enters on bar 9. Keep it flat for DJs."),
      t("intro", "Groove in", 16, "Add toms and a filtered screech. First vocal shout on bar 25."),
      t("break", "Break", 16, "Kill the kick. Screech riff and vocal on a pad, reverb tail on the last hit."),
      t("build", "Build", 8, "Snare roll doubling every 2 bars, screech pitch rising, white-noise riser."),
      t("drop", "Drop 1", 32, "Kick + reverse bass + screech. Vary the screech every 8 bars, drop out the hats bar 16."),
      t("mid", "Mid", 16, "Kick and reverse bass with a new percussion loop. Vocal chops on the off-beats."),
      t("break", "Break 2", 16, "Same riff, new pitch or new sample. Shorter than the first break."),
      t("build", "Build 2", 8, "Reverse the riser from build 1, add a pitch-up on the kick."),
      t("drop", "Drop 2", 32, "Full groove. Add a second screech layer an octave up for bars 17–32."),
      t("outro", "Outro", 16, "Strip back to kick + hats over 16 bars for the mix-out."),
    ],
  },
  {
    id: "classic",
    label: "Classic / nu-style",
    aka: "Nu-style, melodic hardstyle, 2008 sound",
    years: "2007–2012",
    bpm: 150,
    summary:
      "The sound that took hardstyle to stadiums. The kick grew a long, tuned tail, the reverse bass mostly disappeared, and melodies took over: big detuned saw leads, piano breaks, and the pitched 'climax' kick. Headhunterz, Wildstylez, Noisecontrollers and Brennan Heart defined it.",
    dna: [
      "Tuned kick tail that fills the whole beat",
      "Melodic supersaw lead as the main hook",
      "Emotional piano / pad breakdown with a spoken or sung vocal",
      "Pitched climax kick (kick follows the melody)",
      "Classic 32-bar break + 16-bar build + 32-bar drop",
      "150 BPM almost universally",
    ],
    kick: "Punch + tail. A 10–20 ms transient, a short mid-range 'tok' around 150–250 Hz, then a saturated tail tuned to the key (usually F1–A1). The tail is a distorted sine or triangle with a slow pitch drop.",
    lead: "Detuned saws (7 voices), a bit of pitch-bend at the start of each phrase, big hall reverb and a ping-pong delay. Voiced in octaves with a lower saw an octave down.",
    bass: "Mostly the kick tail itself. Some tracks keep a subtle off-beat bass or a sub that ducks the kick.",
    arrangement: "The formula: intro (32) → break (32, melody + vocal) → build (16) → drop (32) → mid (16, climax kick or vocal) → break 2 → build → drop 2 → outro. Often 5–6 minutes long.",
    listenFor: [
      "How the melody in the break is the same one played by the lead in the drop",
      "The climax: kick pitches follow the melody, no lead on top",
      "Tail pitch matching the root note of the key",
    ],
    artists: ["Headhunterz", "Wildstylez", "Noisecontrollers", "Brennan Heart", "Zatox", "Coone", "D-Block & S-te-Fan", "Frontliner", "The Pitcher", "Alpha²"],
    labels: ["Scantraxx", "Q-dance Records", "Dirty Workz", "Fusion", "Digital Age"],
    events: ["Defqon.1", "Qlimax", "In Qontrol", "Hard Bass", "Decibel"],
    targets: {
      bpm: [148, 152],
      bands: { sub: -6, low: 0, lowMid: -7, mid: -9, highMid: -12, high: -20 },
      lufs: [-8.5, -6],
      kickTail: [0.55, 0.9],
      crest: [8, 12],
      width: [-8, -3],
      kickHz: [42, 56],
    },
    template: [
      t("intro", "Intro", 32, "Kick + hats for 16, filtered lead motif in for bars 17–32."),
      t("break", "Break", 32, "Piano or pad plays the melody, vocal enters bar 9. Reverb swells over the last 4 bars."),
      t("build", "Build", 16, "Snare rolls from 4ths to 16ths, lead comes in dry, riser and pitch-up on the kick from bar 13."),
      t("drop", "Drop 1", 32, "Kick + supersaw lead playing the break melody. Bar 17 lift the lead an octave or add the counter-melody."),
      t("mid", "Climax", 16, "Pitched kick playing the melody, no lead. Vocal ad-lib on top."),
      t("break", "Break 2", 16, "Half-length break. Piano only, vocal answer."),
      t("build", "Build 2", 16, "Reuse build 1 but drop the kick on the last 4 bars for a silence."),
      t("drop", "Drop 2", 32, "Full drop with the extra lead layer throughout. Final 8 bars strip to kick + vocal."),
      t("outro", "Outro", 32, "Lead fades out by bar 8, kick and hats hold for the DJ."),
    ],
  },
  {
    id: "euphoric",
    label: "Euphoric hardstyle",
    aka: "Melodic hardstyle, festival hardstyle",
    years: "2012–now",
    bpm: 150,
    summary:
      "The bright, vocal-driven modern branch. Cleaner kicks with a long controlled tail, layered pop-style vocals, huge chord stabs, and more pop song structure (verse/chorus feel inside the hardstyle map). Da Tweekaz, Sub Zero Project, Coone, Brennan Heart, D-Block & S-te-Fan, Sound Rush.",
    dna: [
      "Polished kick: strong sub, tamed mids, tail sits under the lead",
      "Layered lead: supersaw + pluck + octave layer, often with vocal chops",
      "Sung vocal (frequently a full topline) in break and drop",
      "Big chord progressions (vi–IV–I–V and friends)",
      "Sidechain pumping everything to the kick",
      "Radio-length edits (3:00–4:00) alongside extended mixes",
    ],
    kick: "Sub-heavy and clean. Tail is tuned, long and controlled with a multiband compressor; punch is tight and the 'tok' is filtered so the vocal sits in front. Often two kicks: a melodic 'soft' kick for pop parts and the full kick for the drop.",
    lead: "Wide, layered, bright: 2–3 supersaw layers, a pluck for the attack, an octave-up layer for air. High-pass at 250–300 Hz so the kick owns the low end. Vocal chops doubled with the lead melody are common.",
    bass: "Sub under the tail in some tracks; most keep the kick tail as the bass and fill the space with a sidechained pad.",
    arrangement: "Pop-influenced: intro → verse-style break with vocal → build → drop (chorus melody) → second verse/bridge → build → final drop, often shorter mids. The build is a real crescendo — drums drop out, vocal rises, snare roll + riser.",
    listenFor: [
      "The vocal is the hook; the lead usually doubles it",
      "How clean the kick stays under everything (multiband control on the tail)",
      "Chord changes inside the drop — euphoric drops move harmonically",
    ],
    artists: ["Da Tweekaz", "Sub Zero Project", "Coone", "Brennan Heart", "D-Block & S-te-Fan", "Sound Rush", "Atmozfears", "Demi Kanon", "Hard Driver", "Refuzion"],
    labels: ["Dirty Workz", "Scantraxx", "Q-dance Records", "Art of Creation", "Roughstate (melodic side)"],
    events: ["Defqon.1", "Qlimax", "Intents Festival", "Reverze", "Tomorrowland Q-dance stage"],
    targets: {
      bpm: [148, 152],
      bands: { sub: -3, low: 0, lowMid: -9, mid: -9, highMid: -11, high: -18 },
      lufs: [-8, -5.5],
      kickTail: [0.6, 0.95],
      crest: [7.5, 11],
      width: [-6, -1],
      kickHz: [40, 52],
    },
    template: [
      t("intro", "Intro", 16, "Kick + hats + a filtered vocal chop. Keep it mixable."),
      t("break", "Verse", 32, "Chords + vocal verse, no kick. Pre-chorus from bar 25 with a pluck arp."),
      t("build", "Build", 16, "Drums out, vocal rises, snare roll 8th→16th→32nd, riser, pitch-up kick last 4 bars."),
      t("drop", "Drop 1", 32, "Chorus melody on the lead + vocal hook. Bar 17 second lead layer and chord change."),
      t("mid", "Bridge", 16, "Soft kick or half-time feel with vocal chops. Filter sweep back in."),
      t("break", "Verse 2", 16, "Second verse, half length, add a counter-melody."),
      t("build", "Build 2", 16, "Bigger than build 1: choir layer, longer riser, snare goes to 64ths."),
      t("drop", "Drop 2", 32, "Final chorus with octave-up layer and vocal ad-libs. Last 8 bars: vocal + kick only."),
      t("outro", "Outro", 16, "Chords fade, kick holds 16 bars."),
    ],
  },
  {
    id: "raw",
    label: "Raw hardstyle",
    aka: "Rawstyle",
    years: "2011–now",
    bpm: 155,
    summary:
      "Darker, heavier, more distorted. The kick is the instrument: gritty mid-range tails, 'punch-tok-tail' at full distortion, zaag (saw) kicks, and aggressive screeches. Less sung vocal, more spoken/shouted samples. Radical Redemption, Warface, Delete, Digital Punk, Ran-D, B-Front, Rebelion.",
    dna: [
      "Distorted mid-heavy kick tail (200–600 Hz grit)",
      "Screeches and 'zaag' leads as the hook",
      "Dark minor chord stabs, often only one or two chords",
      "Spoken/shouted samples, movie quotes",
      "Kick variations every 4–8 bars (rolls, pitch-ups, tail cuts)",
      "150–160 BPM",
    ],
    kick: "The whole track. Punch at 60–100 Hz, a distorted mid layer at 200–800 Hz (this is the raw 'tok'), tail saturated with clipping and multiband distortion, sometimes a 'zaag' saw layer on top. Tuned, but the distortion is the point.",
    lead: "Screech: Serum saw through comb/formant filters, pitch-bent, ring-modded, then distorted and phased. Rawphoric-style melodic leads appear in the break but the drop is usually screech-led.",
    bass: "The kick tail plus, in many tracks, a separate 'tail' layer or a reverse-bass throwback in the mid section.",
    arrangement: "Intro (16–32) → break with atmosphere + sample (32) → build (16) → drop (32, screech-led) → mid (16, kick roll / different kick) → break 2 → build → drop 2 → outro. Kick edits are the transitions.",
    listenFor: [
      "The mid-range of the kick — raw tails have a saturated 300–500 Hz body",
      "Kick edits: rolls, stutters, tail cuts every 8 bars",
      "Screech phrasing that follows the kick rhythm instead of a melody",
    ],
    artists: ["Radical Redemption", "Warface", "Delete", "Digital Punk", "Ran-D", "B-Front", "Rebelion", "Adaro", "E-Force", "Phuture Noize"],
    labels: ["Roughstate", "Minus is More", "Gearbox Digital", "End of Line", "Fusion", "Nightbreed"],
    events: ["Defqon.1 RED", "Supremacy", "Shockerz", "Hard Bass", "Rebirth"],
    targets: {
      bpm: [150, 160],
      bands: { sub: -7, low: 0, lowMid: -4, mid: -6, highMid: -10, high: -19 },
      lufs: [-7.5, -5],
      kickTail: [0.6, 0.95],
      crest: [7, 10.5],
      width: [-9, -4],
      kickHz: [44, 58],
    },
    template: [
      t("intro", "Intro", 32, "Kick + hats, a dark pad, a sample cut in at bar 17. Kick edit on bar 32."),
      t("break", "Break", 32, "Atmosphere + chord stabs + sample. Screech teased, filtered, in the last 8."),
      t("build", "Build", 16, "Snare rolls, kick rolls on 16ths from bar 9, screech pitch rises, silence on the last beat."),
      t("drop", "Drop 1", 32, "Full kick + screech riff. Tail cut on every 8th bar, kick roll into bar 17."),
      t("mid", "Mid", 16, "Kick variation: reverse bass throwback or half-time kick with a new sample."),
      t("break", "Break 2", 16, "Short, darker. New chord stab, same sample pitched down."),
      t("build", "Build 2", 16, "Faster kick rolls, screech doubled an octave up, riser + impact."),
      t("drop", "Drop 2", 32, "Screech + zaag layer. Bars 25–32 strip to kick rolls only."),
      t("outro", "Outro", 16, "Kick + hats. Last kick edit on bar 8."),
    ],
  },
  {
    id: "xtra-raw",
    label: "Xtra raw",
    aka: "Extra raw, xtra-raw, 'ugly' hardstyle",
    years: "2016–now",
    bpm: 160,
    summary:
      "Raw pushed to the edge: faster, noisier, longer distorted kicks, screeches on top of screeches. Borrows from uptempo hardcore and industrial. Sub Sonik, Killshot, Mutilator, Malice, Riot Shift, Level One, Deadly Guns (crossover), Warface's harder material.",
    dna: [
      "Faster (158–165), often with uptempo-style kick rolls",
      "Extremely distorted, long tails with heavy mid-range",
      "Screech stacks, pitch-bent 'wobble' screeches",
      "Aggressive samples, shouts, sirens",
      "Minimal harmony — one chord or none",
      "Kick edits every 2–4 bars in the drop",
    ],
    kick: "Longest and dirtiest tail in hardstyle. Multiple distortion stages, resonant EQ boosts around 300–600 Hz, a clipped sub. Often two kicks: a 'clean' punch and a fully distorted one that alternate.",
    lead: "Screeches with pitch envelopes and formant filters, layered 2–3 deep, plus a 'zaag' saw layer through hard clipping. Usually plays a rhythm rather than a melody.",
    bass: "The kick. Some tracks add a sub sine tuned to the tail.",
    arrangement: "Faster turnover: 16-bar intro, 16–32 break, short build, 32 drop full of kick edits, mid with a different kick, break, drop 2. Drops feel like a DJ set rather than a song.",
    listenFor: [
      "How many kick variations there are in one drop",
      "The grit in 300–800 Hz that separates it from raw",
      "Screeches used as percussion",
    ],
    artists: ["Sub Sonik", "Killshot", "Mutilator", "Malice", "Riot Shift", "Level One", "Chapter V", "Vasto", "Rooler", "Warface"],
    labels: ["Gearbox Digital", "Roughstate", "Minus is More", "Nightbreed", "Dirty Workz (Raw)"],
    events: ["Defqon.1 RED/BLACK", "Shockerz", "Rebirth", "Sinners", "Gearbox Live"],
    targets: {
      bpm: [156, 168],
      bands: { sub: -8, low: 0, lowMid: -2, mid: -4, highMid: -9, high: -18 },
      lufs: [-7, -4.5],
      kickTail: [0.7, 1.0],
      crest: [6.5, 9.5],
      width: [-10, -5],
      kickHz: [46, 62],
    },
    template: [
      t("intro", "Intro", 16, "Kick + sample + industrial noise. Kick edit every 4 bars."),
      t("break", "Break", 16, "Sample and noise texture, screech pitch-bends, no chord."),
      t("build", "Build", 8, "Kick rolls 8ths → 16ths → 32nds, screech siren rising."),
      t("drop", "Drop 1", 32, "Distorted kick + screech stack. Edit every 2 bars: roll, cut, pitch-up, reverse."),
      t("mid", "Mid", 16, "Switch to the clean punch kick with a half-time screech."),
      t("break", "Break 2", 16, "New shout sample, screech wobble, riser starts early."),
      t("build", "Build 2", 8, "Kick rolls only, then silence for 1 beat."),
      t("drop", "Drop 2", 32, "Both kicks alternating every 4 bars, screech stack + zaag."),
      t("outro", "Outro", 16, "Kick + noise. Cut to nothing on bar 16 or fade the kick."),
    ],
  },
  {
    id: "rawphoric",
    label: "Rawphoric",
    aka: "Melodic raw, raw with feels",
    years: "2015–now",
    bpm: 155,
    summary:
      "Raw kicks under euphoric melodies. The break is emotional (piano, vocal, big chords), the drop is a raw kick carrying a melodic lead. Phuture Noize, B-Front, Warface's melodic side, Rebelion (melodic), Aftershock, Sub Sonik's softer work, Regain, Adjuzt.",
    dna: [
      "Raw-style distorted kick with a controlled tail",
      "Full melodic lead (supersaw/pluck) in the drop, not just screech",
      "Emotional chord progressions and vocals in breaks",
      "Screech used as a counter-layer to the melody",
      "Alternating 'melodic drop' and 'raw drop' in one track",
      "153–158 BPM",
    ],
    kick: "Raw tail but cleaner mids than pure raw so the lead has space: distorted tail, multiband-compressed, 300–500 Hz dipped 2–3 dB relative to raw.",
    lead: "Euphoric-style layered supersaw with a raw twist — a bit of distortion, a screech layer doubling the melody an octave up.",
    bass: "Kick tail. Occasionally a low sub layer in the melodic drop.",
    arrangement: "Break-heavy: long melodic break (32), build, melodic drop (32), mid section with a raw kick roll, raw break, raw drop with screech, or the same melody with a heavier kick.",
    listenFor: [
      "Two drops that answer each other: melodic then raw",
      "How the kick dips out of the lead's range in the melodic drop",
      "Screech doubling the melody",
    ],
    artists: ["Phuture Noize", "B-Front", "Rebelion", "Aftershock", "Regain", "Adjuzt", "Warface", "Sub Sonik", "Devin Wild", "Vertile"],
    labels: ["Roughstate", "Q-dance Records", "Scantraxx", "Art of Creation", "Nightbreed"],
    events: ["Defqon.1", "Qlimax", "Supremacy", "Intents"],
    targets: {
      bpm: [152, 158],
      bands: { sub: -6, low: 0, lowMid: -6, mid: -7, highMid: -10, high: -18 },
      lufs: [-7.5, -5.5],
      kickTail: [0.6, 0.95],
      crest: [7, 10.5],
      width: [-7, -2],
      kickHz: [42, 56],
    },
    template: [
      t("intro", "Intro", 32, "Kick + hats, a filtered piano motif, sample at bar 17."),
      t("break", "Melodic break", 32, "Piano + pad + vocal or lead melody. Bar 25: chords go big, choir layer."),
      t("build", "Build", 16, "Lead comes in on top of a snare roll, riser, kick rolls in the last 4 bars."),
      t("drop", "Melodic drop", 32, "Raw kick + full lead playing the break melody. Screech layer bar 17."),
      t("mid", "Mid", 16, "Kick roll section, half-time, pitched kick playing the melody."),
      t("break", "Raw break", 16, "Dark version: same chords, screech teased, sample."),
      t("build", "Build 2", 16, "Kick rolls + snare, lead an octave up for the last 8 bars."),
      t("drop", "Raw drop", 32, "Screech leads, melody answers on the off-phrases. Kick edits every 8 bars."),
      t("outro", "Outro", 16, "Piano motif returns over the kick, fade."),
    ],
  },
  {
    id: "psy",
    label: "Psystyle",
    aka: "Psy-hardstyle, psy-trance hardstyle",
    years: "2016–now",
    bpm: 150,
    summary:
      "Hardstyle kicks with psytrance's rolling 16th-note bass, acid lines and FX. The kick is short and punchy so the psy bass can roll underneath; leads are squelchy 303-style or airy psy plucks. Sub Zero Project, Wasted Penguinz (crossover), Zatox's psy work, Mandy, Sound Rush (psy tracks), Keltek.",
    dna: [
      "Rolling 16th psy bass between short kicks",
      "Acid / 303 lines and psy FX (sweeps, zaps, reverse cymbals)",
      "Kick is punchier and shorter than classic hardstyle",
      "Hypnotic builds with filter sweeps",
      "Tribal / ethnic samples",
      "148–152 BPM",
    ],
    kick: "Shorter, punchier tail (like early hardstyle but cleaner) so the bass line can play three 16ths between kicks. Tuned to the bass note. Sub-heavy and tight.",
    lead: "Psy plucks with resonant filters, acid 303 lines, zaps and FM stabs. Melody often modal (Phrygian, harmonic minor).",
    bass: "The star: a saw or square through a low-pass with a short amp envelope, playing the 16ths after each kick (kick–bass–bass–bass). Sidechained to the kick, mono, 45–60 Hz fundamental.",
    arrangement: "Hypnotic: long intros with the bass rolling, break with psy FX and a lead motif, build with the filter opening, drop with the bass line and lead. Fewer big vocal breaks.",
    listenFor: [
      "The rolling bass — it defines the groove",
      "Kick tail length: it ends before the first bass 16th",
      "Acid resonance and modal melodies",
    ],
    artists: ["Sub Zero Project", "Wasted Penguinz", "Zatox", "Mandy", "Sound Rush", "Keltek", "Vertile", "Toneshifterz", "Code Black", "Adrenalize"],
    labels: ["Dirty Workz", "Scantraxx", "Q-dance Records", "WE R", "Art of Creation"],
    events: ["Defqon.1", "Qlimax", "Intents", "Decibel Outdoor"],
    targets: {
      bpm: [146, 154],
      bands: { sub: -5, low: 0, lowMid: -9, mid: -9, highMid: -11, high: -17 },
      lufs: [-8.5, -6],
      kickTail: [0.2, 0.45],
      crest: [8, 12],
      width: [-8, -2],
      kickHz: [44, 56],
    },
    template: [
      t("intro", "Intro", 32, "Kick + rolling bass with the filter half closed. Hats and psy FX build over 32 bars."),
      t("break", "Break", 32, "Bass out, lead motif with acid sweeps and ethnic sample. Reverse cymbals into the build."),
      t("build", "Build", 16, "Bass returns filtered and opens over 16 bars, snare roll, zaps."),
      t("drop", "Drop 1", 32, "Kick + full bass + lead. Bar 17: acid line answers the lead."),
      t("mid", "Mid", 16, "Bass alone with FX, lead filtered out, tribal percussion."),
      t("break", "Break 2", 16, "Modal chord pad, FM stabs, riser."),
      t("build", "Build 2", 16, "Filter opens on the bass again, kick pitch-ups in the last 4."),
      t("drop", "Drop 2", 32, "Full drop with the lead an octave up for bars 17–32."),
      t("outro", "Outro", 32, "Bass rolls out, filter closing over 32 bars."),
    ],
  },
  {
    id: "hardcore",
    label: "Hardcore",
    aka: "Mainstream hardcore, millennium hardcore",
    years: "2000–now",
    bpm: 175,
    summary:
      "The heavier, faster sibling. 170–185 BPM, a distorted kick as the bass, big screeches and hoovers, melodic breaks in the mainstream branch. Angerfist, Partyraiser (harder), Miss K8, Dr. Peacock (frenchcore crossover), Tha Playah, Evil Activities, Nosferatu, Neophyte, N-Vitral.",
    dna: [
      "Distorted 909-derived kick at 170–185 BPM",
      "Kick is the bass — no separate bassline",
      "Screeches, hoovers and pitched mentasm stabs",
      "Melodic 'mainstream' breaks with piano and strings",
      "Aggressive vocal samples",
      "DJ-tool phrasing, long intros",
    ],
    kick: "909 kick heavily distorted so the harmonics fill 100–1000 Hz. Shorter tail than hardstyle because the tempo is faster; punch is aggressive. Often layered with a clean sub kick.",
    lead: "Hoovers, mentasm stabs, screeches and — in mainstream — supersaw leads. Melodies are simpler and more anthemic than hardstyle.",
    bass: "The kick. Some tracks add an off-beat bass stab on the 'and'.",
    arrangement: "Intro (32) → break (32) → build (16) → drop (32) → mid → break → drop → outro. Similar to hardstyle but everything at 175, so sections feel shorter in time.",
    listenFor: [
      "The kick harmonics carrying the whole low-mid",
      "Hoover chords in the break",
      "How little else is in the drop besides kick + one lead",
    ],
    artists: ["Angerfist", "Miss K8", "Tha Playah", "Evil Activities", "Nosferatu", "Neophyte", "N-Vitral", "Mad Dog", "Korsakoff", "Destructive Tendencies"],
    labels: ["Masters of Hardcore", "Neophyte Records", "Cloudhead", "Traxtorm", "Enzyme"],
    events: ["Masters of Hardcore", "Dominator", "Thunderdome", "Syndicate", "Defqon.1 BLACK"],
    targets: {
      bpm: [168, 188],
      bands: { sub: -9, low: 0, lowMid: -3, mid: -5, highMid: -10, high: -19 },
      lufs: [-7, -4.5],
      kickTail: [0.5, 0.85],
      crest: [6.5, 9.5],
      width: [-9, -4],
      kickHz: [50, 66],
    },
    template: [
      t("intro", "Intro", 32, "Kick + hats + a hoover stab every 4 bars. Sample at bar 17."),
      t("break", "Break", 32, "Piano/strings melody with the sample, hoover chords. Reverb wash into the build."),
      t("build", "Build", 16, "Snare roll, kick rolls, lead on top, riser + siren."),
      t("drop", "Drop 1", 32, "Kick + lead melody. Bar 17: add the hoover counter-riff."),
      t("mid", "Mid", 16, "Kick only with the vocal sample chopped rhythmically."),
      t("break", "Break 2", 16, "Short melodic break, lead an octave up."),
      t("build", "Build 2", 16, "Kick rolls 8th→16th→32nd, cut to silence for 2 beats."),
      t("drop", "Drop 2", 32, "Full drop, mentasm stab layer bar 17."),
      t("outro", "Outro", 32, "Kick + hats, hoover stab fades."),
    ],
  },
  {
    id: "uptempo",
    label: "Uptempo hardcore",
    aka: "Uptempo, UPTEMPO",
    years: "2015–now",
    bpm: 210,
    summary:
      "Fastest and most extreme mainstream branch: 190–230 BPM, kick rolls everywhere, sub-heavy distorted kicks, tempo shifts inside a track, chopped vocals and memes. Partyraiser, Sjammienators, Dr. Peacock (crossover), Spitnoise, F.Noize, Barber, Deadly Guns, Bloodlust, Soulblast, The Dark Horror.",
    dna: [
      "190–230 BPM, often tempo changes mid-track",
      "Kick rolls (8th, 16th, triplet) as the main rhythm device",
      "Heavily distorted kick with a big sub",
      "Screeches, sirens, chopped vocals, 'uptempo tail' edits",
      "Breaks with melodies from other genres (pop, movie themes)",
      "Drops are short and frequent",
    ],
    kick: "Very short tail (the tempo forces it), sub-heavy, distorted. Rolls are built by pitching and shortening the same kick. Often two kicks: a sub 'punch' and a distorted 'roll' kick.",
    lead: "Screeches and sirens, vocal chops, sometimes melodic saw leads borrowed from euphoric.",
    bass: "The kick. Uptempo tails are tiny, so a sub sine may be added under rolls.",
    arrangement: "Short sections: 16-bar intro, 16 break, 8 build, 16–32 drop, tempo change, repeat. Kick rolls are the transitions.",
    listenFor: [
      "The roll patterns — how they accelerate into a drop",
      "The sub staying clean under the distortion",
      "How short the kick tail is at this tempo",
    ],
    artists: ["Partyraiser", "Sjammienators", "Spitnoise", "F.Noize", "Barber", "Deadly Guns", "Bloodlust", "Soulblast", "The Dark Horror", "Dr. Peacock"],
    labels: ["Uptempo is the Tempo", "Peacock Records", "Masters of Hardcore", "Enzyme", "Hard Effect"],
    events: ["Uptempo is the Tempo", "Ground Zero", "Dominator", "Defqon.1 BLACK", "Masters of Hardcore"],
    targets: {
      bpm: [188, 235],
      bands: { sub: -5, low: 0, lowMid: -3, mid: -5, highMid: -10, high: -20 },
      lufs: [-6.5, -4],
      kickTail: [0.35, 0.7],
      crest: [6, 9],
      width: [-10, -5],
      kickHz: [48, 64],
    },
    template: [
      t("intro", "Intro", 16, "Kick + sample. Roll on every 4th bar."),
      t("break", "Break", 16, "Melody or vocal chop with sirens, no kick."),
      t("build", "Build", 8, "Kick rolls: 8ths → 16ths → triplets → 32nds, siren rising."),
      t("drop", "Drop 1", 32, "Kick + screech + rolls every 2 bars. Bar 17 roll pattern changes."),
      t("mid", "Tempo change", 16, "Drop to 150 or jump to 230 — half-time kick with the sample."),
      t("break", "Break 2", 16, "Different sample, vocal chops, sirens."),
      t("build", "Build 2", 8, "Fastest rolls, cut to silence for 1 bar."),
      t("drop", "Drop 2", 32, "Full roll drop at the top tempo. Bars 25–32 rolls only."),
      t("outro", "Outro", 16, "Kick + rolls fade or hard cut."),
    ],
  },
  {
    id: "frenchcore",
    label: "Frenchcore",
    aka: "French hardcore",
    years: "2005–now",
    bpm: 200,
    summary:
      "The French branch: 190–210 BPM, a bouncy off-beat bass (the 'frenchcore bounce'), melodic and often playful leads, big sing-along breaks, lots of pitched vocals. Dr. Peacock, Sefa, The Sickest Squad, Radium, Maissouille, Hyrule War, Mr. Ivex, Remzcore.",
    dna: [
      "Off-beat bass bounce between fast kicks (kick–bass–kick–bass)",
      "190–210 BPM",
      "Melodic, often major-key or modal leads",
      "Sung or pitched vocal hooks, folk/gypsy influences",
      "Shorter, punchy kick tuned with the bass",
      "Big anthemic breaks",
    ],
    kick: "Short, punchy, distorted but not muddy: it needs to leave room for the bass on the off-beat. Fundamental around 50–60 Hz, tail cut hard.",
    lead: "Supersaws and plucks playing folk-like melodies, accordion/violin samples, pitched vocals. Frenchcore leads are happier than raw or uptempo.",
    bass: "The bounce: a saturated square/saw hit on every off-beat, same pitch as the kick or a fifth up, short decay, sidechained.",
    arrangement: "Intro (16–32 with the bounce) → melodic break (32) with vocal → build (16) → drop (32) → mid with bounce only → break 2 → drop 2 → outro. Anthemic structure like classic hardstyle but faster.",
    listenFor: [
      "The bounce: off-beat bass locked with the kick",
      "Melodies you could sing on a festival field",
      "Kick tuned to the bass so the two read as one instrument",
    ],
    artists: ["Dr. Peacock", "Sefa", "The Sickest Squad", "Radium", "Maissouille", "Hyrule War", "Mr. Ivex", "Remzcore", "Pattern J", "Billx"],
    labels: ["Peacock Records", "Frenchcore SVR", "Psychik Genocide", "Audiogenic", "Frenchcore Family"],
    events: ["Frenchcore Familia", "Peacock in Concert", "Dominator", "Defqon.1 BLACK", "Harmony of Hardcore"],
    targets: {
      bpm: [188, 212],
      bands: { sub: -6, low: 0, lowMid: -5, mid: -7, highMid: -10, high: -18 },
      lufs: [-7, -4.5],
      kickTail: [0.3, 0.55],
      crest: [6.5, 9.5],
      width: [-8, -3],
      kickHz: [50, 64],
    },
    template: [
      t("intro", "Intro", 32, "Kick + bounce bass, hats in at bar 9, filtered lead at bar 17."),
      t("break", "Break", 32, "Melody on piano/accordion or vocal, chords, bounce out."),
      t("build", "Build", 16, "Snare rolls, lead comes in dry, bounce returns filtered, riser."),
      t("drop", "Drop 1", 32, "Kick + bounce + lead melody. Bar 17 vocal hook on top."),
      t("mid", "Mid", 16, "Kick + bounce only, vocal chops, a roll every 4 bars."),
      t("break", "Break 2", 16, "Half break: melody an octave up, choir layer."),
      t("build", "Build 2", 16, "Rolls + snare, silence on the last 2 beats."),
      t("drop", "Drop 2", 32, "Full drop with a counter-melody layer. Last 8: bounce + vocal."),
      t("outro", "Outro", 32, "Lead out, bounce + kick for the DJ."),
    ],
  },
];

export const HH_GENRE_BY_ID: Record<HhGenreId, HhGenre> = Object.fromEntries(
  HH_GENRES.map((g) => [g.id, g]),
) as Record<HhGenreId, HhGenre>;

export function hhGenre(id: HhGenreId): HhGenre {
  return HH_GENRE_BY_ID[id];
}
