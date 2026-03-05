import { getSession } from "@/lib/auth-server";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await getSession();
  const user = session?.user as {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    needsRoleSelection?: boolean;
  } | undefined;

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Ajustes
      </h1>
      <SettingsForm
        defaultName={user?.name ?? ""}
        defaultEmail={user?.email ?? ""}
        role={(user?.role as "streamer" | "sub") ?? "sub"}
      />
    </div>
  );
}
