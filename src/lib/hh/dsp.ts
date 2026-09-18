/**
 * Pure DSP for the track analyser. No DOM, no Web Audio — runs in a worker
 * or in Node tests. Input is decoded PCM; output is the numbers the advice
 * engine and the UI read.
 */

export type PcmInput = {
  sampleRate: number;
  left: Float32Array;
  right: Float32Array | null;
};

export type BandKey = "sub" | "low" | "lowMid" | "mid" | "highMid" | "high";
export const BAND_KEYS: BandKey[] = ["sub", "low", "lowMid", "mid", "highMid", "high"];
export const BAND_RANGES: Record<BandKey, [number, number]> = {
  sub: [20, 60],
  low: [60, 150],
  lowMid: [150, 400],
  mid: [400, 2000],
  highMid: [2000, 6000],
  high: [6000, 20000],
};
export const BAND_LABELS: Record<BandKey, string> = {
  sub: "Sub 20–60",
  low: "Low 60–150",
  lowMid: "Low-mid 150–400",
  mid: "Mid 400–2k",
  highMid: "High-mid 2–6k",
  high: "High 6–20k",
};

export type SectionKind = "intro" | "break" | "build" | "drop" | "mid" | "outro";

export type DetectedSection = {
  kind: SectionKind;
  startBar: number;
  bars: number;
  /** Mean bar energy in dB (0 = loudest bar of the track). */
  energy: number;
  hasKick: boolean;
};

export type TrackAnalysis = {
  durationSec: number;
  sampleRate: number;
  channels: number;
  bpm: {
    value: number;
    confidence: number;
    beatSec: number;
    /** Seconds offset of the first detected beat. */
    phaseSec: number;
    /** Runner-up tempo candidates. */
    alt: number[];
  };
  loudness: {
    integrated: number;
    shortTermMax: number;
    lra: number;
    samplePeakDb: number;
    truePeakDb: number;
    /** Peak-to-RMS of the loudest 20% of 400 ms blocks. */
    crest: number;
    rmsDb: number;
  };
  /** dB relative to the loudest band (0 = loudest). */
  bands: Record<BandKey, number>;
  /** Absolute mean band power in dBFS-ish (relative to full scale sine). */
  bandsAbs: Record<BandKey, number>;
  /** 48 log-spaced points 20 Hz–20 kHz, dB, normalised so max = 0. */
  spectrum: { hz: number; db: number }[];
  stereo: {
    correlation: number;
    lowCorrelation: number;
    /** Side/mid energy in dB. -inf = mono. */
    sideMidDb: number;
  };
  kick: {
    count: number;
    perMinute: number;
    tailMs: number;
    tailBeats: number;
    hz: number;
    note: string;
    cents: number;
    /** 0–1, how consistent the tail length is across kicks. */
    consistency: number;
  };
  key: {
    name: string;
    mode: "major" | "minor";
    confidence: number;
    alt: string[];
  };
  structure: {
    bars: number;
    energyPerBar: number[];
    kicksPerBar: number[];
    sections: DetectedSection[];
  };
};

/* ------------------------------------------------------------------ */
/* small helpers                                                       */

export const db = (p: number) => 10 * Math.log10(Math.max(p, 1e-20));
export const ampDb = (a: number) => 20 * Math.log10(Math.max(a, 1e-12));

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function hzToNote(hz: number): { note: string; cents: number } {
  if (!(hz > 0)) return { note: "—", cents: 0 };
  const midi = 69 + 12 * Math.log2(hz / 440);
  const rounded = Math.round(midi);
  const cents = Math.round((midi - rounded) * 100);
  const name = NOTE_NAMES[((rounded % 12) + 12) % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return { note: `${name}${octave}`, cents };
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function percentile(xs: number[], p: number): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const i = Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)));
  return s[i];
}

function mean(xs: ArrayLike<number>): number {
  let s = 0;
  for (let i = 0; i < xs.length; i++) s += xs[i];
  return xs.length ? s / xs.length : 0;
}

/* ------------------------------------------------------------------ */
/* FFT                                                                 */

export class Fft {
  readonly n: number;
  private readonly cos: Float32Array;
  private readonly sin: Float32Array;
  private readonly rev: Uint32Array;
  private readonly re: Float32Array;
  private readonly im: Float32Array;

  constructor(n: number) {
    if (n & (n - 1)) throw new Error("FFT size must be a power of two");
    this.n = n;
    this.cos = new Float32Array(n / 2);
    this.sin = new Float32Array(n / 2);
    for (let i = 0; i < n / 2; i++) {
      this.cos[i] = Math.cos((2 * Math.PI * i) / n);
      this.sin[i] = Math.sin((2 * Math.PI * i) / n);
    }
    this.rev = new Uint32Array(n);
    const bits = Math.log2(n);
    for (let i = 0; i < n; i++) {
      let r = 0;
      for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
      this.rev[i] = r;
    }
    this.re = new Float32Array(n);
    this.im = new Float32Array(n);
  }

