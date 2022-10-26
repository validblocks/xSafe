import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Avatar } from '@mui/material';
import { GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { queryBoardMemberAddresses } from 'src/contracts/MultisigContract';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { RootState } from 'src/redux/store';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { AccountInfo, AddressBook, Owner } from './types';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';
import * as Styled from './styled';
import { useOwnerManipulationFunctions } from './utils';

const OrganizationsOwnersTable = () => {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [addresses, setAddresses] = useState<Array<Owner>>([]);
  const getAddresses = useCallback(() => queryBoardMemberAddresses(), []);
  const currentContract = useSelector(currentMultisigContractSelector);

  // Set the address book
  // Test the address book and herotag
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);

  const addAddressBookEntry = useCallback((accountInformation: AccountInfo): Owner => ({
    address: accountInformation.address,
    ...(!!accountInformation.username && {
      herotag: accountInformation.username,
    }),
    ...(!!addressBook[accountInformation.address] && {
      name: addressBook[accountInformation.address],
    }),
  }), [addressBook]);

  useEffect(() => {
    // get herotag
    // get addressbook names
    if (!currentContract?.address) return;
    getAddresses()
      .then((ownerAddresses) => {
        Promise.all(
          ownerAddresses.map((address) => ElrondApiProvider.getAccountData(new Address(address).bech32())),
        ).then((accountsInformation) => {
          setAddresses(accountsInformation.map(addAddressBookEntry));
        });
      });
  }, [addAddressBookEntry]);

  const {
    onRemoveUser,
    onEditOwner,
    onAddBoardMember,
  } = useOwnerManipulationFunctions();

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
              <Text>{params.value.herotag}</Text>
            </strong>
          </div>
        ),
      },
      {
        field: 'address',
        headerName: 'Address',
        width: 280,
        type: 'object',
        /**
         *
         * @todo: add style component for avatar
         */
        renderCell: (params: any) => (
          <div className="d-flex flex-row align-items-center">
            <Avatar>
              <div
                dangerouslySetInnerHTML={{ __html: params.value.identicon }}
              />
            </Avatar>
            <div>
              <Text fontSize={12} marginLeft={'10px !important'}>{truncateInTheMiddle(params.value.address, 12)}</Text>
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
            icon={<DeleteIcon sx={{ opacity: '0.54' }} />}
            disabled={isInReadOnlyMode}
            label="Delete"
            onClick={() => onRemoveUser(new Address(params.id))}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon sx={{ opacity: '0.54' }} />}
            disabled={isInReadOnlyMode}
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
    [isInReadOnlyMode, onRemoveUser, onEditOwner, addresses],
  );

  const rows = addresses.map((owner: Owner) => ({
    id: owner.address,
    owner: { name: owner.name, herotag: owner.herotag },
    address: { address: owner.address, identicon: toSvg(owner.address, 100) },
  }));

  return (
    <>
      <MainButton
        disabled={isInReadOnlyMode}
        onClick={() => onAddBoardMember()}
        sx={{ mb: '.9rem !important', boxShadow: 'none !important' }}
      >
        Add new owner
      </MainButton>

      <Styled.MainTable
        autoHeight
        rowHeight={65}
        rows={rows}
        columns={columns}
      />
    </>
  );
};

export default OrganizationsOwnersTable;
