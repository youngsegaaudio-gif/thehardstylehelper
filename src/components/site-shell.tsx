import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ARTISTS, VOCALS } from "@/lib/hs-catalog";
import { useVs } from "@/lib/vs-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/catalog" as const, label: "Catalog" },
  { to: "/studio" as const, label: "Studio" },
  { to: "/lanes" as const, label: "Lanes" },
  { to: "/saved" as const, label: "Saved" },
];

const FOOTER_NAV = [...NAV, { to: "/sound" as const, label: "Sound" }];


export function SiteShell({ children }: { children: ReactNode }) {
  const hydrate = useVs((s) => s.hydrate);
  const saved = useVs((s) => s.saved);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-foreground">
      <header className="sticky top-0 z-40 bg-bg shadow-border">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display shrink-0 text-lg leading-none tracking-wide text-foreground">
            VOCAL <span className="text-muted">SOURCE</span>
          </Link>
          <nav className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto" aria-label="Site">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const label =
                item.to === "/saved" && saved.length ? `Saved ${saved.length}` : item.label;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-md px-2.5 text-sm font-medium transition-[background-color,color] duration-150 sm:px-3",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted hover:bg-surface-2 hover:text-foreground",
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
              VOCAL <span className="text-muted">SOURCE</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Vocals people chop into hardstyle. Not hardstyle tracks. Titles and years
              only.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-subtle">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-subtle">The pile</p>
            <p className="mt-3 font-mono text-sm tabular-nums text-foreground">
              {VOCALS.length} sample vocals
            </p>
            <p className="font-mono text-sm tabular-nums text-foreground">{ARTISTS.length} production lanes</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Search, sample, and clear what you use. Not a stem pack and not a lyric sheet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
