/** Seconds for one 4/4 bar at bpm. */
export function secondsPerBar(bpm: number) {
  return (60 / bpm) * 4;
}

export function barFromTime(seconds: number, bpm: number, total: number) {
  const b = Math.floor(seconds / secondsPerBar(bpm));
  return Math.max(0, Math.min(total - 1, b));
}

export function timeFromBar(bar: number, bpm: number) {
  return bar * secondsPerBar(bpm);
}

/** Rough BPM from a bounce. Hard dance 120–220. */
export async function detectBpm(file: File): Promise<number | null> {
  const ctx = new AudioContext();
  try {
    const buf = await ctx.decodeAudioData(await file.arrayBuffer());
    const ch = buf.getChannelData(0);
    const sr = buf.sampleRate;
    const start = Math.min(ch.length, Math.floor(sr * 8));
    const end = Math.min(ch.length, start + Math.floor(sr * 24));
    const hop = Math.floor(sr / 200);
    const energies: number[] = [];
    for (let i = start; i + hop < end; i += hop) {
      let e = 0;
      for (let j = 0; j < hop; j++) e += Math.abs(ch[i + j]);
      energies.push(e);
    }
    if (energies.length < 40) return null;
    const mean = energies.reduce((a, b) => a + b, 0) / energies.length;
    const peaks: number[] = [];
    for (let i = 1; i < energies.length - 1; i++) {
      if (energies[i] > energies[i - 1] && energies[i] > energies[i + 1] && energies[i] > mean * 1.25) {
        peaks.push(i);
      }
    }
    const counts = new Map<number, number>();
    for (let i = 1; i < peaks.length; i++) {
      const dt = (peaks[i] - peaks[i - 1]) * (hop / sr);
      if (dt < 0.22 || dt > 0.7) continue;
      let bpm = Math.round(60 / dt);
      while (bpm < 125) bpm *= 2;
      while (bpm > 220) bpm /= 2;
      bpm = Math.round(bpm);
      if (bpm < 125 || bpm > 220) continue;
      counts.set(bpm, (counts.get(bpm) ?? 0) + 1);
    }
    let best = 0;
    let n = 0;
    for (const [bpm, c] of counts) {
      if (c > n) {
        n = c;
        best = bpm;
      }
    }
    return n >= 3 ? best : null;
  } catch {
    return null;
  } finally {
    void ctx.close();
  }
}
