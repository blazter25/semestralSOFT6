import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Tablero from './components/Tablero';
import { generarMazo, TOTAL_PARES } from './constants/animals';

export default function App() {
  const [cartas, setCartas] = useState(generarMazo);
  const [seleccionadas, setSeleccionadas] = useState([]); // índices de cartas volteadas
  const [emparejadas, setEmparejadas] = useState([]); // emojis ya emparejados
  const [movimientos, setMovimientos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false); // evita tocar durante la pausa

  const gano = emparejadas.length === TOTAL_PARES;

  // Compara las dos cartas seleccionadas.
  useEffect(() => {
    if (seleccionadas.length !== 2) return;

    setBloqueado(true);
    setMovimientos((m) => m + 1);

    const [a, b] = seleccionadas;
    if (cartas[a].emoji === cartas[b].emoji) {
      setEmparejadas((prev) => [...prev, cartas[a].emoji]);
      setSeleccionadas([]);
      setBloqueado(false);
    } else {
      const timer = setTimeout(() => {
        setSeleccionadas([]);
        setBloqueado(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [seleccionadas, cartas]);

function seleccionar(indice) {
  if (bloqueado) return;
  if (emparejadas.includes(cartas[indice].emoji)) return;

  setSeleccionadas((prev) => {
    if (prev.length >= 2) return prev;
    if (prev.includes(indice)) return prev;
    return [...prev, indice];
  });
}

  function reiniciar() {
    setCartas(generarMazo());
    setSeleccionadas([]);
    setEmparejadas([]);
    setMovimientos(0);
    setBloqueado(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>🐾 Memoriza Animales</Text>

      <View style={styles.marcador}>
        <Text style={styles.marcadorTexto}>Movimientos: {movimientos}</Text>
        <Text style={styles.marcadorTexto}>
          Pares: {emparejadas.length}/{TOTAL_PARES}
        </Text>
      </View>

      {gano ? (
        <View style={styles.victoria}>
          <Text style={styles.victoriaTexto}>🎉 ¡Ganaste!</Text>
          <Text style={styles.victoriaSub}>
            Completaste el juego en {movimientos} movimientos.
          </Text>
        </View>
      ) : (
        <Tablero
          cartas={cartas}
          seleccionadas={seleccionadas}
          emparejadas={emparejadas}
          bloqueado={bloqueado}
          onSeleccionar={seleccionar}
        />
      )}

      <TouchableOpacity style={styles.boton} onPress={reiniciar} activeOpacity={0.8}>
        <Text style={styles.botonTexto}>{gano ? 'Jugar de nuevo' : 'Reiniciar'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  marcador: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  marcadorTexto: {
    fontSize: 16,
    color: '#4a6fa5',
    fontWeight: '600',
  },
  victoria: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  victoriaTexto: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3ba55d',
  },
  victoriaSub: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 12,
  },
  boton: {
    marginTop: 28,
    backgroundColor: '#4a6fa5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 3,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
