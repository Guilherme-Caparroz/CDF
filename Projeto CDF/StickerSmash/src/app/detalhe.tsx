import React from 'react';
import { Link } from 'expo-router';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function Tela2() {
    return (
        <View style={styles.container}>

           
            <View style={styles.header}>
                <Link href="/" style={styles.headerbotao}>
                    <Text style={styles.textoVoltar}>← Voltar</Text>
                </Link>
                <Text style={styles.headerpalavra}>Detalhes</Text>
            </View>

            <View style={styles.salariodetalhes}>
                <Image
                    source={require('../../assets/images/fotomoney.png')}
                    style={styles.imagem}
                />
                
                <Text style={styles.titulo}>Salário Mensal</Text>
                <Text style={styles.receitaBadge}>Receita</Text>

                <Text style={styles.titulo1}>Valor:  R$ 3.500,00</Text>
                <Text style={styles.titulo2}>Categoria: Salário</Text>
                <Text style={styles.titulo3}>Data: 05 de Agosto, 2025</Text>
                
                <Text style={styles.titulo4}>DESCRIÇÃO</Text>
                <Text style={styles.titulo5}>
                    Pagamento mensal referente ao mês de agosto.
                </Text>
            </View>

            {/* botao de voltar que fica la em baixo */}
            <View style={styles.areaBotao}>
                <Link href="/" style={styles.botaovoltarbaixo}>
                    <Text style={styles.textoBotao}>Voltar para tela inicial</Text>
                </Link>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    header: {},
    headerbotao: {},
    textoVoltar: {},
    headerpalavra: {},
    salariodetalhes: {},
    imagem: {},
    titulo: {},
    receitaBadge: {},
    titulo1: {},
    titulo2: {},
    titulo3: {},
    titulo4: {},
    titulo5: {},
    areaBotao: {},
    botaovoltarbaixo: {},
    textoBotao: {},
});