import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import MyBarScreen from '../screens/MyBarScreen';
import SavedScreen from '../screens/SavedScreen';
import RandomRecipe from '../screens/RandomRecipeScreen';
import {Ionicons}from'@expo/vector-icons'
import LoginScreen from '../screens/login/LoginScreen';
import SignUpScreen from '../screens/login/SignUpScreen';
import { useColorScheme } from 'react-native';
import CreateDrinkScreen from '../screens/CreateDrinkScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs() {
  const scheme = useColorScheme();




  return (
    <Tab.Navigator 
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle:{
      position: 'absolute',
      backgroundColor:"white",
      borderTopWidth:0,
      height:50,
        


      shadowColor: "black",
      shadowOffset: { width: 0, height: -4},
      shadowOpacity: 0.3,
      shadowRadius: 10,
     elevation: 10, 
      }
    }}>
      <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{
        headerShown: false,
        tabBarIcon:({color,size,focused}) =>{
          if(focused){
            return <Ionicons name='home' size={size} color='rgb(34 197 94)'/>
          }
          return <Ionicons name='home-outline' size={size} color={color}/>
        }
      }}
      />
      <Tab.Screen 
      name="Mybar" 
      component={MyBarScreen}
      options={{
        headerShown: false,
        tabBarIcon:({color,size,focused}) =>{
          if(focused){
            return <Ionicons name='apps' size={size} color='rgb(34 197 94)'/>
          }
          return <Ionicons name='apps-outline' size={size} color={color}/>
        }
      }}
       />
      <Tab.Screen 
      name="Saved"
       component={SavedScreen}
       options={{
        headerShown: false,
        tabBarIcon:({color,size,focused}) =>{
          if(focused){
            return <Ionicons name='bookmark' size={size} color='rgb(34 197 94)'/>
          }
          return <Ionicons name='bookmark-outline' size={size} color={color}/>
        }
      }}
       />
    </Tab.Navigator>
  );
}





// mecanismo de navegacao entre as telas
function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="CreateDrink" options={{presentation: 'fullScreenModal'}} component={CreateDrinkScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="RecipeDetail" options={{presentation: 'fullScreenModal'}} component={RecipeDetailScreen} />
        <Stack.Screen name="RandomRecipe" options={{presentation: 'fullScreenModal'}} component={RandomRecipe} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;