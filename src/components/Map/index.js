import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
//import MapView from "react-native-map-clustering";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { Container, ButtonTest } from './styles';
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

const Map = forwardRef((props, ref) => {

    const [location, setLocation] = useState(initialState);
    const [markers, setMarkers] = useState([]);
    const [marginBottom, setMarginBottom] = useState(1)
    const mapView = useRef(null);

    useEffect(() => {
        getLocation();
        loadMarkersFromDB();
    }, []);

    const getLocation = async () => {

        let granted = null;

        if (Platform.OS === 'android') {
            granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }

        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && granted === PermissionsAndroid.RESULTS.GRANTED)) {
            Geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    setLocation({
                        latitude,
                        longitude,
                        latitudeDelta: initialState.latitudeDelta,
                        longitudeDelta: initialState.longitudeDelta
                    });
                    setMarginBottom(0);
                }, //sucesso
                (error) => { console.warn(JSON.stringify(error)); }, //erro
                {
                    timeout: 2000,
                    enableHighAccuracy: true,
                }
            )
        } else {
            alert('Permissão de localização não concedida');
        }

    }

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
                    userID: props.user._id,
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

    useImperativeHandle(ref, () => {
        return {
            saveParkLocation: saveParkLocation
        };
    });

    //<ButtonTest onPress={teste} />
    const teste = () => {
        const { region } = mapView.current;
        console.log(location);
    }
    return (
        <Container>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1, marginBottom }}
                region={location}
                showsUserLocation={true}
                showsMyLocationButton={true}
                ref={mapView}
                showsTraffic={false}
                loadingEnabled
            >
                {renderMarkers()}
            </MapView>
        </Container >
    );
});
//
export default Map;