import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png', // 确保这个路径是正确的
  shadowUrl: null,
  iconSize: [41, 41], // 根据您的图标大小进行调整
  iconAnchor: [10, 35], // 通常是图标宽度的一半和图标高度
});

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [isPKeyPressed, setIsPKeyPressed] = useState(false);

  // 检测 "P" 键是否被按下
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPKeyPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPKeyPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 地图事件处理组件
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (isPKeyPressed) {
          const newMarker = {
            latlng: e.latlng,
            photos: []
          };
          setMarkers(currentMarkers => [...currentMarkers, newMarker]);
        }
      }
    });

    return null;
  };

  return (
    <MapContainer center={[38, -95.00]} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.latlng} icon={customIcon}>
          {/* 弹出窗口逻辑 */}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
