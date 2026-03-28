'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Helpers
const getPositionOnCircle = (radius: number, index: number, total: number, yOffset: number = 0) => {
  const angle = (index / total) * Math.PI * 2;
  return [Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius] as [number, number, number];
};

function Node({ 
  pos, color, name, type, size = 0.3, wireframe = false, pulse = false
}: { 
  pos: [number, number, number], color: string, name: string, type: string, size?: number, wireframe?: boolean, pulse?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;

      if (pulse) {
        const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.set(s, s, s);
      } else if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={pos}>
      <mesh ref={meshRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 1.5 : 0.8} 
          metalness={0.8} 
          roughness={0.1}
          wireframe={wireframe}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Html center position={[0, -size - 0.4, 0]} className="pointer-events-none z-10">
        <div className="bg-[#050505]/90 backdrop-blur border border-pink-500/20 px-3 py-1.5 rounded-lg text-center whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(236,72,153,0.2)]">
          <h4 className="text-pink-300 text-[11px] font-bold tracking-wider uppercase drop-shadow-md">{name}</h4>
          <p className="text-[9px] text-fuchsia-400/80">{type}</p>
        </div>
      </Html>
    </group>
  );
}

function DataFlow({ src, dst, color }: { src: [number,number,number], dst: [number,number,number], color: string }) {
  const packetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (packetRef.current) {
      const speed = 0.5;
      const t = (state.clock.elapsedTime * speed) % 1;
      const start = new THREE.Vector3(...src);
      const end = new THREE.Vector3(...dst);
      const currentPos = new THREE.Vector3().lerpVectors(start, end, t);
      packetRef.current.position.copy(currentPos);
    }
  });

  return (
    <group>
      <Line points={[src, dst]} color={color} lineWidth={1.5} dashed dashSize={0.2} gapSize={0.1} opacity={0.4} transparent />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color={color} intensity={2} distance={2} />
      </mesh>
    </group>
  );
}

function AiNeuralScene() {
  const corePos = [0, 0, 0] as [number, number, number];

  const subNodes = [
    { id: 1, name: 'Behavior Archive', type: 'Prisma DB', color: '#EC4899' },
    { id: 2, name: 'Task Oversight', type: 'NLP Analyzer', color: '#A855F7' },
    { id: 3, name: 'ROI Predictor', type: 'Math Node', color: '#06B6D4' },
    { id: 4, name: 'Sentiment Mirror', type: 'Processor', color: '#EC4899' },
    { id: 5, name: 'Omni-Router', type: 'Hono Edge', color: '#8B5CF6' }
  ].map((n, i, arr) => ({
    ...n,
    pos: getPositionOnCircle(5, i, arr.length, 0)
  }));

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, -5]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 0, 0]} color="#EC4899" intensity={4} distance={15} />

      <OrbitControls autoRotate autoRotateSpeed={0.5} enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} />

      {/* TAI_COO Main Core */}
      <Node pos={corePos} color="#E879F9" name="TAI_COO" type="Cognitive Core" size={0.8} wireframe pulse />

      {/* Sub Nodes */}
      {subNodes.map(node => (
        <group key={`node-${node.id}`}>
          <Node pos={node.pos} color={node.color} name={node.name} type={node.type} size={0.4} />
          <DataFlow src={node.pos} dst={corePos} color={node.color} />
        </group>
      ))}

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={2.5} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    </>
  );
}

export default function Ai3DCanvas() {
  return (
    <div className="w-full h-[500px] bg-[#030005] rounded-xl border border-pink-500/20 overflow-hidden mb-6 relative shadow-[inset_0_0_50px_rgba(236,72,153,0.05)]">
      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <color attach="background" args={['#030005']} />
        <AiNeuralScene />
      </Canvas>
      
      <div className="absolute top-6 left-6 pointer-events-none">
        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 text-lg font-bold tracking-widest uppercase">TAI_COO Neural Matrix</h3>
        <p className="text-xs text-fuchsia-500/60 font-mono mt-1">Live telemetry of cognitive sub-routines</p>
      </div>
      
      <div className="absolute bottom-6 right-6 flex gap-4 text-[10px] text-fuchsia-300/60 pointer-events-none bg-[#0a000a]/60 px-4 py-2 rounded-full backdrop-blur border border-pink-500/20 font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#E879F9] shadow-[0_0_8px_#E879F9]"></span> Core</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EC4899] shadow-[0_0_8px_#EC4899]"></span> Analyzers</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"></span> Math Nodes</div>
      </div>
    </div>
  );
}
