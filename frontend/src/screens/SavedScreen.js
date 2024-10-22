import { View, Text, ScrollView, Image, TextInput } from 'react-native'
import React, { useEffect, useState ,useContext } from 'react'
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
import {Ionicons}from'@expo/vector-icons'
import { AuthContext } from '../contexts/authContext';
import tw from 'tailwind-react-native-classnames'; 


export default function SavedScreen() {
  const [drinks, setDrinks] = useState([]);
  const [userDrinks, setUserDrinks] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('saved'); // Para controlar a aba ativa
  const { userId } = useContext(AuthContext);

  
  const navigation = useNavigation();

  useEffect(()=>{
    getSavedRecipes();
    getUserRecipes();
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
  
  const getUserRecipes = async () => {
    try {
      const response = await axios.get(`${URL}/user/${userId}`);
      if (response && response.data) {
        setUserDrinks(response.data);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };


  const handleSearch = (text) => {
    setSearchQuery(text);
    filterRecipes(text);
  };

  const filterRecipes = (text) => {
    if (activeTab === 'saved') {
      if (text === '') {
        getSavedRecipes();
      } else {
        const filteredDrinks = drinks.filter(drink =>
          drink.nome.toLowerCase().includes(text.toLowerCase())
        );
        setDrinks(filteredDrinks);
      }
    } else {
      if (text === '') {
        getUserRecipes();
      } else {
        const filteredUserDrinks = userDrinks.filter(drink =>
          drink.nome.toLowerCase().includes(text.toLowerCase())
        );
        setUserDrinks(filteredUserDrinks);
      }
    }
  };

  const renderIcon = (tab) => {
    if (tab === 'saved') {
      return <Ionicons name='bookmark' size={24} color='rgb(34 197 94)'/>
    }
    return <Ionicons name='bookmark-outline' size={24} color='gray'/>
  };

  const renderUserIcon = (tab) => {
    if (tab === 'created') {
      return <Ionicons name='person' size={24} color='rgb(34 197 94)'/>
    }
    return <Ionicons name='person-outline' size={24} color='gray'/>
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-center px-4 py-10 bg-white-500">
        <TouchableOpacity>
         
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">Meus Drinks</Text>
      </View>

     
      <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
        <TextInput
          placeholder='Search any recipe'
          placeholderTextColor={'gray'}
          style={{ fontSize: hp(1.7) }}
          className="flex-1 text-base mb-1 pl-3 tracking-wider"
          onChangeText={handleSearch}
        />
        <View className="bg-white rounded-full p-3">
          <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
        </View>
      </View>

  
      <View className="flex-row justify-around border-b  border-gray-300 mx-4 mt-4">
      <TouchableOpacity onPress={() => setActiveTab('saved')} className="py-2">
          {renderIcon(activeTab)}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('created')} className="py-2">
          {renderUserIcon(activeTab)}
        </TouchableOpacity>
      </View>

     
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-1"
      >
        <View>
          {activeTab === 'saved' ? (
            <Saved drinks={drinks} /> 
          ) : (
            <Saved drinks={userDrinks} /> 
          )}
        </View>
      </ScrollView>
      {activeTab === 'created' && (
        <TouchableOpacity
          style={tw`absolute bottom-10 right-5 bg-green-500 rounded-full p-4 shadow-lg mb-5`}
          onPress={() => navigation.navigate('CreateDrink')} 
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
  
  
}
