// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEON DB CLOUD (Pack 7 / 15)
// Description: The evacuation of data to Neon PostgreSQL edge database.
// Rendered as a dense cluster of glowing data particles lifting vertically.
// Coordinate Space: LAT 0.20, Elev 30+ above the Rift
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getNeonDBCloud(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed directly above the Blackout Rift (Math.PI / 4)
  const crackAngle = Math.PI / 4;
  const riftLat = baseLat + 0.015;
  const riftLon = Math.sin(crackAngle) * (radius * 0.8);
  
  // Ascension strings pulling data upwards to the cloud
  for (let i = 0; i < 8; i++) {
      const offsetX = (Math.random() - 0.5) * 0.01;
      const offsetY = (Math.random() - 0.5) * 0.01;
      const height = 40 + Math.random() * 60;
      
      const pBottom = sphToCart(riftLat + offsetY, riftLon + offsetX, 0);
      const pTop = sphToCart(riftLat + offsetY, riftLon + offsetX, height);
      
      lines.push({ p1: pBottom, p2: pTop, colorMode: 3, width: 0.5 }); // Green Neon light
  }

  // Neon DB Hexagonal Storage Cloud
  const hexPoints = 6;
  const cloudElev = 110;
  const hexRadius = 0.008;
  
  for (let i = 0; i < hexPoints; i++) {
      const a1 = (i / hexPoints) * Math.PI * 2;
      const a2 = ((i + 1) / hexPoints) * Math.PI * 2;
      
      const p1 = sphToCart(riftLat + Math.cos(a1) * hexRadius, riftLon + Math.sin(a1) * hexRadius, cloudElev);
      const p2 = sphToCart(riftLat + Math.cos(a2) * hexRadius, riftLon + Math.sin(a2) * hexRadius, cloudElev);
      
      const pTop1 = sphToCart(riftLat + Math.cos(a1) * (hexRadius * 0.5), riftLon + Math.sin(a1) * (hexRadius * 0.5), cloudElev + 20);
      const pTop2 = sphToCart(riftLat + Math.cos(a2) * (hexRadius * 0.5), riftLon + Math.sin(a2) * (hexRadius * 0.5), cloudElev + 20);
      
      lines.push({ p1, p2, colorMode: 3, width: 1.5 });
      lines.push({ p1, p2: pTop1, colorMode: 3, width: 1.0 });
      lines.push({ p1: pTop1, p2: pTop2, colorMode: 3, width: 1.5 });
  }

  // Data Particles
  for (let i = 0; i < 15; i++) {
      icons.push({ 
          p: sphToCart(riftLat + (Math.random() - 0.5)*0.02, riftLon + (Math.random() - 0.5)*0.02, cloudElev + (Math.random()*40 - 20)),
          char: "1", size: 8, type: 'rune', meta: { isNeonParticle: true, floatSpeed: Math.random() * 0.05 }
      });
  }

  icons.push({ p: sphToCart(riftLat, riftLon, cloudElev + 35), char: "[ NEON POSTGRES. EVACUATION: SUCCESS ]", size: 14, type: 'text' });

  return { lines, icons };
}
