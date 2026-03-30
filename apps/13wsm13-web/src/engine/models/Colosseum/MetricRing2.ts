// ═══════════════════════════════════════════════════════════════════════
// MODEL: METRIC RING 2 (Pack 12 / 15)
// Description: The upper glowing ring showing Financial Transactions,
// CRM status, and Token minting events from the Boss Syndicate.
// Coordinate Space: LAT 0.20, outer floating circle (Elev 80)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getMetricRing2(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const metricElev = 80;
  const outerRadius = radius * 0.95;
  const segments = 64;

  // Render a dashed dashed circle
  for (let i = 0; i < segments; i++) {
      if (i % 2 === 0) continue; // Skip every other segment to make it dashed
      
      const a1 = (i / segments) * TAU;
      const a2 = ((i + 1) / segments) * TAU;

      const p1 = sphToCart(baseLat + Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius, metricElev);
      const p2 = sphToCart(baseLat + Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius, metricElev);
      
      lines.push({ p1, p2, colorMode: 3, width: 0.5 }); // Cyan/X-Ray dashes
  }

  // Financial Event Nodes mapping to Monobank Split & Token logic
  const events = [
      { ang: 0, text: "MONOBANK SPLIT: SUCCESS" },
      { ang: TAU * 0.25, text: "+50 TOKENS MINTED" },
      { ang: TAU * 0.5, text: "C2B2B ROYALTY PAYMENT" },
      { ang: TAU * 0.75, text: "VOLUME: 840L CONFIRMED" }
  ];

  events.forEach(evt => {
      const pNode = sphToCart(baseLat + Math.cos(evt.ang) * outerRadius, Math.sin(evt.ang) * outerRadius, metricElev + 5);
      const pLine = sphToCart(baseLat + Math.cos(evt.ang) * outerRadius, Math.sin(evt.ang) * outerRadius, metricElev - 15);
      
      lines.push({ p1: pNode, p2: pLine, colorMode: 3, width: 2.0 }); // Vertical indicator peg
      icons.push({ p: pNode, char: "◆", size: 14, type: 'rune', meta: { isFinancialTrigger: true } });
      icons.push({ p: sphToCart(baseLat + Math.cos(evt.ang) * outerRadius, Math.sin(evt.ang) * outerRadius, metricElev + 15), char: evt.text, size: 12, type: 'text' });
  });

  return { lines, icons };
}
