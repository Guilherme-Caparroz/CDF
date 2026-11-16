import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FiltroTabs from '../../components/FiltroTabs';
import type { FiltroTipo } from '../../database/database';
import {
  LEMBRETE_PADRAO,
  definirFiltroPadrao,
  obterFiltroPadrao,
  obterLembrete,
  salvarLembrete,
  type PreferenciaLembrete,
} from '../../database/preferencias';
import {
  NOTIFICACOES_SUPORTADAS,
  agendarLembreteDiario,
  cancelarLembrete,
  enviarNotificacaoDeTeste,
  pedirPermissao,
} from '../../services/lembretes';

// horários que o usuário pode escolher para o lembrete
const horarios = [
  { hora: 8, minuto: 0 },
  { hora: 12, minuto: 0 },
  { hora: 18, minuto: 0 },
  { hora: 20, minuto: 0 },
  { hora: 22, minuto: 0 },
];

function formatarHorario(hora: number, minuto: number) {
  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
}

export default function AjustesScreen() {
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [lembrete, setLembrete] = useState<PreferenciaLembrete>(LEMBRETE_PADRAO);
  const [filtroPadrao, setFiltroPadrao] = useState<FiltroTipo>('todos');

  // lê as preferências salvas sempre que a aba é aberta
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        setLembrete(await obterLembrete());
        setFiltroPadrao(await obterFiltroPadrao());
        setCarregando(false);
      }
      carregar();
    }, [])
  );

  function avisarErro() {
    Alert.alert('Ops!', 'Não foi possível salvar essa configuração. Tente novamente.');
  }

  function avisarSemPermissao() {
    Alert.alert(
      'Permissão necessária',
      'Para receber o lembrete, permita as notificações do CDF nas configurações do aparelho.',
      [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
      ]
    );
  }

  // liga ou desliga o lembrete diário
  async function alternarLembrete(ligar: boolean) {
    if (ocupado) return;
    setOcupado(true);
    try {
      if (ligar) {
        const permitido = await pedirPermissao();
        if (!permitido) {
          avisarSemPermissao();
          return;
        }
        await agendarLembreteDiario(lembrete.hora, lembrete.minuto);
      } else {
        await cancelarLembrete();
      }
      const novo = { ...lembrete, ativo: ligar };
      await salvarLembrete(novo);
      setLembrete(novo);
    } catch {
      avisarErro();
    } finally {
      setOcupado(false);
    }
  }

  // troca o horário (e reagenda se o lembrete estiver ligado)
  async function escolherHorario(hora: number, minuto: number) {
    if (ocupado) return;
    setOcupado(true);
    try {
      if (lembrete.ativo) await agendarLembreteDiario(hora, minuto);
      const novo = { ...lembrete, hora, minuto };
      await salvarLembrete(novo);
      setLembrete(novo);
    } catch {
      avisarErro();
    } finally {
      setOcupado(false);
    }
  }

  async function testarNotificacao() {
    try {
      const permitido = await pedirPermissao();
      if (!permitido) {
        avisarSemPermissao();
        return;
      }
      await enviarNotificacaoDeTeste();
      Alert.alert('Teste agendado', 'Em alguns segundos você deve receber uma notificação.');
    } catch {
      Alert.alert('Ops!', 'Não foi possível enviar a notificação de teste.');
    }
  }

  async function escolherFiltroPadrao(filtro: FiltroTipo) {
    setFiltroPadrao(filtro);
    try {
      await definirFiltroPadrao(filtro);
    } catch {
      avisarErro();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Ajustes</Text>
      </View>

      {carregando ? (
        <View style={styles.areaCarregando}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ---------- Lembrete diário (notificação local) ---------- */}
          <Text style={styles.tituloSecao}>Lembrete diário</Text>
          <View style={styles.card}>
            {NOTIFICACOES_SUPORTADAS ? (
              <>
                <View style={styles.linhaSwitch}>
                  <View style={styles.textoSwitch}>
                    <Text style={styles.nomeOpcao}>Lembrar de registrar meus gastos</Text>
                    <Text style={styles.descricaoOpcao}>
                      Todo dia, no horário escolhido, o app avisa você.
                    </Text>
                  </View>
                  <Switch
                    value={lembrete.ativo}
                    onValueChange={alternarLembrete}
                    disabled={ocupado}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={lembrete.ativo ? '#22C55E' : '#F3F4F6'}
                  />
                </View>

                <Text style={styles.rotulo}>HORÁRIO</Text>
                <View style={styles.linhaHorarios}>
                  {horarios.map((h) => {
                    const selecionado = h.hora === lembrete.hora && h.minuto === lembrete.minuto;
                    return (
                      <TouchableOpacity
                        key={`${h.hora}:${h.minuto}`}
                        onPress={() => escolherHorario(h.hora, h.minuto)}
                        style={selecionado ? styles.chipSelecionado : styles.chip}
                      >
                        <Text style={selecionado ? styles.chipTextoSelecionado : styles.chipTexto}>
                          {formatarHorario(h.hora, h.minuto)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.botaoTeste} onPress={testarNotificacao}>
                  <Text style={styles.textoBotaoTeste}>🔔 Testar notificação agora</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.descricaoOpcao}>
                Os lembretes funcionam apenas no celular (Android ou iOS). Abra o app pelo Expo Go
                ou pelo APK para usar este recurso.
              </Text>
            )}
          </View>

          {/* ---------- Filtro padrão (preferência guardada no AsyncStorage) ---------- */}
          <Text style={styles.tituloSecao}>Lista de lançamentos</Text>
          <View style={styles.card}>
            <Text style={styles.nomeOpcao}>Filtro padrão ao abrir o app</Text>
            <Text style={[styles.descricaoOpcao, styles.espacoAbaixo]}>
              A lista já começa mostrando o filtro escolhido.
            </Text>
            <FiltroTabs valor={filtroPadrao} onChange={escolherFiltroPadrao} />
          </View>

          {/* ---------- Sobre ---------- */}
          <Text style={styles.tituloSecao}>Sobre</Text>
          <View style={styles.card}>
            <Text style={styles.descricaoOpcao}>
              Seus lançamentos ficam salvos somente neste aparelho, em um banco de dados SQLite.
              Nada é enviado para a internet.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#1B2340',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  areaCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  tituloSecao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B2340',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textoSwitch: {
    flex: 1,
  },
  nomeOpcao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2340',
    marginBottom: 2,
  },
  descricaoOpcao: {
    fontSize: 12,
    color: '#8A8FA3',
    lineHeight: 18,
  },
  espacoAbaixo: {
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8FA3',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 8,
  },
  linhaHorarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelecionado: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  chipTexto: {
    fontSize: 13,
    color: '#1B2340',
    fontWeight: '500',
  },
  chipTextoSelecionado: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '700',
  },
  botaoTeste: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotaoTeste: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2340',
  },
});
