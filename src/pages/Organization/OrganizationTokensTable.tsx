import React, { useCallback, useMemo } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { GridRowId, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const OrganizationsTokensTable = () => {
  const dispatch = useDispatch();

  const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      // bottom: theme.spacing(2),
      // right: theme.spacing(2)
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      // top: theme.spacing(2),
      // left: theme.spacing(2)
    }
  }));

  const actions = [
    { icon: <DeleteIcon />, name: 'Edit Owner' },
    { icon: <DeleteIcon />, name: 'Replace Owner' },
    { icon: <DeleteIcon />, name: 'RemoveOwner' }
  ];

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
        field: 'name',
        headerName: 'Name',
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <div className='d-flex flex-column justify-content-center'>
              <strong className='mb-0'>{params.value}</strong>
            </div>
          );
        }
      },
      {
        field: 'address',
        headerName: 'Address',
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
        field: 'actions',
        type: 'actions',
        headerName: 'Action',
        getActions: (params: any) => [
          // eslint-disable-next-line react/jsx-key
          <div className='shadow-sm p-2 rounded mr-2'>
            <Box sx={{ position: 'relative', mt: 3, height: 320 }}>
              <StyledSpeedDial
                ariaLabel='Owner actions'
                icon={<SpeedDialIcon />}
                direction='right'
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                  />
                ))}
              </StyledSpeedDial>
            </Box>

            {/* <GridActionsCellItem
              icon={<MoreHorizIcon htmlColor='#9DABBD' />}
              label='Toggle Admin'
              onClick={toggleAdmin(params.id)}
            /> */}
          </div>
        ]
      }
    ],
    [onRemoveUser, toggleAdmin, duplicateUser]
  );

  const rows = [
    {
      id: 1,
      name: 'Nick',
      address: 'erd1vlj3u8k7h3ua2v6lxkgtn5jw2pu2t4zggxngf95eger0d2e7gwmqlf7a2a'
    }
  ];

  return <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />;
};

export default OrganizationsTokensTable;
