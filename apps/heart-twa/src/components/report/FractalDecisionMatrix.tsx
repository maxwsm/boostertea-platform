import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BrainCircuit } from "lucide-react";
import * as THREE from "three";

const fragmentShader = `
uniform float u_time;
uniform vec2 u_c;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
varying vec2 vUv;

void main() {
    // Coordinate mapping: center and scale
    vec2 z = (vUv - 0.5) * 3.5;
    
    // Subtle breathing/zooming effect based on time
    float zoom = 1.0 + 0.05 * sin(u_time * 0.5);
    z /= zoom;

    const int max_iter = 64;
    int iter = 0;
    
    // Julia Set mathematics: Z_{n+1} = Z_n^2 + C
    for(int i = 0; i < max_iter; i++) {
        // Escape condition
        if(dot(z, z) > 16.0) break;
        // Complex squaring: (x + iy)^2 = x^2 - y^2 + 2ixy
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_c;
        iter++;
    }
    
    float t = float(iter) / float(max_iter);
    
    if(iter == max_iter) {
        // Inside the set
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        // Outside the set - gradient coloring
        // Smooth out the banding
        float smooth_t = float(iter) - log2(max(0.0, log2(dot(z, z)))) + 4.0;
        smooth_t = smooth_t / float(max_iter);
        
        vec3 color = mix(u_colorA, u_colorB, smooth_t * 2.5);
        gl_FragColor = vec4(color, 1.0);
    }
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function GLSLJuliaSet({ vectors }: { vectors: any }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Map AI Vectors to Mathematical Parameters
  // Dopamine (-100 to 100) -> X axis of Complex C
  const cx = useMemo(() => (vectors.dopamine / 100) * 0.8, [vectors.dopamine]);
  
  // Cognitive Load (0 to 100) -> Y axis of Complex C
  // We map it to [0.1, 0.9] to get interesting Julia shapes
  const cy = useMemo(() => 0.1 + (vectors.cognitiveLoad / 100) * 0.6, [vectors.cognitiveLoad]);

  // Determine Colors based on Spiritual/Financial vectors (Order vs Chaos)
  // High balance = Ocean / Sage. Low balance = Magma / Red.
  const isChaotic = vectors.spiritual < 0 || vectors.financial < 0;

  const colorA = useMemo(() => isChaotic ? new THREE.Color("#450a0a") : new THREE.Color("#0f172a"), [isChaotic]);
  const colorB = useMemo(() => isChaotic ? new THREE.Color("#ef4444") : new THREE.Color("#2d9cdb"), [isChaotic]);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_c: { value: new THREE.Vector2(cx, cy) },
      u_colorA: { value: colorA },
      u_colorB: { value: colorB },
    }),
    [cx, cy, colorA, colorB]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
      // Gently oscillate the C parameter over time for a "living" effect
      materialRef.current.uniforms.u_c.value.x = cx + Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
      materialRef.current.uniforms.u_c.value.y = cy + Math.cos(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function FractalDecisionMatrix({ vectors }: { vectors: any }) {
  if (!vectors) return null;

  return (
    <div className="w-full relative overflow-hidden rounded-[24px] p-5 bg-graphite/40 border border-oatmeal/10 mt-6 flex flex-col items-center">
      <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-2 flex items-center gap-2">
        <BrainCircuit size={14} className="text-ocean" /> GLSL Фрактал (Z = Z² + C)
      </h3>
      <p className="text-[10px] text-oatmeal/40 font-mono text-center mb-4 max-w-[250px]">
        Справжня математична симуляція. Форма відображає ваші нейронні зв'язки.
      </p>

      <div className="w-full h-[250px] bg-black/50 rounded-[16px] overflow-hidden border border-white/5 relative shadow-inner">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <GLSLJuliaSet vectors={vectors} />
        </Canvas>
        
        {/* Overlay Variables to show user the equation inputs */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 bg-black/60 p-2 rounded backdrop-blur-md">
          <span className="text-[8px] font-mono text-oatmeal/60">C_x (Дофамін)</span>
          <span className="text-[10px] font-mono text-amber">{((vectors.dopamine / 100) * 0.8).toFixed(2)}</span>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1 bg-black/60 p-2 rounded backdrop-blur-md items-end">
          <span className="text-[8px] font-mono text-oatmeal/60">C_y (Когнітив)</span>
          <span className="text-[10px] font-mono text-ocean">{(0.1 + (vectors.cognitiveLoad / 100) * 0.6).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
