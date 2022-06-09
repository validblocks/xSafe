import React, { useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountData } from 'apiCalls/accountCalls';
import { queryBoardMemberAddresses } from 'contracts/MultisigContract';
import { addressBookSelector } from 'redux/selectors/addressBookSelector';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { RootState } from 'redux/store';
import { ProposalsTypes } from 'types/Proposals';
import { AccountInfo, AddressBook } from './types';

const OrganizationsTokensTable = () => {
  const [addresses, setAddresses] = useState<Array<OwnerRow>>([]);

  const getAddresses = async () => await queryBoardMemberAddresses();

  type OwnerRow = {
    address: Address;
    herotag?: string;
    name?: string;
  };

  // Set the address book
  // Test the address book and herotag
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);

  const addAddressBookEntry = (accountInformation: AccountInfo): OwnerRow => {
    return {
      address: accountInformation.address,
      ...(!!accountInformation.username && {
        herotag: accountInformation.username
      }),
      ...(!!addressBook[accountInformation.address] && {
        name: addressBook[accountInformation.address]
      })
    };
  };
  useEffect(() => {
    // get hero tag
    // get addressbook names
    getAddresses().then((ownerAddresses) => {
      Promise.all(
        ownerAddresses.map((address) =>
          getAccountData(new Address(address).bech32())
        )
      ).then((accountsInformation) => {
        setAddresses(accountsInformation.map(addAddressBookEntry));
      });
    });
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

  const onEditOnwer = (address: Address) => {
    return dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32()
      })
    );
  };

  const onReplaceOwner = (address: Address) => {
    return dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32()
      })
    );
  };

  const onAddBoardMember = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_board_member
      })
    );

  const columns = useMemo(
    () => [
      {
        field: 'owner',
        headerName: 'Name',
        type: 'object',
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <div className='d-flex flex-column justify-content-center'>
              <strong className='mb-0'>{params.value.name}</strong>
              <strong>
                <div>{params.value.herotag}</div>
              </strong>
            </div>
          );
        }
      },
      {
        field: 'address',
        headerName: 'Address',
        width: 250,
        type: 'object',
        /**
         *
         * @todo: add style component for avatar
         */
        renderCell: (params: any) => (
          <div className='d-flex align-items-center'>
            <div>
              <Avatar>
                <div
                  dangerouslySetInnerHTML={{ __html: params.value.identicon }}
                ></div>
              </Avatar>
              <div>
                {params.value.address.slice(0, 10) +
                  '...' +
                  params.value.address.slice(params.value.length - 10)}
                {/* <Ui.Trim text={params.value.valueHex} /> */}
              </div>
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
              <MenuItem disableRipple onClick={() => onEditOnwer}>
                <EditIcon />
                Edit Owner
              </MenuItem>
              <MenuItem disableRipple onClick={() => onReplaceOwner}>
                <PublishedWithChangesIcon />
                Replace Owner
              </MenuItem>
              <MenuItem
                disableRipple
                onClick={() => {
                  onRemoveUser(new Address(params.row.address.address));
                  handleClose();
                }}
              >
                <DeleteIcon />
                Remove Owner
              </MenuItem>
            </Menu>
          </>
        ]
      }
    ],
    [onRemoveUser]
  );

  const rows = addresses.map((owner: OwnerRow) => {
    return {
      id: owner.address,
      owner: { name: owner.name, herotag: owner.herotag },
      address: { address: owner.address, identicon: toSvg(owner.address, 100) }
    };
  });

  return (
    <>
      <div>
        <Button onClick={() => onAddBoardMember()}>Add new owner</Button>
      </div>
      <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />
    </>
  );
};

export default OrganizationsTokensTable;
