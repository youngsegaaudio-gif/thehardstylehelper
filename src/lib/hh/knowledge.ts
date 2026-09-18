/** Hardstyle information: history, glossary, labels/events, FAQ and studio sayings. */

export type Era = { years: string; title: string; body: string };

export const HISTORY: Era[] = [
  { years: "1999–2002", title: "Out of hard house and hard trance", body: "Dutch and Italian producers slow hard trance down, keep the hard house off-beat bass and the gabber attitude, and hardstyle appears on labels like Fusion, Titanic and Blutonium. The first Qlimax is 2000; by 2002 'hardstyle' is a room at every Q-dance event." },
  { years: "2003–2006", title: "The reverse-bass years", body: "Short dry kicks, reverse bass on the off-beat, screeches and tribal percussion. Showtek, The Prophet, Deepack, Technoboy, DJ Isaac, Zany and Pavo define the sound. Scantraxx (The Prophet, 2002) becomes the home label. Defqon.1 starts in 2003." },
  { years: "2007–2011", title: "Nu-style and the tuned kick", body: "The kick grows a long, tuned tail and melody takes over: Headhunterz, Wildstylez, Noisecontrollers, Brennan Heart, Project One. 150 BPM, 32-bar breaks, climax kicks. Hardstyle becomes a stadium sound; Q-dance's Qlimax and Defqon.1 sell out." },
  { years: "2011–2015", title: "The split: euphoric vs raw", body: "Gunz For Hire, Ran-D, Digital Punk, Radical Redemption and Warface push distortion and darkness (raw), while Coone, Da Tweekaz, Atmozfears and Wildstylez go bright and vocal (euphoric). Roughstate (2015) and Dirty Workz become the two poles. Rawstyle gets its own stages." },
  { years: "2016–2019", title: "Xtra raw, rawphoric, psy", body: "Raw splinters: xtra raw (Sub Sonik, Killshot, Mutilator) borrows uptempo speed and noise; rawphoric (Phuture Noize, B-Front) marries raw kicks to euphoric melodies; psystyle (Sub Zero Project) brings the rolling psy bass. Uptempo hardcore explodes alongside, and frenchcore (Dr. Peacock, Sefa) goes mainstream." },
  { years: "2020–now", title: "Cross-pollination", body: "Tempo is fluid: hardstyle tracks with uptempo sections, frenchcore drops in hardstyle sets, 'zaag' kicks everywhere. Production is cleaner and louder; the kick is engineered in stages with multiband distortion and resonance suppression. Streaming edits sit next to 6-minute extended mixes." },
];

export type Term = { term: string; def: string };

