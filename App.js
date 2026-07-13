import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initDB } from './db/database';
import InicioScreen from './screens/InicioScreen';
import JuegoScreen from './screens/JuegoScreen';
import PuntajesScreen from './screens/PuntajesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Crea la tabla de la base de datos local al arrancar la app.
  useEffect(() => {
    initDB().catch((e) => console.warn('No se pudo inicializar la BD:', e));
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: { backgroundColor: '#4a6fa5' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Juego"
          component={JuegoScreen}
          options={{ title: '🐾 Memoriza Animales' }}
        />
        <Stack.Screen
          name="Puntajes"
          component={PuntajesScreen}
          options={{ title: '🏆 Puntajes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
