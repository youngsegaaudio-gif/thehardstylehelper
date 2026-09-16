import assert from "node:assert/strict";
import test from "node:test";
import { buildMacPack, packFiles } from "./mac-pack.ts";
import { phraseEdges, phraseEdges1 } from "./phrase-edges.ts";
import { logicScripter } from "./scripter.ts";
import type { TrackSession } from "./types.ts";

const session: TrackSession = {
  id: "t",
  name: "Raw drop",
  style: "ar-gang",
  bpm: 152,
  key: "G minor",
  bar: 80,
  layers: ["kick"],
  notes: "",
  checked: [],
  aiCoach: null,
  updatedAt: 0,
};

test("Logic Mac pack is the full Gumroad zip, not 16 bars", () => {
  const edges = phraseEdges(session.style);
  const files = packFiles(session);
  const names = files.map((f) => f.name);
  const slug = "raw-drop";

  const required = [
    "README-MAC.txt",
    "LICENSE.txt",
    "MANIFEST.txt",
    "HELPER-Scripter.js",
    `${slug}-notes.txt`,
    "pvc-kicks.txt",
    "transitions.txt",
    "MARKERS.txt",
    "mix-serum-logic.txt",
    `${slug}-logic.mid`,
    "kick.mid",
    "clap.mid",
    "hats.mid",
    "chords.mid",
    "lead.mid",
    "bass.mid",
    "screech.mid",
    "extra-kick.mid",
    "pvc-fill.mid",
    "snare-roll.mid",
  ];
  for (const n of required) {
    assert.ok(names.includes(n), `missing ${n}`);
  }

  const readme = new TextDecoder().decode(files.find((f) => f.name === "README-MAC.txt")!.data);
  assert.match(readme, /NOT an Audio Unit/i);
  assert.match(readme, /Scripter/);
  assert.match(readme, /Drum Machine Designer/);
  assert.doesNotMatch(readme, /sk-ant|api[_-]?key/i);

  const license = new TextDecoder().decode(files.find((f) => f.name === "LICENSE.txt")!.data);
  assert.match(license, /personal/i);
  assert.doesNotMatch(license, /sk-ant|api[_-]?key/i);

  const script = new TextDecoder().decode(files.find((f) => f.name === "HELPER-Scripter.js")!.data);
  const e1 = phraseEdges1(session.style);
  assert.match(script, /NeedsTimingInfo/);
  assert.ok(script.includes(`var FILLS = [${e1.fills.join(", ")}]`));
  assert.ok(script.includes(`var IMPACTS = [${e1.impacts.join(", ")}]`));
  assert.equal(script, logicScripter(session));

  const song = files.find((f) => f.name === `${slug}-logic.mid`)!.data;
  assert.ok(song.byteLength > 4000, "song midi too small for a full arrangement");

  const extra = files.find((f) => f.name === "extra-kick.mid")!.data;
  assert.ok(extra.byteLength > 200);

  assert.ok(edges.total > 16, "arrangement should be a full track");
  assert.ok(edges.fillBars.length >= 4);
  assert.equal(edges.fillBars[0], 15);

  const built = buildMacPack(session);
  assert.equal(built.filename, "raw-drop-helper-logic-mac.zip");
  assert.ok(built.zip.byteLength > 8000);
  assert.equal(built.zip[0], 0x50);
  assert.equal(built.zip[1], 0x4b);
});
