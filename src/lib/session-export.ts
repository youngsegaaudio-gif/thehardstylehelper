import { STYLES } from "./catalog";
import { markerList } from "./coach-engine";
import { kicksDocument } from "./kicks";
import { progressionLabel } from "./voicings";
import { transitionsDocument } from "./transitions";
import type { CoachPack, TrackSession } from "./types";

export function notesDocument(session: TrackSession, pack: CoachPack): string {
  const style = STYLES[session.style];
  const markers = markerList(session);
  const lines: string[] = [
    `HELPER — ${session.name}`,
    `${style.name} (${style.aka}) · ${session.bpm} BPM · ${session.key} · bar ${session.bar + 1}`,
    `Progression: ${style.progression}  →  ${progressionLabel(session.key)}`,
    session.notes.trim() ? `Session: ${session.notes.trim()}` : "",
    session.layers.length ? `In the track: ${session.layers.join(", ")}` : "In the track: (nothing yet)",
    "",
    "DO THIS NOW",
    pack.nextMove,
    "",
    "BAR PLAN",
    ...pack.barPlan.flatMap((n) => [
      `• ${n.title}${n.bars ? `  [${n.bars}]` : ""}${n.tag ? `  (${n.tag})` : ""}`,
      `  ${n.detail}`,
    ]),
    "",
    "SONG MAP",
    ...(pack.songPlan ?? []).map(
      (s) =>
        `bar ${s.startBar + 1}–${s.startBar + s.bars}  ${s.label} (${s.bars} bars)\n  ${s.do}`,
    ),
    "",
    "INSTRUMENTS",
    ...pack.instruments.flatMap((i) => [`• ${i.name} — ${i.role}`, `  ${i.how}`]),
    "",
    "EQ / COMPRESSION",
    ...pack.mix.flatMap((m) => [
      `• ${m.layer}`,
      `  EQ: ${m.eq}`,
      `  Comp: ${m.compression}`,
      `  Chain: ${m.plugins}`,
    ]),
    "",
    "SERUM",
    ...pack.serum.flatMap((r) => [
      `• ${r.title} — ${r.sound}`,
      "  OSC",
      ...r.osc.map((x) => `    - ${x}`),
      "  FILTER / ENV",
      ...r.filterEnv.map((x) => `    - ${x}`),
      "  FX",
      ...r.fx.map((x) => `    - ${x}`),
      "  MIX",
      ...r.mix.map((x) => `    - ${x}`),
    ]),
    "",
    "LOGIC",
    ...pack.logic.flatMap((m) => [`• ${m.title}`, ...m.steps.map((s) => `  - ${s}`)]),
    "",
    "MARKERS  (paste into a Logic note, or set manually)",
    ...markers.map((m) => `${m.time}   bar ${m.bar}   ${m.label}`),
    "",
    kicksDocument(session),
    "",
    transitionsDocument(session),
    "",
    pack.arrangementNote,
    "",
    "Drop the .mid files onto Logic's arrange page. Tempo is embedded.",
  ];
  return lines.filter((x) => x !== undefined).join("\n");
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function slugName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "track";
}
