// Emojis de animales usados como contenido de las cartas del juego.
// Cada emoji forma un par (se duplica al armar el mazo).
export const ANIMALES = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

/**
 * Baraja un arreglo con el algoritmo Fisher-Yates (copia, no muta el original).
 */
function fisherYates(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Genera un mazo nuevo de cartas: duplica cada animal (pares) y baraja.
 * Cada carta: { id, emoji }
 */
export function generarMazo() {
  const pares = ANIMALES.flatMap((emoji) => [emoji, emoji]);
  return fisherYates(pares).map((emoji, indice) => ({
    id: indice,
    emoji,
  }));
}

export const TOTAL_PARES = ANIMALES.length;
