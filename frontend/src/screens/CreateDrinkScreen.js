import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { TrashIcon } from "react-native-heroicons/solid";
import axios from "axios";
import { URL } from "../helpers/url";
import { ThemeContext } from "../contexts/ThemeContext";

const CreateDrinkScreen = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [instrucoes, setInstrucoes] = useState("");
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const { isDarkTheme } = useContext(ThemeContext);
  const inputRef = useRef(null);

  const availableTags = [
    "amargo",
    "doce",
    "citrico",
    "quente",
    "suave",
    "forte",
  ];

  const regex = /^([0-9]+\s?(ml|g|l|kg|oz)) de (.+)$/i;

  const validateInputs = () => {
    setIsNextEnabled(
      nome.trim() !== "" && descricao.trim() !== "" && instrucoes.trim() !== ""
    );
  };

  const toggleTagSelection = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const isValidInput = (input) => regex.test(input);

  const handleAddIngredient = () => {
    if (inputValue.trim() === "") {
      Alert.alert(
        "Erro na entrada",
        "O campo de ingrediente não pode estar vazio."
      );
      return;
    }

    if (isValidInput(inputValue)) {
      const match = inputValue.match(regex);
      const medida = match[1];
      const ingrediente = match[3];

      setIngredientes([...ingredientes, { medida, ingrediente }]);
      setInputValue(""); // Limpa o campo após a adição
      inputRef.current?.focus(); // Mantém o foco no campo de entrada
    } else {
      Alert.alert(
        "Erro na entrada",
        "O formato esperado é 'quantidade unidade de ingrediente', por exemplo: '60 ml de vodka'."
      );
    }
  };

  const handleRemoveItem = (index) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const medidas = {};
    const ingredientesList = [];

    ingredientes.forEach((item, index) => {
      medidas[`medidas${index}`] = item.medida || null;
      ingredientesList.push(item.ingrediente);
    });

    const payload = {
      nome,
      descricao,
      instrucoes,
      tags: selectedTags,
      medidas,
      ingredientes: ingredientesList,
    };

    axios
      .post(`${URL}/drinks`, payload)
      .then(() => Alert.alert("Sucesso", "Drink criado com sucesso!"))
      .catch(() => Alert.alert("Erro", "Não foi possível salvar o drink."));
  };

  const renderInput = (
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    height = 50
  ) => (
    <>
      <Text
        className={`mb-2 text-lg ${isDarkTheme ? "text-white" : "text-black"}`}
      >
        {label}:
      </Text>
      <TextInput
        className={`border p-3 mb-4 rounded-lg ${
          isDarkTheme
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-white text-black"
        }`}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          validateInputs();
        }}
        placeholder={placeholder}
        placeholderTextColor={isDarkTheme ? "gray" : "black"}
        multiline={multiline}
        style={{ height, textAlignVertical: "top" }}
      />
    </>
  );

  const ListHeader = () => (
    <View className="p-5">
      <Text
        className={`text-xl font-bold mb-4 ${
          isDarkTheme ? "text-white" : "text-black"
        }`}
      >
        Adicione os Ingredientes:
      </Text>
      <TextInput
        ref={inputRef}
        placeholder="Digite: 60 ml de vodka"
        className={`border p-3 rounded-lg mb-4 ${
          isDarkTheme
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-white text-black"
        }`}
        onChangeText={(text) => setInputValue(text)}
        value={inputValue}
        blurOnSubmit={false}
      />
      <TouchableOpacity
        onPress={handleAddIngredient}
        className={`p-3 rounded-lg items-center mb-4 ${
          inputValue.trim() !== ""
            ? isDarkTheme
              ? "bg-green-800"
              : "bg-green-600"
            : "bg-gray-400"
        }`}
        disabled={inputValue.trim() === ""}
      >
        <Text className="text-white text-lg">Adicionar Ingrediente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 ${isDarkTheme ? "bg-black" : "bg-white"}`}
    >
      <Text
        className={`text-2xl font-bold mb-6 text-center ${
          isDarkTheme ? "text-white" : "text-black"
        }`}
      >
        Criar um Drink
      </Text>

      {!showTags && !showIngredients ? (
        <View className="p-5">
          {renderInput(
            "Nome do Drink",
            nome,
            setNome,
            "Digite o nome do drink"
          )}
          {renderInput(
            "Descrição",
            descricao,
            setDescricao,
            "Descrição do drink",
            true,
            120
          )}
          {renderInput(
            "Instruções",
            instrucoes,
            setInstrucoes,
            "Instruções para preparo",
            true,
            120
          )}

          <TouchableOpacity
            className={`p-3 rounded-lg items-center mb-4 ${
              isNextEnabled
                ? isDarkTheme
                  ? "bg-green-800"
                  : "bg-green-600"
                : "bg-gray-400"
            }`}
            disabled={!isNextEnabled}
            onPress={() => setShowIngredients(true)}
          >
            <Text className="text-white text-lg">Próximo</Text>
          </TouchableOpacity>
        </View>
      ) : showIngredients ? (
        <View className="p-5">
          <FlatList
            data={ingredientes}
            ListHeaderComponent={<ListHeader />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                className={`flex-row justify-between items-center px-4 py-3 my-2 rounded-lg shadow-lg ${
                  isDarkTheme ? "bg-gray-800" : "bg-white"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                }}
              >
                <Text
                  className={`text-lg ${
                    isDarkTheme ? "text-white" : "text-black"
                  }`}
                >
                  {`${item.medida} - ${item.ingrediente}`}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                  <TrashIcon
                    size={24}
                    color={isDarkTheme ? "#ffffff" : "#000000"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <TouchableOpacity
            className={`p-3 rounded-lg items-center mb-4 ${
              ingredientes.length > 0
                ? isDarkTheme
                  ? "bg-green-800"
                  : "bg-green-600"
                : "bg-gray-400"
            }`}
            disabled={ingredientes.length === 0}
            onPress={handleSave}
          >
            <Text className="text-white text-lg">Salvar Drink</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="p-5">
          <Text
            className={`text-xl font-bold mb-4 ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
          >
            Selecione as Tags:
          </Text>
          <View className="mb-4">
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                className={`px-4 py-3 my-2 rounded-lg shadow-lg ${
                  selectedTags.includes(tag)
                    ? "bg-green-200"
                    : isDarkTheme
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
                onPress={() => toggleTagSelection(tag)}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                }}
              >
                <Text
                  className={`text-lg ${
                    selectedTags.includes(tag)
                      ? "text-black"
                      : isDarkTheme
                      ? "text-gray-400"
                      : "text-black"
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className={`p-3 rounded-lg items-center mb-4 ${
              selectedTags.length > 0
                ? isDarkTheme
                  ? "bg-green-800"
                  : "bg-green-600"
                : "bg-gray-400"
            }`}
            disabled={selectedTags.length === 0}
            onPress={() => setShowIngredients(true)}
          >
            <Text className="text-white text-lg">Próximo</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default CreateDrinkScreen;
