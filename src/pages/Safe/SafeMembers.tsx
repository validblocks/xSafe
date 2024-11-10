import { useCallback, useMemo } from 'react';
import { Address } from '@multiversx/sdk-core/out';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { toSvg } from 'jdenticon';
import { Box, useMediaQuery } from '@mui/material';
import { network } from 'src/config';
import { MainButtonNoShadow } from 'src/components/Theme/StyledComponents';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import noRowsOverlay from 'src/components/Utils/noRowsOverlay';
import CopyButton from 'src/components/Utils/CopyButton';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import SearchIcon from '@mui/icons-material/Search';
import { useOrganizationInfoContext } from '../../components/Providers/OrganizationInfoContextProvider';
import * as Styled from './styled';
import { useMemberManipulationFunctions } from '../../hooks/useMemberManipulationFunctions';
import MultisigMemberMobileCards from '../../components/Organization/MultisigMemberMobileCards';
import * as StyledUtils from '../../components/Utils/styled/index';
import { useMultisigMembers } from '../../hooks/useMultisigMembers';
import { MultisigMember } from 'src/types/organization';

const OrganizationMembers = () => {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const multisigMembers = useMultisigMembers();
  const isOnMobile = useMediaQuery('(max-width:600px)');

  const { onRemoveMember, onEditMember, onAddBoardMember } =
    useMemberManipulationFunctions();

  const onEditMemberClick = useCallback(
    (multisigMemberAddress: string) => {
      const multisigMember = multisigMembers.find(
        (member) => member.address === multisigMemberAddress,
      );
      if (multisigMember) {
        onEditMember(multisigMember);
      }
    },
    [multisigMembers, onEditMember],
  );

  const columns = useMemo(
    () => [
      {
        field: 'member',
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
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
            <Box display="flex" alignItems="center">
              <Box sx={{ paddingLeft: 1 }}>
                <CopyButton
                  link={StyledUtils.CopyIconLinkPurple}
                  text={params.value?.address ?? ''}
                />
              </Box>
              <AnchorPurple
                href={`${network.explorerAddress}/accounts/${params.value?.address}`}
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
            placeholder=""
            showInMenu
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon sx={{ opacity: '0.54' }} />}
            disabled={isInReadOnlyMode}
            label="Edit Owner"
            onClick={() => onEditMemberClick(params.row?.id ?? '')}
            placeholder=""
            showInMenu
          />,
        ],
      },
    ],
    [isInReadOnlyMode, onRemoveMember, onEditMemberClick],
  );

  const rows = useMemo(
    () =>
      multisigMembers.map(({ address, name, herotag }: MultisigMember) => ({
        id: address,
        member: { name, herotag },
        address: {
          address: address,
          identicon: toSvg(address, 100),
        },
      })),
    [multisigMembers],
  );

  return (
    <Box paddingBottom="55px">
      <MainButtonNoShadow
        disabled={isInReadOnlyMode}
        onClick={() => onAddBoardMember()}
        onKeyDown={(e) => e.preventDefault()}
        onKeyUp={(e) => e.preventDefault()}
        sx={{ mb: '.9rem !important' }}
      >
        Add member
      </MainButtonNoShadow>

      {isOnMobile ? (
        <MultisigMemberMobileCards multisigMembers={multisigMembers} />
      ) : (
        <Styled.MainTable
          autoHeight
          rowHeight={65}
          rows={rows}
          columns={columns}
          components={{ NoRowsOverlay: noRowsOverlay }}
        />
      )}
    </Box>
  );
};

export default OrganizationMembers;
