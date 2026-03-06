import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import {
  getCommunitiesForUser,
  getCommunitiesFromFollowedStreamers,
  getRecommendedCommunities,
} from "@/lib/community";
import { CreateCommunityForm } from "./CreateCommunityForm";
import { RecommendedCommunities } from "@/components/RecommendedCommunities";

export default async function CommunityPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const role = (session.user as { role?: string }).role ?? "sub";
  const isStreamer = role === "streamer";

  const [myCommunities, fromFollowed, recommended] = await Promise.all([
    getCommunitiesForUser(userId),
    getCommunitiesFromFollowedStreamers(userId),
    getRecommendedCommunities(userId, 6),
  ]);

  const ownedCommunity = myCommunities.find((c) => c.isOwner);
  const fromFollowedNotJoined = fromFollowed.filter((c) => !c.isMember);

  return (
    <div>
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Comunidad
      </h1>
      <p className="mb-8 text-foreground-muted">
        {isStreamer
          ? "Crea tu comunidad o gestiona la que ya tienes."
          : "Comunidades a las que perteneces y de streamers que sigues."}
      </p>

      {isStreamer && !ownedCommunity && (
        <div className="mb-8 rounded-xl border border-secondary/80 bg-secondary/30 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Crear tu comunidad
          </h2>
          <CreateCommunityForm />
        </div>
      )}

      {isStreamer && ownedCommunity && (
        <div className="mb-6 rounded-xl border border-secondary/80 bg-secondary/30 p-4">
          <p className="mb-2 text-sm text-foreground-muted">
            Tu comunidad
          </p>
          <Link
            href={`/community/${ownedCommunity.id}`}
            className="text-lg font-medium text-accent hover:underline"
          >
            {ownedCommunity.name}
          </Link>
        </div>
      )}

      {myCommunities.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            A las que perteneces
          </h2>
          <ul className="space-y-4">
            {myCommunities.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/community/${c.id}`}
                  className="block rounded-xl border border-secondary/80 bg-secondary/30 p-4 transition hover:border-secondary"
                >
                  <div className="flex items-center gap-4">
                    {c.streamerAvatar ? (
                      <img
                        src={c.streamerAvatar}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-foreground-muted">
                        {(c.streamerName ?? "?").charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-foreground-muted">
                        {c.streamerName ?? "Streamer"}
                      </p>
                    </div>
                    {c.isOwner && (
                      <span className="ml-auto rounded bg-accent/20 px-2 py-1 text-xs text-accent">
                        Admin
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {fromFollowedNotJoined.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Únete a la comunidad de un streamer que sigues
          </h2>
          <ul className="space-y-4">
            {fromFollowedNotJoined.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/community/${c.id}`}
                  className="block rounded-xl border border-secondary/80 bg-secondary/30 p-4 transition hover:border-secondary"
                >
                  <div className="flex items-center gap-4">
                    {c.streamerAvatar ? (
                      <img
                        src={c.streamerAvatar}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-foreground-muted">
                        {(c.streamerName ?? "?").charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-foreground-muted">
                        {c.streamerName ?? "Streamer"}
                      </p>
                    </div>
                    <span className="rounded bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent">
                      Unirse
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {myCommunities.length === 0 && fromFollowedNotJoined.length === 0 && !isStreamer && (
        <p className="mb-8 text-foreground-muted">
          Sigue a streamers en Explorar para ver sus comunidades y unirte.
        </p>
      )}

      <RecommendedCommunities communities={recommended} />
    </div>
  );
}
