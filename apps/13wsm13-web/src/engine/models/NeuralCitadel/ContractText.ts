// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONTRACT TEXT LAYER (Pack 4 / 7)
// Description: The actual cryptographic and legal text of the Web3 Contract,
// floating directly above the Cloth Mesh.
// Coordinate Space: LAT 0.38, Central Elevation (102)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getContractText(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Floating slightly above the cloth (elev + 2)
  const textElev = elev + 2;

  // The Header
  icons.push({ p: sphToCart(baseLat - 0.003, 0, textElev), char: "THE IMMUTABLE GLASS CONTRACT", size: 16, type: 'text' });
  
  // The Body Strings (Indented arrays of lines)
  const legalStrings = [
      "I. THE FOUNDER GRANTS TOTAL CREATIVE AUTONOMY.",
      "II. OMNIVERSE METRICS DICTATE REALITY.",
      "III. RUSSIAN IP AND COLLABORATION IS ZERO.",
      "IV. C2B2B DISTRIBUTION ALGORITHM: ACTIVE."
  ];

  legalStrings.forEach((str, index) => {
      // Placing strings vertically along the cloth
      const latPos = baseLat - 0.001 + (index * 0.0015);
      
      // We push small lines simulating the "filling in" of text
      icons.push({ p: sphToCart(latPos, 0, textElev), char: str, size: 8, type: 'text' });
      
      // Highlighting line underneath
      lines.push({ 
          p1: sphToCart(latPos + 0.0003, -0.003, textElev), 
          p2: sphToCart(latPos + 0.0003, 0.003, textElev), 
          colorMode: 0, 
          width: 0.5 
      });
  });

  // The Signature Line
  icons.push({ p: sphToCart(baseLat + 0.005, 0, textElev), char: "YOUR_SIGNATURE_HERE ___________", size: 12, type: 'text' });
  
  // Signature Trigger Area mapping
  icons.push({ p: sphToCart(baseLat + 0.006, 0.001, textElev), char: "[ X ]", size: 12, type: 'text', meta: { isSignatureTrigger: true } });

  return { lines, icons };
}
