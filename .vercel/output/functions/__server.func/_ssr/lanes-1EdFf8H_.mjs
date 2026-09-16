import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as searchArtists, g as GENRES, h as ARTISTS, i as useVs } from "./router-BftHCkTq.mjs";
import { c as SearchField, i as GenreChips, o as Page, s as PageTitle } from "./site-ui-CjxTnGGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lanes-1EdFf8H_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LanesPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const genre = useVs((s) => s.genre);
	const setGenre = useVs((s) => s.setGenre);
	const pickArtist = useVs((s) => s.pickArtist);
	const hits = (0, import_react.useMemo)(() => searchArtists(q, genre), [q, genre]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const g of GENRES) map.set(g.id, []);
		for (const a of hits) map.get(a.genre)?.push(a);
		return GENRES.map((g) => ({
			...g,
			acts: map.get(g.id) ?? []
		})).filter((g) => g.acts.length);
	}, [hits]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			kicker: "Production lanes",
			title: "500 hard-dance acts",
			lede: "These are what you write into — not what you sample. Tap an act to lock the lane and roll a vocal against it."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchField, {
				value: q,
				onChange: setQ,
				placeholder: "Search acts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenreChips, {
				value: genre,
				onChange: (id) => setGenre(id, false)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-6 text-sm text-muted",
			children: [
				hits.length,
				" of ",
				ARTISTS.length,
				" acts"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-10",
			children: grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl tracking-wide text-foreground",
					children: g.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tabular-nums text-subtle",
					children: [
						g.acts.length,
						" · ",
						g.bpm,
						" BPM"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-2",
				children: g.acts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pickArtist(a);
						navigate({ to: "/studio" });
					},
					className: "inline-flex h-11 items-center rounded-full bg-surface px-3 text-xs text-foreground shadow-border transition-[background-color] duration-150 hover:bg-surface-2",
					children: [a.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 text-subtle",
						children: a.country
					})]
				}) }, a.id))
			})] }, g.id))
		}),
		hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl bg-surface p-8 text-sm text-muted shadow-border",
			children: "No acts in that filter."
		}) : null
	] });
}
//#endregion
export { LanesPage as component };
