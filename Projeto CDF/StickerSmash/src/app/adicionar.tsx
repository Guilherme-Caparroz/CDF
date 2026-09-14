//VOU DEIXAR O CSS VAZIO PRO ERICK E O GUI ****

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { adicionarlancamento } from './dados';

const categorias = ['Salário', 'Alimentação', 'Transporte', 'Lazer', 'Contas', 'Compras', 'Outros'];

export default function AdicionarLancamento() {
  const router = useRouter();

  // useState e um valor que pode ser modificado e atualiza a tela
  // quando esse valor muda. Cada campo do formulário tem o seu.
  const [tipo, setTipo] = useState('receita'); // 'receita' = Entrada 'despesa' = Saída
  const [valor, setValor] = useState('');
  const [nome, setNome] = useState('');       // campo descricao da tela
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
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
      <Text style={styles.label}>Tipo de Lançamento</Text>
      <View style={styles.linhaTipo}>
        <TouchableOpacity onPress={() => setTipo('receita')}>
          <Text>Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTipo('despesa')}>
          <Text>Saída</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Valor do Lançamento</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        placeholder="R$ 0,00"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Salário, mercado, transporte..."
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.linhaCategorias}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoria(cat)}
            style={categoria === cat ? styles.chipSelecionado : styles.chip}
          >
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="05 de Agosto, 2025"
      />

      <Text style={styles.label}>Observação (opcional)</Text>
      <TextInput
        style={styles.input}
        value={observacao}
        onChangeText={setObservacao}
        placeholder="Escreva alguma observação aqui..."
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotaoSalvar}>Salvar lançamento</Text>
      </TouchableOpacity>
    </View>
  );
}
//CSS
const styles = StyleSheet.create({
  container: {},
  label: {},
  linhaTipo: {},
  input: {},
  linhaCategorias: {},
  chip: {},
  chipSelecionado: {},
  botaoSalvar: {},
  textoBotaoSalvar: {},
})