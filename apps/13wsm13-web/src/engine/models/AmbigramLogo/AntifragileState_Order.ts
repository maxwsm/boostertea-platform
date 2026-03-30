// ═══════════════════════════════════════════════════════════════════════
// MODEL: ANTIFRAGILE STATE ORDER (Pack 9 / 12)
// Description: Returns the correct destination coordinate for a dot in 
// the "Order" (perfect) state where the logo is readable.
// Simply reads the coordinate seeded by DotworkSeeder.
// ═══════════════════════════════════════════════════════════════════════

import { AmbigramPoint } from "./DotworkSeeder";

export function getOrderCoordinate(seededPoint: AmbigramPoint): { x: number, y: number, z: number } {
    // In complete order, the particles return exactly to their mathematical 
    // bounds designed by the Signed Distance Field algorithms.
    return {
        x: seededPoint.x,
        y: seededPoint.y,
        z: seededPoint.z // The tiny depth offset giving the tattoo some volume
    };
}
