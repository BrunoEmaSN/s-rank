import { getSession } from "@/lib/auth-server";
import { getRecommendedChannels } from "@/lib/recommended-channels";
import { RecommendedChannelsCarousel } from "@/components/RecommendedChannelsCarousel";
import { StreamerRecommendationsPanels } from "@/components/StreamerRecommendationsPanels";
import { DashboardStatsCards } from "@/components/DashboardStatsCards";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user as {
    name?: string;
    email?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;
  const role = (user?.role as "streamer" | "sub") ?? "sub";

  const recommendedChannels = role === "sub" ? await getRecommendedChannels(8) : [];

  return (
    <div className="w-full min-w-0">
      <h1
        className="mb-2 text-xl font-bold text-foreground sm:text-2xl"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Dashboard
      </h1>
      <p className="mb-6 text-sm text-foreground-muted sm:mb-8 sm:text-base">
        Hola, {user?.name ?? user?.email}. Estás como {role === "streamer" ? "streamer" : "suscriptor"}.
      </p>

      <DashboardStatsCards role={role} />

      <div className="mt-6 sm:mt-8">
        {role === "streamer" ? (
          <StreamerRecommendationsPanels />
        ) : (
          <RecommendedChannelsCarousel channels={recommendedChannels} />
        )}
      </div>
    </div>
  );
}
