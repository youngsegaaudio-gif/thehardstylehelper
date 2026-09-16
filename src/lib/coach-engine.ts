import {
  barsLeftInSection,
  family,
  KEY_NOTES,
  LAYER_LABELS,
  sectionAt,
  STYLES,
  timestampForBar,
} from "./catalog";
import { progressionLabel, progressionVoicings, scaleNames } from "./voicings";
import type {
  CoachPack,
  InstrumentIdea,
  LayerId,
  LogicMove,
  MixRecipe,
  NoteItem,
  SectionKind,
  SerumRecipe,
  SongPlanItem,
  TrackSession,
} from "./types";

function has(layers: LayerId[], id: LayerId) {
  return layers.includes(id);
}

function missing(layers: LayerId[], ids: LayerId[]) {
  return ids.filter((id) => !layers.includes(id));
}

function nid(prefix: string, i: number) {
  return `${prefix}-${i}`;
}

export function buildCoach(session: TrackSession): CoachPack {
  const style = STYLES[session.style];
  const section = sectionAt(session.style, session.bar);
  const left = barsLeftInSection(session.style, session.bar);
  const into = session.bar - section.startBar;
  const key = KEY_NOTES[session.key];
  const time = timestampForBar(session.bpm, session.bar);
  const next = missing(session.layers, nextLayers(session, section.kind));

  const barPlan = notesForSection(session, section.kind, into, left);
  const instruments = instrumentIdeas(session, next);
  const mix = mixRecipes(session);
  const serum = serumRecipes(session);
  const logic = logicMoves(session, section.kind);
  const plan = songPlan(session);

  const nextMove = primaryMove(session, section.kind, next, left);

  return {
    headline: `${section.label} · bar ${session.bar + 1}`,
    why: `${style.name} at ${session.bpm} BPM, ${session.key}. ${time} in. ${into} bars into this ${section.bars}-bar phrase, ${left} left. ${style.energy}.`,
    nextMove,
    barPlan,
    instruments,
    mix,
    serum,
    logic,
    arrangementNote: arrangementAdvice(session, section.kind, into, left, key.chords),
    songPlan: plan,
  };
}

function nextLayers(session: TrackSession, kind: string): LayerId[] {
  const f = family(session.style);
  const raw = f === "raw";
  const happy = f === "happy";
  const uk = f === "uk" || f === "happy";
  const up = f === "up";
  const techno = f === "techno";

  if (kind === "intro") {
    return up || raw || techno
      ? ["kick", "atmosphere", "hats"]
      : ["kick", "hats", "atmosphere"];
  }
  if (kind === "break") {
    if (techno) return ["kick", "atmosphere", "fx", "pad"];
    return happy || uk
      ? ["pad", "chords", "vocal", "atmosphere"]
      : ["pad", "atmosphere", "vocal", "chords"];
  }
  if (kind === "build") {
    return ["kick", "clap", "fx", "hats"];
  }
  if (kind === "drop") {
    if (techno) return ["kick", "hats", "clap", "lead", "fx"];
    if (up) return ["kick", "clap", "hats", "lead", "fx"];
    if (raw) return ["kick", "reverse-bass", "screech", "clap", "fx"];
    if (uk) return ["kick", "sub", "chords", "lead", "clap"];
    return ["kick", "reverse-bass", "lead", "clap", "hats"];
  }
  return ["kick", "atmosphere", "fx"];
}

function primaryMove(
  session: TrackSession,
  kind: string,
  next: LayerId[],
  left: number,
): string {
  const name = next[0] ? LAYER_LABELS[next[0]] : null;
  if (kind === "intro" && !has(session.layers, "kick")) {
    return "Program the kick first. Nothing else until the 4/4 punch sits in the room.";
  }
  if (kind === "drop" && !has(session.layers, "kick")) {
    return "You are in a drop with no kick. Stop arranging and finish the kick.";
  }
  if (session.style === "hard-techno" && !has(session.layers, "kick")) {
    return "Build the Peak PVC first (body + click extra + clip). Extra kicks come after the main one slams.";
  }
  if (session.style === "hard-techno" && kind === "build") {
    return left <= 2
      ? "Last 2 beats: Fill PVC roll. Mute Peak PVC for the last bar if you want a slam. Impact PVC on the next downbeat."
      : "Open the kick HP. 8 bars of filter, not a 16-bar snare poem. Extra kick fill on the last bar of this 16.";
  }
  if (
    (session.style === "ar-gang" ||
      session.style === "rawstyle" ||
      session.style === "hardstyle") &&
    kind === "drop" &&
    !has(session.layers, "reverse-bass")
  ) {
    return "Drop needs reverse bass under the kick. Draw it on a Serum track, sidechain it to the kick, then write melody.";
  }
  if (kind === "break" && !has(session.layers, "chords") && !has(session.layers, "pad")) {
    return `Write the ${session.key} progression now (${progressionLabel(session.key)}). The drop lead is this melody, louder.`;
  }
  if (kind === "build") {
    return left <= 8
      ? "Last 8 of the build: open the kick filter, 1/16 snare into 1/32, white-noise rise, reverse cymbal on the downbeat."
      : "Start the snare roll and automate kick HP closing toward 20 Hz. Keep melody filtered.";
  }
  if (name) {
    return `Add ${name.toLowerCase()} next. ${left} bars left in this phrase — commit it before you leave the section.`;
  }
  return "Phrase is stacked. Ride arrangement: mute a layer for 8 bars, then slam it back on the next downbeat.";
}

