/**
 * Questions: a local search over everything the app knows (works offline),
 * and an optional AI answer through the same xAI endpoint the coach uses
 * when the deployment has an XAI_API_KEY.
 */
import { createServerFn } from "@tanstack/react-start";
import { HH_GENRES } from "./genres";
import { FAQ, GLOSSARY, HISTORY, QUOTES } from "./knowledge";
import { MIX_TOPICS } from "./mixing";
import { PLUGIN_KB } from "./plugins-kb";
import { SERUM_FILTER_GUIDE, SERUM_PATCHES, FILTER_MIX_RULES } from "./serum";

export type Doc = {
  id: string;
  kind: "faq" | "glossary" | "genre" | "plugin" | "mix" | "serum" | "history" | "quote" | "filter";
  title: string;
  body: string;
  route: string;
};

let INDEX: Doc[] | null = null;

export function buildIndex(): Doc[] {
  if (INDEX) return INDEX;
  const docs: Doc[] = [];
  for (const f of FAQ) docs.push({ id: `faq-${f.q}`, kind: "faq", title: f.q, body: `${f.a} ${f.tags.join(" ")}`, route: "/learn" });
  for (const g of GLOSSARY) docs.push({ id: `gl-${g.term}`, kind: "glossary", title: g.term, body: g.def, route: "/learn" });
  for (const h of HISTORY) docs.push({ id: `hi-${h.years}`, kind: "history", title: `${h.years} — ${h.title}`, body: h.body, route: "/learn" });
  for (const g of HH_GENRES)
    docs.push({
      id: `ge-${g.id}`,
      kind: "genre",
      title: `${g.label} (${g.aka})`,
      body: `${g.summary} ${g.dna.join(" ")} Kick: ${g.kick} Lead: ${g.lead} Bass: ${g.bass} Arrangement: ${g.arrangement} Artists: ${g.artists.join(", ")}. BPM ${g.targets.bpm.join("–")}. Loudness ${g.targets.lufs.join(" to ")} LUFS.`,
      route: "/genres",
    });
  for (const p of PLUGIN_KB)
    docs.push({ id: `pl-${p.id}`, kind: "plugin", title: `${p.name} (${p.vendor})`, body: `${p.what} ${p.hardstyle} Easy: ${p.easy} Hard: ${p.hard} ${p.roles.join(" ")}`, route: "/plugins" });
  for (const m of MIX_TOPICS)
    docs.push({ id: `mx-${m.id}`, kind: "mix", title: `Mixing: ${m.title}`, body: `${m.goal} Easy: ${m.easy.join(" ")} Hard: ${m.hard.join(" ")} Methods: ${m.methods.map((x) => `${x.name} (${x.who}): ${x.how}`).join(" ")} ${m.numbers.join(" ")}`, route: "/mix" });
  for (const s of SERUM_PATCHES)
    docs.push({ id: `se-${s.id}`, kind: "serum", title: `Serum: ${s.name}`, body: `${s.use} ${s.osc.join(" ")} ${s.filter.join(" ")} ${s.env.join(" ")} ${s.fx.join(" ")} ${s.mix.join(" ")} ${s.hard ?? ""}`, route: "/serum" });
  for (const t of [...SERUM_FILTER_GUIDE, ...FILTER_MIX_RULES]) docs.push({ id: `fi-${t.title}`, kind: "filter", title: `Filter: ${t.title}`, body: `${t.body} ${t.where}`, route: "/serum" });
  for (const q of QUOTES) docs.push({ id: `qu-${q.text}`, kind: "quote", title: q.text, body: q.who, route: "/learn" });
  INDEX = docs;
  return docs;
}

const SYN: Record<string, string[]> = {
  kick: ["kick", "tail", "punch", "tok", "drum"],
  tail: ["tail", "kick", "decay"],
  loud: ["loud", "lufs", "limiter", "master", "volume"],
  master: ["master", "mastering", "limiter", "lufs"],
  lead: ["lead", "supersaw", "saw", "melody", "synth"],
  screech: ["screech", "raw", "lead", "comb", "phaser"],
  bass: ["bass", "sub", "reverse", "low"],
  wide: ["wide", "width", "stereo", "mono", "imager"],
  mud: ["mud", "muddy", "low-mid", "150", "400"],
  build: ["build", "buildup", "riser", "roll", "snare"],
  drop: ["drop", "structure", "arrangement"],
  tempo: ["tempo", "bpm", "speed"],
  plugin: ["plugin", "plugins", "vst", "au"],
  free: ["free", "vital", "ott", "youlean", "span"],
};

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9#+\- ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}
const STOP = new Set(["the", "a", "an", "is", "my", "how", "do", "i", "to", "of", "in", "and", "or", "for", "it", "what", "why", "should", "can", "on", "be", "with", "at", "are", "this", "that", "me", "you", "your"]);

export type Hit = { doc: Doc; score: number; snippet: string };

export function searchLocal(q: string, n = 8): Hit[] {
  const docs = buildIndex();
  const qt = tokens(q);
  if (!qt.length) return [];
  const expanded = new Set<string>();
  for (const t of qt) {
    expanded.add(t);
    for (const [k, v] of Object.entries(SYN)) if (t.startsWith(k) || k.startsWith(t)) v.forEach((x) => expanded.add(x));
  }
  const hits: Hit[] = [];
  for (const d of docs) {
    const title = d.title.toLowerCase();
    const body = d.body.toLowerCase();
    let score = 0;
    for (const t of qt) {
      if (title.includes(t)) score += 4;
      const bodyCount = body.split(t).length - 1;
      score += Math.min(3, bodyCount) * 1.2;
    }
    for (const t of expanded) if (!qt.includes(t) && (title.includes(t) || body.includes(t))) score += 0.6;
    if (d.kind === "faq") score *= 1.3;
    if (score > 1.5) {
      // snippet around the first query term
      const first = qt.find((t) => body.includes(t));
      const i = first ? Math.max(0, body.indexOf(first) - 80) : 0;
      const snippet = (i > 0 ? "…" : "") + d.body.slice(i, i + 220).trim() + (d.body.length > i + 220 ? "…" : "");
      hits.push({ doc: d, score, snippet });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, n);
}

/* --- optional AI answer (server) --- */

export type AskAiResult = { ok: true; answer: string } | { ok: false; error: string; unavailable?: boolean };

const SYSTEM = `You are HELPER, a blunt, specific studio coach for hardstyle and its lanes (early, classic, euphoric, raw, xtra raw, rawphoric, psystyle, hardcore, uptempo, frenchcore).
Answer the producer's question directly in under 220 words. Give numbers (Hz, dB, ms, bars, LUFS) and concrete steps. Prefer the plugins they own (listed) and the DAW they use; never tell them to buy something first. Use the supplied notes as your primary source and say so when you go beyond them. No markdown headings; short paragraphs or a numbered list.`;

export const askHelperAi = createServerFn({ method: "POST" })
  .validator((input: { question: string; context: string }) => ({
    question: String(input.question ?? "").slice(0, 1500),
    context: String(input.context ?? "").slice(0, 8000),
  }))
  .handler(async ({ data }): Promise<AskAiResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, unavailable: true, error: "AI answers are off in this deployment; local answers still work." };
    if (!data.question.trim()) return { ok: false, error: "Ask something first." };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.3,
        max_tokens: 700,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Notes:\n${data.context}\n\nQuestion: ${data.question}` },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `AI request failed (${res.status}). Local answers are below.` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim();
    return text ? { ok: true, answer: text } : { ok: false, error: "Empty AI answer." };
  });
