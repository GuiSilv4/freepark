import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

const MapContext = createContext({
    location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
    },
    marker: []
});

const initialState = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
}

export const MapProvider = (props) => {
    const [location, setLocation] = useState(initialState);
    const [markers, setMarkers] = useState([]);

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

    };

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

    return (
        <MapContext.Provider
            value={{ loadMarkersFromDB, getLocation, saveParkLocation, location, markers }}>
            {props.children}
        </MapContext.Provider>
    );
};

export function useMap() {
    const context = useContext(MapContext);
    return context;
}