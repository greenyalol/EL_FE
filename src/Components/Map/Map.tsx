import React, { useRef, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import axios from 'axios';


export interface Address {
    type: string;
    coordinates: number[];
}

interface Event {
    _id: string;
    creator: string;
    date: string;
    address: Address;
    topic: string;
    category: string[];
    joinedBy: string[];
    savedBy: string[];
    membersAmount: number;
    budget: number;
    imageURL: string;
}

interface MapProps {
    events: Event[];
    height: string
}

const Map: React.FC<MapProps> = ({ events, height }) => {
    const mapContainerRef = useRef<any>(null);
    const [coordinates, setCoordinates] = useState<{ [key: string]: { lat: string, lon: string } }>({});
    const [mapInitialized, setMapInitialized] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Box>
            {/* <div style={{ width: '400px', height: '65vh', marginTop: '50px', borderRadius: '5px' }} ref={mapContainerRef}> */}
            {/* <Flex width='100%' height={height} borderRadius='5px' ref={mapContainerRef}> */}
                <MapContainer center={[32.7941, 34.9896]} zoom={12} style={{ width: '100%', height: height, border: '1px', borderRadius: '5px' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />  
                    {events.map(event => {
                        const lon = event.address.coordinates[0];
                        const lat = event.address.coordinates[1]; 
                        // const latitude = parseFloat(lat);
                        // const longitude = parseFloat(lon);
                        if (!isNaN(lat) && !isNaN(lon)) {
                            return (
                                <Marker
                                    position={[lat, lon]}
                                    icon={
                                        new L.Icon({
                                            iconUrl: 'https://res.cloudinary.com/diunuo4xf/image/upload/v1710009519/EventListener/letter-e2_gyn0sw.png',
                                            iconSize: [30, 30],
                                            iconAnchor: [10, 10],
                                        })
                                    }
                                    key={event._id}
                                >
                                    <Popup>
                                        <strong>{event.topic}</strong>
                                        <br />
                                        {formatDate(event.date)}
                                        <br />
                                        {/* {event.city}, {event.street} {event.street_number} */}
                                    </Popup>
                                </Marker>
                            );
                        } else {
                            console.error(`Invalid latitude or longitude for event '${event.topic}'`);
                            return null;
                        }
                    })}
                </MapContainer>
                {/* </Flex> */}
        </Box>
    );
};

export default Map;