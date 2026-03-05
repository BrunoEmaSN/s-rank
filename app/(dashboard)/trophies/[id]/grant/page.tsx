import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { trophies } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { GrantTrophyForm } from "./GrantTrophyForm";
import { TrophyImage } from "@/components/TrophyImage";

export default async function GrantTrophyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") redirect("/dashboard");

  const { id: trophyId } = await params;
  const [trophy] = await db
    .select({
      id: trophies.id,
      title: trophies.title,
      description: trophies.description,
      icon: trophies.icon,
      requirementType: trophies.requirementType,
    })
    .from(trophies)
    .where(
      and(
        eq(trophies.id, trophyId),
        eq(trophies.streamerId, session.user.id)
      )
    )
    .limit(1);

  if (!trophy) notFound();
  if (trophy.requirementType !== "manual") {
    redirect("/trophies");
  }

  return (
    <div>
      <p className="mb-2 text-sm text-foreground-muted">
        <Link href="/trophies" className="hover:text-accent">← Volver a trofeos</Link>
      </p>
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Otorgar trofeo
      </h1>
      <div className="mb-6 rounded-lg border border-secondary/80 bg-secondary/30 p-4">
        <TrophyImage
          src={trophy.icon}
          alt={trophy.title}
          width={64}
          height={64}
        />
        <h2 className="mt-2 font-semibold text-foreground">{trophy.title}</h2>
        <p className="text-sm text-foreground-muted">{trophy.description}</p>
      </div>
      <GrantTrophyForm trophyId={trophyId} />
    </div>
  );
}
