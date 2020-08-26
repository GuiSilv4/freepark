import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/auth';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { MapProvider } from '../contexts/map';

const Routes = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return signed ? (
    <MapProvider>
      <AppRoutes />
    </MapProvider>

  ) : <AuthRoutes />;
};

export default Routes;
