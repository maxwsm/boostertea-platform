export const TAU = Math.PI * 2;
export const R = 15000;         // Planet Radius for horizon bend.

export interface P3D { x: number, y: number, z: number }

export interface PLine { 
  p1: P3D, 
  p2: P3D, 
  colorMode: number, 
  width?: number 
}

export interface PIcon { 
  p: P3D, 
  char: string, 
  size: number, 
  type: 'rune' | 'obj' | 'text',
  meta?: any 
}

// 3D Matrix Transformations
export function rotateX(p: P3D, a: number): P3D { return { x: p.x, y: Math.cos(a)*p.y - Math.sin(a)*p.z, z: Math.sin(a)*p.y + Math.cos(a)*p.z }; }
export function rotateY(p: P3D, a: number): P3D { return { x: Math.cos(a)*p.x + Math.sin(a)*p.z, y: p.y, z: -Math.sin(a)*p.x + Math.cos(a)*p.z }; }
export function rotateZ(p: P3D, a: number): P3D { return { x: Math.cos(a)*p.x - Math.sin(a)*p.y, y: Math.sin(a)*p.x + Math.cos(a)*p.y, z: p.z }; }

// Spherical to Cartesian mapping for the Treadmill Engine
export function sphToCart(lat: number, lon: number, elev: number): P3D {
  const r = R + elev;
  return {
    x: r * Math.sin(lat) * Math.sin(lon),
    y: r * Math.cos(lat),
    z: r * Math.sin(lat) * Math.cos(lon)
  };
}
