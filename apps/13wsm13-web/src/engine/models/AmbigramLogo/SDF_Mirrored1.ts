// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF MIRRORED 1 (Pack 9 / 7)
// Description: The mirrored right-side version of "1" for the Ambigram.
// Functionally acts as the mathematical reflection along the X and Y bounds.
// ═══════════════════════════════════════════════════════════════════════

import { sdfDigit1 } from "./SDF_Digit1";

export function sdfMirrored1(x: number, y: number): number {
    // To create a perfect 180 degree ambigram, we invert the axes.
    // If you spin the canvas 180 degrees, this looks like a normal '1'.
    return sdfDigit1(-x, -y);
}
