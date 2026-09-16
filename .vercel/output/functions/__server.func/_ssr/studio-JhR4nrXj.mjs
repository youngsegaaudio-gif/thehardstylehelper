import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Disc3, d as BookmarkCheck, i as RotateCw, l as Copy, n as Settings2, o as LockOpen, s as ExternalLink, u as Bookmark } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as GENRE_LABEL, a as youLocked, f as barsOf, i as useVs, m as youtubeSearch, n as cn, p as discogsSearch } from "./router-BftHCkTq.mjs";
import { t as Button } from "./button-BFSvdKFg.mjs";
import { a as Meta, c as SearchField, i as GenreChips, o as Page, s as PageTitle } from "./site-ui-CjxTnGGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-JhR4nrXj.js
var import_jsx_runtime = require_jsx_runtime();
var FILL = {
	intro: "bg-section-intro",
	break: "bg-section-break",
	build: "bg-section-build",
	drop: "bg-section-drop",
	outro: "bg-section-outro"
};
function PhraseStrip({ phrases, mode }) {
	const bars = barsOf(phrases);
	const units = bars / 16;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: [
					mode === "dj" ? "DJ 4×4" : "Anthem",
					" · ",
					units,
					" phrases · ",
					bars,
					" bars"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "16 = one phrase"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex h-14 overflow-hidden rounded-md",
			children: phrases.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-w-0 flex-col justify-center px-1.5", FILL[p.kind]),
				style: {
					flexGrow: p.bars,
					flexBasis: 0
				},
				title: `${p.bars} ${p.label}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tabular-nums text-foreground",
					children: p.bars
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-xs leading-tight text-muted",
					children: p.label
				})]
			}, `${p.kind}-${i}`))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs leading-relaxed text-subtle",
			children: "Mix on the 1. Every block is a multiple of 16."
		})
	] });
}
function IdeaCard({ idea }) {
	const saved = useVs((s) => s.saved);
	const you = useVs((s) => s.you);
	const lockArtist = useVs((s) => s.lockArtist);
	const lockVocal = useVs((s) => s.lockVocal);
	const lockGenre = useVs((s) => s.lockGenre);
	const roll = useVs((s) => s.roll);
	const saveIdea = useVs((s) => s.saveIdea);
	const copyIdea = useVs((s) => s.copyIdea);
	const unlockArtist = useVs((s) => s.unlockArtist);
	const unlockVocal = useVs((s) => s.unlockVocal);
	const isSaved = saved.some((s) => s.seed === idea.seed);
	const locked = youLocked(you);
	const v = idea.vocal;
	const a = idea.artist;
	const sound = idea.sound;
	const phrases = idea.phrases ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "h-12 flex-1 font-display tracking-wide",
					onClick: () => roll(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-4" }), "Roll idea"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "flex-1 sm:flex-none",
						onClick: () => toast(saveIdea() === "saved" ? "Saved on this device" : "Removed from saved"),
						children: [isSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), isSaved ? "Saved" : "Save"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "flex-1 sm:flex-none",
						onClick: () => void copyIdea().then((ok) => toast(ok ? "Notes copied" : "Could not copy")),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy"]
					})]
				})]
			}),
			(lockArtist || lockVocal || lockGenre || locked) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/sound",
						className: "inline-flex h-11 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-3" }), " Your sound"]
					}) : null,
					lockGenre ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-11 items-center rounded-full bg-surface-2 px-3 text-xs text-muted",
						children: GENRE_LABEL[a.genre]
					}) : null,
					lockArtist ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: unlockArtist,
						className: "inline-flex h-11 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3" }),
							" ",
							a.name
						]
					}) : null,
					lockVocal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: unlockVocal,
						className: "inline-flex h-11 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs text-muted hover:text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3" }),
							" ",
							v.title
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-5 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: "Working title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-3xl leading-none tracking-wide text-foreground sm:text-5xl",
						children: idea.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: idea.concept
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Lane",
								value: `${a.name} · ${GENRE_LABEL[a.genre]}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Grid",
								value: `${idea.bpm} BPM · ${idea.key}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Vocal source",
								value: `${v.artist} — ${v.title} (${v.year})`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Cut",
								value: `${v.from} · ${v.chop}${v.niche ? " · niche" : ""}`
							})
						]
					}),
					sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Kick",
								value: sound.kick
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Bass",
								value: sound.bass
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Hook",
								value: sound.hook
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Vox",
								value: sound.vox
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm leading-relaxed text-foreground",
						children: v.why
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: idea.chopHow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-lg bg-surface-2 p-4",
						children: [
							phrases.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhraseStrip, {
								phrases,
								mode: idea.phraseMode ?? "dj"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-widest text-muted",
								children: "Map"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm leading-relaxed text-foreground",
								children: idea.map
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs font-medium uppercase tracking-widest text-muted",
								children: "Layers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-foreground",
								children: idea.layers.join(" · ")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-6 space-y-2",
						children: idea.process.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm leading-relaxed text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono w-4 shrink-0 text-subtle",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: youtubeSearch(idea.search),
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), "Search YouTube"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: discogsSearch(idea.search),
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disc3, { className: "size-4" }), "Search Discogs"]
							})
						})]
					})
				]
			})
		]
	});
}
function StudioPage() {
	const idea = useVs((s) => s.idea);
	const q = useVs((s) => s.q);
	const setQ = useVs((s) => s.setQ);
	const genre = useVs((s) => s.genre);
	const setGenre = useVs((s) => s.setGenre);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		narrow: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				kicker: "Studio",
				title: "Roll an idea",
				lede: "A vocal from the catalog, mapped onto a hard-dance lane. 16-bar DJ phrases, 90% of the time. Lock a genre below or set your sound first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchField, {
						value: q,
						onChange: setQ,
						placeholder: "Filter the next roll"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenreChips, {
						value: genre,
						onChange: (id) => setGenre(id, id !== "all")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [genre !== "all" ? `Next roll stays in ${GENRE_LABEL[genre]}. ` : "Any lane. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sound",
							className: "text-muted underline-offset-2 hover:text-foreground hover:underline",
							children: "Lock kick, bass, hook"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaCard, { idea })
		]
	});
}
//#endregion
export { StudioPage as component };
