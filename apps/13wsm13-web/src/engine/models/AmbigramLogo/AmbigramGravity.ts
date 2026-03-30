// ═══════════════════════════════════════════════════════════════════════
// MODEL: AMBIGRAM GRAVITY (Pack 9 / 15)
// Description: The reverse physics layer acting as the cohesive "Gravity"
// pulling 131,313 particles back into perfect Order constraint.
// ═══════════════════════════════════════════════════════════════════════

export function lerpToOrder(
    currX: number, currY: number, currZ: number,
    orderX: number, orderY: number, orderZ: number,
    progress: number // 0 (Chaos) -> 1 (Complete Order)
): { x: number, y: number, z: number } {
    
    // Magnetic snap (EaseOutBack or Elastic easing simulating tension)
    // We will use a standard cubic easeOut for simplicity in TS map.
    const f = progress - 1;
    const easedProgress = f*f*f + 1;

    return {
        x: currX + (orderX - currX) * easedProgress,
        y: currY + (orderY - currY) * easedProgress,
        z: currZ + (orderZ - currZ) * easedProgress
    };
}
