// ═══════════════════════════════════════════════════════════════════════
// SECTOR 3: NEURAL CITADEL (CORE)
// Description: The Central Hub of the Omniverse. Placed at the Equator (Lat 0).
// Emits the MacBooks and Connector Beams. 
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";
import { getMacBookOrbit1 } from "../models/NeuralCitadel/MacBookOrbit1";
import { getMacBookOrbit2 } from "../models/NeuralCitadel/MacBookOrbit2";
import { getMacBookOrbit3 } from "../models/NeuralCitadel/MacBookOrbit3";
import { getQuantumCore, getDataWaterfall, getCyberSentinels } from "../models/NeuralCitadel/ArchitecturalElements";

export function buildSector3Citadel(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    // The Citadel sits perfectly at the core zero-point (Equator Center)
    const citadelLat = 0.0;
    const centerElev = 0; // Surface level

    const pushData = (data: { lines: PLine[], icons: PIcon[] }) => {
        lines.push(...data.lines);
        icons.push(...data.icons);
    };

    // 1. Core Generator Rings
    for(let i = 0; i < 24; i++) {
        const ringLon = (i / 24) * TAU;
        // Inner Ring
        lines.push({
            p1: sphToCart(citadelLat + 0.01, ringLon, centerElev),
            p2: sphToCart(citadelLat - 0.01, ringLon, centerElev),
            colorMode: 2, // Highlight color
            width: 2
        });
        
        // Data Beams shooting up from the core
        if (i % 4 === 0) {
            lines.push({
                p1: sphToCart(citadelLat, ringLon, centerElev),
                p2: sphToCart(citadelLat, ringLon, centerElev + 200),
                colorMode: 0,
                width: 0.5
            });
            // Decorate beams
            icons.push({
                p: sphToCart(citadelLat, ringLon, centerElev + 150),
                char: "▲",
                size: 8,
                type: 'text',
                meta: { glow: true }
            })
        }
    }

    // 2. THE FIREWALL RING (Massive Equatorial Structure)
    // Ця структура візуально тримає весь світ WSM на екваторі, створюючи "стіну" і вагу.
    const EQUATOR_THICKNESS = 0.04;
    const RING_DENSITY = 180;
    
    // Масивні поздовжні кабелі (Широти)
    for(let latOffset = -EQUATOR_THICKNESS; latOffset <= EQUATOR_THICKNESS; latOffset += 0.01) {
        const ringElev = (Math.abs(latOffset) === EQUATOR_THICKNESS) ? centerElev + 30 : centerElev + 60; // Виступ у центрі
        const color = (latOffset === 0) ? 2 : 1; // Золотий центр
        
        for(let i=0; i<RING_DENSITY; i++) {
            const lon1 = (i / RING_DENSITY) * TAU;
            const lon2 = ((i + 1) / RING_DENSITY) * TAU;
            lines.push({
                p1: sphToCart(citadelLat + latOffset, lon1, ringElev),
                p2: sphToCart(citadelLat + latOffset, lon2, ringElev),
                colorMode: color,
                width: latOffset === 0 ? 3 : 1
            });
        }
    }

    // Радіальні "скріпи" стіни Firewall (Шпильки екватора)
    for(let i=0; i<RING_DENSITY; i+=2) {
        const lon = (i / RING_DENSITY) * TAU;
        // Вертикальні балки крізь Firewall
        lines.push({
            p1: sphToCart(citadelLat - EQUATOR_THICKNESS, lon, centerElev + 30),
            p2: sphToCart(citadelLat + EQUATOR_THICKNESS, lon, centerElev + 30),
            colorMode: 0,
            width: 2.5
        });
        // Радіальні стрижні (Energy spikes) вилітають у космос
        if (i%10 === 0) {
            lines.push({
                p1: sphToCart(citadelLat, lon, centerElev + 60),
                p2: sphToCart(citadelLat, lon, centerElev + 180),
                colorMode: 2,
                width: 0.5
            });
            icons.push({ p: sphToCart(citadelLat, lon, centerElev + 200), char: '◦', size: 10, type: 'text' });
        }
    }

    // 3. Instantiate MacBooks
    // The user designed Orbit1 as the outer perimeter
    pushData(getMacBookOrbit1(citadelLat, centerElev));

    // Try injecting Orbit 2 and 3 if they export same signature (we assume they do based on the user's file list)
    try { pushData(getMacBookOrbit2(citadelLat, centerElev)); } catch(e) {}
    try { pushData(getMacBookOrbit3(citadelLat, centerElev)); } catch(e) {}

    // Add Central AI Marker
    icons.push({
        p: sphToCart(citadelLat, 0, centerElev + 100),
        char: "[ THE ARCHIVATOR ]",
        size: 14,
        type: 'text',
        meta: { nlpId: 'core_archivator' }
    });

    // High Detail Procedural Objects (Phase 2.5)
    // 1. Quantum Core (Extremely dense sphere inside the Citadel)
    pushData(getQuantumCore(citadelLat, 0, centerElev));

    // 2. Data Waterfall (Digital rain plunging into the core)
    pushData(getDataWaterfall(citadelLat, 0, centerElev));

    // 3. Cyber-Sentinels (Security drones orbiting above MacBooks)
    pushData(getCyberSentinels(citadelLat, 0, centerElev));

    return { lines, icons };
}
