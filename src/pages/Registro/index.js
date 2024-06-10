import React, { useEffect, useState, useContext} from 'react';
import { View, Text, Dimensions, StyleSheet,TouchableOpacity, Alert,TextInput } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../contexts/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Graph = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigation=useNavigation()
  const [valorInicial, setValorInicial] = useState();
  const [aportesMensais, setAportesMensais] = useState();
  const [valorFuturo, setValorFuturo] = useState();
  const[taxa,setTaxa]=useState()
  const [tempo, setTempo] = useState(); 
  const [isCalculatePressed, setIsCalculatePressed] = useState(false);
 

  useEffect(() => {
    if (user && user.uid) {
      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setData([
              { key: 'Salario', value: userData.Salario || 0, color: 'blue' },
              { key: 'Metas', value: userData.metas || 0, color: 'green' },
              { key: 'Saida', value: userData.saida || 0, color: 'red' },
              { key: 'Falta para Meta', value: (userData.metas - (userData.Salario - userData.saida)) || 0, color: 'orange' }
            ]);
          } else {
           
            setData([
              { key: 'Salario', value: 0, color: 'blue' },
              { key: 'Metas', value: 0, color: 'green' },
              { key: 'Saida', value: 0, color: 'red' },
              { key: 'Falta para Meta', value: 0, color: 'orange' }
            ]);
          }
        });
  
      return () => subscriber();
    }
  }, [user, refresh]);
  

  const total = data.reduce((total, item) => total + item.value, 0);

  const chartData = {
    labels: data.map(item => item.key),
    datasets: [{
      data: data.map(item => item.value),
      color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    }]
  };

  const feedbackMessage = () => {
    const saldo = data.find(item => item.key === 'Salario').value - data.find(item => item.key === 'Saida').value;
    const meta = data.find(item => item.key === 'Metas').value;
    let faltaParaMeta = meta - saldo;
    
    if (saldo < 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.textos}>Cuidado! Dívida subindo! Falta R$${Math.abs(faltaParaMeta).toFixed(2)} Para a meta</Text>
        </View>
      );
    } else if (saldo > 0) {
      if (faltaParaMeta <= 0) {
        return (
          <View style={styles.container}>
            <Text style={styles.textos}>Parabéns! Você atingiu sua meta! 🏆</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text style={styles.textos}>Parabéns! Está com as contas em dia! Falta R$${Math.abs(faltaParaMeta).toFixed(2)} Para a meta</Text>
          </View>
        );
      }
    }
  };
  const handleDelete = async () => {
    if (user && user.uid) {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .delete();
      setRefresh(!refresh); // atualiza o estado refresh após a exclusão
    }
  };

   function Olheaki(){
    Alert.alert("A jornada De Mil Quilômetros Precisa", "Começar Com um Simples Passo.")
   }
   function Navegar(){
    navigation.navigate('Home')
   }

  function calcularJurosCompostos() {
  const p = parseFloat(valorInicial); // Valor inicial
  const a = parseFloat(aportesMensais); // Aportes mensais
  const r = parseFloat(taxa) / 100 / 12; // Taxa de juros mensal (convertida de porcentagem para decimal)
  const t = parseFloat(tempo) * 12; // Tempo em meses

  if (!valorInicial || !aportesMensais || !taxa || !tempo) {
    Alert.alert('Preencha todos os campos!!');
    return;
  }

  if (!isNaN(p) && !isNaN(a) && !isNaN(r) && !isNaN(t)) {
    // Calcula o valor futuro do valor inicial
    let valorFuturo = p * (1 + r)**t;
    // Calcula o valor futuro dos aportes mensais
    let valorFuturoAportes = a * (((1 + r)**t - 1) / r);
    // Soma os dois para obter o valor futuro total
    valorFuturo += valorFuturoAportes;
    setIsCalculatePressed(true); // Define a flag como verdadeira quando o botão é pressionado
    setValorFuturo(valorFuturo.toFixed(2)); // Define o estado aqui
  }
 
}

   
  
  const handleTaxaChange = (text) => {
    let formattedText = text.replace(/[^0-9.]/g, ''); 
    formattedText = formattedText.replace(/(\..*)\./g, '$1'); 
    setTaxa(formattedText + '%'); 
  };
  return (
    data.length ? (

     
      <ScrollView style={styles.container1}>

        <View style={styles.calculator}>
          <Text style={styles.composto}>Calcular Juros Composto!</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.label}>Valor Inicial:</Text>
            <TextInput
              placeholder='Ex 5000'
              value={valorInicial}
              onChangeText={text => setValorInicial(text)}
              keyboardType="numeric"
              style={[styles.input,{width:windowHeight * 0.30,}]}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.label}>Aportes Mensais:</Text>
            <TextInput
              placeholder='Ex 1000'
              value={aportesMensais}
              onChangeText={text => setAportesMensais(text)}
              keyboardType="numeric"
              style={[styles.input,{width:windowHeight * 0.25,}]}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.label}>Taxa de Juros (em %):</Text>
            <TextInput
              placeholder='Ex 12'
              value={taxa}
              onChangeText={handleTaxaChange}
              keyboardType="numeric"
              style={[styles.input,{width:windowHeight * 0.20,}]}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.label}>Tempo (em anos):</Text>
            <TextInput
              placeholder='Ex 19'
              value={tempo}
              onChangeText={text => setTempo(text)}
              keyboardType="numeric"
              style={[styles.input,{width:windowHeight * 0.23,}]}
            />
          </View>

          <TouchableOpacity style={styles.buttonCalular} onPress={calcularJurosCompostos}>
            <Text style={{color:'#fff',fontSize:17,}}>Calcular</Text>
          </TouchableOpacity>

          {isCalculatePressed && valorFuturo && tempo && (
  <Text style={styles.resusltado}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFuturo)} em {tempo} anos</Text>
)}

          </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',marginTop:windowWidth * 0.025}} onPress={handleDelete}>
              <Icon name="trash" size={20} color="#e26a00" />
              <Text style={{color:'#e26a00',fontSize:16}}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',marginTop:windowWidth * 0.025 }} onPress={Navegar}>
              <Icon name="backward" size={20} color="#1b98f0" />
              <Text style={{color:'#1b98f0',fontSize:16}}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',marginTop:windowWidth * 0.025 }} onPress={Olheaki}>
              <Icon name="eye" size={20} color="#E19E06" />
              <Text style={{color:'#E19E06',fontSize:16}}>Clique Aki</Text>
            </TouchableOpacity>
          </View>
      <Text >{feedbackMessage()}</Text>
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width}
          height={300}
          yAxisLabel={'R$'}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
          }}
          style={{
            marginVertical:  windowWidth * 0.01,
            borderRadius:  windowWidth * 0.02,
            
            }}
        />
 
       
       
      </ScrollView>
    ) : null
  );
};

