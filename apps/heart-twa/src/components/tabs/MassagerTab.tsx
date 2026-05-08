"use client";

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

// 1. Turing Pentagon
function MathPentagon({ speedMultiplier, scale }: { speedMultiplier: number, scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1 * speedMultiplier;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x += delta * 0.2 * speedMultiplier;
      ringsRef.current.rotation.z -= delta * 0.15 * speedMultiplier;
    }
  });

  const radius = 3;
  const height = 4;
  const sides = 5;
  const lines = [];

  for (let i = 0; i < sides; i++) {
    const a1 = (i / sides) * Math.PI * 2;
    const a2 = ((i + 1) / sides) * Math.PI * 2;
    const pB1: [number, number, number] = [Math.cos(a1)*radius, -height/2, Math.sin(a1)*radius];
    const pB2: [number, number, number] = [Math.cos(a2)*radius, -height/2, Math.sin(a2)*radius];
    const pT1: [number, number, number] = [Math.cos(a1)*radius, height/2, Math.sin(a1)*radius];
    const pT2: [number, number, number] = [Math.cos(a2)*radius, height/2, Math.sin(a2)*radius];

    lines.push([pB1, pB2]); // Bottom ring
    lines.push([pT1, pT2]); // Top ring
    lines.push([pB1, pT1]); // Pillars
  }

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#9FB29F" lineWidth={1} transparent opacity={0.4} />
      ))}
      <group ref={ringsRef}>
        <Line 
          points={new THREE.EllipseCurve(0, 0, 2, 2, 0, 2 * Math.PI, false, 0).getPoints(50).map(p => [p.x, p.y, 0] as [number, number, number])} 
          color="#C28E79" lineWidth={2} transparent opacity={0.6} 
        />
        <Line 
          points={new THREE.EllipseCurve(0, 0, 2.5, 2.5, 0, 2 * Math.PI, false, 0).getPoints(50).map(p => [0, p.x, p.y] as [number, number, number])} 
          color="#6A9CBB" lineWidth={1.5} transparent opacity={0.5} 
        />
      </group>
      <Text position={[0, 0, 0]} fontSize={0.3} color="#F7F5F0" anchorX="center" anchorY="middle" fillOpacity={0.8}>
        ∑ f(n) = ∞
      </Text>
    </group>
  );
}

// 2. Lorenz Attractor (Chaos Theory)
function LorenzAttractor({ speedMultiplier, scale }: { speedMultiplier: number, scale: number }) {
  const points: [number, number, number][] = [];
  let x = 0.1, y = 0, z = 0;
  const dt = 0.01;
  const a = 10, b = 28, c = 8 / 3;
  for (let i = 0; i < 2000; i++) {
    const dx = (a * (y - x)) * dt;
    const dy = (x * (b - z) - y) * dt;
    const dz = (x * y - c * z) * dt;
    x += dx; y += dy; z += dz;
    points.push([x * 0.1, y * 0.1, z * 0.1]);
  }
  
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.5 * speedMultiplier;
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, -1.5, 0]}>
      <Line points={points} color="#D9A05B" lineWidth={1.5} transparent opacity={0.8} />
      <Text position={[0, 4, 0]} fontSize={0.3} color="#F7F5F0" anchorX="center" anchorY="middle" fillOpacity={0.8}>
        dx/dt = σ(y - x)
      </Text>
    </group>
  );
}

// 3. Fibonacci Sphere
function FibonacciSphere({ speedMultiplier, scale }: { speedMultiplier: number, scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2 * speedMultiplier;
  });

  const samples = 300;
  const phi = Math.PI * (3 - Math.sqrt(5));
  const points: [number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    points.push([x * 2.5, y * 2.5, z * 2.5]);
  }

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#6A9CBB" transparent opacity={0.8} />
        </mesh>
      ))}
      <Text position={[0, 0, 0]} fontSize={0.3} color="#F7F5F0" anchorX="center" anchorY="middle" fillOpacity={0.8}>
        φ = 1.618
      </Text>
    </group>
  );
}

const MODELS = [
  { id: 'pentagon', name: 'Алгоритм Тюрінга', component: MathPentagon },
  { id: 'lorenz', name: 'Атрактор Лоренца', component: LorenzAttractor },
  { id: 'fibonacci', name: 'Сфера Фібоначчі', component: FibonacciSphere },
];

export function MassagerTab({ isAdhdMode }: { isAdhdMode: boolean }) {
  const [modelIdx, setModelIdx] = useState(0);
  const [userSpeed, setUserSpeed] = useState(1);
  const [userScale, setUserScale] = useState(1);

  const ActiveModel = MODELS[modelIdx].component;
  const baseSpeed = isAdhdMode ? 2.5 : 1;
  const finalSpeed = baseSpeed * userSpeed;

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-6 bg-graphite pb-32">
      <div className="text-center space-y-2 mb-6 z-10">
        <h1 className="text-2xl font-sans font-light tracking-tight text-oatmeal">Масажер для Мозку</h1>
        <p className="text-oatmeal/50 font-mono text-xs uppercase tracking-widest">[ Neural Nomad Mathematics ]</p>
      </div>

      {/* Model Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto w-full max-w-md no-scrollbar py-2">
        {MODELS.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setModelIdx(idx)}
            className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all border ${modelIdx === idx ? 'bg-ocean/20 text-ocean border-ocean/50' : 'bg-oatmeal/5 text-oatmeal/40 border-oatmeal/10'}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className={`w-full max-w-md h-[45vh] rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative border transition-colors ${isAdhdMode ? 'bg-amber/5 border-amber/30' : 'bg-oatmeal/5 border-oatmeal/10'}`}>
        <div className={`absolute top-4 left-4 text-xs font-mono z-10 ${isAdhdMode ? 'text-amber' : 'text-sage/60'}`}>
          {MODELS[modelIdx].name}<br/>
          Δt = {finalSpeed.toFixed(1)}x {isAdhdMode ? '(РДУГ Форсаж)' : ''}
        </div>
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <ActiveModel speedMultiplier={finalSpeed} scale={userScale} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={isAdhdMode ? 1.5 : 0.5} />
        </Canvas>
      </div>

      {/* Sliders (Live Phone Control) */}
      <div className="w-full max-w-md space-y-6 mt-8">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-oatmeal/60 uppercase">
            <span>Синхронізація (Швидкість)</span>
            <span>{userSpeed}x</span>
          </div>
          <input 
            type="range" min="0.1" max="5" step="0.1" 
            value={userSpeed} onChange={(e) => setUserSpeed(parseFloat(e.target.value))}
            className="w-full h-1 bg-oatmeal/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-oatmeal/60 uppercase">
            <span>Масштаб (Геометрія)</span>
            <span>{userScale}x</span>
          </div>
          <input 
            type="range" min="0.5" max="2" step="0.1" 
            value={userScale} onChange={(e) => setUserScale(parseFloat(e.target.value))}
            className="w-full h-1 bg-oatmeal/20 rounded-lg appearance-none cursor-pointer accent-sage"
          />
        </div>
      </div>

      <div className="mt-8 text-center max-w-sm">
        <p className={`text-sm leading-relaxed ${isAdhdMode ? 'text-oatmeal font-bold' : 'text-oatmeal/60 font-light'}`}>
          Змінюйте параметри наживо. Математична симетрія знижує когнітивне навантаження і заспокоює гіперактивну фронтальну кору.
        </p>
      </div>
    </div>
  );
}
