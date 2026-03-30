// ═══════════════════════════════════════════════════════════════════════
// MODEL: BOOSTER TEA ENERGETIC CAN
// Description: A 3D wireframe cylinder representing the BoosterTea product.
// Emits lines natively, and hosts a central interaction node.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getBoosterCanMesh(centerLat: number, centerLon: number, elev: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const height = 15; // physical height
    const radiusLat = 0.015;
    const radiusLon = 0.015;
    const ringCount = 8;
    const segments = 16;

    // Rings
    for (let r = 0; r <= ringCount; r++) {
        const ringElev = elev + (r / ringCount) * height;
        for (let s = 0; s < segments; s++) {
            const angle1 = (s / segments) * TAU;
            const angle2 = ((s + 1) / segments) * TAU;

            const p1 = sphToCart(
                centerLat + Math.cos(angle1) * radiusLat,
                centerLon + Math.sin(angle1) * radiusLon,
                ringElev
            );
            const p2 = sphToCart(
                centerLat + Math.cos(angle2) * radiusLat,
                centerLon + Math.sin(angle2) * radiusLon,
                ringElev
            );

            // Give the brand some color logic. If r=top/bottom, make it solid.
            lines.push({ 
                p1, p2, 
                colorMode: (r === 0 || r === ringCount) ? 2 : 0, 
                width: (r === 0 || r === ringCount) ? 1.5 : 0.5 
            });
        }
    }

    // Vertical Strips
    for (let s = 0; s < 4; s++) {
        const angle = (s / 4) * TAU;
        const p1 = sphToCart(
            centerLat + Math.cos(angle) * radiusLat,
            centerLon + Math.sin(angle) * radiusLon,
            elev
        );
        const p2 = sphToCart(
            centerLat + Math.cos(angle) * radiusLat,
            centerLon + Math.sin(angle) * radiusLon,
            elev + height
        );
        lines.push({ p1, p2, colorMode: 2, width: 1 });
    }

    // Central Trigger Area (Invisible hover zone projecting the interaction)
    icons.push({
        p: sphToCart(centerLat, centerLon, elev + height / 2),
        char: "[ BOOSTER TEA ]",
        size: 14,
        type: 'text',
        meta: { triggerState: 'OPEN_CHECKOUT', nlpId: "babylon_booster" }
    });

    // Holographic Logo Above Can
    icons.push({
        p: sphToCart(centerLat, centerLon, elev + height + 5),
        char: "⚡ ENERGY PROTOCOL ⚡",
        size: 8,
        type: 'text',
        meta: { glow: true }
    });

    return { lines, icons };
}
