import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GridRowId, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { queryBoardMemberAddresses } from 'contracts/MultisigContract';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const OrganizationsTokensTable = () => {
  const [addresses, setAddresses] = useState<Array<Address>>([]);

  const getAddresses = async () => await queryBoardMemberAddresses();

  useEffect(() => {
    getAddresses().then(setAddresses);
  }, []);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <>
            <Button
              disableRipple
              id='basic-button'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem disableRipple onClick={handleClose}>
                <EditIcon />
                Edit Owner
              </MenuItem>
              <MenuItem disableRipple onClick={handleClose}>
                <PublishedWithChangesIcon />
                Replace Owner
              </MenuItem>
              <MenuItem disableRipple onClick={handleClose}>
                <DeleteIcon />
                Remove Owner
              </MenuItem>
            </Menu>
          </>
        ]
      }
    ],
    [onRemoveUser, toggleAdmin, duplicateUser]
  );

  const rows = addresses.map((address: Address) => ({
    id: 1,
    name: 'Nick',
    address: address.hex()
  }));
  console.log(getAddresses());
  return <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />;
};

export default OrganizationsTokensTable;
