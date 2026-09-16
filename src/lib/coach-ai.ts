import { createServerFn } from "@tanstack/react-start";
import { sectionAt, STYLES } from "./catalog";
import { progressionLabel } from "./voicings";
import type { CoachPack, TrackSession } from "./types";

export type CoachAiResult =
  | { ok: true; pack: CoachPack }
  | { ok: false; error: string };

const SYSTEM = `You are HELPER, a blunt studio coach for hardstyle, rawstyle, uptempo, UK hardcore, happy hardcore (AR Gang, Lil Texas, Darren Styles, S3RL and adjacent).
The user is in Logic Pro on Mac, writing with Serum and Kick 3.
Give the NEXT move for THIS bar and the next 8–32 bars. Be specific: frequencies, env times, MIDI rhythms, Logic routing, Serum osc/unison/filter/FX, PVC extra kicks, and WHERE to put transitions for THIS genre (hard techno = 1-bar mutes/fills; hardstyle = 8-bar rises + snare rolls).
Never waffle. Never suggest they buy new plugins as the first move. Logic stock + Serum + Kick 3 is enough; FabFilter/Kilohearts only as optional.
Return ONLY JSON matching this shape:
{
  "headline": "short",
  "why": "one sentence context",
  "nextMove": "the single most important action",
  "barPlan": [{"id":"1","title":"...","detail":"...","bars":"next 8","tag":"arrange"}],
  "instruments": [{"name":"...","role":"...","how":"..."}],
  "mix": [{"layer":"...","eq":"...","compression":"...","plugins":"..."}],
  "serum": [{"title":"...","sound":"...","osc":["..."],"filterEnv":["..."],"fx":["..."],"mix":["..."]}],
  "logic": [{"title":"...","steps":["..."]}],
  "arrangementNote": "one paragraph",
  "songPlan": [{"id":"intro-0","label":"Kick intro","kind":"intro","startBar":0,"bars":16,"do":"..."}]
}
Keep barPlan to 4–6 items, mix to 3–4, serum to 2–3, logic to 3, songPlan to the sections of THIS style. Output raw JSON only — no markdown fences.`;

export const askCoach = createServerFn({ method: "POST" })
  .validator((input: { session: TrackSession }) => input)
  .handler(async ({ data }): Promise<CoachAiResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI coach is unavailable in this environment." };
    }

    const s = data.session;
    const style = STYLES[s.style];
    const section = sectionAt(s.style, s.bar);
    const map = style.arrangement
      .map((sec) => `bar ${sec.startBar + 1}–${sec.startBar + sec.bars} ${sec.label} (${sec.kind}, ${sec.bars} bars)`)
      .join("; ");
    const user = [
      `Track: ${s.name}`,
      `Style: ${style.name} (${style.aka}) at ${s.bpm} BPM, typical ${style.bpmRange[0]}–${style.bpmRange[1]}`,
      `Key: ${s.key}  progression ${style.progression} → ${progressionLabel(s.key)}`,
      `Playhead bar: ${s.bar + 1} (0-indexed ${s.bar}) — section "${section.label}" (${section.kind}), ${section.bars} bars starting at ${section.startBar + 1}`,
      `Style DNA: ${style.dna.join(" | ")}`,
      `Arrangement map: ${map}`,
      `Layers already in the track: ${s.layers.join(", ") || "(none yet)"}`,
      `Producer notes: ${s.notes.trim() || "(none)"}`,
      "Tell me what to do next in the arrangement, which instruments/layers to add, EQ and compression, Serum chords/leads/mixing, and how to do it in Logic.",
    ].join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Coach request failed (${res.status}). Try again.` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const pack = parsePack(text);
    if (!pack) {
      return { ok: false, error: "Coach returned an unreadable answer. Try again." };
    }
    return { ok: true, pack };
  });

function parsePack(text: string): CoachPack | null {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const raw = JSON.parse(trimmed.slice(start, end + 1)) as CoachPack;
    if (!raw.nextMove || !Array.isArray(raw.barPlan)) return null;
    return {
      headline: String(raw.headline || "Coach"),
      why: String(raw.why || ""),
      nextMove: String(raw.nextMove),
      barPlan: Array.isArray(raw.barPlan) ? raw.barPlan.slice(0, 8) : [],
      instruments: Array.isArray(raw.instruments) ? raw.instruments.slice(0, 6) : [],
      mix: Array.isArray(raw.mix) ? raw.mix.slice(0, 5) : [],
      serum: Array.isArray(raw.serum) ? raw.serum.slice(0, 4) : [],
      logic: Array.isArray(raw.logic) ? raw.logic.slice(0, 5) : [],
      arrangementNote: String(raw.arrangementNote || ""),
      songPlan: Array.isArray(raw.songPlan) ? raw.songPlan.slice(0, 12) : [],
    };
  } catch {
    return null;
  }
}
