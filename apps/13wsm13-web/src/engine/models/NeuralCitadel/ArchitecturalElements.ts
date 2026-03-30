import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// 1. QUANTUM CORE (Ultra-dense glowing star)
export function getQuantumCore(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    // Fibonacci sphere points for high detail dense core
    const samples = 100;
    const coreRadius = 20; // vertical scale
    const coreRadSph = 0.015; // horizontal lat/lon scale
    
    const phi = Math.PI * (3 - Math.sqrt(5));
    
    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        const p1 = sphToCart(lat + x * coreRadSph, lon + z * coreRadSph, r + 50 + y * coreRadius);
        // Spikes shooting out of core
        const p2 = sphToCart(lat + x * coreRadSph * 1.5, lon + z * coreRadSph * 1.5, r + 50 + y * coreRadius * 1.5);
        lines.push({ p1, p2, colorMode: 2, width: 0.5 });
    }
    return { lines, icons: [] };
}

// 2. DATA WATERFALL (Digital rain cascading into core)
export function getDataWaterfall(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    const count = 40;
    const radius = 0.03;
    
    for (let i=0; i<count; i++) {
        const angle = Math.random() * TAU;
        const rndR = Math.random() * radius;
        const dropStart = r + 150 + Math.random() * 100;
        const dropLen = 10 + Math.random() * 20;

        const p1 = sphToCart(lat + Math.cos(angle)*rndR, lon + Math.sin(angle)*rndR, dropStart);
        const p2 = sphToCart(lat + Math.cos(angle)*rndR, lon + Math.sin(angle)*rndR, dropStart - dropLen);

        lines.push({ p1, p2, colorMode: 1, width: 0.8 }); // Greenish neon stream
    }
    return { lines, icons };
}

// 3. CYBER-SENTINELS (Security drones)
export function getCyberSentinels(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    
    for(let i=0; i<3; i++) {
        const angle = (i/3) * TAU;
        const orbitLat = lat + Math.cos(angle) * 0.06;
        const orbitLon = lon + Math.sin(angle) * 0.06;
        const elev = r + 80;

        // Drone Pyramid
        const top = sphToCart(orbitLat, orbitLon, elev + 5);
        const b1 = sphToCart(orbitLat + 0.005, orbitLon, elev);
        const b2 = sphToCart(orbitLat - 0.0025, orbitLon + 0.004, elev);
        const b3 = sphToCart(orbitLat - 0.0025, orbitLon - 0.004, elev);

        lines.push({ p1: top, p2: b1, colorMode: 2, width: 1 });
        lines.push({ p1: top, p2: b2, colorMode: 2, width: 1 });
        lines.push({ p1: top, p2: b3, colorMode: 2, width: 1 });
        lines.push({ p1: b1, p2: b2, colorMode: 0, width: 0.5 });
        lines.push({ p1: b2, p2: b3, colorMode: 0, width: 0.5 });
        lines.push({ p1: b3, p2: b1, colorMode: 0, width: 0.5 });

        // Sensor Eye
        icons.push({ p: sphToCart(orbitLat, orbitLon, elev + 2), char: "⦿", size: 6, type: "text", meta: { glow: true }});
    }

    return { lines, icons };
}
