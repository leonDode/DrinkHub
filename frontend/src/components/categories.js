import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CachedImage } from '../helpers/image';

export default function Categories({categories, activeCategory, handleChangeCategory}) {
  return (
    // gera o icone clicavel para cada tag de drinks
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{paddingHorizontal: 15}}
      >
        {
            categories.map((cat, index)=>{
                let isActive = cat.nome==activeCategory;
                let activeButtonClass = isActive? ' bg-lime-100': ' bg-black/10';
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={()=> handleChangeCategory(cat.nome)}
                        className="flex items-center space-y-1"
                    >
                      
                        <View className={"rounded-full p-[6px] "+activeButtonClass}>
                            <CachedImage
                                uri={cat.imgTag}
                                style={{width: hp(6), height: hp(6)}} 
                                className="rounded-full"
                            />
                        </View>
                        <Text className="text-black-800 " style={{fontSize: hp(1.6)}}>
                            {cat.nome}
                        </Text>
                    </TouchableOpacity>
                )
            })
        }
      </ScrollView>
    </Animated.View>
  )
}