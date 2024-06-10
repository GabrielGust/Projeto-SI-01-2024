import React, { useContext } from "react";
import { View, Text, TouchableOpacity,StyleSheet} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext } from "../contexts/auth";
import Home from "../pages/Home";
import Registro from "../pages/Registro/index";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icone from 'react-native-vector-icons/EvilIcons';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const { nomeUsuario } = useContext(AuthContext);

  return (
    <View>
     <Icone name="user" style={styles.icone} />
     <Text style={styles.labe}>Bem Vindo!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{ padding:  windowWidth * 0.04, }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="home"  style={styles.icon} />
          <Text style={styles.label}>Olá, {nomeUsuario}!</Text>
        </View>
      </TouchableOpacity>

     

      <TouchableOpacity
        onPress={() => navigation.navigate("Registro")}
        style={{ padding: 16 }}
      >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="gear"style={styles.icon} />
      <Text style={styles.label}>Registro</Text> 
      
      </View>
     </TouchableOpacity>


    </View>
  );
}

export default function ControleDrawer() {
  return (
    <Drawer.Navigator
    initialRouteName="Homer"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  
  >
   
   <Drawer.Screen
  name="Home"
  component={Home}
  options={{
    title: "Home",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: "#000",
    },
    drawerStyle: {
      backgroundColor: "#d3e2ef",
      activeBackgroundColor: "red",
      activeTintColor: "blue"
    },
  }}
/>  
    

      <Drawer.Screen
        name="Registro"
        component={Registro}
        options={{
          title: "Registro!", 
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000",
          },
         drawerStyle: {
            backgroundColor: "#d3e2ef",
          
          },
         
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    backgroundColor:"#000",
    alignItems:'center',
  },
  label:{
    color: "#000", 
    fontSize: windowWidth * 0.04, 
    marginBottom: windowHeight * 0.005, // adapt margin based on screen height
    marginHorizontal: windowWidth * 0.02, // adapt margin based on screen width
    marginTop: windowHeight * 0.01, // adapt margin based on screen height
  },
  icon:{
    fontSize: windowWidth * 0.07,
    marginHorizontal: windowWidth * 0.01,
    color:"#000"
  },
  icone:{
    fontSize: windowWidth * 0.18, 
    textAlign:'center',
    color:"#efb181",
  },
  labe:{
    fontSize: windowWidth * 0.06, 
    fontWeight:'bold',
    color:'#000',
    textAlign:'center'
  }
})