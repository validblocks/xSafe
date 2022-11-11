/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
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
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';
import { ReactComponent as ElrondLogoWhite } from 'src/assets/img/elrond-logo-white.svg';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import { ProposalsTypes } from 'src/types/Proposals';
import { AssetActionButton } from 'src/components/Theme/StyledComponents';
import DisplayTokenPrice from 'src/pages/AssetsPage/DisplayTokenPrice';
import { Typography, useMediaQuery } from '@mui/material';
import { Balance } from '@elrondnetwork/erdjs/out';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import * as Styled from '../../pages/Organization/styled';

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
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const { isLoggedIn } = useGetLoginInfo();

  const getTableActions = useCallback((params: GridRenderCellParams) => {
    const tableActionButtons = [
      <AssetActionButton
        key="0"
        variant="outlined"
        className="shadow-sm rounded mr-2"
        onClick={(_e: any) => (handleOptionSelected(ProposalsTypes.send_token, params.row))
              }
      >
        <AssetActionIcon width="30px" height="30px" /> Send
      </AssetActionButton>,
      <AssetActionButton
        key="1"
        onClick={handleQrModal}
      >
        <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Deposit
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
            <div className="d-flex justify-content-center align-items-center font-weight-normal">
              {params.value.tokenIdentifier !== 'EGLD' && (
              <img
                width={SQUARE_IMAGE_WIDTH}
                height={SQUARE_IMAGE_WIDTH}
                src={params.value.photoUrl}
                alt={params.value.tokenIdentifier}
                className="mr-3 rounded-circle"
              />
              )}
              {params.value.tokenIdentifier === 'EGLD' && (
                isDarkThemeEnabled ? (
                  <ElrondLogoWhite
                    width={SQUARE_IMAGE_WIDTH}
                    height={SQUARE_IMAGE_WIDTH}
                    className="mr-3"
                  />
                )
                  : (
                    <ElrondLogo
                      width={SQUARE_IMAGE_WIDTH}
                      height={SQUARE_IMAGE_WIDTH}
                      className="mr-3"
                    />
                  )
              )}
              <p className="mb-0">
                {params.value.tokenIdentifier?.split('-')[0] ?? 'unknown'}
              </p>
            </div>
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
                Number(operations.denominate({
                  input: Balance.fromString(params.value?.amount).toString(),
                  denomination: params.value?.decimals,
                  decimals: 3,
                  showLastNonZeroDecimal: true,
                }).replaceAll(',', '')).toLocaleString()
            } ${params.value.identifier}
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

  console.log(tokenTableRows);

  return (
    <>
      {width ? (
        <Styled.MainTable
          autoHeight
          rowHeight={65}
          rows={tokenTableRows ?? []}
          columns={columns}
        />
      ) : (tokenTableRows.map((item: any) => (
        <Styled.MobileCardOfTokens key={item.id}>
          <Styled.TokenDetailsBox>
            <Styled.CategoryName>
              <span>Assets</span>
              <li>
                {item.balanceDetails.identifier !== 'EGLD' && (
                <img
                  width={SQUARE_SMALL_IMAGE_WIDTH}
                  height={SQUARE_SMALL_IMAGE_WIDTH}
                  src={item.presentation.photoUrl}
                  alt={item.presentation.tokenIdentifier}
                />
                )}
                {item.balanceDetails.identifier === 'EGLD' && (
                  isDarkThemeEnabled ? (
                    <ElrondLogoWhite
                      width={SQUARE_SMALL_IMAGE_WIDTH}
                      height={SQUARE_SMALL_IMAGE_WIDTH}
                    />
                  )
                    : (
                      <ElrondLogo
                        width={SQUARE_SMALL_IMAGE_WIDTH}
                        height={SQUARE_SMALL_IMAGE_WIDTH}
                      />
                    )
                )}
                <strong>{item.balanceDetails.identifier}</strong>
              </li>
            </Styled.CategoryName>
            <Styled.CategoryName>
              <span>Balance</span>
              <h6 className="mb-0 font-weight-normal">
                {
                Number(operations.denominate({
                  input: Balance.fromString(item.balanceDetails.amount).toString(),
                  denomination: item.decimals,
                  decimals: 3,
                  showLastNonZeroDecimal: true,
                }).replaceAll(',', '')).toLocaleString()
            } ${item.balanceDetails.identifier}
              </h6>
            </Styled.CategoryName>
            <Styled.CategoryName>
              <span>Value</span>
              <h6 className="mb-0 font-weight-normal">value USD</h6>
            </Styled.CategoryName>
          </Styled.TokenDetailsBox>
          <Styled.ActionButtonsBox>{getTableActions(item)}</Styled.ActionButtonsBox>
        </Styled.MobileCardOfTokens>
      ))
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
