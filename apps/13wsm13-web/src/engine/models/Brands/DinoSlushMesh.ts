import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// DINO SLUSH - Frozen Neon Data Cube
export function getDinoSlushMesh(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    const size = 0.012;
    const h = 20;

    const corners = [ [1,1], [1,-1], [-1,-1], [-1,1] ];
    
    // Outer ice shell (frozen grid)
    for(let z=0; z<=h; z+=h/4) {
        const p1 = sphToCart(lat + size, lon + size, r + z);
        const p2 = sphToCart(lat + size, lon - size, r + z);
        const p3 = sphToCart(lat - size, lon - size, r + z);
        const p4 = sphToCart(lat - size, lon + size, r + z);
        
        lines.push({ p1: p1, p2: p2, colorMode: 1, width: 0.5 });
        lines.push({ p1: p2, p2: p3, colorMode: 1, width: 0.5 });
        lines.push({ p1: p3, p2: p4, colorMode: 1, width: 0.5 });
        lines.push({ p1: p4, p2: p1, colorMode: 1, width: 0.5 });
    }

    // Vertical pillars
    for(const [cx, cy] of corners) {
        lines.push({ 
            p1: sphToCart(lat + cx*size, lon + cy*size, r),
            p2: sphToCart(lat + cx*size, lon + cy*size, r + h),
            colorMode: 1, width: 1.5
        });
    }

    // Inner glowing core
    const cRadius = 0.005;
    for(let i=0; i<8; i++) {
        const a1 = (i/8)*TAU;
        const a2 = ((i+1)/8)*TAU;
        lines.push({
            p1: sphToCart(lat + Math.cos(a1)*cRadius, lon + Math.sin(a1)*cRadius, r + h/2),
            p2: sphToCart(lat + Math.cos(a2)*cRadius, lon + Math.sin(a2)*cRadius, r + h/2),
            colorMode: 2, // Intense glow
            width: 2
        });
    }

    // Icon floating above
    icons.push({ p: sphToCart(lat, lon, r + h + 15), char: "🦖 DINOSLUSH", size: 10, type: "text", meta: { colorMode: 1 } });
    
    // Interactive trigger inside
    icons.push({ 
        p: sphToCart(lat, lon, r + h/2), 
        char: "🧊", 
        size: 14, 
        type: "obj", 
        meta: { triggerState: 'OPEN_CHECKOUT_DINO', nlpId: 'brand_dinoslush' } 
    });

    return { lines, icons };
}
