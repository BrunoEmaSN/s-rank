import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { CreateTrophyForm } from "./CreateTrophyForm";

export default async function NewTrophyPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role?: string }).role;
  if (role !== "streamer") redirect("/dashboard");

  return (
    <div>
      <h1
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Crear trofeo
      </h1>
      <p className="mb-6 text-foreground-muted">
        Define título, descripción, tipo y reglas de desbloqueo. Puedes elegir si se desbloquea automáticamente (por reglas) o lo otorgas tú manualmente.
      </p>
      <CreateTrophyForm />
    </div>
  );
}
