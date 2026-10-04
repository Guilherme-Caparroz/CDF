import { Link, useRouter, useFocusEffect } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import {
  listarLancamentos, excluirLancamento, calcularSaldo,
  obterSaldoInicial, definirSaldoInicial,
  Lancamento, FiltroTipo,
} from '../../database/database';

// transforma número em "R$ 1.234,56"
function formatarMoeda(v: number) {
  const [inteiro, centavos] = Math.abs(v).toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

const filtros: { chave: FiltroTipo; rotulo: string }[] = [
  { chave: 'todos', rotulo: 'Todos' },
  { chave: 'receita', rotulo: 'Entradas' },
  { chave: 'despesa', rotulo: 'Saídas' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [lista, setLista] = useState<Lancamento[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [filtro, setFiltro] = useState<FiltroTipo>('todos');
  const [editandoSaldo, setEditandoSaldo] = useState(false);
  const [saldoDigitado, setSaldoDigitado] = useState('');

  async function carregar() {
    setLista(await listarLancamentos(filtro)); // busca o que tá salvo no banco local
    setSaldo(await calcularSaldo());
    setCarregando(false);        // avisa que já pode mostrar a tela
  }

  // com array vazio roda uma vez so quando o celular abre *
  // (agora usa useFocusEffect: roda ao abrir, ao voltar do formulário e quando o filtro muda)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [filtro])
  );

  // eu coloquei essa parte aqui gui no seu arquivo se der erro e essa parte aqui *

  async function salvarSaldoInicial() {
    const numero = parseFloat(saldoDigitado.replace(',', '.'));
    if (isNaN(numero)) {
      alert('Digite um valor válido.');
      return;
    }
    await definirSaldoInicial(numero);
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
          await excluirLancamento(item.id);
          carregar();
        },
      },
    ]);
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

          {/* Filtros: Todos | Entradas | Saídas (usa WHERE no banco) */}
          <View style={styles.linhaAbas}>
            {filtros.map((f) => (
              <TouchableOpacity
                key={f.chave}
                onPress={() => setFiltro(f.chave)}
                style={filtro === f.chave ? styles.abaAtiva : styles.aba}
              >
                <Text style={filtro === f.chave ? styles.textoAbaAtiva : styles.textoAba}>
                  {f.rotulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Antes eram 3 itens fixos (Item 1: Salário, Item 2: Supermercado, Item 3: Recarga Cartão); agora vem do banco */}
          {!carregando && lista.length === 0 && (
            <Text style={styles.textoVazio}>
              Nenhum lançamento ainda. Toque em "Adicionar" para criar o primeiro.
            </Text>
          )}

          {lista.map((item) => (
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
  linhaAbas: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  abaAtiva: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  textoAba: {
    fontSize: 13,
    color: '#1B2340',
    fontWeight: '500',
  },
  textoAbaAtiva: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '700',
  },
  textoVazio: {
    fontSize: 13,
    color: '#8A8FA3',
    textAlign: 'center',
    paddingVertical: 24,
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