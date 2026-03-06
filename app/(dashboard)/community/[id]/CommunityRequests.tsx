"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrophyImage } from "@/components/TrophyImage";
import { Button } from "@/components/ui";

type RequestItem = {
  id: string;
  userId: string;
  userDisplayName: string | null;
  userAvatar: string | null;
  trophyId: string;
  trophyTitle: string;
  trophyIcon: string;
  message: string;
  proofImageUrl: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export function CommunityRequests({
  communityId,
}: {
  communityId: string;
}) {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/communities/${communityId}/trophy-requests`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.data) setRequests(data.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  const handleReview = async (requestId: string, action: "approve" | "reject") => {
    const res = await fetch(
      `/api/communities/${communityId}/trophy-requests/${requestId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }
    );
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: action === "approve" ? "approved" : "rejected",
              }
            : r
        )
      );
    }
  };

  if (loading) {
    return (
      <p className="rounded-lg border border-secondary/80 bg-secondary/30 p-6 text-center text-foreground-muted">
        Cargando solicitudes…
      </p>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");

  if (requests.length === 0) {
    return (
      <p className="rounded-lg border border-secondary/80 bg-secondary/30 p-6 text-center text-foreground-muted">
        No hay solicitudes de trofeos.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {requests.map((req) => (
        <li
          key={req.id}
          className="rounded-xl border border-secondary/80 bg-secondary/30 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              {req.userAvatar ? (
                <Link href={`/users/${req.userId}`}>
                  <img
                    src={req.userAvatar}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </Link>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-foreground-muted">
                  {(req.userDisplayName ?? "?").charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">
                  <Link href={`/users/${req.userId}`} className="hover:underline">
                    {req.userDisplayName ?? "Usuario"}
                  </Link>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <TrophyImage
                    src={req.trophyIcon}
                    alt={req.trophyTitle}
                    width={24}
                    height={24}
                  />
                  <span className="text-sm text-foreground-muted">
                    {req.trophyTitle}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground-muted">
                  {req.message}
                </p>
                {req.proofImageUrl && (
                  <a
                    href={req.proofImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-accent hover:underline"
                  >
                    Ver prueba visual
                  </a>
                )}
                <p className="mt-1 text-xs text-foreground-muted">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {req.status === "pending" && (
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReview(req.id, "reject")}
                >
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReview(req.id, "approve")}
                >
                  Aprobar
                </Button>
              </div>
            )}
            {req.status !== "pending" && (
              <span
                className={`shrink-0 rounded px-2 py-1 text-xs ${
                  req.status === "approved"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                {req.status === "approved" ? "Aprobado" : "Rechazado"}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
