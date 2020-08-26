import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/Feather';
import { MapBox, Container, ButtonMain, BottomBox, BottomBoxCircle, ParkTextButton, RightMenuButton } from './styles';
import Map, { } from '../../components/Map';
import { useMap } from '../../contexts/map';

const Dashboard = ({ navigation }) => {

  const { user, signOut } = useAuth();

  const { saveParkLocation } = useMap();

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
    });

  }, []);

  return (
    <Container>
      <MapBox >
        <Map user={user} />
      </MapBox>
      <BottomBox>
        <BottomBoxCircle>
          <ButtonMain delayPressIn={0} onPress={saveParkLocation}>
            <ParkTextButton>P</ParkTextButton>
          </ButtonMain>
        </BottomBoxCircle>
      </BottomBox>

    </Container >
  );
};


export default Dashboard;