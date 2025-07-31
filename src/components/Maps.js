import React, { useState } from 'react';
import ReactMapGL, { FullscreenControl, Marker, Popup } from 'react-map-gl'
import {categories} from "../constants/DataConstant"
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the Mapbox CSS

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FuZ3Nha2F3aXJhIiwiYSI6ImNqdXBhajZmeTBudXg0NG50YjdhcDF2amUifQ.NmC56k1T54xEKGmlrFOxRA';

const MapboxMap = ({ projects }) => {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '500px',
        latitude: -2.990934,
        longitude: 104.756554,
        zoom: 8
    });

    return (
        <div style={{ width: '100%', }}>
            <ReactMapGL
                mapboxApiAccessToken={'pk.eyJ1Ijoic2FuZ3Nha2F3aXJhIiwiYSI6ImNqdXBhajZmeTBudXg0NG50YjdhcDF2amUifQ.NmC56k1T54xEKGmlrFOxRA'}
                {...viewport}
                width={"100%"}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/mapbox/streets-v11"  // You can change th
            >
                {projects.map(data => {
                    const matchedCategory = categories.find(category => category.label === data.kategori);

                    return (
                        // <Marker longitude={parseFloat(data.longitude)} latitude={parseFloat(data.latitude)} color="red" />
                        <Marker
                            latitude={parseFloat(data.latitude)}
                            longitude={parseFloat(data.longitude)}
                            draggable={false}
                            // onDragEnd={handleMarkerDragEnd}
                        >
                            <div style={{ backgroundColor: matchedCategory ? matchedCategory.color : 'red', width: '15px', height: '15px', borderRadius: '50%' }}></div>
                        </Marker>
                    )
                })}
            </ReactMapGL>
        </div>
    );
};

export default MapboxMap;
