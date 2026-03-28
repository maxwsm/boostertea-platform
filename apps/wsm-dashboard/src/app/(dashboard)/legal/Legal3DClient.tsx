'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const NODES = [
  { id: 'taydrink', name: 'ТОВ ТайДрінк', type: 'manufacturer', pos: [0, 0, 0], color: '#00D4FF', desc: 'Central Manufacturing Hub' },
  { id: 'kondratuyk', name: 'ФОП Кондратюк', type: 'grant applicant', pos: [3, 1, 0], color: '#22D3A5', desc: 'Government Grants' },
  { id: 'fedchenko', name: 'ФОП Федченко', type: 'IP controller', pos: [-3, 1, 1], color: '#A78BFA', desc: 'Trademarks & IP Licensing' },
  { id: 'kubeko', name: 'ФОП Кубеко', type: 'supplier', pos: [2, -1, 2], color: '#94B07F', desc: 'Hardware Supplier' },
  { id: 'savelyeva', name: 'ФОП Савельєва', type: 'supplier', pos: [-2, -1, 2], color: '#94B07F', desc: 'Raw Materials Supplier' },
  { id: 'martynovsky', name: 'ФОП Мартиновський', type: 'risk', pos: [0, -2, -2], color: '#F43F5E', desc: 'Debt / Litigation Risk' },
  { id: 'taram', name: 'ТОВ ТараМ', type: 'planned', pos: [-1, 2, -1], color: '#4B5563', desc: 'Real Estate Lease (Planned)' }
];

const LINKS = [
  { src: 'fedchenko', dst: 'taydrink', type: 'license', color: '#A78BFA', dashed: true, width: 2 },
  { src: 'taydrink', dst: 'kondratuyk', type: 'service', color: '#00D4FF', dashed: false, width: 2 },
  { src: 'savelyeva', dst: 'taydrink', type: 'supply', color: '#22D3A5', dashed: false, width: 1.5 },
  { src: 'kubeko', dst: 'taydrink', type: 'supply', color: '#22D3A5', dashed: false, width: 1.5 },
  { src: 'taram', dst: 'taydrink', type: 'lease', color: '#F59E0B', dashed: false, width: 1.5 },
  { src: 'martynovsky', dst: 'taydrink', type: 'loan', color: '#F43F5E', dashed: true, width: 3 }
];

