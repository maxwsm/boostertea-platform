// ═══════════════════════════════════════════════════════════════════════
// MODEL 04: THE ASYMPTOTE OF MADNESS (13Y Timeline Graph)
// Description: Procedurally generates an erratic spline representing the 
// brutal 13-year development history. 'Black Swan' moments are hidden in peaks.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../utils/math";

export const ASYMPTOTE_LAT_START = 0.22;
export const ASYMPTOTE_LAT_END = 0.26;

// Simplex/Perlin noise implementation placeholder (simplified for initial geometry)
function snoise1D(x: number) {
    return Math.sin(x * 12.3) * Math.cos(x * 4.5) * Math.sin(x * 0.8);
}

export function generateAsymptoteGraph(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  const resolution = 200; // How many segments in the 13Y line
  let prevPoint = null;

  for (let i = 0; i <= resolution; i++) {
    const progress = i / resolution;
    const currentLat = ASYMPTOTE_LAT_START + progress * (ASYMPTOTE_LAT_END - ASYMPTOTE_LAT_START);
    
    // Tachycardia Line Math (Heartbeat of Development)
    // Base fluctuation + exponential spikes for "Blackouts"
    let noiseVal = snoise1D(progress * 50);
    let peakMultiplier = 1;
    let isPeak = false;

    // Hardcode 3 brutal "Blackouts" (e.g. VDS collapse, Turborepo migration)
    if (Math.abs(progress - 0.3) < 0.02) { peakMultiplier = 25; isPeak = true; } // Crisis 1
    if (Math.abs(progress - 0.6) < 0.015) { peakMultiplier = 35; isPeak = true; } // Crisis 2
    if (Math.abs(progress - 0.85) < 0.03) { peakMultiplier = 15; isPeak = true; } // Minor Crisis

    const finalElev = 10 + (noiseVal > 0.8 ? Math.exp(peakMultiplier * 0.1) : noiseVal * 20);
    const lonWobble = snoise1D(progress * 13) * 0.005;

    const currentPoint = sphToCart(currentLat, lonWobble, finalElev);

    if (prevPoint) {
      lines.push({ 
          p1: prevPoint, 
          p2: currentPoint, 
          colorMode: isPeak ? 2 : 1, // Highlight peaks in Glitch Color (Red/Neon)
          width: isPeak ? 3.0 : 0.8 
      });
    }
    prevPoint = currentPoint;

    // Attach Timeline Texts
    if (i === Math.floor(resolution * 0.1)) icons.push({ p: currentPoint, char: "Y1: THE SILICON PIT", size: 14, type: 'text' });
    if (i === Math.floor(resolution * 0.4)) icons.push({ p: currentPoint, char: "Y5: BURNED SERVERS", size: 14, type: 'text' });
    if (i === Math.floor(resolution * 0.7)) icons.push({ p: currentPoint, char: "Y10: NEURAL SHIFT", size: 14, type: 'text' });
    if (i === Math.floor(resolution * 0.95)) icons.push({ p: currentPoint, char: "Y13: OMNIVERSE STABLE", size: 20, type: 'text' });
  }

  // BLACK SWAN EASTER EGGS (Hidden inside the negative space of the graph)
  // These require the user to hover over them (Distance < 30px) to become fully visible.
  icons.push({ p: sphToCart(ASYMPTOTE_LAT_START + 0.012, 0.01, 5), char: '{"sanity_level": "13%", "puer_L": 3150}', size: 10, type: 'text', meta: { isEasterEgg: true } });
  icons.push({ p: sphToCart(ASYMPTOTE_LAT_START + 0.025, -0.01, 2), char: '{"vds_status": "OFFLINE_48H_PANIC"}', size: 10, type: 'text', meta: { isEasterEgg: true } });
  icons.push({ p: sphToCart(ASYMPTOTE_LAT_START + 0.032, 0.015, 8), char: '{"keyboards_destroyed": 4}', size: 10, type: 'text', meta: { isEasterEgg: true } });

  return { lines, icons };
}
