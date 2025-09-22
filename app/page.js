export default function HomePage() {
  return (
    <main style={{
      minHeight: '100dvh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji"'
    }}>
      <section style={{
        maxWidth: 760,
        width: '100%',
        borderRadius: 16,
        padding: '2.5rem',
        boxShadow: '0 10px 35px rgba(0,0,0,.08)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>
          ¡Bienvenido a tu página Next.js!
        </h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: '1rem', opacity: .85 }}>
          Esta landing está lista para desplegarse en <strong>GitHub Pages</strong> usando <em>GitHub Actions</em>, sin servidor y sin coste.
        </p>

        <div style={{ display: 'grid', gap: '.75rem', marginTop: '2rem' }}>
          <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer"
             style={{ textDecoration: 'none' }}>
            📘 Documentación de Next.js
          </a>
          <a href="https://docs.github.com/en/pages" target="_blank" rel="noreferrer"
             style={{ textDecoration: 'none' }}>
            🐙 Guía de GitHub Pages
          </a>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '.95rem', opacity: .7 }}>
          Edita <code>app/page.js</code> y haz <code>git push</code> para ver cambios.
        </p>
      </section>
    </main>
  );
}
