import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MeadowProps {
    onRewind: () => void;
}

export function MeadowScene({ onRewind }: MeadowProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRewinding, setIsRewinding] = useState(false);
    const timeRef = useRef(0);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
        obs.observe(document.documentElement, { attributes: true });
        setIsDark(document.documentElement.classList.contains("dark"));
        return () => obs.disconnect();
    }, []);
    
    // Synth audio for rewind and ambient
    const playAudio = (type: 'ambient' | 'rewind') => {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        const audioCtx = new Ctx();
        
        if (type === 'ambient') {
            // Low drone hum (Earthly campfire vibes)
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 55; // Low A
            osc.type = 'sine';
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2);
            osc.start();
        } else if (type === 'rewind') {
            // VHS rewind tear
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }
    };

    useEffect(() => {
        playAudio('ambient');
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // 3D Projection math for flat plane
        const project = (x: number, y: number, z: number) => {
            const fov = 500;
            const camZ = 700;
            const scale = fov / (camZ + z);
            return {
                x: canvas.width / 2 + x * scale,
                y: (canvas.height / 2 + 100) + y * scale,
                scale
            };
        };

        const render = () => {
            timeRef.current += 0.02;
            const time = timeRef.current;

            // Cyberpunk Dark / Day Theme Variables
            const bgSky = isDark ? '#020205' : '#0b0f19';
            const mtnBack = isDark ? '#050a15' : '#0d1525';
            const mtnMid = isDark ? '#101726' : '#141e30';
            const mtnFore = isDark ? '#152035' : '#1e293b';
            const gridColor = isDark ? 'rgba(0, 255, 204, 0.15)' : 'rgba(0, 200, 255, 0.3)';
            const yurtColor = isDark ? 'rgba(255, 0, 255, 0.5)' : 'rgba(200, 0, 255, 0.6)';
            const obeliskColor = isDark ? 'rgba(0, 255, 204, 0.6)' : 'rgba(0, 150, 255, 0.8)';
            const holoColor = isDark ? '#0ff' : '#0066cc';
            const textColor = isDark ? '#fff' : '#fff';

            // 0. Заливка фону (Небо)
            ctx.fillStyle = bgSky;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. ГОРИЗОНТ: Патагонія (Mount Fitz Roy & Cerro Torre Digital Copy)
            const centerY = canvas.height / 2 - 50;
            const w = canvas.width;
            
            const patagoniaPeaks = [
                [0.00, 0], [0.10, -20], [0.15, -15], 
                [0.20, -60], [0.22, -150], [0.24, -40],
                [0.30, -30], [0.35, -50], [0.38, -120], [0.40, -80],
                [0.45, -280], [0.47, -100], [0.50, -350], [0.52, -150], [0.55, -250], [0.57, -80],
                [0.60, -100], [0.65, -30], [0.70, -60], [0.80, -20],
                [0.90, -40], [1.00, 0]
            ];

            const drawMountainLayer = (offsetY: number, color: string, parallaxX: number) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                ctx.lineTo(0, centerY + offsetY);
                
                for(let i=0; i<w; i+=5) {
                    const normalizedX = (i + parallaxX) / w;
                    let y = 0;
                    for(let j=0; j<patagoniaPeaks.length-1; j++) {
                        const p1 = patagoniaPeaks[j];
                        const p2 = patagoniaPeaks[j+1];
                        if (normalizedX >= p1[0] && normalizedX <= p2[0]) {
                            const t = (normalizedX - p1[0]) / (p2[0] - p1[0]);
                            const noise = Math.sin(i*0.05 + time*0.5) * 5 + Math.cos(i*0.02) * 8;
                            y = p1[1] + t * (p2[1] - p1[1]) + noise;
                            break;
                        }
                    }
                    ctx.lineTo(i, centerY + y + offsetY);
                }
                ctx.lineTo(w, centerY + offsetY);
                ctx.lineTo(w, canvas.height);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = isDark ? '#0a2a0a' : '#5f705f';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.beginPath();
                for(let i=0; i<w; i+=30) {
                    const normalizedX = (i + parallaxX) / w;
                    for(let j=0; j<patagoniaPeaks.length-1; j++) {
                        if (normalizedX >= patagoniaPeaks[j][0] && normalizedX < patagoniaPeaks[j+1][0]) {
                            if (patagoniaPeaks[j][1] < -50) {
                                const lineY = centerY + patagoniaPeaks[j][1] + offsetY;
                                ctx.moveTo(i, lineY);
                                ctx.lineTo(i + 15, centerY + offsetY + 50);
                            }
                        }
                    }
                }
                ctx.strokeStyle = isDark ? '#021002' : '#6a7a6a';
                ctx.stroke();
            };

            drawMountainLayer(-20, mtnBack, time * 5);
            drawMountainLayer(30, mtnMid, time * 15);
            drawMountainLayer(80, mtnFore, time * 30);

            // 2. ДИНАМІЧНИЙ ПРОСТІР (Moving Ground Grid)
            const speed = (time * 100) % 50;
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let z=-200; z<1500; z+=50) {
                const zPos = z - speed;
                if(zPos < -400) continue;
                const pL = project(-1000, 0, zPos);
                const pR = project(1000, 0, zPos);
                ctx.moveTo(pL.x, pL.y); ctx.lineTo(pR.x, pR.y);
            }
            for(let x=-1000; x<=1000; x+=100) {
                const pB = project(x, 0, -400); 
                const pT = project(x, 0, 1500); 
                ctx.moveTo(pT.x, pT.y); ctx.lineTo(pB.x, pB.y);
            }
            ctx.stroke();

            // 3. CAMPFIRE
            const fireOscGroup = Math.floor(time * 10);
            for(let i=0; i<25; i++) {
                const fireH = Math.abs(Math.sin(time * 8 + i*0.5)) * 120 * Math.random();
                const p1 = project(Math.cos(time*2+i)*40, 0, -200 + Math.sin(time+i)*40); 
                const p2 = project(0, -fireH, -200); 
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(${255}, ${100 + Math.random()*100}, 0, ${0.4 + Math.random()*0.6})`;
                ctx.lineWidth = 3 * p1.scale;
                ctx.stroke();
            }

            for(let p=0; p<15; p++) {
                const ptX = Math.sin(time*3 + p) * 100;
                const ptY = -150 - ((time*50 + p*20) % 200);
                const part = project(ptX, ptY, -200 + Math.sin(p)*50);
                ctx.fillStyle = `rgba(255, 150, 0, ${Math.random()})`;
                ctx.beginPath(); ctx.arc(part.x, part.y, 2*part.scale, 0, Math.PI*2); ctx.fill();
            }

            // 4. ЮРТИ-ГЛЕМПІНГИ
            const drawHighResYurt = (ox: number, oz: number, scaleFactor: number = 1) => {
                const radius = 120 * scaleFactor;
                ctx.strokeStyle = yurtColor;
                ctx.lineWidth = 1;
                for(let r=0; r<=Math.PI/2; r+=Math.PI/8) {
                    ctx.beginPath();
                    for(let a=0; a<=Math.PI*2; a+=0.1) {
                        const px = ox + Math.cos(a) * Math.cos(r) * radius;
                        const py = -Math.sin(r) * radius; 
                        const pz = oz + Math.sin(a) * Math.cos(r) * radius;
                        const pt = project(px, py, pz);
                        if(a===0) ctx.moveTo(pt.x, pt.y);
                        else ctx.lineTo(pt.x, pt.y);
                    }
                    ctx.stroke();
                }
                for(let a=0; a<=Math.PI*2; a+=Math.PI/6) {
                    ctx.beginPath();
                    for(let r=0; r<=Math.PI/2; r+=0.1) {
                        const px = ox + Math.cos(a) * Math.cos(r) * radius;
                        const py = -Math.sin(r) * radius;
                        const pz = oz + Math.sin(a) * Math.cos(r) * radius;
                        const pt = project(px, py, pz);
                        if(r===0) ctx.moveTo(pt.x, pt.y);
                        else ctx.lineTo(pt.x, pt.y);
                    }
                    ctx.stroke();
                }
                ctx.beginPath();
                for(let archA = -0.4; archA <= 0.4; archA += 0.1) {
                    const r = Math.PI/6;
                    const px = ox + Math.cos(archA + Math.PI/2) * Math.cos(r) * radius * 1.05;
                    const pz = oz + Math.sin(archA + Math.PI/2) * Math.cos(r) * radius * 1.05;
                    const py = -Math.sin(Math.PI/2 - Math.abs(archA)*2) * radius * 0.6;
                    const pt = project(px, py, pz);
                    if(archA === -0.4) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.strokeStyle = holoColor; ctx.lineWidth = 2; ctx.stroke();
            };

            drawHighResYurt(-350, 200, 1.2);
            drawHighResYurt(-500, 500, 0.8);
            drawHighResYurt(350, 150, 1.1);
            drawHighResYurt(550, 400, 0.9);

            // 5. БЕТОНОМІШАЛКА
            const mx = -250;
            const mz = -100;
            const my = -80; 
            const drumR = 60;
            const drumL = 120;
            
            ctx.lineWidth = 1;
            for(let i=-drumL/2; i<=drumL/2; i+=15) {
                ctx.beginPath();
                for(let a=0; a<=Math.PI*2; a+=0.2) {
                    const rotA = a + time*2 + i*0.01;
                    const px = mx + i;
                    const py = my + Math.cos(rotA)*drumR;
                    const pz = mz + Math.sin(rotA)*drumR;
                    const pt = project(px, py, pz);
                    if(a===0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.strokeStyle = (Math.random() > 0.85) ? (isDark ? 'rgba(0,255,255,0.9)' : 'rgba(0,100,255,0.9)') : yurtColor;
                ctx.stroke();
            }
            
            for(let a=0; a<Math.PI*2; a+=Math.PI/3) {
                ctx.beginPath();
                const rotA = a + time*2;
                const p1 = project(mx - drumL/2, my + Math.cos(rotA)*drumR, mz + Math.sin(rotA)*drumR);
                const p2 = project(mx + drumL/2, my + Math.cos(rotA)*drumR, mz + Math.sin(rotA)*drumR);
                ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = isDark ? '#0f0' : '#0a0'; ctx.stroke();
            }

            ctx.fillStyle = holoColor;
            ctx.font = '12px monospace';
            const mText = project(mx, my-100, mz);
            if(Math.random() > 0.05) {
                ctx.fillText(`[CONCRETE_TEX_L0ADING ${Math.floor((time%5)*20)}%]`, mText.x, mText.y);
            }

            // 6. AMBASSADOR MONUMENT
            const obX = 250;
            const obZ = -50;
            const obH = 250;
            
            ctx.beginPath();
            const top = project(obX, -obH, obZ);
            const b1 = project(obX - 30, 0, obZ - 30);
            const b2 = project(obX + 30, 0, obZ - 30);
            const b3 = project(obX + 30, 0, obZ + 30);
            const b4 = project(obX - 30, 0, obZ + 30);
            
            const drawObeliskLine = (pa: any, pb: any) => { ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); };
            drawObeliskLine(top, b1); drawObeliskLine(top, b2); drawObeliskLine(top, b3); drawObeliskLine(top, b4);
            drawObeliskLine(b1, b2); drawObeliskLine(b2, b3); drawObeliskLine(b3, b4); drawObeliskLine(b4, b1);
            ctx.strokeStyle = obeliskColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            for(let a=0; a<Math.PI*2; a+=0.1) {
                const rp1 = project(obX + Math.cos(a + time)*80, -obH*0.6 + Math.sin(a - time)*20, obZ + Math.sin(a + time)*80);
                if(a===0) ctx.moveTo(rp1.x, rp1.y); else ctx.lineTo(rp1.x, rp1.y);
            }
            ctx.strokeStyle = holoColor; ctx.stroke();

            ctx.beginPath();
            for(let a=0; a<Math.PI*2; a+=0.1) {
                const rp2 = project(obX + Math.cos(a - time*1.5)*90, -obH*0.4 + Math.cos(a + time)*30, obZ + Math.sin(a - time*1.5)*90);
                if(a===0) ctx.moveTo(rp2.x, rp2.y); else ctx.lineTo(rp2.x, rp2.y);
            }
            ctx.stroke();

            // Monument Hologram
            const tText = project(obX-70, -obH - 30, obZ);
            ctx.fillStyle = textColor;
            ctx.font = 'bold 14px monospace';
            ctx.shadowColor = gridColor; ctx.shadowBlur = 10;
            ctx.fillText("[ WORLD x2 AMBASSADOR ]", tText.x, tText.y);
            ctx.shadowBlur = 0; // reset

            frameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
        };
    }, [isDark]);

    const handleRewind = () => {
        playAudio('rewind');
        setIsRewinding(true);
        setTimeout(() => {
            onRewind();
        }, 500); // 0.5s glitch transition
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`fixed inset-0 z-[100] ${isDark ? 'bg-[#020205]' : 'bg-gray-900'} overflow-hidden ${isRewinding ? 'animate-glitch-tear' : ''}`}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />

            {/* THE ONLY FULL-COLOR OBJECT: 8K MATERIALIZATION SPHERE */}
            <div className="absolute top-[10%] drop-shadow-2xl left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <motion.div 
                    initial={{ scale: 0, filter: 'blur(20px)' }}
                    animate={{ scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative w-48 h-48 md:w-80 md:h-80"
                >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,1),_rgba(255,0,200,0.8)_20%,_rgba(0,255,204,0.6)_50%,_rgba(0,0,0,1)_90%)] shadow-[0_0_120px_rgba(255,0,200,0.5),_inset_0_0_60px_rgba(255,255,255,0.6)] animate-spin-slow"></div>
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-8 text-6xl md:text-8xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00ffcc] to-[#ff00ff] tracking-tight drop-shadow-[0_0_20px_rgba(0,255,204,0.6)] uppercase"
                >
                    COMING SOON
                </motion.h1>
            </div>

            {/* DAO RECRUITMENT TEXT & TG CTA */}
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-[90%] lg:w-[600px] pointer-events-auto"
            >
                <div className="border border-white/10 bg-black/50 backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center text-center shadow-[0_0_40px_rgba(0,255,204,0.15)] w-full">
                    <p className="font-mono text-sm md:text-md mb-8 uppercase tracking-widest leading-relaxed text-[#00ffcc]">
                        Якщо хочеш стати частиною ДАО, заходь в ТГ, знайомся з правилами і будемо знайомитись.
                    </p>
                    <a 
                        href="https://t.me/neuralnomad_13wsm13"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative px-10 py-4 font-mono font-bold text-lg overflow-hidden flex items-center justify-center border border-[#ff00ff]/50 bg-black text-[#ff00ff] transition-all hover:bg-[#ff00ff] hover:text-white shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] rounded-xl w-full"
                    >
                        <span className="relative z-10 tracking-[0.2em] uppercase">[ TELEGRAM DAO ]</span>
                    </a>
                </div>
            </motion.div>

            {/* FAST REWIND BUTTON TO RETURN TO FLOW */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
            >
                <button 
                    onClick={handleRewind}
                    className="px-6 py-2 border border-white/20 bg-black/40 backdrop-blur-md rounded-full font-mono uppercase tracking-widest text-xs text-white/50 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all"
                >
                    &lt;&lt; РЕВЕРС ДО ЯДРА (ФОРТ)
                </button>
            </motion.div>

            <style>{`
                .animate-spin-slow {
                    animation: spinBlob 15s linear infinite;
                }
                @keyframes spinBlob {
                    0% { transform: rotate(0deg) scale(1); filter: hue-rotate(0deg); }
                    50% { transform: rotate(180deg) scale(1.05); filter: hue-rotate(45deg); }
                    100% { transform: rotate(360deg) scale(1); filter: hue-rotate(0deg); }
                }
                .animate-glitch-tear {
                    animation: glitchTear 0.5s linear forwards;
                }
                @keyframes glitchTear {
                    0% { filter: hue-rotate(0deg) blur(0px) contrast(1); transform: scale(1) translateX(0); }
                    25% { filter: hue-rotate(90deg) blur(5px) contrast(2); transform: scale(1.05) translateX(10px); }
                    50% { filter: hue-rotate(-90deg) blur(10px) contrast(3); transform: scale(1.1) translateX(-20px) skewX(10deg); }
                    100% { filter: hue-rotate(180deg) blur(50px) contrast(0); transform: scale(1.5) translateX(50px) opacity(0); }
                }
            `}</style>
        </motion.div>
    );
}
