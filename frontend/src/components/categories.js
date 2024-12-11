import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useContext } from "react";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CachedImage } from "../helpers/image";
import { ThemeContext } from "../contexts/ThemeContext"; // Importa o ThemeContext
import { useTranslation } from "react-i18next"; // Importa o hook de tradução

export default function Categories({
  categories,
  activeCategory,
  handleChangeCategory,
}) {
  const { isDarkTheme } = useContext(ThemeContext); // Consome o estado do tema
  const { t } = useTranslation(); // Hook de tradução

  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {categories.map((cat, index) => {
          let isActive = cat.nome == activeCategory;
          let activeButtonClass = isActive
            ? isDarkTheme
              ? "bg-stone-400" // cor para o tema escuro e ativo
              : "bg-lime-100" // cor para o tema claro e ativo
            : isDarkTheme
            ? "bg-stone-800" // cor para o tema escuro e inativo
            : "bg-black/10"; // cor para o tema claro e inativo
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(cat.nome)}
              className="flex items-center space-y-1"
            >
              <View className={"rounded-full p-[6px] " + activeButtonClass}>
                <CachedImage
                  uri={cat.imgTag}
                  style={{ width: hp(6), height: hp(6) }}
                  className="rounded-full"
                />
              </View>
              <Text
                className={isDarkTheme ? "text-white" : "text-black-800"}
                style={{ fontSize: hp(1.6) }}
              >
                {t(`categories.${cat.nome}`)} {/* Tradução da categoria */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
