import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { HiOutlineBell } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="mx-auto flex flex-col w-full min-h-[calc(100vh-var(--header-height,0px))] min-w-0 max-w-6xl px-3 py-6 pb-24 sm:px-4 sm:py-8 md:pb-10 md:px-8 md:py-10">
      <div className="flex justify-between items-center gap-2 mb-4">
        <Link href="/" className="w-fit flex items-center gap-2">
          <BackButton variant="ghost" size="lg" className="w-fit flex items-center gap-2">
            <IoArrowBack className="size-5" />
            <span className="text-sm">Volver</span>
          </BackButton>
        </Link>
        <h1 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
          <HiOutlineBell className="h-7 w-7" aria-hidden />
          Notificaciones
        </h1>
      </div>
      <p className="text-foreground-muted">
        Aquí aparecerán tus notificaciones. Próximamente.
      </p>
    </div>
  );
}
