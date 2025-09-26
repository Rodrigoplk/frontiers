'use client';

import { useMemo, useState } from 'react';
import styles from './CheckersGame.module.css';

const BOARD_SIZE = 8;
const PLAYER_ONYX = 'onyx';
const PLAYER_EMBER = 'ember';

const PLAYER_INFO = {
  [PLAYER_ONYX]: {
    label: 'Onyx',
    direction: 1,
  },
  [PLAYER_EMBER]: {
    label: 'Ámbar',
    direction: -1,
  },
};

function createInitialBoard() {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if ((row + col) % 2 === 0) continue;

      if (row < 3) {
        board[row][col] = { player: PLAYER_ONYX, king: false };
      } else if (row > 4) {
        board[row][col] = { player: PLAYER_EMBER, king: false };
      }
    }
  }

  return board;
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function inBounds(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function shouldPromote(player, row) {
  if (player === PLAYER_ONYX) {
    return row === BOARD_SIZE - 1;
  }
  return row === 0;
}

function getPieceDirections(piece) {
  if (piece.king) {
    return [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
  }

  const forward = PLAYER_INFO[piece.player].direction;
  return [
    [forward, 1],
    [forward, -1],
  ];
}

function getNormalMoves(board, row, col, piece) {
  const directions = getPieceDirections(piece);
  const moves = [];

  directions.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    if (!inBounds(targetRow, targetCol)) return;
    if (board[targetRow][targetCol]) return;

    moves.push({ row: targetRow, col: targetCol, captures: [] });
  });

  return moves;
}

function getCaptureSequences(board, row, col, piece, capturesSoFar = []) {
  const directions = getPieceDirections(piece);
  let sequences = [];
  let foundCapture = false;

  directions.forEach(([dr, dc]) => {
    const midRow = row + dr;
    const midCol = col + dc;
    const landingRow = row + dr * 2;
    const landingCol = col + dc * 2;

    if (!inBounds(midRow, midCol) || !inBounds(landingRow, landingCol)) return;

    const jumpedPiece = board[midRow][midCol];
    if (!jumpedPiece || jumpedPiece.player === piece.player) return;
    if (board[landingRow][landingCol]) return;

    foundCapture = true;

    const newBoard = cloneBoard(board);
    const promoted = piece.king || shouldPromote(piece.player, landingRow);
    const movedPiece = { player: piece.player, king: promoted };

    newBoard[row][col] = null;
    newBoard[midRow][midCol] = null;
    newBoard[landingRow][landingCol] = movedPiece;

    const deeperSequences = getCaptureSequences(newBoard, landingRow, landingCol, movedPiece, [
      ...capturesSoFar,
      { row: midRow, col: midCol, piece: jumpedPiece },
    ]);

    sequences = sequences.concat(deeperSequences);
  });

  if (!foundCapture && capturesSoFar.length > 0) {
    sequences.push({ row, col, captures: capturesSoFar });
  }

  return sequences;
}

function collectPlayerMoves(board, player, forcedOrigin) {
  const movesByPiece = new Map();
  let hasCaptures = false;

  const registerMoves = (row, col, piece) => {
    const captureMoves = getCaptureSequences(board, row, col, piece);

    if (captureMoves.length > 0) {
      hasCaptures = true;
      movesByPiece.set(`${row}-${col}`, captureMoves);
      return;
    }

    const normalMoves = getNormalMoves(board, row, col, piece);
    if (normalMoves.length > 0) {
      movesByPiece.set(`${row}-${col}`, normalMoves);
    }
  };

  if (forcedOrigin) {
    const { row, col } = forcedOrigin;
    const piece = board[row][col];
    if (piece && piece.player === player) {
      registerMoves(row, col, piece);
    }
    return { movesByPiece, hasCaptures: true };
  }

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.player !== player) continue;
      registerMoves(row, col, piece);
    }
  }

  if (hasCaptures) {
    Array.from(movesByPiece.entries()).forEach(([key, moves]) => {
      const captureOnly = moves.filter((move) => move.captures.length > 0);
      if (captureOnly.length > 0) {
        movesByPiece.set(key, captureOnly);
      } else {
        movesByPiece.delete(key);
      }
    });
  }

  return { movesByPiece, hasCaptures };
}

