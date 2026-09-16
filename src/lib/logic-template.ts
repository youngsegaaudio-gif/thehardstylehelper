import type { Artist } from "./artists";
import { mapBars } from "./artists";
import type { LiveMap } from "./arrange";
import type { StudioPack } from "./studio";

export function liveTemplateText(artist: Artist, live: LiveMap, studio: StudioPack) {
  const total = mapBars(live.sections);
  return [
    `HARDSTYLE HELPER — Logic notes. Not an Audio Unit.`,
    `${artist.name} · ${artist.bpm} BPM · ${artist.key} · ${total} bars · seed ${live.seed}`,
    ``,
    `IDEA`,
    `  ${studio.idea}`,
    ``,
    `BUILD`,
    ...studio.build.map((s, i) => `  ${i + 1}. ${s}`),
    ``,
    `INSTRUMENTS`,
    ...studio.instruments.map((x) => `  ${x.name}: ${x.how}`),
    ``,
    `MIX (Kick 3, Serum, FabFilter, Kilohearts, Logic)`,
    ...studio.mix.map((x) => `  ${x.layer}: ${x.chain}`),
    ``,
    `MASTER`,
    ...studio.master.map((x) => `  - ${x}`),
    ``,
    `ARRANGEMENT`,
    ...live.sections.map((s) => `  Bar ${s.startBar + 1}  ${s.label}  (${s.bars} bars)`),
    ``,
    `FX`,
    ...live.fx.map((f) => `  Bar ${f.bar + 1}  ${f.name}  [${f.length}]  ${f.how}`),
    ``,
    `Logic: empty tracks + Arrangement markers. File → Save as Template.`,
  ].join("\n");
}

export function downloadLive(artist: Artist, live: LiveMap, studio: StudioPack) {
  const blob = new Blob([liveTemplateText(artist, live, studio)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `HELPER-${artist.id}-${live.seed}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}
