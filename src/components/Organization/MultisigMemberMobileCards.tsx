/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Address } from '@multiversx/sdk-core/out';
import { useCallback } from 'react';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { toSvg } from 'jdenticon';
import { CustomEditIcon } from 'src/components/Utils/CustomEditIcon';
import { CustomDeleteIcon } from 'src/components/Utils/CustomDeleteIcon';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import CopyButton from 'src/components/Utils/CopyButton';
import SearchIcon from '@mui/icons-material/Search';
import { network } from 'src/config';
import NoActionsOverlay from 'src/components/Utils/NoActionsOverlay';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { useOrganizationInfoContext } from '../Providers/OrganizationInfoContextProvider';
import * as Styled from '../../pages/Organization/styled/index';
import { useMemberManipulationFunctions } from '../../hooks/useMemberManipulationFunctions';
import { MultisigMember } from '../../types/organization';
import * as StyledUtils from '../Utils/styled/index';
import { uniqueId } from 'lodash';

interface IProps {
  multisigMembers: MultisigMember[];
}

export const MultisigMemberMobileCards = ({ multisigMembers }: IProps) => {
  const minWidth475 = useMediaQuery('(min-width:475px)');
  const minWidth530 = useMediaQuery('(min-width:530px)');
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const currentContract = useSelector(currentMultisigContractSelector);

  const { onRemoveMember, onEditMember } = useMemberManipulationFunctions();

  const onEditMemberClick = useCallback(
    (memberInfo: MultisigMember) => {
      onEditMember(memberInfo);
    },
    [onEditMember],
  );

  return (
    <Box>
      {multisigMembers.length === 0 &&
        new Array(10).fill(0).map(() => (
          <Box
            display={'flex'}
            flexDirection="column"
            height={92}
            mb="12px"
            key={uniqueId()}
          >
            <Skeleton
              width={'100%'}
              variant="rectangular"
              sx={{
                background: 'rgba(30, 29, 42, 0.4)',
                borderRadius: '10px',
                height: '100%',
              }}
            />
          </Box>
        ))}
      {currentContract?.address && currentContract?.address.length > 0 ? (
        multisigMembers.map((multisigMember: MultisigMember) => (
          <Styled.MobileCardOfMembers key={multisigMember.address}>
            <Styled.CategoryName>
              <Typography component="span">Name</Typography>
              <Typography fontWeight="600 !important" component="h6">
                {multisigMember.name}
              </Typography>
            </Styled.CategoryName>
            <Styled.CategoryName>
              <Typography component="span">Address</Typography>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginRight: '5px',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: toSvg(multisigMember.address, 20, { padding: 0 }),
                  }}
                />
                <Typography component="h6" className="mb-0 font-weight-normal">
                  {minWidth530
                    ? truncateInTheMiddle(multisigMember.address, 11)
                    : minWidth475
                    ? truncateInTheMiddle(multisigMember.address, 5)
                    : truncateInTheMiddle(multisigMember.address, 5)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box sx={{ ml: 1 }}>
                    <CopyButton
                      link={StyledUtils.CopyIconLinkPurple}
                      text={multisigMember.address}
                    />
                  </Box>
                  <Box sx={{ ml: 0.5 }}>
                    <AnchorPurple
                      href={`${network.explorerAddress}/accounts/${multisigMember.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2"
                    >
                      <SearchIcon />
                    </AnchorPurple>
                  </Box>
                </Box>
              </Box>
            </Styled.CategoryName>
            <Styled.CategoryName>
              <Typography
                component="span"
                textAlign="left"
                marginBottom="5px !important"
                paddingLeft={'4px'}
              >
                Actions
              </Typography>
              <Styled.ActionButtonsBoxMembers>
                <Button
                  startIcon={<CustomDeleteIcon />}
                  disabled={isInReadOnlyMode}
                  onClick={() =>
                    onRemoveMember(new Address(multisigMember.address))
                  }
                />
                <Button
                  startIcon={<CustomEditIcon />}
                  disabled={isInReadOnlyMode}
                  onClick={() => onEditMemberClick(multisigMember)}
                />
              </Styled.ActionButtonsBoxMembers>
            </Styled.CategoryName>
          </Styled.MobileCardOfMembers>
        ))
      ) : (
        <NoActionsOverlay message={'No safe available'} />
      )}
    </Box>
  );
};

export default MultisigMemberMobileCards;
