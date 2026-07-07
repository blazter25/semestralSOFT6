import { StyleSheet, View } from 'react-native';
import Card from './Card';

/**
 * Grid responsivo de cartas. Usa flexWrap para acomodar 4 columnas
 * (con el ancho fijo de cada carta definido en Card.js).
 */
export default function Tablero({ cartas, seleccionadas, emparejadas, bloqueado, onSeleccionar }) {
  return (
    <View style={styles.tablero}>
      {cartas.map((carta, indice) => (
        <Card
          key={carta.id}
          emoji={carta.emoji}
          revelada={seleccionadas.includes(indice)}
          emparejada={emparejadas.includes(carta.emoji)}
          bloqueado={bloqueado}
          onPress={() => onSeleccionar(indice)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tablero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 4 * 82, // 4 columnas * (70 ancho + 12 margen)
  },
});
