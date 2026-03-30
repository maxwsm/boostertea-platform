import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

// THE SILICON FORTRESS - Generating microprocessor PCB paths
export function getSiliconFloorGrid(startLat: number, endLat: number, startLon: number, endLon: number, r: number): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const numPaths = 30;
    
    // Seeded random for deterministic paths
    let seed = 1313;
    const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    for(let i=0; i<numPaths; i++) {
        let curLat = startLat + rnd() * (endLat - startLat);
        let curLon = startLon + rnd() * (endLon - startLon);
        
        // Start node (pad)
        icons.push({
            p: sphToCart(curLat, curLon, r),
            char: "◎",
            size: 4 + rnd()*4,
            type: "text",
            meta: { colorMode: 1 }
        });

        // Generate a segmented path with 45 or 90 degree turns
        const segments = 2 + Math.floor(rnd() * 4);
        let pathLineMode = rnd() > 0.8 ? 2 : 1; // Sometimes glowing data buses

        for(let s=0; s<segments; s++) {
            const isLatMove = rnd() > 0.5;
            const dist = 0.01 + rnd() * 0.03;
            const dir = rnd() > 0.5 ? 1 : -1;

            let nextLat = curLat;
            let nextLon = curLon;

            if (isLatMove) {
                nextLat += dist * dir;
            } else {
                nextLon += dist * dir;
            }
            
            // Check bounds to stay in Neural Nomad
            if (nextLat < startLat) nextLat = startLat;
            if (nextLat > endLat) nextLat = endLat;
            if (nextLon < startLon) nextLon = startLon;
            if (nextLon > endLon) nextLon = endLon;

            lines.push({
                p1: sphToCart(curLat, curLon, r),
                p2: sphToCart(nextLat, nextLon, r),
                colorMode: pathLineMode,
                width: pathLineMode === 2 ? 1.0 : 0.3
            });

            curLat = nextLat;
            curLon = nextLon;
        }

        // End node (via hole)
        icons.push({
            p: sphToCart(curLat, curLon, r),
            char: "◦",
            size: 3,
            type: "text",
            meta: { colorMode: pathLineMode }
        });
    }

    // Parallel Data Buses (Main Highways)
    for(let lat=0.40; lat<=0.55; lat+=0.05) {
        // Horizontal Bus
        for(let lon=-0.04; lon<0.04; lon+=0.01) {
            lines.push({
                p1: sphToCart(lat, lon, r),
                p2: sphToCart(lat, lon+0.01, r),
                colorMode: 2, width: 1.0
            });
        }
    }
    
    // Vertical Bus
    for(let lat=0.38; lat<=0.60; lat+=0.01) {
        lines.push({
            p1: sphToCart(lat, -0.01, r),
            p2: sphToCart(lat+0.01, -0.01, r),
            colorMode: 2, width: 1.5
        });
        lines.push({
            p1: sphToCart(lat, 0.01, r),
            p2: sphToCart(lat+0.01, 0.01, r),
            colorMode: 2, width: 1.5
        });
    }

    return { lines, icons };
}
