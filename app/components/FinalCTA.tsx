import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 md:px-8 md:py-28">
      {/* Patrón sutil de líneas diagonales */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            var(--color-accent) 20px,
            var(--color-accent) 21px
          )`,
        }}
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <h2
          className="mb-4 text-3xl font-bold text-foreground md:text-4xl"
          style={{ fontFamily: "var(--font-zen-kaku)" }}
        >
          ¿Listo para empezar?
        </h2>
        <p className="mb-8 text-lg text-foreground-muted">
          Únete ahora y empieza a recompensar a tu comunidad con un sistema de trofeos único. Twitch y Kick en un solo
          lugar.
        </p>
        <Link
          href="/sign-up"
          className="inline-block rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground no-underline transition hover:opacity-90"
        >
          Crear cuenta gratis
        </Link>
      </div>
    </section>
  );
}
