import { STYLES } from "./catalog";
import { buildCoach, markerList } from "./coach-engine";
import { kicksDocument } from "./kicks";
import { makeMidi, makeSongMidi, type MidiKind } from "./midi";
import { phraseEdges } from "./phrase-edges";
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
  const slug = slugName(session.name);
  const { fillBars, impactBars, total } = phraseEdges(session.style);
  const fills = fillBars.map((b) => b + 1).join(", ");
  const impacts = impactBars.map((b) => b + 1).join(", ");
  return `HARDSTYLE HELPER — Logic pack for Mac
=======================================

This zip is the product. It is NOT an Audio Unit.
Do not put this folder in Library/Audio/Plug-Ins.

Project: ${session.name}
Style:   ${style.name} (${style.aka})
         ${session.bpm} BPM · ${session.key} · ${total} bars

WHAT IS IN HERE
---------------
README-MAC.txt          this file
LICENSE.txt             personal-use licence
MANIFEST.txt            file list
HELPER-Scripter.js      paste into Logic MIDI FX → Scripter
${slug}-logic.mid       full song + arrangement markers
kick.mid clap.mid hats.mid chords.mid lead.mid bass.mid screech.mid
extra-kick.mid          extra PVC at phrase edges (C1 / C#1)
pvc-fill.mid            fill on the last bar of each phrase
snare-roll.mid          last 8 bars of each build
${slug}-notes.txt       do-this-now, map, mix, Serum, Logic
pvc-kicks.txt           extra kick recipes
transitions.txt         where to switch
MARKERS.txt             bar + timestamp for every section

LOAD IN LOGIC
-------------
1. File → New. Set the project tempo to ${session.bpm}.
2. Drag ${slug}-logic.mid onto the arrange page.
   Keep the MIDI tempo. Markers land on phrase edges.
3. New software instrument. Sampler or Drum Machine Designer.
   Map these notes:
     C1  (36)  extra / Peak PVC
     C#1 (37)  Impact PVC
     D1  (38)  Fill PVC
     C#2 (49)  crash
4. On that track: MIDI FX → Scripter → Open Script Editor.
   Paste HELPER-Scripter.js (the whole file) → Run Script.
5. Play. Extra kicks and fills fire at phrase edges.

PHRASE EDGES FOR THIS TRACK
---------------------------
Fill bars (last bar of each phrase): ${fills}
Impact bars (first bar of the next): ${impacts}

The extra-kick and pvc-fill MIDI files use the same bars as the Scripter.
If you only want MIDI, skip step 4.

DO NOT
------
- Do not look for an Audio Unit called Hardstyle Helper
- Do not drop this zip into Components
- Do not change the Scripter and the MIDI independently unless you mean to
`;
}

function licenseText(): string {
  return `HARDSTYLE HELPER — personal use licence
=======================================

This pack is licensed to the purchaser for personal music production.
You may use it in your own tracks, including tracks you release.

You may not:
- resell, share, or re-upload this pack
- claim the Scripter or MIDI as your own product
- put the source on a public repo

Not an Audio Unit. Not myclaw. No API keys are included.
`;
}

function mixDocument(session: TrackSession): string {
  const pack = buildCoach(session);
  return [
    `HELPER — Mix / Serum / Logic · ${session.name}`,
    `${session.bpm} BPM · ${session.key}`,
    "",
    "EQ / COMPRESSION",
    ...pack.mix.flatMap((m) => [
      `• ${m.layer}`,
      `  EQ: ${m.eq}`,
      `  Comp: ${m.compression}`,
      `  Chain: ${m.plugins}`,
      "",
    ]),
    "SERUM",
    ...pack.serum.flatMap((r) => [
      `• ${r.title} — ${r.sound}`,
      ...r.osc.map((x) => `  OSC  ${x}`),
      ...r.filterEnv.map((x) => `  ENV  ${x}`),
      ...r.fx.map((x) => `  FX   ${x}`),
      ...r.mix.map((x) => `  MIX  ${x}`),
      "",
    ]),
    "LOGIC",
    ...pack.logic.flatMap((m) => [`• ${m.title}`, ...m.steps.map((s) => `  - ${s}`), ""]),
  ].join("\n");
}

const TRACK_KINDS: MidiKind[] = [
  "kick",
  "clap",
  "hats",
  "chords",
  "lead",
  "bass",
  "screech",
  "snare-roll",
  "extra-kick",
  "pvc-fill",
];

export function packFiles(session: TrackSession): { name: string; data: Uint8Array }[] {
  const pack = buildCoach(session);
  const slug = slugName(session.name);
  const markers = markerList(session);
  const edges = phraseEdges(session.style);
  const midiOpts = {
    bpm: session.bpm,
    key: session.key,
    bars: edges.total,
    fillBars: edges.fillBars,
    impactBars: edges.impactBars,
    rollBars: edges.rollBars,
  };

  const names = [
    "README-MAC.txt",
    "LICENSE.txt",
    "HELPER-Scripter.js",
    `${slug}-notes.txt`,
    "pvc-kicks.txt",
    "transitions.txt",
    "MARKERS.txt",
    "mix-serum-logic.txt",
    `${slug}-logic.mid`,
    ...TRACK_KINDS.map((k) => `${k}.mid`),
  ];

  const files: { name: string; data: Uint8Array }[] = [
    { name: "README-MAC.txt", data: utf8(macReadme(session)) },
    { name: "LICENSE.txt", data: utf8(licenseText()) },
    { name: "HELPER-Scripter.js", data: utf8(logicScripter(session)) },
    { name: `${slug}-notes.txt`, data: utf8(notesDocument(session, pack)) },
    { name: "pvc-kicks.txt", data: utf8(kicksDocument(session)) },
    { name: "transitions.txt", data: utf8(transitionsDocument(session)) },
    {
      name: "MARKERS.txt",
      data: utf8(markers.map((m) => `${m.time}  bar ${m.bar}  ${m.label}`).join("\n")),
    },
    { name: "mix-serum-logic.txt", data: utf8(mixDocument(session)) },
    {
      name: `${slug}-logic.mid`,
      data: makeSongMidi({
        ...midiOpts,
        markers: markers.map((m) => ({ bar: m.bar - 1, label: m.label })),
      }),
    },
    ...TRACK_KINDS.map((kind) => ({
      name: `${kind}.mid`,
      data: makeMidi(kind, midiOpts),
    })),
    {
      name: "MANIFEST.txt",
      data: utf8(
        [
          `HARDSTYLE HELPER pack · ${session.name}`,
          `${STYLES[session.style].name} · ${session.bpm} BPM · ${session.key} · ${edges.total} bars`,
          "",
          ...names,
          "MANIFEST.txt",
        ].join("\n"),
      ),
    },
  ];
  return files;
}

export function buildMacPack(session: TrackSession): { zip: Uint8Array; filename: string; names: string[] } {
  const files = packFiles(session);
  return {
    zip: zipStore(files),
    filename: `${slugName(session.name)}-helper-logic-mac.zip`,
    names: files.map((f) => f.name),
  };
}

export function downloadMacPack(session: TrackSession) {
  const pack = buildMacPack(session);
  downloadBytes(pack.zip, pack.filename, "application/zip");
}
