import { STYLES, totalBars } from "./catalog";
import type { StyleId } from "./types";

/** 0-based bar indexes. Fill = last bar of a phrase. Impact = first bar of the next. */
export function phraseEdges(style: StyleId) {
  const arr = STYLES[style].arrangement;
  const total = totalBars(style);
  const fillBars: number[] = [];
  const impactBars: number[] = [];
  const rollBars: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    const s = arr[i];
    const last = s.startBar + s.bars - 1;
    if (i < arr.length - 1) {
      fillBars.push(last);
      impactBars.push(arr[i + 1].startBar);
    }
    if (s.kind === "build") {
      const start = Math.max(s.startBar, last - 7);
      for (let b = start; b <= last; b++) rollBars.push(b);
    }
  }

  return { fillBars, impactBars, rollBars, total };
}

/** 1-based bars for Logic Scripter / MARKERS text. */
export function phraseEdges1(style: StyleId) {
  const e = phraseEdges(style);
  return {
    fills: e.fillBars.map((b) => b + 1),
    impacts: e.impactBars.map((b) => b + 1),
  };
}
