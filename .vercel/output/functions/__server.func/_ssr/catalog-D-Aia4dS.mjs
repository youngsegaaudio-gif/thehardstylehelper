import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useVs, x as searchVocals } from "./router-BftHCkTq.mjs";
import { t as Button } from "./button-BFSvdKFg.mjs";
import { c as SearchField, l as StyleChips, n as EraChips, o as Page, s as PageTitle, u as VocalCard } from "./site-ui-CjxTnGGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-D-Aia4dS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE = 36;
function CatalogPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const era = useVs((s) => s.era);
	const setEra = useVs((s) => s.setEra);
	const style = useVs((s) => s.style);
	const setStyle = useVs((s) => s.setStyle);
	const nicheOnly = useVs((s) => s.nicheOnly);
	const setNiche = useVs((s) => s.setNiche);
	const pickVocal = useVs((s) => s.pickVocal);
	const [shown, setShown] = (0, import_react.useState)(PAGE);
	const hits = (0, import_react.useMemo)(() => searchVocals(q, era, nicheOnly, style), [
		q,
		era,
		nicheOnly,
		style
	]);
	(0, import_react.useEffect)(() => {
		setShown(PAGE);
	}, [
		q,
		era,
		nicheOnly,
		style
	]);
	const visible = hits.slice(0, shown);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "The catalog",
			title: "Source vocals",
			lede: "Songs people chop into hardstyle. Not hardstyle records. Tap a title to roll it into a production lane."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchField, {
					value: q,
					onChange: setQ,
					placeholder: "Search songs, artists, styles"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleChips, {
					value: style,
					onChange: setStyle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EraChips, {
					era,
					nicheOnly,
					onEra: setEra,
					onNiche: () => setNiche(!nicheOnly)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-muted",
			children: [
				hits.length,
				" vocals",
				style !== "all" ? ` in ${style}` : "",
				era !== "all" ? ` · ${era}` : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: visible.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VocalCard, {
				v,
				onPick: (picked) => {
					pickVocal(picked);
					navigate({ to: "/studio" });
				}
			}) }, v.id))
		}),
		hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl bg-surface p-8 text-sm text-muted shadow-border",
			children: "Nothing in that filter. Clear search or switch era."
		}) : null,
		shown < hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => setShown((n) => n + PAGE),
				children: [
					"Show more · ",
					hits.length - shown,
					" left"
				]
			})
		}) : null
	] });
}
//#endregion
export { CatalogPage as component };