  /** Power spectrum (|X|²) for bins 0..n/2 of a real, already-windowed frame. */
  power(frame: Float32Array, out: Float32Array): void {
    const { n, re, im, rev, cos, sin } = this;
    for (let i = 0; i < n; i++) {
      re[i] = frame[rev[i]];
      im[i] = 0;
    }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1;
      const step = n / size;
      for (let start = 0; start < n; start += size) {
        for (let k = 0; k < half; k++) {
          const wr = cos[k * step];
          const wi = -sin[k * step];
          const a = start + k;
          const b = a + half;
          const tr = re[b] * wr - im[b] * wi;
          const ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr;
          im[b] = im[a] - ti;
          re[a] += tr;
          im[a] += ti;
        }
      }
    }
    for (let i = 0; i <= n / 2; i++) out[i] = re[i] * re[i] + im[i] * im[i];
  }
}

export function hann(n: number): Float32Array {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
  return w;
}

/* ------------------------------------------------------------------ */
/* filters                                                             */

type Biquad = { b0: number; b1: number; b2: number; a1: number; a2: number };

function applyBiquad(x: Float32Array, c: Biquad): Float32Array {
  const y = new Float32Array(x.length);
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const x0 = x[i];
    const y0 = c.b0 * x0 + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
    y[i] = y0;
  }
  return y;
}

function lowpass(fs: number, f0: number, q = 0.7071): Biquad {
  const w = (2 * Math.PI * f0) / fs;
  const alpha = Math.sin(w) / (2 * q);
  const cw = Math.cos(w);
  const a0 = 1 + alpha;
  return {
    b0: (1 - cw) / 2 / a0,
    b1: (1 - cw) / a0,
    b2: (1 - cw) / 2 / a0,
    a1: (-2 * cw) / a0,
    a2: (1 - alpha) / a0,
  };
}

/** ITU-R BS.1770 K-weighting: high shelf then RLB high-pass, any sample rate. */
function kWeight(fs: number): [Biquad, Biquad] {
  // stage 1: high shelf
  const f0 = 1681.974450955533;
  const G = 3.999843853973347;
  const Q = 0.7071752369554196;
  const K = Math.tan((Math.PI * f0) / fs);
  const Vh = Math.pow(10, G / 20);
  const Vb = Math.pow(Vh, 0.4996667741545416);
  const a0 = 1 + K / Q + K * K;
  const shelf: Biquad = {
    b0: (Vh + (Vb * K) / Q + K * K) / a0,
    b1: (2 * (K * K - Vh)) / a0,
    b2: (Vh - (Vb * K) / Q + K * K) / a0,
    a1: (2 * (K * K - 1)) / a0,
    a2: (1 - K / Q + K * K) / a0,
  };
  // stage 2: high-pass
  const f1 = 38.13547087602444;
  const Q1 = 0.5003270373238773;
  const K1 = Math.tan((Math.PI * f1) / fs);
  const a01 = 1 + K1 / Q1 + K1 * K1;
  const hp: Biquad = {
    b0: 1 / a01,
    b1: -2 / a01,
    b2: 1 / a01,
    a1: (2 * (K1 * K1 - 1)) / a01,
    a2: (1 - K1 / Q1 + K1 * K1) / a01,
  };
  return [shelf, hp];
}

/* ------------------------------------------------------------------ */
/* loudness                                                            */