function notesForSection(
  session: TrackSession,
  kind: string,
  into: number,
  left: number,
): NoteItem[] {
  const key = KEY_NOTES[session.key];
  const voicings = progressionVoicings(session.key);
  const voicingLine = voicings
    .map((v) => `${v.name} (${v.notes.join(" ")})`)
    .join("  ·  ");
  const notes: NoteItem[] = [];
  const raw = session.style === "ar-gang" || session.style === "rawstyle";
  const push = (title: string, detail: string, bars?: string, tag?: string) => {
    notes.push({ id: nid(kind, notes.length), title, detail, bars, tag });
  };

  if (kind === "intro") {
    push(
      "Lock kick + hats only",
      has(session.layers, "kick")
        ? "Filter the kick closed (HP 80–150 Hz) so the drop has somewhere to go. Add a closed hat on 1/8 or 1/16."
        : "Draw a 4/4 kick on C1 for 16 bars. No melody. This is the skeleton Logic will loop.",
      "this 8",
      "arrange",
    );
    push(
      "Atmosphere, not a drop",
      "One noise bed or reversed vocal, high-passed at 400 Hz, reverb long. If it sounds like a drop already, you started too loud.",
      "8–16",
      "layer",
    );
    if (raw) {
      push(
        "Tease reverse bass at −12 dB",
        "Same MIDI as the drop bass, fully filtered. Automate a 2-bar swell into the break so the ear already knows the groove.",
        "last 8",
        "bass",
      );
    }
    if (session.style === "hard-techno") {
      push(
        "Peak PVC + click extra",
        "Main PVC every beat. Click extra layered, 6–8 dB under, HP 2 kHz. No reverse bass. Offbeat hats if the groove is in.",
        "this 16",
        "kick",
      );
    }
  }

  if (kind === "break") {
    if (session.style === "hard-techno") {
      push(
        "Filter the PVC, don't write a chorus",
        "HP or LP the Peak PVC. Ghost PVC keeps the pulse. Atmosphere + one industrial stab. This is a DJ filter break.",
        "full phrase",
        "arrange",
      );
      push(
        "No climax lead",
        "One stab or vocal chop, then out. Extra kicks stay muted until the build.",
        "this 16",
        "layer",
      );
    } else {
    push(
      `Chords in ${session.key}`,
      `Play ${key.chords.join(" – ")} as whole-bar stabs. Voicings: ${voicingLine}. Tight (root, 5th, octave, 3rd). This MIDI becomes the drop lead.`,
      "full phrase",
      "chords",
    );
    push(
      "Strip the kick",
      into < 8
        ? "Mute kick and reverse bass on bar 1 of the break. Leave a filtered ghost kick if you need pulse."
        : "If the kick is still slamming, the break has no contrast. Mute it for at least 8 bars.",
      "bar 1",
      "arrange",
    );
    if (session.style === "darren-styles" || session.style === "happy-hardcore") {
      push(
        "Piano motif",
        "Record a 4-bar piano riff on a Logic EXS/Studio Piano or Serum. Quantize lightly. Double it later with a supersaw, don't replace it.",
        "4-bar loop",
        "lead",
      );
    } else if (session.style === "s3rl" || session.style === "lil-texas") {
      push(
        "Vocal hook first",
        "Drop the vocal phrase on bar 1 of the break. Pitch it, chop it, delay throws on the last word. The drop is this hook + drums.",
        "this 16",
        "vocal",
      );
    } else {
      push(
        "Melody = drop lead",
        `Write 8 bars of melody over the chords. Scale: ${scaleNames(session.key).join(" ")}. Same notes play on a harsher Serum patch in the drop. If you can't hum it, it's not done.`,
        "8–16",
        "lead",
      );
    }
    }
  }

  if (kind === "build") {
    if (session.style === "hard-techno") {
      push(
        "Short switch, not a snare novel",
        left <= 2
          ? "Fill PVC on the last two beats. Optional 1-bar Peak PVC mute. Impact + crash on the next downbeat."
          : "Kick HP 160→20 Hz over these 16. Extra kick fill on the last bar. Reverse extra is 1 bar, not 8.",
        `next ${Math.min(left, 16)}`,
        "arrange",
      );
      push(
        "Hats in",
        "Offbeat hats 4 bars before the peak. 1/16 only if the groove already has offbeats.",
        "last 4",
        "layer",
      );
    } else {
    push(
      "Snare roll map",
      left > 8
        ? "Bars 1–8: 1/8 snares. Then 1/16. Last 2 bars 1/32. Pitch the snare up 2–4 st over the last bar. Download the snare-roll MIDI if you don't want to draw it."
        : "You are in the last 8. Switch to 1/16 then 1/32. Reverse cymbal 2 bars out. White noise rise on a bus.",
      `next ${Math.min(left, 16)}`,
      "arrange",
    );
    push(
      "Kick filter open",
      "Automate Channel EQ high-pass from ~180 Hz down to 20 Hz across the build. The drop kick should feel like a door opening, not a new sample.",
      "full build",
      "mix",
    );
    push(
      "Don't preview the drop lead at full volume",
      "A 2-bar filtered tease is enough. If the lead is fully in, the drop has nothing to add.",
      "last 4",
      "arrange",
    );
    }
  }

  if (kind === "drop") {
    if (session.style === "hard-techno") {
      push(
        "Peak PVC stack",
        "Peak PVC every beat + click extra + sub extra. Mid PVC extra at 15–25% if it needs grit. No reverse bass.",
        "all 32",
        "kick",
      );
      push(
        "Extra kicks at the edges",
        into >= 16
          ? "Second half of the 32: Fill PVC on the last bar, Impact on bar 17. Mute hats 4 bars then slam."
          : "Hold the first 16. Pickup extra on the last 16th into bar 17. Stab every 2 or 4 bars, not a climax lead.",
        into >= 16 ? "bars 17–32" : "bars 1–16",
        "arrange",
      );
    } else if (raw || session.style === "hardstyle") {
      push(
        "Kick + reverse bass first",
        has(session.layers, "reverse-bass")
          ? "Sidechain the bass to the kick (Logic Compressor, fast attack, 80–140 ms release). Bass MIDI: offbeat 1/8 or onbeat filling kick gaps."
          : "Draw reverse-bass MIDI before any screech. Same key, simple rhythm. If this doesn't groove, no lead will save it.",
        "all 32",
        "bass",
      );
      push(
        raw ? "Screech as the hook" : "Climax lead in",
        raw
          ? "Short FM/screech hits on the downbeats of bars 1, 5, 9, 17. Leave air. Raw drops die when every bar is full."
          : "Bring the break melody in on a supersaw, one octave up, shorter amp decay than the break pad.",
        "bars 1–16",
        "lead",
      );
    } else if (session.style === "uptempo") {
      push(
        "Kick wall, then one stab",
        "Distorted kick every 1/4. One hoover or screech stab every 2 or 4 bars. Hats 1/16. That is the drop.",
        "all 32",
        "kick",
      );
    } else {
      push(
        "Drop = hook + bounce",
        "Kick, offbeat bass, clap on 2 and 4, vocal or piano hook. If you have more than five elements, mute two.",
        "all 32",
        "arrange",
      );
    }
    if (into >= 16) {
      push(
        "Second half variation",
        "Add an octave, a new screech rhythm, or mute hats for 4 bars then slam back. Same 16, not a new song.",
        "bars 17–32",
        "arrange",
      );
    } else {
      push(
        "Hold the first 16",
        "Don't change the patch for 16 bars. The crowd (and you) need to learn it.",
        "bars 1–16",
        "arrange",
      );
    }
  }

  if (kind === "outro") {
    push(
      "Subtract, don't add",
      "Strip lead, then bass, then hats. Leave kick + atmosphere for 8 bars. Last hit on a downbeat, no extra crash spam.",
      "this phrase",
      "arrange",
    );
  }

  push(
    session.notes.trim()
      ? "Use what's already in the track"
      : "Write one sentence about the track",
    session.notes.trim()
      ? `You noted: “${session.notes.trim().slice(0, 180)}”. Next layer should serve that, not fight it.`
      : "In the session box, jot what is already bouncing. The coach uses it so it doesn't suggest a second kick.",
    undefined,
    "session",
  );

  return notes;
}

