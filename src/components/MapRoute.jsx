import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../utils/towTruckSelection';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    if (!pickup) {
      setPickup([lat, lng]);
      const address = await getAddressFromLatLng(lat, lng);
      setPickupAddress(address);
    } else if (!destination) {
      setDestination([lat, lng]);
      const address = await getAddressFromLatLng(lat, lng);
      setDropOffAddress(address);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  useEffect(() => {
    const calculateRoute = async () => {
      if (pickup && destination) {
        try {
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`);
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0].geometry.coordinates);
            const distanceInMeters = data.routes[0].distance;
            const distanceInKm = distanceInMeters / 1000;
            setDistance(distanceInKm);
            const towTruckType = getTowTruckType(vehicleSize);
            const cost = calculateTotalCost(distanceInKm, towTruckType);
            setTotalCost(cost);
          }
        } catch (error) {
          console.error('Error calculating route:', error);
        }
      }
    };

    calculateRoute();
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <MapContainer center={[26.509672, -100.0095504]} zoom={10} style={{ height: "100%", width: "100%" }} onClick={handleMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pickup && <Marker position={pickup}><Popup>Pickup Location</Popup></Marker>}
        {destination && <Marker position={destination}><Popup>Drop-off Location</Popup></Marker>}
        {route && <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />}
      </MapContainer>
    </Box>
  );
};

export default MapRoute;