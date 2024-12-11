import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { URL } from "../helpers/url";
import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer"; // Importar o Buffer

// Configuração do Supabase
const supabaseUrl = "https://oruyzclaovqhgjqzrcwn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydXl6Y2xhb3ZxaGdqcXpyY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTE2ODgsImV4cCI6MjA0NTk2NzY4OH0.NLmLii0thRDjKHwcLUBPPVNOHAwBgKEgv4Ajjdadln0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditProfileScreen({ navigation }) {
  const { isDarkTheme } = useContext(ThemeContext);
  const { userId } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    avatarUrl: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const cachedProfile = await AsyncStorage.getItem(`profile_${userId}`);
      if (cachedProfile) {
        setProfileData(JSON.parse(cachedProfile));
        setIsLoading(false);
      }

      const response = await axios.get(`${URL}/usuario/${userId}`);
      if (response && response.data) {
        setProfileData(response.data);
        await AsyncStorage.setItem(
          `profile_${userId}`,
          JSON.stringify(response.data)
        );
      }
    } catch (err) {
      console.error("Error fetching profile data:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para selecionar uma imagem."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const imageName = `avatar_${userId}_${Date.now()}.jpg`;

        // Ler o arquivo local e converter para base64
        const fileData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Converter base64 para Blob usando o Buffer
        const blob = Buffer.from(fileData, "base64");

        // Upload para o Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatar")
          .upload(imageName, blob, { contentType: "image/jpeg" });

        if (uploadError) {
          console.error("Erro no upload:", uploadError.message);
          Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
          return;
        }

        // Obter URL pública
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from("avatar")
          .getPublicUrl(imageName);

        if (publicUrlError) {
          console.error("Erro ao obter URL pública:", publicUrlError.message);
          Alert.alert("Erro", "Não foi possível obter a URL da imagem.");
          return;
        }

        const publicUrl = publicUrlData.publicUrl;

        // Atualizar o banco de dados
        await axios.put(`${URL}/usuario/update/${userId}`, {
          avatarUrl: publicUrl,
        });

        // Atualizar o estado local
        setProfileData((prevState) => ({
          ...prevState,
          avatarUrl: publicUrl,
        }));

        Alert.alert("Sucesso", "Imagem de perfil atualizada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao atualizar a imagem:", err.message);
      Alert.alert("Erro", "Não foi possível atualizar a imagem de perfil.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${URL}/usuario/update/${userId}`, {
        nome: profileData.nome,
        email: profileData.email,
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack({ updated: true }); // Passa um parâmetro indicando que houve alterações
    } catch (err) {
      console.error("Error saving profile data:", err.message);
      Alert.alert("Erro ao atualizar o perfil.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View className={`flex-1  ${isDarkTheme ? "bg-black" : "bg-white"}`}>
      <View className="items-center mt-24">
        <View className="relative">
          <View className="w-32 h-32 rounded-full overflow-hidden ">
            <Image
              source={
                profileData.avatarUrl
                  ? { uri: profileData.avatarUrl }
                  : require("../../assets/images/default-avatar.png")
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity
            onPress={handleImageChange}
            className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
          >
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-8 px-4 space-y-4">
        <View>
          <Text
            className={`text-sm font-semibold mb-1 ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
          >
            Nome
          </Text>
          <TextInput
            value={profileData.nome}
            onChangeText={(text) =>
              setProfileData({ ...profileData, nome: text })
            }
            placeholder="Digite seu nome"
            className={`border p-3 rounded ${
              isDarkTheme ? "bg-white/10 text-white" : "bg-gray-100 text-black"
            }`}
          />
        </View>

        <View>
          <Text
            className={`text-sm font-semibold mb-1 ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
          >
            E-mail
          </Text>
          <TextInput
            value={profileData.email}
            onChangeText={(text) =>
              setProfileData({ ...profileData, email: text })
            }
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            className={`border p-3 rounded ${
              isDarkTheme ? "bg-white/10 text-white" : "bg-gray-100 text-black"
            }`}
          />
        </View>
      </View>

      <View className="flex-row justify-around mt-8">
        <TouchableOpacity
          onPress={handleCancel}
          className="bg-gray-400 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
