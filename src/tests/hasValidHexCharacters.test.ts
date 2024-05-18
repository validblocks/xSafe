import { hasValidHexCharacters } from 'src/components/TransactionBuilder/helpers/hasValidHexCharacters';

describe('hasValidHexCharacters', () => {
  it('Should return true for a string containing only valid hex characters', () => {
    expect(hasValidHexCharacters('12345')).toBe(true);
    expect(hasValidHexCharacters('abcdef')).toBe(true);
    expect(hasValidHexCharacters('ABCDEF')).toBe(true);
    expect(hasValidHexCharacters('0')).toBe(true);
    expect(hasValidHexCharacters('a')).toBe(true);
    expect(hasValidHexCharacters('F')).toBe(true);
  });

  it('Should return false for a string containing non-hex characters', () => {
    expect(hasValidHexCharacters('123g45')).toBe(false);
    expect(hasValidHexCharacters('xyz')).toBe(false);
    expect(hasValidHexCharacters('1a2b3z')).toBe(false);
    expect(hasValidHexCharacters('GHI')).toBe(false);
    expect(hasValidHexCharacters('123.45')).toBe(false);
    expect(hasValidHexCharacters('123!45')).toBe(false);
    expect(hasValidHexCharacters('@#$%')).toBe(false);
    expect(hasValidHexCharacters('1@2#3$')).toBe(false);
    expect(hasValidHexCharacters(' ')).toBe(false);
    expect(hasValidHexCharacters('123 45')).toBe(false);
    expect(hasValidHexCharacters(' 12345 ')).toBe(false);
  });

  it('Should return true for an empty string', () => {
    expect(hasValidHexCharacters('')).toBe(true);
  });

  it('Should return true for a mix of valid hex characters', () => {
    expect(hasValidHexCharacters('123abcABC')).toBe(true);
    expect(hasValidHexCharacters('456DEFdef')).toBe(true);
  });

  it('Should return false for a string with mixed valid and invalid characters', () => {
    expect(hasValidHexCharacters('123gABC')).toBe(false);
    expect(hasValidHexCharacters('abcGHI')).toBe(false);
  });
});
