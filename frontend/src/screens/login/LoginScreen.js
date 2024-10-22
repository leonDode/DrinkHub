import { useState,useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity ,Alert} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/authContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const { userToken, login, logout, isLoading } = useContext(AuthContext);

    

    


    
    
    const handleLogin = async () => {

     



      try {
        const response = await axios.post(`https://api-drinks.vercel.app/login`, {
          email,
          password,
         
        });
          
  
        const token = response.data.acess_token;
        const userId = response.data.user_id;
      
       
        
        login(token, String(userId));

        
        navigation.navigate('Main');
      } catch (error) {
        Alert.alert('Erro', 'Login falhou, por favor tente novamente.');
      }

      
    };



    return (
        <View className="bg-green-500 h-full w-full">
          <View className="flex-row justify-center w-full absolute mt-20">
            <Animated.Image
              entering={FadeInUp.delay(200).duration(1000).springify()}
              className="h-[250] w-[320]"
              source={require('../../../assets/images/drinkhubName.png')}
            />
          </View>
    
          <View className="h-full w-full flex justify-around pt-40 pb-10 mt-20">
            <View className="flex items-center mx-4 space-y-4 mt-10">
              <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="white"
                  value={email}
                  onChangeText={setEmail}
                  style={{ color: 'white' }}

                />
              </Animated.View>
    
              <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full  border border-white">
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="white"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={{ color: 'white' }}
                />
              </Animated.View>
    
              <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                <TouchableOpacity className="w-full bg-green-400 p-3 rounded-2xl mb-3" onPress={handleLogin}>
                  <Text className="text-xl font-bold text-white text-center">Login</Text>
                </TouchableOpacity>
              </Animated.View>
    
              <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                <Text className="text-white">Ainda não tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.push('SignUp')}   >
                  <Text className="text-green-700">Cadastre-se</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      );
}