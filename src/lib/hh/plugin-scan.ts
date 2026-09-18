/**
 * Plugin scanning from the browser. Three ways in, all producing the same
 * shape: the File System Access directory picker (Chromium), a
 * `webkitdirectory` file input (Safari/Firefox), or pasted text.
 */
import { cleanPluginName } from "./plugins-kb";

export type PluginFormat = "VST3" | "AU" | "VST" | "CLAP" | "AAX" | "DLL";

export type ScannedPlugin = {
  name: string;
  formats: PluginFormat[];
  path?: string;
};

const EXT: Record<string, PluginFormat> = {
  vst3: "VST3",
  component: "AU",
  vst: "VST",
  clap: "CLAP",
  aaxplugin: "AAX",
  dll: "DLL",
};

const SKIP = /^(\.|__MACOSX|contents|resources|node_modules)/i;

export const PLUGIN_FOLDERS = {
  mac: [
    "/Library/Audio/Plug-Ins/Components",
    "/Library/Audio/Plug-Ins/VST3",
    "/Library/Audio/Plug-Ins/VST",
    "/Library/Audio/Plug-Ins/CLAP",
    "~/Library/Audio/Plug-Ins",
  ],
  windows: [
    "C:\\Program Files\\Common Files\\VST3",
    "C:\\Program Files\\Common Files\\CLAP",
    "C:\\Program Files\\VstPlugins",
    "C:\\Program Files\\Steinberg\\VstPlugins",
  ],
};

export const MAC_LIST_COMMAND =
  'ls /Library/Audio/Plug-Ins/Components /Library/Audio/Plug-Ins/VST3 ~/Library/Audio/Plug-Ins/Components ~/Library/Audio/Plug-Ins/VST3 2>/dev/null | grep -v "^$" | pbcopy';

export const WINDOWS_LIST_COMMAND =
  'dir /b "C:\\Program Files\\Common Files\\VST3" "C:\\Program Files\\Common Files\\CLAP" "C:\\Program Files\\VstPlugins" | clip';

function extOf(name: string): PluginFormat | null {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  if (!m) return null;
  return EXT[m[1].toLowerCase()] ?? null;
}

export function mergePlugins(list: ScannedPlugin[]): ScannedPlugin[] {
  const map = new Map<string, ScannedPlugin>();
  for (const p of list) {
    const key = p.name.toLowerCase();
    const cur = map.get(key);
    if (cur) {
      for (const f of p.formats) if (!cur.formats.includes(f)) cur.formats.push(f);
      if (!cur.path && p.path) cur.path = p.path;
    } else map.set(key, { name: p.name, formats: [...p.formats], path: p.path });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Parse a pasted directory listing or any list of plugin names / paths. */
export function parsePastedList(text: string): ScannedPlugin[] {
  const out: ScannedPlugin[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim().replace(/[,;]+$/, "");
    if (!line || /^total \d+/i.test(line) || line.endsWith(":")) continue;
    // strip `ls -l` prefixes
    const cleaned = line.replace(/^[-drwx@+]{10}\s+\d+\s+\S+\s+\S+\s+\d+\s+\w+\s+\d+\s+[\d:]+\s+/, "");
    const segs = cleaned.split(/[\\/]/).filter(Boolean);
    let picked: string | null = null;
    let fmt: PluginFormat | null = null;
    for (const s of segs) {
      const f = extOf(s);
      if (f) {
        picked = s;
        fmt = f;
        break;
      }
    }
    if (!picked) {
      picked = segs[segs.length - 1] ?? cleaned;
      if (SKIP.test(picked) || picked.length < 2) continue;
    }
    const name = cleanPluginName(picked);
    if (!name) continue;
    out.push({ name, formats: fmt ? [fmt] : [] });
  }
  return mergePlugins(out);
}

/** From a `webkitdirectory` file input: derive plugin bundles from paths. */
export function pluginsFromFileList(files: FileList | File[]): ScannedPlugin[] {
  const out: ScannedPlugin[] = [];
  const arr: File[] = Array.from(files as ArrayLike<File>);
  for (const f of arr) {
    const rel = (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name;
    const segs = rel.split(/[\\/]/);
    for (let i = 0; i < segs.length; i++) {
      const fmt = extOf(segs[i]);
      if (fmt) {
        out.push({ name: cleanPluginName(segs[i]), formats: [fmt], path: segs.slice(0, i + 1).join("/") });
        break;
      }
    }
  }
  return mergePlugins(out);
}

/* --- File System Access API (Chromium) --- */

type FsHandle = {
  kind: "file" | "directory";
  name: string;
  values?: () => AsyncIterable<FsHandle>;
};

declare global {
  interface Window {
    showDirectoryPicker?: (opts?: { mode?: "read" | "readwrite"; startIn?: string }) => Promise<FsHandle>;
  }
}

export function supportsDirectoryPicker(): boolean {
  return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
}

async function walk(dir: FsHandle, path: string, depth: number, out: ScannedPlugin[], budget: { n: number }) {
  if (depth > 6 || budget.n <= 0 || !dir.values) return;
  for await (const entry of dir.values()) {
    if (budget.n-- <= 0) return;
    const fmt = extOf(entry.name);
    if (fmt) {
      out.push({ name: cleanPluginName(entry.name), formats: [fmt], path: `${path}/${entry.name}` });
      continue; // don't descend into bundles
    }
    if (entry.kind === "directory" && !SKIP.test(entry.name)) {
      await walk(entry, `${path}/${entry.name}`, depth + 1, out, budget);
    }
  }
}

/** Opens the picker; resolves to null if the user cancels. */
export async function scanWithDirectoryPicker(): Promise<ScannedPlugin[] | null> {
  if (!supportsDirectoryPicker()) return null;
  try {
    const dir = await window.showDirectoryPicker!({ mode: "read" });
    const out: ScannedPlugin[] = [];
    await walk(dir, dir.name, 0, out, { n: 20000 });
    return mergePlugins(out);
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return null;
    throw e;
  }
}
