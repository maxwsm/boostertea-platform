"use client";

/**
 * NEURAL GRAPH 3D — Interactive shadow constellation
 * 
 * Maps all detected shadows as 3D nodes in a neural network.
 * Node size = intensity, connections = how shadows reinforce each other.
 * User can rotate, zoom, tap nodes to see chemistry.
 */

import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, RotateCcw } from "lucide-react";
import { SHADOWS_DATABASE, type Shadow } from "@/data/shadowsDatabase";

interface ShadowNode {
  shadow: Shadow;
  intensity: number; // 0-100
}

interface NeuralGraph3DProps {
  activeShadows: ShadowNode[];
  primaryShadowId: string;
  isAdhdMode: boolean;
}

// Shadow accent colors for 3D
const SHADOW_3D_COLORS: Record<string, string> = {
  escapist: "#d9a05b",
  perfectionist: "#ef4444",
  victim: "#94a3b8",
  aggressor: "#dc2626",
  impostor: "#a855f7",
  rescuer: "#6a9cbb",
  manipulator: "#c99a3a",
  dissociator: "#64748b",
};

// Shadow interconnection strength (how they feed each other)
const SHADOW_CONNECTIONS: Record<string, string[]> = {
  escapist: ["victim", "dissociator"],
  perfectionist: ["impostor", "aggressor"],
  victim: ["rescuer", "escapist", "manipulator"],
  aggressor: ["perfectionist", "manipulator"],
  impostor: ["victim", "perfectionist"],
  rescuer: ["victim", "perfectionist"],
  manipulator: ["aggressor", "victim"],
  dissociator: ["escapist", "victim"],
};

// ─── SHADOW SPHERE ─────────────────────────
function ShadowSphere({
  node,
  position,
  isPrimary,
  onClick,
}: {
  node: ShadowNode;
  position: [number, number, number];
  isPrimary: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = SHADOW_3D_COLORS[node.shadow.id] || "#888";
  const baseScale = isPrimary ? 0.35 : 0.15 + (node.intensity / 100) * 0.2;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      const breath = Math.sin(t * 1.5 + node.intensity * 0.05) * 0.02;
      meshRef.current.scale.setScalar(baseScale + breath);
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + node.intensity * 0.03) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[baseScale * 2.5, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} />
      </mesh>

      {/* Core */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[baseScale, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isPrimary ? 0.8 : 0.3 + (node.intensity / 100) * 0.5}
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={0.7 + (node.intensity / 100) * 0.3}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -baseScale - 0.15, 0]}
        fontSize={isPrimary ? 0.1 : 0.07}
        color="#F7F5F0"
        anchorX="center"
        anchorY="top"
        maxWidth={1.5}
      >
        {node.shadow.name.split(" (")[0]}
      </Text>

      {/* Intensity badge */}
      <Text
        position={[baseScale + 0.05, baseScale + 0.05, 0]}
        fontSize={0.06}
        color={color}
        anchorX="left"
        anchorY="bottom"
      >
        {`${node.intensity}%`}
      </Text>
    </group>
  );
}

// ─── NEURAL CONNECTION ─────────────────────────
function NeuralConnection({ from, to, strength }: { from: [number, number, number]; to: [number, number, number]; strength: number }) {
  const opacity = 0.1 + (strength / 100) * 0.3;
  
  return (
    <Line
      points={[from, to]}
      color="#F7F5F0"
      lineWidth={0.5 + (strength / 100) * 1.5}
      opacity={opacity}
      transparent
    />
  );
}

