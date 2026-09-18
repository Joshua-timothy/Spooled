import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ClipboardPaste,
  Download,
  Film,
  Loader2,
  Music2,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { lookupVideo } from "@/lib/video.functions";
import { clearRecent, readRecent, rememberVideo, type RecentItem } from "@/lib/history";
import { formatBytes, formatDuration, formatViews } from "@/lib/utils";
import {
  extractVideoId,
  safeFilename,
  type VideoFormat,
  type VideoInfoPayload,
} from "@/lib/youtube";

const EXAMPLE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

type DownloadState = {
  itag: number;
  received: number;
  total: number | null;
};

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Could not fetch that video.";
}

function downloadUrl(id: string, itag: number, attachment: boolean) {
  const params = new URLSearchParams({ v: id, itag: String(itag) });
  if (attachment) params.set("dl", "1");
  return `/api/download?${params.toString()}`;
}

function kindMeta(kind: VideoFormat["kind"]) {
  if (kind === "combined") {
    return { title: "With sound", hint: "Ready-to-play file with picture and audio muxed together." };
  }
  if (kind === "audio") {
    return { title: "Audio only", hint: "The soundtrack, saved as a standalone file." };
  }
  return {
    title: "Video only",
    hint: "Higher resolutions from YouTube are picture-only. Pair with an audio file if you need sound.",
  };
}

