'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  // Strength of the pull. Higher = pulls further
  pullStrength?: number; 
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className, 
  onClick,
  pullStrength = 30 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Map to the pull strength. 
    // E.g. at the edge, middleX will be width/2. We scale it down to `pullStrength` pixels.
    setPosition({ 
      x: (middleX / (width / 2)) * pullStrength, 
      y: (middleY / (height / 2)) * pullStrength 
    });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-flex cursor-pointer ${className || ''}`}
    >
      {/* 
        Nested motion div for inner content allows the border to stick nicely 
        while the text floats slightly extra for parallax inside the button 
      */}
      <motion.div 
        animate={{ x: x * 0.2, y: y * 0.2 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
