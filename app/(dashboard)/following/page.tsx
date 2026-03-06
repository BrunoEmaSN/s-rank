import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { FollowingContent } from "./FollowingContent";

export default async function FollowingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Siguiendo
      </h1>
      <p className="mb-8 text-foreground-muted">
        Canales y streamers que sigues. Desbloquea trofeos viendo y participando.
      </p>
      <FollowingContent initialPage={page} />
    </div>
  );
}
