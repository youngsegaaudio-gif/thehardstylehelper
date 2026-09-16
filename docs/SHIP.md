# Ship plan

Keep this repo private. GitHub is the vault, not the shop.

## Layer 1 — sell what exists (do this first)

Product name: Hardstyle Helper for Logic
Price target: $29–49 one-time on Gumroad

Zip must contain:

- README-MAC.txt (how to paste Scripter)
- HELPER-Scripter.js
- {song}-logic.mid
- extra-kick.mid
- pvc-fill.mid
- snare-roll.mid
- notes / pvc-kicks / transitions / MARKERS text

Checklist before tagging `v0.1-macpack`:

- [ ] Generate pack from a real session (one style, one key, one BPM)
- [ ] Open zip on a Mac
- [ ] Paste Scripter into Logic MIDI FX and hit Run Script
- [ ] Drag the song MIDI onto arrange — markers land on phrase edges
- [ ] Extra kick / fill / roll MIDI fire where the notes say they should
- [ ] README a mate can follow with no chat help
- [ ] No API keys in the zip

Gumroad listing copy (short):

Hardstyle Helper for Logic. Session coach plus a Scripter + MIDI pack.
Paste the script, drop the MIDI, get phrase-edge extra kicks and fills.
Not an Audio Unit. Works in Logic Pro on Mac.

License for v1: email + serial in a text file. No iLok yet.

## Layer 2 — DAW plugin shape

JUCE MIDI FX that hosts the existing PluginFace UI in a WebView.

- Reads DAW transport (bar, BPM)
- Sends MIDI (fills, extra kicks)
- Formats: AU MIDI FX + VST3

Do not start this until Layer 1 has a zip you would send a mate.
Notes: `native/README.md`

## Layer 3 — paid native

Apple-notarized pkg + Windows installer + Lemon Squeezy / Gumroad license API.
JUCE Starter is fine under the revenue cap; switch to Indie after that.

## Do not

- Make the repo public
- Call the website an Audio Unit
- Ship myclaw or API keys inside the product
- Build a kick synth before the coach pack sells
