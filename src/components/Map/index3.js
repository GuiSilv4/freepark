import React, { useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Container } from './styles';
import { useMap } from '../../contexts/map';

//latitude: 41.1519601105,
//longitude: -8.60556513499,

const Map = () => {

    const [marginBottom, setMarginBottom] = useState(1);
    const mapView = useRef(null);

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
                onMapReady={() => { setMarginBottom(0) }}
            >
                {renderMarkers()}
            </MapView>
        </Container >
    );
};
//
export default Map;