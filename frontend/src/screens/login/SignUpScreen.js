import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';


export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();


    const handleSignUp = async () => {
      try {
        const response = await axios.post('https://api-drinks.vercel.app/usuario', {
          nome,
          email,
          password,
        });
        const token = response.data.acess_token; 
        const userId = response.data.user_id;    

      login(token, userId);

      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Erro', 'Cadastro falhou, por favor tente novamente.');
      console.error("Erro no cadastro:", error);
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
    
          <View className="h-full w-full flex justify-around pt-40 mt-10">
            <View className="flex items-center mx-4 space-y-4">
              <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="white"
                  value={email}
                  onChangeText={setEmail}
                  style={{ color: 'white' }}

                />
              </Animated.View>
    
              
    {/* <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-white/5 p-5 rounded-2xl w-full"> */}
              <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="white"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={{ color: 'white' }}

                />
              </Animated.View>
    
    {/* <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-white/5 p-5 rounded-2xl w-full"> */}
              <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full border border-white">
                <TextInput
                  placeholder="Confirmar Senha"
                  placeholderTextColor="white"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={{ color: 'white' }}

                />
              </Animated.View>
    
    
              <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="w-full">
                <TouchableOpacity className="w-full bg-green-400 p-3 rounded-2xl mb-3" onPress={handleSignUp}>
                  <Text className="text-xl font-bold text-white text-center">Cadastrar-se</Text>
                </TouchableOpacity>
              </Animated.View>
    
              <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="flex-row justify-center">
                <Text className="text-white">Já tem uma conta? Faça </Text>
                <TouchableOpacity onPress={() => navigation.push('Login')}>
                  <Text className="text-green-700">Login</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      );


    
}