// ═══════════════════════════════════════════════════════════════════════
// MODEL: GAS SHARD 3 (Pack 5 / 9)
// Description: A complex star-shaped crystalline geometry.
// Represents the highest value Gas hit (Jackpot shard).
// Coordinate Space: Local Cartesian (0,0,0)
// ═══════════════════════════════════════════════════════════════════════

import { P3D } from "../../utils/math";

export function getGasShard3Mesh(scale: number): { p1: P3D, p2: P3D }[] {
    const lines: { p1: P3D, p2: P3D }[] = [];
    
    const center: P3D = { x: 0, y: 0, z: 0 };
    
    // 6 protruding spikes along the XYZ axes
    const spikes: P3D[] = [
        { x: scale*1.5, y: 0, z: 0 }, { x: -scale*1.5, y: 0, z: 0 },
        { x: 0, y: scale*1.5, z: 0 }, { x: 0, y: -scale*1.5, z: 0 },
        { x: 0, y: 0, z: scale*1.5 }, { x: 0, y: 0, z: -scale*1.5 }
    ];

    // Inner core corners (cube)
    const coreScale = scale * 0.4;
    const coreCorners: P3D[] = [
        { x: coreScale, y: coreScale, z: coreScale }, { x: coreScale, y: coreScale, z: -coreScale },
        { x: coreScale, y: -coreScale, z: coreScale }, { x: coreScale, y: -coreScale, z: -coreScale },
        { x: -coreScale, y: coreScale, z: coreScale }, { x: -coreScale, y: coreScale, z: -coreScale },
        { x: -coreScale, y: -coreScale, z: coreScale }, { x: -coreScale, y: -coreScale, z: -coreScale }
    ];

    // Connect spikes to the core to form a Star
    spikes.forEach(spike => {
        lines.push({ p1: center, p2: spike }); // Internal spine for the spike
        coreCorners.forEach(corner => {
            // Draw a line if the corner correlates to the axis of the spike
            if (Math.sign(spike.x) === Math.sign(corner.x) && spike.x !== 0 ||
                Math.sign(spike.y) === Math.sign(corner.y) && spike.y !== 0 ||
                Math.sign(spike.z) === Math.sign(corner.z) && spike.z !== 0) {
                lines.push({ p1: corner, p2: spike });
            }
        });
    });

    return lines;
}
