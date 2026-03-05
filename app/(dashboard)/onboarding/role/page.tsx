import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { OnboardingRoleForm } from "./onboarding-role-form";

export default async function OnboardingRolePage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const user = session.user as { role?: string; needsRoleSelection?: boolean };
  if (user.needsRoleSelection === false) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <h1
        className="mb-2 text-center text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Elige tu rol
      </h1>
      <p className="mb-6 text-center text-foreground-muted">
        Indica cómo vas a usar S-Rank
      </p>
      <OnboardingRoleForm />
    </div>
  );
}
