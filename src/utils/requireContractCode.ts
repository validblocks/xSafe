export const requireContractCode = async () => {
  const { smartContractCode } = await import('src/helpers/constants');
  return smartContractCode;
};
