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
                <View style={styles.headerCentro}>
                    <Text style={styles.headerpalavra}>Detalhes</Text>
                </View>
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
                    <Text style={styles.textoBotao}>Voltar para Lista</Text>
                </Link>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {},

    header: {
        backgroundColor: '#1B2340',
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    },

    headerbotao: {},
    textoVoltar: {
        color: 'white'
    },

   headerpalavra: {
    color: 'white',
    fontSize: 18,
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

    salariodetalhes: {   
    backgroundColor: '#fcfcfd',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    },

    imagem: {
        height: 56,
        width: 56,
    },

       titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B2340',
        marginTop: 12,
        marginBottom: 8,
    },

    receitaBadge: {
        backgroundColor: '#22C55E',
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },

    titulo1: {
        fontSize: 14,
        color: '#22C55E',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },

    titulo2: {
        fontSize: 14,
        color: '#1B2340',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },

    titulo3: {
        fontSize: 14,
        color: '#1B2340',
        alignSelf: 'flex-start',
        marginBottom: 16,
    },

    titulo4: {
        fontSize: 12,
        color: '#8A8FA3',
        alignSelf: 'flex-start',
        marginBottom: 4,
        letterSpacing: 0.5,
    },

    titulo5: {
        fontSize: 14,
        color: '#1B2340',
        alignSelf: 'flex-start',
        lineHeight: 20,
    },

    areaBotao: {
        marginHorizontal: 20,
        marginTop: 20,
    },

    botaovoltarbaixo: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },

    textoBotao: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1B2340',
        textAlign: 'center',
    },
});