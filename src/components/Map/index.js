import React, { useEffect, useState, useRef } from 'react';
import MapView from "react-native-map-clustering";
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Container } from './styles';
import { useMap } from '../../contexts/map';

const Map = () => {

    const [marginBottom, setMarginBottom] = useState(1);
    const mapRef = useRef();
    const { getLocation, loadMarkersFromDB, location, markers } = useMap();

    //funcoes de mapa que carregam ao abrir aplicacao
    useEffect(() => {
        getLocation();
        loadMarkersFromDB();
    }, []);

    //renderiza os pontos marcados no mapa
    const renderMarkers = () => {
        return markers.map(marker => (
            <Marker
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                key={marker._id}
            />
        ))
    };

    useEffect(() => {
        mapRef.current.animateToRegion(location, 500);
    }, [location]);

    return (
        <Container>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1, marginBottom }}
                ref={mapRef}
                initialRegion={location}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsTraffic={false}
                loadingEnabled
                onMapReady={() => { setMarginBottom(0), getLocation(); }}
            >
                {renderMarkers()}
            </MapView>
        </Container >
    );
};

export default Map;