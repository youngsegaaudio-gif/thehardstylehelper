/**
 * Plugin knowledge base. `identify()` maps a scanned plugin name to an entry
 * (or guesses a role from the name), `pick()` chooses the best tool the user
 * actually owns for a job, falling back to the DAW's stock plugin.
 */

export type DawId = "logic" | "ableton" | "fl" | "cubase" | "studio-one" | "bitwig" | "reaper" | "other";

export const DAWS: { id: DawId; label: string; hint: string }[] = [
  { id: "logic", label: "Logic Pro", hint: "Channel EQ, Compressor, Limiter, Phat FX, Alchemy, Quick Sampler." },
  { id: "ableton", label: "Ableton Live", hint: "EQ Eight, Glue, Saturator, Roar, Drum Buss, Operator, Wavetable." },
  { id: "fl", label: "FL Studio", hint: "Parametric EQ 2, Maximus, Fruity Limiter, Gross Beat, Sytrus, Harmor." },
  { id: "cubase", label: "Cubase", hint: "Frequency, Quadrafuzz, Maximizer, Retrologue." },
  { id: "studio-one", label: "Studio One", hint: "Pro EQ3, Fat Channel, Multiband Dynamics." },
  { id: "bitwig", label: "Bitwig", hint: "EQ+, Distortion, Polymer, Grid." },
  { id: "reaper", label: "REAPER", hint: "ReaEQ, ReaComp, ReaXcomp, JS effects." },
  { id: "other", label: "Other / not sure", hint: "Advice falls back to generic plugin types." },
];

export type PluginRole =
  | "eq"
  | "dynamic-eq"
  | "compressor"
  | "multiband"
  | "limiter"
  | "clipper"
  | "saturation"
  | "distortion"
  | "reverb"
  | "delay"
  | "imager"
  | "meter"
  | "synth"
  | "kick"
  | "sampler"
  | "pitch"
  | "vocal"
  | "filter"
  | "modulation"
  | "utility"
  | "transient"
  | "sidechain"
  | "mastering"
  | "resonance"
  | "drums"
  | "amp";

export const ROLE_LABEL: Record<PluginRole, string> = {
  eq: "EQ",
  "dynamic-eq": "Dynamic EQ",
  compressor: "Compressor",
  multiband: "Multiband dynamics",
  limiter: "Limiter",
  clipper: "Clipper",
  saturation: "Saturation",
  distortion: "Distortion",
  reverb: "Reverb",
  delay: "Delay",
  imager: "Stereo imaging",
  meter: "Metering",
  synth: "Synth",
  kick: "Kick synth",
  sampler: "Sampler",
  pitch: "Pitch / tuning",
  vocal: "Vocal processing",
  filter: "Filter",
  modulation: "Modulation (LFO, chorus, phaser)",
  utility: "Utility",
  transient: "Transient shaper",
  sidechain: "Sidechain / ducking",
  mastering: "Mastering suite",
  resonance: "Resonance suppressor",
  drums: "Drum machine",
  amp: "Amp / cabinet",
};

export type KbPlugin = {
  id: string;
  name: string;
  vendor: string;
  match: string[];
  roles: PluginRole[];
  what: string;
  hardstyle: string;
  easy: string;
  hard: string;
  stock?: DawId;
  free?: boolean;
};

const p = (
  id: string,
  name: string,
  vendor: string,
  match: string[],
  roles: PluginRole[],
  what: string,
  hardstyle: string,
  easy: string,
  hard: string,
  extra: { stock?: DawId; free?: boolean } = {},
): KbPlugin => ({ id, name, vendor, match, roles, what, hardstyle, easy, hard, ...extra });

