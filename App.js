import React,{useState,useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "./src/contexts/auth"
import Controle from "./src/routes/controle"
import auth from '@react-native-firebase/auth';
import ControleDrawer from "./src/routes/controleDrawer"

export default function App(){

  const [logado, setLogado] = useState(null);

  useEffect(() => {
    auth().onAuthStateChanged((_user) => {
      setLogado(_user)
    });
  
  }, []);

  return(
    <NavigationContainer>
      <AuthProvider>
      {logado ? <ControleDrawer/> : <Controle/>}
     
      </AuthProvider>
    </NavigationContainer>
  )
}