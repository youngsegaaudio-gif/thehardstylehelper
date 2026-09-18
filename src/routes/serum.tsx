import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HH_GENRE_BY_ID, type HhGenreId } from "@/lib/hh/genres";
import { FILTER_MIX_RULES, SERUM_FILTER_GUIDE, SERUM_PATCHES } from "@/lib/hh/serum";
import { useHh } from "@/lib/hh/store";
import { Page, PageTitle } from "@/components/site-ui";
import { Bullets, Card, CopyButton, H2, H3, Kicker, LaneChips, Tag } from "@/components/hh-ui";

export const Route = createFileRoute("/serum")({
  component: SerumPage,
  head: () => ({ meta: [{ title: "Serum & filters · HARDSTYLE HELPER" }] }),
});

function SerumPage() {
  const report = useHh((s) => s.report);
  const [lane, setLane] = useState<HhGenreId | "auto">("auto");
  const effective: HhGenreId | null = lane === "auto" ? (report?.target ?? null) : lane;
  const patches = useMemo(
    () => (effective ? [...SERUM_PATCHES].sort((a, b) => Number(b.lanes.includes(effective)) - Number(a.lanes.includes(effective))) : SERUM_PATCHES),
    [effective],
  );

  return (
    <Page>
      <PageTitle
        kicker="Default advice"
        title="Serum and filters"
        lede="Patch recipes you can dial in from an init patch, the Serum filter types that matter for hardstyle, and the filter rules that fix most mixes. Shown with every analysis."
      />
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <Kicker>Sort for a lane</Kicker>
        {effective && lane === "auto" ? <Tag>from your last analysis: {HH_GENRE_BY_ID[effective].label}</Tag> : null}
      </div>
      <LaneChips value={lane} onChange={setLane} allowAuto />

      <section className="mt-8">
        <H2>Patches</H2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {patches.map((p) => {
            const text = [
              `${p.name} — ${p.use}`,
              "",
              "OSC", ...p.osc.map((x) => `- ${x}`),
              "FILTER", ...p.filter.map((x) => `- ${x}`),
              "ENV / MOD", ...p.env.map((x) => `- ${x}`),
              "FX", ...p.fx.map((x) => `- ${x}`),
              "MIX", ...p.mix.map((x) => `- ${x}`),
              ...(p.hard ? ["", `Hard way: ${p.hard}`] : []),
            ].join("\n");
            const fits = effective ? p.lanes.includes(effective) : false;
            return (
              <Card key={p.id} className={fits ? "shadow-border-hover" : undefined}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <H3 className="text-lg">{p.name}</H3>
                    <p className="mt-1 text-sm text-muted">{p.use}</p>
                  </div>
                  <CopyButton text={text} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.lanes.map((l) => (
                    <Tag key={l} className={l === effective ? "text-foreground" : undefined}>
                      {HH_GENRE_BY_ID[l].label}
                    </Tag>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Block title="Oscillators" items={p.osc} />
                  <Block title="Filter" items={p.filter} />
                  <Block title="Envelopes & modulation" items={p.env} />
                  <Block title="FX" items={p.fx} />
                </div>
                <Block title="In the mix" items={p.mix} className="mt-4" />
                {p.hard ? (
                  <div className="mt-4 rounded-lg bg-surface-2 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-warn">Hard way</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">{p.hard}</p>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div>
          <H2>Serum filter types</H2>
          <p className="mt-2 text-sm text-muted">Which filter for which sound.</p>
          <ul className="mt-4 flex flex-col gap-2">
            {SERUM_FILTER_GUIDE.map((t) => (
              <li key={t.title} className="rounded-xl bg-surface p-4 shadow-border">
                <div className="flex items-start justify-between gap-3">
                  <H3>{t.title}</H3>
                  <Tag>{t.where}</Tag>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <H2>Filter rules for the mix</H2>
          <p className="mt-2 text-sm text-muted">Where to high-pass, low-pass and automate.</p>
          <ul className="mt-4 flex flex-col gap-2">
            {FILTER_MIX_RULES.map((t) => (
              <li key={t.title} className="rounded-xl bg-surface p-4 shadow-border">
                <div className="flex items-start justify-between gap-3">
                  <H3>{t.title}</H3>
                  <Tag>{t.where}</Tag>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Page>
  );
}

function Block({ title, items, className }: { title: string; items: string[]; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-widest text-subtle">{title}</p>
      <Bullets items={items} className="mt-2" />
    </div>
  );
}
