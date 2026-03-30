import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════════════
// 13WSM13 :: MASTER CANVAS (THE GIANT SPHERE ENGINE)
// 8K Ultra-Premium Detailing | Horizon Treadmill Effect | C-LOD Culling
// ═══════════════════════════════════════════════════════════════════════

const TAU = Math.PI * 2;
const R = 15000;         // Planet Radius. Huge to create subtle horizon bend.
const CAM_ELEV = 40;     // Camera height above ground
const CAM_Y = R + CAM_ELEV;
const FOV = 600;

// Symbol Sets
const RUNIC = "СВІТТРЕБАСИЛАДАЖБОГᚠᛟᛒᚷᛉᚹᛋᛞᛝᛃᛗᚨᚲ";
const SYM_1313 = ["🌐","📦","🧭","🎒","💻","🔗","🗂","🔐","🪙","⛺","🏔","✈","🚁","📡","🧠","🔥","📊","⚙","🧬","⚖","🌍","📱","🛡","🏗"];

function ss(a: number, b: number, x: number) { 
  const t = Math.max(0, Math.min(1, (x - a) / (b - a))); 
  return t * t * (3 - 2 * t); 
}

// ════ WEB AUDIO API (SYNTH SFX) ════
let audioCtx: AudioContext | null = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSynth(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playHoverBeep() {
    playSynth(880, 'sine', 0.1, 0.05); // High pitch short beep
}

function playTriggerBam() {
    playSynth(110, 'square', 0.5, 0.2); // Low bass cinematic impact
}
// ═══════════════════════════════════

// ═══ 3D CORE ═══
interface P3D { x: number, y: number, z: number }
interface PLine { p1: P3D, p2: P3D, colorMode: number }
interface PIcon { p: P3D, char: string, size: number, type: 'rune' | 'obj' | 'text', meta?: any }

function rotateX(p: P3D, a: number): P3D { return { x: p.x, y: Math.cos(a)*p.y - Math.sin(a)*p.z, z: Math.sin(a)*p.y + Math.cos(a)*p.z }; }
function rotateY(p: P3D, a: number): P3D { return { x: Math.cos(a)*p.x + Math.sin(a)*p.z, y: p.y, z: -Math.sin(a)*p.x + Math.cos(a)*p.z }; }
function rotateZ(p: P3D, a: number): P3D { return { x: Math.cos(a)*p.x - Math.sin(a)*p.y, y: Math.sin(a)*p.x + Math.cos(a)*p.y, z: p.z }; }

function sphToCart(lat: number, lon: number, elev: number): P3D {
  const r = R + elev;
  return {
    x: r * Math.sin(lat) * Math.sin(lon),
    y: r * Math.cos(lat),
    z: r * Math.sin(lat) * Math.cos(lon)
  };
}

import { WorldBuilder } from "@/engine/registry/WorldBuilder";
import { getMacBookMesh, Rect3D } from "@/engine/models/NeuralCitadel/MacBookRenderGrid";

// ═══ WORLD GENERATION (8K Biomes) ═══
const WORLD = WorldBuilder.build();

// ═══ MAIN COMPONENT ═══
interface MasterCanvasProps {
    onHoverChange?: (nlpId: string | null, trigger: string | null) => void;
    highlightTopic?: string | null;
}

export default function MasterCanvas({ onHoverChange, highlightTopic }: MasterCanvasProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const hoveredRef = useRef<{ nlpId: string | null, trigger: string | null }>({ nlpId: null, trigger: null });
  const timeRef = useRef(0);
  const [isDark, setIsDark] = useState(true);
  const isDragging = useRef(false);
  const activeHover = useRef<{ ic: PIcon } | null>(null);

  // Initialize Quantum Dust Context
  const dustRef = useRef(Array.from({ length: 300 }).map(() => ({
      x: (Math.random() - 0.5) * 4000,
      y: (Math.random() - 0.5) * 4000,
      z: (Math.random() - 0.5) * 4000,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.005 + 0.001
  })));

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    const updateMouse = (e: MouseEvent) => {
      mouseRef.current = { 
          x: (e.clientX / window.innerWidth) - 0.5, 
          y: (e.clientY / window.innerHeight) - 0.5,
          clientX: e.clientX,
          clientY: e.clientY
      };
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("mousemove", updateMouse, { passive: true });
    window.addEventListener("pointerdown", () => initAudio(), { once: true });
    updateScroll();
    return () => { window.removeEventListener("scroll", updateScroll); window.removeEventListener("mousemove", updateMouse); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); if(!ctx) return;
    
    let animId = 0;
    const maxLines = WORLD.lines.length;
    const projectedLines = new Float32Array(maxLines * 5);
    
    const render = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const s = scrollRef.current;
      
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      
      const cx = w * dpr / 2;
      const cy = h * dpr / 2;
      
      const bg = isDark ? "#050505" : "#FAFAFA";
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- 1. RENDER QUANTUM DUST BACKGROUND ---
      ctx.save();
      ctx.fillStyle = '#0f0';
      const fovDust = 500;
      for (const d of dustRef.current) {
          // Slowly rotate dust around Y axis based on time
          const s = Math.sin(timeRef.current * d.speed);
          const c = Math.cos(timeRef.current * d.speed);
          
          // Apply rotation
          let rx = d.x * c - d.z * s;
          let rz = d.x * s + d.z * c;
          
          // Apply globe rotation to dust so it feels anchored to the same universe
          const gyS = Math.sin(timeRef.current * 0.1);
          const gyC = Math.cos(timeRef.current * 0.1);
          const fX = rx * gyC - rz * gyS;
          const fZ = rx * gyS + rz * gyC;

          // Push it far back into the depth along Z (Z > 500 behind globe)
          const finalZ = fZ + 1500; 

          if (finalZ < 100) continue; // Behind camera clipping
          
          const scale = fovDust / finalZ;
          const px = w / 2 + fX * scale;
          const py = h / 2 + d.y * scale;

          if (px > 0 && px < w && py > 0 && py < h) {
              ctx.globalAlpha = Math.max(0.1, Math.min(0.8, scale * 2));
              ctx.fillRect(px, py, d.size * scale, d.size * scale);
          }
      }
      ctx.restore();

      // --- 2. RENDER GLOBE LINES ---

      const fg = isDark ? "#FFFFFF" : "#000000";
      const treadmillAngle = s * 0.50; 
      const headRotY = mouseRef.current.x * 0.4;
      const headRotX = mouseRef.current.y * 0.2;

      let lineCount = 0;
      const isTransition = (s > 0.38 && s < 0.42);
      const shakeX = isTransition ? (Math.random()-0.5)*10 : 0;
      const shakeY = isTransition ? (Math.random()-0.5)*10 : 0;

      ctx.strokeStyle = fg;
      ctx.lineWidth = dpr * 0.8;
      ctx.beginPath();
      
      for(let i=0; i<WORLD.lines.length; i++) {
        const line = WORLD.lines[i];
        let pr1 = rotateX(line.p1, -treadmillAngle);
        let pr2 = rotateX(line.p2, -treadmillAngle);
        if (pr1.y < R * 0.95 || pr2.y < R * 0.95) continue;
        pr1 = rotateY(pr1, headRotY); pr2 = rotateY(pr2, headRotY);
        pr1 = rotateX(pr1, headRotX); pr2 = rotateX(pr2, headRotX);
        const cz1 = pr1.z; const cz2 = pr2.z;
        const cy1 = pr1.y - CAM_Y; const cy2 = pr2.y - CAM_Y;
        if (cz1 < -FOV + 10 || cz2 < -FOV + 10) continue;
        const scale1 = FOV / (FOV + cz1);
        const scale2 = FOV / (FOV + cz2);
        projectedLines[lineCount*5] = cx + pr1.x * scale1 + shakeX;
        projectedLines[lineCount*5+1] = cy - cy1 * scale1 + shakeY;
        projectedLines[lineCount*5+2] = cx + pr2.x * scale2 + shakeX;
        projectedLines[lineCount*5+3] = cy - cy2 * scale2 + shakeY;
        projectedLines[lineCount*5+4] = Math.max(0.05, 1 - (cz1 / 3000));
        lineCount++;
      }

      for(let i=0; i<lineCount; i++) {
        ctx.globalAlpha = projectedLines[i*5+4];
        ctx.moveTo(projectedLines[i*5], projectedLines[i*5+1]);
        ctx.lineTo(projectedLines[i*5+2], projectedLines[i*5+3]);
      }
      ctx.stroke();

      const cullIcons = [];
      let currentFrameNlp: string | null = null;
      let currentFrameTrigger: string | null = null;
      let closestNlpDist = Infinity;

      for(let i=0; i<WORLD.icons.length; i++) {
        const ic = WORLD.icons[i];
        let pr = rotateX(ic.p, -treadmillAngle);
        if (pr.y < R * 0.96) continue;
        
        pr = rotateY(pr, headRotY);
        pr = rotateX(pr, headRotX);

        const cz = pr.z;
        const cyl = pr.y - CAM_Y;
        if (cz < -FOV + 10) continue;

        const scale = FOV / (FOV + cz);
        const sx = cx + pr.x * scale + shakeX;
        const sy = cy - cyl * scale + shakeY;
        
        // Procedural hover (only for ecosystem objects)
        const hoverY = ic.type === 'obj' ? Math.sin(t * 3 + i) * 15 * scale : 0;
        
        const finalX = sx;
        const finalY = sy + hoverY;

        cullIcons.push({ x: finalX, y: finalY, scale, z: cz, ic });

        // Simple 2D Screen Space distance check for Hover Event
        if (ic.meta?.nlpId || ic.meta?.triggerState) {
            // Distance from mouse to projected point on canvas
            const dx = (finalX / dpr) - mouseRef.current.clientX;
            const dy = (finalY / dpr) - mouseRef.current.clientY;
            const dist = Math.sqrt(dx*dx + dy*dy);

            // Radius scales based on depth (closer = bigger hit zone)
            const hitRadius = Math.max(20, 100 * scale * dpr);

            if (dist < hitRadius && dist < closestNlpDist) {
                closestNlpDist = dist;
                if (ic.meta?.nlpId) currentFrameNlp = ic.meta.nlpId;
                if (ic.meta?.triggerState) currentFrameTrigger = ic.meta.triggerState;
            }
        }
      }

      // Dispatch callbacks outside render logic if state changed
      if (hoveredRef.current.nlpId !== currentFrameNlp) {
          hoveredRef.current.nlpId = currentFrameNlp;
          if (onHoverChange) onHoverChange(currentFrameNlp, currentFrameTrigger);
      }
      if (hoveredRef.current.trigger !== currentFrameTrigger) {
          hoveredRef.current.trigger = currentFrameTrigger;
      }

      // Z-Sort Icons
      cullIcons.sort((a,b) => b.z - a.z);

      const drawRect3D = (rect: Rect3D, cx: number, cy: number, dScale: number, offsetX: number, offsetY: number) => {
        // Pseudo 3D projection for local rect points
        const project = (px: number, py: number, pz: number) => {
           // We scale up the micro coordinates of the laptop
           const scaledX = px * 10000;
           const scaledY = py * 10000;
           const scaledZ = pz * 10000;
           
           return {
               x: cx + (scaledX * dScale) + offsetX,
               y: cy - (scaledY * dScale) - (scaledZ * dScale) + offsetY
           };
        };
        const p1 = project(rect.p1.x, rect.p1.y, rect.p1.z);
        const p2 = project(rect.p2.x, rect.p2.y, rect.p2.z);
        const p3 = project(rect.p3.x, rect.p3.y, rect.p3.z);
        const p4 = project(rect.p4.x, rect.p4.y, rect.p4.z);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.stroke();
      };

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for(let i=0; i<cullIcons.length; i++) {
        const item = cullIcons[i];
        const zAlpha = Math.max(0.1, 1 - (item.z / 2000));
        ctx.globalAlpha = zAlpha;
        
        if(item.ic.type === 'obj') {
            // Scope setup for highlight states
            const isAhuHighlighted = highlightTopic && item.ic.meta?.nlpId?.includes(highlightTopic);
            const isHovered = activeHover.current?.ic === item.ic;

            if (item.ic.meta?.isMacbook) {
                // SPECIAL PASS: Rendering the 3D MacBook Mesh
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                
                ctx.save();
                ctx.globalAlpha = zAlpha;
                
                if (isAhuHighlighted) {
                    ctx.shadowColor = '#0ff'; // Cyan AHU highlight
                    ctx.shadowBlur = 15;
                    ctx.fillStyle = '#0ff';
                } else {
                    ctx.shadowColor = isHovered ? '#0f0' : '#000';
                    ctx.shadowBlur = isHovered ? Math.sin(timeRef.current * 10) * 10 + 10 : 0;
                    ctx.fillStyle = isHovered ? '#0f0' : (item.ic.meta?.colorMode === 2 ? '#ffb000' : '#fff');
                }

                const dScale = (isHovered || isAhuHighlighted) ? item.scale * 1.5 : item.scale;
                const laptop = getMacBookMesh();
                
                // Base
                ctx.fillStyle = (isHovered || isAhuHighlighted) ? '#330' : (isDark ? '#111' : '#eee'); 
                drawRect3D(laptop.base, item.x, item.y, dScale, 0, 0);
                ctx.fill();

                // Screen
                ctx.fillStyle = isDark ? '#000' : '#fff';
                drawRect3D(laptop.screen, item.x, item.y, dScale, 0, 0);
                // Glowing screen edge
                ctx.shadowColor = (isHovered || isAhuHighlighted) ? '#0f0' : '#fff';
                ctx.shadowBlur = (isHovered || isAhuHighlighted) ? 20 : 10;
                ctx.stroke();
                ctx.fill();
                ctx.shadowBlur = 0;

                // Keys
                ctx.strokeStyle = (isHovered || isAhuHighlighted) ? '#0f0' : '#555';
                for(const key of laptop.keys) {
                    drawRect3D(key, item.x, item.y, dScale, 0, 0);
                }
            } else {
                const isActive = (isHovered || isAhuHighlighted);
                ctx.fillStyle = isActive ? '#0f0' : '#fff';
                ctx.beginPath();
                ctx.arc(item.x, item.y, (isActive ? 4 : 2) * item.scale, 0, TAU);
                ctx.fill();
            }
        } else if (item.ic.type === 'text') {
          ctx.fillStyle = fg;
          const fs = Math.max(6, item.ic.size * item.scale * dpr);
          ctx.font = `bold ${fs}px monospace`;
          ctx.fillText(item.ic.char, item.x, item.y);
        } 
        else if (item.ic.type === 'rune') {
          ctx.fillStyle = isDark ? "#444" : "#ccc";
          const fs = Math.max(4, item.ic.size * item.scale * dpr);
          ctx.font = `${fs}px serif`;
          
          // Matrix fall effect relative to ground
          const matrixOffY = ((t * 200 + i * 140) % 500) * item.scale;
           ctx.fillText(item.ic.char, item.x, item.y + matrixOffY);
        }
        else {
          ctx.fillStyle = fg;
          const fs = Math.max(8, item.ic.size * item.scale * dpr);
          // Glitch scale for ecosystem items inside the fort phase
          ctx.font = `${fs}px sans-serif`;
          ctx.fillText(item.ic.char, item.x, item.y);
        }
      }

      // IT-Gothic Glitch Post-Processing (On Scroll Speed Spikes)
      if (Math.random() > 0.98 || isTransition) {
        ctx.globalCompositeOperation = isDark ? "screen" : "multiply";
        ctx.fillStyle = "rgba(255, 0, 50, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
