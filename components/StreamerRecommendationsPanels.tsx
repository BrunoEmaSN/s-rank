import Link from "next/link";
import { TrophyIcon, TvIcon, PeopleIcon, ChartIcon } from "@/components/icons";
import { IoArrowForward } from "react-icons/io5";

const recommendations = [
  {
    href: "/settings",
    icon: TvIcon,
    title: "Conecta tu canal",
    description: "Vincula Twitch o Kick para activar trofeos y sincronizar datos con tu comunidad.",
  },
  {
    href: "/trophies/new",
    icon: TrophyIcon,
    title: "Crea tu primer trofeo",
    description: "Diseña trofeos únicos con reglas de desbloqueo por horas, suscripciones o manual.",
  },
  {
    href: "/followers",
    icon: PeopleIcon,
    title: "Revisa quién te sigue",
    description: "Ve los usuarios que siguen tu canal y su progreso en trofeos.",
  },
  {
    href: "/trophies",
    icon: ChartIcon,
    title: "Gestiona tus trofeos",
    description: "Edita, activa o desactiva trofeos y revisa cómo los desbloquean tus viewers.",
  },
];

export function StreamerRecommendationsPanels() {
  return (
    <section className="min-w-0 rounded-xl border border-secondary/80 bg-secondary/50 p-4 sm:p-6">
      <h2
        className="mb-3 text-base font-semibold text-foreground-muted sm:mb-4 sm:text-lg"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Recomendaciones
      </h2>
      <p className="mb-4 text-xs text-foreground-muted sm:mb-6 sm:text-sm">
        Acciones que te ayudan a sacar más partido a tu canal.
      </p>
      <div className="grid min-w-0 gap-3 sm:gap-4 sm:grid-cols-2">
        {recommendations.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="block min-w-0 rounded-xl border border-secondary/80 bg-primary p-4 transition hover:border-accent/50 hover:bg-secondary/30 sm:p-5"
          >
            <Icon className="mb-2 h-8 w-8 text-accent sm:mb-3 sm:h-9 sm:w-9" aria-hidden />
            <h3 className="mb-1 text-sm font-semibold text-foreground sm:text-base">{title}</h3>
            <p className="text-xs text-foreground-muted sm:text-sm wrap-break-word">{description}</p>
            <p className="mt-2 text-sm font-medium text-accent flex justify-center items-center gap-1">
              Ir <IoArrowForward className="size-5" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
