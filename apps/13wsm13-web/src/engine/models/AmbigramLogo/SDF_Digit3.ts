// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF DIGIT 3 (Pack 9 / 3)
// Description: Pure mathematical Signed Distance Field representation 
// of the digit "3" using boolean operations on circles and boxes.
// ═══════════════════════════════════════════════════════════════════════

// Basic SDF primitives
function sdCircle(px: number, py: number, radius: number): number {
    return Math.sqrt(px*px + py*py) - radius;
}

function sdBox(px: number, py: number, bx: number, by: number): number {
    const dx = Math.abs(px) - bx;
    const dy = Math.abs(py) - by;
    const length = Math.sqrt(Math.max(dx, 0)*Math.max(dx, 0) + Math.max(dy, 0)*Math.max(dy, 0));
    return length + Math.min(Math.max(dx, dy), 0.0);
}

export function sdfDigit3(x: number, y: number): number {
    // Upper loop of the 3
    const topOuter = sdCircle(x, y - 0.4, 0.4);
    const topInner = sdCircle(x, y - 0.4, 0.2);
    // Subtract inner from outer to get a ring (Math.max(outer, -inner))
    let topRing = Math.max(topOuter, -topInner);

    // Cut off the left side of the upper loop
    const upperCut = sdBox(x + 0.5, y - 0.4, 0.5, 0.5);
    topRing = Math.max(topRing, -upperCut);

    // Lower loop of the 3 (slightly larger)
    const botOuter = sdCircle(x, y + 0.4, 0.5);
    const botInner = sdCircle(x, y + 0.4, 0.3);
    let botRing = Math.max(botOuter, -botInner);

    // Cut off the left side of the lower loop
    const lowerCut = sdBox(x + 0.5, y + 0.4, 0.5, 0.6);
    botRing = Math.max(botRing, -lowerCut);

    // Horizontal top cap
    const topCap = sdBox(x + 0.1, y - 0.8, 0.3, 0.1);

    // Return union of upper ring, lower ring, and top cap
    return Math.min(topRing, botRing, topCap);
}