function instrumentIdeas(session: TrackSession, next: LayerId[]): InstrumentIdea[] {
  const key = KEY_NOTES[session.key];
  const ideas: InstrumentIdea[] = [];
  const voicingLine = progressionVoicings(session.key)
    .map((v) => `${v.name}: ${v.notes.join(" ")}`)
    .join(" · ");

  const recipes: Partial<Record<LayerId, InstrumentIdea>> = {
    kick: {
      name: "Kick",
      role: "The drop. Design it before melody.",
      how:
        session.style === "uptempo"
          ? "Start from a gabber/uptempo sample. Saturate, clip, then EQ. Click at 3–5 kHz, body 80–120 Hz. Length under 200 ms."
          : session.style === "hard-techno"
            ? "Peak PVC: Kick 3 or one-shot, 90–130 ms. Distortion then clip 2–4 dB. Layer click extra (HP 2 kHz) and sub extra (sine, gated). See Kicks tab."
            : "Layer a punch sample (50–80 Hz sine body) + click. In Logic: kick on its own track, no send reverb. Tune the body to " +
              session.key.split(" ")[0] +
              ".",
    },
    "reverse-bass": {
      name: "Reverse bass",
      role: "Hardstyle groove under the kick",
      how: `Serum: saw or square, low cutoff, distortion after filter. MIDI in ${session.key}, rhythm filling kick gaps. Sidechain from kick.`,
    },
    sub: {
      name: "Sub / rolling bass",
      role: "UK hardcore / happy rolling bass",
      how: "Sine or lightly saturated square on offbeats (the 'and' of each beat). HP at 30 Hz, LP at 120 Hz. Sidechain 2–4 dB.",
    },
    chords: {
      name: "Chord stabs",
      role: "Harmony for break and drop",
      how: `${key.chords.join(" – ")} in ${session.key}. ${voicingLine}. Stab on beat 1 of each bar. Serum unison 5–7, short decay. Export MIDI from HELPER.`,
    },
    lead: {
      name: "Lead",
      role: session.style === "ar-gang" || session.style === "rawstyle" ? "Secondary to screech" : "Drop hook",
      how: `Supersaw, 7–9 voices, detune 0.2–0.3. Write the melody in the break first. Scale ${scaleNames(session.key).join(" ")}. HP 180 Hz on the way out of Serum.`,
    },
    screech: {
      name: "Screech",
      role: "Rawstyle drop identity",
      how: "Serum FM: osc A sine, osc B as FM source, high ratio. Short env. Automate FM amount per hit. Mid-highs only (HP 1 kHz).",
    },
    vocal: {
      name: "Vocal",
      role: session.style === "s3rl" ? "The entire song" : "Break hook / drop chop",
      how: "Pitch to key. In Logic: Flex Pitch, then delay throw (1/4 or 1/8 dotted) on the last word. Chop into a sampler for drop hits.",
    },
    pad: {
      name: "Pad",
      role: "Break bed",
      how: `Same chords as the stabs, longer release, more reverb. Keep it under −18 dB. LP at 4 kHz so the lead has room.`,
    },
    hats: {
      name: "Hats",
      role: "Speed and bounce",
      how:
        session.bpm >= 170
          ? "Open hat on offbeats, closed 1/8 or 1/16. Bus compress 2:1. HP 300 Hz."
          : "Closed 1/8. Add 1/16 in the second drop only.",
    },
    clap: {
      name: "Clap / snare",
      role: "Backbeat",
      how: "Clap on 2 and 4. Layer a snare with a 3 kHz crack. In builds, this sample becomes the roll.",
    },
    fx: {
      name: "FX / risers",
      role: "Transitions",
      how: "White noise rise 8 bars, reverse crash 2 bars out, downlifter into the drop. Logic: Space Designer short plate on the FX bus, not every track.",
    },
    atmosphere: {
      name: "Atmosphere",
      role: "Intro / break air",
      how: "Field recording, reversed vocal, or Serum noise osc. HP 250 Hz, huge reverb, duck it 3 dB when the kick is in.",
    },
  };

  const order = next.length
    ? next
    : session.layers.length
      ? session.layers
      : (["kick", "lead", "fx"] as LayerId[]);
  for (const id of order) {
    const r = recipes[id];
    if (r) ideas.push(r);
    if (ideas.length >= 5) break;
  }
  return ideas;
}

