import { uniqueContractAddress } from 'multisigConfig';

const addressShorthand = () => {
  const walletAddressFirstElements =
    uniqueContractAddress.substring(0, 5) +
    '...' +
    uniqueContractAddress.substring(
      uniqueContractAddress.length - 5,
      uniqueContractAddress.length
    );
  return walletAddressFirstElements;
};

export default addressShorthand;
