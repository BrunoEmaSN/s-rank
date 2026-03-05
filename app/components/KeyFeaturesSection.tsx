import {
  TrophyIcon,
  LockIcon,
  PeopleIcon,
  ChartIcon,
  PuzzleIcon,
  ShieldIcon,
} from "./icons";

const features = [
  {
    icon: TrophyIcon,
    title: "Trofeos personalizados",
    description: "Diseña trofeos únicos para tu canal. Define iconos, nombres y criterios de desbloqueo.",
  },
  {
    icon: LockIcon,
    title: "Desbloqueo automático",
    description: "Conecta Twitch y Kick. Los trofeos se desbloquean según horas, suscripciones y eventos.",
  },
  {
    icon: PeopleIcon,
    title: "Gestión de comunidad",
    description: "Visualiza quién tiene cada trofeo y gestiona los logros de tus suscriptores desde un solo panel.",
  },
  {
    icon: ChartIcon,
    title: "Analíticas avanzadas",
    description: "Métricas de engagement, trofeos más desbloqueados y comportamiento de tu comunidad.",
  },
  {
    icon: PuzzleIcon,
    title: "Integraciones API",
    description: "Integración nativa con Twitch y Kick. Más plataformas en el roadmap.",
  },
  {
    icon: ShieldIcon,
    title: "Seguridad robusta",
    description: "OAuth seguro y datos de tu comunidad protegidos. Cumplimiento con las políticas de las plataformas.",
  },
];

export function KeyFeaturesSection() {
  return (
    <section className="bg-primary px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Características clave
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/30"
            >
              <Icon className="mb-3 h-10 w-10 text-accent" aria-hidden />
              <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-foreground-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
