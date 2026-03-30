// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - AUTOMATION ROBOT (Pack 16 / 5)
// Description: Visualizes Code-Is-Law. A robotic/mechanical arm moving 
// funds instantly when a proposal passes. No corrupt middle manager
// can block the community's decision.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getDaoAutomation(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Mechanical Arm base
  lines.push({ p1: {x:0, y:-10, z:0}, p2: {x:0, y:-10, z:15}, colorMode: 1, width: 3.0 });
  
  // Joint rotating based on "Vote passed" logic
  const angle = Math.sin(time) > 0 ? Math.PI/4 : Math.PI; // Arm swings back and forth
  
  const elbow: P3D = { x: 0, y: -10, z: 15 };
  const hand: P3D = { 
      x: 0, 
      y: -10 + Math.cos(angle)*15, 
      z: 15 + Math.sin(angle)*15 
  };
  
  lines.push({ p1: elbow, p2: hand, colorMode: 2, width: 2.0 });

  // Veto block (Crossed out manager)
  icons.push({ p: { x: 0, y: -15, z: 25 }, char: "[ HUMAN OVERRIDE: DISABLED ]", size: 4, type: 'text', meta: { colorMode: 3 } });

  // Action executed
  if (Math.sin(time) > 0) {
      icons.push({ p: hand, char: "FUNDS DEPLOYED", size: 5, type: 'text', meta: { colorMode: 2 } });
  }

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "DAO_AUTO", size: 0, type: 'obj', meta: { nlpId: 'dao_automation' }});

  return { lines, icons };
}
