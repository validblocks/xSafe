import { Address } from '@multiversx/sdk-core';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { tryParseAddressElseThrow } from 'src/utils/addressUtils';
import * as Yup from 'yup';

export const validateContractAddressOwner =
  (ownerAddress?: Address) =>
  async (value?: string, testContext?: Yup.TestContext) => {
    try {
      if (value == null || ownerAddress == null) {
        return false;
      }
      const contractAddress = new Address(value);
      const isContract = contractAddress.isContractAddress();
      if (!isContract) {
        return (
          testContext?.createError({
            message: 'This address does not belong to a smart contract',
          }) ?? false
        );
      }
      const contractInfo = await MultiversxApiProvider.getAccountData(value);
      const isCurrentUserOwner = new Address(contractInfo.ownerAddress).equals(
        ownerAddress,
      );
      if (!isCurrentUserOwner) {
        return (
          testContext?.createError({
            message: 'This contract does not belong to the current user',
          }) ?? false
        );
      }
      return true;
    } catch (err) {
      return (
        testContext?.createError({
          message: 'Invalid address',
        }) ?? false
      );
    }
  };

export const validateAddressIsContract = (
  value?: string,
  testContext?: Yup.TestContext,
) => {
  try {
    if (!value) {
      return false;
    }
    const contractAddress = new Address(value);
    const isContract = contractAddress.isContractAddress();
    if (!isContract) {
      return (
        testContext?.createError({
          message: 'This address does not belong to a smart contract',
        }) ?? false
      );
    }
    return true;
  } catch (err) {
    return (
      testContext?.createError({
        message: 'Invalid address',
      }) ?? false
    );
  }
};

export const isAddressValid = (value?: string) => {
  try {
    tryParseAddressElseThrow(value);
    return true;
  } catch (err) {
    return false;
  }
};
