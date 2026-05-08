"use client"
import React, { useEffect } from 'react'
import L, { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

interface Ilocation {
  latitude: number,
  longitude: number
}

interface Iprops {
  userLocation: Ilocation,
  deliveryBoyLocation: Ilocation
}

function Recenter({ positions }: { positions: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (positions[0] !== 0 && positions[1] !== 0) {
      map.setView(positions, map.getZoom(), {
        animate: true
      })
    }
  }, [positions, map])
  return null
}

function LiveMap({ userLocation, deliveryBoyLocation }: Iprops) {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45]
  })

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45]
  })

  // পলিলাইনের জন্য পজিশন
  const linePositions: [number, number][] = [
    [userLocation.latitude, userLocation.longitude],
    [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
  ];

  const center: [number, number] = [userLocation.latitude, userLocation.longitude];

  return (
    <div className='w-full h-[500px] rounded-xl overflow-hidden shadow relative'>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className='w-full h-full'
      >
        <Recenter positions={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* ইউজারের লোকেশন */}
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>

        {/* ডেলিভারি বয়ের লোকেশন */}
        {deliveryBoyLocation.latitude !== 0 && (
          <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        {/* পথ দেখানোর জন্য পলিলাইন */}
        {deliveryBoyLocation.latitude !== 0 && (
          <Polyline positions={linePositions} color='orange' weight={4} dashArray="5, 10" />
        )}
      </MapContainer>
    </div>
  )
}

export default LiveMap