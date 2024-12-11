import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  LogBox,
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  PlusCircleIcon,
  HomeIcon,
  BookmarkIcon,
  IdentificationIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { URL } from "../helpers/url";
import { ThemeContext } from "../contexts/ThemeContext";

LogBox.ignoreLogs(["ViewPropTypes will be removed from React Native"]);

export default function MyBarScreen() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isDarkTheme } = useContext(ThemeContext);

  const navigation = useNavigation();

  const categoryImages = {
    bitters: require("../../assets/images/bitters.png"),
    destilados: require("../../assets/images/destilados.png"),
    componentes: require("../../assets/images/componentes.png"),
    licores: require("../../assets/images/licores.png"),
    sucos: require("../../assets/images/sucos.png"),
    sodas: require("../../assets/images/sodas.png"),
  };

  useEffect(() => {
    getIngredientes();
  }, []);

  // Listagem de ingredientes
  const getIngredientes = async () => {
    try {
      const response = await axios.get(`${URL}/drinks/pesqIng/ingredientes`);
      if (response && response.data) {
        setItems(response.data);
        extractCategories(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    }
  };

  // Obtem as categorias
  const extractCategories = (ingredientes) => {
    const listCategorias = [
      ...new Set(ingredientes.map((item) => item.categoria)),
    ];
    setCategories(listCategorias);
  };

  const filterByCategory = (categoria) => {
    const filteredItems = items.filter((item) => item.categoria === categoria);
    setSelectedCategory(categoria);
    setItems(filteredItems);
  };

  // Salva o item
  const handleSaveItem = async (item) => {
    try {
      const updatedItem = { salvo: !item.salvo };
      const response = await axios.put(
        `${URL}/drinks/ingredientes/${item.id}`,
        updatedItem
      );
      if (response && response.data) {
        setItems((prevItems) =>
          prevItems.map((i) => (i.id === item.id ? response.data : i))
        );
      }
    } catch (error) {
      console.error("Erro ao salvar item:", error);
    }
  };

  // Renderizacao dos cards de categoria
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      className={`flex-1 items-center m-2 p-4 rounded-lg shadow-lg ${
        isDarkTheme ? "bg-gray-800" : "bg-gray-100"
      }`}
      onPress={() => filterByCategory(item)}
      style={{
        width: wp(45),
        height: hp(25),
      }}
    >
      <Image
        source={
          categoryImages[item] || require("../../assets/images/destilados.png")
        }
        style={{ width: wp(40), height: hp(18), resizeMode: "cover" }}
      />
      <Text
        className={`text-center mt-2 ${
          isDarkTheme ? "text-white" : "text-black"
        }`}
        style={{ fontSize: hp(2.5) }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Renderizacao dos ingredientes de cada categoria
  const renderItem = ({ item }) => (
    <View
      className={`flex-1 items-center m-2 p-4 rounded-lg shadow-lg ${
        isDarkTheme ? "bg-gray-800" : "bg-white"
      }`}
    >
      <Image
        source={{ uri: item.img_ingrediente }}
        style={{ width: wp(24), height: hp(15), resizeMode: "contain" }}
      />
      <View
        className="mt-2 items-center"
        style={{ height: hp(10), justifyContent: "space-between" }}
      >
        <Text
          className={`mt-2 text-center ${
            isDarkTheme ? "text-white" : "text-black"
          }`}
          style={{ fontSize: hp(1.5) }}
        >
          {item.nome}
        </Text>
        <TouchableOpacity
          className={`mt-2 w-8 h-8 rounded-full items-center justify-center ${
            isDarkTheme ? "bg-gray-700" : "bg-white"
          }`}
          onPress={() => handleSaveItem(item)}
        >
          {item.salvo ? (
            <CheckCircleIcon size={hp(3)} color="green" />
          ) : (
            <PlusCircleIcon
              size={hp(3)}
              color={isDarkTheme ? "#fff" : "black"}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleBack = () => {
    setSelectedCategory(null);
    getIngredientes();
  };

  return (
    // Header
    <View className={`flex-1 ${isDarkTheme ? "bg-black" : "bg-white"}`}>
      <View
        className={`p-4 border-b  ${
          isDarkTheme
            ? "bg-black border-slate-900	 "
            : "bg-white border-gray-200"
        }`}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {selectedCategory && (
          <TouchableOpacity
            onPress={handleBack}
            style={{
              position: "absolute",
              left: 10,
              bottom: 20,
              marginRight: 10,
            }}
          >
            <ArrowLeftIcon
              size={hp(3)}
              color={isDarkTheme ? "#fff" : "black"}
            />
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontSize: hp(3),
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
            marginTop: hp(2),
            color: isDarkTheme ? "#fff" : "#000",
          }}
        >
          Meu Bar
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 10, bottom: 20 }}
        >
          <IdentificationIcon
            size={hp(3)}
            color={isDarkTheme ? "#fff" : "black"}
          />
        </TouchableOpacity>
      </View>
      {/* Card de categorias */}
      {selectedCategory ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{ padding: 2 }}
          key={selectedCategory}
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={{ padding: 2 }}
          key="categories"
        />
      )}
    </View>
  );
}
