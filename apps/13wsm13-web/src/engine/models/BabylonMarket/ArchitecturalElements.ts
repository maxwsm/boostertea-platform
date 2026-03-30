import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// 1. TOKEN VAULT (Neon Cube-in-Cube)
export function getTokenVault(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const sizeOut = 0.012;
    const hOut = 20;
    
    // Outer Cube
    const corners = [
        [1,1], [1,-1], [-1,-1], [-1,1]
    ];
    
    const drawCube = (sz: number, h: number, elev: number, cMode: number) => {
        const ptsBase = corners.map(c => sphToCart(lat + c[0]*sz, lon + c[1]*sz, elev));
        const ptsTop = corners.map(c => sphToCart(lat + c[0]*sz, lon + c[1]*sz, elev + h));
        for(let i=0; i<4; i++) {
            lines.push({ p1: ptsBase[i], p2: ptsBase[(i+1)%4], colorMode: cMode, width: 1 });
            lines.push({ p1: ptsTop[i], p2: ptsTop[(i+1)%4], colorMode: cMode, width: 1 });
            lines.push({ p1: ptsBase[i], p2: ptsTop[i], colorMode: cMode, width: 1 });
        }
    }

    drawCube(sizeOut, hOut, r, 0); // Outer 
    drawCube(sizeOut*0.5, hOut*0.5, r + hOut*0.25, 2); // Inner glowing

    return { lines, icons: [] };
}

// 2. HOLOGRAPHIC SCALES (Symbol of Trade)
export function getHolographicScales(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];
    const h = 25;
    const w = 0.015;

    // Pillar
    lines.push({ p1: sphToCart(lat, lon, r), p2: sphToCart(lat, lon, r+h), colorMode: 0, width: 2 });
    // Beam
    const leftBeam = sphToCart(lat, lon-w, r+h);
    const rightBeam = sphToCart(lat, lon+w, r+h);
    lines.push({ p1: leftBeam, p2: rightBeam, colorMode: 2, width: 1.5 });

    // Hangers
    lines.push({ p1: leftBeam, p2: sphToCart(lat, lon-w, r+h-10), colorMode: 0, width: 0.5 });
    lines.push({ p1: rightBeam, p2: sphToCart(lat, lon+w, r+h-10), colorMode: 0, width: 0.5 });

    // Balance Plates
    icons.push({ p: sphToCart(lat, lon-w, r+h-12), char: "⚖️", size: 10, type: "text", meta: {} });
    icons.push({ p: sphToCart(lat, lon+w, r+h-12), char: "💎", size: 10, type: "text", meta: {} });

    return { lines, icons };
}

// 3. ENERGY PILLAR (Powering BoosterTea)
export function getEnergyPillar(lat: number, lon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const h = 40;
    const rad = 0.008;
    
    // Central rod
    lines.push({ p1: sphToCart(lat, lon, r), p2: sphToCart(lat, lon, r+h), colorMode: 2, width: 4 });

    // Spiral energy coil
    for(let i=0; i<30; i++) {
        const a1 = (i/10) * TAU;
        const a2 = ((i+1)/10) * TAU;
        const z1 = r + (i/30)*h;
        const z2 = r + ((i+1)/30)*h;

        const p1 = sphToCart(lat + Math.cos(a1)*rad, lon + Math.sin(a1)*rad, z1);
        const p2 = sphToCart(lat + Math.cos(a2)*rad, lon + Math.sin(a2)*rad, z2);

        lines.push({ p1, p2, colorMode: 1, width: 0.5 });
    }

    return { lines, icons: [] };
}
