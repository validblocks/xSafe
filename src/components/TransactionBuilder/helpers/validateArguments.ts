import { BytesValue } from '@multiversx/sdk-core/out';
import { isIntegerNumber } from './isIntegerNumber';
import { hasValidHexLength } from './hasValidHexLength';
import { hasValidHexCharacters } from './hasValidHexCharacters';

export type ArgumentValidationError = {
  key: string;
  reason: string;
};

export type ArgumentValidationResult = {
  isValid: boolean;
  error?: ArgumentValidationError;
};

export type ValidationResults = Record<string, ArgumentValidationResult>;

export function validateArguments(
  newArgsToValidate: Record<string, string>,
): ValidationResults {
  try {
    const validationResult: ValidationResults = Object.keys(
      newArgsToValidate,
    ).reduce((acc: ValidationResults, key: string) => {
      acc[key] = { isValid: true };
      return acc;
    }, {});

    Object.entries(newArgsToValidate)?.forEach(([key, arg]) => {
      if (arg === undefined || arg === null) {
        validationResult[key] = {
          isValid: false,
          error: { key, reason: 'Argument is empty/falsy' },
        };
        return;
      }

      if (!isIntegerNumber(arg) && !hasValidHexLength(arg)) {
        validationResult[key] = {
          isValid: false,
          error: { key, reason: 'Invalid hex string length' },
        };
        return;
      }

      if (!hasValidHexCharacters(arg)) {
        validationResult[key] = {
          isValid: false,
          error: { key, reason: 'Invalid hex characters' },
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
