// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF MIRRORED 3 (Pack 9 / 8)
// Description: The mirrored version of "3". Looking at the ambigram, it 
// reads structurally backwards until rotated 180 degrees.
// ═══════════════════════════════════════════════════════════════════════

import { sdfDigit3 } from "./SDF_Digit3";

export function sdfMirrored3(x: number, y: number): number {
    // Perfect 180 degree rotation
    return sdfDigit3(-x, -y);
}
