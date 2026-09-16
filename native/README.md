# Native MIDI FX (Layer 2)

Empty on purpose. Do not drop a full JUCE tree here until Layer 1 sells.

Target later:

- JUCE MIDI effect (not an audio synth)
- WebView loads the existing PluginFace UI
- Host gives bar + BPM
- Plugin sends MIDI notes the Scripter already describes
- Build AU + VST3

Until then, the Logic path is Scripter + MIDI from `src/lib/mac-pack.ts`.