export const GLOSSARY: Term[] = [
  { term: "Punch", def: "The first 10–40 ms of a kick: the transient and the high-pitched start of the pitch drop. Where the click and the 'thump' live." },
  { term: "Tok", def: "The mid-range body between punch and tail (roughly 150–600 Hz). Raw kicks are all tok." },
  { term: "Tail", def: "The tuned, sustained part of the kick after the punch. Pitched to the key. In most lanes it replaces a bassline." },
  { term: "Reverse bass", def: "A reversed, saturated bass note on the off-beat that swells into the next kick. The early-hardstyle signature." },
  { term: "Screech", def: "A distorted, phased, pitch-bent lead used rhythmically. The raw and early-hardstyle hook sound." },
  { term: "Zaag / zaagkick", def: "Dutch for 'saw'. A kick or lead with a saw-like, buzzing distorted tail." },
  { term: "Climax kick", def: "A section where the kick is pitched to play the melody with no lead on top. Classic nu-style." },
  { term: "Kick roll", def: "Rapid repeats of the kick (1/8, 1/16, triplets) used as fills and transitions. Raw, xtra raw and uptempo live on them." },
  { term: "Pitch-up", def: "A kick or the whole mix rising in pitch over the last bars of a build." },
  { term: "Tail cut", def: "Ending the kick tail early (e.g. on beat 4 of every 8th bar) to create a gap and a groove." },
  { term: "Euphoric", def: "The melodic, vocal, bright branch of hardstyle (2012–)." },
  { term: "Raw / rawstyle", def: "The dark, distorted, screech-led branch (2011–)." },
  { term: "Xtra raw", def: "Raw pushed further: faster, noisier, more edits." },
  { term: "Rawphoric", def: "Raw kicks under euphoric melodies." },
  { term: "Psystyle", def: "Hardstyle with a rolling psytrance bass and acid FX." },
  { term: "Hard-dance", def: "The umbrella: hardstyle, hardcore, uptempo, frenchcore, jumpstyle, hard trance, UK hardcore." },
  { term: "DJ tool / extended mix", def: "The 5–7 minute version with 16–32 bar intros and outros on an 8-bar grid so DJs can mix it." },
  { term: "Phrase", def: "Eight bars. Everything in hardstyle changes on a phrase boundary; sections are 16 or 32 bars." },
  { term: "Sidechain / pumping", def: "Ducking other elements every time the kick hits so it always sits in front." },
  { term: "OTT", def: "Xfer's free multiband compressor and the aggressive upward compression sound it made famous on leads." },
  { term: "LUFS", def: "Loudness Units relative to Full Scale — the loudness measurement. Hardstyle masters sit around -6 LUFS integrated." },
  { term: "True peak", def: "The peak level after reconstruction (between samples). Keep it at or under -0.3 dBTP for club, -1 dBTP for streaming." },
  { term: "Crest factor", def: "Peak minus RMS. Lower = more squashed. Drops in hardstyle run 7–11 dB." },
  { term: "Q-dance", def: "The Dutch organiser behind Defqon.1, Qlimax, X-Qlusive and Q-BASE. Its anthems shaped every era." },
  { term: "Kick 2 / Kick 3", def: "Sonic Academy's kick synthesisers, used to draw the pitch envelope of a hardstyle kick." },
];

export const LABELS = [
  { name: "Scantraxx", note: "The Prophet's label (2002). Home of early hardstyle, nu-style and today's euphoric/raw mix." },
  { name: "Q-dance Records", note: "Event anthems and flagship releases from the Q-dance stable." },
  { name: "Dirty Workz", note: "Belgian; Coone, Da Tweekaz, Sub Zero Project — the euphoric and psy hub." },
  { name: "Roughstate", note: "Raw's home (2015): Warface, Sub Sonik, Rebelion, Delete, Phuture Noize, B-Front." },
  { name: "Minus is More", note: "Radical Redemption's raw label." },
  { name: "Gearbox Digital", note: "Xtra raw and raw: Killshot, Mutilator, Malice, Riot Shift." },
  { name: "Art of Creation", note: "Headhunterz and Wildstylez's label — melodic, polished." },
  { name: "Fusion Records", note: "Italian roots: Technoboy, Tuneboy, Zatox, Isaac." },
  { name: "Masters of Hardcore", note: "The mainstream-hardcore powerhouse (Angerfist, Miss K8, Tha Playah)." },
  { name: "Peacock Records", note: "Dr. Peacock's frenchcore label." },
  { name: "Uptempo is the Tempo", note: "Sjammienators' uptempo label and event." },
  { name: "Nightbreed", note: "Endymion's hardcore/raw crossover label." },
];

export const EVENTS = [
  { name: "Defqon.1", note: "Q-dance's festival (2003–), Biddinghuizen. RED stage = hardstyle, BLACK = hardcore/uptempo, BLUE = raw, and so on." },
  { name: "Qlimax", note: "Q-dance's indoor hardstyle ritual (2000–), GelreDome Arnhem. One stage, one anthem, one theme." },
  { name: "Intents Festival", note: "Oisterwijk; hardstyle, raw and hardcore across many stages." },
  { name: "Decibel Outdoor", note: "b2s's festival; hardstyle, raw, hardcore, uptempo." },
  { name: "Reverze", note: "Belgian indoor hardstyle event by Bass Events." },
  { name: "Supremacy", note: "Art of Dance's raw-only indoor event." },
  { name: "Masters of Hardcore", note: "The big indoor hardcore event." },
  { name: "Dominator", note: "Art of Dance's hardcore festival, Eersel." },
  { name: "Shockerz", note: "Raw and xtra raw indoor event." },
  { name: "Hard Bass", note: "Q-dance's yearly indoor showcase (2007–2019)." },
];

