import React from "react";

import Login from "../pages/login";
import Cadastro from "../pages/Cadastro";

import { createStackNavigator } from "@react-navigation/stack";


export default function Controle(){
const Stack=createStackNavigator();
    return(
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
        name="Login"
        component={Login}
        options={{ headerShown: false }}
        />

    <Stack.Screen 
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
        />

      </Stack.Navigator>
    )
}