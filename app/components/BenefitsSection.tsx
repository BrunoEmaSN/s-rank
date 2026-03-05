import { EngagementIcon, GamepadIcon, GiftIcon } from "./icons";

const benefits = [
  {
    icon: EngagementIcon,
    title: "Fomentan el engagement",
    description:
      "Los trofeos motivan a tus suscriptores a seguir viendo y participando. Cada logro desbloqueado refuerza su vínculo con tu canal.",
  },
  {
    icon: GamepadIcon,
    title: "Gamificación",
    description:
      "Convierte la experiencia de ver tu stream en un juego. Horas vistas, rachas y metas se traducen en trofeos únicos.",
  },
  {
    icon: GiftIcon,
    title: "Recompensas y más",
    description:
      "Recompensa lealtad, suscripciones y participación con trofeos personalizados que solo tu comunidad puede desbloquear.",
  },
];

export function BenefitsSection() {
  return (
    <section className="bg-primary px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Mantén a tus espectadores comprometidos y fidelizados
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 text-center transition hover:border-accent/30"
            >
              <div className="mb-4 flex justify-center">
                <Icon className="h-12 w-12 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-foreground-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
