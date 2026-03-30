// ═══════════════════════════════════════════════════════════════════════
// MODEL: NODE CABLE BEZIER (Pack 5 / 5)
// Description: Exports a mathematical rendering function that MasterCanvas 
// calls dynamically to draw sagging, interactive cables from the Master 
// Matrix to the player's Mouse Coordinate (and eventually snapping to a port).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, P3D } from "../../utils/math";

export function drawCableBezier(startPoint: P3D, endPoint: P3D, isConnected: boolean): PLine[] {
    const lines: PLine[] = [];
    const segments = 20;

    // A sag control point in the middle based on distance
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const dz = endPoint.z - startPoint.z;
    
    // Sag down on the Y axis (Elevation)
    const sagDepth = Math.sqrt(dx*dx + dz*dz) * 0.5; // Deeper sag for longer stretch
    
    const cp = {
        x: startPoint.x + dx * 0.5,
        y: Math.min(startPoint.y, endPoint.y) - sagDepth,
        z: startPoint.z + dz * 0.5
    };

    let prevPoint = startPoint;

    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        // Quadratic Bezier Formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const tInv = 1 - t;
        
        const currentP: P3D = {
            x: tInv*tInv*startPoint.x + 2*tInv*t*cp.x + t*t*endPoint.x,
            y: tInv*tInv*startPoint.y + 2*tInv*t*cp.y + t*t*endPoint.y,
            z: tInv*tInv*startPoint.z + 2*tInv*t*cp.z + t*t*endPoint.z
        };

        lines.push({ 
            p1: prevPoint, 
            p2: currentP, 
            colorMode: isConnected ? 3 : 2, // Highlight Neon Green if fully connected, Red if loose
            width: 3.0 // Thick physical cable
        });
        
        prevPoint = currentP;
    }

    return lines;
}
