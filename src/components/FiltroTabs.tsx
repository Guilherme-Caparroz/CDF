import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { FiltroTipo } from '../database/database';

const filtros: { chave: FiltroTipo; rotulo: string }[] = [
  { chave: 'todos', rotulo: 'Todos' },
  { chave: 'receita', rotulo: 'Entradas' },
  { chave: 'despesa', rotulo: 'Saídas' },
];

type Props = {
  valor: FiltroTipo;
  onChange: (filtro: FiltroTipo) => void;
};

// Abas "Todos | Entradas | Saídas". Usada na lista e nos Ajustes (filtro padrão).
export default function FiltroTabs({ valor, onChange }: Props) {
  return (
    <View style={styles.linhaAbas}>
      {filtros.map((f) => (
        <TouchableOpacity
          key={f.chave}
          onPress={() => onChange(f.chave)}
          style={valor === f.chave ? styles.abaAtiva : styles.aba}
        >
          <Text style={valor === f.chave ? styles.textoAbaAtiva : styles.textoAba}>
            {f.rotulo}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
