import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { Header } from "@/components/Header";
import { RedirectIfNeedsRole } from "./RedirectIfNeedsRole";

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
    <div className="min-h-screen bg-primary text-foreground">
      <RedirectIfNeedsRole needsRoleSelection={user.needsRoleSelection === true} />
      <Header session={session} />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
