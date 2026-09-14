import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdicionarScreen() {
    return (
        <SafeAreaView>

            <View>
                <TouchableOpacity>
                    <Text>← Voltar</Text>
                </TouchableOpacity>

                <Text>Adicionar lançamento</Text>
            </View>

            <ScrollView>

                <Text>TIPO DE LANÇAMENTO</Text>

                <View>
                    <TouchableOpacity>
                        <Text> Entrada</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text> Saída</Text>
                    </TouchableOpacity>
                </View>

                <Text>VALOR DO LANÇAMENTO</Text>

                <View>
                    <Text>R$</Text>

                    <TextInput
                        placeholder="0,00" keyboardType="numeric"
                    />
                </View>

                <Text>DESCRIÇÃO</Text>

                <TextInput
                    placeholder="Ex: Salário, mercado, transporte..."
                />

                <Text>CATEGORIA</Text>

                <View>
                    <TouchableOpacity>
                        <Text>Salário</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Alimentação</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Transporte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Lazer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Contas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Compras</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Outros</Text>
                    </TouchableOpacity>
                </View>

                <Text>DATA</Text>

                <TextInput
                    placeholder="05/08/2025"
                />

                <Text>OBSERVAÇÃO (Opcional)</Text>

                <TextInput
                    placeholder="Escreva alguma nota adicional aqui..."
                    multiline={true}
                    numberOfLines={3}
                />

                <TouchableOpacity>
                    <Text>Salvar lançamento</Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>
    );
}