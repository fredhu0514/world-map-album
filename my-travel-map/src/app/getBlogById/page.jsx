"use client"

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicBlogComponent = dynamic(
  () => import('@/components/Blog/BlogComponent.jsx'),
  { ssr: false } // 禁止服务器端渲染
);

export default function HomePage() {
  return (
    <div>
      <DynamicBlogComponent />
    </div>
  );
}