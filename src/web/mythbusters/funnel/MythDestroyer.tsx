"use client";
import { useState, useRef, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, Sparkles } from '@react-three/drei';
import { Button } from '@myth/components/ui/button';
import { useFunnelStore } from '@myth/store/funnelStore';
import { useTranslation } from '@myth/hooks/useTranslation';
import { Hammer, Zap } from 'lucide-react';
import * as THREE from 'three';

// 3D Tea Bag Component - memoized for performance
const TeaBag = memo(function TeaBag({ destroyed, onDestroy }: { destroyed: boolean; onDestroy: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !destroyed) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });
  
  if (destroyed) return null;
  
  return (
    <group>
      {/* Tea Bag */}
      <mesh
        ref={meshRef}
        onClick={onDestroy}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial 
          color="#d4a574" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* String */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      {/* Label */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      {/* Label accent - X mark */}
      <group position={[0, 2.2, 0.03]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.05, 0.02]} />
          <meshStandardMaterial color="#8B1A1A" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.05, 0.02]} />
          <meshStandardMaterial color="#8B1A1A" />
        </mesh>
      </group>
    </group>
  );
});

// Particles explosion - optimized for performance
const ParticleExplosion = memo(function ParticleExplosion({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50; // Reduced from 100 for better performance
  
  const { geometry, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const vels = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.1 + Math.random() * 0.2;
      
      vels[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vels[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      vels[i * 3 + 2] = speed * Math.cos(phi);
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    return { geometry: geo, velocities: vels };
  }, []);
  
  useFrame(() => {
    if (!particlesRef.current || !active) return;
    
    const posAttr = particlesRef.current.geometry.attributes.position;
    const positions = posAttr.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      
      velocities[i * 3 + 1] -= 0.005; // Gravity
    }
    
    posAttr.needsUpdate = true;
  });
  
  if (!active) return null;
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.1}
        color="#C9A227"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
});

// Revealed Truth - memoized
const RevealedTruth = memo(function RevealedTruth() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Center>
        <group>
          {/* Tea leaves */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.5,
                Math.sin((i / 8) * Math.PI * 2) * 1.5,
                0
              ]}
              rotation={[0, 0, (i / 8) * Math.PI * 2]}
            >
              <planeGeometry args={[0.8, 0.4]} />
              <meshStandardMaterial 
                color="#4a7c59" 
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
          
          {/* Center glow */}
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              color="#C9A227" 
              emissive="#C9A227"
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Glowing ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2, 0.05, 16, 100]} />
            <meshStandardMaterial 
              color="#C9A227" 
              emissive="#C9A227"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      </Center>
    </Float>
  );
});

// Main component - optimized
export default function MythDestroyer() {
  const [destroyed, setDestroyed] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const { setStep } = useFunnelStore();
  const { t } = useTranslation();
  const [clickCount, setClickCount] = useState(0);
  const clicksNeeded = 3;
  
  const handleDestroy = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= clicksNeeded) {
      setShowExplosion(true);
      setTimeout(() => {
        setDestroyed(true);
      }, 500);
    }
  }, [clickCount, clicksNeeded]);
  
  const handleContinue = useCallback(() => {
    setStep('quiz');
  }, [setStep]);
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
          {t('funnel.destroy.title')}
        </h2>
        <p className="text-white/60">
          {t('funnel.destroy.subtitle').replace('{clicks}', clicksNeeded.toString())}
        </p>
      </motion.div>
      
      {/* 3D Canvas */}
      <div className="relative w-full max-w-lg aspect-square">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C9A227" />
          
          <TeaBag destroyed={destroyed} onDestroy={handleDestroy} />
          <ParticleExplosion active={showExplosion} />
          {destroyed && <RevealedTruth />}
          
          {/* Sparkles */}
          {destroyed && (
            <Sparkles
              count={50}
              scale={5}
              size={2}
              speed={1}
              color="#C9A227"
            />
          )}
        </Canvas>
        
        {/* Click Counter Overlay */}
        {!destroyed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {Array.from({ length: clicksNeeded }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  i < clickCount
                    ? 'bg-[#C9A227] text-white'
                    : 'bg-white/10 text-white/30'
                }`}
                animate={i < clickCount ? { scale: [1, 1.2, 1] } : {}}
              >
                <Hammer className="w-6 h-6" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Continue Button */}
      <AnimatePresence>
        {destroyed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <div className="text-[#C9A227] text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {t('funnel.destroy.mythDestroyed')}
            </div>
            <Button
              onClick={handleContinue}
              className="px-10 py-6 bg-gradient-to-r from-[#8B1A1A] to-[#C9A227] text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-[#C9A227]/30"
            >
              {t('funnel.destroy.continue')}
              <Zap className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
