import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { HiOutlineBell } from "react-icons/hi";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
        <HiOutlineBell className="h-7 w-7" aria-hidden />
        Notificaciones
      </h1>
      <p className="text-foreground-muted">
        Aquí aparecerán tus notificaciones. Próximamente.
      </p>
    </div>
  );
}
