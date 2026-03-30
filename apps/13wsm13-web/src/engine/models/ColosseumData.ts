// ═══════════════════════════════════════════════════════════════════════
// MODEL 02: THE COLOSSEUM CORE & SYNDICATE DATA
// Description: Implements the metadata generated from the "Syndicate of 9 Neuro-Agents".
// Displays the monumental scale of the WSM Monorepo and DevOps history.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export const COL_LAT = 0.20;
export const COL_RADIUS = 0.015;

export function generateColosseum(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // 1. PHYSICAL STRUCTURE (RINGS)
  // Represents the 13Y timeline of development
  for (let tier = 0; tier < 4; tier++) {
    const elev = tier * 40;
    const count = 48 - tier * 4;
    for (let i = 0; i < count; i++) {
        const a1 = (i / count) * TAU;
        const a2 = ((i + 1) / count) * TAU;
        const p1 = sphToCart(COL_LAT + Math.cos(a1) * COL_RADIUS, Math.sin(a1) * COL_RADIUS, elev);
        const p2 = sphToCart(COL_LAT + Math.cos(a2) * COL_RADIUS, Math.sin(a2) * COL_RADIUS, elev);
        const pTop = sphToCart(COL_LAT + Math.cos(a1) * COL_RADIUS, Math.sin(a1) * COL_RADIUS, elev + 30);
        lines.push({ p1, p2, colorMode: 1 });
        lines.push({ p1, p2: pTop, colorMode: 1 });
    }
  }

  // 2. THE MASTER ARCHITECT (Block 1)
  icons.push({ p: sphToCart(COL_LAT - 0.005, -0.015, 30), char: "CODE: >1.4M LINES (TURBOREPO 2.0)", size: 22, type: 'text' });
  icons.push({ p: sphToCart(COL_LAT - 0.003, -0.010, 50), char: "MICRO-PACKAGES: wsm-db, wsm-ui", size: 18, type: 'text' });

  // 3. THE CLOUD COMMANDER (Block 2)
  icons.push({ p: sphToCart(COL_LAT, 0.01, 80), char: "PEAK TPS: 250,000", size: 26, type: 'text' });
  icons.push({ p: sphToCart(COL_LAT + 0.002, 0.01, 60), char: "EDGE ROUTES: FRANKFURT -> WASHINGTON", size: 14, type: 'text' });

  // 4. THE CYBER-DEV & CHAOS RANGER (Block 3 - The Black Swan)
  icons.push({ p: sphToCart(COL_LAT + 0.006, -0.02, 110), char: "ERROR: ECONNREFUSED (VDS BLACKOUT)", size: 12, type: 'text' });
  icons.push({ p: sphToCart(COL_LAT + 0.008, -0.02, 140), char: "EVACUATION: NEON DB EDGE. STATUS: STABLE.", size: 16, type: 'text' });

  // 5. THE SYNAPSE WEAVER (Block 4 - Whisper AI)
  icons.push({ p: sphToCart(COL_LAT + 0.012, 0.02, 90), char: "[████████░░░░] DECODING VOICE ENTROPY (WHISPER AI)", size: 12, type: 'text' });
  icons.push({ p: sphToCart(COL_LAT + 0.014, 0.02, 70), char: "AI READINESS: 99.9%", size: 18, type: 'text' });

  // 6. THE SYNDICATE BOSS (Block 5 - CRM & Logistics)
  icons.push({ p: sphToCart(COL_LAT + 0.018, 0, 40), char: "ECOSYSTEM_OS: BOOSTERTEA // FUNNYDROPS // TLAB", size: 16, type: 'text' });
  
  // BIOMETRIC GATE LOGIC (Floating before Colosseum)
  icons.push({ p: sphToCart(COL_LAT - 0.02, 0, 10), char: "> RSA-TUNNEL AUTHORIZATION REQUIRED", size: 24, type: 'text' });
  
  return { lines, icons };
}
