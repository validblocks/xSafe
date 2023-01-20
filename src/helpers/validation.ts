import { Address } from '@multiversx/sdk-core';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import * as Yup from 'yup';

export const validateContractAddressOwner =
  (ownerAddress?: Address) =>
    async (value?: string, testContext?: Yup.TestContext) => {
      try {
        const contractAddress = new Address(value);
        if (value == null || ownerAddress == null) {
          return false;
        }
        const isContract = contractAddress.isContractAddress();
        if (!isContract) {
          return (
            testContext?.createError({
              message: 'This address does not belong to a smart contract',
            }) ?? false
          );
        }
        const contractInfo = await ElrondApiProvider.getAccountData(value);
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
    const contractAddress = new Address(value);
    if (value == null) {
      return false;
    }
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
