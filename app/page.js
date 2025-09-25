export default function HomePage() {
  return (
    <main className="welcome-page">
      <span className="zipper-strip top" aria-hidden="true" />
      <span className="zipper-strip bottom" aria-hidden="true" />

      <div className="zipper-frame">
        <header className="hero">
          <p className="hero__subtitle">Laboratorio personal</p>
          <h1 className="hero__title">Rodrigoplk repo</h1>
          <p className="hero__lead">
            Un espacio vivo para experimentar con widgets, utilidades instantáneas y minijuegos que van apareciendo cuando la inspiración golpea.
          </p>
        </header>

        <section className="vision">
          <div className="vision__panel">
            <h2>Ideas en iteración</h2>
            <p>
              El objetivo es construir un set de herramientas rápidas para el día a día: desde cronómetros personalizados hasta tableros lúdicos.
            </p>
          </div>
          <div className="vision__panel">
            <h2>Estética modular</h2>
            <p>
              Cada módulo tendrá su propia personalidad, manteniendo el hilo visual oscuro con destellos naranjas y bordes suaves.
            </p>
          </div>
        </section>

        <section className="widget-highlight">
          <article className="widget-card">
            <span className="widget-card__tag">Widget destacado</span>
            <h3 className="widget-card__title">Adivina el número</h3>
            <p className="widget-card__description">
              Un pequeño desafío de intuición para calentar la mente: intenta adivinar el número secreto entre 1 y 50 en los menores intentos posibles.
            </p>
            <a className="widget-card__action" href="/widgets/adivina">
              Entrar al minijuego
            </a>
          </article>
        </section>

        <footer className="roadmap">
          <h4>En la hoja de ruta:</h4>
          <ul>
            <li>Widgets de productividad en vivo.</li>
            <li>Mini retos que se resuelven en 2 minutos.</li>
            <li>Integraciones con APIs curiosas.</li>
          </ul>
        </footer>
      </div>
    </main>
  );
}
