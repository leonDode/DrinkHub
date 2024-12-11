import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../contexts/ThemeContext"; // Importa o ThemeContext

export default function UserNotAuthScreen() {
  const navigation = useNavigation();
  const { isDarkTheme } = useContext(ThemeContext); // Acessa o estado de tema global

  return (
    <View
      className={`flex-1 justify-center items-center px-4 ${
        isDarkTheme ? "bg-black" : "bg-white"
      }`}
    >
      {/* Texto principal com palavras em destaque */}
      <Text
        className={`text-2xl text-center mb-6 font-semibold ${
          isDarkTheme ? "text-white" : "text-gray-800"
        }`}
      >
        Para acessar essa funcionalidade é preciso fazer{" "}
        <Text className="text-green-500">login</Text>.
      </Text>

      {/* Botão de Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="bg-green-500 px-8 py-3 rounded-full mb-6"
      >
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>

      {/* Texto de separação */}
      <Text
        className={`text-center text-lg mb-4 ${
          isDarkTheme ? "text-gray-400" : "text-gray-600"
        }`}
      >
        ou
      </Text>

      {/* Botão de Continuar sem Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Main")}
        className="px-6 py-2"
      >
        <Text
          className={`text-lg text-center ${
            isDarkTheme ? "text-white" : "text-gray-800"
          }`}
        >
          continuar sem fazer login?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
