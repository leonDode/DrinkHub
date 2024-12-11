import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  const navigation = useNavigation();

  useEffect(() => {
    ring2padding.value = 0;
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
      300
    );
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token && token !== null) {
          navigation.navigate("Main");
        } else if (token === null) {
          navigation.navigate("Login");
        }
      } catch (error) {
        console.log("Erro ao verificar o token:", error);
        navigation.navigate("Login");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-green-500">
      <StatusBar style="light" />

      <Animated.View
        className="bg-white/20 rounded-full"
        style={{ padding: ring2padding }}
      >
        <Animated.View>
          <Image
            source={require("../../assets/images/drinkhub.png")}
            style={{ width: hp(20), height: hp(20) }}
            className=""
          />
        </Animated.View>
      </Animated.View>

      <View className="flex items-center space-y-2">
        <Text
          style={{ fontSize: hp(7) }}
          className="font-bold text-white tracking-widest"
        >
          DrinkHub
        </Text>
      </View>
    </View>
  );
}
