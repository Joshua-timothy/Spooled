import { n as extractVideoId } from "./youtube-BeaFxecg.mjs";
import { n as Platform, t as Innertube } from "../_libs/youtubei.js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/youtube.server-CoYXWsVI.js
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
var youtube_server_exports = /* @__PURE__ */ __exportAll({
	STREAM_HEADERS: () => STREAM_HEADERS,
	fetchVideoInfo: () => fetchVideoInfo,
	openFormatStream: () => openFormatStream
});
var STREAM_HEADERS = {
	accept: "*/*",
	origin: "https://www.youtube.com",
	referer: "https://www.youtube.com",
	DNT: "?1"
};
var evalInstalled = false;
var tubePromise = null;
function installEval() {
	if (evalInstalled) return;
	Platform.shim.eval = async (data) => new Function(data.output)();
	evalInstalled = true;
}
async function getTube() {
	installEval();
	if (!tubePromise) tubePromise = Innertube.create({ retrieve_player: true }).catch((err) => {
		tubePromise = null;
		throw err;
	});
	return tubePromise;
}
function playabilityMessage(status, reason) {
	if (!status || status === "OK") return null;
	if (status === "LOGIN_REQUIRED") return "This video is age-restricted or private, so it cannot be saved here.";
	if (status === "UNPLAYABLE") return reason?.trim() || "YouTube says this video cannot be played.";
	if (status === "LIVE_STREAM_OFFLINE") return "This live stream is offline.";
	return reason?.trim() || "YouTube refused this video.";
}
function containerOf(mimeType) {
	const type = mimeType.split(";")[0]?.trim() ?? mimeType;
	if (type.includes("webm")) return "webm";
	if (type.includes("audio/mp4")) return "m4a";
	if (type.includes("mp4")) return "mp4";
	return type.split("/")[1] ?? "mp4";
}
function codecsOf(mimeType) {
	return /codecs="([^"]+)"/.exec(mimeType)?.[1] ?? "";
}
function audioLabel(quality, bitrate) {
	const kbps = bitrate ? Math.round(bitrate / 1e3) : null;
	if (quality?.includes("HIGH")) return kbps ? `High · ${kbps} kbps` : "High";
	if (quality?.includes("MEDIUM")) return kbps ? `Medium · ${kbps} kbps` : "Medium";
	if (quality?.includes("LOW")) return kbps ? `Low · ${kbps} kbps` : "Low";
	return kbps ? `${kbps} kbps` : "Audio";
}
function videoScore(mimeType) {
	let score = 0;
	if (mimeType.includes("mp4")) score += 3;
	if (mimeType.includes("avc1")) score += 2;
	if (mimeType.includes("av01")) score += 1;
	return score;
}
function hasDownloadUrl(format) {
	return Boolean(format.url || format.signature_cipher || format.cipher);
}
function pickFormats(raw) {
	const usable = raw.filter((f) => hasDownloadUrl(f) && !f.is_type_otf);
	const combined = [];
	const videoByHeight = /* @__PURE__ */ new Map();
	const audioByItag = /* @__PURE__ */ new Map();
	for (const format of usable) {
		if (format.has_audio && format.has_video) {
			combined.push(toPayload(format, "combined", format.quality_label ?? "360p", true));
			continue;
		}
		if (format.has_video && format.height) {
			const existing = videoByHeight.get(format.height);
			if (!existing || videoScore(format.mime_type) > videoScore(existing.mime_type)) videoByHeight.set(format.height, format);
			continue;
		}
		if (format.has_audio && !format.has_video) audioByItag.set(format.itag, format);
	}
	const video = [...videoByHeight.entries()].sort((a, b) => b[0] - a[0]).map(([, format]) => toPayload(format, "video", format.quality_label ?? `${format.height}p`, false));
	const preferredAudioItags = [
		140,
		251,
		250,
		249,
		139
	];
	const audio = [];
	for (const itag of preferredAudioItags) {
		const format = audioByItag.get(itag);
		if (!format) continue;
		audio.push(toPayload(format, "audio", audioLabel(format.audio_quality, format.bitrate), itag === 140));
	}
	const result = [
		...combined,
		...audio,
		...video
	];
	if (result.length && !result.some((f) => f.recommended)) result[0].recommended = true;
	return result;
}
function toPayload(format, kind, label, recommended) {
	return {
		itag: format.itag,
		kind,
		label,
		container: containerOf(format.mime_type),
		codecs: codecsOf(format.mime_type),
		mimeType: format.mime_type,
		hasAudio: format.has_audio,
		hasVideo: format.has_video,
		fps: format.fps ?? null,
		width: format.width ?? null,
		height: format.height ?? null,
		bitrate: format.bitrate ?? null,
		sizeBytes: format.content_length ?? null,
		recommended
	};
}
function thumbnailUrl(info) {
	const best = [...info.basic_info?.thumbnail ?? []].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
	if (best?.url) return best.url;
	const id = info.basic_info?.id;
	return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}
function collectFormats(info) {
	return [...info.streaming_data?.formats ?? [], ...info.streaming_data?.adaptive_formats ?? []];
}
async function loadInfo(id) {
	const tube = await getTube();
	try {
		const mweb = await tube.getBasicInfo(id, { client: "MWEB" });
		if (collectFormats(mweb).some((f) => hasDownloadUrl(f))) return {
			tube,
			info: mweb
		};
	} catch {}
	return {
		tube,
		info: await tube.getBasicInfo(id)
	};
}
async function fetchVideoInfo(rawUrl) {
	const id = extractVideoId(rawUrl);
	if (!id) throw new Error("That does not look like a YouTube link.");
	const { info } = await loadInfo(id);
	const status = info.playability_status?.status;
	const reason = info.playability_status?.reason;
	const blocked = playabilityMessage(status, reason);
	if (blocked) throw new Error(blocked);
	const basic = info.basic_info;
	if (basic?.is_live) throw new Error("Live streams cannot be saved as a file until they end.");
	const formats = pickFormats(collectFormats(info));
	if (!formats.length) throw new Error("No downloadable files were returned for this video.");
	return {
		id: basic?.id ?? id,
		title: basic?.title ?? "YouTube video",
		author: basic?.author ?? "Unknown channel",
		channelId: basic?.channel_id ?? null,
		duration: basic?.duration ?? 0,
		viewCount: typeof basic?.view_count === "number" ? basic.view_count : null,
		thumbnail: thumbnailUrl(info),
		isLive: Boolean(basic?.is_live),
		formats
	};
}
async function openFormatStream(videoId, itag) {
	if (!extractVideoId(videoId)) throw new Error("Invalid video id.");
	const { tube, info } = await loadInfo(videoId);
	const status = info.playability_status?.status;
	const reason = info.playability_status?.reason;
	const blocked = playabilityMessage(status, reason);
	if (blocked) throw new Error(blocked);
	const format = collectFormats(info).find((item) => item.itag === itag);
	if (!format || !hasDownloadUrl(format)) throw new Error("That quality is no longer available. Fetch the video again.");
	return {
		url: await format.decipher(tube.session.player),
		format,
		title: info.basic_info?.title ?? "video",
		headers: STREAM_HEADERS
	};
}
//#endregion
export { youtube_server_exports as n, openFormatStream as t };
