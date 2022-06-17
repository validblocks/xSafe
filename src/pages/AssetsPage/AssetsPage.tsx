import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as ElrondLogo } from 'assets/img/logo.svg';
import ReceiveModal from 'components/ReceiveModal';
import { network } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { TokenTableRowItem, TokenWithPrice } from 'pages/Organization/types';
import { organizationTokensSelector } from '@redux/selectors/accountSelector';
import { priceSelector } from '@redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from '@redux/selectors/multisigContractsSelectors';
import {
  setMultisigBalance,
  setOrganizationTokens,
} from '@redux/slices/accountSlice';
import {
  setProposeModalSelectedOption,
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend,
} from '@redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const squareImageWidth = 30;

const AssetsPage = () => {
  const egldPrice = useSelector(priceSelector);
  const dispatch = useDispatch();
  const [showQr, setShowQr] = useState(false);

  const handleQrModal = useCallback(() => {
    setShowQr((showQr) => !showQr);
  }, []);

  const openProposeSendTokenForm = useCallback(() => {
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.send_token,
      }),
    );
  }, []);

  const handleOptionSelected = (
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
  };

  const getTokenPrice = useCallback(
    (tokenIdentifier: string) =>
      tokenPrices.find(
        (tokenWithPrice: TokenWithPrice) =>
          tokenWithPrice.symbol === tokenIdentifier,
      )?.price ?? egldPrice,
    [],
  );

  const currentContract = useSelector(currentMultisigContractSelector);
  const proxy = getNetworkProxy();

  const organizationTokens = useSelector(organizationTokensSelector);

  const fetchTokenPhotoUrl = useCallback(async (tokenIdentifier: string) => {
    const { data } = await axios.get(
      `${network.apiAddress}/tokens/${tokenIdentifier}`,
    );

    return data.assets.pngUrl;
  }, []);

  useEffect(() => {
    (async function getTokens() {
      let isMounted = true;

      if (!currentContract?.address) {
        return () => {
          isMounted = false;
        };
      }

      const getEgldBalancePromise = currentContract?.address
        ? proxy.getAccount(new Address(currentContract?.address))
        : {};

      const getAllOtherTokensPromise = axios.get(
        `${network.apiAddress}/accounts/${currentContract?.address}/tokens`,
      );

      try {
        const [{ balance: egldBalance }, { data: otherTokens }] =
          await Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]);

        if (!isMounted) return;

        dispatch(setMultisigBalance(JSON.stringify(egldBalance)));

        const allTokens = [
          { ...egldBalance.token, balance: egldBalance.value.toString() },
          ...otherTokens,
        ];

        const tokensWithPrices = [];

        for (const [idx, token] of Object.entries(allTokens)) {
          const priceOfCurrentToken = getTokenPrice(token.identifier ?? '');

          const { owner, ...tokenWithoutOwner } = token;

          let photoUrl = '';
          if (token.identifier !== 'EGLD') {
            photoUrl = await fetchTokenPhotoUrl(token.identifier as string);
          }

          tokensWithPrices.push({
            ...tokenWithoutOwner,
            presentation: {
              tokenIdentifier: token.identifier,
              photoUrl,
            },
            id: idx,
            balanceDetails: {
              photoUrl,
              identifier: token.identifier?.split('-')[0] ?? '',
              amount: token.balance as string,
              decimals: token.decimals as number,
            },
            value: {
              tokenPrice: priceOfCurrentToken,
              decimals: token.decimals as number,
              amount: token.balance as string,
            },
          });
        }

        dispatch(setOrganizationTokens(tokensWithPrices));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentContract]);

  const columns = useMemo(
    () => [
      {
        field: 'presentation',
        headerName: 'ASSET',
        width: 150,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className="d-flex justify-content-center align-items-center">
            {params.value.tokenIdentifier !== 'EGLD' && (
              <img
                width={squareImageWidth}
                height={squareImageWidth}
                src={params.value.photoUrl}
                alt="Token image"
                className="mr-3"
              />
            )}
            {params.value.tokenIdentifier === 'EGLD' && (
              <ElrondLogo
                width={squareImageWidth}
                height={squareImageWidth}
                className="mr-3"
              />
            )}
            <p className="mb-0">
              {params.value.tokenIdentifier.split('-')[0] ?? 'unknown'}
            </p>
          </div>
        ),
      },
      {
        field: 'balanceDetails',
        headerName: 'BALANCE',
        width: 200,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <h6 className="text-center mb-0">
            {Number(
              Number(
                operations.denominate({
                  input: params.value.amount,
                  denomination: params.value.decimals,
                  decimals: params.value.decimals,
                  showLastNonZeroDecimal: true,
                }),
              ).toFixed(8),
            )}
            ${params.value.identifier}
          </h6>
        ),
      },
      {
        field: 'value',
        headerName: 'VALUE',
        width: 250,
        renderCell: (params: GridRenderCellParams<any>) => (
          <h5 className="ex-currency text-center mb-0">
            <Ui.UsdValue
              amount={operations.denominate({
                input: params.value.amount,
                denomination: params.value.decimals,
                decimals: params.value.decimals,
                showLastNonZeroDecimal: true,
                addCommas: false,
              })}
              usd={params.value.tokenPrice}
            />
          </h5>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        width: 300,
        headerName: 'Quick Actions',
        getActions: (params: GridRenderCellParams) => [
          <div key="0" className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<CallMadeIcon htmlColor="#9DABBD" />}
              label="Send"
              onClick={() =>
                handleOptionSelected(ProposalsTypes.send_token, params.row)
              }
            />
          </div>,
          <div key="1" className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<CallReceivedIcon htmlColor="#9DABBD" />}
              label="Receive"
              onClick={handleQrModal}
            />
          </div>,
        ],
      },
    ],
    [],
  );

  const { tokenPrices } = useOrganizationInfoContext();

  return (
    <Box>
      sx=
      {{
        width: '100%',
      }}
      <h1 className="mb-5">Assets</h1>
      <DataGrid
        autoHeight
        rowHeight={65}
        rows={organizationTokens ?? []}
        columns={columns}
      />
      <ReceiveModal
        showQrFromSidebar={showQr}
        address={currentContract?.address}
        handleQr={handleQrModal}
      />
    </Box>
  );
};

export default AssetsPage;
