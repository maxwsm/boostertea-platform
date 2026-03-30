// ═══════════════════════════════════════════════════════════════════════
// MODEL: GAS SHARD 1 (Pack 5 / 7)
// Description: A 4-faced crystalline geometry (Tetrahedron).
// Spawned dynamically by the Game Loop for the Gas Clicker game.
// Coordinate Space: Local Cartesian (0,0,0)
// ═══════════════════════════════════════════════════════════════════════

import { P3D } from "../../utils/math";

export function getGasShard1Mesh(scale: number): { p1: P3D, p2: P3D }[] {
    const lines: { p1: P3D, p2: P3D }[] = [];
    
    // Tetrahedron Vertices
    const v1: P3D = { x: 0, y: scale, z: 0 }; // Top
    const v2: P3D = { x: -scale, y: -scale, z: scale }; // Front Left
    const v3: P3D = { x: scale, y: -scale, z: scale };  // Front Right
    const v4: P3D = { x: 0, y: -scale, z: -scale };     // Back

    // Edges
    lines.push({ p1: v1, p2: v2 });
    lines.push({ p1: v1, p2: v3 });
    lines.push({ p1: v1, p2: v4 });
    lines.push({ p1: v2, p2: v3 });
    lines.push({ p1: v3, p2: v4 });
    lines.push({ p1: v4, p2: v2 });

    return lines;
}
