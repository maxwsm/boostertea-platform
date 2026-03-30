// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF LETTER W (Pack 9 / 4)
// Description: SDF equation for the letter "W".
// Built using 4 angled boxes overlapping.
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

export function sdfLetterW(x: number, y: number): number {
    const thickness = 0.15;
    const length = 0.9;
    
    // Leftmost slanted leg \
    let pRot1 = rotate2D(x + 0.6, y, -0.25);
    const leg1 = sdBox(pRot1.x, pRot1.y, thickness, length);

    // Center-left slanted leg /
    let pRot2 = rotate2D(x + 0.2, y, 0.25);
    const leg2 = sdBox(pRot2.x, pRot2.y, thickness, length);

    // Center-right slanted leg \
    let pRot3 = rotate2D(x - 0.2, y, -0.25);
    const leg3 = sdBox(pRot3.x, pRot3.y, thickness, length);

    // Rightmost slanted leg /
    let pRot4 = rotate2D(x - 0.6, y, 0.25);
    const leg4 = sdBox(pRot4.x, pRot4.y, thickness, length);

    return Math.min(leg1, leg2, leg3, leg4);
}
