import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}>FinanApp</Text>

     
      <Link href={{ pathname: '/detalhes', params: { id: '0' } }} style={styles.linkDetalhe}>
        <Text style={styles.linkTexto}>Ver detalhes do salário →</Text>
      </Link>

    </SafeAreaView>
  );
}

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
});
