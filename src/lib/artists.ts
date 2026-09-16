import {
  FRENCH_MAP,
  GABBER_MAP,
  HAPPY_MAP,
  RAW_MAP,
  TECHNO_MAP,
  TRANCE_MAP,
  UKHC_MAP,
  UPTEMPO_MAP,
} from "./catalog";
import type { ArrangementSection, MusicalKey, StyleId } from "./types";

export type School = "ar-gang" | "lil-texas" | "euphoric" | "raw" | "uk" | "hardcore" | "techno";

export type MapKind = "anthem" | "dj-tool" | "collab";

export type Artist = {
  id: string;
  name: string;
  school: School;
  bpm: number;
  key: MusicalKey;
  maps: Record<MapKind, ArrangementSection[]>;
  tracks: string[];
  dna: string[];
};

const DJ_RAW: ArrangementSection[] = [
  { id: "i0", kind: "intro", label: "Kick in", startBar: 0, bars: 32 },
  { id: "b0", kind: "break", label: "Filter", startBar: 32, bars: 16 },
  { id: "d0", kind: "drop", label: "Peak 1", startBar: 48, bars: 32 },
  { id: "b1", kind: "break", label: "Filter 2", startBar: 80, bars: 16 },
  { id: "d1", kind: "drop", label: "Peak 2", startBar: 96, bars: 32 },
  { id: "o0", kind: "outro", label: "Outro", startBar: 128, bars: 16 },
];

const COLLAB_RAW: ArrangementSection[] = [
  { id: "i0", kind: "intro", label: "Tease", startBar: 0, bars: 16 },
  { id: "b0", kind: "break", label: "Break", startBar: 16, bars: 16 },
  { id: "u0", kind: "build", label: "Build", startBar: 32, bars: 8 },
  { id: "d0", kind: "drop", label: "Drop 1", startBar: 40, bars: 32 },
  { id: "b1", kind: "break", label: "Break 2", startBar: 72, bars: 16 },
  { id: "d1", kind: "drop", label: "Drop 2", startBar: 88, bars: 32 },
  { id: "o0", kind: "outro", label: "Outro", startBar: 120, bars: 8 },
];

const TEXAS_ANTHEM: ArrangementSection[] = HAPPY_MAP;
const TEXAS_DJ: ArrangementSection[] = [
  { id: "i0", kind: "intro", label: "Hook / kick", startBar: 0, bars: 16 },
  { id: "d0", kind: "drop", label: "Drop 1", startBar: 16, bars: 32 },
  { id: "b0", kind: "break", label: "Vox chop", startBar: 48, bars: 16 },
  { id: "d1", kind: "drop", label: "Drop 2", startBar: 64, bars: 32 },
  { id: "o0", kind: "outro", label: "Outro", startBar: 96, bars: 8 },
];
const TEXAS_COLLAB: ArrangementSection[] = [
  { id: "i0", kind: "intro", label: "Kick tease", startBar: 0, bars: 8 },
  { id: "b0", kind: "break", label: "Hook", startBar: 8, bars: 16 },
  { id: "u0", kind: "build", label: "Build", startBar: 24, bars: 8 },
  { id: "d0", kind: "drop", label: "Drop", startBar: 32, bars: 32 },
  { id: "b1", kind: "break", label: "Second hook", startBar: 64, bars: 16 },
  { id: "d1", kind: "drop", label: "Drop 2", startBar: 80, bars: 32 },
  { id: "o0", kind: "outro", label: "Outro", startBar: 112, bars: 8 },
];

const RAW_TRACKS = [
  "Kick",
  "Kick extra / click",
  "Reverse bass",
  "Screech",
  "Stab",
  "Atmosphere",
  "FX / reverse",
  "Impact",
  "Vocal chop",
];
const TEXAS_TRACKS = [
  "Kick",
  "Hats",
  "Clap",
  "Vox chops",
  "Lead",
  "Sub",
  "FX",
  "Crash",
];
const EUPH_TRACKS = [
  "Kick",
  "Reverse bass",
  "Climax lead",
  "Break melody",
  "Pad",
  "Choir / vox",
  "FX / snare build",
  "Crash",
];
const UK_TRACKS = [
  "Kick",
  "Offbeat bass",
  "Piano",
  "Supersaw",
  "Vocal",
  "Hats",
  "Snare build",
  "FX",
];
const HC_TRACKS = [
  "Kick",
  "Hats",
  "Stab / hoover",
  "Shout vox",
  "Industrial FX",
  "Impact",
];
const TEC_TRACKS = [
  "Peak PVC",
  "Click extra",
  "Sub extra",
  "Hats",
  "Stab",
  "Fill extra",
  "Impact",
];

