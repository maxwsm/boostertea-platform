// ═══════════════════════════════════════════════════════════════════════
// SECTOR 4: BABYLON MARKET (E-COMMERCE ZONE)
// Description: Trade district where BoosterTea and physical artifacts are 
// tokenized and integrated into the global matrix.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";
import { getBoosterCanMesh } from "../models/BoosterTea/BoosterCanMesh";
import { getTokenVault, getHolographicScales, getEnergyPillar } from "../models/BabylonMarket/ArchitecturalElements";

export function buildSector4BabylonMarket(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const pushData = (data: { lines: PLine[], icons: PIcon[] }) => {
        lines.push(...data.lines);
        icons.push(...data.icons);
    };

    // Location: Opposite to Neural Nomad Academy (Lat -0.2)
    const marketLat = -0.25;
    const centerElev = 0;

    // The Grid Base
    for(let lat = marketLat - 0.05; lat < marketLat + 0.05; lat += 0.02) {
        for(let lon = -0.05; lon < 0.05; lon += 0.02) {
            lines.push({ p1: sphToCart(lat, lon, centerElev), p2: sphToCart(lat + 0.02, lon, centerElev), colorMode: 0, width: 0.3 });
            lines.push({ p1: sphToCart(lat, lon, centerElev), p2: sphToCart(lat, lon + 0.02, centerElev), colorMode: 0, width: 0.3 });
        }
    }

    // Portal Sign
    icons.push({
        p: sphToCart(marketLat - 0.06, 0, centerElev + 10),
        char: "■ BABYLON MARKET SECTOR ■",
        size: 16,
        type: 'text',
        meta: {}
    });

    // Generate 3 Cans of Booster Tea around the market center
    pushData(getBoosterCanMesh(marketLat, -0.02, centerElev));
    pushData(getBoosterCanMesh(marketLat + 0.02, 0.02, centerElev));
    pushData(getBoosterCanMesh(marketLat - 0.02, 0.02, centerElev));

    // High Detail Procedural Objects (Phase 2.5)
    // 1. Token Vault (Cube in Cube)
    pushData(getTokenVault(marketLat - 0.04, -0.04, centerElev));

    // 2. Holographic Scales
    pushData(getHolographicScales(marketLat + 0.04, -0.04, centerElev));

    // 3. Energy Pillar (Powering the Market)
    pushData(getEnergyPillar(marketLat, 0.06, centerElev));

    return { lines, icons };
}