export type Faq = { q: string; a: string; tags: string[] };

export const FAQ: Faq[] = [
  { q: "What BPM is hardstyle?", a: "150 BPM for classic, euphoric, rawphoric and psystyle. Raw sits at 150–160, xtra raw 158–165. Early hardstyle was 140–150. Hardcore runs 170–185, frenchcore 190–210, uptempo 190–230.", tags: ["bpm", "tempo", "speed"] },
  { q: "How long should the kick tail be?", a: "In classic, euphoric and raw the tail fills 60–95% of the beat (about 240–380 ms at 150 BPM). Early hardstyle and psystyle use short kicks (20–45% of a beat) so the reverse bass or rolling bass fits. Frenchcore and uptempo cut it to 30–55% because the tempo is fast.", tags: ["kick", "tail", "length"] },
  { q: "What note should the kick be tuned to?", a: "The root of your key, one or two octaves below the lead. Most hardstyle tails sit between F1 (43.65 Hz) and A1 (55 Hz). Hardcore and uptempo tails are a bit higher (50–64 Hz). If your track is in F minor, the tail is F1. Check the analyser's kick note and cents.", tags: ["kick", "tune", "pitch", "key", "note"] },
  { q: "Why does my kick sound muddy?", a: "Too much 150–400 Hz that isn't the deliberate tok, or a tail that overlaps the next kick. Cut 2–3 dB at 200–350 Hz with a narrow Q, shorten the tail so it ends before the next punch, and multiband-compress the low band with a slow release.", tags: ["kick", "mud", "muddy", "low-mid"] },
  { q: "Why does my kick sound weak compared to references?", a: "Usually three things: no clipping on the punch, a tail that is not distorted enough in the 150–600 Hz range, and no multiband compression holding the sub steady. Clip the punch 3–4 dB, distort the tok, and put a 2-band compressor on the kick bus.", tags: ["kick", "weak", "thin", "punch"] },
  { q: "How loud should my master be?", a: "-6 to -7 LUFS integrated for hardstyle, -5 to -6 for raw, uptempo and frenchcore, true peak at -0.3 dBTP for club or -1 dBTP for streaming. Short-term loudness in the drop lands around -4 to -5 LUFS.", tags: ["master", "loud", "lufs", "limiter"] },
  { q: "Serum or Kick 3 for the kick?", a: "Kick 3 is faster: draw the pitch curve, distort per band, render. Serum gives you more control over the tail's harmonics and modulation. Many producers do the tail in Serum and the punch from a sample, then process outside both.", tags: ["serum", "kick 3", "kick 2", "kick"] },
  { q: "How do I make a screech?", a: "Saw in Serum → distortion → comb or formant filter keyed to the note → phaser → flanger → EQ HP 400 Hz. Pitch-bend the first note of each phrase with an envelope. Play a rhythm on one or two notes.", tags: ["screech", "lead", "serum", "raw"] },
  { q: "What key should I write in?", a: "Minor keys, almost always: F minor, G minor, A minor, E minor, D minor, C minor and their relatives. Pick the key so the kick's tail note is between F1 and A1.", tags: ["key", "scale", "minor"] },
  { q: "How long is a hardstyle track?", a: "Extended mixes run 5–7 minutes with 32-bar intros/outros. Radio edits are 3–4 minutes. Everything is built from 8-bar phrases; sections are 16 or 32 bars.", tags: ["length", "arrangement", "structure", "bars"] },
  { q: "How do I structure a hardstyle track?", a: "Intro (16–32) → break (32) → build (16) → drop (32) → mid (16) → break 2 (16–32) → build 2 (16) → drop 2 (32) → outro (16–32). The build is drums out, snare roll, riser, lead teased; the drop is kick + lead. Use the Arrange page for a per-lane version.", tags: ["structure", "arrangement", "intro", "break", "build", "drop", "outro"] },
  { q: "What's the difference between raw and euphoric?", a: "Kick and mood. Raw: distorted mid-heavy kick, screeches, dark one-chord stabs, spoken samples. Euphoric: clean sub-heavy kick, layered supersaw leads, sung vocals, chord progressions. Rawphoric mixes a raw kick with euphoric melodies.", tags: ["raw", "euphoric", "difference", "genre"] },
  { q: "Should I mono my low end?", a: "Yes. Everything below 120–150 Hz mono. Kick, sub and bass centred. Widen only leads, pads and FX above 300 Hz. Check with a correlation meter: the drop should stay above 0.5.", tags: ["mono", "stereo", "width", "low end"] },
  { q: "How do I sidechain in hardstyle?", a: "Lead, pad and vocal-reverb buses duck 3–5 dB on every kick with a 100–150 ms release. Use a compressor with the kick as sidechain input, or Kickstart/LFOTool/ShaperBox for a drawn curve. Screeches duck harder (6–8 dB).", tags: ["sidechain", "duck", "pump", "kickstart"] },
  { q: "Which plugins do I actually need?", a: "A synth (Serum or free Vital), a kick tool (Kick 3 or a sampler), an EQ, a compressor, a multiband compressor (OTT is free), a distortion, a clipper, a limiter and a LUFS meter (Youlean is free). Every DAW ships most of these. Scan your folder on the Plugins page and the advice uses what you have.", tags: ["plugins", "need", "buy", "free"] },
  { q: "How do I make a build-up?", a: "Take the kick out (or half-time it), start a snare roll at 1/4 and double it every 4 bars to 1/32, add a noise riser with a band-pass opening, bring the lead in filtered and open the filter, pitch the kick up for the last 4 bars, cut everything on the last beat, then drop.", tags: ["build", "buildup", "riser", "snare roll"] },
  { q: "What is a climax?", a: "A section, usually after the first drop, where the kick plays the melody by pitching its tail per note and there is no lead. Nu-style classic; still used in euphoric.", tags: ["climax", "kick melody", "pitched kick"] },
  { q: "How do I get my drop louder without distortion?", a: "Turn the break down instead of the drop up. Then clip the kick punch 2–3 dB, OTT the lead bus, and let the limiter do 3–4 dB only. If the limiter does 6+ dB the mix is the problem, not the master.", tags: ["loud", "drop", "limiter", "distortion"] },
];

