"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  joinedAt: string;
};

export function CommunityMembers({ communityId }: { communityId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/communities/${communityId}/members`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.data) setMembers(data.data);
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
        Cargando miembros…
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="rounded-lg border border-secondary/80 bg-secondary/30 p-6 text-center text-foreground-muted">
        Aún no hay miembros.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <li key={m.userId}>
          <Link
            href={`/users/${m.userId}`}
            className="flex items-center gap-3 rounded-xl border border-secondary/80 bg-secondary/30 p-4 transition hover:border-secondary"
          >
            {m.avatarUrl ? (
              <img
                src={m.avatarUrl}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-foreground-muted">
                {(m.displayName ?? m.username ?? "?").charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {m.displayName ?? m.username ?? "Usuario"}
              </p>
              {m.username && (
                <p className="text-sm text-foreground-muted">@{m.username}</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
