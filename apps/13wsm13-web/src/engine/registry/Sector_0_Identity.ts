// ═══════════════════════════════════════════════════════════════════════
// SECTOR 0 :: CORE IDENTITY
// Latitude Range: 0.00 to 0.15
// Contains: Matrix Rain Loading, The 13WSM13 Giant Logo
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

const RUNIC = "СВІТТРЕБАСИЛАДАЖБОГᚠᛟᛒᚷᛉᚹᛋᛞᛝᛃᛗᚨᚲ";

export function buildSector0Identity(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    // BIOME 0: Loading Matrix & Initial Approach (lat: 0 to 0.05)
    for(let i=0; i<300; i++) {
        const lat = Math.random() * 0.08;
        const lon = (Math.random() - 0.5) * 0.1;
        const elev = Math.random() * 300;
        icons.push({ p: sphToCart(lat, lon, elev), char: RUNIC[Math.floor(Math.random()*RUNIC.length)], size: 10 + Math.random()*20, type: 'rune', meta: { isMatrixRune: true } });
    }

    // Giant Floating Logo Manifest
    const logoLat = 0.06;
    icons.push({ p: sphToCart(logoLat, 0, 150), char: "13WSM13", size: 120, type: 'text' });
    icons.push({ p: sphToCart(logoLat + 0.005, 0, 120), char: "PROJECT COLISEUM", size: 30, type: 'text' });

    // Grid/Ground Lines for context starting from 0 to 0.15
    for(let lat=0; lat<0.15; lat+=0.02) {
        for(let lon=-0.05; lon<0.05; lon+=0.02) {
            lines.push({ p1: sphToCart(lat, lon, 0), p2: sphToCart(lat+0.02, lon, 0), colorMode: 0, width: 0.5 });
            lines.push({ p1: sphToCart(lat, lon, 0), p2: sphToCart(lat, lon+0.02, 0), colorMode: 0, width: 0.5 });
        }
    }

    return { lines, icons };
}
