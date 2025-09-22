export const metadata = {
  title: 'Bienvenido | Next.js + GitHub Pages',
  description: 'Landing mínima de Next.js exportada a GitHub Pages'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
