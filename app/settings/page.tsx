import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./settings-form";
import { IoArrowBack, IoCloseCircleOutline } from "react-icons/io5";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await getSession();
  const user = session?.user as {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;

  let profile: {
    bio: string | null;
    bannerUrl: string | null;
  } | null = null;
  if (user?.id) {
    const [row] = await db
      .select({
        bio: profiles.bio,
        bannerUrl: profiles.bannerUrl,
      })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);
    profile = row ?? null;
  }

  return (
    <div className="mx-auto flex flex-col w-full min-h-[calc(100vh-var(--header-height,0px))] min-w-0 max-w-6xl px-3 py-6 pb-24 sm:px-4 sm:py-8 md:pb-10 md:px-8 md:py-10">
      <div className="flex justify-between items-center gap-2 mb-4">
        <Link href="/" className="w-fit flex items-center gap-2">
          <BackButton variant="ghost" size="lg" className="w-fit flex items-center gap-2">
            <IoArrowBack className="size-5" />
            <span className="text-sm">Volver</span>
          </BackButton>
        </Link>
        <h1
          className="mb-6 text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Ajustes
        </h1>
      </div>
      <SettingsForm
        defaultName={user?.name ?? ""}
        defaultEmail={user?.email ?? ""}
        role={(user?.role as "streamer" | "sub") ?? "sub"}
        defaultBio={profile?.bio ?? ""}
        defaultBannerUrl={profile?.bannerUrl ?? ""}
      />
    </div>
  );
}
