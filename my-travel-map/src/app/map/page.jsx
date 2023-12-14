"use client"
// src/app/map/page.jsx
import dynamic from 'next/dynamic';
import React from 'react';

const DynamicMapComponent = dynamic(
  () => import('@/components/MapComponent/MapComponent'), 
  { ssr: false } // 禁止服务器端渲染
);

export default function HomePage() {
  return (
    <div>
      <DynamicMapComponent />
    </div>
  );
}

