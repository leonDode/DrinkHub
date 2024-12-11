import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/outline";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../contexts/authContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function MenuScreen() {
  const { logout } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [language, setLanguage] = useState("pt-BR");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isUnitDropdownVisible, setIsUnitDropdownVisible] = useState(false);
  const [unit, setUnit] = useState("ml");

  const navigation = useNavigation();

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedChecked = await AsyncStorage.getItem("isChecked");
        const savedLanguage = await AsyncStorage.getItem("appLanguage");
        const savedUnit = await AsyncStorage.getItem("unitPreference");

        if (savedChecked !== null) setIsChecked(JSON.parse(savedChecked));
        if (savedLanguage) {
          setLanguage(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
        if (savedUnit) setUnit(savedUnit);
      } catch (error) {
        console.error("Erro ao carregar preferências", error);
      }
    };

    loadPreferences();
  }, []);

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  const savePreference = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Erro ao salvar ${key}`, error);
    }
  };

  const toggleChecked = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    savePreference("isChecked", JSON.stringify(newValue));
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    savePreference("appLanguage", lang);
    setIsDropdownVisible(false);
  };

  const selectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    savePreference("unitPreference", selectedUnit);
    setIsUnitDropdownVisible(false);
  };

  return (
    <View
      className={`flex-1 px-5 py-6 ${isDarkTheme ? "bg-black" : "bg-white"}`}
    >
      <View
        className={`flex-row justify-between items-center border-b mt-10 ${
          isDarkTheme ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <Text
          className={`text-lg ${isDarkTheme ? "text-white" : "text-black"}`}
        >
          {t("menu.mybar")}
        </Text>
        <Switch
          value={isChecked}
          onValueChange={toggleChecked}
          className="transform scale-75"
        />
      </View>

      <View
        className={`flex-row justify-between items-center border-b py-3 ${
          isDarkTheme ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <Text
          className={`text-lg ${isDarkTheme ? "text-white" : "text-black"}`}
        >
          {t("menu.dark_mode")}
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
          className="transform scale-75"
        />
      </View>

      <View
        className={`border-b py-4 ${
          isDarkTheme ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-lg ${isDarkTheme ? "text-white" : "text-black"}`}
          >
            {t("menu.change_language")}
          </Text>
          <View className="relative flex-row items-center">
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              className="flex-row items-center"
            >
              <Text
                className={`text-lg mr-2 ${
                  isDarkTheme ? "text-green-400" : "text-green-600"
                }`}
              >
                {language === "pt-BR" ? "Português" : "English"}
              </Text>
              {isDropdownVisible ? (
                <ChevronUpIcon
                  size={20}
                  color={isDarkTheme ? "white" : "black"}
                />
              ) : (
                <ChevronDownIcon
                  size={20}
                  color={isDarkTheme ? "white" : "black"}
                />
              )}
            </TouchableOpacity>

            {isDropdownVisible && (
              <View
                className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
                  isDarkTheme ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <TouchableOpacity
                  onPress={() => selectLanguage("pt-BR")}
                  className={`py-2 px-4 ${
                    language === "pt-BR"
                      ? "bg-green-500"
                      : isDarkTheme
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      language === "pt-BR"
                        ? "text-white"
                        : isDarkTheme
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Português
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectLanguage("en")}
                  className={`py-2 px-4 ${
                    language === "en"
                      ? "bg-green-500"
                      : isDarkTheme
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      language === "en"
                        ? "text-white"
                        : isDarkTheme
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    English
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View
        className={`border-b py-4 ${
          isDarkTheme ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-lg ${isDarkTheme ? "text-white" : "text-black"}`}
          >
            {t("menu.change_unit")}
          </Text>
          <View className="relative flex-row items-center">
            <TouchableOpacity
              onPress={() => setIsUnitDropdownVisible(!isUnitDropdownVisible)}
              className="flex-row items-center"
            >
              <Text
                className={`text-lg mr-2 ${
                  isDarkTheme ? "text-green-400" : "text-green-600"
                }`}
              >
                {unit === "ml" ? "Mililitros (ml)" : "Onças (oz)"}
              </Text>
              {isUnitDropdownVisible ? (
                <ChevronUpIcon
                  size={20}
                  color={isDarkTheme ? "white" : "black"}
                />
              ) : (
                <ChevronDownIcon
                  size={20}
                  color={isDarkTheme ? "white" : "black"}
                />
              )}
            </TouchableOpacity>

            {isUnitDropdownVisible && (
              <View
                className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
                  isDarkTheme ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <TouchableOpacity
                  onPress={() => selectUnit("ml")}
                  className={`py-2 px-4 ${
                    unit === "ml"
                      ? "bg-green-500"
                      : isDarkTheme
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      unit === "ml"
                        ? "text-white"
                        : isDarkTheme
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Mililitros (ml)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectUnit("oz")}
                  className={`py-2 px-4 ${
                    unit === "oz"
                      ? "bg-green-500"
                      : isDarkTheme
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      unit === "oz"
                        ? "text-white"
                        : isDarkTheme
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Onças (oz)
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className={`flex-row justify-between items-center border-b py-4 ${
          isDarkTheme ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <Text
          className={`text-lg ${isDarkTheme ? "text-white" : "text-black"}`}
        >
          Sair
        </Text>
        <ArrowLeftOnRectangleIcon size={hp(3)} color={"red"} />
      </TouchableOpacity>
    </View>
  );
}
