// ═══════════════════════════════════════════════════════════════════════
// SECTOR 6 :: WSM BRANDS GALLERY
// Latitude: -0.42
// Contains: DinoSlush, FunnyDrops, T-Lab exhibits
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";
import { getDinoSlushMesh } from "../models/Brands/DinoSlushMesh";
import { getFunnyDropsMesh } from "../models/Brands/FunnyDropsMesh";
import { getTLabMesh } from "../models/Brands/TLabMesh";

export function buildSector6BrandsGallery(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const glsLat = -0.42; 
    const glsLon = 0.5; // Offset to the side of the southern hemisphere
    const centerElev = 0;

    const pushData = (data: { lines: PLine[], icons: PIcon[] }) => {
        lines.push(...data.lines);
        icons.push(...data.icons);
    };

    // Connecting Pathway from Babylon Market
    lines.push({ p1: sphToCart(-0.25, 0, 0), p2: sphToCart(glsLat, glsLon, 0), colorMode: 0, width: 2 });

    // 1. DinoSlush Pavilion
    pushData(getDinoSlushMesh(glsLat, glsLon - 0.08, centerElev));
    
    // 2. FunnyDrops Pavilion
    pushData(getFunnyDropsMesh(glsLat, glsLon + 0.08, centerElev));

    // 3. T-Lab Pavilion
    pushData(getTLabMesh(glsLat - 0.05, glsLon, centerElev));

    // Signage
    icons.push({ p: sphToCart(glsLat + 0.05, glsLon, 150), char: "[ WSM ECOSYSTEM BRANDS ]", size: 24, type: "text", meta: { colorMode: 2 } });

    return { lines, icons };
}
