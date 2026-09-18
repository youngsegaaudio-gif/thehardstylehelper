/** Browser side: decode a file with Web Audio, analyse in a worker (main-thread fallback). */
import { analysePcm, type PcmInput, type TrackAnalysis } from "./dsp";

export type Progress = (p: number, label: string) => void;

export const ACCEPTED = ".wav,.mp3,.aiff,.aif,.flac,.m4a,.ogg,.aac,audio/*";
export const MAX_MB = 120;

export async function decodeFile(file: File, onProgress?: Progress): Promise<PcmInput> {
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`File is over ${MAX_MB} MB. Bounce a 320k MP3 or a shorter section.`);
  onProgress?.(0.02, "Reading file");
  const buf = await file.arrayBuffer();
  onProgress?.(0.08, "Decoding audio");
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) throw new Error("This browser has no Web Audio support.");
  const ctx = new Ctx();
  try {
    const audio = await ctx.decodeAudioData(buf.slice(0));
    const left = audio.getChannelData(0).slice();
    const right = audio.numberOfChannels > 1 ? audio.getChannelData(1).slice() : null;
    return { sampleRate: audio.sampleRate, left, right };
  } finally {
    void ctx.close();
  }
}

function runInWorker(pcm: PcmInput, onProgress?: Progress): Promise<TrackAnalysis> {
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("./analyse.worker.ts", import.meta.url), { type: "module" });
    } catch (e) {
      reject(e);
      return;
    }
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error("Analysis timed out"));
    }, 120_000);
    worker.onmessage = (e: MessageEvent) => {
      const m = e.data as { type: string; p?: number; label?: string; result?: TrackAnalysis; message?: string };
      if (m.type === "progress") onProgress?.(0.1 + (m.p ?? 0) * 0.9, m.label ?? "");
      else if (m.type === "done") {
        clearTimeout(timer);
        worker.terminate();
        resolve(m.result!);
      } else if (m.type === "error") {
        clearTimeout(timer);
        worker.terminate();
        reject(new Error(m.message));
      }
    };
    worker.onerror = (ev) => {
      clearTimeout(timer);
      worker.terminate();
      reject(new Error(ev.message || "Worker failed"));
    };
    const transfer: ArrayBuffer[] = [pcm.left.buffer as ArrayBuffer];
    if (pcm.right) transfer.push(pcm.right.buffer as ArrayBuffer);
    worker.postMessage(pcm, transfer);
  });
}

export async function analyseFile(file: File, onProgress?: Progress): Promise<TrackAnalysis> {
  const pcm = await decodeFile(file, onProgress);
  onProgress?.(0.1, "Analysing");
  try {
    return await runInWorker(pcm, onProgress);
  } catch {
    // buffers may have been transferred; decode again for the fallback
    const again = await decodeFile(file);
    await new Promise((r) => setTimeout(r, 0));
    return analysePcm(again, (p, label) => onProgress?.(0.1 + p * 0.9, label));
  }
}