function mixRecipes(session: TrackSession): MixRecipe[] {
  const recipes: MixRecipe[] = [
    {
      layer: "Kick",
      eq: "HP 25–30 Hz. Body +2–4 dB at 50–80 Hz (tune to key). Scoop 250–400 Hz if muddy. Click +2 dB at 3–5 kHz.",
      compression: "Logic Compressor Vintage VCA, 4:1, attack 10–30 ms (keep transient), release 50–80 ms. 3–5 dB GR.",
      plugins: "Channel EQ → Compressor → Overdrive/Clip (1–2 dB) → Limiter on kick bus only.",
    },
  ];

  if (session.style === "hard-techno") {
    recipes[0] = {
      layer: "Peak PVC",
      eq: "HP 28 Hz. Body +3–5 dB at 70–95 Hz (tune to key). Scoop 280–450 Hz. Click +2–4 dB at 3.5–5 kHz.",
      compression: "Distort, then clip 2–4 dB. Comp 4:1, attack 8–20 ms, release 40–70 ms. 3–5 dB GR.",
      plugins: "Kick 3 → Channel EQ → Kilohearts Distortion / Overdrive → clipper → Logic Comp or Pro-C. Click extra on a second track, HP 2 kHz.",
    };
    recipes.push({
      layer: "Extra PVC / fills",
      eq: "Fill layer HP 60 Hz. Impact can have 150 Hz for one hit. Ghost HP 120 Hz at −12 dB.",
      compression: "Same clipper idea. Fills should read without adding sub.",
      plugins: "Duplicate kick track. extra-kick.mid and pvc-fill.mid from HELPER. Scripter fires fills at 16s.",
    });
  }

  if (
    session.style !== "uptempo" &&
    session.style !== "darren-styles" &&
    session.style !== "happy-hardcore" &&
    session.style !== "s3rl" &&
    session.style !== "hard-techno"
  ) {
    recipes.push({
      layer: "Reverse bass",
      eq: "HP 40 Hz. Body 80–180 Hz. Cut 300 Hz. Presence 1–2 kHz if it disappears under the kick.",
      compression:
        "Sidechain from kick. Logic Compressor, attack 0–5 ms, release 80–140 ms at 150 BPM (shorter at 170+). 6–10 dB GR on each kick.",
      plugins:
        "Serum → Channel EQ → Compressor (sc) → Tape/Overdrive. Optional FabFilter Pro-C 2 Pump mode if you have it.",
    });
  } else if (session.style !== "uptempo" && session.style !== "hard-techno") {
    recipes.push({
      layer: "Rolling / offbeat bass",
      eq: "HP 30 Hz, LP 150–200 Hz. Tiny bump at 70–90 Hz.",
      compression: "Sidechain 3–6 dB from kick, faster release at 170 BPM (~70–100 ms).",
      plugins: "Bass track → Channel EQ → Compressor (sc) → optional Exciter.",
    });
  }

  recipes.push({
    layer: "Lead / screech bus",
    eq: "HP 180–250 Hz. Cut 400–600 Hz. Presence 2–5 kHz. De-ess 6–8 kHz if harsh.",
    compression: "2:1 glue, attack 15 ms, release 80 ms. Then sidechain 2–3 dB to kick so the punch wins.",
    plugins: "Serum → Channel EQ → Compressor → Delay (send) → Space Designer (send, not insert on the drop).",
  });

  if (has(session.layers, "vocal") || session.style === "s3rl" || session.style === "lil-texas") {
    recipes.push({
      layer: "Vocal",
      eq: "HP 120–180 Hz. Cut 300–400 Hz. Presence 2–4 kHz. Tame 6–8 kHz if the pitch-up is harsh.",
      compression: "3:1, attack 5–10 ms, release 80 ms. 3–6 dB GR. Then a delay send, not a wash.",
      plugins: "Channel EQ → Compressor → Flex Pitch → Delay send (Bus 8) → optional De-esser.",
    });
  }

  recipes.push({
    layer: "Mix bus",
    eq: "Gentle HP 20 Hz. Tilt: −1 dB at 300 Hz, +1 dB at 8 kHz if dull. Don't EQ the bus to fix a bad kick.",
    compression: "2:1, slow attack, 1–2 dB GR. Soft clip into limiter. Aim −8 to −6 LUFS for a DJ-ready drop, not −4.",
    plugins: "Logic Adaptive Limiter last. Optional: FabFilter Pro-L 2 or a soft clipper before it.",
  });

  return recipes;
}

