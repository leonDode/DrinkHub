import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import axios from "axios";
import Saved from "../components/saved";
import { URL } from "../helpers/url";
import { AuthContext } from "../contexts/authContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { CachedImage } from "../helpers/image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next"; // Importa o hook de tradução

export default function SavedScreen() {
  const [drinks, setDrinks] = useState([]);
  const [userDrinks, setUserDrinks] = useState([]);
  const [userProfile, setUserProfile] = useState({
    nome: "",
    avatarUrl: null, // Inicia como null caso não tenha avatar
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("saved");
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useContext(AuthContext);
  const { isDarkTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const getSavedRecipes = async () => {
    try {
      setIsLoading(true);
      const key = `favourites_${userId}`;
      const savedDrinks = await AsyncStorage.getItem(key);
      const parsedDrinks = savedDrinks ? JSON.parse(savedDrinks) : [];
      setDrinks(parsedDrinks);
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao carregar drinks salvos:", err.message);
      setIsLoading(false);
    }
  };
  const getUserData = async () => {
    try {
      const response = await axios.get(`${URL}/usuario/${userId}`);
      if (response && response.data) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const getUserRecipes = async () => {
    try {
      const response = await axios.get(`${URL}/drinks/user/${userId}`);
      if (response && response.data) {
        setUserDrinks(response.data);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterRecipes(text);
  };

  const filterRecipes = (text) => {
    if (activeTab === "saved") {
      if (text === "") {
        getSavedRecipes();
      } else {
        const filteredDrinks = drinks.filter((drink) =>
          drink.nome.toLowerCase().includes(text.toLowerCase())
        );
        setDrinks(filteredDrinks);
      }
    } else {
      if (text === "") {
        getUserRecipes();
      } else {
        const filteredUserDrinks = userDrinks.filter((drink) =>
          drink.nome.toLowerCase().includes(text.toLowerCase())
        );
        setUserDrinks(filteredUserDrinks);
      }
    }
  };

  const renderIcon = (tab) => {
    if (tab === "saved") {
      return <Ionicons name="bookmark" size={24} color="rgb(34 197 94)" />;
    }
    return <Ionicons name="bookmark-outline" size={24} color="gray" />;
  };

  const renderUserIcon = (tab) => {
    if (tab === "created") {
      return <Ionicons name="person" size={24} color="rgb(34 197 94)" />;
    }
    return <Ionicons name="person-outline" size={24} color="gray" />;
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);

        // Carrega os dados do perfil do usuário em paralelo
        const userProfilePromise = getUserData();

        // Carrega os favoritos específicos do usuário
        const savedRecipesPromise = getSavedRecipes();

        // Aguarda ambas as promessas para continuar
        await Promise.all([userProfilePromise, savedRecipesPromise]);

        setIsLoading(false);
      };

      fetchData();
    }, [userId])
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="rgb(34 197 94)" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkTheme ? "bg-black" : "bg-white"}`}>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />

      {/* Área do Perfil */}
      {userProfile && (
        <View className="flex-row items-center mx-4 mt-16 mb-4 space-x-4 ">
          <View className="relative">
            <View className="w-24 h-24 rounded-full overflow-hidden">
              {userProfile.avatarUrl ? (
                <CachedImage
                  source={{ uri: userProfile.avatarUrl }}
                  className="w-full h-full"
                  contentFit="cover"
                  onError={() =>
                    setUserProfile({ ...userProfile, avatarUrl: null })
                  } // Define avatarUrl como null caso a imagem falhe
                />
              ) : (
                <Image
                  source={require("../../assets/images/default-avatar.png")} // Imagem alternativa
                  className="w-full h-full"
                  resizeMode="cover"
                />
              )}
            </View>
            {/* Ícone de Pincel */}
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
              className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
            >
              <Ionicons name="pencil" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text
            className={`text-xl font-semibold ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
          >
            {userProfile.nome} {/* Nome do usuário sem tradução */}
          </Text>
        </View>
      )}

      <View
        className={`mx-4 flex-row items-center rounded-full ${
          isDarkTheme ? "bg-white/10" : "bg-black/5"
        } p-[6px]`}
      >
        <TextInput
          placeholder={t("saved.search_placeholder")} // Tradução para placeholder
          placeholderTextColor={isDarkTheme ? "gray" : "gray"}
          style={{ fontSize: hp(1.7) }}
          className={`flex-1 text-base mb-1 pl-3 tracking-wider ${
            isDarkTheme ? "text-white" : "text-black"
          }`}
          onChangeText={handleSearch}
        />
        <View
          className={`rounded-full p-3 ${
            isDarkTheme ? "bg-stone-800 " : "bg-white"
          }`}
        >
          <MagnifyingGlassIcon
            size={hp(2.5)}
            strokeWidth={3}
            color={isDarkTheme ? "rgb(168 162 158)" : "gray"}
          />
        </View>
      </View>

      <View
        className={`flex-row justify-around border-b mx-4 mt-4 ${
          isDarkTheme ? "border-gray-600" : "border-gray-300"
        }`}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("saved")}
          className="py-2"
        >
          {renderIcon(activeTab)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("created")}
          className="py-2"
        >
          {renderUserIcon(activeTab)}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-1"
      >
        <View>
          {activeTab === "saved" ? (
            <Saved drinks={drinks} />
          ) : (
            <Saved drinks={userDrinks} />
          )}
        </View>
      </ScrollView>
      {activeTab === "created" && (
        <TouchableOpacity
          className="absolute bottom-10 right-5 bg-green-500 rounded-full p-4 shadow-lg mb-5"
          onPress={() => navigation.navigate("CreateDrink")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
