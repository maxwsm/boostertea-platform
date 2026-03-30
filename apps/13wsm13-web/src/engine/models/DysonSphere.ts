// ═══════════════════════════════════════════════════════════════════════
// MODEL 03: THE DYSON NEURO-SPHERE & BAYES FORMULAS
// Description: Represents the central ML Backend of WSM Omniverse.
// A massively dense mesh of lines that 'breathes' and shoots API beams.
// Orbits contain hard-math formulas honoring purely algorithmic execution.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export const DYSON_LAT = 0.22;
export const DYSON_ELEV = 400; // Floating high above
export const DYSON_RADIUS = 0.008;

export function generateDysonSphere(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // 1. THE DYSON CAGE (Breathing Mesh)
  const latitudes = 12;
  const longitudes = 24;

  for (let i = 0; i < latitudes; i++) {
    const latA1 = (i / latitudes) * Math.PI;
    const latA2 = ((i + 1) / latitudes) * Math.PI;

    for (let j = 0; j < longitudes; j++) {
      const lonA1 = (j / longitudes) * TAU;
      const lonA2 = ((j + 1) / longitudes) * TAU;

      // We translate the mesh to be locally floating, so we add the offset to a base point.
      // But for global spherical coordinates, we can just manipulate angles.
      const p1 = sphToCart(DYSON_LAT + Math.cos(latA1) * DYSON_RADIUS, Math.sin(latA1) * Math.sin(lonA1) * DYSON_RADIUS, DYSON_ELEV + Math.sin(latA1) * Math.cos(lonA1) * 200);
      const p2 = sphToCart(DYSON_LAT + Math.cos(latA1) * DYSON_RADIUS, Math.sin(latA1) * Math.sin(lonA2) * DYSON_RADIUS, DYSON_ELEV + Math.sin(latA1) * Math.cos(lonA2) * 200);
      
      lines.push({ p1, p2, colorMode: 2, width: 0.5 }); // Dark mode wireframe
      
      // Vertical bonds
      if (i < latitudes - 1) {
        const p3 = sphToCart(DYSON_LAT + Math.cos(latA2) * DYSON_RADIUS, Math.sin(latA2) * Math.sin(lonA1) * DYSON_RADIUS, DYSON_ELEV + Math.sin(latA2) * Math.cos(lonA1) * 200);
        lines.push({ p1, p2: p3, colorMode: 2, width: 0.5 });
      }
    }
  }

  // 2. ORBITING FORMULAS (Kepler's Orbits)
  // They will be animated in MasterCanvas, but here we define their initial mathematical state
  const formulas = [
    { txt: "P(A|B) = [P(B|A) * P(A)] / P(B)", size: 14, radius: 0.012 }, // Bayes
    { txt: "∂u/∂t + (u·∇)u = -1/ρ ∇p + ν∇²u + f", size: 12, radius: 0.015 }, // Navier-Stokes
    { txt: "R_uv - 1/2 R g_uv = 8πG/c^4 T_uv", size: 16, radius: 0.018 }, // Einstein Field
    { txt: "O(log n) -> O(1)", size: 20, radius: 0.022 }, // The Master Architect's Optimization
  ];

  formulas.forEach((form, idx) => {
    // Generate 3 random icons per orbit path for trailing dust
    for(let k=0; k<6; k++) {
        const a = Math.random() * TAU;
        icons.push({
            p: sphToCart(DYSON_LAT + Math.cos(a) * form.radius, Math.sin(a) * form.radius, DYSON_ELEV),
            char: ["0", "1", "x", "+"][Math.floor(Math.random()*4)],
            size: 6,
            type: 'rune',
            meta: { isOrbitDust: true, orbitSpeed: (idx + 1) * 0.002, angle: a, radius: form.radius }
        });
    }

    // The actual formula Text
    const startAngle = (idx / formulas.length) * TAU;
    icons.push({
      p: sphToCart(DYSON_LAT + Math.cos(startAngle) * form.radius, Math.sin(startAngle) * form.radius, DYSON_ELEV),
      char: form.txt,
      size: form.size,
      type: 'text',
      meta: { isFormula: true, orbitSpeed: (idx + 1) * 0.002, angle: startAngle, radius: form.radius }
    });
  });

  return { lines, icons };
}
