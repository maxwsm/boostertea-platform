// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - BANK VAULT vs SELF CUSTODY (Pack 13 / 3)
// Description: Grandma Analogy - "Trusting the Bank vs Owning the keys".
// Visualizes a heavy iron vault with a middle-man vs a floating, 
// glowing cryptographic key held by a personal avatar.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getEvolBankVault(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Left: Bank Vault (Centralized)
  const pVault: P3D = { x: -15, y: 0, z: 15 };
  
  // Iron Vault Door
  const vaultR = 8;
  for(let i=0; i<8; i++){
      const a1 = (i/8)*TAU;
      const a2 = ((i+1)/8)*TAU;
      const p1: P3D = { x: pVault.x, y: Math.cos(a1)*vaultR, z: pVault.z + Math.sin(a1)*vaultR };
      const p2: P3D = { x: pVault.x, y: Math.cos(a2)*vaultR, z: pVault.z + Math.sin(a2)*vaultR };
      lines.push({ p1, p2, colorMode: 1, width: 3.0 }); // Heavy metal ring
  }
  // The 'Middleman' guardian
  icons.push({ p: { x: pVault.x, y: 0, z: pVault.z }, char: "BANKER", size: 4, type: 'text' });
  icons.push({ p: { x: pVault.x, y: 0, z: pVault.z + 15 }, char: "CUSTODIAL (THEY OWN IT)", size: 6, type: 'text' });

  // Right: Self Custody (Decentralized)
  const pCustody: P3D = { x: 15, y: 0, z: 15 };
  
  // A glowing, floating cryptographic key
  const keyLength = 10;
  lines.push({ p1: { x: pCustody.x - keyLength/2, y: 0, z: pCustody.z }, p2: { x: pCustody.x + keyLength/2, y: 0, z: pCustody.z }, colorMode: 2, width: 3.0 });
  // Key teeth
  lines.push({ p1: { x: pCustody.x + 2, y: 0, z: pCustody.z }, p2: { x: pCustody.x + 2, y: 0, z: pCustody.z - 3 }, colorMode: 2, width: 2.0 });
  lines.push({ p1: { x: pCustody.x + 4, y: 0, z: pCustody.z }, p2: { x: pCustody.x + 4, y: 0, z: pCustody.z - 5 }, colorMode: 2, width: 2.0 });

  icons.push({ p: { x: pCustody.x, y: 0, z: pCustody.z + 15 }, char: "NON-CUSTODIAL (YOU OWN IT)", size: 6, type: 'text' });

  // Arrow connecting evolution
  lines.push({ p1: { x: -5, y: 0, z: 15 }, p2: { x: 5, y: 0, z: 15 }, colorMode: 2, width: 2 });
  icons.push({ p: { x: 5, y: 0, z: 15 }, char: ">", size: 6, type: 'rune', meta: { colorMode: 2 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "EVOL_VAULT", size: 0, type: 'obj', meta: { nlpId: 'evol_bank_vault' }});

  return { lines, icons };
}
