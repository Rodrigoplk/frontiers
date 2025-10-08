import Link from "next/link";

export default function HomePage() {
  return (
    <main className="welcome-page">
      <div className="zipper-frame">
        <Link className="project-link" href="/elementalist">
          <span className="project-link__subtitle">Roadmap destacado</span>
          <span className="project-link__title">Seguimiento Elementalist</span>
          <span className="project-link__cta">Ver panel de progreso</span>
        </Link>

        <header className="hero">
          <h1 className="hero__title">Rodrigoplk playground</h1>
        </header>

        <section className="widget-highlight">
          <article className="widget-card">
            <span className="widget-card__tag">Adivina el número</span>
            <h3 className="widget-card__title">Pon a prueba tu intuición</h3>
            <p className="widget-card__description">
              Un minijuego rápido para descubrir el número secreto entre 1 y 50.
            </p>
            <Link className="widget-card__action" href="/widgets/adivina">
              Entrar al minijuego
            </Link>
          </article>

          <article className="widget-card">
            <span className="widget-card__tag">Sudoku toolkit</span>
            <h3 className="widget-card__title">Comprueba tus retículas</h3>
            <p className="widget-card__description">
              Construye un tablero desde cero y verifica si respeta las reglas y se puede resolver.
            </p>
            <Link className="widget-card__action" href="/widgets/validador">
              Validar un sudoku
            </Link>
          </article>

          <article className="widget-card">
            <span className="widget-card__tag">Clásico tablero de damas</span>
            <h3 className="widget-card__title">Reta a un rival en el tablero</h3>
            <p className="widget-card__description">
              Vive una partida completa con capturas encadenadas, coronación y registro de fichas capturadas.
            </p>
            <Link className="widget-card__action" href="/widgets/damas">
              Jugar una partida
            </Link>
          </article>

          <article className="widget-card">
            <span className="widget-card__tag">Imagine Craft</span>
            <h3 className="widget-card__title">Fusiona ideas y elementos</h3>
            <p className="widget-card__description">
              Diseña tus propios cuadros, arrástralos y descubre combinaciones dinámicas inspiradas en Infinite Craft.
            </p>
            <Link className="widget-card__action" href="/widgets/imagine-craft">
              Abrir el taller creativo
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}
