import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Pause,
  Play,
  Upload,
} from "lucide-react";
import { ARTISTS, SCHOOLS, mapBars, styleIdFor, type School } from "@/lib/artists";
import { fxNear, generateLive, type LiveMap } from "@/lib/arrange";
import { STYLES, timestampForBar } from "@/lib/catalog";
import { buildCoach } from "@/lib/coach-engine";
import { kicksFor } from "@/lib/kicks";
import { barFromTime, detectBpm, secondsPerBar, timeFromBar } from "@/lib/listen";
import { downloadLive } from "@/lib/logic-template";
import { MONITORS, speakersFor } from "@/lib/speakers";
import { studioFor } from "@/lib/studio";
import { transitionsAtPlayhead } from "@/lib/transitions";
import type { SectionKind, TrackSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FILL: Record<SectionKind, string> = {
  intro: "bg-section-intro",
  break: "bg-section-break",
  build: "bg-section-build",
  drop: "bg-section-drop",
  outro: "bg-section-outro",
};

function sessionFor(
  artist: (typeof ARTISTS)[number],
  liveBar: number,
  kind: SectionKind,
  bpm: number,
): TrackSession {
  const style = styleIdFor(artist.school);
  const arr = STYLES[style].arrangement;
  const match = arr.find((s) => s.kind === kind) ?? arr[0];
  return {
    id: "helper",
    name: artist.name,
    style,
    bpm,
    key: artist.key,
    bar: match.startBar,
    layers: ["kick"],
    notes: "",
    checked: [],
    aiCoach: null,
    updatedAt: Date.now(),
  };
}

export function HardstyleFace() {
  const [school, setSchool] = useState<School | "all">("ar-gang");
  const [q, setQ] = useState("");
  const [id, setId] = useState("ar-gang");
  const [bar, setBar] = useState(0);
  const [bpmOverride, setBpmOverride] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [songName, setSongName] = useState<string | null>(null);
  const [heardBpm, setHeardBpm] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const micRef = useRef<{ stream: MediaStream; ctx: AudioContext; raf: number } | null>(null);
  const [live, setLive] = useState<LiveMap>(() =>
    generateLive(ARTISTS.find((a) => a.id === "ar-gang") ?? ARTISTS[0], 1),
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ARTISTS.filter((a) => {
      if (school !== "all" && a.school !== school) return false;
      if (needle && !a.name.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [school, q]);

  const artist = ARTISTS.find((a) => a.id === id) ?? ARTISTS[0];
  const bpm = bpmOverride ?? artist.bpm;
  const total = mapBars(live.sections);
  const clamped = Math.min(bar, total - 1);
  const section = live.sections.find(
    (s) => clamped >= s.startBar && clamped < s.startBar + s.bars,
  );
  const kind: SectionKind = section?.kind ?? "intro";
  const nowFx = fxNear(live.fx, clamped);
  const studio = studioFor(artist, live.seed);
  const style = styleIdFor(artist.school);
  const sess = sessionFor(artist, clamped, kind, bpm);
  const pack = buildCoach(sess);
  const kicks = kicksFor(style);
  const hits = transitionsAtPlayhead(sess);
  const spots = speakersFor(style);
  const msPerBar = secondsPerBar(bpm) * 1000;
  const followFile = Boolean(songName && audioRef.current);

  useEffect(() => {
    const a = ARTISTS.find((x) => x.id === id) ?? ARTISTS[0];
    setLive(generateLive(a));
    setBar(0);
    setBpmOverride(null);
    setPlaying(false);
  }, [id]);

  useEffect(() => {
    if (!playing || followFile || micOn) return;
    const handle = window.setInterval(() => {
      setBar((b) => {
        if (b + 1 >= total) {
          setPlaying(false);
          return b;
        }
        return b + 1;
      });
    }, msPerBar);
    return () => window.clearInterval(handle);
  }, [playing, msPerBar, followFile, micOn, total]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songName) return;
    if (playing) void audio.play();
    else audio.pause();
  }, [playing, songName]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songName) return;
    const onTime = () => setBar(barFromTime(audio.currentTime, bpm, total));
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [songName, bpm, total]);

  useEffect(() => () => stopMic(), []);

  function regen() {
    setLive(generateLive(artist));
    setBar(0);
    setPlaying(false);
  }

  function jump(delta: number) {
    const next = Math.max(0, Math.min(total - 1, clamped + delta));
    setBar(next);
    const audio = audioRef.current;
    if (audio && songName) audio.currentTime = timeFromBar(next, bpm);
  }

  async function onPickSong(file: File) {
    stopMic();
    setMicOn(false);
    const url = URL.createObjectURL(file);
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.src = url;
    const heard = await detectBpm(file);
    if (heard) {
      setBpmOverride(heard);
      setHeardBpm(heard);
    } else setHeardBpm(null);
    audio.currentTime = timeFromBar(clamped, heard ?? bpm);
    setSongName(file.name);
    setPlaying(true);
    void audio.play();
  }

  async function toggleMic() {
    if (micOn) {
      stopMic();
      setMicOn(false);
      return;
    }
    setPlaying(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      await ctx.resume();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let last = 0;
      let beats = 0;
      const loop = () => {
        analyser.getByteFrequencyData(data);
        let energy = 0;
        for (let i = 1; i < 10; i++) energy += data[i];
        const now = performance.now();
        const gap = (60 / bpm) * 650;
        if (energy > 900 && now - last > gap) {
          last = now;
          beats += 1;
          if (beats % 4 === 0) {
            setBar((b) => (b + 1 < total ? b + 1 : b));
          }
        }
        const handle = requestAnimationFrame(loop);
        if (micRef.current) micRef.current.raf = handle;
      };
      micRef.current = { stream, ctx, raf: requestAnimationFrame(loop) };
      setMicOn(true);
    } catch {
      setMicOn(false);
    }
  }

  function stopMic() {
    const m = micRef.current;
    if (!m) return;
    cancelAnimationFrame(m.raf);
    m.stream.getTracks().forEach((t) => t.stop());
    void m.ctx.close();
    micRef.current = null;
  }

  const phrasePos = section ? clamped - section.startBar + 1 : 1;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-3xl tracking-wide">HARDSTYLE HELPER</p>
            <p className="mt-1 text-xs text-muted">Bar coach + map + mix. Kick 3 / Serum / FabFilter / Logic.</p>
          </div>
          <p className="font-mono text-xs tabular-nums text-muted">
            {bpm} BPM · {artist.key}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="icon" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button size="icon" variant="secondary" onClick={() => jump(-1)} aria-label="Back 1 bar">
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={() => jump(1)} aria-label="Forward 1 bar">
            <ChevronRight className="size-4" />
          </Button>
          <Button size="icon" variant={micOn ? "default" : "secondary"} onClick={() => void toggleMic()} aria-label="Mic">
            <Mic className="size-4" />
          </Button>
          <Button size="icon" variant={songName ? "default" : "secondary"} onClick={() => fileRef.current?.click()} aria-label="Load song">
            <Upload className="size-4" />
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPickSong(f);
              e.target.value = "";
            }}
          />
          <p className="min-w-0 flex-1 truncate font-mono text-xs tabular-nums text-muted">
            {timestampForBar(bpm, clamped)}
            {micOn ? " · mic" : ""}
            {songName ? ` · ${songName}` : " · drop bounce"}
            {heardBpm ? ` · heard ${heardBpm}` : ""}
          </p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Artist"
          className="mt-4 h-11 w-full rounded-md bg-surface-2 px-3 text-sm shadow-border outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SCHOOLS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSchool(s.id)}
              className={cn(
                "h-9 rounded-md px-3 text-xs font-medium",
                school === s.id ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted shadow-border",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
          {list.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setId(a.id)}
              className={cn(
                "h-9 rounded-md px-3 text-xs font-medium",
                a.id === artist.id ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted shadow-border",
              )}
            >
              {a.name}
            </button>
          ))}
        </div>

        <Button className="mt-4 w-full" onClick={regen}>
          New arrangement
        </Button>
        <p className="mt-2 font-mono text-xs tabular-nums text-muted">
          {artist.name} · seed {live.seed} · {total} bars
        </p>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Do this now</p>
          <p className="mt-2 text-base font-medium leading-snug text-pretty">{pack.nextMove}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{studio.idea}</p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Bar</p>
            <p className="font-display text-6xl leading-none tracking-wide tabular-nums">{clamped + 1}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted">Section</p>
            <p className="font-display text-2xl tracking-wide">{section?.label ?? "—"}</p>
            <p className="mt-1 font-mono text-xs tabular-nums text-muted">
              {phrasePos}/{section?.bars ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-3 flex h-10 overflow-hidden rounded-md shadow-border">
          {live.sections.map((sec) => {
            const on = clamped >= sec.startBar && clamped < sec.startBar + sec.bars;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setBar(sec.startBar);
                  const audio = audioRef.current;
                  if (audio && songName) audio.currentTime = timeFromBar(sec.startBar, bpm);
                }}
                className={cn("min-w-0 text-[0] transition-opacity", FILL[sec.kind], on ? "opacity-100" : "opacity-50")}
                style={{ flexGrow: sec.bars }}
                title={sec.label}
                aria-label={sec.label}
              />
            );
          })}
        </div>

        <ol className="mt-4 flex flex-col gap-2">
          {live.sections.map((sec) => (
            <li key={sec.id}>
              <button
                type="button"
                onClick={() => setBar(sec.startBar)}
                className="flex w-full items-baseline justify-between gap-3 text-left"
              >
                <span className={cn("text-sm", section?.id === sec.id ? "text-foreground" : "text-muted")}>
                  {sec.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  bar {sec.startBar + 1} · {sec.bars}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Build the track</p>
          <ol className="mt-2 flex flex-col gap-2">
            {studio.build.map((step, i) => (
              <li key={step} className="text-sm leading-relaxed text-pretty">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Next bars</p>
          <ul className="mt-2 flex flex-col gap-3">
            {pack.barPlan.slice(0, 4).map((n) => (
              <li key={n.id}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{n.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Instruments</p>
          <ul className="mt-2 flex flex-col gap-3">
            {studio.instruments.map((ins) => (
              <li key={ins.name}>
                <p className="text-sm font-medium">{ins.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{ins.how}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">PVC / extra kicks</p>
          <ul className="mt-2 flex flex-col gap-3">
            {kicks.map((k) => (
              <li key={k.id}>
                <p className="text-sm font-medium">
                  {k.name}{" "}
                  <span className="font-mono text-xs font-normal text-muted">{k.kind}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{k.where}</p>
                <p className="mt-1 text-xs leading-relaxed text-subtle text-pretty">{k.plugins}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Transitions</p>
          <ul className="mt-2 flex flex-col gap-3">
            {hits.map((t) => (
              <li key={t.id}>
                <p className="text-sm font-medium">
                  {t.what}
                  {t.near ? <span className="ml-2 font-mono text-xs text-muted">now</span> : null}
                </p>
                <p className="mt-1 font-mono text-xs tabular-nums text-muted">
                  {t.at} · {t.bars}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{t.how}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Speakers</p>
          <p className="mt-2 text-xs leading-relaxed text-muted text-pretty">{MONITORS[0]}</p>
          <ul className="mt-3 flex flex-col gap-3">
            {spots.map((sp) => (
              <li key={sp.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{sp.name}</p>
                  <p className="font-mono text-xs tabular-nums text-muted">
                    {sp.pan === 0 ? "C" : sp.pan > 0 ? `R ${sp.pan}` : `L ${Math.abs(sp.pan)}`}
                  </p>
                </div>
                <div className="relative mt-1 h-2 rounded-full bg-surface-3">
                  <span
                    className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                    style={{ left: `${((sp.pan + 100) / 200) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted text-pretty">{sp.place}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Mix · your plugs</p>
          <ul className="mt-2 flex flex-col gap-3">
            {studio.mix.map((m) => (
              <li key={m.layer}>
                <p className="text-sm font-medium">{m.layer}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{m.chain}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Serum</p>
          <ul className="mt-2 flex flex-col gap-3">
            {pack.serum.slice(0, 3).map((s) => (
              <li key={s.title}>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{s.sound}</p>
                <p className="mt-1 text-xs leading-relaxed text-subtle text-pretty">{s.osc.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Logic</p>
          <ul className="mt-2 flex flex-col gap-3">
            {pack.logic.slice(0, 3).map((m) => (
              <li key={m.title}>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{m.steps[0]}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Master</p>
          <ul className="mt-2 flex flex-col gap-2">
            {studio.master.map((m) => (
              <li key={m} className="text-sm leading-relaxed text-pretty">
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">FX now</p>
          {nowFx.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No FX on this bar. Edges get the hits.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {nowFx.map((fx) => (
                <li key={fx.id}>
                  <p className="text-sm font-medium">
                    {fx.name}{" "}
                    <span className="font-mono text-xs font-normal tabular-nums text-muted">
                      bar {fx.bar + 1} · {fx.length}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{fx.how}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">FX template</p>
          <ul className="mt-2 flex flex-col gap-2">
            {live.fx.map((fx) => (
              <li key={fx.id} className="flex items-baseline justify-between gap-3">
                <span className="text-sm">{fx.name}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted">bar {fx.bar + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button className="mt-4 w-full" variant="secondary" onClick={() => downloadLive(artist, live, studio)}>
          Save Logic notes
        </Button>
        <a
          className="mt-2 flex h-11 w-full items-center justify-center rounded-md bg-surface-2 text-sm font-medium shadow-border"
          href="/HELPER.html"
          download="HELPER.html"
        >
          Download sidecar
        </a>
        <p className="mt-2 text-xs leading-relaxed text-subtle text-pretty">
          Not an Audio Unit. Play walks bars. Upload a bounce to follow the song. Open HELPER.html next to Logic.
        </p>
      </div>
    </div>
  );
}
