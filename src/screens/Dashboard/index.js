import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/Feather';
import { MapBox, Container, ButtonMain, BottomBox, BottomBoxCircle, ParkTextButton, RightMenuButton } from './styles';
import Map from '../../components/Map';

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
  }, []);

  const saveParkLocation = () => {
    Map.saveParkLocation;
  };

  return (
    <Container>
      <MapBox >
        <Map user={user} />
      </MapBox>
      <BottomBox>
        <BottomBoxCircle>
          <ButtonMain delayPressIn={0} onPress={() => { }}>
            <ParkTextButton>P</ParkTextButton>
          </ButtonMain>
        </BottomBoxCircle>
      </BottomBox>

    </Container >
  );
};


export default Dashboard;