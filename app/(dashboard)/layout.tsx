import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { RedirectIfNeedsRole } from "./RedirectIfNeedsRole";
import { Footer } from "@/components/Footer";

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
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">{children}</main>
      <Footer />
    </>
  );
}
