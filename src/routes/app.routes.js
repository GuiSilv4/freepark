import Dashboard from '../screens/Dashboard';
import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();

const AppRoutes = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#293592" />
    <AppStack.Navigator>
      <AppStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Free Park',
          headerStyle: {
            backgroundColor: '#293592',
            height: 100
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          }
        }} />
    </AppStack.Navigator>
  </>
);

export default AppRoutes;
