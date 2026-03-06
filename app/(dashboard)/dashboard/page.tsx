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

      <DashboardStatsCards role={role} />

      <div className="mt-8">
        {role === "streamer" ? (
          <StreamerRecommendationsPanels />
        ) : (
          <RecommendedChannelsCarousel channels={recommendedChannels} />
        )}
      </div>
    </div>
  );
}
