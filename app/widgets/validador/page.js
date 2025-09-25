import SudokuValidator from './SudokuValidator';

export const metadata = {
  title: 'Validador de sudokus | Rodrigoplk repo',
  description:
    'Introduce tus números y valida al instante si un tablero de sudoku es coherente y resoluble.',
};

export default function Page() {
  return <SudokuValidator />;
}
