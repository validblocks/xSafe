import { validateArguments } from 'src/components/TransactionBuilder/helpers/validateArguments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('validateArguments', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should return an array of valid results for empty input', () => {
    expect(validateArguments([])).toEqual([]);
  });

  it('Should validate arguments with valid hex characters and length', () => {
    const args = ['a1b2c3'];
    expect(validateArguments(args)).toEqual([{ isValid: true }]);
  });

  it('Should return invalid result for argument with invalid hex string length', () => {
    const args = ['a1b2c'];
    expect(validateArguments(args)).toEqual([
      {
        isValid: false,
        error: { index: 0, reason: 'Invalid hex string length' },
      },
    ]);
  });

  it('Should return invalid result for argument with invalid hex characters', () => {
    const args = ['a1g2c3'];
    expect(validateArguments(args)).toEqual([
      {
        isValid: false,
        error: { index: 0, reason: 'Invalid hex characters' },
      },
    ]);
  });

  it('Should return invalid result for null argument', () => {
    const args = [null] as any;
    expect(validateArguments(args)).toEqual([
      {
        isValid: false,
        error: { index: 0, reason: 'Argument is empty/falsy' },
      },
    ]);
  });

  it('Should return invalid result for undefined argument', () => {
    const args = [undefined] as any;
    expect(validateArguments(args)).toEqual([
      {
        isValid: false,
        error: { index: 0, reason: 'Argument is empty/falsy' },
      },
    ]);
  });

  it('Should return valid result for empty string argument', () => {
    const args = [''];
    expect(validateArguments(args)).toEqual([
      {
        isValid: true,
      },
    ]);
  });

  it('Should validate arguments that are integer numbers', () => {
    const args = ['123456'];
    expect(validateArguments(args)).toEqual([{ isValid: true }]);
  });

  it('Should handle multiple arguments with mixed valid and invalid results', () => {
    const args = ['123456', 'a1b', 'wxyz'];
    const expectedResult = [
      { isValid: true },
      {
        isValid: false,
        error: { index: 1, reason: 'Invalid hex string length' },
      },
      { isValid: false, error: { index: 2, reason: 'Invalid hex characters' } },
    ];
    expect(validateArguments(args)).toEqual(expectedResult);
  });
});
