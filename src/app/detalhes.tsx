import { Link, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EstadoErro from '../components/EstadoErro';
import { buscarLancamento, excluirLancamento, Lancamento } from '../database/database';

export default function Tela2() {
    const router = useRouter();

    // Pega o id que veio da tela anterior
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id;
    const idLancamento = idParam ? Number(idParam) : null;

    const [lancamento, setLancamento] = useState<Lancamento | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    // Procura o lançamento no banco pelo id
    const buscar = useCallback(async () => {
        try {
            if (idLancamento !== null && Number.isInteger(idLancamento) && idLancamento > 0) {
                const l = await buscarLancamento(idLancamento);
                setLancamento(l ?? null);
            }
            setErro(false);
        } catch {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    }, [idLancamento]);

    // recarrega ao abrir e ao voltar da tela de editar
    useFocusEffect(
        useCallback(() => {
            buscar();
        }, [buscar])
    );

    function tentarNovamente() {
        setCarregando(true);
        buscar();
    }

    // Pede confirmação antes de excluir
    function confirmarExclusao() {
        Alert.alert('Excluir lançamento', 'Tem certeza que deseja excluir?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    if (idLancamento === null) return;
                    try {
                        await excluirLancamento(idLancamento);
                    } catch {
                        alert('Não foi possível excluir o lançamento. Tente novamente.');
                        return;
                    }
                    router.back();
                },
            },
        ]);
    }

    // loading enquanto busca no banco (também evita piscar "não encontrado")
    if (carregando) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        );
    }

    // erro amigável se a leitura do banco falhar
    if (erro) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <EstadoErro
                    mensagem="Não foi possível carregar os detalhes deste lançamento."
                    onTentarNovamente={tentarNovamente}
                />
            </View>
        );
    }

    if (!lancamento) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
                <Text style={{ fontSize: 16, marginBottom: 16 }}>Lançamento não encontrado.</Text>
                <Link href="/" style={styles.botaovoltarbaixo}>
                    <Text style={styles.textoBotao}>Voltar para o início</Text>
                </Link>
            </View>
        );
    }


    const ehReceita = lancamento.tipo === 'receita';

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Link href="/" style={styles.headerbotao}>
                    <Text style={styles.textoVoltar}>← Voltar</Text>
                </Link>
                <View style={styles.headerCentro} pointerEvents="none">
                    <Text style={styles.headerpalavra}>Detalhes</Text>
                </View>
            </View>

            <View style={styles.salariodetalhes}>
                <Image
                    source={require('../../assets/images/fotomoney.png')}
                    style={styles.imagem}
                />

                <Text style={styles.titulo}>{lancamento.nome}</Text>

                <Text
                    style={[
                        styles.receitaBadge,
                        { backgroundColor: ehReceita ? '#22C55E' : '#EF4444' },
                    ]}
                >
                    {ehReceita ? 'Receita' : 'Despesa'}
                </Text>

                <Text
                    style={[
                        styles.titulo1,
                        { color: ehReceita ? '#22C55E' : '#EF4444' },
                    ]}
                >
                    Valor: {ehReceita ? '+' : '-'} R$ {lancamento.valor ? lancamento.valor.toFixed(2).replace('.', ',') : '0,00'}
                </Text>

                <Text style={styles.titulo2}>Categoria: {lancamento.categoria}</Text>
                <Text style={styles.titulo3}>Data: {lancamento.data}</Text>

                <Text style={styles.titulo4}>DESCRIÇÃO</Text>
                <Text style={styles.titulo5}>{lancamento.descricao || '—'}</Text>
            </View>

            <View style={styles.areaBotao}>
                <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => router.push({ pathname: '/adicionar', params: { id: String(lancamento.id) } })}
                >
                    <Text style={styles.textoBotaoBranco}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
                    <Text style={styles.textoBotaoBranco}>Excluir</Text>
                </TouchableOpacity>

                <Link href="/" style={styles.botaovoltarbaixo}>
                    <Text style={styles.textoBotao}>Voltar para Lista</Text>
                </Link>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6'
    },

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
        marginHorizontal: 30,
        marginTop: 20,
        alignItems: 'center',
        gap: 12,
    },

    botaovoltarbaixo: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 40,
        alignItems: 'center',
    },

    textoBotao: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1B2340',
        textAlign: 'center',
    },

    // --- estilos novos ---
    botaoEditar: {
        alignSelf: 'stretch',
        backgroundColor: '#22C55E',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },

    botaoExcluir: {
        alignSelf: 'stretch',
        backgroundColor: '#EF4444',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },

    textoBotaoBranco: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
    },
});