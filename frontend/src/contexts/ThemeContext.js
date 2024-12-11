import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Criação do Contexto
export const ThemeContext = createContext();

// Provedor do Contexto de Tema
export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Função para alternar o tema
  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Carregar o tema salvo ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDarkTheme(true);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