export const PLUGIN_KB: KbPlugin[] = [
  /* ---------------- synths ---------------- */
  p("serum", "Serum", "Xfer Records", ["serum"], ["synth"],
    "Wavetable synth with two wavetable oscillators, sub, noise, a huge filter list, LFO/envelope drag-and-drop modulation and a built-in FX rack.",
    "The hardstyle default. Screeches, supersaw leads, plucks, kick tails, reverse bass, risers — most modern hardstyle leads start here.",
    "Init patch → OSC A basic saw, unison 7, detune 0.15, width 80 → filter MG Low 12 at 60% → Hyper/Dimension + Reverb in FX. Play octaves. That's a lead.",
    "Screech: OSC A saw, WT position modulated by LFO 1 (sync 1/16), Filter → Comb+ with cutoff tracked to keys, Distortion (tube) before the filter, Phaser after, then Hyper. Pitch-bend the first note of every phrase with Env 2 → OSC A pitch."),
  p("serum2", "Serum 2", "Xfer Records", ["serum 2", "serum2"], ["synth", "sampler"],
    "Serum's successor: extra oscillator types (sample, granular, spectral), a modular FX rack, clip sequencer and multi-stage envelopes.",
    "Everything Serum does plus sample-based kicks and vocal chops inside the synth. Spectral oscillator is great for metallic screeches.",
    "Load a saw preset, add the Multiband distortion in FX, then bounce-to-sample your kick and layer it in OSC 3.",
    "Build a kick inside it: OSC A sine with a 3-stage pitch envelope (200 Hz → 45 Hz in 40 ms), Clipper → Distortion → Multiband, then route the tail to a second lane with a longer amp envelope."),
  p("sylenth", "Sylenth1", "LennarDigital", ["sylenth"], ["synth"],
    "Four-oscillator virtual analogue with a famously smooth unison and simple modulation.",
    "The classic 2008–2014 lead synth: supersaws, plucks, chord stabs. Still used for clean euphoric leads.",
    "Preset 'Saw Lead', unison 8, detune 0.3, cutoff 70%, add the built-in delay + reverb. Layer it an octave below Serum.",
    "Chord stab: three oscs saw/saw/square in octaves, Amp env A0 D400 S0 R100, Filter A LP24 with Env B sweeping cutoff, Phaser off, Chorus on."),
  p("massive", "Massive / Massive X", "Native Instruments", ["massive"], ["synth"],
    "Wavetable synth (Massive) and its successor (Massive X) with deep modulation routing and aggressive filters.",
    "Early rawstyle screeches came out of Massive: the Scream filter and Feedback section are the sound of 2012 raw.",
    "Screech preset with the 'Scream' filter, cutoff automated up 8 bars before the drop.",
    "Feedback amount 60–80% into a Daft filter, Insert 1 = Parabolic shaper, dimension expander last. Modulate WT position with a stepper for rhythmic screeches."),
  p("spire", "Spire", "Reveal Sound", ["spire"], ["synth"],
    "Four-oscillator synth with a very wide unison and built-in shaper/FX.",
    "Big euphoric leads and plucks; the 'hardstyle lead' presets are close to the real thing.",
    "Preset lead → unison 4–8 voices, Shaper 'saturation' at 20%, Chorus + Delay on.",
    "Layer two Spire instances: one wide saw (voices 8), one narrow pluck (voices 1, fast decay) for the attack."),
  p("vital", "Vital", "Vital Audio", ["vital"], ["synth"],
    "Free wavetable synth with Serum-like workflow, spectral warping and text-to-wavetable.",
    "A free Serum alternative — screeches, leads, kick tails all work. Text-to-wavetable is fun for vocal-ish screeches.",
    "Same as the Serum lead recipe: saw, unison 7, LP filter at 60%, add the chorus + reverb effects.",
    "Comb filter + formant filter in series, spectral morph 'Formant scale' modulated by an LFO for vowel screeches.", { free: true }),
  p("phaseplant", "Phase Plant", "Kilohearts", ["phase plant", "phaseplant"], ["synth"],
    "Modular-ish synth that hosts Kilohearts' snapin effects per voice.",
    "Kick and screech design with Disperser, Multipass and Faturator inside the synth voice.",
    "Analog generator saw → Multipass lane → Distortion snapin. Instant screech base.",
    "Sample generator with your kick punch, noise generator for the click, analog sine for the tail, each through its own lane with Disperser and Clipper."),
  p("pigments", "Pigments", "Arturia", ["pigments"], ["synth"],
    "Multi-engine synth (wavetable, analog, sample, harmonic, utility) with rich modulation.",
    "Good for cinematic break pads and harmonic-engine screeches.",
    "Wavetable engine saw, add the Multi Filter comb, use the sequencer for rhythmic leads.",
    "Harmonic engine for metallic screeches; modulate the partial spread with a function generator synced to 1/8."),
  p("diva", "Diva", "u-he", ["diva"], ["synth"],
    "Analogue-modelling synth with extremely accurate filters.",
    "Warm reverse bass and analogue-style hard-trance leads for early-hardstyle flavour.",
    "Init → saw, Ladder filter 24 dB, cutoff 40%, resonance 20%, long release. That's an old-school reverse bass base.",
    "Reverse bass: render a 1-beat note, reverse the audio, fade in, saturate — Diva's filter drift keeps it alive."),
  p("omnisphere", "Omnisphere", "Spectrasonics", ["omnisphere"], ["synth", "sampler"],
    "Huge sample + synthesis workstation.",
    "Break atmospheres, choirs, cinematic hits — not usually for the drop.",
    "Search 'choir' or 'pad', layer under the break chords at -12 dB.",
    "Use the Orb to modulate an atmosphere pad across a 32-bar break so it never sits still."),
  p("nexus", "Nexus", "reFX", ["nexus"], ["synth"],
    "Preset rompler with big trance/hardstyle libraries.",
    "Fast pluck and lead layers; the hardstyle expansions are usable straight away.",
    "Pick a pluck, add it under your Serum lead at -6 dB for attack.",
    "Stack a Nexus pluck + Serum saw + octave layer; EQ each so only one owns 1–3 kHz."),
  p("kontakt", "Kontakt", "Native Instruments", ["kontakt"], ["sampler"],
    "Sampler / library host.",
    "Orchestral hits, strings and choirs for euphoric and rawphoric breaks.",
    "Load a string library, play the break chords, high-pass at 200 Hz.",
    "Layer staccato strings with your pluck lead in the build for a cinematic lift."),
  p("alchemy", "Alchemy", "Apple", ["alchemy"], ["synth", "sampler"], "Logic's flagship sample + additive + granular synth.",
    "Break pads, vocal-ish textures and risers. Its granular mode makes long risers from a single vocal chop.",
    "Pick a pad preset, add the Performance controls to a macro and automate it across the break.",
    "Import a vocal chop, switch to granular, slow it down for a 16-bar riser, then resample to audio.", { stock: "logic" }),
  p("es2", "ES2", "Apple", ["es2"], ["synth"], "Logic's classic three-oscillator subtractive synth.",
    "Supersaws and reverse-bass tones without third-party plugins.",
    "Saw ×3 detuned, unison on, cutoff 60%, Chorus. Layer under Serum.",
    "Vector envelope sweeping filter cutoff and osc mix over a 1-bar note for a moving lead.", { stock: "logic" }),
  p("retrosynth", "Retro Synth", "Apple", ["retro synth", "retrosynth"], ["synth"], "Logic's four-engine (analog, sync, table, FM) synth.",
    "Quick supersaw via the Analog engine's Voices spread; FM engine for metallic stabs.",
    "Analog engine, Voices 8 unison, Spread 60. Instant wide lead.",
    "Sync engine with Sync-mod from the envelope for a hoover-style stab.", { stock: "logic" }),
  p("sculpture", "Sculpture", "Apple", ["sculpture"], ["synth"], "Logic's physical-modelling synth.",
    "Metallic textures and risers for xtra-raw breaks.",
    "Preset 'Bells', play one note, reverb it, use it as a break texture.",
    "Modulate Material X/Y with an envelope for a growing metallic riser.", { stock: "logic" }),
  p("quicksampler", "Quick Sampler", "Apple", ["quick sampler", "quicksampler"], ["sampler"], "Logic's one-shot sampler.",
    "Drop a kick sample in, play it chromatically for climax kicks.",
    "Drag your kick in, set to One Shot, play the melody on the keys.",
    "Split kick into punch and tail (two Quick Samplers): only the tail follows the melody, the punch stays at one pitch.", { stock: "logic" }),
  p("sampler", "Sampler (EXS24)", "Apple", ["sampler", "exs24"], ["sampler"], "Logic's full multi-sample instrument.",
    "Layered kicks with velocity zones (soft kick for verses, full kick for drops).",
    "Zone 1 soft kick vel 1–90, zone 2 full kick vel 91–127.",
    "Map punch/tail as separate groups with different envelopes and filter tracking.", { stock: "logic" }),
  p("operator", "Operator", "Ableton", ["operator"], ["synth"], "Ableton's FM synth.",
    "Kick tail synthesis and metallic screeches.",
    "Sine osc A, pitch envelope from the Pitch section: 200 Hz → root in 40 ms. Long decay. That's a tail.",
    "Operator B modulating A at ratio 2 with a fast decay for the punch click, then Saturator after.", { stock: "ableton" }),
  p("wavetable", "Wavetable", "Ableton", ["wavetable"], ["synth"], "Ableton's wavetable synth.",
    "Serum-lite for leads and screeches inside Live.",
    "Basic shapes → saw, unison Classic 6 voices, LP filter, add Chorus-Ensemble.",
    "Modulate wavetable position with a synced LFO and route into the Comb filter for screech.", { stock: "ableton" }),
  p("sytrus", "Sytrus", "Image-Line", ["sytrus"], ["synth"], "FL's FM/subtractive hybrid.",
    "Classic FL hardstyle leads and kick tails.",
    "Preset 'Lead' category, add unison 6 in the OSC tab.",
    "Op 1 sine tail with a pitch envelope, Op 2 noise click; render, then distort in Fruity Fast Dist.", { stock: "fl" }),
  p("harmor", "Harmor", "Image-Line", ["harmor"], ["synth"], "Additive/resynthesis synth.",
    "Screeches and resampled vocal leads.",
    "Image tab: drop a vocal, play it as a lead.",
    "Use the pluck/phaser/prism sections with tempo-synced envelopes for rhythmic screeches.", { stock: "fl" }),
  p("retrologue", "Retrologue", "Steinberg", ["retrologue"], ["synth"], "Cubase's virtual analogue.",
    "Wide saw leads and reverse bass.", "Saw, unison on, filter 60%, chorus.", "Modulate the filter with a synced LFO for pumping leads.", { stock: "cubase" }),

  /* ---------------- kick tools ---------------- */
  p("kick2", "Kick 2", "Sonic Academy", ["kick 2", "kick2"], ["kick"],
    "Kick synthesiser: draw the pitch envelope of a sine/triangle body, layer clicks, add distortion and EQ.",
    "Kick tails and full kicks. Draw the pitch curve to the key, set the length to the beat, distort. This is where many hardstyle kicks are born.",
    "Pick a hardstyle preset, set the last pitch node to your root note (F1 = 43.65 Hz), length 1 beat, render.",
    "Sub node at the root, punch node 3 octaves up at 0 ms with a 35 ms fall, 'Hard' distortion 30%, EQ +4 dB at 250 Hz for the 'tok', render, then chain external distortion."),
  p("kick3", "Kick 3", "Sonic Academy", ["kick 3", "kick3"], ["kick"],
    "Successor to Kick 2 with a multi-band distortion rack, more click layers and per-band pitch envelopes.",
    "Full raw kicks inside one plugin: separate distortion per band, tail and punch on independent curves.",
    "Hardstyle preset → set root note → increase 'Tail' band distortion until the mids growl → render.",
    "Three bands: sub clean, low-mid clipped hard, high band saturated then low-passed at 8 kHz. Pitch-drop the mid band 10 ms slower than the sub for a wider 'tok'."),
  p("bigkick", "BigKick", "Plugin Boutique", ["bigkick", "big kick"], ["kick"], "Kick designer with attack samples and a synthesised body.",
    "Punch + tail kicks quickly.", "Choose an attack sample, set body pitch to root, length 1 beat.", "Export body only, distort separately, re-layer with a clean punch."),
  p("kickstart", "Kickstart", "Nicky Romero / Cableguys", ["kickstart"], ["sidechain"], "One-knob sidechain ducking curve.",
    "Ducks pads, leads and reverbs to the kick without routing a sidechain.",
    "Put it on the lead bus, curve 3, mix 60%.", "Use a shorter curve on the pad than on the lead so the pad ducks harder."),
  p("lfotool", "LFOTool", "Xfer Records", ["lfotool", "lfo tool"], ["sidechain", "modulation"], "Drawable LFO for volume, filter and pan.",
    "Custom sidechain shapes and rhythmic filter gates for screeches.",
    "Volume LFO with a 1/4 dip shape on the lead bus.", "Draw a 1/16 gate on a screech for tremolo rhythm, then a 1/4 duck on top."),
  p("shaperbox", "ShaperBox (VolumeShaper, FilterShaper, …)", "Cableguys", ["shaperbox", "volumeshaper", "filtershaper", "cableguys"], ["sidechain", "modulation", "multiband"], "Multi-effect with drawable curves per band.",
    "Multiband sidechain: duck only the low band of a lead to the kick, keep the highs steady.",
    "VolumeShaper preset 'Sidechain 1/4', mix 70%.", "Split at 200 Hz: duck the low band 100%, highs 30%, then add a Width curve widening the highs on off-beats."),
  p("duck", "Duck", "Devious Machines", ["devious machines duck", " duck"], ["sidechain"], "Sidechain ducker with drawable curves.",
    "Same job as Kickstart with more control.", "Default curve, mix 60%.", "Trigger from MIDI so the duck follows kick rolls in builds."),

  /* ---------------- EQ ---------------- */
  p("proq", "Pro-Q 3 / Pro-Q 4", "FabFilter", ["pro-q", "proq", "pro q"], ["eq", "dynamic-eq", "resonance"],
    "Linear/natural/zero-latency parametric EQ with dynamic bands, mid/side and a spectrum analyser.",
    "Surgical cuts on kicks, dynamic dips on leads when the kick hits, mid/side high-pass of the sides.",
    "High-pass every non-kick track at 150–250 Hz. Dip 300–500 Hz on the lead 2 dB. Done.",
    "Dynamic band on the lead at 60–120 Hz, sidechained to the kick, -6 dB threshold — the lead gets out of the kick's way only when the kick plays. Mid/side: HP the sides at 200 Hz."),
  p("channeleq", "Channel EQ", "Apple", ["channel eq"], ["eq"], "Logic's 8-band parametric EQ with analyser.",
    "The default EQ for every track in Logic. Good enough for the whole mix.", "HP at 200 Hz on leads, LP at 12 kHz on distorted kicks.", "Use narrow Q (8+) to notch kick resonances after distortion; boost with wide Q only.", { stock: "logic" }),
  p("lineareq", "Linear Phase EQ", "Apple", ["linear phase eq"], ["eq"], "Logic's linear-phase EQ.",
    "Master-bus tilt without phase shift.", "+1 dB shelf at 10 kHz, -1 dB at 300 Hz on the master.", "Only on the master; it adds latency and pre-ringing on transients like kicks.", { stock: "logic" }),
  p("matcheq", "Match EQ", "Apple", ["match eq"], ["eq"], "Learns a spectrum and matches another to it.",
    "Compare your master to a reference track's curve.", "Learn a reference, learn your mix, apply at 30%.", "Use it as a diagnosis: read the difference curve, then make the moves manually.", { stock: "logic" }),
  p("eqeight", "EQ Eight", "Ableton", ["eq eight"], ["eq"], "Ableton's 8-band EQ.",
    "Standard track EQ in Live.", "HP leads at 200 Hz, notch kick resonances.", "Mid/side mode to HP the sides on the master.", { stock: "ableton" }),
  p("parametriceq2", "Fruity Parametric EQ 2", "Image-Line", ["parametric eq 2", "parametric eq"], ["eq"], "FL's 7-band EQ.",
    "Default EQ for FL hardstyle.", "HP leads at 200 Hz.", "Band type 'High shelf' at 8 kHz -2 dB on distorted kicks to tame fizz.", { stock: "fl" }),
  p("frequency", "Frequency", "Steinberg", ["frequency"], ["eq", "dynamic-eq"], "Cubase's 8-band EQ with dynamic bands.",
    "Dynamic dips on leads keyed to the kick.", "HP leads, dynamic band at 100 Hz on the lead.", "Linear phase on the master only.", { stock: "cubase" }),
  p("proeq3", "Pro EQ3", "PreSonus", ["pro eq"], ["eq"], "Studio One's EQ.", "Standard track EQ.", "HP leads at 200 Hz.", "Use the spectrum overlay against the kick.", { stock: "studio-one" }),
  p("reaeq", "ReaEQ", "Cockos", ["reaeq"], ["eq"], "REAPER's EQ.", "Standard track EQ.", "HP leads at 200 Hz.", "Add bands freely; it is unlimited.", { stock: "reaper" }),
  p("tdrnova", "TDR Nova", "Tokyo Dawn", ["nova"], ["dynamic-eq", "eq"], "Free dynamic EQ.",
    "Dynamic dips on leads and de-harshing distorted kicks.", "Band at 3 kHz, dynamic, threshold so it dips 2–3 dB on the loudest hits.", "Sidechain the lead's low band to the kick.", { free: true }),
  p("soothe", "soothe2", "oeksound", ["soothe"], ["resonance", "dynamic-eq"], "Automatic resonance suppressor.",
    "Tames harsh resonances on distorted kicks and screeches without dulling them.", "Preset 'Harsh', depth 30%, on the kick bus.", "Sidechain mode: put it on the lead, feed the kick, and it carves the lead around the kick's spectrum."),
  p("gullfoss", "Gullfoss", "Soundtheory", ["gullfoss"], ["resonance", "mastering"], "Automatic spectral balancer.",
    "Master-bus clarity for muddy hardstyle mixes.", "Recover 30, Tame 30.", "Use only on the master; more than 40% starts to flatten the kick."),

  /* ---------------- dynamics ---------------- */
  p("proc", "Pro-C 2", "FabFilter", ["pro-c", "proc", "pro c"], ["compressor", "sidechain"], "Transparent compressor with sidechain EQ and lookahead.",
    "Glue on the lead bus, sidechain ducking, kick punch control.", "Lead bus: ratio 2:1, attack 10 ms, release auto, 2 dB GR.", "Sidechain from the kick with 20 ms lookahead so the duck starts before the transient."),
  p("compressor-logic", "Compressor", "Apple", ["compressor"], ["compressor", "sidechain"], "Logic's multi-model compressor (Platinum, VCA, FET, Opto).",
    "Everything from bus glue to sidechain pumping.", "Platinum, ratio 2:1, attack 10 ms, 2–3 dB GR on the lead bus.", "Sidechain input = kick, Vintage VCA, ratio 4:1, attack 0, release 120 ms on the pad bus.", { stock: "logic" }),
  p("glue", "Glue Compressor", "Ableton", ["glue compressor", "glue"], ["compressor"], "SSL-style bus compressor.",
    "Lead bus glue.", "Ratio 2, attack 10, release auto, 2 dB GR.", "Range knob limits GR so kicks stay untouched.", { stock: "ableton" }),
  p("fruitylimiter", "Fruity Limiter", "Image-Line", ["fruity limiter"], ["limiter", "compressor", "sidechain"], "FL's limiter/compressor with sidechain.",
    "Sidechain ducking and quick limiting.", "Comp mode, sidechain from kick, ratio 4, release 100 ms.", "Limiter mode on the master with ceiling -0.3 dB.", { stock: "fl" }),
  p("maximus", "Maximus", "Image-Line", ["maximus"], ["multiband", "limiter"], "FL's multiband maximiser.",
    "Multiband control on kicks and the master.", "Master preset, output ceiling -0.3.", "Kick bus: low band slow release for a steady sub, mid band fast for the tok.", { stock: "fl" }),
  p("prol", "Pro-L 2", "FabFilter", ["pro-l", "prol", "pro l"], ["limiter", "meter"], "True-peak limiter with several styles and loudness metering.",
    "The master limiter for most hardstyle releases.", "Style 'Aggressive', ceiling -0.3 dBTP, push input until -6 LUFS-I.", "Two stages: Pro-L 'Transparent' 3 dB, then a clipper, then Pro-L 'Aggressive' for the last 3 dB."),
  p("limiter-logic", "Limiter / Adaptive Limiter", "Apple", ["adaptive limiter", "limiter"], ["limiter"], "Logic's limiters.",
    "Master limiting when you don't own Pro-L.", "Adaptive Limiter, out ceiling -0.3, gain until -6 LUFS.", "Limiter (brickwall) after Adaptive Limiter with lookahead 1 ms to catch true peaks.", { stock: "logic" }),
  p("ozone", "Ozone", "iZotope", ["ozone"], ["mastering", "limiter", "multiband", "imager", "meter"], "Mastering suite: EQ, dynamics, exciter, imager, maximizer.",
    "One-stop master chain. Maximizer IRC IV is loud and clean for hardstyle.", "Master Assistant → then remove everything except EQ + Maximizer.", "Maximizer IRC IV, character 4, ceiling -0.3, plus Imager narrowing below 120 Hz to 0 width."),
  p("promb", "Pro-MB", "FabFilter", ["pro-mb", "promb", "pro mb"], ["multiband"], "Multiband compressor/expander.",
    "Controls the kick tail: hold the sub steady while the distorted mids breathe.", "Kick bus: band 1 <100 Hz, ratio 3:1, slow release; band 2 100–500 Hz, fast.", "Expander on 2–5 kHz to add bite to the kick's click on every hit."),
  p("multipressor", "Multipressor", "Apple", ["multipressor"], ["multiband"], "Logic's 4-band compressor.",
    "Kick tail control and master multiband.", "Kick bus: band 1 <100 Hz ratio 3:1 slow, band 2 100–500 Hz fast.", "Master: gentle 1 dB per band, expansion on the top band.", { stock: "logic" }),
  p("multibanddynamics", "Multiband Dynamics", "Ableton", ["multiband dynamics"], ["multiband"], "Ableton's 3-band compressor/expander.",
    "OTT-style upward compression is built in (preset OTT).", "OTT preset at 30% amount on the lead.", "Kick bus: low band slow, mid band fast, upward expansion on highs.", { stock: "ableton" }),
  p("ott", "OTT", "Xfer Records", ["ott"], ["multiband"], "Free aggressive upward/downward multiband compressor.",
    "The lead and screech secret sauce; also on kick tails for raw density.", "Depth 30% on the lead bus.", "Time 20 ms, depth 50% on a screech, then EQ out the 4 kHz fizz it adds.", { free: true }),
  p("prods", "Pro-DS", "FabFilter", ["pro-ds"], ["vocal"], "De-esser.", "Tames vocal sibilance and screech fizz.", "Vocal preset, 4 dB range.", "Wide-band mode on screeches at 6–9 kHz."),
  p("transientmaster", "Transient Master / Transient shapers", "Native Instruments and others", ["transient master", "transient shaper", "transient", "smack attack", "enveloper"], ["transient"], "Attack/sustain shaper.",
    "More click on kick punches, less ring on claps.", "+20% attack on the punch layer.", "Negative sustain on the tail layer to shorten it without EQ.", { stock: undefined }),
  p("enveloper", "Enveloper", "Apple", ["enveloper"], ["transient"], "Logic's transient shaper.", "Kick punch attack, clap tail control.", "+15% attack on the punch.", "Negative release on the tail layer to shorten it.", { stock: "logic" }),

  /* ---------------- clipping / saturation / distortion ---------------- */
  p("saturn", "Saturn 2", "FabFilter", ["saturn"], ["saturation", "distortion", "multiband"], "Multiband saturator with many drive styles.",
    "Kick tails (multiband), screech grit, master glue.", "Kick: 2 bands split at 150 Hz, 'Warm Tube' on the low, 'Clean Tape' on the high, drive 30%.", "3 bands: sub clean, 150–600 Hz 'Broken Tube' 60% drive, highs 'Rectify' 20%; modulate drive with an envelope follower so the tok bites harder."),
  p("kclip", "KClip / Standard Clip / other clippers", "Kazrog / SIR", ["kclip", "standardclip", "standard clip", "clipper", "gclip"], ["clipper"], "Hard/soft clippers.",
    "Kick punch and master loudness: clipping shaves transients without pumping.", "Master: soft clip 1–2 dB before the limiter.", "Kick punch layer: hard clip 4–6 dB, then a limiter with fast release."),
  p("trash", "Trash 2", "iZotope", ["trash"], ["distortion", "multiband", "filter"], "Multiband distortion with waveshaper curves and convolution.",
    "Raw kick mids: the classic tail distortion.", "Preset 'Kick' category, blend 50%.", "Two stages: Trash on band 2 only (150–600 Hz) with a custom curve, then convolution 'Cabinet' at 20%."),
  p("decapitator", "Decapitator", "Soundtoys", ["decapitator"], ["saturation", "distortion"], "Analogue-modelled saturator.",
    "Kick tails (style E/N), screech warmth.", "Style N, drive 4, punish off, mix 50% on the tail.", "Punish mode on a copy of the tail, low-passed at 500 Hz, blended 20% under the main kick."),
  p("faturator", "Faturator", "Kilohearts", ["faturator"], ["saturation", "distortion"], "Fuzz/saturation with a 'fuzz' colour control.",
    "Kick mids and screech grit.", "Drive 40%, fuzz 20%.", "Inside Multipass on the 200–600 Hz band only."),
  p("disperser", "Disperser", "Kilohearts", ["disperser"], ["filter", "kick"], "All-pass phase disperser.",
    "Turns a clicky kick into a rounder one, or smears a punch into a 'reverse-bass' swell.", "Amount 30% before distortion on the kick.", "High amount + pinch on a sine hit = instant bouncy kick body; distort after."),
  p("multipass", "Multipass", "Kilohearts", ["multipass"], ["multiband", "distortion"], "Multiband snapin host.",
    "Per-band distortion for kicks: clip the mids, leave the sub.", "3 bands, Faturator on band 2, Clipper on band 3.", "Band 2 Disperser → Distortion → Filter; band 1 only a limiter; band 3 Bitcrush 10%."),
  p("khs-distortion", "Kilohearts Distortion / Bitcrush / Frequency Shifter (snapins)", "Kilohearts", ["kilohearts", "khs ", "snap heap", "snapheap"], ["distortion", "modulation"], "Kilohearts single-purpose snapins.",
    "Building blocks for kick and screech chains.", "Distortion 'Overdrive' 30% on a tail.", "Frequency Shifter +8 Hz on a screech for metallic beating."),
  p("saturator", "Saturator", "Ableton", ["saturator"], ["saturation", "distortion"], "Ableton's waveshaper.",
    "Kick tails and screech grit in Live.", "Analog Clip, drive 8 dB, soft clip on.", "Sinoid Fold on a sine tail = harmonics for free; then EQ.", { stock: "ableton" }),
  p("roar", "Roar", "Ableton", ["roar"], ["distortion", "multiband"], "Ableton's multi-stage, multiband distortion.",
    "Raw kick mids and screech stacks.", "Preset 'Kick' style, 3 bands, blend 50%.", "Feedback + mid/side mode: distort the mid only so the kick stays mono.", { stock: "ableton" }),
  p("drumbuss", "Drum Buss", "Ableton", ["drum buss"], ["saturation", "transient"], "Drive + transients + boom.",
    "Extra punch and a tuned 'Boom' under the kick.", "Drive 20%, Boom freq at root, 30%.", "Transients +30 on the punch layer only.", { stock: "ableton" }),
  p("phatfx", "Phat FX", "Apple", ["phat fx"], ["distortion", "multiband", "filter"], "Logic's multi-effect: distortion, bandpass, compressor, filter.",
    "Logic's answer to raw-kick distortion.", "Preset 'Kick' category, then lower the mix to 50%.", "Distortion 'Overdrive' → Bandpass 150–600 Hz → Compressor → Filter; blend under the clean kick.", { stock: "logic" }),
  p("distortion2", "Distortion II / Overdrive / Bitcrusher / Clip Distortion", "Apple", ["distortion ii", "overdrive", "bitcrusher", "clip distortion", "distortion"], ["distortion", "clipper"], "Logic's distortion family.",
    "Kick tails (Clip Distortion), screech crunch (Distortion II), lo-fi (Bitcrusher).", "Clip Distortion drive 10 dB, tone 4 kHz on the tail.", "Bitcrusher downsampling 4× on a screech, then LP 8 kHz.", { stock: "logic" }),
  p("fastdist", "Fruity Fast Dist / Blood Overdrive / Distructor", "Image-Line", ["fast dist", "blood overdrive", "distructor", "fruity soft clipper"], ["distortion", "clipper"], "FL's distortion plugins.",
    "Classic FL kick tails.", "Fast Dist type A, threshold 0.6, mix 60%.", "Distructor with a 3-band split: distort the mids only.", { stock: "fl" }),
  p("quadrafuzz", "Quadrafuzz v2", "Steinberg", ["quadrafuzz"], ["distortion", "multiband"], "Cubase's 4-band distortion.",
    "Kick mids.", "Preset 'Drums', band 2 drive 50%.", "Tape on band 1, tube on band 2, distortion on band 3, off on 4.", { stock: "cubase" }),
  p("guitarrig", "Guitar Rig / Amplitube / amp sims", "NI / IK", ["guitar rig", "amplitube", "amp sim", "bias fx"], ["amp", "distortion"], "Guitar amp and cab simulation.",
    "A secret raw-kick weapon: cab impulses shape the distorted mids like nothing else.", "Any high-gain amp preset, cab only, mix 30% on the tail.", "Chain two cabs (4×12 + 1×12) on the mid band only, then EQ +3 dB at 400 Hz."),
  p("sausage", "Sausage Fattener", "Dada Life", ["sausage"], ["saturation"], "One-knob saturation + compression.", "Quick lead thickness.", "Fatness 30%.", "On the lead bus after OTT."),
  p("camelcrusher", "CamelCrusher", "Camel Audio", ["camelcrusher", "camel crusher"], ["distortion", "filter"], "Free distortion with a filter.", "Kick tails and screech crunch.", "Tube 40%, filter off.", "Mech mode on a screech + LP at 6 kHz.", { free: true }),

  /* ---------------- reverb / delay / space ---------------- */
  p("pror", "Pro-R 2", "FabFilter", ["pro-r"], ["reverb"], "Algorithmic reverb with a decay EQ.",
    "Break pads, lead tails, snare rolls.", "Preset 'Large Hall', decay 3 s, pre-delay 20 ms, low-cut 300 Hz on the send.", "Decay EQ: cut the reverb's lows below 300 Hz and dip 2 kHz so it never fights the lead."),
  p("valhalla", "Valhalla VintageVerb / Room / Supermassive", "Valhalla DSP", ["valhalla", "vintageverb", "supermassive"], ["reverb", "delay"], "Valhalla reverbs (Supermassive is free).",
    "Huge break spaces; Supermassive for risers and vocal tails.", "VintageVerb 'Concert Hall', mix 100% on a send, HP 300 Hz before it.", "Supermassive 'Gemini' on a vocal chop, automate mix up over the last 8 bars of a break.", { free: false }),
  p("chromaverb", "ChromaVerb / Space Designer", "Apple", ["chromaverb", "space designer"], ["reverb"], "Logic's algorithmic and convolution reverbs.",
    "Break reverb and snare-roll tails.", "ChromaVerb 'Hall', decay 3 s, on a send with HP 300 Hz.", "Space Designer with a long IR, reverse the IR for a 1-bar swell into the drop.", { stock: "logic" }),
  p("hybridreverb", "Hybrid Reverb / Reverb", "Ableton", ["hybrid reverb"], ["reverb"], "Ableton's reverbs.", "Break spaces.", "Hall, decay 3 s, HP the input.", "Convolution + algorithm blend for a pad that sits behind the lead.", { stock: "ableton" }),
  p("reeverb", "Fruity Reeverb 2", "Image-Line", ["reeverb"], ["reverb"], "FL's reverb.", "Break spaces.", "Hall preset, HP 300.", "Long decay on a send with a low-pass automation into the drop.", { stock: "fl" }),
  p("timeless", "Timeless 3", "FabFilter", ["timeless"], ["delay", "modulation"], "Creative delay with filters and modulation.",
    "Lead ping-pong, vocal throws, riser delays.", "Ping-pong 1/8 dotted, feedback 35%, HP 400 Hz.", "Tape mode with the filter sweeping on a 4-bar LFO for a moving break."),
  p("echoboy", "EchoBoy", "Soundtoys", ["echoboy"], ["delay"], "Analogue-modelled delay.", "Lead delays with character.", "Ping-pong 1/8, style 'Tape'.", "Rhythm mode for triplet throws on the last bar before a drop."),
  p("tapedelay", "Tape Delay / Stereo Delay", "Apple", ["tape delay", "stereo delay", "delay designer"], ["delay"], "Logic's delays.", "Lead delays.", "Stereo Delay 1/8 dotted L, 1/4 R, feedback 30%.", "Delay Designer with taps every 1/16 fading out for a build-up throw.", { stock: "logic" }),
  p("grossbeat", "Gross Beat", "Image-Line", ["gross beat"], ["modulation", "sidechain"], "Time/volume gating and stutter.",
    "Build-up stutters and sidechain shapes in FL.", "Volume preset 'Sidechain'.", "Time preset 'Half speed' on the last beat of a build.", { stock: "fl" }),
  p("dimension", "Dimension Expander", "Xfer Records", ["dimension expander"], ["imager", "modulation"], "Free chorus-style widener.", "Wide leads.", "Size 50%, mix 30%.", "Only on a copy of the lead HP'd at 500 Hz so the low mids stay mono.", { free: true }),
  p("imager", "Ozone Imager / Wider / A1 Stereo Control", "iZotope / Polyverse / A1", ["imager", "wider", "a1stereocontrol", "stereo control"], ["imager"], "Stereo width tools.",
    "Widen leads, narrow lows.", "Ozone Imager: band 1 <120 Hz width -100 (mono).", "Wider on the lead's high band only; check mono compatibility."),
  p("utility", "Utility", "Ableton", ["utility"], ["utility", "imager"], "Gain, width, mono, phase.", "Mono the low end; mono-check the mix.", "Bass Mono on, 120 Hz.", "Width 130% on a lead's high copy.", { stock: "ableton" }),
  p("gain-logic", "Gain / Direction Mixer", "Apple", ["direction mixer", "gain"], ["utility", "imager"], "Logic's utility tools.", "Mono-check and width.", "Direction Mixer spread 0 on the kick bus.", "Automate spread on the lead from 1.0 to 1.4 in the drop.", { stock: "logic" }),

  /* ---------------- metering ---------------- */
  p("span", "SPAN", "Voxengo", ["span"], ["meter"], "Free spectrum analyser.", "Compare your kick's spectrum to a reference.", "Slope 4.5 dB, average mode.", "Overlay two channels: kick vs reference kick.", { free: true }),
  p("youlean", "Youlean Loudness Meter", "Youlean", ["youlean"], ["meter"], "LUFS / true-peak meter (free version).",
    "Check integrated loudness against the lane target.", "Integrated -6 to -7 LUFS for hardstyle masters.", "Watch short-term: drops at -4.5, breaks around -10.", { free: true }),
  p("multimeter", "MultiMeter / Loudness Meter", "Apple", ["multimeter", "loudness meter", "level meter"], ["meter"], "Logic's analyser + LUFS meter.", "Loudness and spectrum.", "Loudness Meter on the master: -6 LUFS-I target.", "Correlation meter must stay >0.5 in the drop.", { stock: "logic" }),
  p("insight", "Insight", "iZotope", ["insight"], ["meter"], "Full metering suite.", "Loudness, spectrum, vectorscope.", "Loudness tab: -6 LUFS-I.", "Spectrogram to spot kick resonances."),

  /* ---------------- vocals / pitch ---------------- */
  p("melodyne", "Melodyne", "Celemony", ["melodyne"], ["pitch", "vocal"], "Pitch/time editor.", "Tune vocals; re-pitch chops to your key.", "Correct pitch 80%, drift 50%.", "Move a vocal chop's notes to your chord tones for a custom hook."),
  p("autotune", "Auto-Tune", "Antares", ["auto-tune", "autotune"], ["pitch", "vocal"], "Pitch correction.", "Hard-tuned euphoric vocals.", "Retune speed 20 for natural, 0 for the effect.", "Automate retune speed: fast only in the chorus."),
  p("flexpitch", "Flex Pitch", "Apple", ["flex pitch"], ["pitch", "vocal"], "Logic's built-in pitch editor.", "Tune vocals without extra plugins.", "Pitch correction 70% on the vocal region.", "Draw vibrato down on held notes so the vocal sits under the lead.", { stock: "logic" }),
  p("littlealterboy", "Little AlterBoy", "Soundtoys", ["alterboy"], ["pitch", "vocal"], "Formant/pitch shifter.", "Pitched-down raw samples, chipmunk chops.", "Pitch -5, formant -3 for a raw sample.", "Robot mode on a vocal chop as a screech layer."),
  p("vocoder", "Vocoder / EVOC / Vocodex", "Apple / Image-Line", ["evoc", "vocodex", "vocoder"], ["vocal", "synth"], "Vocoders.", "Robot hooks in raw and early hardstyle.", "Carrier saw, modulator vocal, 16 bands.", "Freeze the vocoder on a vowel and play it as a screech.", { stock: undefined }),
  p("nectar", "Nectar", "iZotope", ["nectar"], ["vocal"], "Vocal channel strip.", "Fast euphoric vocal chain.", "Vocal Assistant, then dial back.", "Dynamic EQ dip at 3 kHz keyed from the lead."),
  p("rx", "RX", "iZotope", ["rx"], ["vocal", "utility"], "Audio repair.", "Clean sampled vocals and movie quotes.", "De-noise, de-click.", "Music Rebalance to extract a vocal from a full track."),

  /* ---------------- modulation / misc ---------------- */
  p("phaser", "Phaser / Flanger / Chorus / Modulation delay", "Various", ["phaser", "flanger", "chorus", "ensemble", "modulation delay"], ["modulation"], "Modulation effects.",
    "The screech sound is half phaser. Chorus widens leads.", "Phaser rate 0.3 Hz, feedback 60% on a screech.", "Two phasers in series at slightly different rates for a moving screech."),
  p("infiltrator", "Infiltrator", "Devious Machines", ["infiltrator"], ["modulation", "filter", "distortion"], "Multi-effect sequencer.", "Build-up FX and rhythmic screech mangling.", "Any 'Build' preset on the last 8 bars.", "Sequence a filter + bitcrush + stutter over 1 bar on a screech."),
  p("portal", "Portal", "Output", ["portal"], ["modulation"], "Granular effect.", "Risers and vocal textures.", "Preset 'Riser', automate mix.", "Granular freeze on the last vocal word into the drop."),
  p("cthulhu", "Cthulhu", "Xfer Records", ["cthulhu"], ["utility"], "Chord and arpeggio MIDI tool.", "Chord stabs and arps for euphoric breaks.", "Chord memory: play one note = full chord.", "Arp at 1/16 with a pattern that ducks the root on beat 2 for a pluck riff."),
  p("stepfx", "Step FX / Remix FX / Beat Breaker", "Apple", ["step fx", "remix fx", "beat breaker"], ["modulation", "filter"], "Logic's rhythmic FX.", "Build-up gates, stutters, filter drops.", "Remix FX 'Filter' automated down over a build.", "Beat Breaker on the last bar of a build for a kick stutter.", { stock: "logic" }),
  p("noise-gate", "Noise Gate / Gate", "Various", ["noise gate", "gate"], ["utility"], "Gate.", "Tighten sampled vocals, gate reverb tails on snares.", "Threshold just above the noise.", "Sidechain-gate a pad to a 1/8 hat pattern for rhythm."),
  p("wavesssl", "Waves SSL / API / CLA / Renaissance", "Waves", ["waves", "ssl", "renaissance", "rbass", "vitamin", "l2 ", "l3 ", "c6", "h-delay"], ["compressor", "eq", "limiter", "saturation"], "Waves' console-style bundles.",
    "SSL channel on leads and vocals; RBass for sub harmonics; L2 as a quick limiter.", "SSL E-Channel HP 200 on leads.", "RBass on the kick tail at 40 Hz for sub harmonics in small speakers."),
  p("uad", "UAD / Neve / 1176 / LA-2A / Pultec emulations", "Universal Audio and others", ["uad", "neve", "1176", "la-2a", "la2a", "pultec", "api 2500", "ssl g"], ["compressor", "eq", "saturation"], "Classic hardware emulations.",
    "Colour on vocals and the master; Pultec low boost on the kick sub.", "Pultec 60 Hz boost 2 + atten 1 on the kick bus.", "1176 all-buttons-in on a vocal chop for aggression."),
];

