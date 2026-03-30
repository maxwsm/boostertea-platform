// ═══════════════════════════════════════════════════════════════════════
// MODEL: BIOMETRIC GATE PILLARS (Pack 10 / 15)
// Description: Two massive standing monoliths acting as the true entrance 
// to the Colosseum. Refuses entry without RSA/Biometric auth (Neuro-Psychologist).
// Coordinate Space: LAT 0.17 (Outer entrance of Colosseum ring)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBiometricGatePillars(baseLat: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed slightly in front of the Colosseum Rings (Closer to user view)
  const gateLat = baseLat - 0.04;
  const gateSpread = 0.015; // Distance between pillars

  const gateHeight = 150;
  
  // Pillar 1 (Left)
  const pL_Base = sphToCart(gateLat, -gateSpread, 0);
  const pL_Top = sphToCart(gateLat, -gateSpread, gateHeight);
  // Pillar 2 (Right)
  const pR_Base = sphToCart(gateLat, gateSpread, 0);
  const pR_Top = sphToCart(gateLat, gateSpread, gateHeight);

  // Draw thick monolithic structures (using 2 parallel lines to simulate thickness)
  lines.push({ p1: pL_Base, p2: pL_Top, colorMode: 1, width: 5.0 });
  lines.push({ p1: sphToCart(gateLat - 0.001, -gateSpread, 0), p2: sphToCart(gateLat - 0.001, -gateSpread, gateHeight), colorMode: 1, width: 2.0 });

  lines.push({ p1: pR_Base, p2: pR_Top, colorMode: 1, width: 5.0 });
  lines.push({ p1: sphToCart(gateLat - 0.001, gateSpread, 0), p2: sphToCart(gateLat - 0.001, gateSpread, gateHeight), colorMode: 1, width: 2.0 });

  // Floating Laser Gate (Crossbeam)
  // This will be interactive, rendering red if no access, green if access
  const beamHeight = 50;
  const p1_Beam = sphToCart(gateLat, -gateSpread, beamHeight);
  const p2_Beam = sphToCart(gateLat, gateSpread, beamHeight);
  lines.push({ p1: p1_Beam, p2: p2_Beam, colorMode: 2, width: 3.0 }); // Red initially

  // Gate Interface Text
  icons.push({ p: sphToCart(gateLat, 0, beamHeight + 20), char: "> RSA-TUNNEL SECURED", size: 14, type: 'text' });
  icons.push({ p: sphToCart(gateLat + 0.002, 0, beamHeight + 10), char: "AWAITING BIOMETRIC HASH...", size: 12, type: 'text', meta: { flashing: true } });

  // Runes engraved vertically on pillars
  const runicSymbols = "ᚠᛟᛒᚷᛉᚹᛋᛞᛝ";
  for (let i = 0; i < 6; i++) {
      const h = 20 + i * 20;
      icons.push({ p: sphToCart(gateLat, -gateSpread - 0.002, h), char: runicSymbols[i % runicSymbols.length], size: 16, type: 'rune' });
      icons.push({ p: sphToCart(gateLat, gateSpread + 0.002, h), char: runicSymbols[7 - (i % 6)], size: 16, type: 'rune' });
  }

  return { lines, icons };
}
