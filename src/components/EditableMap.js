import React, { useState } from 'react';
import Map, { FullscreenControl, Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the Mapbox CSS

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FuZ3Nha2F3aXJhIiwiYSI6ImNqdXBhajZmeTBudXg0NG50YjdhcDF2amUifQ.NmC56k1T54xEKGmlrFOxRA';

const MapboxMap = ({ latitude, longitude, onMarkerChange }) => {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '500px',
        latitude: latitude ? latitude : -2.990934,
        longitude: longitude ? longitude :104.756554,
        zoom: 8
    });

    const [marker, setMarker] = useState({
        latitude: latitude ? latitude : -2.990934,
        longitude: longitude ? longitude :104.756554,
    });

    const handleMarkerDragEnd = (event) => {
        setMarker({
            latitude: event.lngLat[1],
            longitude: event.lngLat[0]
        });

        // Call the passed in prop to update parent component state
        if (onMarkerChange) {
            onMarkerChange(event.lngLat[1], event.lngLat[0]);
        }
    };

    return (
        <div style={{ width: '100%', }}>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
            {(latitude && longitude) && (
                <Map
                mapboxApiAccessToken={'pk.eyJ1Ijoic2FuZ3Nha2F3aXJhIiwiYSI6ImNqdXBhajZmeTBudXg0NG50YjdhcDF2amUifQ.NmC56k1T54xEKGmlrFOxRA'}
                {...viewport}
                width={"100%"}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/mapbox/streets-v11"  // You can change th
            >
                <Marker
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                >
                    <div style={{ backgroundColor: 'red', width: '15px', height: '15px', borderRadius: '50%' }}></div>
                </Marker>
            </Map>
            )}
        </div>
    );
};

export default MapboxMap;
