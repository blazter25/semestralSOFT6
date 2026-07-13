// Capa de acceso a la base de datos local con expo-sqlite (SDK 54, API asíncrona).
// Guarda el historial de partidas ganadas: movimientos usados y fecha.
import * as SQLite from 'expo-sqlite';

// Una única conexión reutilizable a la base de datos del juego.
let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('memoriza.db');
  }
  return dbPromise;
}

/**
 * Crea la tabla de partidas si aún no existe.
 * Se llama una vez al arrancar la app.
 */
export async function initDB() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS partidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movimientos INTEGER NOT NULL,
      fecha TEXT NOT NULL
    );
  `);
}

/**
 * Inserta una partida ganada.
 * @param {number} movimientos - cantidad de intentos usados para ganar.
 */
export async function guardarPartida(movimientos) {
  const db = await getDb();
  const fecha = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO partidas (movimientos, fecha) VALUES (?, ?);',
    movimientos,
    fecha
  );
}

/**
 * Devuelve las partidas ordenadas de mejor (menos movimientos) a peor.
 * @returns {Promise<Array<{id:number, movimientos:number, fecha:string}>>}
 */
export async function obtenerPartidas() {
  const db = await getDb();
  return db.getAllAsync(
    'SELECT id, movimientos, fecha FROM partidas ORDER BY movimientos ASC, fecha ASC;'
  );
}

/**
 * Borra todo el historial de partidas.
 */
export async function borrarPartidas() {
  const db = await getDb();
  await db.runAsync('DELETE FROM partidas;');
}