export function analyseLoudness(input: PcmInput) {
  const { sampleRate: fs, left, right } = input;
  const chans = right ? [left, right] : [left];
  const [shelf, hp] = kWeight(fs);
  const weighted = chans.map((c) => applyBiquad(applyBiquad(c, shelf), hp));

  // 400 ms blocks, 100 ms hop
  const block = Math.round(fs * 0.4);
  const hop = Math.round(fs * 0.1);
  const n = left.length;
  const blocks: number[] = []; // mean-square summed over channels
  for (let start = 0; start + block <= n; start += hop) {
    let ms = 0;
    for (const w of weighted) {
      let s = 0;
      for (let i = start; i < start + block; i++) s += w[i] * w[i];
      ms += s / block;
    }
    blocks.push(ms);
  }
  const loud = (ms: number) => -0.691 + 10 * Math.log10(Math.max(ms, 1e-20));
  const abs = blocks.filter((ms) => loud(ms) > -70);
  let integrated = -70;
  if (abs.length) {
    const rel = loud(mean(abs)) - 10;
    const gated = abs.filter((ms) => loud(ms) > rel);
    integrated = gated.length ? loud(mean(gated)) : loud(mean(abs));
  }

  // short-term (3 s) for LRA
  const stBlock = Math.round(fs * 3);
  const stHop = Math.round(fs * 1);
  const st: number[] = [];
  for (let start = 0; start + stBlock <= n; start += stHop) {
    let ms = 0;
    for (const w of weighted) {
      let s = 0;
      for (let i = start; i < start + stBlock; i += 2) s += w[i] * w[i];
      ms += s / (stBlock / 2);
    }
    st.push(loud(ms));
  }
  const stAbs = st.filter((l) => l > -70);
  let lra = 0;
  let shortTermMax = -70;
  if (stAbs.length) {
    shortTermMax = Math.max(...stAbs);
    const relT = 10 * Math.log10(mean(stAbs.map((l) => Math.pow(10, l / 10)))) - 20;
    const g = stAbs.filter((l) => l > relT);
    lra = g.length ? percentile(g, 0.95) - percentile(g, 0.1) : 0;
  }

  // peaks + crest of the loud blocks (unweighted)
  let peak = 0;
  for (const c of chans) for (let i = 0; i < c.length; i++) peak = Math.max(peak, Math.abs(c[i]));
  // 4x oversampled true-peak estimate via linear interpolation between samples
  let tp = peak;
  for (const c of chans) {
    for (let i = 1; i < c.length; i++) {
      const a = c[i - 1];
      const b = c[i];
      if (Math.abs(a) > 0.5 || Math.abs(b) > 0.5) {
        const m = Math.abs((a + b) / 2);
        if (m > tp) tp = m;
      }
    }
  }
  const rawBlocks: number[] = [];
  const rawPeaks: number[] = [];
  const mono = chans[0];
  for (let start = 0; start + block <= n; start += hop) {
    let s = 0;
    let p = 0;
    for (let i = start; i < start + block; i++) {
      const v = mono[i];
      s += v * v;
      const av = Math.abs(v);
      if (av > p) p = av;
    }
    rawBlocks.push(s / block);
    rawPeaks.push(p);
  }
  const order = rawBlocks.map((v, i) => i).sort((a, b) => rawBlocks[b] - rawBlocks[a]);
  const top = order.slice(0, Math.max(1, Math.floor(order.length * 0.2)));
  const crest = mean(top.map((i) => ampDb(rawPeaks[i]) - ampDb(Math.sqrt(rawBlocks[i]))));
  const rmsDb = ampDb(Math.sqrt(mean(rawBlocks)));

  return {
    integrated,
    shortTermMax,
    lra,
    samplePeakDb: ampDb(peak),
    truePeakDb: ampDb(tp),
    crest,
    rmsDb,
  };
}

/* ------------------------------------------------------------------ */
/* spectrum, chroma, per-frame energy                                  */

const KS_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const KS_MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

function corr(a: number[], b: number[]): number {
  const ma = mean(a);
  const mb = mean(b);
  let num = 0,
    da = 0,
    dbb = 0;
  for (let i = 0; i < a.length; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    dbb += (b[i] - mb) ** 2;
  }
  return da && dbb ? num / Math.sqrt(da * dbb) : 0;
}

