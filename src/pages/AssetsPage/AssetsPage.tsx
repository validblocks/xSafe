import React, { useMemo } from 'react';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { priceSelector } from 'redux/selectors/economicsSelector';
import {
  setProposeModalSelectedOption,
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend
} from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const AssetsPage = () => {
  const egldPrice = useSelector(priceSelector);
  const dispatch = useDispatch();

  const openProposeSendTokenForm = (token: any) => {
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.send_token
      })
    );
  };

  const handleOptionSelected = (option: ProposalsTypes, token: any) => {
    console.log({ token });
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedTokenToSend({
        id: token.id,
        identifier: token.identifier,
        balance: token.balance
      })
    );
  };

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
        field: 'balance',
        headerName: 'BALANCE',
        width: 300,
        type: 'string',
        renderCell: (params: any) => (
          <h6 className='text-center mb-0'>
            {operations.denominate({
              input: params.value.amount,
              denomination: params.value.decimals,
              decimals: params.value.decimals,
              showLastNonZeroDecimal: true
            })}{' '}
          </h6>
        )
      },
      {
        field: 'value',
        headerName: 'VALUE',
        width: 250,
        type: 'any',
        renderCell: (params: any) => (
          <h5 className='ex-currency text-center mb-0'>
            <Ui.UsdValue
              amount={operations.denominate({
                input: params.value.amount,
                denomination: params.value.decimals,
                decimals: params.value.decimals,
                showLastNonZeroDecimal: true,
                addCommas: false
              })}
              usd={egldPrice}
            />{' '}
          </h5>
        )
      },
      {
        field: 'actions',
        type: 'actions',
        width: 300,
        headerName: 'Quick Actions',
        getActions: (params: any) => [
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
              onClick={() => openProposeSendTokenForm(params.value)}
            />
          </div>
        ]
      }
    ],
    []
  );

  const { tokensState: rows } = useOrganizationInfoContext();

  return (
    <Box
      sx={{
        padding: '8rem 1rem',
        width: '100%'
      }}
    >
      <h1 className='mb-5'>Assets</h1>
      <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />
    </Box>
  );
};

export default AssetsPage;
