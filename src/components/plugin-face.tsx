import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Pause,
  Play,
  Upload,
} from "lucide-react";
import { STYLE_LIST, STYLES, timestampForBar, totalBars } from "@/lib/catalog";
import { buildCoach } from "@/lib/coach-engine";
import { barFromTime, detectBpm, secondsPerBar, timeFromBar } from "@/lib/listen";
import { MONITORS, speakersFor } from "@/lib/speakers";
import { useTrack } from "@/lib/store";
import type { SectionKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FILL: Record<SectionKind, string> = {
  intro: "bg-section-intro",
  break: "bg-section-break",
  build: "bg-section-build",
  drop: "bg-section-drop",
  outro: "bg-section-outro",
};

export function PluginFace() {
  const session = useTrack((s) => s.session);
  const setBar = useTrack((s) => s.setBar);
  const setStyle = useTrack((s) => s.setStyle);
  const patch = useTrack((s) => s.patch);
  const [playing, setPlaying] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [songName, setSongName] = useState<string | null>(null);
  const [heardBpm, setHeardBpm] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const micRef = useRef<{
    stream: MediaStream;
    ctx: AudioContext;
    raf: number;
  } | null>(null);

  const profile = STYLES[session.style];
  const total = totalBars(session.style);
  const bar = Math.min(session.bar, total - 1);
  const pack = buildCoach({ ...session, bar });
  const section = profile.arrangement.find(
    (s) => bar >= s.startBar && bar < s.startBar + s.bars,
  );
  const spots = speakersFor(session.style);
  const msPerBar = secondsPerBar(session.bpm) * 1000;
  const followFile = Boolean(songName && audioRef.current);

  useEffect(() => {
    if (!playing || followFile || micOn) return;
    const id = window.setInterval(() => {
      const next = useTrack.getState().session.bar + 1;
      const max = totalBars(useTrack.getState().session.style);
      if (next >= max) {
        setPlaying(false);
        return;
      }
      useTrack.getState().setBar(next);
    }, msPerBar);
    return () => window.clearInterval(id);
  }, [playing, msPerBar, followFile, micOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songName) return;
    if (playing) void audio.play();
    else audio.pause();
  }, [playing, songName]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songName) return;
    const onTime = () => {
      const bpm = useTrack.getState().session.bpm;
      const max = totalBars(useTrack.getState().session.style);
      useTrack.getState().setBar(barFromTime(audio.currentTime, bpm, max));
    };
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [songName]);

  useEffect(() => {
    return () => stopMic();
  }, []);

  function jump(delta: number) {
    const next = Math.max(0, Math.min(total - 1, bar + delta));
    setBar(next);
    const audio = audioRef.current;
    if (audio && songName) audio.currentTime = timeFromBar(next, session.bpm);
  }

  async function onPickSong(file: File) {
    stopMic();
    const url = URL.createObjectURL(file);
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.src = url;
    const bpm = await detectBpm(file);
    if (bpm) {
      patch({ bpm });
      setHeardBpm(bpm);
    } else {
      setHeardBpm(null);
    }
    audio.currentTime = timeFromBar(useTrack.getState().session.bar, useTrack.getState().session.bpm);
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
        const gap = (60 / useTrack.getState().session.bpm) * 650;
        if (energy > 900 && now - last > gap) {
          last = now;
          beats += 1;
          if (beats % 4 === 0) {
            const st = useTrack.getState();
            const max = totalBars(st.session.style);
            if (st.session.bar + 1 < max) st.setBar(st.session.bar + 1);
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

  const phrasePos = section ? bar - section.startBar + 1 : 1;
  const atEdge = section ? phrasePos === section.bars || phrasePos === 1 : false;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-2xl tracking-wide">HARDSTYLE HELPER</p>
          <p className="font-mono text-xs tabular-nums text-muted">
            {session.bpm} BPM · {session.key}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            size="icon"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button size="icon" variant="secondary" onClick={() => jump(-1)} aria-label="Back 1 bar">
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={() => jump(1)} aria-label="Forward 1 bar">
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="icon"
            variant={micOn ? "default" : "secondary"}
            onClick={() => void toggleMic()}
            aria-label="Listen with mic"
          >
            <Mic className="size-4" />
          </Button>
          <Button
            size="icon"
            variant={songName ? "default" : "secondary"}
            onClick={() => fileRef.current?.click()}
            aria-label="Load song"
          >
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
            {timestampForBar(session.bpm, bar)}
            {micOn ? " · mic" : ""}
            {songName ? ` · ${songName}` : " · drop bounce"}
            {heardBpm ? ` · heard ${heardBpm}` : ""}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Bar</p>
            <p className="font-display text-7xl leading-none tracking-wide tabular-nums">
              {bar + 1}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted">Section</p>
            <p className="font-display text-3xl tracking-wide">{section?.label ?? "—"}</p>
            <p className="mt-1 font-mono text-xs tabular-nums text-muted">
              {phrasePos}/{section?.bars ?? 0}
              {atEdge ? " · edge" : ""}
            </p>
          </div>
        </div>

        <div className="mt-5 flex h-10 overflow-hidden rounded-md shadow-border">
          {profile.arrangement.map((sec) => {
            const active = bar >= sec.startBar && bar < sec.startBar + sec.bars;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setBar(sec.startBar);
                  const audio = audioRef.current;
                  if (audio && songName) audio.currentTime = timeFromBar(sec.startBar, session.bpm);
                }}
                className={cn(
                  "min-w-0 flex-1 text-[0] transition-opacity",
                  FILL[sec.kind],
                  active ? "opacity-100" : "opacity-50",
                )}
                style={{ flexGrow: sec.bars }}
                aria-label={`${sec.label} bar ${sec.startBar + 1}`}
                title={sec.label}
              />
            );
          })}
        </div>

        <div className="mt-5 rounded-lg bg-surface-2 px-4 py-4 shadow-border">
          <p className="text-xs uppercase tracking-wider text-muted">Do this now</p>
          <p className="mt-2 text-base font-medium leading-snug text-pretty">{pack.nextMove}</p>
          {pack.barPlan[0] ? (
            <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
              {pack.barPlan[0].detail}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
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
                <p className="text-xs text-subtle text-pretty">{sp.ref}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {STYLE_LIST.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStyle(st.id)}
              className={cn(
                "h-9 rounded-md px-3 text-xs font-medium",
                st.id === session.style
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted shadow-border hover:text-foreground",
              )}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
