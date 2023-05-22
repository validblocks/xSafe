import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from '@multiversx/sdk-core/out';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { useSelector } from 'react-redux';
import { queryBoardMemberAddresses } from 'src/contracts/MultisigContract';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { RootState } from 'src/redux/store';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { MainButtonNoShadow } from 'src/components/Theme/StyledComponents';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { Box, useMediaQuery } from '@mui/material';
import noRowsOverlay from 'src/components/Utils/noRowsOverlay';
import CopyButton from 'src/components/CopyButton';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import SearchIcon from '@mui/icons-material/Search';
import { network } from 'src/config';
import { AccountInfo, AddressBook, Bech32Address, MultisigMember } from './types';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';
import * as Styled from './styled';
import { useOwnerManipulationFunctions } from './utils';
import MultisigMemberMobileCards from './utils/MultisigMemberMobileCards';

import * as StyledUtils from '../../components/Utils/styled/index';

const OrganizationsOwnersTable = () => {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [multisigMembers, setMultisigMembers] = useState<Array<MultisigMember>>([]);
  const getAddresses = useCallback(() => queryBoardMemberAddresses(), []);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);

  const addAddressBookEntry = useCallback((accountInformation: AccountInfo): MultisigMember => ({
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
          ownerAddresses.map((address) => MultiversxApiProvider.getAccountData(new Address(address).bech32())),
        ).then((accountsInformation) => {
          setMultisigMembers(accountsInformation.map(addAddressBookEntry));
        });
      });
  }, [addAddressBookEntry, getAddresses]);

  const {
    onRemoveMember,
    onEditMember,
    onAddBoardMember,
  } = useOwnerManipulationFunctions();

  const onEditMemberClick = useCallback((multisigMemberAddress: Bech32Address) => {
    const multisigMember = multisigMembers.find((address) => address.address === multisigMemberAddress);
    if (multisigMember) { onEditMember(multisigMember); }
  }, [multisigMembers, onEditMember]);

  const columns = useMemo(
    () => [
      {
        field: 'owner',
        headerName: 'Name',
        minWidth: 230,
        maxWidth: 290,
        type: 'object',
        renderCell: (params: GridRenderCellParams<MultisigMember>) => (
          <div className="d-flex flex-column justify-content-center">
            <strong className="mb-0">{params?.value?.name}</strong>
            <strong>
              <Text>{params?.value?.herotag}</Text>
            </strong>
          </div>
        ),
      },
      {
        field: 'address',
        headerName: 'Address',
        width: 280,
        type: 'object',
        renderCell: (params: GridRenderCellParams<MultisigMember>) => (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Box
                sx={{ borderRadius: '4px', overflow: 'hidden' }}
                dangerouslySetInnerHTML={{
                  __html: toSvg(params.value?.address, 20, { padding: 0 }),
                }}
              />
              <strong>
                {truncateInTheMiddle(params.value?.address ?? '', 10)}
              </strong>
            </Box>
            <Box display="flex" alignItems="center" >
              <Box sx={{ paddingLeft: 1 }}>
                <CopyButton link={StyledUtils.CopyIconLinkPurple} text={params.value?.address ?? ''} />
              </Box>
              <AnchorPurple
                href={`${
                  network.explorerAddress
                }/accounts/${params.value?.address}`}
                target="_blank"
                rel="noreferrer"
                className="ml-2"
              >
                <SearchIcon />
              </AnchorPurple>
            </Box>
          </Box>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Action',
        getActions: (params: GridRenderCellParams<MultisigMember>) => [
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon sx={{ opacity: '0.54' }} />}
            disabled={isInReadOnlyMode}
            label="Delete"
            onClick={() => onRemoveMember(new Address(params.row?.id ?? ''))}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon sx={{ opacity: '0.54' }} />}
            disabled={isInReadOnlyMode}
            label="Edit Owner"
            onClick={() => onEditMemberClick(params.row?.id ?? '')}
          />,
        ],
      },
    ],
    [isInReadOnlyMode, onRemoveMember, onEditMemberClick],
  );

  const rows = multisigMembers.map((owner: MultisigMember) => ({
    id: owner.address,
    owner: { name: owner.name, herotag: owner.herotag },
    address: { address: owner.address, identicon: toSvg(owner.address, 100) },
  }));

  return (
    <>
      <MainButtonNoShadow
        disabled={isInReadOnlyMode}
        onClick={() => onAddBoardMember()}
        onKeyDown={(e) => e.preventDefault()}
        onKeyUp={(e) => e.preventDefault()}
        sx={{ mb: '.9rem !important' }}
      >
        Add member
      </MainButtonNoShadow>

      {maxWidth600
        ? (
          <MultisigMemberMobileCards
            multisigMembers={multisigMembers}
          />
        )
        : (
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
