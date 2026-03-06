"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrophyImage } from "@/components/TrophyImage";

type Post = {
  id: string;
  type: "trophy_unlock" | "trophy_share";
  userId: string;
  userDisplayName: string | null;
  userAvatar: string | null;
  trophyId: string | null;
  trophyTitle: string | null;
  trophyIcon: string | null;
  message: string | null;
  createdAt: string;
};

export function CommunityFeed({ communityId }: { communityId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/communities/${communityId}/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.data) setPosts(data.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  if (loading) {
    return (
      <p className="rounded-lg border border-secondary/80 bg-secondary/30 p-6 text-center text-foreground-muted">
        Cargando feed…
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-lg border border-secondary/80 bg-secondary/30 p-6 text-center text-foreground-muted">
        Aún no hay publicaciones en el feed.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-xl border border-secondary/80 bg-secondary/30 p-4"
        >
          <div className="flex gap-4">
            {post.userAvatar ? (
              <Link href={`/users/${post.userId}`} className="shrink-0">
                <img
                  src={post.userAvatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link
                href={`/users/${post.userId}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-foreground-muted"
              >
                {(post.userDisplayName ?? "?").charAt(0)}
              </Link>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground-muted">
                <Link
                  href={`/users/${post.userId}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {post.userDisplayName ?? "Usuario"}
                </Link>{" "}
                {post.type === "trophy_unlock"
                  ? "desbloqueó un trofeo"
                  : "compartió un logro"}
              </p>
              {post.trophyTitle && (
                <div className="mt-2 flex items-center gap-2">
                  <TrophyImage
                    src={post.trophyIcon ?? ""}
                    alt={post.trophyTitle}
                    width={32}
                    height={32}
                  />
                  <span className="font-medium text-foreground">
                    {post.trophyTitle}
                  </span>
                </div>
              )}
              {post.message && (
                <p className="mt-2 text-sm text-foreground-muted">
                  {post.message}
                </p>
              )}
              <p className="mt-1 text-xs text-foreground-muted">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
