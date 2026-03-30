import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// THE ORGANIC HEART - Biological algorithmic core
export function getOrganicHeart(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    
    // Heart size and complexity
    const h = 40;
    const rad = 0.015;
    const arteriesCount = 12;
    const veinSegments = 20;

    // Organic Veins
    for(let i=0; i<arteriesCount; i++) {
        const offsetAngle = (i/arteriesCount) * TAU;
        let prevPoint = sphToCart(lat, lon, r);
        
        for(let s=1; s<=veinSegments; s++) {
            const z = r + (s/veinSegments)*h;
            // Introduce organic wobble using sine waves
            const wobbleLat = Math.sin(s*0.5 + offsetAngle) * rad * Math.sin((s/veinSegments)*Math.PI);
            const wobbleLon = Math.cos(s*0.5 + offsetAngle) * rad * Math.sin((s/veinSegments)*Math.PI);
            
            const nextPoint = sphToCart(lat + wobbleLat, lon + wobbleLon, z);
            
            lines.push({ 
                p1: prevPoint, 
                p2: nextPoint, 
                colorMode: 2, // Glow
                width: 1.5 
            });

            // Occasional connections between veins (capillaries)
            if (s % 4 === 0) {
                const partnerAngle = ((i+1)/arteriesCount) * TAU;
                const partnerLat = Math.sin(s*0.5 + partnerAngle) * rad * Math.sin((s/veinSegments)*Math.PI);
                const partnerLon = Math.cos(s*0.5 + partnerAngle) * rad * Math.sin((s/veinSegments)*Math.PI);
                
                lines.push({
                    p1: nextPoint,
                    p2: sphToCart(lat + partnerLat, lon + partnerLon, z),
                    colorMode: 1, // Fainter glow
                    width: 0.5
                });
            }

            prevPoint = nextPoint;
        }
    }

    // Aorta rings (pumping rings at the top)
    for(let i=1; i<=3; i++) {
        const ringElev = r + h + i*5;
        const ringRad = rad * 0.5 * (1/i);
        
        for(let s=0; s<16; s++) {
            const a1 = (s/16)*TAU;
            const a2 = ((s+1)/16)*TAU;
            lines.push({
                p1: sphToCart(lat + Math.cos(a1)*ringRad, lon + Math.sin(a1)*ringRad, ringElev),
                p2: sphToCart(lat + Math.cos(a2)*ringRad, lon + Math.sin(a2)*ringRad, ringElev),
                colorMode: 2,
                width: 2
            });
        }
    }

    icons.push({ p: sphToCart(lat, lon, r + h + 25), char: "❤️ THE HEART (V1)", size: 12, type: "text", meta: { colorMode: 1 } });
    
    // Interactive trigger (Nerve center)
    icons.push({ 
        p: sphToCart(lat, lon, r + h/2), 
        char: "🫀", 
        size: 20, 
        type: "obj", 
        meta: { triggerState: 'OPEN_HEART_MONITOR', nlpId: 'core_organic_heart' } 
    });

    return { lines, icons };
}
