// ═══════════════════════════════════════════════════════════════════════
// SECTOR 5 :: THE AI GATEKEEPER
// Latitude: -0.6
// Contains: The Interactive Terminal for commanding the ecosystem.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";
import { getGatekeeperMonolith } from "../models/Gatekeeper/MonolithConsole";

export function buildSector5Gatekeeper(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const gkLat = -0.6; // Deep south equivalent
    const gKLon = 0.0;
    const centerElev = 0;

    const pushData = (data: { lines: PLine[], icons: PIcon[] }) => {
        lines.push(...data.lines);
        icons.push(...data.icons);
    };

    // Foundation Platform (Digital Hexagon)
    const platR = 0.08;
    for(let i=0; i<6; i++) {
        const a1 = (i/6)*TAU;
        const a2 = ((i+1)/6)*TAU;
        
        const platOuter1 = sphToCart(gkLat + Math.cos(a1)*platR, gKLon + Math.sin(a1)*platR, centerElev);
        const platOuter2 = sphToCart(gkLat + Math.cos(a2)*platR, gKLon + Math.sin(a2)*platR, centerElev);
        
        lines.push({ p1: platOuter1, p2: platOuter2, colorMode: 0, width: 2 });
        // Web to center
        lines.push({ p1: platOuter1, p2: sphToCart(gkLat, gKLon, centerElev), colorMode: 0, width: 0.5 });
    }

    // Insert Monolith Console
    pushData(getGatekeeperMonolith(gkLat, gKLon, centerElev));

    // Floating UI Rings around Monolith
    for(let rAngle=0; rAngle<Math.PI; rAngle+=Math.PI/2) {
        for(let s=0; s<20; s++) {
            const a1 = (s/20) * TAU;
            const a2 = ((s+1)/20) * TAU;
            
            const p1 = sphToCart(
                gkLat + Math.cos(a1)*0.05, 
                gKLon + Math.cos(a1)*0.05, 
                centerElev + 40 + Math.sin(a1)*20
            );
            const p2 = sphToCart(
                gkLat + Math.cos(a2)*0.05, 
                gKLon + Math.cos(a2)*0.05, 
                centerElev + 40 + Math.sin(a2)*20
            );
            lines.push({ p1, p2, colorMode: 1, width: 0.3 }); // Ghostly data streams
        }
    }

    return { lines, icons };
}
