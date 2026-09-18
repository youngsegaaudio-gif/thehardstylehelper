import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ARTISTS, VOCALS } from "@/lib/hs-catalog";
import { HH_GENRES } from "@/lib/hh/genres";
import { PLUGIN_KB } from "@/lib/hh/plugins-kb";
import { useHh } from "@/lib/hh/store";
import { useVs } from "@/lib/vs-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/analyse" as const, label: "Analyse" },
  { to: "/genres" as const, label: "Genres" },
  { to: "/plugins" as const, label: "Plugins" },
  { to: "/mix" as const, label: "Mix" },
  { to: "/serum" as const, label: "Serum" },
  { to: "/arrange" as const, label: "Arrange" },
  { to: "/ask" as const, label: "Ask" },
  { to: "/learn" as const, label: "Learn" },
  { to: "/customise" as const, label: "Customise" },
];

const VOCAL_NAV = [
  { to: "/catalog" as const, label: "Vocal catalog" },
  { to: "/studio" as const, label: "Studio" },
  { to: "/lanes" as const, label: "Lanes" },
  { to: "/sound" as const, label: "Sound" },
  { to: "/saved" as const, label: "Saved" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const hydrateVs = useVs((s) => s.hydrate);
  const hydrateHh = useHh((s) => s.hydrate);
  const pluginCount = useHh((s) => s.plugins.length);
  const appearance = useHh((s) => s.custom.appearance);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    hydrateVs();
    hydrateHh();
  }, [hydrateVs, hydrateHh]);

  // appearance customisation: accent, chart series colour, font, density
  useEffect(() => {
    const root = document.documentElement;
    const st = root.style;
    if (appearance.accent) {
      st.setProperty("--color-primary", appearance.accent);
      st.setProperty("--color-primary-foreground", readableOn(appearance.accent));
      st.setProperty("--color-ring", appearance.accent);
    } else {
      st.removeProperty("--color-primary");
      st.removeProperty("--color-primary-foreground");
      st.removeProperty("--color-ring");
    }
    if (appearance.series) st.setProperty("--color-series-1", appearance.series);
    else st.removeProperty("--color-series-1");
    root.classList.toggle("hh-plain", appearance.font === "plain");
    root.classList.toggle("hh-compact", appearance.density === "compact");
  }, [appearance]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-foreground">
      <header className="sticky top-0 z-40 bg-bg shadow-border">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display shrink-0 text-lg leading-none tracking-wide text-foreground">
            HARDSTYLE <span className="text-muted">HELPER</span>
          </Link>
          <nav className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto" aria-label="Site">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const label = item.to === "/plugins" && pluginCount ? `Plugins ${pluginCount}` : item.label;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-md px-2.5 text-sm font-medium transition-[background-color,color] duration-150 sm:px-3",
                    active ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-display text-lg tracking-wide text-foreground">
              HARDSTYLE <span className="text-muted">HELPER</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Analyse a bounce against ten lanes, scan your plugins, get told what to fix — the easy way and the hard way.
            </p>
            <p className="mt-3 font-mono text-xs tabular-nums text-subtle">
              {HH_GENRES.length} lanes · {HH_GENRES.length * 50} references · {PLUGIN_KB.length} plugins known
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-subtle">Helper</p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-subtle">Vocal source</p>
            <ul className="mt-3 space-y-2 text-sm">
              {VOCAL_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-xs tabular-nums text-subtle">
              {VOCALS.length} sample vocals · {ARTISTS.length} production lanes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Black or off-white ink for text on a given hex background. */
function readableOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.55 ? "#0c0c0b" : "#f4efe6";
}