function a(
  id: string,
  name: string,
  school: School,
  bpm: number,
  key: MusicalKey,
  maps: Record<MapKind, ArrangementSection[]>,
  tracks: string[],
  dna: string[],
): Artist {
  return { id, name, school, bpm, key, maps, tracks, dna };
}

const AR_MAPS = { anthem: RAW_MAP, "dj-tool": DJ_RAW, collab: COLLAB_RAW };
const TX_MAPS = { anthem: TEXAS_ANTHEM, "dj-tool": TEXAS_DJ, collab: TEXAS_COLLAB };
const EU_MAPS = { anthem: RAW_MAP, "dj-tool": DJ_RAW, collab: COLLAB_RAW };
const HC_MAPS = { anthem: UPTEMPO_MAP, "dj-tool": GABBER_MAP, collab: FRENCH_MAP };
const UK_MAPS = { anthem: UKHC_MAP, "dj-tool": HAPPY_MAP, collab: TEXAS_COLLAB };
const TE_MAPS = { anthem: TECHNO_MAP, "dj-tool": DJ_RAW, collab: COLLAB_RAW };

export const ARTISTS: Artist[] = [
  a("ar-gang", "AR Gang", "ar-gang", 152, "G minor", AR_MAPS, RAW_TRACKS, [
    "Kick + reverse bass first. Screech is the hook.",
    "32-bar drops. Second drop adds a layer, not a new song.",
    "Dark break, spoken or chopped vox, no pretty chorus.",
  ]),
  a("rebelion", "Rebelion", "ar-gang", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Heavier kicks than classic raw. Mid-range crunch.",
    "Anthem still uses 32s. DJ tools stay looping.",
    "Screech + kick is the drop.",
  ]),
  a("adjuzt", "Adjuzt", "ar-gang", 154, "G minor", AR_MAPS, RAW_TRACKS, [
    "AR Gang-adjacent phrasing. Kick design is the identity.",
    "Collabs often jump to the drop faster.",
    "Leave space. Don't stack pretty leads.",
  ]),
  a("so-juice", "So Juice", "ar-gang", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Dirty reverse bass. Industrial FX.",
    "DJ-tool maps for peak-time.",
    "Stab instead of climax saw.",
  ]),
  a("aversion", "Aversion", "ar-gang", 154, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw kick, short screeches.",
    "Same 16/32 grid as AR Gang anthems.",
    "Second drop = extra distortion, not extra melody.",
  ]),
  a("the-purge", "The Purge", "ar-gang", 152, "E minor", AR_MAPS, RAW_TRACKS, [
    "Dark atmospheres in the break.",
    "Kick stays brutal in both drops.",
    "Spoken vox, not sung hooks.",
  ]),
  a("deezl", "Deezl", "ar-gang", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Kick-first writing.",
    "Collab map for festival edits.",
    "Hats stay simple.",
  ]),
  a("riot-shift", "Riot Shift", "ar-gang", 154, "E minor", AR_MAPS, RAW_TRACKS, [
    "Modern raw. Tight 32s.",
    "Screech hooks, not supersaws.",
    "Filter breaks, not emotional choruses.",
  ]),
  a("mish", "Mish", "ar-gang", 154, "G minor", AR_MAPS, RAW_TRACKS, [
    "AR Gang grid. Mid kicks.",
    "DJ tool for warehouse sets.",
    "Keep the reverse bass locked.",
  ]),
  a("fraw", "Fraw", "ar-gang", 156, "E minor", AR_MAPS, RAW_TRACKS, [
    "Extra-raw energy on an AR Gang map.",
    "Faster feel, same 32-bar drops.",
    "Noise FX as glue.",
  ]),
  a("lil-texas", "Lil Texas", "lil-texas", 160, "A minor", TX_MAPS, TEXAS_TRACKS, [
    "Hard kick, happy hook, vocal chops.",
    "Drops hit earlier than classic hardstyle.",
    "Busy hats. Bounce over epic tails.",
  ]),
  a("vertile", "Vertile", "lil-texas", 160, "A minor", TX_MAPS, TEXAS_TRACKS, [
    "Texas-energy kick with a clearer lead.",
    "Hook in the break, drop is bounce.",
    "Vox chops as rhythm.",
  ]),
  a("rooler", "Rooler", "raw", 160, "E minor", AR_MAPS, RAW_TRACKS, [
    "Raw + bounce. Kick still first.",
    "Shorter teases than euphoric.",
    "Crowd-chant vox ok.",
  ]),
  a("sickmode", "Sickmode", "raw", 158, "G minor", AR_MAPS, RAW_TRACKS, [
    "Aggressive reverse bass.",
    "Festival anthem still 32s.",
    "Lead is optional; kick is not.",
  ]),
  a("dual-damage", "Dual Damage", "raw", 158, "E minor", AR_MAPS, RAW_TRACKS, [
    "Two-kick energy. Extra click in the drop.",
    "Collab map for edits.",
    "Industrial FX.",
  ]),
  a("mutilator", "Mutilator", "raw", 160, "E minor", AR_MAPS, RAW_TRACKS, [
    "Heavier than Texas, groovier than extra-raw.",
    "32-bar peaks.",
    "Screech stabs.",
  ]),
  a("rejecta", "Rejecta", "raw", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw kick design first.",
    "Dark breaks.",
    "Same grid as AR Gang anthems.",
  ]),
  a("d-sturb", "D-Sturb", "raw", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Festival raw. Big kicks.",
    "Anthem map.",
    "Second drop adds unison.",
  ]),
  a("warface", "Warface", "raw", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Kick wall, industrial.",
    "DJ-tool friendly.",
    "Shouts over pretty melody.",
  ]),
  a("act-of-rage", "Act of Rage", "raw", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw kicks, festival drops.",
    "32s.",
    "Stab hooks.",
  ]),
  a("barber", "Barber", "raw", 160, "E minor", AR_MAPS, RAW_TRACKS, [
    "Dirty, extra-raw leaning.",
    "Short collab edits.",
    "Kick is the song.",
  ]),
  a("sound-rush", "Sound Rush", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Break melody becomes the drop lead.",
    "Reverse bass locked to kick.",
    "32-bar phrases. Don't skip break 2.",
  ]),
  a("headhunterz", "Headhunterz", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Anthem hardstyle. Melody first in the break.",
    "Classic 32s.",
    "Climax lead, not screech.",
  ]),
  a("wildstylez", "Wildstylez", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Euphoric grid. Long breaks.",
    "Lead from the break melody.",
    "Kick punch + reverse bass.",
  ]),
  a("brennan-heart", "Brennan Heart", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Vocal anthem. Break is the song.",
    "Drop restates the vocal melody.",
    "Keep kicks musical, not extra-raw.",
  ]),
  a("coone", "Coone", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Festival hardstyle. Big leads.",
    "Anthem map.",
    "Snare builds are long.",
  ]),
  a("da-tweekaz", "Da Tweekaz", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Happy-euphoric. Bouncier hats.",
    "Hook early.",
    "Still 32-bar drops.",
  ]),
  a("sub-zero-project", "Sub Zero Project", "euphoric", 150, "G minor", EU_MAPS, EUPH_TRACKS, [
    "Story anthems. Weird FX ok.",
    "Break carries the theme.",
    "Drop still 32.",
  ]),
  a("phuture-noize", "Phuture Noize", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Cinematic break, hard drop.",
    "Anthem map.",
    "Lead from the break.",
  ]),
  a("b-front", "B-Front", "euphoric", 150, "G minor", EU_MAPS, EUPH_TRACKS, [
    "Dark euphoric. Minor, still 32s.",
    "Atmosphere-heavy breaks.",
    "Kick + reverse bass in the drop.",
  ]),
  a("ran-d", "Ran-D", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Anthem vocals.",
    "Classic hardstyle grid.",
    "Climax in both speakers, kick center.",
  ]),
  a("dbstf", "D-Block & S-te-Fan", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Classic Dutch hardstyle phrasing.",
    "Melody in the break.",
    "32-bar drops.",
  ]),
  a("frontliner", "Frontliner", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Saw leads. Tight reverse bass.",
    "Anthem map.",
    "Don't rush the break.",
  ]),
  a("code-black", "Code Black", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Vocal + climax.",
    "32s.",
    "Happy colour in minor keys.",
  ]),
  a("atmozfears", "Atmozfears", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Emotional break, hard drop.",
    "Anthem map.",
    "Lead = break melody.",
  ]),
  a("noisecontrollers", "Noisecontrollers", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Classic 150 grid.",
    "Reverse bass pocket.",
    "Longer builds ok.",
  ]),
  a("darren-styles", "Darren Styles", "uk", 170, "A minor", UK_MAPS, UK_TRACKS, [
    "Piano motif before the drop.",
    "Offbeat bass, not reverse bass.",
    "Snare builds long and clean.",
  ]),
  a("s3rl", "S3RL", "uk", 170, "F minor", UK_MAPS, UK_TRACKS, [
    "Vocal hook is the song.",
    "Short, replayable.",
    "Pitched vox + bounce.",
  ]),
  a("hixxy", "Hixxy", "uk", 170, "A minor", UK_MAPS, UK_TRACKS, [
    "UK hardcore piano / hoover.",
    "170 four-to-the-floor.",
    "Offbeat bass.",
  ]),
  a("gammer", "Gammer", "uk", 170, "A minor", UK_MAPS, UK_TRACKS, [
    "Modern UKHC. Big saws.",
    "Hook first.",
    "Drop is bounce + kick.",
  ]),
  a("tnt", "TNT", "uk", 170, "A minor", UK_MAPS, UK_TRACKS, [
    "Piano + 170 kick.",
    "Darren-adjacent grid.",
    "Vocal in the break.",
  ]),
  a("angerfist", "Angerfist", "hardcore", 190, "E minor", HC_MAPS, HC_TRACKS, [
    "Kick wall. Short phrases.",
    "Industrial FX.",
    "No reverse bass.",
  ]),
  a("sefa", "Sefa", "hardcore", 200, "A minor", HC_MAPS, HC_TRACKS, [
    "Frenchcore 200. Offbeat bass.",
    "Rave stabs.",
    "Short maps.",
  ]),
  a("dr-peacock", "Dr Peacock", "hardcore", 200, "A minor", HC_MAPS, HC_TRACKS, [
    "Frenchcore party. 200 kicks.",
    "Stabs + vox shouts.",
    "DJ-tool lengths.",
  ]),
  a("partyraiser", "Partyraiser", "hardcore", 180, "E minor", HC_MAPS, HC_TRACKS, [
    "Gabber / millenium energy.",
    "Hoover or stab.",
    "Kick is 90%.",
  ]),
  a("n-vitral", "N-Vitral", "hardcore", 200, "E minor", HC_MAPS, HC_TRACKS, [
    "Uptempo-adjacent frenchcore.",
    "Industrial.",
    "Short drops.",
  ]),
  a("deadly-guns", "Deadly Guns", "hardcore", 200, "E minor", HC_MAPS, HC_TRACKS, [
    "Uptempo kicks.",
    "Shouts.",
    "Tiny phrases.",
  ]),
  a("korsakoff", "Korsakoff", "hardcore", 180, "E minor", HC_MAPS, HC_TRACKS, [
    "Classic gabber.",
    "Hoover hook.",
    "Short arrangement.",
  ]),
  a("hard-driver", "Hard Driver", "raw", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw / extra-raw kicks.",
    "AR Gang-length anthems.",
    "Screech as hook.",
  ]),
  a("thyron", "Thyron", "raw", 154, "E minor", AR_MAPS, RAW_TRACKS, [
    "Raw kicks, dark breaks.",
    "32s.",
    "Industrial glue.",
  ]),
  a("unresolved", "Unresolved", "raw", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Kick design first.",
    "Festival 32s.",
    "Screech + atmosphere.",
  ]),
  a("radical-redemption", "Radical Redemption", "raw", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Heavy raw. Kick wall.",
    "DJ tool or anthem.",
    "No pretty climax.",
  ]),
  a("szp", "SZP", "euphoric", 150, "G minor", { anthem: TRANCE_MAP, "dj-tool": DJ_RAW, collab: COLLAB_RAW }, EUPH_TRACKS, [
    "Longer cinematic builds.",
    "Theme in the break.",
    "Hard drop still 32.",
  ]),
  a("zatox", "Zatox", "raw", 150, "E minor", AR_MAPS, RAW_TRACKS, [
    "Italian raw / hardstyle kicks.",
    "Festival 32s.",
    "Stab hooks.",
  ]),
  a("adaro", "Adaro", "raw", 150, "G minor", AR_MAPS, RAW_TRACKS, [
    "Dark raw. Kick first.",
    "Spoken vox.",
    "Same 32 grid.",
  ]),
  a("miss-k8", "Miss K8", "hardcore", 180, "E minor", HC_MAPS, HC_TRACKS, [
    "Hardcore kicks. Short maps.",
    "Industrial FX.",
    "Shouts.",
  ]),
  a("neophyte", "Neophyte", "hardcore", 175, "E minor", HC_MAPS, HC_TRACKS, [
    "Classic gabber / millenium.",
    "Stamp kick.",
    "Short arrangement.",
  ]),
  a("wasted-penguinz", "Wasted Penguinz", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Emotional break, hard drop.",
    "Anthem 32s.",
    "Melody is the song.",
  ]),
  a("frequencerz", "Frequencerz", "raw", 150, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw / hardstyle hybrid.",
    "Festival drops.",
    "Kick + atmosphere.",
  ]),
  a("anderex", "Anderex", "ar-gang", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Modern raw. Tight kicks.",
    "AR Gang grid.",
    "Screech as hook.",
  ]),
  a("the-straikerz", "The Straikerz", "ar-gang", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw kicks, festival 32s.",
    "Stab energy.",
    "Don't pretty-up the drop.",
  ]),
  a("imparatorz", "Imperatorz", "raw", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Extra-raw leaning.",
    "Kick first.",
    "Industrial FX.",
  ]),
  a("levenkhan", "Levenkhan", "raw", 155, "G minor", AR_MAPS, RAW_TRACKS, [
    "Dark raw.",
    "32-bar peaks.",
    "Screech + kick.",
  ]),
  a("ncrypta", "Ncrypta", "raw", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Raw kick design.",
    "Festival map.",
    "Atmosphere in the break.",
  ]),
  a("e-force", "E-Force", "raw", 150, "G minor", AR_MAPS, RAW_TRACKS, [
    "Classic raw.",
    "Spoken vox ok.",
    "Kick wall.",
  ]),
  a("crypsis", "Crypsis", "raw", 150, "E minor", AR_MAPS, RAW_TRACKS, [
    "Raw / hardstyle.",
    "32s.",
    "Dark break.",
  ]),
  a("keltek", "Keltek", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Euphoric with harder kicks.",
    "Melody in the break.",
    "32-bar drops.",
  ]),
  a("sephyx", "Sephyx", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Happy-euphoric.",
    "Hook early.",
    "Still 32s.",
  ]),
  a("jdx", "JDX", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Classic hardstyle anthem.",
    "Break melody = drop lead.",
    "Reverse bass pocket.",
  ]),
  a("bass-modulators", "Bass Modulators", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Festival euphoric.",
    "Big saws.",
    "Longer builds ok.",
  ]),
  a("audiofreq", "Audiofreq", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Aussie hardstyle.",
    "Anthem map.",
    "Climax lead.",
  ]),
  a("delete", "Delete", "raw", 155, "E minor", AR_MAPS, RAW_TRACKS, [
    "Raw kicks.",
    "Industrial.",
    "32s.",
  ]),
  a("digital-punk", "Digital Punk", "raw", 150, "G minor", AR_MAPS, RAW_TRACKS, [
    "Raw anthem.",
    "Kick first.",
    "Dark break.",
  ]),
  a("d-fence", "D-Fence", "hardcore", 200, "E minor", HC_MAPS, HC_TRACKS, [
    "Uptempo / frenchcore energy.",
    "Short maps.",
    "Kick is 90%.",
  ]),
  a("major-conspiracy", "Major Conspiracy", "hardcore", 200, "E minor", HC_MAPS, HC_TRACKS, [
    "Uptempo kicks.",
    "Shouts.",
    "Tiny phrases.",
  ]),
  a("re-style", "Re-Style", "uk", 170, "A minor", UK_MAPS, UK_TRACKS, [
    "UK hardcore bounce.",
    "Piano / saw hook.",
    "Offbeat bass.",
  ]),
  a("lady-faith", "Lady Faith", "uk", 170, "A minor", UK_MAPS, UK_TRACKS, [
    "Happy hardcore / UKHC.",
    "Vocal hook first.",
    "170 bounce.",
  ]),
  a("technoboy", "Technoboy", "euphoric", 150, "A minor", EU_MAPS, EUPH_TRACKS, [
    "Italian hardstyle.",
    "Saw leads.",
    "Classic 32s.",
  ]),
];

export const SCHOOLS: { id: School | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ar-gang", label: "AR Gang" },
  { id: "lil-texas", label: "Lil Texas" },
  { id: "raw", label: "Raw" },
  { id: "euphoric", label: "Euphoric" },
  { id: "uk", label: "UK" },
  { id: "hardcore", label: "Hardcore" },
  { id: "techno", label: "Techno" },
];

export function artistById(id: string) {
  return ARTISTS.find((x) => x.id === id) ?? ARTISTS[0];
}

export function mapBars(map: ArrangementSection[]) {
  const last = map[map.length - 1];
  return last.startBar + last.bars;
}

export function styleIdFor(school: School): StyleId {
  if (school === "ar-gang") return "ar-gang";
  if (school === "lil-texas") return "lil-texas";
  if (school === "euphoric") return "hardstyle";
  if (school === "raw") return "rawstyle";
  if (school === "uk") return "darren-styles";
  if (school === "hardcore") return "uptempo";
  return "hard-techno";
}
