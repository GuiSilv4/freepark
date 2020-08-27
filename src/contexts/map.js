import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import { AppName } from '../constants';


import Geolocation from 'react-native-geolocation-service';

//import Geolocation from '@react-native-community/geolocation';

import { useAuth } from './auth';

const MapContext = createContext({
    location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
    },
    marker: []
});

export const MapProvider = (props) => {

    const initialState = {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
    };

    const [location, setLocation] = useState(initialState);
    const [markers, setMarkers] = useState([]);
    const { user } = useAuth();

    const getLocation = async () => {
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) {
            alert('Permissão de localização não concedida');
            return;
        }
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
                maximumAge: 1000
            }
        )

    };

    hasLocationPermissionIOS = async () => {
        const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
            });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');

        if (status === 'granted') {
            return true;
        }

        if (status === 'denied') {
            Alert.alert('Location permission denied');
        }

        if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow "${AppName}" to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: openSetting },
                    { text: "Don't Use Location", onPress: () => { } },
                ],
            );
        }

        return false;
    };

    hasLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const hasPermission = await this.hasLocationPermissionIOS();
            return hasPermission;
        }

        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show(
                'Location permission denied by user.',
                ToastAndroid.LONG,
            );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show(
                'Location permission revoked by user.',
                ToastAndroid.LONG,
            );
        }

        return false;
    };

    const saveParkLocation = () => {

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
                maximumAge: 1000
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