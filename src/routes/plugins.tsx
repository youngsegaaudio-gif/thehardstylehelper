import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FolderOpen, FolderSearch, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  DAWS,
  identify,
  PLUGIN_KB,
  ROLE_LABEL,
  rolesOwned,
  stockFor,
  type DawId,
  type KbPlugin,
  type PluginRole,
} from "@/lib/hh/plugins-kb";
import {
  MAC_LIST_COMMAND,
  parsePastedList,
  PLUGIN_FOLDERS,
  pluginsFromFileList,
  scanWithDirectoryPicker,
  supportsDirectoryPicker,
  WINDOWS_LIST_COMMAND,
  type ScannedPlugin,
} from "@/lib/hh/plugin-scan";
import { ROLE_GUIDE } from "@/lib/hh/role-guide";
import { useHh } from "@/lib/hh/store";
import type { PluginPref } from "@/lib/hh/customise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Chip, Page, PageTitle, SearchField } from "@/components/site-ui";
import { Card, CopyButton, Details, EasyHard, Empty, H2, H3, Kicker, Tag } from "@/components/hh-ui";

export const Route = createFileRoute("/plugins")({
  component: PluginsPage,
  head: () => ({ meta: [{ title: "Plugins · HARDSTYLE HELPER" }] }),
});

const ESSENTIAL: { role: PluginRole; why: string; free: string }[] = [
  { role: "synth", why: "Leads, screeches, tails.", free: "Vital (free)" },
  { role: "kick", why: "Kick tails on a drawn pitch curve.", free: "Any sampler + Serum tail patch" },
  { role: "eq", why: "High-pass everything but the kick.", free: "Your DAW's EQ" },
  { role: "compressor", why: "Bus glue, sidechain.", free: "Your DAW's compressor" },
  { role: "multiband", why: "Kick tail control; OTT leads.", free: "OTT (free)" },
  { role: "distortion", why: "Raw kick mids, screeches.", free: "CamelCrusher (free)" },
  { role: "clipper", why: "Punch and loudness.", free: "Any free clipper" },
  { role: "limiter", why: "Master ceiling.", free: "Your DAW's limiter" },
  { role: "meter", why: "LUFS and spectrum.", free: "Youlean + SPAN (free)" },
  { role: "sidechain", why: "Pumping leads to the kick.", free: "Compressor sidechain input" },
];

