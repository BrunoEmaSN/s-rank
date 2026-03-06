"use client";

import { EngagementIcon, PeopleIcon, ShieldIcon, ChartIcon } from "@/components/icons";

const tips = [
  {
    icon: EngagementIcon,
    title: "Interactúa con tu comunidad",
    description: "Responde comentarios y publicaciones. La participación activa hace que los miembros se sientan escuchados y fideliza.",
  },
  {
    icon: PeopleIcon,
    title: "Invita a tu audiencia",
    description: "Menciona tu comunidad en stream y anima a tus viewers a unirse. Es la mejor forma de hacerla crecer.",
  },
  {
    icon: ShieldIcon,
    title: "Modera con criterio",
    description: "Mantén un ambiente sano. Revisa reportes y establece normas claras para que todos disfruten.",
  },
  {
    icon: ChartIcon,
    title: "Publica con regularidad",
    description: "Comparte novedades, horarios o avisos. El feed activo mantiene a la comunidad enganchada.",
  },
];

export function StreamerCommunityTips() {
  return (
    <section className="rounded-xl border border-secondary/80 bg-secondary/50 p-6">
      <h2
        className="mb-2 text-lg font-semibold text-foreground-muted"
        style={{ fontFamily: "var(--font-zen-kaku)" }}
      >
        Tips para tu comunidad
      </h2>
      <p className="mb-6 text-sm text-foreground-muted">
        Ideas para sacar más partido a tu espacio de comunidad.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {tips.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-secondary/80 bg-primary p-5 transition hover:border-accent/50"
          >
            <Icon className="mb-3 h-9 w-9 text-accent" aria-hidden />
            <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
