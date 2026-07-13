import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Pantalla principal (Home) del stack de navegación.
 * Da la bienvenida y permite ir al juego o al historial de puntajes.
 */
export default function InicioScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emoji}>🐾</Text>
      <Text style={styles.titulo}>Memoriza Animales</Text>
      <Text style={styles.subtitulo}>
        ¡Encuentra todas las parejas de animalitos y entrena tu memoria!
      </Text>

      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.botonPrimario}
          onPress={() => navigation.navigate('Juego')}
          activeOpacity={0.85}
        >
          <Text style={styles.botonTexto}>▶️  Jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonSecundario}
          onPress={() => navigation.navigate('Puntajes')}
          activeOpacity={0.85}
        >
          <Text style={styles.botonTextoSec}>🏆  Puntajes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pista}>💡 Tip: agita el teléfono para repartir de nuevo</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: { fontSize: 80, marginBottom: 8 },
  titulo: { fontSize: 30, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  subtitulo: {
    fontSize: 16,
    color: '#4a6fa5',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  botones: { width: '100%', maxWidth: 320, gap: 16 },
  botonPrimario: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 3,
  },
  botonSecundario: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#4a6fa5',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  botonTexto: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  botonTextoSec: { color: '#4a6fa5', fontSize: 18, fontWeight: 'bold' },
  pista: { marginTop: 40, fontSize: 13, color: '#7a8ba5' },
});
