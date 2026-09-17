import { createFileRoute } from "@tanstack/react-router";
import { extensionFor, extractVideoId, safeFilename, type VideoFormat } from "@/lib/youtube";
import { openFormatStream } from "@/lib/youtube.server";

function asciiFilename(name: string): string {
  return name.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "");
}

function disposition(filename: string, attachment: boolean): string {
  const type = attachment ? "attachment" : "inline";
  const encoded = encodeURIComponent(filename).replace(/'/g, "%27");
  return `${type}; filename="${asciiFilename(filename)}"; filename*=UTF-8''${encoded}`;
}

function asVideoFormat(format: {
  itag: number;
  mime_type: string;
  has_audio: boolean;
  has_video: boolean;
  quality_label?: string;
  audio_quality?: string;
}): VideoFormat {
  const kind = format.has_audio && format.has_video ? "combined" : format.has_audio ? "audio" : "video";
  const container = format.mime_type.includes("webm")
    ? "webm"
    : format.mime_type.includes("audio/mp4")
      ? "m4a"
      : "mp4";
  return {
    itag: format.itag,
    kind,
    label: format.quality_label ?? format.audio_quality ?? String(format.itag),
    container,
    codecs: "",
    mimeType: format.mime_type,
    hasAudio: format.has_audio,
    hasVideo: format.has_video,
    fps: null,
    width: null,
    height: null,
    bitrate: null,
    sizeBytes: null,
    recommended: false,
  };
}

function parseRange(header: string | null): { start: number; end?: number } | undefined {
  if (!header) return undefined;
  const match = /^bytes=(\d+)-(\d+)?$/i.exec(header.trim());
  if (!match) return undefined;
  return { start: Number(match[1]), end: match[2] ? Number(match[2]) : undefined };
}

async function handleDownload({ request }: { request: Request }) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v") ?? "";
  const itag = Number(url.searchParams.get("itag"));
  const attachment = url.searchParams.get("dl") === "1";

  if (!extractVideoId(videoId) || !Number.isInteger(itag) || itag <= 0) {
    return Response.json({ error: "Missing video or quality." }, { status: 400 });
  }

  const range = parseRange(request.headers.get("range"));

  try {
    const opened = await openFormatStream(videoId, itag, range);
    const format = asVideoFormat(opened.format);
    const filename = safeFilename(opened.title, format);
    const mime = format.mimeType.split(";")[0] || "application/octet-stream";
    const total = opened.format.content_length;

    const out = new Headers();
    out.set("content-type", mime);
    out.set("content-disposition", disposition(filename, attachment));
    out.set("cache-control", "no-store");
    out.set("x-spooled-filename", encodeURIComponent(filename));
    out.set("x-spooled-ext", extensionFor(format));

    let status = 200;
    if (range && typeof total === "number") {
      const start = range.start;
      const end = range.end ?? total - 1;
      out.set("content-range", `bytes ${start}-${end}/${total}`);
      out.set("content-length", String(end - start + 1));
      out.set("accept-ranges", "bytes");
      status = 206;
    } else if (typeof total === "number" && !range) {
      out.set("content-length", String(total));
      out.set("accept-ranges", "bytes");
    }

    if (request.method === "HEAD") {
      return new Response(null, { status, headers: out });
    }

    return new Response(opened.stream, { status, headers: out });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export const Route = createFileRoute("/api/download")({
  server: {
    handlers: {
      GET: handleDownload,
      HEAD: handleDownload,
    },
  },
});
