// ═══════════════════════════════════════════════════════════════════════
// SECTOR 8 :: MEADOW (DAO & AMBASSADORS)
// Latitude Range: -0.25 to -0.45 (Deep Southern Hemisphere)
// Contains: The real 3D geometry of the Yurts, Campfire, and Monument!
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export function buildSector8Meadow(t: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const meadowLat = -0.35;
    const elev = 0;

    // 1. ДАО Юрти (Глемпінг Амбасадорів)
    const drawYurt = (latOff: number, lonOff: number, radius: number, isHolo: boolean = false) => {
        const yLat = meadowLat + latOff;
        const yLon = lonOff;
        
        // Base ring
        for(let i=0; i<32; i++) {
            const a1 = (i/32)*TAU;
            const a2 = ((i+1)/32)*TAU;
            const p1 = sphToCart(yLat + Math.cos(a1)*radius, yLon + Math.sin(a1)*radius, elev);
            const p2 = sphToCart(yLat + Math.cos(a2)*radius, yLon + Math.sin(a2)*radius, elev);
            lines.push({ p1, p2, colorMode: isHolo ? 2 : 1, width: 1.0 });
        }

        // Dome arcs
        for(let arch=0; arch<4; arch++) {
            const angle = (arch/4)*Math.PI;
            for(let i=0; i<16; i++) {
                const step1 = (i/16)*Math.PI;
                const step2 = ((i+1)/16)*Math.PI;

                // Create a semi-circle arch
                const r1 = Math.sin(step1)*radius;
                const r2 = Math.sin(step2)*radius;

                const pb1 = sphToCart(yLat + Math.cos(angle)*r1, yLon + Math.sin(angle)*r1, elev + Math.sin(step1) * radius * 800);
                const pb2 = sphToCart(yLat + Math.cos(angle)*r2, yLon + Math.sin(angle)*r2, elev + Math.sin(step2) * radius * 800);
                
                if (Math.sin(step1) >= 0) {
                   lines.push({ p1: pb1, p2: pb2, colorMode: isHolo ? 2 : 1, width: isHolo ? 2 : 1 });
                }
            }
        }
    };

    drawYurt(0, 0, 0.02, true); // Головна юрта голограма
    drawYurt(0.04, 0.03, 0.015);
    drawYurt(-0.04, -0.04, 0.012);

    // 2. ДАО ВОГНИЩЕ (Campfire)
    const fireLat = meadowLat;
    const fireLon = 0.06;
    for(let i=0; i<30; i++) {
        const fHeight = Math.abs(Math.sin(t*5 + i)) * 150 * Math.random();
        const a = (i/30)*TAU + t;
        const rBase = 0.005;
        const p1 = sphToCart(fireLat + Math.cos(a)*rBase, fireLon + Math.sin(a)*rBase, elev);
        const p2 = sphToCart(fireLat, fireLon, elev + fHeight);
        
        lines.push({ p1, p2, colorMode: 2, width: 2.0 }); // Electric neon color
    }
    icons.push({ p: sphToCart(fireLat, fireLon, elev + 200), char: "DAO FIRE (SYNCHRONIZING)", size: 14, type: 'text' });

    // 3. AMBASSADOR MONUMENT (Обеліск)
    const obLat = meadowLat - 0.05;
    const obLon = 0.08;
    const obH = 300;
    
    const obTop = sphToCart(obLat, obLon, elev + obH);
    const br = 0.01;
    const b1 = sphToCart(obLat+br, obLon+br, elev);
    const b2 = sphToCart(obLat-br, obLon+br, elev);
    const b3 = sphToCart(obLat-br, obLon-br, elev);
    const b4 = sphToCart(obLat+br, obLon-br, elev);

    lines.push({ p1: obTop, p2: b1, colorMode: 1, width: 1.5 });
    lines.push({ p1: obTop, p2: b2, colorMode: 1, width: 1.5 });
    lines.push({ p1: obTop, p2: b3, colorMode: 1, width: 1.5 });
    lines.push({ p1: obTop, p2: b4, colorMode: 1, width: 1.5 });
    lines.push({ p1: b1, p2: b2, colorMode: 1, width: 1.5 });
    lines.push({ p1: b2, p2: b3, colorMode: 1, width: 1.5 });
    lines.push({ p1: b3, p2: b4, colorMode: 1, width: 1.5 });
    lines.push({ p1: b4, p2: b1, colorMode: 1, width: 1.5 });

    // Обертові кільця Монумента
    for(let i=0; i<32; i++) {
        const a1 = (i/32)*TAU + t;
        const a2 = ((i+1)/32)*TAU + t;
        const ringR = 0.015;
        const p1 = sphToCart(obLat + Math.cos(a1)*ringR, obLon + Math.sin(a1)*ringR, elev + 250 + Math.sin(a1*2 + t)*20);
        const p2 = sphToCart(obLat + Math.cos(a2)*ringR, obLon + Math.sin(a2)*ringR, elev + 250 + Math.sin(a2*2 + t)*20);
        lines.push({ p1, p2, colorMode: 2, width: 1.5 });
    }

    // Тексти на горизонті
    icons.push({ p: sphToCart(obLat, obLon, elev + obH + 50), char: "[ AMBASSADOR MONUMENT ]", size: 28, type: 'text', meta: { colorMode: 2 } });

    // Ландшафтна геометрія (Гори на фоні)
    for(let i=0; i<15; i++) {
        const mLat = meadowLat - 0.1 - Math.random()*0.08;
        const mLon = -0.1 + (i*0.02);
        const mBase = sphToCart(mLat, mLon, elev);
        const mPeak = sphToCart(mLat, mLon, elev + 100 + Math.random()*400);
        
        lines.push({ p1: mBase, p2: mPeak, colorMode: 0, width: 0.5 });
    }

    return { lines, icons };
}
