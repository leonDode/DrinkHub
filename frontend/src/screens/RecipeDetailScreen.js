import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../helpers/image";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  CheckBadgeIcon,
  ChevronLeftIcon,
  HomeIcon,
  TagIcon,
} from "react-native-heroicons/outline";
import {
  BookmarkIcon,
  Square3Stack3DIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/loading";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { URL } from "../helpers/url";
import { Rating } from "react-native-stock-star-rating";
import { AuthContext } from "../contexts/authContext";
import { ThemeContext } from "../contexts/ThemeContext";

export default function RecipeDetailScreen(props) {
  let item = props.route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const navigation = useNavigation();
  const [drink, setDrinks] = useState(null);
  const [ingredientes, setIngredientes] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [notas, setNotas] = useState(0);
  const [unit, setUnit] = useState("ml");
  const { userId } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const loadPreferencesAndData = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem("unitPreference");
        if (savedUnit) setUnit(savedUnit); // Sincroniza a unidade com o AsyncStorage
        await loadData();
      } catch (error) {
        console.error("Erro ao carregar preferências e dados:", error);
      }
    };

    loadPreferencesAndData();

    const unsubscribe = navigation.addListener("focus", loadPreferencesAndData);
    return unsubscribe; // Limpa o listener ao desmontar
  }, [navigation]);

  const loadData = async () => {
    try {
      const drinkData = await AsyncStorage.getItem(`drink_${item.id}`);
      const avaliacoesData = await AsyncStorage.getItem(
        `avaliacoes_${item.id}`
      );
      const notasData = await AsyncStorage.getItem(`notas_${item.id}`);

      if (drinkData && avaliacoesData && notasData) {
        // Se os dados existirem no AsyncStorage, usa-os
        setDrinks(JSON.parse(drinkData));
        setIngredientes(JSON.parse(drinkData).ingredientes);
        setUser(JSON.parse(drinkData).usuario);
        setIsFavourite(await checkIfFavourite(item.id));
        setAvaliacoes(JSON.parse(avaliacoesData));
        setNotas(JSON.parse(notasData));
        setLoading(false);
      } else {
        // Se não existirem, busca da API e salva no AsyncStorage
        await getDrinkData(item.id);
        await getAvalData(item.id);
        await getNotas(item.id);
      }
    } catch (error) {
      console.log("Erro ao carregar dados: ", error.message);
    }
  };
  const getDrinkData = async (id) => {
    try {
      const response = await axios.get(`${URL}/drinks/${id}`);
      if (response && response.data) {
        setDrinks(response.data);
        setIngredientes(response.data.ingredientes);
        setUser(response.data.usuario);
        setLoading(false);
        // Armazena os dados no AsyncStorage
        await AsyncStorage.setItem(
          `drink_${id}`,
          JSON.stringify(response.data)
        );
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const getAvalData = async (id) => {
    try {
      const response = await axios.get(`${URL}/drinks/avaliacoes/${id}`);
      if (response && response.data) {
        setAvaliacoes(response.data);
        // Armazena as avaliações no AsyncStorage
        await AsyncStorage.setItem(
          `avaliacoes_${id}`,
          JSON.stringify(response.data)
        );
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const getNotas = async (id) => {
    try {
      const response = await axios.get(`${URL}/drinks/media/${id}`);
      if (response && response.data) {
        setNotas(response.data);
        // Armazena as notas no AsyncStorage
        await AsyncStorage.setItem(
          `notas_${id}`,
          JSON.stringify(response.data)
        );
      }
    } catch (err) {
      console.log("error: ao tentar obter notas", err.message);
    }
  };

  const handleFavouriteToggle = async () => {
    if (!userId) {
      Alert.alert("Login Necessário", "Faça login para salvar esta receita.");
      return;
    }

    const newStatus = !isFavourite;
    setIsFavourite(newStatus);

    try {
      const key = `favourites_${userId}`; // Chave única para o usuário
      let favourites = await AsyncStorage.getItem(key);
      favourites = favourites ? JSON.parse(favourites) : [];

      if (newStatus) {
        favourites.push(drink);
      } else {
        favourites = favourites.filter((fav) => fav.id !== drink.id);
      }

      await AsyncStorage.setItem(key, JSON.stringify(favourites));
    } catch (err) {
      console.log("Erro ao salvar favoritos no AsyncStorage:", err.message);
    }
  };

  const checkIfFavourite = async (id) => {
    if (!userId) return false; // Se não houver um usuário logado, não é favorito

    try {
      const key = `favourites_${userId}`; // Chave única para o usuário
      let favourites = await AsyncStorage.getItem(key);
      favourites = favourites ? JSON.parse(favourites) : [];
      return favourites.some((fav) => fav.id === id);
    } catch (err) {
      console.log("Erro ao verificar favoritos:", err.message);
      return false;
    }
  };

  const convertValue = (value, fromUnit, toUnit) => {
    const factor = 30; // 1 oz = 30 ml

    const fractionalConversion = (val) => {
      const fractions = [
        { fraction: "1/4", value: 0.25 },
        { fraction: "1/3", value: 0.33 },
        { fraction: "1/2", value: 0.5 },
        { fraction: "2/3", value: 0.66 },
        { fraction: "3/4", value: 0.75 },
      ];
      for (let i = fractions.length - 1; i >= 0; i--) {
        if (val >= fractions[i].value) {
          return fractions[i].fraction;
        }
      }
      return "1"; // Default to 1 if no match
    };

    if (fromUnit === "ml" && toUnit === "oz") {
      const ounces = value / factor;
      const wholeOunces = Math.floor(ounces);
      const fractionalPart = ounces - wholeOunces;
      const fractionalText =
        fractionalPart > 0 ? ` ${fractionalConversion(fractionalPart)}` : "";
      return `${wholeOunces}${fractionalText} oz`;
    }
    if (fromUnit === "oz" && toUnit === "ml") {
      return Math.round(value * factor) + " ml";
    }
    return value + " " + fromUnit;
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "ml" ? "oz" : "ml"));
  };

  const ingredientsIndexes = (drink) => {
    if (!drink) return [];
    return drink.ingredientes;
  };

  const tagsIndexes = (drink) => {
    if (!drink) return [];
    return drink.tags;
  };

  return (
    <View
      className={`flex-1 ${isDarkTheme ? "bg-black" : "bg-white"} relative`}
    >
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="flex-row justify-center">
          <CachedImage
            uri={item.img}
            style={{
              width: wp(100),
              height: hp(50),
            }}
          />
        </View>

        {/* back button */}
        <Animated.View
          entering={FadeIn.delay(200).duration(1000)}
          className="w-full absolute flex-row justify-between items-center pt-14"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`p-2 rounded-full ml-5 ${
              isDarkTheme ? "bg-gray-800" : "bg-white"
            }`}
          >
            <ChevronLeftIcon
              size={hp(3.5)}
              strokeWidth={4.5}
              color={isDarkTheme ? "#fbbf24" : "#fbbf24"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFavouriteToggle}
            className={`p-2 rounded-full mr-5 ${
              isDarkTheme ? "bg-gray-800" : "bg-white"
            }`}
          >
            <BookmarkIcon
              size={hp(3.5)}
              strokeWidth={4.5}
              color={isFavourite ? "yellow" : isDarkTheme ? "white" : "gray"}
            />
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <Loading size="large" className="mt-16" />
        ) : (
          <View className="px-3 flex justify-between space-y-4 pt-3">
            <Animated.View
              entering={FadeInDown.duration(700).springify().damping(12)}
              className="flex-row items-center justify-between p-3 rounded-lg" // Diminuí o padding
              style={{
                backgroundColor: isDarkTheme ? "#1E1E1E" : "#FFFFFF",
                shadowColor: isDarkTheme ? "#000" : "#333", // Cor da sombra
                shadowOffset: { width: 0, height: 2 }, // Deslocamento vertical para baixo
                shadowOpacity: 0.2, // Opacidade da sombra
                shadowRadius: 1, // Raio da sombra
                elevation: 1, // Elevação para Android
                height: hp(7), // Defini uma altura fixa menor para o container
              }}
            >
              {user?.nome ? (
                <>
                  <CachedImage
                    uri={user.avatarUrl}
                    style={{
                      width: wp(7),
                      height: hp(5),
                    }}
                  />

                  <Text
                    style={{
                      fontSize: hp(2),
                      paddingHorizontal: 10,
                      textAlignVertical: "center",
                    }}
                    className={`font-bold flex-1 text-base rounded-lg h-10 pl-10 ${
                      isDarkTheme ? "text-white" : "text-neutral-700"
                    }`}
                  >
                    {user.nome}
                  </Text>
                </>
              ) : (
                <>
                  <View
                    style={{
                      backgroundColor: "rgb(22 163 74)",
                      borderRadius: hp(1.5),
                      padding: hp(0.5),
                    }}
                  >
                    <Image
                      source={require("../../assets/images/drinkhub.png")}
                      style={{ width: hp(3), height: hp(3) }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: hp(2),
                      paddingHorizontal: 10,
                      textAlignVertical: "center",
                    }}
                    className={`font-bold flex-1 text-base rounded-lg h-10 ${
                      isDarkTheme ? "text-white" : "text-neutral-700"
                    }`}
                  >
                    DrinkHub
                  </Text>
                  <CheckBadgeIcon size={hp(2.5)} color="rgb(94 234 212)" />
                </>
              )}
            </Animated.View>
            <Animated.View
              entering={FadeInDown.duration(700).springify().damping(12)}
              className="space-y-2 flex-row justify-between items-center"
            >
              <Text
                style={{ fontSize: hp(3) }}
                className={`font-bold flex-1 ${
                  isDarkTheme ? "text-white" : "text-neutral-700"
                }`}
              >
                {drink.nome}
              </Text>
              <Rating maxStars={5} size={27} stars={notas.media} />
              <Text style={{ fontSize: hp(1.7) }} className="text-amber-300">
                ({notas.total})
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(100)
                .duration(700)
                .springify()
                .damping(12)}
              className="flex-row justify-around"
            >
              {tagsIndexes(drink).map((tags) => {
                return (
                  <View
                    className="flex rounded-full border items-center justify-center" // Centraliza o conteúdo no eixo Y e X
                    key={tags.id}
                    style={{
                      borderColor: tags.color,
                      paddingHorizontal: 10, // Espaçamento horizontal
                      paddingVertical: 5, // Espaçamento vertical
                      alignItems: "center",
                      justifyContent: "center",
                      width: hp(15),
                      height: hp(5),
                    }}
                  >
                    <Text
                      style={{ fontSize: hp(1.7), color: tags.color }}
                      className="font-extrabold"
                    >
                      {tags.nome.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(300)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4"
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className={`font-bold flex-1 ${
                  isDarkTheme ? "text-white" : "text-neutral-700"
                }`}
              >
                Descrição
              </Text>
              <Text
                style={{ fontSize: hp(1.6) }}
                className={`$$$${
                  isDarkTheme ? "text-gray-300" : "text-neutral-700"
                }`}
              >
                {drink?.descricao}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(200)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4"
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className={`font-bold flex-1 ${
                  isDarkTheme ? "text-white" : "text-neutral-700"
                }`}
              >
                Ingredientes
              </Text>
              <View className="space-y-2 ml-3">
                {Object.keys(drink)
                  .filter((key) => key.startsWith("medidas"))
                  .map((key, index) => {
                    const medida = drink[key];
                    if (!medida) return null;

                    const [value, unitType] = medida.split(" ");
                    const convertedValue =
                      unitType === "ml"
                        ? convertValue(parseFloat(value), "ml", unit)
                        : medida;

                    return (
                      <View key={index} className="flex-row space-x-4">
                        <View
                          style={{ height: hp(1.5), width: hp(1.5) }}
                          className="bg-amber-300 rounded-full"
                        />
                        <View className="flex-row space-x-2">
                          <Text
                            style={{ fontSize: hp(1.7) }}
                            className={`font-medium ${
                              isDarkTheme ? "text-gray-300" : "text-neutral-600"
                            }`}
                          >
                            {convertedValue}
                          </Text>
                          <Text
                            style={{ fontSize: hp(1.7) }}
                            className={`font-extrabold ${
                              isDarkTheme ? "text-white" : "text-neutral-700"
                            }`}
                          >
                            de{" "}
                            {ingredientes[index]?.nome ||
                              "ingrediente desconhecido"}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(300)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4"
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className={`font-bold flex-1 ${
                  isDarkTheme ? "text-white" : "text-neutral-700"
                }`}
              >
                Instruções
              </Text>
              <Text
                style={{ fontSize: hp(1.6) }}
                className={`$${
                  isDarkTheme ? "text-gray-300" : "text-neutral-700"
                }`}
              >
                {drink?.instrucoes}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(300)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4 items-center"
            >
              <TouchableOpacity
                onPress={() => {
                  if (!userId) {
                    Alert.alert(
                      "Login Necessário",
                      "É necessário fazer login para avaliar a receita."
                    );
                  } else {
                    navigation.push("Rating", { drinkId: item.id });
                  }
                }}
              >
                <Text
                  className={`text-xl font-bold text-center ${
                    isDarkTheme ? "text-white" : "text-black"
                  }`}
                >
                  Avalie este drink!
                </Text>
                <Rating maxStars={5} size={40} stars={0} />
              </TouchableOpacity>
            </Animated.View>
            {avaliacoes.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(300)
                  .duration(700)
                  .springify()
                  .damping(12)}
                className="space-y-4"
              >
                <Text
                  style={{ fontSize: hp(2.5) }}
                  className={`font-bold flex-1 ${
                    isDarkTheme ? "text-white" : "text-neutral-700"
                  }`}
                >
                  Avaliações dos Usuários
                </Text>
                {avaliacoes.map((avaliacao) => (
                  <View
                    key={avaliacao.id}
                    className={`flex-row items-start space-x-3 py-3 ${
                      isDarkTheme ? "border-gray-600" : "border-gray-300"
                    } border-b`}
                  >
                    <UserIcon
                      size={hp(3)}
                      color={isDarkTheme ? "white" : "black"}
                    />
                    <View className="flex-1">
                      <Text
                        style={{ fontSize: hp(2) }}
                        className={`font-bold ${
                          isDarkTheme ? "text-white" : "text-neutral-700"
                        }`}
                      >
                        {avaliacao.nomeUsuario}
                      </Text>
                      <Rating
                        maxStars={5}
                        size={20}
                        stars={avaliacao.nota}
                        color={isDarkTheme ? "yellow" : "orange"}
                      />
                      <Text
                        style={{ fontSize: hp(1.6) }}
                        className={`${
                          isDarkTheme ? "text-gray-300" : "text-neutral-700"
                        }`}
                      >
                        {avaliacao.comentario}
                      </Text>
                    </View>
                  </View>
                ))}
              </Animated.View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
