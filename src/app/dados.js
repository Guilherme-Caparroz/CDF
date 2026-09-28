import AsyncStorage from '@react-native-async-storage/async-storage';
//IMPORT DE BD LOCAL* (tipo uma gaveta)

const CHAVE_STORAGE = '@finanapp_lancamentos';

//ARRAY LANCAMENTO
let lancamentos = [
    {
        nome: "Salario mensal",
        valor: 3500,
        tipo: "receita",
        categoria: "Salário",
        data: "05/08/2025",
        descricao: "Pagamento mensal referente ao mês de agosto."
    },
    {
        nome: "Supermercado Centro",
        valor: 350,
        tipo: "despesa",
        categoria: "Alimentação",
        data: "10/08/2025",
        descricao: "Compras do supermercado."
    },
    {
        nome: "Recarga Cartão",
        valor: 50,
        tipo: "despesa",
        categoria: "Transporte",
        data: "12/08/2025",
        descricao: "Recarga do cartão de transporte."
    }
];



//salvando
async function salvarLancamentos() {
    try {
        const textoParaSalvar = JSON.stringify(lancamentos); 
        await AsyncStorage.setItem(CHAVE_STORAGE, textoParaSalvar);
    } catch (erro) {
        console.log('Erro ao salvar lançamentos:', erro);
    }
}


//carregando
async function carregarLancamentos() {
    try {
        const textoSalvo = await AsyncStorage.getItem(CHAVE_STORAGE);

        if (textoSalvo !== null) {
            lancamentos = JSON.parse(textoSalvo); 
        }
        
        

    } catch (erro) {
        console.log('Erro ao carregar lançamentos:', erro);
    }

    return lancamentos;
}
//adicionar
async function adicionarlancamento(nome, valor, tipo, categoria, data, descricao) {

    let novoLancamento = {
        nome: nome,
        valor: valor,
        tipo: tipo,
        categoria: categoria,
        data: data,
        descricao: descricao
    };

    lancamentos.push(novoLancamento);
    await salvarLancamentos(); 
}
//calcular
function calcularsaldo() {

    let saldo = 0;

    lancamentos.forEach(function(lancamento) {
        if (lancamento.tipo === "receita") {
            saldo += lancamento.valor;
        } else {
            saldo -= lancamento.valor;
        }
    });

    return saldo;
}
//import
export {
    lancamentos,
    adicionarlancamento,
    calcularsaldo,
    carregarLancamentos
};