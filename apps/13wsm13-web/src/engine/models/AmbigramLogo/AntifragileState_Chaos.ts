// ═══════════════════════════════════════════════════════════════════════
// MODEL: ANTIFRAGILE STATE CHAOS (Pack 9 / 11)
// Description: Returns the destination coordinate for a given dot in the
// "Chaos" (broken) state. The logo shatters into a sphere of dust.
// ═══════════════════════════════════════════════════════════════════════

export function getChaosCoordinate(index: number): { x: number, y: number, z: number } {
    // Deterministic randomness based on index
    const rSeed1 = Math.abs(Math.sin(index * 13.37));
    const rSeed2 = Math.abs(Math.cos(index * 42.19));
    const rSeed3 = Math.abs(Math.sin(index * 99.99));

    // Spherical scatter algorithm
    const radius = 20 + rSeed1 * 100; // Wide scattered radius
    const theta = rSeed2 * Math.PI * 2; // Angle around Z
    const phi = Math.acos(2 * rSeed3 - 1); // Angle from Z axis

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return { x, y, z };
}
