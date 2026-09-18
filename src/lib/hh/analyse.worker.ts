/// <reference lib="webworker" />
import { analysePcm } from "./dsp";

type In = { sampleRate: number; left: Float32Array; right: Float32Array | null };

self.onmessage = (e: MessageEvent<In>) => {
  try {
    const result = analysePcm(e.data, (p, label) => {
      (self as unknown as Worker).postMessage({ type: "progress", p, label });
    });
    (self as unknown as Worker).postMessage({ type: "done", result });
  } catch (err) {
    (self as unknown as Worker).postMessage({ type: "error", message: (err as Error)?.message ?? String(err) });
  }
};
