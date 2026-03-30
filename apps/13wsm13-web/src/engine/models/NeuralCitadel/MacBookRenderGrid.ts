// ═══════════════════════════════════════════════════════════════════════
// MODEL: MACBOOK RENDER MESH (Pack 4 / 5)
// Description: A structural matrix outlining the 3D wireframe of a MacBook.
// This doesn't output global PLine array directly. It exports a rigid 
// bounding box that MasterCanvas will multiply, rotate, and draw 9 times.
// ═══════════════════════════════════════════════════════════════════════

export interface Rect3D {
    p1: {x:number, y:number, z:number},
    p2: {x:number, y:number, z:number},
    p3: {x:number, y:number, z:number},
    p4: {x:number, y:number, z:number}
}

export function getMacBookMesh(): { base: Rect3D, screen: Rect3D, keys: Rect3D[] } {
    // We define this in Local Cartesian Space (0,0,0 is the center of the laptop)
    const width = 0.002;
    const depth = 0.0015;
    const height = 0.002; // Open screen height

    // Base (Keyboard deck)
    const base: Rect3D = {
        p1: {x: -width, y: -depth, z: 0},
        p2: {x: width, y: -depth, z: 0},
        p3: {x: width, y: depth, z: 0},
        p4: {x: -width, y: depth, z: 0}
    };

    // Screen (Angled open, attached to the back of the base (y: depth))
    const screenTilt = 0.0005; // Leaning back slightly
    const screen: Rect3D = {
        p1: {x: -width, y: depth, z: 0}, // Bottom left (hinge)
        p2: {x: width, y: depth, z: 0},  // Bottom right (hinge)
        p3: {x: width, y: depth + screenTilt, z: height}, // Top right
        p4: {x: -width, y: depth + screenTilt, z: height} // Top left
    };

    // Placeholder for 3 keyboard rows (just aesthetic lines on the deck)
    const keys: Rect3D[] = [];
    for(let i=0; i<3; i++) {
        const rowY = -depth * 0.5 + (i * depth * 0.3);
        keys.push({
            p1: {x: -width * 0.8, y: rowY, z: 0},
            p2: {x: width * 0.8, y: rowY, z: 0},
            p3: {x: width * 0.8, y: rowY + 0.0001, z: 0},
            p4: {x: -width * 0.8, y: rowY + 0.0001, z: 0}
        });
    }

    return { base, screen, keys };
}
