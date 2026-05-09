"use client";

/**
 * CAUSAL CHAIN 3D — Interactive cause-effect graph
 * 
 * 4 layers of nodes (Chemistry → Organism → Energy → Sensorics)
 * connected by animated edges showing causal links.
 * 
 * Uses React Three Fiber + Drei for:
 * - OrbitControls (rotate, zoom, pan)
 * - Animated particle flow along edges
 * - Pulsing nodes proportional to intensity
 * - Touch-friendly mobile controls
 */

import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Network, RotateCcw } from "lucide-react";

// ─── TYPES ─────────────────────────
interface CausalChainData {
  chemistry: Record<string, number>;
  organism: Record<string, number>;
  energy: Record<string, number>;
  sensorics: { zone: string; sensation: string; intensity: number }[];
  causalLinks: { from: string; to: string; mechanism: string; strength: number }[];
}

interface CausalChain3DProps {
  data: CausalChainData;
  isAdhdMode: boolean;
}

// ─── NODE POSITIONS ─────────────────────────
// 4 layers arranged vertically (Y axis) with nodes spread on XZ
const LAYER_COLORS = {
  chemistry: "#ef4444",
  organism: "#d9a05b",
  energy: "#6a9cbb",
  sensorics: "#9fb29f",
};

const LAYER_Y = {
  chemistry: 2.5,
  organism: 0.8,
  energy: -0.8,
  sensorics: -2.5,
};

interface NodeData {
  id: string;
  label: string;
  value: number;
  layer: keyof typeof LAYER_COLORS;
  position: [number, number, number];
}

function buildNodes(data: CausalChainData): NodeData[] {
  const nodes: NodeData[] = [];
  const spread = 1.2;

  // Chemistry layer
  const chemKeys = Object.entries(data.chemistry);
  chemKeys.forEach(([key, val], i) => {
    const angle = (i / chemKeys.length) * Math.PI * 2;
    nodes.push({
      id: `chem_${key}`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.abs(val),
      layer: "chemistry" as const,
      position: [Math.cos(angle) * spread, LAYER_Y.chemistry, Math.sin(angle) * spread] as [number, number, number],
    });
  });

  // Organism layer
  const orgKeys = Object.entries(data.organism);
  orgKeys.forEach(([key, val], i) => {
    const angle = (i / orgKeys.length) * Math.PI * 2 + 0.3;
    nodes.push({
      id: `org_${key}`,
      label: key,
      value: val,
      layer: "organism" as const,
      position: [Math.cos(angle) * spread * 0.9, LAYER_Y.organism, Math.sin(angle) * spread * 0.9] as [number, number, number],
    });
  });

  // Energy layer
  const enKeys = Object.entries(data.energy);
  enKeys.forEach(([key, val], i) => {
    const x = (i - 1) * spread;
    nodes.push({
      id: `en_${key}`,
      label: key,
      value: val,
      layer: "energy" as const,
      position: [x, LAYER_Y.energy, 0] as [number, number, number],
    });
  });

  // Sensorics layer
  data.sensorics.forEach((s, i) => {
    const angle = (i / Math.max(data.sensorics.length, 1)) * Math.PI * 2 + 0.5;
    nodes.push({
      id: `sens_${i}`,
      label: s.zone,
      value: s.intensity,
      layer: "sensorics" as const,
      position: [Math.cos(angle) * spread * 0.8, LAYER_Y.sensorics, Math.sin(angle) * spread * 0.8] as [number, number, number],
    });
  });

  return nodes;
}

// ─── 3D NODE COMPONENT ─────────────────────────
function CausalNode({ node, onClick }: { node: NodeData; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = LAYER_COLORS[node.layer];
  const scale = 0.08 + (node.value / 100) * 0.15;

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + node.value * 0.1) * 0.02 * (node.value / 100);
      meshRef.current.scale.setScalar(scale + pulse);
    }
  });

  return (
    <group position={node.position}>
      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[scale * 2, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>

      {/* Core sphere */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[scale, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4 + (node.value / 100) * 0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -scale - 0.12, 0]}
        fontSize={0.08}
        color="#F7F5F0"
        anchorX="center"
        anchorY="top"
        font="/fonts/Inter-Regular.woff"
        maxWidth={1}
      >
        {node.label}
      </Text>

      {/* Value label */}
      <Text
        position={[0, scale + 0.08, 0]}
        fontSize={0.06}
        color={color}
        anchorX="center"
        anchorY="bottom"
      >
        {`${node.value}`}
      </Text>
    </group>
  );
}

// ─── CAUSAL LINK COMPONENT ─────────────────────────
function CausalLink({ from, to, strength }: { from: [number, number, number]; to: [number, number, number]; strength: number }) {
  const opacity = 0.15 + (strength / 100) * 0.5;
  const color = strength > 70 ? "#ef4444" : strength > 40 ? "#d9a05b" : "#6a9cbb";

  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={1 + (strength / 100) * 2}
      opacity={opacity}
      transparent
    />
  );
}

// ─── LAYER RING ─────────────────────────
function LayerRing({ y, color, label }: { y: number; color: string; label: string }) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.35, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[1.6, 0, 0]}
        fontSize={0.07}
        color={color}
        anchorX="left"
      >
        {label}
      </Text>
    </group>
  );
}

