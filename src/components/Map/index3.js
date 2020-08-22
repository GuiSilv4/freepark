import React, { Component } from 'react'
import MapView from "react-native-map-clustering";
import { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Container, ButtonMain, BottomBox, BottomBoxCircle, ParkTextButton, ZoomInButton } from './styles';
import Geocoder from 'react-native-geocoding';
import { useAuth } from '../../contexts/auth';
import axios from 'axios';

Geocoder.init('AIzaSyBzIqk_wGazOprkerdvU88XIbQWyv-g4aA');

export default class index extends Component {

    state = {
        region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
        },
        markers: null,
        marginBottom: 1,
    }

    async componentWillMount() {

        const res = await axios.get('https://freepark-backend.herokuapp.com/api/map/load');

        console.log(res.data.mapDots);

        this.setState({
            markers: res.data.mapDots
        });

        Geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                const response = await Geocoder.from({ latitude, longitude });

                this.setState({
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    }
                });
            }, //sucesso
            (error) => { console.log(error); }, //erro
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000,
            }
        );
    };

    loadMarkersFromDB = async () => {


    };

    saveParkLocation = async () => {

        let parkLocation = this.state.region;

        const { user } = useAuth();

        Geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                parkLocation = {
                    userID: user._id,
                    latitude: latitude,
                    longitude: longitude,
                    freePark: true,
                };

            }, //sucesso
            (error) => { console.log(error); }, //erro
            {
                enableHighAccuracy: true,
            }
        );

        const res = await axios.post('https://freepark-backend.herokuapp.com/api/map/save', parkLocation);

        this.setState({
            markers: [...this.state.markers, res.data.mapDot]
        })
    };

    renderMarkers = () => {

        return this.state.markers.map(marker => (
            <Marker
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                key={marker._id}
            />
        ))
    }

    render() {
        const { region, marginBottom } = this.state;

        return (
            <Container>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1, marginBottom }}
                    region={region}
                    showsUserLocation
                    showsMyLocationButton={true}
                    ref={el => this.mapView = el}
                    showsTraffic={true}
                    loadingEnabled
                    onMapReady={() => this.setState({ marginBottom: 0 })}

                >
                    {this.renderMarkers()}
                </MapView>

                <BottomBox>
                    <BottomBoxCircle>
                        <ButtonMain delayPressIn={0} onPress={this.saveParkLocation}>
                            <ParkTextButton>P</ParkTextButton>
                        </ButtonMain>
                    </BottomBoxCircle>
                </BottomBox>

            </Container >
        );
    }
}
