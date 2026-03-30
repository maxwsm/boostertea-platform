// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF LETTER M (Pack 9 / 6)
// Description: SDF equation for the letter "M".
// ═══════════════════════════════════════════════════════════════════════

function sdBox(px: number, py: number, bx: number, by: number): number {
    const dx = Math.abs(px) - bx;
    const dy = Math.abs(py) - by;
    const length = Math.sqrt(Math.max(dx, 0)*Math.max(dx, 0) + Math.max(dy, 0)*Math.max(dy, 0));
    return length + Math.min(Math.max(dx, dy), 0.0);
}

function rotate2D(x: number, y: number, angle: number): {x: number, y: number} {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return { x: x * c - y * s, y: x * s + y * c };
}

export function sdfLetterM(x: number, y: number): number {
    const thickness = 0.15;
    const length = 0.9;
    
    // Left vertical stem (straight)
    const leg1 = sdBox(x + 0.6, y, thickness, length * 1.05);

    // Center-left slanted leg \
    let pRot1 = rotate2D(x + 0.3, y - 0.2, 0.4);
    const leg2 = sdBox(pRot1.x, pRot1.y, thickness, length * 0.7);

    // Center-right slanted leg /
    let pRot2 = rotate2D(x - 0.3, y - 0.2, -0.4);
    const leg3 = sdBox(pRot2.x, pRot2.y, thickness, length * 0.7);

    // Right vertical stem (straight)
    const leg4 = sdBox(x - 0.6, y, thickness, length * 1.05);

    return Math.min(leg1, leg2, leg3, leg4);
}
