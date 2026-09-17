import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function formatViews(n: number): string {
  if (n >= 1_000_000_000) return `${trimNum(n / 1_000_000_000)}B`;
  if (n >= 1_000_000) return `${trimNum(n / 1_000_000)}M`;
  if (n >= 1_000) return `${trimNum(n / 1_000)}K`;
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  if (n < 1024 * 1024 * 1024) {
    const mb = n / (1024 * 1024);
    return `${mb >= 10 ? mb.toFixed(0) : mb.toFixed(1)} MB`;
  }
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function trimNum(n: number): string {
  return n.toFixed(n >= 10 ? 0 : 1).replace(/\.0$/, "");
}
