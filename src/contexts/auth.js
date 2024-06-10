import React, { createContext, useState,useEffect} from 'react';
import { useNavigation } from "@react-navigation/native";
import{Alert} from "react-native";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from "@react-native-firebase/firestore";
export const AuthContext = createContext();

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const navigation=useNavigation();
  const [loading, setIsLoading] = useState(true);
  const[nome,setNome]=useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");


     // Criando Um Conta
     async function CriandoUsuario(auth, email, password, nome) {
      if (email === "" || password === "" || nome === "") {
          Alert.alert("Preencha!!", "Todos Campo!!")
          return;
      }
      await auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredencial) => {
              let uid = userCredencial.user.uid;
              setNome(uid)
              let userRef = firestore().collection(uid).doc(uid);
              userRef.set({
                  nome,
              })
              .then(() => {
                  userRef.onSnapshot((doc) => {
                      if (doc.exists) {
                          setNomeUsuario(doc.data().nome);
                          AsyncStorage.setItem('nomeUsuario', doc.data().nome);
                          console.log("No such document!");
                      }
                  });
              });
              Alert.alert("Conta", "Cadastrada com Sucesso")
          })
          .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                  Alert.alert("Erro", "O endereço de email já está em uso por outra conta.");
              } else {
                  // Tratar outros erros
                  Alert.alert("Erro", error.message);
              }
          });
  }
  
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged((authUser) => {
        setUser(authUser);
        if (authUser) {
          let uid = authUser.uid;
          let userRef = firestore().collection(uid).doc(uid);
          userRef.onSnapshot((doc) => {
            if (doc.exists) {
              setNomeUsuario(doc.data().nome);
              AsyncStorage.setItem('nomeUsuario', doc.data().nome);
            } else {
              console.log("No such document!");
            }
          });
        }
        setIsLoading(false); 
      });
    
      return subscriber; 
    }, []);
    
    //logando Usuario
  function LogandoUsuarios(auth,email,password){
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!!');
      return;
    }
    auth()
    .signInWithEmailAndPassword(email,password)
      .then((userCredencial)=>{
        //setUser(userCredencial.user.uid)
        console.log("Logado")
       
      })
      .catch((error)=>Alert.alert('Email ou Senha Invalidas!','Preencha Corretamente!'))
      .finally(()=>setIsLoading(false))
  }



  return(
    <AuthContext.Provider value={{user,LogandoUsuarios,CriandoUsuario,nomeUsuario,}}>
      {children}
     
    </AuthContext.Provider>
  )
}

 export default AuthProvider;


   
 