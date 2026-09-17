import type { VideoInfoPayload } from "@/lib/youtube";

const KEY = "spooled:recent";
const MAX = 8;

export type RecentItem = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: number;
  fetchedAt: number;
};

export function readRecent(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function writeRecent(items: RecentItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}

export function rememberVideo(info: VideoInfoPayload): RecentItem[] {
  const next: RecentItem = {
    id: info.id,
    title: info.title,
    author: info.author,
    thumbnail: info.thumbnail,
    duration: info.duration,
    fetchedAt: Date.now(),
  };
  const items = [next, ...readRecent().filter((item) => item.id !== info.id)];
  writeRecent(items);
  return items;
}

export function clearRecent() {
  window.localStorage.removeItem(KEY);
}
