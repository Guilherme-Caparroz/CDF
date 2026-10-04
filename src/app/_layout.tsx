import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import { initDB } from '../database/database';

export default function RootLayout() {
  const [pronto, setPronto] = useState(false);

  // cria o banco e a tabela quando o app abre
  useEffect(() => {
    initDB().then(() => setPronto(true));
  }, []);

  // só mostra as telas depois que o banco estiver pronto
  if (!pronto) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="detalhes" options={{ presentation: 'card' }} />
      <Stack.Screen name="adicionar" options={{ presentation: 'card' }} />
    </Stack>
  );
}