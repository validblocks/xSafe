export function hasValidHexCharacters(hex: string): boolean {
  return /^[0-9a-fA-F]*$/.test(hex);
}
