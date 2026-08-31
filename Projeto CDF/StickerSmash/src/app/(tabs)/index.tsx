import { Link } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.titulo}>CDF</Text>
        <View>
          <Text>
            Saldo Total
          </Text>
          <Text>
            R$ 3.100,00
          </Text>
          {/* Essa view vai servir  para colocar a bolinha que esta no design rsrsrssrsrs caua viado   */}
          <View>

            <Text>Conta ativa • Atualizado agora</Text>
          </View>

        </View>

        <View>
          <Text style={styles.tituloSecao}>Últimos Lançamentos</Text>

          {/* Item 1: Salário (id: 0) */}
          <Link href={{ pathname: '/detalhes', params: { id: '0' } }} style={styles.linkDetalhe}>
            <View style={styles.cardLancamento}>
              <View style={styles.iconeArea}>
                {/* Ícone 1 */}
              </View>
              <View style={styles.infoEsquerda}>
                <Text style={styles.nomeLancamento}>Salário Mensal</Text>
                <Text style={styles.categoriaLancamento}>Salário</Text>
              </View>
              <View style={styles.infoDireita}>
                <Text style={styles.valorLancamento}>+ R$ 3.500,00</Text>
                <Text style={styles.dataLancamento}>05/08/2025</Text>
              </View>
            </View>
          </Link>

          {/* Item 2: Supermercado */}
          <Link href={{ pathname: '/detalhes', params: { id: '1' } }} style={styles.linkDetalhe}>
            <View style={styles.cardLancamento}>
              <View style={styles.iconeArea}>
             
              </View>
              <View style={styles.infoEsquerda}>
                <Text style={styles.nomeLancamento}>Supermercado Centro</Text>
                <Text style={styles.categoriaLancamento}>Alimentação</Text>
              </View>
              <View style={styles.infoDireita}>
                <Text style={styles.valorLancamento}>- R$ 350,00</Text>
                <Text style={styles.dataLancamento}>10/08/2025</Text>
              </View>
            </View>
          </Link>

          {/* Item 3: Recarga Cartão */}
          <Link href={{ pathname: '/detalhes', params: { id: '2' } }} style={styles.linkDetalhe}>
            <View style={styles.cardLancamento}>
              <View style={styles.iconeArea}>
                {}
              </View>
              <View style={styles.infoEsquerda}>
                <Text style={styles.nomeLancamento}>Recarga Cartão</Text>
                <Text style={styles.categoriaLancamento}>Transporte</Text>
              </View>
              <View style={styles.infoDireita}>
                <Text style={styles.valorLancamento}>- R$ 50,00</Text>
                <Text style={styles.dataLancamento}>12/08/2025</Text>
              </View>
            </View>
          </Link>


          {/*botaozinhoverde*/}
          <TouchableOpacity style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        <Link href={{ pathname: '/detalhes', params: { id: '0' } }} style={styles.linkDetalhe}>
          <Text style={styles.linkTexto}>Ver detalhes do salário →</Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
{/*eu so adicionei os styles novos, os antigos aindam estao normais*/}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linkDetalhe: {
    marginTop: 20,
  },
  linkTexto: {
    fontSize: 14,
    color: '#1B2340',
  },
  cardSaldo: {},
  labelSaldo: {},
  valorSaldo: {},
  statusContainer: {},
  pontoStatus: {},
  textoStatus: {},
  tituloSecao: {},
  cardLancamento: {},
  iconeArea: {},
  infoEsquerda: {},
  nomeLancamento: {},
  categoriaLancamento: {},
  infoDireita: {},
  valorLancamento: {},
  dataLancamento: {},
  // Botão Adicionar
  botaoAdicionar: {},
  textoBotaoAdicionar: {},

});
