import { getSession } from "@/lib/auth-server";
import { Header } from "@/components/Header";
import { TrophyIcon } from "../../components/icons";

// Mock list of channels for now
const mockChannels = [
  { id: "1", name: "Canal Ejemplo 1", platform: "Twitch", trophies: 12 },
  { id: "2", name: "Canal Ejemplo 2", platform: "Kick", trophies: 8 },
  { id: "3", name: "Canal Ejemplo 3", platform: "Twitch", trophies: 15 },
];

export default async function ExplorePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-primary text-foreground">
      <Header session={session ? { user: session.user } : null} />
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <h1
          className="mb-2 text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Explorar canales
        </h1>
        <p className="mb-8 text-foreground-muted">
          Descubre streamers con sistema de trofeos. Conecta y desbloquea logros.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockChannels.map((channel) => (
            <div
              key={channel.id}
              className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/30"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <TrophyIcon className="h-6 w-6 text-accent" aria-hidden />
              </div>
              <h2 className="font-semibold text-foreground">{channel.name}</h2>
              <p className="text-sm text-foreground-muted">{channel.platform}</p>
              <p className="mt-1 text-xs text-accent">{channel.trophies} trofeos</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
