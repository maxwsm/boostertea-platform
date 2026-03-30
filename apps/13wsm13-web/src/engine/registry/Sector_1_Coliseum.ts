// ═══════════════════════════════════════════════════════════════════════
// SECTOR 1 :: WSM COLISEUM
// Latitude Range: 0.15 to 0.35
// Contains: The history of WSM, performance metrics, timeline, and 
// the Biometric Gateway.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";
import { getBioDNAHelix, getTimeMonolith, getScannerArch } from "../models/Coliseum/ArchitecturalElements";

export function buildSector1Coliseum(t: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const colLat = 0.20;
    const coliseumElev = 0;

    const pushData = (data: { lines: PLine[], icons: PIcon[] }) => {
        lines.push(...data.lines);
        icons.push(...data.icons);
    };

    // 🏛 ГІГАНТСЬКИЙ КІБЕР-АМФІТЕАТР (Massive Roman Amphitheater)
    const TIER_COUNT = 6;
    const PILLARS_PER_TIER = 72; // High density columns
    const BASE_RADIUS = 0.08;
    
    // Побудова багатоярусних трибун та арок
    for(let tier=0; tier<TIER_COUNT; tier++) {
        const tElevBase = coliseumElev + tier * 60;
        const tElevTop = tElevBase + 50;
        const radiusBase = BASE_RADIUS + (tier * 0.015);
        const radiusTop = radiusBase + 0.005; // outward slant
        
        for(let i=0; i<PILLARS_PER_TIER; i++) {
            const a1 = (i / PILLARS_PER_TIER) * TAU;
            const a2 = ((i + 1) / PILLARS_PER_TIER) * TAU;
            
            // Base Circle Ring
            const pb1 = sphToCart(colLat + Math.cos(a1)*radiusBase, Math.sin(a1)*radiusBase, tElevBase);
            const pb2 = sphToCart(colLat + Math.cos(a2)*radiusBase, Math.sin(a2)*radiusBase, tElevBase);
            lines.push({ p1: pb1, p2: pb2, colorMode: tier % 2 === 0 ? 1 : 0, width: 2.0 });
            
            // Top Arch Ring
            const pt1 = sphToCart(colLat + Math.cos(a1)*radiusTop, Math.sin(a1)*radiusTop, tElevTop);
            const pt2 = sphToCart(colLat + Math.cos(a2)*radiusTop, Math.sin(a2)*radiusTop, tElevTop);
            lines.push({ p1: pt1, p2: pt2, colorMode: 1, width: 1.5 });

            // Vertical Pillar (Колони)
            lines.push({ p1: pb1, p2: pt1, colorMode: 0, width: 2.5 });
            
            // Аркова Перемичка (Перехрестя)
            if (i % 2 === 0) {
                // Cross brace for arch
                lines.push({ p1: pb1, p2: pt2, colorMode: 0, width: 0.5 });
            }
        }
    }
    
    // Арена (Нижній рівень битв)
    for(let i=0; i<120; i++) {
        const a = (i/120)*TAU;
        const r = BASE_RADIUS * 0.9;
        const p1 = sphToCart(colLat + Math.cos(a)*r, Math.sin(a)*r, coliseumElev + 10);
        const p2 = sphToCart(colLat, 0, coliseumElev); // spike to center
        if(i%4 === 0) lines.push({ p1, p2, colorMode: 2, width: 1.0 });
    }

    // 🛑 БЛОК 1: МАСШТАБ ТА СИЛА (Висять над ареною)
    icons.push({ p: sphToCart(colLat, -0.015, 30), char: "CODE: >3.4M LINES", size: 22, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.002, -0.01, 50), char: "COMMITS: 42,000+", size: 18, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.005, -0.005, 80), char: "PEAK TPS: 250,000", size: 26, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.008, 0.01, 60), char: "AI READINESS: 98.4%", size: 24, type: 'text' });

    // 🛑 БЛОК 2: ФРАКТАЛЬНА НЕЙРОСФЕРА (Формули, що летять)
    icons.push({ p: sphToCart(colLat + 0.012, -0.02, 120), char: "P(A|B) = P(B|A) * P(A) / P(B)", size: 14, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.015, 0.025, 100), char: "y² = x³ + ax + b", size: 16, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.018, -0.01, 140), char: "∇·u = 0  |  ∂u/∂t + (u·∇)u = -1/ρ ∇p + ν∇²u + f", size: 12, type: 'text' }); 

    // 🛑 БЛОК 3: BLACK SWANS ТА EASTER EGGS (Історія)
    icons.push({ p: sphToCart(colLat + 0.022, 0.02, 20), char: '{"sanity_level": "13%", "vds_blackout": "48h_WAR"}', size: 10, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.025, -0.015, 15), char: '{"puer_L": 3150, "keyboards_destroyed": 4}', size: 10, type: 'text' });

    // 🛑 БЛОК 4: ТАЙМЛАЙН
    icons.push({ p: sphToCart(colLat + 0.028, 0, 10), char: "Y1: GENESIS", size: 16, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.031, 0, 10), char: "Y5: THE VOID (SILICON FREEZE)", size: 16, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.034, 0, 10), char: "Y10: NEURAL AWAKENING", size: 16, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.037, 0, 10), char: "Y13: OMNIVERSE LIVE", size: 20, type: 'text', meta: { isBlinking: true } });

    // 🛑 БЛОК 5: BIOMETRIC GATE
    icons.push({ p: sphToCart(colLat - 0.02, 0, 10), char: "> AUTHORIZATION REQUIRED", size: 24, type: 'text' });
    icons.push({ p: sphToCart(colLat - 0.015, 0, 10), char: "SCANNING MICRO-TREMOR INTENT...", size: 18, type: 'text' });
    icons.push({ p: sphToCart(colLat - 0.01, 0, 10), char: "[ const intent = true ] -> ACCESS GRANTED", size: 20, type: 'text', meta: { colorMode: 2 } });

    // Прогрес-бари Колізею
    icons.push({ p: sphToCart(colLat + 0.015, 0, 5), char: "[██████████░░] Формування WSM DAO – 88%", size: 12, type: 'text' });
    icons.push({ p: sphToCart(colLat + 0.018, 0, 5), char: "[████████████] Компіляція Реальності – 100% (STABLE)", size: 12, type: 'text' });

    // Grid/Ground Lines for context starting from 0.15 to 0.35
    for(let lat=0.15; lat<0.35; lat+=0.02) {
        for(let lon=-0.05; lon<0.05; lon+=0.02) {
            lines.push({ p1: sphToCart(lat, lon, 0), p2: sphToCart(lat+0.02, lon, 0), colorMode: 0, width: 0.5 });
            lines.push({ p1: sphToCart(lat, lon, 0), p2: sphToCart(lat, lon+0.02, 0), colorMode: 0, width: 0.5 });
        }
    }

    // Center Hologram over the Arena
    icons.push({ p: sphToCart(colLat, 0, coliseumElev + 250), char: "[ THE ARENA ]", size: 28, type: 'text', meta: { nlpId: 'coliseum_arena', colorMode: 2 } });

    return { lines, icons };
}
