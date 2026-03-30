import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// 1. THE GATEKEEPER MONOLITH (Imposing AI Console)
export function getGatekeeperMonolith(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    
    // Sloped Monolith
    const baseW = 0.03;
    const topW = 0.015;
    const h = 80;

    // Base corners
    const b1 = sphToCart(lat - baseW, lon - baseW, r);
    const b2 = sphToCart(lat + baseW, lon - baseW, r);
    const b3 = sphToCart(lat + baseW, lon + baseW, r);
    const b4 = sphToCart(lat - baseW, lon + baseW, r);

    // Top corners
    const t1 = sphToCart(lat - topW, lon - topW, r + h);
    const t2 = sphToCart(lat + topW, lon - topW, r + h);
    const t3 = sphToCart(lat + topW, lon + topW, r + h);
    const t4 = sphToCart(lat - topW, lon + topW, r + h);

    const cMode = 2; // Greenish glow
    const edgeMode = 0; // Dark shell

    // Base
    lines.push({ p1: b1, p2: b2, colorMode: edgeMode, width: 2 });
    lines.push({ p1: b2, p2: b3, colorMode: edgeMode, width: 2 });
    lines.push({ p1: b3, p2: b4, colorMode: edgeMode, width: 2 });
    lines.push({ p1: b4, p2: b1, colorMode: edgeMode, width: 2 });

    // Top
    lines.push({ p1: t1, p2: t2, colorMode: cMode, width: 2 });
    lines.push({ p1: t2, p2: t3, colorMode: cMode, width: 2 });
    lines.push({ p1: t3, p2: t4, colorMode: cMode, width: 2 });
    lines.push({ p1: t4, p2: t1, colorMode: cMode, width: 2 });

    // Sides
    lines.push({ p1: b1, p2: t1, colorMode: edgeMode, width: 2 });
    lines.push({ p1: b2, p2: t2, colorMode: edgeMode, width: 2 });
    lines.push({ p1: b3, p2: t3, colorMode: edgeMode, width: 2 });
    lines.push({ p1: b4, p2: t4, colorMode: edgeMode, width: 2 });

    // AI Eye (Pulsing Center)
    for(let i=1; i<=3; i++) {
        const eyeR = r + h - 10 - i*5;
        lines.push({
            p1: sphToCart(lat - topW*0.5, lon, eyeR),
            p2: sphToCart(lat + topW*0.5, lon, eyeR),
            colorMode: cMode,
            width: 1
        });
    }

    icons.push({ p: sphToCart(lat, lon, r + h + 15), char: "[ T E R M I N A L ]", size: 14, type: "text", meta: { colorMode: 2 } });
    
    // The Interactive Object representation for MasterCanvas
    icons.push({ 
        p: sphToCart(lat, lon, r + h/2), 
        char: "👁‍🗨", 
        size: 30, 
        type: "obj", 
        meta: { triggerState: 'OPEN_GATEKEEPER', nlpId: 'terminal_gatekeeper', glow: true } 
    });

    return { lines, icons };
}
