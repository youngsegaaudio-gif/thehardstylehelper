import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as RotateCw } from "../_libs/lucide-react.mjs";
import { c as KEYS, d as VOX_OPTS, i as useVs, l as KICK_OPTS, o as BASS_OPTS, s as HOOK_OPTS, u as PHRASE_OPTS } from "./router-BftHCkTq.mjs";
import { t as Button } from "./button-BFSvdKFg.mjs";
import { o as Page, s as PageTitle, t as Chip } from "./site-ui-CjxTnGGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sound-DAHPWoEq.js
var import_jsx_runtime = require_jsx_runtime();
function SoundPage() {
	const navigate = useNavigate();
	const you = useVs((s) => s.you);
	const persistYou = useVs((s) => s.persistYou);
	const resetYou = useVs((s) => s.resetYou);
	const roll = useVs((s) => s.roll);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		narrow: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				kicker: "Your sound",
				title: "Lock the next roll",
				lede: "Mix keeps DJ 4×4 phrases 90% of the time. Anything left on Any stays random."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "h-12 flex-1 font-display tracking-wide",
					onClick: () => {
						roll();
						navigate({ to: "/studio" });
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-4" }), "Roll with this"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-12",
					onClick: resetYou,
					children: "Reset"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Phrases",
						children: [PHRASE_OPTS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.phrases === o.id,
							onClick: () => persistYou({ phrases: o.id }),
							children: o.label
						}, o.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "w-full pt-1 text-xs text-subtle",
							children: PHRASE_OPTS.find((o) => o.id === you.phrases)?.hint
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kick",
						children: KICK_OPTS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.kick === o.id,
							onClick: () => persistYou({ kick: o.id }),
							children: o.label
						}, o.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bass",
						children: BASS_OPTS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.bass === o.id,
							onClick: () => persistYou({ bass: o.id }),
							children: o.label
						}, o.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Hook",
						children: HOOK_OPTS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.hook === o.id,
							onClick: () => persistYou({ hook: o.id }),
							children: o.label
						}, o.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vox",
						children: VOX_OPTS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.vox === o.id,
							onClick: () => persistYou({ vox: o.id }),
							children: o.label
						}, o.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Key",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.key === "any",
							onClick: () => persistYou({ key: "any" }),
							children: "Any"
						}), KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: you.key === k,
							onClick: () => persistYou({ key: k }),
							children: k.replace(" minor", " min")
						}, k))]
					})
				]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-border sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-widest text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children
		})]
	});
}
//#endregion
export { SoundPage as component };
