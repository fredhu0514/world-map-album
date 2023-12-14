// src/components/MapComponent/MapComponent.jsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // 当组件挂载在客户端时设置为 true
  }, []);

  if (!isClient) {
    return null; // 在服务器端渲染时不渲染组件
  }

  const position = [38, -95.00]; // 美国的大致中心点坐标

  return (
    <MapContainer center={position} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 其他地图相关的组件 */}
    </MapContainer>
  );
};

export default MapComponent;