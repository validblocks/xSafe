import React, { useCallback, useMemo } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import {
  GridRowId,
  GridActionsCellItem,
  DataGrid,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';

const OrganizationsTokensTable = () => {
  const dispatch = useDispatch();
  const onRemoveUser = (address: Address) => {
    return dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32()
      })
    );
  };

  const toggleAdmin = useCallback(
    (id: GridRowId) => () => {
      // setRows((prevRows) =>
      //   prevRows.map((row) =>
      //     row.id === id ? { ...row, isAdmin: !row.isAdmin } : row
      //   )
      // );
    },
    []
  );

  const duplicateUser = useCallback(
    (id: GridRowId) => () => {
      // setRows((prevRows) => {
      //   const rowToDuplicate = prevRows.find((row) => row.id === id)!;
      //   return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      // });
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        field: 'tokenName',
        headerName: 'Token Name',
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className='d-flex flex-column justify-content-center'>
            <strong>SOMA</strong>
            <p className='mb-0'>{params.value}</p>
          </div>
        )
      },
      {
        field: 'holder',
        headerName: 'Holder',
        width: 250,
        type: 'string',
        renderCell: (params: any) => (
          <div className='d-flex align-items-center'>
            <img
              className='mr-3 rounded w-100 h-100'
              src='https://picsum.photos/30/30?random=1'
            />
            <div>
              <div>
                {params.value.slice(0, 10) +
                  '...' +
                  params.value.slice(params.value.length - 10)}
                {/* <Ui.Trim text={params.value.valueHex} /> */}
              </div>
              <div>@herotag</div>
            </div>
          </div>
        )
      },
      {
        field: 'amount',
        headerName: 'Amount',
        type: 'string',
        renderCell: (params: any) => (
          <div className='d-flex flex-column justify-content-center'>
            <strong>{params.value}</strong>
            <p className='mb-0'>${params.value}</p>
          </div>
        )
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Action',
        getActions: (params: any) => [
          // eslint-disable-next-line react/jsx-key
          <div className='shadow-sm p-2 rounded mr-2'>
            <GridActionsCellItem
              icon={<MoreHorizIcon htmlColor='#9DABBD' />}
              label='Toggle Admin'
              onClick={toggleAdmin(params.id)}
            />
          </div>
        ]
      }
    ],
    [onRemoveUser, toggleAdmin, duplicateUser]
  );

  const { allMemberAddresses } = useOrganizationInfoContext();
  const rows = [
    {
      id: 1,
      tokenName: 'EGLD',
      holder: 'erd1vlj3u8k7h3ua2v6lxkgtn5jw2pu2t4zggxngf95eger0d2e7gwmqlf7a2a',
      amount: '100'
    },
    {
      id: 2,
      tokenName: 'EGLD',
      holder: 'erd1vlj3u8k7h3ua2v6lxkgtn5jw2pu2t4zggxngf95eger0d2e7gwmqlf7a2a',
      amount: '100'
    },
    {
      id: 3,
      tokenName: 'EGLD',
      holder: 'erd1vlj3u8k7h3ua2v6lxkgtn5jw2pu2t4zggxngf95eger0d2e7gwmqlf7a2a',
      amount: '100'
    },
    {
      id: 4,
      tokenName: 'EGLD',
      holder: 'erd1vlj3u8k7h3ua2v6lxkgtn5jw2pu2t4zggxngf95eger0d2e7gwmqlf7a2a',
      amount: '100'
    }
  ];

  return <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />;
};

export default OrganizationsTokensTable;
