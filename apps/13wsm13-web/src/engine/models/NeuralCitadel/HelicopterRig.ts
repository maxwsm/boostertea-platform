// ═══════════════════════════════════════════════════════════════════════
// MODEL: HELICOPTER RIG (Pack 4 / 14)
// Description: The hovering camera rig / helicopter inspecting the Citadel.
// Defined by an anchor point that will move across a bezier spline.
// Coordinate Space: High airspace above Citadel
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getHelicopterRig(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const heliElev = elev + 250;
  const pAnchor = sphToCart(baseLat - 0.01, 0, heliElev);

  // Crosshair projection downward
  lines.push({ p1: pAnchor, p2: sphToCart(baseLat - 0.01, 0, elev), colorMode: 3, width: 1.0 });

  // Helicopter mechanical mesh outline
  const sizeX = 0.002;
  const sizeY = 0.001;
  const pFront = sphToCart(baseLat - 0.01 - sizeY, 0, heliElev);
  const pBack = sphToCart(baseLat - 0.01 + sizeY, 0, heliElev);
  const pLeft = sphToCart(baseLat - 0.01, -sizeX, heliElev);
  const pRight = sphToCart(baseLat - 0.01, sizeX, heliElev);

  lines.push({ p1: pFront, p2: pLeft, colorMode: 1, width: 2.0 });
  lines.push({ p1: pLeft, p2: pBack, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBack, p2: pRight, colorMode: 1, width: 2.0 });
  lines.push({ p1: pRight, p2: pFront, colorMode: 1, width: 2.0 });

  // Data
  icons.push({ p: pAnchor, char: "H_RIG", size: 0, type: 'obj', meta: { isHeliRig: true, tParam: 0 } });
  icons.push({ p: sphToCart(baseLat - 0.01, 0.004, heliElev), char: "OVERSEER_PROTOCOL", size: 10, type: 'text' });

  return { lines, icons };
}
