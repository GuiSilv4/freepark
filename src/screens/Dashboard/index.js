import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/auth';
import Map from '../../components/Map';
import Icon from 'react-native-vector-icons/Feather';
import { RightMenuButton } from './styles';

const Dashboard = ({ navigation }) => {
  const { user, signOut } = useAuth();

  function handleSignOut() {
    signOut();
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RightMenuButton onPress={handleSignOut} delayPressIn={0}>
          <Icon name='menu'
            size={30}
            color="#fff"
            style={{ marginRight: 10 }} />
        </RightMenuButton>
      ),
    })
  }, [])

  return <Map />
};


export default Dashboard;