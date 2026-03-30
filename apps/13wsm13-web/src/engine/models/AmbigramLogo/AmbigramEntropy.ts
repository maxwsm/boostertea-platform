// ═══════════════════════════════════════════════════════════════════════
// MODEL: AMBIGRAM ENTROPY (Pack 9 / 14)
// Description: The physics lerp function dictating how the logo shatters.
// ═══════════════════════════════════════════════════════════════════════

export function lerpToChaos(
    currX: number, currY: number, currZ: number,
    chaosX: number, chaosY: number, chaosZ: number,
    progress: number // 0 (Order) -> 1 (Complete Chaos)
): { x: number, y: number, z: number } {
    
    // We don't use a simple linear lerp. For antifragility, 
    // physics should be explosive (exponential easing).
    // Easing: easeOutExpo
    const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    
    return {
        x: currX + (chaosX - currX) * easedProgress,
        y: currY + (chaosY - currY) * easedProgress,
        z: currZ + (chaosZ - currZ) * easedProgress
    };
}
