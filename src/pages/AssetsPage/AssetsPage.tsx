import React, { useCallback, useEffect, useMemo } from 'react';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams
} from '@mui/x-data-grid';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { network } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { TokenTableRowItem, TokenWithPrice } from 'pages/Organization/types';
import { organizationTokensSelector } from 'redux/selectors/accountSelector';
import { priceSelector } from 'redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import {
  setMultisigBalance,
  setOrganizationTokens
} from 'redux/slices/accountSlice';
import {
  setProposeModalSelectedOption,
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend
} from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const AssetsPage = () => {
  const egldPrice = useSelector(priceSelector);
  const dispatch = useDispatch();

  const openProposeSendTokenForm = useCallback(() => {
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.send_token
      })
    );
  }, []);

  const handleOptionSelected = (
    option: ProposalsTypes,
    token: TokenTableRowItem
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedTokenToSend({
        id: token.id,
        identifier: token.identifier,
        balance: token.balance
      })
    );
  };

  const getTokenPrice = useCallback(
    (tokenIdentifier: string) =>
      tokenPrices.find((tokenWithPrice: TokenWithPrice) => {
        return tokenWithPrice.symbol == tokenIdentifier;
      })?.price ?? egldPrice,
    []
  );

  const currentContract = useSelector(currentMultisigContractSelector);
  const proxy = getNetworkProxy();

  const organizationTokens = useSelector(organizationTokensSelector);

  useEffect(() => {
    let isMounted = true;

    if (!currentContract?.address)
      return () => {
        isMounted = false;
      };

    const getEgldBalancePromise = currentContract?.address
      ? proxy.getAccount(new Address(currentContract?.address))
      : {};

    const getAllOtherTokensPromise = axios.get(
      `${network.apiAddress}/accounts/${currentContract?.address}/tokens`
    );

    try {
      Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]).then(
        ([{ balance: egldBalance }, { data: otherTokens }]) => {
          if (!isMounted) return;

          dispatch(setMultisigBalance(JSON.stringify(egldBalance)));

          const allTokens = [
            { ...egldBalance.token, balance: egldBalance.value.toString() },
            ...otherTokens
          ];

          const tokensWithPrices = allTokens.map(
            (token: TokenTableRowItem, idx: number) => {
              const priceOfCurrentToken = getTokenPrice(token.identifier ?? '');

              const { owner, ...tokenWithoutOwner } = token;

              console.log(token.identifier);

              return {
                ...tokenWithoutOwner,
                id: idx,
                balanceDetails: {
                  identifier: token.identifier?.split('-')[0] ?? '',
                  amount: token.balance as string,
                  decimals: token.decimals as number
                },
                value: {
                  tokenPrice: priceOfCurrentToken,
                  decimals: token.decimals as number,
                  amount: token.balance as string
                }
              };
            }
          );

          dispatch(setOrganizationTokens(tokensWithPrices));
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, [currentContract]);

  const columns = useMemo(
    () => [
      {
        field: 'identifier',
        headerName: 'ASSET',
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className='d-flex flex-column justify-content-center'>
            <p className='mb-0'>{params.value.split('-')[0] ?? 'unknown'}</p>
          </div>
        )
      },
      {
        field: 'balanceDetails',
        headerName: 'BALANCE',
        width: 200,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <h6 className='text-center mb-0'>
            {Number(
              Number(
                operations.denominate({
                  input: params.value.amount,
                  denomination: params.value.decimals,
                  decimals: params.value.decimals,
                  showLastNonZeroDecimal: true
                })
              ).toFixed(8)
            )}{' '}
            ${params.value.identifier}
          </h6>
        )
      },
      {
        field: 'value',
        headerName: 'VALUE',
        width: 250,
        renderCell: (params: GridRenderCellParams<any>) => (
          <h5 className='ex-currency text-center mb-0'>
            <Ui.UsdValue
              amount={operations.denominate({
                input: params.value.amount,
                denomination: params.value.decimals,
                decimals: params.value.decimals,
                showLastNonZeroDecimal: true,
                addCommas: false
              })}
              usd={params.value.tokenPrice}
            />{' '}
          </h5>
        )
      },
      {
        field: 'actions',
        type: 'actions',
        width: 300,
        headerName: 'Quick Actions',
        getActions: (params: GridRenderCellParams) => [
          <div key='0' className='shadow-sm p-2 rounded mr-2'>
            <GridActionsCellItem
              icon={<CallMadeIcon htmlColor='#9DABBD' />}
              label='Send'
              onClick={() =>
                handleOptionSelected(ProposalsTypes.send_token, params.row)
              }
            ></GridActionsCellItem>
          </div>,
          <div key='1' className='shadow-sm p-2 rounded mr-2'>
            <GridActionsCellItem
              icon={<CallReceivedIcon htmlColor='#9DABBD' />}
              label='Receive'
              onClick={() => openProposeSendTokenForm()}
            />
          </div>
        ]
      }
    ],
    []
  );

  const { tokenPrices } = useOrganizationInfoContext();

  return (
    <Box
      sx={{
        padding: '8rem 1rem',
        width: '100%'
      }}
    >
      <h1 className='mb-5'>Assets</h1>
      <DataGrid
        autoHeight
        rowHeight={65}
        rows={organizationTokens ?? []}
        columns={columns}
      />
    </Box>
  );
};

export default AssetsPage;
