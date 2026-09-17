import { i as __toESM } from "../_runtime.mjs";
import { n as extractVideoId, r as safeFilename } from "./youtube-BeaFxecg.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { a as Music2, c as Download, i as Play, l as ClipboardPaste, o as LoaderCircle, r as RotateCcw, s as Film, t as Volume2, u as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bzq7IL5P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatDuration(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = s % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
	return `${m}:${String(sec).padStart(2, "0")}`;
}
function formatViews(n) {
	if (n >= 1e9) return `${trimNum(n / 1e9)}B`;
	if (n >= 1e6) return `${trimNum(n / 1e6)}M`;
	if (n >= 1e3) return `${trimNum(n / 1e3)}K`;
	return new Intl.NumberFormat("en-US").format(n);
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1048576) return `${Math.round(n / 1024)} KB`;
	if (n < 1073741824) {
		const mb = n / 1048576;
		return `${mb >= 10 ? mb.toFixed(0) : mb.toFixed(1)} MB`;
	}
	return `${(n / 1073741824).toFixed(1)} GB`;
}
function trimNum(n) {
	return n.toFixed(n >= 10 ? 0 : 1).replace(/\.0$/, "");
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-elevated text-muted-foreground shadow-border",
		solid: "bg-primary text-primary-foreground",
		outline: "text-muted-foreground shadow-border"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-border hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground shadow-border hover:bg-secondary/80",
			outline: "bg-transparent text-foreground shadow-border hover:bg-elevated",
			ghost: "text-muted-foreground hover:bg-elevated hover:text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-12 w-full rounded-md bg-elevated px-4 text-base text-foreground shadow-border transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-elevated", className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupVideo = createServerFn({ method: "POST" }).validator(object({ url: string().trim().min(1, "Paste a YouTube link first.").max(500, "That link is too long.") })).handler(createSsrRpc("835248d63e4c31f233e4e95735253e7bdf5944a361783774a56c6dc70f15e0fd"));
var KEY = "spooled:recent";
var MAX = 8;
function readRecent() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
	} catch {
		return [];
	}
}
function writeRecent(items) {
	window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}
