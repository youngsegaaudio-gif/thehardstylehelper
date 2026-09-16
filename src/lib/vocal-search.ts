import { createServerFn } from "@tanstack/react-start";

export type VocalHit = {
  title: string;
  url: string;
  host: string;
  kind: "license" | "listen";
};

export type VocalSearchResult =
  | { ok: true; query: string; hits: VocalHit[]; shops: VocalHit[] }
  | { ok: false; error: string };

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const ALLOW = [
  "splice.com",
  "freesound.org",
  "loopmasters.com",
  "loopcloud.com",
  "pixabay.com",
  "archive.org",
  "epidemicsound.com",
  "artlist.io",
  "audiojungle.net",
  "envato.com",
  "cymatics.fm",
  "producerloops.com",
  "landr.com",
  "bbc.co.uk",
  "odd-sound.com",
  "hardstyle.com",
];

function allowed(url: string) {
  const h = hostOf(url);
  return ALLOW.some((x) => h === x || h.endsWith("." + x));
}

function shops(q: string): VocalHit[] {
  const enc = encodeURIComponent(q);
  return [
    { title: "Freesound", url: `https://freesound.org/search/?q=${enc}`, host: "freesound.org", kind: "license" },
    { title: "Splice", url: `https://splice.com/sounds/search?q=${enc}`, host: "splice.com", kind: "license" },
    { title: "Loopmasters", url: `https://www.loopmasters.com/search?q=${enc}`, host: "loopmasters.com", kind: "license" },
    { title: "Pixabay SFX", url: `https://pixabay.com/sound-effects/search/${enc}/`, host: "pixabay.com", kind: "license" },
    { title: "Internet Archive", url: `https://archive.org/search?query=${enc}+AND+mediatype%3A(audio)`, host: "archive.org", kind: "license" },
  ];
}

export const searchVocals = createServerFn({ method: "POST" })
  .validator((input: { vibe: string; vox: string; school: string }) => input)
  .handler(async ({ data }): Promise<VocalSearchResult> => {
    const q = [data.vibe.trim(), data.school.replace("-", " "), data.vox, "vocal"].filter(Boolean).join(" ");
    const shop = shops(q || "hardstyle vocal");
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true, query: q, hits: [], shops: shop };
    }
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 500,
          messages: [
            {
              role: "system",
              content:
                "Find licensed or Creative Commons vocal samples matching the request. JSON only: {\"hits\":[{\"title\":\"...\",\"url\":\"https://...\"}]}. 6 items max. URLs must be splice.com, freesound.org, loopmasters.com, pixabay.com, archive.org, cymatics.fm, producerloops.com, epidemicsound.com, or similar stores. Never YouTube rips, stem splitters, or pirate hosts. Prefer real search URLs for this vibe.",
            },
            {
              role: "user",
              content: `Vibe: ${data.vibe.slice(0, 200) || "hard dance"}\nStyle: ${data.school}\nVocal: ${data.vox}`,
            },
          ],
        }),
      });
      if (!res.ok) return { ok: true, query: q, hits: [], shops: shop };
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const raw = (body.choices?.[0]?.message?.content ?? "").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw) as { hits?: { title?: string; url?: string }[] };
      const hits: VocalHit[] = [];
      const seen = new Set<string>();
      for (const h of parsed.hits ?? []) {
        const url = String(h.url ?? "");
        if (!url.startsWith("https://") || !allowed(url) || seen.has(url)) continue;
        seen.add(url);
        hits.push({
          title: String(h.title ?? hostOf(url)).slice(0, 90),
          url,
          host: hostOf(url),
          kind: "license",
        });
        if (hits.length >= 8) break;
      }
      return { ok: true, query: q, hits, shops: shop };
    } catch {
      return { ok: true, query: q, hits: [], shops: shop };
    }
  });

export const vibeLines = createServerFn({ method: "POST" })
  .validator((input: { vibe: string; vox: string; school: string; key: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; title: string; concept: string; lines: string[] } | { ok: false }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey || data.vibe.trim().length < 2) return { ok: false };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 280,
        messages: [
          {
            role: "system",
            content:
              "Write ORIGINAL hard-dance vocal lines. Never quote existing songs. Short, punchy, not poetic. JSON only: {\"title\":\"2-4 words\",\"concept\":\"one sentence\",\"lines\":[\"...\"]}. 2–4 lines matching the vocal type.",
          },
          {
            role: "user",
            content: `Style ${data.school}. Vocal ${data.vox}. Key ${data.key}. Vibe: ${data.vibe.slice(0, 200)}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = body.choices?.[0]?.message?.content ?? "";
    const json = raw.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(json) as { title?: string; concept?: string; lines?: string[] };
      const lines = (parsed.lines ?? []).map((l) => String(l).slice(0, 80)).filter(Boolean).slice(0, 4);
      if (!lines.length) return { ok: false };
      return {
        ok: true,
        title: String(parsed.title ?? "Cut").slice(0, 32),
        concept: String(parsed.concept ?? "").slice(0, 180),
        lines,
      };
    } catch {
      return { ok: false };
    }
  });