function PluginsPage() {
  const ready = useHh((s) => s.ready);
  const daw = useHh((s) => s.daw);
  const setDaw = useHh((s) => s.setDaw);
  const plugins = useHh((s) => s.plugins);
  const scannedAt = useHh((s) => s.scannedAt);
  const addPlugins = useHh((s) => s.addPlugins);
  const removePlugin = useHh((s) => s.removePlugin);
  const clearPlugins = useHh((s) => s.clearPlugins);
  const ownedIds = useHh((s) => s.ownedIds);
  const pluginPrefs = useHh((s) => s.custom.pluginPrefs);
  const setPluginPref = useHh((s) => s.setPluginPref);
  const rolePins = useHh((s) => s.custom.rolePins);
  const [showHidden, setShowHidden] = useState(false);
  const [paste, setPaste] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState<PluginRole | "all">("all");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [canPick, setCanPick] = useState(false);
  useEffect(() => {
    setCanPick(supportsDirectoryPicker());
  }, []);

  const identified = useMemo(
    () =>
      plugins.map((p) => {
        const id = identify(p.name);
        const pref = pluginPrefs[p.name];
        return { p, id: pref?.roles?.length ? { ...id, roles: pref.roles, guessed: false } : id, pref };
      }),
    [plugins, pluginPrefs],
  );
  const hiddenCount = identified.filter((x) => x.pref?.hidden).length;
  const owned = useMemo(() => ownedIds(), [plugins, pluginPrefs]); // eslint-disable-line react-hooks/exhaustive-deps
  const ownedRoles = useMemo(() => rolesOwned(owned), [owned]);
  const stock = useMemo(() => stockFor(daw), [daw]);
  const roles = useMemo(() => {
    const set = new Set<PluginRole>();
    identified.forEach((x) => x.id.roles.forEach((r) => set.add(r)));
    return [...set].sort((a, b) => ROLE_LABEL[a].localeCompare(ROLE_LABEL[b]));
  }, [identified]);
  const shown = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return identified
      .filter((x) => showHidden || !x.pref?.hidden)
      .filter((x) => (role === "all" || x.id.roles.includes(role)) && (!ql || x.p.name.toLowerCase().includes(ql) || x.id.kb?.vendor.toLowerCase().includes(ql)))
      .sort((a, b) => Number(Boolean(b.pref?.favourite)) - Number(Boolean(a.pref?.favourite)));
  }, [identified, q, role, showHidden]);

  const ingest = (list: ScannedPlugin[], source: string) => {
    if (!list.length) {
      toast(`Nothing that looks like a plugin in ${source}.`);
      return;
    }
    addPlugins(list);
    toast(`Added ${list.length} plugin${list.length === 1 ? "" : "s"} from ${source}.`);
  };

  const pickFolder = async () => {
    setBusy(true);
    try {
      const list = await scanWithDirectoryPicker();
      if (list) ingest(list, "the folder");
    } catch (e) {
      toast((e as Error).message || "Could not read that folder.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <PageTitle
        kicker="Your studio"
        title="Scan your plugins"
        lede="Point the app at your plugin folder and it explains every plugin it finds — what it is, how hardstyle producers use it, the easy move and the hard move. The analyser then recommends the tools you actually own."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Kicker>Step 1 · your DAW</Kicker>
          <div className="mt-3 flex flex-wrap gap-2">
            {DAWS.map((d) => (
              <Chip key={d.id} active={daw === d.id} onClick={() => setDaw(d.id as DawId)}>
                {d.label}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{DAWS.find((d) => d.id === daw)?.hint}</p>

          <Kicker>
            <span className="mt-6 block">Step 2 · scan</span>
          </Kicker>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {canPick ? (
              <Button className="h-12 flex-1" onClick={pickFolder} disabled={busy}>
                <FolderSearch className="size-4" />
                {busy ? "Scanning…" : "Choose a plugin folder"}
              </Button>
            ) : null}
            <Button variant={canPick ? "outline" : "default"} className="h-12 flex-1" onClick={() => fileRef.current?.click()}>
              <FolderOpen className="size-4" />
              {canPick ? "Or upload a folder" : "Choose a plugin folder"}
            </Button>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              multiple
              // @ts-expect-error non-standard attribute for directory upload
              webkitdirectory=""
              onChange={(e) => {
                if (e.target.files) ingest(pluginsFromFileList(e.target.files), "the upload");
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Nothing leaves your computer: the browser only reads file names. On a Mac open <span className="font-mono text-foreground">/Library/Audio/Plug-Ins</span>{" "}
            (or the one in your user Library); on Windows <span className="font-mono text-foreground">C:\Program Files\Common Files\VST3</span>. Scan more than one folder — they add up.
          </p>

          <Details summary="Or paste a list (works in every browser)">
            <p className="text-xs text-muted">Run one of these in Terminal / Command Prompt, then paste. Any list of names or paths works too — one per line.</p>
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <code className="min-w-0 flex-1 overflow-x-auto rounded-md bg-bg p-2 font-mono text-xs text-foreground">{MAC_LIST_COMMAND}</code>
                <CopyButton text={MAC_LIST_COMMAND} label="Mac" />
              </div>
              <div className="flex items-start gap-2">
                <code className="min-w-0 flex-1 overflow-x-auto rounded-md bg-bg p-2 font-mono text-xs text-foreground">{WINDOWS_LIST_COMMAND}</code>
                <CopyButton text={WINDOWS_LIST_COMMAND} label="Windows" />
              </div>
            </div>
            <Textarea
              className="mt-3 min-h-28 font-mono text-xs"
              placeholder={"Serum.vst3\nFabFilter Pro-Q 3.component\nKick 3.vst3"}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
            />
            <Button
              size="sm"
              className="mt-2"
              onClick={() => {
                ingest(parsePastedList(paste), "the pasted list");
                setPaste("");
              }}
            >
              <Upload className="size-4" />
              Add pasted plugins
            </Button>
            <p className="mt-3 text-xs text-muted">
              Typical folders — Mac: {PLUGIN_FOLDERS.mac.join(", ")}. Windows: {PLUGIN_FOLDERS.windows.join(", ")}.
            </p>
          </Details>
        </Card>

        <Card>
          <Kicker>What you have</Kicker>
          <p className="font-mono mt-2 text-3xl tabular-nums text-foreground">{ready ? plugins.length : "…"}</p>
          <p className="text-xs text-muted">
            plugins · {owned.length} recognised by name
            {scannedAt ? ` · scanned ${new Date(scannedAt).toLocaleDateString()}` : ""}
          </p>
          <ul className="mt-4 space-y-1.5">
            {ESSENTIAL.map((e) => {
              const has = ownedRoles.has(e.role) || stock.some((s) => s.roles.includes(e.role));
              return (
                <li key={e.role} className="flex items-start gap-2 text-xs">
                  <span className={`mt-1 size-1.5 shrink-0 rounded-full ${has ? "bg-ok" : "bg-warn"}`} />
                  <span className="text-foreground">
                    {ROLE_LABEL[e.role]}
                    <span className="text-muted"> — {has ? e.why : `missing · ${e.free}`}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {plugins.length ? (
            <Button variant="ghost" size="sm" className="mt-4" onClick={clearPlugins}>
              <Trash2 className="size-4" />
              Clear the list
            </Button>
          ) : null}
          <Button asChild size="sm" className="mt-4 w-full">
            <Link to="/analyse">Analyse a track with these</Link>
          </Button>
        </Card>
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Kicker>Step 3 · every plugin explained</Kicker>
            <H2 className="mt-2">{plugins.length ? `${shown.length} of ${plugins.length}` : "Scan to see your list"}</H2>
          </div>
          <div className="w-full max-w-xs">
            <SearchField value={q} onChange={setQ} placeholder="Search your plugins" />
          </div>
        </div>
        {roles.length ? (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <Chip active={role === "all"} onClick={() => setRole("all")}>
              All roles
            </Chip>
            {roles.map((r) => (
              <Chip key={r} active={role === r} onClick={() => setRole(role === r ? "all" : r)}>
                {ROLE_LABEL[r]}
              </Chip>
            ))}
          </div>
        ) : null}
        {plugins.length === 0 && ready ? (
          <div className="mt-4">
            <Empty>No scan yet. Choose a folder above, upload one, or paste a list. Your DAW's stock tools are explained below either way.</Empty>
          </div>
        ) : null}
        {hiddenCount ? (
          <button type="button" onClick={() => setShowHidden((v) => !v)} className="mt-3 inline-flex h-9 items-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline">
            {showHidden ? "Hide" : "Show"} {hiddenCount} hidden plugin{hiddenCount === 1 ? "" : "s"}
          </button>
        ) : null}
        {Object.keys(rolePins).length ? (
          <p className="mt-3 text-xs text-muted">
            Pinned: {Object.entries(rolePins).map(([r, n]) => `${ROLE_LABEL[r as PluginRole]} → ${n}`).join(" · ")} —{" "}
            <Link to="/customise" search={{ tab: "plugins" }} className="underline underline-offset-2 hover:text-foreground">
              edit pins
            </Link>
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted">
            Want a specific plugin named for every EQ / compressor / limiter job?{" "}
            <Link to="/customise" search={{ tab: "plugins" }} className="underline underline-offset-2 hover:text-foreground">
              Pin plugins to roles
            </Link>
            .
          </p>
        )}
        <ul className="mt-4 grid gap-2 lg:grid-cols-2">
          {shown.map(({ p, id, pref }) => (
            <li key={p.name}>
              <PluginCard
                name={p.name}
                formats={p.formats}
                kb={id.kb}
                roles={id.roles}
                guessed={id.guessed}
                pref={pref}
                onPref={(next) => setPluginPref(p.name, next)}
                onRemove={() => removePlugin(p.name)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <Kicker>Stock tools in {DAWS.find((d) => d.id === daw)?.label}</Kicker>
        <H2 className="mt-2">Already on your computer</H2>
        <p className="mt-2 max-w-2xl text-sm text-muted">These ship with the DAW, so the advice uses them whenever a scanned plugin doesn't cover the job.</p>
        {stock.length ? (
          <ul className="mt-4 grid gap-2 lg:grid-cols-2">
            {stock.map((kb) => (
              <li key={kb.id}>
                <PluginCard name={kb.name} formats={[]} kb={kb} roles={kb.roles} guessed={false} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <Empty>Pick a DAW above to see its stock plugins. With "Other" the advice names generic tools.</Empty>
          </div>
        )}
      </section>

      <section className="mt-10">
        <Kicker>Reference</Kicker>
        <H2 className="mt-2">{PLUGIN_KB.length} plugins the helper knows by name</H2>
        <p className="mt-2 max-w-2xl text-sm text-muted">Anything else you scan gets a role guessed from its name and the generic advice for that role.</p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{PLUGIN_KB.map((k) => k.name).join(" · ")}</p>
      </section>
    </Page>
  );
}

function PluginCard({
  name,
  formats,
  kb,
  roles,
  guessed,
  pref,
  onPref,
  onRemove,
}: {
  name: string;
  formats: string[];
  kb: KbPlugin | null;
  roles: PluginRole[];
  guessed: boolean;
  pref?: PluginPref;
  onPref?: (p: PluginPref | null) => void;
  onRemove?: () => void;
}) {
  const guide = kb ?? ROLE_GUIDE[roles[0] ?? "utility"];
  const [note, setNote] = useState(pref?.note ?? "");
  const [editRoles, setEditRoles] = useState(false);
  const patch = (x: Partial<PluginPref>) => onPref?.({ ...(pref ?? {}), ...x });
  return (
    <Details
      summary={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {pref?.favourite ? <span className="text-warn">★</span> : null}
          <span className={pref?.hidden ? "font-semibold line-through opacity-60" : "font-semibold"}>{name}</span>
          {kb ? <span className="text-xs text-muted">{kb.vendor}</span> : null}
          {roles.map((r) => (
            <Tag key={r}>{ROLE_LABEL[r]}</Tag>
          ))}
          {formats.map((f) => (
            <Tag key={f} className="bg-surface-2">
              {f}
            </Tag>
          ))}
          {guessed ? <Tag className="text-warn">guessed from name</Tag> : null}
          {kb?.free ? <Tag className="text-ok">free</Tag> : null}
        </span>
      }
    >
      <div className="flex flex-col gap-3 pt-1">
        <div>
          <H3 className="text-sm">What it is</H3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{guide.what}</p>
        </div>
        <div>
          <H3 className="text-sm">In hardstyle</H3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{guide.hardstyle}</p>
        </div>
        <EasyHard easy={guide.easy} hard={guide.hard} />
        {pref?.note ? (
          <div>
            <H3 className="text-sm">Your note</H3>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">{pref.note}</p>
          </div>
        ) : null}
        {onPref ? (
          <div className="flex flex-col gap-2 rounded-lg bg-bg/60 p-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => patch({ favourite: !pref?.favourite })} className="inline-flex h-9 items-center rounded-md bg-surface-2 px-3 text-xs text-muted shadow-border hover:text-foreground">
                {pref?.favourite ? "★ Favourite" : "☆ Favourite"}
              </button>
              <button type="button" onClick={() => patch({ hidden: !pref?.hidden })} className="inline-flex h-9 items-center rounded-md bg-surface-2 px-3 text-xs text-muted shadow-border hover:text-foreground">
                {pref?.hidden ? "Unhide (use in advice)" : "Hide from advice"}
              </button>
              <button type="button" onClick={() => setEditRoles((v) => !v)} className="inline-flex h-9 items-center rounded-md bg-surface-2 px-3 text-xs text-muted shadow-border hover:text-foreground">
                {editRoles ? "Done with roles" : "Change roles"}
              </button>
            </div>
            {editRoles ? (
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(ROLE_LABEL) as PluginRole[]).map((r) => {
                  const on = roles.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        const next = on ? roles.filter((x) => x !== r) : [...roles, r];
                        patch({ roles: next.length ? next : undefined });
                      }}
                      className={`inline-flex h-8 items-center rounded-full px-2.5 text-xs ${on ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted shadow-border"}`}
                    >
                      {ROLE_LABEL[r]}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <div className="flex gap-2">
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Your own note (settings you like, where you use it)" className="h-9 text-xs" />
              <Button size="sm" variant="outline" onClick={() => patch({ note: note.trim() || undefined })}>
                Save note
              </Button>
            </div>
          </div>
        ) : null}
        {onRemove ? (
          <button type="button" onClick={onRemove} className="self-start text-xs text-subtle hover:text-foreground">
            Remove from my list
          </button>
        ) : null}
      </div>
    </Details>
  );
}
