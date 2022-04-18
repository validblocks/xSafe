import React, { useEffect, useMemo } from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Box } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { denomination, decimals } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { priceSelector } from 'redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';

const AssetsPage = () => {
  const currentContract = useSelector(currentMultisigContractSelector);
  const egldPrice = useSelector(priceSelector);
  const {
    network: { egldLabel }
  } = useGetNetworkConfig();

  const columns = useMemo(
    () => [
      {
        field: 'asset',
        headerName: 'ASSET',
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className='d-flex flex-column justify-content-center'>
            <p className='mb-0'>{params.value}</p>
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
              input: params.value,
              denomination,
              decimals,
              showLastNonZeroDecimal: true
            })}{' '}
          </h6>
        )
      },
      {
        field: 'value',
        headerName: 'VALUE',
        type: 'string',
        renderCell: (params: any) => (
          <h5 className='ex-currency text-center mb-0'>
            <Ui.UsdValue
              amount={operations.denominate({
                input: params.value,
                denomination,
                decimals,
                showLastNonZeroDecimal: true,
                addCommas: false
              })}
              usd={egldPrice}
            />{' '}
          </h5>
        )
      }
    ],
    []
  );

  useEffect(() => {
    axios
      .get(`https://devnet-api.elrond.com/address/${currentContract?.address}`)
      .then(
        ({
          data: {
            data: {
              account: { balance }
            }
          }
        }) => {
          console.log({ balance });
        }
      );
  }, []);

  const { allMemberAddresses } = useOrganizationInfoContext();
  const rows = [
    {
      id: 1,
      asset: 'EGLD',
      balance: '3558932340000000000',
      value: '3558932340000000000'
    },
    {
      id: 2,
      asset: 'EGLD',
      balance: '3558932340000000000',
      value: '3558932340000000000'
    },
    {
      id: 3,
      asset: 'EGLD',
      balance: '3558932340000000000',
      value: '3558932340000000000'
    },
    {
      id: 4,
      asset: 'EGLD',
      balance: '3558932340000000000',
      value: '3558932340000000000'
    }
  ];

  return (
    <Box
      sx={{
        padding: '4rem'
      }}
    >
      <h1 className='mb-5'>Assets</h1>
      <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />
    </Box>
  );
};

export default AssetsPage;
