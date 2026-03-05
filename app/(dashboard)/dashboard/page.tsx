import { getSession } from "@/lib/auth-server";
import { TrophyIcon, ChartIcon, PeopleIcon } from "@/app/components/icons";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user as {
    name?: string;
    email?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;
  const role = (user?.role as "streamer" | "sub") ?? "sub";

  return (
    <div>
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Dashboard
      </h1>
      <p className="mb-8 text-foreground-muted">
        Hola, {user?.name ?? user?.email}. Estás como {role === "streamer" ? "streamer" : "suscriptor"}.
      </p>

      {role === "streamer" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
            <TrophyIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Trofeos creados</h2>
            <p className="text-sm text-foreground-muted">Crea y gestiona trofeos para tu comunidad.</p>
            <p className="mt-2 text-2xl font-bold text-accent">—</p>
          </div>
          <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
            <ChartIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Estadísticas</h2>
            <p className="text-sm text-foreground-muted">Desbloqueos y engagement de tus suscriptores.</p>
            <p className="mt-2 text-2xl font-bold text-accent">—</p>
          </div>
          <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
            <PeopleIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Comunidad</h2>
            <p className="text-sm text-foreground-muted">Conecta Twitch y Kick para empezar.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
            <TrophyIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Trofeos desbloqueados</h2>
            <p className="text-sm text-foreground-muted">Tu progreso en los canales que sigues.</p>
            <p className="mt-2 text-2xl font-bold text-accent">0</p>
          </div>
          <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
            <PeopleIcon className="mb-3 h-10 w-10 text-accent" aria-hidden />
            <h2 className="mb-1 font-semibold text-foreground">Canales seguidos</h2>
            <p className="text-sm text-foreground-muted">Explora canales y desbloquea trofeos.</p>
            <p className="mt-2 text-2xl font-bold text-accent">0</p>
          </div>
        </div>
      )}
    </div>
  );
}
