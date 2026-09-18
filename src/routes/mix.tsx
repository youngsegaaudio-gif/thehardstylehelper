import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MASTER_TARGETS, MIX_TOPICS } from "@/lib/hh/mixing";
import { Chip, Page, PageTitle } from "@/components/site-ui";
import { Bullets, Card, H2, H3, Kicker, Tag } from "@/components/hh-ui";

export const Route = createFileRoute("/mix")({
  component: MixPage,
  head: () => ({ meta: [{ title: "Mixing & mastering · HARDSTYLE HELPER" }] }),
});

function MixPage() {
  const [topic, setTopic] = useState(MIX_TOPICS[0].id);
  const [mode, setMode] = useState<"easy" | "hard">("easy");
  const t = MIX_TOPICS.find((x) => x.id === topic) ?? MIX_TOPICS[0];

  return (
    <Page>
      <PageTitle
        kicker="Mixing & mastering"
        title="Easy way, hard way"
        lede="Every element of a hardstyle mix with a quick approach, a deep approach, and the methods different producers use. Numbers are starting points for the lane, not rules."
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {MIX_TOPICS.map((x) => (
          <Chip key={x.id} active={x.id === topic} onClick={() => setTopic(x.id)}>
            {x.title}
          </Chip>
        ))}
      </div>

      <Card className="mt-6">
        <Kicker>Goal</Kicker>
        <H2 className="mt-2">{t.title}</H2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t.goal}</p>
        <div className="mt-4 flex gap-2">
          <Chip active={mode === "easy"} onClick={() => setMode("easy")}>
            Easy way
          </Chip>
          <Chip active={mode === "hard"} onClick={() => setMode("hard")}>
            Hard way
          </Chip>
        </div>
        <Bullets items={mode === "easy" ? t.easy : t.hard} className="mt-4" />
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <H3>Methods people use</H3>
          <ul className="mt-3 flex flex-col gap-3">
            {t.methods.map((m) => (
              <li key={m.name} className="rounded-lg bg-surface-2 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <Tag>{m.who}</Tag>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.how}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <H3>Numbers</H3>
          <ul className="mt-3 space-y-2">
            {t.numbers.map((n) => (
              <li key={n} className="font-mono text-xs leading-relaxed text-foreground">
                {n}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="mt-10">
        <Kicker>Master targets</Kicker>
        <H2 className="mt-2">Where the lanes land</H2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MASTER_TARGETS.map((m) => (
            <div key={m.lane} className="rounded-xl bg-surface p-4 shadow-border">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{m.lane}</p>
                <p className="font-mono text-sm tabular-nums text-foreground">{m.lufs} LUFS</p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
