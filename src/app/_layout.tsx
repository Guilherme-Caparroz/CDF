import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import EstadoErro from '../components/EstadoErro';
import { initDB } from '../database/database';
import { configurarNotificacoes } from '../services/lembretes';

// define como as notificações aparecem (roda uma vez quando o app abre)
configurarNotificacoes();

export default function RootLayout() {
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState(false);

  // cria o banco e a tabela quando o app abre
  useEffect(() => {
    initDB()
      .then(() => setPronto(true))
      .catch(() => setErro(true));
  }, []);

  function tentarNovamente() {
    setErro(false);
    initDB()
      .then(() => setPronto(true))
      .catch(() => setErro(true));
  }

  // se o banco não abrir, mostra uma mensagem amigável em vez de tela branca
  if (erro) {
    return (
      <View style={styles.centro}>
        <EstadoErro
          mensagem="Não foi possível abrir o banco de dados do app. Feche e abra o app novamente."
          onTentarNovamente={tentarNovamente}
        />
      </View>
    );
  }

  // só mostra as telas depois que o banco estiver pronto
  if (!pronto) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="detalhes" options={{ presentation: 'card' }} />
      <Stack.Screen name="adicionar" options={{ presentation: 'card' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
});