/* ------------------------------------------------------------------ */

const ROLE_HINTS: [RegExp, PluginRole][] = [
  [/\b(eq|equal)/i, "eq"],
  [/comp(ressor)?\b/i, "compressor"],
  [/limit/i, "limiter"],
  [/clip/i, "clipper"],
  [/(satur|tape|tube|warm)/i, "saturation"],
  [/(dist|drive|fuzz|crush|trash|destroy)/i, "distortion"],
  [/(verb|hall|room|plate)/i, "reverb"],
  [/(delay|echo)/i, "delay"],
  [/(stereo|width|wide|imag)/i, "imager"],
  [/(meter|scope|analy|lufs|span)/i, "meter"],
  [/(synth|wave|osc)/i, "synth"],
  [/kick/i, "kick"],
  [/(sampl|drum)/i, "sampler"],
  [/(pitch|tune|melod)/i, "pitch"],
  [/(vocal|voc|voice|de-?ess)/i, "vocal"],
  [/filt/i, "filter"],
  [/(phas|flang|chorus|lfo|mod|trem)/i, "modulation"],
  [/(gain|util|trim|pan|mono)/i, "utility"],
  [/(transient|attack|punch)/i, "transient"],
  [/(sidechain|duck|kickstart)/i, "sidechain"],
  [/(master|maxim)/i, "mastering"],
  [/(multi ?band|mb\b|ott)/i, "multiband"],
  [/(amp|cab)/i, "amp"],
];

