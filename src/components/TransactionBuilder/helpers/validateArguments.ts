import { BytesValue } from '@multiversx/sdk-core/out';
import { isIntegerNumber } from './isIntegerNumber';
import { hasValidHexLength } from './hasValidHexLength';
import { hasValidHexCharacters } from './hasValidHexCharacters';

export type ArgumentValidationError = {
  index: number;
  reason: string;
};

export type ArgumentValidationResult = {
  isValid: boolean;
  error?: ArgumentValidationError;
};

export function validateArguments(
  newArgsToValidate: string[],
): ArgumentValidationResult[] {
  try {
    const validationResult: ArgumentValidationResult[] = new Array(
      newArgsToValidate?.length,
    ).fill({ isValid: true });

    newArgsToValidate?.forEach((arg, index) => {
      if (arg === undefined || arg === null) {
        validationResult[index] = {
          isValid: false,
          error: { index, reason: 'Argument is empty/falsy' },
        };
        return;
      }

      if (!isIntegerNumber(arg) && !hasValidHexLength(arg)) {
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
