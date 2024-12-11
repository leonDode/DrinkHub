import "react-native-url-polyfill/auto"; // Adiciona o polyfill para compatibilidade com Hermes
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import MyBarScreen from "../screens/MyBarScreen";
import SavedScreen from "../screens/SavedScreen";
import RandomRecipe from "../screens/RandomRecipeScreen";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/login/LoginScreen";
import SignUpScreen from "../screens/login/SignUpScreen";
import CreateDrinkScreen from "../screens/CreateDrinkScreen";
import RatingScreen from "../screens/RatingScreen";
import { AuthContext } from "../contexts/authContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useContext } from "react";
import UserNotAuthScreen from "../screens/UserNotAuth";
import MenuScreen from "../screens/MenuScreen";
import { useTailwind } from "tailwindcss-react-native";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { userToken } = useContext(AuthContext);
  const { isDarkTheme } = useContext(ThemeContext);
  const tailwind = useTailwind();

  const tabBarStyle = {
    backgroundColor: isDarkTheme ? "#1f1f1f" : "#FFFFFF",
    shadowColor: isDarkTheme ? "#FFFFFF" : "#000000",
    borderTopWidth: 0,
    height: 60,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: tabBarStyle,
        tabBarInactiveTintColor: isDarkTheme ? "#A0AEC0" : "#4A5568",
        tabBarActiveTintColor: "rgb(34 197 94)",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={focused ? "rgb(34 197 94)" : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Mybar"
        component={MyBarScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "apps" : "apps-outline"}
              size={size}
              color={focused ? "rgb(34 197 94)" : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={userToken ? SavedScreen : UserNotAuthScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color={focused ? "rgb(34 197 94)" : color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!userToken) {
              e.preventDefault();
              navigation.navigate("UserNotAuthScreen");
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="CreateDrink"
          options={{ presentation: "fullScreenModal" }}
          component={CreateDrinkScreen}
        />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="RecipeDetail"
          options={{ presentation: "fullScreenModal" }}
          component={RecipeDetailScreen}
        />
        <Stack.Screen
          name="RandomRecipe"
          options={{ presentation: "fullScreenModal" }}
          component={RandomRecipe}
        />
        <Stack.Screen
          name="Rating"
          options={{ presentation: "fullScreenModal" }}
          component={RatingScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UserNotAuthScreen" component={UserNotAuthScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
