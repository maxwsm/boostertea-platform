// ═══════════════════════════════════════════════════════════════════════
// MODEL: DOTWORK SEEDER (Pack 9 / 9)
// Description: The monte-carlo algorithm that attempts to place particles 
// inside the SDF limits. Outputs an array of points forming the logo.
// ═══════════════════════════════════════════════════════════════════════

import { sdfDigit1 } from "./SDF_Digit1";
import { sdfDigit3 } from "./SDF_Digit3";
import { sdfLetterW } from "./SDF_LetterW";
import { sdfLetterS } from "./SDF_LetterS";
import { sdfLetterM } from "./SDF_LetterM";
import { sdfMirrored1 } from "./SDF_Mirrored1";
import { sdfMirrored3 } from "./SDF_Mirrored3";

export type AmbigramPoint = { x: number, y: number, z: number, char: string, charKey: number };

// Maps string characters to bounding box offsets X
const letterOffsets = [
    { fn: sdfDigit1, offset: -6.0 },
    { fn: sdfDigit3, offset: -4.0 },
    { fn: sdfLetterW, offset: -1.5 },
    { fn: sdfLetterS, offset: 0.5 },
    { fn: sdfLetterM, offset: 2.5 },
    { fn: sdfMirrored1, offset: 4.5 },
    { fn: sdfMirrored3, offset: 6.0 }
];

export function generateDotworkSeed(targetCount: number = 131313): AmbigramPoint[] {
    const points: AmbigramPoint[] = [];
    
    // Instead of computing 131,313 at runtime (heavy), 
    // we would theoretically seed a fixed array or do this in a WebWorker.
    // For this blueprint, we represent the logical structure:
    let failures = 0;
    
    while(points.length < targetCount && failures < targetCount * 10) {
        // Randomly pick a character to attempt
        const charDef = letterOffsets[Math.floor(Math.random() * letterOffsets.length)];
        
        // Random coordinates in bounding box
        const testX = (Math.random() - 0.5) * 2.0; 
        const testY = (Math.random() - 0.5) * 2.0;
        
        // Evaluate SDF
        const dist = charDef.fn(testX, testY);
        
        if (dist <= 0.0) { // Inside the shape!
            // Global space plotting
            points.push({
                x: charDef.offset + testX,
                y: testY,
                // Add depth to give the tattoo a 3D hologram thickness (z: -0.5 to 0.5)
                z: (Math.random() - 0.5) * 1.0, 
                char: "", // Assigned later
                charKey: 0 // Hash
            });
        } else {
            failures++;
        }
    }
    
    return points;
}
