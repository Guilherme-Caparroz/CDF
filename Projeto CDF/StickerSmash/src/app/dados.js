let lancamentos = [
    {
        nome: "Salario mensal",
        valor: 3.500,
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


function adicionarlancamento(nome, valor, tipo, categoria, data, descricao) {

    let novoLancamento = {
        nome: nome,
        valor: valor,
        tipo: tipo,
        categoria: categoria,
        data: data,
        descricao: descricao
    };

    lancamentos.push(novoLancamento);
}


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


export {
    lancamentos,
    adicionarlancamento,
    calcularsaldo
};