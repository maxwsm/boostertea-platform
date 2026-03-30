import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// T-LAB - Biological Capsule
export function getTLabMesh(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    
    const h = 30;
    const rad = 0.008;

    // Elliptical Capsule
    for(let z=0; z<=h; z+=2) {
        // Bulge in the middle
        const zFactor = Math.sin((z/h) * Math.PI);
        const curRad = rad + (rad * zFactor * 0.5);
        
        for(let i=0; i<8; i++) {
            const a1 = (i/8)*TAU;
            const a2 = ((i+1)/8)*TAU;
            
            lines.push({
                p1: sphToCart(lat + Math.cos(a1)*curRad, lon + Math.sin(a1)*curRad, r + z),
                p2: sphToCart(lat + Math.cos(a2)*curRad, lon + Math.sin(a2)*curRad, r + z),
                colorMode: 2, // Biometric glow
                width: 0.5
            });
            
            // Vertical structural ribs
            if (z < h && i % 2 === 0) {
                const nextZFactor = Math.sin(((z+2)/h) * Math.PI);
                const nextRad = rad + (rad * nextZFactor * 0.5);
                lines.push({
                    p1: sphToCart(lat + Math.cos(a1)*curRad, lon + Math.sin(a1)*curRad, r + z),
                    p2: sphToCart(lat + Math.cos(a1)*nextRad, lon + Math.sin(a1)*nextRad, r + z + 2),
                    colorMode: 0, width: 1.5
                });
            }
        }
    }

    icons.push({ p: sphToCart(lat, lon, r + h + 15), char: "🧬 T-LAB", size: 10, type: "text", meta: { colorMode: 1 } });
    
    // Interactive trigger inside
    icons.push({ 
        p: sphToCart(lat, lon, r + h/2), 
        char: "🔬", 
        size: 14, 
        type: "obj", 
        meta: { triggerState: 'OPEN_CHECKOUT_TLAB', nlpId: 'brand_tlab' } 
    });

    return { lines, icons };
}
