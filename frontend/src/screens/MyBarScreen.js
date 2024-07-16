import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity ,LogBox} from 'react-native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PlusCircleIcon, HomeIcon, BookmarkIcon, IdentificationIcon ,CheckCircleIcon,ArrowLeftIcon} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { URL } from '../helpers/url';


LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native', 
]);

export default function MyBarScreen() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);



  const navigation = useNavigation();


  const categoryImages = {
    bitters: require('../../assets/images/bitters.png'),
    destilados: require('../../assets/images/destilados.png'),
    componentes: require('../../assets/images/componentes.png'),
    licores: require('../../assets/images/licores.png'),
    sucos: require('../../assets/images/sucos.png'),
    sodas: require('../../assets/images/sodas.png'),
  
  };

  useEffect(() => {
    getIngredientes()
  }, []);


// listagem de ingredintes
  const getIngredientes = async () => {
    try {
      const response = await axios.get(`${URL}/ingredientes`);
      if (response && response.data) {
        setItems(response.data);
        extractCategories(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

// obtem as categorias
  const extractCategories = (ingredientes) => {
    const listCategorias = [...new Set(ingredientes.map(item => item.categoria))];
    setCategories(listCategorias);
  };

  const filterByCategory = (categoria) => {
    const filteredItems = items.filter(item => item.categoria === categoria);
    setSelectedCategory(categoria);
    setItems(filteredItems);
  };

// salva o item 
  const handleSaveItem = async (item) => {
    try {
      const updatedItem = {salvo: !item.salvo }; 
      const response = await axios.put(`${URL}/ingredientes/${item.id}`, updatedItem);
      if (response && response.data) {
        setItems((prevItems) =>
          prevItems.map((i) => (i.id === item.id ? response.data : i))
        );
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  }

// renderizacao dos cards de categoria
  const renderCategory = ({ item }) => (
    
    <TouchableOpacity
      className='flex-1 items-center m-2 p-4 bg-white rounded-lg shadow-lg'
      onPress={() => filterByCategory(item)}
      style={{ width: wp(45), height: hp(25) }}
    >
      <Image
        source={categoryImages[item] || require('../../assets/images/destilados.png')}
        style={{ width: wp(40), height: hp(18), resizeMode: 'cover' }}
      />
      <Text className='text-center mt-2' style={{ fontSize: hp(2.5) }}>{item}</Text>
    </TouchableOpacity>
  );

  // renderizacao dos ingredientes de cada ccategoria
  const renderItem = ({ item }) => (
    
    <View className='flex-1 items-center m-2 p-4 bg-white rounded-lg shadow-lg'>
      <Image source={{ uri: item.img_ingrediente }} style={{ width: wp(24), height: hp(15), resizeMode: 'contain' }} />
      <View className='mt-2 items-center' style={{ height: hp(10), justifyContent: 'space-between' }}>
        <Text className='mt-2 text-center' style={{ fontSize: hp(1.5) }}>{item.nome}</Text>
        <TouchableOpacity
          className='mt-2 w-8 h-8 rounded-full items-center justify-center bg-white'
          onPress={() => handleSaveItem(item)}
        >    
            {item.salvo ? (
              <CheckCircleIcon size={hp(3)} color="green" />
            ) : (
              <PlusCircleIcon size={hp(3)} color="black" />
            )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleBack = () => {
    setSelectedCategory(null);
    getIngredientes(); 
  };
  
  return (
    // headder
    <View className='flex-1 bg-gray'>
      <View className="p-4 bg-white border-b border-gray-200" style={{  flexDirection: 'row', alignItems: 'center' }}>
        {selectedCategory && (
          <TouchableOpacity onPress={handleBack} style={{position: 'absolute',left: 10,bottom:20 ,marginRight: 10 }}>

            <ArrowLeftIcon size={hp(3)} color="black" />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: hp(3), fontWeight: 'bold', textAlign: 'center', flex: 1, marginTop: hp(2)}}>Meu Bar</Text>
        <TouchableOpacity style = {{position: 'absolute',right: 10,bottom:20}}>
          <IdentificationIcon size={hp(3)} color="black" />
        </TouchableOpacity>
      </View>
      {/* Card de categorias*/}
      {selectedCategory ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{ padding: 2 }}
          key={selectedCategory} 
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={{ padding: 2 }}
          key="categories" 
        />
      )}

      {/* footer menu */}
      <View className="flex-row justify-around items-center p-4 bg-white border-t border-gray-200">
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <HomeIcon size={hp(3)} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <IdentificationIcon size={hp(3)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Saved')}>
          <BookmarkIcon size={hp(3)} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );

}