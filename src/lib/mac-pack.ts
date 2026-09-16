import { STYLES } from "./catalog";
import { buildCoach, markerList } from "./coach-engine";
import { kicksDocument } from "./kicks";
import { makeMidi, makeSongMidi } from "./midi";
import { notesDocument, slugName } from "./session-export";
import { logicScripter } from "./scripter";
import { transitionsDocument } from "./transitions";
import type { TrackSession } from "./types";
import { downloadBytes, zipStore } from "./zip";

function utf8(s: string) {
  return new TextEncoder().encode(s);
}

function macReadme(session: TrackSession): string {
  const style = STYLES[session.style];
  return `HELPER for Logic Pro on Mac
=============================

This is a Logic MIDI FX plug-in (Scripter). Logic will not load a website
as an Audio Unit. Paste the script.

1. New software instrument
2. Sampler / Drum Machine Designer
     C1 extra PVC, C#1 impact, D1 fill, C#2 crash
3. MIDI FX → Scripter → paste HELPER-Scripter.js → Run Script
4. Extra kicks fire at ${style.name} phrase edges
5. Drag ${slugName(session.name)}-logic.mid onto arrange

Project: ${session.name}
Style: ${style.name} (${style.aka})
${session.bpm} BPM · ${session.key}
`;
}

export function downloadMacPack(session: TrackSession) {
  const pack = buildCoach(session);
  const slug = slugName(session.name);
  const markers = markerList(session);
  const encoderFiles = [
    { name: "README-MAC.txt", data: utf8(macReadme(session)) },
    { name: "HELPER-Scripter.js", data: utf8(logicScripter(session)) },
    { name: `${slug}-notes.txt`, data: utf8(notesDocument(session, pack)) },
    { name: "pvc-kicks.txt", data: utf8(kicksDocument(session)) },
    { name: "transitions.txt", data: utf8(transitionsDocument(session)) },
    {
      name: "MARKERS.txt",
      data: utf8(markers.map((m) => `${m.time}  bar ${m.bar}  ${m.label}`).join("\n")),
    },
    {
      name: `${slug}-logic.mid`,
      data: makeSongMidi({
        bpm: session.bpm,
        key: session.key,
        bars: 16,
        markers: markers.map((m) => ({ bar: m.bar - 1, label: m.label })),
      }),
    },
    {
      name: "extra-kick.mid",
      data: makeMidi("extra-kick", { bpm: session.bpm, key: session.key, bars: 16 }),
    },
    {
      name: "pvc-fill.mid",
      data: makeMidi("pvc-fill", { bpm: session.bpm, key: session.key, bars: 16 }),
    },
    {
      name: "snare-roll.mid",
      data: makeMidi("snare-roll", { bpm: session.bpm, key: session.key, bars: 16 }),
    },
  ];
  const zip = zipStore(encoderFiles);
  downloadBytes(zip, `${slug}-helper-logic-mac.zip`, "application/zip");
}
