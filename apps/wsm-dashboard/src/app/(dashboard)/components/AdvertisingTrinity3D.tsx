'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Sphere, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// Data nodes
const NODES = [
  { position: [0, 0, 0], color: '#ffffff', label: 'WSM COLOSSEUM', size: 1.5 },
  { position: [-3, 2, -2], color: '#4285F4', label: 'GOOGLE', size: 0.8 },
  { position: [3, 2, -2], color: '#0668E1', label: 'META CAPI', size: 0.8 },
  { position: [0, -3, -1], color: '#00F2FE', label: 'TIKTOK', size: 0.8 },
];

// Lead Particle Simulation Component
function ParticleStreams() {
  const count = 100;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Track particles: position, target Node index, progress
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const sourceNode = Math.floor(Math.random() * 3) + 1; // Google, Meta, TT
      const isRetarget = Math.random() > 0.8;
      temp.push({
        source: NODES[sourceNode].position,
        target: isRetarget ? NODES[sourceNode].position : NODES[0].position, // WSM or back to source
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
        color: new THREE.Color(isRetarget ? '#ff0033' : '#00ff66'),
        isRetarget
      });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.progress += p.speed;
      if (p.progress > 1) {
        // Reset particle
        p.progress = 0;
        p.isRetarget = Math.random() > 0.8;
        p.color = new THREE.Color(p.isRetarget ? '#ff0033' : '#00ff66');
        p.target = p.isRetarget ? p.source : NODES[0].position;
      }

      // Interpolate between source and target
      const sx = p.isRetarget ? NODES[0].position[0] : p.source[0];
      const sy = p.isRetarget ? NODES[0].position[1] : p.source[1];
      const sz = p.isRetarget ? NODES[0].position[2] : p.source[2];

      const tx = p.target[0];
      const ty = p.target[1];
      const tz = p.target[2];

      const x = sx + (tx - sx) * p.progress + Math.sin(p.progress * Math.PI * 4) * 0.2;
      const y = sy + (ty - sy) * p.progress;
      const z = sz + (tz - sz) * p.progress + Math.cos(p.progress * Math.PI * 4) * 0.2;

      dummy.position.set(x, y, z);
      dummy.scale.set(0.1, 0.1, 0.1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, p.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

// Nodes
function NetworkNodes() {
  return (
    <group>
      {NODES.map((node, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={new THREE.Vector3(...node.position)}>
            <sphereGeometry args={[node.size, 32, 32]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={i === 0 ? 0.8 : 0.4} wireframe={i === 0} />
            {/* HTML Annotation removed to preserve extreme minimal look, we rely on UI overlay */}
          </mesh>
        </Float>
      ))}
      <ParticleStreams />
    </group>
  );
}

export default function AdvertisingTrinity3D() {
  return (
    <div className="w-full h-[400px] relative rounded-2xl overflow-hidden bg-[#020202] border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
      {/* Narrative Legend Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-lg tracking-wider">MARTECH TRINITY</h3>
        <p className="text-xs text-zinc-500 font-mono mt-1">Live Ad-Pixel Circulation Node v3.0</p>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none flex flex-col items-end gap-1">
        <span className="flex items-center text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] mr-2 shadow-[0_0_10px_#00ff66]"></span> Conversion Loop
        </span>
        <span className="flex items-center text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#ff0033] mr-2 shadow-[0_0_10px_#ff0033]"></span> Retarget Pulse
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <NetworkNodes />
      </Canvas>
    </div>
  );
}
