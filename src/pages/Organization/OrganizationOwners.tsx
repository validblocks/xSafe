import { useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { useDispatch, useSelector } from 'react-redux';
import { queryBoardMemberAddresses } from 'src/contracts/MultisigContract';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { RootState } from 'src/redux/store';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { AccountInfo, AddressBook, Owner } from './types';

const OrganizationsOwnersTable = () => {
  const [addresses, setAddresses] = useState<Array<Owner>>([]);

  const getAddresses = () => queryBoardMemberAddresses();

  // Set the address book
  // Test the address book and herotag
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);

  const addAddressBookEntry = (accountInformation: AccountInfo): Owner => ({
    address: accountInformation.address,
    ...(!!accountInformation.username && {
      herotag: accountInformation.username,
    }),
    ...(!!addressBook[accountInformation.address] && {
      name: addressBook[accountInformation.address],
    }),
  });
  useEffect(() => {
    // get herotag
    // get addressbook names
    getAddresses().then((ownerAddresses) => {
      Promise.all(
        ownerAddresses.map((address) =>
          ElrondApiProvider.getAccountData(new Address(address).bech32())),
      ).then((accountsInformation) => {
        setAddresses(accountsInformation.map(addAddressBookEntry));
      });
    });
  }, []);

  const dispatch = useDispatch();
  const onRemoveUser = (address: Address) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32(),
      }),
    );

  const onEditOwner = (owner: Owner) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.edit_owner,
        name: owner.name,
        address: new Address(owner.address).bech32(),
      }),
    );

  const onReplaceOwner = (owner: Owner) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.replace_owner,
        currentOwner: owner,
      }),
    );

  const onAddBoardMember = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_board_member,
      }),
    );

  const columns = useMemo(
    () => [
      {
        field: 'owner',
        headerName: 'Name',
        type: 'object',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className="d-flex flex-column justify-content-center">
            <strong className="mb-0">{params.value.name}</strong>
            <strong>
              <div>{params.value.herotag}</div>
            </strong>
          </div>
        ),
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
          <div className="d-flex align-items-center">
            <div>
              <Avatar>
                <div
                  dangerouslySetInnerHTML={{ __html: params.value.identicon }}
                />
              </Avatar>
              <div>
                {`${params.value.address.slice(
                  0,
                  10,
                )}...${params.value.address.slice(params.value.length - 10)}`}
              </div>
            </div>
          </div>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Action',
        // eslint-disable-next-line react/no-unstable-nested-components
        getActions: (params: any) => [
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => onRemoveUser(new Address(params.id))}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon />}
            label="Edit Owner"
            onClick={() =>
              onEditOwner(
                addresses.find(
                  (address) => address.address === params.id,
                ) as Owner,
              )}
          />,
        ],
      },
    ],
    [onRemoveUser, onEditOwner, onReplaceOwner],
  );

  const rows = addresses.map((owner: Owner) => ({
    id: owner.address,
    owner: { name: owner.name, herotag: owner.herotag },
    address: { address: owner.address, identicon: toSvg(owner.address, 100) },
  }));

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => onAddBoardMember()}
      >
        Add new owner
      </Button>

      <DataGrid autoHeight rowHeight={65} rows={rows} columns={columns} />
    </>
  );
};

export default OrganizationsOwnersTable;