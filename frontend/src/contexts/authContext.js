import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null); // Armazena o ID do usuário
  const [isLoading, setIsLoading] = useState(true);

  // Função para login que salva o token e o ID do usuário
  const login = async (token, id) => {
    try {
      setUserToken(token);
      setUserId(id);

      await AsyncStorage.setItem("token", token); // Salva o token
      await AsyncStorage.setItem("userId", id); // Salva o ID do usuário
    } catch (error) {
      console.error("Erro ao salvar o token ou o ID:", error);
    }
  };

  // Função para logout que remove o token e o ID do usuário
  const logout = async () => {
    try {
      setUserToken(null);
      setUserId(null);
      await AsyncStorage.removeItem("token"); // Remove o token
      await AsyncStorage.removeItem("userId"); // Remove o ID do usuário
    } catch (error) {
      console.error("Erro ao remover o token ou o ID:", error);
    }
  };

  // Verifica se o token e o ID do usuário estão no AsyncStorage ao iniciar o app
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("userId");

      console.log(id);
      if (token && id) {
        setUserToken(token);
        setUserId(id);
      }
    } catch (error) {
      console.error("Erro ao verificar o token ou o ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, userId, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
