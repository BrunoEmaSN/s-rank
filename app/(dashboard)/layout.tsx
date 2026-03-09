import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { RedirectIfNeedsRole } from "./RedirectIfNeedsRole";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const user = session.user as {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    needsRoleSelection?: boolean;
  };

  return (
    <>
      <RedirectIfNeedsRole needsRoleSelection={user.needsRoleSelection === true} />
      <div className="flex min-h-[calc(100vh-var(--header-height,0px))] min-w-0 overflow-x-hidden">
        <main className="min-w-0 flex-1 px-3 py-6 pb-24 sm:px-4 sm:py-8 md:pb-10 md:px-8 md:py-10">
          <div className="mx-auto flex w-full min-w-0 max-w-6xl">
            <Sidebar user={user} />
            {children}
          </div>
        </main>
      </div>
      <MobileBottomNav user={user} />
      <Footer />
    </>
  );
}
