import { useRouter, useFocusEffect } from 'expo-router';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  listarLancamentos, excluirLancamento, calcularSaldo,
  obterSaldoInicial, definirSaldoInicial,
  Lancamento, FiltroTipo,
} from '../../database/database';
import { obterFiltroPadrao } from '../../database/preferencias';
import FiltroTabs from '../../components/FiltroTabs';
import EstadoVazio from '../../components/EstadoVazio';
import EstadoErro from '../../components/EstadoErro';

// transforma número em "R$ 1.234,56"
function formatarMoeda(v: number) {
  const [inteiro, centavos] = Math.abs(v).toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);   // true = mostra o "loading" da lista
  const [erro, setErro] = useState<string | null>(null); // mensagem de erro amigável
  const [lista, setLista] = useState<Lancamento[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [filtro, setFiltro] = useState<FiltroTipo>('todos');
  const [busca, setBusca] = useState('');
  const [prefsProntas, setPrefsProntas] = useState(false);
  const [editandoSaldo, setEditandoSaldo] = useState(false);
  const [saldoDigitado, setSaldoDigitado] = useState('');

  // guarda o número da última consulta: evita que uma resposta antiga
  // (ex.: busca digitada rápido) sobrescreva a mais nova
  const ultimaConsulta = useRef(0);

  // lê o filtro padrão salvo nas preferências (AsyncStorage) quando o app abre
  useEffect(() => {
    obterFiltroPadrao().then((f) => {
      setFiltro(f);
      setPrefsProntas(true);
    });
  }, []);

  async function carregar(mostrarLoading = false) {
    const numero = ++ultimaConsulta.current;
    if (mostrarLoading) {
      setCarregando(true);
      setErro(null);
    }
    try {
      const itens = await listarLancamentos(filtro, busca.trim()); // lê do SQLite (WHERE/LIKE)
      const total = await calcularSaldo();
      if (numero !== ultimaConsulta.current) return; // chegou uma consulta mais nova
      setLista(itens);
      setSaldo(total);
      setErro(null);
    } catch {
      if (numero !== ultimaConsulta.current) return;
      setErro('Não foi possível carregar seus lançamentos. Tente novamente.');
    } finally {
      if (numero === ultimaConsulta.current) setCarregando(false); // já pode mostrar a tela
    }
  }

  // useFocusEffect: roda ao abrir, ao voltar de outra tela e quando o filtro ou a busca mudam
  // (espera ler a preferência de filtro padrão antes da primeira consulta)
  useFocusEffect(
    useCallback(() => {
      if (!prefsProntas) return;
      carregar();
    }, [filtro, busca, prefsProntas])
  );

  async function salvarSaldoInicial() {
    const numero = parseFloat(saldoDigitado.replace(',', '.'));
    if (isNaN(numero)) {
      alert('Digite um valor válido.');
      return;
    }
    try {
      await definirSaldoInicial(numero);
    } catch {
      alert('Não foi possível salvar o saldo. Tente novamente.');
      return;
    }
    setEditandoSaldo(false);
    carregar();
  }

  function confirmarExclusao(item: Lancamento) {
    Alert.alert('Excluir lançamento', `Deseja excluir "${item.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirLancamento(item.id);
          } catch {
            alert('Não foi possível excluir o lançamento. Tente novamente.');
            return;
          }
          carregar();
        },
      },
    ]);
  }

  // textos do estado vazio mudam conforme o que o usuário está vendo
  function textosVazio() {
    if (busca.trim()) {
      return { icone: '🔍', titulo: 'Nada encontrado', mensagem: `Nenhum lançamento com "${busca.trim()}".` };
    }
    if (filtro === 'receita') {
      return { icone: '📭', titulo: 'Nenhuma entrada registrada', mensagem: 'Tente outro filtro ou adicione uma nova entrada.' };
    }
    if (filtro === 'despesa') {
      return { icone: '📭', titulo: 'Nenhuma saída registrada', mensagem: 'Tente outro filtro ou adicione uma nova saída.' };
    }
    return { icone: '🧾', titulo: 'Nenhum lançamento ainda', mensagem: 'Toque em "Adicionar" para registrar sua primeira entrada ou saída.' };
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>CDF</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.cardSaldo}>
          <Text style={styles.labelSaldo}>Saldo Total</Text>
          <Text style={styles.valorSaldo}>
            {saldo < 0 ? '- ' : ''}{formatarMoeda(saldo)}
          </Text>

          {editandoSaldo ? (
            <View style={styles.linhaSaldoInicial}>
              <TextInput
                style={styles.inputSaldoInicial}
                keyboardType="numeric"
                placeholder="Quanto você tem hoje?"
                value={saldoDigitado}
                onChangeText={setSaldoDigitado}
              />
              <TouchableOpacity onPress={salvarSaldoInicial}>
                <Text style={styles.textoSalvarSaldo}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                setSaldoDigitado(String(await obterSaldoInicial()).replace('.', ','));
                setEditandoSaldo(true);
              }}
            >
              <Text style={styles.textoInformarSaldo}>✎ Informar saldo atual</Text>
            </TouchableOpacity>
          )}

          <View style={styles.statusContainer}>
            <View style={styles.pontoStatus} />
            <Text style={styles.textoStatus}>Conta ativa • Atualizado agora</Text>
          </View>
        </View>

        <View>
          <Text style={styles.tituloSecao}>Últimos Lançamentos</Text>

          {/* Busca por nome (usa LIKE no banco) */}
          <TextInput
            style={styles.inputBusca}
            value={busca}
            onChangeText={setBusca}
            placeholder="🔍 Buscar por nome..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
          />

          {/* Filtros: Todos | Entradas | Saídas (usa WHERE no banco) */}
          <FiltroTabs valor={filtro} onChange={setFiltro} />

          {/* Loading enquanto lê do SQLite */}
          {carregando && (
            <View style={styles.areaCarregando}>
              <ActivityIndicator size="large" color="#22C55E" />
              <Text style={styles.textoCarregando}>Carregando lançamentos...</Text>
            </View>
          )}

          {/* Erro amigável se não conseguir carregar */}
          {!carregando && erro && (
            <EstadoErro mensagem={erro} onTentarNovamente={() => carregar(true)} />
          )}

          {/* Empty state: mensagem + ícone quando não há registros */}
          {!carregando && !erro && lista.length === 0 && <EstadoVazio {...textosVazio()} />}

          {!carregando && !erro && lista.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push({ pathname: '/detalhes', params: { id: String(item.id) } })}
            >
              <View style={styles.cardLancamento}>
                <View style={[styles.iconeArea, item.tipo === 'despesa' && styles.iconeAreaSaida]}>
                  <Text style={[styles.iconeTexto, item.tipo === 'despesa' && styles.valorNegativo]}>
                    {item.tipo === 'receita' ? '↗' : '↘'}
                  </Text>
                </View>
                <View style={styles.infoEsquerda}>
                  <Text style={styles.nomeLancamento}>{item.nome}</Text>
                  <Text style={styles.categoriaLancamento}>{item.categoria}</Text>
                </View>
                <View style={styles.infoDireita}>
                  <Text
                    style={[
                      styles.valorLancamento,
                      item.tipo === 'receita' ? styles.valorPositivo : styles.valorNegativo,
                    ]}
                  >
                    {item.tipo === 'receita' ? '+' : '-'} {formatarMoeda(item.valor)}
                  </Text>
                  <Text style={styles.dataLancamento}>{item.data}</Text>
                  <TouchableOpacity onPress={() => confirmarExclusao(item)}>
                    <Text style={styles.textoExcluir}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Botão de Adicionar funcional via Imperativa do Router */}
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => router.push('/adicionar')}
          >
            <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  linkDetalhe: {
    marginBottom: 0,
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
  cardSaldo: {
    backgroundColor: '#1B2340',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  labelSaldo: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  valorSaldo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pontoStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  textoStatus: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tituloSecao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B2340',
    marginBottom: 12,
  },
  cardLancamento: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconeArea: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconeTexto: {
    fontSize: 18,
    color: '#22C55E',
    fontWeight: 'bold',
  },
  infoEsquerda: {
    flex: 1,
  },
  nomeLancamento: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2340',
    marginBottom: 2,
  },
  categoriaLancamento: {
    fontSize: 12,
    color: '#8A8FA3',
  },
  infoDireita: {
    alignItems: 'flex-end',
  },
  valorLancamento: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  valorPositivo: {
    color: '#22C55E',
  },
  valorNegativo: {
    color: '#EF4444',
  },
  dataLancamento: {
    fontSize: 11,
    color: '#8A8FA3',
  },
  botaoAdicionar: {
    backgroundColor: '#22C55E',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoAdicionar: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // --- estilos novos ---
  linhaSaldoInicial: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  inputSaldoInicial: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  textoSalvarSaldo: {
    color: '#22C55E',
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  textoInformarSaldo: {
    color: '#22C55E',
    fontSize: 12,
    marginBottom: 12,
  },
  inputBusca: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1B2340',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  areaCarregando: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  textoCarregando: {
    fontSize: 13,
    color: '#8A8FA3',
  },
  textoExcluir: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '600',
  },
  iconeAreaSaida: {
    backgroundColor: '#FEE2E2',
  },
});