// ─── MAIN SCENE ─────────────────────────
function CausalScene({ data, onNodeClick }: { data: CausalChainData; onNodeClick: (nodeId: string) => void }) {
  const nodes = useMemo(() => buildNodes(data), [data]);
  
  // Resolve causal link positions
  const links = useMemo(() => {
    return data.causalLinks.map((link) => {
      // Try to find matching nodes by partial name match
      const fromNode = nodes.find((n) => 
        link.from.toLowerCase().includes(n.label.toLowerCase()) ||
        n.label.toLowerCase().includes(link.from.toLowerCase().split(" ")[0])
      );
      const toNode = nodes.find((n) => 
        link.to.toLowerCase().includes(n.label.toLowerCase()) ||
        n.label.toLowerCase().includes(link.to.toLowerCase().split(" ")[0])
      );

      if (!fromNode || !toNode) return null;
      return { from: fromNode.position, to: toNode.position, strength: link.strength };
    }).filter(Boolean) as { from: [number, number, number]; to: [number, number, number]; strength: number }[];
  }, [data.causalLinks, nodes]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 5, 3]} intensity={0.8} color="#F7F5F0" />
      <pointLight position={[-2, -3, 2]} intensity={0.4} color="#6a9cbb" />

      {/* Layer rings */}
      <LayerRing y={LAYER_Y.chemistry} color={LAYER_COLORS.chemistry} label="ХІМІЯ" />
      <LayerRing y={LAYER_Y.organism} color={LAYER_COLORS.organism} label="ОРГАНІЗМ" />
      <LayerRing y={LAYER_Y.energy} color={LAYER_COLORS.energy} label="ЕНЕРГІЯ" />
      <LayerRing y={LAYER_Y.sensorics} color={LAYER_COLORS.sensorics} label="СЕНСОРИКА" />

      {/* Causal links (draw first, behind nodes) */}
      {links.map((link, i) => (
        <CausalLink key={i} from={link.from} to={link.to} strength={link.strength} />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <CausalNode key={node.id} node={node} onClick={() => onNodeClick(node.id)} />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// ─── EXPORTED COMPONENT ─────────────────────────
export function CausalChain3D({ data, isAdhdMode }: CausalChain3DProps) {
  const [selectedLink, setSelectedLink] = useState<typeof data.causalLinks[0] | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  if (!data || !data.causalLinks) return null;

  return (
    <div className="w-full rounded-[24px] bg-graphite/40 border border-oatmeal/10 overflow-hidden mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h3 className="text-[10px] font-mono text-oatmeal/40 uppercase tracking-widest flex items-center gap-2">
          <Network size={14} className="text-ocean" />
          Причинно-наслідковий ланцюг
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-[9px] font-mono text-oatmeal/30 hover:text-oatmeal/60 transition-colors"
        >
          {showInfo ? "Сховати" : "Що це?"}
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 overflow-hidden"
          >
            <p className="text-[10px] text-oatmeal/40 pb-2 leading-relaxed">
              4 рівні: Хімія → Організм → Енергія → Сенсорика.
              Лінії показують причинно-наслідкові зв'язки.
              Крутіть, зумте, натискайте на вузли.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div className="w-full h-[350px] relative">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
          </div>
        }>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
          >
            <CausalScene 
              data={data} 
              onNodeClick={(nodeId) => {
                // Find related causal link
                const link = data.causalLinks.find(l => 
                  nodeId.includes(l.from.toLowerCase().split(" ")[0]) ||
                  nodeId.includes(l.to.toLowerCase().split(" ")[0])
                );
                if (link) setSelectedLink(link);
              }}
            />
          </Canvas>
        </Suspense>

        {/* Rotate hint */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[8px] text-oatmeal/20 font-mono">
          <RotateCcw size={10} /> Крутіть та зумте
        </div>
      </div>

      {/* Selected link detail */}
      <AnimatePresence>
        {selectedLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-5 pb-4"
          >
            <div className="p-3 rounded-[14px] bg-oatmeal/5 border border-oatmeal/10">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono font-bold ${isAdhdMode ? "text-xs" : "text-[10px]"} text-oatmeal/70`}>
                  {selectedLink.from} → {selectedLink.to}
                </span>
                <button onClick={() => setSelectedLink(null)} className="text-oatmeal/30 text-xs">✕</button>
              </div>
              <p className={`text-oatmeal/50 leading-relaxed ${isAdhdMode ? "text-xs" : "text-[10px]"}`}>
                {selectedLink.mechanism}
              </p>
              <div className="mt-1.5 h-1 bg-oatmeal/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedLink.strength}%` }}
                  className="h-full bg-red-400 rounded-full"
                />
              </div>
              <span className="text-[8px] font-mono text-oatmeal/30 mt-0.5 block text-right">
                Сила зв'язку: {selectedLink.strength}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Causal links list */}
      <div className="px-5 pb-4">
        <p className="text-[9px] font-mono text-oatmeal/30 uppercase tracking-widest mb-2">
          Ланцюги ({data.causalLinks.length})
        </p>
        <div className="space-y-1">
          {data.causalLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => setSelectedLink(link)}
              className="w-full text-left p-2 rounded-[10px] hover:bg-oatmeal/5 transition-colors flex items-center gap-2"
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                link.strength > 70 ? "bg-red-400" : link.strength > 40 ? "bg-amber" : "bg-ocean"
              }`} />
              <span className="text-[10px] text-oatmeal/50 truncate flex-1">
                {link.from} → {link.to}
              </span>
              <span className="text-[9px] font-mono text-oatmeal/30">{link.strength}%</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
