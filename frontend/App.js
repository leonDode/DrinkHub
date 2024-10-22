import AppNavigation from './src/navigation';
import { AuthProvider } from './src/contexts/authContext';





export default function App() {

  return (
   <AuthProvider>
     <AppNavigation />
   </AuthProvider>
     
  );
}