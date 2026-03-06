import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { getCommunityDetail } from "@/lib/community";
import { CommunityContent } from "./CommunityContent";
import { JoinButton } from "./JoinButton";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) notFound();

  const { id: communityId } = await params;
  const detail = await getCommunityDetail(communityId, session.user.id);

  if (!detail) notFound();

  return (
    <div>
      <p className="mb-2 text-sm text-foreground-muted">
        <Link href="/community" className="hover:text-accent">
          ← Volver a comunidades
        </Link>
      </p>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-zen-kaku)" }}
          >
            {detail.name}
          </h1>
          {detail.description && (
            <p className="mt-1 text-foreground-muted">{detail.description}</p>
          )}
          <p className="mt-2 text-sm text-foreground-muted">
            Comunidad de {detail.streamerName ?? "el streamer"}
          </p>
        </div>
        {!detail.isMember && (
          <JoinButton communityId={communityId} />
        )}
      </div>

      {detail.isMember ? (
        <CommunityContent
          communityId={communityId}
          isOwner={detail.isOwner}
        />
      ) : (
        <p className="rounded-lg border border-secondary/80 bg-secondary/30 p-6 text-center text-foreground-muted">
          Únete a la comunidad para ver el feed, miembros y solicitar trofeos.
        </p>
      )}
    </div>
  );
}
