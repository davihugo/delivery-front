import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DeliveriesScreen from './screens/DeliveriesScreen';
import AddMotoboyScreen from './screens/AddMotoboyScreen';
import AddDeliveryScreen from './screens/AddDeliveryScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Entregas" component={DeliveriesScreen} />
        <Drawer.Screen name="Cadastrar Motoboy" component={AddMotoboyScreen} />
        <Drawer.Screen name="Cadastrar Entrega" component={AddDeliveryScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}