export function hasValidHexLength(hex: string): boolean {
  return hex.length % 2 === 0;
}
