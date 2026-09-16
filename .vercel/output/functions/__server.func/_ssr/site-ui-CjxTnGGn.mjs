import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Search } from "../_libs/lucide-react.mjs";
import { g as GENRES, n as cn, y as VOCAL_STYLES } from "./router-BftHCkTq.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md bg-surface-2 px-3 text-sm text-foreground shadow-border", "placeholder:text-subtle", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:opacity-40", className),
		...props
	});
}
var ERAS = [
	{
		id: "all",
		label: "All eras"
	},
	{
		id: "90s",
		label: "90s"
	},
	{
		id: "00s",
		label: "00s"
	},
	{
		id: "10s",
		label: "10s"
	},
	{
		id: "20s",
		label: "20s"
	}
];
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-11 shrink-0 items-center rounded-full px-3.5 text-xs font-medium transition-[background-color,color] duration-150", active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted shadow-border hover:text-foreground"),
		children
	});
}
function Eyebrow({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-medium uppercase tracking-widest text-muted",
		children
	});
}
function Page({ children, narrow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto w-full px-4 py-8 sm:px-6 sm:py-12", narrow ? "max-w-3xl" : "max-w-6xl"),
		children
	});
}
function PageTitle({ kicker, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-8 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: kicker }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-3xl leading-none tracking-wide text-foreground sm:text-5xl",
				children: title
			}),
			lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed text-muted",
				children: lede
			}) : null
		]
	});
}
function SearchField({ value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "pl-10",
			"aria-label": "Search"
		})]
	});
}
function StyleChips({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: value === "all",
			onClick: () => onChange("all"),
			children: "All styles"
		}), VOCAL_STYLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: value === s.id,
			onClick: () => onChange(value === s.id ? "all" : s.id),
			children: s.label
		}, s.id))]
	});
}
function GenreChips({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: value === "all",
			onClick: () => onChange("all"),
			children: "All lanes"
		}), GENRES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: value === g.id,
			onClick: () => onChange(value === g.id ? "all" : g.id),
			children: g.label
		}, g.id))]
	});
}
function EraChips({ era, nicheOnly, onEra, onNiche }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [ERAS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: era === e.id,
			onClick: () => onEra(e.id),
			children: e.label
		}, e.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: nicheOnly,
			onClick: onNiche,
			children: "Niche cuts"
		})]
	});
}
function VocalCard({ v, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onPick(v),
		className: "flex h-full w-full flex-col rounded-xl bg-surface p-4 text-left shadow-border transition-[background-color,box-shadow] duration-150 hover:bg-surface-2 hover:shadow-border-hover",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold leading-snug text-foreground",
					children: v.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono shrink-0 text-xs tabular-nums text-subtle",
					children: v.year
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 text-xs text-muted",
				children: v.artist
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-3 flex flex-wrap gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-surface-3 px-2 py-0.5 text-xs uppercase tracking-wide text-muted",
					children: v.era
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-surface-3 px-2 py-0.5 text-xs uppercase tracking-wide text-muted",
					children: v.from
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-3 line-clamp-2 text-xs leading-relaxed text-muted",
				children: v.why
			})
		]
	});
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs font-medium uppercase tracking-widest text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5 text-sm leading-snug text-foreground",
		children: value
	})] });
}
//#endregion
export { Meta as a, SearchField as c, GenreChips as i, StyleChips as l, EraChips as n, Page as o, Eyebrow as r, PageTitle as s, Chip as t, VocalCard as u };
