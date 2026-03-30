// ═══════════════════════════════════════════════════════════════════════
// MODEL: SDF LETTER S (Pack 9 / 5)
// Description: SDF equation for the letter "S".
// Built utilizing boolean ring cuts to form the S-curve.
// ═══════════════════════════════════════════════════════════════════════

function sdCircle(px: number, py: number, radius: number): number {
    return Math.sqrt(px*px + py*py) - radius;
}

function sdBox(px: number, py: number, bx: number, by: number): number {
    const dx = Math.abs(px) - bx;
    const dy = Math.abs(py) - by;
    const length = Math.sqrt(Math.max(dx, 0)*Math.max(dx, 0) + Math.max(dy, 0)*Math.max(dy, 0));
    return length + Math.min(Math.max(dx, dy), 0.0);
}

export function sdfLetterS(x: number, y: number): number {
    // Upper ring 
    const topOuter = sdCircle(x, y - 0.4, 0.4);
    const topInner = sdCircle(x, y - 0.4, 0.2);
    let topHalf = Math.max(topOuter, -topInner);

    // Cut out the bottom right to let the S curve down
    const cutTop = sdBox(x - 0.3, y - 0.4, 0.3, 0.2);
    topHalf = Math.max(topHalf, -cutTop);

    // Lower ring
    const botOuter = sdCircle(x, y + 0.4, 0.4);
    const botInner = sdCircle(x, y + 0.4, 0.2);
    let botHalf = Math.max(botOuter, -botInner);

    // Cut out the top left
    const cutBot = sdBox(x + 0.3, y + 0.4, 0.3, 0.2);
    botHalf = Math.max(botHalf, -cutBot);

    // Connect them in the middle
    const bridge = sdBox(x, y, 0.2, 0.2);

    return Math.min(topHalf, botHalf, bridge);
}
