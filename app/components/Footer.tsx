import Link from "next/link";
import { TrophyIcon } from "./icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary/50 bg-primary px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 text-foreground no-underline">
              <TrophyIcon className="h-6 w-6 text-accent" aria-hidden />
              <span className="font-bold" style={{ fontFamily: "var(--font-quantico)" }}>
                S-Rank
              </span>
            </Link>
            <p className="mb-4 max-w-xs text-sm text-foreground-muted">
              Sistema de trofeos para streamers. Recompensa a tu comunidad con logros desbloqueables en Twitch y Kick.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="text-sm text-foreground-muted hover:text-accent">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-foreground-muted hover:text-accent">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-foreground-muted hover:text-accent">
                Terms
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Redes sociales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground-muted hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground-muted hover:text-accent">
                  Twitter / X
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground-muted hover:text-accent">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-foreground-muted hover:text-accent">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground-muted hover:text-accent">
                  Términos de uso
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="mailto:hola@s-rank.app" className="text-sm text-foreground-muted hover:text-accent">
                  hola@s-rank.app
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-secondary/50 pt-8 text-center text-sm text-foreground-muted">
          © {currentYear} S-Rank. Sistema de trofeos para streamers.
        </div>
      </div>
    </footer>
  );
}
