// ═══════════════════════════════════════════════════════════════════════
// SECTOR 7 :: THE ORGANIC HEART
// Latitude: 0 (Directly under the Citadel core, Elevation Offset)
// Contains: The Biological algorithm core powering the NLP.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";
import { getOrganicHeart } from "../models/OrganicHeart/HeartMesh";

export function buildSector7OrganicHeart(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const heartLat = 0.0; // Directly on equated
    const heartLon = 0.0; // Same as Citadel
    const centerElev = -150; // Embedded deep inside the sphere (Internal Chamber)

    // The heart itself
    const heartData = getOrganicHeart(heartLat, heartLon, centerElev);
    lines.push(...heartData.lines);
    icons.push(...heartData.icons);

    // Nerve connections traveling out into the sphere surface
    const nerveCount = 20;
    for(let i=0; i<nerveCount; i++) {
        // Random locations on the surface of the sphere to attach nerves
        const targetLat = (Math.random() * 0.8) - 0.4;
        const targetLon = Math.random() * TAU; // Any longitude

        // A nerve is a line from the heart's top to a designated node on the "crust"
        const p1 = sphToCart(heartLat, heartLon, centerElev + 40); // Top of heart
        const p2 = sphToCart(targetLat, targetLon, 0); // Surface

        lines.push({ p1, p2, colorMode: 1, width: 0.2 }); // Faint deep connections
    }

    return { lines, icons };
}
