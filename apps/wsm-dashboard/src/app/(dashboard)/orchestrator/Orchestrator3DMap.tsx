'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Helpers to position rings
const getPositionOnCircle = (radius: number, index: number, total: number, yOffset: number = 0) => {
  const angle = (index / total) * Math.PI * 2;
  return [Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius] as [number, number, number];
};

function Node({ 
  pos, 
  color, 
  name, 
  type, 
  size = 0.3,
  wireframe = false,
  pulse = false
}: { 
  pos: [number, number, number], 
  color: string, 
  name: string, 
  type: string,
  size?: number,
  wireframe?: boolean,
  pulse?: boolean
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
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 1 : 0.5} 
          metalness={0.5} 
          roughness={0.2}
          wireframe={wireframe}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <Html center position={[0, -size - 0.3, 0]} className="pointer-events-none z-10">
        <div className="bg-[#050505]/80 backdrop-blur border border-white/10 px-2 py-1 rounded text-center whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity">
          <h4 className="text-white text-[10px] font-bold">{name}</h4>
          <p className="text-[8px] text-gray-400 capitalize">{type}</p>
        </div>
      </Html>
    </group>
  );
}

function DataFlow({ src, dst, color }: { src: [number,number,number], dst: [number,number,number], color: string }) {
  const packetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (packetRef.current) {
      const speed = 0.3; // 3 seconds
      const t = (state.clock.elapsedTime * speed) % 1;
      
      const start = new THREE.Vector3(...src);
      const end = new THREE.Vector3(...dst);
      const currentPos = new THREE.Vector3().lerpVectors(start, end, t);
      
      packetRef.current.position.copy(currentPos);
    }
  });

  return (
    <group>
      <Line 
        points={[src, dst]} 
        color={color} 
        lineWidth={1} 
        dashed
        dashSize={0.1}
        gapSize={0.1}
        opacity={0.3}
        transparent
      />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color={color} intensity={1} distance={1} />
      </mesh>
    </group>
  );
}

function NetworkScene({ agents, brands }: { agents: any[], brands: any[] }) {
  // Center node
  const brainPos = [0, 0, 0] as [number, number, number];

  // Map Brands
  const brandNodes = brands.map((b, i) => {
    return {
      id: b.id,
      name: b.name,
      pos: getPositionOnCircle(3, i, brands.length, 1),
      color: '#00D4FF' // Cyan
    };
  });

  // Map Agents
  const agentNodes = agents.map((a, i) => {
    const brandNode = brandNodes.find(b => b.id === a.brandId);
    const pos = getPositionOnCircle(6, i, agents.length, -1);
    return {
      id: a.id,
      name: a.name,
      brandId: a.brandId,
      brandPos: brandNode ? brandNode.pos : brainPos,
      pos,
      color: '#A78BFA' // Purple
    };
  });

  // Map Integrations
  const integrationNodes: any[] = [];
  agents.forEach(a => {
    const agentNode = agentNodes.find(an => an.id === a.id);
    if (!agentNode) return;
    
    a.integrations.forEach((intg: any, idx: number) => {
      // Offset slightly from agent
      const offsetPos = [
        agentNode.pos[0] + (Math.random() * 2 - 1),
        agentNode.pos[1] - 1.5,
        agentNode.pos[2] + (Math.random() * 2 - 1)
      ] as [number, number, number];

      let color = '#ffffff';
      if (intg.platform === 'TELEGRAM') color = '#3B82F6';
      if (intg.platform === 'INSTAGRAM') color = '#EC4899';
      
      integrationNodes.push({
        id: intg.id,
        name: intg.platform,
        agentPos: agentNode.pos,
        pos: offsetPos,
        color
      });
    });
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, -5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 0]} color="#8B5CF6" intensity={3} distance={10} />

      <OrbitControls autoRotate autoRotateSpeed={0.3} enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} />

      {/* Central Brain */}
      <Node pos={brainPos} color="#8B5CF6" name="EcosystemOS" type="Master Brain" size={0.6} wireframe pulse />

      {/* Brands */}
      {brandNodes.map(b => (
        <group key={`brand-${b.id}`}>
          <Node pos={b.pos} color={b.color} name={b.name} type="Brand Hub" size={0.4} />
          <DataFlow src={b.pos} dst={brainPos} color={b.color} />
        </group>
      ))}

      {/* Agents */}
      {agentNodes.map(a => (
        <group key={`agent-${a.id}`}>
          <Node pos={a.pos} color={a.color} name={a.name} type="AI Agent" />
          <DataFlow src={a.pos} dst={a.brandPos} color={a.color} />
        </group>
      ))}

      {/* Integrations */}
      {integrationNodes.map(intg => (
        <group key={`intg-${intg.id}`}>
          <Node pos={intg.pos} color={intg.color} name={intg.name} type="Webhook" size={0.15} />
          <DataFlow src={intg.pos} dst={intg.agentPos} color={intg.color} />
        </group>
      ))}

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}

export default function Orchestrator3DMap({ agents, brands }: { agents: any[], brands: any[] }) {
  return (
    <div className="w-full h-[300px] bg-[#050505] rounded-xl border border-white/5 overflow-hidden mb-6 relative shadow-inner">
      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <NetworkScene agents={agents} brands={brands} />
      </Canvas>
      
      <div className="absolute top-4 left-4 pointer-events-none">
        <h3 className="text-white text-sm font-bold opacity-80">AI Neural Network</h3>
        <p className="text-[10px] text-gray-500">Real-time visualization of bot infrastructure</p>
      </div>
      
      <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] text-gray-500 pointer-events-none bg-[#0a0a0a]/50 px-3 py-1.5 rounded-full backdrop-blur">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span> Core</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span> Brands</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span> AI Agents</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Webhooks</div>
      </div>
    </div>
  );
}
