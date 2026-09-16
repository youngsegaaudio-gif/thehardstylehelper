import type { ReactNode } from "react";
import { LAYER_LABELS, STYLE_LIST, STYLES } from "@/lib/catalog";
import { useTrack } from "@/lib/store";
import { KEYS, LAYER_IDS } from "@/lib/types";
import type { LayerId, MusicalKey, StyleId } from "@/lib/types";
import { progressionLabel } from "@/lib/voicings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function NativeSelect({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full appearance-none rounded-md bg-surface-2 px-3 text-sm text-foreground shadow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </select>
  );
}

export function SessionPanel() {
  const session = useTrack((s) => s.session);
  const patch = useTrack((s) => s.patch);
  const setStyle = useTrack((s) => s.setStyle);
  const toggleLayer = useTrack((s) => s.toggleLayer);
  const newTrack = useTrack((s) => s.newTrack);
  const saveCurrent = useTrack((s) => s.saveCurrent);
  const loadPreset = useTrack((s) => s.loadPreset);
  const loadSession = useTrack((s) => s.loadSession);
  const saved = useTrack((s) => s.saved);
  const presets = useTrack((s) => s.presets);
  const profile = STYLES[session.style];

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
      <div className="flex flex-col gap-2">
        <Label htmlFor="track-name">Track</Label>
        <Input
          id="track-name"
          value={session.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Untitled track"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Style</Label>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_LIST.map((s) => {
            const on = session.style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id as StyleId)}
                aria-pressed={on}
                className={cn(
                  "h-11 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                  on
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-muted shadow-border hover:text-foreground",
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
        <p className="text-sm leading-relaxed text-muted text-pretty">{profile.energy}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bpm">BPM</Label>
          <Input
            id="bpm"
            type="number"
            min={120}
            max={240}
            value={session.bpm}
            onChange={(e) => patch({ bpm: Number(e.target.value) || session.bpm })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="key">Key</Label>
          <NativeSelect
            id="key"
            value={session.key}
            onChange={(v) => patch({ key: v as MusicalKey })}
          >
            {KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <p className="font-mono text-xs tabular-nums text-muted">
        {profile.progression} → {progressionLabel(session.key)}
      </p>

      <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-muted">
        {profile.dna.slice(0, 3).map((d) => (
          <li key={d} className="text-pretty">
            {d}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <Label>Already in the track</Label>
        <div className="flex flex-wrap gap-1.5">
          {LAYER_IDS.map((id) => {
            const on = session.layers.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleLayer(id as LayerId)}
                aria-pressed={on}
                className={cn(
                  "h-11 rounded-full px-3 text-xs font-medium transition-colors duration-150",
                  on
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-muted shadow-border hover:text-foreground",
                )}
              >
                {LAYER_LABELS[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">What it sounds like now</Label>
        <Textarea
          id="notes"
          value={session.notes}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="Kick is close, no reverse bass, break has a pad, drop feels empty…"
        />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" variant="secondary" onClick={saveCurrent}>
          Save
        </Button>
        <Button className="flex-1" variant="outline" onClick={newTrack}>
          New
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Start from</Label>
        <div className="flex flex-col gap-1.5">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => loadPreset(i)}
              className="h-11 rounded-md px-3 text-left text-sm text-muted shadow-border hover:bg-surface-2 hover:text-foreground"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {saved.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label>Saved</Label>
          <div className="flex flex-col gap-1.5">
            {saved.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => loadSession(s.id)}
                className={cn(
                  "h-11 rounded-md px-3 text-left text-sm shadow-border hover:bg-surface-2",
                  s.id === session.id ? "text-foreground" : "text-muted",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
