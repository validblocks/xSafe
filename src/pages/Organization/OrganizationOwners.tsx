import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { queryBoardMemberAddresses } from 'src/contracts/MultisigContract';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { RootState } from 'src/redux/store';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { MainButtonNoShadow } from 'src/components/Theme/StyledComponents';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { Button, useMediaQuery } from '@mui/material';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { AccountInfo, AddressBook, Owner } from './types';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';
import * as Styled from './styled';
import { useOwnerManipulationFunctions } from './utils';
import MobileCardsForTableReplacementMemebers from './utils/MobileCardsForTableReplacementMemebers';

const OrganizationsOwnersTable = () => {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [addresses, setAddresses] = useState<Array<Owner>>([]);
  const getAddresses = useCallback(() => queryBoardMemberAddresses(), []);
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

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
        minWidth: 230,
        maxWidth: 290,
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
            <strong>
              {truncateInTheMiddle(params.value.address, 17)}
            </strong>
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

  const noRowsOverlay = () => (
    <Styled.NoRowsOverlay>
      <span>No Rows</span>
    </Styled.NoRowsOverlay>
  );

  const getMobileActions = (params: any) => [
    <Button
      key={params.id}
      startIcon={(
        <DeleteIcon sx={{
          // eslint-disable-next-line no-nested-ternary
          color: isInReadOnlyMode ? isDarkThemeEnabled ? '#eeeeee8a' : '#08041D8a' : '#4c2ffc',
        }}
        />
)}
      disabled={isInReadOnlyMode}
      onClick={() => onRemoveUser(new Address(params.id))}
    />,
    <Button
      key={params.id}
      startIcon={(
        <EditIcon sx={{
          // eslint-disable-next-line no-nested-ternary
          color: isDarkThemeEnabled ? isInReadOnlyMode ? '#eeeeee8a' : '#4c2ffc' : '#08041D8a',
        }}
        />
)}
      disabled={isInReadOnlyMode}
      onClick={() =>
        onEditOwner(
                addresses.find(
                  (address) => address.address === params.id,
                ) as Owner,
        )}
    />,
  ];

  return (
    <>
      <MainButtonNoShadow
        disabled={isInReadOnlyMode}
        onClick={() => onAddBoardMember()}
        sx={{ mb: '.9rem !important' }}
      >
        Add member
      </MainButtonNoShadow>

      {maxWidth600 ? <MobileCardsForTableReplacementMemebers items={addresses} action={getMobileActions(addresses)} /> : (
        <Styled.MainTable
          autoHeight
          rowHeight={65}
          rows={rows}
          columns={columns}
          components={{ NoRowsOverlay: noRowsOverlay }}
        />
      )}
    </>
  );
};

export default OrganizationsOwnersTable;
