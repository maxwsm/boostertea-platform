// ═══════════════════════════════════════════════════════════════════════
// MODEL: INTERACTION PORTAL (Pack 10 / 3)
// Description: The invisible logic/trigger volume sitting over a painting
// frame. When clicked/tapped, triggers the Canvas engine to teleport.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getInteractionPortal(centerLat: number, centerLon: number, elev: number, modelId: string): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Glowing interaction node strictly for UI/UX interaction (like a Tap marker)
  icons.push({ 
      p: sphToCart(centerLat, centerLon, elev), // Center of painting
      char: "O", // Large glowing ring
      size: 32, 
      type: 'rune', 
      meta: { 
          isInteractivePortal: true, 
          targetModel: modelId, 
          // Engine reads this to fade out the rest of the world and warp camera
          action: 'TELEPORT_TO_ISOLATED_SCENE' 
      } 
  });
  
  // Micro instruction text
  icons.push({ 
      p: sphToCart(centerLat, centerLon, elev - 10), 
      char: "[ TAP TO ENTER THE MATRIX ]", 
      size: 8, 
      type: 'text',
      meta: { isFlickering: true } 
  });

  return { lines, icons };
}
