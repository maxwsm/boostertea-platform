// ═══════════════════════════════════════════════════════════════════════
// MODEL: BRAIN HEMISPHERE BIO (Pack 2 / 10)
// Description: The organic left hemisphere of the Vitruvian brain.
// Node-based neural networks representing human intuition and chaos.
// Coordinate Space: LAT 0.06 (Head Area), Organic color
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBrainHemisphereBio(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const headLat = baseLat - radius * 0.45; // Top of the spine
  const hRadius = radius * 0.1; // Head radius

  // Neural network point cloud for the left hemisphere
  const nodeCount = 15;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI + Math.PI / 2; // Left side of head
      const dist = Math.random() * hRadius;
      
      const lat = headLat + Math.cos(angle) * dist;
      const lon = Math.sin(angle) * dist;
      nodes.push({ lat, lon });
      
      const p = sphToCart(lat, lon, elev);
      icons.push({ p, char: "•", size: 5, type: 'rune', meta: { isNeuron: true } });
  }

  // Connect close nodes to form a neural mesh
  for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].lon - nodes[j].lon;
          const dy = nodes[i].lat - nodes[j].lat;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < hRadius * 0.6) {
              const p1 = sphToCart(nodes[i].lat, nodes[i].lon, elev);
              const p2 = sphToCart(nodes[j].lat, nodes[j].lon, elev);
              lines.push({ p1, p2, colorMode: 1, width: 0.8 }); // Bio neuron links
          }
      }
  }

  return { lines, icons };
}
