/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from '@mui/material';
import { OrganizationToken } from 'src/pages/Organization/types';
import { useSelector } from 'react-redux';
import { TokenPresentationProps } from 'src/pages/MultisigDetails/ProposeMultiselectModal/ProposeSendToken';
import {
  getTokenPhotoById,
  accountSelector } from 'src/redux/selectors/accountSelector';
import useTokenPhoto from 'src/utils/useTokenPhoto';
import { StateType } from 'src/redux/slices/accountSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { useMemo } from 'react';

type TokenPresentationConfig = {
    withPhoto: boolean;
    withTokenAmount: boolean;
    withTokenValue: boolean;
    withPrice: boolean;
};

type TokenPresentationWithPriceProps = TokenPresentationProps & Partial<TokenPresentationConfig>;

const TokenPresentationWithPrice = ({
  identifier,
  withPhoto = true,
  withTokenAmount = true,
  withTokenValue = true,
  withPrice = true }: TokenPresentationWithPriceProps) => {
  const { tokenPhotoJSX } = useTokenPhoto(identifier);

  const selector = useMemo(
    () => createDeepEqualSelector(accountSelector, (state: StateType) => getTokenPhotoById(state, identifier)),
    [identifier]);

  const {
    prettyIdentifier,
    tokenPrice,
    tokenValue,
    tokenAmount,
  } = useSelector<StateType, OrganizationToken>(selector);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {withPhoto && (
        <Box>
          {tokenPhotoJSX}
        </Box>
        )}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        >
          <Box>
            ${prettyIdentifier}
          </Box>
          {withPrice && (
          <Typography variant="subtitle2">
            ${tokenPrice}
          </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
      >
        {withTokenAmount && (
        <Box>
          {tokenAmount}
        </Box>
        )}
        {withTokenValue && (
        <Box>
          ${tokenValue}
        </Box>
        )}
      </Box>
    </Box>
  );
};

export default TokenPresentationWithPrice;