export type Identified = {
  cleanName: string;
  kb: KbPlugin | null;
  roles: PluginRole[];
  /** true when the roles were guessed from the name alone */
  guessed: boolean;
};

export function cleanPluginName(raw: string): string {
  return raw
    .replace(/\.(vst3|vst|component|clap|aaxplugin|dll|so|bundle)$/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function identify(raw: string): Identified {
  const cleanName = cleanPluginName(raw);
  const lower = ` ${cleanName.toLowerCase()} `;
  let best: KbPlugin | null = null;
  let bestLen = 0;
  for (const kb of PLUGIN_KB) {
    for (const m of kb.match) {
      const needle = m.toLowerCase();
      // stock plugins are never in a scanned folder; only an exact name claims them
      const hit = kb.stock
        ? lower.trim() === needle.trim()
        : needle.startsWith(" ")
          ? lower.includes(needle)
          : lower.includes(needle.trim());
      if (hit && needle.trim().length > bestLen) {
        best = kb;
        bestLen = needle.trim().length;
      }
    }
  }
  if (best) return { cleanName, kb: best, roles: best.roles, guessed: false };
  const roles: PluginRole[] = [];
  for (const [re, role] of ROLE_HINTS) if (re.test(cleanName) && !roles.includes(role)) roles.push(role);
  return { cleanName, kb: null, roles: roles.length ? roles.slice(0, 2) : ["utility"], guessed: true };
}

export function stockFor(daw: DawId): KbPlugin[] {
  return PLUGIN_KB.filter((k) => k.stock === daw);
}

/**
 * Best plugin the user owns for a role. `owned` is a list of KB ids from the
 * scan. Falls back to the DAW's stock tool, then a generic name.
 */
export function pick(role: PluginRole, owned: string[], daw: DawId, pins?: Partial<Record<PluginRole, string>>): string {
  const pinned = pins?.[role]?.trim();
  if (pinned) return pinned;
  const ownedSet = new Set(owned);
  const third = PLUGIN_KB.find((k) => !k.stock && k.roles.includes(role) && ownedSet.has(k.id));
  if (third) return third.name;
  const stock = PLUGIN_KB.find((k) => k.stock === daw && k.roles.includes(role));
  if (stock) return `${stock.name} (${DAWS.find((d) => d.id === daw)?.label ?? "stock"})`;
  const generic: Partial<Record<PluginRole, string>> = {
    eq: "your DAW's EQ",
    "dynamic-eq": "a dynamic EQ (TDR Nova is free)",
    compressor: "your DAW's compressor",
    multiband: "a multiband compressor (OTT is free)",
    limiter: "your DAW's limiter",
    clipper: "a clipper (any free soft clipper)",
    saturation: "a saturator",
    distortion: "a distortion plugin",
    reverb: "your DAW's reverb",
    delay: "your DAW's delay",
    imager: "a stereo imager / utility",
    meter: "a LUFS meter (Youlean is free)",
    synth: "Serum or Vital (free)",
    kick: "Kick 2/3 or a sampler",
    sidechain: "a sidechain compressor or Kickstart",
    resonance: "a dynamic EQ",
    transient: "a transient shaper",
  };
  return generic[role] ?? ROLE_LABEL[role].toLowerCase();
}

export function rolesOwned(owned: string[]): Set<PluginRole> {
  const set = new Set<PluginRole>();
  for (const id of owned) {
    const kb = PLUGIN_KB.find((k) => k.id === id);
    kb?.roles.forEach((r) => set.add(r));
  }
  return set;
}
