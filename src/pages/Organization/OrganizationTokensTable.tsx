import React, { useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountData } from 'apiCalls/accountCalls';
import { queryBoardMemberAddresses } from 'contracts/MultisigContract';
import { addressBookSelector } from 'redux/selectors/addressBookSelector';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { RootState } from 'redux/store';
import { ProposalsTypes } from 'types/Proposals';
import { Owner, AccountInfo, AddressBook } from './types';

const OrganizationsTokensTable = () => {
  const [addresses, setAddresses] = useState<Array<Owner>>([]);

  const getAddresses = async () => await queryBoardMemberAddresses();

  // Set the address book
  // Test the address book and herotag
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);

  const addAddressBookEntry = (accountInformation: AccountInfo): Owner => {
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

  const onEditOwner = (owner: Owner) => {
    return dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.edit_owner,
        name: owner.name,
        address: new Address(owner.address).bech32()
      })
    );
  };

  const onReplaceOwner = (owner: Owner) => {
    return dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.replace_owner,
        currentOwner: owner
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
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={() => onRemoveUser(new Address(params.id))}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon />}
            label='Edit Owner'
            onClick={() =>
              onEditOwner(
                addresses.find(
                  (address) => address.address === params.id
                ) as Owner
              )
            }
            showInMenu
          />
          // <GridActionsCellItem
          //   key={params.id}
          //   icon={<AutorenewIcon />}
          //   label='Replace Owner'
          //   onClick={() =>
          //     onReplaceOwner(
          //       addresses.find(
          //         (address) => address.address === params.id
          //       ) as Owner
          //     )
          //   }
          //   showInMenu
          // />
        ]
      }
    ],
    [onRemoveUser, onEditOwner, onReplaceOwner]
  );

  const rows = addresses.map((owner: Owner) => {
    return {
      id: owner.address,
      owner: { name: owner.name, herotag: owner.herotag },
      address: { address: owner.address, identicon: toSvg(owner.address, 100) }
    };
  });

  return (
    <>
      <Button
        color='primary'
        startIcon={<AddIcon />}
        onClick={() => onAddBoardMember()}
      >
        Add new owner
      </Button>

      <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />
    </>
  );
};

export default OrganizationsTokensTable;
