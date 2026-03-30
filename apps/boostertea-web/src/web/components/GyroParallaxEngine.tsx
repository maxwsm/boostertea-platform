'use client';

import React, { useEffect, useState, useRef } from 'react';
import { HolographicHotspot } from './scrollytelling/HolographicHotspot';

export interface HotspotItem {
  x: number;
  y: number;
  title: string;
  description: string;
  ctaText?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GyroParallaxEngineProps {
  children: React.ReactNode;
  videoUrl?: string; // fallback if we pass a generic 8k string
  posterUrl?: string;
  theme?: 'dark' | 'light';
  hotspots?: HotspotItem[];
}

export const GyroParallaxEngine: React.FC<GyroParallaxEngineProps> = ({ 
  children, 
  videoUrl = '/videos/8k-default-dark.webm',
  posterUrl = '/images/mythbusters-welcome-8k.jpg',
  theme = 'dark',
  hotspots = []
}) => {
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if device supports orientation and request permission (iOS 13+ requires explicit permission)
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!event.beta || !event.gamma) return;

      // Extract beta (front-back tilt) and gamma (left-right tilt)
      // Cap the values to prevent insane flipping. Normal phone usage is -45 to 45 deg.
      let y = Math.min(Math.max(event.beta - 45, -30), 30); // Center around 45deg holding angle
      let x = Math.min(Math.max(event.gamma, -30), 30);

      // Convert angles to a percentage shift mapped to our 3D translation limits.
      // E.g., at 30 degrees tilt, we shift the background 3% to give a deep parallax.
      setGyro({
        x: (x / 30) * -4, // Inverting direction to create depth illusion
        y: (y / 30) * -4, // Inverting direction to create depth illusion
      });
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const requestGyroPermission = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState !== 'granted') {
          console.warn("Gyroscope permission denied.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className="relative w-full h-[100vh] min-h-screen overflow-hidden overflow-y-auto bg-black"
      onClick={requestGyroPermission}
    >
      {/* Cinematic 8K Video Frame locked in the background with 110% scaling to allow panning */}
      <div 
        className="fixed top-0 left-0 w-[110vw] h-[110vh] -ml-[5vw] -mt-[5vh] pointer-events-none z-0"
        style={{
          transform: `translate3d(${gyro.x}%, ${gyro.y}%, 0)`,
          willChange: 'transform',
          transition: 'transform 0.1s ease-out'
        }}
      >
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
          poster={posterUrl}
        >
          <source src={videoUrl} type="video/webm" />
          {/* Fallback MP4 for older Apple devices if WebM fails */}
          <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
        </video>

        {/* Dynamic 8-Point Holographic Matrix Grid over Video */}
        {hotspots.map((spot, idx) => (
          <HolographicHotspot
            key={idx}
            xPercent={spot.x}
            yPercent={spot.y}
            title={spot.title}
            description={spot.description}
            ctaText={spot.ctaText}
            position={spot.position}
            theme={theme}
          />
        ))}
        
        {/* Soft Vignette Overlay to ensure text legibility around edges */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Layer 2: Scrollytelling Content interacting with Gyro but in opposite direction */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full min-h-[100vh] flex flex-col items-center"
        style={{
          transform: `translate3d(${gyro.x * -0.5}%, ${gyro.y * -0.5}%, 0)`,
          willChange: 'transform',
          transition: 'transform 0.15s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};
