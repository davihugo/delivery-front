import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DeliveriesScreen from './screens/DeliveriesScreen';
import AddMotoboyScreen from './screens/AddMotoboyScreen';
import AddDeliveryScreen from './screens/AddDeliveryScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6750a4' }, // Cor do cabeçalho
          headerTintColor: 'white', // Cor do texto do cabeçalho
          drawerStyle: { backgroundColor: '#fff' }, // Cor do fundo do menu lateral
          drawerActiveTintColor: '#6750a4', // Cor do ícone e texto ativo
          drawerInactiveTintColor: 'gray', // Cor do ícone e texto inativo
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="menu" size={24} color={color} />
          ),
        }}
      >
        <Drawer.Screen name="Entregas" component={DeliveriesScreen} />
        <Drawer.Screen name="Cadastrar Motoboy" component={AddMotoboyScreen} />
        <Drawer.Screen name="Cadastrar Entrega" component={AddDeliveryScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