export function analyseSpectrum(mono: Float32Array, fs: number) {
  const N = 4096;
  const hop = 2048;
  const fft = new Fft(N);
  const win = hann(N);
  const frame = new Float32Array(N);
  const pow = new Float32Array(N / 2 + 1);
  const binHz = fs / N;

  const bandSum: Record<BandKey, number> = { sub: 0, low: 0, lowMid: 0, mid: 0, highMid: 0, high: 0 };
  const chroma = new Array<number>(12).fill(0);
  const logPoints = 48;
  const logHz: number[] = [];
  for (let i = 0; i < logPoints; i++) logHz.push(20 * Math.pow(1000, i / (logPoints - 1)));
  const logSum = new Array<number>(logPoints).fill(0);
  const logCount = new Array<number>(logPoints).fill(0);
  const frameEnergy: number[] = [];
  const frameChroma: number[][] = [];
  let frames = 0;

  // bin → log point index map
  const binLog = new Int16Array(N / 2 + 1).fill(-1);
  for (let b = 1; b <= N / 2; b++) {
    const hz = b * binHz;
    if (hz < 20 || hz > 20000) continue;
    const idx = Math.round(((logPoints - 1) * Math.log(hz / 20)) / Math.log(1000));
    binLog[b] = Math.max(0, Math.min(logPoints - 1, idx));
  }
  const binBand = new Int8Array(N / 2 + 1).fill(-1);
  for (let b = 1; b <= N / 2; b++) {
    const hz = b * binHz;
    BAND_KEYS.forEach((k, i) => {
      const [lo, hi] = BAND_RANGES[k];
      if (hz >= lo && hz < hi) binBand[b] = i;
    });
  }
  const binChroma = new Int8Array(N / 2 + 1).fill(-1);
  for (let b = 1; b <= N / 2; b++) {
    const hz = b * binHz;
    if (hz < 55 || hz > 4000) continue;
    const midi = 69 + 12 * Math.log2(hz / 440);
    binChroma[b] = ((Math.round(midi) % 12) + 12) % 12;
  }

  for (let start = 0; start + N <= mono.length; start += hop) {
    for (let i = 0; i < N; i++) frame[i] = mono[start + i] * win[i];
    fft.power(frame, pow);
    let total = 0;
    const fc = new Array<number>(12).fill(0);
    for (let b = 1; b <= N / 2; b++) {
      const p = pow[b];
      total += p;
      const bi = binBand[b];
      if (bi >= 0) bandSum[BAND_KEYS[bi]] += p;
      const li = binLog[b];
      if (li >= 0) {
        logSum[li] += p;
        logCount[li] += 1;
      }
      const ci = binChroma[b];
      if (ci >= 0) fc[ci] += Math.sqrt(p);
    }
    for (let c = 0; c < 12; c++) chroma[c] += fc[c];
    frameChroma.push(fc);
    frameEnergy.push(total);
    frames++;
  }
  const f = Math.max(1, frames);
  // normalise band power by bandwidth so wide bands don't win by default
  const bandsAbs = {} as Record<BandKey, number>;
  for (const k of BAND_KEYS) {
    const [lo, hi] = BAND_RANGES[k];
    const bins = Math.max(1, (hi - lo) / binHz);
    // scale: hann window power gain and FFT size, roughly full-scale sine → 0 dB
    bandsAbs[k] = db(bandSum[k] / f / bins / ((N * N) / 16)) + 10 * Math.log10(bins);
  }
  const maxAbs = Math.max(...BAND_KEYS.map((k) => bandsAbs[k]));
  const bands = {} as Record<BandKey, number>;
  for (const k of BAND_KEYS) bands[k] = bandsAbs[k] - maxAbs;

  const spectrumRaw = logHz.map((hz, i) => ({ hz, db: logCount[i] ? db(logSum[i] / logCount[i] / f) : -120 }));
  // fill gaps (low points with no bins) from neighbours
  for (let i = 0; i < spectrumRaw.length; i++) {
    if (spectrumRaw[i].db <= -119) {
      const prev = spectrumRaw.slice(0, i).reverse().find((p) => p.db > -119);
      const next = spectrumRaw.slice(i + 1).find((p) => p.db > -119);
      spectrumRaw[i].db = prev && next ? (prev.db + next.db) / 2 : (prev ?? next)?.db ?? -120;
    }
  }
  const smax = Math.max(...spectrumRaw.map((p) => p.db));
  const spectrum = spectrumRaw.map((p) => ({ hz: Math.round(p.hz), db: Math.round((p.db - smax) * 10) / 10 }));

  // key
  const scores: { name: string; mode: "major" | "minor"; score: number }[] = [];
  for (let tonic = 0; tonic < 12; tonic++) {
    const rot = chroma.map((_, i) => chroma[(i + tonic) % 12]);
    scores.push({ name: NOTE_NAMES[tonic], mode: "major", score: corr(rot, KS_MAJOR) });
    scores.push({ name: NOTE_NAMES[tonic], mode: "minor", score: corr(rot, KS_MINOR) + 0.03 });
  }
  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const second = scores[1];
  const keyConfidence = Math.max(0, Math.min(1, (best.score - second.score) * 4 + 0.35));
  const key = {
    name: `${best.name} ${best.mode}`,
    mode: best.mode,
    confidence: Math.round(keyConfidence * 100) / 100,
    alt: scores.slice(1, 3).map((s) => `${s.name} ${s.mode}`),
  };

  return { bands, bandsAbs, spectrum, key, chroma, frameChroma, frameEnergy, frameHopSec: hop / fs };
}

/** Re-score the 24 keys with a bias toward keys whose tonic matches the kick tail's pitch class. */
export function keyWithKickBias(chroma: number[], kickHz: number) {
  const scores: { name: string; mode: "major" | "minor"; score: number }[] = [];
  const kickPc = kickHz > 0 ? ((Math.round(69 + 12 * Math.log2(kickHz / 440)) % 12) + 12) % 12 : -1;
  for (let tonic = 0; tonic < 12; tonic++) {
    const rot = chroma.map((_, i) => chroma[(i + tonic) % 12]);
    const bias = tonic === kickPc ? 0.08 : 0;
    scores.push({ name: NOTE_NAMES[tonic], mode: "major", score: corr(rot, KS_MAJOR) + bias });
    scores.push({ name: NOTE_NAMES[tonic], mode: "minor", score: corr(rot, KS_MINOR) + 0.03 + bias });
  }
  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const second = scores[1];
  const confidence = Math.max(0, Math.min(1, (best.score - second.score) * 4 + 0.35));
  return {
    name: `${best.name} ${best.mode}`,
    mode: best.mode,
    confidence: Math.round(confidence * 100) / 100,
    alt: scores.slice(1, 3).map((x) => `${x.name} ${x.mode}`),
  };
}

