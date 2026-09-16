import { createFileRoute } from "@tanstack/react-router";
import { SongsFace } from "@/components/songs-face";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="min-h-dvh bg-bg text-foreground">
      <div className="px-4 py-6 sm:px-6 sm:py-10">
        <SongsFace />
      </div>
    </main>
  );
}
