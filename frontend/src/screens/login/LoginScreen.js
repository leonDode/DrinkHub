import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Google from "expo-auth-session/providers/google";
import { AuthContext } from "../../contexts/authContext";
import { URL } from "../../helpers/url";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "420827959224-u9t2m244gmg8sbn4ov15hhrsm2kj22t6.apps.googleusercontent.com",
  //   androidClientId:
  //     "420827959224-q9ps8s61ap1cs1rkk7grmofrnn3844as.apps.googleusercontent.com",
  //   iosClientId:
  //     "420827959224-klh2vf3f64csi3gol15k26q6flmhorbr.apps.googleusercontent.com",
  //   redirectUri: "drinkhub:/auth",
  // });
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setError({ email: "", password: "" }); // Limpa erros antes de tentar login
    try {
      const response = await axios.post(`${URL}/login`, {
        email,
        password,
      });

      const token = response.data.acess_token;
      const userId = response.data.user_id;

      login(token, String(userId));
      navigation.navigate("Main");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError({ ...error, password: "Senha incorreta!" });
      } else if (err.response && err.response.status === 404) {
        setError({ ...error, email: "Usuário não encontrado!" });
      } else {
        setError({ ...error, password: "Erro inesperado. Tente novamente." });
      }
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await promptAsync();
  //     if (result.type === "success") {
  //       const { id_token } = result.params;
  //       const response = await axios.post(`${URL}/google/callback`, {
  //         token: id_token,
  //       });
  //       const token = response.data.acess_token;
  //       const userId = response.data.user_id;

  //       login(token, String(userId));
  //       navigation.navigate("Main");
  //     }
  //   } catch (err) {
  //     setError({
  //       ...error,
  //       password: "Erro no login com Google. Tente novamente.",
  //     });
  //   }
  // };

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
            <View className="flex-row justify-center w-full absolute mt-20">
              <Animated.Image
                entering={FadeInUp.delay(200).duration(1000).springify()}
                className="h-[250] w-[320]"
                source={require("../../../assets/images/drinkhubName.png")}
              />
            </View>

            <View className="h-full w-full flex justify-around pt-40 pb-10 mt-10">
              <View className="flex items-center mx-4 space-y-4 mt-10">
                <View className="bg-black/5 p-5 rounded-2xl w-full border border-white mt-20">
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
                {error.email ? (
                  <Text
                    className="text-red-500 text-sm mt-2 "
                    style={{ marginRight: "auto", marginLeft: 10 }}
                  >
                    *{error.email}
                  </Text>
                ) : null}
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
                {error.password ? (
                  <Text
                    className="text-red-500 text-sm mt-2 "
                    style={{ marginRight: "auto", marginLeft: 10 }}
                  >
                    *{error.password}
                  </Text>
                ) : null}

                <View className="w-full">
                  <TouchableOpacity
                    className="w-full bg-green-400 p-3 rounded-2xl mb-3"
                    onPress={handleLogin}
                  >
                    <Text className="text-xl font-bold text-white text-center">
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-center">
                  <Text className="text-white">Ainda não tem uma conta? </Text>
                  <TouchableOpacity onPress={() => navigation.push("SignUp")}>
                    <Text className="text-green-700">Cadastre-se</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                  <TouchableOpacity onPress={() => navigation.push("Main")}>
                    <Text className="text-white">
                      Continuar sem fazer login
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 flex items-center justify-center">
                  {/* <TouchableOpacity
                    className="w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center"
                    onPress={handleGoogleLogin}
                  >
                    <Animated.Image
                      source={require("../../../assets/images/google-icon.png")}
                      className="h-[40] w-[40]"
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