// Single Node Component
function CorporateNode({ node, onClick }: { node: any, onClick: (n: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isRisk = node.id === 'martynovsky';
  const isPlanned = node.id === 'taram';
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;

      // Pulsing for risk
      if (isRisk) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.15;
        meshRef.current.scale.set(scale, scale, scale);
      }
      
      // Hover scaling
      if (!isRisk && hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else if (!isRisk) {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={node.pos as [number, number, number]}>
      <mesh 
        ref={meshRef} 
        onClick={() => onClick(node)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[isPlanned ? 0.3 : 0.4, 32, 32]} />
        <meshStandardMaterial 
          color={node.color} 
          emissive={node.color} 
          emissiveIntensity={hovered ? 0.8 : 0.4} 
          metalness={0.3} 
          roughness={0.5} 
          wireframe={isPlanned || isRisk}
          transparent={isPlanned}
          opacity={isPlanned ? 0.4 : 1}
        />
      </mesh>
      
      <Html center position={[0, -0.6, 0]} className="pointer-events-none">
        <div className="bg-[#0a0a0a]/80 backdrop-blur border border-white/10 px-2 py-1 rounded text-center whitespace-nowrap min-w-[100px]">
          <h4 className="text-white text-xs font-bold">{node.name}</h4>
          <p className="text-[9px] text-gray-400 capitalize">{node.type}</p>
        </div>
      </Html>
    </group>
  );
}

// Single Link with animated document packet
function ContractLink({ link }: { link: any }) {
  const srcNode = NODES.find(n => n.id === link.src);
  const dstNode = NODES.find(n => n.id === link.dst);
  const packetRef = useRef<THREE.Mesh>(null);
  
  // If no document flow intended (e.g. loan risk)
  const isRisk = link.type === 'loan';

  useFrame((state) => {
    if (packetRef.current && srcNode && dstNode && !isRisk) {
      // Interpolate position along the line
      const speed = 0.2; // roughly 5 seconds per pass
      const t = (state.clock.elapsedTime * speed) % 1;
      
      const start = new THREE.Vector3(...srcNode.pos);
      const end = new THREE.Vector3(...dstNode.pos);
      const currentPos = new THREE.Vector3().lerpVectors(start, end, t);
      
      packetRef.current.position.copy(currentPos);
      packetRef.current.rotation.y += 0.05;
      packetRef.current.rotation.x += 0.05;
    }
  });

  if (!srcNode || !dstNode) return null;

  return (
    <group>
      <Line 
        points={[srcNode.pos as [number,number,number], dstNode.pos as [number,number,number]]} 
        color={link.color} 
        lineWidth={link.width} 
        dashed={link.dashed}
        dashSize={0.2}
        gapSize={0.1}
        opacity={0.6}
        transparent
      />
      {!isRisk && (
        <mesh ref={packetRef}>
          <boxGeometry args={[0.1, 0.15, 0.05]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color={link.color} intensity={2} distance={1} />
        </mesh>
      )}
    </group>
  );
}

// Main Canvas Scene
function Scene({ onNodeClick }: { onNodeClick: (n: any) => void }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, -5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 0]} color="#00D4FF" intensity={2} distance={5} />

      <OrbitControls autoRotate autoRotateSpeed={0.5} enableDamping dampingFactor={0.05} minDistance={4} maxDistance={15} />

      {/* Corporate Entities */}
      {NODES.map(node => (
         <CorporateNode key={node.id} node={node} onClick={onNodeClick} />
      ))}

      {/* Contracts & Document Flow */}
      {LINKS.map((link, i) => (
         <ContractLink key={i} link={link} />
      ))}

      {/* Post Processing: Bloom makes emissive materials glow */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}

export default function Legal3DClient() {
  const [activeNode, setActiveNode] = useState<any>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [5, 5, 8], fov: 45 }}>
        <color attach="background" args={['#0D0F14']} />
        <Scene onNodeClick={setActiveNode} />
      </Canvas>

      {/* HTML Overlay Panel */}
      {activeNode && (
        <div className="absolute top-4 right-4 bg-[#111]/90 backdrop-blur p-5 text-sm rounded-xl border border-white/10 w-64 shadow-2xl z-10 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-bold">{activeNode.name}</h3>
            <button onClick={() => setActiveNode(null)} className="text-gray-500 hover:text-white">&times;</button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: activeNode.color, backgroundColor: activeNode.color }}></span>
            <span className="text-xs text-gray-400 capitalize">{activeNode.type}</span>
          </div>
          <p className="text-gray-300 text-xs mb-4">{activeNode.desc}</p>
          
          <div className="border-t border-white/10 pt-3">
             <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Contracts (Links)</div>
             <div className="space-y-1">
               {LINKS.filter(l => l.src === activeNode.id || l.dst === activeNode.id).map((l, i) => {
                 const other = l.src === activeNode.id ? l.dst : l.src;
                 const otherNode = NODES.find(n => n.id === other);
                 return (
                   <div key={i} className="flex items-center justify-between text-xs">
                     <span className="text-gray-400 truncate w-24" title={otherNode?.name}>{otherNode?.name}</span>
                     <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider" style={{ color: l.color, backgroundColor: l.color + '20' }}>{l.type}</span>
                   </div>
                 )
               })}
             </div>
          </div>
        </div>
      )}

      {/* UI Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span> Центральна компанія</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-white animate-pulse"></span> Рух документів</div>
        <div className="flex items-center gap-2"><div className="w-3 border-t-2 border-dashed border-[#F43F5E]"></div> Борг / Блок</div>
      </div>
    </div>
  );
}
