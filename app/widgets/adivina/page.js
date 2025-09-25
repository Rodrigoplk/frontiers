import GuessNumberGame from './GuessNumberGame';

export const metadata = {
  title: 'Adivina el número | Rodrigoplk repo',
  description:
    'Minijuego mental para adivinar un número secreto entre 1 y 50 dentro del laboratorio de Rodrigoplk.',
};

export default function Page() {
  return <GuessNumberGame />;
}