/* ------------------------------------------------------------------ */
/* envelopes, tempo, kicks                                             */

export function lowBandEnvelope(mono: Float32Array, fs: number, hop = 256) {
  const lp = applyBiquad(applyBiquad(mono, lowpass(fs, 160)), lowpass(fs, 160));
  const n = Math.floor(lp.length / hop);
  const env = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const base = i * hop;
    for (let j = 0; j < hop; j++) s += lp[base + j] * lp[base + j];
    env[i] = Math.sqrt(s / hop);
  }
  return { env, lp, rate: fs / hop };
}

export function fullEnvelope(mono: Float32Array, fs: number, hop = 256) {
  const n = Math.floor(mono.length / hop);
  const env = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const base = i * hop;
    for (let j = 0; j < hop; j++) s += mono[base + j] * mono[base + j];
    env[i] = Math.sqrt(s / hop);
  }
  return { env, rate: fs / hop };
}

function onsetStrength(env: Float32Array): Float32Array {
  const out = new Float32Array(env.length);
  let prev = ampDb(env[0]);
  for (let i = 1; i < env.length; i++) {
    const cur = ampDb(env[i]);
    out[i] = Math.max(0, cur - prev);
    prev = cur;
  }
  return out;
}

export function detectTempo(lowEnv: Float32Array, fullEnv: Float32Array, rate: number) {
  const onsetLow = onsetStrength(lowEnv);
  const onsetFull = onsetStrength(fullEnv);
  const onset = new Float32Array(onsetLow.length);
  for (let i = 0; i < onset.length; i++) onset[i] = onsetLow[i] * 1.5 + onsetFull[i];
  // remove local mean to sharpen the autocorrelation
  const win = Math.round(rate * 0.5);
  const smooth = new Float32Array(onset.length);
  let acc = 0;
  for (let i = 0; i < onset.length; i++) {
    acc += onset[i];
    if (i >= win) acc -= onset[i - win];
    smooth[i] = onset[i] - acc / Math.min(i + 1, win);
  }

  const minBpm = 100;
  const maxBpm = 260;
  const minLag = Math.floor((60 / maxBpm) * rate);
  const maxLag = Math.ceil((60 / minBpm) * rate);
  const ac = new Float64Array(maxLag + 1);
  const len = smooth.length;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = lag; i < len; i++) s += smooth[i] * smooth[i - lag];
    ac[lag] = s / (len - lag);
  }
  // normalise
  let acMax = 0;
  for (let lag = minLag; lag <= maxLag; lag++) acMax = Math.max(acMax, ac[lag]);
  const prior = (bpm: number) => (bpm >= 135 && bpm <= 235 ? 1 : bpm >= 120 ? 0.85 : 0.7);
  const cands: { lag: number; score: number; bpm: number }[] = [];
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (ac[lag] > ac[lag - 1] && ac[lag] >= ac[lag + 1]) {
      const bpm = (60 * rate) / lag;
      // reward tempos whose double/half period also correlates (strong pulse)
      const twice = lag * 2 <= maxLag ? ac[lag * 2] / acMax : 0.5;
      const score = ((ac[lag] / acMax) * 0.8 + twice * 0.2) * prior(bpm);
      cands.push({ lag, score, bpm });
    }
  }
  cands.sort((a, b) => b.score - a.score);
  if (!cands.length) {
    return { value: 150, confidence: 0, beatSec: 0.4, phaseSec: 0, alt: [], onset };
  }
  const best = cands[0];
  // parabolic interpolation on the autocorrelation peak
  const y0 = ac[best.lag - 1];
  const y1 = ac[best.lag];
  const y2 = ac[best.lag + 1];
  const denom = y0 - 2 * y1 + y2;
  const delta = denom !== 0 ? (0.5 * (y0 - y2)) / denom : 0;
  const lag = best.lag + Math.max(-0.5, Math.min(0.5, delta));
  let bpm = (60 * rate) / lag;
  // snap to the nearest integer when very close (real tracks are integer BPM)
  if (Math.abs(bpm - Math.round(bpm)) < 0.25) bpm = Math.round(bpm);
  bpm = Math.round(bpm * 10) / 10;
  const beatSec = 60 / bpm;
  const confidence = Math.max(0, Math.min(1, cands.length > 1 ? 1 - cands[1].score / best.score + 0.3 : 1));

  // phase: best offset for a pulse train at the beat period
  const period = beatSec * rate;
  let bestPhase = 0;
  let bestSum = -1;
  const steps = Math.max(8, Math.round(period));
  for (let p = 0; p < steps; p++) {
    const off = (p / steps) * period;
    let s = 0;
    for (let t = off; t < onset.length; t += period) s += onset[Math.round(t)] ?? 0;
    if (s > bestSum) {
      bestSum = s;
      bestPhase = off;
    }
  }
  const alt = cands
    .slice(1, 4)
    .map((c) => Math.round((60 * rate) / c.lag))
    .filter((b) => Math.abs(b - bpm) > 2);
  return { value: bpm, confidence: Math.round(confidence * 100) / 100, beatSec, phaseSec: bestPhase / rate, alt, onset };
}

