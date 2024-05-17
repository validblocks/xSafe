import { BytesValue } from '@multiversx/sdk-core/out';

export type ArgumentValidationError = {
  index: number;
  reason: string;
};

export type ArgumentValidationResult = {
  isValid: boolean;
  error?: ArgumentValidationError;
};
export function hasValidHexCharacters(hex: string): boolean {
  return /^[0-9a-fA-F]*$/.test(hex);
}

export function hasValidHexLength(hex: string): boolean {
  return hex.length % 2 === 0;
}

export function validateArguments(
  newArgsToValidate?: string[],
): ArgumentValidationResult[] {
  try {
    console.log({ newArgsToValidate });

    const validationResult: ArgumentValidationResult[] = new Array(
      newArgsToValidate?.length,
    ).fill({ isValid: true });

    newArgsToValidate?.forEach((arg, index) => {
      if (!hasValidHexLength(arg)) {
        validationResult[index] = {
          isValid: false,
          error: { index, reason: 'Invalid hex string length' },
        };
        return;
      }

      if (!hasValidHexCharacters(arg)) {
        validationResult[index] = {
          isValid: false,
          error: { index, reason: 'Invalid hex characters' },
        };
        return;
      }

      BytesValue.fromHex(arg);
    });

    return validationResult;
  } catch (err: any) {
    throw new Error(err);
  }
}
