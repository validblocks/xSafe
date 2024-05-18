import { isIntegerNumber } from 'src/components/TransactionBuilder/helpers/isIntegerNumber';

describe('isIntegerNumber', () => {
  it('Should return true for a string containing only digits', () => {
    expect(isIntegerNumber('12345')).toBe(true);
    expect(isIntegerNumber('0')).toBe(true);
    expect(isIntegerNumber('007')).toBe(true);
  });

  it('Should return false for a string containing letters', () => {
    expect(isIntegerNumber('123a45')).toBe(false);
    expect(isIntegerNumber('abc')).toBe(false);
    expect(isIntegerNumber('1a2b3c')).toBe(false);
  });

  it('Should return false for a string containing special characters', () => {
    expect(isIntegerNumber('123!45')).toBe(false);
    expect(isIntegerNumber('@#$%')).toBe(false);
    expect(isIntegerNumber('1@2#3$')).toBe(false);
  });

  it('Should return true for an empty string', () => {
    expect(isIntegerNumber('')).toBe(true);
  });

  it('Should return false for a string with spaces', () => {
    expect(isIntegerNumber('123 45')).toBe(false);
    expect(isIntegerNumber(' 12345 ')).toBe(false);
    expect(isIntegerNumber('1 2 3 4 5')).toBe(false);
  });

  it('Should return false for a string with decimal points', () => {
    expect(isIntegerNumber('123.45')).toBe(false);
    expect(isIntegerNumber('.123')).toBe(false);
    expect(isIntegerNumber('123.')).toBe(false);
  });

  it('Should return false for a string with commas', () => {
    expect(isIntegerNumber('12,345')).toBe(false);
    expect(isIntegerNumber('112,3')).toBe(false);
    expect(isIntegerNumber('123,000')).toBe(false);
  });
});
