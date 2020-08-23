import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/Feather';
import { MapBox, Container, ButtonMain, BottomBox, BottomBoxCircle, ParkTextButton, RightMenuButton } from './styles';
import Map, { } from '../../components/Map';

const Dashboard = ({ navigation }) => {

  const { user, signOut } = useAuth();
  const mapRef = useRef(null);

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
        <Map user={user} ref={mapRef} />
      </MapBox>
      <BottomBox>
        <BottomBoxCircle>
          <ButtonMain delayPressIn={0} onPress={() => { mapRef.current.saveParkLocation(); }}>
            <ParkTextButton>P</ParkTextButton>
          </ButtonMain>
        </BottomBoxCircle>
      </BottomBox>

    </Container >
  );
};


export default Dashboard;