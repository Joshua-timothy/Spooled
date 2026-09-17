const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

const YT_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

export type FormatKind = "combined" | "video" | "audio";

export type VideoFormat = {
  itag: number;
  kind: FormatKind;
  label: string;
  container: string;
  codecs: string;
  mimeType: string;
  hasAudio: boolean;
  hasVideo: boolean;
  fps: number | null;
  width: number | null;
  height: number | null;
  bitrate: number | null;
  sizeBytes: number | null;
  recommended: boolean;
};

export type VideoInfoPayload = {
  id: string;
  title: string;
  author: string;
  channelId: string | null;
  duration: number;
  viewCount: number | null;
  thumbnail: string;
  isLive: boolean;
  formats: VideoFormat[];
};

export function extractVideoId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  if (VIDEO_ID_RE.test(input)) return input;

  let url: URL;
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

  const isYouTube =
    YT_HOSTS.has(host) ||
    host.endsWith(".youtube.com") ||
    host.endsWith(".youtube-nocookie.com");
  if (!isYouTube) return null;

  const v = url.searchParams.get("v");
  if (v && VIDEO_ID_RE.test(v.slice(0, 11))) return v.slice(0, 11);

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && ["shorts", "embed", "live", "v", "watch"].includes(parts[0])) {
    const candidate = parts[1].slice(0, 11);
    if (VIDEO_ID_RE.test(candidate)) return candidate;
  }
  if (parts.length === 1) {
    const candidate = parts[0].slice(0, 11);
    if (VIDEO_ID_RE.test(candidate)) return candidate;
  }

  return null;
}

export function extensionFor(format: Pick<VideoFormat, "container" | "kind" | "mimeType">): string {
  if (format.kind === "audio") {
    if (format.mimeType.includes("webm") || format.container === "webm") return "webm";
    return "m4a";
  }
  if (format.container === "webm" || format.mimeType.includes("webm")) return "webm";
  return "mp4";
}

export function safeFilename(title: string, format: VideoFormat): string {
  const base = title
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "video";
  const tag = format.kind === "audio" ? format.label.replace(/\s+/g, "-") : format.label;
  return `${base} [${tag}].${extensionFor(format)}`;
}
