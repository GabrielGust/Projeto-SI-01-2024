import React, { useState, useContext, useEffect } from 'react';
import { View,KeyboardAvoidingView, StyleSheet, Button, Alert, TextInput, Text, ActivityIndicator,TouchableOpacity} from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../contexts/auth";
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Home() {
  const [Salario, setSalario] = useState("");
  const [saida, setSaida] = useState("");
  const [metas, setMetas] = useState("");
  const [Devedor, setDevedor] = useState('open'); 
  const [loading, setIsLoading] = useState(null);
  const [totalSalario, setTotalSalario] = useState(0);
  const [totalSaida, setTotalSaida] = useState(0);
  const [totalMetas, setTotalMetas] = useState(0); 
  const navigation = useNavigation();
  const { user} = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [buttonName, setButtonName] = useState("Editar");

  useEffect(() => {
    if (user && user.uid) {
      const userRef = firestore().collection('users').doc(user.uid);
  
      // Estabelece um ouvinte em tempo real nos dados
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          const userData = doc.data();
          setTotalSalario(userData.Salario);
          setTotalSaida(userData.saida);
          setTotalMetas(userData.metas);
          // Atualize outros estados conforme necessário
        } else {
          // O documento foi excluído
          setTotalSalario(0);
          setTotalSaida(0);
          setTotalMetas(0);
          // Redefina outros estados conforme necessário
        }
      });
  
      // Limpe o ouvinte quando o componente for desmontado
      return () => unsubscribe();
    }
  }, [user]);
  
  async function SairConta() {
    if (auth().currentUser) {
      try {
        await auth().signOut()
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    } else {
      console.log('Nenhum usuário está atualmente conectado');
    }
  }
  
  async function salvarEdicao() {
    if(Salario==="" || saida==="" || metas ===""){
      Alert.alert("Preencha os Campos!!","Valor Apartir De 0!!")
      return;
    }
  
    if (user && user.uid) {
      const userRef = firestore().collection('users').doc(user.uid);
    
      // Armazenando os dados
      await userRef.set({
        Salario,
        saida,
        metas,
        Devedor,
        create_at: firestore.FieldValue.serverTimestamp(),
      }, { merge: true })
      .then(() => {
        setTotalSalario(parseFloat(Salario));
        setTotalSaida(parseFloat(saida));
        setTotalMetas(parseFloat(metas));
        setSalario("");
        setSaida("");
        setMetas("");
        Alert.alert("Editado!!", "Com Sucesso!!");
        stopEditing();
      })
      .catch((error) => {
        console.log(error);
      });
    
      // Recuperando os dados
      const doc = await userRef.get();
      if (doc.exists) {
        console.log('Document data:', doc.data());
      } else {
        console.log('No such document!');
      }
    } else {
      console.log('User not authenticated');
    }
    
  }

  function IrRegistro() {
    navigation.navigate("Registro");
  }
  function startEditing() {
    setIsEditing(true);
    setSalario(totalSalario.toString());
    setSaida(totalSaida.toString());
    setMetas(totalMetas.toString());
    setButtonName("Salvar"); 
  }


function stopEditing() {
  setIsEditing(false);
  setSalario("");
  setSaida("");
  setMetas("");
  setButtonName("Editar"); 
}


async function handleNewOrder() {
  if(Salario==="" || saida==="" || metas ===""){
    Alert.alert("Prencha os Campos!!","Valor Apartir De 0!!")
    return;
  }

  if (user && user.uid) {
    const userRef = firestore().collection('users').doc(user.uid);
  
    const doc = await userRef.get();
    let userData = {};
    if (doc.exists) {
      userData = doc.data();
    }

    const newTotalSalario = (parseFloat(userData.Salario) || 0) + parseFloat(Salario);
    const newTotalSaida = (parseFloat(userData.saida) || 0) + parseFloat(saida);
    const newTotalMetas = (parseFloat(userData.metas) || 0) + parseFloat(metas);

    await userRef.set({
      Salario: parseFloat(newTotalSalario),
      saida: parseFloat(newTotalSaida),
      metas: parseFloat(newTotalMetas),
      Devedor,
      create_at: firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
    .then(() => {
      setTotalSalario(newTotalSalario);
      setTotalSaida(newTotalSaida);
      setTotalMetas(newTotalMetas);
      setSalario("");
      setSaida("");
      setMetas("");
      Alert.alert("Registrado!!", "Com Sucesso!!");
      if (isEditing) {
        stopEditing();
      }
    })
    .catch((error) => {
      console.log(error);
    });
  
    userRef.onSnapshot(doc => {
      if (doc.exists) {
        userData = doc.data();
        setTotalSalario(userData.Salario);
        setTotalSaida(userData.saida);
        setTotalMetas(userData.metas);
      } else {
        console.log('No such document!');
      }
    });
  } else {
    console.log('User not authenticated');
  }
}


  return (
    <KeyboardAvoidingView
    style={{ flex: 1,  backgroundColor: '#000' }}
    behavior="padding" // ou "position"
  >
  
    <ScrollView style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Salário Ex..2100"
        placeholderTextColor="#fff"
        value={Salario}
        onChangeText={(text) => setSalario(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Saída Ex..1000"
        placeholderTextColor="#fff"
        value={saida}
        onChangeText={(text) => setSaida(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />
        <TextInput
        style={styles.input}
        placeholder="Metas Ex..5000"
        placeholderTextColor="#fff"
        value={metas}
        onChangeText={(text) => setMetas(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />
<View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}}>
      <TouchableOpacity style={styles.button1} onPress={handleNewOrder}>
      <Text style={styles.buttonText}>Registrar</Text>
    </TouchableOpacity>

    
    <TouchableOpacity style={styles.button1} onPress={IrRegistro}>
      <Text style={styles.buttonText}>Mostrar Grafico</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button1} onPress={isEditing ? salvarEdicao : startEditing}>
  <Text style={styles.buttonText}>{buttonName}</Text>
</TouchableOpacity>

    <TouchableOpacity style={styles.button1 } onPress={SairConta}>
    <Icon name="sign-out" size={24} color="#000" />
    <Text style={styles.buttonText}>Sair Da Conta</Text>
  </TouchableOpacity>

  </View>
    
      {loading ? <ActivityIndicator size="large" color="#00ff00"/> : null}
      
      <View style={styles.container1}>
    <View style={styles.card}>
        <Text style={styles.title}>Salário Acumulado:</Text>
        <Text style={styles.value}>{`R$ ${totalSalario.toLocaleString('pt-BR')}`}</Text>
    </View>
    <View style={styles.card}>
        <Text style={styles.title}>Saída Acumulada:</Text>
        <Text style={styles.value}>{`R$ ${totalSaida.toLocaleString('pt-BR')}`}</Text>
    </View>
    <View style={styles.card}>
        <Text style={styles.title}>Meta Total:</Text>
        <Text style={styles.value}>{`R$ ${totalMetas.toLocaleString('pt-BR')}`}</Text>
    </View>
</View>
</ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
   
  },
  input: {
    height: windowHeight * 0.07,
    width:windowWidth * 0.98,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: windowWidth * 0.01,
    color: '#fff',
    paddingHorizontal: windowWidth * 0.015,
    marginLeft:windowWidth * 0.01,
  },
  button:{
   backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
   
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontSize:windowWidth * 0.029,
  },
  button1:{
   flexDirection: 'row',
    width:  windowWidth * 0.24,
    height: windowHeight * 0.047,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent:'center',
    marginLeft:windowWidth * 0.01,
  },
  container1: {
    marginTop:windowHeight * 0.01,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
   borderRadius:5
},
card: {
  marginTop:windowHeight * 0.01,
    backgroundColor: '#fff',
    width: windowHeight * 0.50,
    padding: windowHeight * 0.03,
    borderRadius: 10,
    marginBottom: windowHeight * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: windowHeight * 0.03, height: windowHeight * 0.03, },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
   
},
title: {
    fontSize: windowHeight * 0.025,
    fontWeight: 'bold',
    color: '#333',
},
value: {
    fontSize: windowHeight * 0.025,
    color: '#666',
},
});