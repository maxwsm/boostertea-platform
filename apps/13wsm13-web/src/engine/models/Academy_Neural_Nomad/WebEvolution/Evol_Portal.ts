// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - INTERACTIVE PORTAL (Pack 13 / 10)
// Description: The central control obelisk allowing users to trigger a 
// "guided tour" through the analogies.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getEvolPortal(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pCenter: P3D = { x: 0, y: 0, z: 10 };
  
  // A glowing obelisk representing the "Start" of the tour
  lines.push({ p1: { x: -3, y: -3, z: 0 }, p2: { x: 0, y: 0, z: 20 }, colorMode: 3, width: 2.0 });
  lines.push({ p1: { x: 3, y: -3, z: 0 },  p2: { x: 0, y: 0, z: 20 }, colorMode: 3, width: 2.0 });
  lines.push({ p1: { x: 0, y: 3, z: 0 },   p2: { x: 0, y: 0, z: 20 }, colorMode: 3, width: 2.0 });

  icons.push({ p: { x: 0, y: 0, z: 25 }, char: "[ START TOUR ]", size: 8, type: 'text', meta: { isBlinking: true, triggerState: 'START_EVOL_TOUR' } });

  return { lines, icons };
}
