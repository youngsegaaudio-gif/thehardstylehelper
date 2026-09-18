import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EVENTS, FAQ, GLOSSARY, HISTORY, LABELS, QUOTES } from "@/lib/hh/knowledge";
import { useHh } from "@/lib/hh/store";
import { Page, PageTitle, SearchField } from "@/components/site-ui";
import { Card, Details, H2, H3, Kicker } from "@/components/hh-ui";

export const Route = createFileRoute("/learn")({
  component: LearnPage,
  head: () => ({ meta: [{ title: "Learn · HARDSTYLE HELPER" }] }),
});

function LearnPage() {
  const [q, setQ] = useState("");
  const notes = useHh((s) => s.custom.notes);
  const ownQuotes = useHh((s) => s.custom.quotes);
  const ql = q.trim().toLowerCase();
  const myNotes = useMemo(() => (ql ? notes.filter((n) => `${n.title} ${n.body} ${n.tags.join(" ")}`.toLowerCase().includes(ql)) : notes), [ql, notes]);
  const faq = useMemo(() => (ql ? FAQ.filter((f) => `${f.q} ${f.a} ${f.tags.join(" ")}`.toLowerCase().includes(ql)) : FAQ), [ql]);
  const glossary = useMemo(() => (ql ? GLOSSARY.filter((g) => `${g.term} ${g.def}`.toLowerCase().includes(ql)) : GLOSSARY), [ql]);

  return (
    <Page>
      <PageTitle kicker="Learn" title="Hardstyle, explained" lede="History, the words people use, labels and events, the questions everyone asks, and the sayings that stick." />
      <div className="max-w-md">
        <SearchField value={q} onChange={setQ} placeholder="Search the FAQ and glossary" />
      </div>

      {myNotes.length ? (
        <section className="mt-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <Kicker>Your notes</Kicker>
              <H2 className="mt-2">{myNotes.length} of your own</H2>
            </div>
            <Link to="/customise" search={{ tab: "content" }} className="text-sm text-muted hover:text-foreground">
              Edit →
            </Link>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {myNotes.map((n) => (
              <li key={n.id} className="rounded-xl bg-surface p-4 shadow-border">
                <H3>{n.title}</H3>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted">{n.body}</p>
                {n.tags.length ? <p className="mt-2 text-xs text-subtle">{n.tags.join(" · ")}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <Kicker>FAQ</Kicker>
        <H2 className="mt-2">{faq.length} questions</H2>
        <ul className="mt-4 flex flex-col gap-2">
          {faq.map((f) => (
            <li key={f.q}>
              <Details summary={f.q} open={Boolean(ql)}>
                <p className="text-sm leading-relaxed text-muted">{f.a}</p>
              </Details>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <Kicker>History</Kicker>
        <H2 className="mt-2">Twenty-five years in six moves</H2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {HISTORY.map((h) => (
            <li key={h.years} className="rounded-xl bg-surface p-4 shadow-border">
              <p className="font-mono text-xs tabular-nums text-subtle">{h.years}</p>
              <H3 className="mt-1">{h.title}</H3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{h.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <Kicker>Glossary</Kicker>
        <H2 className="mt-2">{glossary.length} terms</H2>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {glossary.map((g) => (
            <div key={g.term} className="rounded-xl bg-surface p-4 shadow-border">
              <dt className="text-sm font-semibold text-foreground">{g.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{g.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <Kicker>Labels</Kicker>
          <ul className="mt-3 space-y-2">
            {LABELS.map((l) => (
              <li key={l.name} className="text-sm">
                <span className="font-semibold text-foreground">{l.name}</span> <span className="text-muted">— {l.note}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <Kicker>Events</Kicker>
          <ul className="mt-3 space-y-2">
            {EVENTS.map((l) => (
              <li key={l.name} className="text-sm">
                <span className="font-semibold text-foreground">{l.name}</span> <span className="text-muted">— {l.note}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-10">
        <Kicker>Studio sayings</Kicker>
        <H2 className="mt-2">Things producers repeat</H2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...ownQuotes, ...QUOTES].map((qu) => (
            <li key={`${qu.text}|${qu.who}`} className="rounded-xl bg-surface p-4 shadow-border">
              <p className="font-display text-base leading-snug tracking-wide text-foreground">“{qu.text}”</p>
              <p className="mt-2 text-xs text-muted">{qu.who}</p>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
