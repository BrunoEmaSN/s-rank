import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { trophies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TrophyIcon } from "@/components/icons";
import { TrophyImage } from "@/components/TrophyImage";
import { buttonBase, buttonVariants, buttonSizes } from "@/components/ui";

export default async function TrophiesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") redirect("/dashboard");

  const streamerId = session.user.id;
  // Select only columns present in original schema so it works before migrations 0006/0007
  const rows = await db
    .select({
      id: trophies.id,
      title: trophies.title,
      description: trophies.description,
      icon: trophies.icon,
      rarity: trophies.rarity,
      requirementType: trophies.requirementType,
      requirementValue: trophies.requirementValue,
      isActive: trophies.isActive,
      createdAt: trophies.createdAt,
    })
    .from(trophies)
    .where(eq(trophies.streamerId, streamerId))
    .orderBy(desc(trophies.createdAt));

  const list = rows.map((r) => ({
    ...r,
    grantMode: r.requirementType === "manual" ? ("manual" as const) : ("auto" as const),
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Mis trofeos
        </h1>
        <Link
          href="/trophies/new"
          className={`${buttonBase} ${buttonVariants.default} ${buttonSizes.lg}`}
        >
          Crear trofeo
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-8 text-center">
          <TrophyIcon className="mx-auto mb-3 h-12 w-12 text-foreground-muted" />
          <p className="mb-2 font-medium text-foreground">Aún no tienes trofeos</p>
          <p className="mb-4 text-sm text-foreground-muted">
            Crea tu primer trofeo para tu comunidad. Puedes definir reglas automáticas o otorgarlos manualmente.
          </p>
          <Link
            href="/trophies/new"
            className={`${buttonBase} ${buttonVariants.default} ${buttonSizes.md}`}
          >
            Crear trofeo
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border border-secondary/80 bg-secondary/50 p-4"
            >
              <TrophyImage
                src={t.icon}
                alt={t.title}
                width={48}
                height={48}
                className="inline-block"
              />
              <h2 className="mt-2 font-semibold text-foreground">{t.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">
                {t.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-secondary px-2 py-0.5 text-foreground-muted">
                  {t.rarity}
                </span>
                <span className="rounded bg-secondary px-2 py-0.5 text-foreground-muted">
                  {t.grantMode === "auto" ? "Automático" : "Manual"}
                </span>
              </div>
              {t.grantMode === "manual" && (
                <Link
                  href={`/trophies/${t.id}/grant`}
                  className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Otorgar trofeo →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
