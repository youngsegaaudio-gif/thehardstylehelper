import { STYLES } from "./catalog";
import { phraseEdges1 } from "./phrase-edges";
import { transitionsFor } from "./transitions";
import type { TrackSession } from "./types";

/** Logic Pro MIDI FX Scripter — paste into Script Editor. */
export function logicScripter(session: TrackSession): string {
  const style = STYLES[session.style];
  const edges = phraseEdges1(session.style);
  const trans = transitionsFor(session.style)
    .map((t) => `// ${t.at}: ${t.what} — ${t.how}`)
    .join("\n");

  return `// HELPER for Logic Pro (Mac) — Scripter MIDI FX
// Style: ${style.name}  BPM: ${session.bpm}  Key: ${session.key}
//
// This is the Logic plug-in. It is not an Audio Unit.
// 1. New software instrument track.
// 2. Sampler / Drum Machine Designer:
//      C1  (36)  extra / Peak PVC
//      C#1 (37)  Impact PVC
//      D1  (38)  Fill PVC
//      C#2 (49)  crash / industrial
// 3. MIDI FX → Scripter → Open Script Editor → paste this whole file → Run Script.
// 4. Play the project. Extra kicks fire at phrase edges for this genre.

var NeedsTimingInfo = true;
var lastBar = -1;

var FILLS = [${edges.fills.join(", ")}];
var IMPACTS = [${edges.impacts.join(", ")}];

${trans}

function contains(arr, n) {
  for (var i = 0; i < arr.length; i++) if (arr[i] === n) return true;
  return false;
}

function hit(pitch, vel, startBeat, lengthBeats) {
  var n = new NoteOn;
  n.pitch = pitch;
  n.velocity = vel;
  n.sendAtBeat(startBeat);
  var off = new NoteOff;
  off.pitch = pitch;
  off.sendAtBeat(startBeat + lengthBeats);
}

function ProcessMIDI() {
  var info = GetTimingInfo();
  if (!info.playing) {
    lastBar = -1;
    return;
  }
  var beat = info.blockStartBeat;
  var bar = Math.floor((beat - 1) / 4) + 1;
  if (bar === lastBar) return;
  lastBar = bar;

  var barStart = (bar - 1) * 4 + 1;

  if (contains(IMPACTS, bar)) {
    hit(37, 120, barStart, 0.5);
    hit(49, 100, barStart, 1.0);
  }
  if (contains(FILLS, bar)) {
    hit(38, 108, barStart + 2, 0.2);
    hit(38, 112, barStart + 2.5, 0.2);
    hit(38, 116, barStart + 3, 0.15);
    hit(38, 118, barStart + 3.5, 0.15);
    hit(36, 118, barStart + 3.5, 0.2);
  }
}

function HandleMIDI(e) {
  e.send();
}
`;
}
