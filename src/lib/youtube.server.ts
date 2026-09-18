import { Innertube, Platform } from "youtubei.js";
import {
  extractVideoId,
  type VideoFormat,
  type VideoInfoPayload,
} from "@/lib/youtube";

let evalInstalled = false;
let tubePromise: Promise<Innertube> | null = null;
let tubeCreatedAt = 0;
const TUBE_TTL_MS = 8 * 60 * 1000;

function installEval() {
  if (evalInstalled) return;
  Platform.shim.eval = async (data) => new Function(data.output)();
  evalInstalled = true;
}

async function getTube(force = false): Promise<Innertube> {
  installEval();
  if (force || !tubePromise || Date.now() - tubeCreatedAt > TUBE_TTL_MS) {
    tubePromise = Innertube.create({ retrieve_player: true })
      .then((tube) => {
        tubeCreatedAt = Date.now();
        return tube;
      })
      .catch((err) => {
        tubePromise = null;
        throw err;
      });
  }
  return tubePromise;
}

function playabilityMessage(status?: string, reason?: string): string | null {
  if (!status || status === "OK") return null;
  if (status === "LOGIN_REQUIRED") {
    return "This video is age-restricted or private, so it cannot be saved here.";
  }
  if (status === "UNPLAYABLE") {
    return reason?.trim() || "YouTube says this video cannot be played.";
  }
  if (status === "LIVE_STREAM_OFFLINE") {
    return "This live stream is offline.";
  }
  return reason?.trim() || "YouTube refused this video.";
}

function containerOf(mimeType: string): string {
  const type = mimeType.split(";")[0]?.trim() ?? mimeType;
  if (type.includes("webm")) return "webm";
  if (type.includes("audio/mp4")) return "m4a";
  if (type.includes("mp4")) return "mp4";
  return type.split("/")[1] ?? "mp4";
}

function codecsOf(mimeType: string): string {
  const match = /codecs="([^"]+)"/.exec(mimeType);
  return match?.[1] ?? "";
}

function audioLabel(quality?: string, bitrate?: number): string {
  const kbps = bitrate ? Math.round(bitrate / 1000) : null;
  if (quality?.includes("HIGH")) return kbps ? `High · ${kbps} kbps` : "High";
  if (quality?.includes("MEDIUM")) return kbps ? `Medium · ${kbps} kbps` : "Medium";
  if (quality?.includes("LOW")) return kbps ? `Low · ${kbps} kbps` : "Low";
  return kbps ? `${kbps} kbps` : "Audio";
}

function videoScore(mimeType: string): number {
  let score = 0;
  if (mimeType.includes("mp4")) score += 3;
  if (mimeType.includes("avc1")) score += 2;
  if (mimeType.includes("av01")) score += 1;
  return score;
}

export type RawFormat = {
  itag: number;
  url?: string;
  signature_cipher?: string;
  cipher?: string;
  mime_type: string;
  has_audio: boolean;
  has_video: boolean;
  quality_label?: string;
  quality?: string;
  audio_quality?: string;
  fps?: number;
  width?: number;
  height?: number;
  bitrate: number;
  content_length?: number;
  is_type_otf?: boolean;
  decipher: (player: unknown) => Promise<string>;
};

function hasDownloadUrl(format: RawFormat): boolean {
  return Boolean(format.url || format.signature_cipher || format.cipher);
}

function pickFormats(raw: RawFormat[]): VideoFormat[] {
  const usable = raw.filter((f) => hasDownloadUrl(f) && !f.is_type_otf);

  const combined: VideoFormat[] = [];
  const videoByHeight = new Map<number, RawFormat>();
  const audioByItag = new Map<number, RawFormat>();

  for (const format of usable) {
    if (format.has_audio && format.has_video) {
      combined.push(toPayload(format, "combined", format.quality_label ?? "360p", true));
      continue;
    }
    if (format.has_video && format.height) {
      const existing = videoByHeight.get(format.height);
      if (!existing || videoScore(format.mime_type) > videoScore(existing.mime_type)) {
        videoByHeight.set(format.height, format);
      }
      continue;
    }
    if (format.has_audio && !format.has_video) {
      audioByItag.set(format.itag, format);
    }
  }

  const video = [...videoByHeight.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, format]) =>
      toPayload(format, "video", format.quality_label ?? `${format.height}p`, false),
    );

  const preferredAudioItags = [140, 251, 250, 249, 139];
  const audio: VideoFormat[] = [];
  for (const itag of preferredAudioItags) {
    const format = audioByItag.get(itag);
    if (!format) continue;
    audio.push(toPayload(format, "audio", audioLabel(format.audio_quality, format.bitrate), false));
  }

  const result = [...combined, ...audio, ...video];
  if (result.length && !result.some((f) => f.recommended)) {
    result[0].recommended = true;
  }
  return result;
}

