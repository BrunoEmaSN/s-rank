import { getSession } from "@/lib/auth-server";
import { TrophyIcon } from "@/components/icons";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user as {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;
  const role = (user?.role as "streamer" | "sub") ?? "sub";

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Perfil
      </h1>
      <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 md:max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-foreground-muted">
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user?.name ?? "Sin nombre"}</p>
            <p className="text-sm text-foreground-muted">{user?.email}</p>
            <p className="mt-1 text-xs text-accent">
              {role === "streamer" ? "Streamer" : "Suscriptor / Viewer"}
            </p>
          </div>
        </div>
        {role === "streamer" ? (
          <div className="space-y-2 text-sm text-foreground-muted">
            <p>Conecta tu canal de Twitch o Kick desde Ajustes para crear trofeos y ver estadísticas.</p>
            <div className="flex gap-2 pt-2">
              <TrophyIcon className="h-5 w-5 text-accent" aria-hidden />
              <span>Panel de trofeos disponible en el dashboard.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-foreground-muted">
            <p>Explora canales y desbloquea trofeos viendo streams y participando.</p>
          </div>
        )}
      </div>
    </div>
  );
}
