import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  mensagem: string;
  onTentarNovamente: () => void;
};

// Mensagem de erro amigável, com botão para tentar de novo
export default function EstadoErro({ mensagem, onTentarNovamente }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.circulo}>
        <Text style={styles.icone}>⚠️</Text>
      </View>
      <Text style={styles.titulo}>Ops, algo deu errado</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      <TouchableOpacity style={styles.botao} onPress={onTentarNovamente}>
        <Text style={styles.textoBotao}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  circulo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icone: {
    fontSize: 32,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B2340',
    marginBottom: 6,
    textAlign: 'center',
  },
  mensagem: {
    fontSize: 13,
    color: '#8A8FA3',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#22C55E',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  textoBotao: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
