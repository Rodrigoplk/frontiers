import { Suspense } from 'react';

import SudokuPlayer from './SudokuPlayer';

export const metadata = {
  title: 'Jugar sudoku | Rodrigoplk repo',
  description:
    'Resuelve el sudoku que has validado: completa las casillas vacías manteniendo las reglas clásicas.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mini-game">
          <div className="puzzle-card">
            <header className="puzzle-card__header">
              <span className="puzzle-card__tag">Modo juego</span>
              <h1>Jugar sudoku</h1>
              <p>Preparando el tablero…</p>
            </header>
          </div>
        </main>
      }
    >
      <SudokuPlayer />
    </Suspense>
  );
}
