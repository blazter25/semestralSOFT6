import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Tablero from '../components/Tablero';
import { generarMazo, TOTAL_PARES } from '../constants/animals';
import { guardarPartida } from '../db/database';

// Umbral de fuerza (g) para detectar una sacudida del teléfono.
const UMBRAL_SACUDIDA = 1.8;

export default function JuegoScreen() {
  const [cartas, setCartas] = useState(generarMazo);
  const [seleccionadas, setSeleccionadas] = useState([]); // índices de cartas volteadas
  const [emparejadas, setEmparejadas] = useState([]); // emojis ya emparejados
  const [movimientos, setMovimientos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false); // evita tocar durante la pausa
  const [guardada, setGuardada] = useState(false); // evita guardar la misma victoria dos veces

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

  // Al ganar, guarda la partida en la base de datos local (una sola vez).
  useEffect(() => {
    if (gano && !guardada) {
      setGuardada(true);
      guardarPartida(movimientos).catch((e) =>
        console.warn('No se pudo guardar la partida:', e)
      );
    }
  }, [gano, guardada, movimientos]);

  // SENSOR: acelerómetro. Al agitar el teléfono se reparten cartas nuevas.
  const ultimoReinicio = useRef(0);
  useEffect(() => {
    let activo = true;
    let sub;
    // Se activa solo si el dispositivo tiene acelerómetro (el celular sí; el
    // navegador web no, por eso se protege para no romper la pantalla).
    (async () => {
      try {
        const disponible = await Accelerometer.isAvailableAsync();
        if (!disponible || !activo) return;
        Accelerometer.setUpdateInterval(200);
        sub = Accelerometer.addListener(({ x, y, z }) => {
          const fuerza = Math.sqrt(x * x + y * y + z * z);
          const ahora = Date.now();
          // Evita reinicios repetidos: solo uno por segundo.
          if (fuerza > UMBRAL_SACUDIDA && ahora - ultimoReinicio.current > 1000) {
            ultimoReinicio.current = ahora;
            reiniciar();
          }
        });
      } catch (e) {
        console.warn('Acelerómetro no disponible:', e);
      }
    })();
    return () => {
      activo = false;
      if (sub) sub.remove();
    };
  }, []);

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
    setGuardada(false);
  }

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.victoriaGuardado}>✅ Puntaje guardado</Text>
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
      <Text style={styles.pista}>📱 O agita el teléfono para repartir de nuevo</Text>
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
  marcador: { flexDirection: 'row', gap: 24, marginBottom: 20 },
  marcadorTexto: { fontSize: 16, color: '#4a6fa5', fontWeight: '600' },
  victoria: { alignItems: 'center', paddingVertical: 60 },
  victoriaTexto: { fontSize: 40, fontWeight: 'bold', color: '#3ba55d' },
  victoriaSub: { fontSize: 16, color: '#2c3e50', marginTop: 12 },
  victoriaGuardado: { fontSize: 14, color: '#3ba55d', marginTop: 8, fontWeight: '600' },
  boton: {
    marginTop: 28,
    backgroundColor: '#4a6fa5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 3,
  },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  pista: { marginTop: 16, fontSize: 13, color: '#7a8ba5' },
});