function serumRecipes(session: TrackSession): SerumRecipe[] {
  const key = KEY_NOTES[session.key];
  const chords = key.chords.join(" – ");
  const voicings = progressionVoicings(session.key);
  const voicingLine = voicings.map((v) => `${v.name} = ${v.notes.join(" ")}`).join(". ");
  const lead: SerumRecipe = {
    title: "Supersaw lead",
    sound: `Drop lead in ${session.key}. Melody from the break, shorter amp decay. Scale ${scaleNames(session.key).join(" ")}.`,
    osc: [
      "Osc A: Analog_BD_Saw or Basic Saw. Unison 7–9, detune 0.22–0.32, blend ~0.3.",
      "Osc B: same saw, +7 or +12 semitones, unison 5, mix 30–45%.",
      "Noise osc: 5–8% white, for attack. Fine-tune A to the key root.",
    ],
    filterEnv: [
      "Filter: MG Low 24. Cutoff around 800 Hz–2 kHz. Env amount +30–50%.",
      "Env 1 (amp): A 0, H 0, D 180–280 ms, S 55–70%, R 180–250 ms for a climax lead. Shorter D/S for stabs.",
      "Env 2 (filter): faster decay than amp so the start bites then tames.",
      "LFO 1: triangle, 1/4, slight cutoff or detune for movement — not a wub.",
    ],
    fx: [
      "Hyper / Dimension: 30–50% (width lives here, not in a huge unison).",
      "Distortion: Tube or Diode, mix 15–25%, after filter.",
      "Chorus: optional, 10–15%.",
      "Delay: ping-pong 1/8 or 1/8 dotted, mix 12–18%, HP the delay 400 Hz.",
      "Reverb: small plate, mix 8–12% in the patch. Real space goes on a Logic send.",
    ],
    mix: [
      "High-pass at 180 Hz inside Serum or first insert in Logic.",
      "Sidechain 2–3 dB to the kick.",
      "If it masks the kick click, dip 3–5 kHz 1 dB on the lead.",
      "One patch. Don't stack three supersaws — unison is the stack.",
    ],
  };

  const chord: SerumRecipe = {
    title: "Chord stabs",
    sound: `${chords} in ${session.key}. One stab per bar, or 1 and 3. ${voicingLine}.`,
    osc: [
      "Osc A: saw, unison 5–7, detune 0.18. Play the voicing (root, 5th, octave, 3rd on top).",
      "Osc B: square or saw, −12, mix 20% for body.",
      "Do not unison-detune so hard the third beats. If the chord wobbles, lower detune.",
    ],
    filterEnv: [
      "Low 24, cutoff 1–2 kHz for break pads, 2–4 kHz for drop stabs.",
      "Amp env: A 0–20 ms, D 300–600 ms, S 0–20%, R 200 ms for stabs. For pads: S 70%, R 1–2 s.",
    ],
    fx: [
      "Dimension 25%. Chorus 10%. Delay 1/4 at 10% in the break only.",
      "Reverb bigger in the break (mix 20%), almost off in the drop.",
    ],
    mix: [
      "HP 120 Hz. Chords do not own the kick band.",
      "Pan Dimension wide; keep a mono-compatible mid (root + 5th).",
      "Export the MIDI from HELPER and drop it on this track in Logic.",
    ],
  };

  const bass: SerumRecipe =
    session.style === "hard-techno" || session.style === "uptempo"
      ? {
          title: "Sub extra (not reverse bass)",
          sound: `Sine under the PVC in ${session.key}. Mute in intro.`,
          osc: [
            "Osc A: basic sine, no unison, −24 from the kick tune.",
            "Osc B: off. This is a sub extra, not a groove bass.",
          ],
          filterEnv: [
            "LP 80 Hz. Amp env follows the kick gate (A 0, D 80–120 ms, S 0, R 40 ms).",
          ],
          fx: ["No distortion on the sine. Distort the Peak PVC instead."],
          mix: ["Gated from the kick. Peak sections only."],
        }
      : session.style === "darren-styles" ||
          session.style === "happy-hardcore" ||
          session.style === "s3rl"
        ? {
          title: "Rolling bass",
          sound: `Offbeat bass in ${session.key}, 170-style bounce.`,
          osc: [
            "Osc A: basic sine or analog square, no unison.",
            "Osc B: slightly distorted square, mix 20%, same pitch.",
            "Warp: none. This is a bass, not a lead.",
          ],
          filterEnv: [
            "Low 12 or 24, cutoff 120–250 Hz.",
            "Amp env: A 0, D 80–120 ms, S 0, R 40 ms so it pumps with the kick.",
          ],
          fx: ["Mild distortion 10%. No reverb. Tiny compressor inside Serum optional."],
          mix: [
            "LP 150 Hz in Logic. Sidechain to kick.",
            "MIDI: 8th notes on the offbeats (the 'and'). Download Bass MIDI.",
          ],
        }
      : {
          title: "Reverse bass",
          sound: `Hardstyle reverse bass in ${session.key}.`,
          osc: [
            "Osc A: saw or square, unison 1–3 max. Detune low.",
            "Osc B: sine −12 for sub, mix 30–50%.",
            "Drive in Osc / Warp (or distortion FX) after the filter, not before.",
          ],
          filterEnv: [
            "Low 24. Cutoff 200–600 Hz depending on how raw.",
            "Env 2 to cutoff, short decay, so each note has a bite then sits under the kick.",
            "Amp: A 0, D 200–400 ms, S 40–70%, R 80 ms. Shape until it fills kick gaps without smearing.",
          ],
          fx: [
            "Distortion: heavy, mix to taste. Filter then distort is the rawstyle move.",
            "No reverb. No delay. Width from a little Hyper only.",
          ],
          mix: [
            "Sidechain from kick, 6–10 dB. If the kick disappears, the bass is too wide or too 3 kHz.",
            "Tune the fundamental to the key root.",
            "Logic: bass track + kick as the only things in the 50–120 Hz band.",
          ],
        };

  const extra: SerumRecipe =
    session.style === "hard-techno"
      ? {
          title: "Industrial stab",
          sound: `Short mid stab in ${session.key}. Not a climax lead.`,
          osc: [
            "Osc A: saw or square, unison 3, detune 0.1.",
            "Osc B: noise 10% for metal.",
          ],
          filterEnv: [
            "Low 24 or band, cutoff 800 Hz–3 kHz.",
            "Amp: A 0, D 120–220 ms, S 0, R 80 ms. One-shot every 2 or 4 bars.",
          ],
          fx: ["Distortion 20%. Tiny delay throw. No big reverb."],
          mix: ["HP 180 Hz. Sidechain 2 dB to the PVC. Mute in the intro."],
        }
      : session.style === "ar-gang" || session.style === "rawstyle" || session.style === "uptempo"
      ? {
          title: "Screech / FM hit",
          sound: "Short mid-high scream. Hook of a raw drop.",
          osc: [
            "Osc A: sine. Osc B: sine or saw used as FM source (set Osc A FM from B).",
            "High FM ratio. Unison 1. This is not a saw stack.",
          ],
          filterEnv: [
            "Band or high-pass around 1–4 kHz.",
            "Amp env: A 0, D 80–180 ms, S 0, R 40–80 ms. One-shot.",
            "Mod wheel or LFO on FM amount for variation per bar.",
          ],
          fx: ["Distortion 20–40%. Delay 1/8 throw at 15%. Tiny plate."],
          mix: [
            "HP 1 kHz. It must not fight the kick body.",
            "Place on downbeats. Mute every second bar in the first 16 if it fatigues.",
          ],
        }
      : {
          title: "Piano-double saw",
          sound: "Layer this under a Logic piano so the drop still feels like the riff.",
          osc: [
            "Osc A: saw, unison 5, detune 0.15 — tighter than the climax lead.",
            "Play the same MIDI as the piano, one octave up optional.",
          ],
          filterEnv: [
            "Low 24, cutoff follows the piano (brighter in drop).",
            "Amp matches piano decay.",
          ],
          fx: ["Dimension 20%. Delay send in Logic, not in Serum."],
          mix: ["Sit 6–8 dB under the piano in the break, 2–3 dB under in the drop."],
        };

  return [lead, chord, bass, extra];
}

