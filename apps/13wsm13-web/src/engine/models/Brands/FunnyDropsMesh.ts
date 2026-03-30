import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// FUNNY DROPS - Alchemical Drop Reactor
export function getFunnyDropsMesh(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    
    const h = 25;
    const rad = 0.01;

    // Reactor Flask Base
    for(let i=0; i<16; i++) {
        const a1 = (i/16)*TAU;
        const a2 = ((i+1)/16)*TAU;
        
        // Base ring
        lines.push({
            p1: sphToCart(lat + Math.cos(a1)*rad, lon + Math.sin(a1)*rad, r),
            p2: sphToCart(lat + Math.cos(a2)*rad, lon + Math.sin(a2)*rad, r),
            colorMode: 0, width: 2
        });

        // Neck ring
        lines.push({
            p1: sphToCart(lat + Math.cos(a1)*rad*0.5, lon + Math.sin(a1)*rad*0.5, r + h),
            p2: sphToCart(lat + Math.cos(a2)*rad*0.5, lon + Math.sin(a2)*rad*0.5, r + h),
            colorMode: 0, width: 2
        });

        // Vertical glass lines
        if (i % 2 === 0) {
            lines.push({
                p1: sphToCart(lat + Math.cos(a1)*rad, lon + Math.sin(a1)*rad, r),
                p2: sphToCart(lat + Math.cos(a1)*rad*0.5, lon + Math.sin(a1)*rad*0.5, r + h),
                colorMode: 2, width: 0.5
            });
        }
    }

    // Holographic drops falling inside
    lines.push({ p1: sphToCart(lat, lon, r+h-2), p2: sphToCart(lat, lon, r+h-8), colorMode: 1, width: 2 });
    lines.push({ p1: sphToCart(lat, lon, r+h-12), p2: sphToCart(lat, lon, r+5), colorMode: 1, width: 3 });

    icons.push({ p: sphToCart(lat, lon, r + h + 15), char: "💧 FUNNYDROPS", size: 10, type: "text", meta: { colorMode: 1 } });
    
    // Interactive trigger inside
    icons.push({ 
        p: sphToCart(lat, lon, r + h/2), 
        char: "🧪", 
        size: 14, 
        type: "obj", 
        meta: { triggerState: 'OPEN_CHECKOUT_FUNNY', nlpId: 'brand_funnydrops' } 
    });

    return { lines, icons };
}
