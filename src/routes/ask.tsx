import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { askHelperAi, searchLocal, type AskAiResult } from "@/lib/hh/ask";
import { HH_GENRE_BY_ID } from "@/lib/hh/genres";
import { QUOTES } from "@/lib/hh/knowledge";
import { DAWS } from "@/lib/hh/plugins-kb";
import { useHh } from "@/lib/hh/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, PageTitle } from "@/components/site-ui";
import { Card, H3, Kicker, Tag } from "@/components/hh-ui";

export const Route = createFileRoute("/ask")({
  component: AskPage,
  head: () => ({ meta: [{ title: "Ask · HARDSTYLE HELPER" }] }),
});

const STARTERS = [
  "Why does my kick sound weak?",
  "How long should the kick tail be at 155 BPM?",
  "How do I make a raw screech in Serum?",
  "What LUFS should a euphoric master be?",
  "How do I structure a 6 minute extended mix?",
  "Which free plugins do I need?",
  "How do I make my lead wider without losing the kick?",
  "What's the difference between raw and xtra raw?",
];

function AskPage() {
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");
  const [ai, setAi] = useState<AskAiResult | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const report = useHh((s) => s.report);
  const daw = useHh((s) => s.daw);
  const plugins = useHh((s) => s.plugins);
  const hits = useMemo(() => (asked ? searchLocal(asked, 8) : []), [asked]);
  const quote = QUOTES[Math.abs(hash(asked || "hh")) % QUOTES.length];

  const submit = (text: string) => {
    setAsked(text.trim());
    setQ(text);
    setAi(null);
  };

  const askAi = async () => {
    if (!asked) return;
    setAiBusy(true);
    try {
      const context = [
        report ? `Producer's last analysis: ${report.summary}` : "",
        `DAW: ${DAWS.find((d) => d.id === daw)?.label ?? daw}. Plugins owned: ${plugins.slice(0, 60).map((p) => p.name).join(", ") || "unknown"}.`,
        ...hits.slice(0, 5).map((h) => `[${h.doc.kind}] ${h.doc.title}: ${h.doc.body.slice(0, 700)}`),
      ]
        .filter(Boolean)
        .join("\n\n");
      const res = await askHelperAi({ data: { question: asked, context } });
      setAi(res);
    } catch (e) {
      setAi({ ok: false, error: (e as Error).message || "AI request failed." });
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <Page narrow>
      <PageTitle
        kicker="Ask"
        title="Ask the helper"
        lede="Type a question. You get answers from everything the app knows — lanes, plugins, Serum recipes, mixing methods, the FAQ — plus an optional AI answer that uses your scan and your last analysis."
      />
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
      >
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="How do I tune my kick to F minor?" className="h-12 flex-1" aria-label="Question" />
        <Button type="submit" className="h-12 font-display tracking-wide">
          <MessageSquare className="size-4" />
          Ask
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button key={s} type="button" onClick={() => submit(s)} className="inline-flex h-9 items-center rounded-full bg-surface-2 px-3 text-xs text-muted shadow-border hover:text-foreground">
            {s}
          </button>
        ))}
      </div>

      {asked ? (
        <section className="mt-8 flex flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Kicker>AI coach</Kicker>
                <p className="mt-1 text-sm text-muted">Uses your DAW, plugin list and the notes below. Needs the deployment's AI key.</p>
              </div>
              <Button onClick={askAi} disabled={aiBusy} variant="outline">
                <Sparkles className="size-4" />
                {aiBusy ? "Thinking…" : "Ask the AI coach"}
              </Button>
            </div>
            {ai ? (
              ai.ok ? (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">{ai.answer}</p>
              ) : (
                <p className="mt-4 text-sm text-warn">{ai.error}</p>
              )
            ) : null}
          </Card>

          <div>
            <Kicker>
              {hits.length ? `${hits.length} answers from the helper` : "No direct match"} · “{asked}”
            </Kicker>
            {hits.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                Try other words (kick, tail, screech, lead, LUFS, build, raw, euphoric…) or browse{" "}
                <Link to="/learn" className="underline underline-offset-2 hover:text-foreground">
                  Learn
                </Link>
                .
              </p>
            ) : null}
            <ul className="mt-3 flex flex-col gap-2">
              {hits.map((h) => (
                <li key={h.doc.id} className="rounded-xl bg-surface p-4 shadow-border">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{h.doc.kind}</Tag>
                    <H3 className="text-sm">{h.doc.title}</H3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.doc.kind === "faq" ? h.doc.body.replace(/\s\S+$/, "") : h.snippet}</p>
                  <Link to={h.doc.route} className="mt-2 inline-flex h-9 items-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline">
                    Open {h.doc.route.replace("/", "")} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Card className="mt-10">
        <Kicker>Studio saying</Kicker>
        <p className="font-display mt-2 text-xl leading-snug tracking-wide text-foreground">“{quote.text}”</p>
        <p className="mt-2 text-xs text-muted">{quote.who}</p>
      </Card>
      {report ? (
        <p className="mt-4 text-xs text-muted">
          Context in use: {report.fileName} judged against {HH_GENRE_BY_ID[report.target].label}. <Link to="/analyse" className="underline underline-offset-2">Change</Link>
        </p>
      ) : null}
    </Page>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