export function detectKicks(lowEnv: Float32Array, rate: number, beatSec: number): number[] {
  const onset = onsetStrength(lowEnv);
  const m = mean(onset);
  let v = 0;
  for (let i = 0; i < onset.length; i++) v += (onset[i] - m) ** 2;
  const sd = Math.sqrt(v / Math.max(1, onset.length));
  const thr = m + 1.2 * sd;
  const minDist = Math.round(beatSec * rate * 0.45);
  const cands: { at: number; level: number }[] = [];
  let last = -minDist;
  for (let i = 1; i < onset.length - 1; i++) {
    if (onset[i] >= thr && onset[i] >= onset[i - 1] && onset[i] >= onset[i + 1] && i - last >= minDist) {
      let level = 0;
      for (let j = i; j < Math.min(lowEnv.length, i + 4); j++) level = Math.max(level, lowEnv[j]);
      const dbLevel = ampDb(level);
      if (dbLevel > -40) {
        cands.push({ at: i, level: dbLevel });
        last = i;
      }
    }
  }
  if (!cands.length) return [];
  // a kick is a low-band hit near the track's loud kicks; softer low hits
  // (stabs, bass in a break) are not kicks
  const ref = percentile(cands.map((c) => c.level), 0.9);
  return cands.filter((c) => c.level >= ref - 12).map((c) => c.at);
}

export function analyseKicks(
  kicks: number[],
  lowEnv: Float32Array,
  lp: Float32Array,
  rate: number,
  fs: number,
  beatSec: number,
  durationSec: number,
) {
  if (kicks.length < 8) {
    return { count: kicks.length, perMinute: 0, tailMs: 0, tailBeats: 0, hz: 0, note: "—", cents: 0, consistency: 0 };
  }
  // use the loudest 40% of kicks (drop sections)
  const levels = kicks.map((k) => {
    let p = 0;
    for (let i = k; i < Math.min(lowEnv.length, k + Math.round(rate * 0.04)); i++) p = Math.max(p, lowEnv[i]);
    return p;
  });
  const thresholdLevel = percentile(levels, 0.6);
  const loud = kicks.filter((_, i) => levels[i] >= thresholdLevel);

  const tails: number[] = [];
  const hzs: number[] = [];
  const hop = Math.round(fs / rate);
  for (let idx = 0; idx < loud.length; idx++) {
    const k = loud[idx];
    const next = kicks[kicks.indexOf(k) + 1] ?? lowEnv.length;
    let peak = 0;
    let peakAt = k;
    for (let i = k; i < Math.min(next, k + Math.round(rate * 0.06)); i++) {
      if (lowEnv[i] > peak) {
        peak = lowEnv[i];
        peakAt = i;
      }
    }
    const floor = peak * Math.pow(10, -12 / 20);
    let end = peakAt;
    while (end < next - 1 && lowEnv[end] > floor) end++;
    tails.push((end - k) / rate);

    // tail pitch: autocorrelate the low-passed signal 50 ms → min(tail, 300 ms) after the kick
    if (idx % Math.max(1, Math.floor(loud.length / 40)) === 0) {
      // skip the punch and its pitch sweep; measure the settled tail
      const s0 = k * hop + Math.round(fs * 0.09);
      const s1 = Math.min(lp.length, k * hop + Math.round(fs * Math.min(0.32, Math.max(0.16, (end - k) / rate))));
      if (s1 - s0 > fs * 0.06) {
        const minLag = Math.round(fs / 120);
        const maxLag = Math.round(fs / 30);
        const acs = new Float64Array(maxLag + 2);
        let bestLag = 0;
        let bestC = -Infinity;
        for (let lag = minLag - 1; lag <= maxLag + 1; lag++) {
          let c = 0;
          for (let i = s0 + lag; i < s1; i++) c += lp[i] * lp[i - lag];
          acs[lag] = c / (s1 - s0 - lag);
        }
        for (let lag = minLag; lag <= maxLag; lag++) {
          if (acs[lag] > bestC) {
            bestC = acs[lag];
            bestLag = lag;
          }
        }
        if (bestLag) {
          const y0 = acs[bestLag - 1];
          const y1 = acs[bestLag];
          const y2 = acs[bestLag + 1];
          const den = y0 - 2 * y1 + y2;
          const d = den !== 0 ? Math.max(-0.5, Math.min(0.5, (0.5 * (y0 - y2)) / den)) : 0;
          hzs.push(fs / (bestLag + d));
        }
      }
    }
  }
  const tailSec = median(tails);
  const spread = tails.length ? percentile(tails, 0.75) - percentile(tails, 0.25) : 0;
  const consistency = tailSec > 0 ? Math.max(0, Math.min(1, 1 - spread / tailSec)) : 0;
  const hz = median(hzs);
  const { note, cents } = hzToNote(hz);
  return {
    count: kicks.length,
    perMinute: Math.round((kicks.length / durationSec) * 60),
    tailMs: Math.round(tailSec * 1000),
    tailBeats: Math.round((tailSec / beatSec) * 100) / 100,
    hz: Math.round(hz * 10) / 10,
    note,
    cents,
    consistency: Math.round(consistency * 100) / 100,
  };
}

