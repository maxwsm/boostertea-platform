// ═══════════════════════════════════════════════════════════════════════
// 13WSM13 :: WORLD BUILDER REGISTRY
// The omni-compiler that stitches different Sectors (Identity, Coliseum, 
// Neural Nomad Academy, etc.) into a single, cohesive spherical map.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon } from "../utils/math";
import { buildSector0Identity } from "./Sector_0_Identity";
import { buildSector1Coliseum } from "./Sector_1_Coliseum";
import { buildSector2NeuralNomad } from "./Sector_2_NeuralNomad";
import { buildSector3Citadel } from "./Sector_3_Citadel";
import { buildSector4BabylonMarket } from "./Sector_4_BabylonMarket";
import { buildSector5Gatekeeper } from "./Sector_5_Gatekeeper";
import { buildSector6BrandsGallery } from "./Sector_6_BrandsGallery";
import { buildSector7OrganicHeart } from "./Sector_7_OrganicHeart";

export interface WorldData {
    lines: PLine[];
    icons: PIcon[];
}

export class WorldBuilder {
    static build(): WorldData {
        const world: WorldData = { lines: [], icons: [] };

        const merge = (sectorData: { lines: PLine[], icons: PIcon[] }) => {
            world.lines.push(...sectorData.lines);
            world.icons.push(...sectorData.icons);
        };

        // 1. Z-Index 0.05 to 0.15: Origin Identity (Logo, Vitruvian)
        merge(buildSector0Identity());

        // 2. Z-Index Base (Lat 0..0.3): The Coliseum
        merge(buildSector1Coliseum(0));

        // 3. Z-Index 0.35 to 0.60: Neural Nomad Ecosystem & Academy
        merge(buildSector2NeuralNomad());

        // 4. Z-Index 0.60 to 0.85: The Citadel
        merge(buildSector3Citadel());

        // 5. Z-Index Negative (-0.25): Babylon Market E-Commerce
        merge(buildSector4BabylonMarket());

        // 6. Z-Index Negative (-0.50): AI Gatekeeper (Terminal)
        merge(buildSector5Gatekeeper());

        // 7. Z-Index Negative (-0.42 Offset): WSM Brands Gallery
        merge(buildSector6BrandsGallery());

        // 8. Internal Core (Deep Elev -150): The Organic Heart
        merge(buildSector7OrganicHeart());

        return world;
    }
}