function countPieces(board, player) {
  return board.reduce(
    (acc, row) =>
      acc + row.reduce((rowAcc, cell) => rowAcc + (cell && cell.player === player ? 1 : 0), 0),
    0,
  );
}

function hasAnyMoves(board, player) {
  const { movesByPiece } = collectPlayerMoves(board, player, null);
  return movesByPiece.size > 0;
}

function evaluateWinner(board) {
  const onyxPieces = countPieces(board, PLAYER_ONYX);
  const emberPieces = countPieces(board, PLAYER_EMBER);

  if (onyxPieces === 0) return PLAYER_EMBER;
  if (emberPieces === 0) return PLAYER_ONYX;

  const onyxCanMove = hasAnyMoves(board, PLAYER_ONYX);
  const emberCanMove = hasAnyMoves(board, PLAYER_EMBER);

  if (!onyxCanMove && emberCanMove) return PLAYER_EMBER;
  if (!emberCanMove && onyxCanMove) return PLAYER_ONYX;
  if (!emberCanMove && !onyxCanMove) return 'draw';

  return null;
}

export default function CheckersGame() {
  const [board, setBoard] = useState(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONYX);
  const [selected, setSelected] = useState(null);
  const [forcedOrigin, setForcedOrigin] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({
    [PLAYER_ONYX]: [],
    [PLAYER_EMBER]: [],
  });
  const [winner, setWinner] = useState(null);

  const { movesByPiece, hasCaptures } = useMemo(
    () => collectPlayerMoves(board, currentPlayer, forcedOrigin),
    [board, currentPlayer, forcedOrigin],
  );

  const selectedKey = selected ? `${selected.row}-${selected.col}` : null;
  const availableMoves = selectedKey && movesByPiece.has(selectedKey) ? movesByPiece.get(selectedKey) : [];
  const availableTargets = useMemo(
    () => new Set(availableMoves.map((move) => `${move.row}-${move.col}`)),
    [availableMoves],
  );

  const statusText = useMemo(() => {
    if (winner) {
      if (winner === 'draw') return 'La partida ha terminado en tablas.';
      return `¡${PLAYER_INFO[winner].label} conquista la corona!`;
    }

    const playerLabel = PLAYER_INFO[currentPlayer].label;
    if (forcedOrigin) {
      return `${playerLabel}: continúa capturando con la misma pieza.`;
    }

    if (hasCaptures) {
      return `${playerLabel}: hay capturas obligatorias disponibles.`;
    }

    return `Turno de ${playerLabel}.`;
  }, [currentPlayer, forcedOrigin, hasCaptures, winner]);

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer(PLAYER_ONYX);
    setSelected(null);
    setForcedOrigin(null);
    setCapturedPieces({
      [PLAYER_ONYX]: [],
      [PLAYER_EMBER]: [],
    });
    setWinner(null);
  };

  const trySelectPiece = (row, col) => {
    const key = `${row}-${col}`;
    if (!movesByPiece.has(key)) return;
    setSelected({ row, col });
  };

  const completeTurn = (nextBoard, movedPiecePosition, captures) => {
    if (captures.length > 0) {
      const opponent = currentPlayer === PLAYER_ONYX ? PLAYER_EMBER : PLAYER_ONYX;
      setCapturedPieces((prev) => ({
        ...prev,
        [opponent]: [
          ...prev[opponent],
          ...captures.map((capture) => ({ king: capture.piece.king })),
        ],
      }));
    }

    const potentialWinner = evaluateWinner(nextBoard);
    if (potentialWinner) {
      setBoard(nextBoard);
      setSelected(null);
      setForcedOrigin(null);
      setWinner(potentialWinner);
      return;
    }

    if (captures.length > 0 && movedPiecePosition) {
      const { row, col } = movedPiecePosition;
      const piece = nextBoard[row][col];
      if (piece) {
        const extraCaptures = getCaptureSequences(nextBoard, row, col, piece);

        if (extraCaptures.length > 0) {
          setBoard(nextBoard);
          setSelected({ row, col });
          setForcedOrigin({ row, col });
          return;
        }
      }
    }

    setBoard(nextBoard);
    setSelected(null);
    setForcedOrigin(null);
    setCurrentPlayer((prev) => (prev === PLAYER_ONYX ? PLAYER_EMBER : PLAYER_ONYX));
  };

  const handleCellClick = (row, col) => {
    if (winner) return;

    const clickedKey = `${row}-${col}`;

    if (selected && availableTargets.has(clickedKey)) {
      const origin = selected;
      const key = `${origin.row}-${origin.col}`;
      const moves = movesByPiece.get(key) || [];
      const chosenMove = moves.find((move) => move.row === row && move.col === col);

      if (!chosenMove) return;

      const nextBoard = cloneBoard(board);
      const piece = nextBoard[origin.row][origin.col];
      if (!piece) {
        setSelected(null);
        return;
      }

      nextBoard[origin.row][origin.col] = null;

      chosenMove.captures.forEach((capture) => {
        if (nextBoard[capture.row][capture.col]) {
          nextBoard[capture.row][capture.col] = null;
        }
      });

      const promoted = piece.king || shouldPromote(piece.player, row);
      nextBoard[row][col] = { player: piece.player, king: promoted };

      completeTurn(nextBoard, { row, col }, chosenMove.captures);
      return;
    }

    const piece = board[row][col];

    if (piece && piece.player === currentPlayer) {
      if (selected && selected.row === row && selected.col === col) {
        setSelected(null);
        return;
      }

      trySelectPiece(row, col);
      return;
    }

    if (selected) {
      setSelected(null);
    }
  };

  return (
    <div className={styles.gameShell}>
      <header className={styles.gameHeader}>
        <h1>Tablero clásico de damas</h1>
        <p>{statusText}</p>
        <button type="button" className={styles.resetButton} onClick={resetGame}>
          Reiniciar partida
        </button>
      </header>

      <div className={styles.boardWrapper}>
        <div className={styles.capturedColumn}>
          <h2>{PLAYER_INFO[PLAYER_ONYX].label}</h2>
          <div className={styles.capturedTray}>
            {capturedPieces[PLAYER_ONYX].length === 0 ? (
              <span className={styles.emptyTray}>Sin capturas</span>
            ) : (
              capturedPieces[PLAYER_ONYX].map((piece, index) => (
                <span key={`onyx-${index}`} className={`${styles.piece} ${styles.onyxPiece} ${piece.king ? styles.kingPiece : ''}`} />
              ))
            )}
          </div>
        </div>

        <div className={styles.board}>
          {board.map((rowArr, rowIdx) => (
            <div key={`row-${rowIdx}`} className={styles.boardRow}>
              {rowArr.map((cell, colIdx) => {
                const cellKey = `${rowIdx}-${colIdx}`;
                const isDarkSquare = (rowIdx + colIdx) % 2 === 1;
                const isSelected = selected && selected.row === rowIdx && selected.col === colIdx;
                const isTarget = availableTargets.has(cellKey);
                const isForced = forcedOrigin && forcedOrigin.row === rowIdx && forcedOrigin.col === colIdx;

                return (
                  <button
                    type="button"
                    key={cellKey}
                    className={[
                      styles.boardCell,
                      isDarkSquare ? styles.darkSquare : styles.lightSquare,
                      isSelected ? styles.selectedCell : '',
                      isTarget ? styles.targetCell : '',
                      isForced ? styles.forcedCell : '',
                    ].join(' ')}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    disabled={!isDarkSquare}
                  >
                    {cell ? (
                      <span
                        className={[
                          styles.piece,
                          cell.player === PLAYER_ONYX ? styles.onyxPiece : styles.emberPiece,
                          cell.king ? styles.kingPiece : '',
                        ].join(' ')}
                      >
                        {cell.king ? <span className={styles.crown}>♛</span> : null}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.capturedColumn}>
          <h2>{PLAYER_INFO[PLAYER_EMBER].label}</h2>
          <div className={styles.capturedTray}>
            {capturedPieces[PLAYER_EMBER].length === 0 ? (
              <span className={styles.emptyTray}>Sin capturas</span>
            ) : (
              capturedPieces[PLAYER_EMBER].map((piece, index) => (
                <span key={`ember-${index}`} className={`${styles.piece} ${styles.emberPiece} ${piece.king ? styles.kingPiece : ''}`} />
              ))
            )}
          </div>
        </div>
      </div>

      {winner ? (
        <div className={styles.winnerBanner}>
          {winner === 'draw' ? 'Tablas: no quedan movimientos legales.' : `Victoria para ${PLAYER_INFO[winner].label}!`}
        </div>
      ) : null}
    </div>
  );
}
