#!/usr/bin/env python3
"""Build BARLINE Logic Pro Scripter pack as a downloadable zip."""
from pathlib import Path
import zipfile

ROOT = Path("/workspace")
PUBLIC = ROOT / "public" / "BARLINE-Mac-Logic-Plugin.zip"
ARTIFACTS = ROOT / "artifacts" / "BARLINE-Mac-Logic-Plugin.zip"

SCRIPTER = r"""// BARLINE — Logic Pro MIDI FX plug-in (Mac)
// Style pack: hardstyle / hard techno / rawstyle extra PVC
//
// INSTALL
// 1. New Software Instrument track.
// 2. Sampler or Drum Machine Designer:
//      C1  (36)  extra / Peak PVC
//      C#1 (37)  Impact PVC
//      D1  (38)  Fill PVC
//      C#2 (49)  crash
// 3. MIDI FX → Scripter → Open Script Editor
// 4. Paste this whole file → Run Script
// 5. Play. Extra kicks fire at every 16-bar edge.

var NeedsTimingInfo = true;
var lastBar = -1;

function contains(arr, n) {
  for (var i = 0; i < arr.length; i++) if (arr[i] === n) return true;
  return false;
}

function hit(pitch, vel, startBeat, lengthBeats) {
  var n = new NoteOn;
  n.pitch = pitch;
  n.velocity = vel;
  n.sendAtBeat(startBeat);
  var off = new NoteOff;
  off.pitch = pitch;
  off.sendAtBeat(startBeat + lengthBeats);
}

function ProcessMIDI() {
  var info = GetTimingInfo();
  if (!info.playing) {
    lastBar = -1;
    return;
  }
  var beat = info.blockStartBeat;
  var bar = Math.floor((beat - 1) / 4) + 1;
  if (bar === lastBar) return;
  lastBar = bar;

  var barStart = (bar - 1) * 4 + 1;
  var phraseEnd = (bar % 16 === 0);
  var phraseStart = (bar % 16 === 1 && bar > 1);

  if (phraseStart) {
    hit(37, 120, barStart, 0.5);
    hit(49, 100, barStart, 1.0);
  }
  if (phraseEnd) {
    hit(38, 108, barStart + 2, 0.2);
    hit(38, 112, barStart + 2.5, 0.2);
    hit(38, 116, barStart + 3, 0.15);
    hit(38, 118, barStart + 3.5, 0.15);
    hit(36, 110, barStart + 3.75, 0.2);
  }
}

function HandleMIDI(e) {
  e.send();
}
"""

README = """BARLINE for Logic Pro on Mac
=============================

This is a Logic MIDI FX plug-in (Scripter), not an Audio Unit.
Logic cannot load a website as an insert. Scripter is the plug-in.

INSTALL (2 minutes)
-------------------
1. Unzip this folder.
2. Open Logic. New Software Instrument.
3. Load Sampler or Drum Machine Designer.
   Put your extra PVC / click on C1 (note 36).
   Impact on C#1. Fill on D1. Crash on C#2.
4. On that track: MIDI FX → Scripter.
5. Open Script Editor. Paste Plug-in/BARLINE-Scripter.js
6. Click Run Script.
7. Play the song. Extra kicks fire at every 16-bar edge.

WHERE TO PUT TRANSITIONS
------------------------
Hardstyle / rawstyle
  Last 2 bars of each 16: snare roll or reverse.
  Bar 1 of the drop: crash + extra kick.
  Mute kick 1 bar before a switch, only once.

Hard techno
  Extra PVC on the offbeat of the last bar of a 16.
  Crash + impact on bar 1 of a peak.
  Filter break: pull the extra click, leave the body.

UK hardcore / happy
  Piano or vocal pickup on the last 4 of the break.
  Clap stack into the drop, extra kick on 1.

PVC extras (short)
------------------
Peak PVC     — the kick. Every beat of groove and peak.
Click extra  — 20–40 ms, HP 2 kHz, 6–8 dB under the peak.
Sub extra    — sine 45–60 Hz, peaks only.
Fill PVC     — last 2 bars of a 16, not the whole drop.
Ghost PVC    — −12 dB, hats-only sections.

Files
-----
Plug-in/BARLINE-Scripter.js   ← paste this
INSTALL.txt
pvc-kicks.txt
transitions.txt
"""

INSTALL = """BARLINE Logic plug-in — Mac

1. Unzip.
2. Logic → New Software Instrument.
3. MIDI FX → Scripter → Open Script Editor.
4. Paste Plug-in/BARLINE-Scripter.js
5. Run Script.
6. Map extra PVC to C1.

Play. Extra kicks hit every 16 bars.
"""

PVC = """BARLINE extra PVC kicks
=======================

Peak PVC (main)
  90–130 ms. HP 28 Hz. Body +3–5 at 70–95 Hz. Scoop 280–450. Click 3.5–5 kHz.
  Clip after distortion. No reverb. Every beat of groove and peak.

Click extra
  20–40 ms. HP 2 kHz. Own track. 6–8 dB under the peak. Whole track.

Sub extra
  Sine 45–60 Hz in the key. Peaks only. Mute in intro and filter breaks.

Mid PVC extra
  HP 200, LP 2 kHz. Distortion then clip. 15–25% under the main. Peaks only.

Fill PVC
  Last 2 bars of a 16. Rolls, not a second kick on 1.

Ghost PVC
  −12 to −18 dB. Hats-only / filter breaks.

Impact PVC
  Bar 1 of a drop or peak. One hit. Crash with it.

Reverse extra
  Last beat before a drop. One shot. Mute the click extra under it.

Noise extra
  White/pink, 16 bars into a peak only. HP 4 kHz. Tiny.
"""

TRANS = """BARLINE transitions by genre
============================

Hardstyle
  Bar 15–16 of a 16: snare or reverse.
  Drop bar 1: crash + extra kick.
  Break in: kick mute 1 bar, pad/stab in.

Rawstyle
  Same 16s. Extra kick can be dirtier, shorter.
  Switch: mute kick 1 bar, then Peak PVC + screech.

Hard techno
  Offbeat extra PVC last bar of a 16.
  Peak bar 1: impact + crash.
  Filter break: click extra out, body stays or drops.

UK hardcore
  Last 4 of the break: piano or vocal pickup.
  Drop: clap stack + extra kick on 1.

Happy hardcore
  Vocal pickup last 2. Crash on 1. Keep the kick short.

Uptempo
  Faster fills. Extra kick can sit on the last 8th.
  Don't stack two bodies.

Where NOT to put a transition
  Mid-phrase (bars 5–12 of a 16) unless it is a fake-out.
  On top of a vocal word.
  Two crashes in a row.
"""

FILES = {
    "INSTALL.txt": INSTALL,
    "README-MAC.txt": README,
    "Plug-in/BARLINE-Scripter.js": SCRIPTER,
    "pvc-kicks.txt": PVC,
    "transitions.txt": TRANS,
}


def main():
    ARTIFACTS.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    for dest in (PUBLIC, ARTIFACTS):
        with zipfile.ZipFile(dest, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for name, body in FILES.items():
                zf.writestr(name, body.strip() + "\n")
        print(f"wrote {dest} ({dest.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
