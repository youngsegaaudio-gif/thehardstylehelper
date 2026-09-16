import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, _ as createFileRoute, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BftHCkTq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function isTopWindow() {
	try {
		return window.self === window.top;
	} catch {
		return false;
	}
}
function registerServiceWorker() {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
	if (!isTopWindow()) return;
	if (location.protocol !== "https:") return;
	navigator.serviceWorker.register("/sw.js", { scope: "/" });
}
function PwaRegister() {
	(0, import_react.useEffect)(() => {
		registerServiceWorker();
	}, []);
	return null;
}
var GENRES = [
	{
		id: "euphoric",
		label: "Euphoric",
		bpm: 150
	},
	{
		id: "raw",
		label: "Raw",
		bpm: 155
	},
	{
		id: "extra-raw",
		label: "Extra raw",
		bpm: 160
	},
	{
		id: "classic",
		label: "Classic",
		bpm: 150
	},
	{
		id: "early",
		label: "Early",
		bpm: 144
	},
	{
		id: "hardcore",
		label: "Hardcore",
		bpm: 180
	},
	{
		id: "uptempo",
		label: "Uptempo",
		bpm: 210
	},
	{
		id: "frenchcore",
		label: "Frenchcore",
		bpm: 200
	},
	{
		id: "ukhc",
		label: "UK hardcore",
		bpm: 170
	},
	{
		id: "happy",
		label: "Happy hardcore",
		bpm: 170
	},
	{
		id: "gabber",
		label: "Gabber",
		bpm: 190
	},
	{
		id: "industrial",
		label: "Industrial",
		bpm: 175
	},
	{
		id: "hard-techno",
		label: "Hard techno",
		bpm: 148
	},
	{
		id: "jumpstyle",
		label: "Jumpstyle",
		bpm: 144
	},
	{
		id: "hard-trance",
		label: "Hard trance",
		bpm: 145
	},
	{
		id: "freeform",
		label: "Freeform",
		bpm: 170
	},
	{
		id: "millenium",
		label: "Millennium",
		bpm: 165
	},
	{
		id: "terror",
		label: "Terror",
		bpm: 220
	},
	{
		id: "psy",
		label: "Psy-hard",
		bpm: 150
	}
];
var ARTISTS = [
	{
		id: "d-charged",
		name: "D-Charged",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "demi-kanon",
		name: "Demi Kanon",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "galactixx",
		name: "Galactixx",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "hard-driver",
		name: "Hard Driver",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "hardstyle-pianist",
		name: "Hardstyle Pianist",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "high-voltage",
		name: "High Voltage",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "jay-reeve",
		name: "Jay Reeve",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "keltek",
		name: "Keltek",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "refuzion",
		name: "Refuzion",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "sound-rush",
		name: "Sound Rush",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "sub-zero-project",
		name: "Sub Zero Project",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "vertile",
		name: "Vertile",
		genre: "euphoric",
		era: "20s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "a-rize",
		name: "A-Rize",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "acid-flow",
		name: "Acid Flow",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "acti",
		name: "Acti",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "anigmatic",
		name: "Anigmatic",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "arcando",
		name: "Arcando",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "aria",
		name: "Aria",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "audiotricz-and-wasted-penguinz",
		name: "Audiotricz & Wasted Penguinz",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "avi8",
		name: "Avi8",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "AU",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "brennan-heart-and-wildstylez",
		name: "Brennan Heart & Wildstylez",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "central",
		name: "Central",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "cloud9",
		name: "Cloud9",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "code-black-and-toneshifterz",
		name: "Code Black & Toneshifterz",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "concept-art",
		name: "Concept Art",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "AU",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "cyber",
		name: "Cyber",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "d-block",
		name: "D-Block",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "da-tweekaz-and-coone",
		name: "Da Tweekaz & Coone",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "de-koder",
		name: "De-Koder",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "deal",
		name: "Deal",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "e-life",
		name: "E-Life",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "ecstatic",
		name: "Ecstatic",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "effused",
		name: "Effused",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "elyn",
		name: "Elyn",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "energyzed",
		name: "Energyzed",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "envine",
		name: "Envine",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "eve",
		name: "Eve",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "evitrin",
		name: "Evitrin",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "fenix",
		name: "Fenix",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "festuca",
		name: "Festuca",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "freakz-at-night",
		name: "Freakz at Night",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "future-frequency",
		name: "Future Frequency",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "geck-o",
		name: "Geck-o",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "hard-driver-and-demi-kanon",
		name: "Hard Driver & Demi Kanon",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "haze",
		name: "Haze",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "headhunterz-and-wildstylez",
		name: "Headhunterz & Wildstylez",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "hima",
		name: "Hima",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "in-phase",
		name: "In-Phase",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "insomnia",
		name: "Insomnia",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "invector",
		name: "Invector",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "jase-elf",
		name: "Jase Elf",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "jason-payne",
		name: "Jason Payne",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "javi-reina",
		name: "Javi Reina",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "jesse-jax",
		name: "Jesse Jax",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "jezper",
		name: "Jezper",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "jezper-sadowski",
		name: "Jezper Sadowski",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "justin-oh",
		name: "Justin Oh",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "katrine",
		name: "Katrine",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "keltek-and-devin-wild",
		name: "Keltek & Devin Wild",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "level-one",
		name: "Level One",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "lunamaar",
		name: "LunaMaar",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "luner",
		name: "Luner",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "mandy",
		name: "Mandy",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "primeshock",
		name: "Primeshock",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "pulse",
		name: "Pulse",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "pulseformer",
		name: "Pulseformer",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "r3spawn",
		name: "R3SPAWN",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "recoder",
		name: "Recoder",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "refuzion-and-serzo",
		name: "Refuzion & Serzo",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "regain",
		name: "Regain",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "requiem",
		name: "Requiem",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "AU",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "retrospect",
		name: "Retrospect",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "sasha-f",
		name: "Sasha F",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "sephyx-and-aftershock",
		name: "Sephyx & Aftershock",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "serzo",
		name: "Serzo",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "shockerz",
		name: "Shockerz",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "skope",
		name: "Skope",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "solstice",
		name: "Solstice",
		genre: "euphoric",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Break melody becomes the drop lead."
	},
	{
		id: "act-of-rage",
		name: "Act of Rage",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "aversion",
		name: "Aversion",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "d-sturb",
		name: "D-Sturb",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "jnxd",
		name: "JNXD",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "kronos",
		name: "Kronos",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "luminite",
		name: "Luminite",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "malice",
		name: "Malice",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "minus-militia",
		name: "Minus Militia",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "mutilator",
		name: "Mutilator",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "myst",
		name: "MYST",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "neroz",
		name: "Neroz",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "rebelion",
		name: "Rebelion",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "rejecta",
		name: "Rejecta",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "rooler",
		name: "Rooler",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "sickmode",
		name: "Sickmode",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "sub-sonik",
		name: "Sub Sonik",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "the-purge",
		name: "The Purge",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "warface",
		name: "Warface",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "act-of-rage-and-e-force",
		name: "Act of Rage & E-Force",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "adaro-and-rejecta",
		name: "Adaro & Rejecta",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "artifact",
		name: "Artifact",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "bass-chaserz",
		name: "Bass Chaserz",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "blood-red",
		name: "Blood Red",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "cardinal-ad",
		name: "Cardinal Ad",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "chain-reaction",
		name: "Chain Reaction",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "crypsis-and-delete",
		name: "Crypsis & Delete",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "defiant",
		name: "Defiant",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "dual-mechanism",
		name: "Dual Mechanism",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "enforcer",
		name: "Enforcer",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "forgotten",
		name: "Forgotten",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "frequencerz-and-e-force",
		name: "Frequencerz & E-Force",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "frost",
		name: "Frost",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "heatseeker",
		name: "Heatseeker",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "inceptos",
		name: "Inceptos",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "jack-of-sound",
		name: "Jack of Sound",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "killshot",
		name: "Killshot",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "livid",
		name: "Livid",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "lockdown",
		name: "Lockdown",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "menthos",
		name: "Menthos",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "merchant",
		name: "Merchant",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "mutilator-and-dual-damage",
		name: "Mutilator & Dual Damage",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "nocturnal",
		name: "Nocturnal",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "nsclt",
		name: "NSCLT",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "outbreak",
		name: "Outbreak",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "peccata",
		name: "Peccata",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "phuture-noize-and-b-front",
		name: "Phuture Noize & B-Front",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "radical-redemption",
		name: "Radical Redemption",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "ran-d-and-b-front",
		name: "Ran-D & B-Front",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "ransom",
		name: "Ransom",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "rebelion-and-vertile",
		name: "Rebelion & Vertile",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "rejecta-and-d-sturb",
		name: "Rejecta & D-Sturb",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "revive",
		name: "Revive",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "rooler-and-sickmode",
		name: "Rooler & Sickmode",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "shader",
		name: "Shader",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "the-melodyst",
		name: "The Melodyst",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "thyron",
		name: "Thyron",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "vertile-and-dual-damage",
		name: "Vertile & Dual Damage",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "warface-and-d-sturb",
		name: "Warface & D-Sturb",
		genre: "raw",
		era: "20s",
		bpm: 155,
		country: "NL",
		tag: "Kick first. Screech is the hook."
	},
	{
		id: "adjuzt",
		name: "Adjuzt",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "anderex",
		name: "Anderex",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "barber",
		name: "Barber",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "deezl",
		name: "Deezl",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "dual-damage",
		name: "Dual Damage",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "fraw",
		name: "Fraw",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "furyan",
		name: "Furyan",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "riot-shift",
		name: "Riot Shift",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "so-juice",
		name: "So Juice",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "spitnoise",
		name: "Spitnoise",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "the-dope-doctor",
		name: "The Dope Doctor",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "adjuzt-and-so-juice",
		name: "Adjuzt & So Juice",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "amnesys",
		name: "Amnesys",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "IT",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "anime",
		name: "AniMe",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "art-of-fighters",
		name: "Art of Fighters",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "IT",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "bloodfire",
		name: "Bloodfire",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "bloodlust",
		name: "Bloodlust",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "broken-minds",
		name: "Broken Minds",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "crossfight",
		name: "Crossfight",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "cryogenic",
		name: "Cryogenic",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "d-railed",
		name: "D-Railed",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "destructive-tendencies",
		name: "Destructive Tendencies",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "deviated",
		name: "Deviated",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "disarray",
		name: "Disarray",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "disruptance",
		name: "Disruptance",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "f-noize",
		name: "F.Noize",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "hardcore-italia",
		name: "Hardcore Italia",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "imperatorz",
		name: "Imperatorz",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "imperatorz-and-krowdexx",
		name: "Imperatorz & Krowdexx",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "infliction",
		name: "Infliction",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "krowdexx",
		name: "Krowdexx",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "levenkhan",
		name: "Levenkhan",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "mad-dog",
		name: "Mad Dog",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "manifest-destiny",
		name: "Manifest Destiny",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "meccano-twins",
		name: "Meccano Twins",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "IT",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "mish",
		name: "Mish",
		genre: "extra-raw",
		era: "20s",
		bpm: 160,
		country: "NL",
		tag: "Mid crunch. Drop is the kick."
	},
	{
		id: "a-lusion",
		name: "A-lusion",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "adaro",
		name: "Adaro",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "adrenalize",
		name: "Adrenalize",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "atmozfears",
		name: "Atmozfears",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "audiofreq",
		name: "Audiofreq",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "AU",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "audiotricz",
		name: "Audiotricz",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "b-front",
		name: "B-Front",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "bass-modulators",
		name: "Bass Modulators",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "brennan-heart",
		name: "Brennan Heart",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "code-black",
		name: "Code Black",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "AU",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "coone",
		name: "Coone",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "BE",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "crypsis",
		name: "Crypsis",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "d-block-and-s-te-fan",
		name: "D-Block & S-te-Fan",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "da-tweekaz",
		name: "Da Tweekaz",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "BE",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "deepack",
		name: "Deepack",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "delete",
		name: "Delete",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "devin-wild",
		name: "Devin Wild",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "digital-punk",
		name: "Digital Punk",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "e-force",
		name: "E-Force",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "frequencerz",
		name: "Frequencerz",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "frontliner",
		name: "Frontliner",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "gunz-for-hire",
		name: "Gunz For Hire",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "headhunterz",
		name: "Headhunterz",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "isaac",
		name: "Isaac",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "jdx",
		name: "JDX",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "luna",
		name: "Luna",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "max-enforcer",
		name: "Max Enforcer",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "noisecontrollers",
		name: "Noisecontrollers",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "pavo",
		name: "Pavo",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "phuture-noize",
		name: "Phuture Noize",
		genre: "classic",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "project-one",
		name: "Project One",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "ran-d",
		name: "Ran-D",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "sephyx",
		name: "Sephyx",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "showtek",
		name: "Showtek",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "tatanka",
		name: "Tatanka",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "IT",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "technoboy",
		name: "Technoboy",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "IT",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "the-prophet",
		name: "The Prophet",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "tnt",
		name: "TNT",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "IT",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "toneshifterz",
		name: "Toneshifterz",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "AU",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "tuneboy",
		name: "Tuneboy",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "IT",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "wasted-penguinz",
		name: "Wasted Penguinz",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "wildstylez",
		name: "Wildstylez",
		genre: "classic",
		era: "00s",
		bpm: 150,
		country: "NL",
		tag: "Reverse bass pocket. 32-bar phrases."
	},
	{
		id: "dana",
		name: "Dana",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-duro",
		name: "DJ Duro",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-isaac",
		name: "DJ Isaac",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-lady-dana",
		name: "DJ Lady Dana",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-luna",
		name: "DJ Luna",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-pavo",
		name: "DJ Pavo",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-pila",
		name: "DJ Pila",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-the-prophet",
		name: "DJ The Prophet",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "dj-zany",
		name: "DJ Zany",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "lady-dana",
		name: "Lady Dana",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "max-b-grant",
		name: "Max B. Grant",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "overdrive",
		name: "Overdrive",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "superwave",
		name: "Superwave",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "the-beholder",
		name: "The Beholder",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "walt",
		name: "Walt",
		genre: "early",
		era: "00s",
		bpm: 144,
		country: "NL",
		tag: "Offbeat / early reverse. Keep it simple."
	},
	{
		id: "angerfist-and-miss-k8",
		name: "Angerfist & Miss K8",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "art-of-fighters-and-endymion",
		name: "Art of Fighters & Endymion",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "beatstream",
		name: "Beatstream",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "blacky",
		name: "BlackY",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "camellia",
		name: "Camellia",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "captain-core",
		name: "Captain Core",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "corepunk",
		name: "CorePunk",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "darksiderz",
		name: "Darksiderz",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-anastasia",
		name: "DJ Anastasia",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-genki",
		name: "DJ Genki",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-myosuke",
		name: "DJ Myosuke",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-noriken",
		name: "DJ Noriken",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-sharpnel",
		name: "DJ Sharpnel",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-shimamura",
		name: "DJ Shimamura",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "dj-technorch",
		name: "DJ TECHNORCH",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "evil-activities-and-e-life",
		name: "Evil Activities & E-Life",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "getty",
		name: "Getty",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "guhroovy",
		name: "GUHROOVY",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "hommarju",
		name: "Hommarju",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "kobaryo",
		name: "Kobaryo",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "kors-k",
		name: "kors k",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "korsakoff-and-unexist",
		name: "Korsakoff & Unexist",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "laur",
		name: "Laur",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "m-project",
		name: "M-Project",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "m1dy",
		name: "m1dy",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "mad-dog-and-tommyknocker",
		name: "Mad Dog & Tommyknocker",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "massive-new-krew",
		name: "Massive New Krew",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "neophyte-and-tha-playah",
		name: "Neophyte & Tha Playah",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "plight",
		name: "P*Light",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "re-style-and-lady-faith",
		name: "Re-Style & Lady Faith",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "redalice",
		name: "REDALiCE",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "roughsketch",
		name: "RoughSketch",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "srav3r",
		name: "Srav3R",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "tpluspazolite",
		name: "t+pazolite",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "NL",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "usao",
		name: "USAO",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "xi",
		name: "xi",
		genre: "hardcore",
		era: "00s",
		bpm: 180,
		country: "JP",
		tag: "Stab, shout, industrial FX."
	},
	{
		id: "angerfist",
		name: "Angerfist",
		genre: "uptempo",
		era: "00s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "d-fence",
		name: "D-Fence",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "deadly-guns",
		name: "Deadly Guns",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "dj-mad-dog",
		name: "DJ Mad Dog",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "IT",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "evil-activities",
		name: "Evil Activities",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "korsakoff",
		name: "Korsakoff",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "lady-faith",
		name: "Lady Faith",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "major-conspiracy",
		name: "Major Conspiracy",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "miss-k8",
		name: "Miss K8",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "UA",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "n-vitral",
		name: "N-Vitral",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "neophyte",
		name: "Neophyte",
		genre: "uptempo",
		era: "90s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "partyraiser",
		name: "Partyraiser",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "promo",
		name: "Promo",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "re-style",
		name: "Re-Style",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "tha-playah",
		name: "Tha Playah",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "the-viper",
		name: "The Viper",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "anklebreaker",
		name: "Anklebreaker",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "atomizer",
		name: "Atomizer",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "barber-and-spitnoise",
		name: "Barber & Spitnoise",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "catscan",
		name: "Catscan",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "deadly-guns-and-n-vitral",
		name: "Deadly Guns & N-Vitral",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "deterrent-man",
		name: "Deterrent Man",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "drokz",
		name: "Drokz",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "dropz",
		name: "Dropz",
		genre: "uptempo",
		era: "20s",
		bpm: 210,
		country: "NL",
		tag: "Kick wall. Short phrases. No pretty break."
	},
	{
		id: "dr-peacock",
		name: "Dr Peacock",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "NL",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "sefa",
		name: "Sefa",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "NL",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "adrenokrome",
		name: "Adrenokrome",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "androgynous",
		name: "Androgynous",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "billx",
		name: "Billx",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "dr-peacock-and-sefa",
		name: "Dr Peacock & Sefa",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "duk-k",
		name: "Duk-K",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "frenchcore-addict",
		name: "Frenchcore Addict",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "hellsystem",
		name: "Hellsystem",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "hyrule-war",
		name: "Hyrule War",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "kokain-klinik",
		name: "Kokain Klinik",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "le-bask",
		name: "Le Bask",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "maissouille",
		name: "Maissouille",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "manu-le-malin",
		name: "Manu Le Malin",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "meltdown",
		name: "Meltdown",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "pattern-j",
		name: "Pattern J",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "progamers",
		name: "Progamers",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "psiko",
		name: "Psiko",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "radium",
		name: "Radium",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "randy",
		name: "Randy",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "sentek",
		name: "Sentek",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "sirio",
		name: "Sirio",
		genre: "frenchcore",
		era: "10s",
		bpm: 200,
		country: "FR",
		tag: "Distorted four-to-the-floor, carnival FX."
	},
	{
		id: "darren-styles",
		name: "Darren Styles",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "force-and-styles",
		name: "Force & Styles",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "gammer",
		name: "Gammer",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "hixxy",
		name: "Hixxy",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "s3rl",
		name: "S3RL",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "AU",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "scott-brown",
		name: "Scott Brown",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "sharkey",
		name: "Sharkey",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "al-storm",
		name: "Al Storm",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "andy-whitby",
		name: "Andy Whitby",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "breeze",
		name: "Breeze",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "brisk",
		name: "Brisk",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "brisk-and-ham",
		name: "Brisk & Ham",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "cally-and-juice",
		name: "Cally & Juice",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "chris-unknown",
		name: "Chris Unknown",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "clsm",
		name: "CLSM",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "darren-styles-and-gammer",
		name: "Darren Styles & Gammer",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dawn-benfield",
		name: "Dawn Benfield",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-brisk",
		name: "DJ Brisk",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-dazzle",
		name: "DJ Dazzle",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-dougal",
		name: "DJ Dougal",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-ham",
		name: "DJ Ham",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-hixxy",
		name: "DJ Hixxy",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-kurt",
		name: "DJ Kurt",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-seduction",
		name: "DJ Seduction",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-slipmatt",
		name: "DJ Slipmatt",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-stompy",
		name: "DJ Stompy",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-sy",
		name: "DJ Sy",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dj-unknown",
		name: "DJ Unknown",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dougal",
		name: "Dougal",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "dougal-and-gammer",
		name: "Dougal & Gammer",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "fade",
		name: "Fade",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "firelite",
		name: "Firelite",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "flip-and-fill",
		name: "Flip & Fill",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "fracus-and-darwin",
		name: "Fracus & Darwin",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "ham",
		name: "Ham",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "headstrong",
		name: "Headstrong",
		genre: "ukhc",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Piano or saw, offbeat bass, 170."
	},
	{
		id: "alex-k",
		name: "Alex K",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "aqua",
		name: "Aqua",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "aqualoop",
		name: "Aqualoop",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "baby-d",
		name: "Baby D",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "bass-t",
		name: "Bass-T",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "bassface-sascha",
		name: "Bassface Sascha",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "basshunter",
		name: "Basshunter",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "bl-mchen",
		name: "Blümchen",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "cascada",
		name: "Cascada",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "DE",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "charlie-lownoise",
		name: "Charlie Lownoise",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "charly-lownoise-and-mental-theo",
		name: "Charly Lownoise & Mental Theo",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "dj-dean",
		name: "DJ Dean",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "dune",
		name: "Dune",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "DE",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "eiffel-65",
		name: "Eiffel 65",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "gigi-dagostino",
		name: "Gigi D'Agostino",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "golden-girl",
		name: "Golden Girl",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "groove-coverage",
		name: "Groove Coverage",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "DE",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "hampenberg",
		name: "Hampenberg",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "italobrothers",
		name: "ItaloBrothers",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "klubbingman",
		name: "Klubbingman",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "manian",
		name: "Manian",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "UK",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "mark-oh",
		name: "Mark 'Oh",
		genre: "happy",
		era: "90s",
		bpm: 170,
		country: "DE",
		tag: "Hook first. Pitched vox. Bounce."
	},
	{
		id: "dj-paul-elstak",
		name: "DJ Paul Elstak",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "endymion",
		name: "Endymion",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "nosferatu",
		name: "Nosferatu",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "the-darkraver",
		name: "The Darkraver",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "3-steps-ahead",
		name: "3 Steps Ahead",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "bass-d",
		name: "Bass-D",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "bodylotion",
		name: "Bodylotion",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "charly-lownoise",
		name: "Charly Lownoise",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "chemical-reactions",
		name: "Chemical Reactions",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "critical-mass",
		name: "Critical Mass",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "darkraver",
		name: "Darkraver",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "darrien-kelly",
		name: "Darrien Kelly",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dione",
		name: "Dione",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "diss-reaction",
		name: "Diss Reaction",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-akira",
		name: "DJ Akira",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-buzz-fuzz",
		name: "DJ Buzz Fuzz",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-dano",
		name: "DJ Dano",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-gizmo",
		name: "DJ Gizmo",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-jappo",
		name: "DJ Jappo",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-korsakoff",
		name: "DJ Korsakoff",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-panic",
		name: "DJ Panic",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-ruffneck",
		name: "DJ Ruffneck",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dj-sim",
		name: "DJ Sim",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dna",
		name: "DNA",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dr-z-vago",
		name: "Dr. Z-Vago",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dutch-master",
		name: "Dutch Master",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "dynamic-duo",
		name: "Dynamic Duo",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "first-aid",
		name: "First Aid",
		genre: "gabber",
		era: "90s",
		bpm: 190,
		country: "NL",
		tag: "Hoover, shout, 180+ kick."
	},
	{
		id: "alien6",
		name: "Alien6",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "biotek",
		name: "Biotek",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "bulletproof",
		name: "Bulletproof",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "d-passion",
		name: "D-Passion",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "dj-antibody",
		name: "DJ Antibody",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "dj-promo",
		name: "DJ Promo",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "e-noid",
		name: "E-Noid",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "ghost-in-the-machine",
		name: "Ghost in the Machine",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "industrializer",
		name: "Industrializer",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "placid-k",
		name: "Placid K",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "promo-and-the-viper",
		name: "Promo & The Viper",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "restrained",
		name: "Restrained",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "subversion",
		name: "Subversion",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "t-junction",
		name: "T-Junction",
		genre: "industrial",
		era: "00s",
		bpm: 175,
		country: "NL",
		tag: "Atmosphere and metal hits over the kick."
	},
	{
		id: "999999999",
		name: "999999999",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "i-hate-models",
		name: "I Hate Models",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "FR",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "klangkuenstler",
		name: "Klangkuenstler",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "sara-landry",
		name: "Sara Landry",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "US",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "adam-beyer",
		name: "Adam Beyer",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "alignment",
		name: "Alignment",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "amelie-lens",
		name: "Amelie Lens",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "BE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "anfisa-letyago",
		name: "Anfisa Letyago",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "cajjmere-wray",
		name: "Cajjmere Wray",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "charlie-sparks",
		name: "Charlie Sparks",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "charlotte-de-witte",
		name: "Charlotte de Witte",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "BE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "dax-j",
		name: "Dax J",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "eli-brown",
		name: "Eli Brown",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "enrico-sangiuliano",
		name: "Enrico Sangiuliano",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "farrago",
		name: "Farrago",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "fjaak",
		name: "FJAAK",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "holy-priest",
		name: "Holy Priest",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "indira-paganotto",
		name: "Indira Paganotto",
		genre: "hard-techno",
		era: "20s",
		bpm: 148,
		country: "DE",
		tag: "PVC / peak kick, hats, stab."
	},
	{
		id: "jeckyll-and-hyde",
		name: "Jeckyll & Hyde",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "patrick-jumpen",
		name: "Patrick Jumpen",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "altijd-larstig",
		name: "Altijd Larstig",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "altijd-larstig-and-speedy",
		name: "Altijd Larstig & Speedy",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "dark-oscillators",
		name: "Dark Oscillators",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "dj-mystery",
		name: "DJ Mystery",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "ruthless",
		name: "Ruthless",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "yoji",
		name: "Yoji",
		genre: "jumpstyle",
		era: "00s",
		bpm: 144,
		country: "BE",
		tag: "Bounce kick, offbeat, simple lead."
	},
	{
		id: "gouryella",
		name: "Gouryella",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "kai-tracid",
		name: "Kai Tracid",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "mauro-picotto",
		name: "Mauro Picotto",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "push",
		name: "Push",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "BE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "rank-1",
		name: "Rank 1",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "system-f",
		name: "System F",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "asys",
		name: "A*S*Y*S",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "accuface",
		name: "Accuface",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "agnelli-and-nelson",
		name: "Agnelli & Nelson",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "airscape",
		name: "Airscape",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "airwave",
		name: "Airwave",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "atb",
		name: "ATB",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "binary-finary",
		name: "Binary Finary",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "chicane",
		name: "Chicane",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "commander-tom",
		name: "Commander Tom",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "cosmic-gate",
		name: "Cosmic Gate",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "darude",
		name: "Darude",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "derb",
		name: "Derb",
		genre: "hard-trance",
		era: "00s",
		bpm: 145,
		country: "DE",
		tag: "Hoover / supersaw, long build."
	},
	{
		id: "apex",
		name: "Apex",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "bong-ra",
		name: "Bong-Ra",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "cooh",
		name: "Cooh",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "counterstrike",
		name: "Counterstrike",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "current-value",
		name: "Current Value",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "dieselboy",
		name: "Dieselboy",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "dylan",
		name: "Dylan",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "forbidden-society",
		name: "Forbidden Society",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "dj-fade",
		name: "DJ Fade",
		genre: "millenium",
		era: "00s",
		bpm: 165,
		country: "UK",
		tag: "UK piano / vocal, 165–170."
	},
	{
		id: "dj-force",
		name: "DJ Force",
		genre: "millenium",
		era: "00s",
		bpm: 165,
		country: "UK",
		tag: "UK piano / vocal, 165–170."
	},
	{
		id: "dj-ramos",
		name: "DJ Ramos",
		genre: "millenium",
		era: "00s",
		bpm: 165,
		country: "UK",
		tag: "UK piano / vocal, 165–170."
	},
	{
		id: "dj-sharkey",
		name: "DJ Sharkey",
		genre: "millenium",
		era: "00s",
		bpm: 165,
		country: "UK",
		tag: "UK piano / vocal, 165–170."
	},
	{
		id: "dj-supreme",
		name: "DJ Supreme",
		genre: "millenium",
		era: "00s",
		bpm: 165,
		country: "UK",
		tag: "UK piano / vocal, 165–170."
	},
	{
		id: "dj-vinylgroover",
		name: "DJ Vinylgroover",
		genre: "millenium",
		era: "00s",
		bpm: 165,
		country: "UK",
		tag: "UK piano / vocal, 165–170."
	},
	{
		id: "armageddon-project",
		name: "Armageddon Project",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "cement-feet",
		name: "Cement Feet",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "channel-x",
		name: "Channel X",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "chaos-project",
		name: "Chaos Project",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "delta-9",
		name: "Delta 9",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "disciples-of-annihilation",
		name: "Disciples of Annihilation",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "dj-skinhead",
		name: "DJ Skinhead",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "dj-spider",
		name: "DJ Spider",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "e-man",
		name: "E-Man",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "insanitorium",
		name: "Insanitorium",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "aftershock",
		name: "Aftershock",
		genre: "psy",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Weird FX, story break, hard drop."
	},
	{
		id: "psyko-punkz",
		name: "Psyko Punkz",
		genre: "psy",
		era: "10s",
		bpm: 150,
		country: "BE",
		tag: "Weird FX, story break, hard drop."
	},
	{
		id: "andy-svge",
		name: "ANDY SVGE",
		genre: "psy",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Weird FX, story break, hard drop."
	},
	{
		id: "digital-mindz",
		name: "Digital Mindz",
		genre: "psy",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Weird FX, story break, hard drop."
	},
	{
		id: "hypnose",
		name: "Hypnose",
		genre: "psy",
		era: "10s",
		bpm: 150,
		country: "NL",
		tag: "Weird FX, story break, hard drop."
	},
	{
		id: "gein",
		name: "Gein",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "hellfish",
		name: "Hellfish",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "i-gor",
		name: "I:Gor",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "limewax",
		name: "Limewax",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "panacea",
		name: "Panacea",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "sinister-souls",
		name: "Sinister Souls",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "spl",
		name: "SPL",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "tech-itch",
		name: "Tech Itch",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "technical-itch",
		name: "Technical Itch",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "the-dj-producer",
		name: "The DJ Producer",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "the-panacea",
		name: "The Panacea",
		genre: "freeform",
		era: "00s",
		bpm: 170,
		country: "UK",
		tag: "Broken hats, Reese, 170 grid."
	},
	{
		id: "l-a-style",
		name: "L.A. Style",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "lenny-dee",
		name: "Lenny Dee",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "lords-of-acid",
		name: "Lords of Acid",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "marc-acardipane",
		name: "Marc Acardipane",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	},
	{
		id: "meagashira",
		name: "Meagashira",
		genre: "terror",
		era: "90s",
		bpm: 220,
		country: "DE",
		tag: "Speedcore-adjacent. Noise is the lead."
	}
];
var VOCALS = [
	{
		id: "crystal-waters-gypsy-woman",
		title: "Gypsy Woman",
		artist: "Crystal Waters",
		year: 1991,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook vowel",
		why: "The 'la da dee' is the hardstyle chop. One vowel, pitched."
	},
	{
		id: "robin-s-show-me-love",
		title: "Show Me Love",
		artist: "Robin S",
		year: 1990,
		era: "90s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Open vowel chorus. Classic pitched hardstyle chop."
	},
	{
		id: "cece-peniston-finally",
		title: "Finally",
		artist: "CeCe Peniston",
		year: 1991,
		era: "90s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Long held notes. Stretch into a break pad."
	},
	{
		id: "crystal-waters-100-pure-love",
		title: "100% Pure Love",
		artist: "Crystal Waters",
		year: 1994,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Dry house vocal. High-pass and sit it on reverse bass."
	},
	{
		id: "ultra-nat-free",
		title: "Free",
		artist: "Ultra Naté",
		year: 1997,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Piano-house hook. Euphoric break or 170 happy."
	},
	{
		id: "frankie-knuckles-your-love",
		title: "Your Love",
		artist: "Frankie Knuckles",
		year: 1989,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Jamie Principle vocal. Intimate break."
	},
	{
		id: "frankie-knuckles-the-whistle-song",
		title: "The Whistle Song",
		artist: "Frankie Knuckles",
		year: 1991,
		era: "90s",
		niche: true,
		from: "house",
		chop: "adlib",
		why: "Whistle + vocal adlibs. FX layer, not the hook."
	},
	{
		id: "kicks-like-a-mule-keep-on-pumpin-it",
		title: "Keep on Pumpin' It",
		artist: "Kicks Like a Mule",
		year: 1991,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "shout",
		why: "Rave shout. Gate to the kick."
	},
	{
		id: "808-state-pacific-state",
		title: "Pacific State",
		artist: "808 State",
		year: 1989,
		era: "90s",
		niche: true,
		from: "house",
		chop: "adlib",
		why: "Bird-call / vocal texture. Atmosphere only."
	},
	{
		id: "blue-pearl-songs-of-the-siren",
		title: "Songs of the Siren",
		artist: "Blue Pearl",
		year: 1990,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Ethereal. Dark euphoric break."
	},
	{
		id: "delacy-hideaway",
		title: "Hideaway",
		artist: "De'Lacy",
		year: 1995,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Deep vocal. Pitch down for raw."
	},
	{
		id: "sneaker-pimps-spin-spin-sugar",
		title: "Spin Spin Sugar",
		artist: "Sneaker Pimps",
		year: 1996,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Armin/Farley mixes. Dark chop."
	},
	{
		id: "moloko-sing-it-back",
		title: "Sing It Back",
		artist: "Moloko",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "whisper",
		why: "Boris mix whisper. Sidechain hard."
	},
	{
		id: "moloko-the-time-is-now",
		title: "The Time Is Now",
		artist: "Moloko",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Breathy. Break only."
	},
	{
		id: "stardust-music-sounds-better-with-you",
		title: "Music Sounds Better With You",
		artist: "Stardust",
		year: 1998,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Filter-house vocal. Happy / euphoric."
	},
	{
		id: "armand-van-helden-you-dont-know-me",
		title: "You Don't Know Me",
		artist: "Armand Van Helden",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "NY house. Pitch down for raw, up for happy."
	},
	{
		id: "tori-amos-professional-widow",
		title: "Professional Widow",
		artist: "Tori Amos",
		year: 1996,
		era: "90s",
		niche: true,
		from: "alt",
		chop: "shout",
		why: "Armand's Star Trunk mix. Shout chops."
	},
	{
		id: "wamdue-project-king-of-my-castle",
		title: "King of My Castle",
		artist: "Wamdue Project",
		year: 1997,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Trance-house hook. Euphoric."
	},
	{
		id: "atb-9pm-until-i-come",
		title: "9pm (Until I Come)",
		artist: "ATB",
		year: 1998,
		era: "90s",
		niche: false,
		from: "trance",
		chop: "vocal lick",
		why: "Tiny vocal lick. Delay throws in the build."
	},
	{
		id: "chicane-ft-bryan-adams-dont-give-up",
		title: "Don't Give Up",
		artist: "Chicane ft. Bryan Adams",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Sung hook. Euphoric break."
	},
	{
		id: "chicane-saltwater",
		title: "Saltwater",
		artist: "Chicane",
		year: 1999,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Máire Brennan. Soft break vocal."
	},
	{
		id: "delerium-ft-sarah-mclachlan-silence",
		title: "Silence",
		artist: "Delerium ft. Sarah McLachlan",
		year: 1999,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Trance vocal textbook. Pitch, don't cover."
	},
	{
		id: "alice-deejay-better-off-alone",
		title: "Better Off Alone",
		artist: "Alice Deejay",
		year: 1998,
		era: "90s",
		niche: false,
		from: "trance",
		chop: "hook",
		why: "The question-hook. The hardstyle break everyone knows."
	},
	{
		id: "ian-van-dahl-castles-in-the-sky",
		title: "Castles in the Sky",
		artist: "Ian Van Dahl",
		year: 2e3,
		era: "00s",
		niche: false,
		from: "trance",
		chop: "sung",
		why: "Hands-up vocal. Euphoric / happy."
	},
	{
		id: "ian-van-dahl-will-i",
		title: "Will I?",
		artist: "Ian Van Dahl",
		year: 2001,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "hook",
		why: "Same lane. Short hook."
	},
	{
		id: "lasgo-something",
		title: "Something",
		artist: "Lasgo",
		year: 2001,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Belgian vocal trance. Euphoric."
	},
	{
		id: "lasgo-pray",
		title: "Pray",
		artist: "Lasgo",
		year: 2002,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Same. Dry in the break."
	},
	{
		id: "sylver-turn-the-tide",
		title: "Turn the Tide",
		artist: "Sylver",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Soft trance vocal. Don't bury it in the kick."
	},
	{
		id: "charlotte-skin",
		title: "Skin",
		artist: "Charlotte",
		year: 1999,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Ferry Corsten mix. Euphoric."
	},
	{
		id: "three-drives-greece-2000",
		title: "Greece 2000",
		artist: "Three Drives",
		year: 1997,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "adlib",
		why: "Mostly melody — use the tiny vocal gasp only."
	},
	{
		id: "haddaway-what-is-love",
		title: "What Is Love",
		artist: "Haddaway",
		year: 1993,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Three-word hook. Slow the break, chop the drop."
	},
	{
		id: "snap-rhythm-is-a-dancer",
		title: "Rhythm Is a Dancer",
		artist: "Snap!",
		year: 1992,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "spoken + hook",
		why: "Spoken count + hook shouts. Crowd hits."
	},
	{
		id: "snap-the-power",
		title: "The Power",
		artist: "Snap!",
		year: 1990,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "rap",
		why: "Rap cadence. Extra-raw stabs."
	},
	{
		id: "culture-beat-mr-vain",
		title: "Mr. Vain",
		artist: "Culture Beat",
		year: 1993,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "rap + hook",
		why: "Rap for extra-raw; sung hook for euphoric."
	},
	{
		id: "culture-beat-got-to-get-it",
		title: "Got to Get It",
		artist: "Culture Beat",
		year: 1993,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same pile. Shorter hook."
	},
	{
		id: "2-unlimited-no-limit",
		title: "No Limit",
		artist: "2 Unlimited",
		year: 1993,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "shout",
		why: "Staccato shouts. Gate them to the kick."
	},
	{
		id: "2-unlimited-get-ready-for-this",
		title: "Get Ready For This",
		artist: "2 Unlimited",
		year: 1991,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "shout",
		why: "Arena shout. Intro / drop hit only."
	},
	{
		id: "2-unlimited-tribal-dance",
		title: "Tribal Dance",
		artist: "2 Unlimited",
		year: 1993,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "shout",
		why: "Tribal shouts. Percussion, not a verse."
	},
	{
		id: "captain-hollywood-project-more-and-more",
		title: "More and More",
		artist: "Captain Hollywood Project",
		year: 1992,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Fast syllables. 1/16 chops on reverse bass."
	},
	{
		id: "dr-alban-its-my-life",
		title: "It's My Life",
		artist: "Dr. Alban",
		year: 1992,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Dry mid vocal. Industrial FX around it."
	},
	{
		id: "real-mccoy-another-night",
		title: "Another Night",
		artist: "Real McCoy",
		year: 1993,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Pitch the hook down over a minor drop."
	},
	{
		id: "real-mccoy-run-away",
		title: "Run Away",
		artist: "Real McCoy",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same pile. Shorter."
	},
	{
		id: "corona-the-rhythm-of-the-night",
		title: "The Rhythm of the Night",
		artist: "Corona",
		year: 1993,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Cut to 4 syllables for raw."
	},
	{
		id: "corona-baby-baby",
		title: "Baby Baby",
		artist: "Corona",
		year: 1995,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Italian euro. Thin, bright, pitch it."
	},
	{
		id: "la-bouche-be-my-lover",
		title: "Be My Lover",
		artist: "La Bouche",
		year: 1995,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Call in the break, response on the drop."
	},
	{
		id: "la-bouche-sweet-dreams",
		title: "Sweet Dreams",
		artist: "La Bouche",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Euro-Eurythmics. One line max."
	},
	{
		id: "la-bouche-fallin-in-love",
		title: "Fallin' in Love",
		artist: "La Bouche",
		year: 1995,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same voice. Different vowel."
	},
	{
		id: "livin-joy-dreamer",
		title: "Dreamer",
		artist: "Livin' Joy",
		year: 1994,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Piano-house vocal. UK hardcore / happy."
	},
	{
		id: "livin-joy-dont-stop-movin",
		title: "Don't Stop Movin'",
		artist: "Livin' Joy",
		year: 1996,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same. Faster hook."
	},
	{
		id: "nightcrawlers-push-the-feeling-on",
		title: "Push the Feeling On",
		artist: "Nightcrawlers",
		year: 1995,
		era: "90s",
		niche: true,
		from: "house",
		chop: "chop",
		why: "MK mix is already chops. Steal the idea."
	},
	{
		id: "cappella-u-got-2-let-the-music",
		title: "U Got 2 Let The Music",
		artist: "Cappella",
		year: 1993,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Italian euro. High-pass and pitch."
	},
	{
		id: "cappella-move-on-baby",
		title: "Move On Baby",
		artist: "Cappella",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same. Shorter stab."
	},
	{
		id: "ice-mc-think-about-the-way",
		title: "Think About the Way",
		artist: "Ice MC",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Reggae-euro cadence. Offbeat bass at 170."
	},
	{
		id: "ice-mc-its-a-rainy-day",
		title: "It's a Rainy Day",
		artist: "Ice MC",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same voice. Melancholy chop."
	},
	{
		id: "twenty-4-seven-slave-to-the-music",
		title: "Slave to the Music",
		artist: "Twenty 4 Seven",
		year: 1993,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Short hook. Stutter into a build."
	},
	{
		id: "maxx-get-a-way",
		title: "Get-A-Way",
		artist: "Maxx",
		year: 1993,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "rap + hook",
		why: "Rap stabs or sung hook."
	},
	{
		id: "maxx-no-more-i-cant-stand-it",
		title: "No More (I Can't Stand It)",
		artist: "Maxx",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same. Darker."
	},
	{
		id: "masterboy-feel-the-heat-of-the-night",
		title: "Feel the Heat of the Night",
		artist: "Masterboy",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Hands-up ancestor."
	},
	{
		id: "masterboy-everybody-needs-somebody",
		title: "Everybody Needs Somebody",
		artist: "Masterboy",
		year: 1993,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Shout-hook."
	},
	{
		id: "magic-affair-omen-iii",
		title: "Omen III",
		artist: "Magic Affair",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "spoken",
		why: "Occult spoken line. Dark break."
	},
	{
		id: "fun-factory-close-to-you",
		title: "Close to You",
		artist: "Fun Factory",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Euro-pop hook. Happy lane."
	},
	{
		id: "scatman-john-scatman-ski-ba-bop-ba-dop-bop",
		title: "Scatman (Ski-Ba-Bop-Ba-Dop-Bop)",
		artist: "Scatman John",
		year: 1994,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "scat",
		why: "Percussion, not a lyric. Gate to hats."
	},
	{
		id: "whigfield-saturday-night",
		title: "Saturday Night",
		artist: "Whigfield",
		year: 1994,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Nursery-rhyme hook. Pitch +5 happy, -7 raw."
	},
	{
		id: "whigfield-another-way",
		title: "Another Way",
		artist: "Whigfield",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "gala-freed-from-desire",
		title: "Freed from Desire",
		artist: "Gala",
		year: 1996,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Stadium chant. Crowd layer, not the lead."
	},
	{
		id: "gala-come-into-my-life",
		title: "Come into My Life",
		artist: "Gala",
		year: 1997,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same voice."
	},
	{
		id: "gigi-dagostino-lamour-toujours",
		title: "L'Amour Toujours",
		artist: "Gigi D'Agostino",
		year: 1999,
		era: "90s",
		niche: false,
		from: "italo",
		chop: "sung",
		why: "Melody first. Euphoric break."
	},
	{
		id: "gigi-dagostino-bla-bla-bla",
		title: "Bla Bla Bla",
		artist: "Gigi D'Agostino",
		year: 1999,
		era: "90s",
		niche: true,
		from: "italo",
		chop: "chop",
		why: "Already a chop vocal. Match cadence at 150."
	},
	{
		id: "gigi-dagostino-the-riddle",
		title: "The Riddle",
		artist: "Gigi D'Agostino",
		year: 1999,
		era: "90s",
		niche: true,
		from: "italo",
		chop: "sung",
		why: "Whistle + vocal. Happy / jumpstyle."
	},
	{
		id: "eiffel-65-blue-da-ba-dee",
		title: "Blue (Da Ba Dee)",
		artist: "Eiffel 65",
		year: 1998,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Robot vowel. Computer-vox lane."
	},
	{
		id: "eiffel-65-move-your-body",
		title: "Move Your Body",
		artist: "Eiffel 65",
		year: 1999,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same robot. Different phrase."
	},
	{
		id: "vengaboys-boom-boom-boom-boom",
		title: "Boom, Boom, Boom, Boom!!",
		artist: "Vengaboys",
		year: 1998,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Chant. Happy / frenchcore carnival."
	},
	{
		id: "vengaboys-were-going-to-ibiza",
		title: "We're Going to Ibiza",
		artist: "Vengaboys",
		year: 1999,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same. One bar."
	},
	{
		id: "vengaboys-we-like-to-party",
		title: "We Like to Party",
		artist: "Vengaboys",
		year: 1998,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Party chant."
	},
	{
		id: "aqua-barbie-girl",
		title: "Barbie Girl",
		artist: "Aqua",
		year: 1997,
		era: "90s",
		niche: false,
		from: "eurodance",
		chop: "hook",
		why: "Novelty. One bar or it becomes a joke."
	},
	{
		id: "aqua-doctor-jones",
		title: "Doctor Jones",
		artist: "Aqua",
		year: 1997,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Same voice. Faster."
	},
	{
		id: "playahitty-the-summer-is-magic",
		title: "The Summer Is Magic",
		artist: "Playahitty",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Italo-euro. Thin, bright."
	},
	{
		id: "double-you-please-dont-go",
		title: "Please Don't Go",
		artist: "Double You",
		year: 1992,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "K.C. cover. Euro vocal."
	},
	{
		id: "co-ro-ft-taleesa-because-the-night",
		title: "Because the Night",
		artist: "Co.Ro ft. Taleesa",
		year: 1992,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Springsteen via euro. Sung hook."
	},
	{
		id: "49ers-touch-me",
		title: "Touch Me",
		artist: "49ers",
		year: 1989,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Italo house vocal."
	},
	{
		id: "black-box-everybody-everybody",
		title: "Everybody Everybody",
		artist: "Black Box",
		year: 1990,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Martha Wash. Open vowels."
	},
	{
		id: "black-box-ride-on-time",
		title: "Ride on Time",
		artist: "Black Box",
		year: 1989,
		era: "90s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Study the Loleatta chop idea; find a cleared source."
	},
	{
		id: "black-box-strike-it-up",
		title: "Strike It Up",
		artist: "Black Box",
		year: 1991,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "technotronic-pump-up-the-jam",
		title: "Pump Up the Jam",
		artist: "Technotronic",
		year: 1989,
		era: "90s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Early house hook. Short stabs."
	},
	{
		id: "technotronic-get-up-before-the-night-is-over",
		title: "Get Up (Before the Night Is Over)",
		artist: "Technotronic",
		year: 1990,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same."
	},
	{
		id: "c-c-music-factory-gonna-make-you-sweat",
		title: "Gonna Make You Sweat",
		artist: "C+C Music Factory",
		year: 1990,
		era: "90s",
		niche: false,
		from: "house",
		chop: "shout",
		why: "Everybody-dance shout. Festival intro."
	},
	{
		id: "aretha-franklin-clivill-s-and-cole-a-deeper-love",
		title: "A Deeper Love",
		artist: "Aretha Franklin / Clivillés & Cole",
		year: 1993,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Gospel-house. Choir chops."
	},
	{
		id: "twenty-4-seven-i-cant-stand-it",
		title: "I Can't Stand It",
		artist: "Twenty 4 Seven",
		year: 1990,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Early euro. Short."
	},
	{
		id: "n-trance-set-you-free",
		title: "Set You Free",
		artist: "N-Trance",
		year: 1995,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "hook",
		why: "UK rave vocal. Piano + 170."
	},
	{
		id: "n-trance-forever",
		title: "Forever",
		artist: "N-Trance",
		year: 1997,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "hook",
		why: "Same voice."
	},
	{
		id: "baby-d-let-me-be-your-fantasy",
		title: "Let Me Be Your Fantasy",
		artist: "Baby D",
		year: 1992,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "sung",
		why: "Soft UK rave. Break only."
	},
	{
		id: "n-joi-anthem",
		title: "Anthem",
		artist: "N-Joi",
		year: 1990,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "spoken",
		why: "Early rave MC. Crowd hits."
	},
	{
		id: "the-shamen-ebeneezer-goode",
		title: "Ebeneezer Goode",
		artist: "The Shamen",
		year: 1992,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "hook",
		why: "Novelty. One bar only."
	},
	{
		id: "altern-8-activ-8",
		title: "Activ-8",
		artist: "Altern 8",
		year: 1991,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "shout",
		why: "Breakbeat shout. Under a gabber kick."
	},
	{
		id: "sl2-on-a-ragga-tip",
		title: "On A Ragga Tip",
		artist: "SL2",
		year: 1992,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "hook",
		why: "Ragga chop. 170 millenium lane."
	},
	{
		id: "l-a-style-james-brown-is-dead",
		title: "James Brown Is Dead",
		artist: "L.A. Style",
		year: 1991,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "spoken",
		why: "Spoken title hit. Intro impact."
	},
	{
		id: "t99-anasthasia",
		title: "Anasthasia",
		artist: "T99",
		year: 1991,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "choir",
		why: "Choir stab. Treat it like a screech."
	},
	{
		id: "praga-khan-injected-with-a-poison",
		title: "Injected with a Poison",
		artist: "Praga Khan",
		year: 1992,
		era: "90s",
		niche: true,
		from: "new beat",
		chop: "spoken",
		why: "Belgian new beat. Extra-raw."
	},
	{
		id: "lords-of-acid-i-sit-on-acid",
		title: "I Sit on Acid",
		artist: "Lords of Acid",
		year: 1988,
		era: "90s",
		niche: true,
		from: "new beat",
		chop: "spoken",
		why: "Texture. High-pass, delay, no full phrases."
	},
	{
		id: "lords-of-acid-take-control",
		title: "Take Control",
		artist: "Lords of Acid",
		year: 1991,
		era: "90s",
		niche: true,
		from: "new beat",
		chop: "spoken",
		why: "Same pile."
	},
	{
		id: "age-of-love-the-age-of-love",
		title: "The Age of Love",
		artist: "Age of Love",
		year: 1990,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "choir",
		why: "Watch Out / Jam & Spoon. Choir pad."
	},
	{
		id: "paul-van-dyk-for-an-angel",
		title: "For an Angel",
		artist: "Paul van Dyk",
		year: 1998,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "adlib",
		why: "Mostly lead — grab the tiny vocal if you need one."
	},
	{
		id: "faithless-insomnia",
		title: "Insomnia",
		artist: "Faithless",
		year: 1995,
		era: "90s",
		niche: false,
		from: "breakbeat",
		chop: "spoken",
		why: "Spoken verses. Dark break."
	},
	{
		id: "faithless-god-is-a-dj",
		title: "God Is a DJ",
		artist: "Faithless",
		year: 1998,
		era: "90s",
		niche: true,
		from: "breakbeat",
		chop: "hook",
		why: "Title hook as a drop shout."
	},
	{
		id: "faithless-we-come-1",
		title: "We Come 1",
		artist: "Faithless",
		year: 2001,
		era: "00s",
		niche: true,
		from: "breakbeat",
		chop: "hook",
		why: "Same voice. Festival."
	},
	{
		id: "the-prodigy-breathe",
		title: "Breathe",
		artist: "The Prodigy",
		year: 1996,
		era: "90s",
		niche: false,
		from: "big beat",
		chop: "whisper-shout",
		why: "Close-mic aggression. Extra-raw."
	},
	{
		id: "the-prodigy-firestarter",
		title: "Firestarter",
		artist: "The Prodigy",
		year: 1996,
		era: "90s",
		niche: false,
		from: "big beat",
		chop: "spoken",
		why: "Spoken hook. Spit it."
	},
	{
		id: "the-prodigy-smack-my-bitch-up",
		title: "Smack My Bitch Up",
		artist: "The Prodigy",
		year: 1997,
		era: "90s",
		niche: false,
		from: "big beat",
		chop: "chop",
		why: "Rhythm chop only. Percussion."
	},
	{
		id: "the-prodigy-omen",
		title: "Omen",
		artist: "The Prodigy",
		year: 2009,
		era: "00s",
		niche: true,
		from: "big beat",
		chop: "shout",
		why: "Later Prodigy shout. Drop hit."
	},
	{
		id: "the-prodigy-warriors-dance",
		title: "Warrior's Dance",
		artist: "The Prodigy",
		year: 2009,
		era: "00s",
		niche: true,
		from: "big beat",
		chop: "hook",
		why: "Sampled vocal already — study, don't lift the loop."
	},
	{
		id: "underworld-born-slippy",
		title: "Born Slippy",
		artist: "Underworld",
		year: 1995,
		era: "90s",
		niche: false,
		from: "techno",
		chop: "sung",
		why: "Long drunk notes. Reverse the tails."
	},
	{
		id: "underworld-dark-and-long-dark-train",
		title: "Dark & Long (Dark Train)",
		artist: "Underworld",
		year: 1994,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "sung",
		why: "Same voice. Darker."
	},
	{
		id: "daft-punk-around-the-world",
		title: "Around the World",
		artist: "Daft Punk",
		year: 1997,
		era: "90s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Four words. Sequence like a bassline."
	},
	{
		id: "daft-punk-one-more-time",
		title: "One More Time",
		artist: "Daft Punk",
		year: 2001,
		era: "00s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Romanthony. Filter vocal."
	},
	{
		id: "daft-punk-harder-better-faster-stronger",
		title: "Harder, Better, Faster, Stronger",
		artist: "Daft Punk",
		year: 2001,
		era: "00s",
		niche: false,
		from: "house",
		chop: "chop",
		why: "Already chopped. Match the grid at 150."
	},
	{
		id: "fatboy-slim-praise-you",
		title: "Praise You",
		artist: "Fatboy Slim",
		year: 1998,
		era: "90s",
		niche: true,
		from: "big beat",
		chop: "hook",
		why: "Camille Yarbrough chop lesson. Find a cleared source."
	},
	{
		id: "fatboy-slim-right-here-right-now",
		title: "Right Here, Right Now",
		artist: "Fatboy Slim",
		year: 1999,
		era: "90s",
		niche: true,
		from: "big beat",
		chop: "spoken",
		why: "Spoken title. Build hit."
	},
	{
		id: "fatboy-slim-the-rockafeller-skank",
		title: "The Rockafeller Skank",
		artist: "Fatboy Slim",
		year: 1998,
		era: "90s",
		niche: true,
		from: "big beat",
		chop: "chop",
		why: "The loop-is-the-song lesson."
	},
	{
		id: "fatboy-slim-weapon-of-choice",
		title: "Weapon of Choice",
		artist: "Fatboy Slim",
		year: 2001,
		era: "00s",
		niche: true,
		from: "big beat",
		chop: "spoken-sung",
		why: "Bootsy. Funk chop."
	},
	{
		id: "the-chemical-brothers-hey-boy-hey-girl",
		title: "Hey Boy Hey Girl",
		artist: "The Chemical Brothers",
		year: 1999,
		era: "90s",
		niche: true,
		from: "big beat",
		chop: "shout",
		why: "Call shout. Extra-raw percussion."
	},
	{
		id: "the-chemical-brothers-galvanize",
		title: "Galvanize",
		artist: "The Chemical Brothers",
		year: 2005,
		era: "00s",
		niche: true,
		from: "big beat",
		chop: "hook",
		why: "Q-Tip. Short hook."
	},
	{
		id: "the-chemical-brothers-setting-sun",
		title: "Setting Sun",
		artist: "The Chemical Brothers",
		year: 1996,
		era: "90s",
		niche: true,
		from: "big beat",
		chop: "shout",
		why: "Noel Gallagher shout. Drop hit."
	},
	{
		id: "moby-porcelain",
		title: "Porcelain",
		artist: "Moby",
		year: 1999,
		era: "90s",
		niche: true,
		from: "downtempo",
		chop: "sung",
		why: "Soft break vocal. Brutal drop after."
	},
	{
		id: "moby-go",
		title: "Go",
		artist: "Moby",
		year: 1991,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "ahhs",
		why: "Wordless ahhs. Pad / riser."
	},
	{
		id: "moby-why-does-my-heart-feel-so-bad",
		title: "Why Does My Heart Feel So Bad?",
		artist: "Moby",
		year: 1999,
		era: "90s",
		niche: true,
		from: "downtempo",
		chop: "sung",
		why: "Gospel chop. Euphoric contrast."
	},
	{
		id: "massive-attack-teardrop",
		title: "Teardrop",
		artist: "Massive Attack",
		year: 1998,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Breath-led. Dark break."
	},
	{
		id: "massive-attack-angel",
		title: "Angel",
		artist: "Massive Attack",
		year: 1998,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Sub-vocal. Under the kick, never over."
	},
	{
		id: "portishead-glory-box",
		title: "Glory Box",
		artist: "Portishead",
		year: 1994,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Low, smoky. Extra-raw atmosphere."
	},
	{
		id: "portishead-roads",
		title: "Roads",
		artist: "Portishead",
		year: 1994,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Break only. Leave it dry."
	},
	{
		id: "bj-rk-hyperballad",
		title: "Hyperballad",
		artist: "Björk",
		year: 1995,
		era: "90s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Odd vowels. Granular chops."
	},
	{
		id: "bj-rk-army-of-me",
		title: "Army of Me",
		artist: "Björk",
		year: 1995,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "hook",
		why: "Industrial pop. Raw / terror."
	},
	{
		id: "bj-rk-j-ga",
		title: "Jóga",
		artist: "Björk",
		year: 1997,
		era: "90s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Open vowels. Granular pad."
	},
	{
		id: "bj-rk-pagan-poetry",
		title: "Pagan Poetry",
		artist: "Björk",
		year: 2001,
		era: "00s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Intimate. Break only."
	},
	{
		id: "bj-rk-unison",
		title: "Unison",
		artist: "Björk",
		year: 2001,
		era: "00s",
		niche: true,
		from: "art pop",
		chop: "choir",
		why: "Choir stack. Euphoric."
	},
	{
		id: "aphex-twin-windowlicker",
		title: "Windowlicker",
		artist: "Aphex Twin",
		year: 1999,
		era: "90s",
		niche: true,
		from: "idm",
		chop: "pitched",
		why: "Pitched vocal as percussion."
	},
	{
		id: "aphex-twin-come-to-daddy",
		title: "Come to Daddy",
		artist: "Aphex Twin",
		year: 1997,
		era: "90s",
		niche: true,
		from: "idm",
		chop: "yell",
		why: "Yell. Terror / extra-raw."
	},
	{
		id: "aphex-twin-milk-man",
		title: "Milk Man",
		artist: "Aphex Twin",
		year: 1996,
		era: "90s",
		niche: true,
		from: "idm",
		chop: "pitched",
		why: "Creepy pitch. Terror."
	},
	{
		id: "nine-inch-nails-closer",
		title: "Closer",
		artist: "Nine Inch Nails",
		year: 1994,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "whisper",
		why: "Whisper + kick. Extra-raw only."
	},
	{
		id: "nine-inch-nails-hurt",
		title: "Hurt",
		artist: "Nine Inch Nails",
		year: 1994,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "sung",
		why: "Break only. Leave it dry."
	},
	{
		id: "nine-inch-nails-head-like-a-hole",
		title: "Head Like a Hole",
		artist: "Nine Inch Nails",
		year: 1989,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "shout",
		why: "Title shout. Drop hit."
	},
	{
		id: "marilyn-manson-the-beautiful-people",
		title: "The Beautiful People",
		artist: "Marilyn Manson",
		year: 1996,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "shout",
		why: "Shout hook. Hardcore."
	},
	{
		id: "rammstein-du-hast",
		title: "Du Hast",
		artist: "Rammstein",
		year: 1997,
		era: "90s",
		niche: false,
		from: "metal",
		chop: "shout",
		why: "German shout. Extra-raw / uptempo."
	},
	{
		id: "rammstein-sonne",
		title: "Sonne",
		artist: "Rammstein",
		year: 2001,
		era: "00s",
		niche: true,
		from: "metal",
		chop: "shout",
		why: "Count + shout. Build."
	},
	{
		id: "rammstein-ich-will",
		title: "Ich Will",
		artist: "Rammstein",
		year: 2001,
		era: "00s",
		niche: true,
		from: "metal",
		chop: "shout",
		why: "Crowd shout. Festival 1."
	},
	{
		id: "front-242-headhunter",
		title: "Headhunter",
		artist: "Front 242",
		year: 1988,
		era: "90s",
		niche: true,
		from: "ebm",
		chop: "spoken",
		why: "EBM cadence. Industrial hardcore."
	},
	{
		id: "nitzer-ebb-join-in-the-chant",
		title: "Join in the Chant",
		artist: "Nitzer Ebb",
		year: 1987,
		era: "90s",
		niche: true,
		from: "ebm",
		chop: "chant",
		why: "One-note chant. Gabber / extra-raw."
	},
	{
		id: "ministry-just-one-fix",
		title: "Just One Fix",
		artist: "Ministry",
		year: 1992,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "shout",
		why: "Industrial shout. Terror."
	},
	{
		id: "kmfdm-juke-joint-jezebel",
		title: "Juke Joint Jezebel",
		artist: "KMFDM",
		year: 1995,
		era: "90s",
		niche: true,
		from: "industrial",
		chop: "hook",
		why: "Industrial hook. Extra-raw."
	},
	{
		id: "combichrist-get-your-body-beat",
		title: "Get Your Body Beat",
		artist: "Combichrist",
		year: 2006,
		era: "00s",
		niche: true,
		from: "aggrotech",
		chop: "shout",
		why: "Aggrotech shout. Extra-raw."
	},
	{
		id: "charly-lownoise-and-mental-theo-wonderful-days",
		title: "Wonderful Days",
		artist: "Charly Lownoise & Mental Theo",
		year: 1994,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "90s happy vocal. Piano + 170."
	},
	{
		id: "charly-lownoise-and-mental-theo-live-in-ecstasy",
		title: "Live in Ecstasy",
		artist: "Charly Lownoise & Mental Theo",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "party-animals-have-you-ever-been-mellow",
		title: "Have You Ever Been Mellow",
		artist: "Party Animals",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Olivia Newton-John via gabber. Pitched vox."
	},
	{
		id: "party-animals-aquarius",
		title: "Aquarius",
		artist: "Party Animals",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Hair / Fifth Dimension via gabber."
	},
	{
		id: "party-animals-hava-naquila",
		title: "Hava Naquila",
		artist: "Party Animals",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Novelty. One bar."
	},
	{
		id: "dune-hardcore-vibes",
		title: "Hardcore Vibes",
		artist: "Dune",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "90s happy. Sung hook."
	},
	{
		id: "dune-cant-stop-raving",
		title: "Can't Stop Raving",
		artist: "Dune",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Same voice."
	},
	{
		id: "dune-are-you-ready-to-fly",
		title: "Are You Ready to Fly",
		artist: "Dune",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Rainbow cover via happy."
	},
	{
		id: "bl-mchen-herz-an-herz",
		title: "Herz an Herz",
		artist: "Blümchen",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "German happy. Pitch it."
	},
	{
		id: "marusha-somewhere-over-the-rainbow",
		title: "Somewhere Over the Rainbow",
		artist: "Marusha",
		year: 1994,
		era: "90s",
		niche: true,
		from: "rave",
		chop: "sung",
		why: "Rave cover. Break vocal."
	},
	{
		id: "critical-mass-it-takes-a-lifetime",
		title: "It Takes a Lifetime",
		artist: "Critical Mass",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Dutch happy. Piano lane."
	},
	{
		id: "critical-mass-dancing-together",
		title: "Dancing Together",
		artist: "Critical Mass",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Same."
	},
	{
		id: "nakatomi-children-of-the-night",
		title: "Children of the Night",
		artist: "Nakatomi",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Happy hardcore vocal."
	},
	{
		id: "nakatomi-free",
		title: "Free",
		artist: "Nakatomi",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "flamman-and-abraxas-good-to-go",
		title: "Good to Go",
		artist: "Flamman & Abraxas",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Dutch happy chant."
	},
	{
		id: "mark-oh-tears-dont-lie",
		title: "Tears Don't Lie",
		artist: "Mark 'Oh",
		year: 1994,
		era: "90s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Hands-up ancestor."
	},
	{
		id: "scooter-how-much-is-the-fish",
		title: "How Much Is The Fish?",
		artist: "Scooter",
		year: 1998,
		era: "90s",
		niche: false,
		from: "happy",
		chop: "shout",
		why: "Scooter shout. Frenchcore / happy."
	},
	{
		id: "scooter-nessaja",
		title: "Nessaja",
		artist: "Scooter",
		year: 2002,
		era: "00s",
		niche: false,
		from: "happy",
		chop: "hook",
		why: "Cat Stevens via Scooter. Sung hook."
	},
	{
		id: "scooter-ramp-the-logical-song",
		title: "Ramp! (The Logical Song)",
		artist: "Scooter",
		year: 2001,
		era: "00s",
		niche: false,
		from: "happy",
		chop: "hook",
		why: "Supertramp via Scooter. Hands-up."
	},
	{
		id: "scooter-hyper-hyper",
		title: "Hyper Hyper",
		artist: "Scooter",
		year: 1994,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "shout",
		why: "Early Scooter shout."
	},
	{
		id: "scooter-maria-i-like-it-loud",
		title: "Maria (I Like It Loud)",
		artist: "Scooter",
		year: 2003,
		era: "00s",
		niche: true,
		from: "happy",
		chop: "shout",
		why: "Shout hook. Gabber energy."
	},
	{
		id: "scooter-friends",
		title: "Friends",
		artist: "Scooter",
		year: 1995,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Sung Scooter. Happy."
	},
	{
		id: "scooter-im-raving",
		title: "I'm Raving",
		artist: "Scooter",
		year: 1996,
		era: "90s",
		niche: true,
		from: "happy",
		chop: "hook",
		why: "Hoochie Coochie via Scooter."
	},
	{
		id: "cascada-everytime-we-touch",
		title: "Everytime We Touch",
		artist: "Cascada",
		year: 2005,
		era: "00s",
		niche: false,
		from: "hands-up",
		chop: "sung",
		why: "THE hands-up vocal. Hardstyle chops it constantly."
	},
	{
		id: "cascada-evacuate-the-dancefloor",
		title: "Evacuate the Dancefloor",
		artist: "Cascada",
		year: 2009,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Later Cascada. Club hook."
	},
	{
		id: "cascada-miracle",
		title: "Miracle",
		artist: "Cascada",
		year: 2004,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "sung",
		why: "Same voice. Euphoric."
	},
	{
		id: "groove-coverage-poison",
		title: "Poison",
		artist: "Groove Coverage",
		year: 2004,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Alice Cooper via hands-up."
	},
	{
		id: "groove-coverage-7-years-and-50-days",
		title: "7 Years and 50 Days",
		artist: "Groove Coverage",
		year: 2004,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "sung",
		why: "Hands-up ballad vocal."
	},
	{
		id: "groove-coverage-runaway",
		title: "Runaway",
		artist: "Groove Coverage",
		year: 2004,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "groove-coverage-moonlight-shadow",
		title: "Moonlight Shadow",
		artist: "Groove Coverage",
		year: 2002,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "sung",
		why: "Mike Oldfield via hands-up."
	},
	{
		id: "special-d-come-with-me",
		title: "Come With Me",
		artist: "Special D",
		year: 2003,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Hands-up / jumpstyle chop."
	},
	{
		id: "special-d-you",
		title: "You",
		artist: "Special D",
		year: 2004,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Same."
	},
	{
		id: "dj-sammy-heaven",
		title: "Heaven",
		artist: "DJ Sammy",
		year: 2002,
		era: "00s",
		niche: false,
		from: "trance",
		chop: "sung",
		why: "Bryan Adams via trance. Euphoric."
	},
	{
		id: "dj-sammy-the-boys-of-summer",
		title: "The Boys of Summer",
		artist: "DJ Sammy",
		year: 2002,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Don Henley via trance."
	},
	{
		id: "fragma-tocas-miracle",
		title: "Toca's Miracle",
		artist: "Fragma",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Coco. Vocal trance chop."
	},
	{
		id: "fragma-you-are-alive",
		title: "You Are Alive",
		artist: "Fragma",
		year: 2001,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Same voice."
	},
	{
		id: "ultrabeat-pretty-green-eyes",
		title: "Pretty Green Eyes",
		artist: "Ultrabeat",
		year: 2003,
		era: "00s",
		niche: false,
		from: "hands-up",
		chop: "hook",
		why: "UK vocal. Happy / 170. People chop this constantly."
	},
	{
		id: "ultrabeat-feelin-fine",
		title: "Feelin' Fine",
		artist: "Ultrabeat",
		year: 2003,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "ultra-feat-mc-whiskey-pretty-green-eyes",
		title: "Pretty Green Eyes",
		artist: "Ultra feat. MC Whiskey",
		year: 2003,
		era: "00s",
		niche: true,
		from: "rave",
		chop: "hook",
		why: "The older cut. Same hook."
	},
	{
		id: "public-domain-operation-blade",
		title: "Operation Blade",
		artist: "Public Domain",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "NIN riff + vocal. Happy / gabber."
	},
	{
		id: "basshunter-now-youre-gone",
		title: "Now You're Gone",
		artist: "Basshunter",
		year: 2008,
		era: "00s",
		niche: false,
		from: "hands-up",
		chop: "hook",
		why: "Euro-pop hook. Happy. Keep it short."
	},
	{
		id: "basshunter-dota",
		title: "DotA",
		artist: "Basshunter",
		year: 2006,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Same voice. Novelty — one bar."
	},
	{
		id: "basshunter-boten-anna",
		title: "Boten Anna",
		artist: "Basshunter",
		year: 2006,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Swedish. Novelty."
	},
	{
		id: "italobrothers-stamp-on-the-ground",
		title: "Stamp on the Ground",
		artist: "ItaloBrothers",
		year: 2009,
		era: "00s",
		niche: true,
		from: "hands-up",
		chop: "hook",
		why: "Hands-up chant. Jumpstyle."
	},
	{
		id: "david-guetta-and-chris-willis-love-is-gone",
		title: "Love Is Gone",
		artist: "David Guetta & Chris Willis",
		year: 2007,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "F*ck Me I'm Famous vocal. Euphoric."
	},
	{
		id: "david-guetta-love-dont-let-me-go",
		title: "Love Don't Let Me Go",
		artist: "David Guetta",
		year: 2002,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Early Guetta vocal."
	},
	{
		id: "david-guetta-the-world-is-mine",
		title: "The World Is Mine",
		artist: "David Guetta",
		year: 2004,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "fedde-le-grand-put-your-hands-up-for-detroit",
		title: "Put Your Hands Up For Detroit",
		artist: "Fedde Le Grand",
		year: 2006,
		era: "00s",
		niche: true,
		from: "house",
		chop: "shout",
		why: "Title shout. Festival intro."
	},
	{
		id: "ida-corr-vs-fedde-le-grand-let-me-think-about-it",
		title: "Let Me Think About It",
		artist: "Ida Corr vs Fedde Le Grand",
		year: 2007,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "House vocal. Pitch it."
	},
	{
		id: "calvin-harris-acceptable-in-the-80s",
		title: "Acceptable in the 80s",
		artist: "Calvin Harris",
		year: 2007,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "hook",
		why: "Electro-pop hook."
	},
	{
		id: "calvin-harris-im-not-alone",
		title: "I'm Not Alone",
		artist: "Calvin Harris",
		year: 2009,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Festival vocal."
	},
	{
		id: "rihanna-ft-calvin-harris-we-found-love",
		title: "We Found Love",
		artist: "Rihanna ft. Calvin Harris",
		year: 2011,
		era: "10s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. Vowel only."
	},
	{
		id: "rihanna-umbrella",
		title: "Umbrella",
		artist: "Rihanna",
		year: 2007,
		era: "00s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. One syllable."
	},
	{
		id: "rihanna-dont-stop-the-music",
		title: "Don't Stop the Music",
		artist: "Rihanna",
		year: 2007,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "House-pop. Chop the syncopation."
	},
	{
		id: "rihanna-disturbia",
		title: "Disturbia",
		artist: "Rihanna",
		year: 2008,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Darker Rihanna. Raw lane."
	},
	{
		id: "lady-gaga-poker-face",
		title: "Poker Face",
		artist: "Lady Gaga",
		year: 2008,
		era: "00s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. Vowel / robot."
	},
	{
		id: "lady-gaga-bad-romance",
		title: "Bad Romance",
		artist: "Lady Gaga",
		year: 2009,
		era: "00s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Rah-rah. Chant chops."
	},
	{
		id: "lady-gaga-just-dance",
		title: "Just Dance",
		artist: "Lady Gaga",
		year: 2008,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Club hook."
	},
	{
		id: "lady-gaga-alejandro",
		title: "Alejandro",
		artist: "Lady Gaga",
		year: 2010,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Melancholy. Euphoric break."
	},
	{
		id: "britney-spears-toxic",
		title: "Toxic",
		artist: "Britney Spears",
		year: 2003,
		era: "00s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "String hook + vocal. One bar."
	},
	{
		id: "britney-spears-gimme-more",
		title: "Gimme More",
		artist: "Britney Spears",
		year: 2007,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "It's Britney. Chop the breath."
	},
	{
		id: "britney-spears-piece-of-me",
		title: "Piece of Me",
		artist: "Britney Spears",
		year: 2007,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Staccato. Extra-raw irony."
	},
	{
		id: "kylie-minogue-cant-get-you-out-of-my-head",
		title: "Can't Get You Out of My Head",
		artist: "Kylie Minogue",
		year: 2001,
		era: "00s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "La la la. Computer-vox."
	},
	{
		id: "kylie-minogue-slow",
		title: "Slow",
		artist: "Kylie Minogue",
		year: 2003,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Dry. Break only."
	},
	{
		id: "madonna-hung-up",
		title: "Hung Up",
		artist: "Madonna",
		year: 2005,
		era: "00s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "ABBA via Madonna. Disco chop."
	},
	{
		id: "madonna-sorry",
		title: "Sorry",
		artist: "Madonna",
		year: 2006,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Pet Shop mix energy."
	},
	{
		id: "t-a-t-u-all-the-things-she-said",
		title: "All the Things She Said",
		artist: "t.A.T.u.",
		year: 2002,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Teen-pop anguish. Euphoric or raw."
	},
	{
		id: "t-a-t-u-not-gonna-get-us",
		title: "Not Gonna Get Us",
		artist: "t.A.T.u.",
		year: 2002,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same voice."
	},
	{
		id: "evanescence-bring-me-to-life",
		title: "Bring Me to Life",
		artist: "Evanescence",
		year: 2003,
		era: "00s",
		niche: false,
		from: "rock",
		chop: "sung + shout",
		why: "Sung break, shout drop. Hardcore."
	},
	{
		id: "evanescence-my-immortal",
		title: "My Immortal",
		artist: "Evanescence",
		year: 2003,
		era: "00s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Ballad. Break only."
	},
	{
		id: "linkin-park-in-the-end",
		title: "In the End",
		artist: "Linkin Park",
		year: 2e3,
		era: "00s",
		niche: false,
		from: "rock",
		chop: "sung",
		why: "Too known. Vowel / whisper."
	},
	{
		id: "linkin-park-numb",
		title: "Numb",
		artist: "Linkin Park",
		year: 2003,
		era: "00s",
		niche: false,
		from: "rock",
		chop: "sung",
		why: "Same. One line."
	},
	{
		id: "linkin-park-one-step-closer",
		title: "One Step Closer",
		artist: "Linkin Park",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "rock",
		chop: "shout",
		why: "Shout drop. Hardcore."
	},
	{
		id: "system-of-a-down-chop-suey",
		title: "Chop Suey!",
		artist: "System of a Down",
		year: 2001,
		era: "00s",
		niche: true,
		from: "metal",
		chop: "shout",
		why: "Wake up. Hardcore shout."
	},
	{
		id: "bloodhound-gang-the-bad-touch",
		title: "The Bad Touch",
		artist: "Bloodhound Gang",
		year: 1999,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Novelty. One bar, extra-raw joke."
	},
	{
		id: "the-knife-heartbeats",
		title: "Heartbeats",
		artist: "The Knife",
		year: 2002,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "José González later. Original is the chop."
	},
	{
		id: "the-knife-silent-shout",
		title: "Silent Shout",
		artist: "The Knife",
		year: 2006,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Pitched. Dark break."
	},
	{
		id: "imogen-heap-hide-and-seek",
		title: "Hide and Seek",
		artist: "Imogen Heap",
		year: 2005,
		era: "00s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Vocoder stacked. Computer-vox bible."
	},
	{
		id: "yeah-yeah-yeahs-heads-will-roll",
		title: "Heads Will Roll",
		artist: "Yeah Yeah Yeahs",
		year: 2009,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "hook",
		why: "A-Trak mix. Offbeat chops."
	},
	{
		id: "yeah-yeah-yeahs-maps",
		title: "Maps",
		artist: "Yeah Yeah Yeahs",
		year: 2003,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "sung",
		why: "Sung break."
	},
	{
		id: "justice-d-a-n-c-e",
		title: "D.A.N.C.E.",
		artist: "Justice",
		year: 2007,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "hook",
		why: "Choir kids. Happy / frenchcore."
	},
	{
		id: "justice-vs-simian-we-are-your-friends",
		title: "We Are Your Friends",
		artist: "Justice vs Simian",
		year: 2006,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "hook",
		why: "Festival hook."
	},
	{
		id: "justice-phantom-pt-ii",
		title: "Phantom Pt II",
		artist: "Justice",
		year: 2007,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "choir",
		why: "Choir stab."
	},
	{
		id: "la-roux-in-for-the-kill",
		title: "In For The Kill",
		artist: "La Roux",
		year: 2009,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Skream mix. Bass + vocal."
	},
	{
		id: "la-roux-bulletproof",
		title: "Bulletproof",
		artist: "La Roux",
		year: 2009,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Synth-pop hook."
	},
	{
		id: "r-yksopp-ft-robyn-the-girl-and-the-robot",
		title: "The Girl and the Robot",
		artist: "Röyksopp ft. Robyn",
		year: 2009,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Robyn. Euphoric."
	},
	{
		id: "robyn-with-every-heartbeat",
		title: "With Every Heartbeat",
		artist: "Robyn",
		year: 2007,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Kleerup. Break vocal."
	},
	{
		id: "robyn-dancing-on-my-own",
		title: "Dancing On My Own",
		artist: "Robyn",
		year: 2010,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Too known. Vowel."
	},
	{
		id: "deadmau5-ft-rob-swire-ghosts-n-stuff",
		title: "Ghosts 'n' Stuff",
		artist: "deadmau5 ft. Rob Swire",
		year: 2009,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Swire vocal. Euphoric / raw."
	},
	{
		id: "nero-promises",
		title: "Promises",
		artist: "Nero",
		year: 2011,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "sung",
		why: "Bass vocal. UKHC / euphoric."
	},
	{
		id: "nero-me-and-you",
		title: "Me and You",
		artist: "Nero",
		year: 2011,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "sung",
		why: "Same."
	},
	{
		id: "pendulum-hold-your-colour",
		title: "Hold Your Colour",
		artist: "Pendulum",
		year: 2005,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "DNB vocal. 170 map."
	},
	{
		id: "pendulum-tarantula",
		title: "Tarantula",
		artist: "Pendulum",
		year: 2005,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "pendulum-the-island",
		title: "The Island",
		artist: "Pendulum",
		year: 2010,
		era: "10s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Two-part vocal. Euphoric."
	},
	{
		id: "pendulum-witchcraft",
		title: "Witchcraft",
		artist: "Pendulum",
		year: 2010,
		era: "10s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Darker Swire."
	},
	{
		id: "pendulum-watercolour",
		title: "Watercolour",
		artist: "Pendulum",
		year: 2010,
		era: "10s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Festival vocal."
	},
	{
		id: "pendulum-slam",
		title: "Slam",
		artist: "Pendulum",
		year: 2005,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "shout",
		why: "Title shout."
	},
	{
		id: "chase-and-status-ft-plan-b-end-credits",
		title: "End Credits",
		artist: "Chase & Status ft. Plan B",
		year: 2009,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Soul vocal on DNB. 170."
	},
	{
		id: "chase-and-status-ft-mali-let-you-go",
		title: "Let You Go",
		artist: "Chase & Status ft. Mali",
		year: 2011,
		era: "10s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Same lane."
	},
	{
		id: "chase-and-status-ft-liam-bailey-blind-faith",
		title: "Blind Faith",
		artist: "Chase & Status ft. Liam Bailey",
		year: 2011,
		era: "10s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Gospel-ish. Euphoric."
	},
	{
		id: "magnetic-man-i-need-air",
		title: "I Need Air",
		artist: "Magnetic Man",
		year: 2010,
		era: "10s",
		niche: true,
		from: "dubstep",
		chop: "sung",
		why: "Dubstep vocal. Pitch to 150/170."
	},
	{
		id: "dizzee-rascal-and-armand-van-helden-bonkers",
		title: "Bonkers",
		artist: "Dizzee Rascal & Armand Van Helden",
		year: 2009,
		era: "00s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "Festival MC. Drop hit."
	},
	{
		id: "dizzee-rascal-dirtee-disco",
		title: "Dirtee Disco",
		artist: "Dizzee Rascal",
		year: 2010,
		era: "10s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "Same."
	},
	{
		id: "dizzee-rascal-i-luv-u",
		title: "I Luv U",
		artist: "Dizzee Rascal",
		year: 2003,
		era: "00s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "Early grime. Extra-raw cadence."
	},
	{
		id: "dj-zinc-ft-ms-dynamite-wile-out",
		title: "Wile Out",
		artist: "DJ Zinc ft. Ms Dynamite",
		year: 2007,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "mc + sung",
		why: "Bassline / UKG. 140 or 170."
	},
	{
		id: "t2-ft-jodie-aysha-heartbroken",
		title: "Heartbroken",
		artist: "T2 ft. Jodie Aysha",
		year: 2007,
		era: "00s",
		niche: true,
		from: "bassline",
		chop: "sung",
		why: "Bassline classic. Pitch to 150/170."
	},
	{
		id: "mj-cole-sincere",
		title: "Sincere",
		artist: "MJ Cole",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "UKG vocal. 170 happy / millenium."
	},
	{
		id: "mj-cole-tired-of-luv",
		title: "Tired of Luv",
		artist: "MJ Cole",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "artful-dodger-ft-craig-david-re-rewind",
		title: "Re-Rewind",
		artist: "Artful Dodger ft. Craig David",
		year: 1999,
		era: "90s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "UKG textbook vocal."
	},
	{
		id: "craig-david-fill-me-in",
		title: "Fill Me In",
		artist: "Craig David",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "2-step cadence."
	},
	{
		id: "artful-dodger-and-robbie-craig-ft-craig-david-woman-trouble",
		title: "Woman Trouble",
		artist: "Artful Dodger & Robbie Craig ft. Craig David",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "Same."
	},
	{
		id: "sweet-female-attitude-flowers",
		title: "Flowers",
		artist: "Sweet Female Attitude",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "UKG honey vocal. Happy."
	},
	{
		id: "shanks-and-bigfoot-sweet-like-chocolate",
		title: "Sweet Like Chocolate",
		artist: "Shanks & Bigfoot",
		year: 1999,
		era: "90s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "UKG hook."
	},
	{
		id: "oxide-and-neutrino-bound-4-da-reload",
		title: "Bound 4 Da Reload",
		artist: "Oxide & Neutrino",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "mc",
		why: "Casualty + MC. Extra-raw / 170."
	},
	{
		id: "wookie-battle",
		title: "Battle",
		artist: "Wookie",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "UKG. Offbeat bass."
	},
	{
		id: "sticky-ft-ms-dynamite-booo",
		title: "Booo!",
		artist: "Sticky ft. Ms Dynamite",
		year: 2001,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "mc",
		why: "UKG MC. Cadence chops."
	},
	{
		id: "so-solid-crew-21-seconds",
		title: "21 Seconds",
		artist: "So Solid Crew",
		year: 2001,
		era: "00s",
		niche: true,
		from: "garage",
		chop: "mc",
		why: "UKG crew. Extra-raw percussion."
	},
	{
		id: "dj-q-functions-on-the-low",
		title: "Functions on the Low",
		artist: "DJ Q",
		year: 2013,
		era: "10s",
		niche: true,
		from: "bassline",
		chop: "vocal chop",
		why: "Bassline chops. 170."
	},
	{
		id: "meridian-dan-german-whip",
		title: "German Whip",
		artist: "Meridian Dan",
		year: 2014,
		era: "10s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "Hooky grime. UK energy."
	},
	{
		id: "skepta-shutdown",
		title: "Shutdown",
		artist: "Skepta",
		year: 2015,
		era: "10s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "Dry MC. Extra-raw."
	},
	{
		id: "skepta-thats-not-me",
		title: "That's Not Me",
		artist: "Skepta",
		year: 2014,
		era: "10s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "Cadence only."
	},
	{
		id: "beyonc-crazy-in-love",
		title: "Crazy in Love",
		artist: "Beyoncé",
		year: 2003,
		era: "00s",
		niche: false,
		from: "rnb",
		chop: "hook",
		why: "Too known. Horns + one syllable."
	},
	{
		id: "beyonc-naughty-girl",
		title: "Naughty Girl",
		artist: "Beyoncé",
		year: 2003,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Donna Summer via Beyoncé. Disco chop."
	},
	{
		id: "destinys-child-say-my-name",
		title: "Say My Name",
		artist: "Destiny's Child",
		year: 1999,
		era: "90s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Staccato names. Rhythmic chops."
	},
	{
		id: "destinys-child-bills-bills-bills",
		title: "Bills, Bills, Bills",
		artist: "Destiny's Child",
		year: 1999,
		era: "90s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "tlc-no-scrubs",
		title: "No Scrubs",
		artist: "TLC",
		year: 1999,
		era: "90s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Dry R&B. Offbeat."
	},
	{
		id: "tlc-waterfalls",
		title: "Waterfalls",
		artist: "TLC",
		year: 1995,
		era: "90s",
		niche: true,
		from: "rnb",
		chop: "sung",
		why: "Sung break."
	},
	{
		id: "aaliyah-try-again",
		title: "Try Again",
		artist: "Aaliyah",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Same. Dry."
	},
	{
		id: "aaliyah-we-need-a-resolution",
		title: "We Need a Resolution",
		artist: "Aaliyah",
		year: 2001,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "sung",
		why: "Darker Aaliyah."
	},
	{
		id: "erykah-badu-bag-lady",
		title: "Bag Lady",
		artist: "Erykah Badu",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "Soul. Break only."
	},
	{
		id: "erykah-badu-didnt-cha-know",
		title: "Didn't Cha Know",
		artist: "Erykah Badu",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "Same."
	},
	{
		id: "the-roots-ft-cody-chesnutt-the-seed-2-0",
		title: "The Seed (2.0)",
		artist: "The Roots ft. Cody ChesnuTT",
		year: 2002,
		era: "00s",
		niche: true,
		from: "soul",
		chop: "hook",
		why: "Rock-soul hook."
	},
	{
		id: "marvin-gaye-i-want-you",
		title: "I Want You",
		artist: "Marvin Gaye",
		year: 1976,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "Use a cleared reissue. Sung break."
	},
	{
		id: "earth-wind-and-fire-lets-groove",
		title: "Let's Groove",
		artist: "Earth, Wind & Fire",
		year: 1981,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "hook",
		why: "Disco-soul. Happy / frenchcore."
	},
	{
		id: "michael-jackson-dont-stop-til-you-get-enough",
		title: "Don't Stop 'Til You Get Enough",
		artist: "Michael Jackson",
		year: 1979,
		era: "90s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. Vocal percussion only."
	},
	{
		id: "michael-jackson-billie-jean",
		title: "Billie Jean",
		artist: "Michael Jackson",
		year: 1983,
		era: "90s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. One syllable."
	},
	{
		id: "missy-elliott-work-it",
		title: "Work It",
		artist: "Missy Elliott",
		year: 2002,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Backwards rap. Extra-raw idea."
	},
	{
		id: "missy-elliott-get-ur-freak-on",
		title: "Get Ur Freak On",
		artist: "Missy Elliott",
		year: 2001,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Timbaland percussion vocal."
	},
	{
		id: "missy-elliott-lose-control",
		title: "Lose Control",
		artist: "Missy Elliott",
		year: 2005,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Whistle + rap."
	},
	{
		id: "m-i-a-paper-planes",
		title: "Paper Planes",
		artist: "M.I.A.",
		year: 2007,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Gun-shot hook. Extra-raw."
	},
	{
		id: "m-i-a-bad-girls",
		title: "Bad Girls",
		artist: "M.I.A.",
		year: 2012,
		era: "10s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Club-rap. Extra-raw."
	},
	{
		id: "m-i-a-bucky-done-gun",
		title: "Bucky Done Gun",
		artist: "M.I.A.",
		year: 2005,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "shout",
		why: "Shout. Extra-raw."
	},
	{
		id: "die-antwoord-i-fink-u-freeky",
		title: "I Fink U Freeky",
		artist: "Die Antwoord",
		year: 2012,
		era: "10s",
		niche: true,
		from: "rap",
		chop: "spoken",
		why: "Spoken-rap. Extra-raw / uptempo."
	},
	{
		id: "die-antwoord-enter-the-ninja",
		title: "Enter the Ninja",
		artist: "Die Antwoord",
		year: 2010,
		era: "10s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Same pile."
	},
	{
		id: "fka-twigs-two-weeks",
		title: "Two Weeks",
		artist: "FKA twigs",
		year: 2014,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Art-R&B. Dark break."
	},
	{
		id: "fka-twigs-cellophane",
		title: "Cellophane",
		artist: "FKA twigs",
		year: 2019,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Fragile. Break only."
	},
	{
		id: "fka-twigs-eusexua",
		title: "Eusexua",
		artist: "FKA twigs",
		year: 2024,
		era: "20s",
		niche: true,
		from: "alt pop",
		chop: "sung",
		why: "Club-art vocal."
	},
	{
		id: "grimes-genesis",
		title: "Genesis",
		artist: "Grimes",
		year: 2012,
		era: "10s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Choir-pop. Euphoric."
	},
	{
		id: "grimes-oblivion",
		title: "Oblivion",
		artist: "Grimes",
		year: 2012,
		era: "10s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Darker. Extra-raw atmosphere."
	},
	{
		id: "grimes-kill-v-maim",
		title: "Kill V. Maim",
		artist: "Grimes",
		year: 2015,
		era: "10s",
		niche: true,
		from: "art pop",
		chop: "shout",
		why: "Yell. Extra-raw / happy."
	},
	{
		id: "sophie-bipp",
		title: "Bipp",
		artist: "SOPHIE",
		year: 2013,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "hook",
		why: "Latex vocal. Computer-vox."
	},
	{
		id: "sophie-immaterial",
		title: "Immaterial",
		artist: "SOPHIE",
		year: 2018,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "hook",
		why: "Club hook. Happy / extra-raw."
	},
	{
		id: "sophie-ponyboy",
		title: "Ponyboy",
		artist: "SOPHIE",
		year: 2018,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "spoken",
		why: "Spoken. Extra-raw."
	},
	{
		id: "sevdaliza-alibi",
		title: "Alibi",
		artist: "Sevdaliza",
		year: 2023,
		era: "20s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Dark vocal. Raw / euphoric."
	},
	{
		id: "sevdaliza-human",
		title: "Human",
		artist: "Sevdaliza",
		year: 2016,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Same voice. Break."
	},
	{
		id: "kelela-rewind",
		title: "Rewind",
		artist: "Kelela",
		year: 2015,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "hook",
		why: "Club R&B. Nightcore or raw."
	},
	{
		id: "kelela-lmk",
		title: "LMK",
		artist: "Kelela",
		year: 2017,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "hook",
		why: "Already chopped in the track."
	},
	{
		id: "kelela-raven",
		title: "Raven",
		artist: "Kelela",
		year: 2022,
		era: "20s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Later Kelela. Dark."
	},
	{
		id: "the-weeknd-house-of-balloons-glass-table-girls",
		title: "House of Balloons / Glass Table Girls",
		artist: "The Weeknd",
		year: 2011,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Siouxsie via Weeknd. Dark break."
	},
	{
		id: "the-weeknd-the-hills",
		title: "The Hills",
		artist: "The Weeknd",
		year: 2015,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Dark pop. Extra-raw contrast."
	},
	{
		id: "the-weeknd-wicked-games",
		title: "Wicked Games",
		artist: "The Weeknd",
		year: 2011,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "james-blake-limit-to-your-love",
		title: "Limit to Your Love",
		artist: "James Blake",
		year: 2010,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Feist via Blake. Sub + vocal."
	},
	{
		id: "james-blake-retrograde",
		title: "Retrograde",
		artist: "James Blake",
		year: 2013,
		era: "10s",
		niche: true,
		from: "alt rnb",
		chop: "sung",
		why: "Sung break."
	},
	{
		id: "burial-archangel",
		title: "Archangel",
		artist: "Burial",
		year: 2007,
		era: "00s",
		niche: true,
		from: "ukg",
		chop: "vocal chop",
		why: "UKG ghost chops. Atmosphere."
	},
	{
		id: "burial-come-down-to-us",
		title: "Come Down to Us",
		artist: "Burial",
		year: 2013,
		era: "10s",
		niche: true,
		from: "ukg",
		chop: "vocal chop",
		why: "Same. Don't lift the loop — make your own."
	},
	{
		id: "jamie-xx-gosh",
		title: "Gosh",
		artist: "Jamie xx",
		year: 2015,
		era: "10s",
		niche: true,
		from: "ukg",
		chop: "vocal chop",
		why: "Club chop. 170 / 150."
	},
	{
		id: "jamie-xx-ft-romy-loud-places",
		title: "Loud Places",
		artist: "Jamie xx ft. Romy",
		year: 2015,
		era: "10s",
		niche: true,
		from: "ukg",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "flux-pavilion-i-cant-stop",
		title: "I Can't Stop",
		artist: "Flux Pavilion",
		year: 2010,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "shout",
		why: "Bass shout. Extra-raw."
	},
	{
		id: "dizzee-rascal-bassline-junkie",
		title: "Bassline Junkie",
		artist: "Dizzee Rascal",
		year: 2013,
		era: "10s",
		niche: true,
		from: "grime",
		chop: "mc",
		why: "MC. Extra-raw."
	},
	{
		id: "salem-king-night",
		title: "King Night",
		artist: "Salem",
		year: 2010,
		era: "10s",
		niche: true,
		from: "witch house",
		chop: "pitched",
		why: "Pitched witch-house vox. Terror."
	},
	{
		id: "the-xx-crystalised",
		title: "Crystalised",
		artist: "The xx",
		year: 2009,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "sung",
		why: "Dry duo. Break."
	},
	{
		id: "charli-xcx-vroom-vroom",
		title: "Vroom Vroom",
		artist: "Charli XCX",
		year: 2016,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "hook",
		why: "SOPHIE-era. Computer-vox."
	},
	{
		id: "charli-xcx-unlock-it",
		title: "Unlock It",
		artist: "Charli XCX",
		year: 2017,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "hook",
		why: "PC Music hook."
	},
	{
		id: "charli-xcx-von-dutch",
		title: "Von dutch",
		artist: "Charli XCX",
		year: 2024,
		era: "20s",
		niche: true,
		from: "club pop",
		chop: "hook",
		why: "Club hook. Extra-raw irony or happy."
	},
	{
		id: "charli-xcx-360",
		title: "360",
		artist: "Charli XCX",
		year: 2024,
		era: "20s",
		niche: true,
		from: "club pop",
		chop: "hook",
		why: "Talk-sing. Computer-vox."
	},
	{
		id: "charli-xcx-apple",
		title: "Apple",
		artist: "Charli XCX",
		year: 2024,
		era: "20s",
		niche: true,
		from: "club pop",
		chop: "chant",
		why: "Chant. Jumpstyle / happy."
	},
	{
		id: "charli-xcx-speed-drive",
		title: "Speed Drive",
		artist: "Charli XCX",
		year: 2023,
		era: "20s",
		niche: true,
		from: "club pop",
		chop: "hook",
		why: "Euro-pop. Hands-up energy."
	},
	{
		id: "pinkpantheress-just-for-me",
		title: "Just for Me",
		artist: "PinkPantheress",
		year: 2021,
		era: "20s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "UKG revival. 170 hardcore / happy."
	},
	{
		id: "pinkpantheress-pain",
		title: "Pain",
		artist: "PinkPantheress",
		year: 2021,
		era: "20s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "Breakbeat vocal. Chop the last word."
	},
	{
		id: "pinkpantheress-break-it-off",
		title: "Break It Off",
		artist: "PinkPantheress",
		year: 2021,
		era: "20s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "Jungle-adjacent. 170."
	},
	{
		id: "pinkpantheress-boys-a-liar",
		title: "Boy's a liar",
		artist: "PinkPantheress",
		year: 2022,
		era: "20s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Dry, small vocal. Don't overproduce."
	},
	{
		id: "drake-passionfruit",
		title: "Passionfruit",
		artist: "Drake",
		year: 2017,
		era: "10s",
		niche: true,
		from: "rnb",
		chop: "sung",
		why: "Already pitched. Study, don't lift."
	},
	{
		id: "drake-one-dance",
		title: "One Dance",
		artist: "Drake",
		year: 2016,
		era: "10s",
		niche: true,
		from: "dancehall",
		chop: "hook",
		why: "Dancehall cadence. Offbeat bass."
	},
	{
		id: "100-gecs-money-machine",
		title: "money machine",
		artist: "100 gecs",
		year: 2019,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "yell",
		why: "Yell + pitch. Happy / extra-raw."
	},
	{
		id: "100-gecs-stupid-horse",
		title: "stupid horse",
		artist: "100 gecs",
		year: 2019,
		era: "10s",
		niche: true,
		from: "hyperpop",
		chop: "yell",
		why: "Same. One bar."
	},
	{
		id: "shygirl-tasty",
		title: "TASTY",
		artist: "Shygirl",
		year: 2020,
		era: "20s",
		niche: true,
		from: "club",
		chop: "spoken-sung",
		why: "Club spoken. Extra-raw."
	},
	{
		id: "shygirl-cleo",
		title: "Cleo",
		artist: "Shygirl",
		year: 2020,
		era: "20s",
		niche: true,
		from: "club",
		chop: "hook",
		why: "Hook as bassline."
	},
	{
		id: "death-grips-ive-seen-footage",
		title: "I've Seen Footage",
		artist: "Death Grips",
		year: 2012,
		era: "10s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Rhythm rap. Extra-raw percussion."
	},
	{
		id: "death-grips-get-got",
		title: "Get Got",
		artist: "Death Grips",
		year: 2012,
		era: "10s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Same."
	},
	{
		id: "health-die-slow",
		title: "DIE SLOW",
		artist: "HEALTH",
		year: 2009,
		era: "00s",
		niche: true,
		from: "noise rock",
		chop: "sung",
		why: "Noise-pop vocal. Extra-raw."
	},
	{
		id: "health-new-coke",
		title: "NEW COKE",
		artist: "HEALTH",
		year: 2015,
		era: "10s",
		niche: true,
		from: "noise rock",
		chop: "shout",
		why: "Shout. Extra-raw."
	},
	{
		id: "fever-ray-if-i-had-a-heart",
		title: "If I Had a Heart",
		artist: "Fever Ray",
		year: 2009,
		era: "00s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Dark pad vocal. Break."
	},
	{
		id: "crystal-castles-ft-robert-smith-not-in-love",
		title: "Not in Love",
		artist: "Crystal Castles ft. Robert Smith",
		year: 2010,
		era: "10s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Robert Smith. Dark euphoric."
	},
	{
		id: "crystal-castles-vanished",
		title: "Vanished",
		artist: "Crystal Castles",
		year: 2008,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "pitched",
		why: "Pitched Alice. Extra-raw / terror."
	},
	{
		id: "crystal-castles-crimewave",
		title: "Crimewave",
		artist: "Crystal Castles",
		year: 2007,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "pitched",
		why: "Same pile."
	},
	{
		id: "troye-sivan-rush",
		title: "Rush",
		artist: "Troye Sivan",
		year: 2023,
		era: "20s",
		niche: true,
		from: "dance pop",
		chop: "sung",
		why: "Club vocal. Euphoric."
	},
	{
		id: "troye-sivan-got-me-started",
		title: "Got Me Started",
		artist: "Troye Sivan",
		year: 2023,
		era: "20s",
		niche: true,
		from: "dance pop",
		chop: "hook",
		why: "Babyjane idea. Find a cleared source."
	},
	{
		id: "chappell-roan-hot-to-go",
		title: "HOT TO GO!",
		artist: "Chappell Roan",
		year: 2023,
		era: "20s",
		niche: true,
		from: "pop",
		chop: "chant",
		why: "Spell-chant. Crowd vox."
	},
	{
		id: "chappell-roan-super-graphic-ultra-modern-girl",
		title: "Super Graphic Ultra Modern Girl",
		artist: "Chappell Roan",
		year: 2023,
		era: "20s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Camp hook. Happy."
	},
	{
		id: "billie-eilish-chihiro",
		title: "CHIHIRO",
		artist: "Billie Eilish",
		year: 2024,
		era: "20s",
		niche: true,
		from: "alt pop",
		chop: "sung",
		why: "Breathy. Dark break."
	},
	{
		id: "billie-eilish-lunch",
		title: "LUNCH",
		artist: "Billie Eilish",
		year: 2024,
		era: "20s",
		niche: true,
		from: "alt pop",
		chop: "hook",
		why: "Rhythm hook. Extra-raw."
	},
	{
		id: "billie-eilish-bury-a-friend",
		title: "bury a friend",
		artist: "Billie Eilish",
		year: 2019,
		era: "10s",
		niche: true,
		from: "alt pop",
		chop: "whisper",
		why: "Whisper. Extra-raw atmosphere."
	},
	{
		id: "billie-eilish-bad-guy",
		title: "bad guy",
		artist: "Billie Eilish",
		year: 2019,
		era: "10s",
		niche: false,
		from: "alt pop",
		chop: "hook",
		why: "Too known. Bass + one syllable."
	},
	{
		id: "overmono-so-u-kno",
		title: "So U Kno",
		artist: "Overmono",
		year: 2021,
		era: "20s",
		niche: true,
		from: "garage",
		chop: "vocal chop",
		why: "UKG chop already. Match swing at 150/170."
	},
	{
		id: "overmono-stayinit",
		title: "Stayinit",
		artist: "Overmono",
		year: 2024,
		era: "20s",
		niche: true,
		from: "garage",
		chop: "sung",
		why: "Club vocal. 170."
	},
	{
		id: "skrillex-fred-again-and-flowdan-rumble",
		title: "Rumble",
		artist: "Skrillex, Fred again.. & Flowdan",
		year: 2023,
		era: "20s",
		niche: true,
		from: "bass",
		chop: "mc",
		why: "Flowdan MC. Extra-raw / uptempo."
	},
	{
		id: "skrillex-and-diplo-ft-justin-bieber-where-are-now",
		title: "Where Are Ü Now",
		artist: "Skrillex & Diplo ft. Justin Bieber",
		year: 2015,
		era: "10s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. Vocal FX study."
	},
	{
		id: "skrillex-ft-sirah-bangarang",
		title: "Bangarang",
		artist: "Skrillex ft. Sirah",
		year: 2011,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "shout",
		why: "Sirah shout. Extra-raw."
	},
	{
		id: "skrillex-ft-sirah-kyoto",
		title: "Kyoto",
		artist: "Skrillex ft. Sirah",
		year: 2011,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "rap",
		why: "Same."
	},
	{
		id: "skrillex-scary-monsters-and-nice-sprites",
		title: "Scary Monsters and Nice Sprites",
		artist: "Skrillex",
		year: 2010,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "vocal chop",
		why: "The 'ow' chop. Extra-raw percussion."
	},
	{
		id: "deadmau5-and-kaskade-i-remember",
		title: "I Remember",
		artist: "deadmau5 & Kaskade",
		year: 2008,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Vocal trance. Euphoric."
	},
	{
		id: "kaskade-and-deadmau5-move-for-me",
		title: "Move for Me",
		artist: "Kaskade & deadmau5",
		year: 2008,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "porter-robinson-language",
		title: "Language",
		artist: "Porter Robinson",
		year: 2012,
		era: "10s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Festival vocal. Euphoric."
	},
	{
		id: "porter-robinson-goodbye-to-a-world",
		title: "Goodbye to a World",
		artist: "Porter Robinson",
		year: 2014,
		era: "10s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "TTS-ish. Computer-vox."
	},
	{
		id: "porter-robinson-and-madeon-shelter",
		title: "Shelter",
		artist: "Porter Robinson & Madeon",
		year: 2016,
		era: "10s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "zedd-maren-morris-grey-the-middle",
		title: "The Middle",
		artist: "Zedd, Maren Morris, Grey",
		year: 2017,
		era: "10s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. Vowel."
	},
	{
		id: "zedd-ft-foxes-clarity",
		title: "Clarity",
		artist: "Zedd ft. Foxes",
		year: 2012,
		era: "10s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Festival vocal. Euphoric."
	},
	{
		id: "zedd-ft-matthew-koma-spectrum",
		title: "Spectrum",
		artist: "Zedd ft. Matthew Koma",
		year: 2012,
		era: "10s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Same."
	},
	{
		id: "disclosure-ft-sam-smith-latch",
		title: "Latch",
		artist: "Disclosure ft. Sam Smith",
		year: 2012,
		era: "10s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "UK house vocal. Pitch it."
	},
	{
		id: "disclosure-ft-alunageorge-white-noise",
		title: "White Noise",
		artist: "Disclosure ft. AlunaGeorge",
		year: 2013,
		era: "10s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Club hook."
	},
	{
		id: "disclosure-ft-eliza-doolittle-you-and-me",
		title: "You & Me",
		artist: "Disclosure ft. Eliza Doolittle",
		year: 2013,
		era: "10s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Flume remix is the chop bible — make your own."
	},
	{
		id: "lorde-tennis-court",
		title: "Tennis Court",
		artist: "Lorde",
		year: 2013,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Dry. Break."
	},
	{
		id: "lorde-ribs",
		title: "Ribs",
		artist: "Lorde",
		year: 2013,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Intimate. Break only."
	},
	{
		id: "lorde-green-light",
		title: "Green Light",
		artist: "Lorde",
		year: 2017,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Disco-pop. Happy."
	},
	{
		id: "flume-ft-kai-never-be-like-you",
		title: "Never Be Like You",
		artist: "Flume ft. kai",
		year: 2016,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "sung",
		why: "Future-bass vocal. Euphoric."
	},
	{
		id: "flume-ft-tove-lo-say-it",
		title: "Say It",
		artist: "Flume ft. Tove Lo",
		year: 2016,
		era: "10s",
		niche: true,
		from: "bass",
		chop: "sung",
		why: "Same."
	},
	{
		id: "sia-the-greatest",
		title: "The Greatest",
		artist: "Sia",
		year: 2016,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Festival hook. Euphoric."
	},
	{
		id: "sia-chandelier",
		title: "Chandelier",
		artist: "Sia",
		year: 2014,
		era: "10s",
		niche: false,
		from: "pop",
		chop: "sung",
		why: "Too known. One held note."
	},
	{
		id: "david-guetta-ft-sia-titanium",
		title: "Titanium",
		artist: "David Guetta ft. Sia",
		year: 2011,
		era: "10s",
		niche: false,
		from: "pop",
		chop: "sung",
		why: "Too known. Vowel in the break."
	},
	{
		id: "david-guetta-ft-sia-she-wolf-falling-to-pieces",
		title: "She Wolf (Falling to Pieces)",
		artist: "David Guetta ft. Sia",
		year: 2012,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Same voice. Different phrase."
	},
	{
		id: "sia-cheap-thrills",
		title: "Cheap Thrills",
		artist: "Sia",
		year: 2016,
		era: "10s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Too known. One bar."
	},
	{
		id: "sia-unstoppable",
		title: "Unstoppable",
		artist: "Sia",
		year: 2016,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Power vocal. Euphoric break."
	},
	{
		id: "sia-alive",
		title: "Alive",
		artist: "Sia",
		year: 2015,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Same."
	},
	{
		id: "sia-elastic-heart",
		title: "Elastic Heart",
		artist: "Sia",
		year: 2013,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "sia-fire-meets-gasoline",
		title: "Fire Meets Gasoline",
		artist: "Sia",
		year: 2014,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Darker Sia."
	},
	{
		id: "eurythmics-sweet-dreams-are-made-of-this",
		title: "Sweet Dreams (Are Made of This)",
		artist: "Eurythmics",
		year: 1983,
		era: "90s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "The Marilyn Manson cover is the hard-dance one — original vowel also chops."
	},
	{
		id: "depeche-mode-personal-jesus",
		title: "Personal Jesus",
		artist: "Depeche Mode",
		year: 1989,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Reach out. Industrial / extra-raw."
	},
	{
		id: "depeche-mode-enjoy-the-silence",
		title: "Enjoy the Silence",
		artist: "Depeche Mode",
		year: 1990,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Sung break."
	},
	{
		id: "depeche-mode-policy-of-truth",
		title: "Policy of Truth",
		artist: "Depeche Mode",
		year: 1990,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Same."
	},
	{
		id: "new-order-blue-monday",
		title: "Blue Monday",
		artist: "New Order",
		year: 1983,
		era: "90s",
		niche: false,
		from: "synth",
		chop: "sung",
		why: "Too known. Held notes."
	},
	{
		id: "new-order-bizarre-love-triangle",
		title: "Bizarre Love Triangle",
		artist: "New Order",
		year: 1986,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "new-order-temptation",
		title: "Temptation",
		artist: "New Order",
		year: 1982,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Sung. Euphoric contrast."
	},
	{
		id: "donna-summer-i-feel-love",
		title: "I Feel Love",
		artist: "Donna Summer",
		year: 1977,
		era: "90s",
		niche: false,
		from: "disco",
		chop: "sung",
		why: "Moroder vocal. Computer-vox ancestor."
	},
	{
		id: "donna-summer-hot-stuff",
		title: "Hot Stuff",
		artist: "Donna Summer",
		year: 1979,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "hook",
		why: "Disco shout-hook."
	},
	{
		id: "donna-summer-love-to-love-you-baby",
		title: "Love to Love You Baby",
		artist: "Donna Summer",
		year: 1975,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "adlib",
		why: "Breath adlibs. Texture."
	},
	{
		id: "the-human-league-dont-you-want-me",
		title: "Don't You Want Me",
		artist: "The Human League",
		year: 1981,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Call-and-response. Extra-raw irony or happy."
	},
	{
		id: "soft-cell-tainted-love",
		title: "Tainted Love",
		artist: "Soft Cell",
		year: 1981,
		era: "90s",
		niche: false,
		from: "synth",
		chop: "hook",
		why: "Too known. One line."
	},
	{
		id: "the-beloved-i-love-you",
		title: "I Love You",
		artist: "The Beloved",
		year: 1993,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "90s house. Short hook, pitched."
	},
	{
		id: "the-beloved-sweet-harmony",
		title: "Sweet Harmony",
		artist: "The Beloved",
		year: 1992,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "underworld-pearls-girl",
		title: "Pearl's Girl",
		artist: "Underworld",
		year: 1996,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "spoken",
		why: "Spoken fragments. Extra-raw."
	},
	{
		id: "underworld-push-upstairs",
		title: "Push Upstairs",
		artist: "Underworld",
		year: 1999,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "sung",
		why: "Same voice."
	},
	{
		id: "edwin-hawkins-singers-oh-happy-day",
		title: "Oh Happy Day",
		artist: "Edwin Hawkins Singers",
		year: 1968,
		era: "90s",
		niche: true,
		from: "gospel",
		chop: "choir",
		why: "Gospel choir. Euphoric / frenchcore carnival. Find a cleared copy."
	},
	{
		id: "m83-midnight-city",
		title: "Midnight City",
		artist: "M83",
		year: 2011,
		era: "10s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Wordless hook. Euphoric."
	},
	{
		id: "m83-wait",
		title: "Wait",
		artist: "M83",
		year: 2011,
		era: "10s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Sung. Break."
	},
	{
		id: "dj-shadow-midnight-in-a-perfect-world",
		title: "Midnight in a Perfect World",
		artist: "DJ Shadow",
		year: 1996,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "vocal chop",
		why: "Already a vocal collage. Study the idea."
	},
	{
		id: "dj-shadow-building-steam-with-a-grain-of-salt",
		title: "Building Steam With a Grain of Salt",
		artist: "DJ Shadow",
		year: 1996,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "spoken",
		why: "Spoken sample collage."
	},
	{
		id: "leftfield-ft-john-lydon-open-up",
		title: "Open Up",
		artist: "Leftfield ft. John Lydon",
		year: 1993,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "shout",
		why: "Lydon shout. Extra-raw / industrial."
	},
	{
		id: "leftfield-release-the-pressure",
		title: "Release the Pressure",
		artist: "Leftfield",
		year: 1995,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "sung",
		why: "Reggae vocal. Offbeat."
	},
	{
		id: "leftfield-inspection-check-one",
		title: "Inspection (Check One)",
		artist: "Leftfield",
		year: 1995,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "mc",
		why: "MC. Extra-raw."
	},
	{
		id: "lily-allen-smile",
		title: "Smile",
		artist: "Lily Allen",
		year: 2006,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Skank-pop. Happy irony."
	},
	{
		id: "lily-allen-the-fear",
		title: "The Fear",
		artist: "Lily Allen",
		year: 2009,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same."
	},
	{
		id: "mgmt-kids",
		title: "Kids",
		artist: "MGMT",
		year: 2008,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "sung",
		why: "Too known. Vowel."
	},
	{
		id: "mgmt-electric-feel",
		title: "Electric Feel",
		artist: "MGMT",
		year: 2007,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "sung",
		why: "Falsetto. Happy / euphoric."
	},
	{
		id: "mgmt-time-to-pretend",
		title: "Time to Pretend",
		artist: "MGMT",
		year: 2008,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "foster-the-people-pumped-up-kicks",
		title: "Pumped Up Kicks",
		artist: "Foster the People",
		year: 2010,
		era: "10s",
		niche: false,
		from: "indie",
		chop: "hook",
		why: "Too known. Whistle + vowel."
	},
	{
		id: "franz-ferdinand-take-me-out",
		title: "Take Me Out",
		artist: "Franz Ferdinand",
		year: 2004,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "hook",
		why: "Angular hook. Extra-raw irony."
	},
	{
		id: "the-killers-mr-brightside",
		title: "Mr. Brightside",
		artist: "The Killers",
		year: 2004,
		era: "00s",
		niche: false,
		from: "indie",
		chop: "sung",
		why: "Too known. One line."
	},
	{
		id: "the-killers-somebody-told-me",
		title: "Somebody Told Me",
		artist: "The Killers",
		year: 2004,
		era: "00s",
		niche: true,
		from: "indie",
		chop: "hook",
		why: "Same."
	},
	{
		id: "the-white-stripes-fell-in-love-with-a-girl",
		title: "Fell in Love With a Girl",
		artist: "The White Stripes",
		year: 2001,
		era: "00s",
		niche: true,
		from: "rock",
		chop: "shout",
		why: "Short shout. Extra-raw."
	},
	{
		id: "rage-against-the-machine-killing-in-the-name",
		title: "Killing in the Name",
		artist: "Rage Against the Machine",
		year: 1992,
		era: "90s",
		niche: false,
		from: "rap metal",
		chop: "shout",
		why: "End shout only. Hardcore."
	},
	{
		id: "rage-against-the-machine-bulls-on-parade",
		title: "Bulls on Parade",
		artist: "Rage Against the Machine",
		year: 1996,
		era: "90s",
		niche: true,
		from: "rap metal",
		chop: "rap",
		why: "Scratch + rap cadence."
	},
	{
		id: "rage-against-the-machine-guerrilla-radio",
		title: "Guerrilla Radio",
		artist: "Rage Against the Machine",
		year: 1999,
		era: "90s",
		niche: true,
		from: "rap metal",
		chop: "rap",
		why: "Same."
	},
	{
		id: "beastie-boys-sabotage",
		title: "Sabotage",
		artist: "Beastie Boys",
		year: 1994,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "shout",
		why: "Shout intro. Extra-raw."
	},
	{
		id: "beastie-boys-intergalactic",
		title: "Intergalactic",
		artist: "Beastie Boys",
		year: 1998,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Robot hook. Computer-vox."
	},
	{
		id: "beastie-boys-so-whatcha-want",
		title: "So What'cha Want",
		artist: "Beastie Boys",
		year: 1992,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Fuzz rap. Extra-raw."
	},
	{
		id: "cypress-hill-insane-in-the-brain",
		title: "Insane in the Brain",
		artist: "Cypress Hill",
		year: 1993,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Shout-hook. Extra-raw."
	},
	{
		id: "house-of-pain-jump-around",
		title: "Jump Around",
		artist: "House of Pain",
		year: 1992,
		era: "90s",
		niche: false,
		from: "rap",
		chop: "shout",
		why: "Festival shout. Intro only."
	},
	{
		id: "public-enemy-bring-the-noise",
		title: "Bring the Noise",
		artist: "Public Enemy",
		year: 1987,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Siren + rap. Extra-raw."
	},
	{
		id: "public-enemy-fight-the-power",
		title: "Fight the Power",
		artist: "Public Enemy",
		year: 1989,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Same pile."
	},
	{
		id: "wu-tang-clan-wu-tang-clan-aint-nuthing-ta-f-wit",
		title: "Wu-Tang Clan Ain't Nuthing ta F' Wit",
		artist: "Wu-Tang Clan",
		year: 1993,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Cadence chops. Extra-raw."
	},
	{
		id: "wu-tang-clan-c-r-e-a-m",
		title: "C.R.E.A.M.",
		artist: "Wu-Tang Clan",
		year: 1993,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Hook vowels."
	},
	{
		id: "dr-dre-still-d-r-e",
		title: "Still D.R.E.",
		artist: "Dr. Dre",
		year: 1999,
		era: "90s",
		niche: false,
		from: "rap",
		chop: "rap",
		why: "Too known. Cadence only."
	},
	{
		id: "dr-dre-ft-snoop-dogg-the-next-episode",
		title: "The Next Episode",
		artist: "Dr. Dre ft. Snoop Dogg",
		year: 1999,
		era: "90s",
		niche: false,
		from: "rap",
		chop: "hook",
		why: "Too known. Smoke shout only."
	},
	{
		id: "dr-dre-ft-eminem-forgot-about-dre",
		title: "Forgot About Dre",
		artist: "Dr. Dre ft. Eminem",
		year: 1999,
		era: "90s",
		niche: true,
		from: "rap",
		chop: "rap",
		why: "Eminem cadence. Extra-raw."
	},
	{
		id: "eminem-lose-yourself",
		title: "Lose Yourself",
		artist: "Eminem",
		year: 2002,
		era: "00s",
		niche: false,
		from: "rap",
		chop: "rap",
		why: "Too known. Cadence study."
	},
	{
		id: "eminem-without-me",
		title: "Without Me",
		artist: "Eminem",
		year: 2002,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Novelty hook. One bar."
	},
	{
		id: "eminem-the-real-slim-shady",
		title: "The Real Slim Shady",
		artist: "Eminem",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Same."
	},
	{
		id: "lil-jon-and-the-east-side-boyz-get-low",
		title: "Get Low",
		artist: "Lil Jon & the East Side Boyz",
		year: 2002,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "shout",
		why: "Crunk shout. Extra-raw / uptempo."
	},
	{
		id: "dj-snake-and-lil-jon-turn-down-for-what",
		title: "Turn Down for What",
		artist: "DJ Snake & Lil Jon",
		year: 2013,
		era: "10s",
		niche: false,
		from: "bass",
		chop: "shout",
		why: "Too known. Shout only."
	},
	{
		id: "terror-squad-lean-back",
		title: "Lean Back",
		artist: "Terror Squad",
		year: 2004,
		era: "00s",
		niche: true,
		from: "rap",
		chop: "hook",
		why: "Club rap. Extra-raw."
	},
	{
		id: "50-cent-in-da-club",
		title: "In Da Club",
		artist: "50 Cent",
		year: 2003,
		era: "00s",
		niche: false,
		from: "rap",
		chop: "hook",
		why: "Too known. One bar."
	},
	{
		id: "daddy-yankee-gasolina",
		title: "Gasolina",
		artist: "Daddy Yankee",
		year: 2004,
		era: "00s",
		niche: true,
		from: "reggaeton",
		chop: "shout",
		why: "Reggaeton shout. Extra-raw / frenchcore."
	},
	{
		id: "don-omar-danza-kuduro",
		title: "Danza Kuduro",
		artist: "Don Omar",
		year: 2010,
		era: "10s",
		niche: true,
		from: "reggaeton",
		chop: "hook",
		why: "Carnival. Frenchcore / happy."
	},
	{
		id: "michel-tel-ai-se-eu-te-pego",
		title: "Ai Se Eu Te Pego",
		artist: "Michel Teló",
		year: 2011,
		era: "10s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Novelty. Frenchcore carnival."
	},
	{
		id: "los-del-r-o-macarena",
		title: "Macarena",
		artist: "Los Del Río",
		year: 1993,
		era: "90s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Novelty. One bar, frenchcore joke."
	},
	{
		id: "rednex-cotton-eye-joe",
		title: "Cotton Eye Joe",
		artist: "Rednex",
		year: 1994,
		era: "90s",
		niche: true,
		from: "eurodance",
		chop: "hook",
		why: "Novelty. Happy / frenchcore."
	},
	{
		id: "scatman-john-scatmans-world",
		title: "Scatman's World",
		artist: "Scatman John",
		year: 1995,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "scat",
		why: "Same as Scatman. Percussion."
	},
	{
		id: "groove-armada-i-see-you-baby",
		title: "I See You Baby",
		artist: "Groove Armada",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Funky house vocal."
	},
	{
		id: "groove-armada-superstylin",
		title: "Superstylin'",
		artist: "Groove Armada",
		year: 2001,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same."
	},
	{
		id: "shakedown-at-night",
		title: "At Night",
		artist: "Shakedown",
		year: 2002,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "House vocal. Pitch it."
	},
	{
		id: "modjo-lady-hear-me-tonight",
		title: "Lady (Hear Me Tonight)",
		artist: "Modjo",
		year: 2e3,
		era: "00s",
		niche: false,
		from: "house",
		chop: "hook",
		why: "Disco-house. Happy / euphoric."
	},
	{
		id: "spiller-ft-sophie-ellis-bextor-groovejet-if-this-aint-love",
		title: "Groovejet (If This Ain't Love)",
		artist: "Spiller ft. Sophie Ellis-Bextor",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Disco vocal."
	},
	{
		id: "sophie-ellis-bextor-murder-on-the-dancefloor",
		title: "Murder on the Dancefloor",
		artist: "Sophie Ellis-Bextor",
		year: 2001,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Disco-pop. Happy."
	},
	{
		id: "madison-avenue-dont-call-me-baby",
		title: "Don't Call Me Baby",
		artist: "Madison Avenue",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Aussie house vocal."
	},
	{
		id: "inxs-need-you-tonight",
		title: "Need You Tonight",
		artist: "INXS",
		year: 1987,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "hook",
		why: "Funk-rock hook. Extra-raw irony."
	},
	{
		id: "inxs-never-tear-us-apart",
		title: "Never Tear Us Apart",
		artist: "INXS",
		year: 1987,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Sung break."
	},
	{
		id: "bj-rk-enjoy",
		title: "Enjoy",
		artist: "Björk",
		year: 1995,
		era: "90s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Already have Hyperballad etc."
	},
	{
		id: "bj-rk-its-oh-so-quiet",
		title: "It's Oh So Quiet",
		artist: "Björk",
		year: 1995,
		era: "90s",
		niche: true,
		from: "art pop",
		chop: "shout",
		why: "Quiet/shout dynamics. Extra-raw joke."
	},
	{
		id: "bj-rk-all-is-full-of-love",
		title: "All Is Full of Love",
		artist: "Björk",
		year: 1997,
		era: "90s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Vocoder. Computer-vox."
	},
	{
		id: "bj-rk-human-behaviour",
		title: "Human Behaviour",
		artist: "Björk",
		year: 1993,
		era: "90s",
		niche: true,
		from: "art pop",
		chop: "sung",
		why: "Same voice."
	},
	{
		id: "ladytron-playgirl",
		title: "Playgirl",
		artist: "Ladytron",
		year: 2001,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Cold vocal. Extra-raw / euphoric."
	},
	{
		id: "ladytron-seventeen",
		title: "Seventeen",
		artist: "Ladytron",
		year: 2002,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Same."
	},
	{
		id: "ladytron-destroy-everything-you-touch",
		title: "Destroy Everything You Touch",
		artist: "Ladytron",
		year: 2005,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Darker."
	},
	{
		id: "bananarama-cruel-summer",
		title: "Cruel Summer",
		artist: "Bananarama",
		year: 1983,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "80s hook. Happy / euphoric."
	},
	{
		id: "bananarama-venus",
		title: "Venus",
		artist: "Bananarama",
		year: 1986,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Shocking Blue via Bananarama."
	},
	{
		id: "dead-or-alive-you-spin-me-round-like-a-record",
		title: "You Spin Me Round (Like a Record)",
		artist: "Dead or Alive",
		year: 1984,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Hi-NRG hook. Happy / hands-up."
	},
	{
		id: "frankie-goes-to-hollywood-relax",
		title: "Relax",
		artist: "Frankie Goes to Hollywood",
		year: 1983,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Hi-NRG shout-hook."
	},
	{
		id: "frankie-goes-to-hollywood-two-tribes",
		title: "Two Tribes",
		artist: "Frankie Goes to Hollywood",
		year: 1984,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "shout",
		why: "Same pile."
	},
	{
		id: "bronski-beat-smalltown-boy",
		title: "Smalltown Boy",
		artist: "Bronski Beat",
		year: 1984,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Sung. Euphoric / raw contrast."
	},
	{
		id: "gloria-jones-soft-cell-tainted-love",
		title: "Tainted Love",
		artist: "Gloria Jones / Soft Cell",
		year: 1964,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "hook",
		why: "Gloria Jones original is the northern soul chop."
	},
	{
		id: "machine-there-but-for-the-grace-of-god-go-i",
		title: "There But For the Grace of God Go I",
		artist: "Machine",
		year: 1979,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "sung",
		why: "Disco-gospel. Euphoric."
	},
	{
		id: "cheryl-lynn-got-to-be-real",
		title: "Got to Be Real",
		artist: "Cheryl Lynn",
		year: 1978,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "sung",
		why: "Disco vocal. Happy."
	},
	{
		id: "marvin-gaye-and-tammi-terrell-aint-no-mountain-high-enough",
		title: "Ain't No Mountain High Enough",
		artist: "Marvin Gaye & Tammi Terrell",
		year: 1967,
		era: "90s",
		niche: false,
		from: "soul",
		chop: "sung",
		why: "Too known. Choir / held notes."
	},
	{
		id: "aretha-franklin-respect",
		title: "Respect",
		artist: "Aretha Franklin",
		year: 1967,
		era: "90s",
		niche: false,
		from: "soul",
		chop: "shout",
		why: "Too known. R-E-S-P-E-C-T chops."
	},
	{
		id: "aretha-franklin-think",
		title: "Think",
		artist: "Aretha Franklin",
		year: 1968,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "shout",
		why: "Freedom shout. Extra-raw / euphoric."
	},
	{
		id: "aretha-franklin-i-say-a-little-prayer",
		title: "I Say a Little Prayer",
		artist: "Aretha Franklin",
		year: 1968,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "Sung break."
	},
	{
		id: "rick-astley-never-gonna-give-you-up",
		title: "Never Gonna Give You Up",
		artist: "Rick Astley",
		year: 1987,
		era: "90s",
		niche: false,
		from: "pop",
		chop: "hook",
		why: "Novelty. One bar or don't."
	},
	{
		id: "rick-astley-together-forever",
		title: "Together Forever",
		artist: "Rick Astley",
		year: 1988,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same voice."
	},
	{
		id: "a-ha-take-on-me",
		title: "Take on Me",
		artist: "a-ha",
		year: 1985,
		era: "90s",
		niche: false,
		from: "pop",
		chop: "sung",
		why: "Too known. Falsetto vowel."
	},
	{
		id: "a-ha-the-sun-always-shines-on-t-v",
		title: "The Sun Always Shines on T.V.",
		artist: "a-ha",
		year: 1985,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Darker a-ha."
	},
	{
		id: "talk-talk-its-my-life",
		title: "It's My Life",
		artist: "Talk Talk",
		year: 1984,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Not Dr. Alban. Synth hook."
	},
	{
		id: "talk-talk-lifes-what-you-make-it",
		title: "Life's What You Make It",
		artist: "Talk Talk",
		year: 1986,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Same."
	},
	{
		id: "depeche-mode-just-cant-get-enough",
		title: "Just Can't Get Enough",
		artist: "Depeche Mode",
		year: 1981,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Early DM. Happy."
	},
	{
		id: "depeche-mode-people-are-people",
		title: "People Are People",
		artist: "Depeche Mode",
		year: 1984,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Same."
	},
	{
		id: "depeche-mode-master-and-servant",
		title: "Master and Servant",
		artist: "Depeche Mode",
		year: 1984,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Industrial-pop. Extra-raw."
	},
	{
		id: "depeche-mode-stripped",
		title: "Stripped",
		artist: "Depeche Mode",
		year: 1986,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Dark. Break."
	},
	{
		id: "depeche-mode-shake-the-disease",
		title: "Shake the Disease",
		artist: "Depeche Mode",
		year: 1985,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Same."
	},
	{
		id: "depeche-mode-behind-the-wheel",
		title: "Behind the Wheel",
		artist: "Depeche Mode",
		year: 1987,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "depeche-mode-never-let-me-down-again",
		title: "Never Let Me Down Again",
		artist: "Depeche Mode",
		year: 1987,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Sung. Euphoric contrast."
	},
	{
		id: "depeche-mode-world-in-my-eyes",
		title: "World in My Eyes",
		artist: "Depeche Mode",
		year: 1990,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Same."
	},
	{
		id: "depeche-mode-i-feel-you",
		title: "I Feel You",
		artist: "Depeche Mode",
		year: 1993,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Grittier."
	},
	{
		id: "depeche-mode-its-no-good",
		title: "It's No Good",
		artist: "Depeche Mode",
		year: 1997,
		era: "90s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Later DM hook."
	},
	{
		id: "depeche-mode-dream-on",
		title: "Dream On",
		artist: "Depeche Mode",
		year: 2001,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "2000s DM."
	},
	{
		id: "depeche-mode-precious",
		title: "Precious",
		artist: "Depeche Mode",
		year: 2005,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "sung",
		why: "Same."
	},
	{
		id: "depeche-mode-wrong",
		title: "Wrong",
		artist: "Depeche Mode",
		year: 2009,
		era: "00s",
		niche: true,
		from: "synth",
		chop: "hook",
		why: "Later."
	},
	{
		id: "basement-jaxx-wheres-your-head-at",
		title: "Where's Your Head At",
		artist: "Basement Jaxx",
		year: 2001,
		era: "00s",
		niche: true,
		from: "house",
		chop: "shout",
		why: "Shout-house. Extra-raw / happy."
	},
	{
		id: "basement-jaxx-rendez-vu",
		title: "Rendez-Vu",
		artist: "Basement Jaxx",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "House vocal."
	},
	{
		id: "basement-jaxx-red-alert",
		title: "Red Alert",
		artist: "Basement Jaxx",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same."
	},
	{
		id: "basement-jaxx-do-your-thing",
		title: "Do Your Thing",
		artist: "Basement Jaxx",
		year: 2001,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "basement-jaxx-bingo-bango",
		title: "Bingo Bango",
		artist: "Basement Jaxx",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "chant",
		why: "Carnival chant. Frenchcore."
	},
	{
		id: "basement-jaxx-romeo",
		title: "Romeo",
		artist: "Basement Jaxx",
		year: 2001,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "basement-jaxx-ft-lisa-kekaula-good-luck",
		title: "Good Luck",
		artist: "Basement Jaxx ft. Lisa Kekaula",
		year: 2003,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Soul shout. Extra-raw / euphoric."
	},
	{
		id: "basement-jaxx-ft-siouxsie-cish-cash",
		title: "Cish Cash",
		artist: "Basement Jaxx ft. Siouxsie",
		year: 2003,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Siouxsie. Dark."
	},
	{
		id: "basement-jaxx-hush-boy",
		title: "Hush Boy",
		artist: "Basement Jaxx",
		year: 2006,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Later Jaxx."
	},
	{
		id: "basement-jaxx-raindrops",
		title: "Raindrops",
		artist: "Basement Jaxx",
		year: 2009,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Same."
	},
	{
		id: "josh-wink-higher-state-of-consciousness",
		title: "Higher State of Consciousness",
		artist: "Josh Wink",
		year: 1995,
		era: "90s",
		niche: true,
		from: "acid",
		chop: "adlib",
		why: "Acid. Tiny vocal bits / FX."
	},
	{
		id: "the-future-sound-of-london-papua-new-guinea",
		title: "Papua New Guinea",
		artist: "The Future Sound of London",
		year: 1991,
		era: "90s",
		niche: true,
		from: "techno",
		chop: "vocal chop",
		why: "Already a vocal collage. Atmosphere."
	},
	{
		id: "the-orb-little-fluffy-clouds",
		title: "Little Fluffy Clouds",
		artist: "The Orb",
		year: 1990,
		era: "90s",
		niche: true,
		from: "ambient",
		chop: "spoken",
		why: "Spoken sample. Break atmosphere."
	},
	{
		id: "stevie-wonder-superstition",
		title: "Superstition",
		artist: "Stevie Wonder",
		year: 1972,
		era: "90s",
		niche: false,
		from: "soul",
		chop: "hook",
		why: "Too known. Clav + one syllable."
	},
	{
		id: "stevie-wonder-i-wish",
		title: "I Wish",
		artist: "Stevie Wonder",
		year: 1976,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "hook",
		why: "Soul hook. Happy."
	},
	{
		id: "stevie-wonder-living-for-the-city",
		title: "Living for the City",
		artist: "Stevie Wonder",
		year: 1973,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "Spoken + sung. Break."
	},
	{
		id: "sister-sledge-hes-the-greatest-dancer",
		title: "He's the Greatest Dancer",
		artist: "Sister Sledge",
		year: 1979,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "sung",
		why: "Chic disco vocal."
	},
	{
		id: "sister-sledge-we-are-family",
		title: "We Are Family",
		artist: "Sister Sledge",
		year: 1979,
		era: "90s",
		niche: false,
		from: "disco",
		chop: "hook",
		why: "Too known. Chant."
	},
	{
		id: "chic-le-freak",
		title: "Le Freak",
		artist: "Chic",
		year: 1978,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "hook",
		why: "Freak out. Disco chop."
	},
	{
		id: "chic-good-times",
		title: "Good Times",
		artist: "Chic",
		year: 1979,
		era: "90s",
		niche: false,
		from: "disco",
		chop: "hook",
		why: "Too known. Bass + one line."
	},
	{
		id: "chic-i-want-your-love",
		title: "I Want Your Love",
		artist: "Chic",
		year: 1978,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "sung",
		why: "Disco vocal. Happy."
	},
	{
		id: "sister-sledge-lost-in-music",
		title: "Lost in Music",
		artist: "Sister Sledge",
		year: 1979,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "sung",
		why: "Same pile."
	},
	{
		id: "john-travolta-and-olivia-newton-john-youre-the-one-that-i-want",
		title: "You're the One That I Want",
		artist: "John Travolta & Olivia Newton-John",
		year: 1978,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Grease. Happy / frenchcore carnival."
	},
	{
		id: "grease-summer-nights",
		title: "Summer Nights",
		artist: "Grease",
		year: 1978,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "chant",
		why: "Call-and-response. Carnival."
	},
	{
		id: "olivia-newton-john-hopelessly-devoted-to-you",
		title: "Hopelessly Devoted to You",
		artist: "Olivia Newton-John",
		year: 1978,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Sung break. Party Animals sampled the other one."
	},
	{
		id: "olivia-newton-john-and-elo-xanadu",
		title: "Xanadu",
		artist: "Olivia Newton-John & ELO",
		year: 1980,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Disco-pop. Happy."
	},
	{
		id: "olivia-newton-john-physical",
		title: "Physical",
		artist: "Olivia Newton-John",
		year: 1981,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "80s hook. Happy."
	},
	{
		id: "olivia-newton-john-magic",
		title: "Magic",
		artist: "Olivia Newton-John",
		year: 1980,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "john-farnham-youre-the-voice",
		title: "You're the Voice",
		artist: "John Farnham",
		year: 1986,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Power vocal. Euphoric / anthem break."
	},
	{
		id: "men-at-work-down-under",
		title: "Down Under",
		artist: "Men at Work",
		year: 1981,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Novelty-ish. One bar."
	},
	{
		id: "gwen-stefani-what-you-waiting-for",
		title: "What You Waiting For?",
		artist: "Gwen Stefani",
		year: 2004,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Staccato pop. Extra-raw irony."
	},
	{
		id: "gwen-stefani-hollaback-girl",
		title: "Hollaback Girl",
		artist: "Gwen Stefani",
		year: 2005,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "chant",
		why: "This shit is bananas. Chant."
	},
	{
		id: "gwen-stefani-rich-girl",
		title: "Rich Girl",
		artist: "Gwen Stefani",
		year: 2004,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same."
	},
	{
		id: "gwen-stefani-the-sweet-escape",
		title: "The Sweet Escape",
		artist: "Gwen Stefani",
		year: 2006,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same voice."
	},
	{
		id: "kelis-milkshake",
		title: "Milkshake",
		artist: "Kelis",
		year: 2003,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Neptunes. Rhythm vocal."
	},
	{
		id: "kelis-caught-out-there",
		title: "Caught Out There",
		artist: "Kelis",
		year: 1999,
		era: "90s",
		niche: true,
		from: "rnb",
		chop: "shout",
		why: "I hate you so much right now. Shout."
	},
	{
		id: "kelis-ft-andr-3000-millionaire",
		title: "Millionaire",
		artist: "Kelis ft. André 3000",
		year: 2004,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Same."
	},
	{
		id: "kelis-trick-me",
		title: "Trick Me",
		artist: "Kelis",
		year: 2004,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "kelis-bossy",
		title: "Bossy",
		artist: "Kelis",
		year: 2006,
		era: "00s",
		niche: true,
		from: "rnb",
		chop: "hook",
		why: "Later Kelis."
	},
	{
		id: "kelis-acapella",
		title: "Acapella",
		artist: "Kelis",
		year: 2010,
		era: "10s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "David Guetta-adjacent. House vocal."
	},
	{
		id: "mylo-drop-the-pressure",
		title: "Drop the Pressure",
		artist: "Mylo",
		year: 2004,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "vocal chop",
		why: "Already a vocal-FX track. Study."
	},
	{
		id: "mylo-vs-miami-sound-machine-doctor-pressure",
		title: "Doctor Pressure",
		artist: "Mylo vs Miami Sound Machine",
		year: 2005,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "hook",
		why: "Dr. Beat via Mylo. Chop."
	},
	{
		id: "eric-prydz-call-on-me",
		title: "Call on Me",
		artist: "Eric Prydz",
		year: 2004,
		era: "00s",
		niche: false,
		from: "house",
		chop: "sung",
		why: "Steve Winwood via Prydz. Too known. Short."
	},
	{
		id: "eric-prydz-vs-pink-floyd-proper-education",
		title: "Proper Education",
		artist: "Eric Prydz vs Pink Floyd",
		year: 2007,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Pink Floyd vocal via Prydz. Find a cleared source."
	},
	{
		id: "steve-angello-and-laidback-luke-vs-robin-s-show-me-love",
		title: "Show Me Love",
		artist: "Steve Angello & Laidback Luke vs Robin S",
		year: 2008,
		era: "00s",
		niche: true,
		from: "house",
		chop: "hook",
		why: "Robin S again via progressive. Same vowel."
	},
	{
		id: "benny-benassi-satisfaction",
		title: "Satisfaction",
		artist: "Benny Benassi",
		year: 2002,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "vocal chop",
		why: "Robot vocal. Computer-vox / extra-raw."
	},
	{
		id: "benny-benassi-able-to-love",
		title: "Able to Love",
		artist: "Benny Benassi",
		year: 2002,
		era: "00s",
		niche: true,
		from: "electro",
		chop: "vocal chop",
		why: "Same pile."
	},
	{
		id: "benny-benassi-ft-gary-go-cinema",
		title: "Cinema",
		artist: "Benny Benassi ft. Gary Go",
		year: 2011,
		era: "10s",
		niche: true,
		from: "electro",
		chop: "sung",
		why: "Skrillex remix is the chop one. Sung break."
	},
	{
		id: "layo-and-bushwacka-all-i-need",
		title: "All I Need",
		artist: "Layo & Bushwacka!",
		year: 2002,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "House vocal. Dark."
	},
	{
		id: "layo-and-bushwacka-love-story",
		title: "Love Story",
		artist: "Layo & Bushwacka!",
		year: 2003,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Same."
	},
	{
		id: "kings-of-tomorrow-finally",
		title: "Finally",
		artist: "Kings of Tomorrow",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Julie McKnight. House vocal bible."
	},
	{
		id: "soulsearcher-cant-get-enough",
		title: "Can't Get Enough",
		artist: "Soulsearcher",
		year: 1999,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Gospel-house."
	},
	{
		id: "danny-tenaglia-ft-celeda-music-is-the-answer",
		title: "Music Is the Answer",
		artist: "Danny Tenaglia ft. Celeda",
		year: 1998,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Club vocal."
	},
	{
		id: "kosheen-hide-u",
		title: "Hide U",
		artist: "Kosheen",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Breakbeat / DNB vocal. 170."
	},
	{
		id: "kosheen-catch",
		title: "Catch",
		artist: "Kosheen",
		year: 2001,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Same voice."
	},
	{
		id: "kosheen-hungry",
		title: "Hungry",
		artist: "Kosheen",
		year: 2002,
		era: "00s",
		niche: true,
		from: "dnb",
		chop: "sung",
		why: "Same."
	},
	{
		id: "azzido-da-bass-dooms-night",
		title: "Dooms Night",
		artist: "Azzido Da Bass",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "house",
		chop: "vocal chop",
		why: "Timo Maas mix. Vocal FX."
	},
	{
		id: "jakatta-american-dream",
		title: "American Dream",
		artist: "Jakatta",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "House vocal. Euphoric."
	},
	{
		id: "jakatta-so-lonely",
		title: "So Lonely",
		artist: "Jakatta",
		year: 2001,
		era: "00s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Same."
	},
	{
		id: "iio-rapture-tastes-so-sweet",
		title: "Rapture (Tastes So Sweet)",
		artist: "iiO",
		year: 2001,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Vocal trance. Euphoric."
	},
	{
		id: "jamiroquai-little-l",
		title: "Little L",
		artist: "Jamiroquai",
		year: 2001,
		era: "00s",
		niche: true,
		from: "funk",
		chop: "hook",
		why: "Funk hook. Happy."
	},
	{
		id: "jamiroquai-virtual-insanity",
		title: "Virtual Insanity",
		artist: "Jamiroquai",
		year: 1996,
		era: "90s",
		niche: true,
		from: "funk",
		chop: "sung",
		why: "Sung. Break."
	},
	{
		id: "jamiroquai-cosmic-girl",
		title: "Cosmic Girl",
		artist: "Jamiroquai",
		year: 1996,
		era: "90s",
		niche: true,
		from: "funk",
		chop: "hook",
		why: "Same."
	},
	{
		id: "jamiroquai-canned-heat",
		title: "Canned Heat",
		artist: "Jamiroquai",
		year: 1999,
		era: "90s",
		niche: true,
		from: "funk",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "jamiroquai-love-foolosophy",
		title: "Love Foolosophy",
		artist: "Jamiroquai",
		year: 2001,
		era: "00s",
		niche: true,
		from: "funk",
		chop: "sung",
		why: "Same."
	},
	{
		id: "jamiroquai-feels-just-like-it-should",
		title: "Feels Just Like It Should",
		artist: "Jamiroquai",
		year: 2005,
		era: "00s",
		niche: true,
		from: "funk",
		chop: "hook",
		why: "Later."
	},
	{
		id: "annie-lennox-little-bird",
		title: "Little Bird",
		artist: "Annie Lennox",
		year: 1993,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "annie-lennox-no-more-i-love-yous",
		title: "No More 'I Love You's",
		artist: "Annie Lennox",
		year: 1995,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Same."
	},
	{
		id: "eurythmics-here-comes-the-rain-again",
		title: "Here Comes the Rain Again",
		artist: "Eurythmics",
		year: 1984,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Sung. Break."
	},
	{
		id: "eurythmics-would-i-lie-to-you",
		title: "Would I Lie to You?",
		artist: "Eurythmics",
		year: 1985,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same."
	},
	{
		id: "eurythmics-thorn-in-my-side",
		title: "Thorn in My Side",
		artist: "Eurythmics",
		year: 1986,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "eurythmics-missionary-man",
		title: "Missionary Man",
		artist: "Eurythmics",
		year: 1986,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same."
	},
	{
		id: "eurythmics-i-saved-the-world-today",
		title: "I Saved the World Today",
		artist: "Eurythmics",
		year: 1999,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Later."
	},
	{
		id: "annie-lennox-why",
		title: "Why",
		artist: "Annie Lennox",
		year: 1992,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "sung",
		why: "Ballad. Break only."
	},
	{
		id: "annie-lennox-walking-on-broken-glass",
		title: "Walking on Broken Glass",
		artist: "Annie Lennox",
		year: 1992,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Same voice. Faster."
	},
	{
		id: "procol-harum-a-whiter-shade-of-pale",
		title: "A Whiter Shade of Pale",
		artist: "Procol Harum",
		year: 1967,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Sung. Euphoric / trance break. Many rave covers exist — sample the vocal idea, find a cleared copy."
	},
	{
		id: "robert-miles-fable",
		title: "Fable",
		artist: "Robert Miles",
		year: 1996,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Has a vocal version. Use that, not the instrumental."
	},
	{
		id: "robert-miles-ft-maria-nayler-one-and-one",
		title: "One & One",
		artist: "Robert Miles ft. Maria Nayler",
		year: 1996,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Vocal trance. Euphoric."
	},
	{
		id: "aurora-various-trance-covers-ordinary-world",
		title: "Ordinary World",
		artist: "Aurora / various trance covers",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Duran via trance. Find the vocal mix."
	},
	{
		id: "delerium-ft-ja-l-after-all",
		title: "After All",
		artist: "Delerium ft. Jaël",
		year: 2003,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Same project. Different vocalist."
	},
	{
		id: "delerium-ft-leigh-nash-innocente",
		title: "Innocente",
		artist: "Delerium ft. Leigh Nash",
		year: 2001,
		era: "00s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Same."
	},
	{
		id: "dario-g-aria",
		title: "Aria",
		artist: "Dario G",
		year: 1998,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "sung",
		why: "Vocal / whistle. Euphoric."
	},
	{
		id: "dario-g-sunchyme",
		title: "Sunchyme",
		artist: "Dario G",
		year: 1997,
		era: "90s",
		niche: true,
		from: "trance",
		chop: "hook",
		why: "Dream Chaser via Dario G. Hands-up."
	},
	{
		id: "dario-g-carnaval-de-paris",
		title: "Carnaval de Paris",
		artist: "Dario G",
		year: 1998,
		era: "90s",
		niche: true,
		from: "pop",
		chop: "chant",
		why: "Football chant. Frenchcore / happy."
	},
	{
		id: "ronan-keating-life-is-a-rollercoaster",
		title: "Life Is a Rollercoaster",
		artist: "Ronan Keating",
		year: 2e3,
		era: "00s",
		niche: true,
		from: "pop",
		chop: "hook",
		why: "Pop. Happy irony."
	},
	{
		id: "supertramp-the-logical-song",
		title: "The Logical Song",
		artist: "Supertramp",
		year: 1979,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Scooter's source. Chop the original vocal."
	},
	{
		id: "supertramp-breakfast-in-america",
		title: "Breakfast in America",
		artist: "Supertramp",
		year: 1979,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Same band."
	},
	{
		id: "supertramp-give-a-little-bit",
		title: "Give a Little Bit",
		artist: "Supertramp",
		year: 1977,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Sung. Euphoric."
	},
	{
		id: "supertramp-school",
		title: "School",
		artist: "Supertramp",
		year: 1974,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "sung",
		why: "Same."
	},
	{
		id: "supertramp-dreamer",
		title: "Dreamer",
		artist: "Supertramp",
		year: 1974,
		era: "90s",
		niche: true,
		from: "rock",
		chop: "hook",
		why: "Not Livin' Joy. Rock hook."
	},
	{
		id: "the-weather-girls-its-raining-men",
		title: "It's Raining Men",
		artist: "The Weather Girls",
		year: 1982,
		era: "90s",
		niche: false,
		from: "disco",
		chop: "hook",
		why: "Disco shout-hook. Happy / frenchcore."
	},
	{
		id: "indeep-last-night-a-dj-saved-my-life",
		title: "Last Night a DJ Saved My Life",
		artist: "Indeep",
		year: 1982,
		era: "90s",
		niche: true,
		from: "disco",
		chop: "hook",
		why: "Disco-rap. Extra-raw / happy."
	},
	{
		id: "sybil-dont-make-me-over",
		title: "Don't Make Me Over",
		artist: "Sybil",
		year: 1989,
		era: "90s",
		niche: true,
		from: "house",
		chop: "sung",
		why: "Soul-house vocal."
	},
	{
		id: "soul-ii-soul-back-to-life-however-do-you-want-me",
		title: "Back to Life (However Do You Want Me)",
		artist: "Soul II Soul",
		year: 1989,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "UK soul. Break."
	},
	{
		id: "soul-ii-soul-keep-on-movin",
		title: "Keep On Movin'",
		artist: "Soul II Soul",
		year: 1989,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "sung",
		why: "Same."
	},
	{
		id: "soul-ii-soul-get-a-life",
		title: "Get a Life",
		artist: "Soul II Soul",
		year: 1989,
		era: "90s",
		niche: true,
		from: "soul",
		chop: "hook",
		why: "Same pile."
	},
	{
		id: "massive-attack-unfinished-sympathy",
		title: "Unfinished Sympathy",
		artist: "Massive Attack",
		year: 1991,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Shara Nelson. Sung break."
	},
	{
		id: "massive-attack-safe-from-harm",
		title: "Safe from Harm",
		artist: "Massive Attack",
		year: 1991,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Same."
	},
	{
		id: "massive-attack-karmacoma",
		title: "Karmacoma",
		artist: "Massive Attack",
		year: 1995,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Same project."
	},
	{
		id: "massive-attack-protection",
		title: "Protection",
		artist: "Massive Attack",
		year: 1995,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Same."
	},
	{
		id: "massive-attack-live-with-me",
		title: "Live With Me",
		artist: "Massive Attack",
		year: 2006,
		era: "00s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Later."
	},
	{
		id: "massive-attack-paradise-circus",
		title: "Paradise Circus",
		artist: "Massive Attack",
		year: 2010,
		era: "10s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Hope Sandoval. Dark break."
	},
	{
		id: "portishead-sour-times",
		title: "Sour Times",
		artist: "Portishead",
		year: 1994,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Same voice."
	},
	{
		id: "portishead-numb",
		title: "Numb",
		artist: "Portishead",
		year: 1994,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Not Linkin Park. Portishead."
	},
	{
		id: "portishead-over",
		title: "Over",
		artist: "Portishead",
		year: 1997,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Later Portishead."
	},
	{
		id: "portishead-all-mine",
		title: "All Mine",
		artist: "Portishead",
		year: 1997,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Same."
	},
	{
		id: "portishead-the-rip",
		title: "The Rip",
		artist: "Portishead",
		year: 2008,
		era: "00s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "2008 Portishead."
	},
	{
		id: "portishead-machine-gun",
		title: "Machine Gun",
		artist: "Portishead",
		year: 2008,
		era: "00s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Darker. Extra-raw atmosphere."
	},
	{
		id: "portishead-wandering-star",
		title: "Wandering Star",
		artist: "Portishead",
		year: 1994,
		era: "90s",
		niche: true,
		from: "trip-hop",
		chop: "sung",
		why: "Same pile."
	}
];
var VOCAL_STYLES = [
	{
		id: "eurodance",
		label: "Eurodance"
	},
	{
		id: "house",
		label: "House"
	},
	{
		id: "trance",
		label: "Trance"
	},
	{
		id: "happy",
		label: "90s happy"
	},
	{
		id: "hands-up",
		label: "Hands-up"
	},
	{
		id: "rave",
		label: "Rave"
	},
	{
		id: "garage",
		label: "UK garage"
	},
	{
		id: "industrial",
		label: "Industrial"
	},
	{
		id: "pop",
		label: "Pop"
	},
	{
		id: "rnb",
		label: "R&B"
	},
	{
		id: "soul",
		label: "Soul"
	},
	{
		id: "disco",
		label: "Disco"
	},
	{
		id: "rap",
		label: "Rap"
	},
	{
		id: "synth",
		label: "Synth"
	},
	{
		id: "big beat",
		label: "Big beat"
	},
	{
		id: "grime",
		label: "Grime"
	}
];
var GENRE_LABEL = {
	"euphoric": "Euphoric",
	"raw": "Raw",
	"extra-raw": "Extra raw",
	"classic": "Classic",
	"early": "Early",
	"hardcore": "Hardcore",
	"uptempo": "Uptempo",
	"frenchcore": "Frenchcore",
	"ukhc": "UK hardcore",
	"happy": "Happy hardcore",
	"gabber": "Gabber",
	"industrial": "Industrial",
	"hard-techno": "Hard techno",
	"jumpstyle": "Jumpstyle",
	"hard-trance": "Hard trance",
	"freeform": "Freeform",
	"millenium": "Millennium",
	"terror": "Terror",
	"psy": "Psy-hard"
};
function artistsByGenre(id) {
	if (id === "all") return ARTISTS;
	return ARTISTS.filter((a) => a.genre === id);
}
function searchArtists(q, genre) {
	const needle = q.trim().toLowerCase();
	return artistsByGenre(genre).filter((a) => !needle || a.name.toLowerCase().includes(needle));
}
function searchVocals(q, era, nicheOnly, style = "all") {
	const needle = q.trim().toLowerCase();
	return VOCALS.filter((v) => {
		if (era !== "all" && v.era !== era) return false;
		if (nicheOnly && !v.niche) return false;
		if (style !== "all" && v.from !== style) return false;
		if (!needle) return true;
		return v.title.toLowerCase().includes(needle) || v.artist.toLowerCase().includes(needle) || v.from.toLowerCase().includes(needle) || v.chop.toLowerCase().includes(needle);
	});
}
var YOU_DEFAULT = {
	kick: "any",
	bass: "any",
	hook: "any",
	vox: "any",
	phrases: "mix",
	key: "any"
};
var KEYS = [
	"A minor",
	"G minor",
	"F minor",
	"E minor",
	"D minor",
	"C# minor"
];
var KICK_OPTS = [
	{
		id: "any",
		label: "Any"
	},
	{
		id: "raw",
		label: "Raw"
	},
	{
		id: "pvc",
		label: "PVC"
	},
	{
		id: "musical",
		label: "Musical"
	}
];
var BASS_OPTS = [
	{
		id: "any",
		label: "Any"
	},
	{
		id: "reverse",
		label: "Reverse"
	},
	{
		id: "offbeat",
		label: "Offbeat"
	},
	{
		id: "none",
		label: "None"
	}
];
var HOOK_OPTS = [
	{
		id: "any",
		label: "Any"
	},
	{
		id: "screech",
		label: "Screech"
	},
	{
		id: "saw",
		label: "Saw"
	},
	{
		id: "piano",
		label: "Piano"
	},
	{
		id: "vox",
		label: "Vox"
	},
	{
		id: "stab",
		label: "Stab"
	}
];
var VOX_OPTS = [
	{
		id: "any",
		label: "Any"
	},
	{
		id: "chop",
		label: "Chop"
	},
	{
		id: "shout",
		label: "Shout"
	},
	{
		id: "sung",
		label: "Sung"
	},
	{
		id: "none",
		label: "None"
	}
];
var PHRASE_OPTS = [
	{
		id: "dj",
		label: "DJ 4×4",
		hint: "Always 16-bar phrases"
	},
	{
		id: "mix",
		label: "Mix 90/10",
		hint: "DJ 4×4 most rolls, anthem sometimes"
	},
	{
		id: "anthem",
		label: "Anthem",
		hint: "32-bar breaks"
	}
];
var FROM_FIT = {
	euphoric: [
		"trance",
		"eurodance",
		"italo",
		"house",
		"dream trance",
		"art pop",
		"synth"
	],
	raw: [
		"industrial",
		"big beat",
		"grime",
		"alt rnb",
		"rap",
		"ebm",
		"metalcore"
	],
	"extra-raw": [
		"industrial",
		"ebm",
		"aggrotech",
		"noise rock",
		"experimental hip hop",
		"grime",
		"rap",
		"metal"
	],
	classic: [
		"trance",
		"eurodance",
		"italo",
		"house",
		"hands up"
	],
	early: [
		"rave",
		"gabber",
		"eurodance",
		"hard trance",
		"new beat"
	],
	hardcore: [
		"gabber",
		"rave",
		"industrial",
		"happy",
		"metal",
		"shout"
	],
	uptempo: [
		"gabber",
		"industrial",
		"aggrotech",
		"grime",
		"rap",
		"happy"
	],
	frenchcore: [
		"happy",
		"eurodance",
		"rave",
		"gabber",
		"hands up"
	],
	ukhc: [
		"rave",
		"happy",
		"ukg",
		"uk garage",
		"hands up",
		"dnb",
		"bassline"
	],
	happy: [
		"happy",
		"eurodance",
		"hands up",
		"rave",
		"pop",
		"ukhc"
	],
	gabber: [
		"gabber",
		"rave",
		"happy",
		"new beat",
		"ebm"
	],
	industrial: [
		"industrial",
		"ebm",
		"aggrotech",
		"trip-hop",
		"industrial metal"
	],
	"hard-techno": [
		"industrial",
		"ebm",
		"techno",
		"electro",
		"house"
	],
	jumpstyle: [
		"hands up",
		"eurodance",
		"happy",
		"jumpstyle"
	],
	"hard-trance": [
		"hard trance",
		"trance",
		"rave",
		"eurodance"
	],
	freeform: [
		"dnb",
		"jungle",
		"grime",
		"idm",
		"uk garage"
	],
	millenium: [
		"rave",
		"happy",
		"ukhc",
		"millenium"
	],
	terror: [
		"industrial",
		"idm",
		"noise rock",
		"gabber",
		"aggrotech"
	],
	psy: [
		"art pop",
		"experimental",
		"trip-hop",
		"psychedelic",
		"idm",
		"synthwave"
	]
};
function rng(seed) {
	let s = seed >>> 0 || 1;
	return () => {
		s = Math.imul(s, 1664525) + 1013904223 >>> 0;
		return s / 4294967296;
	};
}
function pick(r, xs) {
	return xs[Math.floor(r() * xs.length)];
}
function wordsOf(title) {
	return title.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !/^(the|and|for|you|your|this|that|with|from)$/i.test(w));
}
function bar(kind, bars, label) {
	return {
		kind,
		bars,
		label
	};
}
function djMaps(genre) {
	const inL = genre === "ukhc" || genre === "happy" || genre === "millenium" ? "hook in" : genre === "extra-raw" || genre === "uptempo" || genre === "terror" ? "kick wall" : "kick in";
	const brL = genre === "raw" || genre === "extra-raw" || genre === "industrial" ? "filter break" : genre === "ukhc" || genre === "happy" ? "vocal / piano" : "break";
	const dropL = genre === "euphoric" || genre === "classic" ? "drop" : "drop";
	return [
		[
			bar("intro", 16, inL),
			bar("break", 16, brL),
			bar("drop", 16, `${dropL} 1`),
			bar("drop", 16, `${dropL} 1b`),
			bar("break", 16, "break 2"),
			bar("drop", 16, `${dropL} 2`),
			bar("drop", 16, `${dropL} 2b`),
			bar("outro", 16, "outro")
		],
		[
			bar("intro", 16, inL),
			bar("drop", 16, `${dropL} 1`),
			bar("break", 16, brL),
			bar("drop", 16, `${dropL} 2`),
			bar("outro", 16, "outro")
		],
		[
			bar("intro", 16, inL),
			bar("break", 16, brL),
			bar("drop", 16, `${dropL} 1`),
			bar("break", 16, "break 2"),
			bar("drop", 16, `${dropL} 2`),
			bar("outro", 16, "outro")
		],
		[
			bar("intro", 16, "hook"),
			bar("drop", 16, `${dropL} 1`),
			bar("break", 16, "hook 2"),
			bar("drop", 16, `${dropL} 2`),
			bar("outro", 16, "outro")
		]
	];
}
function anthemMap(genre) {
	const br = genre === "ukhc" || genre === "happy" ? "vocal break" : genre === "psy" ? "story break" : "break";
	return [
		bar("intro", 16, "intro"),
		bar("break", 32, br),
		bar("build", 16, "build"),
		bar("drop", 32, "drop 1"),
		bar("break", 32, "break 2"),
		bar("build", 16, "build 2"),
		bar("drop", 32, "drop 2"),
		bar("outro", 16, "outro")
	];
}
function pickPhrases(r, genre, pref) {
	if (pref === "anthem") return {
		mode: "anthem",
		phrases: anthemMap(genre)
	};
	if (pref === "dj" || r() < .9) return {
		mode: "dj",
		phrases: pick(r, djMaps(genre))
	};
	return {
		mode: "anthem",
		phrases: anthemMap(genre)
	};
}
var KICK_LINE = {
	raw: [
		"Raw mid crunch. Body first, click on top.",
		"Dark punch. Distort the mids, keep the sub clean.",
		"Kick + extra click. Two layers, one mono.",
		"Raw kick, short tail. Leave space for the reverse."
	],
	pvc: [
		"PVC clipper kick. Hard peak, short tail.",
		"Brickwall punch. Extra click, no musical tail.",
		"Hard-techno PVC. Peak then click extra.",
		"Clipped kick wall. Mono, loud, no pretty decay."
	],
	musical: [
		"Musical 150 punch. Reverse bass sits under it.",
		"Clean punch. Quiet click, long enough for the reverse.",
		"Euphoric kick. Punch then reverse, no extra crunch.",
		"Musical kick. Keep the low-mid round, not crushed."
	]
};
var BASS_LINE = {
	reverse: [
		"Reverse bass locked to the kick.",
		"Reverse bass. Same grid as the kick, nothing fancy.",
		"Reverse bass with a short pitch-down into the 1.",
		"Reverse bass in the pocket. Don't let it fight the kick."
	],
	offbeat: [
		"Offbeat bass. UK / happy pocket.",
		"Offbeat bass, not reverse. 170 feel even at 150.",
		"Offbeat bass under the piano / saw.",
		"Offbeat bass. Leave the 1 for the kick only."
	],
	none: [
		"No bass. Kick carries the low end.",
		"Kick only. Add a click extra, not a bassline.",
		"No reverse, no offbeat. Empty low-mid on purpose."
	]
};
var HOOK_LINE = {
	screech: [
		"Short screech hook. One motif, not a melody.",
		"Screech on the 1. Leave gaps.",
		"Screech + kick is the drop. No pretty lead."
	],
	saw: [
		"Supersaw climax. Break melody becomes the drop.",
		"Saw lead from the break. Same notes, harder.",
		"Stacked saws. Keep the mid clear of the kick."
	],
	piano: [
		"Piano motif. UK hardcore / millenium lane.",
		"Piano before the drop. Simple voicing, minor.",
		"Piano hook in the break, stabs in the drop."
	],
	vox: [
		"Vocal chop is the hook. No extra lead.",
		"Pitched vox as the melody. Keep it rhythmic.",
		"Vox hook in the break, chops on the drop."
	],
	stab: [
		"Stab / hoover. Short, on the 1.",
		"Chord stab instead of a climax saw.",
		"Hoover stab. Gabber / early hardstyle colour."
	]
};
var VOX_LINE = {
	chop: [
		"Rhythmic chops in the drop. Dry in the break.",
		"Chop on the offbeats. Treat it like a hat.",
		"Grain the chop. Reverse the last hit into the drop."
	],
	shout: [
		"Shout hits. Festival 1s, not a verse.",
		"One shout per 16. Don't stack them.",
		"Shout as an impact. Sidechain it to the kick."
	],
	sung: [
		"Sung hook in the break. Restate a slice in the drop.",
		"Sung line, dry. No auto-tune soup.",
		"Melody in the break. Drop keeps a 2-bar slice."
	],
	none: [
		"No vox in the drop. Kick and hook only.",
		"Skip the vocal, or keep a 1-bar teaser in the break.",
		"Instrumental. Source still listed if you change your mind."
	]
};
function kickKind(r, genre, pref) {
	if (pref !== "any") return pref;
	if (genre === "extra-raw" || genre === "hard-techno" || genre === "uptempo" || genre === "terror") return pick(r, [
		"pvc",
		"raw",
		"raw"
	]);
	if (genre === "euphoric" || genre === "classic" || genre === "happy" || genre === "ukhc" || genre === "hard-trance") return pick(r, [
		"musical",
		"musical",
		"raw"
	]);
	return pick(r, [
		"raw",
		"raw",
		"pvc",
		"musical"
	]);
}
function bassKind(r, genre, pref) {
	if (pref !== "any") return pref;
	if (genre === "ukhc" || genre === "happy" || genre === "millenium" || genre === "jumpstyle" || genre === "freeform") return pick(r, [
		"offbeat",
		"offbeat",
		"none"
	]);
	if (genre === "extra-raw" || genre === "uptempo" || genre === "terror" || genre === "hard-techno") return pick(r, [
		"none",
		"none",
		"reverse"
	]);
	return pick(r, [
		"reverse",
		"reverse",
		"reverse",
		"none"
	]);
}
function hookKind(r, genre, pref) {
	if (pref !== "any") return pref;
	if (genre === "ukhc" || genre === "happy" || genre === "millenium") return pick(r, [
		"piano",
		"saw",
		"vox"
	]);
	if (genre === "raw" || genre === "extra-raw") return pick(r, [
		"screech",
		"screech",
		"stab"
	]);
	if (genre === "gabber" || genre === "hardcore" || genre === "early") return pick(r, [
		"stab",
		"screech",
		"piano"
	]);
	if (genre === "euphoric" || genre === "classic" || genre === "hard-trance" || genre === "psy") return pick(r, [
		"saw",
		"saw",
		"vox",
		"piano"
	]);
	if (genre === "frenchcore") return pick(r, [
		"stab",
		"vox",
		"screech"
	]);
	return pick(r, [
		"screech",
		"saw",
		"stab",
		"vox"
	]);
}
function voxKind(r, vocal, pref) {
	if (pref !== "any") return pref;
	if (/(shout|yell|scream|chant)/.test(vocal.chop)) return pick(r, ["shout", "chop"]);
	if (/(sung|choir|hook)/.test(vocal.chop)) return pick(r, [
		"sung",
		"chop",
		"chop"
	]);
	if (/(spoken|whisper)/.test(vocal.chop)) return pick(r, [
		"chop",
		"shout",
		"none"
	]);
	return pick(r, [
		"chop",
		"chop",
		"shout",
		"sung",
		"none"
	]);
}
function makeSound(r, genre, vocal, you) {
	const k = kickKind(r, genre, you.kick);
	const b = bassKind(r, genre, you.bass);
	const h = hookKind(r, genre, you.hook);
	const v = voxKind(r, vocal, you.vox);
	return {
		kickKind: k,
		bassKind: b,
		hookKind: h,
		voxKind: v,
		kick: pick(r, KICK_LINE[k]),
		bass: pick(r, BASS_LINE[b]),
		hook: pick(r, HOOK_LINE[h]),
		vox: pick(r, VOX_LINE[v])
	};
}
function layersOf(sound, genre) {
	const bass = sound.bassKind === "none" ? "Click extra" : sound.bassKind === "offbeat" ? "Offbeat bass" : "Reverse bass";
	const extra = genre === "uptempo" || genre === "terror" ? [
		"Hats",
		"Impact",
		"Noise FX"
	] : genre === "ukhc" || genre === "happy" ? [
		"Hats",
		"Snare build",
		"FX"
	] : [
		"Atmosphere",
		"FX",
		"Impact"
	];
	return [
		"Kick",
		bass,
		sound.hookKind === "vox" ? "Vox hook" : sound.hookKind === "piano" ? "Piano" : sound.hookKind === "saw" ? "Saw lead" : sound.hookKind === "stab" ? "Stab" : "Screech",
		"Chop bus",
		...extra
	];
}
function fitVocal(v, genre) {
	const likes = FROM_FIT[genre] ?? [];
	const src = v.from.toLowerCase().replace(/-/g, " ");
	if (likes.some((x) => src.includes(x.replace(/-/g, " ")))) return 3;
	if (genre === "extra-raw" || genre === "uptempo" || genre === "terror") {
		if (/(shout|whisper|spoken|yell|scream|chant|rap)/.test(v.chop)) return 2;
	}
	if (genre === "euphoric" || genre === "classic" || genre === "happy" || genre === "ukhc") {
		if (/(hook|sung|choir|vocal pad)/.test(v.chop)) return 2;
	}
	return 1;
}
function poolArtists(opts) {
	if (opts.artistId) {
		const hit = ARTISTS.find((a) => a.id === opts.artistId);
		if (hit) return [hit];
	}
	let list = ARTISTS;
	if (opts.genre && opts.genre !== "all") list = list.filter((a) => a.genre === opts.genre);
	const needle = (opts.q ?? "").trim().toLowerCase();
	if (needle) list = list.filter((a) => a.name.toLowerCase().includes(needle));
	return list.length ? list : ARTISTS;
}
function poolVocals(opts, genre) {
	if (opts.vocalId) {
		const hit = VOCALS.find((v) => v.id === opts.vocalId);
		if (hit) return [hit];
	}
	let list = VOCALS;
	if (opts.era && opts.era !== "all") list = list.filter((v) => v.era === opts.era);
	if (opts.nicheOnly) list = list.filter((v) => v.niche);
	const needle = (opts.q ?? "").trim().toLowerCase();
	if (needle) list = list.filter((v) => v.title.toLowerCase().includes(needle) || v.artist.toLowerCase().includes(needle) || v.from.toLowerCase().includes(needle));
	if (!list.length) list = VOCALS.filter((v) => opts.nicheOnly ? v.niche : true);
	if (!list.length) list = VOCALS;
	const ranked = [...list].sort((a, b) => fitVocal(b, genre) - fitVocal(a, genre));
	const best = ranked[0] ? fitVocal(ranked[0], genre) : 1;
	const top = ranked.filter((v) => fitVocal(v, genre) >= Math.max(1, best - 1));
	return top.length ? top : ranked;
}
function makeTitle(r, vocal, artist) {
	const ws = wordsOf(vocal.title);
	const w = (pick(r, ws.length ? ws : ["Cut"]) ?? "Cut").toUpperCase();
	const tail = pick(r, [
		"DROP",
		"BREAK",
		"CUT",
		"CALL",
		"LOCK",
		"GRID",
		"CORE",
		"MARK"
	]);
	const lane = GENRE_LABEL[artist.genre].split(" ")[0].toUpperCase();
	if (r() < .35) return `${w} ${tail}`;
	if (r() < .5) return `${w} / ${lane}`;
	return `${lane} ${w}`;
}
function mapLine(phrases) {
	return phrases.map((p) => `${p.bars} ${p.label}`).join(" · ");
}
function phraseCount(phrases) {
	return phrases.reduce((n, p) => n + p.bars, 0) / 16;
}
function barsOf(phrases) {
	return phrases.reduce((n, p) => n + p.bars, 0);
}
function chopHow(vocal, key, sound) {
	if (sound.voxKind === "none") return `Kick and ${sound.hookKind} carry it. Optional 1-bar teaser from ${vocal.title} in the break only.`;
	return `Isolate the ${vocal.chop}. Pitch to ${key}. Grain 20–60 ms if it clicks. Reverse the last hit into the drop.`;
}
function process(vocal, artist, key, sound, mode) {
	const grid = mode === "dj" ? "Write in 16-bar DJ phrases. Mix in on the 1. No 4-bar tricks." : "Anthem map. 32-bar breaks, still land every section on a 16.";
	return [
		`Find a clean copy of ${vocal.artist} — ${vocal.title} (${vocal.year}). Title and year only — no rips, no pasted lyrics.`,
		vocal.why,
		`Lane: ${artist.name} · ${GENRE_LABEL[artist.genre]}. ${artist.tag}`,
		sound.kick,
		sound.bass,
		sound.hook,
		sound.vox,
		grid,
		`Pitch chops to ${key}. Sidechain the vox bus to the kick.`
	];
}
function concept(artist, vocal, sound, mode) {
	const niche = vocal.niche ? "Niche cut." : "Known hook — keep the chop short so it does not become a cover.";
	const grid = mode === "dj" ? "DJ 4×4." : "Anthem.";
	return `${artist.name} at ${artist.bpm}. ${grid} ${sound.kickKind} kick, ${sound.bassKind} bass, ${sound.hookKind} hook. Source ${vocal.artist}, ${vocal.year}. ${niche}`;
}
function rollIdea(opts = {}) {
	const seed = opts.seed ?? Date.now() ^ Math.floor(Math.random() * 1e9);
	const r = rng(seed);
	const you = opts.you ?? YOU_DEFAULT;
	const artist = pick(r, poolArtists(opts));
	const vocal = pick(r, poolVocals(opts, artist.genre));
	const key = you.key !== "any" && you.key ? you.key : pick(r, KEYS);
	const { mode, phrases } = pickPhrases(r, artist.genre, you.phrases);
	const sound = makeSound(r, artist.genre, vocal, you);
	return {
		seed,
		title: makeTitle(r, vocal, artist),
		artist,
		vocal,
		bpm: artist.bpm,
		key,
		map: mapLine(phrases),
		phrases,
		phraseMode: mode,
		layers: layersOf(sound, artist.genre),
		sound,
		chopHow: chopHow(vocal, key, sound),
		process: process(vocal, artist, key, sound, mode),
		concept: concept(artist, vocal, sound, mode),
		search: `${vocal.artist} ${vocal.title} ${vocal.year}`
	};
}
function ideaText(idea) {
	const units = idea.phrases?.length ? phraseCount(idea.phrases) : 0;
	const mode = idea.phraseMode === "anthem" ? "ANTHEM" : "DJ 4x4";
	return [
		`VOCAL SOURCE`,
		`TITLE: ${idea.title}`,
		`LANE: ${idea.artist.name} · ${GENRE_LABEL[idea.artist.genre]} · ${idea.bpm} · ${idea.key}`,
		`GRID: ${mode} · ${units} phrases · ${barsOf(idea.phrases ?? [])} bars`,
		`KICK: ${idea.sound?.kick ?? ""}`,
		`BASS: ${idea.sound?.bass ?? ""}`,
		`HOOK: ${idea.sound?.hook ?? ""}`,
		`VOX: ${idea.sound?.vox ?? ""}`,
		`VOCAL: ${idea.vocal.artist} — ${idea.vocal.title} (${idea.vocal.year})${idea.vocal.niche ? " · niche" : ""}`,
		`FROM: ${idea.vocal.from} · chop: ${idea.vocal.chop}`,
		`WHY: ${idea.vocal.why}`,
		`HOW: ${idea.chopHow}`,
		`MAP: ${idea.map}`,
		`LAYERS: ${idea.layers.join(", ")}`,
		`CONCEPT: ${idea.concept}`,
		``,
		`PROCESS:`,
		...idea.process.map((p) => `- ${p}`),
		``,
		`SEARCH: ${idea.search}`,
		`Titles and years only. Source and clear your own vocals.`
	].join("\n");
}
function youtubeSearch(q) {
	return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
function discogsSearch(q) {
	return `https://www.discogs.com/search/?q=${encodeURIComponent(q)}&type=all`;
}
var SAVE_KEY = "hs-songs-saved-v1";
var YOU_KEY = "hs-songs-you-v1";
function loadSaved() {
	try {
		const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
		return Array.isArray(raw) ? raw.slice(0, 40) : [];
	} catch {
		return [];
	}
}
function loadYou() {
	try {
		const raw = JSON.parse(localStorage.getItem(YOU_KEY) || "null");
		if (!raw || typeof raw !== "object") return YOU_DEFAULT;
		return {
			...YOU_DEFAULT,
			...raw
		};
	} catch {
		return YOU_DEFAULT;
	}
}
var useVs = create((set, get) => ({
	ready: false,
	idea: rollIdea({
		seed: 7,
		nicheOnly: false,
		you: YOU_DEFAULT
	}),
	you: YOU_DEFAULT,
	saved: [],
	genre: "all",
	era: "all",
	nicheOnly: false,
	style: "all",
	q: "",
	lockGenre: false,
	lockArtist: null,
	lockVocal: null,
	hydrate: () => {
		if (get().ready) return;
		set({
			ready: true,
			you: loadYou(),
			saved: loadSaved()
		});
	},
	setQ: (q) => set({ q }),
	setEra: (era) => set({ era }),
	setStyle: (style) => set({
		style,
		q: ""
	}),
	setNiche: (nicheOnly) => set({ nicheOnly }),
	setGenre: (genre, lock) => set({
		genre,
		lockGenre: genre === "all" ? false : lock ?? false
	}),
	persistYou: (patch) => {
		const you = {
			...get().you,
			...patch
		};
		try {
			localStorage.setItem(YOU_KEY, JSON.stringify(you));
		} catch {}
		set({ you });
	},
	resetYou: () => {
		try {
			localStorage.setItem(YOU_KEY, JSON.stringify(YOU_DEFAULT));
		} catch {}
		set({ you: YOU_DEFAULT });
	},
	roll: (extra) => {
		const s = get();
		const lockVocal = extra?.vocalId !== void 0 ? extra.vocalId : s.lockVocal;
		const lockArtist = extra?.artistId !== void 0 ? extra.artistId : s.lockArtist;
		const next = rollIdea({
			genre: extra?.genre ?? (s.genre !== "all" ? s.genre : "all"),
			era: extra?.era ?? s.era,
			nicheOnly: extra?.nicheOnly ?? s.nicheOnly,
			artistId: extra?.artistId ?? lockArtist,
			vocalId: extra?.vocalId ?? lockVocal,
			q: extra?.q ?? s.q,
			you: extra?.you ?? s.you,
			seed: extra?.seed ?? Date.now() ^ Math.floor(Math.random() * 1e9)
		});
		set({
			idea: next,
			lockVocal,
			lockArtist
		});
		return next;
	},
	saveIdea: () => {
		const { idea, saved } = get();
		const exists = saved.some((x) => x.seed === idea.seed);
		const next = exists ? saved.filter((x) => x.seed !== idea.seed) : [idea, ...saved.filter((x) => x.seed !== idea.seed)].slice(0, 40);
		try {
			localStorage.setItem(SAVE_KEY, JSON.stringify(next));
		} catch {}
		set({ saved: next });
		return exists ? "removed" : "saved";
	},
	copyIdea: async (target) => {
		try {
			await navigator.clipboard.writeText(ideaText(target ?? get().idea));
			return true;
		} catch {
			return false;
		}
	},
	unlockArtist: () => set({ lockArtist: null }),
	unlockVocal: () => set({ lockVocal: null }),
	pickVocal: (v) => get().roll({ vocalId: v.id }),
	pickArtist: (a) => {
		set({
			genre: a.genre,
			lockGenre: true
		});
		return get().roll({
			artistId: a.id,
			genre: a.genre
		});
	},
	openSaved: (idea) => set({ idea }),
	removeSaved: (idea) => {
		const next = get().saved.filter((x) => x.seed !== idea.seed);
		try {
			localStorage.setItem(SAVE_KEY, JSON.stringify(next));
		} catch {}
		set({ saved: next });
	}
}));
function youLocked(you) {
	return you.kick !== "any" || you.bass !== "any" || you.hook !== "any" || you.vox !== "any" || you.phrases !== "mix" || you.key !== "any";
}
var FEATURED = [
	"alice-deejay-better-off-alone",
	"haddaway-what-is-love",
	"cascada-everytime-we-touch",
	"crystal-waters-gypsy-woman",
	"2-unlimited-no-limit",
	"la-bouche-be-my-lover",
	"gala-freed-from-desire",
	"robin-s-show-me-love",
	"dune-hardcore-vibes",
	"party-animals-have-you-ever-been-mellow"
].map((id) => VOCALS.find((v) => v.id === id)).filter((v) => Boolean(v));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/catalog",
		label: "Catalog"
	},
	{
		to: "/studio",
		label: "Studio"
	},
	{
		to: "/lanes",
		label: "Lanes"
	},
	{
		to: "/saved",
		label: "Saved"
	}
];
var FOOTER_NAV = [...NAV, {
	to: "/sound",
	label: "Sound"
}];
function SiteShell({ children }) {
	const hydrate = useVs((s) => s.hydrate);
	const saved = useVs((s) => s.saved);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 bg-bg shadow-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "font-display shrink-0 text-lg leading-none tracking-wide text-foreground",
						children: ["VOCAL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "SOURCE"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto",
						"aria-label": "Site",
						children: NAV.map((item) => {
							const active = pathname === item.to;
							const label = item.to === "/saved" && saved.length ? `Saved ${saved.length}` : item.label;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: cn("inline-flex h-11 shrink-0 items-center rounded-md px-2.5 text-sm font-medium transition-[background-color,color] duration-150 sm:px-3", active ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-2 hover:text-foreground"),
								children: label
							}, item.to);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-auto border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-lg tracking-wide text-foreground",
							children: ["VOCAL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "SOURCE"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xs text-sm leading-relaxed text-muted",
							children: "Vocals people chop into hardstyle. Not hardstyle tracks. Titles and years only."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-widest text-subtle",
							children: "Explore"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2 text-sm",
							children: FOOTER_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: "text-muted hover:text-foreground",
								children: item.label
							}) }, item.to))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-widest text-subtle",
								children: "The pile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-mono text-sm tabular-nums text-foreground",
								children: [VOCALS.length, " sample vocals"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm tabular-nums text-foreground",
								children: [ARTISTS.length, " production lanes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted",
								children: "Search, sample, and clear what you use. Not a stem pack and not a lyric sheet."
							})
						] })
					]
				})
			})
		]
	});
}
var styles_default = "/assets/styles-zd_WLO4t.css";
var APP_NAME = "VOCAL SOURCE";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "VOCAL SOURCE. Vocals people chop into hardstyle — 90s to now. Not hardstyle tracks. Titles and years only."
			},
			{
				name: "theme-color",
				content: "#0c0c0b"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: APP_NAME
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bungee&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaRegister, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center",
				toastOptions: { style: {
					background: "#161412",
					color: "#e8e2d6",
					border: "1px solid rgba(232,226,214,0.12)"
				} }
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-D_bHvotd.mjs");
var Route$5 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "VOCAL SOURCE" }] })
});
var $$splitComponentImporter$4 = () => import("./catalog-D-Aia4dS.mjs");
var Route$4 = createFileRoute("/catalog")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Catalog · VOCAL SOURCE" }] })
});
var $$splitComponentImporter$3 = () => import("./lanes-1EdFf8H_.mjs");
var Route$3 = createFileRoute("/lanes")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Lanes · VOCAL SOURCE" }] })
});
var $$splitComponentImporter$2 = () => import("./saved-CpSFUuAG.mjs");
var Route$2 = createFileRoute("/saved")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Saved · VOCAL SOURCE" }] })
});
var $$splitComponentImporter$1 = () => import("./sound-DAHPWoEq.mjs");
var Route$1 = createFileRoute("/sound")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Sound · VOCAL SOURCE" }] })
});
var $$splitComponentImporter = () => import("./studio-JhR4nrXj.mjs");
var Route = createFileRoute("/studio")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Studio · VOCAL SOURCE" }] })
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	CatalogRoute: Route$4.update({
		id: "/catalog",
		path: "/catalog",
		getParentRoute: () => Route$6
	}),
	LanesRoute: Route$3.update({
		id: "/lanes",
		path: "/lanes",
		getParentRoute: () => Route$6
	}),
	SavedRoute: Route$2.update({
		id: "/saved",
		path: "/saved",
		getParentRoute: () => Route$6
	}),
	SoundRoute: Route$1.update({
		id: "/sound",
		path: "/sound",
		getParentRoute: () => Route$6
	}),
	StudioRoute: Route.update({
		id: "/studio",
		path: "/studio",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { GENRE_LABEL as _, youLocked as a, searchArtists as b, KEYS as c, VOX_OPTS as d, barsOf as f, GENRES as g, ARTISTS as h, useVs as i, KICK_OPTS as l, youtubeSearch as m, cn as n, BASS_OPTS as o, discogsSearch as p, FEATURED as r, HOOK_OPTS as s, router_exports as t, PHRASE_OPTS as u, VOCALS as v, searchVocals as x, VOCAL_STYLES as y };
