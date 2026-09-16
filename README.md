# Hardstyle Helper

Private product repo. Do not make this public.

Session coach for hardstyle / rawstyle / uptempo / happy hardcore.
Builds a bar plan, then exports a Logic Mac pack (Scripter + MIDI + notes).
This is **not** an Audio Unit. Logic will not load a website as a plugin.

## What ships today

- Web / PWA coach (`PluginFace`, arrangement, kicks, speakers)
- Mac pack zip from `src/lib/mac-pack.ts`
  - `HELPER-Scripter.js` → Logic MIDI FX → Scripter
  - song MIDI + extra-kick / pvc-fill / snare-roll MIDI
  - notes, markers, kick and transition text

## What this is not

- Not a VST3 / AU yet
- Not myclaw. myclaw stays in its own private repo as a personal agent
- Not a kick synth. Edge is coach + phrase-edge MIDI, not another distortion chain

## Sell path

Follow `docs/SHIP.md`.

1. Sell the Mac pack + web coach (Gumroad)
2. Wrap the same UI in a JUCE MIDI FX WebView (AU + VST3)
3. Paid installer + serial only after step 1 sells

## Repo rules

- Keep **private**
- No API keys, no myclaw config, no license-server secrets
- Releases are for paid zips later, not a public storefront
