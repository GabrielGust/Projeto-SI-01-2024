import React,{useState,useContext}from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';
import { AuthContext } from "../../contexts/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Cadastro(){
  const[nome,setNome]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [loading, setIsLoading] = useState(null);
    const navigation=useNavigation();
    const {CriandoUsuario,} = useContext(AuthContext);

    function CriandoUsuarios(){
      CriandoUsuario(auth,email,password,nome)
    }


    const navigator= ()=>{
      navigation.navigate('Login')
    }
    return(
        <View style={styles.container}>

          <Text style={styles.titulo}>Cadastre-se!</Text>     
            <Text style={styles.label}>Nome:</Text>
            <TextInput 
            placeholder="Ex...Carlos"
            placeholderTextColor="#fff" 
            value={nome}
            onChangeText={(text)=>setNome(text)}
            style={styles.input}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput 
            placeholder="Ex...teste@.com"
            placeholderTextColor="#fff" 
            value={email}
            keyboardType="email-address"
            onChangeText={(text)=>setEmail(text)}
            style={styles.input}
            />

          <Text style={styles.label}>Senha:</Text>
            <TextInput 
            placeholder="Ex...123456"
            placeholderTextColor="#fff" 
            value={password}
            onChangeText={(text)=>setPassword(text)}
            keyboardType="numeric"
            style={styles.input}
            multiline={false}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}}>
            <TouchableOpacity onPress={navigator} style={styles.buttonLogout}>
            <Icon name="backward" size={20} color="#000" />
            <Text style={{ color: "#000" }}> Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={CriandoUsuarios} style={styles.buttonLogout}>
            
            <Icon name="user-plus" size={20} color="#000" />
            <Text style={{ color: "#000" }}> Criar Conta</Text>
            </TouchableOpacity>
            </View>
            </View>
    )
}
const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      backgroundColor:"#000",
      
    },
    label:{
      color: "red", 
      fontSize: windowWidth * 0.04,
      marginBottom: windowHeight * 0.005,
      marginHorizontal: windowWidth * 0.02,
      marginTop: windowHeight * 0.01,
      marginLeft:windowWidth * 0.03,
    },
    input:{
    fontSize: windowWidth * 0.035,
    borderBottomWidth:1,
    borderColor: "#FFF",
    marginHorizontal: windowWidth * 0.02,
    borderRadius: 5,
    color:"#FFF",
    marginLeft:windowWidth * 0.03,
    },
    buttonLogout:{
      flexDirection: 'row',
      backgroundColor: 'red',
      alignSelf: "flex-start",
      margin: windowHeight * 0.02,
      borderRadius: 4,
      width: windowWidth * 0.35,
      height: windowHeight * 0.07,
      justifyContent:'center',
     alignItems:'center'
    },
    titulo:{
      fontWeight:'bold',
      color:"#fff",
      fontSize: windowWidth * 0.08,
      textAlign:'center'
    }
    
  })