function rememberVideo(info) {
	const items = [{
		id: info.id,
		title: info.title,
		author: info.author,
		thumbnail: info.thumbnail,
		duration: info.duration,
		fetchedAt: Date.now()
	}, ...readRecent().filter((item) => item.id !== info.id)];
	writeRecent(items);
	return items;
}
function clearRecent() {
	window.localStorage.removeItem(KEY);
}
var EXAMPLE_URL = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	return "Could not fetch that video.";
}
function downloadUrl(id, itag, attachment) {
	const params = new URLSearchParams({
		v: id,
		itag: String(itag)
	});
	if (attachment) params.set("dl", "1");
	return `/api/download?${params.toString()}`;
}
function kindMeta(kind) {
	if (kind === "combined") return {
		title: "With sound",
		hint: "Ready-to-play file with picture and audio muxed together."
	};
	if (kind === "audio") return {
		title: "Audio only",
		hint: "The soundtrack, saved as a standalone file."
	};
	return {
		title: "Video only",
		hint: "Higher resolutions from YouTube are picture-only. Pair with an audio file if you need sound."
	};
}
function Downloader() {
	const [url, setUrl] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [info, setInfo] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [previewing, setPreviewing] = (0, import_react.useState)(false);
	const [download, setDownload] = (0, import_react.useState)(null);
	const [doneItag, setDoneItag] = (0, import_react.useState)(null);
	const abortRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setRecent(readRecent());
	}, []);
	const combined = (0, import_react.useMemo)(() => info?.formats.find((format) => format.kind === "combined") ?? null, [info]);
	async function fetchInfo(raw) {
		const trimmed = raw.trim();
		if (!trimmed) {
			setError("Paste a YouTube link first.");
			return;
		}
		if (!extractVideoId(trimmed)) {
			setError("That does not look like a YouTube link.");
			return;
		}
		abortRef.current?.abort();
		setLoading(true);
		setError(null);
		setPreviewing(false);
		setDownload(null);
		setDoneItag(null);
		try {
			const payload = await lookupVideo({ data: { url: trimmed } });
			setInfo(payload);
			setRecent(rememberVideo(payload));
			setUrl(`https://www.youtube.com/watch?v=${payload.id}`);
		} catch (err) {
			setInfo(null);
			setError(errorMessage(err));
		} finally {
			setLoading(false);
		}
	}
	async function handleSubmit(event) {
		event.preventDefault();
		await fetchInfo(url);
	}
	async function pasteFromClipboard() {
		try {
			const text = await navigator.clipboard.readText();
			if (!text.trim()) {
				toast.error("Clipboard is empty.");
				return;
			}
			setUrl(text.trim());
			await fetchInfo(text);
		} catch {
			toast.error("Clipboard access was blocked. Paste the link into the field instead.");
		}
	}
	async function saveFormat(format) {
		if (!info) return;
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;
		setDownload({
			itag: format.itag,
			received: 0,
			total: format.sizeBytes
		});
		setDoneItag(null);
		const filename = safeFilename(info.title, format);
		const large = (format.sizeBytes ?? 0) > 125829120;
		try {
			if (large) {
				const anchor = document.createElement("a");
				anchor.href = downloadUrl(info.id, format.itag, true);
				anchor.download = filename;
				document.body.appendChild(anchor);
				anchor.click();
				anchor.remove();
				setDownload(null);
				setDoneItag(format.itag);
				toast.success("The browser is saving the file.");
				return;
			}
			const response = await fetch(downloadUrl(info.id, format.itag, true), { signal: controller.signal });
			if (!response.ok) {
				let message = "Download failed.";
				try {
					const body = await response.json();
					if (body.error) message = body.error;
				} catch {}
				throw new Error(message);
			}
			const total = Number(response.headers.get("content-length")) || format.sizeBytes;
			const headerName = response.headers.get("x-spooled-filename");
			const name = headerName ? decodeURIComponent(headerName) : filename;
			const reader = response.body?.getReader();
			if (!reader) throw new Error("No file stream was returned.");
			const chunks = [];
			let received = 0;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) {
					chunks.push(value);
					received += value.byteLength;
					setDownload({
						itag: format.itag,
						received,
						total
					});
				}
			}
			const blob = new Blob(chunks, { type: format.mimeType.split(";")[0] });
			const objectUrl = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = objectUrl;
			anchor.download = name;
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(objectUrl);
			setDoneItag(format.itag);
			toast.success("Saved to your downloads.");
		} catch (err) {
			if (err.name === "AbortError") return;
			toast.error(errorMessage(err));
		} finally {
			setDownload(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 sm:pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpoolMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tracking-tight text-foreground",
						children: "Spooled"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-xs text-muted-foreground sm:block",
					children: "Personal offline copies"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "stagger-in flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "YouTube to your device"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl leading-tight tracking-[-0.03em] text-foreground sm:text-5xl",
						children: "Save the video. Keep the file."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-base leading-relaxed text-muted-foreground",
						children: "Paste a YouTube, Shorts, or youtu.be link. Spooled fetches the file and downloads it directly to this device — no account, no queue."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: handleSubmit,
				className: "rounded-xl bg-card p-2 shadow-border sm:p-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "youtube-url",
							className: "sr-only",
							children: "YouTube link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "youtube-url",
							value: url,
							onChange: (event) => setUrl(event.target.value),
							placeholder: "https://www.youtube.com/watch?v=",
							autoComplete: "off",
							autoCapitalize: "off",
							spellCheck: false,
							className: "h-12 flex-1 border-0 bg-transparent shadow-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								className: "flex-1 sm:flex-none",
								onClick: pasteFromClipboard,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, {}), "Paste"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "flex-1 sm:min-w-28 sm:flex-none",
								disabled: loading,
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {}), loading ? "Fetching" : "Fetch"]
							})]
						})
					]
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "alert",
				className: "rounded-lg bg-card px-4 py-3 text-sm text-destructive shadow-border",
				children: error
			}) : null,
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultSkeleton, {}) : null,
			info && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-xl bg-card shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-0 sm:grid-cols-[220px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-video bg-elevated sm:aspect-auto sm:min-h-full",
							children: [info.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: info.thumbnail,
								alt: "",
								className: "absolute inset-0 size-full object-cover"
							}) : null, info.duration ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute bottom-2 right-2 rounded-sm bg-background/85 px-1.5 py-0.5 font-mono text-xs tabular-nums text-foreground",
								children: formatDuration(info.duration)
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 p-4 sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium leading-snug tracking-tight",
									children: info.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: info.author }), info.viewCount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [formatViews(info.viewCount), " views"]
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-2",
									children: [combined ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "secondary",
										size: "sm",
										onClick: () => setPreviewing((open) => !open),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5" }), previewing ? "Hide preview" : "Preview"]
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `https://www.youtube.com/watch?v=${info.id}`,
											target: "_blank",
											rel: "noreferrer",
											children: "Open on YouTube"
										})
									})]
								})
							]
						})]
					}),
					previewing && combined ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border bg-background p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							className: "aspect-video w-full rounded-md bg-background",
							src: downloadUrl(info.id, combined.itag, false),
							controls: true,
							playsInline: true,
							preload: "metadata"
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-8 border-t border-border px-4 py-5 sm:px-5",
						children: [
							"combined",
							"audio",
							"video"
						].map((kind) => {
							const formats = info.formats.filter((format) => format.kind === kind);
							if (!formats.length) return null;
							const meta = kindMeta(kind);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium text-foreground",
									children: meta.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: meta.hint
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "flex flex-col gap-2",
									children: formats.map((format) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormatRow, {
										format,
										busy: download?.itag === format.itag,
										done: doneItag === format.itag,
										progress: download?.itag === format.itag ? download : null,
										onSave: () => void saveFormat(format)
									}, format.itag))
								})]
							}, kind);
						})
					})
				]
			}) : null,
			!info && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					{
						n: "01",
						t: "Paste",
						d: "Drop in any watch, Shorts, or youtu.be URL."
					},
					{
						n: "02",
						t: "Pick",
						d: "Choose a file with sound, audio only, or a higher-res picture."
					},
					{
						n: "03",
						t: "Save",
						d: "The file lands in your downloads folder. Nothing is stored on a server."
					}
				].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-card px-4 py-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tabular-nums text-muted-foreground",
							children: step.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-medium",
							children: step.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted-foreground",
							children: step.d
						})
					]
				}, step.n))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Need a test clip?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => {
						setUrl(EXAMPLE_URL);
						fetchInfo(EXAMPLE_URL);
					},
					children: "Try Big Buck Bunny"
				})]
			}),
			recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-foreground",
						children: "Recent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						onClick: () => {
							clearRecent();
							setRecent([]);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Clear"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: recent.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							const next = `https://www.youtube.com/watch?v=${item.id}`;
							setUrl(next);
							fetchInfo(next);
						},
						className: "flex w-full items-center gap-3 rounded-lg bg-card p-2 text-left shadow-border transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-border-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative size-14 shrink-0 overflow-hidden rounded-sm bg-elevated",
							children: item.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.thumbnail,
								alt: "",
								className: "size-full object-cover"
							}) : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-0.5 block truncate text-xs text-muted-foreground",
								children: [item.author, item.duration ? ` · ${formatDuration(item.duration)}` : ""]
							})]
						})]
					}) }, item.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground",
				children: "Spooled saves a copy to this device for personal offline playback. Only download videos you have the right to keep. YouTube and the play button logo are trademarks of Google LLC."
			})
		]
	});
}
function FormatRow({ format, busy, done, progress, onSave }) {
	const pct = progress && progress.total ? Math.min(100, Math.round(progress.received / progress.total * 100)) : null;
	const Icon = format.kind === "audio" ? Volume2 : format.kind === "combined" ? Music2 : Film;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3 rounded-md bg-elevated px-3 py-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground sm:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tabular-nums",
							children: format.label
						}), format.recommended ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "solid",
							children: "Best with sound"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 truncate text-xs text-muted-foreground",
						children: [
							format.container.toUpperCase(),
							format.codecs ? ` · ${format.codecs.split(",")[0]}` : "",
							format.fps ? ` · ${format.fps} fps` : "",
							format.sizeBytes ? ` · ${formatBytes(format.sizeBytes)}` : ""
						]
					}),
					busy && pct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-1 overflow-hidden rounded-full bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-[width] duration-[var(--motion-quick)]",
							style: { width: `${pct}%` }
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: format.recommended ? "default" : "outline",
				disabled: busy,
				onClick: onSave,
				className: "shrink-0",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), busy ? pct != null ? `${pct}%` : "Saving" : done ? "Saved" : "Save"]
			})
		]
	});
}
function ResultSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl bg-card shadow-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid sm:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-video rounded-none sm:aspect-auto sm:min-h-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-4/5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-28" })
				]
			})]
		})
	});
}
function SpoolMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-7",
		"aria-hidden": "true",
		fill: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "12",
				className: "stroke-primary",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "3.4",
				className: "fill-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "6.8",
				r: "1.2",
				className: "fill-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "25.2",
				r: "1.2",
				className: "fill-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "6.8",
				cy: "16",
				r: "1.2",
				className: "fill-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "25.2",
				cy: "16",
				r: "1.2",
				className: "fill-primary"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Downloader, {})
	});
}
//#endregion
export { Home as component };
