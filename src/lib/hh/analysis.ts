/**
 * Turns a TrackAnalysis into a report: which lanes it fits, what to fix,
 * easy and hard ways to fix it, and which of the user's plugins to reach for.
 */
import { BAND_KEYS, BAND_LABELS, hzToNote, type BandKey, type TrackAnalysis } from "./dsp";
import { HH_GENRES, type HhGenre, type HhGenreId } from "./genres";
import { closestRefs, type RefTrack } from "./refs";
import { pick, type DawId, type PluginRole } from "./plugins-kb";
import { DEFAULT_ANALYSIS, strictnessScale, type AnalysisPrefs } from "./customise";

export type FindingArea =
  | "tempo"
  | "kick"
  | "low"
  | "mids"
  | "highs"
  | "loudness"
  | "dynamics"
  | "stereo"
  | "key"
  | "structure";

export type Severity = "good" | "check" | "fix";

export type Finding = {
  id: string;
  area: FindingArea;
  severity: Severity;
  title: string;
  measured: string;
  target: string;
  detail: string;
  easy: string;
  hard: string;
  plugins: string[];
  serum?: string;
};

export type GenreMatch = { genre: HhGenreId; score: number; reasons: string[] };

export type Report = {
  fileName: string;
  createdAt: number;
  analysis: TrackAnalysis;
  matches: GenreMatch[];
  target: HhGenreId;
  targetMode: "auto" | "chosen";
  findings: Finding[];
  refs: RefTrack[];
  summary: string;
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const outside = (v: number, [lo, hi]: [number, number]) => (v < lo ? lo - v : v > hi ? v - hi : 0);

function bpmDistance(bpm: number, range: [number, number]): { d: number; used: number } {
  const cands = [bpm, bpm * 2, bpm / 2];
  let best = { d: Infinity, used: bpm };
  for (const c of cands) {
    const d = outside(c, range) + (c === bpm ? 0 : 2);
    if (d < best.d) best = { d, used: c };
  }
  return best;
}

export function matchGenres(a: TrackAnalysis, genres: HhGenre[] = HH_GENRES, weights = DEFAULT_ANALYSIS.weights): GenreMatch[] {
  const out: GenreMatch[] = [];
  for (const g of genres) {
    const t = g.targets;
    const reasons: string[] = [];
    let penalty = 0;
    let weight = 0;

    const bd = bpmDistance(a.bpm.value, t.bpm);
    const bpmPen = clamp01(bd.d / 14);
    penalty += bpmPen * weights.bpm;
    weight += weights.bpm;
    if (bd.d === 0) reasons.push(`tempo ${a.bpm.value} sits inside ${t.bpm[0]}–${t.bpm[1]}`);
    else if (bd.d < 6) reasons.push(`tempo close to the lane (${t.bpm[0]}–${t.bpm[1]})`);

    let bandDiff = 0;
    for (const k of BAND_KEYS) bandDiff += Math.abs(a.bands[k] - t.bands[k]);
    const bandPen = clamp01(bandDiff / 6 / 7);
    penalty += bandPen * weights.bands;
    weight += weights.bands;
    if (bandPen < 0.3) reasons.push("spectral balance matches");

    if (a.loudness.integrated > -60) {
      const lp = clamp01(outside(a.loudness.integrated, t.lufs) / 5);
      penalty += lp * weights.lufs;
      weight += weights.lufs;
      if (lp === 0) reasons.push("loudness in the lane's window");
    }

    if (a.kick.count > 8) {
      const kp = clamp01(outside(a.kick.tailBeats, t.kickTail) / 0.3);
      penalty += kp * weights.tail;
      weight += weights.tail;
      if (kp === 0) reasons.push("kick tail length fits");
      else if (kp < 0.5) reasons.push("kick tail close");
    }

    const cp = clamp01(outside(a.loudness.crest, t.crest) / 3);
    penalty += cp * weights.crest;
    weight += weights.crest;

    if (a.channels === 2) {
      const wp = clamp01(outside(a.stereo.sideMidDb, t.width) / 6);
      penalty += wp * weights.width;
      weight += weights.width;
    }

    const score = weight > 0 ? Math.round((1 - penalty / weight) * 100) : 0;
    out.push({ genre: g.id, score, reasons });
  }
  return out.sort((x, y) => y.score - x.score);
}

/* ------------------------------------------------------------------ */

const fmtDb = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)} dB`;

export type ReportOpts = {
  fileName: string;
  target?: HhGenreId | "auto";
  owned: string[];
  daw: DawId;
  /** lanes to score against (defaults to the built-in ten) */
  genres?: HhGenre[];
  prefs?: AnalysisPrefs;
  rolePins?: Partial<Record<PluginRole, string>>;
};

export function buildReport(a: TrackAnalysis, opts: ReportOpts): Report {
  const genres = opts.genres && opts.genres.length ? opts.genres : HH_GENRES;
  const prefs = opts.prefs ?? DEFAULT_ANALYSIS;
  const scale = strictnessScale(prefs.strictness);
  const matches = matchGenres(a, genres, prefs.weights);
  const wanted = opts.target && opts.target !== "auto" && genres.some((g) => g.id === opts.target) ? opts.target : null;
  const targetMode = wanted ? "chosen" : "auto";
  const target: HhGenreId = wanted ?? matches[0].genre;
  const g = genres.find((x) => x.id === target) ?? genres[0];
  const t = g.targets;
  const P = (role: Parameters<typeof pick>[0]) => pick(role, opts.owned, opts.daw, opts.rolePins);
  const f: Finding[] = [];
  // scaled tolerances: strict flags sooner, loose later
  const tol = (v: number) => v * scale;

  /* tempo */
  {
    const bd = bpmDistance(a.bpm.value, t.bpm);
    const inRange = bd.d === 0;
    f.push({
      id: "tempo",
      area: "tempo",
      severity: inRange ? "good" : bd.d < tol(5) ? "check" : "fix",
      title: inRange ? `Tempo fits ${g.label}` : `Tempo is off the ${g.label} window`,
      measured: `${a.bpm.value} BPM${a.bpm.confidence < 0.5 ? " (low confidence)" : ""}`,
      target: `${t.bpm[0]}–${t.bpm[1]} BPM`,
      detail: inRange
        ? `${a.bpm.value} BPM is a normal ${g.label} tempo.${a.bpm.alt.length ? ` Other candidates the detector saw: ${a.bpm.alt.join(", ")}.` : ""}`
        : `The detector reads ${a.bpm.value} BPM; ${g.label} usually runs ${t.bpm[0]}–${t.bpm[1]}. ${bd.used !== a.bpm.value ? `Counted at ${Math.round(bd.used)} it fits — check whether your kick pattern is half or double time.` : ""}`,
      easy: inRange ? "Nothing to do." : `Set the project tempo to ${Math.round((t.bpm[0] + t.bpm[1]) / 2)} and re-bounce; a hardstyle kick pattern at the lane tempo is most of the genre feel.`,
      hard: inRange
        ? "Try a tempo change section: drop to half-time for 16 bars in the mid, or jump +10 BPM for the final drop."
        : "Keep your tempo but change the target lane (a 200 BPM track is frenchcore or uptempo, not hardstyle). Re-run with that lane selected.",
      plugins: [],
    });
  }

  /* kick tail */
  if (a.kick.count > 8) {
    const tb = a.kick.tailBeats;
    const d = outside(tb, t.kickTail);
    const short = tb < t.kickTail[0];
    f.push({
      id: "kick-tail",
      area: "kick",
      severity: d === 0 ? "good" : d < tol(0.15) ? "check" : "fix",
      title: d === 0 ? "Kick tail length fits the lane" : short ? "Kick tail is short for this lane" : "Kick tail is long for this lane",
      measured: `${a.kick.tailMs} ms · ${Math.round(tb * 100)}% of a beat · consistency ${Math.round(a.kick.consistency * 100)}%`,
      target: `${Math.round(t.kickTail[0] * 100)}–${Math.round(t.kickTail[1] * 100)}% of a beat`,
      detail: `Measured from the low-band envelope (-12 dB from the punch) over the loudest kicks. ${g.kick}`,
      easy: short
        ? `Lengthen the tail's amp envelope (Kick 3 'length' or the sample's decay) so it fills ${Math.round(t.kickTail[0] * 100)}–${Math.round(t.kickTail[1] * 100)}% of the beat, then re-check.`
        : d === 0
          ? "Keep it. If the drop feels crowded, cut the tail on beat 4 of every 8th bar."
          : "Shorten the tail with a faster amp decay or a gate keyed to the next kick; the tail must end before the next punch.",
      hard: short
        ? "Rebuild the tail in Serum (kick-tail patch on the Serum page): sine + triangle, hold = 1 beat, pitch drop 35 ms, then two distortion stages and a multiband compressor with slow release on the low band."
        : "Split punch and tail; keep the tail full length but sidechain it to the punch of the NEXT kick with 5 ms lookahead so overlap disappears without shortening the sound.",
      plugins: [P("kick"), P("multiband"), P("saturation")],
      serum: "Serum page → Kick tail patch",
    });

    /* kick pitch vs key */
    const rootPc = a.key.name.split(" ")[0];
    const kickPc = a.kick.note.replace(/-?\d+$/, "");
    const fifthOf: Record<string, string> = { C: "G", "C#": "G#", D: "A", "D#": "A#", E: "B", F: "C", "F#": "C#", G: "D", "G#": "D#", A: "E", "A#": "F", B: "F#" };
    const onRoot = kickPc === rootPc;
    const onFifth = fifthOf[rootPc] === kickPc;
    const hzOut = outside(a.kick.hz, t.kickHz);
    const centsOff = Math.abs(a.kick.cents);
    let sev: Severity = "good";
    if (a.kick.hz > 0 && !onRoot && !onFifth) sev = "fix";
    else if (centsOff > tol(25) || hzOut > tol(6)) sev = "check";
    f.push({
      id: "kick-pitch",
      area: "kick",
      severity: a.kick.hz ? sev : "check",
      title: !a.kick.hz
        ? "Could not read the kick tail pitch"
        : onRoot
          ? "Kick tail is tuned to the key"
          : onFifth
            ? "Kick tail sits on the fifth"
            : "Kick tail is not on the root or fifth",
      measured: a.kick.hz ? `${a.kick.note} (${a.kick.hz} Hz, ${a.kick.cents > 0 ? "+" : ""}${a.kick.cents} cents)` : "—",
      target: `Root of ${a.key.name} (${rootPc}1/${rootPc}2) · lane tails run ${t.kickHz[0]}–${t.kickHz[1]} Hz`,
      detail: a.kick.hz
        ? `Detected key ${a.key.name} (${Math.round(a.key.confidence * 100)}% confidence). ${onRoot ? "The tail matches the tonic." : onFifth ? "A fifth works but the drop reads more 'in key' on the root." : "A tail off the root makes the lead and kick sound like two songs."}${centsOff > 25 ? ` It is ${centsOff} cents off the nearest note — fine-tune it.` : ""}`
        : "The tail is too short or too noisy to find a pitch. Extend the tail or check the sample's tuning by ear against the root.",
      easy: `Pitch the tail sample (not the punch) until it reads ${rootPc}1 or ${rootPc}2 in the analyser. Fine-tune in cents.`,
      hard: "Synthesise the tail at the exact root (Serum kick-tail patch), match the tuning of any sub layer to the cent, then sweep the pitch-drop time (25–45 ms) until the punch and tail read as one note.",
      plugins: [P("kick"), P("sampler"), P("meter")],
      serum: "Serum page → Kick tail patch (set the note there)",
    });
  } else {
    f.push({
      id: "kick-none",
      area: "kick",
      severity: "check",
      title: "Very few kicks detected",
      measured: `${a.kick.count} kicks`,
      target: "A kick on every beat in the drop",
      detail: "Either the file is mostly break, the kick is very quiet, or the low end is filtered. The kick and structure findings below are unreliable.",
      easy: "Analyse a bounce that includes at least one full drop.",
      hard: "If the kick is there but quiet: raise the kick bus to -3 dBFS peak and re-bounce.",
      plugins: [],
    });
  }

  /* bands */
  const bandFinding = (k: BandKey, area: FindingArea, lowTitle: string, highTitle: string, lowEasy: string, highEasy: string, lowHard: string, highHard: string, pl: string[]) => {
    const diff = a.bands[k] - t.bands[k];
    const sev: Severity = Math.abs(diff) <= tol(2.5) ? "good" : Math.abs(diff) <= tol(5) ? "check" : "fix";
    f.push({
      id: `band-${k}`,
      area,
      severity: sev,
      title: sev === "good" ? `${BAND_LABELS[k]} Hz balanced` : diff < 0 ? lowTitle : highTitle,
      measured: `${fmtDb(a.bands[k])} rel. to loudest band`,
      target: `${fmtDb(t.bands[k])} for ${g.label}`,
      detail: `${BAND_LABELS[k]} Hz reads ${fmtDb(a.bands[k])} against the loudest band; ${g.label} masters sit around ${fmtDb(t.bands[k])}. Difference ${fmtDb(diff)}.`,
      easy: sev === "good" ? "Leave it." : diff < 0 ? lowEasy : highEasy,
      hard: sev === "good" ? "Compare against two references from the lane at equal loudness before touching anything." : diff < 0 ? lowHard : highHard,
      plugins: pl,
    });
  };
  bandFinding(
    "sub", "low",
    "Sub is light", "Sub is heavy",
    "Boost the kick tail 1–2 dB at 40–60 Hz with a wide bell, or lengthen the tail; check the tail note is on the root.",
    "Cut 1–2 dB at 30–50 Hz on the kick bus and high-pass at 28 Hz. If a separate sub exists, sidechain it harder to the kick.",
    "Rebuild the tail with a stronger sine component (Serum sub osc) and multiband-compress the low band with a slow release so the sub level is steady.",
    "Multiband on the kick bus: low band ratio 4:1, slow release, 2–3 dB GR. Keep the sub steady rather than loud.",
    [P("eq"), P("multiband"), P("kick")],
  );
  bandFinding(
    "low", "low",
    "Punch band (60–150) is light", "Punch band (60–150) is heavy",
    "Boost 1–2 dB at 80–100 Hz on the kick punch layer; clip the punch 2 dB so it reads louder without more level.",
    "Cut 1–2 dB at 90–120 Hz on the kick bus with a medium Q; make sure the lead/pad buses are high-passed at 250 Hz.",
    "Split the punch to its own layer, transient-shape it (+attack), clip it hard, then blend under the tail.",
    "Dynamic EQ on the lead/pad buses at 60–150 Hz keyed to the kick so only the kick owns the band on every hit.",
    [P("eq"), P("clipper"), P("transient")],
  );
  bandFinding(
    "lowMid", "mids",
    "Low-mids (150–400) are thin", "Low-mids (150–400) are muddy",
    "Add 2 dB at 250 Hz on the kick (the 'tok'); or raise the distortion on the tail's mid band.",
    "Cut 2–3 dB at 200–350 Hz (Q 2) on the kick, high-pass leads at 300 Hz and pads at 250 Hz.",
    "Distort the 150–600 Hz band of the tail separately (multiband distortion or a cab sim on that band) and blend to taste.",
    "Resonance suppressor or dynamic EQ on the kick bus at the ringing frequencies the distortion created; then a static 2 dB dip.",
    [P("eq"), P("distortion"), P("resonance")],
  );
  bandFinding(
    "mid", "mids",
    "Mids (400–2k) are hollow", "Mids (400–2k) are crowded",
    "Raise the lead/screech bus 1–2 dB or add a mid-range layer (pluck, chord stab).",
    "Lower the lead bus 1–2 dB, cut 2 dB at 800 Hz–1.2 kHz on the pads, and check that only one layer plays the melody in the low octave.",
    "Layer the lead with a narrow pluck that owns 800 Hz–2 kHz and side-chain the pad's mids to it.",
    "Dynamic EQ on the pad bus at 500 Hz–1.5 kHz keyed to the lead; OTT on the lead at 25% to bring detail without level.",
    [P("eq"), P("dynamic-eq"), P("multiband")],
  );
  bandFinding(
    "highMid", "highs",
    "Presence (2–6k) is dull", "Presence (2–6k) is harsh",
    "Add 1–2 dB shelf at 3 kHz on the lead bus; add the octave-up lead layer.",
    "Cut 2 dB at 3–4 kHz on the screech/lead bus; low-pass distorted kick layers at 8 kHz; de-ess the vocal.",
    "Exciter or gentle saturation on the lead's 2–6 kHz band only (multiband saturator).",
    "Resonance suppressor on the lead/screech bus (soothe-style or dynamic EQ), then a static dip at the harshest frequency.",
    [P("eq"), P("resonance"), P("saturation")],
  );
  bandFinding(
    "high", "highs",
    "Air (6k+) is missing", "Air (6k+) is too loud",
    "High shelf +1.5 dB at 10 kHz on the master; add hats or a shaker.",
    "Low-pass distorted kicks at 8–10 kHz; shelf -1.5 dB at 10 kHz on the lead bus.",
    "Octave-up 'air' layer of the lead, low-passed at 12 kHz and widened; hats with a transient shaper.",
    "Dynamic high shelf on the master keyed to the loudest hits (-1 dB), so air is present in breaks but tamed in drops.",
    [P("eq"), P("imager")],
  );

  /* loudness */
  {
    const L = a.loudness.integrated;
    const d = outside(L, t.lufs);
    const quiet = L < t.lufs[0];
    f.push({
      id: "loudness",
      area: "loudness",
      severity: d === 0 ? "good" : d < tol(2) ? "check" : "fix",
      title: d === 0 ? "Loudness is in the lane's window" : quiet ? "Master is quiet for the lane" : "Master is louder than the lane usually goes",
      measured: `${L} LUFS integrated · short-term max ${a.loudness.shortTermMax} · true peak ≈ ${a.loudness.truePeakDb} dBTP`,
      target: `${t.lufs[0]} to ${t.lufs[1]} LUFS · true peak ≤ -0.3 dBTP`,
      detail: quiet
        ? "If this is an unmastered mix that's fine — mixes should peak around -6 dBFS. If it's a master, it will sound small next to lane references."
        : d === 0
          ? "Loudness matches what the lane's club masters land on."
          : "Louder than typical; check the kick punch isn't flattened (see crest factor).",
      easy: quiet
        ? `Limiter on the master, ceiling -0.3 dBTP, push input until the meter reads ${t.lufs[1]} LUFS integrated.`
        : d === 0
          ? "Nothing to do."
          : "Back the limiter input off 1–2 dB; the drop will hit harder because the punch survives.",
      hard: quiet
        ? "Clip + limit: soft clipper takes 1–2 dB of kick peaks, then the limiter does 3–4 dB. Turn the break down 2–3 dB in the mix so the drop can be louder without the limiter working harder."
        : "Two-stage: multiband compressor for balance (1 dB per band), clipper, then a transparent limiter with 2–3 dB of GR only.",
      plugins: [P("limiter"), P("clipper"), P("meter")],
    });
    if (a.loudness.truePeakDb > -0.2) {
      f.push({
        id: "true-peak",
        area: "loudness",
        severity: "check",
        title: "True peak is at or above 0 dBTP",
        measured: `≈ ${a.loudness.truePeakDb} dBTP (sample peak ${a.loudness.samplePeakDb} dBFS)`,
        target: "-0.3 dBTP club · -1 dBTP streaming",
        detail: "Inter-sample peaks clip on many DACs and streaming encoders. A true-peak limiter with a -0.3 to -1 dBTP ceiling fixes it.",
        easy: "Set the limiter ceiling to -0.3 dBTP (or -1 for streaming) and enable true-peak/oversampling.",
        hard: "Clip before the limiter so the limiter has less to catch; export 24-bit and check with a true-peak meter.",
        plugins: [P("limiter"), P("meter")],
      });
    }
  }

  /* dynamics */
  {
    const c = a.loudness.crest;
    const d = outside(c, t.crest);
    const flat = c < t.crest[0];
    f.push({
      id: "crest",
      area: "dynamics",
      severity: d === 0 ? "good" : d < tol(1.5) ? "check" : "fix",
      title: d === 0 ? "Drop dynamics look right" : flat ? "Drops are over-squashed" : "Drops are more dynamic than the lane",
      measured: `crest ${c} dB in the loudest blocks · LRA ${a.loudness.lra} LU`,
      target: `crest ${t.crest[0]}–${t.crest[1]} dB · LRA 4–8 LU`,
      detail: flat
        ? "Peak-to-RMS is low: the limiter or clipper is eating the kick transient. The drop will feel loud but not punchy."
        : d === 0
          ? "Transients survive; the drop has punch."
          : "Peaks stick out more than lane masters — the mix may be under-limited or the kick punch is very loud relative to the tail.",
      easy: flat ? "Reduce limiter gain reduction to 3–4 dB max; raise the kick tail instead of the punch." : d === 0 ? "Nothing to do." : "Add 1–2 dB of clipping on the kick bus and 2 dB of limiting on the master.",
      hard: flat
        ? "Rebuild the loudness with a clipper on the kick punch only (4 dB), OTT on the leads, then a limiter doing 2–3 dB. Same loudness, more punch."
        : "Parallel compression on the drop bus (ratio 8:1, fast, blended -10 dB) to raise density without touching peaks.",
      plugins: [P("limiter"), P("clipper"), P("compressor")],
    });
    if (a.loudness.lra > 0 && a.loudness.lra < 3 && a.structure.sections.some((s) => s.kind === "break")) {
      f.push({
        id: "lra",
        area: "dynamics",
        severity: "check",
        title: "Breaks are almost as loud as the drops",
        measured: `LRA ${a.loudness.lra} LU`,
        target: "4–8 LU",
        detail: "A tiny loudness range means the break doesn't set up the drop. Listeners hear the drop as 'more of the same'.",
        easy: "Turn the break bus down 2–3 dB. Remove the sidechain pump from the break.",
        hard: "Automate the master limiter input -2 dB in breaks or use a separate 'break' bus with lighter processing.",
        plugins: [P("meter")],
      });
    }
  }

  /* stereo */
  if (a.channels === 2) {
    const lowC = a.stereo.lowCorrelation;
    f.push({
      id: "low-mono",
      area: "stereo",
      severity: lowC >= 1 - tol(0.1) ? "good" : lowC >= 1 - tol(0.3) ? "check" : "fix",
      title: lowC >= 0.9 ? "Low end is mono" : "Low end is not mono",
      measured: `correlation below 150 Hz: ${lowC}`,
      target: "≥ 0.9",
      detail: "Club systems sum the low end. Wide bass loses energy and can cancel.",
      easy: "Mono everything below 120–150 Hz (imager band width 0, or a mid/side EQ high-passing the sides at 150 Hz).",
      hard: "Find the culprit: solo buses with a correlation meter; widened leads/pads with low content are usual. High-pass their side channel at 300 Hz.",
      plugins: [P("imager"), P("eq"), P("meter")],
    });
    const w = a.stereo.sideMidDb;
    const d = outside(w, t.width);
    f.push({
      id: "width",
      area: "stereo",
      severity: d === 0 ? "good" : d < tol(3) ? "check" : "fix",
      title: d === 0 ? "Width fits the lane" : w < t.width[0] ? "Mix is narrow for the lane" : "Mix is wide for the lane",
      measured: `side/mid ${w} dB · correlation ${a.stereo.correlation}`,
      target: `${t.width[0]} to ${t.width[1]} dB`,
      detail: w < t.width[0] ? "Leads, pads and FX can spread; the kick stays centred." : d === 0 ? "Width sits where the lane's masters do." : "Very wide mixes fall apart in mono and on big systems.",
      easy: w < t.width[0] ? "Chorus/dimension expander or unison width on the lead; pan hats slightly." : d === 0 ? "Nothing to do." : "Reduce widener amounts; check in mono that the lead is still there.",
      hard: w < t.width[0] ? "Haas-free width: two different lead layers panned ±30 with different detune seeds; widen only above 500 Hz." : "Mid/side EQ: high-pass the sides at 200 Hz and shelf them -1.5 dB at 400 Hz.",
      plugins: [P("imager"), P("modulation")],
    });
  }

  /* key */
  f.push({
    id: "key",
    area: "key",
    severity: a.key.confidence < 0.4 ? "check" : a.key.mode === "major" && !["frenchcore", "euphoric"].includes(target) ? "check" : "good",
    title: `Key reads as ${a.key.name}`,
    measured: `${a.key.name} · confidence ${Math.round(a.key.confidence * 100)}% · alternatives ${a.key.alt.join(", ")}`,
    target: target === "frenchcore" ? "Minor or major both common" : "Minor keys",
    detail:
      a.key.confidence < 0.4
        ? "Ambiguous chroma — expected on very distorted drops. Trust your MIDI over this."
        : a.key.mode === "major" && !["frenchcore", "euphoric"].includes(target)
          ? `${g.label} is nearly always minor. A major-key drop reads as frenchcore/happy hardcore.`
          : "Minor key, as the lane expects. The kick note finding compares the tail to this root.",
    easy: "Confirm the key against your MIDI; if it disagrees, the detected kick note should still be checked against your actual root.",
    hard: "Try the relative minor for the drop (same notes, darker root) while keeping the break major — a classic euphoric move.",
    plugins: [],
  });

  /* structure */
  {
    const secs = a.structure.sections;
    const drops = secs.filter((s) => s.kind === "drop");
    const breaks = secs.filter((s) => s.kind === "break");
    const builds = secs.filter((s) => s.kind === "build");
    const offGrid = secs.filter((s) => s.bars % 8 !== 0 && s.bars > 4).length;
    const templateDrop = g.template.filter((s) => s.kind === "drop").reduce((m, s) => Math.max(m, s.bars), 32);
    const longestDrop = drops.reduce((m, s) => Math.max(m, s.bars), 0);
    let sev: Severity = "good";
    const notes: string[] = [];
    if (!drops.length) {
      sev = "fix";
      notes.push("No drop detected (no section with a kick on every beat at full level).");
    }
    if (!breaks.length) {
      sev = sev === "fix" ? "fix" : "check";
      notes.push("No break detected — the track never leaves the kick.");
    }
    if (drops.length && !builds.length) {
      sev = sev === "fix" ? "fix" : "check";
      notes.push("No build detected before the drops.");
    }
    if (offGrid > secs.length / 2) {
      sev = sev === "fix" ? "fix" : "check";
      notes.push("Most sections are not multiples of 8 bars — either the bar grid is offset or the arrangement is off-phrase.");
    }
    if (longestDrop && longestDrop < templateDrop * 0.6) {
      notes.push(`Longest drop is ${longestDrop} bars; the lane usually runs ${templateDrop}.`);
    }
    f.push({
      id: "structure",
      area: "structure",
      severity: sev,
      title: sev === "good" ? "Structure reads like the lane" : "Structure differs from the lane template",
      measured: `${a.structure.bars} bars · ${drops.length} drop(s), ${breaks.length} break(s), ${builds.length} build(s)`,
      target: g.template.map((s) => `${s.label} ${s.bars}`).join(" → "),
      detail: notes.length ? notes.join(" ") : `${g.arrangement}`,
      easy: "Open the Arrange page with this lane and compare the section list to yours; move boundaries to 8-bar multiples.",
      hard: "Rebuild the arrangement from the generated template, then keep only what your track needs. Add a mid section with a kick variation between drop 1 and break 2.",
      plugins: [],
    });
  }

  for (const x of f) x.plugins = [...new Set(x.plugins)];
  const kept = f.filter((x) => prefs.areas[x.area] !== false);

  /* order: fix → check → good */
  const rank: Record<Severity, number> = { fix: 0, check: 1, good: 2 };
  kept.sort((x, y) => rank[x.severity] - rank[y.severity]);

  const refs = closestRefs(target, a.bpm.value, prefs.refCount);
  const fixes = kept.filter((x) => x.severity === "fix").length;
  const checks = kept.filter((x) => x.severity === "check").length;
  const bestLabel = genres.find((x) => x.id === matches[0].genre)?.label ?? matches[0].genre;
  const summary = `${opts.fileName}: ${a.bpm.value} BPM, ${a.key.name}, ${a.loudness.integrated} LUFS, kick ${a.kick.note || "?"} with a ${Math.round(a.kick.tailBeats * 100)}% tail. Closest lane ${bestLabel} (${matches[0].score}%)${targetMode === "chosen" ? `, judged against ${g.label}` : ""}. ${fixes} thing${fixes === 1 ? "" : "s"} to fix, ${checks} to check.`;

  return { fileName: opts.fileName, createdAt: Date.now(), analysis: a, matches, target, targetMode, findings: kept, refs, summary };
}

export function describeKickNote(a: TrackAnalysis): string {
  if (!a.kick.hz) return "—";
  const n = hzToNote(a.kick.hz);
  return `${n.note} ${n.cents >= 0 ? "+" : ""}${n.cents}¢`;
}
