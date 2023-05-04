import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClaimableRoyaltiesReturnType, queryClaimableRoyalties } from 'src/contracts/xSpotlightContract';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';

export const useNftAuctionClaimableAmount = () => {
  const [claimableAmountResult, setClaimableAmountResult] = useState<ClaimableRoyaltiesReturnType | null>(null);
  const currentContract = useSelector(currentMultisigContractSelector);

  useEffect(() => {
    (async () => {
      try {
        const claimableAmount = await queryClaimableRoyalties(currentContract?.address);
        setClaimableAmountResult(claimableAmount);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentContract?.address]);
  return claimableAmountResult;
};

export default useNftAuctionClaimableAmount;
