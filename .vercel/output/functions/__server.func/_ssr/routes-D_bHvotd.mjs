import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as ArrowRight } from "../_libs/lucide-react.mjs";
import { g as GENRES, h as ARTISTS, i as useVs, r as FEATURED, v as VOCALS, y as VOCAL_STYLES } from "./router-BftHCkTq.mjs";
import { t as Button } from "./button-BFSvdKFg.mjs";
import { r as Eyebrow, u as VocalCard } from "./site-ui-CjxTnGGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D_bHvotd.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	const pickVocal = useVs((s) => s.pickVocal);
	const setStyle = useVs((s) => s.setStyle);
	const setGenre = useVs((s) => s.setGenre);
	const cover = FEATURED[0];
	const rest = FEATURED.slice(1, 7);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hs-staff pointer-events-none absolute inset-x-0 top-10 h-16 opacity-30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eyebrow, { children: [
						VOCALS.length,
						" sample vocals · ",
						ARTISTS.length,
						" lanes · 90s–now"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-4 max-w-3xl text-4xl leading-none tracking-wide text-foreground sm:text-6xl",
						children: "Vocals people chop into hardstyle."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg",
						children: "Not hardstyle tracks. Eurodance, house, trance, 90s happy, hands-up — titles and years. You source and clear the chop."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "h-12 font-display tracking-wide",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/catalog",
								children: ["Browse the catalog", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "h-12",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/studio",
								children: "Open the studio"
							})
						})]
					})
				]
			})]
		}),
		cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl content-start items-start gap-5 px-4 py-10 sm:grid-cols-2 sm:items-end sm:gap-10 sm:px-6 sm:py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Cover cut" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono mt-3 text-xs tabular-nums text-subtle",
						children: cover.year
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-3xl leading-none tracking-wide text-foreground sm:text-5xl",
						children: cover.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: cover.artist
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base leading-relaxed text-foreground",
						children: cover.why
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							cover.from,
							" · ",
							cover.chop,
							" · the kind of vocal a hardstyle break actually wants."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6",
						onClick: () => {
							pickVocal(cover);
							navigate({ to: "/studio" });
						},
						children: "Roll this into a track"
					})
				] })]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "From the catalog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-2xl tracking-wide text-foreground sm:text-3xl",
						children: "Cuts people actually sample"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/catalog",
						className: "hidden text-sm text-muted hover:text-foreground sm:inline",
						children: [
							"All ",
							VOCALS.length,
							" →"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: rest.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VocalCard, {
						v,
						onPick: (picked) => {
							pickVocal(picked);
							navigate({ to: "/studio" });
						}
					}) }, v.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/catalog",
					className: "mt-6 inline-flex h-11 items-center text-sm text-muted hover:text-foreground sm:hidden",
					children: [
						"All ",
						VOCALS.length,
						" vocals →"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 sm:py-16",
				children: [
					{
						n: "01",
						t: "Find a vocal",
						d: "Browse eurodance, house, trance, 90s happy. Tap a title. No lyrics, no audio — just what to look for."
					},
					{
						n: "02",
						t: "Roll a lane",
						d: "Studio maps it onto a hard-dance act: kick, bass, hook, 16-bar DJ phrases. 90% of rolls stay 4×4."
					},
					{
						n: "03",
						t: "Source it yourself",
						d: "YouTube and Discogs search the title and year. You sample and clear it. This is a starting point, not a pack."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tabular-nums text-subtle",
						children: s.n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display mt-2 text-xl tracking-wide text-foreground",
						children: s.t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: s.d
					})
				] }, s.n))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Styles in the pile" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-2xl tracking-wide text-foreground sm:text-3xl",
					children: "Filter the catalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 flex flex-wrap gap-2",
					children: VOCAL_STYLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						onClick: () => setStyle(s.id),
						className: "inline-flex h-11 items-center rounded-full bg-surface px-4 text-sm text-foreground shadow-border hover:bg-surface-2",
						children: s.label
					}) }, s.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Write into these" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-2xl tracking-wide text-foreground sm:text-3xl",
						children: "500 production lanes"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/lanes",
						className: "text-sm text-muted hover:text-foreground",
						children: "All lanes →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
					children: GENRES.map((g) => {
						const n = ARTISTS.filter((a) => a.genre === g.id).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/lanes",
							onClick: () => setGenre(g.id, false),
							className: "block rounded-xl bg-surface p-4 shadow-border transition-[background-color] duration-150 hover:bg-surface-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg tracking-wide text-foreground",
								children: g.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-xs tabular-nums text-muted",
								children: [
									n,
									" acts · ",
									g.bpm,
									" BPM"
								]
							})]
						}) }, g.id);
					})
				})]
			})
		})
	] });
}
//#endregion
export { Home as component };
