# Hardstyle Helper

Private product repo. Do not make this public.

Session coach for hardstyle and its lanes. Analyse a bounce in the browser,
scan the plugins on your computer, and get told what to fix — the easy way
and the hard way.

## What ships today

- **Analyse** (`/analyse`) — drop a WAV/MP3/AIFF/FLAC. Web Audio decodes it,
  a worker (`src/lib/hh/dsp.ts`) measures tempo + beat grid, key, integrated /
  short-term LUFS, LRA, true-peak estimate, crest factor, six-band balance and
  a 48-point spectrum, stereo correlation and width, kick count / tail length /
  tail pitch, and a bar-by-bar structure. `src/lib/hh/analysis.ts` scores it
  against ten lanes and produces findings (fix / check / good) with your
  number vs the lane target, an easy fix, a hard fix, the plugins you own for
  the job, the Serum patch that applies, and the closest references by tempo.
  Nothing is uploaded.
- **Genres** (`/genres`) — ten lanes (early, classic, euphoric, raw, xtra raw,
  rawphoric, psystyle, hardcore, uptempo, frenchcore) with sonic targets
  (`src/lib/hh/genres.ts`) and fifty reference tracks each
  (`src/lib/hh/refs.ts`). The reference list is assembled from memory — years
  and BPMs are approximate and the list is editable on-device.
- **Plugins** (`/plugins`) — scan a plugin folder with the File System Access
  API (Chromium), a folder upload (Safari/Firefox) or a pasted list. Every
  plugin is explained from `src/lib/hh/plugins-kb.ts` (what it is, how
  hardstyle uses it, easy/hard moves); unknown ones get a role guessed from
  the name. The DAW's stock tools are covered too, and the analyser's advice
  uses what you own.
- **Mix** (`/mix`) — mixing and mastering per element: easy way, hard way,
  methods people use, numbers per lane (`src/lib/hh/mixing.ts`).
- **Serum** (`/serum`) — patch recipes (supersaw, screech, kick tail, reverse
  bass, psy bass, frenchcore bounce, pluck, riser), Serum filter types, and
  filter rules for the mix (`src/lib/hh/serum.ts`). Shown by default with
  every analysis.
- **Arrange** (`/arrange`) — per-lane bar-by-bar arrangements in extended,
  radio or DJ form with seeded variations; export as text or a MIDI marker
  file (`src/lib/hh/arrange.ts`).
- **Ask** (`/ask`) — local search over everything the app knows, plus an
  optional AI answer through the xAI endpoint when `XAI_API_KEY` is set on the
  deployment (`src/lib/hh/ask.ts`).
- **Learn** (`/learn`) — history, glossary, labels, events, FAQ and studio
  sayings (`src/lib/hh/knowledge.ts`).
- **Customise** (`/customise`) — everything above is editable and persists on
  the device (`src/lib/hh/customise.ts`, stored by `store.ts`): lane targets,
  text and arrangement templates for the built-in lanes; your own lanes
  (cloned from any lane); hide lanes; analysis strictness, finding areas,
  easy/hard fix style, lane-fit weights, reference count; pin a plugin to a
  role so advice always names it; per-plugin notes, favourites, hiding and
  role overrides (set on the Plugins page); your own notes and sayings (shown
  on Learn, ranked first in Ask, sent to the AI coach); accent and chart
  colours, heading font, density, which report cards show; JSON export /
  import / reset.
- **Vocal source** (`/catalog`, `/studio`, `/lanes`, `/sound`, `/saved`) — the
  earlier vocal-sample catalog and idea roller, still here.
- Mac pack zip from `src/lib/mac-pack.ts` (Logic Scripter + MIDI + notes).

## Not an Audio Unit

Logic will not load a website as a plugin. See `docs/SHIP.md` for the
JUCE wrapper plan.

## Develop

```
npm install
npm run dev        # 0.0.0.0:8080
npm run typecheck
npm test           # includes src/lib/hh/dsp.test.ts (synthetic-signal DSP checks)
npm run build
```

## Repo rules

- Keep **private**
- No API keys, no myclaw config, no license-server secrets
- Releases are for paid zips later, not a public storefront
