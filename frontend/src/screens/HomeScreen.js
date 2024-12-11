import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import {
  Bars3Icon,
  ArrowRightEndOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories";
import axios from "axios";
import Recipes from "../components/recipes";
import { URL } from "../helpers/url";
import CheckBox from "react-native-check-box";
import { AuthContext } from "../contexts/authContext";
import { ThemeContext } from "../contexts/ThemeContext"; // Importa o ThemeContext
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const route = useRoute();
  const [activeCategory, setActiveCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [activeIcon, setActiveIcon] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userToken, login, logout, isLoading } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext); // Consome o estado do tema e a função de alternância
  const { t } = useTranslation();

  const isChecked = route.params?.isChecked ?? false;

  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  useEffect(() => {
    getRecipes();
  }, [isChecked]);

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  const handleChangeCategory = (category) => {
    if (category === activeCategory) {
      setActiveCategory(null);
      getRecipes();
    } else {
      setActiveCategory(category);
      getRecipes(category);
    }
    setDrinks([]);
  };

  // listagem de categorias
  const getCategories = async () => {
    try {
      const response = await axios.get(`${URL}/drinks/pesqTag/tags`);
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.log("error:aq ", err.message);
    }
  };

  // listagem de drinks
  const getRecipes = async (category) => {
    try {
      let response;
      if (isChecked) {
        if (category) {
          response = await axios.get(`${URL}/drinks/mybar/${category}`);
        } else {
          console.log("opa");
          response = await axios.get(`${URL}/drinks/pesqMybar/mybar`);
        }
      } else {
        if (category) {
          response = await axios.get(`${URL}/drinks/pesqTag/tags/${category}`);
        } else {
          response = await axios.get(`${URL}/drinks`);
        }
      }

      if (response && response.data) {
        setDrinks(response.data);
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
    if (text === "") {
      getRecipes(activeCategory);
    } else {
      const filteredDrinks = drinks.filter((drink) =>
        drink.nome.toLowerCase().includes(text.toLowerCase())
      );
      setDrinks(filteredDrinks);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    getRecipes();
  };

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View className={`flex-1 ${isDarkTheme ? "bg-black" : "bg-white"}`}>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
        decelerationRate={0.6}
      >
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Text
            style={{ fontSize: hp(3.8) }}
            className={`font-semibold ${
              isDarkTheme ? "text-white" : "text-neutral-600"
            }`}
          >
            <Text className="text-green-600">DrinkHub</Text>
          </Text>

          {/* Botão para abrir o menu de configurações */}
          <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
            <Bars3Icon size={hp(3)} color={isDarkTheme ? "white" : "gray"} />
          </TouchableOpacity>
        </View>

        {/* Barra de busca */}
        <View
          className={`mx-4 flex-row items-center rounded-full p-[6px] ${
            isDarkTheme ? "bg-gray-950" : "bg-black/5"
          }`}
        >
          <TextInput
            placeholder={t("home.search_placeholder")} // Tradução da placeholder
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(1.7) }}
            className={`flex-1 text-base mb-1 pl-3 tracking-wider ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
            onChangeText={handleSearch}
          />
          <View
            className={` rounded-full p-3 ${
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

        {/* Categorias */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/* Receitas */}
        <View>
          <Recipes drinks={drinks} categories={categories} />
        </View>
      </ScrollView>

      {/* Modal de configurações */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {t("home.settings_title")} {/* Título do modal */}
            </Text>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                isChecked={isChecked}
                onClick={handleCheckBoxChange}
                style={styles.checkBox}
              />
              <Text style={styles.label}>
                {t("home.mybar_only")} {/* Texto da opção de MyBar */}
              </Text>
            </View>

            {/* Botão para trocar o tema */}
            <TouchableOpacity onPress={toggleTheme}>
              {isDarkTheme ? (
                <SunIcon size={hp(3)} color="black" />
              ) : (
                <MoonIcon size={hp(3)} color="gray" />
              )}
              <Text style={styles.label}>
                {isDarkTheme ? t("home.light_mode") : t("home.dark_mode")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <ArrowRightEndOnRectangleIcon size={hp(3)} color="red" />
              <Text style={styles.logoutText}>{t("home.logout")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
              <Text style={styles.buttonText}>{t("home.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkBox: {
    marginRight: 10,
  },
  label: {
    fontSize: hp(2),
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: hp(2),
    color: "red",
    fontWeight: "bold",
  },
});
