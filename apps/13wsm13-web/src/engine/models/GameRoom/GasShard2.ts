// ═══════════════════════════════════════════════════════════════════════
// MODEL: GAS SHARD 2 (Pack 5 / 8)
// Description: An 8-faced crystalline geometry (Octahedron).
// Represents medium value Gas hits in the clicker game.
// Coordinate Space: Local Cartesian (0,0,0)
// ═══════════════════════════════════════════════════════════════════════

import { P3D } from "../../utils/math";

export function getGasShard2Mesh(scale: number): { p1: P3D, p2: P3D }[] {
    const lines: { p1: P3D, p2: P3D }[] = [];
    
    // Octahedron Vertices
    const top: P3D = { x: 0, y: scale, z: 0 };
    const bottom: P3D = { x: 0, y: -scale, z: 0 };
    const pF: P3D = { x: 0, y: 0, z: scale };   // Front
    const pB: P3D = { x: 0, y: 0, z: -scale };  // Back
    const pL: P3D = { x: -scale, y: 0, z: 0 };  // Left
    const pR: P3D = { x: scale, y: 0, z: 0 };   // Right

    // Top Pyramid
    lines.push({ p1: top, p2: pF });
    lines.push({ p1: top, p2: pB });
    lines.push({ p1: top, p2: pL });
    lines.push({ p1: top, p2: pR });

    // Bottom Pyramid
    lines.push({ p1: bottom, p2: pF });
    lines.push({ p1: bottom, p2: pB });
    lines.push({ p1: bottom, p2: pL });
    lines.push({ p1: bottom, p2: pR });

    // Equator
    lines.push({ p1: pF, p2: pR });
    lines.push({ p1: pR, p2: pB });
    lines.push({ p1: pB, p2: pL });
    lines.push({ p1: pL, p2: pF });

    return lines;
}
