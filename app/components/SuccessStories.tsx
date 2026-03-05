const stories = [
  {
    initials: "JD",
    name: "Jana Doe",
    role: "Streamer · Twitch",
    quote: "El engagement de mi comunidad subió desde el primer mes. Los trofeos son adictivos en el buen sentido.",
  },
  {
    initials: "MK",
    name: "Mike Kick",
    role: "Creador · Kick",
    quote: "Finalmente una herramienta que entiende a los streamers. La integración con Kick es perfecta.",
  },
  {
    initials: "LR",
    name: "Laura River",
    role: "Streamer · Twitch",
    quote: "Mis subs preguntan por nuevos trofeos cada semana. S-Rank se ha vuelto parte de la identidad del canal.",
  },
  {
    initials: "CP",
    name: "Carlos Play",
    role: "Creador · Twitch y Kick",
    quote: "Uso S-Rank en ambas plataformas. Un solo panel para todo. No podría volver atrás.",
  },
];

export function SuccessStories() {
  return (
    <section className="bg-primary px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          Historias de éxito
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {stories.map(({ initials, name, role, quote }) => (
            <div
              key={name}
              className="rounded-xl border border-secondary/80 bg-secondary/50 p-6 transition hover:border-accent/30"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-foreground-muted">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-foreground-muted">{role}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground-muted">&ldquo;{quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
