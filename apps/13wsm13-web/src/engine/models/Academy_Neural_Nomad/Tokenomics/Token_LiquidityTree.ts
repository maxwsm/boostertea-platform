// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOKENOMICS - LIQUIDITY TREE (Pack 11 / 2)
// Description: A fractal tree visualizing how locked assets (roots) 
// continuously generate real yields (fruits) for the community.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

function branch(pStart: P3D, length: number, angleZ: number, angleY: number, depth: number, lines: PLine[], icons: PIcon[]) {
    if (depth === 0) {
        // Fruit/Yield nodes
        icons.push({ p: pStart, char: "$", size: 6, type: 'rune', meta: { colorMode: 2 } }); // Gold color
        return;
    }

    const pEnd: P3D = {
        x: pStart.x + Math.cos(angleY) * Math.sin(angleZ) * length,
        y: pStart.y + Math.sin(angleY) * Math.sin(angleZ) * length,
        z: pStart.z + Math.cos(angleZ) * length
    };

    // Trunk vs branches thickness
    lines.push({ p1: pStart, p2: pEnd, colorMode: 1, width: depth * 0.8 });

    // Recursion
    branch(pEnd, length * 0.7, angleZ + 0.5, angleY + 0.4, depth - 1, lines, icons);
    branch(pEnd, length * 0.7, angleZ - 0.5, angleY - 0.4, depth - 1, lines, icons);
}

export function getTokenLiquidityTree(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Origin offset to 0,0,0 (isolated podium space)
  const root: P3D = { x: 0, y: 0, z: 0 };

  // Generate fractal tree (upward branches)
  branch(root, 15, 0, 0, 4, lines, icons);
  
  // Generate inverted fractal roots (liquidity locked below ground)
  branch(root, 10, Math.PI, 0, 3, lines, icons);

  // NLP Tooltip Anchor
  icons.push({ p: { x: 0, y: 0, z: -15 }, char: "LIQUIDITY_TREE_INFO", size: 0, type: 'obj', meta: { nlpId: 'liquidity_tree' }});

  return { lines, icons };
}
