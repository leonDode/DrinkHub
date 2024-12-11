import AppNavigation from "./src/navigation";
import { AuthProvider } from "./src/contexts/authContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { TailwindProvider } from "tailwindcss-react-native"; // Importa o TailwindProvider
import "./src/i8n";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TailwindProvider platform="react-native">
          <AppNavigation />
        </TailwindProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