// ─── SCENE ─────────────────────────
function NeuralScene({
  nodes,
  primaryId,
  onNodeClick,
}: {
  nodes: ShadowNode[];
  primaryId: string;
  onNodeClick: (shadow: Shadow) => void;
}) {
  // Calculate positions — primary in center, others in orbit
  const positions = useMemo<Map<string, [number, number, number]>>(() => {
    const map = new Map<string, [number, number, number]>();
    const primaryIdx = nodes.findIndex((n) => n.shadow.id === primaryId);

    if (primaryIdx >= 0) {
      map.set(nodes[primaryIdx].shadow.id, [0, 0, 0]);
    }

    const others = nodes.filter((n) => n.shadow.id !== primaryId);
    others.forEach((n, i) => {
      const angle = (i / others.length) * Math.PI * 2;
      const radius = 1.2 + (i % 2) * 0.3;
      map.set(
        n.shadow.id,
        [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 0.6,
          Math.sin(angle) * radius
        ]
      );
    });

    return map;
  }, [nodes, primaryId]);

  // Connections
  const connections = useMemo(() => {
    const conns: { from: [number, number, number]; to: [number, number, number]; strength: number }[] = [];
    
    nodes.forEach((node) => {
      const related = SHADOW_CONNECTIONS[node.shadow.id] || [];
      related.forEach((targetId) => {
        const fromPos = positions.get(node.shadow.id);
        const toPos = positions.get(targetId);
        if (fromPos && toPos) {
          const sourceNode = nodes.find((n) => n.shadow.id === node.shadow.id);
          const targetNode = nodes.find((n) => n.shadow.id === targetId);
          if (sourceNode && targetNode) {
            conns.push({
              from: fromPos,
              to: toPos,
              strength: (sourceNode.intensity + targetNode.intensity) / 2,
            });
          }
        }
      });
    });

    return conns;
  }, [nodes, positions]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 3, 2]} intensity={0.6} color="#F7F5F0" />
      <pointLight position={[-1, -2, 1]} intensity={0.3} color="#6a9cbb" />

      {/* Connections */}
      {connections.map((conn, i) => (
        <NeuralConnection key={i} from={conn.from} to={conn.to} strength={conn.strength} />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <ShadowSphere
          key={node.shadow.id}
          node={node}
          position={positions.get(node.shadow.id) || [0, 0, 0]}
          isPrimary={node.shadow.id === primaryId}
          onClick={() => onNodeClick(node.shadow)}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ─── EXPORTED COMPONENT ─────────────────────────
export function NeuralGraph3D({ activeShadows, primaryShadowId, isAdhdMode }: NeuralGraph3DProps) {
  const [selectedShadow, setSelectedShadow] = useState<Shadow | null>(null);

  if (!activeShadows.length) return null;

  return (
    <div className="w-full rounded-[24px] bg-graphite/40 border border-oatmeal/10 overflow-hidden mt-4">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h3 className="text-[10px] font-mono text-oatmeal/40 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-red-400" />
          Нейронний граф тіней
        </h3>
        <span className="text-[9px] font-mono text-oatmeal/20">
          {activeShadows.length} активних
        </span>
      </div>

      <div className="w-full h-[300px] relative">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 3.5], fov: 50 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
          >
            <NeuralScene
              nodes={activeShadows}
              primaryId={primaryShadowId}
              onNodeClick={setSelectedShadow}
            />
          </Canvas>
        </Suspense>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[8px] text-oatmeal/20 font-mono">
          <RotateCcw size={10} /> Торкніться вузла
        </div>
      </div>

      {/* Selected shadow detail */}
      <AnimatePresence>
        {selectedShadow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-4 overflow-hidden"
          >
            <div className="p-3 rounded-[14px] bg-oatmeal/5 border border-oatmeal/10">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-oatmeal ${isAdhdMode ? "text-sm" : "text-xs"}`}>
                  {selectedShadow.name}
                </span>
                <button onClick={() => setSelectedShadow(null)} className="text-oatmeal/30 text-xs">✕</button>
              </div>

              {/* Chemistry bars */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {Object.entries(selectedShadow.chemistry).map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[7px] font-mono text-oatmeal/30 uppercase">
                      {key.slice(0, 4)}
                    </span>
                    <div className="h-1 bg-oatmeal/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ocean rounded-full transition-all"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                    <span className="text-[7px] font-mono text-oatmeal/20">{val}</span>
                  </div>
                ))}
              </div>

              <p className={`text-oatmeal/50 leading-relaxed ${isAdhdMode ? "text-xs" : "text-[10px]"}`}>
                {selectedShadow.behavior}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
