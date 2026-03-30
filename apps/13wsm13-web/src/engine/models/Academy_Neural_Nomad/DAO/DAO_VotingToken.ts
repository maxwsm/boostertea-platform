// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - VOTING TOKEN (Pack 16 / 3)
// Description: A hand holding a glowing cryptographic key/token. 
// Visualizes that ownership is governance (1 Token = 1 Vote).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getDaoVotingToken(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Abstract Pedestal Hand
  const pHand: P3D = { x: 0, y: 0, z: 15 };
  lines.push({ p1: {x:-5, y:0, z:0}, p2: {x:-2, y:0, z:12}, colorMode: 1, width: 2.0 });
  lines.push({ p1: {x:5, y:0, z:0}, p2: {x:2, y:0, z:12}, colorMode: 1, width: 2.0 });
  lines.push({ p1: {x:-2, y:0, z:12}, p2: {x:2, y:0, z:12}, colorMode: 1, width: 2.0 });

  // Floating Voting Ticket / Token
  const floatZ = pHand.z + 5 + Math.sin(time)*2;

  lines.push({ p1: {x:-3, y:-3, z:floatZ}, p2: {x:3, y:-3, z:floatZ}, colorMode: 2, width: 2.0 });
  lines.push({ p1: {x:3, y:-3, z:floatZ}, p2: {x:3, y:3, z:floatZ}, colorMode: 2, width: 2.0 });
  lines.push({ p1: {x:3, y:3, z:floatZ}, p2: {x:-3, y:3, z:floatZ}, colorMode: 2, width: 2.0 });
  lines.push({ p1: {x:-3, y:3, z:floatZ}, p2: {x:-3, y:-3, z:floatZ}, colorMode: 2, width: 2.0 });

  icons.push({ p: { x: 0, y: 0, z: floatZ }, char: "1 TOKEN = 1 VOTE", size: 4, type: 'text', meta: { colorMode: 2 } });
  
  // Digital ballots flying up
  if(Math.sin(time*10) > 0) icons.push({ p: { x: -5, y: 0, z: floatZ + 10 }, char: "YES", size: 6, type: 'text', meta: { colorMode: 3 } });
  if(Math.cos(time*8) > 0) icons.push({ p: { x: 5, y: 0, z: floatZ + 15 }, char: "NO", size: 6, type: 'text', meta: { colorMode: 0 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "DAO_VOTE", size: 0, type: 'obj', meta: { nlpId: 'dao_voting_token' }});

  return { lines, icons };
}
