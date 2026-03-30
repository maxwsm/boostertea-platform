// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH INTERACTIVE PARAMS (Pack 10 / 15)
// Description: Safely handles user string/number inputs when interacting
// with Goldbach Comet or Turing Machine limits. Prevents app crashing.
// ═══════════════════════════════════════════════════════════════════════

export function validateGoldbachInput(inputStr: string): number | null {
    const val = parseInt(inputStr, 10);
    
    if (isNaN(val)) return null;
    
    // Safety caps
    if (val < 10) return 10;
    if (val > 50000) return 50000; // Hard max constraint for prime computation
    
    // Must be even logic enforcing
    if (val % 2 !== 0) {
        return val + 1;
    }
    
    return val;
}

export function validateTuringTapeInput(inputStr: string): string[] {
    // Only allow 0, 1, or empty ' '
    const sanitized = inputStr.replace(/[^01 ]/g, '0');
    
    // Cap arbitrary tape lengths to 64 items for optical display
    const boundedStr = sanitized.substring(0, 64);
    
    return boundedStr.split('');
}
