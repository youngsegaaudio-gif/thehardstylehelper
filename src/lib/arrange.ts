import type { Artist, School } from "./artists";
import type { ArrangementSection, SectionKind } from "./types";

export type FxHit = {
  id: string;
  bar: number;
  name: string;
  length: string;
  how: string;
};

export type LiveMap = {
  seed: number;
  sections: ArrangementSection[];
  fx: FxHit[];
};

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pick<T>(r: () => number, xs: T[]): T {
  return xs[Math.floor(r() * xs.length)]!;
}

function sec(kind: SectionKind, label: string, startBar: number, bars: number, i: number): ArrangementSection {
  return { id: `${kind}-${i}-${startBar}`, kind, label, startBar, bars };
}

function lens(school: School, r: () => number) {
  if (school === "hardcore") {
    return {
      intro: pick(r, [8, 16]),
      break: pick(r, [8, 16]),
      build: pick(r, [8, 16]),
      drop: pick(r, [16, 32]),
      outro: pick(r, [8, 16]),
      secondBreak: r() > 0.4,
    };
  }
  if (school === "lil-texas" || school === "uk") {
    return {
      intro: pick(r, [8, 16]),
      break: pick(r, [16, 24, 32]),
      build: pick(r, [8, 16]),
      drop: 32,
      outro: pick(r, [8, 16]),
      secondBreak: r() > 0.25,
    };
  }
  if (school === "techno") {
    return {
      intro: pick(r, [16, 32]),
      break: pick(r, [8, 16]),
      build: pick(r, [8, 16]),
      drop: pick(r, [32, 32, 16]),
      outro: 16,
      secondBreak: true,
    };
  }
  return {
    intro: pick(r, [16, 16, 32]),
    break: pick(r, [16, 32, 32]),
    build: pick(r, [8, 16, 16]),
    drop: 32,
    outro: pick(r, [8, 16]),
    secondBreak: r() > 0.15,
  };
}

function labels(school: School, artist: string) {
  const raw = school === "ar-gang" || school === "raw";
  const happy = school === "lil-texas" || school === "uk";
  return {
    intro: raw ? "Kick intro" : happy ? "Hook / drums in" : school === "hardcore" ? "Kick wall" : "Groove in",
    break: raw ? "Dark break" : happy ? "Hook break" : school === "hardcore" ? "Stab break" : "Melody break",
    build: happy ? "Snare build" : raw ? "Noise build" : school === "hardcore" ? "Fill" : "Snare build",
    drop: raw ? "Raw drop" : happy ? "Bounce drop" : school === "hardcore" ? "Peak" : "Climax drop",
    outro: "Outro",
    artist,
  };
}

export function generateLive(artist: Artist, seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0): LiveMap {
  const r = rng(seed);
  const L = lens(artist.school, r);
  const names = labels(artist.school, artist.name);
  const sections: ArrangementSection[] = [];
  let bar = 0;
  const push = (kind: SectionKind, label: string, bars: number) => {
    sections.push(sec(kind, label, bar, bars, sections.length));
    bar += bars;
  };

  push("intro", names.intro, L.intro);
  if (r() > 0.55 && L.intro < 32) push("intro", "Groove in", 16);
  push("break", names.break, L.break);
  push("build", `${names.build} 1`, L.build);
  push("drop", `${names.drop} 1`, L.drop);
  if (L.secondBreak) {
    push("break", `${names.break} 2`, pick(r, [16, L.break]));
    push("build", `${names.build} 2`, pick(r, [8, L.build]));
    push("drop", `${names.drop} 2`, L.drop);
  }
  push("outro", names.outro, L.outro);

  return { seed, sections, fx: fxFor(artist, sections, r) };
}

function fxFor(artist: Artist, sections: ArrangementSection[], r: () => number): FxHit[] {
  const hits: FxHit[] = [];
  const school = artist.school;
  const raw = school === "ar-gang" || school === "raw";
  const hc = school === "hardcore";
  const uk = school === "uk" || school === "lil-texas";

  sections.forEach((s, i) => {
    const end = s.startBar + s.bars;
    const next = sections[i + 1];
    if (s.kind === "intro" && next?.kind !== "intro") {
      hits.push({
        id: `rev-${s.id}`,
        bar: end - 1,
        name: "Reverse crash",
        length: "1 bar",
        how: "Reverse a crash into the next section. Center, short tail.",
      });
    }
    if (s.kind === "break") {
      hits.push({
        id: `air-${s.id}`,
        bar: s.startBar,
        name: raw ? "Atmosphere swell" : uk ? "Vocal delay throw" : "Pad swell",
        length: "2 bars",
        how: raw
          ? "Dark noise / reversed vox. Wide. Duck under the kick if it is still in."
          : "Wet throw on the last word of the hook. Stereo delay 1/4.",
      });
    }
    if (s.kind === "build") {
      hits.push({
        id: `noise-${s.id}`,
        bar: s.startBar,
        name: hc ? "Noise rise (short)" : "White noise rise",
        length: `${s.bars} bars`,
        how: hc
          ? "1–8 bars only. Distorted noise, HP 1 kHz."
          : uk
            ? "Snare roll last 4 bars + noise under. No 32-bar poem."
            : raw
              ? "Noise + reverse kick last bar. Skip the pretty snare epic."
              : "White noise whole build. Snare roll last 4. Reverse cym last 2.",
      });
      hits.push({
        id: `roll-${s.id}`,
        bar: end - Math.min(4, s.bars),
        name: uk ? "Snare roll" : raw ? "Fill extras" : "Snare + uplifter",
        length: `${Math.min(4, s.bars)} bars`,
        how: raw
          ? "1/8 then 1/16 extra kicks last 2 bars. Impact on drop 1."
          : "Snare 1/8 → 1/16. Volume up. Cut on the drop downbeat.",
      });
    }
    if (s.kind === "drop") {
      hits.push({
        id: `imp-${s.id}`,
        bar: s.startBar,
        name: "Impact + crash",
        length: "1 hit",
        how: "Crash slightly off-center. Kick dead center. Pickup extra on the last 16th before 1.",
      });
      if (r() > 0.45) {
        hits.push({
          id: `sw-${s.id}`,
          bar: s.startBar + Math.floor(s.bars / 2),
          name: raw ? "Screech throw" : "Lead fill",
          length: "1 bar",
          how: raw ? "One screech in the hole at bar 17 of the drop." : "Octave-up fill, then back.",
        });
      }
    }
    if (s.kind === "outro") {
      hits.push({
        id: `out-${s.id}`,
        bar: s.startBar,
        name: "Strip FX",
        length: `${s.bars} bars`,
        how: "Kill the rise. Leave kick + one motif for the mix-out.",
      });
    }
  });

  return hits.sort((a, b) => a.bar - b.bar);
}

export function fxNear(hits: FxHit[], bar: number): FxHit[] {
  return hits.filter((h) => Math.abs(h.bar - bar) <= 2);
}