export default Graph;

const styles=StyleSheet.create({
  container:{
    width:  windowWidth * 0.99,
    height:  windowHeight * 0.10,
    backgroundColor: '#E19E06',
    borderWidth: 1,
    borderRadius:2,
 
   
  },
  textos:{
    fontSize:16,
    fontWeight:'bold',
    color:'#000',
    textAlign:'center',
   
  }, container1: {
    flex: 1,
    backgroundColor:'#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.95,
    paddingHorizontal:windowWidth * 0.02,
    margin:windowWidth * 0.015
  },
 resusltado:{
    color:"#fff",
    margin:windowWidth * 0.01,
    fontSize:20
  },
  calculator:{
    flex:1,
    alignItems:'center',
    backgroundColor:'#1b98f0',
    borderRadius:5,
    
    
  }, 
    input: {
      height:windowWidth * 0.070,
      width:windowWidth * 0.52,
      borderWidth: 1,
      padding:windowWidth * 0.010,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      color: '#000',
      fontWeight: 'bold',
      margin: windowHeight * 0.01,
    },
    composto:{
      color:'#ebf1f2',
      fontSize:20,
      fontWeight:'bold',
      margin: windowHeight * 0.04,
      textAlign:'center',
      
    },
    buttonCalular:{
      flexDirection: 'row', 
      alignItems: 'center',
      backgroundColor:'#900',
      margin:windowHeight * 0.01,
     width:windowHeight * 0.12,
     borderRadius:3,
    justifyContent:'center'
    }
  });
  
