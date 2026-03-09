import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen mx-auto max-w-6xl px-4 md:px-8 bg-primary text-foreground relative">
      <Link href="/" className="mb-4 absolute top-4 left-4 w-fit">
        <Button variant="ghost" size="lg" className="flex items-center gap-2">
          <IoArrowBack className="size-5" />
          <span className="text-sm">Volver</span>
        </Button>
      </Link>
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col items-center justify-center py-10">
        {children}
      </main>
    </div>
  );
}