/* ------------------------------------------------------------------ */
/* stereo                                                              */

export function analyseStereo(input: PcmInput) {
  const { left, right, sampleRate: fs } = input;
  if (!right) return { correlation: 1, lowCorrelation: 1, sideMidDb: -60 };
  const step = 4;
  let lr = 0,
    ll = 0,
    rr = 0,
    mid = 0,
    side = 0;
  for (let i = 0; i < left.length; i += step) {
    const l = left[i];
    const r = right[i];
    lr += l * r;
    ll += l * l;
    rr += r * r;
    const m = (l + r) / 2;
    const s = (l - r) / 2;
    mid += m * m;
    side += s * s;
  }
  const correlation = ll && rr ? lr / Math.sqrt(ll * rr) : 1;
  const lpL = applyBiquad(left, lowpass(fs, 150));
  const lpR = applyBiquad(right, lowpass(fs, 150));
  let lr2 = 0,
    ll2 = 0,
    rr2 = 0;
  for (let i = 0; i < lpL.length; i += step) {
    lr2 += lpL[i] * lpR[i];
    ll2 += lpL[i] * lpL[i];
    rr2 += lpR[i] * lpR[i];
  }
  const lowCorrelation = ll2 && rr2 ? lr2 / Math.sqrt(ll2 * rr2) : 1;
  return {
    correlation: Math.round(correlation * 100) / 100,
    lowCorrelation: Math.round(lowCorrelation * 100) / 100,
    sideMidDb: Math.round(db(side / Math.max(mid, 1e-20)) * 10) / 10,
  };
}

/* ------------------------------------------------------------------ */
/* structure                                                           */

export function analyseStructure(
  fullEnv: Float32Array,
  rate: number,
  kicks: number[],
  beatSec: number,
  phaseSec: number,
) {
  const barSec = beatSec * 4;
  const barFrames = barSec * rate;
  const startFrame = phaseSec * rate;
  const bars = Math.max(1, Math.floor((fullEnv.length - startFrame) / barFrames));
  const energyRaw: number[] = [];
  const kicksPerBar: number[] = new Array(bars).fill(0);
  for (let b = 0; b < bars; b++) {
    const s = Math.round(startFrame + b * barFrames);
    const e = Math.round(startFrame + (b + 1) * barFrames);
    let acc = 0;
    for (let i = s; i < e; i++) acc += fullEnv[i] * fullEnv[i];
    energyRaw.push(ampDb(Math.sqrt(acc / Math.max(1, e - s))));
  }
  for (const k of kicks) {
    const b = Math.floor((k - startFrame) / barFrames);
    if (b >= 0 && b < bars) kicksPerBar[b]++;
  }
  const maxE = Math.max(...energyRaw);
  const energyPerBar = energyRaw.map((e) => Math.round((e - maxE) * 10) / 10);

  // classify bars
  type Cls = { kick: boolean; level: 0 | 1 | 2 };
  const cls: Cls[] = energyPerBar.map((e, i) => ({
    kick: kicksPerBar[i] >= 3,
    level: e >= -4.5 ? 2 : e >= -11 ? 1 : 0,
  }));
  // smooth: a single odd bar takes its neighbours' class
  for (let i = 1; i < cls.length - 1; i++) {
    const a = cls[i - 1];
    const b = cls[i + 1];
    if (a.kick === b.kick && a.level === b.level && (cls[i].kick !== a.kick || cls[i].level !== a.level)) cls[i] = { ...a };
  }
  // run-length segments
  const segs: { start: number; bars: number; kick: boolean; level: number }[] = [];
  for (let i = 0; i < cls.length; i++) {
    const last = segs[segs.length - 1];
    if (last && last.kick === cls[i].kick && last.level === cls[i].level) last.bars++;
    else segs.push({ start: i, bars: 1, kick: cls[i].kick, level: cls[i].level });
  }
  // merge short segments (< 4 bars) into the previous one
  const merged: typeof segs = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    if (last && s.bars < 4) last.bars += s.bars;
    else merged.push({ ...s });
  }
  // label
  const sections: DetectedSection[] = merged.map((s, i) => {
    const next = merged[i + 1];
    const prev = merged[i - 1];
    let kind: SectionKind;
    if (s.kick && s.level === 2) kind = "drop";
    else if (!s.kick) kind = i === 0 ? "intro" : i === merged.length - 1 ? "outro" : "break";
    else if (i === 0) kind = "intro";
    else if (i === merged.length - 1) kind = "outro";
    else if (next && next.kick && next.level === 2 && (!prev || !prev.kick)) kind = "build";
    else if (next && next.kick && next.level === 2) kind = "build";
    else kind = "mid";
    const e = mean(energyPerBar.slice(s.start, s.start + s.bars));
    return { kind, startBar: s.start, bars: s.bars, energy: Math.round(e * 10) / 10, hasKick: s.kick };
  });
  return { bars, energyPerBar, kicksPerBar, sections };
}

