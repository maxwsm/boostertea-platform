// @ts-nocheck
'use client'

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const EnergyCore = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={sphereRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color="#FF9500"
          emissive="#FF3B00"
          emissiveIntensity={1.5}
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={3}
          wireframe={false}
        />
      </mesh>
      
      {/* Inner Core */}
      <mesh scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00D4FF" wireframe opacity={0.3} transparent />
      </mesh>
    </Float>
  );
};

export const WebGLXRay = () => {
  return (
    <div className="my-16 md:my-24 w-full h-[600px] md:h-[800px] relative rounded-3xl overflow-hidden bg-[#0D0F14] shadow-2xl border border-white/5">
      {/* Overlay Text */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h3 className="text-white/80 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          Молекулярна Екстракція
        </h3>
      </div>
      
      <div className="absolute bottom-8 right-8 z-10 pointer-events-none text-right">
        <div className="text-[#C4956A] font-mono text-2xl font-light">100%</div>
        <div className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">Очищення</div>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />
        
        {/* Magic Particles */}
        <Sparkles 
          count={150} 
          scale={10} 
          size={4} 
          speed={0.4} 
          opacity={0.6} 
          color="#00D4FF" 
        />
        <Sparkles 
          count={50} 
          scale={12} 
          size={6} 
          speed={0.2} 
          opacity={0.8} 
          color="#C4956A" 
        />

        <EnergyCore />

        {/* Cinematic Environment Lighting */}
        <Environment preset="city" />
        
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.5} 
          scale={20} 
          blur={2.5} 
          far={5} 
          color="#00D4FF"
        />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 2 - 0.2}
        />
      </Canvas>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
    </div>
  );
};
