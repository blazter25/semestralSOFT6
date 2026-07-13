import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borrarPartidas, obtenerPartidas } from '../db/database';

// Da formato legible a la fecha ISO guardada en la base de datos.
function formatearFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5);
}

/**
 * Pantalla de historial: lista las partidas guardadas en SQLite,
 * ordenadas de la mejor (menos movimientos) a la peor.
 */
export default function PuntajesScreen() {
  const [partidas, setPartidas] = useState([]);

  // Recarga cada vez que la pantalla toma foco (al volver del juego).
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      obtenerPartidas().then((filas) => {
        if (activo) setPartidas(filas);
      });
      return () => {
        activo = false;
      };
    }, [])
  );

  async function limpiar() {
    await borrarPartidas();
    setPartidas([]);
  }

  if (partidas.length === 0) {
    return (
      <SafeAreaView style={styles.vacioContainer}>
        <Text style={styles.vacioEmoji}>🗒️</Text>
        <Text style={styles.vacioTexto}>Todavía no hay partidas.</Text>
        <Text style={styles.vacioSub}>¡Gana una para verla aquí!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>🏆 Mejores partidas</Text>

      <FlatList
        data={partidas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => (
          <View style={styles.fila}>
            <Text style={styles.posicion}>#{index + 1}</Text>
            <View style={styles.info}>
              <Text style={styles.movimientos}>{item.movimientos} movimientos</Text>
              <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
            </View>
            {index === 0 && <Text style={styles.medalla}>🥇</Text>}
          </View>
        )}
      />

      <TouchableOpacity style={styles.botonBorrar} onPress={limpiar} activeOpacity={0.8}>
        <Text style={styles.botonBorrarTexto}>🗑️  Borrar historial</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f7', paddingTop: 16 },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  lista: { paddingHorizontal: 16, gap: 10 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  posicion: { fontSize: 18, fontWeight: 'bold', color: '#4a6fa5', width: 44 },
  info: { flex: 1 },
  movimientos: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  fecha: { fontSize: 13, color: '#7a8ba5', marginTop: 2 },
  medalla: { fontSize: 26 },
  botonBorrar: {
    margin: 16,
    backgroundColor: '#e57373',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  botonBorrarTexto: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  vacioContainer: {
    flex: 1,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacioEmoji: { fontSize: 60, marginBottom: 12 },
  vacioTexto: { fontSize: 18, fontWeight: '600', color: '#2c3e50' },
  vacioSub: { fontSize: 14, color: '#7a8ba5', marginTop: 6 },
});
