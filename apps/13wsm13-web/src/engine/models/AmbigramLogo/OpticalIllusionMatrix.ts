// ═══════════════════════════════════════════════════════════════════════
// MODEL: OPTICAL ILLUSION MATRIX (Pack 9 / 13)
// Description: Calculates the real-time optical shift (parallax) 
// of the Ambigram based on the camera look angle.
// ═══════════════════════════════════════════════════════════════════════

export function calculateAmbigramParallax(
    dotX: number, dotY: number, dotZ: number,
    cameraLookX: number, cameraLookY: number
): { x: number, y: number, opacity: number } {
    
    // As the camera moves away from center (0,0), the depth (z) causes the dot
    // to shift relative to the viewing plane.
    const parallaxFactor = 0.05;
    
    const screenX = dotX + (dotZ * cameraLookX * parallaxFactor);
    const screenY = dotY + (dotZ * cameraLookY * parallaxFactor);

    // If the camera is severely offset, the ambigram breaks up visually 
    // (opacity fade to simulate focus loss on volumetric layers)
    let opacity = 1.0;
    const offsetMagnitude = Math.sqrt(cameraLookX*cameraLookX + cameraLookY*cameraLookY);
    
    if (offsetMagnitude > 0.5) { // Threshold for focus
        opacity = 1.0 - ((offsetMagnitude - 0.5) * 1.5);
    }

    return {
        x: screenX,
        y: screenY,
        opacity: Math.max(0.1, opacity)
    };
}
