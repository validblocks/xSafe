import RationalNumber from 'src/utils/RationalNumber';
import { describe, it, expect } from 'vitest';

describe('# Rational Number', () => {
  it('denominates 1 EGLD correctly', () => {
    expect(RationalNumber.fromBigInteger('1000000000000000000')).toBe(1);
  });

  it('denominates 2.2 EGLD correctly', () => {
    expect(RationalNumber.fromBigInteger('2200000000000000000')).toBe(2.2);
  });

  it('denominates 2.02 EGLD correctly', () => {
    expect(RationalNumber.fromBigInteger('2020000000000000000')).toBe(2.02);
  });

  it('denominates 2.002 EGLD correctly', () => {
    expect(RationalNumber.fromBigInteger('2002000000000000000')).toBe(2.002);
  });

  it('denominates 0.2 EGLD correctly', () => {
    expect(RationalNumber.fromBigInteger('200000000000000000')).toBe(0.2);
  });

  it('denominates 0.02 EGLD correctly', () => {
    expect(RationalNumber.fromBigInteger('20000000000000000')).toBe(0.02);
  });

  it('dynamically denominates 1 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '1000000000000000000'),
    ).toBe(1);
  });

  it('dynamically denominates 0.1 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '100000000000000000'),
    ).toBe(0.1);
  });

  it('dynamically denominates 0.01 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '10000000000000000'),
    ).toBe(0.01);
  });

  it('dynamically denominates 0.001 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '1000000000000000'),
    ).toBe(0.001);
  });

  it('dynamically denominates 1.1 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '1100000000000000000'),
    ).toBe(1.1);
  });

  it('dynamically denominates 1.01 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '1010000000000000000'),
    ).toBe(1.01);
  });

  it('dynamically denominates 1.001 EGLD correctly', () => {
    expect(
      RationalNumber.fromDynamicTokenAmount('EGLD', '1001000000000000000'),
    ).toBe(1.001);
  });

  it('dynamically denominates 1 USDC correctly', () => {
    expect(RationalNumber.fromDynamicTokenAmount('USDC', '1000000', 6)).toBe(1);
  });

  it('dynamically denominates 0.1 USDC correctly', () => {
    expect(RationalNumber.fromDynamicTokenAmount('USDC', '100000', 6)).toBe(
      0.1,
    );
  });

  it('dynamically denominates 0.01 USDC correctly', () => {
    expect(RationalNumber.fromDynamicTokenAmount('USDC', '10000', 6)).toBe(
      0.01,
    );
  });

  it('dynamically denominates 1.1 USDC correctly', () => {
    expect(RationalNumber.fromDynamicTokenAmount('USDC', '1100000', 6)).toBe(
      1.1,
    );
  });
});
