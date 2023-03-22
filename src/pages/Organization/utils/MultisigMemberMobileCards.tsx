/* eslint-disable no-nested-ternary */
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { Address } from '@multiversx/sdk-core/out';
import { useCallback } from 'react';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { toSvg } from 'jdenticon';
import { CustomEditIcon } from 'src/components/Utils/CustomEditIcon';
import { CustomDeleteIcon } from 'src/components/Utils/CustomDeleteIcon';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import CopyButton from 'src/components/CopyButton';
import SearchIcon from '@mui/icons-material/Search';
import { network } from 'src/config';
import NoActionsOverlay from 'src/pages/Transactions/utils/NoActionsOverlay';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { useOrganizationInfoContext } from '../OrganizationInfoContextProvider';
import * as Styled from '../styled/index';
import { useOwnerManipulationFunctions } from '.';
import { MultisigMember } from '../types';
import * as StyledUtils from '../../../components/Utils/styled/index';

interface IProps {
  multisigMembers: MultisigMember[];
}

export const MultisigMemberMobileCards = ({ multisigMembers }: IProps) => {
  const minWidth475 = useMediaQuery('(min-width:475px)');
  const minWidth530 = useMediaQuery('(min-width:530px)');
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const currentContract = useSelector(currentMultisigContractSelector);

  const {
    onRemoveMember,
    onEditMember,
  } = useOwnerManipulationFunctions();

  const onEditMemberClick = useCallback((memberInfo: MultisigMember) => {
    onEditMember(memberInfo);
  }, [onEditMember]);

  return (
    <Box>
      {currentContract?.address && currentContract?.address.length > 0
        ? multisigMembers.map((multisigMember: MultisigMember) => (
          <Styled.MobileCardOfMembers key={multisigMember.address}>
            <Styled.CategoryName>
              <Typography component="span">Name</Typography>
              <Typography fontWeight="600 !important" component="h6">{multisigMember.name}</Typography>
            </Styled.CategoryName>
            <Styled.CategoryName>
              <Typography component="span">Address</Typography>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{ borderRadius: '4px', overflow: 'hidden', marginRight: '5px' }}
                  dangerouslySetInnerHTML={{
                    __html: toSvg(multisigMember.address, 20, { padding: 0 }),
                  }}
                />
                <Typography component="h6" className="mb-0 font-weight-normal">
                  {minWidth530 ? truncateInTheMiddle(multisigMember.address, 11) :
                    minWidth475 ? truncateInTheMiddle(multisigMember.address, 5) :
                      truncateInTheMiddle(multisigMember.address, 5)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <CopyButton className="ml-2" link={StyledUtils.CopyIconLinkPurple} text={multisigMember.address} />
                  <AnchorPurple
                    href={`${
                      network.explorerAddress
                    }/accounts/${multisigMember.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2"
                  >
                    <SearchIcon />
                  </AnchorPurple>
                </Box>
              </Box>
            </Styled.CategoryName>
            <Styled.CategoryName>
              <Typography
                component="span"
                textAlign="left"
                marginBottom="5px !important"
                paddingLeft={'4px'}
              >Actions
              </Typography>
              <Styled.ActionButtonsBoxMembers>
                <Button
                  startIcon={<CustomDeleteIcon />}
                  disabled={isInReadOnlyMode}
                  onClick={() => onRemoveMember(new Address(multisigMember.address))}
                />
                <Button
                  startIcon={<CustomEditIcon />}
                  disabled={isInReadOnlyMode}
                  onClick={() => onEditMemberClick(multisigMember)}
                />
              </Styled.ActionButtonsBoxMembers>
            </Styled.CategoryName>
          </Styled.MobileCardOfMembers>
        )) : <NoActionsOverlay message={'No safe available'} />}
    </Box>
  );
};

export default MultisigMemberMobileCards;
