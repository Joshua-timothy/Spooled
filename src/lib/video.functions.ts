import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractVideoId } from "@/lib/youtube";

export const lookupVideo = createServerFn({ method: "POST" })
  .validator(
    z.object({
      url: z
        .string()
        .trim()
        .min(1, "Paste a YouTube link first.")
        .max(500, "That link is too long."),
    }),
  )
  .handler(async ({ data }) => {
    if (!extractVideoId(data.url)) {
      throw new Error("That does not look like a YouTube link.");
    }
    const { fetchVideoInfo } = await import("@/lib/youtube.server");
    return fetchVideoInfo(data.url);
  });
