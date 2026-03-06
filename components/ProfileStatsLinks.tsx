"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDashboardStatsStore } from "@/store/useDashboardStatsStore";

type ProfileStatsLinksProps = {
  role: "streamer" | "sub";
};

export function ProfileStatsLinks({ role }: ProfileStatsLinksProps) {
  const {
    followingCount,
    followersCount,
    loaded,
    loading,
    fetchStats,
  } = useDashboardStatsStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const following = !loaded && loading ? "—" : followingCount;
  const followers = !loaded && loading ? "—" : followersCount;

  return (
    <div className="mb-6 flex flex-wrap gap-4 pt-4">
      <Link
        href="/following"
        className="text-sm font-medium text-accent hover:underline"
      >
        Siguiendo ({following})
      </Link>
      {role === "streamer" && (
        <Link
          href="/followers"
          className="text-sm font-medium text-accent hover:underline"
        >
          Seguidores ({followers})
        </Link>
      )}
    </div>
  );
}
