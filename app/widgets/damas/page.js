import CheckersGame from './CheckersGame';

export const metadata = {
  title: 'Juego de damas | Rodrigoplk repo',
  description:
    'Un tablero de damas totalmente interactivo para dos personas con capturas encadenadas, coronación y registro de piezas capturadas.',
};

export default function Page() {
  return <CheckersGame />;
}
