import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "../locales/pt-BR.json";
import en from "../locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    en: { translation: en },
  },
  lng: "pt-BR", // Define o idioma padrão
  fallbackLng: "pt-BR", // Idioma de fallback
  interpolation: {
    escapeValue: false, // React já protege contra XSS
  },
});

export default i18n;
