const addressShorthand = (uniqueContractAddress: string) => {
  if (uniqueContractAddress.length === 0 || !uniqueContractAddress) return '';

  const walletAddressFirstElements = `${uniqueContractAddress.substring(
    0,
    5,
  )}...${uniqueContractAddress.substring(
    uniqueContractAddress.length - 5,
    uniqueContractAddress.length,
  )}`;
  return walletAddressFirstElements;
};

export default addressShorthand;
