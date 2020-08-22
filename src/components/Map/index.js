import React, { useEffect, useState, useRef } from 'react';
import MapView from "react-native-map-clustering";
import { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Container, ButtonMain, BottomBox, BottomBoxCircle, ParkTextButton, ZoomInButton } from './styles';
import { useAuth } from '../../contexts/auth';
import axios from 'axios';
import { PermissionsAndroid, Platform } from "react-native";

//latitude: 41.1519601105,
//longitude: -8.60556513499,
const initialState = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
}

const Map = () => {
    const [location, setLocation] = useState(initialState);
    const [markers, setMarkers] = useState([]);
    const [marginBottom, setMarginBottom] = useState(1)
    const mapView = useRef(null);

    const { user } = useAuth();

    const getLocation = async () => {

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if (!granted) {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            }
        }
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)))
            Geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    setLocation({
                        latitude,
                        longitude,
                        latitudeDelta: initialState.latitudeDelta,
                        longitudeDelta: initialState.longitudeDelta
                    });
                }, //sucesso
                (error) => { console.warn(JSON.stringify(error)); }, //erro
                {
                    timeout: 2000,
                    enableHighAccuracy: true,
                }
            );
    }

    useEffect(() => {
        getLocation();
        loadMarkersFromDB();
    }, []);


    const saveParkLocation = async () => {

        Geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                setLocation({
                    latitude,
                    longitude,
                    latitudeDelta: location.latitudeDelta,
                    longitudeDelta: location.longitudeDelta
                });
                const parkLocation = {
                    userID: user._id,
                    latitude,
                    longitude,
                    freePark: true,
                };
                //console.log(parkLocation);
                const res = await axios.post('https://freepark-backend.herokuapp.com/api/map/save', parkLocation);
                setMarkers([...markers, res.data.mapDot]);
            }, //sucesso
            (error) => { console.warn(error); }, //erro
            {
                timeout: 2000,
                enableHighAccuracy: true,
            }
        );
    };

    const loadMarkersFromDB = async () => {
        const res = await axios.get('https://freepark-backend.herokuapp.com/api/map/load');
        setMarkers(res.data.mapDots);
    };

    const renderMarkers = () => {
        return markers.map(marker => (
            <Marker
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                key={marker._id}
            />
        ))
    }

    const setNewRegion = (region) => {
        setLocation(region);
    }

    const onMapReady = () => {
        setMarginBottom(0);
    }
    //<ZoomInButton onPress={zoomInMap} />
    return (
        <Container>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1, marginBottom }}
                region={location}
                showsUserLocation
                showsMyLocationButton={true}
                onRegionChangeComplete={setNewRegion}
                ref={mapView}
                showsTraffic={true}
                loadingEnabled
                onMapReady={onMapReady}

            >
                {renderMarkers()}
            </MapView>
            <BottomBox>
                <BottomBoxCircle>
                    <ButtonMain delayPressIn={0} onPress={saveParkLocation}>
                        <ParkTextButton>P</ParkTextButton>
                    </ButtonMain>
                </BottomBoxCircle>
            </BottomBox>

        </Container >
    );
}
//
export default Map;