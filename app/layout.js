import './globals.css';

export const metadata = {
  title: 'Rodrigoplk repo',
  description: 'Laboratorio de utilidades y minijuegos personales de Rodrigoplk',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body className="theme-body">
        {children}
      </body>
    </html>
  );
}
