// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - RENTAL vs OWNERSHIP (Pack 13 / 5)
// Description: Grandma Analogy - "Renting a house vs Building your own".
// Left: A house owned by a giant corporation where you just visit.
// Right: A digital house secured by blockchain meaning nobody can evict you.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getEvolOwnership(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Base outline for simple house structure
  const makeHouse = (cx: number, cy: number, cz: number, cMode: number) => {
      // Base square
      lines.push({ p1: { x: cx-4, y: cy, z: cz }, p2: { x: cx+4, y: cy, z: cz }, colorMode: cMode, width: 1.5 });
      lines.push({ p1: { x: cx-4, y: cy, z: cz+8 }, p2: { x: cx+4, y: cy, z: cz+8 }, colorMode: cMode, width: 1.5 });
      lines.push({ p1: { x: cx-4, y: cy, z: cz }, p2: { x: cx-4, y: cy, z: cz+8 }, colorMode: cMode, width: 1.5 });
      lines.push({ p1: { x: cx+4, y: cy, z: cz }, p2: { x: cx+4, y: cy, z: cz+8 }, colorMode: cMode, width: 1.5 });
      // Roof triangle
      lines.push({ p1: { x: cx-5, y: cy, z: cz+8 }, p2: { x: cx, y: cy, z: cz+13 }, colorMode: cMode, width: 1.5 });
      lines.push({ p1: { x: cx+5, y: cy, z: cz+8 }, p2: { x: cx, y: cy, z: cz+13 }, colorMode: cMode, width: 1.5 });
  };

  // Left: Rental (Web 2)
  const pRent: P3D = { x: -15, y: 0, z: 0 };
  makeHouse(pRent.x, pRent.y, pRent.z, 0); // Dull color
  
  // A giant corporation logo hovering over the house meaning they own it
  icons.push({ p: { x: pRent.x, y: 0, z: pRent.z + 20 }, char: "BIG TECH INC.", size: 5, type: 'text' });
  icons.push({ p: { x: pRent.x, y: 0, z: pRent.z + 5 }, char: "RENT", size: 4, type: 'text' });
  icons.push({ p: { x: pRent.x, y: 0, z: pRent.z - 10 }, char: "TENANT (WEB2)", size: 6, type: 'text' });

  // Right: Ownership (Web 3)
  const pOwn: P3D = { x: 15, y: 0, z: 0 };
  makeHouse(pOwn.x, pOwn.y, pOwn.z, 2); // Golden color
  
  // Halo of ownership around the house
  icons.push({ p: { x: pOwn.x, y: 0, z: pOwn.z + 5 }, char: "YOUR WALLET", size: 4, type: 'text', meta: { colorMode: 2 } });
  icons.push({ p: { x: pOwn.x, y: 0, z: pOwn.z - 10 }, char: "OWNER (WEB3)", size: 6, type: 'text' });

  // Arrow connecting evolution
  lines.push({ p1: { x: -5, y: 0, z: 5 }, p2: { x: 5, y: 0, z: 5 }, colorMode: 2, width: 2 });
  icons.push({ p: { x: 5, y: 0, z: 5 }, char: ">", size: 6, type: 'rune', meta: { colorMode: 2 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "EVOL_OWN", size: 0, type: 'obj', meta: { nlpId: 'evol_ownership' }});

  return { lines, icons };
}
