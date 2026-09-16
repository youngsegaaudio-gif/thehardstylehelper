import { progressionVoicings, scaleNames } from "@/lib/voicings";
import type { MusicalKey } from "@/lib/types";

export function ChordStrip({ musicalKey }: { musicalKey: MusicalKey }) {
  const voicings = progressionVoicings(musicalKey);
  const scale = scaleNames(musicalKey);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl tracking-wide">Chords in {musicalKey}</h3>
        <p className="font-mono text-xs tabular-nums text-muted">
          {scale.join("  ")}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {voicings.map((v) => (
          <li key={v.name} className="rounded-lg bg-surface p-3 shadow-border">
            <p className="font-display text-lg tracking-wide">{v.name}</p>
            <p className="mt-1 font-mono text-xs tabular-nums text-muted">{v.intervals}</p>
            <p className="mt-2 text-sm text-foreground">{v.notes.join("  ")}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm leading-relaxed text-muted text-pretty">
        Stab on beat 1. Root, 5th, octave, 3rd on top. Drop this MIDI on a Serum track.
      </p>
    </div>
  );
}
