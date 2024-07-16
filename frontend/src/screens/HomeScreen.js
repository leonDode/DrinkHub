import { View, Text, ScrollView, Image, TextInput, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { HomeIcon, HomeIconOutline, IdentificationIcon, BookmarkIcon, SparklesIcon, Cog8ToothIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { URL } from '../helpers/url';
import CheckBox from 'react-native-check-box';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [activeIcon, setActiveIcon] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  const handleChangeCategory = (category) => {
    if (category === activeCategory) {
      setActiveCategory(null);
      getRecipes();
    } else {
      setActiveCategory(category);
      getRecipes(category);
    }
    setDrinks([]);
  };

  // listagem de categorias
  const getCategories = async () => {
    try {
      const response = await axios.get(URL + '/categorias');
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };


  // listagem de drinks
  const getRecipes = async (category) => {
    try {
      let response;
      if(isChecked){

        if(category){
          response = await axios.get(`${URL}/mybar/${category}`)
        }else{
          response = await axios.get(`${URL}/mybar`)
        }
      } else{
           if (category) {
              response = await axios.get(`${URL}/tags/${category}`);
           } else {
             response = await axios.get(URL);
           }
      }

      if (response && response.data) {
        setDrinks(response.data);
      }
    
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  const handleIconPress = (iconName) => {
    setActiveIcon(iconName);
  };


  const handleSearch = (text) => {
    setSearchQuery(text);
    filterRecipes(text);
  };

// filtro da barra de pesquisa
  const filterRecipes = (text) => {
    if (text === '') {
      getRecipes(activeCategory);
    } else {
      const filteredDrinks = drinks.filter((drink) =>
        drink.nome.toLowerCase().includes(text.toLowerCase())
      );
      setDrinks(filteredDrinks);
    }
  };
// gerador de drink aleatorio
  const handleRandomRecipe = () => {
    if (drinks.length > 0) {
      let randomDrink = null;
      do {
        randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
      } while (!randomDrink || !randomDrink.id);
      navigation.navigate('RandomRecipe', { drink: randomDrink });
    }
  };

  // modal de configuracoes
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    getRecipes()
  };
// check box Mybar
  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
   
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require('../../assets/images/avatar.png')}
            style={{ height: hp(5), width: hp(5.5) }}
          />
          <TouchableOpacity onPress={toggleModal}>
            <Cog8ToothIcon size={hp(3)} color="gray" />
          </TouchableOpacity>
        </View>

        {/* DrinkHub */}
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Text style={{ fontSize: hp(3.8) }} className="font-semibold text-neutral-600">
            <Text className="text-green-600">DrinkHub</Text>
          </Text>
          <TouchableOpacity
            onPress={handleRandomRecipe}
            className="flex-row items-center space-x-2"
            style={{
              borderWidth: 1,
              borderColor: 'green',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: 'white',
            }}
          >
            <Text style={{ fontSize: hp(2), color: 'green'}}>Aleatório</Text>
            <SparklesIcon size={hp(3)} color="green" />
          </TouchableOpacity>
        </View>

        {/* search bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="Search any recipe"
            placeholderTextColor={'gray'}
            style={{ fontSize: hp(1.7) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
            onChangeText={handleSearch}
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* categorias */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        <View>
          <Recipes drinks={drinks} categories={categories} />
        </View>
      </ScrollView>
      {/* footer menu */}
      <View className="flex-row justify-around items-center p-4 bg-white border-t border-gray-200">
        <TouchableOpacity onPress={() => handleIconPress('Home')}>
          {activeIcon === 'Home' ? (
            <HomeIcon size={hp(3)} color="black" />
          ) : (
            <HomeIconOutline size={hp(3)} color="gray" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('MyBar')}>
          <IdentificationIcon size={hp(3)} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Saved')}>
          <BookmarkIcon size={hp(3)} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Configurações</Text>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                isChecked={isChecked}
                onClick={handleCheckBoxChange}
                style={styles.checkBox}
              />
              <Text style={styles.label}>Apenas o que já tenho no meu bar</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleModal}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
// estilizacao da genela modal de configuroes
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkBox: {
    marginRight: 10,
  },
  label: {
    fontSize: hp(2),
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