/**
 * Distorted kicks throw odd harmonics (the 5th is a major third) into the
 * chroma. When the track has kick-free bars — breaks carry the harmony in
 * hardstyle — sum chroma over those bars only; otherwise use every frame.
 */
export function harmonyChroma(
  frameChroma: number[][],
  hopSec: number,
  structure: { kicksPerBar: number[] },
  beatSec: number,
  phaseSec: number,
): number[] {
  const barSec = beatSec * 4;
  const quiet: number[] = new Array(12).fill(0);
  const all: number[] = new Array(12).fill(0);
  let quietFrames = 0;
  frameChroma.forEach((fc, i) => {
    const t = i * hopSec;
    const bar = Math.floor((t - phaseSec) / barSec);
    const kickFree = bar >= 0 && bar < structure.kicksPerBar.length && structure.kicksPerBar[bar] < 2;
    for (let c = 0; c < 12; c++) {
      all[c] += fc[c];
      if (kickFree) quiet[c] += fc[c];
    }
    if (kickFree) quietFrames++;
  });
  return quietFrames >= Math.max(20, frameChroma.length * 0.08) ? quiet : all;
}

/* ------------------------------------------------------------------ */
/* top level                                                           */

export function analysePcm(input: PcmInput, onProgress?: (p: number, label: string) => void): TrackAnalysis {
  const { sampleRate: fs, left, right } = input;
  const n = left.length;
  const mono = new Float32Array(n);
  if (right) for (let i = 0; i < n; i++) mono[i] = (left[i] + right[i]) / 2;
  else mono.set(left);
  const durationSec = n / fs;

  onProgress?.(0.05, "Envelopes");
  const low = lowBandEnvelope(mono, fs);
  const full = fullEnvelope(mono, fs);

  onProgress?.(0.2, "Tempo");
  const tempo = detectTempo(low.env, full.env, low.rate);

  onProgress?.(0.35, "Kicks");
  const kicks = detectKicks(low.env, low.rate, tempo.beatSec);
  const kick = analyseKicks(kicks, low.env, low.lp, low.rate, fs, tempo.beatSec, durationSec);

  onProgress?.(0.5, "Spectrum & key");
  const spec = analyseSpectrum(mono, fs);

  onProgress?.(0.75, "Loudness");
  const loudness = analyseLoudness(input);

  onProgress?.(0.9, "Stereo & structure");
  const stereo = analyseStereo(input);
  const structure = analyseStructure(full.env, full.rate, kicks, tempo.beatSec, tempo.phaseSec);

  onProgress?.(1, "Done");
  return {
    durationSec,
    sampleRate: fs,
    channels: right ? 2 : 1,
    bpm: { value: tempo.value, confidence: tempo.confidence, beatSec: tempo.beatSec, phaseSec: tempo.phaseSec, alt: tempo.alt },
    loudness: {
      integrated: Math.round(loudness.integrated * 10) / 10,
      shortTermMax: Math.round(loudness.shortTermMax * 10) / 10,
      lra: Math.round(loudness.lra * 10) / 10,
      samplePeakDb: Math.round(loudness.samplePeakDb * 10) / 10,
      truePeakDb: Math.round(loudness.truePeakDb * 10) / 10,
      crest: Math.round(loudness.crest * 10) / 10,
      rmsDb: Math.round(loudness.rmsDb * 10) / 10,
    },
    bands: Object.fromEntries(BAND_KEYS.map((k) => [k, Math.round(spec.bands[k] * 10) / 10])) as Record<BandKey, number>,
    bandsAbs: Object.fromEntries(BAND_KEYS.map((k) => [k, Math.round(spec.bandsAbs[k] * 10) / 10])) as Record<BandKey, number>,
    spectrum: spec.spectrum,
    stereo,
    kick,
    key: keyWithKickBias(harmonyChroma(spec.frameChroma, spec.frameHopSec, structure, tempo.beatSec, tempo.phaseSec), kick.hz),
    structure,
  };
}
