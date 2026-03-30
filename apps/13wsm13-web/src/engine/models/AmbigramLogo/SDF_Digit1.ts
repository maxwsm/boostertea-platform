// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF DIGIT 1 (Pack 9 / 2)
// Description: Pure mathematical Signed Distance Field representation 
// of the digit "1". Returns positive value if outside, negative if inside.
// ═══════════════════════════════════════════════════════════════════════

// Math Helper for SDF boxes
function sdBox(px: number, py: number, bx: number, by: number): number {
    const dx = Math.abs(px) - bx;
    const dy = Math.abs(py) - by;
    const length = Math.sqrt(Math.max(dx, 0)*Math.max(dx, 0) + Math.max(dy, 0)*Math.max(dy, 0));
    return length + Math.min(Math.max(dx, dy), 0.0);
}

// 2D Rotation Helper
function rotate2D(x: number, y: number, angle: number): {x: number, y: number} {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return { x: x * c - y * s, y: x * s + y * c };
}

export function sdfDigit1(x: number, y: number): number {
    // Local coordinate space for the digit: X: -1 to 1, Y: -1 to 1
    
    // Main vertical stem of the "1"
    const stem = sdBox(x, y, 0.2, 0.8);

    // Top serif/flag of the "1" (Rotated box)
    const pRot = rotate2D(x + 0.3, y - 0.6, -Math.PI / 4);
    const flag = sdBox(pRot.x, pRot.y, 0.4, 0.15);

    // Bottom horizontal base of the "1"
    const base = sdBox(x, y + 0.8, 0.4, 0.15);

    // Minimum distance of the union of the three boxes
    return Math.min(stem, flag, base);
}
