import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { RedirectIfNeedsRole } from "./RedirectIfNeedsRole";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";

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
      <div className="flex min-h-[calc(100vh-var(--header-height,0px))]">
        <Sidebar user={user} />
        <main className="flex-1 px-4 py-10 md:px-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
}
