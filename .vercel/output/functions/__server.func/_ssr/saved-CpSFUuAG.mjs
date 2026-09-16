import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as MicVocal } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useVs } from "./router-BftHCkTq.mjs";
import { t as Button } from "./button-BFSvdKFg.mjs";
import { o as Page, s as PageTitle } from "./site-ui-CjxTnGGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-CpSFUuAG.js
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const navigate = useNavigate();
	const ready = useVs((s) => s.ready);
	const saved = useVs((s) => s.saved);
	const openSaved = useVs((s) => s.openSaved);
	const copyIdea = useVs((s) => s.copyIdea);
	const removeSaved = useVs((s) => s.removeSaved);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		narrow: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				kicker: "This device",
				title: "Saved ideas",
				lede: "Kept in this browser only. Open one to keep rolling from it."
			}),
			!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Loading saved ideas…"
			}) : null,
			ready && !saved.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface px-5 py-12 text-center shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, { className: "mx-auto size-6 text-subtle" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing saved yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/studio",
							children: "Roll an idea"
						})
					})
				]
			}) : null,
			ready && saved.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: saved.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-border sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							openSaved(item);
							navigate({ to: "/studio" });
						},
						className: "min-w-0 flex-1 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg tracking-wide text-foreground",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted",
							children: [
								item.artist.name,
								" · ",
								item.vocal.artist,
								" — ",
								item.vocal.title,
								" (",
								item.vocal.year,
								")"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void copyIdea(item).then((ok) => toast(ok ? "Notes copied" : "Could not copy")),
							children: "Copy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => removeSaved(item),
							children: "Remove"
						})]
					})]
				}, item.seed))
			}) : null
		]
	});
}
//#endregion
export { SavedPage as component };
