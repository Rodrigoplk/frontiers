'use client';

import { useMemo, useState } from 'react';

const GRID_SIZE = 9;

const createEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ''));

const toKey = (row, col) => `${row}-${col}`;

const isPlacementSafe = (board, row, col, value) => {
  for (let i = 0; i < GRID_SIZE; i += 1) {
    if (board[row][i] === value || board[i][col] === value) {
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

const findBestCell = (board) => {
  let bestRow = -1;
  let bestCol = -1;
  let bestCandidates = null;

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (board[row][col] !== 0) {
        continue;
      }

      const candidates = [];

      for (let value = 1; value <= GRID_SIZE; value += 1) {
        if (isPlacementSafe(board, row, col, value)) {
          candidates.push(value);
        }
      }

      if (candidates.length === 0) {
        return { row, col, candidates };
      }

      if (bestCandidates === null || candidates.length < bestCandidates.length) {
        bestRow = row;
        bestCol = col;
        bestCandidates = candidates;

        if (candidates.length === 1) {
          return { row: bestRow, col: bestCol, candidates: bestCandidates };
        }
      }
    }
  }

  if (bestCandidates === null) {
    return null;
  }

  return { row: bestRow, col: bestCol, candidates: bestCandidates };
};

const countSolutions = (board, limit = 2) => {
  const bestCell = findBestCell(board);

  if (bestCell === null) {
    return 1;
  }

  const { row, col, candidates } = bestCell;

  if (candidates.length === 0) {
    return 0;
  }

  let totalSolutions = 0;

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    board[row][col] = candidate;

    totalSolutions += countSolutions(board, limit - totalSolutions);

    board[row][col] = 0;

    if (totalSolutions >= limit) {
      return totalSolutions;
    }
  }

  return totalSolutions;
};

export default function SudokuValidator() {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [statusMessage, setStatusMessage] = useState(
    'Propón un sudoku rellenando las casillas que quieras y comprueba si es válido y único.'
  );
  const [invalidCells, setInvalidCells] = useState([]);

  const invalidCellSet = useMemo(() => new Set(invalidCells), [invalidCells]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const sanitized = value.replace(/[^1-9]/g, '').slice(0, 1);

    setGrid((previous) => {
      const next = previous.map((row) => row.slice());
      next[rowIndex][colIndex] = sanitized;
      return next;
    });
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid());
    setInvalidCells([]);
    setStatusMessage('Tablero reiniciado. ¡Listo para un nuevo intento!');
  };

  const validateSudoku = () => {
    const numericBoard = grid.map((row) =>
      row.map((cell) => {
        if (cell === '') {
          return 0;
        }

        const numericValue = Number(cell);

        if (Number.isNaN(numericValue) || numericValue < 1 || numericValue > 9) {
          return NaN;
        }

        return numericValue;
      })
    );

    let hasInvalid = false;
    const conflicts = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        const value = numericBoard[row][col];

        if (Number.isNaN(value)) {
          conflicts.push(toKey(row, col));
          hasInvalid = true;
          continue;
        }

        if (value === 0) {
          continue;
        }

        numericBoard[row][col] = 0;

        if (!isPlacementSafe(numericBoard, row, col, value)) {
          conflicts.push(toKey(row, col));
          hasInvalid = true;
        }

        numericBoard[row][col] = value;
      }
    }

    if (hasInvalid) {
      setInvalidCells(conflicts);
      if (conflicts.length > 0) {
        const [firstConflict] = conflicts;
        const [rowIndex, colIndex] = firstConflict
          .split('-')
          .map((part) => Number(part) + 1);
        setStatusMessage(
          `Hay conflictos en el tablero. Revisa la fila ${rowIndex} columna ${colIndex}.`
        );
      } else {
        setStatusMessage('Hay conflictos en el tablero. Revisa las casillas destacadas.');
      }
      return;
    }

    const boardForSolving = numericBoard.map((row) => row.slice());

    const solutionCount = countSolutions(boardForSolving, 2);

    if (solutionCount === 1) {
      setInvalidCells([]);
      setStatusMessage('✅ El sudoku es válido y tiene una única solución.');
    } else if (solutionCount === 0) {
      setInvalidCells([]);
      setStatusMessage('⚠️ El sudoku no se puede resolver sin romper las reglas.');
    } else {
      setInvalidCells([]);
      setStatusMessage('ℹ️ El sudoku es resoluble, pero tiene múltiples soluciones.');
    }
  };

  return (
    <main className="mini-game">
      <div className="puzzle-card">
        <header className="puzzle-card__header">
          <span className="puzzle-card__tag">Laboratorio lógico</span>
          <h1>Validador de sudokus</h1>
          <p>
            Comprueba si tu propuesta respeta las reglas clásicas: sin duplicados en filas,
            columnas ni regiones, y con exactamente una solución posible.
          </p>
        </header>

        <div className="sudoku-grid" role="group" aria-label="Tablero de sudoku editable">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="sudoku-grid__row">
              {row.map((value, colIndex) => {
                const cellKey = toKey(rowIndex, colIndex);
                const cellClasses = ['sudoku-cell'];

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
                      onChange={(event) =>
                        handleCellChange(rowIndex, colIndex, event.target.value)
                      }
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`Fila ${rowIndex + 1}, columna ${colIndex + 1}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sudoku-actions">
          <button type="button" onClick={validateSudoku}>
            Validar sudoku
          </button>
          <button type="button" onClick={clearGrid} className="sudoku-actions__secondary">
            Limpiar tablero
          </button>
        </div>

        <p className="sudoku-status" role="status" aria-live="polite">
          {statusMessage}
        </p>

        <a className="back-link" href="/">
          Volver a la base
        </a>
      </div>
    </main>
  );
}