export type Quote = { text: string; who: string };

/** Studio sayings collected from years of hardstyle production talk. Attributed to the scene, not to individuals. */
export const QUOTES: Quote[] = [
  { text: "The kick is the track. Everything else is decoration.", who: "Rawstyle studio saying" },
  { text: "If the kick is right, the mix is half done.", who: "Producer proverb" },
  { text: "Tune the tail, not the punch.", who: "Kick design rule" },
  { text: "Mono below 150. No exceptions, no excuses.", who: "Mix engineer's rule" },
  { text: "Every eight bars, something has to happen.", who: "Arrangement rule" },
  { text: "Turn the break down, not the drop up.", who: "Mastering saying" },
  { text: "Reference at the same loudness or you're comparing volume, not sound.", who: "Mix engineer's rule" },
  { text: "A screech is a rhythm instrument that happens to have a pitch.", who: "Raw producer saying" },
  { text: "The build is the promise. The drop is the payment.", who: "Arrangement saying" },
  { text: "Your lead is not too quiet. Your kick's mids are too loud.", who: "Mix feedback classic" },
  { text: "Distortion in stages, level-matched, or you're just making it louder.", who: "Kick design rule" },
  { text: "Finish the track. Nobody hears the 40 unfinished ones.", who: "Producer proverb" },
  { text: "Clip the punch, compress the tail, limit the master.", who: "Loudness recipe" },
  { text: "Hardstyle is 150 BPM of tension and release.", who: "Scene saying" },
  { text: "If it doesn't work on one kick and one lead, more layers won't save it.", who: "Arrangement rule" },
  { text: "Reverse bass: the space between the kicks is the groove.", who: "Early-hardstyle saying" },
  { text: "Make the kick, then make it again shorter.", who: "Uptempo saying" },
  { text: "The vocal sells the track; the kick sells the set.", who: "Euphoric saying" },
  { text: "Sidechain is the glue. Too much and it's a pump, too little and it's a mess.", who: "Mix rule" },
  { text: "Check it on a phone speaker. If the melody dies there, fix the mids.", who: "Translation rule" },
];
