'use client'

"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// This is a placeholder model component.
// In the final version, this will load a GLTF model.
const ThermosModel = () => {
  const meshRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (meshRef.current) {
      // Rotate based on scroll progress (0 to 1)
      const r1 = scroll.range(0, 1);
      meshRef.current.rotation.y = r1 * Math.PI * 2;
      
      // X-Ray effect: Move parts apart based on scroll
      const r2 = scroll.curve(0.3, 0.4);
      meshRef.current.children.forEach((child, i) => {
        child.position.y = r2 * (i * 2);
      });
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Shell */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 4, 32]} />
        <meshPhysicalMaterial 
          color="#111111" 
          metalness={0.9} 
          roughness={0.1}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      {/* Inner Flask */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 3.8, 32]} />
        <meshPhysicalMaterial 
          color="#00f0ff" 
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.5, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
    </group>
  );
};

export const WebGLXRay = () => {
  // Wait, React Three Fiber requires a Canvas context, which we will wrap this component in
  // Usually we'd do:
  // import { Canvas } from '@react-three/fiber';
  // import { ScrollControls } from '@react-three/drei';
  //
  // return (
  //   <div className="h-[200vh] w-full relative">
  //     <div className="sticky top-0 h-screen w-full">
  //       <Canvas>
  //         ...
  return (
    <div className="my-20 h-[100vh] relative glass rounded-3xl overflow-hidden flex items-center justify-center border border-[var(--primary)]/20">
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-12 text-center z-10 pointer-events-none">
        <div>
          <h3 className="text-3xl font-black text-white font-mono mb-4 tracking-widest">[ 3D RENDER ENGINE ]</h3>
          <p className="text-[var(--secondary)]/80 text-xl max-w-lg mx-auto">
            (Three.js + React-Three-Fiber will render the interactive Thermos model here. Scrolling down will dissect the model layer by layer via GSAP ScrollTrigger).
          </p>
        </div>
      </div>
      {/* 
        This is where the actual <Canvas> and <ScrollControls> from R3F will go.
        Kept as placeholder due to model dependencies.
      */}
      <div className="w-full h-full opacity-20 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
    </div>
  );
};
