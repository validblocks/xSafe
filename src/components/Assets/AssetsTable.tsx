/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useState } from 'react';
import {
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import ReceiveModal from 'src/components/ReceiveModal';
import { TokenTableRowItem } from 'src/pages/Organization/types';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend,
} from 'src/redux/slices/modalsSlice';
import AssetActionIcon from 'src/assets/img/arrow-back-sharp.svg';
import { ProposalsTypes } from 'src/types/Proposals';
import { AssetActionButton } from 'src/components/Theme/StyledComponents';
import DisplayTokenPrice from 'src/pages/AssetsPage/DisplayTokenPrice';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import NoActionsOverlay from 'src/pages/Transactions/utils/NoActionsOverlay';
import RationalNumber from 'src/utils/RationalNumber';
import * as Styled from '../../pages/Organization/styled';
import MobileCardsForTableReplacement from './MobileCardsForTableReplacement';
import TokenPresentationWithPrice from '../Utils/TokenPresentationWithPrice';

export const SQUARE_IMAGE_WIDTH = 30;
export const SQUARE_SMALL_IMAGE_WIDTH = 20;

const AssetsTable = () => {
  const dispatch = useDispatch();
  const width = useMediaQuery('(min-width:600px)');
  const [showQr, setShowQr] = useState(false);

  const handleQrModal = useCallback(() => {
    setShowQr((showQr: boolean) => !showQr);
  }, []);

  const handleOptionSelected = useCallback((
    option: ProposalsTypes,
    token: TokenTableRowItem,
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedTokenToSend({
        id: token.id,
        identifier: token.identifier,
        balance: token.balance,
      }),
    );
  }, [dispatch]);

  const currentContract = useSelector(currentMultisigContractSelector);
  const tokenTableRows = useSelector(tokenTableRowsSelector);

  const { isLoggedIn } = useGetLoginInfo();

  const getTableActions = useCallback((params: GridRenderCellParams) => {
    const tableActionButtons = [
      <AssetActionButton
        key="0"
        variant="outlined"
        className="shadow-sm rounded mr-2"
        onClick={() => (handleOptionSelected(ProposalsTypes.send_token, params.row))}
      >
        <img src={AssetActionIcon} width="30px" height="30px" /> Send
      </AssetActionButton>,
      <AssetActionButton
        key="1"
        onClick={handleQrModal}
      >
          
        <Box
          component="span"
          sx={{ transform: "rotate(180deg)" }}>
          <img
            src={AssetActionIcon}
            width="30px"
            height="30px"
          />
        </Box>
          Deposit
      </AssetActionButton>,
    ];

    if (!isLoggedIn) {
      tableActionButtons.shift();
    }

    return tableActionButtons;
  }, [handleOptionSelected, handleQrModal, isLoggedIn]);

  const columns = useMemo(
    () => {
      if (!tokenTableRows) return [];
      return [
        {
          field: 'presentation',
          headerName: 'Asset',
          flex: 0.8,
          type: 'string',
          renderCell: (params: GridRenderCellParams) => (
            <TokenPresentationWithPrice
              identifier={params.id.toString()}
              withTokenAmount={false}
              withTokenValue={false}
              logoMarginRight="5px"
              logoWidth={20}
              logoHeight={20}
            />
          ),
        },
        {
          field: 'balanceDetails',
          headerName: 'Balance',
          flex: 1.2,
          type: 'string',
          renderCell: (params: GridRenderCellParams) => (
            <h6 className="text-center mb-0 font-weight-normal">
              {
                Number(RationalNumber.fromDynamicTokenAmount(
                  params.value?.identifier,
                  params.value?.amount,
                  params.value?.identifier === 'EGLD' ? 18 : params.value?.decimals,
                )).toLocaleString()
            } {' $'}{params.value?.identifier}
            </h6>
          ),
        },
        {
          field: 'value',
          headerName: 'Value',
          flex: 0.8,
          renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle1" className="text-center mb-0 font-weight-normal">
              <DisplayTokenPrice
                balanceDetails={params.value}
                tokenIdentifier={params.id.toString() ?? ''}
              />
            </Typography>
          ),
        },
        {
          field: 'actions',
          type: 'actions',
          width: 200,
          headerName: '',
          getActions: (params: GridRenderCellParams) => getTableActions(params),
        },
      ];
    },
    [getTableActions, tokenTableRows],
  );

  return (
    <>
      {width ? (
        <Styled.MainTable
          autoHeight
          rowHeight={65}
          rows={tokenTableRows ?? []}
          columns={columns}
        />
      ) : (
        <Box paddingBottom={'62px'}>
          {currentContract?.address ? (
            <MobileCardsForTableReplacement
              handleQrModal={handleQrModal}
              handleOptionSelected={handleOptionSelected}
              tokenTableRows={tokenTableRows}
            />
          ) : <NoActionsOverlay message={'No safe available'} />}
        </Box>
      )}
      <ReceiveModal
        showQrFromSidebar={showQr}
        address={currentContract?.address}
        handleQr={handleQrModal}
      />
    </>
  );
};

export default AssetsTable;
