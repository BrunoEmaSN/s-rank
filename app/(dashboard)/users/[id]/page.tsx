import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { getPublicProfile } from "@/lib/public-profile";
import { TrophyIcon } from "@/components/icons";

const TROPHY_RARITIES = [
  { key: "common" as const, label: "Normales", color: "text-gray-400" },
  { key: "rare" as const, label: "Raros", color: "text-indigo-400" },
  { key: "epic" as const, label: "Épicos", color: "text-purple-400" },
  { key: "legendary" as const, label: "Legendarios", color: "text-amber-500" },
] as const;

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    notFound();
  }

  const { id: profileId } = await params;
  const profile = await getPublicProfile(profileId);

  if (!profile) {
    notFound();
  }

  const displayName =
    profile.displayName ?? profile.username ?? "Usuario";

  return (
    <div>
      <p className="mb-2 text-sm text-foreground-muted">
        <Link href="/community" className="hover:text-accent">
          ← Volver a comunidad
        </Link>
      </p>
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Perfil
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 lg:max-w-2xl">
          <div className="mb-6 flex items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-foreground-muted">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground">
                {displayName}
              </p>
              {profile.username && (
                <p className="text-sm text-foreground-muted">
                  @{profile.username}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row flex-wrap gap-6 md:gap-8">
            {TROPHY_RARITIES.map(({ key, label, color }) => (
              <div
                key={key}
                className="flex flex-col items-center gap-1"
                title={label}
              >
                <TrophyIcon
                  className={`h-8 w-8 ${color}`}
                  aria-hidden
                />
                <span className="text-lg font-semibold tabular-nums text-foreground">
                  {profile.trophyCountsByRarity[key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {profile.trophiesByStreamer.length > 0 && (
          <div className="rounded-xl border border-secondary/80 bg-secondary/30 p-6">
            <h2 className="mb-4 text-sm font-medium text-foreground-muted">
              Trofeos por canal
            </h2>
            <ul className="space-y-2">
              {profile.trophiesByStreamer.map((s) => (
                <li
                  key={s.streamerId}
                  className="flex items-center justify-between rounded-lg border border-secondary/50 px-3 py-2"
                >
                  <span className="text-foreground">
                    {s.streamerName ?? "Canal"}
                  </span>
                  <span className="tabular-nums text-foreground-muted">
                    {s.unlocked} desbloqueados
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
