import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// 1. KNOWLEDGE PRISM (Floating octahedron emitting lines)
export function getKnowledgePrism(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    const size = 0.015;
    const elev = r + 30;

    const top = sphToCart(lat, lon, elev + 20);
    const bottom = sphToCart(lat, lon, elev - 20);
    const e1 = sphToCart(lat + size, lon, elev);
    const e2 = sphToCart(lat, lon + size, elev);
    const e3 = sphToCart(lat - size, lon, elev);
    const e4 = sphToCart(lat, lon - size, elev);

    const pts = [e1, e2, e3, e4];
    for (let i=0; i<4; i++) {
        const p1 = pts[i];
        const p2 = pts[(i+1)%4];
        lines.push({ p1, p2, colorMode: 2, width: 1.5 });
        lines.push({ p1: top, p2: p1, colorMode: 0, width: 1 });
        lines.push({ p1: bottom, p2: p1, colorMode: 0, width: 1 });
    }

    icons.push({ p: sphToCart(lat, lon, elev), char: "◈", size: 12, type: "text", meta: { glow: true } });

    return { lines, icons };
}

// 2. SERVER RACKS (Dense clustered cubes of NLP data)
export function getServerRacks(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const w = 0.005;
    const d = 0.01;
    const h = 25;

    // Generate 3 racks side by side
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        const cLat = lat + (xOffset * 0.015);
        for(let z=0; z<=h; z+=5) {
            lines.push({
                p1: sphToCart(cLat-w, lon-d, r+z),
                p2: sphToCart(cLat+w, lon-d, r+z),
                colorMode: 1, width: 0.5
            });
        }
        // Frame
        lines.push({ p1: sphToCart(cLat-w, lon-d, r), p2: sphToCart(cLat-w, lon-d, r+h), colorMode: 0, width: 1.5 });
        lines.push({ p1: sphToCart(cLat+w, lon-d, r), p2: sphToCart(cLat+w, lon-d, r+h), colorMode: 0, width: 1.5 });
    }
    return { lines, icons: [] };
}

// 3. QUANTUM ORRERY (Spherical blockchain clock model)
export function getQuantumOrrery(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    const rOrbit = 0.04;
    const floatR = r + 40;

    // Rings
    for(let rAngle=0; rAngle<Math.PI; rAngle+=Math.PI/4) {
        for(let s=0; s<30; s++) {
            const a1 = (s/30) * TAU;
            const a2 = ((s+1)/30) * TAU;
            
            // XZ Ring
            const p1 = sphToCart(
                lat + Math.cos(a1)*rOrbit*Math.cos(rAngle), 
                lon + Math.cos(a1)*rOrbit*Math.sin(rAngle), 
                floatR + Math.sin(a1)*30
            );
            const p2 = sphToCart(
                lat + Math.cos(a2)*rOrbit*Math.cos(rAngle), 
                lon + Math.cos(a2)*rOrbit*Math.sin(rAngle), 
                floatR + Math.sin(a2)*30
            );
            lines.push({ p1, p2, colorMode: 2, width: 0.2 });
        }
    }

    icons.push({ p: sphToCart(lat, lon, floatR), char: "❂", size: 14, type: "text", meta: { glow: true } });

    return { lines, icons };
}
