import SudokuPlayer from './SudokuPlayer';

export const metadata = {
  title: 'Jugar sudoku | Rodrigoplk repo',
  description:
    'Resuelve el sudoku que has validado: completa las casillas vacías manteniendo las reglas clásicas.',
};

export default function Page() {
  return <SudokuPlayer />;
}
