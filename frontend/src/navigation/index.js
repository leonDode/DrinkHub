import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import MyBarScreen from '../screens/MyBarScreen';
import SavedScreen from '../screens/SavedScreen';
import RandomRecipe from '../screens/RandomRecipeScreen';

const Stack = createNativeStackNavigator();





// mecanismo de navegacao entre as telas
function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RecipeDetail" options={{presentation: 'fullScreenModal'}} component={RecipeDetailScreen} />
        <Stack.Screen name="RandomRecipe" options={{presentation: 'fullScreenModal'}} component={RandomRecipe} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="MyBar" component={MyBarScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;