//#region node_modules/.nitro/vite/services/ssr/assets/youtube-BeaFxecg.js
var VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
var YT_HOSTS = /* @__PURE__ */ new Set([
	"youtube.com",
	"m.youtube.com",
	"music.youtube.com",
	"youtube-nocookie.com"
]);
function extractVideoId(raw) {
	const input = raw.trim();
	if (!input) return null;
	if (VIDEO_ID_RE.test(input)) return input;
	let url;
	try {
		url = new URL(input);
	} catch {
		try {
			url = new URL(`https://${input}`);
		} catch {
			return null;
		}
	}
	const host = url.hostname.replace(/^www\./i, "").toLowerCase();
	if (host === "youtu.be") {
		const id = url.pathname.split("/").filter(Boolean)[0]?.slice(0, 11);
		return id && VIDEO_ID_RE.test(id) ? id : null;
	}
	if (!(YT_HOSTS.has(host) || host.endsWith(".youtube.com") || host.endsWith(".youtube-nocookie.com"))) return null;
	const v = url.searchParams.get("v");
	if (v && VIDEO_ID_RE.test(v.slice(0, 11))) return v.slice(0, 11);
	const parts = url.pathname.split("/").filter(Boolean);
	if (parts.length >= 2 && [
		"shorts",
		"embed",
		"live",
		"v",
		"watch"
	].includes(parts[0])) {
		const candidate = parts[1].slice(0, 11);
		if (VIDEO_ID_RE.test(candidate)) return candidate;
	}
	if (parts.length === 1) {
		const candidate = parts[0].slice(0, 11);
		if (VIDEO_ID_RE.test(candidate)) return candidate;
	}
	return null;
}
function extensionFor(format) {
	if (format.kind === "audio") {
		if (format.mimeType.includes("webm") || format.container === "webm") return "webm";
		return "m4a";
	}
	if (format.container === "webm" || format.mimeType.includes("webm")) return "webm";
	return "mp4";
}
function safeFilename(title, format) {
	return `${title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "video"} [${format.kind === "audio" ? format.label.replace(/\s+/g, "-") : format.label}].${extensionFor(format)}`;
}
//#endregion
export { extractVideoId as n, safeFilename as r, extensionFor as t };
