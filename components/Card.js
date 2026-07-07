import { StyleSheet, Text, TouchableOpacity } from 'react-native';

/**
 * Carta individual del juego de memoria.
 * - Boca abajo muestra "?".
 * - Revelada o emparejada muestra el emoji del animal.
 * - Se deshabilita cuando ya está revelada/emparejada o el tablero está bloqueado.
 */
export default function Card({ emoji, revelada, emparejada, bloqueado, onPress }) {
  const mostrar = revelada || emparejada;

  return (
    <TouchableOpacity
      style={[
        styles.carta,
        mostrar && styles.cartaRevelada,
        emparejada && styles.cartaEmparejada,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={mostrar || bloqueado}
    >
      <Text style={styles.contenido}>{mostrar ? emoji : '?'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  carta: {
    width: 70,
    height: 70,
    margin: 6,
    borderRadius: 12,
    backgroundColor: '#4a6fa5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cartaRevelada: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#4a6fa5',
  },
  cartaEmparejada: {
    backgroundColor: '#c8f7c5',
    borderColor: '#3ba55d',
  },
  contenido: {
    fontSize: 34,
    color: '#ffffff',
  },
});
