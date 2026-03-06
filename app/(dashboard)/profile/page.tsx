import { getSession } from "@/lib/auth-server";
import { TrophyIcon } from "@/components/icons";
import { ProfileStatsLinks } from "@/components/ProfileStatsLinks";
import { FavoriteChannelExhibitor } from "@/components/FavoriteChannelExhibitor";
import { CompletistExhibitor } from "@/components/CompletistExhibitor";
import { RecentActivityExhibitor } from "@/components/RecentActivityExhibitor";
import { getTrophyCountsByRarity } from "@/lib/profile-trophy-counts";

const TROPHY_RARITIES = [
  { key: "common" as const, label: "Normales", color: "text-gray-400" },
  { key: "rare" as const, label: "Raros", color: "text-indigo-400" },
  { key: "epic" as const, label: "Épicos", color: "text-purple-400" },
  { key: "legendary" as const, label: "Legendarios", color: "text-amber-500" },
] as const;

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

  const trophyCounts =
    role === "sub" && session?.user?.id
      ? await getTrophyCountsByRarity(session.user.id)
      : null;

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Perfil
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 lg:max-w-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-foreground-muted">
                  {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-foreground">
                    {user?.name ?? "Sin nombre"}
                  </p>
                  <p className="text-sm text-foreground-muted">{user?.email}</p>
                  <p className="mt-1 text-xs text-accent">
                    {role === "streamer" ? "Streamer" : "Suscriptor / Viewer"}
                  </p>
                </div>
              </div>

              <ProfileStatsLinks role={role} />

              {role === "streamer" ? (
                <div className="space-y-2 text-sm text-foreground-muted">
                  <p>
                    Conecta tu canal de Twitch o Kick desde Ajustes para crear trofeos
                    y ver estadísticas.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <TrophyIcon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
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
        </div>

        {role === "sub" && trophyCounts && (
          <div className="rounded-xl justify-center items-center flex">
            <div className="flex shrink-0 flex-row gap-6 md:gap-8 md:pt-0 md:pl-6">
              {TROPHY_RARITIES.map(({ key, label, color }) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-1"
                  title={label}
                >
                  <TrophyIcon
                    className={`h-8 w-8 md:h-25 md:w-25 ${color}`}
                    aria-hidden
                  />
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    {trophyCounts[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {role === "sub" && (
        <div className="mt-8 space-y-8">
          <FavoriteChannelExhibitor />
          <CompletistExhibitor />
        </div>
      )}

      <div className="mt-8">
        <RecentActivityExhibitor />
      </div>
    </div>
  );
}