function logicMoves(session: TrackSession, kind: string): LogicMove[] {
  const bpm = session.bpm;
  const release = bpm >= 190 ? "60–90 ms" : bpm >= 165 ? "70–110 ms" : "80–140 ms";
  return [
    {
      title: "Session setup",
      steps: [
        `Set project tempo to ${bpm}. Time signature 4/4. Key ${session.key}.`,
        "Create markers from HELPER's marker list (copy, then Marker List in Logic).",
        "Drop the full-song multi-track MIDI onto the arrange page — kick, clap, hats, chords, lead, bass land as separate regions. Markers sit on phrase edges.",
        "Cycle a 16-bar loop around the playhead. Write inside the loop, then duplicate.",
        "Color: kick red, bass orange, leads yellow, vox green, FX blue — whatever you'll remember at 3am.",
      ],
    },
    {
      title: "Sidechain kick → bass / leads",
      steps: [
        "On the bass (and later lead bus): Logic Compressor.",
        "Side chain input: Kick track. Circuit: Vintage VCA or Platinum.",
        `Attack 0–5 ms, release ${release}, ratio 4:1 to 8:1.`,
        "Hold down the kick and watch GR. You want a hole for the punch, not a 20 dB gulp unless it's a pumping reverse bass.",
        "Alternative: Kilohearts/FabFilter Pro-C 2 if you already live there. Same attack/release idea.",
      ],
    },
    {
      title: "Routing",
      steps: [
        "Bus 1: Kick (no reverb sends).",
        "Bus 2: Bass / reverse bass.",
        "Bus 3: Musical (chords, lead, screech) with a delay send (Bus 8) and a short plate (Bus 9).",
        "Bus 4: Vox. Bus 5: FX. All into Stereo Out.",
        "Do not put a reverb insert on the kick or reverse bass.",
      ],
    },
    {
      title:
        kind === "build"
          ? "Build automation in Logic"
          : kind === "drop"
            ? "Drop playlist"
            : "Break playlist",
      steps:
        kind === "build"
          ? [
              "Lane 1: Channel EQ HP freq on the kick, 180 Hz → 20 Hz across the build.",
              "Lane 2: snare region — or drop HELPER's snare-roll MIDI and swap the sound.",
              "Lane 3: white-noise region, volume −∞ to −12 dB.",
              "Bounce in place the snare roll if it starts to tax CPU.",
            ]
          : kind === "drop"
            ? [
                "Duplicate the 16-bar drop. On the copy, add one layer or mute hats for 4 bars.",
                "Option-drag regions to the second drop — don't rewrite MIDI from scratch.",
                "Use Track Alternatives if you're A/B'ing kick chains.",
              ]
            : [
                "Mute kick/bass with region mutes, not volume automation, so the drop hits at 0 dB.",
                "Flex Pitch on vox. Delay send automated on last words of phrases.",
                "Keep the break 6–10 dB quieter than the drop on the master — contrast is arrangement.",
              ],
    },
    {
      title: "Drop MIDI onto Logic",
      steps: [
        "Download the Mac Logic pack (zip): Scripter plug-in, MIDI, PVC kicks, transitions, markers.",
        "Drag the full-song Logic MIDI onto arrange — tempo is embedded, tracks split out, markers on phrase edges.",
        "Paste HELPER-Scripter.js into MIDI FX → Scripter on an extra-kick sampler track.",
        "HELPER is not an Audio Unit. It writes MIDI, Scripter, and chains you drop in.",
      ],
    },
  ];
}