function toPayload(
  format: RawFormat,
  kind: VideoFormat["kind"],
  label: string,
  recommended: boolean,
): VideoFormat {
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
    recommended,
  };
}

function thumbnailUrl(info: {
  basic_info?: {
    thumbnail?: Array<{ url: string; width?: number; height?: number }>;
    id?: string;
  };
}): string {
  const thumbs = info.basic_info?.thumbnail ?? [];
  const best = [...thumbs].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
  if (best?.url) return best.url;
  const id = info.basic_info?.id;
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

function collectFormats(info: {
  streaming_data?: { formats?: RawFormat[]; adaptive_formats?: RawFormat[] };
}): RawFormat[] {
  return [
    ...(info.streaming_data?.formats ?? []),
    ...(info.streaming_data?.adaptive_formats ?? []),
  ];
}

async function loadInfo(id: string, force = false) {
  const tube = await getTube(force);
  try {
    const mweb = await tube.getBasicInfo(id, { client: "MWEB" });
    if (collectFormats(mweb as never).some((f) => hasDownloadUrl(f))) return { tube, info: mweb };
  } catch {
    // Fall through to the default client.
  }
  const info = await tube.getBasicInfo(id);
  return { tube, info };
}

async function fetchMedia(url: string, range?: { start: number; end?: number }) {
  const headers: Record<string, string> = { accept: "*/*" };
  if (range) headers.range = `bytes=${range.start}-${range.end ?? ""}`;
  return fetch(url, { headers, redirect: "follow" });
}

function streamBlocked(status: number) {
  return !Number.isFinite(status) || (status !== 200 && status !== 206);
}

export async function fetchVideoInfo(rawUrl: string): Promise<VideoInfoPayload> {
  const id = extractVideoId(rawUrl);
  if (!id) throw new Error("That does not look like a YouTube link.");

  const { info } = await loadInfo(id);
  const status = info.playability_status?.status;
  const reason = info.playability_status?.reason;
  const blocked = playabilityMessage(status, reason);
  if (blocked) throw new Error(blocked);

  const basic = info.basic_info;
  if (basic?.is_live) {
    throw new Error("Live streams cannot be saved as a file until they end.");
  }

  const formats = pickFormats(collectFormats(info as never));
  if (!formats.length) {
    throw new Error("No downloadable files were returned for this video.");
  }

  return {
    id: basic?.id ?? id,
    title: basic?.title ?? "YouTube video",
    author: basic?.author ?? "Unknown channel",
    channelId: basic?.channel_id ?? null,
    duration: basic?.duration ?? 0,
    viewCount: typeof basic?.view_count === "number" ? basic.view_count : null,
    thumbnail: thumbnailUrl(info as never),
    isLive: Boolean(basic?.is_live),
    formats,
  };
}

export async function openFormatStream(
  videoId: string,
  itag: number,
  range?: { start: number; end?: number },
) {
  if (!extractVideoId(videoId)) throw new Error("Invalid video id.");

  const tryOnce = async (force: boolean) => {
    const { tube, info } = await loadInfo(videoId, force);
    const status = info.playability_status?.status;
    const reason = info.playability_status?.reason;
    const blocked = playabilityMessage(status, reason);
    if (blocked) throw new Error(blocked);

    const format = collectFormats(info as never).find((item) => item.itag === itag);
    if (!format || !hasDownloadUrl(format)) {
      throw new Error("That quality is no longer available. Fetch the video again.");
    }

    const mediaUrl = await format.decipher(tube.session.player);
    const response = await fetchMedia(mediaUrl, range);
    return {
      response,
      format,
      title: info.basic_info?.title ?? "video",
    };
  };

  let opened = await tryOnce(false);
  if (streamBlocked(opened.response.status)) {
    await opened.response.body?.cancel().catch(() => undefined);
    opened = await tryOnce(true);
  }
  if (streamBlocked(opened.response.status)) {
    throw new Error("YouTube blocked this file stream. Try another quality, or a different video.");
  }
  if (!opened.response.body) {
    throw new Error("No file stream was returned.");
  }

  return {
    stream: opened.response.body,
    format: opened.format,
    title: opened.title,
    status: opened.response.status,
    contentType: opened.response.headers.get("content-type"),
    contentLength: opened.response.headers.get("content-length"),
    contentRange: opened.response.headers.get("content-range"),
  };
}
