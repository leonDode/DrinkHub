import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

export default function SignUpScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userToken, login, logout, isLoading } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api-drinks-oz3c.onrender.com/usuario",
        {
          nome,
          email,
          password,
        }
      );

      // const token = response.data.acess_token;
      // const userId = response.data.user_id;

      // login(token, userId);
      Alert.alert("Conta criada com sucesso!");

      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Cadastro falhou, por favor tente novamente.");
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-green-500 h-full w-full">
            <View className="absolute top-0 left-0 right-0">
              <Animated.Image
                entering={FadeInUp.delay(200).duration(1000).springify()}
                style={{
                  height: 300, // Definindo a altura menor
                  width: 300, // Definindo a largura menor
                  resizeMode: "contain", // Faz a imagem ajustar-se à caixa sem esticar
                  alignSelf: "center", // Centraliza a imagem no contêiner
                }}
                source={require("../../../assets/images/drinkhubName.png")}
              />
            </View>

            <View className="h-full w-full flex justify-around pt-40 mt-10">
              <View className="flex items-center mx-4 space-y-4 mt-10">
                {/* Campo para nome */}
                <View className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                  <TextInput
                    placeholder="Nome"
                    placeholderTextColor="white"
                    value={nome}
                    onChangeText={setNome}
                    style={{ color: "white" }}
                  />
                </View>

                {/* Campo para email */}
                <View className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="white"
                    value={email}
                    onChangeText={setEmail}
                    style={{ color: "white" }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Campo para senha */}
                <View className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor="white"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={{ color: "white" }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Campo para confirmar senha */}
                <View className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                  <TextInput
                    placeholder="Confirmar Senha"
                    placeholderTextColor="white"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={{ color: "white" }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Botão de cadastro */}
                <View className="w-full">
                  <TouchableOpacity
                    className="w-full bg-green-400 p-3 rounded-2xl mb-3"
                    onPress={handleSignUp}
                  >
                    <Text className="text-xl font-bold text-white text-center">
                      Cadastrar-se
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Link para login */}
                <View className="flex-row justify-center">
                  <Text className="text-white">Já tem uma conta? Faça </Text>
                  <TouchableOpacity onPress={() => navigation.push("Login")}>
                    <Text className="text-green-700">Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
