import React, { useState, useContext, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { URL } from "../helpers/url";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";
import { ThemeContext } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next"; // Importa o hook de tradução

export default function RatingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { drinkId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { userId } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const usuarioId = parseInt(userId, 10);
  const { isDarkTheme } = useContext(ThemeContext);
  const { t } = useTranslation(); // Hook de tradução

  const getRating = async () => {
    try {
      const response = await fetch(
        `${URL}/drinks/avaliacoes/${userId}/${drinkId}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setRating(data[0].nota);
        setComment(data[0].comentario);
      }
    } catch (error) {
      console.error(t("rating.error_fetch_rating"), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRating();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${URL}/drinks/avaliacoes`,
        {
          nota: rating,
          usuarioId: usuarioId,
          drinkId: drinkId,
          comentario: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(t("rating.success_title"), t("rating.success_message"));
      } else {
        Alert.alert(t("rating.error_title"), t("rating.error_message"));
      }
    } catch (error) {
      if (error.response) {
        console.error(t("rating.error_submit"), error.response.status);
        Alert.alert(
          t("rating.error_title"),
          `${t("rating.error_code")}: ${error.response.status}`
        );
      } else {
        console.error(t("rating.error_submit"), error.message);
        Alert.alert(t("rating.error_title"), t("rating.generic_error"));
      }
    }
  };

  const StarRating = ({ rating, onPress }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onPress(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={40}
              color="gold"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View
      className={`flex-1 ${
        isDarkTheme ? "bg-black" : "bg-white"
      } p-5 justify-center`}
    >
      {/* Botão "X" para voltar */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 1,
        }}
        onPress={() => navigation.goBack()} // Retorna para a página anterior
      >
        <Ionicons
          name="close"
          size={30}
          color={isDarkTheme ? "white" : "black"}
        />
      </TouchableOpacity>

      <Text
        className={`text-center text-2xl mb-5 ${
          isDarkTheme ? "text-white" : "text-black"
        }`}
      >
        {t("rating.title")}
      </Text>
      <StarRating rating={rating} onPress={setRating} isDarkTheme={isDarkTheme} />
      <TextInput
        className={`p-4 rounded-md mb-5 h-[200] ${
          isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
        }`}
        placeholder={t("rating.comment_placeholder")}
        placeholderTextColor={isDarkTheme ? "gray" : "darkgray"}
        multiline
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity
        className={`py-4 rounded-md ${
          isDarkTheme ? "bg-green-800" : "bg-green-600"
        }`}
        onPress={handleSubmit}
      >
        <Text className="text-white text-center text-lg">
          {t("rating.submit")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
