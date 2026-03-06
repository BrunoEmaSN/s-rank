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
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <h2
        className="mb-4 text-lg font-semibold text-foreground-muted"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Recomendaciones
      </h2>
      <p className="mb-6 text-sm text-foreground-muted">
        Acciones que te ayudan a sacar más partido a tu canal.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="block rounded-xl border border-secondary/80 bg-primary p-5 transition hover:border-accent/50 hover:bg-secondary/30"
          >
            <Icon className="mb-3 h-9 w-9 text-accent" aria-hidden />
            <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground-muted">{description}</p>
            <p className="mt-2 text-sm font-medium text-accent flex justify-center items-center gap-1">
              Ir <IoArrowForward className="size-5" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
