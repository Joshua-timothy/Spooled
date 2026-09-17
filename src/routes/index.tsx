import { createFileRoute } from "@tanstack/react-router";
import { Downloader } from "@/components/downloader";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="min-h-dvh bg-background">
      <Downloader />
    </main>
  );
}
