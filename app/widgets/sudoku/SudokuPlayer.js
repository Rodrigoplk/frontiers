'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const GRID_SIZE = 9;

const toKey = (row, col) => `${row}-${col}`;

const parseBoardParam = (boardParam) => {
  const sanitized = (boardParam || '').replace(/[^0-9]/g, '').slice(0, GRID_SIZE * GRID_SIZE);
  const padded = sanitized.padEnd(GRID_SIZE * GRID_SIZE, '0');

  const grid = [];
  const locked = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    const gridRow = [];
    const lockedRow = [];

    for (let col = 0; col < GRID_SIZE; col += 1) {
      const digit = padded[row * GRID_SIZE + col];
      gridRow.push(digit === '0' ? '' : digit);
      lockedRow.push(digit !== '0');
    }

    grid.push(gridRow);
    locked.push(lockedRow);
  }

  return { grid, locked };
};

const isPlacementSafe = (board, row, col, value) => {
  for (let index = 0; index < GRID_SIZE; index += 1) {
    if (board[row][index] === value || board[index][col] === value) {
      return false;
    }
  }

  const subgridRow = Math.floor(row / 3) * 3;
  const subgridCol = Math.floor(col / 3) * 3;

  for (let r = subgridRow; r < subgridRow + 3; r += 1) {
    for (let c = subgridCol; c < subgridCol + 3; c += 1) {
      if (board[r][c] === value) {
        return false;
      }
    }
  }

  return true;
};

const evaluateBoard = (grid) => {
  const numericBoard = grid.map((row) => row.map((cell) => (cell === '' ? 0 : Number(cell))));
  const conflicts = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const value = numericBoard[row][col];

      if (value === 0) {
        continue;
      }

      numericBoard[row][col] = 0;

      if (!isPlacementSafe(numericBoard, row, col, value)) {
        conflicts.push(toKey(row, col));
      }

      numericBoard[row][col] = value;
    }
  }

  const isComplete = conflicts.length === 0 && numericBoard.every((row) => row.every((cell) => cell !== 0));

  return { conflicts, isComplete };
};

export default function SudokuPlayer() {
  const searchParams = useSearchParams();
  const boardParam = searchParams.get('board') ?? '';
  const parsedBoard = useMemo(() => parseBoardParam(boardParam), [boardParam]);
  const [grid, setGrid] = useState(parsedBoard.grid);
  const [lockedCells, setLockedCells] = useState(parsedBoard.locked);
  const [invalidCells, setInvalidCells] = useState([]);
  const [statusMessage, setStatusMessage] = useState(
    'Completa el sudoku manteniendo filas, columnas y regiones sin números repetidos.'
  );

  useEffect(() => {
    setGrid(parsedBoard.grid.map((row) => row.slice()));
    setLockedCells(parsedBoard.locked.map((row) => row.slice()));
    setInvalidCells([]);
    setStatusMessage('Completa el sudoku manteniendo filas, columnas y regiones sin números repetidos.');
  }, [parsedBoard]);

  const invalidCellSet = useMemo(() => new Set(invalidCells), [invalidCells]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    if (lockedCells[rowIndex][colIndex]) {
      return;
    }

    const sanitized = value.replace(/[^1-9]/g, '');
    const nextValue = sanitized.length > 0 ? sanitized[sanitized.length - 1] : '';

    setGrid((previous) => {
      const next = previous.map((row) => row.slice());
      next[rowIndex][colIndex] = nextValue;
      return next;
    });

    setInvalidCells([]);
    setStatusMessage('Pulsa «Verificar progreso» para comprobar si hay conflictos.');
  };

  const verifyProgress = () => {
    const { conflicts, isComplete } = evaluateBoard(grid);
    setInvalidCells(conflicts);

    if (conflicts.length > 0) {
      const [firstConflict] = conflicts;
      const [rowIndex, colIndex] = firstConflict.split('-').map((part) => Number(part) + 1);
      setStatusMessage(`Hay conflictos en el tablero. Revisa la fila ${rowIndex} columna ${colIndex}.`);
      return;
    }

    if (isComplete) {
      setStatusMessage('🎉 ¡Sudoku resuelto! Todas las casillas son válidas.');
      return;
    }

    setStatusMessage('¡Buen progreso! No hay conflictos detectados por ahora.');
  };

  const resetBoard = () => {
    setGrid(parsedBoard.grid.map((row) => row.slice()));
    setInvalidCells([]);
    setStatusMessage('Tablero restablecido al estado inicial.');
  };

  return (
    <main className="mini-game">
      <div className="puzzle-card">
        <header className="puzzle-card__header">
          <span className="puzzle-card__tag">Modo juego</span>
          <h1>Jugar sudoku</h1>
          <p>
            Rellena las casillas vacías respetando las reglas clásicas. Las casillas originales están
            bloqueadas para que mantengas el reto tal y como se validó.
          </p>
        </header>

        <div className="sudoku-grid" role="group" aria-label="Tablero de sudoku para jugar">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="sudoku-grid__row">
              {row.map((value, colIndex) => {
                const cellKey = toKey(rowIndex, colIndex);
                const cellClasses = ['sudoku-cell'];

                if (lockedCells[rowIndex][colIndex]) {
                  cellClasses.push('sudoku-cell--fixed');
                }

                if (invalidCellSet.has(cellKey)) {
                  cellClasses.push('sudoku-cell--error');
                }

                if (colIndex === 2 || colIndex === 5) {
                  cellClasses.push('sudoku-cell--divider-right');
                }

                if (rowIndex === 2 || rowIndex === 5) {
                  cellClasses.push('sudoku-cell--divider-bottom');
                }

                return (
                  <div key={cellKey} className={cellClasses.join(' ')}>
                    <input
                      value={value}
                      onChange={(event) => handleCellChange(rowIndex, colIndex, event.target.value)}
                      inputMode="numeric"
                      maxLength={1}
                      disabled={lockedCells[rowIndex][colIndex]}
                      aria-label={`Fila ${rowIndex + 1}, columna ${colIndex + 1}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sudoku-actions">
          <button type="button" onClick={verifyProgress}>
            Verificar progreso
          </button>
          <button type="button" onClick={resetBoard} className="sudoku-actions__secondary">
            Reiniciar tablero
          </button>
        </div>

        <p className="sudoku-status" role="status" aria-live="polite">
          {statusMessage}
        </p>

        <a className="back-link" href="/frontiers">
          Volver a la base
        </a>
      </div>
    </main>
  );
}
