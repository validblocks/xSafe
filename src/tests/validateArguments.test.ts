import { validateArguments } from 'src/components/TransactionBuilder/helpers/validateArguments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('validateArguments', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should return an array of valid results for empty input', () => {
    expect(validateArguments({})).toEqual({});
  });

  it('Should validate arguments with valid hex characters and length', () => {
    const args = { testKey: 'a1b2c3' };
    expect(validateArguments(args)).toEqual({ testKey: { isValid: true } });
  });

  it('Should return invalid result for argument with invalid hex string length', () => {
    const args = { testKey: 'a1b2c' };
    expect(validateArguments(args)).toEqual({
      testKey: {
        isValid: false,
        error: { key: 'testKey', reason: 'Invalid hex string length' },
      },
    });
  });

  it('Should return invalid result for argument with invalid hex characters', () => {
    const args = { testKey: 'a1g2c3' };
    expect(validateArguments(args)).toEqual({
      testKey: {
        isValid: false,
        error: { key: 'testKey', reason: 'Invalid hex characters' },
      },
    });
  });

  it('Should return valid result for empty string argument', () => {
    const args = { testKey: '' };
    expect(validateArguments(args)).toEqual({ testKey: { isValid: true } });
  });

  it('Should validate arguments that are integer numbers', () => {
    const args = { testKey: '123456' };
    expect(validateArguments(args)).toEqual({ testKey: { isValid: true } });
  });

  it('Should handle multiple arguments with mixed valid and invalid results', () => {
    const args = {
      testKey1: '123456',
      testKey2: 'a1b',
      testKey3: 'wxyz',
    };

    const expectedResult = {
      testKey1: { isValid: true },
      testKey2: {
        isValid: false,
        error: { key: 'testKey2', reason: 'Invalid hex string length' },
      },
      testKey3: {
        isValid: false,
        error: { key: 'testKey3', reason: 'Invalid hex characters' },
      },
    };
    expect(validateArguments(args)).toEqual(expectedResult);
  });
});
