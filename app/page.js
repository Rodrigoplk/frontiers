import Link from "next/link";

export default function HomePage() {
  return (
    <main className="welcome-page">
      <div className="zipper-frame">
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
        </section>
      </div>
    </main>
  );
}
