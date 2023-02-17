/* eslint-disable no-nested-ternary */
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { Address } from '@multiversx/sdk-core/out';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { toSvg } from 'jdenticon';
import { useOrganizationInfoContext } from '../OrganizationInfoContextProvider';
import * as Styled from '../styled/index';
import { useOwnerManipulationFunctions } from '.';
import { MultisigMember } from '../types';

interface IProps {
  multisigMembers: MultisigMember[];
}

export const MobileCardsForTableReplacement = ({ multisigMembers }: IProps) => {
  const minWidth475 = useMediaQuery('(min-width:475px)');
  const minWidth530 = useMediaQuery('(min-width:530px)');
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const { isInReadOnlyMode } = useOrganizationInfoContext();

  const {
    onRemoveMember,
    onEditMember,
  } = useOwnerManipulationFunctions();

  const onEditMemberClick = useCallback((memberInfo: MultisigMember) => {
    onEditMember(memberInfo);
  }, [onEditMember]);

  return (
    <Box>
      {multisigMembers.map((multisigMember: MultisigMember) => (
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
                {minWidth530 ? truncateInTheMiddle(multisigMember.address, 14) :
                  minWidth475 ? truncateInTheMiddle(multisigMember.address, 11) :
                    truncateInTheMiddle(multisigMember.address, 8)}
              </Typography>
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
                startIcon={(
                  <DeleteIcon sx={{
                  // eslint-disable-next-line no-nested-ternary
                    color: isInReadOnlyMode ? isDarkThemeEnabled ? '#eeeeee8a' : '#08041D8a' : '#4c2ffc',
                  }}
                  />
)}
                disabled={isInReadOnlyMode}
                onClick={() => onRemoveMember(new Address(multisigMember.address))}
              />
              <Button
                startIcon={(
                  <EditIcon sx={{
                  // eslint-disable-next-line no-nested-ternary
                    color: isDarkThemeEnabled ? isInReadOnlyMode ? '#eeeeee8a' : '#4c2ffc' : '#08041D8a',
                  }}
                  />
)}
                disabled={isInReadOnlyMode}
                onClick={() => onEditMemberClick(multisigMember)}
              />
            </Styled.ActionButtonsBoxMembers>
          </Styled.CategoryName>
        </Styled.MobileCardOfMembers>
      ))}
    </Box>
  );
};

export default MobileCardsForTableReplacement;
