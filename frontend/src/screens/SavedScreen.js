import { View, Text, ScrollView, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import {  HomeIcon, BookmarkIcon,IdentificationIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar'
import {  BookmarkIcon as SolidBook } from 'react-native-heroicons/solid';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Cog8ToothIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import axios from 'axios';
import Saved from '../components/saved';
import { URL } from '../helpers/url';



export default function SavedScreen() {
  const [drinks, setDrinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  
  const navigation = useNavigation();

  useEffect(()=>{
    getSavedRecipes();
  },[])


  const getSavedRecipes = async ()=>{
    try{
      const response = await axios.get(URL+`/salvos`);
       //console.log('got recipes: ',response.data);
      if(response && response.data){
        setDrinks(response.data);
      }
    }catch(err){
      console.log('error: ',err.message);
    }
  }


  const handleSearch = (text) => {
    setSearchQuery(text);
    filterRecipes(text);
  };

  const filterRecipes = (text) => {
    if (text === '') {
      getSavedRecipes();
    } else {
      const filteredDrinks = drinks.filter(drink =>
        drink.nome.toLowerCase().includes(text.toLowerCase())
      );
      setDrinks(filteredDrinks);
    }
  };




  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-10 bg-white-500">
        <TouchableOpacity>
          
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">Drinks Salvos</Text>
        <SolidBook size={hp(3)} color="black" />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-1"
      >
       


        {/* search bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder='Search any recipe'
            placeholderTextColor={'gray'}
            style={{fontSize: hp(1.7)}}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
            onChangeText={handleSearch}
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>

       
        

        
        <View>
        <Saved drinks={drinks}  /> 
        </View>
      </ScrollView>
      <View className="flex-row justify-around items-center p-4 bg-white border-t border-gray-200">

        <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
           <HomeIcon size={hp(3)} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigation.navigate('MyBar')}>
          <IdentificationIcon size={hp(3)} color="gray"></IdentificationIcon>
        </TouchableOpacity>

        <TouchableOpacity >
         <BookmarkIcon size={hp(3)} color="black"  />

        </TouchableOpacity>
        
      </View >
      
   
    </View>
  )


  
}