function planLine(session: TrackSession, kind: SectionKind): string {
  const chords = progressionLabel(session.key);
  const raw = session.style === "ar-gang" || session.style === "rawstyle";
  const up = session.style === "uptempo";
  const uk = session.style === "darren-styles" || session.style === "happy-hardcore";

  if (kind === "intro") {
    if (up) return "Kick wall filtered, industrial FX bed. No melody.";
    if (session.style === "hard-techno")
      return "Peak PVC + hats. Click extra in. Sub extra muted until the peak.";
    if (raw) return "Kick intro, then groove. Reverse bass teased at −12 dB, not full.";
    if (session.style === "s3rl") return "Hook tease — vocal or lead fragment, drums in quietly.";
    return "Kick + hats. Filter the kick closed. Atmosphere only.";
  }
  if (kind === "break") {
    if (session.style === "darren-styles")
      return `Piano motif over ${chords}. Kick out. This riff is the drop.`;
    if (session.style === "s3rl" || session.style === "lil-texas")
      return `Vocal hook on bar 1. Chords ${chords}. Keep it catchy and short.`;
    if (raw) return `Dark pad, sparse stab on ${chords}. Spoken or chopped vox. No climax lead.`;
    if (session.style === "hard-techno")
      return "Filter the Peak PVC. Ghost kick keeps pulse. One stab max. DJ tool break.";
    return `Write the melody over ${chords}. Mute kick. This melody is the drop lead.`;
  }
  if (kind === "build") {
    if (session.style === "hard-techno")
      return "Kick HP open 8–16 bars. Fill PVC last bar. 1-bar reverse extra. Impact on the peak downbeat.";
    return "Snare 1/8 → 1/16 → 1/32. Kick HP 180→20 Hz. Reverse cymbal last 2 bars. Lead filtered.";
  }
  if (kind === "drop") {
    if (session.style === "hard-techno")
      return "Peak PVC stack + click + sub. Extra kick fills every 16. Stab every 2–4 bars. Leave air.";
    if (up) return "Distorted kick every beat. One stab every 2–4 bars. Hats 1/16. Nothing else.";
    if (raw) return "Kick + reverse bass locked. Screech on downbeats of 1, 5, 9, 17. Leave air.";
    if (uk) return "Kick, offbeat bass, piano doubled by supersaw. Clap 2 and 4.";
    if (session.style === "s3rl" || session.style === "lil-texas")
      return "Hook + bounce. Kick, offbeat bass, vocal/lead. Mute two elements if it clouds.";
    return "Reverse bass + kick, climax lead from the break (octave up, shorter decay). Hold 16 bars.";
  }
  return "Strip lead, then bass, then hats. Kick + atmosphere out. End on a downbeat.";
}

function songPlan(session: TrackSession): SongPlanItem[] {
  return STYLES[session.style].arrangement.map((sec) => ({
    id: sec.id,
    label: sec.label,
    kind: sec.kind,
    startBar: sec.startBar,
    bars: sec.bars,
    do: planLine(session, sec.kind),
  }));
}

function arrangementAdvice(
  session: TrackSession,
  kind: string,
  into: number,
  left: number,
  chords: string[],
): string {
  const style = STYLES[session.style];
  return `${style.name} map: ${style.progression} (${chords.join(" – ")}). You are ${into} bars into ${kind}, ${left} left. ${style.dna[0]} ${style.dna[1]}`;
}

export function markerList(session: TrackSession): { bar: number; time: string; label: string }[] {
  const style = STYLES[session.style];
  return style.arrangement.map((s) => ({
    bar: s.startBar + 1,
    time: timestampForBar(session.bpm, s.startBar),
    label: s.label,
  }));
}
