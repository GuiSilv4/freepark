import React, { useEffect, useState, useRef } from 'react';
//import MapView from "react-native-map-clustering";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Container, ButtonTest } from './styles';
import axios from 'axios';
import { useMap } from '../../contexts/map';

//latitude: 41.1519601105,
//longitude: -8.60556513499,

const Map = (props) => {

    const [marginBottom, setMarginBottom] = useState(1);
    const mapView = useRef(null);

    const { getLocation, loadMarkersFromDB, location, markers } = useMap();

    useEffect(() => {
        getLocation();
        loadMarkersFromDB();
    }, []);

    const renderMarkers = () => {
        return markers.map(marker => (
            <Marker
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                key={marker._id}
            />
        ))
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
};
//
export default Map;