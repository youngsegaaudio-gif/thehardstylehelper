export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isTopWindow(): boolean {
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
}

export type ClientPlatform = {
  ios: boolean;
  mac: boolean;
  safari: boolean;
  chromium: boolean;
};

export function clientPlatform(): ClientPlatform {
  const ua = navigator.userAgent;
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const mac = /Mac/.test(navigator.platform || ua) && !ios;
  const chromium = /Chrome|Chromium|Edg|OPR/.test(ua);
  const safari = /Safari/.test(ua) && !chromium;
  return { ios, mac, safari, chromium };
}

export function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  if (!isTopWindow()) return;
  if (location.protocol !== "https:") return;
  void navigator.serviceWorker.register("/sw.js", { scope: "/" });
}
