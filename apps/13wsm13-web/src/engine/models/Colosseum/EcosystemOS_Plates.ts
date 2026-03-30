// ═══════════════════════════════════════════════════════════════════════
// MODEL: ECOSYSTEM OS PLATES (Pack 9 / 15)
// Description: The Syndicate CRM Boss view. Three massive hovering plates
// representing the interconnected brands: BoosterTea, FunnyDrops, TLab.
// Coordinate Space: LAT 0.20, North-East sector
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getEcosystemOSPlates(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Located at North-East (Math.PI / 1.5)
  const angle = Math.PI / 1.5;
  const tLat = baseLat + Math.cos(angle) * (radius * 1.1); // Slightly outside Colosseum
  const tLon = Math.sin(angle) * (radius * 1.1);

  const plateSize = 0.006;
  const plateSpacing = 40;

  // Draw 3 horizontal Kanban-style transparent plates stacked vertically
  const brands = [
      { name: "BOOSTER_TEA_API", elev: 40 },
      { name: "FUNNY_DROPS_API", elev: 80 },
      { name: "TLAB_VOLUME_MATRIX", elev: 120 }
  ];

  brands.forEach((brand) => {
      const e = brand.elev;
      // Plate corners
      const pA = sphToCart(tLat - plateSize, tLon - plateSize, e);
      const pB = sphToCart(tLat + plateSize, tLon - plateSize, e);
      const pC = sphToCart(tLat + plateSize, tLon + plateSize, e);
      const pD = sphToCart(tLat - plateSize, tLon + plateSize, e);
      
      lines.push({ p1: pA, p2: pB, colorMode: 1, width: 1.5 });
      lines.push({ p1: pB, p2: pC, colorMode: 1, width: 1.5 });
      lines.push({ p1: pC, p2: pD, colorMode: 1, width: 1.5 });
      lines.push({ p1: pD, p2: pA, colorMode: 1, width: 1.5 });
      
      // Floating UI text for the brand plate
      icons.push({ p: sphToCart(tLat, tLon, e + 10), char: brand.name, size: 12, type: 'text' });
      
      // Simulate falling Kanban cards (small vertical lines hitting the plate)
      for(let k = 0; k < 3; k++) {
          const dropLat = tLat + (Math.random() - 0.5) * plateSize;
          const dropLon = tLon + (Math.random() - 0.5) * plateSize;
          const dropH = e + 5 + Math.random() * 20; // Height above plate
          
          lines.push({ 
              p1: sphToCart(dropLat, dropLon, dropH), 
              p2: sphToCart(dropLat, dropLon, dropH + 5), 
              colorMode: 2, // Highlight color
              width: 1.0 
          });
      }
  });

  // Main Ecosystem Pipe connecting them all through the center
  const pBottom = sphToCart(tLat, tLon, 0);
  const pTop = sphToCart(tLat, tLon, 160);
  lines.push({ p1: pBottom, p2: pTop, colorMode: 1, width: 4.0 }); // Very thick master pipe
  
  icons.push({ p: sphToCart(tLat - 0.012, tLon, 180), char: "ECOSYSTEM_OS // CRM SYNC ALGORITHM", size: 16, type: 'text' });
  icons.push({ p: sphToCart(tLat - 0.015, tLon, 165), char: "STATUS: PROCESSING SPLIT PAYMENTS", size: 12, type: 'text' });

  return { lines, icons };
}
