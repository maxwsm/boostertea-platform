// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOKENOMICS - DISTRIBUTION WATERFALL (Pack 11 / 3)
// Description: A multi-tiered cascading fountain representing safe,
// transparent token allocation (Community > Treasury > Team).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getTokenDistWaterfall(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const tiers = [
      { r: 20, z: 30, text: "70% COMMUNITY POOL" },
      { r: 14, z: 15, text: "20% TREASURY / MARKETING" },
      { r: 8,  z: 0,  text: "10% FOUNDATION (LOCKED)" }
  ];

  tiers.forEach((tier, i) => {
      // Draw pools
      let pPrev: P3D | null = null;
      let pFirst: P3D | null = null;
      for(let a=0; a<36; a++) {
          const angle = (a/36)*TAU;
          const pCurr: P3D = { x: Math.cos(angle)*tier.r, y: Math.sin(angle)*tier.r, z: tier.z };
          
          if(pPrev) lines.push({ p1: pPrev, p2: pCurr, colorMode: 1, width: 1.5 });
          else pFirst = pCurr;
          
          pPrev = pCurr;

          // Water cascading down to the next tier
          if (i < tiers.length - 1 && a % 6 === 0) {
              const dripEnd: P3D = { x: Math.cos(angle)*tier.r * 0.8, y: Math.sin(angle)*tier.r * 0.8, z: tiers[i+1].z };
              lines.push({ p1: pCurr, p2: dripEnd, colorMode: 2, width: 0.5 }); // Flowing liquidity
          }
      }
      if(pFirst && pPrev) lines.push({ p1: pPrev, p2: pFirst, colorMode: 1, width: 1.5 });

      // Holographic text for each tier
      icons.push({ p: { x: tier.r + 5, y: 0, z: tier.z }, char: tier.text, size: 6, type: 'text' });
  });

  // NLP Tooltip Anchor
  icons.push({ p: { x: 0, y: 0, z: 40 }, char: "WATERFALL_INFO", size: 0, type: 'obj', meta: { nlpId: 'distribution_waterfall' }});

  return { lines, icons };
}
