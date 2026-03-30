import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// 1. BIO-DNA HELIX (Animated Rotating Helix)
export function getBioDNAHelix(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const height = 40;
    const turns = 4;
    const radius = 0.02;
    const segments = 60;
    
    // Time offset built into lon if needed, but we'll draw it static and rely on sphere rotation
    for(let i=0; i<segments; i++) {
        const t1 = i / segments;
        const t2 = (i+1) / segments;
        
        // Strand A
        const a1 = sphToCart(lat + Math.cos(t1 * TAU * turns)*radius, lon + Math.sin(t1 * TAU * turns)*radius, r + t1 * height);
        const a2 = sphToCart(lat + Math.cos(t2 * TAU * turns)*radius, lon + Math.sin(t2 * TAU * turns)*radius, r + t2 * height);
        
        // Strand B (offset by PI)
        const b1 = sphToCart(lat + Math.cos(t1 * TAU * turns + Math.PI)*radius, lon + Math.sin(t1 * TAU * turns + Math.PI)*radius, r + t1 * height);
        const b2 = sphToCart(lat + Math.cos(t2 * TAU * turns + Math.PI)*radius, lon + Math.sin(t2 * TAU * turns + Math.PI)*radius, r + t2 * height);

        lines.push({ p1: a1, p2: a2, colorMode: 2, width: 1.5 });
        lines.push({ p1: b1, p2: b2, colorMode: 0, width: 1.5 });

        // Connectors (Base Pairs)
        if (i % 5 === 0) {
            lines.push({ p1: a1, p2: b1, colorMode: 1, width: 0.5 });
        }
    }
    return { lines, icons: [] };
}

// 2. TIME MONOLITH (Tall Spire)
export function getTimeMonolith(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    const height = 100;
    const w = 0.01;

    // Base
    const p1 = sphToCart(lat-w, lon-w, r);
    const p2 = sphToCart(lat+w, lon-w, r);
    const p3 = sphToCart(lat+w, lon+w, r);
    const p4 = sphToCart(lat-w, lon+w, r);

    // Tip
    const tip = sphToCart(lat, lon, r + height);

    lines.push(
        { p1, p2, colorMode: 0, width: 1 }, 
        { p1: p2, p2: p3, colorMode: 0, width: 1 }, 
        { p1: p3, p2: p4, colorMode: 0, width: 1 }, 
        { p1: p4, p2: p1, colorMode: 0, width: 1 }
    );
    lines.push(
        { p1, p2: tip, colorMode: 2, width: 1.5 }, 
        { p1: p2, p2: tip, colorMode: 2, width: 1.5 }, 
        { p1: p3, p2: tip, colorMode: 2, width: 1.5 }, 
        { p1: p4, p2: tip, colorMode: 2, width: 1.5 }
    );

    // Runic floating elements inside the monolith
    icons.push({ p: sphToCart(lat, lon, r + height/2), char: "◬", size: 10, type: "text", meta: { glow: true } });
    icons.push({ p: sphToCart(lat, lon, r + height/4), char: "⏳", size: 8, type: "text", meta: {} });
    
    return { lines, icons };
}

// 3. SCANNER ARCH (Biometric Gate)
export function getScannerArch(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const w = 0.03;
    const h = 40;

    const leftBase = sphToCart(lat, lon - w, r);
    const leftTop = sphToCart(lat, lon - w, r + h);
    const rightBase = sphToCart(lat, lon + w, r);
    const rightTop = sphToCart(lat, lon + w, r + h);
    const archTop = sphToCart(lat, lon, r + h + 15);

    // Pillars
    lines.push({ p1: leftBase, p2: leftTop, colorMode: 0, width: 2 });
    lines.push({ p1: rightBase, p2: rightTop, colorMode: 0, width: 2 });
    
    // Arch
    lines.push({ p1: leftTop, p2: archTop, colorMode: 2, width: 2 });
    lines.push({ p1: rightTop, p2: archTop, colorMode: 2, width: 2 });

    // Laser scan lines between pillars
    for(let i=1; i<=10; i++) {
        const scanR = r + (h * (i/10));
        lines.push({
            p1: sphToCart(lat, lon - w, scanR),
            p2: sphToCart(lat, lon + w, scanR),
            colorMode: 1, // Greenish/Neon
            width: 0.3
        });
    }

    return { lines, icons: [] };
}
