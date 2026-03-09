import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { FollowersContent } from "./FollowersContent";

export default async function FollowersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") redirect("/dashboard");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);

  return (
    <div className="w-full min-w-0">
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Seguidores
      </h1>
      <p className="mb-8 text-foreground-muted">
        Usuarios que te siguen. Conecta con tu comunidad.
      </p>
      <FollowersContent initialPage={page} />
    </div>
  );
}
