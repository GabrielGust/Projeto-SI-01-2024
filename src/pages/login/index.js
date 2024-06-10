import React,{useState,useContext}from "react";
import { View,KeyboardAvoidingView,Text,TextInput,StyleSheet,TouchableOpacity, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from "../../contexts/auth"
import auth from '@react-native-firebase/auth';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Login(){

const[email,setEmail]=useState("");
const[password,setPassword]=useState("");
const [loading, setIsLoading] = useState(null);
const navigation=useNavigation();
const {user,setUser,LogandoUsuarios} = useContext(AuthContext);

function LogandoUsuario(){
  LogandoUsuarios(auth,email,password)
}


function CriandoConta(){
  navigation.navigate("Cadastro")
 }


function RecumperandoPassword(){
  if (email === '') {
    Alert.alert('Erro', 'Por favor, preencha o Email');
    return;
  }
 
  auth()
  .sendPasswordResetEmail(email)
  .then(()=>  Alert.alert("Redefinir Senha!!","Enviamos um Email Para Você!!"))
  .catch((error) => {
    setIsLoading(false)
  console.log(error) 
})
  
}


    return(
      <KeyboardAvoidingView
      style={{ flex: 1,  backgroundColor: '#000' }}
      behavior="padding" // ou "position"
    >
        <View style={styles.container}>
            <FontAwesome name="line-chart" size={70} color="#fff"style={styles.icones} />


           <View style={styles.inputContainer}>
           <Text style={styles.title}>Usuário: </Text>
            <FontAwesome name="user" size={20} color="red" />
           
        </View>

    <TextInput
      style={styles.input}
      placeholder="Digite seu email..."
      placeholderTextColor="#000" 
      keyboardType="email-address"
      value={email}
     onChangeText={(text) => setEmail(text)}
    />

<View style={styles.inputContainer}>
            <Text style={styles.title}>Senha: </Text>
            <FontAwesome name="lock" size={20} color="red" />

            
        </View>
    <TextInput
      style={styles.input}
      placeholder="Digite sua senha..."
      placeholderTextColor="#000" 
      value={password}
      onChangeText={(text) => setPassword(text)}
      keyboardType="numeric"
      secureTextEntry={true}
    />

        
<View style={styles.buttonContainer}>
    <TouchableOpacity style={[styles.button1, { flex: 1 }]} onPress={CriandoConta}>
      <Text style={styles.buttonText1}>Criar Uma Conta</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.button1, { marginLeft:windowHeight * 0.05, flex: 1 }]} onPress={RecumperandoPassword}>
      <Text style={[styles.buttonText1,{color: 'red'}]}>Esqueceu a senha?</Text>
    </TouchableOpacity>
</View>

    <TouchableOpacity style={styles.button} onPress={LogandoUsuario}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>

        </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container:{
      flex: 1,
      paddingTop: windowHeight * 0.05,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width: windowWidth * 0.85,
      height: windowHeight * 0.07,
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: windowHeight * 0.03,
      paddingLeft:windowHeight * 0.02,
      backgroundColor:'#fff'
    },
    button:{
      width: windowWidth * 0.85,
      height: windowHeight * 0.05,
      backgroundColor: '#fff',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: windowHeight * 0.00,
    },
    buttonText: {
      justifyContent:'center',
      alignItems:'center',
      color: 'red',
       fontSize: windowHeight * 0.03,
       fontWeight:'bold'
    },
    title: {
      fontSize: windowHeight * 0.04,
      fontWeight: 'bold',
      marginBottom: windowHeight * 0.00,
      color:"#fff"
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom:  windowHeight * 0.01,
      alignItems:'center',
   
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowHeight * 0.50,
    marginBottom:windowHeight * 0.01,
    height: windowHeight * 0.06,
  },
  button1:{
      height: windowHeight * 0.040,
       marginBottom: windowHeight * 0.01,
       justifyContent: 'center',
       alignItems: 'center',
       width: windowWidth * 0.75,
  },
  buttonText1:{
    color: '#fff',
      textAlign: 'center',
      fontSize: windowHeight * 0.025,
      
  },
  icones:{
    marginBottom:windowHeight * 0.02,
   
  }
  
  })