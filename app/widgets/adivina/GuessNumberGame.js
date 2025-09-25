'use client';

import { useMemo, useState } from 'react';

const MIN_VALUE = 1;
const MAX_VALUE = 50;

const generateSecret = () =>
  Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;

export default function GuessNumberGame() {
  const [secret, setSecret] = useState(generateSecret);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [roundsCleared, setRoundsCleared] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [feedback, setFeedback] = useState(
    'He generado un número secreto entre 1 y 50. ¡Haz tu primer intento!'
  );

  const hintText = useMemo(
    () => `Introduce un número entre ${MIN_VALUE} y ${MAX_VALUE}.`,
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (guess.trim() === '') {
      setFeedback('Escribe un número antes de enviar tu intento.');
      return;
    }

    const numericGuess = Number(guess);

    if (!Number.isInteger(numericGuess)) {
      setFeedback('Solo se aceptan números enteros.');
      return;
    }

    if (numericGuess < MIN_VALUE || numericGuess > MAX_VALUE) {
      setFeedback(`Recuerda que debe estar entre ${MIN_VALUE} y ${MAX_VALUE}.`);
      return;
    }

    const attemptsSoFar = attempts + 1;

    if (numericGuess === secret) {
      const nextSecret = generateSecret();
      const nextBest =
        bestScore === null ? attemptsSoFar : Math.min(bestScore, attemptsSoFar);

      setFeedback(
        `🎯 ¡Acertaste en ${attemptsSoFar} intento${
          attemptsSoFar === 1 ? '' : 's'
        }! He generado otro número para que sigas practicando.`
      );
      setBestScore(nextBest);
      setRoundsCleared((value) => value + 1);
      setSecret(nextSecret);
      setAttempts(0);
    } else if (numericGuess < secret) {
      setFeedback('⬆️ Pista: el número secreto es más alto.');
      setAttempts(attemptsSoFar);
    } else {
      setFeedback('⬇️ Pista: necesitas un número más bajo.');
      setAttempts(attemptsSoFar);
    }

    setGuess('');
  };

  return (
    <main className="mini-game">
      <div className="game-card">
        <h1>Minijuego · Adivina el número</h1>
        <p>
          Tienes un número secreto en mente entre {MIN_VALUE} y {MAX_VALUE}. Usa las
          pistas después de cada intento para reducir posibilidades.
        </p>

        <form className="guess-form" onSubmit={handleSubmit}>
          <label htmlFor="guess-input">Tu intento</label>
          <input
            id="guess-input"
            type="number"
            inputMode="numeric"
            min={MIN_VALUE}
            max={MAX_VALUE}
            placeholder={`${MIN_VALUE} - ${MAX_VALUE}`}
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            aria-describedby="guess-hint"
          />
          <span
            id="guess-hint"
            style={{ fontSize: '0.85rem', color: 'rgba(255, 228, 206, 0.65)' }}
          >
            {hintText}
          </span>
          <button type="submit">Probar suerte</button>
        </form>

        <div className="game-feedback" role="status" aria-live="polite">
          {feedback}
        </div>

        <div className="game-stats">
          <span>Intentos en esta ronda: {attempts}</span>
          <span>
            Mejor marca:{' '}
            {bestScore === null
              ? '—'
              : `${bestScore} intento${bestScore === 1 ? '' : 's'}`}
          </span>
        </div>
        <div className="game-stats">
          <span>Rondas superadas: {roundsCleared}</span>
          <button
            type="button"
            className="back-link"
            onClick={() => {
              setSecret(generateSecret());
              setAttempts(0);
              setRoundsCleared(0);
              setBestScore(null);
              setFeedback('Marcadores reiniciados. ¡Nuevo número listo!');
            }}
          >
            Reiniciar marcadores
          </button>
        </div>

        <a className="back-link" href="/">
          Volver a la base
        </a>
      </div>
    </main>
  );
}