export function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<VideoInfoPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [previewing, setPreviewing] = useState(false);
  const [download, setDownload] = useState<DownloadState | null>(null);
  const [doneItag, setDoneItag] = useState<number | null>(null);
  const [showHighRes, setShowHighRes] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  const combined = useMemo(
    () => info?.formats.find((format) => format.kind === "combined") ?? null,
    [info],
  );

  async function fetchInfo(raw: string) {
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
    setShowHighRes(false);

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

  async function handleSubmit(event: React.FormEvent) {
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

  async function saveFormat(format: VideoFormat) {
    if (!info) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setDownload({ itag: format.itag, received: 0, total: format.sizeBytes });
    setDoneItag(null);

    const filename = safeFilename(info.title, format);
    const large = (format.sizeBytes ?? 0) > 120 * 1024 * 1024;

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

      const response = await fetch(downloadUrl(info.id, format.itag, true), {
        signal: controller.signal,
      });
      if (!response.ok) {
        let message = "Download failed.";
        try {
          const body = (await response.json()) as { error?: string };
          if (body.error) message = body.error;
        } catch {
          // Keep the default message.
        }
        throw new Error(message);
      }

      const total = Number(response.headers.get("content-length")) || format.sizeBytes;
      const headerName = response.headers.get("x-spooled-filename");
      const name = headerName ? decodeURIComponent(headerName) : filename;
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No file stream was returned.");

      const chunks: Uint8Array[] = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.byteLength;
          setDownload({ itag: format.itag, received, total });
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: format.mimeType.split(";")[0] });
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
      if ((err as { name?: string }).name === "AbortError") return;
      toast.error(errorMessage(err));
    } finally {
      setDownload(null);
    }
  }

  const groups: VideoFormat["kind"][] = ["combined", "audio", "video"];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <SpoolMark />
          <span className="font-display text-xl tracking-tight text-foreground">Spooled</span>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">Personal offline copies</p>
      </header>

      <section className="stagger-in flex flex-col gap-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          YouTube to your device
        </p>
        <h1 className="font-display text-4xl leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
          Save the video. Keep the file.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Paste a YouTube, Shorts, or youtu.be link. Spooled fetches the file and downloads it
          directly to this device — no account, no queue.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="rounded-xl bg-card p-2 shadow-border sm:p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="youtube-url" className="sr-only">
            YouTube link
          </label>
          <Input
            id="youtube-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v="
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-12 flex-1 border-0 bg-transparent shadow-none"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 sm:flex-none"
              onClick={pasteFromClipboard}
            >
              <ClipboardPaste />
              Paste
            </Button>
            <Button type="submit" className="flex-1 sm:min-w-28 sm:flex-none" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Film />}
              {loading ? "Fetching" : "Fetch"}
            </Button>
          </div>
        </div>
      </form>

      {error ? (
        <div
          role="alert"
          className="rounded-lg bg-card px-4 py-3 text-sm text-destructive shadow-border"
        >
          {error}
        </div>
      ) : null}

      {loading ? <ResultSkeleton /> : null}

      {info && !loading ? (
        <article className="overflow-hidden rounded-xl bg-card shadow-border">
          <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
            <div className="relative aspect-video bg-elevated sm:aspect-auto sm:min-h-full">
              {info.thumbnail ? (
                <img
                  src={info.thumbnail}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
              {info.duration ? (
                <span className="absolute bottom-2 right-2 rounded-sm bg-background/85 px-1.5 py-0.5 font-mono text-xs tabular-nums text-foreground">
                  {formatDuration(info.duration)}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <h2 className="text-lg font-medium leading-snug tracking-tight">{info.title}</h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{info.author}</span>
                {info.viewCount != null ? (
                  <span className="tabular-nums">{formatViews(info.viewCount)} views</span>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {combined ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewing((open) => !open)}
                  >
                    <Play className="ml-0.5" />
                    {previewing ? "Hide preview" : "Preview"}
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" size="sm" asChild>
                  <a
                    href={`https://www.youtube.com/watch?v=${info.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open on YouTube
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {previewing && combined ? (
            <div className="border-t border-border bg-background p-3">
              <video
                className="aspect-video w-full rounded-md bg-background"
                src={downloadUrl(info.id, combined.itag, false)}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-8 border-t border-border px-4 py-5 sm:px-5">
            {groups.map((kind) => {
              const all = info.formats.filter((format) => format.kind === kind);
              const hiddenHighRes =
                kind === "video" && !showHighRes
                  ? all.filter((format) => (format.height ?? 0) > 1080)
                  : [];
              const formats =
                kind === "video" && !showHighRes
                  ? all.filter((format) => (format.height ?? 0) <= 1080)
                  : all;
              if (!formats.length && !hiddenHighRes.length) return null;
              const meta = kindMeta(kind);
              return (
                <section key={kind} className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{meta.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta.hint}</p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {formats.map((format) => (
                      <FormatRow
                        key={format.itag}
                        format={format}
                        busy={download?.itag === format.itag}
                        done={doneItag === format.itag}
                        progress={download?.itag === format.itag ? download : null}
                        onSave={() => void saveFormat(format)}
                      />
                    ))}
                  </ul>
                  {kind === "video" && hiddenHighRes.length ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="self-start"
                      onClick={() => setShowHighRes(true)}
                    >
                      Show {hiddenHighRes.length} higher resolutions
                    </Button>
                  ) : null}
                </section>
              );
            })}
          </div>
        </article>
      ) : null}

      {!info && !loading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { n: "01", t: "Paste", d: "Drop in any watch, Shorts, or youtu.be URL." },
            { n: "02", t: "Pick", d: "Choose a file with sound, audio only, or a higher-res picture." },
            { n: "03", t: "Save", d: "The file lands in your downloads folder. Nothing is stored on a server." },
          ].map((step) => (
            <div key={step.n} className="rounded-lg bg-card px-4 py-4 shadow-border">
              <p className="font-mono text-xs tabular-nums text-muted-foreground">{step.n}</p>
              <p className="mt-2 text-sm font-medium">{step.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">Need a test clip?</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setUrl(EXAMPLE_URL);
            void fetchInfo(EXAMPLE_URL);
          }}
        >
          Try a sample clip
        </Button>
      </div>

      {recent.length ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Recent</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                clearRecent();
                setRecent([]);
              }}
            >
              <RotateCcw />
              Clear
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {recent.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    const next = `https://www.youtube.com/watch?v=${item.id}`;
                    setUrl(next);
                    void fetchInfo(next);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg bg-card p-2 text-left shadow-border transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-border-hover"
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-elevated">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="size-full object-cover" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {item.author}
                      {item.duration ? ` · ${formatDuration(item.duration)}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        Spooled saves a copy to this device for personal offline playback. Only download videos you
        have the right to keep. YouTube and the play button logo are trademarks of Google LLC.
      </footer>
    </div>
  );
}

function FormatRow({
  format,
  busy,
  done,
  progress,
  onSave,
}: {
  format: VideoFormat;
  busy: boolean;
  done: boolean;
  progress: DownloadState | null;
  onSave: () => void;
}) {
  const pct =
    progress && progress.total
      ? Math.min(100, Math.round((progress.received / progress.total) * 100))
      : null;
  const Icon = format.kind === "audio" ? Volume2 : format.kind === "combined" ? Music2 : Film;

  return (
    <li className="flex items-center gap-3 rounded-md bg-elevated px-3 py-2.5">
      <span className="hidden size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground sm:flex">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium tabular-nums">{format.label}</p>
          {format.recommended ? <Badge variant="solid">Best with sound</Badge> : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {format.container.toUpperCase()}
          {format.codecs ? ` · ${format.codecs.split(",")[0]}` : ""}
          {format.fps ? ` · ${format.fps} fps` : ""}
          {format.sizeBytes ? ` · ${formatBytes(format.sizeBytes)}` : ""}
        </p>
        {busy && pct != null ? (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-primary transition-[width] duration-[var(--motion-quick)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        ) : null}
      </div>
      <Button
        type="button"
        size="sm"
        variant={format.recommended ? "default" : "outline"}
        disabled={busy}
        onClick={onSave}
        className="shrink-0"
      >
        {busy ? (
          <Loader2 className="animate-spin" />
        ) : done ? (
          <Check />
        ) : (
          <Download />
        )}
        {busy ? (pct != null ? `${pct}%` : "Saving") : done ? "Saved" : "Save"}
      </Button>
    </li>
  );
}

function ResultSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-border">
      <div className="grid sm:grid-cols-[220px_1fr]">
        <Skeleton className="aspect-video rounded-none sm:aspect-auto sm:min-h-40" />
        <div className="flex flex-col gap-3 p-5">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </div>
  );
}

function SpoolMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="size-7"
      aria-hidden="true"
      fill="none"
    >
      <circle cx="16" cy="16" r="12" className="stroke-primary" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3.4" className="fill-primary" />
      <circle cx="16" cy="6.8" r="1.2" className="fill-primary" />
      <circle cx="16" cy="25.2" r="1.2" className="fill-primary" />
      <circle cx="6.8" cy="16" r="1.2" className="fill-primary" />
      <circle cx="25.2" cy="16" r="1.2" className="fill-primary" />
    </svg>
  );
}
