import Link from "next/link";
import { TrophyIcon } from "../../components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary text-foreground">
      <header className="border-b border-secondary/50 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
          <TrophyIcon className="h-8 w-8 text-accent" aria-hidden />
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-quantico)" }}>
            S-Rank
          </span>
        </Link>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
