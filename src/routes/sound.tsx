import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import {
  BASS_OPTS,
  HOOK_OPTS,
  KEYS,
  KICK_OPTS,
  PHRASE_OPTS,
  VOX_OPTS,
} from "@/lib/hs-ideas";
import { useVs } from "@/lib/vs-store";
import { Button } from "@/components/ui/button";
import { Chip, Page, PageTitle } from "@/components/site-ui";

export const Route = createFileRoute("/sound")({
  component: SoundPage,
  head: () => ({ meta: [{ title: "Sound · VOCAL SOURCE" }] }),
});

function SoundPage() {
  const navigate = useNavigate();
  const you = useVs((s) => s.you);
  const persistYou = useVs((s) => s.persistYou);
  const resetYou = useVs((s) => s.resetYou);
  const roll = useVs((s) => s.roll);

  return (
    <Page narrow>
      <PageTitle
        kicker="Your sound"
        title="Lock the next roll"
        lede="Mix keeps DJ 4×4 phrases 90% of the time. Anything left on Any stays random."
      />
      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          className="h-12 flex-1 font-display tracking-wide"
          onClick={() => {
            roll();
            void navigate({ to: "/studio" });
          }}
        >
          <RotateCw className="size-4" />
          Roll with this
        </Button>
        <Button variant="outline" className="h-12" onClick={resetYou}>
          Reset
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Phrases">
          {PHRASE_OPTS.map((o) => (
            <Chip key={o.id} active={you.phrases === o.id} onClick={() => persistYou({ phrases: o.id })}>
              {o.label}
            </Chip>
          ))}
          <p className="w-full pt-1 text-xs text-subtle">
            {PHRASE_OPTS.find((o) => o.id === you.phrases)?.hint}
          </p>
        </Field>
        <Field label="Kick">
          {KICK_OPTS.map((o) => (
            <Chip key={o.id} active={you.kick === o.id} onClick={() => persistYou({ kick: o.id })}>
              {o.label}
            </Chip>
          ))}
        </Field>
        <Field label="Bass">
          {BASS_OPTS.map((o) => (
            <Chip key={o.id} active={you.bass === o.id} onClick={() => persistYou({ bass: o.id })}>
              {o.label}
            </Chip>
          ))}
        </Field>
        <Field label="Hook">
          {HOOK_OPTS.map((o) => (
            <Chip key={o.id} active={you.hook === o.id} onClick={() => persistYou({ hook: o.id })}>
              {o.label}
            </Chip>
          ))}
        </Field>
        <Field label="Vox">
          {VOX_OPTS.map((o) => (
            <Chip key={o.id} active={you.vox === o.id} onClick={() => persistYou({ vox: o.id })}>
              {o.label}
            </Chip>
          ))}
        </Field>
        <Field label="Key">
          <Chip active={you.key === "any"} onClick={() => persistYou({ key: "any" })}>
            Any
          </Chip>
          {KEYS.map((k) => (
            <Chip key={k} active={you.key === k} onClick={() => persistYou({ key: k })}>
              {k.replace(" minor", " min")}
            </Chip>
          ))}
        </Field>
      </div>
    </Page>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
