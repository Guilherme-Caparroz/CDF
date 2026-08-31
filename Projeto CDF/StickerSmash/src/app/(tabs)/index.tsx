import { Link } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>CDF</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.cardSaldo}>
          <Text style={styles.labelSaldo}>Saldo Total</Text>
          <Text style={styles.valorSaldo}>R$ 3.100,00</Text>
          <View style={styles.statusContainer}>
            <View style={styles.pontoStatus} />
            <Text style={styles.textoStatus}>Conta ativa • Atualizado agora</Text>
          </View>
        </View>

        <View>
          <Text style={styles.tituloSecao}>Últimos Lançamentos</Text>

          {/* Item 1: Salário (id: 0) */}
          <Link href={{ pathname: '/detalhes', params: { id: '0' } }} style={styles.linkDetalhe}>
            <View style={styles.cardLancamento}>
              <View style={styles.iconeArea}>
                <Text style={styles.iconeTexto}>↗</Text>
              </View>
              <View style={styles.infoEsquerda}>
                <Text style={styles.nomeLancamento}>Salário Mensal</Text>
                <Text style={styles.categoriaLancamento}>Salário</Text>
              </View>
              <View style={styles.infoDireita}>
                <Text style={[styles.valorLancamento, styles.valorPositivo]}>+ R$ 3.500,00</Text>
                <Text style={styles.dataLancamento}>05/08/2025</Text>
              </View>
            </View>
          </Link>

          {/* Item 2: Supermercado */}
          <Link href={{ pathname: '/detalhes', params: { id: '1' } }} style={styles.linkDetalhe}>
            <View style={styles.cardLancamento}>
              <View style={styles.iconeArea}>
                <Text style={styles.iconeTexto}>↘</Text>
              </View>
              <View style={styles.infoEsquerda}>
                <Text style={styles.nomeLancamento}>Supermercado Centro</Text>
                <Text style={styles.categoriaLancamento}>Alimentação</Text>
              </View>
              <View style={styles.infoDireita}>
                <Text style={[styles.valorLancamento, styles.valorNegativo]}>- R$ 350,00</Text>
                <Text style={styles.dataLancamento}>10/08/2025</Text>
              </View>
            </View>
          </Link>

          {/* Item 3: Recarga Cartão */}
          <Link href={{ pathname: '/detalhes', params: { id: '2' } }} style={styles.linkDetalhe}>
            <View style={styles.cardLancamento}>
              <View style={styles.iconeArea}>
                <Text style={styles.iconeTexto}>↘</Text>
              </View>
              <View style={styles.infoEsquerda}>
                <Text style={styles.nomeLancamento}>Recarga Cartão</Text>
                <Text style={styles.categoriaLancamento}>Transporte</Text>
              </View>
              <View style={styles.infoDireita}>
                <Text style={[styles.valorLancamento, styles.valorNegativo]}>- R$ 50,00</Text>
                <Text style={styles.dataLancamento}>12/08/2025</Text>
              </View>
            </View>
          </Link>

          <TouchableOpacity style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>+ Adicionar</Text>
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

  // Card de saldo
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

  // Seção de lançamentos
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

  // Botão Adicionar
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
});
