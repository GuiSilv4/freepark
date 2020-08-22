import SignIn from '../screens/SignIn';
import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const AuthStack = createStackNavigator();

const AuthRoutes = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#4862c6" />
    <AuthStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <AuthStack.Screen name="Login" component={SignIn} />
    </AuthStack.Navigator>
  </>
);

export default AuthRoutes;
