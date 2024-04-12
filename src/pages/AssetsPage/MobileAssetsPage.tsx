import { useState, useCallback } from 'react';
import ReceiveModal from 'src/components/Modals/Receive';
import { useDispatch, useSelector } from 'react-redux';
import MobileCardsForTableReplacement from 'src/components/Assets/MobileCardsForTableReplacement';
import NoActionsOverlay from 'src/components/Utils/NoActionsOverlay';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend,
} from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/multisig/proposals/Proposals';
import { TokenTableRowItem } from 'src/types/organization';
import { Box } from '@mui/material';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';

export const MobileAssetsPage = () => {
  const dispatch = useDispatch();
  const tokenTableRows = useSelector(tokenTableRowsSelector);
  const currentContract = useSelector(currentMultisigContractSelector);

  const [showQr, setShowQr] = useState(false);

  const handleQrModal = useCallback(() => {
    setShowQr((showQr: boolean) => !showQr);
  }, []);

  const handleOptionSelected = useCallback(
    (option: ProposalsTypes, token: TokenTableRowItem) => {
      dispatch(setProposeMultiselectSelectedOption({ option }));
      dispatch(
        setSelectedTokenToSend({
          id: token.id,
          identifier: token.identifier,
          balance: token.balance,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Box paddingBottom={'62px'}>
      {currentContract?.address ? (
        <>
          <MobileCardsForTableReplacement
            handleQrModal={handleQrModal}
            handleOptionSelected={handleOptionSelected}
            tokenTableRows={tokenTableRows}
          />
          <ReceiveModal
            showQrFromSidebar={showQr}
            address={currentContract?.address}
            handleQr={handleQrModal}
          />
        </>
      ) : (
        <NoActionsOverlay message={'No safe available'} />
      )}
    </Box>
  );
};
