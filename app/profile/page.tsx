import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TrophyIcon } from "@/components/icons";
import { ProfileStatsLinks } from "@/components/ProfileStatsLinks";
import { FavoriteChannelExhibitor } from "@/components/FavoriteChannelExhibitor";
import { CompletistExhibitor } from "@/components/CompletistExhibitor";
import { RecentActivityExhibitor } from "@/components/RecentActivityExhibitor";
import { getTrophyCountsByRarity } from "@/lib/profile-trophy-counts";
import { IoArrowBack } from "react-icons/io5";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";

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

  let profile: { bio: string | null; bannerUrl: string | null } | null = null;
  if (session?.user?.id) {
    const [row] = await db
      .select({ bio: profiles.bio, bannerUrl: profiles.bannerUrl })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);
    profile = row ?? null;
  }

  const bannerSrc = profile?.bannerUrl ?? "/banner-generic.png";

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full">
        <img
          src={bannerSrc}
          alt=""
          className="h-56 w-full object-cover object-center mask-b-from-70% -z-10"
        />
      </div>
      <div className="relative mx-auto flex flex-col w-full min-h-[calc(100vh-var(--header-height,0px))] min-w-0 max-w-6xl px-3 py-6 pb-24 sm:px-4 sm:py-8 md:pb-10 md:px-8 md:py-10 z-10">
        <div className="flex justify-between items-center gap-2 mb-4">
          <Link href="/" className="w-fit flex items-center gap-2">
            <BackButton variant="ghost" size="lg" className="w-fit flex items-center gap-2">
              <IoArrowBack className="size-5" />
              <span className="text-sm shadow-lg">Volver</span>
            </BackButton>
          </Link>
          <h1
            className="mb-6 text-2xl font-bold text-foreground px-4 shadow-lg"
            style={{ fontFamily: "var(--font-zen-kaku)" }}
          >
            Perfil
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="rounded-xl bg-[#0A0F21] lg:max-w-2xl">
            <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 lg:max-w-2xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 ">
                      {user?.image ? (
                        <img src={user?.image ?? ""} alt="Avatar" className="shrink-0 items-center justify-center rounded-full bg-primary" />
                      ) : (
                        <div className="shrink-0 items-center justify-center h-16 w-16 flex rounded-full bg-primary">
                          <span className="text-xl font-semibold text-foreground">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
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
                  {profile?.bio && (
                    <p className="mb-6 whitespace-pre-wrap text-sm text-foreground-muted">
                      {profile.bio}
                    </p>
                  )}
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
    </div>
  );
}
