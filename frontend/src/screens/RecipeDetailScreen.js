import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { CachedImage } from '../helpers/image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ChevronLeftIcon,  TagIcon } from 'react-native-heroicons/outline';
import {  BookmarkIcon, Square3Stack3DIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loading from '../components/loading';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { URL } from '../helpers/url';




export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [drink, setDrinks] = useState(null);
    const [ingredientes, setIngredientes] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(()=>{
        getDrinkData(item.id);
    },[])

    const getDrinkData = async (id)=>{
        try{
          
          const response = await axios.get(`${URL}/${id}`);
          if(response && response.data){
            setDrinks(response.data);
            setIngredientes(response.data.ingredientes);
            setIsFavourite(response.data.salvo)
            setLoading(false);
          }
        }catch(err){
          console.log('error: ',err.message);
        }
    }

    const updateFavouriteStatus = async (id, newStatus) => {
        try {
          const response = await axios.put(`${URL}/${id}`, {
            salvo: newStatus
          });
          if (response.status === 200) {
            setIsFavourite(newStatus);
          }
        } catch (err) {
          console.log('error: ', err.message);
        }
      };






    const ingredientsIndexes = (drink) => {
        if (!drink) return [];
        return drink.ingredientes;
      };

      const tagsIndexes = (drink) => {
        if (!drink) return [];
        return drink.tags;
      };


      const handleChangeFavorite = () => {
        const newStatus = !isFavourite;
        setIsFavourite(newStatus); 
        updateFavouriteStatus(drink.id, newStatus);
      };
                                


  return (
    <View className="flex-1 bg-white relative">
        <StatusBar style={"light"} />
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}
        >
        
        
        <View className="flex-row justify-center">
            <CachedImage
                uri={item.img}
                style={{width: wp(100), height: hp(50),borderBottomLeftRadius: 40, borderBottomRightRadius: 40}}

            />
        </View>

        {/* back button */}
        <Animated.View entering={FadeIn.delay(200).duration(1000)} className="w-full absolute flex-row justify-between items-center pt-14">
            <TouchableOpacity onPress={()=> navigation.goBack()} className="p-2 rounded-full ml-5 bg-white">
                <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangeFavorite} className="p-2 rounded-full mr-5 bg-white">
                <BookmarkIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite? "yellow": "gray"} />
            </TouchableOpacity>
        </Animated.View>

        
        {
            loading? (
                <Loading size="large" className="mt-16" />
            ):(
                <View className="px-4 flex justify-between space-y-4 pt-8">
                   
                    <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} className="space-y-2">
                        <Text style={{fontSize: hp(3)}} className="font-bold flex-1 text-neutral-700">
                            {drink.nome}
                        </Text>
                        
                    </Animated.View>

                    
                    <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} className="flex-row justify-around">
                    {

                                tagsIndexes(drink).map((tags)=>{

                                    return (
                                    <View className='flex rounded-full  p-2' key={tags.id} style={{ backgroundColor: tags.color }}>
                                      <View style={{height: hp(6.5), width: hp(6.5)}} className="bg-white rounded-full flex items-center justify-center">
                                         <TagIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                      </View>
                                      <View className="flex items-center py-2 space-y-1">
                                        <Text style={{fontSize: hp(2)}} className="font-bold text-white">
                                          {tags.nome}
                                        </Text>
                                        <Text style={{fontSize: hp(1.3)}} className="font-bold text-black-700">
                                    
                                        </Text>
                                    </View>
                                    </View>
                        
                                      
                                    )
                                })
                            } 
                        
                        
                        
                        
                        
                    </Animated.View>


                    <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
                        <Text style={{fontSize: hp(2.5)}} className="font-bold flex-1 text-neutral-700">
                        Descricao
                        </Text>
                        <Text style={{fontSize: hp(1.6)}} className="text-neutral-700">
                            {
                                drink?.descricao
                            }
                        </Text>
                    </Animated.View>
                    
                    
                    
                    <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} className="space-y-4">
                        <Text style={{fontSize: hp(2.5)}} className="font-bold flex-1 text-neutral-700">
                            Ingredients
                        </Text>
                        <View className="space-y-2 ml-3">
                            {
                                ingredientsIndexes(drink).map((ingrediente,i)=>{
                                    
                                    return (
                                        
                                        <View key={ingrediente.id} className="flex-row space-x-4">
                                            <View style={{height: hp(1.5), width: hp(1.5)}}
                                                className="bg-amber-300 rounded-full" />
                                            <View className="flex-row space-x-2">
                                                   <Text style={{fontSize: hp(1.7)}} className="font-medium text-neutral-600">{drink['medidas'+i]}</Text>
                                                    <Text style={{fontSize: hp(1.7)}} className="font-extrabold text-neutral-700">de {ingrediente.nome}</Text>
                                                    
                                            </View>
                                        </View>
                                    )
                                })
                            } 
                        </View>
                    </Animated.View>
                    
                    <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
                        <Text style={{fontSize: hp(2.5)}} className="font-bold flex-1 text-neutral-700">
                          instruções
                        </Text>
                        <Text style={{fontSize: hp(1.6)}} className="text-neutral-700">
                            {
                                drink?.instrucoes
                            }
                        </Text>
                    </Animated.View>

                  

                </View>
            )
        }
        </ScrollView>


    </View>
    
  )
}