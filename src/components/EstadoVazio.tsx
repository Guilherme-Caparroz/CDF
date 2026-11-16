import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icone?: string;
  titulo: string;
  mensagem?: string;
};

// Estado vazio: aparece quando a lista não tem nenhum item para mostrar
export default function EstadoVazio({ icone = '🧾', titulo, mensagem }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.circulo}>
        <Text style={styles.icone}>{icone}</Text>
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
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
    backgroundColor: '#E5F9F0',
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
  },
});
