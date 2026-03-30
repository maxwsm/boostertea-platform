// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH ISOLATED ORBIT CONTROLS (Pack 10 / 14)
// Description: When the user teleports inside a Math Painting, the entire 
// scrolling ecosystem (CoreSphere) is paused/invisible. This file defines 
// the physics for dragging the mouse to tumble the Math object in 3D space.
// ═══════════════════════════════════════════════════════════════════════

export function calculateMathOrbit(
    startX: number, startY: number, 
    currentX: number, currentY: number,
    currentRotX: number, currentRotY: number
): { rotX: number, rotY: number } {
    
    // Sensitivity modifier
    const sensitivity = 0.005;

    // Delta of mouse drag
    const dx = currentX - startX;
    const dy = currentY - startY;

    // New rotation
    let rotX = currentRotX + dy * sensitivity;
    let rotY = currentRotY + dx * sensitivity;

    // Clamp X rotation (Pitch) so it doesn't flip entirely upside down weirdly
    rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));

    return { rotX, rotY };
}
