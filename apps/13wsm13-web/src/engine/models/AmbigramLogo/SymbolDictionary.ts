// ═══════════════════════════════════════════════════════════════════════
// MODEL: SYMBOL DICTIONARY (Pack 9 / 10)
// Description: The repository of raw data/runes used to render the 131,313
// dots. It maps coordinate indexes to strict string characters.
// ═══════════════════════════════════════════════════════════════════════

const DIVERSE_ALPHABET = [
    // Core binary
    "0", "1",
    // Core hex/code
    "x", "C", "D", "A", "F", "F",
    // UI Runes
    "·", "°", "•", "–", "—", "|", "+", "»", "«",
    // WSM DNA
    "W", "S", "M", "1", "3",
    // Broken fragments
    "{", "}", ";", "NaN", "null"
];

export function getSymbolForIndex(index: number): string {
    // Pure antifragility: deterministic pseudo-random selection based on index.
    // Ensure that if the point is #1005, it ALWAYS maps to the exact same visual symbol.
    const pseudoHash = (index * 73856093) ^ (index * 19349663);
    const absHash = Math.abs(pseudoHash);
    
    const charIndex = absHash % DIVERSE_ALPHABET.length;
    
    return DIVERSE_ALPHABET[charIndex];
}
