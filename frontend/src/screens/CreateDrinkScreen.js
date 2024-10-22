import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';
import { URL } from '../helpers/url';
import tw from 'tailwind-react-native-classnames';

export default function CreateDrinkScreen() {
  const { userId } = useContext(AuthContext);
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [img, setImg] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [tags, setTags] = useState('');
  const [publico, setPublico] = useState(true);
  const [input, setInput] = useState('');
  const [showSecondPart, setShowSecondPart] = useState(false);

  const handleCreateDrinkPartOne = () => {
    if (!nome || !descricao || !instrucoes) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (ingredientes.length === 0) {
      Alert.alert('Erro', 'Por favor, adicione ao menos um ingrediente.');
      return;
    }

   
    setShowSecondPart(true);
  };

  const handleAddIngredients = (input) => {
    const parts = input.trim().split(/(?<=\d+(?:ml|cl))\s+/); // Divide baseado em medidas

    parts.forEach(part => {
      const [medida, ...ingredienteArr] = part.split(' de ');
      const ingrediente = ingredienteArr.join(' de ').trim();

      if (medida && ingrediente) {
        setIngredientes(prev => [...prev, ingrediente]);
        setMedidas(prev => [...prev, medida]);
      }
    });

    setInput(''); // Limpa o campo após enviar
  };

  const handleSubmitDrink = async () => {
    const newDrink = {
      nome,
      descricao,
      instrucoes,
      img,
      salvo: false,
      publico,
      tags: tags.split(',').map(tag => tag.trim()),
      ingredientes,
      medidas,
      usuarioId: userId,
    };

    try {
      const response = await axios.post(`${URL}/drinks`, newDrink);
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Drink criado com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao criar o drink:', error);
      Alert.alert('Erro', 'Houve um problema ao criar o drink.');
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 items-center justify-center bg-white px-4 py-6`}>
      <Text style={tw`text-xl font-semibold mb-4`}>Crie um Novo Drink</Text>

      {!showSecondPart && (
        <>
          <Text style={tw`text-gray-600 mb-1`}>Nome*</Text>
          <TextInput
            style={tw`border p-2 rounded-lg mb-4 w-full max-w-xs`}
            placeholder="Digite o nome do drink"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={tw`text-gray-600 mb-1`}>Descrição*</Text>
          <TextInput
            style={tw`border p-2 rounded-lg mb-4 w-full max-w-xs`}
            placeholder="Digite a descrição"
            multiline={true}
            value={descricao}
            onChangeText={setDescricao}
          />

          <Text style={tw`text-gray-600 mb-1`}>Instruções*</Text>
          <TextInput
            style={tw`border p-2 rounded-lg mb-4 w-full max-w-xs`}
            placeholder="Digite as instruções"
            multiline={true}
            value={instrucoes}
            onChangeText={setInstrucoes}
          />

          <Text style={tw`text-gray-600 mb-1`}>Ingredientes e Medidas*</Text>
          <TextInput
            style={tw`border p-2 rounded-lg mb-4 w-full max-w-xs`}
            placeholder="Ex: 60ml de Vodka 40ml de Rum"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => {
              handleAddIngredients(input);
              setInput('');
            }}
          />

          <TouchableOpacity
            style={tw`bg-green-500 rounded-full py-2 px-4 mb-4 w-full max-w-xs`}
            onPress={handleCreateDrinkPartOne}
          >
            <Text style={tw`text-white text-center`}>Próxima Etapa</Text>
          </TouchableOpacity>

          {/* Exibição dos ingredientes e medidas */}
          {ingredientes.length > 0 && (
            <FlatList
              data={ingredientes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Text style={tw`text-gray-800`}>
                  {medidas[index]} de {item}
                </Text>
              )}
              style={tw`w-full max-w-xs`} // Estilo do FlatList
            />
          )}
        </>
      )}

      {showSecondPart && (
        <>
          <Text style={tw`text-gray-600 mb-1`}>URL da Imagem</Text>
          <TextInput
            style={tw`border p-2 rounded-lg mb-4 w-full max-w-xs`}
            placeholder="Digite a URL da imagem"
            value={img}
            onChangeText={setImg}
          />

          <Text style={tw`text-gray-600 mb-1`}>Tags (separadas por vírgula)</Text>
          <TextInput
            style={tw`border p-2 rounded-lg mb-4 w-full max-w-xs`}
            placeholder="Digite as tags"
            value={tags}
            onChangeText={setTags}
          />

          <View style={tw`flex-row justify-between mt-6 w-full max-w-xs`}>
            <TouchableOpacity
              style={tw`bg-red-500 rounded-full py-2 px-6 w-2/5`}
              onPress={() => navigation.goBack()}
            >
              <Text style={tw`text-white text-center`}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-green-500 rounded-full py-2 px-6 w-2/5`}
              onPress={handleSubmitDrink}
            >
              <Text style={tw`text-white text-center`}>Salvar Drink</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}
