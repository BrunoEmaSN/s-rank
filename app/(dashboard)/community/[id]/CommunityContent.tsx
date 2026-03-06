"use client";

import { useState } from "react";
import { CommunityFeed } from "./CommunityFeed";
import { CommunityMembers } from "./CommunityMembers";
import { CommunityRequests } from "./CommunityRequests";
import { RequestTrophyForm } from "./RequestTrophyForm";
import { ShareTrophyForm } from "./ShareTrophyForm";

type Tab = "feed" | "members" | "requests";

export function CommunityContent({
  communityId,
  isOwner,
}: {
  communityId: string;
  isOwner: boolean;
}) {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-secondary/50">
        <button
          type="button"
          onClick={() => setTab("feed")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            tab === "feed"
              ? "border-accent text-accent"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          Feed
        </button>
        <button
          type="button"
          onClick={() => setTab("members")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            tab === "members"
              ? "border-accent text-accent"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          Miembros
        </button>
        {isOwner && (
          <button
            type="button"
            onClick={() => setTab("requests")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === "requests"
                ? "border-accent text-accent"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            Solicitudes
          </button>
        )}
      </div>

      {tab === "feed" && (
        <>
          <ShareTrophyForm communityId={communityId} />
          {!isOwner && (
            <RequestTrophyForm communityId={communityId} />
          )}
          <CommunityFeed communityId={communityId} />
        </>
      )}
      {tab === "members" && <CommunityMembers communityId={communityId} />}
      {tab === "requests" && isOwner && (
        <CommunityRequests communityId={communityId} />
      )}
    </div>
  );
}
