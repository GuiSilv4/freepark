import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import MapboxGL, { MapView, PointAnnotation, Camera, UserLocation } from "@react-native-mapbox-gl/maps";
import axios from 'axios';
import { Container, ButtonTest } from './styles';
import { Platform } from "react-native";

MapboxGL.setAccessToken("pk.eyJ1IjoiZ3Vpc2lsdmFkZXYiLCJhIjoiY2tlNnlqOGxnMTgwbjJ6bDYzazB2aDJxdiJ9.Y3XXMcnZrJTFx6njP-Xnkg");

const Map = forwardRef((props, ref) => {

    const [markers, setMarkers] = useState([]);
    const [permission, setPermission] = useState(false);
    const [location, setLocation] = useState([-8.612606, 41.153715])
    const mapViewRef = useRef(null);
    const userLocationRef = useRef(null);

    useEffect(() => {
        MapboxGL.setTelemetryEnabled(false);
        requestPermision();
        loadMarkersFromDB();
    }, []);

    const requestPermision = async () => {
        if (Platform.OS === 'android') {
            const res = await MapboxGL.requestAndroidLocationPermissions();
            setPermission(res);
        }
    };

    const loadMarkersFromDB = async () => {
        const res = await axios.get('https://freepark-backend.herokuapp.com/api/map/load');
        setMarkers(res.data.mapDots);
    };

    const renderMarkers = () => {
        return markers.map(marker => (
            <PointAnnotation
                coordinate={[marker.longitude, marker.latitude]}
                key={marker._id}
                id={marker._id}
            />
        ))
    };

    const saveParkLocation = async () => {
        const coords = getUserLocation();
        const [longitude, latitude] = coords;

        const parkLocation = {
            userID: props.user._id,
            latitude,
            longitude,
            freePark: true,
        };

        console.log(parkLocation);

        const res = await axios.post('https://freepark-backend.herokuapp.com/api/map/save', parkLocation);

        setMarkers([...markers, res.data.mapDot]);

    };

    const getUserLocation = () => {
        if (userLocationRef.current) {
            return userLocationRef.current.state.coordinates;
        }
    };
    //<ButtonTest onPress={getUserLocation} />

    useImperativeHandle(ref, () => {
        return {
            saveParkLocation: saveParkLocation
        };
    });

    return (
        <Container>
            <MapView style={{ flex: 1 }}
                logoEnabled={false}
                compassEnabled={true}
                compassViewPosition={2}
                ref={mapViewRef}

            >
                <Camera
                    centerCoordinate={location}
                    followUserLocation={true}
                    followUserMode='normal'
                    localizeLabels={true}
                    zoomLevel={16}
                />
                <UserLocation
                    renderMode='normal'
                    showUserHeadingIndicator={true}
                    ref={userLocationRef}
                    zoomLevel={17}
                    visible={true}
                ></UserLocation>
                {renderMarkers()}

            </MapView>
        </Container >
    );
});

export default Map;

