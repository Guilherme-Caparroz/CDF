import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { adicionarlancamento } from './dados';

const categorias = [
  { nome: 'Salário', icone: '💼' },
  { nome: 'Alimentação', icone: '🍽️' },
  { nome: 'Transporte', icone: '🚌' },
  { nome: 'Lazer', icone: '🎉' },
  { nome: 'Contas', icone: '📄' },
  { nome: 'Compras', icone: '🛍️' },
  { nome: 'Outros', icone: '▦' },
];

export default function AdicionarLancamento() {
  const router = useRouter();

  // useState e um valor que pode ser modificado e atualiza a tela
  // quando esse valor muda. Cada campo do formulário tem o seu.
  const [tipo, setTipo] = useState('receita'); // 'receita' = Entrada 'despesa' = Saída
  const [valor, setValor] = useState('');
  const [nome, setNome] = useState('');       // campo descricao da tela
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('05 de Agosto, 2025');
  const [observacao, setObservacao] = useState(''); // descriçao do js

  function handleSalvar() {
    //ve se os campos obrigatorios tao com algo
    if (!valor || !nome || !categoria || !data) {
      alert('Preencha valor, descrição, categoria e data.');
      return;
    }

    adicionarlancamento(
      nome,
      parseFloat(valor),
      tipo,
      categoria,
      data,
      observacao
    );

    // Volta pra tela inicial depois de salvar
    router.back();
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Text style={styles.textoVoltar}>← Voltar</Text>
  </TouchableOpacity>
  <View style={styles.headerCentro} pointerEvents="none">
    <Text style={styles.headerTitulo}>Adicionar lançamento</Text>
  </View>
</View>

      <View style={styles.conteudo}>

        <Text style={styles.label}>TIPO DE LANÇAMENTO</Text>
        <View style={styles.linhaTipo}>
          <TouchableOpacity
            onPress={() => setTipo('receita')}
            style={tipo === 'receita' ? styles.tipoBotaoSelecionadoEntrada : styles.tipoBotao}
          >
            <Text style={tipo === 'receita' ? styles.tipoTextoSelecionado : styles.tipoTexto}>
              ↗ Entrada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTipo('despesa')}
            style={tipo === 'despesa' ? styles.tipoBotaoSelecionadoSaida : styles.tipoBotao}
          >
            <Text style={tipo === 'despesa' ? styles.tipoTextoSelecionado : styles.tipoTexto}>
              ↘ Saída
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>VALOR DO LANÇAMENTO</Text>
        <View style={styles.valorContainer}>
          <Text style={styles.valorPrefixo}>R$</Text>
          <TextInput
            style={styles.valorInput}
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
            placeholder="0,00"
            placeholderTextColor="#22C55E"
          />
          <Text style={styles.lapis}>✎</Text>
        </View>

        <Text style={styles.label}>DESCRIÇÃO</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Salário, mercado, transporte..."
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>CATEGORIA</Text>
        <View style={styles.linhaCategorias}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.nome}
              onPress={() => setCategoria(cat.nome)}
              style={categoria === cat.nome ? styles.chipSelecionado : styles.chip}
            >
              <Text style={styles.chipIcone}>{cat.icone}</Text>
              <Text style={categoria === cat.nome ? styles.chipTextoSelecionado : styles.chipTexto}>
                {cat.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>DATA</Text>
        <View style={styles.dataContainer}>
          <TextInput
            style={styles.dataInput}
            value={data}
            onChangeText={setData}
            placeholder="05 de Agosto, 2025"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.calendario}>📅</Text>
        </View>

        <Text style={styles.label}>OBSERVAÇÃO (Opcional)</Text>
        <TextInput
          style={[styles.input, styles.observacaoInput]}
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Escreva alguma nota adicional aqui..."
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBotaoSalvar}>Salvar lançamento</Text>
        </TouchableOpacity>

      </View>
    </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textoVoltar: {
    color: 'white',
    fontSize: 14,
  },
  headerTitulo: {
  color: 'white',
  fontSize: 17,
  fontWeight: 'bold',
},
headerCentro: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
},

  conteudo: {
    padding: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8FA3',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },

  // Tipo de lançamento
  linhaTipo: {
    flexDirection: 'row',
    gap: 10,
  },
  tipoBotao: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipoBotaoSelecionadoEntrada: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  tipoBotaoSelecionadoSaida: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  tipoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2340',
  },
  tipoTextoSelecionado: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2340',
  },

  // Valor
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  valorPrefixo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22C55E',
    marginRight: 8,
  },
  valorInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22C55E',
    padding: 0,
  },
  lapis: {
    fontSize: 16,
    color: '#9CA3AF',
  },

// Inputs genéricos
input: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1B2340',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

observacaoInput: {
    minHeight: 90,
    textAlignVertical: 'top',
},

// Categorias
linhaCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
},
chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
},
chipSelecionado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#22C55E',
    gap: 6,
},
chipIcone: {
    fontSize: 13,
},
chipTexto: {
    fontSize: 13,
    color: '#1B2340',
    fontWeight: '500',
},
chipTextoSelecionado: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
},

// Data
dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
},
dataInput: {
    flex: 1,
    fontSize: 14,
    color: '#1B2340',
    padding: 0,
},
calendario: {
    fontSize: 16,
},

// Botão salvar
botaoSalvar: {
    backgroundColor: '#22C55E',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
},
textoBotaoSalvar: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
},
});